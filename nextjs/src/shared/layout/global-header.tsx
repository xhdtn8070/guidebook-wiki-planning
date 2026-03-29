"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { clsx } from "clsx";
import type { ViewerSession } from "@/shared/lib/api-types";
import { buildLoginHref, buildSearchHref } from "@/shared/lib/routes";
import { Bell, Book, ChevronDown, Layers, Search as SearchIcon, User } from "@/shared/icons";
import { Input } from "@/shared/ui/input";

type GlobalHeaderProps = {
  viewer: ViewerSession;
  variant?: "workspace" | "minimal";
};

export function GlobalHeader({ viewer, variant = "workspace" }: GlobalHeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [isPending, startTransition] = useTransition();
  const [isTenantOpen, setIsTenantOpen] = useState(false);

  const activeTenantId = searchParams.get("tenantId") ?? (viewer.activeTenantId != null ? String(viewer.activeTenantId) : null);
  const currentSearch = searchParams.toString();
  const loginHref = buildLoginHref(pathname ? `${pathname}${currentSearch ? `?${currentSearch}` : ""}` : null);
  const topNav = getTopNav(pathname);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      router.push(buildSearchHref(query, activeTenantId) as Route);
    });
  };

  const setTenant = async (tenantId: string) => {
    await fetch("/api/session/tenant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tenantId }),
    });

    const next = new URLSearchParams(searchParams.toString());
    next.set("tenantId", tenantId);
    const nextUrl = `${pathname}${next.toString() ? `?${next.toString()}` : ""}`;
    startTransition(() => {
      router.replace(nextUrl as Route);
      router.refresh();
    });
    setIsTenantOpen(false);
  };

  const logout = async () => {
    await fetch("/api/session/logout", { method: "POST" });
    startTransition(() => {
      router.push("/" as Route);
      router.refresh();
    });
  };

  if (variant === "minimal") {
    return (
      <header className="surface-blur sticky top-0 z-40 border-b border-border/70 bg-background/88">
        <div className="mx-auto flex h-14 max-w-[1320px] items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-3 text-foreground">
            <Book className="h-4 w-4" />
            <div>
              <p className="text-sm font-medium tracking-tight">Guidebook Wiki</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {topNav.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href as Route}
                className={clsx(
                  "text-[11px] uppercase tracking-[0.16em] transition-colors",
                  item.active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {viewer.user ? (
              <Link href="/me" className="inline-flex h-9 min-w-9 items-center justify-center rounded-[6px] border border-border bg-panel px-3 text-sm">
                <User className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href={loginHref}
                className="inline-flex h-9 items-center rounded-[6px] border border-primary bg-primary px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground"
              >
                Profile
              </Link>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="surface-blur sticky top-0 z-40 border-b border-border/70 bg-background/88">
      <div className="mx-auto grid h-12 max-w-[1500px] grid-cols-1 lg:grid-cols-12">
        <div className="hidden border-r border-border/70 bg-[#f3efe7] lg:col-span-2 lg:block" />
        <div className="flex items-center justify-between gap-5 px-5 md:px-8 lg:col-span-10 lg:px-10">
          <div className="flex min-w-0 items-center gap-6">
            <Link href="/" className="shrink-0 text-sm font-medium tracking-tight text-foreground">
              Guidebook Wiki
            </Link>
            <nav className="hidden items-center gap-5 lg:flex">
              {topNav.map((item) => (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href as Route}
                  className={clsx(
                    "text-[11px] uppercase tracking-[0.16em] transition-colors",
                    item.active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex min-w-0 items-center gap-3">
            <form onSubmit={submitSearch} className="hidden min-w-0 items-center md:flex">
              <div className="relative w-[260px]">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search resources..."
                  className="h-9 border-border/80 bg-[#f7f3ec] pl-9 text-xs"
                />
              </div>
            </form>

            {viewer.user ? (
              <>
                <div className="relative">
                  <button
                    type="button"
                    className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-border bg-panel px-3 text-[11px] uppercase tracking-[0.16em] text-foreground"
                    onClick={() => setIsTenantOpen((current) => !current)}
                  >
                    <Layers className="h-4 w-4" />
                    <span className="hidden lg:inline">Workspace</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {isTenantOpen ? (
                    <div className="absolute right-0 mt-3 w-72 rounded-[10px] border border-border bg-panel p-2 shadow-[0_18px_50px_rgba(44,35,26,0.12)]">
                      {viewer.tenants.length > 0 ? (
                        viewer.tenants.map((tenant) => {
                          const active = activeTenantId === String(tenant.tenantId);
                          return (
                            <button
                              key={tenant.tenantId}
                              type="button"
                              onClick={() => setTenant(String(tenant.tenantId))}
                              className={clsx(
                                "flex w-full items-start justify-between rounded-[8px] px-3 py-3 text-left transition-colors",
                                active ? "bg-[#f1ede5] text-foreground" : "hover:bg-[#f7f3ec]",
                              )}
                            >
                              <div>
                                <p className="text-sm font-medium">{tenant.name}</p>
                                <p className="mt-1 text-xs text-muted-foreground">{tenant.tenantCode}</p>
                              </div>
                              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{tenant.role}</span>
                            </button>
                          );
                        })
                      ) : (
                        <div className="rounded-[8px] px-3 py-4 text-sm text-muted-foreground">연결된 워크스페이스가 없습니다.</div>
                      )}
                    </div>
                  ) : null}
                </div>

                <Link href="/me" className="inline-flex h-9 min-w-9 items-center justify-center rounded-[6px] border border-border bg-panel px-3 text-foreground">
                  <Bell className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-border bg-panel px-3 text-[11px] uppercase tracking-[0.16em] text-foreground"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{isPending ? "..." : viewer.user.displayName}</span>
                </button>
              </>
            ) : (
              <Link
                href={loginHref}
                className="inline-flex h-9 items-center rounded-[6px] border border-primary bg-primary px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground"
              >
                Profile
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function getTopNav(pathname: string) {
  if (pathname.startsWith("/search")) {
    return [
      { label: "Documents", href: "/search", active: true },
      { label: "Shared", href: "/search" },
      { label: "Drafts", href: "/search" },
      { label: "Archive", href: "/search" },
    ];
  }

  if (pathname.startsWith("/guidebooks") || pathname.startsWith("/t/")) {
    return [
      { label: "Guidelines", href: "/", active: false },
      { label: "Operations", href: "/", active: false },
      { label: "Product", href: "/", active: false },
      { label: "Archive", href: "/search", active: true },
    ];
  }

  if (pathname.startsWith("/admin")) {
    return [
      { label: "Guidelines", href: "/", active: false },
      { label: "Operations", href: "/", active: false },
      { label: "Product", href: "/", active: false },
      { label: "Archive", href: "/search", active: true },
    ];
  }

  return [
    { label: "Archives", href: "/search", active: false },
    { label: "Search", href: "/search", active: false },
    { label: "Admin", href: "/admin/guidebooks/1", active: false },
  ];
}
