import { NextResponse } from "next/server";
import { clearAuthCookies, clearPostLoginRedirect, clearTenantCookie } from "@/server/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  clearTenantCookie(response);
  clearPostLoginRedirect(response);
  return response;
}
