import Link from "next/link"

import { Button } from "@/components/ui/button"
import { LookoutLogo } from "@/components/lookout-logo"
import { GITHUB_URL } from "@/lib/site"

const links = [
  ["Docs", "/docs"],
  ["GitHub", GITHUB_URL],
] as const

export function SiteNav({ logoHref = "/" }: { logoHref?: string }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--lk-line)] bg-[color-mix(in_oklab,var(--lk-bg),transparent_14%)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1040px] items-center justify-between px-6">
        <LookoutLogo href={logoHref} style={{ fontSize: 20 }} />
        <div className="flex items-center gap-1.5">
          {links.map(([label, href]) => {
            const Component = href.startsWith("/") ? Link : "a"
            return (
              <Component
                key={label}
                href={href}
                className="rounded-md px-2.5 py-1.5 text-[13.5px] text-[var(--lk-ink-2)] transition-colors hover:text-[var(--lk-ink)]"
              >
                {label}
              </Component>
            )
          })}
          <Button
            size="sm"
            render={<Link href="/dashboard" />}
            nativeButton={false}
            className="ml-2 bg-[var(--lk-ink)] text-white hover:bg-[color-mix(in_oklab,var(--lk-ink),#fff_14%)]"
          >
            Dashboard
          </Button>
        </div>
      </div>
    </nav>
  )
}
