import { describe, expect, test } from "bun:test"

import { generatePingToken, hashPingToken } from "./token"

describe("generatePingToken", () => {
  test("uses the lk_ping_ prefix", () => {
    const { token } = generatePingToken()
    expect(token.startsWith("lk_ping_")).toBe(true)
  })

  test("is long and unguessable (>= 40 chars of entropy)", () => {
    const { token } = generatePingToken()
    expect(token.length).toBeGreaterThanOrEqual(40)
  })

  test("is unique across calls", () => {
    const a = generatePingToken().token
    const b = generatePingToken().token
    expect(a).not.toBe(b)
  })

  test("hash matches the token and never equals it", () => {
    const { token, tokenHash } = generatePingToken()
    expect(tokenHash).toBe(hashPingToken(token))
    expect(tokenHash).not.toBe(token)
  })

  test("prefix is a short, non-revealing slice", () => {
    const { token, tokenPrefix } = generatePingToken()
    expect(tokenPrefix.length).toBe(16)
    expect(token.startsWith(tokenPrefix)).toBe(true)
  })
})

describe("hashPingToken", () => {
  test("is deterministic", () => {
    expect(hashPingToken("lk_ping_abc")).toBe(hashPingToken("lk_ping_abc"))
  })

  test("differs for different tokens", () => {
    expect(hashPingToken("lk_ping_abc")).not.toBe(hashPingToken("lk_ping_abd"))
  })
})
