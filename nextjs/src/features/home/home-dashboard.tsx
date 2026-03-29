import Link from "next/link";
import type { Route } from "next";
import type { HomeResponse, ViewerSession } from "@/shared/lib/api-types";
import { Bell, External, Layers, Search as SearchIcon, Star } from "@/shared/icons";
import { buildSearchHref, buildTenantHref, toFrontendHref } from "@/shared/lib/routes";

type HomeDashboardProps = {
  home: HomeResponse;
  viewer: ViewerSession;
};

export function HomeDashboard({ home, viewer }: HomeDashboardProps) {
  const activeTenantId = viewer.activeTenantId ?? home.tenants?.[0]?.tenantId ?? null;
  const workspaceById = new Map(viewer.tenants.map((tenant) => [tenant.tenantId, tenant]));
  const primaryRecent = home.recentPages[0] ?? null;
  const unreadNotifications = home.notifications.recent.slice(0, 3);
  const activeWorkspace = activeTenantId ? workspaceById.get(activeTenantId) ?? null : null;
  const topWorkspaces = viewer.tenants.slice(0, 4);

  return (
    <div className="space-y-8">
      <section className="hero-gradient overflow-hidden rounded-[36px] border border-border px-6 py-8 shadow-theme-lg md:px-10 md:py-10">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.04fr)_460px] xl:items-end">
          <div className="max-w-4xl">
            <span className="pill">Personal home</span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.06em] text-foreground md:text-6xl">
              {home.me.displayName}님이 지금 다시 이어야 할 문서 흐름과 워크스페이스만 먼저 정리했습니다.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/78">
              개인 홈은 서비스 소개가 아니라 다시 작업을 시작하는 표면입니다. 최근 문서, 중요 문서, 읽지 않은 이벤트, 내가 속한 워크스페이스를 먼저 보여주고
              실제 운영과 상세 탐색은 각 workspace hub로 이어집니다.
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
                <Link href={buildTenantHref(activeTenantId) as Route} className="inline-flex h-12 items-center gap-2 rounded-2xl border border-border bg-background/72 px-5 text-sm font-semibold text-foreground">
                  내 워크스페이스 열기
                  <Layers className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <SignalChip label="Unread" value={home.notifications.unreadCount} />
              <SignalChip label="Recent" value={home.recentPages.length} />
              <SignalChip label="Starred" value={home.starredPages.length} />
              <SignalChip label="Workspaces" value={viewer.tenants.length} />
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[30px] border border-border bg-[hsl(var(--surface-strong))] px-5 py-5 shadow-theme-md">
            <div className="absolute inset-y-0 right-0 hidden w-28 bg-gradient-to-l from-primary/10 via-primary/5 to-transparent md:block" />
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Resume now</p>
            {primaryRecent ? (
              <>
                <p className="mt-3 text-sm text-primary">{workspaceById.get(primaryRecent.tenantId)?.name ?? `Workspace ${primaryRecent.tenantId}`}</p>
                <h2 className="mt-2 max-w-sm text-3xl font-semibold tracking-tight text-foreground">{primaryRecent.title}</h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                  reader route와 tenant 문맥을 그대로 유지한 채, 마지막으로 보던 문서로 다시 복귀합니다. 개인 홈은 이 active surface 하나로 오늘의 시작점을 먼저
                  제시합니다.
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span>{primaryRecent.viewedAt ? formatDateTime(primaryRecent.viewedAt) : "recent"}</span>
                  <span>•</span>
                  <span>Guidebook {primaryRecent.guidebookId}</span>
                  {activeWorkspace ? (
                    <>
                      <span>•</span>
                      <span>{activeWorkspace.tenantCode}</span>
                    </>
                  ) : null}
                </div>
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
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">아직 최근 문서가 없습니다.</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  먼저 워크스페이스를 열고 문서를 읽기 시작하면, 홈이 개인 흐름을 다시 모아 보여줍니다.
                </p>
              </>
            )}
          </aside>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_380px]">
        <div className="space-y-6">
          <ListSurface
            eyebrow="Daily flow"
            title="최근 이어서 보기"
            description="오늘 다시 열어야 하는 문서를 시간순으로 정리했습니다. 여기서 reader로 바로 복귀하거나, 해당 워크스페이스 허브로 내려갈 수 있습니다."
            items={home.recentPages.map((item) => ({
              href: toFrontendHref(item.url, {
                tenantId: item.tenantId,
                guidebookId: item.guidebookId,
                pageId: item.pageId,
              }),
              title: item.title,
              meta: `${workspaceById.get(item.tenantId)?.name ?? `Workspace ${item.tenantId}`} · ${item.viewedAt ? formatDateTime(item.viewedAt) : "recent"}`,
            }))}
            emptyMessage="아직 최근 활동이 없습니다."
          />

          <ListSurface
            eyebrow="Pinned"
            title="중요 문서"
            description="즐겨찾기한 문서는 개인 홈에서 먼저 보이고, 각 워크스페이스 허브에서는 그 공간 기준으로 다시 좁혀집니다."
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
          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Layers className="h-4 w-4 text-primary" />
              내 워크스페이스
            </div>
            <div className="mt-5 space-y-2">
              {topWorkspaces.map((tenant, index) => (
                <Link
                  key={tenant.tenantId}
                  href={buildTenantHref(tenant.tenantId) as Route}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/45 px-4 py-4 transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                      {tenant.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-foreground">{tenant.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {tenant.tenantCode}
                        {index === 0 && tenant.tenantId === activeTenantId ? " · active" : ""}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{tenant.role}</span>
                </Link>
              ))}
              {viewer.tenants.length === 0 ? (
                <p className="rounded-2xl border border-border bg-background/45 px-4 py-4 text-sm leading-7 text-muted-foreground">아직 속한 워크스페이스가 없습니다.</p>
              ) : null}
            </div>
          </section>

          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Bell className="h-4 w-4 text-primary" />
              읽지 않은 이벤트
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

          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <SearchIcon className="h-4 w-4 text-primary" />
              Quick routes
            </div>
            <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
              <p>개인 홈은 나와 직접 연결된 문서와 공간만 먼저 스캔하는 자리입니다.</p>
              <p>더 깊은 탐색과 운영은 해당 workspace hub에서 계속 이어집니다.</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {activeTenantId ? (
                <Link href={buildSearchHref("", activeTenantId) as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                  현재 워크스페이스 검색
                </Link>
              ) : null}
              {activeTenantId ? (
                <Link href={buildTenantHref(activeTenantId) as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                  활성 공간 열기
                </Link>
              ) : null}
              {primaryRecent ? (
                <Link href={buildTenantHref(primaryRecent.tenantId) as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                  최근 문서 공간 열기
                </Link>
              ) : null}
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

function SignalChip({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/68 px-3 py-1.5">
      <span className="text-[11px] uppercase tracking-[0.18em]">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </span>
  );
}

function ListSurface({
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
