import { apiError } from "@/lib/api/response"
import { getSessionUser } from "@/lib/api/session"
import { notificationChannelsSchema } from "@/lib/monitors/schemas"
import { serializeChannels } from "@/lib/monitors/serialize"
import {
  getNotificationChannels,
  upsertNotificationChannels,
} from "@/lib/monitors/service"
import {
  DISCORD_HOSTS,
  GOOGLE_CHAT_HOSTS,
  UnsafeUrlError,
  assertSafeWebhookUrl,
} from "@/lib/notifications/url-guard"

export async function GET(req: Request) {
  const user = await getSessionUser(req.headers)
  if (!user) return apiError(401, "Unauthorized")

  const channels = await getNotificationChannels(user.id)
  return Response.json(serializeChannels(channels))
}

export async function PUT(req: Request) {
  const user = await getSessionUser(req.headers)
  if (!user) return apiError(401, "Unauthorized")

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return apiError(400, "Invalid JSON body")
  }

  const parsed = notificationChannelsSchema.safeParse(body)
  if (!parsed.success) {
    return apiError(422, parsed.error.issues.map((i) => i.message).join(", "))
  }

  // "" clears a channel; an omitted field is left unchanged.
  const norm = (v: string | null | undefined) =>
    v === undefined ? undefined : v === "" ? null : v
  const discordWebhookUrl = norm(parsed.data.discord_webhook_url)
  const googleChatWebhookUrl = norm(parsed.data.google_chat_webhook_url)
  const webhookUrl = norm(parsed.data.webhook_url)

  // Reject SSRF-unsafe webhook URLs before storing them.
  try {
    if (discordWebhookUrl)
      await assertSafeWebhookUrl(discordWebhookUrl, { allowedHosts: DISCORD_HOSTS })
    if (googleChatWebhookUrl)
      await assertSafeWebhookUrl(googleChatWebhookUrl, {
        allowedHosts: GOOGLE_CHAT_HOSTS,
      })
    if (webhookUrl) await assertSafeWebhookUrl(webhookUrl)
  } catch (e) {
    if (e instanceof UnsafeUrlError) return apiError(422, e.message)
    throw e
  }

  const row = await upsertNotificationChannels(user.id, {
    discordWebhookUrl,
    googleChatWebhookUrl,
    webhookUrl,
  })
  return Response.json(serializeChannels(row))
}
