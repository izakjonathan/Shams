import "server-only";
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { getDatabase, isDatabaseConfigured } from "../../../db/client";
import { adminAccounts, auditLogs } from "../../../db/schema";
import { requireContentWritable } from "./write-policy";
import { hashPassword, normalizeAdminEmail } from "./passwords";

export async function accountStorageReady() {
  if (!isDatabaseConfigured()) return false;
  const [row] = await getDatabase().select({ present: sql<boolean>`to_regclass('public.admin_accounts') IS NOT NULL` }).from(sql`(SELECT 1) AS account_storage_probe`);
  return Boolean(row?.present);
}
export async function findAdminAccount(email: string) {
  if (!await accountStorageReady()) return null;
  const [account] = await getDatabase().select().from(adminAccounts).where(eq(adminAccounts.email, email)).limit(1);
  return account ?? null;
}
export async function listAdminAccounts() {
  if (!await accountStorageReady()) return [];
  // Never serialize hashes or session-binding material into RSC/client props.
  return getDatabase().select({ email: adminAccounts.email, enabled: adminAccounts.enabled }).from(adminAccounts).orderBy(adminAccounts.email);
}
export async function addAdminAccount(actor: string, emailInput: string, password: string) {
  requireContentWritable();
  const email = normalizeAdminEmail(emailInput);
  if (email === process.env.ADMIN_EMAIL?.trim().toLowerCase()) throw new Error("This email is already the owner login.");
  const passwordHash = await hashPassword(password);
  await getDatabase().transaction(async tx => {
    // Narrow owner-authorized first-use setup; matches migration 0004 exactly.
    await tx.execute(sql`SELECT pg_advisory_xact_lock(736426, 1)`);
    await tx.execute(sql`CREATE TABLE IF NOT EXISTS admin_accounts (
      email text PRIMARY KEY CHECK (email = lower(email) AND length(email) <= 254),
      password_hash text NOT NULL,
      enabled boolean NOT NULL DEFAULT true,
      session_version integer NOT NULL DEFAULT 1 CHECK (session_version > 0),
      created_at timestamptz NOT NULL DEFAULT now()
    )`);
    const [existing] = await tx.select({ email: adminAccounts.email }).from(adminAccounts).where(eq(adminAccounts.email, email));
    if (existing) throw new Error("This email already has an admin account.");
    await tx.insert(adminAccounts).values({ email, passwordHash });
    await tx.insert(auditLogs).values({ id: randomUUID(), actor, action: "admin:create", recordType: "admin", recordId: email, after: { email, enabled: true } });
  });
}
export async function changeAdminAccount(actor: string, emailInput: string, password: string | null, enabled: boolean | null) {
  requireContentWritable();
  const email = normalizeAdminEmail(emailInput);
  if (email === process.env.ADMIN_EMAIL?.trim().toLowerCase()) throw new Error("The owner login is managed in Vercel.");
  const passwordHash = password === null ? null : await hashPassword(password);
  await getDatabase().transaction(async tx => {
    const [account] = await tx.select().from(adminAccounts).where(eq(adminAccounts.email, email)).for("update");
    if (!account) throw new Error("Admin account not found.");
    await tx.update(adminAccounts).set({ ...(passwordHash ? { passwordHash } : {}), ...(enabled !== null ? { enabled } : {}), sessionVersion: account.sessionVersion + 1 }).where(eq(adminAccounts.email, email));
    await tx.insert(auditLogs).values({ id: randomUUID(), actor, action: passwordHash ? "admin:password-reset" : enabled ? "admin:enable" : "admin:disable", recordType: "admin", recordId: email, after: { email, enabled: enabled ?? account.enabled } });
  });
}
