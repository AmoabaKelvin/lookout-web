import { lookup } from "node:dns/promises"
import { isIP } from "node:net"

// Hosts the labelled providers are locked to. The generic webhook has no host
// allowlist but still goes through the private-address checks below.
export const DISCORD_HOSTS = ["discord.com", "discordapp.com"] as const
export const GOOGLE_CHAT_HOSTS = ["chat.googleapis.com"] as const

export class UnsafeUrlError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "UnsafeUrlError"
  }
}

/**
 * SSRF guard for user-supplied webhook URLs. Requires https, optionally
 * restricts the host to an allowlist, and rejects any URL whose host (an IP
 * literal, or every address it resolves to) points at a private, loopback,
 * link-local, or cloud-metadata range. Run this immediately before each
 * request so a host cannot DNS-rebind to an internal address after an earlier
 * check.
 */
export async function assertSafeWebhookUrl(
  rawUrl: string,
  opts: { allowedHosts?: readonly string[] } = {},
): Promise<void> {
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    throw new UnsafeUrlError("Enter a valid URL")
  }

  if (url.protocol !== "https:") {
    throw new UnsafeUrlError("Webhook URL must use https")
  }

  const host = url.hostname.replace(/^\[/, "").replace(/\]$/, "")

  if (opts.allowedHosts && !hostMatches(host, opts.allowedHosts)) {
    throw new UnsafeUrlError(
      `Webhook host must be one of: ${opts.allowedHosts.join(", ")}`,
    )
  }

  let addresses: string[]
  if (isIP(host)) {
    addresses = [host]
  } else {
    try {
      addresses = (await lookup(host, { all: true })).map((r) => r.address)
    } catch {
      throw new UnsafeUrlError("Webhook host could not be resolved")
    }
  }

  if (addresses.length === 0) {
    throw new UnsafeUrlError("Webhook host could not be resolved")
  }
  if (addresses.some(isBlockedAddress)) {
    throw new UnsafeUrlError("Webhook host resolves to a disallowed address")
  }
}

function hostMatches(host: string, allowed: readonly string[]): boolean {
  const h = host.toLowerCase()
  return allowed.some((a) => h === a || h.endsWith(`.${a}`))
}

// --- IP range checks ---

const V4_BLOCKS: ReadonlyArray<readonly [string, number]> = [
  ["0.0.0.0", 8], // "this" network
  ["10.0.0.0", 8], // private
  ["100.64.0.0", 10], // carrier-grade NAT
  ["127.0.0.0", 8], // loopback
  ["169.254.0.0", 16], // link-local (incl. metadata 169.254.169.254)
  ["172.16.0.0", 12], // private
  ["192.0.0.0", 24], // IETF protocol assignments
  ["192.168.0.0", 16], // private
  ["198.18.0.0", 15], // benchmarking
  ["240.0.0.0", 4], // reserved
]

function isBlockedAddress(address: string): boolean {
  const kind = isIP(address)
  if (kind === 4) return isBlockedIpv4(address)
  if (kind === 6) return isBlockedIpv6(address.toLowerCase())
  return true // not a parseable IP → block defensively
}

function ipv4ToInt(ip: string): number | null {
  const parts = ip.split(".")
  if (parts.length !== 4) return null
  let n = 0
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null
    const octet = Number(part)
    if (octet > 255) return null
    n = (n << 8) | octet
  }
  return n >>> 0
}

function isBlockedIpv4(ip: string): boolean {
  const value = ipv4ToInt(ip)
  if (value === null) return true
  return V4_BLOCKS.some(([base, bits]) => {
    const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0
    return (value & mask) === (ipv4ToInt(base)! & mask)
  })
}

function isBlockedIpv6(ip: string): boolean {
  if (ip === "::" || ip === "::1") return true

  // IPv4-mapped, dotted form e.g. ::ffff:127.0.0.1
  const dotted = ip.match(/(?:^|:)((?:\d{1,3}\.){3}\d{1,3})$/)
  if (dotted) return isBlockedIpv4(dotted[1])

  // IPv4-mapped, hex form e.g. ::ffff:7f00:1
  const hex = ip.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/)
  if (hex) {
    const hi = parseInt(hex[1], 16)
    const lo = parseInt(hex[2], 16)
    return isBlockedIpv4(
      `${(hi >> 8) & 0xff}.${hi & 0xff}.${(lo >> 8) & 0xff}.${lo & 0xff}`,
    )
  }

  const firstHextet = parseInt(ip.split(":")[0] || "0", 16)
  if (firstHextet >= 0xfc00 && firstHextet <= 0xfdff) return true // fc00::/7 unique-local
  if (firstHextet >= 0xfe80 && firstHextet <= 0xfebf) return true // fe80::/10 link-local
  return false
}
