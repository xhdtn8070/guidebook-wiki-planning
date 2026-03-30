"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import { requestBackend } from "@/server/backend";

function readValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function togglePageStarAction(formData: FormData) {
  const pageId = Number(readValue(formData, "pageId"));
  const intent = readValue(formData, "intent");
  const returnTo = readValue(formData, "returnTo") || "/";

  if (!Number.isFinite(pageId) || pageId <= 0) {
    redirect(returnTo as Route);
  }

  await requestBackend<boolean>({
    path: `/api/pages/${pageId}/star`,
    method: intent === "unstar" ? "DELETE" : "POST",
    tenantId: null,
  });

  redirect(returnTo as Route);
}
