"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { CopyInline } from "@/components/dashboard/copy-inline"
import { SetupInstructions } from "@/components/dashboard/setup-instructions"

const inputClass =
  "w-full rounded-lg border border-[var(--lk-line)] bg-[var(--lk-surface)] px-3 py-2 text-sm text-[var(--lk-ink)] outline-none transition-colors placeholder:text-[var(--lk-ink-3)] focus:border-[var(--lk-accent)] focus:ring-2 focus:ring-[var(--lk-accent)]/20"

type Created = {
  id: string
  ping_url: string
  interval_seconds: number
}

export function CreateMonitorForm() {
  const router = useRouter()
  const [name, setName] = React.useState("")
  const [interval, setInterval] = React.useState(60)
  const [grace, setGrace] = React.useState(120)
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [created, setCreated] = React.useState<Created | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/monitors", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: "heartbeat",
          name,
          interval_seconds: interval,
          grace_seconds: grace,
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error ?? "Could not create monitor")
        return
      }
      setCreated(data)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (created) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Monitor created. Copy the ping URL now —{" "}
          <strong>the full URL is only shown once</strong>. You can rotate it
          later if it leaks.
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--lk-ink-2)]">
            Your ping URL
          </label>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={created.ping_url}
              className={`${inputClass} font-mono text-[13px]`}
              onFocus={(e) => e.currentTarget.select()}
            />
            <CopyInline value={created.ping_url} />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--lk-line)] bg-[var(--lk-surface)] p-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--lk-ink)]">
            Finish setup on your server
          </h3>
          <SetupInstructions
            pingUrl={created.ping_url}
            intervalSeconds={created.interval_seconds}
          />
        </div>

        <div className="flex gap-3">
          <Button
            render={<Link href={`/dashboard/${created.id}`} />}
            nativeButton={false}
          >
            Go to monitor
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              router.refresh()
              setCreated(null)
              setName("")
            }}
          >
            Create another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--lk-ink-2)]">
          Name
        </label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Production VPS"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--lk-ink-2)]">
            Expected interval (seconds)
          </label>
          <input
            type="number"
            min={10}
            required
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-[var(--lk-ink-3)]">
            How often the agent pings.
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--lk-ink-2)]">
            Grace period (seconds)
          </label>
          <input
            type="number"
            min={0}
            required
            value={grace}
            onChange={(e) => setGrace(Number(e.target.value))}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-[var(--lk-ink-3)]">
            Extra time before it&apos;s marked down.
          </p>
        </div>
      </div>

      <p className="text-sm text-[var(--lk-ink-3)]">
        With these defaults, a monitor pinging every minute is marked down after
        about three minutes of silence.
      </p>

      <Button type="submit" disabled={submitting || !name.trim()}>
        {submitting ? "Creating…" : "Create monitor"}
      </Button>
    </form>
  )
}
