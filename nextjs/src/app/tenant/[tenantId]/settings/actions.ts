"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import type { TenantResponse, TenantUpdateRequest } from "@/shared/lib/api-types";
import { buildTenantSettingsHref } from "@/shared/lib/routes";
import { requestBackend } from "@/server/backend";

function readValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function buildSettingsHref(tenantId: number, status?: "updated" | "error", code?: string | null) {
  const base = buildTenantSettingsHref(tenantId);
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

export async function updateTenantSettingsAction(tenantId: number, formData: FormData) {
  const name = readValue(formData, "name");
  const visibility = readValue(formData, "visibility") as TenantUpdateRequest["visibility"];

  if (!name) {
    redirect(buildSettingsHref(tenantId, "error", "TENANT_NAME_REQUIRED") as Route);
  }

  const result = await requestBackend<TenantResponse>({
    path: "/api/tenants/me",
    method: "PATCH",
    tenantId,
    body: {
      name,
      visibility,
    } satisfies TenantUpdateRequest,
  });

  if (!result.ok) {
    redirect(buildSettingsHref(tenantId, "error", result.error.code) as Route);
  }

  redirect(buildSettingsHref(tenantId, "updated") as Route);
}
