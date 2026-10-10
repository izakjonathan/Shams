import "server-only";
import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { adminConfigured, createSessionToken, readSessionIdentity, safeEqual, SESSION_MAX_AGE } from "./session";

const COOKIE_NAME = "shf-admin-session";
function config() {
  return { email: process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "", password: process.env.ADMIN_PASSWORD ?? "", secret: process.env.ADMIN_SESSION_SECRET ?? "" };
}
export function isAdminConfigured() { return adminConfigured(config()); }
export function verifyCredentials(email: string, password: string) {
  const value = config();
  const emailMatches = safeEqual(email.trim().toLowerCase(), value.email);
  const passwordMatches = safeEqual(password, value.password);
  return adminConfigured(value) && emailMatches && passwordMatches;
}
export async function createAdminSession(email: string) {
  const token = createSessionToken(email, config());
  (await cookies()).set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_MAX_AGE });
}
export async function clearAdminSession() {
  (await cookies()).delete(COOKIE_NAME);
  (await draftMode()).disable();
}
export async function getAdminIdentity() {
  return readSessionIdentity((await cookies()).get(COOKIE_NAME)?.value, config());
}
export async function requireAdmin(): Promise<string> {
  const identity = await getAdminIdentity();
  if (!identity) redirect("/admin/login");
  return identity;
}
