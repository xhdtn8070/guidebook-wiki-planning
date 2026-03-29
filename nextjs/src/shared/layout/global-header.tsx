"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { clsx } from "clsx";
import type { ViewerSession } from "@/shared/lib/api-types";
import { buildIntroduceHref, buildLoginHref, buildMeHref, buildOnboardingHref, buildSearchHref, buildTenantHref } from "@/shared/lib/routes";
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
  preferredTenantId?: number | null;
};

export function GlobalHeader({ viewer, preferredTenantId = null }: GlobalHeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme, mode, setTheme, toggleMode, themePresets } = useTheme();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [isPending, startTransition] = useTransition();
  const [isTenantOpen, setIsTenantOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const activeTenantId = useMemo(() => {
    if (typeof searchParams.get("tenantId") === "string") {
      return searchParams.get("tenantId");
    }
    if (preferredTenantId != null) {
      return String(preferredTenantId);
    }
    if (viewer.activeTenantId != null) {
      return String(viewer.activeTenantId);
    }
    return null;
  }, [preferredTenantId, searchParams, viewer.activeTenantId]);

  const currentSearch = searchParams.toString();
  const loginHref = buildLoginHref(pathname ? `${pathname}${currentSearch ? `?${currentSearch}` : ""}` : null);
  const hasWorkspaces = viewer.tenants.length > 0;
  const brandHref = viewer.user ? "/" : buildIntroduceHref();
  const activeTenant = activeTenantId ? viewer.tenants.find((tenant) => String(tenant.tenantId) === activeTenantId) ?? null : null;

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    setIsTenantOpen(false);
    setIsThemeOpen(false);
    setIsAccountOpen(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!preferredTenantId || viewer.activeTenantId === preferredTenantId) {
      return;
    }

    void fetch("/api/session/tenant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tenantId: preferredTenantId }),
    });
  }, [preferredTenantId, viewer.activeTenantId]);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      router.push(buildSearchHref(query, activeTenantId) as Route);
    });
  };

  const buildTenantDestination = (tenantId: string) => {
    if (
      !pathname ||
      pathname === "/" ||
      pathname === "/introduce" ||
      pathname === "/onboarding" ||
      pathname === "/login" ||
      pathname.startsWith("/auth") ||
      pathname.startsWith("/tenant")
    ) {
      return buildTenantHref(tenantId);
    }

    const next = new URLSearchParams(searchParams.toString());
    next.set("tenantId", tenantId);
    return `${pathname}${next.toString() ? `?${next.toString()}` : ""}`;
  };

  const setTenant = async (tenantId: string) => {
    await fetch("/api/session/tenant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tenantId }),
    });

    startTransition(() => {
      router.replace(buildTenantDestination(tenantId) as Route);
      router.refresh();
    });

    setIsTenantOpen(false);
  };

  const logout = async () => {
    await fetch("/api/session/logout", { method: "POST" });
    startTransition(() => {
      router.push(buildIntroduceHref() as Route);
      router.refresh();
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-[hsl(var(--surface-strong))/0.94] shadow-[0_1px_0_hsl(var(--border)/0.4)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-3 px-4 md:px-6 xl:px-8">
        <Link href={brandHref as Route} className="flex min-w-0 items-center gap-3 text-foreground transition-opacity hover:opacity-90">
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-base font-bold tracking-[-0.04em]">Guidebook Wiki</p>
            <p className="truncate text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Modern knowledge product</p>
          </div>
        </Link>

        <div className="mx-auto flex min-w-0 flex-1 items-center justify-center gap-2">
          <div className="hidden items-center gap-1 xl:flex">
            <Link
              href={(viewer.user ? "/" : buildIntroduceHref()) as Route}
              className={clsx(buttonStyles({ variant: "quiet", size: "sm" }), pathname === "/" || pathname === "/introduce" ? "bg-foreground/[0.05] text-foreground" : "")}
            >
              <BookOpen className="h-4 w-4" />
              {viewer.user ? "Home" : "Introduce"}
            </Link>
            {viewer.user && activeTenant ? (
              <Link
                href={buildTenantHref(activeTenant.tenantId) as Route}
                className={clsx(buttonStyles({ variant: "quiet", size: "sm" }), pathname?.startsWith("/tenant") ? "bg-foreground/[0.05] text-foreground" : "")}
              >
                <Layers className="h-4 w-4" />
                {activeTenant.name}
              </Link>
            ) : null}
          </div>

          <form onSubmit={submitSearch} className="relative w-full max-w-2xl">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="문서, 용어, 코드 식별자를 검색하세요"
              className="h-10 rounded-full border-border/80 bg-[hsl(var(--surface-elevated))] pl-10 pr-20 shadow-theme-sm"
            />
            <kbd className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-background/80 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground md:block">
              Search
            </kbd>
          </form>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="relative hidden md:block">
            <button
              type="button"
              className={clsx(buttonStyles({ variant: "quiet", size: "sm" }), "border border-transparent bg-transparent")}
              onClick={() => {
                setIsThemeOpen((current) => !current);
                setIsTenantOpen(false);
                setIsAccountOpen(false);
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
                      Synced
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
              {hasWorkspaces ? (
                <div className="relative">
              <button
                type="button"
                className={clsx(buttonStyles({ variant: "outline", size: "sm" }), "border-border/70 bg-[hsl(var(--surface-elevated))]")}
                onClick={() => {
                  setIsTenantOpen((current) => !current);
                  setIsThemeOpen(false);
                  setIsAccountOpen(false);
                }}
              >
                <Layers className="h-4 w-4" />
                <span className="hidden lg:inline">{activeTenant?.name ?? "내 공간"}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
                  {isTenantOpen ? (
                    <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-border bg-[hsl(var(--surface-elevated))] p-2 shadow-theme-lg">
                      <div className="px-3 pb-2 pt-1">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Workspaces</p>
                      </div>
                      {viewer.tenants.map((tenant) => {
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
                      })}
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link href={buildOnboardingHref(pathname) as Route} className={clsx(buttonStyles({ size: "sm" }), "hidden md:inline-flex")}>
                  첫 워크스페이스 만들기
                </Link>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsAccountOpen((current) => !current);
                    setIsTenantOpen(false);
                    setIsThemeOpen(false);
                  }}
                  className={clsx(buttonStyles({ variant: "outline", size: "sm" }), "border-border/70 bg-[hsl(var(--surface-elevated))]")}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{isPending ? "..." : viewer.user.displayName}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isAccountOpen ? (
                  <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-border bg-[hsl(var(--surface-elevated))] p-2 shadow-theme-lg">
                    <div className="rounded-xl border border-border bg-background/40 px-4 py-4">
                      <p className="text-sm font-semibold text-foreground">{viewer.user.displayName}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{viewer.user.status}</p>
                    </div>
                    <div className="mt-2 space-y-1">
                      <Link href={buildMeHref() as Route} className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-foreground transition-colors hover:bg-background/60">
                        <span>마이페이지</span>
                        <User className="h-4 w-4 text-muted-foreground" />
                      </Link>
                      <Link
                        href={activeTenantId ? (buildTenantHref(activeTenantId) as Route) : (buildOnboardingHref(pathname) as Route)}
                        className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-foreground transition-colors hover:bg-background/60"
                      >
                        <span>워크스페이스 설정</span>
                        <Layers className="h-4 w-4 text-muted-foreground" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => void logout()}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm text-foreground transition-colors hover:bg-background/60"
                      >
                        <span>로그아웃</span>
                        <User className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
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
