"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import type { PageDetail, PageUpdateRequest } from "@/shared/lib/api-types";
import { buildAdminPageHref } from "@/shared/lib/routes";
import { requestBackend } from "@/server/backend";

function readValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseSections(formData: FormData) {
  const raw = readValue(formData, "sectionsJson");
  if (!raw) {
    return {
      ok: true as const,
      value: null,
    };
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return {
        ok: false as const,
        code: "INVALID_SECTIONS_JSON",
      };
    }
    return {
      ok: true as const,
      value: parsed as PageUpdateRequest["sections"],
    };
  } catch {
    return {
      ok: false as const,
      code: "INVALID_SECTIONS_JSON",
    };
  }
}

function buildPageFlashHref(pageId: number, tenantId: number | null, status?: "updated" | "error", code?: string | null) {
  const base = buildAdminPageHref(pageId, tenantId);
  if (!status) {
    return base;
  }

  const params = new URLSearchParams();
  params.set("status", status);
  if (code) {
    params.set("code", code);
  }
  return `${base}${base.includes("?") ? "&" : "?"}${params.toString()}`;
}

export async function updatePageAction(pageId: number, tenantId: number | null, formData: FormData) {
  const title = readValue(formData, "title");
  const status = (readValue(formData, "status") || null) as PageUpdateRequest["status"];
  const accessPolicy = (readValue(formData, "accessPolicy") || null) as PageUpdateRequest["accessPolicy"];
  const isUsable = readValue(formData, "isUsable");
  const sections = parseSections(formData);

  if (!sections.ok) {
    redirect(buildPageFlashHref(pageId, tenantId, "error", sections.code) as Route);
  }

  const result = await requestBackend<PageDetail["page"]>({
    path: `/api/pages/${pageId}`,
    method: "PATCH",
    tenantId,
    body: {
      title: title || null,
      status,
      accessPolicy,
      isUsable: isUsable ? isUsable === "true" : null,
      sections: sections.value,
    } satisfies PageUpdateRequest,
  });

  if (!result.ok) {
    redirect(buildPageFlashHref(pageId, tenantId, "error", result.error.code) as Route);
  }

  redirect(buildPageFlashHref(pageId, tenantId, "updated") as Route);
}
