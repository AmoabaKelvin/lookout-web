export function apiError(status: number, message: string) {
  return Response.json({ error: message }, { status })
}
