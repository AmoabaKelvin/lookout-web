import type { Monitor } from "@/lib/db/schema/monitors"

export type AlertMessage = { title: string; body: string }

// Templates from the PRD "Alerting Rules" section.
export function downAlert(m: Monitor): AlertMessage {
  const since = m.lastPingAt ? m.lastPingAt.toISOString() : "the monitor was created"
  return {
    title: `Heartbeat missed: ${m.name}`,
    body:
      `Lookout has not received a ping from ${m.name} since ${since}.\n` +
      `Expected every ${m.intervalSeconds}s with a ${m.graceSeconds}s grace period.`,
  }
}

export function recoveryAlert(m: Monitor): AlertMessage {
  return {
    title: `Heartbeat restored: ${m.name}`,
    body: `Lookout received a new ping from ${m.name}. The monitor is healthy again.`,
  }
}
