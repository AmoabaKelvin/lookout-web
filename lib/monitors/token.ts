import { createHash, randomBytes } from "node:crypto"

// Ping token format from the PRD: lk_ping_{random}. The raw token is shown to
// the user only once (on create / rotate); only the hash is persisted.
const TOKEN_PREFIX = "lk_ping_"
const RANDOM_BYTES = 32

export type GeneratedToken = {
  token: string
  tokenHash: string
  tokenPrefix: string
}

export function generatePingToken(): GeneratedToken {
  const random = randomBytes(RANDOM_BYTES).toString("base64url")
  const token = `${TOKEN_PREFIX}${random}`
  return {
    token,
    tokenHash: hashPingToken(token),
    // Enough to recognise a token in support/debugging without revealing it.
    tokenPrefix: token.slice(0, 16),
  }
}

export function hashPingToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}
