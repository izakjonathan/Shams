import { randomUUID } from "node:crypto";
import postgres from "postgres";
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
export async function POST(request: Request) {
  if (!await getAdminIdentity()) return NextResponse.json({ error: "Sign in to upload." }, { status: 401 });
  try { requireContentWritable(); } catch { return NextResponse.json({ error: "Uploads are not enabled in this environment." }, { status: 403 }); }
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BYTES + 100_000) return NextResponse.json({ error: "Image exceeds the 12 MB limit." }, { status: 413 });
  try {
    const data = await request.formData();
    const file = data.get("file");
    if (!(file instanceof File) || file.size === 0 || file.size > MAX_BYTES) return NextResponse.json({ error: "Choose an image smaller than 12 MB." }, { status: 400 });
    const bytes = new Uint8Array(await file.arrayBuffer());
    const mime = detectImageType(bytes);
    if (!mime || mime !== file.type) return NextResponse.json({ error: "Only valid JPEG, PNG, WebP and AVIF images are supported." }, { status: 400 });
    const id = randomUUID();
    const sql = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false, connect_timeout: 10 });
    try {
      await sql`CREATE TABLE IF NOT EXISTS uploaded_media (id uuid PRIMARY KEY, mime text NOT NULL, contents bytea NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`;
      await sql`INSERT INTO uploaded_media (id,mime,contents) VALUES (${id},${mime},${sql`decode(${Buffer.from(bytes).toString("base64")}, 'base64')`})`;
    } finally { await sql.end(); }
    return NextResponse.json({ path: `/api/media/${id}` });
  } catch (error) {
    console.error("[admin media] Upload failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "Upload failed. Check database availability and try again." }, { status: 500 });
  }
}
