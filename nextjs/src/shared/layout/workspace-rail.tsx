import Link from "next/link";
import type { Route } from "next";
import { clsx } from "clsx";
import type { ViewerSession } from "@/shared/lib/api-types";
import { buildMeHref, buildOnboardingHref, buildTenantHref } from "@/shared/lib/routes";
import { Bell, BookOpen, FileText, Layers, Pencil, Star, User } from "@/shared/icons";

type WorkspaceRailProps = {
  viewer: ViewerSession;
  activeItem?: "home" | "recent" | "starred" | "workspaces" | "directory" | "admin" | "me";
  activeTenantId?: number | null;
  adminHref?: string | null;
};

type NavItem = {
  key: NonNullable<WorkspaceRailProps["activeItem"]>;
  label: string;
  description: string;
  href: string | null;
  icon: typeof BookOpen;
};

export function WorkspaceRail({ viewer, activeItem = "home", activeTenantId = null, adminHref = null }: WorkspaceRailProps) {
  if (!viewer.user) {
    return null;
  }

  const effectiveTenantId = activeTenantId ?? viewer.activeTenantId ?? viewer.tenants[0]?.tenantId ?? null;

  const items: NavItem[] = [
    {
      key: "home",
      label: "Home",
      description: "개인 홈",
      href: "/",
      icon: BookOpen,
    },
    {
      key: "recent",
      label: "Recent",
      description: "최근 흐름",
      href: "/#recent",
      icon: FileText,
    },
    {
      key: "starred",
      label: "Starred",
      description: "중요 문서",
      href: "/#starred",
      icon: Star,
    },
    {
      key: "workspaces",
      label: "Workspaces",
      description: "현재 공간",
      href: effectiveTenantId != null ? buildTenantHref(effectiveTenantId) : buildOnboardingHref("/"),
      icon: Layers,
    },
    {
      key: "directory",
      label: "Directory",
      description: "가이드북 목록",
      href: effectiveTenantId != null ? `${buildTenantHref(effectiveTenantId)}#directory` : null,
      icon: Pencil,
    },
    {
      key: "admin",
      label: "Admin",
      description: "운영 진입",
      href: adminHref,
      icon: Bell,
    },
  ];

  const activeWorkspace = effectiveTenantId != null ? viewer.tenants.find((tenant) => tenant.tenantId === effectiveTenantId) ?? null : null;

  return (
    <aside className="sticky top-[88px] space-y-4">
      <section className="rounded-[28px] border border-border bg-[hsl(var(--surface-elevated))] p-3 shadow-theme-md">
        <div className="rounded-[22px] border border-border bg-background/55 px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Signed in</p>
          <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">{viewer.user.displayName}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeWorkspace ? `${activeWorkspace.name} · ${activeWorkspace.role}` : "워크스페이스를 선택해 흐름을 이어갑니다."}
          </p>
          <Link
            href={buildMeHref() as Route}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-background/70"
          >
            <User className="h-4 w-4" />
            마이페이지
          </Link>
        </div>

        <nav className="mt-3 space-y-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            if (!item.href) {
              return (
                <div key={item.key} className="rounded-2xl border border-dashed border-border/80 px-3 py-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-background/60">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href as Route}
                className={clsx(
                  "group flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors",
                  activeItem === item.key ? "bg-primary text-primary-foreground shadow-theme-sm" : "hover:bg-background/70",
                )}
              >
                <span
                  className={clsx(
                    "flex h-9 w-9 items-center justify-center rounded-xl border",
                    activeItem === item.key ? "border-primary-foreground/20 bg-primary-foreground/10" : "border-border bg-background/60",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className={clsx("text-xs", activeItem === item.key ? "text-primary-foreground/78" : "text-muted-foreground")}>{item.description}</p>
                </div>
              </Link>
            );
          })}
        </nav>
      </section>
    </aside>
  );
}
