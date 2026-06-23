import type { ReactNode } from "react"
import { SiteNav } from "@/components/site-nav"
import { DocsSidebar } from "@/components/docs-sidebar"
import { getReleases } from "@/lib/releases"

export default async function Layout({ children }: { children: ReactNode }) {
  const releases = await getReleases()
  return (
    <>
      <SiteNav />
      <div className="mx-auto flex min-h-screen max-w-6xl">
        <DocsSidebar releases={releases} />
        <main className="min-w-0 flex-1 p-6 md:p-10">{children}</main>
      </div>
    </>
  )
}
