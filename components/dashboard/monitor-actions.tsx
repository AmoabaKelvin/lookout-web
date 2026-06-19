"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import type { MonitorStatus } from "@/lib/db/schema/monitors"
import { Button } from "@/components/ui/button"
import { CopyInline } from "@/components/dashboard/copy-inline"
import { SetupInstructions } from "@/components/dashboard/setup-instructions"

export function MonitorActions({
  id,
  status,
  intervalSeconds,
}: {
  id: string
  status: MonitorStatus
  intervalSeconds: number
}) {
  const router = useRouter()
  const [busy, setBusy] = React.useState(false)
  const [rotated, setRotated] = React.useState<string | null>(null)
  const paused = status === "paused"

  async function togglePause() {
    setBusy(true)
    try {
      await fetch(`/api/monitors/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ paused: !paused }),
      })
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  async function rotate() {
    if (
      !window.confirm(
        "Rotate the ping token? The current ping URL will stop working immediately.",
      )
    )
      return
    setBusy(true)
    try {
      const res = await fetch(`/api/monitors/${id}/rotate-token`, {
        method: "POST",
      })
      const data = await res.json()
      if (res.ok) {
        setRotated(data.ping_url)
        router.refresh()
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={togglePause} disabled={busy}>
          {paused ? "Resume" : "Pause"}
        </Button>
        <Button variant="outline" onClick={rotate} disabled={busy}>
          Rotate token
        </Button>
      </div>

      {rotated ? (
        <div className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
          <div className="text-sm text-amber-900">
            New ping URL generated. <strong>Copy it now</strong> — it won&apos;t
            be shown again. Update your server config below.
          </div>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={rotated}
              onFocus={(e) => e.currentTarget.select()}
              className="w-full rounded-lg border border-[var(--lk-line)] bg-[var(--lk-surface)] px-3 py-2 font-mono text-[13px] outline-none"
            />
            <CopyInline value={rotated} />
          </div>
          <SetupInstructions pingUrl={rotated} intervalSeconds={intervalSeconds} />
        </div>
      ) : null}
    </div>
  )
}
