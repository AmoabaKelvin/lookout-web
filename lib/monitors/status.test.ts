import { describe, expect, test } from "bun:test"

import { applyPing, deriveTimedStatus, evaluateMonitor } from "./status"

const INTERVAL = 60
const GRACE = 120
const base = new Date("2026-06-18T12:00:00.000Z")
const at = (secondsAfterPing: number) =>
  new Date(base.getTime() + secondsAfterPing * 1000)

describe("deriveTimedStatus", () => {
  const input = { lastPingAt: base, intervalSeconds: INTERVAL, graceSeconds: GRACE }

  test("up within the interval", () => {
    expect(deriveTimedStatus(input, at(0))).toBe("up")
    expect(deriveTimedStatus(input, at(59))).toBe("up")
    expect(deriveTimedStatus(input, at(60))).toBe("up") // boundary: interval
  })

  test("late between interval and grace", () => {
    expect(deriveTimedStatus(input, at(61))).toBe("late")
    expect(deriveTimedStatus(input, at(180))).toBe("late") // boundary: interval+grace
  })

  test("down after interval + grace", () => {
    expect(deriveTimedStatus(input, at(181))).toBe("down")
    expect(deriveTimedStatus(input, at(10_000))).toBe("down")
  })
})

describe("evaluateMonitor", () => {
  const make = (status: Parameters<typeof evaluateMonitor>[0]["status"], lastPingAt: Date | null) => ({
    status,
    lastPingAt,
    intervalSeconds: INTERVAL,
    graceSeconds: GRACE,
  })

  test("never-pinged monitor stays pending and does not alert", () => {
    const d = evaluateMonitor(make("pending", null), at(10_000))
    expect(d.nextStatus).toBe("pending")
    expect(d.fireDownAlert).toBe(false)
  })

  test("paused monitor never changes or alerts", () => {
    const d = evaluateMonitor(make("paused", base), at(10_000))
    expect(d.nextStatus).toBe("paused")
    expect(d.changed).toBe(false)
    expect(d.fireDownAlert).toBe(false)
  })

  test("up → late does not alert", () => {
    const d = evaluateMonitor(make("up", base), at(61))
    expect(d.nextStatus).toBe("late")
    expect(d.fireDownAlert).toBe(false)
  })

  test("late → down fires exactly one down alert and sets downSince", () => {
    const d = evaluateMonitor(make("late", base), at(181))
    expect(d.nextStatus).toBe("down")
    expect(d.fireDownAlert).toBe(true)
    expect(d.setDownSince).toBe(true)
  })

  test("up → down (skipping late between runs) still fires one alert", () => {
    const d = evaluateMonitor(make("up", base), at(500))
    expect(d.nextStatus).toBe("down")
    expect(d.fireDownAlert).toBe(true)
  })

  test("idempotent: down → down does not re-alert", () => {
    const d = evaluateMonitor(make("down", base), at(500))
    expect(d.nextStatus).toBe("down")
    expect(d.changed).toBe(false)
    expect(d.fireDownAlert).toBe(false)
    expect(d.setDownSince).toBe(false)
  })

  test("pending → down (first window missed after a ping) fires alert", () => {
    // Pending only persists while lastPingAt is null; once a ping exists the
    // status would be up, but guard the transition anyway.
    const d = evaluateMonitor(make("pending", base), at(500))
    expect(d.nextStatus).toBe("down")
    expect(d.fireDownAlert).toBe(true)
  })
})

describe("applyPing", () => {
  test("pending → up, no recovery alert", () => {
    expect(applyPing("pending")).toEqual({ nextStatus: "up", fireRecoveryAlert: false })
  })

  test("late → up, no recovery alert", () => {
    expect(applyPing("late")).toEqual({ nextStatus: "up", fireRecoveryAlert: false })
  })

  test("down → up fires a recovery alert", () => {
    expect(applyPing("down")).toEqual({ nextStatus: "up", fireRecoveryAlert: true })
  })

  test("up → up, no alert", () => {
    expect(applyPing("up")).toEqual({ nextStatus: "up", fireRecoveryAlert: false })
  })

  test("paused records the ping but stays paused and never alerts", () => {
    expect(applyPing("paused")).toEqual({ nextStatus: "paused", fireRecoveryAlert: false })
  })
})
