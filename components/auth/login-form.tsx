"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Github01Icon } from "@hugeicons/core-free-icons"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { LookoutLogo } from "@/components/lookout-logo"

const inputClass =
  "w-full rounded-lg border border-[var(--lk-line)] bg-[var(--lk-surface)] px-3 py-2 text-sm text-[var(--lk-ink)] outline-none transition-colors placeholder:text-[var(--lk-ink-3)] focus:border-[var(--lk-accent)] focus:ring-2 focus:ring-[var(--lk-accent)]/20"

export function LoginForm({
  oauthError,
}: {
  oauthError?: string | null
}) {
  const router = useRouter()
  const [mode, setMode] = React.useState<"signin" | "signup">("signin")
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(oauthError ?? null)
  const [busy, setBusy] = React.useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const res =
        mode === "signup"
          ? await authClient.signUp.email({ email, password, name })
          : await authClient.signIn.email({ email, password })
      if (res.error) {
        setError(res.error.message ?? "Something went wrong")
        return
      }
      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  async function onGithub() {
    setBusy(true)
    setError(null)
    // On success the browser is redirected to GitHub, so we only reset on error.
    try {
      const res = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      })
      if (res.error) {
        setError(res.error.message ?? "GitHub sign-in failed")
        setBusy(false)
      }
    } catch {
      setError("GitHub sign-in failed. Please try again.")
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[var(--lk-bg)] px-6 text-[var(--lk-ink)]">
      <LookoutLogo href="/" style={{ fontSize: 26 }} className="mb-8" />
      <div className="w-full max-w-[380px] rounded-2xl border border-[var(--lk-line)] bg-[var(--lk-surface)] p-7 shadow-[0_10px_40px_-24px_rgba(20,22,26,0.4)]">
        <h1 className="text-lg font-semibold tracking-tight">
          {mode === "signin" ? "Sign in to Lookout" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-[var(--lk-ink-3)]">
          {mode === "signin"
            ? "Welcome back. Manage your heartbeat monitors."
            : "Start monitoring your servers in under a minute."}
        </p>

        {error ? (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <Button
          type="button"
          variant="outline"
          onClick={onGithub}
          disabled={busy}
          className="mt-6 w-full"
        >
          <HugeiconsIcon icon={Github01Icon} size={17} />
          Continue with GitHub
        </Button>
        <div className="my-5 flex items-center gap-3 text-xs text-[var(--lk-ink-3)]">
          <span className="h-px flex-1 bg-[var(--lk-line)]" />
          or
          <span className="h-px flex-1 bg-[var(--lk-line)]" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "signup" ? (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--lk-ink-2)]">
                Name
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className={inputClass}
              />
            </div>
          ) : null}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--lk-ink-2)]">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--lk-ink-2)]">
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className={inputClass}
            />
          </div>

          <Button type="submit" disabled={busy} className="w-full">
            {busy
              ? "Please wait…"
              : mode === "signin"
                ? "Sign in"
                : "Create account"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-[var(--lk-ink-3)]">
          {mode === "signin" ? "No account yet? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin")
              setError(null)
            }}
            className="font-medium text-[var(--lk-accent-strong)] hover:underline"
          >
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  )
}
