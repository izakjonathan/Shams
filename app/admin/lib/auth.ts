import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "shf-admin-session";
const MAX_AGE = 60 * 60 * 8;

function config() {
  return {
    email: process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "",
    password: process.env.ADMIN_PASSWORD ?? "",
    secret: process.env.ADMIN_SESSION_SECRET ?? "",
  };
}

export function isAdminConfigured() {
  const value = config();
  return Boolean(value.email && value.password && value.secret.length >= 32);
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function verifyCredentials(email: string, password: string) {
  const value = config();
  return safeEqual(email.trim().toLowerCase(), value.email) && safeEqual(password, value.password);
}

export async function createAdminSession(email: string) {
  const { secret } = config();
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = Buffer.from(JSON.stringify({ email: email.trim().toLowerCase(), expires })).toString("base64url");
  const token = `${payload}.${sign(payload, secret)}`;
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getAdminIdentity() {
  if (!isAdminConfigured()) return null;
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload, config().secret))) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email?: string; expires?: number };
    if (!session.email || !Number.isFinite(session.expires) || Number(session.expires) <= Date.now() / 1000) return null;
    return session.email;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const identity = await getAdminIdentity();
  if (!identity) redirect("/admin/login");
  return identity;
}
