import { NextRequest, NextResponse } from "next/server";
import type { ApiEnvelope, AuthTokenBundle } from "@/shared/lib/api-types";
import { requestBackend } from "@/server/backend";
import { clearPostLoginRedirect, consumePostLoginRedirect, setAuthCookies } from "@/server/session";

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => null)) as { ticket?: string } | null;
  if (!payload?.ticket) {
    return NextResponse.json({ message: "ticket is required" }, { status: 400 });
  }

  const result = await requestBackend<AuthTokenBundle>({
    path: "/api/auth/exchange-ticket",
    method: "POST",
    ignoreAuth: true,
    tenantId: null,
    body: { ticket: payload.ticket },
  });

  if (!result.ok) {
    return NextResponse.json({ message: result.error.message, code: result.error.code }, { status: result.status });
  }

  const redirectTo = consumePostLoginRedirect(request.cookies);
  const response = NextResponse.json({ redirectTo });
  setAuthCookies(response, result.data);
  clearPostLoginRedirect(response);
  return response;
}
