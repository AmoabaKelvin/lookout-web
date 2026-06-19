"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"

const inputClass =
  "w-full rounded-lg border border-[var(--lk-line)] bg-[var(--lk-surface)] px-3 py-2 font-mono text-[13px] text-[var(--lk-ink)] outline-none transition-colors placeholder:text-[var(--lk-ink-3)] focus:border-[var(--lk-accent)] focus:ring-2 focus:ring-[var(--lk-accent)]/20"

type Channels = {
  discord_webhook_url: string | null
  google_chat_webhook_url: string | null
  webhook_url: string | null
}

export function NotificationSettingsForm({ initial }: { initial: Channels }) {
  const [discord, setDiscord] = React.useState(initial.discord_webhook_url ?? "")
  const [gchat, setGchat] = React.useState(
    initial.google_chat_webhook_url ?? "",
  )
  const [webhook, setWebhook] = React.useState(initial.webhook_url ?? "")
  const [saving, setSaving] = React.useState(false)
  const [status, setStatus] = React.useState<"idle" | "saved" | "error">("idle")
  const [error, setError] = React.useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setStatus("idle")
    setError(null)
    try {
      const res = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          discord_webhook_url: discord,
          google_chat_webhook_url: gchat,
          webhook_url: webhook,
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error ?? "Could not save")
        setStatus("error")
        return
      }
      setStatus("saved")
    } catch {
      setError("Network error. Please try again.")
      setStatus("error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <p className="text-sm text-[var(--lk-ink-2)]">
        When a monitor goes down or recovers, Lookout sends the alert to every
        channel you configure here. Leave a field blank to disable it.
      </p>

      {status === "saved" ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Saved.
        </div>
      ) : null}
      {status === "error" ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <Field
        label="Discord webhook URL"
        value={discord}
        onChange={setDiscord}
        placeholder="https://discord.com/api/webhooks/…"
      />
      <Field
        label="Google Chat webhook URL"
        value={gchat}
        onChange={setGchat}
        placeholder="https://chat.googleapis.com/v1/spaces/…"
      />
      <Field
        label="Generic webhook URL"
        value={webhook}
        onChange={setWebhook}
        placeholder="https://example.com/hooks/lookout"
        hint="Receives a JSON payload with the event and monitor details."
      />

      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save channels"}
      </Button>
    </form>
  )

  function Field({
    label,
    value,
    onChange,
    placeholder,
    hint,
  }: {
    label: string
    value: string
    onChange: (v: string) => void
    placeholder?: string
    hint?: string
  }) {
    return (
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--lk-ink-2)]">
          {label}
        </label>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
        {hint ? (
          <p className="mt-1 text-xs text-[var(--lk-ink-3)]">{hint}</p>
        ) : null}
      </div>
    )
  }
}
