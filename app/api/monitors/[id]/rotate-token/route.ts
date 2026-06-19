import { apiError } from "@/lib/api/response"
import { getSessionUser } from "@/lib/api/session"
import { serializeMonitor } from "@/lib/monitors/serialize"
import { rotateToken } from "@/lib/monitors/service"

type Params = { params: Promise<{ id: string }> }

export async function POST(req: Request, { params }: Params) {
  const user = await getSessionUser(req.headers)
  if (!user) return apiError(401, "Unauthorized")

  const { id } = await params
  const result = await rotateToken(user.id, id)
  if (!result) return apiError(404, "Monitor not found")

  // New raw token returned once, in the ping_url.
  return Response.json(serializeMonitor(result.monitor, { token: result.token }))
}
