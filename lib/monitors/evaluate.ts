import { and, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import {
  monitorEvents,
  monitors,
  type Monitor,
  type NewMonitor,
} from "@/lib/db/schema/monitors"
import { notifyDown } from "@/lib/notifications"

import { getMonitorsForEvaluation } from "./service"
import { evaluateMonitor } from "./status"

export type EvaluationSummary = {
  checked: number
  transitioned: number
  downAlerts: number
}

/**
 * Background job: evaluate every active monitor against the timing model,
 * persist status transitions, and fire a down alert exactly once per outage.
 * Idempotent — running it repeatedly does not duplicate alerts.
 */
export async function runEvaluation(
  now: Date = new Date(),
): Promise<EvaluationSummary> {
  const list = await getMonitorsForEvaluation()
  let transitioned = 0
  let downAlerts = 0

  for (const m of list) {
    const decision = evaluateMonitor(
      {
        status: m.status,
        lastPingAt: m.lastPingAt,
        intervalSeconds: m.intervalSeconds,
        graceSeconds: m.graceSeconds,
      },
      now,
    )

    if (!decision.changed) {
      await db
        .update(monitors)
        .set({ lastCheckedAt: now })
        .where(eq(monitors.id, m.id))
      // Retry a down alert that was never successfully delivered for the
      // current outage (e.g. the first notifyDown threw after the transition).
      if (decision.nextStatus === "down" && needsDownRetry(m)) {
        downAlerts += 1
        await notifyDown(m)
      }
      continue
    }

    const set: Partial<NewMonitor> = {
      status: decision.nextStatus,
      lastCheckedAt: now,
      updatedAt: now,
    }
    if (decision.setDownSince) set.downSince = now
    if (decision.clearDownSince) set.downSince = null

    // Only transition if the row still matches the snapshot we evaluated. A ping
    // (or an overlapping run) that changed status/last_ping_at in the meantime
    // wins, and we skip — so a fresh ping is never clobbered and overlapping
    // runs don't double-fire.
    const applied = await db.transaction(async (tx) => {
      const rows = await tx
        .update(monitors)
        .set(set)
        .where(
          and(
            eq(monitors.id, m.id),
            eq(monitors.status, m.status),
            eq(monitors.lastPingAt, m.lastPingAt as Date),
          ),
        )
        .returning({ id: monitors.id })
      if (rows.length === 0) return false
      await tx.insert(monitorEvents).values({
        monitorId: m.id,
        type: "status_changed",
        fromStatus: m.status,
        toStatus: decision.nextStatus,
        message: `Evaluator: ${m.status} → ${decision.nextStatus}`,
      })
      return true
    })
    if (!applied) continue
    transitioned += 1

    if (decision.fireDownAlert) {
      downAlerts += 1
      await notifyDown({
        ...m,
        status: decision.nextStatus,
        downSince: decision.setDownSince ? now : m.downSince,
      })
    }
  }

  return { checked: list.length, transitioned, downAlerts }
}

// True when a monitor is down but the down alert for the current outage was
// never successfully delivered (notifyDown sets last_alerted_at on success).
function needsDownRetry(m: Monitor): boolean {
  if (!m.downSince) return false
  return m.lastAlertedAt === null || m.lastAlertedAt < m.downSince
}
