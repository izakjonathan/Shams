import "server-only";
import { createHash, createHmac } from "node:crypto";

/** S3-compatible Cloudflare R2 storage. No public bucket/domain is required. */
function config() {
  const account = process.env.R2_ACCOUNT_ID;
  const bucket = process.env.R2_BUCKET;
  const access = process.env.R2_ACCESS_KEY_ID;
  const secret = process.env.R2_SECRET_ACCESS_KEY;
  if (!account || !bucket || !access || !secret) throw new Error("R2 media storage is not configured.");
  if (!/^[a-z0-9]{32}$/i.test(account) || !/^[a-z0-9._-]+$/i.test(bucket)) throw new Error("Invalid R2 configuration.");
  return { account, bucket, access, secret };
}
export function useR2Media() { return process.env.MEDIA_STORAGE === "r2"; }
function sha256(value: string | Uint8Array) { return createHash("sha256").update(value).digest("hex"); }
function hmac(key: Buffer | string, value: string) { return createHmac("sha256", key).update(value).digest(); }
export async function r2Request(method: "PUT" | "GET", id: string, bytes?: Uint8Array, mime?: string): Promise<Response> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error("Invalid media ID.");
  const { account, bucket, access, secret } = config();
  const host = `${account}.r2.cloudflarestorage.com`;
  const path = `/${bucket}/shams/${id}`;
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const day = timestamp.slice(0, 8);
  const scope = `${day}/auto/s3/aws4_request`;
  const hash = sha256(bytes ?? new Uint8Array());
  const headers: Record<string, string> = { host, "x-amz-content-sha256": hash, "x-amz-date": timestamp };
  if (method === "PUT" && mime) headers["content-type"] = mime;
  const keys = Object.keys(headers).sort();
  const canonical = `${method}\n${path}\n\n${keys.map(key => `${key}:${headers[key].trim()}\n`).join("")}\n${keys.join(";")}\n${hash}`;
  const signatureKey = hmac(hmac(hmac(hmac(`AWS4${secret}`, day), "auto"), "s3"), "aws4_request");
  const signature = createHmac("sha256", signatureKey).update(`AWS4-HMAC-SHA256\n${timestamp}\n${scope}\n${sha256(canonical)}`).digest("hex");
  const authorization = `AWS4-HMAC-SHA256 Credential=${access}/${scope}, SignedHeaders=${keys.join(";")}, Signature=${signature}`;
  return fetch(`https://${host}${path}`, {
    method,
    headers: { ...headers, Authorization: authorization },
    ...(bytes ? { body: Buffer.from(bytes) } : {}),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
}
