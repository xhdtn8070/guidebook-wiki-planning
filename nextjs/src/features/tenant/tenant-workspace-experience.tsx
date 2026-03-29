import Link from "next/link";
import type { Route } from "next";
import type { GuidebookListResponse, HomeResponse, TenantResponse, ViewerSession } from "@/shared/lib/api-types";
import { Bell, BookOpen, External, Layers, Search as SearchIcon, Star, Zap } from "@/shared/icons";
import { buildAdminGuidebookHref, buildLoginHref, buildPageHref, buildSearchHref, buildTenantSettingsHref } from "@/shared/lib/routes";
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
  const membership = viewer.tenants.find((item) => item.tenantId === tenantId) ?? null;
  const hasActivity = workspaceRecent.length > 0 || workspaceStarred.length > 0;

  return (
    <div className="space-y-6">
      <section className="surface-elevated rounded-[30px] border border-border px-6 py-6 shadow-theme-md">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Workspace hub</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">{tenant.name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              이 화면은 워크스페이스 정체성과 guidebook 디렉터리를 먼저 보여주고, 그 아래에 내 최근 작업과 중요 문서를 이어 붙이는 허브입니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={buildSearchHref("", tenantId) as Route} className="inline-flex h-11 items-center gap-2 rounded-xl bg-foreground px-4 text-sm font-medium text-background">
              이 워크스페이스 검색
              <SearchIcon className="h-4 w-4" />
            </Link>
            <Link href={buildTenantSettingsHref(tenantId) as Route} className="inline-flex h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium text-foreground">
              워크스페이스 설정
              <Layers className="h-4 w-4" />
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
          <SignalChip label="Role" value={membership?.role ?? "member"} />
          <SignalChip label="Guidebooks" value={guidebookItems.length} />
        </div>
      </section>

      {status ? (
        <section className={`rounded-[24px] border px-4 py-3 text-sm ${status === "created" ? "border-primary/30 bg-primary/10 text-foreground" : "border-amber-300/50 bg-amber-50 text-amber-900"}`}>
          {status === "created" ? "새 guidebook이 생성되었습니다." : `guidebook 작업을 완료하지 못했습니다${code ? ` (${code})` : ""}.`}
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.06fr)_360px]">
        <div className="space-y-6">
          {primaryGuidebook ? (
            <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Featured guidebook</p>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">{primaryGuidebook.name}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                    {primaryGuidebook.description || "reader, search, 운영 동선을 가장 먼저 연결하는 대표 guidebook입니다."}
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
                <SummaryBlock label="Status" value={primaryGuidebook.status} />
                <SummaryBlock label="Directory" value={`${guidebookItems.length} guidebooks`} />
                <SummaryBlock label="Workspace" value={tenant.tenantCode} />
              </div>
            </section>
          ) : (
            <section className="hero-gradient rounded-[30px] border border-border px-6 py-7 shadow-theme-md">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">First guidebook</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">대표 guidebook이 아직 없어 이 허브가 비어 보입니다.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/78">
                아래 운영 시작 영역에서 첫 guidebook을 만들면 검색, reader, 관리 동선이 이 공간 기준으로 묶이기 시작합니다.
              </p>
            </section>
          )}

          <section id="directory" className="surface-elevated scroll-mt-24 rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Guidebook directory</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">guidebook 디렉터리</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                  공간의 문서 묶음을 먼저 훑고, 그 안으로 들어간 뒤 reader와 관리 화면으로 이동하는 진입면입니다.
                </p>
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

          {!hasActivity ? (
            <section className="rounded-[26px] border border-border bg-[hsl(var(--surface-elevated))] px-6 py-5 shadow-theme-md">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Personalized next</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                최근 작업과 중요 문서는 아직 비어 있습니다. guidebook 하나를 열고 reader를 사용하기 시작하면 이 허브가 자동으로 개인화됩니다.
              </p>
            </section>
          ) : null}

          <WorkspaceList
            id="recent"
            eyebrow="Recent"
            title="내 최근 작업"
            description="이 워크스페이스에서 최근에 열었던 페이지와 흐름을 먼저 보여줍니다."
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
            description="다시 봐야 하는 문서를 개인 홈과 같은 기준으로 좁혀 보여줍니다."
            items={workspaceStarred.map((item) => ({
              href: buildPageHref({ guidebookId: item.guidebookId, pageId: item.pageId, tenantId }),
              title: item.title,
              meta: `${item.starredAt ? formatDateTime(item.starredAt) : "starred"} · Guidebook ${item.guidebookId}`,
            }))}
            emptyMessage="아직 중요 문서로 고른 페이지가 없습니다."
          />
        </div>

        <aside className="space-y-6">
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
              <p>이 허브는 워크스페이스 정체성과 guidebook 디렉터리를 먼저 보여주고, 그 아래에 개인 흐름을 다시 연결합니다.</p>
              <p>운영 수정은 settings와 admin으로 분리해, 메인 surface가 생성 폼으로 무거워지지 않게 유지합니다.</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href={buildTenantSettingsHref(tenantId) as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                공간 설정
              </Link>
              {primaryGuidebook ? (
                <Link href={buildAdminGuidebookHref(primaryGuidebook.guidebookId, tenantId) as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                  대표 guidebook 관리
                </Link>
              ) : null}
            </div>
          </section>

          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Zap className="h-4 w-4 text-primary" />
              운영 시작
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">새 guidebook 생성은 여기서 시작하고, 세부 운영은 admin과 settings에서 이어갑니다.</p>
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
          이 공간은 팀의 지식과 운영 문서를 관리하는 private workspace입니다. 로그인하면 대표 guidebook, 디렉터리, 내 최근 작업이 같은 셸 안에서 이어집니다.
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
            <p className="mt-2 text-sm leading-7 text-muted-foreground">로그인 후에는 이 공간 기준으로 guidebook 디렉터리와 내 흐름이 함께 좁혀집니다.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-border bg-[hsl(var(--surface-strong))] px-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <SearchIcon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">Workspace search</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">문서, 용어, 코드 식별자를 이 공간 범위 안에서 빠르게 찾습니다.</p>
            </div>
            <div className="rounded-[24px] border border-border bg-[hsl(var(--surface-strong))] px-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Layers className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">Guidebook hub</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">대표 guidebook과 디렉터리가 워크스페이스의 기본 진입면이 됩니다.</p>
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

function SummaryBlock({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-[22px] border border-border bg-background/55 px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}

function WorkspaceList({
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
