import Link from "next/link";
import type { Route } from "next";
import type { HomeResponse, ViewerSession } from "@/shared/lib/api-types";
import { Bell, External, Layers, Search as SearchIcon, Star } from "@/shared/icons";
import { buildTenantHref, buildTenantSettingsHref, toFrontendHref } from "@/shared/lib/routes";

type HomeDashboardProps = {
  home: HomeResponse;
  viewer: ViewerSession;
};

export function HomeDashboard({ home, viewer }: HomeDashboardProps) {
  const activeTenantId = viewer.activeTenantId ?? home.tenants?.[0]?.tenantId ?? null;
  const workspaceById = new Map(viewer.tenants.map((tenant) => [tenant.tenantId, tenant]));
  const primaryRecent = home.recentPages[0] ?? null;
  const unreadNotifications = home.notifications.recent.slice(0, 4);
  const activeWorkspace = activeTenantId ? workspaceById.get(activeTenantId) ?? null : null;
  const hasHistory = home.recentPages.length > 0 || home.starredPages.length > 0 || unreadNotifications.length > 0;

  return (
    <div className="space-y-6">
      <section className="surface-elevated rounded-[30px] border border-border px-6 py-6 shadow-theme-md">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Personal home</p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
              {primaryRecent ? `${home.me.displayName}님, 최근 흐름부터 다시 열면 됩니다.` : `${home.me.displayName}님의 작업 재개 화면입니다.`}
            </h1>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">최근 문서, 중요 문서, 알림, 워크스페이스만 먼저 보여줍니다.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {primaryRecent ? (
              <Link
                href={toFrontendHref(primaryRecent.url, {
                  tenantId: primaryRecent.tenantId,
                  guidebookId: primaryRecent.guidebookId,
                  pageId: primaryRecent.pageId,
                }) as Route}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-foreground px-4 text-sm font-medium text-background"
              >
                최근 문서 열기
                <External className="h-4 w-4" />
              </Link>
            ) : null}
            {activeTenantId ? (
              <Link href={`/search?tenantId=${activeTenantId}` as Route} className="inline-flex h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium text-foreground">
                검색 열기
                <SearchIcon className="h-4 w-4" />
              </Link>
            ) : null}
            {activeTenantId ? (
              <Link href={buildTenantHref(activeTenantId) as Route} className="inline-flex h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium text-foreground">
                현재 공간
                <Layers className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <ResumeMetric label="Unread" value={home.notifications.unreadCount} />
          <ResumeMetric label="Recent" value={home.recentPages.length} />
          <ResumeMetric label="Starred" value={home.starredPages.length} />
          <ResumeMetric label="Workspace" value={activeWorkspace?.name ?? viewer.tenants.length} />
        </div>
      </section>

      {!hasHistory ? (
        <section className="rounded-[26px] border border-border bg-[hsl(var(--surface-elevated))] px-6 py-6 shadow-theme-md">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">First run</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">아직 기록이 없으니 첫 공간만 열면 홈이 바로 개인화됩니다.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            최근 문서와 즐겨찾기는 아직 비어 있습니다. 워크스페이스 하나를 열거나 첫 guidebook을 만들면 이 화면이 자동으로 작업 재개 표면으로 바뀝니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {activeTenantId ? (
              <Link href={buildTenantHref(activeTenantId) as Route} className="inline-flex h-11 items-center gap-2 rounded-xl bg-foreground px-4 text-sm font-medium text-background">
                워크스페이스 열기
              </Link>
            ) : null}
            <Link href="/onboarding" className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-background/70 px-4 text-sm font-medium text-foreground">
              첫 워크스페이스 만들기
            </Link>
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_360px]">
        <div className="space-y-6">
          <ListSurface
            id="recent"
            eyebrow="Resume"
            title="최근 이어서 보기"
            description="바로 다시 열 문서만 먼저 보여줍니다."
            items={home.recentPages.map((item) => ({
              href: toFrontendHref(item.url, {
                tenantId: item.tenantId,
                guidebookId: item.guidebookId,
                pageId: item.pageId,
              }),
              title: item.title,
              meta: `${workspaceById.get(item.tenantId)?.name ?? `Workspace ${item.tenantId}`} · ${item.viewedAt ? formatDateTime(item.viewedAt) : "recent"}`,
            }))}
            emptyMessage="최근에 읽은 문서가 아직 없습니다."
          />

          <ListSurface
            id="starred"
            eyebrow="Pinned"
            title="즐겨찾기"
            description="나중에 다시 볼 문서를 개인 홈 기준으로 모아 둡니다."
            items={home.starredPages.map((item) => ({
              href: toFrontendHref(item.url, {
                tenantId: item.tenantId,
                guidebookId: item.guidebookId,
                pageId: item.pageId,
              }),
              title: item.title,
              meta: `${workspaceById.get(item.tenantId)?.name ?? `Workspace ${item.tenantId}`} · ${item.starredAt ? formatDateTime(item.starredAt) : "starred"}`,
            }))}
            emptyMessage="즐겨찾기한 문서가 아직 없습니다."
          />
        </div>

        <aside className="space-y-6">
          <section id="notifications" className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Bell className="h-4 w-4 text-primary" />
              읽지 않은 알림
            </div>
            <div className="mt-5 divide-y divide-border">
              {unreadNotifications.length > 0 ? (
                unreadNotifications.map((item) => (
                  <article key={item.id} className="py-4 first:pt-0 last:pb-0">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{formatDateTime(item.createdAt)}</p>
                  </article>
                ))
              ) : (
                <p className="py-1 text-sm leading-7 text-muted-foreground">아직 나와 직접 연결된 새 이벤트가 없습니다.</p>
              )}
            </div>
          </section>

          <section id="workspaces" className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Layers className="h-4 w-4 text-primary" />
              내 워크스페이스
            </div>
            <div className="mt-5 space-y-2">
              {viewer.tenants.length > 0 ? (
                viewer.tenants.map((tenant) => (
                  <Link
                    key={tenant.tenantId}
                    href={buildTenantHref(tenant.tenantId) as Route}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/45 px-4 py-4 transition-transform hover:-translate-y-0.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-foreground">{tenant.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{tenant.tenantCode}</p>
                    </div>
                    <span className="rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{tenant.role}</span>
                  </Link>
                ))
              ) : (
                <p className="rounded-2xl border border-border bg-background/45 px-4 py-4 text-sm leading-7 text-muted-foreground">아직 속한 워크스페이스가 없습니다.</p>
              )}
            </div>
          </section>

          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Star className="h-4 w-4 text-primary" />
              빠른 동선
            </div>
            <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
              <p>개인 홈은 내가 바로 다시 열 문서와 공간만 먼저 보여줍니다.</p>
              <p>세부 운영은 각 워크스페이스 허브와 guidebook 관리 화면에서 이어집니다.</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {activeTenantId ? (
                <Link href={`/search?tenantId=${activeTenantId}` as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                  검색
                </Link>
              ) : null}
              <Link href="/me" className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                마이페이지
              </Link>
              {activeTenantId ? (
                <Link href={buildTenantHref(activeTenantId) as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                  활성 공간 열기
                </Link>
              ) : null}
              {activeTenantId ? (
                <Link href={buildTenantSettingsHref(activeTenantId) as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                  공간 설정
                </Link>
              ) : null}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function ResumeMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-[22px] border border-border bg-background/55 px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 truncate text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}

function ListSurface({
  id,
  eyebrow,
  title,
  description,
  items,
  emptyMessage,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  items: { href: string; title: string; meta: string }[];
  emptyMessage: string;
}) {
  return (
    <section id={id} className="surface-elevated scroll-mt-24 rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
      <div className="border-b border-border pb-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
      </div>
      <div className="mt-3 divide-y divide-border">
        {items.length > 0 ? (
          items.map((item, index) => (
            <Link key={`${item.href}-${item.title}`} href={item.href as Route} className="group flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--surface-elevated))] text-sm font-semibold text-primary">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-foreground group-hover:text-primary">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.meta}</p>
                </div>
              </div>
              <External className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          ))
        ) : (
          <p className="py-4 text-sm text-muted-foreground">{emptyMessage}</p>
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
