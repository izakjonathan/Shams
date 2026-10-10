import "server-only";
import { createHmac } from "node:crypto";
import { sql } from "drizzle-orm";
import { consumeAttempt } from "./login-attempts";
import { headers } from "next/headers";
import { getDatabase, isDatabaseConfigured } from "../../../db/client";
import { safeDatabaseErrorCode, type LoginProtection } from "./login-policy";

export async function consumeLoginAttempt(): Promise<LoginProtection> {
  if (!isDatabaseConfigured()) return process.env.NODE_ENV === "production" ? "unavailable" : "allowed";
  try {
    const db = getDatabase();
    const [storage] = await db.select({ present: sql<boolean>`to_regclass('public.admin_login_attempts') IS NOT NULL` }).from(sql`(SELECT 1) AS login_storage_probe`);
    if (!storage?.present) return "missing-schema";
    const h = await headers();
    // Vercel overwrites x-forwarded-for; do not trust it on arbitrary hosts.
    const ip = process.env.VERCEL === "1" ? (h.get("x-vercel-forwarded-for") ?? h.get("x-forwarded-for"))?.split(",")[0]?.trim() : "local";
    const key = createHmac("sha256", process.env.ADMIN_SESSION_SECRET ?? "").update(`admin-login:${ip || "unknown"}`).digest("hex");
    return await consumeAttempt(db, key) ? "allowed" : "limited";
  } catch (error) {
    const code = safeDatabaseErrorCode(error);
    console.error(`[admin login] Login protection unavailable (${code ?? "unknown"}).`);
    return code === "42P01" ? "missing-schema" : "unavailable";
  }
}
/** Called only after the configured password has verified. No editorial tables or ledger are touched. */
export async function initializeLoginProtection(): Promise<LoginProtection> {
  try {
    await getDatabase().transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(736426, 1)`);
      await tx.execute(sql`CREATE TABLE IF NOT EXISTS admin_login_attempts (
        key text PRIMARY KEY,
        attempts integer NOT NULL CHECK (attempts BETWEEN 1 AND 11),
        window_start timestamptz NOT NULL DEFAULT now()
      )`);
      await tx.execute(sql`CREATE INDEX IF NOT EXISTS admin_login_attempts_window_idx ON admin_login_attempts(window_start)`);
    });
    return consumeLoginAttempt();
  } catch (error) {
    console.error(`[admin login] Protection setup failed (${safeDatabaseErrorCode(error) ?? "unknown"}).`);
    return "unavailable";
  }
}
