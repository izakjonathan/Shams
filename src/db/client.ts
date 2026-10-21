import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let client: ReturnType<typeof postgres> | undefined;
let database: ReturnType<typeof drizzle> | undefined;

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getSqlClient() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not configured.");
  const poolMax = Number(process.env.DATABASE_POOL_MAX ?? 3);
  if (!Number.isInteger(poolMax) || poolMax < 1 || poolMax > 10) throw new Error("DATABASE_POOL_MAX must be an integer between 1 and 10.");
  if (!client) client = postgres(url, { prepare: false, max: poolMax, connect_timeout: 10, idle_timeout: 20, max_lifetime: 60 * 5, connection: { statement_timeout: 15000, lock_timeout: 5000 } });
  return client;
}

export function getDatabase() {
  if (!database) database = drizzle(getSqlClient());
  return database;
}
