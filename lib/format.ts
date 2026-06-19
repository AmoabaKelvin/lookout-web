export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds))
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ${m % 60}m`
  const d = Math.floor(h / 24)
  return `${d}d ${h % 24}h`
}

export function timeAgo(
  date: Date | string | null,
  now: number = Date.now(),
): string {
  if (!date) return "never"
  const d = typeof date === "string" ? new Date(date) : date
  const diff = Math.round((now - d.getTime()) / 1000)
  if (diff < 0) return `in ${formatDuration(-diff)}`
  if (diff < 5) return "just now"
  return `${formatDuration(diff)} ago`
}
