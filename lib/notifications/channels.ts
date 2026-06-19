import type { Monitor } from "@/lib/db/schema/monitors"
import { getNotificationChannels } from "@/lib/monitors/service"

import type { AlertMessage } from "./templates"
import {
  DISCORD_HOSTS,
  GOOGLE_CHAT_HOSTS,
  assertSafeWebhookUrl,
} from "./url-guard"

export type DeliveryResult = { summary: string }
export type AlertContext = { event: "down" | "recovery"; monitor: Monitor }

const TIMEOUT_MS = 10_000

// Sends the alert to every channel the user has configured. The agent's own
// Discord/Google Chat webhooks live on the (now-down) box, so the hosted app
// delivers via the user's notification_channels row instead. Channels fail
// independently — one bad webhook does not block the others.
export async function deliver(
  userId: string,
  msg: AlertMessage,
  ctx: AlertContext,
): Promise<DeliveryResult> {
  const channels = await getNotificationChannels(userId)
  const emoji = ctx.event === "down" ? "🔴" : "✅"
  const text = `${emoji} ${msg.title}\n${msg.body}`

  const jobs: { name: string; run: () => Promise<void> }[] = []
  if (channels?.discordWebhookUrl) {
    const url = channels.discordWebhookUrl
    jobs.push({
      name: "discord",
      run: () => postJson(url, { content: text }, DISCORD_HOSTS),
    })
  }
  if (channels?.googleChatWebhookUrl) {
    const url = channels.googleChatWebhookUrl
    jobs.push({
      name: "google_chat",
      run: () => postJson(url, { text }, GOOGLE_CHAT_HOSTS),
    })
  }
  if (channels?.webhookUrl) {
    const url = channels.webhookUrl
    jobs.push({
      name: "webhook",
      run: () => postJson(url, webhookPayload(msg, ctx)),
    })
  }

  if (jobs.length === 0) {
    console.warn(`[notify] no channels configured for user=${userId}: ${msg.title}`)
    return { summary: "no channels configured" }
  }

  const settled = await Promise.allSettled(jobs.map((j) => j.run()))
  const parts = settled.map(
    (s, i) => `${jobs[i].name}:${s.status === "fulfilled" ? "ok" : "fail"}`,
  )
  settled.forEach((s, i) => {
    if (s.status === "rejected") {
      // Log only the message, never the raw error: a fetch failure's `cause`
      // can include the webhook URL, which is a credential.
      const msg = s.reason instanceof Error ? s.reason.message : "delivery error"
      console.error(`[notify] ${jobs[i].name} delivery failed: ${msg}`)
    }
  })
  return { summary: parts.join(", ") }
}

function webhookPayload(msg: AlertMessage, ctx: AlertContext) {
  const m = ctx.monitor
  return {
    event: ctx.event === "down" ? "monitor.down" : "monitor.recovered",
    title: msg.title,
    body: msg.body,
    monitor: {
      id: m.id,
      name: m.name,
      status: m.status,
      interval_seconds: m.intervalSeconds,
      grace_seconds: m.graceSeconds,
      last_ping_at: m.lastPingAt?.toISOString() ?? null,
    },
  }
}

async function postJson(
  url: string,
  body: unknown,
  allowedHosts?: readonly string[],
): Promise<void> {
  // SSRF guard, re-checked immediately before the request (see url-guard).
  await assertSafeWebhookUrl(url, { allowedHosts })
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    redirect: "error",
  })
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`)
  }
}
