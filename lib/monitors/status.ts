import type { MonitorStatus } from "@/lib/db/schema/monitors"

// Timing model (PRD): a monitor is down when
//   now > last_ping_at + interval_seconds + grace_seconds
// "late" is the window after the interval but before the grace expires.

export type TimingInput = {
  lastPingAt: Date | null
  intervalSeconds: number
  graceSeconds: number
}

/**
 * Status derived purely from timing for a monitor that has pinged and is not
 * paused. Returns one of "up" | "late" | "down".
 */
export function deriveTimedStatus(
  input: { lastPingAt: Date; intervalSeconds: number; graceSeconds: number },
  now: Date,
): Extract<MonitorStatus, "up" | "late" | "down"> {
  const last = input.lastPingAt.getTime()
  const upUntil = last + input.intervalSeconds * 1000
  const downAt = upUntil + input.graceSeconds * 1000
  const t = now.getTime()
  if (t <= upUntil) return "up"
  if (t <= downAt) return "late"
  return "down"
}

export type EvalInput = TimingInput & { status: MonitorStatus }

export type EvalDecision = {
  nextStatus: MonitorStatus
  changed: boolean
  // Fire a down alert only on the transition INTO down (idempotent: running
  // the evaluator twice must not re-alert).
  fireDownAlert: boolean
  setDownSince: boolean
  clearDownSince: boolean
}

/**
 * The background evaluator's decision for a single monitor. It only ever moves
 * a monitor toward late/down and fires down alerts; recovery (→ up) and
 * recovery alerts are handled by the ping handler, not here.
 */
export function evaluateMonitor(input: EvalInput, now: Date): EvalDecision {
  // Paused monitors never change status or alert.
  if (input.status === "paused") {
    return decision("paused", input.status, false)
  }
  // Never pinged → stays pending, never alerts.
  if (input.lastPingAt === null) {
    return decision("pending", input.status, false)
  }

  const derived = deriveTimedStatus(
    {
      lastPingAt: input.lastPingAt,
      intervalSeconds: input.intervalSeconds,
      graceSeconds: input.graceSeconds,
    },
    now,
  )
  const fireDownAlert = derived === "down" && input.status !== "down"
  return decision(derived, input.status, fireDownAlert)
}

function decision(
  nextStatus: MonitorStatus,
  prevStatus: MonitorStatus,
  fireDownAlert: boolean,
): EvalDecision {
  return {
    nextStatus,
    changed: nextStatus !== prevStatus,
    fireDownAlert,
    setDownSince: nextStatus === "down" && prevStatus !== "down",
    clearDownSince: nextStatus !== "down" && prevStatus === "down",
  }
}

export type PingDecision = {
  nextStatus: MonitorStatus
  fireRecoveryAlert: boolean
}

/**
 * Decision applied when a ping is accepted. A paused monitor records the ping
 * but stays paused and never alerts; a down monitor recovers and alerts; any
 * other state simply becomes up.
 */
export function applyPing(currentStatus: MonitorStatus): PingDecision {
  if (currentStatus === "paused") {
    return { nextStatus: "paused", fireRecoveryAlert: false }
  }
  return {
    nextStatus: "up",
    fireRecoveryAlert: currentStatus === "down",
  }
}
