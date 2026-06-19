import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { getSessionUser } from "./session"

export async function getCurrentUser() {
  return getSessionUser(await headers())
}

/** For server components/pages that require auth; redirects to /login if not. */
export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  return user
}
