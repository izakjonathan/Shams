import "server-only";
import { createHmac } from "node:crypto";
import { consumeAttempt } from "./login-attempts";
import { headers } from "next/headers";
import { getDatabase, isDatabaseConfigured } from "../../../db/client";

// PostgreSQL makes this limit shared by all Vercel instances. A process-local
// counter would reset on cold starts and fail under horizontally scaled load.
export async function consumeLoginAttempt(): Promise<boolean> {
  if (!isDatabaseConfigured()) return process.env.NODE_ENV !== "production";
  const h = await headers();
  const trustedIp = process.env.VERCEL === "1" ? h.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() : "local";
  const key = createHmac("sha256", process.env.ADMIN_SESSION_SECRET ?? "").update(`admin-login:${trustedIp || "unknown"}`).digest("hex");
  try {
    return await consumeAttempt(getDatabase(), key);
  } catch {
    console.error("[admin login] Login protection is unavailable.");
    return false;
  }
}
