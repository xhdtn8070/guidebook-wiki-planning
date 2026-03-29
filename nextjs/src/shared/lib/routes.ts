import type { Route } from "next";

type PageLinkInput = {
  tenantId?: number | string | null;
  guidebookId: number | string;
  pageId: number | string;
};

type ParsedBackendPageUrl = {
  tenantId: number;
  guidebookId: number;
  pageId: number;
};

const backendPagePattern = /^\/t\/(?<tenantId>\d+)\/g\/(?<guidebookId>\d+)\/p\/(?<pageId>\d+)$/;

export function buildPageHref(input: PageLinkInput) {
  const path = `/guidebooks/${input.guidebookId}/pages/${input.pageId}`;
  const tenantId = input.tenantId == null ? null : String(input.tenantId);
  if (!tenantId) {
    return path;
  }
  return `${path}?tenantId=${tenantId}`;
}

export function buildIntroduceHref() {
  return "/introduce";
}

export function buildTenantHref(tenantId: number | string) {
  return `/tenant/${tenantId}`;
}

export function buildOnboardingHref(redirectTo?: string | null) {
  if (!redirectTo || redirectTo === "/" || redirectTo.startsWith("/onboarding")) {
    return "/onboarding";
  }
  return `/onboarding?redirect=${encodeURIComponent(redirectTo)}`;
}

export function buildAdminGuidebookHref(guidebookId: number | string, tenantId?: number | string | null) {
  const base = `/admin/guidebooks/${guidebookId}`;
  if (tenantId == null) {
    return base;
  }
  return `${base}?tenantId=${tenantId}`;
}

export function buildAdminPageHref(pageId: number | string, tenantId?: number | string | null) {
  const base = `/admin/pages/${pageId}`;
  if (tenantId == null) {
    return base;
  }
  return `${base}?tenantId=${tenantId}`;
}

export function buildSearchHref(query: string, tenantId?: number | string | null, guidebookId?: number | string | null) {
  const params = new URLSearchParams();
  if (query.trim()) {
    params.set("q", query.trim());
  }
  if (tenantId != null) {
    params.set("tenantId", String(tenantId));
  }
  if (guidebookId != null) {
    params.set("guidebookId", String(guidebookId));
  }
  const suffix = params.toString();
  return suffix ? `/search?${suffix}` : "/search";
}

export function buildLoginHref(redirectTo?: string | null): Route {
  if (!redirectTo || redirectTo === "/" || redirectTo.startsWith("/login") || redirectTo.startsWith("/auth")) {
    return "/login";
  }

  return `/login?redirect=${encodeURIComponent(redirectTo)}` as Route;
}

export function parseBackendPageUrl(url: string): ParsedBackendPageUrl | null {
  const match = backendPagePattern.exec(url);
  if (!match?.groups) {
    return null;
  }

  return {
    tenantId: Number(match.groups.tenantId),
    guidebookId: Number(match.groups.guidebookId),
    pageId: Number(match.groups.pageId),
  };
}

export function toFrontendHref(url: string, fallback?: Partial<ParsedBackendPageUrl>) {
  const parsed = parseBackendPageUrl(url);
  if (parsed) {
    return buildPageHref(parsed);
  }

  if (fallback?.guidebookId != null && fallback?.pageId != null) {
    return buildPageHref({
      guidebookId: fallback.guidebookId,
      pageId: fallback.pageId,
      tenantId: fallback.tenantId ?? null,
    });
  }

  return "/search";
}
