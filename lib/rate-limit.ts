// Best-effort in-memory fixed-window limiter. Per-instance only; running behind
// multiple instances needs a shared store (e.g. Upstash/Turso). Dropped pings
// are harmless because ping handling is idempotent.
const WINDOW_MS = 10_000
const MAX_PER_WINDOW = 20
const MAX_KEYS = 10_000

const hits = new Map<string, { count: number; resetAt: number }>()

/** Returns true if the request is allowed. */
export function rateLimit(key: string, now: number = Date.now()): boolean {
  const entry = hits.get(key)
  if (!entry || now >= entry.resetAt) {
    if (hits.size > MAX_KEYS) prune(now)
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  entry.count += 1
  return entry.count <= MAX_PER_WINDOW
}

function prune(now: number) {
  for (const [k, v] of hits) {
    if (now >= v.resetAt) hits.delete(k)
  }
}
