import { apiError } from "@/lib/api/response"
import { getSessionUser } from "@/lib/api/session"
import { updateMonitorSchema } from "@/lib/monitors/schemas"
import {
  serializeEvent,
  serializeMonitor,
  serializePing,
} from "@/lib/monitors/serialize"
import { getMonitorDetail, updateMonitor } from "@/lib/monitors/service"

type Params = { params: Promise<{ id: string }> }

export async function GET(req: Request, { params }: Params) {
  const user = await getSessionUser(req.headers)
  if (!user) return apiError(401, "Unauthorized")

  const { id } = await params
  const detail = await getMonitorDetail(user.id, id)
  if (!detail) return apiError(404, "Monitor not found")

  return Response.json({
    monitor: serializeMonitor(detail.monitor),
    events: detail.events.map(serializeEvent),
    pings: detail.pings.map(serializePing),
  })
}

export async function PATCH(req: Request, { params }: Params) {
  const user = await getSessionUser(req.headers)
  if (!user) return apiError(401, "Unauthorized")

  const { id } = await params
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return apiError(400, "Invalid JSON body")
  }

  const parsed = updateMonitorSchema.safeParse(body)
  if (!parsed.success) {
    return apiError(422, parsed.error.issues.map((i) => i.message).join(", "))
  }

  const updated = await updateMonitor(user.id, id, parsed.data)
  if (!updated) return apiError(404, "Monitor not found")
  return Response.json(serializeMonitor(updated))
}
