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
    <div className="animate-rise-in space-y-10">
      <section className="border-b border-border pb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="editorial-eyebrow">Core platform</p>
            <h1 className="mt-3 text-5xl text-foreground">가이드북 #{guidebookId} 운영 면</h1>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center rounded-[6px] border border-border px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Permissions</span>
            <span className="inline-flex items-center rounded-[6px] border border-border px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Archive</span>
            <span className="inline-flex items-center rounded-[6px] bg-primary px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-primary-foreground">New page</span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 border-t border-border pt-6 md:grid-cols-3">
          <MetricRow label="Total documentation" value={`${pages?.items.length ?? 0} articles`} />
          <MetricRow label="Active contributors" value="12 engineers" />
          <MetricRow label="System health" value="Stable v4.2.0" />
        </div>
      </section>

      {guidebooks?.items.length ? (
        <section className="flex flex-wrap gap-2">
          {guidebooks.items.map((item) => (
            <Link
              key={item.guidebookId}
              href={`/admin/guidebooks/${item.guidebookId}?tenantId=${tenantId}` as Route}
              className={`rounded-[6px] px-3 py-2 text-[11px] uppercase tracking-[0.16em] ${item.guidebookId === guidebookId ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}
            >
              {item.name}
            </Link>
          ))}
        </section>
      ) : null}

      <section className="overflow-hidden border border-border bg-panel">
        <div className="hidden gap-4 border-b border-border px-5 py-4 text-[11px] uppercase tracking-[0.16em] text-muted-foreground lg:grid lg:grid-cols-12">
          <span className="lg:col-span-6">Page title / summary</span>
          <span className="lg:col-span-2">Status</span>
          <span className="lg:col-span-2">Access</span>
          <span className="lg:col-span-2">Actions</span>
        </div>
        {pages?.items.map((page) => (
          <div key={page.pageId} className="grid gap-4 border-b border-border px-5 py-5 last:border-b-0 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-6">
              <p className="text-xl text-foreground">{page.title}</p>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">{summarizeSections(page.sections) || "본문 요약이 아직 없습니다."}</p>
            </div>
            <div className="text-sm text-muted-foreground lg:col-span-2">{page.status}</div>
            <div className="text-sm text-muted-foreground lg:col-span-2">{page.accessPolicy}</div>
            <div className="flex flex-col gap-2 lg:col-span-2">
              <Link href={buildPageHref({ guidebookId, pageId: page.pageId, tenantId }) as Route} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground">
                Open
                <External className="h-4 w-4" />
              </Link>
              <Link href={buildAdminPageHref(page.pageId, tenantId) as Route} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-foreground">
                Edit
                <Pencil className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
        {!pages?.items.length ? <p className="px-5 py-5 text-sm text-muted-foreground">등록된 페이지가 없습니다.</p> : null}
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
    <div className="animate-rise-in space-y-8">
      <section className="border-b border-border pb-8">
        <p className="editorial-eyebrow">Admin page</p>
        <h1 className="mt-3 text-5xl text-foreground">{detail.page.title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          editor 본체 대신, 지금은 sections/meta/status/accessPolicy를 그대로 보여 주면서 다음 단계 편집기 구조를 위한 inspection view를 제공합니다.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="border border-border bg-panel px-6 py-6 lg:col-span-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Lock className="h-4 w-4" />
            Effective permission
          </div>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Action</dt>
              <dd className="mt-1 text-foreground">{permission.effectiveAction}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Permission</dt>
              <dd className="mt-1 text-foreground">{permission.effectivePermission ?? "NONE"}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Source</dt>
              <dd className="mt-1 text-foreground">{permission.source}</dd>
            </div>
          </dl>
        </section>

        <section className="border border-border bg-panel px-6 py-6 lg:col-span-8">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Raw page payload</p>
          <pre className="mt-5 overflow-x-auto whitespace-pre-wrap bg-background px-4 py-4 text-xs leading-6 text-muted-foreground">
            {JSON.stringify(detail.page, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-3 text-2xl text-foreground">{value}</p>
    </div>
  );
}
