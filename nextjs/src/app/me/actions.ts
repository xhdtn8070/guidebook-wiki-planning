"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import type { UserMeResponse } from "@/shared/lib/api-types";
import { requestBackend } from "@/server/backend";

function readValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function buildProfileHref(status?: "updated" | "error", code?: string | null) {
  if (!status) {
    return "/me";
  }

  const params = new URLSearchParams();
  params.set("status", status);
  if (code) {
    params.set("code", code);
  }
  return `/me?${params.toString()}`;
}

export async function updateProfileAction(formData: FormData) {
  const displayName = readValue(formData, "displayName");
  if (!displayName) {
    redirect(buildProfileHref("error", "DISPLAY_NAME_REQUIRED") as Route);
  }

  const result = await requestBackend<UserMeResponse>({
    path: "/api/users/me",
    method: "PATCH",
    tenantId: null,
    body: {
      displayName,
    },
  });

  if (!result.ok) {
    redirect(buildProfileHref("error", result.error.code) as Route);
  }

  redirect(buildProfileHref("updated") as Route);
}
