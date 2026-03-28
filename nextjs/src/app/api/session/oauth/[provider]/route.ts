import { NextRequest, NextResponse } from "next/server";
import { getBackendBaseUrl } from "@/server/env";
import { setPostLoginRedirectCookie } from "@/server/session";

type RouteContext = {
  params: Promise<{ provider: string }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  const resolvedParams = await params;
  const redirectTo = request.nextUrl.searchParams.get("redirect") || "/";
  const response = NextResponse.redirect(`${getBackendBaseUrl()}/api/oauth/${resolvedParams.provider}/login`);
  setPostLoginRedirectCookie(response, redirectTo);
  return response;
}
