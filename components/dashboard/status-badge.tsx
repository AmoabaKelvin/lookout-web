import type { MonitorStatus } from "@/lib/db/schema/monitors"
import { cn } from "@/lib/utils"

const STATUS: Record<
  MonitorStatus,
  { label: string; dot: string; text: string; bg: string; ring: string }
> = {
  up: {
    label: "Up",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    ring: "ring-emerald-600/20",
  },
  late: {
    label: "Late",
    dot: "bg-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
    ring: "ring-amber-600/20",
  },
  down: {
    label: "Down",
    dot: "bg-red-500",
    text: "text-red-700",
    bg: "bg-red-50",
    ring: "ring-red-600/20",
  },
  pending: {
    label: "Pending",
    dot: "bg-zinc-400",
    text: "text-zinc-600",
    bg: "bg-zinc-50",
    ring: "ring-zinc-500/20",
  },
  paused: {
    label: "Paused",
    dot: "bg-sky-500",
    text: "text-sky-700",
    bg: "bg-sky-50",
    ring: "ring-sky-600/20",
  },
}

export function StatusBadge({
  status,
  className,
}: {
  status: MonitorStatus
  className?: string
}) {
  const s = STATUS[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        s.bg,
        s.text,
        s.ring,
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          s.dot,
          status === "down" && "animate-pulse",
        )}
      />
      {s.label}
    </span>
  )
}
