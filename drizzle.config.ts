import { defineConfig } from "drizzle-kit"

// libSQL/Turso. For local dev DATABASE_URL is a file URL (file:local.db) and
// DATABASE_AUTH_TOKEN is unset; in production both point at Turso.
export default defineConfig({
  schema: "./lib/db/schema/index.ts",
  out: "./lib/db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
})
