import "server-only";
import { findAdminAccount } from "./accounts";
import { verifyPassword } from "./passwords";
import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { adminConfigured, createSessionToken, readSessionIdentity, inspectDbSessionEnvelope, wrapDbSessionToken, safeEqual, SESSION_MAX_AGE } from "./session";

const COOKIE_NAME = "shf-admin-session";
function config() {
  return { email: process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "", password: process.env.ADMIN_PASSWORD ?? "", secret: process.env.ADMIN_SESSION_SECRET ?? "" };
}
export function isAdminConfigured() { return adminConfigured(config()); }
export async function verifyCredentials(email: string, password: string) {
  const value = config();
  const emailMatches = safeEqual(email.trim().toLowerCase(), value.email);
  const passwordMatches = safeEqual(password, value.password);
  if (!adminConfigured(value)) return false;
  if (emailMatches) return passwordMatches;
  const account = await findAdminAccount(email.trim().toLowerCase());
  const verified = await verifyPassword(password, account?.passwordHash);
  return Boolean(account?.enabled && verified);
}
export async function createAdminSession(email: string, password: string) {
  const value = config();
  const identity = email.trim().toLowerCase();
  let token: string;
  if (safeEqual(identity, value.email)) {
    if (!safeEqual(password, value.password)) throw new Error("Credentials changed during sign-in.");
    token = createSessionToken(identity, value);
  }
  else {
    const account = await findAdminAccount(identity);
    if (!account?.enabled || !await verifyPassword(password, account.passwordHash)) throw new Error("Credentials changed during sign-in.");
    token = `db.${wrapDbSessionToken(createSessionToken(identity, { email: identity, password: `${account.passwordHash}:${account.sessionVersion}`, secret: value.secret }), value.secret)}`;
  }
  (await cookies()).set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_MAX_AGE });
}
export async function clearAdminSession() {
  (await cookies()).delete(COOKIE_NAME);
  (await draftMode()).disable();
}
export async function getAdminIdentity() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  const value = config();
  if (!token?.startsWith("db.")) return readSessionIdentity(token, value);
  if (!adminConfigured(value) || token.length > 2048) return null;
  try {
    const email = inspectDbSessionEnvelope(token.slice(3), value);
    if (!email || email === value.email) return null;
    const account = await findAdminAccount(email);
    if (!account?.enabled) return null;
    return readSessionIdentity(token.slice(3).split(".").slice(0, 2).join("."), { email: account.email, password: `${account.passwordHash}:${account.sessionVersion}`, secret: value.secret });
  } catch { return null; }
}
export async function requireAdmin(): Promise<string> {
  const identity = await getAdminIdentity();
  if (!identity) redirect("/admin/login");
  return identity;
}

export function isOwnerIdentity(identity: string) { return safeEqual(identity, config().email); }
export async function requireOwner() {
  const identity = await requireAdmin();
  if (!isOwnerIdentity(identity)) throw new Error("Only the owner can manage admin accounts.");
  return identity;
}
