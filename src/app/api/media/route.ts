import { randomUUID } from "node:crypto";
import { getSqlClient } from "../../../db/client";
import { NextResponse } from "next/server";
import { getAdminIdentity } from "../../../features/admin/server/auth";
import { requireContentWritable } from "../../../features/admin/server/write-policy";


export const runtime = "nodejs";
const MAX_BYTES = 12 * 1024 * 1024;
export function detectImageType(bytes: Uint8Array): string | null {
  if (bytes.length < 16) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a) return "image/png";
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.subarray(from, to));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  if (ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12))) return "image/avif";
  return null;
}
async function boundedMultipart(request: Request): Promise<FormData> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing upload body.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES + 100_000) throw new Error("Upload body exceeds the 12 MB limit.");
      chunks.push(value);
    }
  } finally { await reader.cancel().catch(() => {}); }
  const body = Buffer.concat(chunks.map(chunk => Buffer.from(chunk)));
  return new Request(request.url, { method: "POST", headers: { "content-type": request.headers.get("content-type") ?? "" }, body }).formData();
}
export async function GET() {
  if (!await getAdminIdentity()) return NextResponse.json({ error: "Sign in to upload." }, { status: 401 });
  return NextResponse.json({ storage: process.env.MEDIA_STORAGE === "blob" ? "blob" : "database" }, { headers: { "Cache-Control": "no-store" } });
}
export async function POST(request: Request) {
  if (process.env.MEDIA_STORAGE === "blob") return NextResponse.json({ error: "Use direct Vercel Blob uploads." }, { status: 409 });
  if (!await getAdminIdentity()) return NextResponse.json({ error: "Sign in to upload." }, { status: 401 });
  // Cookie-authenticated uploads must not be accepted from another origin.
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid upload origin." }, { status: 403 });
  try { requireContentWritable(); } catch { return NextResponse.json({ error: "Uploads are not enabled in this environment." }, { status: 403 }); }
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BYTES + 100_000) return NextResponse.json({ error: "Image exceeds the 12 MB limit." }, { status: 413 });
  try {
    const data = await boundedMultipart(request);
    const file = data.get("file");
    if (!(file instanceof File) || file.size === 0 || file.size > MAX_BYTES) return NextResponse.json({ error: "Choose an image smaller than 12 MB." }, { status: 400 });
    const bytes = new Uint8Array(await file.arrayBuffer());
    const mime = detectImageType(bytes);
    if (!mime || mime !== file.type) return NextResponse.json({ error: "Only valid JPEG, PNG, WebP and AVIF images are supported." }, { status: 400 });
    const id = randomUUID();
    const sql = getSqlClient();
    await sql`CREATE TABLE IF NOT EXISTS uploaded_media (id uuid PRIMARY KEY, mime text NOT NULL, contents bytea NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`;
    await sql`INSERT INTO uploaded_media (id,mime,contents) VALUES (${id},${mime},${sql`decode(${Buffer.from(bytes).toString("base64")}, 'base64')`})`;
    return NextResponse.json({ path: `/api/media/${id}` });
  } catch (error) {
    if (error instanceof Error && error.message.includes("exceeds the 12 MB limit")) return NextResponse.json({error: error.message}, {status:413});
    console.error("[admin media] Upload failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "Upload failed. Check storage configuration and try again." }, { status: 500 });
  }
}
