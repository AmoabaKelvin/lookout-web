import Link from "next/link"

import { requireUser } from "@/lib/api/current-user"
import { getNotificationChannels } from "@/lib/monitors/service"
import { serializeChannels } from "@/lib/monitors/serialize"
import { NotificationSettingsForm } from "@/components/dashboard/notification-settings-form"

export default async function SettingsPage() {
  const user = await requireUser()
  const channels = await getNotificationChannels(user.id)

  return (
    <div className="mx-auto max-w-[640px]">
      <Link
        href="/dashboard"
        className="text-sm text-[var(--lk-ink-3)] transition-colors hover:text-[var(--lk-ink)]"
      >
        ← Monitors
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">
        Notification channels
      </h1>
      <p className="mt-1 mb-7 text-sm text-[var(--lk-ink-3)]">
        Where Lookout sends down and recovery alerts.
      </p>
      <NotificationSettingsForm initial={serializeChannels(channels)} />
    </div>
  )
}
