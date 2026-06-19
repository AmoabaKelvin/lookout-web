import { apiError } from "@/lib/api/response"
import { runEvaluation } from "@/lib/monitors/evaluate"

export const dynamic = "force-dynamic"

// Vercel Cron calls this on a schedule (see vercel.json) and sends
// `Authorization: Bearer ${CRON_SECRET}` when CRON_SECRET is configured.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return apiError(401, "Unauthorized")
  }

  const summary = await runEvaluation()
  return Response.json({ ok: true, ...summary })
}
