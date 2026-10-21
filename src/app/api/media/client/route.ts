import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getAdminIdentity } from "../../../../features/admin/server/auth";
import { requireContentWritable } from "../../../../features/admin/server/write-policy";

export const runtime = "nodejs";
const MAX_BYTES = 12 * 1024 * 1024;
const MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/** Authenticated token generation; signed completion callbacks are checked by the SDK. */
export async function POST(request: Request) {
  if (process.env.MEDIA_STORAGE !== "blob" || !process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Vercel Blob storage is not configured." }, { status: 503 });
  }
  if (Number(request.headers.get("content-length") ?? 0) > 16_384) {
    return NextResponse.json({ error: "Invalid upload handshake." }, { status: 413 });
  }
  try {
    const body = await request.json() as HandleUploadBody;
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!await getAdminIdentity()) throw new Error("Sign in to upload.");
        const origin = request.headers.get("origin");
        if (!origin || origin !== new URL(request.url).origin) throw new Error("Invalid upload origin.");
        requireContentWritable();
        if (!/^shams\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(?:jpg|jpeg|png|webp|avif)$/i.test(pathname)) {
          throw new Error("Invalid upload filename.");
        }
        return { allowedContentTypes: MIME_TYPES, maximumSizeInBytes: MAX_BYTES, addRandomSuffix: true };
      },
      onUploadCompleted: async () => { /* The editor saves the resulting URL when the admin saves the record. */ },
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error("[admin media] Blob upload handshake failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "Could not authorize image upload." }, { status: 400 });
  }
}
