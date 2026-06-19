import Link from "next/link"

import { LookoutLogo } from "@/components/lookout-logo"
import { SignOutButton } from "@/components/dashboard/sign-out-button"

export function AppNav({ email }: { email: string }) {
  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--lk-line)] bg-[color-mix(in_oklab,var(--lk-bg),transparent_14%)] backdrop-blur-md">
      <div className="mx-auto flex h-[60px] max-w-[1000px] items-center justify-between px-6">
        <div className="flex items-center gap-7">
          <LookoutLogo href="/" style={{ fontSize: 21 }} />
          <div className="flex items-center gap-5 text-sm">
            <Link
              href="/dashboard"
              className="text-[var(--lk-ink-2)] transition-colors hover:text-[var(--lk-ink)]"
            >
              Monitors
            </Link>
            <Link
              href="/dashboard/settings"
              className="text-[var(--lk-ink-2)] transition-colors hover:text-[var(--lk-ink)]"
            >
              Settings
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-[var(--lk-ink-3)] sm:inline">
            {email}
          </span>
          <SignOutButton />
        </div>
      </div>
    </nav>
  )
}
