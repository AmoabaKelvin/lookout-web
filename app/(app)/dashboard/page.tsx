import Link from "next/link"

import { requireUser } from "@/lib/api/current-user"
import type { Monitor } from "@/lib/db/schema/monitors"
import { listMonitors } from "@/lib/monitors/service"
import { formatDuration, timeAgo } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/dashboard/status-badge"

export default async function DashboardPage() {
  const user = await requireUser()
  const monitors = await listMonitors(user.id)

  return (
    <div>
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Monitors</h1>
          <p className="mt-1 text-sm text-[var(--lk-ink-3)]">
            Heartbeat monitors watching your servers and agents.
          </p>
        </div>
        <Button render={<Link href="/dashboard/new" />} nativeButton={false}>
          New monitor
        </Button>
      </div>

      {monitors.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="divide-y divide-[var(--lk-line)] overflow-hidden rounded-2xl border border-[var(--lk-line)] bg-[var(--lk-surface)]">
          {monitors.map((m) => (
            <li key={m.id}>
              <Link
                href={`/dashboard/${m.id}`}
                className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[var(--lk-line-2)]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="truncate font-medium text-[var(--lk-ink)]">
                      {m.name}
                    </span>
                    <StatusBadge status={m.status} />
                  </div>
                  <div className="mt-1 text-xs text-[var(--lk-ink-3)]">
                    {scheduleLabel(m)}
                  </div>
                </div>
                <div className="shrink-0 text-right text-xs text-[var(--lk-ink-3)]">
                  <div>last ping</div>
                  <div className="font-mono text-[var(--lk-ink-2)]">
                    {timeAgo(m.lastPingAt)}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function scheduleLabel(m: Monitor): string {
  const every = `every ${formatDuration(m.intervalSeconds)}`
  if (m.status === "paused") return `Paused · pings ${every}`
  if (!m.lastPingAt) return `Waiting for the first ping · expected ${every}`

  const dueAt = m.lastPingAt.getTime() + m.intervalSeconds * 1000
  const now = Date.now()
  if (now <= dueAt) {
    return `Next ping in ${formatDuration((dueAt - now) / 1000)} · ${every}`
  }
  return `Overdue by ${formatDuration((now - dueAt) / 1000)} · ${every}`
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--lk-line)] bg-[var(--lk-surface)] px-6 py-16 text-center">
      <h2 className="text-base font-semibold text-[var(--lk-ink)]">
        No monitors yet
      </h2>
      <p className="mx-auto mt-2 max-w-[42ch] text-sm text-[var(--lk-ink-3)]">
        Create a heartbeat monitor, drop its ping URL into your Lookout config,
        and get alerted the moment your server stops checking in.
      </p>
      <div className="mt-6">
        <Button render={<Link href="/dashboard/new" />} nativeButton={false}>
          Create your first monitor
        </Button>
      </div>
    </div>
  )
}
