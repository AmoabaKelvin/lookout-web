import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import {
  monitorEvents,
  monitors,
  type NewMonitor,
} from "@/lib/db/schema/monitors"
import { notifyDown } from "@/lib/notifications"

import { getMonitorsForEvaluation } from "./service"
import { evaluateMonitor } from "./status"

export type EvaluationSummary = {
  checked: number
  transitioned: number
  downAlerts: number
}

/**
 * Background job: evaluate every active monitor against the timing model,
 * persist status transitions, and fire a down alert exactly once per outage.
 * Idempotent — running it repeatedly does not duplicate alerts.
 */
export async function runEvaluation(
  now: Date = new Date(),
): Promise<EvaluationSummary> {
  const list = await getMonitorsForEvaluation()
  let transitioned = 0
  let downAlerts = 0

  for (const m of list) {
    const decision = evaluateMonitor(
      {
        status: m.status,
        lastPingAt: m.lastPingAt,
        intervalSeconds: m.intervalSeconds,
        graceSeconds: m.graceSeconds,
      },
      now,
    )

    if (!decision.changed) {
      await db
        .update(monitors)
        .set({ lastCheckedAt: now })
        .where(eq(monitors.id, m.id))
      continue
    }

    const set: Partial<NewMonitor> = {
      status: decision.nextStatus,
      lastCheckedAt: now,
      updatedAt: now,
    }
    if (decision.setDownSince) set.downSince = now
    if (decision.clearDownSince) set.downSince = null

    await db.transaction(async (tx) => {
      await tx.update(monitors).set(set).where(eq(monitors.id, m.id))
      await tx.insert(monitorEvents).values({
        monitorId: m.id,
        type: "status_changed",
        fromStatus: m.status,
        toStatus: decision.nextStatus,
        message: `Evaluator: ${m.status} → ${decision.nextStatus}`,
      })
    })
    transitioned += 1

    if (decision.fireDownAlert) {
      downAlerts += 1
      await notifyDown({
        ...m,
        status: decision.nextStatus,
        downSince: decision.setDownSince ? now : m.downSince,
      })
    }
  }

  return { checked: list.length, transitioned, downAlerts }
}
