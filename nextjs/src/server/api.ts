import { cookies } from "next/headers";
import type {
  BackendResult,
  FileAccessUrlsResponse,
  GuidebookListResponse,
  HomeResponse,
  PageDetail,
  PageListResponse,
  PageSearchResponse,
  PageStarListResponse,
  PermissionGateState,
  TenantResponse,
  TenantMeResponse,
  UserMeResponse,
  ViewerSession,
  WikiNavTree,
} from "@/shared/lib/api-types";
import { requestBackend } from "@/server/backend";
import { readSessionSnapshot } from "@/server/session";

export async function loadViewerSession(): Promise<ViewerSession> {
  const cookieStore = await cookies();
  const session = readSessionSnapshot(cookieStore);

  const [userResult, tenantResult] = await Promise.all([
    requestBackend<UserMeResponse>({
      path: "/api/users/me",
      tenantId: null,
    }),
    requestBackend<TenantMeResponse>({
      path: "/api/tenants/me",
      tenantId: null,
    }),
  ]);

  return {
    user: userResult.ok
      ? {
          ...userResult.data,
          linkedProviders: userResult.data.linkedProviders ?? [],
        }
      : null,
    tenants: tenantResult.ok ? tenantResult.data.items : [],
    activeTenantId: session.tenantId,
  };
}

export function getActiveTenantId(fallback?: string | string[] | null) {
  if (typeof fallback === "string" && fallback) {
    return Number(fallback);
  }
  return null;
}

export async function loadHome() {
  return requestBackend<HomeResponse>({
    path: "/api/home",
    tenantId: null,
  });
}

export async function loadPageDetail(pageId: number, tenantId: number | null) {
  return requestBackend<PageDetail>({
    path: `/api/pages/${pageId}`,
    tenantId,
  });
}

export async function loadGuidebookNav(guidebookId: number, tenantId: number | null) {
  return requestBackend<WikiNavTree>({
    path: "/api/wiki/nav",
    tenantId,
    query: {
      guidebookId,
    },
  });
}

export async function loadSearch(input: {
  query: string;
  guidebookId?: number | null;
  tenantId: number | null;
  cursor?: string | null;
  size?: number;
}): Promise<BackendResult<PageSearchResponse>> {
  return requestBackend<PageSearchResponse>({
    path: "/api/search/pages",
    tenantId: input.tenantId,
    query: {
      q: input.query,
      guidebookId: input.guidebookId ?? null,
      cursor: input.cursor ?? null,
      size: input.size ?? 20,
    },
  });
}

export async function loadStarredPages(cursor?: string | null, size = 100) {
  return requestBackend<PageStarListResponse>({
    path: "/api/pages/starred",
    tenantId: null,
    query: {
      cursor: cursor ?? null,
      size,
    },
  });
}

export async function loadGuidebookPages(guidebookId: number, tenantId: number | null) {
  return requestBackend<PageListResponse>({
    path: `/api/guidebooks/${guidebookId}/pages`,
    tenantId,
  });
}

export async function loadGuidebooks(tenantId: number | null) {
  return requestBackend<GuidebookListResponse>({
    path: "/api/guidebooks",
    tenantId,
  });
}

export async function loadTenant(tenantId: number) {
  return requestBackend<TenantResponse>({
    path: `/api/tenants/${tenantId}`,
    tenantId: null,
  });
}

export async function loadFileAccessUrls(fileIds: number[], expiresInSeconds = 900) {
  if (fileIds.length === 0) {
    return {
      ok: true as const,
      status: 200,
      data: {
        items: [],
        byId: {},
      } satisfies FileAccessUrlsResponse,
      error: null,
    };
  }

  return requestBackend<FileAccessUrlsResponse>({
    path: "/api/files/access-urls",
    method: "POST",
    tenantId: null,
    body: {
      fileIds,
      expiresInSeconds,
    },
  });
}

export async function loadGuidebookPermissionMe(guidebookId: number, tenantId: number | null) {
  return requestBackend<PermissionGateState>({
    path: `/api/guidebooks/${guidebookId}/permissions/me`,
    tenantId,
  });
}

export async function loadPagePermissionMe(pageId: number, tenantId: number | null) {
  return requestBackend<PermissionGateState>({
    path: `/api/pages/${pageId}/permissions/me`,
    tenantId,
  });
}
