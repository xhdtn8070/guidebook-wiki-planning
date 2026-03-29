"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { clsx } from "clsx";
import type { ViewerSession } from "@/shared/lib/api-types";
import { buildLoginHref, buildSearchHref } from "@/shared/lib/routes";
import {
  BookOpen,
  ChevronDown,
  Layers,
  Monitor,
  Moon,
  Palette,
  Search as SearchIcon,
  Sun,
  User,
} from "@/shared/icons";
import { useTheme } from "@/shared/theme/theme-provider";
import { buttonStyles } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

type GlobalHeaderProps = {
  viewer: ViewerSession;
};

export function GlobalHeader({ viewer }: GlobalHeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme, mode, setTheme, toggleMode, themePresets } = useTheme();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [isPending, startTransition] = useTransition();
  const [isTenantOpen, setIsTenantOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const activeTenantId = searchParams.get("tenantId") ?? (viewer.activeTenantId != null ? String(viewer.activeTenantId) : null);
  const currentSearch = searchParams.toString();
  const loginHref = buildLoginHref(pathname ? `${pathname}${currentSearch ? `?${currentSearch}` : ""}` : null);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

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
    <header className="sticky top-0 z-50 border-b border-border bg-[hsl(var(--surface-strong)/0.94)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-3 px-4 md:px-6 xl:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3 text-foreground transition-opacity hover:opacity-90">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-sm font-extrabold text-primary shadow-glow">
            G
          </div>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-bold tracking-tight">Guidebook Wiki</p>
            <p className="truncate text-[11px] uppercase tracking-[0.18em] text-muted-foreground">API Docs Shell</p>
          </div>
        </Link>

        <div className="mx-auto flex min-w-0 flex-1 items-center justify-center gap-3">
          <Link href="/" className={clsx(buttonStyles({ variant: "outline", size: "sm" }), "hidden md:inline-flex border-border/70 bg-background/40")}>
            <BookOpen className="h-4 w-4" />
            Docs
          </Link>

          <form onSubmit={submitSearch} className="relative w-full max-w-xl">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search pages, terms, and code identifiers"
              className="h-10 border-border/70 bg-background/50 pl-10 pr-20"
            />
            <kbd className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-background/70 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground md:block">
              Search
            </kbd>
          </form>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="relative hidden md:block">
            <button
              type="button"
              className={clsx(buttonStyles({ variant: "quiet", size: "sm" }), "border border-transparent")}
              onClick={() => {
                setIsThemeOpen((current) => !current);
                setIsTenantOpen(false);
              }}
            >
              <Palette className="h-4 w-4" />
              <span className="hidden lg:inline">{themePresets[theme].label}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {isThemeOpen ? (
              <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-border bg-[hsl(var(--surface-elevated))] p-2 shadow-theme-lg">
                <div className="rounded-xl border border-border bg-background/40 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Preset</p>
                  <button
                    type="button"
                    onClick={() => {
                      setTheme("midnight");
                      setIsThemeOpen(false);
                    }}
                    className="mt-2 w-full rounded-xl border border-primary/30 bg-primary/10 px-3 py-3 text-left"
                  >
                    <p className="text-sm font-semibold text-foreground">{themePresets.midnight.label}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{themePresets.midnight.description}</p>
                  </button>
                </div>
                <div className="mt-2 rounded-xl border border-border bg-background/40 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Mode</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => toggleMode()}
                      className={clsx(buttonStyles({ variant: "outline", size: "sm" }), "flex-1 justify-center border-border/80 bg-transparent")}
                    >
                      {mode === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      {mode === "dark" ? "Dark" : "Light"}
                    </button>
                    <span className="inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-background/50 px-3 text-xs font-medium text-muted-foreground">
                      <Monitor className="h-4 w-4" />
                      Active
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <button type="button" onClick={toggleMode} className={clsx(buttonStyles({ variant: "quiet", size: "sm" }), "border border-transparent md:hidden")}>
            {mode === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {viewer.user ? (
            <>
              <div className="relative">
                <button
                  type="button"
                  className={clsx(buttonStyles({ variant: "outline", size: "sm" }), "border-border/70 bg-background/40")}
                  onClick={() => {
                    setIsTenantOpen((current) => !current);
                    setIsThemeOpen(false);
                  }}
                >
                  <Layers className="h-4 w-4" />
                  <span className="hidden lg:inline">Workspace</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isTenantOpen ? (
                  <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-border bg-[hsl(var(--surface-elevated))] p-2 shadow-theme-lg">
                    <div className="px-3 pb-2 pt-1">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Workspaces</p>
                    </div>
                    {viewer.tenants.length > 0 ? (
                      viewer.tenants.map((tenant) => {
                        const active = activeTenantId === String(tenant.tenantId);
                        return (
                          <button
                            key={tenant.tenantId}
                            type="button"
                            onClick={() => void setTenant(String(tenant.tenantId))}
                            className={clsx(
                              "flex w-full items-start justify-between rounded-xl px-3 py-3 text-left transition-colors",
                              active ? "bg-primary/12 text-foreground" : "hover:bg-background/60",
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
                      <div className="rounded-xl px-3 py-4 text-sm text-muted-foreground">연결된 워크스페이스가 없습니다.</div>
                    )}
                  </div>
                ) : null}
              </div>

              <Link href="/me" className={clsx(buttonStyles({ variant: "quiet", size: "sm" }), "hidden lg:inline-flex")}>
                <User className="h-4 w-4" />
                Session
              </Link>
              <button type="button" onClick={logout} className={clsx(buttonStyles({ variant: "outline", size: "sm" }), "border-border/70 bg-background/40")}>
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
      </div>
    </header>
  );
}
