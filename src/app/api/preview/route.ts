import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getAdminIdentity } from "../../../features/admin/server/auth";

import { safePreviewUrl } from "../../../features/admin/server/preview-path";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!(await getAdminIdentity())) return NextResponse.redirect(new URL("/admin/login", request.url));
  (await draftMode()).enable();
  const response = NextResponse.redirect(safePreviewUrl(request.nextUrl.searchParams.get("path"), request.url));
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
