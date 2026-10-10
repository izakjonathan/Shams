import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let client: ReturnType<typeof postgres> | undefined;
let database: ReturnType<typeof drizzle> | undefined;

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getDatabase() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not configured.");
  if (!client) client = postgres(url, { prepare: false, max: 3, connect_timeout: 10, idle_timeout: 20, max_lifetime: 60 * 5, connection: { statement_timeout: 15000, lock_timeout: 5000 } });
  if (!database) database = drizzle(client);
  return database;
}
