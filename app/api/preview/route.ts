import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getAdminIdentity } from "../../admin/lib/auth";

export const runtime = "nodejs";

function safePath(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export async function GET(request: NextRequest) {
  if (!(await getAdminIdentity())) return NextResponse.redirect(new URL("/admin/login", request.url));
  (await draftMode()).enable();
  const response = NextResponse.redirect(new URL(safePath(request.nextUrl.searchParams.get("path")), request.url));
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
