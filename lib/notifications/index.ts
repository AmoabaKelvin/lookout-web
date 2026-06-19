import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { monitors, type Monitor } from "@/lib/db/schema/monitors"
import { addEvent } from "@/lib/monitors/service"

import { deliver } from "./channels"
import { downAlert, recoveryAlert } from "./templates"

export async function notifyDown(monitor: Monitor) {
  const msg = downAlert(monitor)
  const result = await deliver(monitor.userId, msg, { event: "down", monitor })
  await addEvent(monitor.id, {
    type: "alert_sent",
    toStatus: "down",
    message: `Down alert (${result.summary})`,
  })
  await db
    .update(monitors)
    .set({ lastAlertedAt: new Date() })
    .where(eq(monitors.id, monitor.id))
}

export async function notifyRecovery(monitor: Monitor) {
  const msg = recoveryAlert(monitor)
  const result = await deliver(monitor.userId, msg, {
    event: "recovery",
    monitor,
  })
  await addEvent(monitor.id, {
    type: "alert_sent",
    toStatus: "up",
    message: `Recovery alert (${result.summary})`,
  })
}
