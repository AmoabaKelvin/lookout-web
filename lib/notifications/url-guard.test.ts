import { describe, expect, test } from "bun:test"

import { DISCORD_HOSTS, assertSafeWebhookUrl } from "./url-guard"

// These cases use IP literals or allowlist rejection so no real DNS is needed.
describe("assertSafeWebhookUrl", () => {
  test("allows a public https IP literal", async () => {
    await expect(
      assertSafeWebhookUrl("https://8.8.8.8/hook"),
    ).resolves.toBeUndefined()
  })

  test("rejects non-https schemes", async () => {
    await expect(assertSafeWebhookUrl("http://8.8.8.8/hook")).rejects.toThrow()
    await expect(assertSafeWebhookUrl("ftp://8.8.8.8/")).rejects.toThrow()
  })

  test("rejects an unparseable URL", async () => {
    await expect(assertSafeWebhookUrl("not a url")).rejects.toThrow()
  })

  test("rejects loopback", async () => {
    await expect(assertSafeWebhookUrl("https://127.0.0.1/")).rejects.toThrow()
    await expect(assertSafeWebhookUrl("https://127.5.5.5/")).rejects.toThrow()
  })

  test("rejects private ranges", async () => {
    await expect(assertSafeWebhookUrl("https://10.0.0.5/")).rejects.toThrow()
    await expect(assertSafeWebhookUrl("https://172.16.0.1/")).rejects.toThrow()
    await expect(assertSafeWebhookUrl("https://192.168.1.1/")).rejects.toThrow()
  })

  test("rejects cloud metadata link-local address", async () => {
    await expect(
      assertSafeWebhookUrl("https://169.254.169.254/latest/meta-data/"),
    ).rejects.toThrow()
  })

  test("rejects IPv6 loopback and link-local", async () => {
    await expect(assertSafeWebhookUrl("https://[::1]/")).rejects.toThrow()
    await expect(assertSafeWebhookUrl("https://[fe80::1]/")).rejects.toThrow()
    await expect(assertSafeWebhookUrl("https://[fc00::1]/")).rejects.toThrow()
  })

  test("rejects IPv4-mapped IPv6 loopback (dotted and hex)", async () => {
    await expect(
      assertSafeWebhookUrl("https://[::ffff:127.0.0.1]/"),
    ).rejects.toThrow()
    await expect(
      assertSafeWebhookUrl("https://[::ffff:7f00:1]/"),
    ).rejects.toThrow()
  })

  test("enforces the per-channel host allowlist", async () => {
    await expect(
      assertSafeWebhookUrl("https://evil.example/x", {
        allowedHosts: DISCORD_HOSTS,
      }),
    ).rejects.toThrow()
  })

  test("a public IP literal is not allowlisted for a labelled channel", async () => {
    await expect(
      assertSafeWebhookUrl("https://8.8.8.8/x", { allowedHosts: DISCORD_HOSTS }),
    ).rejects.toThrow()
  })
})
