"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { useTransition } from "react";
import type { ViewerSession } from "@/shared/lib/api-types";
import { buildAdminGuidebookHref, buildSearchHref } from "@/shared/lib/routes";

type WorkspaceRailProps = {
  viewer: ViewerSession;
};

type RailItem = {
  label: string;
  href?: Route;
  active?: boolean;
};

export function WorkspaceRail({ viewer }: WorkspaceRailProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const activeTenantId = searchParams.get("tenantId") ?? (viewer.activeTenantId != null ? String(viewer.activeTenantId) : null);
  const guidebookMatch = pathname.match(/^\/admin\/guidebooks\/(\d+)/);
  const currentGuidebookId = guidebookMatch ? Number(guidebookMatch[1]) : null;

  const railItems = getRailItems(pathname, activeTenantId);

  const logout = async () => {
    await fetch("/api/session/logout", { method: "POST" });
    startTransition(() => {
      router.push("/" as Route);
      router.refresh();
    });
  };

  return (
    <aside className="hidden min-h-[calc(100vh-49px)] border-r border-border/70 bg-[#f3efe7] lg:col-span-2 lg:flex lg:flex-col">
      <div className="border-b border-border/70 px-5 py-4">
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Product Ops</p>
        <p className="mt-1 text-sm font-medium text-foreground">
          {viewer.user?.displayName ?? "Archive Team"}
        </p>
      </div>

      <div className="px-5 py-5">
        {activeTenantId ? (
          <Link
            href={(currentGuidebookId
              ? buildAdminGuidebookHref(currentGuidebookId, activeTenantId)
              : buildSearchHref("", activeTenantId)) as Route}
            className="inline-flex w-full items-center justify-center rounded-[6px] bg-primary px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-primary/92"
          >
            {currentGuidebookId ? "Manage archive" : "Open archive"}
          </Link>
        ) : (
          <div className="rounded-[8px] border border-dashed border-border px-4 py-4 text-xs leading-6 text-muted-foreground">
            상단에서 workspace를 선택하면 검색과 관리 진입 링크가 활성화됩니다.
          </div>
        )}
      </div>

      <nav className="flex-1 px-3">
        <div className="space-y-1 border-t border-border/70 pt-4">
          {railItems.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className={clsx(
                  "flex items-center rounded-[6px] px-3 py-2.5 text-sm transition-colors",
                  item.active ? "bg-background text-foreground shadow-[0_1px_0_rgba(255,255,255,0.8)]" : "text-muted-foreground hover:bg-background/80 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ) : (
              <div
                key={item.label}
                className={clsx(
                  "flex items-center rounded-[6px] px-3 py-2.5 text-sm",
                  item.active ? "bg-background text-foreground shadow-[0_1px_0_rgba(255,255,255,0.8)]" : "text-muted-foreground",
                )}
              >
                {item.label}
              </div>
            ),
          )}
        </div>
      </nav>

      <div className="space-y-2 border-t border-border/70 px-5 py-4 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        <Link href="/me" className="block hover:text-foreground">
          Session
        </Link>
        {viewer.user ? (
          <button type="button" onClick={logout} className="block text-left text-[11px] uppercase tracking-[0.16em] hover:text-foreground">
            {isPending ? "Signing out" : "Log out"}
          </button>
        ) : (
          <Link href="/login" className="block hover:text-foreground">
            Log in
          </Link>
        )}
      </div>
    </aside>
  );
}

function getRailItems(pathname: string, activeTenantId: string | null): RailItem[] {
  if (pathname.startsWith("/search")) {
    return [
      { label: "Workspace", href: buildSearchHref("", activeTenantId) as Route, active: true },
      { label: "Analytics" },
      { label: "Contributors" },
      { label: "History" },
      { label: "Settings" },
    ];
  }

  if (pathname.startsWith("/guidebooks") || pathname.startsWith("/t/")) {
    return [
      { label: "Archive", active: true },
      { label: "Guidelines" },
      { label: "Operations" },
      { label: "Recent updates" },
      { label: "Resources" },
    ];
  }

  if (pathname.startsWith("/admin")) {
    return [
      { label: "Workspaces", active: true },
      { label: "Recent activity" },
      { label: "Shared drafts" },
      { label: "Team directory" },
      { label: "Resources" },
    ];
  }

  return [
    { label: "Guidebooks", active: pathname === "/" },
    { label: "Pinned" },
    { label: "Recent" },
    { label: "Analytics" },
    { label: "Archives" },
  ];
}
