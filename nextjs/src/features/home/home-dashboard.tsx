import Link from "next/link";
import type { Route } from "next";
import type { HomeResponse, ViewerSession } from "@/shared/lib/api-types";
import { buildAdminGuidebookHref, toFrontendHref } from "@/shared/lib/routes";
import { Bell, CheckCircle, External, Layers, Spark } from "@/shared/icons";

type HomeDashboardProps = {
  home: HomeResponse;
  viewer: ViewerSession;
};

export function HomeDashboard({ home, viewer }: HomeDashboardProps) {
  const activeTenantId = viewer.activeTenantId ?? home.tenants?.[0]?.tenantId ?? null;

  return (
    <div className="space-y-10">
      <section className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Workspace</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl">
            {home.me.displayName}님의 위키 작업면을 실제 API 계약으로 다시 엮었습니다.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
            홈 대시보드는 `/api/home`을 그대로 사용합니다. 최근 문서, 별표, 알림, 워크스페이스 목록을 하나의 응답으로
            받고, 문서 링크는 프론트 canonical route로 정규화합니다.
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="rounded-[24px] border border-border bg-panel px-5 py-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Unread notifications</span>
              <Bell className="h-4 w-4" />
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{home.notifications.unreadCount}</p>
          </div>
          <div className="rounded-[24px] border border-border bg-panel px-5 py-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Connected workspaces</span>
              <Layers className="h-4 w-4" />
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{home.tenants?.length ?? 0}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-10">
          <DashboardList
            eyebrow="Recent"
            title="최근 열람한 문서"
            description="페이지 상세 링크는 백엔드의 `/t/{tenantId}/g/{guidebookId}/p/{pageId}` 값을 프론트 canonical route로 변환해 사용합니다."
            items={home.recentPages.map((item) => ({
              href: toFrontendHref(item.url),
              title: item.title,
              meta: item.viewedAt ? `열람 ${formatDateTime(item.viewedAt)}` : `guidebook ${item.guidebookId}`,
            }))}
          />

          <DashboardList
            eyebrow="Starred"
            title="별표 문서"
            description="향후 읽기 화면과 관리 진입 화면이 같은 page id를 공유하도록 라우트를 고정했습니다."
            items={home.starredPages.map((item) => ({
              href: toFrontendHref(item.url),
              title: item.title,
              meta: item.starredAt ? `별표 ${formatDateTime(item.starredAt)}` : `guidebook ${item.guidebookId}`,
            }))}
          />
        </div>

        <aside className="space-y-8">
          <div className="rounded-[28px] border border-border bg-panel px-6 py-6">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Spark className="h-4 w-4" />
              Workspace rail
            </div>
            <div className="mt-5 space-y-3">
              {home.tenants?.map((tenant) => (
                <div key={tenant.tenantId} className="flex items-start justify-between border-b border-border pb-3 last:border-b-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{tenant.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{tenant.visibility}</p>
                  </div>
                  <Link
                    href={buildAdminGuidebookHref(1, tenant.tenantId) as Route}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    관리 진입
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-border bg-panel px-6 py-6">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              Latest notifications
            </div>
            <div className="mt-5 space-y-4">
              {home.notifications.recent.map((item) => (
                <article key={item.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.body}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {formatDateTime(item.createdAt)}
                  </p>
                </article>
              ))}
              {home.notifications.recent.length === 0 ? (
                <p className="text-sm leading-7 text-muted-foreground">아직 읽지 않은 이벤트가 없습니다.</p>
              ) : null}
            </div>
          </div>

          {activeTenantId ? (
            <Link
              href={`/search?tenantId=${activeTenantId}` as Route}
              className="flex items-center justify-between rounded-[28px] border border-border bg-panel-soft px-6 py-5 text-sm font-medium"
            >
              검색 화면으로 이동
              <External className="h-4 w-4" />
            </Link>
          ) : null}
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
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
      <div className="mt-3 border-b border-border pb-5">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
      </div>
      <div className="mt-5 divide-y divide-border">
        {items.length > 0 ? (
          items.map((item) => (
            <Link key={`${item.href}-${item.title}`} href={item.href as Route} className="flex items-center justify-between gap-4 py-4 first:pt-0">
              <div>
                <p className="text-base font-medium text-foreground">{item.title}</p>
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

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
