import { notifyRecovery } from "@/lib/notifications"
import { findMonitorByToken, recordPing } from "@/lib/monitors/service"
import { rateLimit } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

type Params = { params: Promise<{ token: string }> }

async function handlePing(req: Request, token: string): Promise<Response> {
  const remoteIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null
  const userAgent = req.headers.get("user-agent") || null

  if (!rateLimit(`${token}:${remoteIp ?? "noip"}`)) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 })
  }

  const monitor = await findMonitorByToken(token)
  if (!monitor) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 })
  }

  const { monitor: updated, fireRecoveryAlert } = await recordPing(monitor, {
    remoteIp,
    userAgent,
  })
  if (fireRecoveryAlert) await notifyRecovery(updated)

  return Response.json({ ok: true, status: updated.status })
}

export async function GET(req: Request, { params }: Params) {
  const { token } = await params
  return handlePing(req, token)
}

export async function POST(req: Request, { params }: Params) {
  const { token } = await params
  return handlePing(req, token)
}

export async function HEAD(req: Request, { params }: Params) {
  const { token } = await params
  const res = await handlePing(req, token)
  return new Response(null, { status: res.status })
}
