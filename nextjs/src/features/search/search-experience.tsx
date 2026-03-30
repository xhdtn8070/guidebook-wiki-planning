import Link from "next/link";
import type { Route } from "next";
import type { BackendResult, GuidebookSummary, PageSearchResponse, ViewerSession } from "@/shared/lib/api-types";
import { buildLoginHref, buildOnboardingHref, buildPageHref, buildSearchHref, buildTenantHref } from "@/shared/lib/routes";
import { Layers, Search as SearchIcon } from "@/shared/icons";
import { Input } from "@/shared/ui/input";
import { StatusPanel } from "@/shared/ui/status-panel";
import { PageStarToggle } from "@/features/wiki/page-star-toggle";

type SearchExperienceProps = {
  viewer: ViewerSession;
  query: string;
  guidebookId: number | null;
  tenantId: number | null;
  cursor: string | null;
  result: BackendResult<PageSearchResponse> | null;
  guidebooks: GuidebookSummary[];
  starredPageIds: number[];
};

export function SearchExperience({ viewer, query, guidebookId, tenantId, cursor, result, guidebooks, starredPageIds }: SearchExperienceProps) {
  const hasTenant = tenantId != null;
  const requiresLogin = !viewer.user;
  const trimmedQuery = query.trim();
  const fallbackTenantId = viewer.activeTenantId ?? viewer.tenants[0]?.tenantId ?? null;
  const tenantGateHref =
    fallbackTenantId != null ? buildTenantHref(fallbackTenantId) : buildOnboardingHref(trimmedQuery ? `/search?q=${encodeURIComponent(trimmedQuery)}` : "/search");
  const tenantGateLabel = fallbackTenantId != null ? "워크스페이스 열기" : "워크스페이스 만들기";
  const guidebookNameById = new Map(guidebooks.map((item) => [item.guidebookId, item.name]));
  const starredSet = new Set(starredPageIds);

  return (
    <div className="space-y-6">
      <section className="surface-elevated rounded-[32px] border border-border px-6 py-6 shadow-theme-md">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Search workspace</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-[2.4rem]">문서 탐색과 후속 작업이 이어지는 검색 작업면</h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              결과는 카드보다 리스트 밀도로 정리하고, 검색 결과에서 바로 reader 진입과 별표 관리까지 이어집니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span className="rounded-full border border-border bg-background/65 px-3 py-1.5">tenant {tenantId ?? "none"}</span>
            <span className="rounded-full border border-border bg-background/65 px-3 py-1.5">query {trimmedQuery || "empty"}</span>
            <span className="rounded-full border border-border bg-background/65 px-3 py-1.5">{guidebookId != null ? `guidebook ${guidebookId}` : "all guidebooks"}</span>
          </div>
        </div>

        <form action="/search" className="mt-6 grid gap-3 rounded-[26px] border border-border bg-background/50 p-4 lg:grid-cols-[minmax(0,1fr)_220px_170px_auto]">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={query} placeholder="문서, 용어, 코드 식별자를 검색하세요" className="h-12 rounded-2xl pl-11" />
          </div>
          <select name="guidebookId" defaultValue={guidebookId?.toString() ?? ""} className="h-12 rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary">
            <option value="">모든 guidebook</option>
            {guidebooks.map((item) => (
              <option key={item.guidebookId} value={item.guidebookId}>
                {item.name}
              </option>
            ))}
          </select>
          <Input name="tenantId" defaultValue={tenantId ?? ""} placeholder="tenant id" inputMode="numeric" className="h-12 rounded-2xl" />
          <button type="submit" className="inline-flex h-12 items-center justify-center rounded-2xl bg-foreground px-5 text-sm font-medium text-background">
            검색
          </button>
        </form>
      </section>

      {requiresLogin ? (
        <StatusPanel
          eyebrow="Auth"
          title="검색 전에 로그인 세션이 필요합니다."
          description="검색 API는 인증이 필요합니다. 로그인 후 active tenant를 고르면 같은 URL에서 바로 탐색을 이어갈 수 있습니다."
          actionHref={
            buildLoginHref(hasTenant ? buildSearchHref(trimmedQuery, tenantId, guidebookId) : trimmedQuery ? `/search?q=${encodeURIComponent(trimmedQuery)}` : "/search")
          }
          actionLabel="로그인"
        />
      ) : !hasTenant ? (
        <StatusPanel
          eyebrow="Tenant"
          title="tenant 컨텍스트를 먼저 고르세요."
          description="검색은 tenant 기준으로 scope가 고정됩니다. 워크스페이스를 선택하거나 새 workspace를 만든 뒤 다시 검색을 시작하세요."
          tone="warning"
          actionHref={tenantGateHref as Route}
          actionLabel={tenantGateLabel}
        />
      ) : !trimmedQuery ? (
        <StatusPanel
          eyebrow="Ready"
          title="검색어를 입력하면 바로 문서 리스트가 열립니다."
          description="이 화면은 result density, snippet 문맥, 바로 열기와 별표 같은 후속 액션을 중심으로 설계했습니다."
          tone="muted"
        />
      ) : result && !result.ok ? (
        <StatusPanel eyebrow={result.error.code} title="검색 결과를 불러오지 못했습니다." description={result.error.message} tone="warning" />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <section className="surface-elevated rounded-[28px] border border-border shadow-theme-md">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Results</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {result?.ok ? `${result.data.items.length} items` : "0 items"} for <span className="font-semibold text-foreground">{trimmedQuery}</span>
                </p>
              </div>
              {result?.ok ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{result.data.hasMore ? "cursor ready" : "end of results"}</span>
                </div>
              ) : null}
            </div>

            <div className="divide-y divide-border">
              {result?.ok && result.data.items.length > 0 ? (
                result.data.items.map((item) => {
                  const guidebookName = guidebookNameById.get(item.guidebookId) ?? `Guidebook ${item.guidebookId}`;
                  const returnTo = buildSearchHref(trimmedQuery, tenantId, guidebookId, cursor);

                  return (
                    <div key={item.pageId} className="grid gap-4 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                          <span>{guidebookName}</span>
                          <span>page {item.pageId}</span>
                          <span>{formatDate(item.updatedAt)}</span>
                        </div>
                        <Link href={buildPageHref({ guidebookId: item.guidebookId, pageId: item.pageId, tenantId }) as Route} className="mt-2 block text-xl font-semibold tracking-tight text-foreground hover:text-primary">
                          {item.title}
                        </Link>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                          {item.snippet?.replace(/<[^>]+>/g, "") || "검색 스니펫이 없는 결과입니다."}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-start gap-2">
                        <PageStarToggle pageId={item.pageId} starred={starredSet.has(item.pageId)} returnTo={returnTo} compact />
                        <Link
                          href={buildPageHref({ guidebookId: item.guidebookId, pageId: item.pageId, tenantId }) as Route}
                          className="inline-flex h-9 items-center rounded-xl border border-border px-3 text-xs font-medium text-foreground hover:bg-background"
                        >
                          열기
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-5 py-8 text-sm text-muted-foreground">일치하는 결과가 없습니다.</div>
              )}
            </div>

            {result?.ok && result.data.hasMore && result.data.nextCursor ? (
              <div className="border-t border-border px-5 py-4">
                <Link href={buildSearchHref(trimmedQuery, tenantId, guidebookId, result.data.nextCursor) as Route} className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-medium text-foreground hover:bg-background">
                  더 보기
                </Link>
              </div>
            ) : null}
          </section>

          <aside className="space-y-4">
            <div className="surface-elevated rounded-[28px] border border-border px-5 py-5 shadow-theme-md">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Current scope</p>
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">Workspace</dt>
                  <dd className="text-right font-medium text-foreground">{viewer.tenants.find((item) => item.tenantId === tenantId)?.name ?? `Tenant ${tenantId}`}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">Guidebook</dt>
                  <dd className="text-right font-medium text-foreground">{guidebookId != null ? guidebookNameById.get(guidebookId) ?? `Guidebook ${guidebookId}` : "All guidebooks"}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">Starred pages</dt>
                  <dd className="text-right font-medium text-foreground">{starredSet.size}</dd>
                </div>
              </dl>
            </div>

            <div className="surface-elevated rounded-[28px] border border-border px-5 py-5 shadow-theme-md">
              <p className="text-sm font-semibold text-foreground">Search behavior</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                <li>검색 결과는 canonical reader route로 바로 연결됩니다.</li>
                <li>별표 토글은 검색 컨텍스트를 유지한 채 서버 액션으로 처리됩니다.</li>
                <li>guidebook scope를 줄이면 결과 밀도와 snippet 정확도가 올라갑니다.</li>
              </ul>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
