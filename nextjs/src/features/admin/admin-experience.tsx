import Link from "next/link";
import type { Route } from "next";
import type { GuidebookListResponse, PageDetail, PageListResponse, PermissionGateState, ViewerSession } from "@/shared/lib/api-types";
import { buildAdminGuidebookHref, buildAdminPageHref, buildLoginHref, buildOnboardingHref, buildPageHref, buildSearchHref, buildTenantHref } from "@/shared/lib/routes";
import { External, Lock, Pencil } from "@/shared/icons";
import { StatusPanel } from "@/shared/ui/status-panel";
import { summarizeSections } from "@/shared/lib/sections";
import { PageSectionEditor } from "@/features/admin/page-section-editor";

export function AdminGuidebookExperience({
  viewer,
  guidebookId,
  tenantId,
  pages,
  permission,
  guidebooks,
  updateGuidebookAction,
  createPageAction,
  movePageAction,
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
  movePageAction: (formData: FormData) => void | Promise<void>;
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
  const sortedPages = [...(pages?.items ?? [])].sort((left, right) => {
    const leftParent = left.parentPageId ?? -1;
    const rightParent = right.parentPageId ?? -1;
    if (leftParent !== rightParent) {
      return leftParent - rightParent;
    }
    return left.orderInParent - right.orderInParent;
  });

  return (
    <div className="space-y-6">
      <section className="surface-elevated rounded-[30px] border border-border px-6 py-6 shadow-theme-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Guidebook admin</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">{currentGuidebook?.name ?? `Guidebook #${guidebookId}`}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">이 화면은 페이지 디렉터리와 운영 메타데이터를 한 곳에서 다룹니다. 새 문서 생성, 문서 이동, 가이드북 메타 수정까지 이 표면에서 이어집니다.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={buildSearchHref("", tenantId, guidebookId) as Route} className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-medium text-foreground hover:bg-background">
              검색
            </Link>
            {currentGuidebook && sortedPages[0] ? (
              <Link href={buildPageHref({ guidebookId: currentGuidebook.guidebookId, pageId: sortedPages[0].pageId, tenantId }) as Route} className="inline-flex h-10 items-center rounded-xl bg-foreground px-4 text-sm font-medium text-background">
                대표 문서 열기
              </Link>
            ) : null}
          </div>
        </div>
        {status ? (
          <div className={`mt-5 rounded-2xl px-4 py-3 text-sm ${status === "updated" ? "border border-primary/30 bg-primary/10 text-foreground" : "border border-amber-300/50 bg-amber-50 text-amber-900"}`}>
            {status === "updated" ? "guidebook 또는 페이지 위치가 저장되었습니다." : `관리 작업을 완료하지 못했습니다${code ? ` (${code})` : ""}.`}
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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_360px]">
        <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
          <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Page directory</p>
              <p className="mt-1 text-sm text-muted-foreground">대표 문서부터 세부 문서까지 같은 hierarchy 기준으로 정렬됩니다.</p>
            </div>
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{sortedPages.length} pages</span>
          </div>

          <div className="divide-y divide-border">
            {sortedPages.map((page, index) => {
              const previousSibling = findSibling(sortedPages, page, -1);
              const nextSibling = findSibling(sortedPages, page, 1);
              return (
                <div key={page.pageId} className="grid gap-4 py-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      <span>order {page.orderInParent}</span>
                      <span>{page.parentPageId != null ? `parent ${page.parentPageId}` : "root page"}</span>
                      <span>{page.status}</span>
                    </div>
                    <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">{page.title}</p>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">{summarizeSections(page.sections) || "본문 요약이 아직 없습니다."}</p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      access {page.accessPolicy} · usable {String(page.isUsable)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <form action={movePageAction}>
                      <input type="hidden" name="pageId" value={page.pageId} />
                      <input type="hidden" name="targetParentId" value={page.parentPageId ?? ""} />
                      <input type="hidden" name="targetOrder" value={Math.max(0, page.orderInParent - 1)} />
                      <button type="submit" disabled={!previousSibling} className="inline-flex h-9 items-center rounded-xl border border-border px-3 text-xs font-medium text-foreground hover:bg-background disabled:cursor-not-allowed disabled:opacity-40">
                        위로
                      </button>
                    </form>
                    <form action={movePageAction}>
                      <input type="hidden" name="pageId" value={page.pageId} />
                      <input type="hidden" name="targetParentId" value={page.parentPageId ?? ""} />
                      <input type="hidden" name="targetOrder" value={page.orderInParent + 1} />
                      <button type="submit" disabled={!nextSibling} className="inline-flex h-9 items-center rounded-xl border border-border px-3 text-xs font-medium text-foreground hover:bg-background disabled:cursor-not-allowed disabled:opacity-40">
                        아래로
                      </button>
                    </form>
                    <Link href={buildPageHref({ guidebookId, pageId: page.pageId, tenantId }) as Route} className="inline-flex h-9 items-center gap-2 rounded-xl border border-border px-3 text-xs font-medium text-foreground hover:bg-background">
                      읽기
                      <External className="h-4 w-4" />
                    </Link>
                    <Link href={buildAdminPageHref(page.pageId, tenantId) as Route} className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-3 text-xs font-medium text-primary-foreground">
                      편집
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
            {!sortedPages.length ? <p className="py-5 text-sm text-muted-foreground">등록된 페이지가 없습니다.</p> : null}
          </div>
        </section>

        <aside className="space-y-6">
          <form action={updateGuidebookAction} className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <p className="text-sm font-semibold text-foreground">Guidebook settings</p>
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
        description="현재 단계에서는 WRITE 이상 권한에서만 페이지 편집을 허용합니다."
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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Page admin</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">{detail.page.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">페이지 메타데이터와 섹션 배열을 한 번에 수정하는 editor v1입니다. 구조화 UI로 지원하지 않는 블록은 raw JSON 형태로 그대로 보존됩니다.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={buildPageHref({ guidebookId: detail.page.guidebookId, pageId: detail.page.pageId, tenantId }) as Route} className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-medium text-foreground hover:bg-background">
              Reader 보기
            </Link>
            <Link href={buildAdminGuidebookHref(detail.page.guidebookId, tenantId) as Route} className="inline-flex h-10 items-center rounded-xl bg-foreground px-4 text-sm font-medium text-background">
              Guidebook admin
            </Link>
          </div>
        </div>
        {status ? (
          <div className={`mt-5 rounded-2xl px-4 py-3 text-sm ${status === "updated" ? "border border-primary/30 bg-primary/10 text-foreground" : "border border-amber-300/50 bg-amber-50 text-amber-900"}`}>
            {status === "updated" ? "페이지 정보가 저장되었습니다." : `페이지 작업을 완료하지 못했습니다${code ? ` (${code})` : ""}.`}
          </div>
        ) : null}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_340px]">
        <form action={updatePageAction} className="space-y-6">
          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="grid gap-4 md:grid-cols-2">
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
            </div>
          </section>

          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <PageSectionEditor initialSections={detail.page.sections} />
          </section>

          <div className="flex justify-end">
            <button type="submit" className="inline-flex h-11 items-center justify-center rounded-xl bg-foreground px-5 text-sm font-medium text-background">
              페이지 저장
            </button>
          </div>
        </form>

        <aside className="space-y-6">
          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lock className="h-4 w-4 text-primary" />
              Effective permission
            </div>
            <dl className="mt-5 grid gap-4 text-sm">
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
          </section>

          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <p className="text-sm font-semibold text-foreground">Raw page snapshot</p>
            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-[24px] border border-border bg-background/35 px-4 py-4 text-xs leading-6 text-muted-foreground">
              {JSON.stringify(detail.page, null, 2)}
            </pre>
          </section>
        </aside>
      </div>
    </div>
  );
}

function findSibling(items: NonNullable<PageListResponse["items"]>, page: PageListResponse["items"][number], delta: -1 | 1) {
  const siblings = items
    .filter((item) => item.parentPageId === page.parentPageId)
    .sort((left, right) => left.orderInParent - right.orderInParent);
  const index = siblings.findIndex((item) => item.pageId === page.pageId);
  if (index < 0) {
    return null;
  }
  return siblings[index + delta] ?? null;
}
