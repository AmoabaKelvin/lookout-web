import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

import { user } from "./auth"

// Heartbeat monitor statuses. See PRD "Monitor States".
export const MONITOR_STATUSES = [
  "pending",
  "up",
  "late",
  "down",
  "paused",
] as const
export type MonitorStatus = (typeof MONITOR_STATUSES)[number]

export const MONITOR_EVENT_TYPES = [
  "created",
  "ping_received",
  "status_changed",
  "alert_sent",
  "paused",
  "resumed",
  "token_rotated",
] as const
export type MonitorEventType = (typeof MONITOR_EVENT_TYPES)[number]

export const monitors = sqliteTable(
  "monitors",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    kind: text("kind").notNull().default("heartbeat"),
    // Only a hash of the ping token is stored; the raw token is shown once.
    tokenHash: text("token_hash").notNull().unique(),
    tokenPrefix: text("token_prefix").notNull(),
    intervalSeconds: integer("interval_seconds").notNull().default(60),
    graceSeconds: integer("grace_seconds").notNull().default(120),
    status: text("status", { enum: MONITOR_STATUSES })
      .notNull()
      .default("pending"),
    lastPingAt: integer("last_ping_at", { mode: "timestamp" }),
    lastCheckedAt: integer("last_checked_at", { mode: "timestamp" }),
    downSince: integer("down_since", { mode: "timestamp" }),
    lastAlertedAt: integer("last_alerted_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (t) => [
    index("monitors_user_id_idx").on(t.userId),
    // The evaluator scans active (non-paused) monitors that have pinged.
    index("monitors_status_idx").on(t.status),
  ],
)

// Optional ping history (PRD: useful for charts/debugging, short retention).
export const monitorPings = sqliteTable(
  "monitor_pings",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    monitorId: text("monitor_id")
      .notNull()
      .references(() => monitors.id, { onDelete: "cascade" }),
    receivedAt: integer("received_at", { mode: "timestamp" })
      .$defaultFn(() => new Date())
      .notNull(),
    remoteIp: text("remote_ip"),
    userAgent: text("user_agent"),
  },
  (t) => [index("monitor_pings_monitor_id_idx").on(t.monitorId, t.receivedAt)],
)

// Audit history / activity feed.
export const monitorEvents = sqliteTable(
  "monitor_events",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    monitorId: text("monitor_id")
      .notNull()
      .references(() => monitors.id, { onDelete: "cascade" }),
    type: text("type", { enum: MONITOR_EVENT_TYPES }).notNull(),
    fromStatus: text("from_status", { enum: MONITOR_STATUSES }),
    toStatus: text("to_status", { enum: MONITOR_STATUSES }),
    message: text("message"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (t) => [index("monitor_events_monitor_id_idx").on(t.monitorId, t.createdAt)],
)

// Per-user notification destinations. The hosted app sends down/recovery
// alerts (the agent's own webhooks are useless when the box is down), so we
// store the user's channels here. Mirrors the agent's Discord/Google Chat
// support, plus a generic webhook. Per-monitor overrides are deferred (PRD).
export const notificationChannels = sqliteTable("notification_channels", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  discordWebhookUrl: text("discord_webhook_url"),
  googleChatWebhookUrl: text("google_chat_webhook_url"),
  webhookUrl: text("webhook_url"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
})

export type Monitor = typeof monitors.$inferSelect
export type NewMonitor = typeof monitors.$inferInsert
export type MonitorEvent = typeof monitorEvents.$inferSelect
export type MonitorPing = typeof monitorPings.$inferSelect
export type NotificationChannels = typeof notificationChannels.$inferSelect
