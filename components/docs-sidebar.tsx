"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const REPO = "https://github.com/AmoabaKelvin/lookout"

const releases = [
  { version: "v0.0.1", url: `${REPO}/releases/tag/v0.0.1` },
] as const

const navItems = [
  { title: "Introduction", slug: "index" },
  { title: "Installation", slug: "installation" },
  { title: "Configuration", slug: "configuration" },
  { title: "Alerts", slug: "alerts" },
  { title: "Notifications", slug: "notifications" },
  { title: "Docker Monitoring", slug: "docker" },
] as const

export function DocsSidebar() {
  const pathname = usePathname()

  function isActive(slug: string) {
    if (slug === "index") return pathname === "/docs"
    return pathname === `/docs/${slug}`
  }

  return (
    <aside className="hidden w-56 shrink-0 border-r border-[var(--lk-line)] p-6 md:block">
      <nav>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.slug}>
              <Link
                href={item.slug === "index" ? "/docs" : `/docs/${item.slug}`}
                className={cn(
                  "relative block px-3 py-1.5 text-sm transition-colors",
                  "text-[var(--lk-ink-2)] hover:text-[var(--lk-ink)]",
                  isActive(item.slug) &&
                    "font-medium text-[var(--lk-ink)] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-[var(--lk-accent)]",
                )}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t border-[var(--lk-line)] pt-6">
          <span className="block px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-[var(--lk-ink-3)]">
            Releases
          </span>
          {releases.map((r) => (
            <a
              key={r.version}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-1 text-sm text-[var(--lk-ink-2)] transition-colors hover:text-[var(--lk-ink)]"
            >
              {r.version} ↗
            </a>
          ))}
        </div>
      </nav>
    </aside>
  )
}
