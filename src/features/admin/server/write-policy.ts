import "server-only";
import { isDatabaseConfigured } from "../../../db/client";
export function isContentWritable() {
  return isDatabaseConfigured() && (process.env.VERCEL_ENV !== "preview" || process.env.ALLOW_PREVIEW_DATABASE_WRITES === "true");
}
export function requireContentWritable() {
  if (!isContentWritable()) throw new Error("Content writes are disabled. Configure an isolated preview database before enabling preview writes.");
}
