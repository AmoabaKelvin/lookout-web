import { auth } from "@/lib/auth"

/** Returns the authenticated user for a request, or null. */
export async function getSessionUser(headers: Headers) {
  const session = await auth.api.getSession({ headers })
  return session?.user ?? null
}
