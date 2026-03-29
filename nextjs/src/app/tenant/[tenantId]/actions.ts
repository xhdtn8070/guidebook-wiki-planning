"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import type { GuidebookCreateRequest, GuidebookSummary } from "@/shared/lib/api-types";
import { buildAdminGuidebookHref, buildTenantHref } from "@/shared/lib/routes";
import { slugifyCode } from "@/shared/lib/slugs";
import { requestBackend } from "@/server/backend";

function readValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function buildTenantStatusHref(tenantId: number, status?: "created" | "error", code?: string | null) {
  const base = buildTenantHref(tenantId);
  if (!status) {
    return base;
  }

  const params = new URLSearchParams();
  params.set("status", status);
  if (code) {
    params.set("code", code);
  }
  return `${base}?${params.toString()}`;
}

export async function createGuidebookAction(tenantId: number, formData: FormData) {
  const name = readValue(formData, "name");
  const code = readValue(formData, "code") || slugifyCode(name, "guidebook");
  const description = readValue(formData, "description") || null;
  const status = (readValue(formData, "status") || "PUBLISHED") as GuidebookCreateRequest["status"];

  if (!name) {
    redirect(buildTenantStatusHref(tenantId, "error", "GUIDEBOOK_NAME_REQUIRED") as Route);
  }

  const result = await requestBackend<GuidebookSummary>({
    path: "/api/guidebooks",
    method: "POST",
    tenantId,
    body: {
      code,
      name,
      description,
      status,
    } satisfies GuidebookCreateRequest,
  });

  if (!result.ok) {
    redirect(buildTenantStatusHref(tenantId, "error", result.error.code) as Route);
  }

  redirect(buildAdminGuidebookHref(result.data.guidebookId, tenantId) as Route);
}
