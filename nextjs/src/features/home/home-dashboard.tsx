import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import type { HomeResponse, ViewerSession } from "@/shared/lib/api-types";
import { Bell, External, Layers, Search as SearchIcon, Star, Zap } from "@/shared/icons";
import { buildPageHref, buildSearchHref, buildTenantHref, toFrontendHref } from "@/shared/lib/routes";

type HomeDashboardProps = {
  home: HomeResponse;
  viewer: ViewerSession;
};

export function HomeDashboard({ home, viewer }: HomeDashboardProps) {
  const activeTenantId = viewer.activeTenantId ?? home.tenants?.[0]?.tenantId ?? null;
  const workspaceById = new Map(viewer.tenants.map((tenant) => [tenant.tenantId, tenant]));
  const primaryRecent = home.recentPages[0] ?? null;
  const primaryStarred = home.starredPages[0] ?? null;

  return (
    <div className="space-y-8">
      <section className="hero-gradient overflow-hidden rounded-[36px] border border-border px-6 py-8 shadow-theme-lg md:px-10 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div className="max-w-3xl">
            <span className="pill">Personal home</span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-6xl">
              {home.me.displayName}님과 직접 연결된 문서 흐름만 먼저 모았습니다.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/78">
              홈은 소개 페이지가 아니라 다시 일을 시작하는 표면입니다. 최근 이어서 보던 문서, 중요 문서, 읽지 않은 이벤트, 내가 속한 워크스페이스를 먼저 보여주고
              구체적인 작업은 각 워크스페이스 허브로 넘깁니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryRecent ? (
                <Link
                  href={toFrontendHref(primaryRecent.url, {
                    tenantId: primaryRecent.tenantId,
                    guidebookId: primaryRecent.guidebookId,
                    pageId: primaryRecent.pageId,
                  }) as Route}
                  className="inline-flex h-12 items-center gap-2 rounded-2xl bg-foreground px-5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
                >
                  최근 문서 이어서 보기
                  <External className="h-4 w-4" />
                </Link>
              ) : null}
              {activeTenantId ? (
                <Link href={buildTenantHref(activeTenantId) as Route} className="inline-flex h-12 items-center gap-2 rounded-2xl border border-border bg-background/70 px-5 text-sm font-semibold text-foreground">
                  내 워크스페이스 열기
                  <Layers className="h-4 w-4" />
                </Link>
              ) : null}
              {activeTenantId ? (
                <Link href={buildSearchHref("", activeTenantId) as Route} className="inline-flex h-12 items-center gap-2 rounded-2xl border border-border bg-background/70 px-5 text-sm font-semibold text-foreground">
                  검색으로 시작
                  <SearchIcon className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </div>

          <aside className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <MetricCard label="Unread" value={home.notifications.unreadCount} icon={<Bell className="h-4 w-4" />} />
            <MetricCard label="Recent" value={home.recentPages.length} icon={<Zap className="h-4 w-4" />} />
            <MetricCard label="Workspaces" value={viewer.tenants.length} icon={<Layers className="h-4 w-4" />} />
          </aside>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_380px]">
        <div className="space-y-6">
          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Continue</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">최근 이어서 보기</h2>
              </div>
              <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                personal flow
              </span>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[26px] border border-border bg-background/45 px-5 py-5">
                {primaryRecent ? (
                  <>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Workspace {workspaceById.get(primaryRecent.tenantId)?.tenantCode ?? primaryRecent.tenantId}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{primaryRecent.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      마지막으로 이어 보던 문서입니다. reader route와 tenant 문맥을 그대로 유지한 채 복귀합니다.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Link
                        href={toFrontendHref(primaryRecent.url, {
                          tenantId: primaryRecent.tenantId,
                          guidebookId: primaryRecent.guidebookId,
                          pageId: primaryRecent.pageId,
                        }) as Route}
                        className="rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                      >
                        이어서 보기
                      </Link>
                      <Link href={buildTenantHref(primaryRecent.tenantId) as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                        워크스페이스 열기
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">아직 최근 문서가 없습니다.</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">문서를 읽기 시작하면 이곳에 이어서 봐야 할 흐름이 생깁니다.</p>
                  </>
                )}
              </div>

              <div className="divide-y divide-border rounded-[26px] border border-border bg-background/45 px-5 py-3">
                {home.recentPages.length > 0 ? (
                  home.recentPages.slice(0, 5).map((item) => (
                    <Link
                      key={item.pageId}
                      href={toFrontendHref(item.url, {
                        tenantId: item.tenantId,
                        guidebookId: item.guidebookId,
                        pageId: item.pageId,
                      }) as Route}
                      className="flex items-center justify-between gap-3 py-4 first:pt-2 last:pb-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-foreground">{item.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {workspaceById.get(item.tenantId)?.name ?? `Workspace ${item.tenantId}`} · {item.viewedAt ? formatDateTime(item.viewedAt) : "recent"}
                        </p>
                      </div>
                      <External className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </Link>
                  ))
                ) : (
                  <p className="py-4 text-sm text-muted-foreground">아직 문서 활동이 없습니다.</p>
                )}
              </div>
            </div>
          </section>

          <DashboardList
            eyebrow="Pinned"
            title="중요 문서"
            description="즐겨찾기한 문서는 개인 홈에서 먼저 모아서 보여주고, 각 워크스페이스 허브에서는 그 공간 기준으로 다시 좁혀 보여줍니다."
            items={home.starredPages.map((item) => ({
              href: buildPageHref({ guidebookId: item.guidebookId, pageId: item.pageId, tenantId: item.tenantId }),
              title: item.title,
              meta: `${workspaceById.get(item.tenantId)?.name ?? `Workspace ${item.tenantId}`} · ${item.starredAt ? formatDateTime(item.starredAt) : "starred"}`,
            }))}
            emptyMessage="즐겨찾기한 문서가 아직 없습니다."
          />
        </div>

        <aside className="space-y-6">
          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Layers className="h-4 w-4 text-primary" />
              내 워크스페이스
            </div>
            <div className="mt-5 space-y-3">
              {viewer.tenants.map((tenant) => (
                <Link key={tenant.tenantId} href={buildTenantHref(tenant.tenantId) as Route} className="block rounded-2xl border border-border bg-background/45 px-4 py-4 transition-transform hover:-translate-y-0.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-foreground">{tenant.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{tenant.tenantCode}</p>
                    </div>
                    <span className="rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{tenant.role}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Bell className="h-4 w-4 text-primary" />
              읽지 않은 이벤트
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
                <p className="text-sm leading-7 text-muted-foreground">아직 나와 직접 연결된 새 이벤트가 없습니다.</p>
              )}
            </div>
          </section>

          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Star className="h-4 w-4 text-primary" />
              지금 바로 할 수 있는 일
            </div>
            <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
              <p>개인 홈에서는 나와 관련된 문서 흐름만 빠르게 스캔합니다.</p>
              <p>공간 단위 탐색과 운영 진입은 각 워크스페이스 허브에서 이어집니다.</p>
              <p>검색은 현재 활성 워크스페이스를 기본 문맥으로 삼습니다.</p>
            </div>
            {activeTenantId ? (
              <Link href={buildSearchHref("", activeTenantId) as Route} className="mt-5 inline-flex rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                현재 워크스페이스 검색
              </Link>
            ) : null}
          </section>
        </aside>
      </section>

      {primaryStarred ? (
        <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Spotlight</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">{primaryStarred.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-8 text-muted-foreground">
                즐겨찾기로 올려 둔 문서는 홈에서 가장 안정적인 진입점입니다. 워크스페이스가 달라도 중요한 문서는 이곳에서 다시 연결됩니다.
              </p>
            </div>
            <div className="rounded-[24px] border border-border bg-background/45 px-5 py-5">
              <p className="text-sm font-semibold text-foreground">
                {workspaceById.get(primaryStarred.tenantId)?.name ?? `Workspace ${primaryStarred.tenantId}`}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Guidebook {primaryStarred.guidebookId} · {primaryStarred.starredAt ? formatDateTime(primaryStarred.starredAt) : "starred"}
              </p>
              <Link
                href={buildPageHref({
                  guidebookId: primaryStarred.guidebookId,
                  pageId: primaryStarred.pageId,
                  tenantId: primaryStarred.tenantId,
                }) as Route}
                className="mt-5 inline-flex rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
              >
                문서 열기
              </Link>
            </div>
          </div>
        </section>
      ) : null}
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
  emptyMessage,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: { href: string; title: string; meta: string }[];
  emptyMessage: string;
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
