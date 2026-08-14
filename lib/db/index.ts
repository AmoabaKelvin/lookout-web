import { createClient } from "@libsql/client/web"
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql"

import * as schema from "./schema"

export type DB = LibSQLDatabase<typeof schema>

let instance: DB | null = null

function getDb(): DB {
  if (instance) return instance
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error("DATABASE_URL is not set")
  }
  const client = createClient({
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  })
  instance = drizzle(client, { schema })
  return instance
}

// Lazy proxy: the libSQL client is only created on first use (at request time),
// not at module import. This keeps `next build` page-data collection from
// requiring DATABASE_URL to be set in the build environment.
export const db = new Proxy({} as DB, {
  get(_target, prop, receiver) {
    const real = getDb()
    const value = Reflect.get(real as object, prop, receiver)
    return typeof value === "function" ? value.bind(real) : value
  },
})
