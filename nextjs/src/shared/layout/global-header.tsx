"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { clsx } from "clsx";
import type { ViewerSession } from "@/shared/lib/api-types";
import { buildLoginHref, buildSearchHref } from "@/shared/lib/routes";
import { Bell, Book, ChevronDown, Layers, Search as SearchIcon, User } from "@/shared/icons";
import { buttonStyles } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

type GlobalHeaderProps = {
  viewer: ViewerSession;
};

export function GlobalHeader({ viewer }: GlobalHeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [isPending, startTransition] = useTransition();
  const [isTenantOpen, setIsTenantOpen] = useState(false);

  const activeTenantId = searchParams.get("tenantId") ?? (viewer.activeTenantId != null ? String(viewer.activeTenantId) : null);
  const currentSearch = searchParams.toString();
  const loginHref = buildLoginHref(pathname ? `${pathname}${currentSearch ? `?${currentSearch}` : ""}` : null);

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

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-5 md:px-8">
        <Link href="/" className="flex items-center gap-3 text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-panel-soft">
            <Book className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Guidebook</p>
            <p className="text-sm font-semibold tracking-tight">Operational Wiki</p>
          </div>
        </Link>

        <form onSubmit={submitSearch} className="ml-auto hidden min-w-0 flex-1 items-center md:flex">
          <div className="relative ml-6 w-full max-w-xl">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="문서, 제목, 용어를 검색하세요"
              className="h-11 border-border bg-panel pl-11 pr-4"
            />
          </div>
        </form>

        {viewer.user ? (
          <>
            <div className="relative">
              <button
                type="button"
                className={buttonStyles({ variant: "outline", size: "sm" })}
                onClick={() => setIsTenantOpen((current) => !current)}
              >
                <Layers className="h-4 w-4" />
                <span className="hidden md:inline">Workspace</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {isTenantOpen ? (
                <div className="absolute right-0 mt-3 w-72 rounded-[24px] border border-border bg-background p-2 shadow-[0_20px_60px_rgba(16,24,40,0.14)]">
                  {viewer.tenants.length > 0 ? (
                    viewer.tenants.map((tenant) => {
                      const active = activeTenantId === String(tenant.tenantId);
                      return (
                        <button
                          key={tenant.tenantId}
                          type="button"
                          onClick={() => setTenant(String(tenant.tenantId))}
                          className={clsx(
                            "flex w-full items-start justify-between rounded-[18px] px-3 py-3 text-left transition-colors",
                            active ? "bg-panel text-foreground" : "hover:bg-panel-soft",
                          )}
                        >
                          <div>
                            <p className="text-sm font-medium">{tenant.name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{tenant.tenantCode}</p>
                          </div>
                          <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{tenant.role}</span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="rounded-[18px] px-3 py-4 text-sm text-muted-foreground">연결된 워크스페이스가 없습니다.</div>
                  )}
                </div>
              ) : null}
            </div>

            <Link href="/me" className={buttonStyles({ variant: "quiet", size: "sm" })}>
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Session</span>
            </Link>
            <button type="button" onClick={logout} className={buttonStyles({ variant: "outline", size: "sm" })}>
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{isPending ? "..." : viewer.user.displayName}</span>
            </button>
          </>
        ) : (
          <Link href={loginHref} className={buttonStyles({ size: "sm" })}>
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
