import { and, desc, eq, isNotNull, ne } from "drizzle-orm"

import { db } from "@/lib/db"
import {
  monitorEvents,
  monitorPings,
  monitors,
  notificationChannels,
  type Monitor,
  type MonitorEventType,
  type MonitorStatus,
  type NewMonitor,
  type NotificationChannels,
} from "@/lib/db/schema/monitors"

import { applyPing, deriveTimedStatus } from "./status"
import { generatePingToken, hashPingToken } from "./token"
import type { UpdateMonitorInput } from "./schemas"

export async function addEvent(
  monitorId: string,
  e: {
    type: MonitorEventType
    fromStatus?: MonitorStatus | null
    toStatus?: MonitorStatus | null
    message?: string
  },
) {
  await db.insert(monitorEvents).values({
    monitorId,
    type: e.type,
    fromStatus: e.fromStatus ?? null,
    toStatus: e.toStatus ?? null,
    message: e.message ?? null,
  })
}

export async function createMonitor(input: {
  userId: string
  name: string
  intervalSeconds: number
  graceSeconds: number
}): Promise<{ monitor: Monitor; token: string }> {
  const { token, tokenHash, tokenPrefix } = generatePingToken()
  const [monitor] = await db
    .insert(monitors)
    .values({
      userId: input.userId,
      name: input.name,
      kind: "heartbeat",
      tokenHash,
      tokenPrefix,
      intervalSeconds: input.intervalSeconds,
      graceSeconds: input.graceSeconds,
      status: "pending",
    })
    .returning()
  await addEvent(monitor.id, {
    type: "created",
    toStatus: "pending",
    message: `Monitor "${input.name}" created`,
  })
  return { monitor, token }
}

export async function listMonitors(userId: string): Promise<Monitor[]> {
  return db
    .select()
    .from(monitors)
    .where(eq(monitors.userId, userId))
    .orderBy(desc(monitors.createdAt))
}

export async function getMonitorForUser(
  userId: string,
  id: string,
): Promise<Monitor | null> {
  const [monitor] = await db
    .select()
    .from(monitors)
    .where(and(eq(monitors.id, id), eq(monitors.userId, userId)))
  return monitor ?? null
}

export async function getMonitorDetail(userId: string, id: string) {
  const monitor = await getMonitorForUser(userId, id)
  if (!monitor) return null
  const [events, pings] = await Promise.all([
    db
      .select()
      .from(monitorEvents)
      .where(eq(monitorEvents.monitorId, id))
      .orderBy(desc(monitorEvents.createdAt))
      .limit(20),
    db
      .select()
      .from(monitorPings)
      .where(eq(monitorPings.monitorId, id))
      .orderBy(desc(monitorPings.receivedAt))
      .limit(20),
  ])
  return { monitor, events, pings }
}

export async function updateMonitor(
  userId: string,
  id: string,
  patch: UpdateMonitorInput,
): Promise<Monitor | null> {
  const monitor = await getMonitorForUser(userId, id)
  if (!monitor) return null

  const now = new Date()
  const updates: Partial<NewMonitor> = { updatedAt: now }
  if (patch.name !== undefined) updates.name = patch.name
  if (patch.interval_seconds !== undefined)
    updates.intervalSeconds = patch.interval_seconds
  if (patch.grace_seconds !== undefined)
    updates.graceSeconds = patch.grace_seconds

  const events: {
    type: MonitorEventType
    fromStatus: MonitorStatus
    toStatus: MonitorStatus
    message: string
  }[] = []

  if (patch.paused === true && monitor.status !== "paused") {
    updates.status = "paused"
    events.push({
      type: "paused",
      fromStatus: monitor.status,
      toStatus: "paused",
      message: "Monitor paused",
    })
  } else if (patch.paused === false && monitor.status === "paused") {
    const interval = updates.intervalSeconds ?? monitor.intervalSeconds
    const grace = updates.graceSeconds ?? monitor.graceSeconds
    const resumed: MonitorStatus = monitor.lastPingAt
      ? deriveTimedStatus(
          { lastPingAt: monitor.lastPingAt, intervalSeconds: interval, graceSeconds: grace },
          now,
        )
      : "pending"
    updates.status = resumed
    updates.downSince = resumed === "down" ? now : null
    events.push({
      type: "resumed",
      fromStatus: "paused",
      toStatus: resumed,
      message: "Monitor resumed",
    })
  }

  const [updated] = await db.transaction(async (tx) => {
    const rows = await tx
      .update(monitors)
      .set(updates)
      .where(eq(monitors.id, id))
      .returning()
    for (const e of events) {
      await tx.insert(monitorEvents).values({
        monitorId: id,
        type: e.type,
        fromStatus: e.fromStatus,
        toStatus: e.toStatus,
        message: e.message,
      })
    }
    return rows
  })
  return updated
}

