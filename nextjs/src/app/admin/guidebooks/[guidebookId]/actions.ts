"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import type { GuidebookSummary, GuidebookUpdateRequest, PageCreateRequest, PageDetail } from "@/shared/lib/api-types";
import { buildAdminGuidebookHref, buildAdminPageHref } from "@/shared/lib/routes";
import { requestBackend } from "@/server/backend";

function readValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function buildGuidebookFlashHref(guidebookId: number, tenantId: number | null, status?: "updated" | "error", code?: string | null) {
  const base = buildAdminGuidebookHref(guidebookId, tenantId);
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

export async function updateGuidebookAction(guidebookId: number, tenantId: number | null, formData: FormData) {
  const name = readValue(formData, "name");
  const description = readValue(formData, "description") || null;
  const status = (readValue(formData, "status") || null) as GuidebookUpdateRequest["status"];

  const result = await requestBackend<GuidebookSummary>({
    path: `/api/guidebooks/${guidebookId}`,
    method: "PATCH",
    tenantId,
    body: {
      name: name || null,
      description,
      status,
    } satisfies GuidebookUpdateRequest,
  });

  if (!result.ok) {
    redirect(buildGuidebookFlashHref(guidebookId, tenantId, "error", result.error.code) as Route);
  }

  redirect(buildGuidebookFlashHref(guidebookId, tenantId, "updated") as Route);
}

export async function createPageAction(guidebookId: number, tenantId: number | null, formData: FormData) {
  const title = readValue(formData, "title");
  const content = readValue(formData, "content");
  const status = (readValue(formData, "status") || "PUBLISHED") as PageCreateRequest["status"];

  if (!title) {
    redirect(buildGuidebookFlashHref(guidebookId, tenantId, "error", "PAGE_TITLE_REQUIRED") as Route);
  }

  const result = await requestBackend<PageDetail["page"]>({
    path: `/api/guidebooks/${guidebookId}/pages`,
    method: "POST",
    tenantId,
    body: {
      title,
      sections: [
        {
          type: "MARKDOWN",
          content: content || `# ${title}\n\n새 문서를 시작하세요.`,
        },
      ],
      meta: {},
      status,
      accessPolicy: "INHERIT",
      isUsable: true,
    } satisfies PageCreateRequest,
  });

  if (!result.ok) {
    redirect(buildGuidebookFlashHref(guidebookId, tenantId, "error", result.error.code) as Route);
  }

  redirect(buildAdminPageHref(result.data.pageId, tenantId) as Route);
}
