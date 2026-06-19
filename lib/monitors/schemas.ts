import { z } from "zod"

// Public API contract uses snake_case to match the PRD.
const intervalSeconds = z.number().int().min(10).max(86_400)
const graceSeconds = z.number().int().min(0).max(86_400)
const name = z.string().trim().min(1, "name is required").max(100, "name too long")

export const createMonitorSchema = z.object({
  kind: z.literal("heartbeat").optional(),
  name,
  interval_seconds: intervalSeconds.default(60),
  grace_seconds: graceSeconds.default(120),
})

export const updateMonitorSchema = z.object({
  name: name.optional(),
  interval_seconds: intervalSeconds.optional(),
  grace_seconds: graceSeconds.optional(),
  paused: z.boolean().optional(),
})

// A channel URL: a valid URL, "" (clears it), or null (clears it). Omitted
// fields are left unchanged.
const channelUrl = z
  .union([z.string().url("must be a valid URL"), z.literal(""), z.null()])
  .optional()

export const notificationChannelsSchema = z.object({
  discord_webhook_url: channelUrl,
  google_chat_webhook_url: channelUrl,
  webhook_url: channelUrl,
})

export type CreateMonitorInput = z.infer<typeof createMonitorSchema>
export type UpdateMonitorInput = z.infer<typeof updateMonitorSchema>
export type NotificationChannelsInput = z.infer<typeof notificationChannelsSchema>
