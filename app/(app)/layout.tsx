import { requireUser } from "@/lib/api/current-user"
import { AppNav } from "@/components/dashboard/app-nav"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireUser()
  return (
    <div className="min-h-svh bg-[var(--lk-bg)] text-[var(--lk-ink)]">
      <AppNav email={user.email} />
      <main className="mx-auto max-w-[1000px] px-6 py-10 max-[560px]:py-7">
        {children}
      </main>
    </div>
  )
}
