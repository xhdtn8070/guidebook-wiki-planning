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
  const guidebookItems = guidebooks?.items ?? [];
  const directoryLead = guidebookItems.slice(0, 4);
  const directoryTail = guidebookItems.slice(4);

  return (
    <div className="space-y-8">
      <section className="hero-gradient overflow-hidden rounded-[36px] border border-border px-6 py-8 shadow-theme-lg md:px-10 md:py-10">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.04fr)_440px] xl:items-end">
          <div className="max-w-4xl">
            <span className="pill">Workspace hub</span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.06em] text-foreground md:text-6xl">{tenant.name}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/78">
              이 공간은 개인 홈보다 더 좁고 더 구체적인 문맥입니다. 내 최근 작업과 중요 문서를 먼저 보여주고, 아래에서 대표 guidebook과 전체 디렉터리로
              내려갑니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={buildSearchHref("", tenantId) as Route} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-foreground px-5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5">
                이 워크스페이스 검색
                <SearchIcon className="h-4 w-4" />
              </Link>
              {primaryGuidebook ? (
                <Link
                  href={buildAdminGuidebookHref(primaryGuidebook.guidebookId, tenantId) as Route}
                  className="inline-flex h-12 items-center gap-2 rounded-2xl border border-border bg-background/72 px-5 text-sm font-semibold text-foreground"
                >
                  대표 guidebook 열기
                  <External className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <SignalChip label="Guidebooks" value={guidebookItems.length} />
              <SignalChip label="Recent" value={workspaceRecent.length} />
              <SignalChip label="Starred" value={workspaceStarred.length} />
              <SignalChip label="Visibility" value={tenant.visibility} />
            </div>
          </div>

          <aside className="rounded-[30px] border border-border bg-[hsl(var(--surface-strong))] px-5 py-5 shadow-theme-md">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Workspace entry</p>
            {primaryGuidebook ? (
              <>
                <p className="mt-3 text-sm text-primary">{primaryGuidebook.status}</p>
                <h2 className="mt-2 max-w-sm text-3xl font-semibold tracking-tight text-foreground">{primaryGuidebook.name}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {primaryGuidebook.description || "이 워크스페이스에서 reader, search, 운영 진입을 가장 먼저 연결하는 대표 guidebook입니다."}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span>{tenant.tenantCode}</span>
                  <span>•</span>
                  <span>{tenant.visibility}</span>
                  <span>•</span>
                  <span>{guidebookItems.length} guidebooks</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={buildSearchHref("", tenantId, primaryGuidebook.guidebookId) as Route} className="rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
                    이 guidebook 검색
                  </Link>
                  <Link href={buildAdminGuidebookHref(primaryGuidebook.guidebookId, tenantId) as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                    관리 보기
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{tenant.tenantCode}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  아직 대표 guidebook이 없지만, 이 공간은 검색과 reader, 운영 진입이 같은 tenant 문맥을 유지하도록 준비되어 있습니다.
                </p>
              </>
            )}
          </aside>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_360px]">
        <div className="space-y-6">
          {primaryGuidebook ? (
            <section className="overflow-hidden rounded-[30px] border border-border bg-[hsl(var(--surface-strong))] shadow-theme-md">
              <div className="grid gap-0 md:grid-cols-[0.42fr_minmax(0,1fr)]">
                <div className="hero-gradient min-h-[260px] border-b border-border p-6 md:border-b-0 md:border-r">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-primary">Featured guidebook</p>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground">{primaryGuidebook.name}</h2>
                  <p className="mt-4 text-sm leading-7 text-foreground/72">
                    이 워크스페이스에서 가장 먼저 읽고 운영해야 할 문서를 모으는 기준 guidebook입니다.
                  </p>
                  <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-background/66 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                </div>
                <div className="px-6 py-6">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Why this matters</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {primaryGuidebook.description || "reader, search, admin entry를 모두 이 guidebook을 기준으로 시작하도록 설계합니다."}
                  </p>
                  <div className="mt-6 grid gap-3 md:grid-cols-3">
                    {[
                      { label: "Tenant", value: tenant.tenantCode },
                      { label: "Status", value: primaryGuidebook.status },
                      { label: "Directory", value: `${guidebookItems.length} items` },
                    ].map((item) => (
                      <div key={item.label} className="rounded-[22px] border border-border bg-background/55 px-4 py-4">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                        <p className="mt-2 text-base font-semibold text-foreground">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Link href={buildSearchHref("", tenantId, primaryGuidebook.guidebookId) as Route} className="rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
                      이 guidebook 검색
                    </Link>
                    <Link href={buildAdminGuidebookHref(primaryGuidebook.guidebookId, tenantId) as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                      운영 진입
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Guidebook directory</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">이 워크스페이스의 guidebook 디렉터리</h2>
              </div>
              <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {guidebookItems.length} entries
              </span>
            </div>

            {directoryLead.length > 0 ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {directoryLead.map((guidebook) => (
                  <DirectoryCard key={guidebook.guidebookId} tenantId={tenantId} guidebookId={guidebook.guidebookId} title={guidebook.name} description={guidebook.description} status={guidebook.status} />
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm leading-7 text-muted-foreground">등록된 guidebook이 아직 없습니다.</p>
            )}

            {directoryTail.length > 0 ? (
              <div className="mt-6 divide-y divide-border">
                {directoryTail.map((guidebook) => (
                  <article key={guidebook.guidebookId} className="grid gap-4 py-4 first:pt-0 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-lg font-semibold tracking-tight text-foreground">{guidebook.name}</p>
                        <span className="rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                          {guidebook.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {guidebook.description || "이 워크스페이스의 guidebook입니다. reader와 search가 이 단위로 묶입니다."}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href={buildSearchHref("", tenantId, guidebook.guidebookId) as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                        검색
                      </Link>
                      <Link href={buildAdminGuidebookHref(guidebook.guidebookId, tenantId) as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                        관리
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Zap className="h-4 w-4 text-primary" />
              My flow in this workspace
            </div>
            <div className="mt-5 space-y-5">
              <WorkspaceList
                eyebrow="Recent"
                title="최근 문서"
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
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Layers className="h-4 w-4 text-primary" />
              Workspace context
            </div>
            <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
              <p>이 화면은 개인 홈이 아니라 특정 workspace에 고정된 허브입니다.</p>
              <p>내 최근 문서와 guidebook 디렉터리를 같은 화면에서 연결하고, reader와 search는 이 tenant 문맥을 유지합니다.</p>
              <p>가장 중요한 진입점은 대표 guidebook과 현재 내 흐름입니다.</p>
            </div>
          </section>

          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Bell className="h-4 w-4 text-primary" />
              Workspace notifications
            </div>
            <div className="mt-5 divide-y divide-border">
              {workspaceNotifications.length > 0 ? (
                workspaceNotifications.map((item) => (
                  <article key={item.id} className="py-4 first:pt-0 last:pb-0">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                  </article>
                ))
              ) : (
                <p className="py-1 text-sm leading-7 text-muted-foreground">아직 워크스페이스 알림이 없습니다.</p>
              )}
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
      <section className="hero-gradient grid gap-6 overflow-hidden rounded-[36px] border border-border px-6 py-8 shadow-theme-lg lg:grid-cols-[1.04fr_0.96fr] lg:px-8">
        <div className="max-w-3xl">
          <span className="pill">Secure workspace</span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-6xl">{tenant.name}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/78">
            이 공간은 팀의 institutional knowledge를 위한 private hub입니다. 로그인하면 최근 문서, guidebook 디렉터리, 검색 흐름이 모두 살아납니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={buildLoginHref(`/tenant/${tenant.tenantId}`)} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-foreground px-5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5">
              로그인하고 이 공간 열기
              <External className="h-4 w-4" />
            </Link>
            <Link href={"/introduce" as Route} className="inline-flex h-12 items-center gap-2 rounded-2xl border border-border bg-background/72 px-5 text-sm font-semibold text-foreground">
              서비스 소개 보기
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { label: "Workspace", value: tenant.tenantCode },
              { label: "Visibility", value: tenant.visibility },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-border bg-background/58 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[28px] border border-border bg-background/78 p-5 shadow-theme-md">
          <div className="grid gap-4">
            <div className="rounded-[26px] border border-border bg-[hsl(var(--surface-strong))] px-5 py-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">Recent documentation</p>
                <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Restricted</span>
              </div>
              <div className="mt-4 space-y-3">
                {[1, 2].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-border bg-background/55 px-4 py-4 opacity-80">
                    <div className="h-9 w-9 rounded-xl bg-primary/10" />
                    <div className="min-w-0 flex-1">
                      <div className="h-2.5 w-1/2 rounded-full bg-border" />
                      <div className="mt-2 h-2 w-2/3 rounded-full bg-border/70" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-border bg-[hsl(var(--surface-strong))] px-4 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <SearchIcon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">Global search</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">이 워크스페이스 안의 문서, 용어, 코드 식별자를 바로 찾습니다.</p>
              </div>

              <div className="rounded-[24px] border border-border bg-[hsl(var(--surface-strong))] px-4 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Layers className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">Workspace hub</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">대표 guidebook, 디렉터리, 최근 흐름을 같은 셸에서 엽니다.</p>
              </div>
            </div>

            <div className="rounded-[26px] border border-border bg-[hsl(var(--surface-elevated))] px-5 py-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Star className="h-4 w-4 text-primary" />
                로그인하면 열리는 것
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                <li>최근 이어서 읽을 문서와 중요 guidebook이 이 공간 기준으로 다시 좁혀집니다.</li>
                <li>reader와 search는 현재 tenant 문맥을 유지한 채 이동합니다.</li>
                <li>운영 진입은 대표 guidebook 기준으로 바로 이어집니다.</li>
              </ul>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function DirectoryCard({
  tenantId,
  guidebookId,
  title,
  description,
  status,
}: {
  tenantId: number;
  guidebookId: number;
  title: string;
  description?: string | null;
  status: string;
}) {
  return (
    <article className="group rounded-[26px] border border-border bg-background/45 px-5 py-5 transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BookOpen className="h-5 w-5" />
        </div>
        <span className="rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{status}</span>
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        {description || "이 워크스페이스의 guidebook입니다. reader와 search가 이 단위로 묶입니다."}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link href={buildSearchHref("", tenantId, guidebookId) as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
          검색
        </Link>
        <Link href={buildAdminGuidebookHref(guidebookId, tenantId) as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
          관리
        </Link>
      </div>
    </article>
  );
}

function SignalChip({ label, value }: { label: string; value: number | string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/68 px-3 py-1.5">
      <span className="text-[11px] uppercase tracking-[0.18em]">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </span>
  );
}

function WorkspaceList({
  eyebrow,
  title,
  items,
  emptyMessage,
}: {
  eyebrow: string;
  title: string;
  items: { href: string; title: string; meta: string }[];
  emptyMessage: string;
}) {
  return (
    <section className="rounded-[24px] border border-border bg-background/45 px-5 py-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
      <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">{title}</h3>
      <div className="mt-4 divide-y divide-border">
        {items.length > 0 ? (
          items.map((item) => (
            <Link key={`${item.href}-${item.title}`} href={item.href as Route} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
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
