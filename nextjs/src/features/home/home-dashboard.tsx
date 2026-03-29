import Link from "next/link";
import type { Route } from "next";
import type { HomeResponse, ViewerSession } from "@/shared/lib/api-types";
import { buildAdminGuidebookHref, toFrontendHref } from "@/shared/lib/routes";
import { Bell, CheckCircle, External } from "@/shared/icons";

type HomeDashboardProps = {
  home: HomeResponse;
  viewer: ViewerSession;
};

export function HomeDashboard({ home, viewer }: HomeDashboardProps) {
  const activeTenantId = viewer.activeTenantId ?? home.tenants?.[0]?.tenantId ?? null;

  return (
    <div className="animate-rise-in space-y-14">
      <section className="grid gap-8 border-b border-border pb-10 xl:grid-cols-12">
        <div className="xl:col-span-9">
          <p className="editorial-eyebrow">Guidebook Wiki</p>
          <h1 className="mt-4 text-5xl text-foreground md:text-6xl">반갑습니다, {home.me.displayName}님.</h1>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-muted-foreground">
            홈은 `/api/home` 응답 하나로 최근 문서, 별표, 알림, workspace 목록을 엮습니다. 문서 링크는 모두 canonical page route로 정규화하고,
            검색과 관리자 진입도 같은 id 체계를 공유합니다.
          </p>

          <div className="mt-8 grid gap-6 border-t border-border pt-6 md:grid-cols-2">
            <MetricBlock label="Unread alerts" value={String(home.notifications.unreadCount).padStart(2, "0")} />
            <MetricBlock label="Active clusters" value={String(home.tenants?.length ?? 0).padStart(2, "0")} />
          </div>
        </div>

        <aside className="border-l border-border pl-6 xl:col-span-3">
          <p className="editorial-eyebrow">Latest note</p>
          {home.notifications.recent[0] ? (
            <article className="mt-4 space-y-3">
              <p className="text-sm font-medium text-foreground">{home.notifications.recent[0].title}</p>
              <p className="text-sm leading-7 text-muted-foreground">{home.notifications.recent[0].body}</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {formatDateTime(home.notifications.recent[0].createdAt)}
              </p>
            </article>
          ) : (
            <p className="mt-4 text-sm leading-7 text-muted-foreground">새로운 알림이 아직 없습니다.</p>
          )}
        </aside>
      </section>

      <section className="grid gap-12 xl:grid-cols-12">
        <div className="space-y-12 xl:col-span-9">
          <DashboardList
            eyebrow="Recent"
            title="최근 확인한 페이지"
            description="최근 문서는 운영 중인 위키의 실제 읽기 흐름을 반영하는 가장 중요한 entry point입니다."
            items={home.recentPages.map((item) => ({
              href: toFrontendHref(item.url),
              title: item.title,
              meta: item.viewedAt ? `열람 ${formatDateTime(item.viewedAt)}` : `guidebook ${item.guidebookId}`,
            }))}
          />

          <DashboardList
            eyebrow="Important pages"
            title="중요 페이지"
            description="별표 문서는 검색과 읽기 화면에서 같은 page id를 공유하고, 이후 관리자 진입 화면과도 연결됩니다."
            items={home.starredPages.map((item) => ({
              href: toFrontendHref(item.url),
              title: item.title,
              meta: item.starredAt ? `별표 ${formatDateTime(item.starredAt)}` : `guidebook ${item.guidebookId}`,
            }))}
          />
        </div>

        <aside className="space-y-10 xl:col-span-3">
          <section className="border-t border-border pt-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Bell className="h-4 w-4" />
              Workspace rail
            </div>
            <div className="mt-4 space-y-4">
              {home.tenants?.map((tenant) => (
                <div key={tenant.tenantId} className="flex items-start justify-between border-b border-border pb-4 last:border-b-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{tenant.name}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{tenant.visibility}</p>
                  </div>
                  <Link href={buildAdminGuidebookHref(1, tenant.tenantId) as Route} className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground">
                    Manage
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-border bg-[#41574e] px-6 py-6 text-primary-foreground">
            <p className="editorial-eyebrow text-primary-foreground/70">Editorial note</p>
            <p className="mt-4 text-2xl">관리자 콘솔로 이동해 팀 문서 흐름을 정리하세요.</p>
            <p className="mt-4 text-sm leading-7 text-primary-foreground/78">위키는 읽기 화면과 검색 화면만으로 완성되지 않습니다. 운영 면까지 같은 톤으로 이어져야 합니다.</p>
            {activeTenantId ? (
              <Link
                href={`/search?tenantId=${activeTenantId}` as Route}
                className="mt-6 inline-flex items-center gap-2 rounded-[6px] border border-primary-foreground/30 px-4 py-2 text-[11px] uppercase tracking-[0.16em]"
              >
                Manage archive spaces
                <External className="h-4 w-4" />
              </Link>
            ) : null}
          </section>
        </aside>
      </section>
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
    <section>
      <p className="editorial-eyebrow">{eyebrow}</p>
      <div className="mt-4 border-b border-border pb-5">
        <h2 className="text-3xl text-foreground">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
      </div>
      <div className="mt-5 divide-y divide-border">
        {items.length > 0 ? (
          items.map((item) => (
            <Link key={`${item.href}-${item.title}`} href={item.href as Route} className="flex items-center justify-between gap-4 py-5 first:pt-0">
              <div>
                <p className="text-lg font-medium tracking-tight text-foreground">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.meta}</p>
              </div>
              <External className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))
        ) : (
          <p className="py-4 text-sm text-muted-foreground">아직 쌓인 문서 히스토리가 없습니다.</p>
        )}
      </div>
    </section>
  );
}

function MetricBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-3 text-4xl text-foreground">{value}</p>
    </div>
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
