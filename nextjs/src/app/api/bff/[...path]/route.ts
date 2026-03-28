import { NextRequest, NextResponse } from "next/server";
import { requestBackend } from "@/server/backend";
import { clearAuthCookies, setAuthCookies } from "@/server/session";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function handle(request: NextRequest, context: RouteContext) {
  const resolvedParams = await context.params;
  const path = `/${resolvedParams.path.join("/")}`;
  const query: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    query[key] = value;
  });
  const rawBody = request.method === "GET" || request.method === "DELETE" ? null : await request.text();
  const tenantId = request.headers.get("x-guidebook-tenant-id") ?? request.cookies.get("guidebook_tenant_id")?.value ?? null;

  const result = await requestBackend<unknown>({
    path: `/api${path}`,
    method: request.method as "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
    query,
    tenantId,
    ignoreAuth: false,
    body: rawBody ? JSON.parse(rawBody) : undefined,
  });

  const response = NextResponse.json(result.ok ? result.data : { error: result.error }, { status: result.status });

  if (result.refreshedTokens) {
    setAuthCookies(response, result.refreshedTokens);
  } else if (result.status === 401) {
    clearAuthCookies(response);
  }

  return response;
}

export async function GET(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}
