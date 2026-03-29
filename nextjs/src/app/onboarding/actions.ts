"use server";

import type { Route } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { GuidebookCreateRequest, GuidebookSummary, TenantCreateRequest, TenantResponse } from "@/shared/lib/api-types";
import { buildOnboardingHref, buildTenantHref } from "@/shared/lib/routes";
import { slugifyCode } from "@/shared/lib/slugs";
import { requestBackend } from "@/server/backend";
import { writeTenantCookie } from "@/server/session";

function readValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function buildOnboardingErrorHref(code: string, redirectTo?: string | null) {
  const params = new URLSearchParams();
  params.set("error", code);
  if (redirectTo && redirectTo !== "/onboarding") {
    params.set("redirect", redirectTo);
  }
  return `/onboarding?${params.toString()}`;
}

function buildPostOnboardingDestination(redirectTo: string | null, tenantId: number) {
  if (!redirectTo || redirectTo === "/" || redirectTo.startsWith("/onboarding") || redirectTo.startsWith("/introduce")) {
    return buildTenantHref(tenantId);
  }

  const url = new URL(redirectTo, "http://localhost");
  if (url.pathname.startsWith("/search") || url.pathname.startsWith("/guidebooks/") || url.pathname.startsWith("/admin/")) {
    url.searchParams.set("tenantId", String(tenantId));
    return `${url.pathname}${url.search}${url.hash}`;
  }

  if (url.pathname.startsWith("/tenant/")) {
    return `${url.pathname}${url.search}${url.hash}`;
  }

  return buildTenantHref(tenantId);
}

export async function createWorkspaceAction(formData: FormData) {
  const redirectTo = readValue(formData, "redirect") || null;
  const tenantName = readValue(formData, "tenantName");
  const tenantCode = readValue(formData, "tenantCode") || slugifyCode(tenantName, "workspace");
  const visibility = (readValue(formData, "visibility") || "PRIVATE") as TenantCreateRequest["visibility"];
  const guidebookName = readValue(formData, "guidebookName");
  const guidebookCode = readValue(formData, "guidebookCode") || slugifyCode(guidebookName, "guidebook");
  const guidebookDescription = readValue(formData, "guidebookDescription") || null;

  if (!tenantName || !guidebookName) {
    redirect(buildOnboardingErrorHref("FORM_INVALID", redirectTo) as Route);
  }

  const tenantResult = await requestBackend<TenantResponse>({
    path: "/api/tenants",
    method: "POST",
    body: {
      tenantCode,
      name: tenantName,
      visibility,
    } satisfies TenantCreateRequest,
  });

  if (!tenantResult.ok) {
    redirect(buildOnboardingErrorHref(tenantResult.error.code, redirectTo) as Route);
  }

  const tenantId = tenantResult.data.tenantId;

  const guidebookResult = await requestBackend<GuidebookSummary>({
    path: "/api/guidebooks",
    method: "POST",
    tenantId,
    body: {
      code: guidebookCode,
      name: guidebookName,
      description: guidebookDescription,
      status: "PUBLISHED",
    } satisfies GuidebookCreateRequest,
  });

  if (!guidebookResult.ok) {
    redirect(buildOnboardingErrorHref(guidebookResult.error.code, redirectTo) as Route);
  }

  const cookieStore = await cookies();
  writeTenantCookie(cookieStore, tenantId);
  redirect(buildPostOnboardingDestination(redirectTo, tenantId) as Route);
}
