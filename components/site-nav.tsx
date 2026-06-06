import { HugeiconsIcon } from "@hugeicons/react"
import { Github01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { LookoutLogo } from "@/components/lookout-logo"

const GITHUB_URL = "https://github.com/AmoabaKelvin/lookout"

const links = [
  ["Features", "#features"],
  ["How it works", "#how"],
  ["Alerts", "#alerts"],
  ["Docs", "/docs"],
] as const

export function SiteNav({ logoHref = "/" }: { logoHref?: string }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--lk-line)] bg-[color-mix(in_oklab,var(--lk-bg),transparent_14%)] backdrop-blur-md">
      <div className="mx-auto flex h-[66px] max-w-[1140px] items-center justify-between px-10 max-[920px]:px-6">
        <LookoutLogo href={logoHref} />
        <div className="flex items-center gap-[30px] max-[920px]:hidden">
          {links.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-[15px] text-[var(--lk-ink-2)] transition-colors hover:text-[var(--lk-ink)]"
            >
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            render={<a href={GITHUB_URL} />}
            nativeButton={false}
            className="max-[560px]:hidden"
          >
            <HugeiconsIcon icon={Github01Icon} size={17} />
            Star
          </Button>
          <Button render={<a href="#install" />} nativeButton={false}>
            Install
          </Button>
        </div>
      </div>
    </nav>
  )
}
