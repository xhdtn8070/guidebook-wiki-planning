import Link from "next/link";
import type { Route } from "next";
import type { BackendResult, PageSearchResponse, ViewerSession } from "@/shared/lib/api-types";
import { buildPageHref } from "@/shared/lib/routes";
import { Layers, Search as SearchIcon, Zap } from "@/shared/icons";
import { Input } from "@/shared/ui/input";
import { StatusPanel } from "@/shared/ui/status-panel";

type SearchExperienceProps = {
  viewer: ViewerSession;
  query: string;
  guidebookId: number | null;
  tenantId: number | null;
  result: BackendResult<PageSearchResponse> | null;
};

export function SearchExperience({ viewer, query, guidebookId, tenantId, result }: SearchExperienceProps) {
  const hasTenant = tenantId != null;
  const requiresLogin = !viewer.user;
  const trimmedQuery = query.trim();

  return (
    <div className="space-y-8">
      <section className="hero-gradient overflow-hidden rounded-[32px] border border-border px-6 py-8 shadow-theme-lg md:px-10 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <span className="pill pill-ghost">Search</span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-5xl">
              문맥 리스트 중심의 product docs 검색 화면
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-foreground/78">
              검색은 <code>q</code> search param을 단일 기준으로 사용하고, tenant가 있을 때만 실제 <code>/api/search/pages</code>를 호출합니다.
              결과 링크는 항상 canonical page route로 정규화됩니다.
            </p>
          </div>

          <aside className="surface-elevated rounded-[28px] border border-border px-5 py-5 shadow-theme-md">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Search rules</p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
              <p>tenant 없으면 호출 대신 명시적인 gate를 먼저 보여줍니다.</p>
              <p>결과 카드는 줄이고, 제목과 snippet을 문서 탐색용 리스트로 읽히게 둡니다.</p>
              <p>검색 흐름은 reader와 같은 workspace/session shell 위에서 유지됩니다.</p>
            </div>
          </aside>
        </div>
      </section>

      <form action="/search" className="surface-elevated grid gap-4 rounded-[28px] border border-border px-5 py-5 shadow-theme-md md:grid-cols-[minmax(0,1fr)_150px_170px]">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={query} placeholder="문서, 용어, 코드 식별자를 검색하세요" className="h-11 pl-11" />
        </div>
        <Input name="guidebookId" defaultValue={guidebookId ?? ""} placeholder="guidebook id" inputMode="numeric" className="h-11" />
        <Input name="tenantId" defaultValue={tenantId ?? ""} placeholder="tenant id" inputMode="numeric" className="h-11" />
      </form>

      {requiresLogin ? (
        <StatusPanel
          eyebrow="Auth"
          title="검색 전에 로그인 세션이 필요합니다."
          description="현재 검색 API는 인증 필수입니다. 로그인 후 active tenant를 선택하면 같은 URL 구조에서 바로 검색을 이어갈 수 있습니다."
          actionHref={
            `/login?redirect=${encodeURIComponent(hasTenant ? `/search?tenantId=${tenantId}${trimmedQuery ? `&q=${encodeURIComponent(trimmedQuery)}` : ""}` : "/search")}` as Route
          }
          actionLabel="로그인"
        />
      ) : !hasTenant ? (
        <StatusPanel
          eyebrow="Tenant"
          title="tenant id가 아직 고정되지 않았습니다."
          description="검색 API는 `X-Tenant-Id` 없이는 호출되지 않습니다. 상단 workspace를 고르거나 검색 폼에 tenant id를 넣어 시작하세요."
          tone="warning"
        />
      ) : !trimmedQuery ? (
        <StatusPanel
          eyebrow="Ready"
          title="검색어를 넣으면 바로 실제 `/api/search/pages`에 연결됩니다."
          description="이 단계에서는 검색 결과의 밀도, snippet 문맥, canonical route 전환 품질이 핵심입니다."
          tone="muted"
        />
      ) : result && !result.ok ? (
        <StatusPanel eyebrow={result.error.code} title="검색 결과를 불러오지 못했습니다." description={result.error.message} tone="warning" />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Results</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {result?.ok ? `${result.data.items.length} items` : "0 items"} for <span className="font-semibold text-foreground">{trimmedQuery}</span>
                </p>
              </div>
              <span className="pill">Tenant {tenantId}</span>
            </div>

            <div className="mt-2 divide-y divide-border">
              {result?.ok && result.data.items.length > 0 ? (
                result.data.items.map((item) => (
                  <Link
                    key={item.pageId}
                    href={buildPageHref({ guidebookId: item.guidebookId, pageId: item.pageId, tenantId }) as Route}
                    className="block py-5 first:pt-4 hover:bg-foreground/[0.02]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="text-lg font-semibold tracking-tight text-foreground">{item.title}</h2>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                          {item.snippet?.replace(/<[^>]+>/g, "") || "스니펫이 아직 없는 결과입니다."}
                        </p>
                        <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Guidebook {item.guidebookId} · Page {item.pageId}</p>
                      </div>
                      <span className="shrink-0 text-xs uppercase tracking-[0.18em] text-muted-foreground">{formatDate(item.updatedAt)}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-8 text-sm text-muted-foreground">일치하는 결과가 없습니다.</div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Context</p>
              </div>
              <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                <p>검색은 `q` search param 하나만 기준으로 유지합니다.</p>
                <p>결과 클릭 시 pageId 기준 canonical reader route로 이동합니다.</p>
                <p>tenantId는 URL과 session tenant chooser 둘 다에서 제어됩니다.</p>
              </div>
            </div>

            <div className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Why this shell</p>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Lovable midnight의 검색 밀도와 docs shell 감각을 기준으로, 결과 카드보다 문서 탐색에 적합한 리스트 중심 레이아웃으로 재구성했습니다.
              </p>
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
  }).format(new Date(value));
}
