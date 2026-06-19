import Link from "next/link"
import { notFound } from "next/navigation"

import { requireUser } from "@/lib/api/current-user"
import { getMonitorDetail } from "@/lib/monitors/service"
import { formatDuration, timeAgo } from "@/lib/format"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { MonitorActions } from "@/components/dashboard/monitor-actions"

export default async function MonitorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireUser()
  const { id } = await params
  const detail = await getMonitorDetail(user.id, id)
  if (!detail) notFound()

  const { monitor, events, pings } = detail

  return (
    <div>
      <Link
        href="/dashboard"
        className="text-sm text-[var(--lk-ink-3)] transition-colors hover:text-[var(--lk-ink)]"
      >
        ← Monitors
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {monitor.name}
            </h1>
            <StatusBadge status={monitor.status} />
          </div>
          <p className="mt-1 text-sm text-[var(--lk-ink-3)]">
            Heartbeat · pings expected every{" "}
            {formatDuration(monitor.intervalSeconds)}
          </p>
        </div>
        <MonitorActions
          id={monitor.id}
          status={monitor.status}
          intervalSeconds={monitor.intervalSeconds}
        />
      </div>

      {monitor.status === "pending" ? (
        <div className="mt-6 rounded-xl border border-[var(--lk-line)] bg-[var(--lk-surface)] px-4 py-3 text-sm text-[var(--lk-ink-2)]">
          Waiting for the first ping.
        </div>
      ) : null}

      <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--lk-line)] bg-[var(--lk-line)] sm:grid-cols-4">
        <Stat label="Status" value={monitor.status} />
        <Stat label="Last ping" value={timeAgo(monitor.lastPingAt)} />
        <Stat
          label="Interval"
          value={formatDuration(monitor.intervalSeconds)}
        />
        <Stat label="Grace" value={formatDuration(monitor.graceSeconds)} />
        {monitor.downSince ? (
          <Stat label="Down since" value={timeAgo(monitor.downSince)} />
        ) : null}
      </dl>

      <Section title="Ping URL">
        <p className="text-sm text-[var(--lk-ink-2)]">
          For security, the full ping URL is shown only once, when created or
          rotated. If you&apos;ve lost it, rotate the token above to generate a
          new URL.
        </p>
        <p className="mt-3 font-mono text-[13px] text-[var(--lk-ink-3)]">
          {monitor.tokenPrefix}
          <span className="text-[var(--lk-line)]">{"…"}</span> · set as{" "}
          <code className="rounded bg-[var(--lk-line-2)] px-1.5 py-0.5">
            heartbeat.url
          </code>{" "}
          in <code>/etc/lookout/config.yaml</code>
        </p>
      </Section>

      <Section title="Recent events">
        {events.length === 0 ? (
          <p className="text-sm text-[var(--lk-ink-3)]">No events yet.</p>
        ) : (
          <ul className="space-y-2.5">
            {events.map((e) => (
              <li
                key={e.id}
                className="flex items-baseline justify-between gap-4 text-sm"
              >
                <span className="text-[var(--lk-ink-2)]">
                  <span className="mr-2 font-mono text-xs text-[var(--lk-ink-3)]">
                    {e.type}
                  </span>
                  {e.message}
                </span>
                <span className="shrink-0 font-mono text-xs text-[var(--lk-ink-3)]">
                  {timeAgo(e.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {pings.length > 0 ? (
        <Section title="Recent pings">
          <ul className="space-y-2 font-mono text-xs text-[var(--lk-ink-3)]">
            {pings.map((p) => (
              <li key={p.id} className="flex justify-between gap-4">
                <span>{timeAgo(p.receivedAt)}</span>
                <span>{p.remoteIp ?? "—"}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--lk-surface)] px-4 py-3.5">
      <dt className="text-xs text-[var(--lk-ink-3)]">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-[var(--lk-ink)] capitalize">
        {value}
      </dd>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-6 rounded-2xl border border-[var(--lk-line)] bg-[var(--lk-surface)] p-5">
      <h2 className="mb-3 text-sm font-semibold text-[var(--lk-ink)]">
        {title}
      </h2>
      {children}
    </section>
  )
}
