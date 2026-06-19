import { apiError } from "@/lib/api/response"
import { getSessionUser } from "@/lib/api/session"
import { createMonitorSchema } from "@/lib/monitors/schemas"
import { serializeMonitor } from "@/lib/monitors/serialize"
import { createMonitor, listMonitors } from "@/lib/monitors/service"

export async function POST(req: Request) {
  const user = await getSessionUser(req.headers)
  if (!user) return apiError(401, "Unauthorized")

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return apiError(400, "Invalid JSON body")
  }

  const parsed = createMonitorSchema.safeParse(body)
  if (!parsed.success) {
    return apiError(422, parsed.error.issues.map((i) => i.message).join(", "))
  }

  const { monitor, token } = await createMonitor({
    userId: user.id,
    name: parsed.data.name,
    intervalSeconds: parsed.data.interval_seconds,
    graceSeconds: parsed.data.grace_seconds,
  })
  // Raw token returned exactly once, in the ping_url.
  return Response.json(serializeMonitor(monitor, { token }), { status: 201 })
}

export async function GET(req: Request) {
  const user = await getSessionUser(req.headers)
  if (!user) return apiError(401, "Unauthorized")

  const list = await listMonitors(user.id)
  return Response.json({ monitors: list.map((m) => serializeMonitor(m)) })
}
