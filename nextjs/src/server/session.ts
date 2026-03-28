import type { NextResponse } from "next/server";
import type { AuthTokenBundle } from "@/shared/lib/api-types";
import { sessionCookieNames } from "@/server/env";

type CookieReader = {
  get(name: string): { value: string } | undefined;
};

export type SessionSnapshot = {
  accessToken: string | null;
  refreshToken: string | null;
  tenantId: number | null;
};

const sharedCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: false,
  path: "/",
};

export function readSessionSnapshot(cookies: CookieReader): SessionSnapshot {
  const tenantValue = cookies.get(sessionCookieNames.tenantId)?.value;
  return {
    accessToken: cookies.get(sessionCookieNames.accessToken)?.value ?? null,
    refreshToken: cookies.get(sessionCookieNames.refreshToken)?.value ?? null,
    tenantId: tenantValue ? Number(tenantValue) : null,
  };
}

export function setAuthCookies(response: NextResponse, tokens: AuthTokenBundle) {
  response.cookies.set(sessionCookieNames.accessToken, tokens.accessToken, sharedCookieOptions);
  response.cookies.set(sessionCookieNames.refreshToken, tokens.refreshToken, sharedCookieOptions);
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(sessionCookieNames.accessToken, "", { ...sharedCookieOptions, maxAge: 0 });
  response.cookies.set(sessionCookieNames.refreshToken, "", { ...sharedCookieOptions, maxAge: 0 });
}

export function setTenantCookie(response: NextResponse, tenantId: number | string) {
  response.cookies.set(sessionCookieNames.tenantId, String(tenantId), sharedCookieOptions);
}

export function clearTenantCookie(response: NextResponse) {
  response.cookies.set(sessionCookieNames.tenantId, "", { ...sharedCookieOptions, maxAge: 0 });
}

export function setPostLoginRedirectCookie(response: NextResponse, redirectTo: string) {
  response.cookies.set(sessionCookieNames.redirectTo, redirectTo, {
    ...sharedCookieOptions,
    httpOnly: true,
    maxAge: 60 * 10,
  });
}

export function consumePostLoginRedirect(cookies: CookieReader) {
  return cookies.get(sessionCookieNames.redirectTo)?.value ?? "/";
}

export function clearPostLoginRedirect(response: NextResponse) {
  response.cookies.set(sessionCookieNames.redirectTo, "", {
    ...sharedCookieOptions,
    maxAge: 0,
  });
}
