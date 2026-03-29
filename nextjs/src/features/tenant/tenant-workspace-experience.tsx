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
  createGuidebookAction: (formData: FormData) => void | Promise<void>;
  status: "created" | "error" | null;
  code: string | null;
};

export function TenantWorkspaceExperience({
  viewer,
  tenantId,
  tenant,
  guidebooks,
  home,
  error,
  createGuidebookAction,
  status,
  code,
}: TenantWorkspaceExperienceProps) {
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
  const hasActivity = workspaceRecent.length > 0 || workspaceStarred.length > 0;

  return (
    <div className="space-y-6">
      <section className="surface-elevated rounded-[30px] border border-border px-6 py-6 shadow-theme-md">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Workspace hub</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">{tenant.name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              개인 홈에서 공간을 고른 뒤에는 이 허브에서 최근 작업과 대표 guidebook, 디렉터리를 같은 문맥으로 이어서 봅니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={buildSearchHref("", tenantId) as Route} className="inline-flex h-11 items-center gap-2 rounded-xl bg-foreground px-4 text-sm font-medium text-background">
              이 워크스페이스 검색
              <SearchIcon className="h-4 w-4" />
            </Link>
            {primaryGuidebook ? (
              <Link href={buildAdminGuidebookHref(primaryGuidebook.guidebookId, tenantId) as Route} className="inline-flex h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium text-foreground">
                대표 guidebook 관리
                <External className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-sm text-muted-foreground">
          <SignalChip label="Code" value={tenant.tenantCode} />
          <SignalChip label="Visibility" value={tenant.visibility} />
          <SignalChip label="Guidebooks" value={guidebookItems.length} />
          <SignalChip label="Recent" value={workspaceRecent.length} />
          <SignalChip label="Starred" value={workspaceStarred.length} />
        </div>
      </section>

      {status ? (
        <section className={`rounded-[24px] border px-4 py-3 text-sm ${status === "created" ? "border-primary/30 bg-primary/10 text-foreground" : "border-amber-300/50 bg-amber-50 text-amber-900"}`}>
          {status === "created" ? "새 guidebook이 생성되었습니다." : `guidebook 작업을 완료하지 못했습니다${code ? ` (${code})` : ""}.`}
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.06fr)_360px]">
        <div className="space-y-6">
          {!hasActivity ? (
            <section className="hero-gradient rounded-[30px] border border-border px-6 py-7 shadow-theme-md">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">First activity</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">이 공간의 첫 guidebook과 첫 문서를 열면 허브가 자동으로 개인화됩니다.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/78">
                최근 작업과 중요 문서는 아직 비어 있습니다. 먼저 대표 guidebook을 열거나 새 guidebook을 만들어 운영 흐름을 시작하세요.
              </p>
            </section>
          ) : null}

          <WorkspaceList
            id="recent"
            eyebrow="Recent"
            title="내 최근 작업"
            items={workspaceRecent.map((item) => ({
              href: buildPageHref({ guidebookId: item.guidebookId, pageId: item.pageId, tenantId }),
              title: item.title,
              meta: `${item.viewedAt ? formatDateTime(item.viewedAt) : "recent"} · Guidebook ${item.guidebookId}`,
            }))}
            emptyMessage="아직 이 워크스페이스에서 읽은 문서가 없습니다."
          />

          <WorkspaceList
            id="starred"
            eyebrow="Starred"
            title="내 중요 문서"
            items={workspaceStarred.map((item) => ({
              href: buildPageHref({ guidebookId: item.guidebookId, pageId: item.pageId, tenantId }),
              title: item.title,
              meta: `${item.starredAt ? formatDateTime(item.starredAt) : "starred"} · Guidebook ${item.guidebookId}`,
            }))}
            emptyMessage="아직 중요 문서로 고른 페이지가 없습니다."
          />

          {primaryGuidebook ? (
            <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Featured guidebook</p>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">{primaryGuidebook.name}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                    {primaryGuidebook.description || "이 워크스페이스에서 reader, search, 운영 진입을 가장 먼저 연결하는 대표 guidebook입니다."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={buildSearchHref("", tenantId, primaryGuidebook.guidebookId) as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                    이 guidebook 검색
                  </Link>
                  <Link href={buildAdminGuidebookHref(primaryGuidebook.guidebookId, tenantId) as Route} className="rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
                    운영 진입
                  </Link>
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[
                  { label: "Status", value: primaryGuidebook.status },
                  { label: "Tenant", value: tenant.tenantCode },
                  { label: "Directory", value: `${guidebookItems.length} guidebooks` },
                ].map((item) => (
                  <div key={item.label} className="rounded-[22px] border border-border bg-background/55 px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-base font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section id="directory" className="surface-elevated scroll-mt-24 rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Guidebook directory</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">guidebook 디렉터리</h2>
              </div>
              <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {guidebookItems.length} entries
              </span>
            </div>

            {guidebookItems.length > 0 ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {guidebookItems.map((guidebook) => (
                  <DirectoryCard
                    key={guidebook.guidebookId}
                    tenantId={tenantId}
                    guidebookId={guidebook.guidebookId}
                    title={guidebook.name}
                    description={guidebook.description}
                    status={guidebook.status}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm leading-7 text-muted-foreground">등록된 guidebook이 아직 없습니다.</p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Zap className="h-4 w-4 text-primary" />
              운영 시작
            </div>
            <form action={createGuidebookAction} className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-foreground">Guidebook 이름</span>
                <input name="name" placeholder="팀 문서 허브" className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-foreground">코드</span>
                <input name="code" placeholder="team-docs" className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-foreground">설명</span>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="이 워크스페이스에서 다루는 핵심 문서 묶음을 설명합니다."
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-foreground">상태</span>
                <select name="status" defaultValue="PUBLISHED" className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary">
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="DRAFT">DRAFT</option>
                </select>
              </label>
              <button type="submit" className="inline-flex h-11 items-center justify-center rounded-xl bg-foreground px-4 text-sm font-medium text-background">
                새 guidebook 만들기
              </button>
            </form>
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

          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Layers className="h-4 w-4 text-primary" />
              Workspace context
            </div>
            <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
              <p>이 화면은 내 흐름과 guidebook 디렉터리를 함께 보여주는 워크스페이스 허브입니다.</p>
              <p>reader와 search, 운영 진입은 모두 현재 tenant 문맥을 유지한 채 이어집니다.</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function SignedOutWorkspaceGate({ tenant }: { tenant: TenantResponse }) {
  return (
    <section className="hero-gradient grid gap-6 overflow-hidden rounded-[36px] border border-border px-6 py-8 shadow-theme-lg lg:grid-cols-[1.04fr_0.96fr] lg:px-8">
      <div className="max-w-3xl">
        <span className="pill">Secure workspace</span>
        <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-6xl">{tenant.name}</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/78">
          이 공간은 팀의 지식과 운영 문서를 관리하는 private workspace입니다. 로그인하면 최근 문서, 대표 guidebook, 디렉터리를 같은 셸에서 이어서 볼 수 있습니다.
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
      </div>

      <aside className="rounded-[28px] border border-border bg-background/78 p-5 shadow-theme-md">
        <div className="grid gap-4">
          <div className="rounded-[24px] border border-border bg-[hsl(var(--surface-strong))] px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Workspace</p>
            <p className="mt-2 text-lg font-semibold text-foreground">{tenant.tenantCode}</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">로그인 후에는 내 최근 작업, 중요 문서, guidebook 디렉터리가 이 공간 기준으로 다시 좁혀집니다.</p>
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
        </div>
      </aside>
    </section>
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
  id,
  eyebrow,
  title,
  items,
  emptyMessage,
}: {
  id: string;
  eyebrow: string;
  title: string;
  items: { href: string; title: string; meta: string }[];
  emptyMessage: string;
}) {
  return (
    <section id={id} className="surface-elevated scroll-mt-24 rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
      <div className="border-b border-border pb-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">{title}</h2>
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
