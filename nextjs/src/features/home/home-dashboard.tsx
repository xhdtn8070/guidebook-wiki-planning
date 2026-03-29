import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import type { HomeResponse, ViewerSession } from "@/shared/lib/api-types";
import { buildAdminGuidebookHref, toFrontendHref } from "@/shared/lib/routes";
import { Bell, External, Layers, Search as SearchIcon, Star, Zap } from "@/shared/icons";

type HomeDashboardProps = {
  home: HomeResponse;
  viewer: ViewerSession;
};

export function HomeDashboard({ home, viewer }: HomeDashboardProps) {
  const activeTenantId = viewer.activeTenantId ?? home.tenants?.[0]?.tenantId ?? null;

  return (
    <div className="space-y-8">
      <section className="hero-gradient overflow-hidden rounded-[32px] border border-border px-6 py-8 shadow-theme-lg md:px-10 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="pill pill-ghost">Workspace</span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-5xl">
              {home.me.displayName}님의 문서 작업면을 product docs shell로 다시 엮었습니다.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-foreground/78">
              홈 대시보드는 <code>/api/home</code>를 그대로 사용합니다. 최근 문서, starred, notification, tenant 목록을 같은 응답에서 받고, 문서 링크는 프론트 canonical route로 정규화합니다.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <MetricCard label="Unread" value={home.notifications.unreadCount} icon={<Bell className="h-4 w-4" />} />
            <MetricCard label="Workspaces" value={home.tenants?.length ?? 0} icon={<Layers className="h-4 w-4" />} />
            <MetricCard label="Starred" value={home.starredPages.length} icon={<Star className="h-4 w-4" />} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <DashboardList
            eyebrow="Recent"
            title="최근 열람한 문서"
            description="읽기 흐름은 page id 기준 route로 고정하고, tenant context는 헤더와 URL search param으로 유지합니다."
            items={home.recentPages.map((item) => ({
              href: toFrontendHref(item.url),
              title: item.title,
              meta: item.viewedAt ? `Viewed ${formatDateTime(item.viewedAt)}` : `Guidebook ${item.guidebookId}`,
            }))}
          />

          <DashboardList
            eyebrow="Starred"
            title="별표 문서"
            description="중요 문서는 reader와 admin entry 모두 같은 canonical page route 축에서 이동합니다."
            items={home.starredPages.map((item) => ({
              href: toFrontendHref(item.url),
              title: item.title,
              meta: item.starredAt ? `Starred ${formatDateTime(item.starredAt)}` : `Guidebook ${item.guidebookId}`,
            }))}
          />
        </div>

        <aside className="space-y-6">
          <div className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Workspace rail</p>
            </div>
            <div className="mt-5 space-y-3">
              {home.tenants?.map((tenant) => (
                <div key={tenant.tenantId} className="rounded-2xl border border-border bg-background/40 px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{tenant.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{tenant.visibility}</p>
                    </div>
                    <Link href={buildAdminGuidebookHref(1, tenant.tenantId) as Route} className="text-xs font-medium text-primary hover:underline">
                      Admin
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Latest notifications</p>
            </div>
            <div className="mt-5 space-y-4">
              {home.notifications.recent.length > 0 ? (
                home.notifications.recent.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-border bg-background/40 px-4 py-4">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{formatDateTime(item.createdAt)}</p>
                  </article>
                ))
              ) : (
                <p className="text-sm leading-7 text-muted-foreground">아직 읽지 않은 이벤트가 없습니다.</p>
              )}
            </div>
          </div>

          {activeTenantId ? (
            <Link
              href={`/search?tenantId=${activeTenantId}` as Route}
              className="surface-elevated flex items-center justify-between rounded-[28px] border border-border px-6 py-5 text-sm font-semibold text-foreground shadow-theme-md"
            >
              Search this workspace
              <SearchIcon className="h-4 w-4 text-primary" />
            </Link>
          ) : null}
        </aside>
      </section>
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <div className="surface-elevated rounded-[24px] border border-border px-5 py-5 shadow-theme-md">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-sm">{label}</span>
        {icon}
      </div>
      <p className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">{value}</p>
    </div>
  );
}

function DashboardList({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: { href: string; title: string; meta: string }[];
}) {
  return (
    <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
      <div className="mt-5 divide-y divide-border">
        {items.length > 0 ? (
          items.map((item) => (
            <Link key={`${item.href}-${item.title}`} href={item.href as Route} className="flex items-center justify-between gap-4 py-4 first:pt-0">
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.meta}</p>
              </div>
              <External className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          ))
        ) : (
          <p className="py-4 text-sm text-muted-foreground">아직 쌓인 문서 히스토리가 없습니다.</p>
        )}
      </div>
    </section>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
