import Link from "next/link";
import type { Route } from "next";
import type { ViewerSession } from "@/shared/lib/api-types";
import { buildOnboardingHref, buildTenantHref } from "@/shared/lib/routes";
import { CheckCircle, Layers, User } from "@/shared/icons";
import { LogoutButton } from "@/features/me/logout-button";

type MeExperienceProps = {
  viewer: ViewerSession;
  action: (formData: FormData) => void | Promise<void>;
  status: "updated" | "error" | null;
  code: string | null;
};

const providerLabels: Record<string, string> = {
  KAKAO: "Kakao",
  GOOGLE: "Google",
  NAVER: "Naver",
  APPLE: "Apple",
};

export function MeExperience({ viewer, action, status, code }: MeExperienceProps) {
  if (!viewer.user) {
    return (
      <section className="surface-elevated rounded-[30px] border border-border px-6 py-8 shadow-theme-md">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">My page</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">마이페이지를 보려면 로그인이 필요합니다.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">세션, 연결 provider, 워크스페이스 전환은 로그인 이후에만 확인할 수 있습니다.</p>
        <div className="mt-6">
          <Link href="/login" className="inline-flex h-11 items-center rounded-xl bg-foreground px-4 text-sm font-medium text-background">
            로그인
          </Link>
        </div>
      </section>
    );
  }

  const activeTenant = viewer.activeTenantId != null ? viewer.tenants.find((tenant) => tenant.tenantId === viewer.activeTenantId) ?? null : null;

  return (
    <div className="space-y-6">
      <section className="surface-elevated rounded-[30px] border border-border px-6 py-7 shadow-theme-md">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">My page</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">{viewer.user.displayName} 계정 설정</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              계정 정보, 연결된 로그인 수단, 현재 워크스페이스 컨텍스트를 한 화면에서 관리합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeTenant ? (
              <Link href={buildTenantHref(activeTenant.tenantId) as Route} className="inline-flex h-11 items-center rounded-xl border border-border px-4 text-sm font-medium text-foreground">
                현재 워크스페이스 열기
              </Link>
            ) : (
              <Link href={buildOnboardingHref("/me") as Route} className="inline-flex h-11 items-center rounded-xl border border-border px-4 text-sm font-medium text-foreground">
                워크스페이스 만들기
              </Link>
            )}
            <LogoutButton />
          </div>
        </div>

        {status ? (
          <div className={`mt-5 rounded-2xl px-4 py-3 text-sm ${status === "updated" ? "border border-primary/30 bg-primary/10 text-foreground" : "border border-amber-300/50 bg-amber-50 text-amber-900"}`}>
            {status === "updated" ? "프로필 정보가 저장되었습니다." : `프로필 정보를 저장하지 못했습니다${code ? ` (${code})` : ""}.`}
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="space-y-6">
            <form action={action} className="rounded-[26px] border border-border bg-background/55 px-5 py-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <User className="h-4 w-4 text-primary" />
                내 프로필
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                <label className="block">
                  <span className="text-sm font-medium text-foreground">Display name</span>
                  <input
                    name="displayName"
                    defaultValue={viewer.user.displayName}
                    className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
                  />
                </label>
                <button type="submit" className="inline-flex h-11 items-center justify-center rounded-xl bg-foreground px-4 text-sm font-medium text-background">
                  이름 저장
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <span className="rounded-full border border-border px-3 py-1.5">status {viewer.user.status}</span>
                <span className="rounded-full border border-border px-3 py-1.5">user {viewer.user.userId}</span>
              </div>
            </form>

            <section className="rounded-[26px] border border-border bg-background/55 px-5 py-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CheckCircle className="h-4 w-4 text-primary" />
                연결된 로그인 수단
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {viewer.user.linkedProviders.length > 0 ? (
                  viewer.user.linkedProviders.map((provider) => (
                    <span key={provider} className="inline-flex h-11 items-center rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground">
                      {providerLabels[provider] ?? provider}
                    </span>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-muted-foreground">연결된 OAuth provider 정보가 아직 없습니다.</p>
                )}
              </div>
            </section>
          </section>

          <aside className="space-y-6">
            <section id="workspaces" className="rounded-[26px] border border-border bg-background/55 px-5 py-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Layers className="h-4 w-4 text-primary" />
                내 워크스페이스
              </div>
              <div className="mt-5 space-y-3">
                {viewer.tenants.length > 0 ? (
                  viewer.tenants.map((tenant) => (
                    <Link
                      key={tenant.tenantId}
                      href={buildTenantHref(tenant.tenantId) as Route}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background px-4 py-4 transition-transform hover:-translate-y-0.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-foreground">{tenant.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{tenant.tenantCode}</p>
                      </div>
                      <span className="rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{tenant.role}</span>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-muted-foreground">아직 속한 워크스페이스가 없습니다. 첫 공간을 만들면 이 목록이 채워집니다.</p>
                )}
              </div>
            </section>

            <section className="rounded-[26px] border border-border bg-background/55 px-5 py-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Layers className="h-4 w-4 text-primary" />
                현재 active tenant
              </div>
              {activeTenant ? (
                <div className="mt-5 rounded-2xl border border-border bg-background px-4 py-4">
                  <p className="text-base font-semibold text-foreground">{activeTenant.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{activeTenant.tenantCode}</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">헤더와 reader, 검색, 관리 화면은 이 tenant 문맥을 기본값으로 사용합니다.</p>
                </div>
              ) : (
                <p className="mt-5 text-sm leading-7 text-muted-foreground">아직 선택된 tenant가 없습니다. 워크스페이스를 만들거나 하나를 연 뒤 active tenant가 설정됩니다.</p>
              )}
            </section>
          </aside>
        </div>
      </section>
    </div>
  );
}
