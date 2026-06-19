import Link from "next/link"

import { requireUser } from "@/lib/api/current-user"
import { CreateMonitorForm } from "@/components/dashboard/create-monitor-form"

export default async function NewMonitorPage() {
  await requireUser()
  return (
    <div className="mx-auto max-w-[640px]">
      <Link
        href="/dashboard"
        className="text-sm text-[var(--lk-ink-3)] transition-colors hover:text-[var(--lk-ink)]"
      >
        ← Monitors
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">
        New heartbeat monitor
      </h1>
      <p className="mt-1 mb-7 text-sm text-[var(--lk-ink-3)]">
        Lookout alerts you if pings stop arriving within the grace window.
      </p>
      <CreateMonitorForm />
    </div>
  )
}
