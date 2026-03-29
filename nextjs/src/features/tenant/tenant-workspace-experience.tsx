import Link from "next/link";
import type { Route } from "next";
import type { GuidebookListResponse, HomeResponse, TenantResponse, ViewerSession } from "@/shared/lib/api-types";
import { Bell, BookOpen, External, Layers, Search as SearchIcon, Star, Zap } from "@/shared/icons";
import { buildAdminGuidebookHref, buildLoginHref, buildPageHref, buildSearchHref } from "@/shared/lib/routes";
import { StatusPanel } from "@/shared/ui/status-panel";

type TenantWorkspaceExperienceProps = {
  viewer: ViewerSession;
  tenantId: number;
  tenant: TenantResponse | null;
  guidebooks: GuidebookListResponse | null;
  home: HomeResponse | null;
  error?: { code: string; message: string } | null;
};

export function TenantWorkspaceExperience({ viewer, tenantId, tenant, guidebooks, home, error }: TenantWorkspaceExperienceProps) {
  if (error || !tenant) {
    return (
      <StatusPanel
        eyebrow={error?.code ?? "TENANT"}
        title="워크스페이스를 불러오지 못했습니다."
        description={error?.message ?? "tenant 상세 응답이 비어 있습니다."}
        tone="warning"
      />
    );
  }

  if (!viewer.user) {
    return <SignedOutWorkspaceGate tenant={tenant} />;
  }

  const isMember = viewer.tenants.some((item) => item.tenantId === tenantId);
  if (!isMember) {
    return (
      <StatusPanel
        eyebrow="Workspace"
        title={`${tenant.name}는 확인했지만 아직 이 워크스페이스에 들어올 권한은 없습니다.`}
        description="현재 계정이 속한 워크스페이스가 아니거나 권한이 부여되지 않았습니다. 먼저 내 홈으로 돌아가거나 다른 워크스페이스를 선택하세요."
        actionHref={"/" as Route}
        actionLabel="내 홈으로 돌아가기"
        tone="muted"
      />
    );
  }

  const workspaceRecent = home?.recentPages.filter((item) => item.tenantId === tenantId) ?? [];
  const workspaceStarred = home?.starredPages.filter((item) => item.tenantId === tenantId) ?? [];
  const workspaceNotifications = home?.notifications.recent.slice(0, 3) ?? [];
  const primaryGuidebook = guidebooks?.items[0] ?? null;
  const featuredGuidebooks = guidebooks?.items.slice(0, 3) ?? [];

  return (
    <div className="space-y-8">
      <section className="hero-gradient overflow-hidden rounded-[36px] border border-border px-6 py-8 shadow-theme-lg md:px-10 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="max-w-3xl">
            <span className="pill">Workspace hub</span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-6xl">{tenant.name}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/78">
              이 공간은 개인 홈보다 더 좁은 문맥입니다. 내가 이 워크스페이스에서 최근에 읽던 문서와 중요 문서를 먼저 보여주고, 아래에서 대표 guidebook과
              전체 디렉터리로 내려갑니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={buildSearchHref("", tenantId) as Route} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-foreground px-5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5">
                이 워크스페이스 검색
                <SearchIcon className="h-4 w-4" />
              </Link>
              {primaryGuidebook ? (
                <Link
                  href={buildAdminGuidebookHref(primaryGuidebook.guidebookId, tenantId) as Route}
                  className="inline-flex h-12 items-center gap-2 rounded-2xl border border-border bg-background/70 px-5 text-sm font-semibold text-foreground"
                >
                  운영 진입
                  <External className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[26px] border border-border bg-background/50 px-5 py-5 shadow-theme-md">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Workspace signals</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <MetricPill label="Guidebooks" value={guidebooks?.items.length ?? 0} />
                <MetricPill label="Recent" value={workspaceRecent.length} />
                <MetricPill label="Starred" value={workspaceStarred.length} />
              </div>
            </div>

            <div className="rounded-[26px] border border-border bg-background/50 px-5 py-5 shadow-theme-md">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Current context</p>
              <div className="mt-4 space-y-2 text-sm leading-7 text-muted-foreground">
                <p>Tenant code: {tenant.tenantCode}</p>
                <p>Visibility: {tenant.visibility}</p>
                <p>Reader와 search는 이 workspace 문맥을 유지합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_380px]">
        <div className="space-y-6">
          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">My flow in this workspace</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">최근 작업과 중요 문서</h2>
              </div>
              <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                tenant scope
              </span>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <WorkspaceList
                eyebrow="Recent"
                title="최근 문서"
                description="내가 이 워크스페이스에서 마지막으로 읽던 문서입니다."
                items={workspaceRecent.map((item) => ({
                  href: buildPageHref({ guidebookId: item.guidebookId, pageId: item.pageId, tenantId }),
                  title: item.title,
                  meta: `${item.viewedAt ? formatDateTime(item.viewedAt) : "recent"} · Guidebook ${item.guidebookId}`,
                }))}
                emptyMessage="아직 이 워크스페이스에서 읽은 문서가 없습니다."
              />

              <WorkspaceList
                eyebrow="Starred"
                title="중요 문서"
                description="개인 홈보다 더 좁은 문맥으로, 이 workspace 안의 중요한 문서만 보여줍니다."
                items={workspaceStarred.map((item) => ({
                  href: buildPageHref({ guidebookId: item.guidebookId, pageId: item.pageId, tenantId }),
                  title: item.title,
                  meta: `${item.starredAt ? formatDateTime(item.starredAt) : "starred"} · Guidebook ${item.guidebookId}`,
                }))}
                emptyMessage="아직 별표한 문서가 없습니다."
              />
            </div>
          </section>

          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Guidebook directory</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">대표 guidebook과 전체 디렉터리</h2>
              </div>
              <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {guidebooks?.items.length ?? 0} entries
              </span>
            </div>
            {primaryGuidebook ? (
              <div className="mt-5 rounded-[28px] border border-border bg-background/45 px-6 py-6">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Featured</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{primaryGuidebook.name}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-8 text-muted-foreground">
                  {primaryGuidebook.description || "이 워크스페이스의 대표 guidebook입니다. reader 진입, 검색, 운영 시작점으로 가장 먼저 쓰이는 영역입니다."}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={buildSearchHref("", tenantId, primaryGuidebook.guidebookId) as Route} className="rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
                    이 guidebook 검색
                  </Link>
                  <Link href={buildAdminGuidebookHref(primaryGuidebook.guidebookId, tenantId) as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                    운영 보기
                  </Link>
                </div>
              </div>
            ) : null}
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredGuidebooks.length > 0 ? (
                featuredGuidebooks.map((guidebook) => (
                  <article key={guidebook.guidebookId} className="rounded-[24px] border border-border bg-background/45 px-5 py-5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{guidebook.status}</p>
                    <p className="mt-3 text-xl font-semibold tracking-tight text-foreground">{guidebook.name}</p>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {guidebook.description || "이 영역의 reader, search, 운영 진입을 한곳에서 묶는 guidebook입니다."}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Link href={buildSearchHref("", tenantId, guidebook.guidebookId) as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                        검색
                      </Link>
                      <Link href={buildAdminGuidebookHref(guidebook.guidebookId, tenantId) as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                        관리
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">등록된 guidebook이 아직 없습니다.</p>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Layers className="h-4 w-4 text-primary" />
              Workspace context
            </div>
            <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
              <p>이 화면은 개인 홈이 아니라 특정 workspace에 고정된 허브입니다.</p>
              <p>내가 이 공간에서 최근에 읽던 문서와 중요한 guidebook을 먼저 보여줍니다.</p>
              <p>reader와 search는 이 tenant 문맥을 유지한 채 이동합니다.</p>
            </div>
          </section>

          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Bell className="h-4 w-4 text-primary" />
              Workspace notifications
            </div>
            <div className="mt-5 space-y-4">
              {workspaceNotifications.length > 0 ? (
                workspaceNotifications.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-border bg-background/40 px-4 py-4">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                  </article>
                ))
              ) : (
                <p className="text-sm leading-7 text-muted-foreground">아직 워크스페이스 알림이 없습니다.</p>
              )}
            </div>
          </section>

          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <BookOpen className="h-4 w-4 text-primary" />
              What opens next
            </div>
            <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
              <p>상단 검색은 이 workspace 안의 문서 검색으로 바로 이어집니다.</p>
              <p>guidebook을 고르면 reader와 운영 화면이 같은 제품 셸에서 연결됩니다.</p>
              <p>실데이터 시드 이후에는 이 영역이 실제 문서 목록으로 더 풍부해집니다.</p>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

function SignedOutWorkspaceGate({ tenant }: { tenant: TenantResponse }) {
  return (
    <div className="space-y-6">
      <section className="surface-elevated grid gap-6 overflow-hidden rounded-[34px] border border-border px-6 py-8 shadow-theme-lg lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
        <div className="max-w-3xl">
          <span className="pill">Workspace preview</span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-6xl">{tenant.name}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            이 워크스페이스는 로그인 후에 비로소 내 최근 문서, 중요 문서, guidebook 디렉터리, 검색 흐름이 살아나는 공간입니다. 지금은 공간의 정체성과
            서비스 소개만 먼저 보여줍니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={buildLoginHref(`/tenant/${tenant.tenantId}`)} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-foreground px-5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5">
              로그인하고 이 공간 열기
              <External className="h-4 w-4" />
            </Link>
            <Link href={"/introduce" as Route} className="inline-flex h-12 items-center gap-2 rounded-2xl border border-border bg-background/70 px-5 text-sm font-semibold text-foreground">
              서비스 소개 보기
            </Link>
          </div>
        </div>

        <aside className="quiet-grid rounded-[28px] border border-border bg-background/72 p-5">
          <div className="rounded-[24px] border border-border bg-[hsl(var(--surface-strong))] px-5 py-5 shadow-theme-md">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">What unlocks after login</p>
            <div className="mt-4 space-y-3">
              {[
                {
                  icon: Zap,
                  title: "내 최근 문서",
                  body: "이 공간에서 내가 마지막에 읽던 문서를 다시 이어서 봅니다.",
                },
                {
                  icon: Star,
                  title: "중요 guidebook",
                  body: "내 역할과 관심사에 맞는 guidebook을 이 공간 기준으로 다시 좁혀 봅니다.",
                },
                {
                  icon: SearchIcon,
                  title: "공간 단위 검색",
                  body: "문서, 용어, 코드 식별자를 이 워크스페이스 안에서 바로 검색합니다.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-border bg-background/55 px-4 py-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Icon className="h-4 w-4 text-primary" />
                      {item.title}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          { label: "Tenant code", value: tenant.tenantCode },
          { label: "Visibility", value: tenant.visibility },
          { label: "Route", value: `/tenant/${tenant.tenantId}` },
        ].map((item) => (
          <article key={item.label} className="surface-elevated rounded-[24px] border border-border px-5 py-5 shadow-theme-md">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
            <p className="mt-3 text-xl font-semibold tracking-tight text-foreground">{item.value}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

function MetricPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-background/55 px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{value}</p>
    </div>
  );
}

function WorkspaceList({
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
    <section className="rounded-[24px] border border-border bg-background/45 px-5 py-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
      <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
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
