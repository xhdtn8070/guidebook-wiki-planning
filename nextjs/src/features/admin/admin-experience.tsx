import Link from "next/link";
import type { Route } from "next";
import type { GuidebookListResponse, PageDetail, PageListResponse, PermissionGateState, ViewerSession } from "@/shared/lib/api-types";
import { buildAdminGuidebookHref, buildAdminPageHref, buildLoginHref, buildPageHref } from "@/shared/lib/routes";
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
}: {
  viewer: ViewerSession;
  guidebookId: number;
  tenantId: number | null;
  pages: PageListResponse | null;
  permission: PermissionGateState | null;
  guidebooks: GuidebookListResponse | null;
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
    return (
      <StatusPanel
        eyebrow="Tenant"
        title="관리 진입에는 tenant가 필요합니다."
        description="관리자 화면은 guidebook/page permission과 tenant 컨텍스트를 함께 사용합니다."
        tone="warning"
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

  return (
    <div className="space-y-8">
      <section className="hero-gradient overflow-hidden rounded-[32px] border border-border px-6 py-8 shadow-theme-lg md:px-8">
        <p className="pill pill-ghost">Admin entry</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.05em] text-foreground">가이드북 #{guidebookId} 관리 골격</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/80">
          이 단계에서는 editor 본체를 열지 않고, 목록과 권한 게이트만 먼저 실제 API로 연결합니다.
        </p>
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

      <section className="surface-elevated divide-y divide-border rounded-[28px] border border-border px-6 py-2 shadow-theme-md">
        {pages?.items.map((page) => (
          <div key={page.pageId} className="flex flex-col gap-4 py-5 md:flex-row md:items-start md:justify-between">
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
                편집 진입
                <Pencil className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
        {!pages?.items.length ? <p className="py-5 text-sm text-muted-foreground">등록된 페이지가 없습니다.</p> : null}
      </section>
    </div>
  );
}

export function AdminPageExperience({
  viewer,
  pageId,
  tenantId,
  detail,
  permission,
}: {
  viewer: ViewerSession;
  pageId: number;
  tenantId: number | null;
  detail: PageDetail | null;
  permission: PermissionGateState | null;
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
    return (
      <StatusPanel
        eyebrow="Tenant"
        title="페이지 관리자 진입에는 tenant가 필요합니다."
        description="관리자 화면도 읽기 화면과 같은 tenant context를 요구합니다."
        tone="warning"
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
    <div className="space-y-8">
      <section className="hero-gradient overflow-hidden rounded-[32px] border border-border px-6 py-8 shadow-theme-lg md:px-8">
        <p className="pill pill-ghost">Admin page</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.05em] text-foreground">{detail.page.title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/80">
          editor 본체 대신, 지금은 sections/meta/status/accessPolicy를 그대로 읽어와 다음 단계의 편집기 구조를 확인할 수 있게 둡니다.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Lock className="h-4 w-4 text-primary" />
            Effective permission
          </div>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Action</dt>
              <dd className="mt-1 font-medium text-foreground">{permission.effectiveAction}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Permission</dt>
              <dd className="mt-1 font-medium text-foreground">{permission.effectivePermission ?? "NONE"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Source</dt>
              <dd className="mt-1 font-medium text-foreground">{permission.source}</dd>
            </div>
          </dl>
        </section>

        <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
          <p className="text-sm font-medium text-foreground">Raw page payload</p>
          <pre className="mt-5 overflow-x-auto whitespace-pre-wrap rounded-[24px] border border-border bg-background/35 px-4 py-4 text-xs leading-6 text-muted-foreground">
            {JSON.stringify(detail.page, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
}
