import type { ReactNode } from "react"
import { SiteNav } from "@/components/site-nav"
import { DocsSidebar } from "@/components/docs-sidebar"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteNav />
      <div className="mx-auto flex min-h-screen max-w-6xl">
        <DocsSidebar />
        <main className="min-w-0 flex-1 p-6 md:p-10">{children}</main>
      </div>
    </>
  )
}