export async function rotateToken(
  userId: string,
  id: string,
): Promise<{ monitor: Monitor; token: string } | null> {
  const monitor = await getMonitorForUser(userId, id)
  if (!monitor) return null
  const { token, tokenHash, tokenPrefix } = generatePingToken()
  const [updated] = await db
    .update(monitors)
    .set({ tokenHash, tokenPrefix, updatedAt: new Date() })
    .where(eq(monitors.id, id))
    .returning()
  await addEvent(id, {
    type: "token_rotated",
    message: "Ping token rotated; the previous URL no longer works",
  })
  return { monitor: updated, token }
}

export type ChannelUpdate = {
  discordWebhookUrl?: string | null
  googleChatWebhookUrl?: string | null
  webhookUrl?: string | null
}

export async function getNotificationChannels(
  userId: string,
): Promise<NotificationChannels | null> {
  const [row] = await db
    .select()
    .from(notificationChannels)
    .where(eq(notificationChannels.userId, userId))
  return row ?? null
}

export async function upsertNotificationChannels(
  userId: string,
  data: ChannelUpdate,
): Promise<NotificationChannels> {
  const now = new Date()
  const set: Partial<typeof notificationChannels.$inferInsert> = {
    updatedAt: now,
  }
  if (data.discordWebhookUrl !== undefined)
    set.discordWebhookUrl = data.discordWebhookUrl
  if (data.googleChatWebhookUrl !== undefined)
    set.googleChatWebhookUrl = data.googleChatWebhookUrl
  if (data.webhookUrl !== undefined) set.webhookUrl = data.webhookUrl

  const [row] = await db
    .insert(notificationChannels)
    .values({
      userId,
      discordWebhookUrl: data.discordWebhookUrl ?? null,
      googleChatWebhookUrl: data.googleChatWebhookUrl ?? null,
      webhookUrl: data.webhookUrl ?? null,
    })
    .onConflictDoUpdate({ target: notificationChannels.userId, set })
    .returning()
  return row
}

/**
 * Monitors the background evaluator should check: not paused, and pinged at
 * least once (a never-pinged monitor stays pending and never alerts).
 */
export async function getMonitorsForEvaluation(): Promise<Monitor[]> {
  return db
    .select()
    .from(monitors)
    .where(and(ne(monitors.status, "paused"), isNotNull(monitors.lastPingAt)))
}

export async function findMonitorByToken(
  token: string,
): Promise<Monitor | null> {
  const [monitor] = await db
    .select()
    .from(monitors)
    .where(eq(monitors.tokenHash, hashPingToken(token)))
  return monitor ?? null
}

/**
 * Record an accepted ping: persist the ping row, update last_ping_at, and apply
 * the status transition (→ up, or stay paused). Recovery alerts are dispatched
 * by the caller using the returned `fireRecoveryAlert` flag.
 */
export async function recordPing(
  monitor: Monitor,
  meta: { remoteIp: string | null; userAgent: string | null },
): Promise<{ monitor: Monitor; fireRecoveryAlert: boolean }> {
  const now = new Date()
  const { nextStatus, fireRecoveryAlert } = applyPing(monitor.status)
  const changed = nextStatus !== monitor.status
  const downSince = nextStatus === "paused" ? monitor.downSince : null

  await db.transaction(async (tx) => {
    await tx
      .update(monitors)
      .set({ lastPingAt: now, status: nextStatus, downSince, updatedAt: now })
      .where(eq(monitors.id, monitor.id))
    await tx.insert(monitorPings).values({
      monitorId: monitor.id,
      receivedAt: now,
      remoteIp: meta.remoteIp,
      userAgent: meta.userAgent,
    })
    if (changed) {
      await tx.insert(monitorEvents).values({
        monitorId: monitor.id,
        type: "status_changed",
        fromStatus: monitor.status,
        toStatus: nextStatus,
        message: `Ping received: ${monitor.status} → ${nextStatus}`,
      })
    }
  })

  return {
    monitor: { ...monitor, lastPingAt: now, status: nextStatus, downSince, updatedAt: now },
    fireRecoveryAlert,
  }
}
