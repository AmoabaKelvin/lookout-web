import type {
  Monitor,
  MonitorEvent,
  MonitorPing,
  NotificationChannels,
} from "@/lib/db/schema/monitors"

export function pingUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  return `${base.replace(/\/$/, "")}/ping/${token}`
}

// snake_case output to match the PRD's documented API contract. The raw ping
// URL is only included right after create/rotate (when the token is known).
export function serializeMonitor(m: Monitor, opts?: { token?: string }) {
  return {
    id: m.id,
    name: m.name,
    kind: m.kind,
    status: m.status,
    interval_seconds: m.intervalSeconds,
    grace_seconds: m.graceSeconds,
    token_prefix: m.tokenPrefix,
    last_ping_at: m.lastPingAt?.toISOString() ?? null,
    down_since: m.downSince?.toISOString() ?? null,
    last_alerted_at: m.lastAlertedAt?.toISOString() ?? null,
    created_at: m.createdAt.toISOString(),
    updated_at: m.updatedAt.toISOString(),
    ...(opts?.token ? { ping_url: pingUrl(opts.token) } : {}),
  }
}

export function serializeEvent(e: MonitorEvent) {
  return {
    id: e.id,
    type: e.type,
    from_status: e.fromStatus,
    to_status: e.toStatus,
    message: e.message,
    created_at: e.createdAt.toISOString(),
  }
}

export function serializePing(p: MonitorPing) {
  return {
    id: p.id,
    received_at: p.receivedAt.toISOString(),
    remote_ip: p.remoteIp,
    user_agent: p.userAgent,
  }
}

export function serializeChannels(c: NotificationChannels | null) {
  return {
    discord_webhook_url: c?.discordWebhookUrl ?? null,
    google_chat_webhook_url: c?.googleChatWebhookUrl ?? null,
    webhook_url: c?.webhookUrl ?? null,
  }
}
