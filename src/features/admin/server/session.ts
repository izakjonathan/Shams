import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_MAX_AGE = 60 * 60 * 8;
export interface AdminConfig { email: string; password: string; secret: string }
export function adminConfigured(config: AdminConfig): boolean {
  return Boolean(config.email && config.password && config.secret.length >= 32);
}
export function safeEqual(a: string, b: string): boolean {
  // Fixed-length digests avoid exposing credential length through comparison.
  return timingSafeEqual(new Uint8Array(createHash("sha256").update(a).digest()), new Uint8Array(createHash("sha256").update(b).digest()));
}
function sign(payload: string, config: AdminConfig) {
  // Password/email rotation invalidates sessions without keeping a revocation table.
  return createHmac("sha256", config.secret).update(JSON.stringify([config.email, config.password, payload])).digest("base64url");
}
export function createSessionToken(email: string, config: AdminConfig, now = Date.now()): string {
  if (!adminConfigured(config) || !safeEqual(email.trim().toLowerCase(), config.email)) throw new Error("Invalid admin configuration or identity.");
  const payload = Buffer.from(JSON.stringify({ email: config.email, expires: Math.floor(now / 1000) + SESSION_MAX_AGE })).toString("base64url");
  return `${payload}.${sign(payload, config)}`;
}
export function readSessionIdentity(token: string | undefined, config: AdminConfig, now = Date.now()): string | null {
  if (!adminConfigured(config) || !token || token.length > 2048) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  if (!payload || !signature || !safeEqual(signature, sign(payload, config))) return null;
  try {
    const value: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!value || typeof value !== "object") return null;
    const session = value as { email?: unknown; expires?: unknown };
    if (session.email !== config.email || typeof session.expires !== "number" || !Number.isSafeInteger(session.expires)) return null;
    if (session.expires <= now / 1000 || session.expires > Math.floor(now / 1000) + SESSION_MAX_AGE) return null;
    return config.email;
  } catch { return null; }
}

/** Authenticate the database session envelope with a secret-only MAC before any database lookup.
 * The password/version-bound signature is still checked after loading the account. */
function signDbEnvelope(payload: string, secret: string) {
  return createHmac("sha256", secret).update("db-session-v1:").update(payload).digest("base64url");
}
export function wrapDbSessionToken(token: string, secret: string): string {
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !secret) throw new Error("Invalid database session.");
  return `${payload}.${signature}.${signDbEnvelope(payload, secret)}`;
}
export function inspectDbSessionEnvelope(token: string, config: AdminConfig, now = Date.now()): string | null {
  if (!adminConfigured(config) || token.length > 2048) return null;
  const parts = token.split(".");
  if (parts.length !== 3 || !parts.every(Boolean) || !safeEqual(parts[2], signDbEnvelope(parts[0], config.secret))) return null;
  try {
    const value: unknown = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    if (!value || typeof value !== "object") return null;
    const session = value as {email?: unknown; expires?: unknown};
    if (typeof session.email !== "string" || session.email.length > 254 || !session.email ||
        typeof session.expires !== "number" || !Number.isSafeInteger(session.expires) ||
        session.expires <= now / 1000 || session.expires > Math.floor(now / 1000) + SESSION_MAX_AGE) return null;
    return session.email;
  } catch { return null; }
}
