import Link from "next/link";
import type { Route } from "next";
import type { GuidebookListResponse, TenantResponse, ViewerSession } from "@/shared/lib/api-types";
import { Layers, Pencil, Search as SearchIcon } from "@/shared/icons";
import { buildAdminGuidebookHref, buildMeHref, buildSearchHref, buildTenantHref } from "@/shared/lib/routes";
import { StatusPanel } from "@/shared/ui/status-panel";

type TenantSettingsExperienceProps = {
  viewer: ViewerSession;
  tenantId: number;
  tenant: TenantResponse | null;
  guidebooks: GuidebookListResponse | null;
  error?: { code: string; message: string } | null;
  action: (formData: FormData) => void | Promise<void>;
  status: "updated" | "error" | null;
  code: string | null;
};

export function TenantSettingsExperience({
  viewer,
  tenantId,
  tenant,
  guidebooks,
  error,
  action,
  status,
  code,
}: TenantSettingsExperienceProps) {
  if (error || !tenant) {
    return (
      <StatusPanel
        eyebrow={error?.code ?? "SETTINGS"}
        title="워크스페이스 설정을 불러오지 못했습니다."
        description={error?.message ?? "tenant 응답이 비어 있습니다."}
        tone="warning"
      />
    );
  }

  if (!viewer.user) {
    return (
      <StatusPanel
        eyebrow="Workspace settings"
        title="설정을 보려면 먼저 로그인이 필요합니다."
        description="워크스페이스 설정은 멤버 권한이 있을 때만 열 수 있습니다."
        actionHref={"/login" as Route}
        actionLabel="로그인"
        tone="muted"
      />
    );
  }

  const isMember = viewer.tenants.some((item) => item.tenantId === tenantId);
  if (!isMember) {
    return (
      <StatusPanel
        eyebrow="Workspace settings"
        title="이 워크스페이스의 설정 권한이 없습니다."
        description="워크스페이스 설정은 현재 공간의 멤버만 접근할 수 있습니다."
        actionHref={buildTenantHref(tenantId) as Route}
        actionLabel="워크스페이스로 돌아가기"
        tone="muted"
      />
    );
  }

  const activeMembership = viewer.tenants.find((item) => item.tenantId === tenantId) ?? null;
  const featuredGuidebook = guidebooks?.items[0] ?? null;

  return (
    <div className="space-y-6">
      <section className="surface-elevated rounded-[30px] border border-border px-6 py-6 shadow-theme-md">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Workspace settings</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">{tenant.name} 설정</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              이 화면은 현재 워크스페이스의 메타데이터와 기본 공개 범위만 다룹니다. guidebook과 page 운영은 별도 허브와 관리 화면에서 이어갑니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={buildTenantHref(tenantId) as Route} className="inline-flex h-11 items-center rounded-xl border border-border px-4 text-sm font-medium text-foreground">
              워크스페이스로 돌아가기
            </Link>
            {featuredGuidebook ? (
              <Link href={buildAdminGuidebookHref(featuredGuidebook.guidebookId, tenantId) as Route} className="inline-flex h-11 items-center rounded-xl bg-foreground px-4 text-sm font-medium text-background">
                대표 guidebook 관리
              </Link>
            ) : null}
          </div>
        </div>

        {status ? (
          <div className={`mt-5 rounded-2xl px-4 py-3 text-sm ${status === "updated" ? "border border-primary/30 bg-primary/10 text-foreground" : "border border-amber-300/50 bg-amber-50 text-amber-900"}`}>
            {status === "updated" ? "워크스페이스 설정이 저장되었습니다." : `워크스페이스 설정을 저장하지 못했습니다${code ? ` (${code})` : ""}.`}
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="space-y-6">
            <form action={action} className="rounded-[26px] border border-border bg-background/55 px-5 py-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Pencil className="h-4 w-4 text-primary" />
                워크스페이스 메타데이터
              </div>
              <div className="mt-5 grid gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-foreground">이름</span>
                  <input
                    name="name"
                    defaultValue={tenant.name}
                    className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-foreground">워크스페이스 코드</span>
                  <input
                    value={tenant.tenantCode}
                    readOnly
                    className="mt-2 h-11 w-full rounded-xl border border-border bg-background/60 px-4 text-sm text-muted-foreground outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-foreground">가시성</span>
                  <select
                    name="visibility"
                    defaultValue={tenant.visibility}
                    className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
                  >
                    <option value="PRIVATE">PRIVATE</option>
                    <option value="PUBLIC">PUBLIC</option>
                  </select>
                </label>
                <button type="submit" className="inline-flex h-11 items-center justify-center rounded-xl bg-foreground px-4 text-sm font-medium text-background">
                  설정 저장
                </button>
              </div>
            </form>

            <section className="rounded-[26px] border border-border bg-background/55 px-5 py-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Layers className="h-4 w-4 text-primary" />
                운영 메모
              </div>
              <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                <p>워크스페이스 설정은 공간의 기본 이름과 공개 범위만 조정합니다.</p>
                <p>실제 문서 구조, 대표 guidebook, page 운영은 허브와 관리 화면에서 이어집니다.</p>
              </div>
            </section>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[26px] border border-border bg-background/55 px-5 py-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Layers className="h-4 w-4 text-primary" />
                현재 컨텍스트
              </div>
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-border bg-background px-4 py-4">
                  <p className="text-base font-semibold text-foreground">{tenant.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{tenant.tenantCode}</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{activeMembership ? `${activeMembership.role} 권한으로 이 공간을 보고 있습니다.` : "현재 멤버십 정보를 확인할 수 없습니다."}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Guidebooks</p>
                  <p className="mt-2 text-lg font-semibold text-foreground">{guidebooks?.items.length ?? 0}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">대표 guidebook을 기준으로 reader, 검색, 운영 동선이 연결됩니다.</p>
                </div>
              </div>
            </section>

            <section className="rounded-[26px] border border-border bg-background/55 px-5 py-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <SearchIcon className="h-4 w-4 text-primary" />
                빠른 이동
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={buildSearchHref("", tenantId) as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                  이 공간 검색
                </Link>
                <Link href={buildMeHref() as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                  마이페이지
                </Link>
                {featuredGuidebook ? (
                  <Link href={buildAdminGuidebookHref(featuredGuidebook.guidebookId, tenantId) as Route} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">
                    guidebook 관리
                  </Link>
                ) : null}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </div>
  );
}
