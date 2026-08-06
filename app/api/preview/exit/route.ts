import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  const response = NextResponse.redirect(new URL("/admin", request.url));
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
