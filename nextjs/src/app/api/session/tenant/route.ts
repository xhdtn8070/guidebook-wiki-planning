import { NextRequest, NextResponse } from "next/server";
import { clearTenantCookie, setTenantCookie } from "@/server/session";

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => null)) as { tenantId?: string | number | null } | null;
  const response = NextResponse.json({ ok: true });

  if (!payload?.tenantId) {
    clearTenantCookie(response);
    return response;
  }

  setTenantCookie(response, payload.tenantId);
  return response;
}
