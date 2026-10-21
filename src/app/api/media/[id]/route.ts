import { getSqlClient } from "../../../../db/client";
import { r2Request } from "../../../../features/content/server-r2-media";
export const runtime = "nodejs";
export async function GET(_request: Request, { params }: { params: Promise<{id: string}> }) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return new Response("Not found", {status:404});
  // Optional read-only compatibility for images previously uploaded to R2.
  // New uploads always use Vercel Blob when MEDIA_STORAGE=blob.
  if (process.env.R2_ACCOUNT_ID && process.env.R2_BUCKET && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY) {
    try {
      const response = await r2Request("GET", id);
      if (response.ok) return new Response(response.body, {headers:{"Content-Type": response.headers.get("content-type") ?? "application/octet-stream", "X-Content-Type-Options":"nosniff", "Cache-Control":"public, max-age=31536000, immutable"}});
      if (response.status !== 404) { console.error(`[public media] R2 read failed: ${response.status}`); return new Response("Media temporarily unavailable", {status:503}); }
    } catch (error) { console.error("[public media] R2 connection error", error instanceof Error ? error.name : "unknown"); return new Response("Media temporarily unavailable", {status:503}); }
  }
  // Legacy PostgreSQL uploads remain readable after switching to R2.
  if (!process.env.DATABASE_URL) return new Response("Not found", {status:404});
  try {
    const sql = getSqlClient();
    const rows = await sql`SELECT mime, contents FROM uploaded_media WHERE id=${id} LIMIT 1`;
    if (!rows.length) return new Response("Not found", {status:404});
    return new Response(new Uint8Array(rows[0].contents), {headers:{"Content-Type":rows[0].mime,"X-Content-Type-Options":"nosniff","Cache-Control":"public, max-age=31536000, immutable"}});
  } catch { return new Response("Not found", {status:404}); }

}
