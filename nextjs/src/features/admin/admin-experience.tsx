import Link from "next/link";
import type { Route } from "next";
import type { GuidebookListResponse, PageDetail, PageListResponse, PermissionGateState, ViewerSession } from "@/shared/lib/api-types";
import { buildAdminGuidebookHref, buildAdminPageHref, buildLoginHref, buildOnboardingHref, buildPageHref, buildTenantHref } from "@/shared/lib/routes";
import { External, Lock, Pencil } from "@/shared/icons";
import { StatusPanel } from "@/shared/ui/status-panel";
import { summarizeSections } from "@/shared/lib/sections";

export function AdminGuidebookExperience({
  viewer,
  guidebookId,
  tenantId,
  pages,
  permission,
  guidebooks,
  updateGuidebookAction,
  createPageAction,
  status,
  code,
}: {
  viewer: ViewerSession;
  guidebookId: number;
  tenantId: number | null;
  pages: PageListResponse | null;
  permission: PermissionGateState | null;
  guidebooks: GuidebookListResponse | null;
  updateGuidebookAction: (formData: FormData) => void | Promise<void>;
  createPageAction: (formData: FormData) => void | Promise<void>;
  status: "updated" | "error" | null;
  code: string | null;
}) {
  if (!viewer.user) {
    return (
      <StatusPanel
        eyebrow="Auth"
        title="관리 화면에 들어가려면 로그인해야 합니다."
        description="가이드북/페이지 permission 확인 전에 먼저 세션이 필요합니다."
        actionHref={buildLoginHref(buildAdminGuidebookHref(guidebookId, tenantId))}
        actionLabel="로그인"
      />
    );
  }

  if (!tenantId) {
    const fallbackTenantId = viewer.activeTenantId ?? viewer.tenants[0]?.tenantId ?? null;
    return (
      <StatusPanel
        eyebrow="Tenant"
        title="관리 진입에는 tenant가 필요합니다."
        description="관리자 화면은 guidebook/page permission과 tenant 컨텍스트를 함께 사용합니다."
        tone="warning"
        actionHref={(fallbackTenantId != null ? buildTenantHref(fallbackTenantId) : buildOnboardingHref(buildAdminGuidebookHref(guidebookId))) as Route}
        actionLabel={fallbackTenantId != null ? "워크스페이스 열기" : "워크스페이스 만들기"}
      />
    );
  }

  if (!permission || permission.effectiveAction === "DENY" || permission.effectiveAction === "READ") {
    return (
      <StatusPanel
        eyebrow="Permission"
        title="이 가이드북을 관리할 권한이 없습니다."
        description="현재 사용자의 effectiveAction이 WRITE 이상일 때만 관리 진입을 허용합니다."
        tone="warning"
      />
    );
  }

  const currentGuidebook = guidebooks?.items.find((item) => item.guidebookId === guidebookId) ?? null;

  return (
    <div className="space-y-6">
      <section className="surface-elevated rounded-[30px] border border-border px-6 py-6 shadow-theme-md">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Guidebook admin</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">{currentGuidebook?.name ?? `Guidebook #${guidebookId}`}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">이 단계에서는 가이드북 수정과 새 페이지 생성을 실제 API로 연결합니다. editor 본체는 아직 제외하고, 운영 동선만 먼저 붙입니다.</p>
        {status ? (
          <div className={`mt-5 rounded-2xl px-4 py-3 text-sm ${status === "updated" ? "border border-primary/30 bg-primary/10 text-foreground" : "border border-amber-300/50 bg-amber-50 text-amber-900"}`}>
            {status === "updated" ? "guidebook 정보가 저장되었습니다." : `관리 작업을 완료하지 못했습니다${code ? ` (${code})` : ""}.`}
          </div>
        ) : null}
      </section>

      {guidebooks?.items.length ? (
        <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Guidebooks in tenant</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {guidebooks.items.map((item) => (
              <Link
                key={item.guidebookId}
                href={`/admin/guidebooks/${item.guidebookId}?tenantId=${tenantId}` as Route}
                className={`rounded-xl px-3 py-2 text-sm ${item.guidebookId === guidebookId ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-background/45"}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_360px]">
        <section className="surface-elevated rounded-[28px] border border-border px-6 py-2 shadow-theme-md">
          {pages?.items.map((page) => (
            <div key={page.pageId} className="flex flex-col gap-4 border-b border-border py-5 last:border-b-0 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <p className="text-lg font-semibold tracking-tight text-foreground">{page.title}</p>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">{summarizeSections(page.sections) || "본문 요약이 아직 없습니다."}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  status {page.status} · usable {String(page.isUsable)} · access {page.accessPolicy}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link href={buildPageHref({ guidebookId, pageId: page.pageId, tenantId }) as Route} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium">
                  읽기
                  <External className="h-4 w-4" />
                </Link>
                <Link href={buildAdminPageHref(page.pageId, tenantId) as Route} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                  기본 편집
                  <Pencil className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
          {!pages?.items.length ? <p className="py-5 text-sm text-muted-foreground">등록된 페이지가 없습니다.</p> : null}
        </section>

        <aside className="space-y-6">
          <form action={updateGuidebookAction} className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <p className="text-sm font-semibold text-foreground">Guidebook 설정</p>
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-foreground">이름</span>
                <input
                  name="name"
                  defaultValue={currentGuidebook?.name ?? ""}
                  className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-foreground">설명</span>
                <textarea
                  name="description"
                  defaultValue={currentGuidebook?.description ?? ""}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-foreground">상태</span>
                <select
                  name="status"
                  defaultValue={currentGuidebook?.status ?? "PUBLISHED"}
                  className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
                >
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </label>
              <button type="submit" className="inline-flex h-11 items-center justify-center rounded-xl bg-foreground px-4 text-sm font-medium text-background">
                Guidebook 저장
              </button>
            </div>
          </form>

          <form action={createPageAction} className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <p className="text-sm font-semibold text-foreground">새 페이지 만들기</p>
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-foreground">제목</span>
                <input name="title" placeholder="새 운영 문서" className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-foreground">본문</span>
                <textarea
                  name="content"
                  rows={6}
                  placeholder="이 페이지를 위한 첫 markdown 내용을 입력하세요."
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
              <button type="submit" className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground">
                새 페이지 만들기
              </button>
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
}

export function AdminPageExperience({
  viewer,
  pageId,
  tenantId,
  detail,
  permission,
  updatePageAction,
  status,
  code,
}: {
  viewer: ViewerSession;
  pageId: number;
  tenantId: number | null;
  detail: PageDetail | null;
  permission: PermissionGateState | null;
  updatePageAction: (formData: FormData) => void | Promise<void>;
  status: "updated" | "error" | null;
  code: string | null;
}) {
  if (!viewer.user) {
    return (
      <StatusPanel
        eyebrow="Auth"
        title="편집 화면에 들어가려면 로그인해야 합니다."
        description="현재 단계의 관리자 화면은 세션과 tenant 컨텍스트를 모두 전제로 합니다."
        actionHref={buildLoginHref(buildAdminPageHref(pageId, tenantId))}
        actionLabel="로그인"
      />
    );
  }

  if (!tenantId) {
    const fallbackTenantId = viewer.activeTenantId ?? viewer.tenants[0]?.tenantId ?? null;
    return (
      <StatusPanel
        eyebrow="Tenant"
        title="페이지 관리자 진입에는 tenant가 필요합니다."
        description="관리자 화면도 읽기 화면과 같은 tenant context를 요구합니다."
        tone="warning"
        actionHref={(fallbackTenantId != null ? buildTenantHref(fallbackTenantId) : buildOnboardingHref(buildAdminPageHref(pageId))) as Route}
        actionLabel={fallbackTenantId != null ? "워크스페이스 열기" : "워크스페이스 만들기"}
      />
    );
  }

  if (!permission || (permission.effectiveAction !== "WRITE" && permission.effectiveAction !== "MANAGE")) {
    return (
      <StatusPanel
        eyebrow="Permission"
        title="편집 권한이 아직 없습니다."
        description="현재 단계에서는 관리 화면을 gate 용도로만 만들고, 실제 editor 본체는 다음 단계에서 붙입니다."
        tone="warning"
      />
    );
  }

  if (!detail) {
    return <StatusPanel eyebrow="Page" title="페이지 상세를 불러오지 못했습니다." description="관리 패널을 구성할 데이터가 비어 있습니다." tone="warning" />;
  }

  return (
    <div className="space-y-6">
      <section className="surface-elevated rounded-[30px] border border-border px-6 py-6 shadow-theme-md">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Page admin</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">{detail.page.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">이 라운드에서는 제목, 접근 정책, 상태 같은 기본 운영 속성만 먼저 편집합니다.</p>
        {status ? (
          <div className={`mt-5 rounded-2xl px-4 py-3 text-sm ${status === "updated" ? "border border-primary/30 bg-primary/10 text-foreground" : "border border-amber-300/50 bg-amber-50 text-amber-900"}`}>
            {status === "updated" ? "페이지 정보가 저장되었습니다." : `페이지 작업을 완료하지 못했습니다${code ? ` (${code})` : ""}.`}
          </div>
        ) : null}
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <form action={updatePageAction} className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Pencil className="h-4 w-4 text-primary" />
            Page settings
          </div>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-foreground">제목</span>
              <input
                name="title"
                defaultValue={detail.page.title}
                className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-foreground">상태</span>
              <select name="status" defaultValue={detail.page.status} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary">
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="DRAFT">DRAFT</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-foreground">접근 정책</span>
              <select
                name="accessPolicy"
                defaultValue={detail.page.accessPolicy}
                className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
              >
                <option value="INHERIT">INHERIT</option>
                <option value="PUBLIC">PUBLIC</option>
                <option value="TENANT_ONLY">TENANT_ONLY</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-foreground">Usable</span>
              <select name="isUsable" defaultValue={String(detail.page.isUsable)} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary">
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            </label>
            <button type="submit" className="inline-flex h-11 items-center justify-center rounded-xl bg-foreground px-4 text-sm font-medium text-background">
              페이지 저장
            </button>
          </div>
        </form>

        <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Lock className="h-4 w-4 text-primary" />
            Effective permission
          </div>
          <dl className="mt-5 grid gap-4 md:grid-cols-3 text-sm">
            <div className="rounded-2xl border border-border bg-background/45 px-4 py-4">
              <dt className="text-muted-foreground">Action</dt>
              <dd className="mt-1 font-medium text-foreground">{permission.effectiveAction}</dd>
            </div>
            <div className="rounded-2xl border border-border bg-background/45 px-4 py-4">
              <dt className="text-muted-foreground">Permission</dt>
              <dd className="mt-1 font-medium text-foreground">{permission.effectivePermission ?? "NONE"}</dd>
            </div>
            <div className="rounded-2xl border border-border bg-background/45 px-4 py-4">
              <dt className="text-muted-foreground">Source</dt>
              <dd className="mt-1 font-medium text-foreground">{permission.source}</dd>
            </div>
          </dl>

          <pre className="mt-5 overflow-x-auto whitespace-pre-wrap rounded-[24px] border border-border bg-background/35 px-4 py-4 text-xs leading-6 text-muted-foreground">
            {JSON.stringify(detail.page, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
}
