import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import type { BackendResult, PageSearchResponse, ViewerSession } from "@/shared/lib/api-types";
import { buildPageHref } from "@/shared/lib/routes";
import { Search as SearchIcon } from "@/shared/icons";
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
  const resultCount = result?.ok ? result.data.items.length : 0;

  return (
    <div className="animate-rise-in space-y-10">
      <section className="border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>Editorial Core</span>
          <span>Workspace</span>
          <span>Archive</span>
        </div>
        <h1 className="mt-5 text-5xl text-foreground md:text-6xl">Search Archive</h1>
        <form action="/search" className="mt-6 space-y-4">
          <div className="relative max-w-[880px]">
            <SearchIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={query}
              placeholder="OAuth 2.0 implementation guide"
              className="h-12 border-border bg-transparent pl-4 pr-12 text-base shadow-none"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Input name="tenantId" defaultValue={tenantId ?? ""} placeholder="tenant id" inputMode="numeric" className="h-9 w-[170px] bg-panel" />
            <Input name="guidebookId" defaultValue={guidebookId ?? ""} placeholder="guidebook id" inputMode="numeric" className="h-9 w-[170px] bg-panel" />
          </div>
        </form>
      </section>

      {requiresLogin ? (
        <StatusPanel
          eyebrow="Auth"
          title="검색 전에 로그인 세션이 필요합니다."
          description="현재 백엔드 검색 API는 인증 필수입니다. 로그인 후 같은 URL 구조에서 검색을 이어갈 수 있습니다."
          actionHref={
            `/login?redirect=${encodeURIComponent(hasTenant ? `/search?tenantId=${tenantId}${query ? `&q=${encodeURIComponent(query)}` : ""}` : "/search")}` as Route
          }
          actionLabel="로그인"
        />
      ) : !hasTenant ? (
        <StatusPanel
          eyebrow="Tenant"
          title="Workspace selection is required."
          description="검색 API는 `X-Tenant-Id` 없이는 호출되지 않습니다. 상단 workspace를 고르거나 검색 폼에 tenant id를 넣어 시작하세요."
          tone="warning"
        />
      ) : !query.trim() ? (
        <StatusPanel
          eyebrow="Ready"
          title="검색어를 넣으면 바로 실제 `/api/search/pages`에 연결됩니다."
          description="이번 단계의 핵심은 검색 리스트의 밀도, 결과 문맥, pageId 기반 canonical route 정규화입니다."
          tone="muted"
        />
      ) : result && !result.ok ? (
        <StatusPanel eyebrow={result.error.code} title="검색 결과를 불러오지 못했습니다." description={result.error.message} tone="warning" />
      ) : (
        <div className="grid gap-10 xl:grid-cols-12">
          <section className="xl:col-span-9">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              <div className="flex flex-wrap gap-5">
                <span>Tenant context {tenantId}</span>
                <span>{guidebookId ? `Guidebook ${guidebookId}` : "All guidebooks"}</span>
              </div>
              <span>{result?.ok ? `${String(resultCount).padStart(2, "0")} results` : "Ready to search"}</span>
            </div>

            <div className="divide-y divide-border">
              {result?.ok && result.data.items.length > 0 ? (
                result.data.items.map((item) => (
                  <Link
                    key={item.pageId}
                    href={buildPageHref({ guidebookId: item.guidebookId, pageId: item.pageId, tenantId }) as Route}
                    className="block py-7 transition-colors hover:bg-white/20"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                          <span>Technical spec</span>
                          <span>Guidebook {item.guidebookId}</span>
                        </div>
                        <h2 className="mt-3 text-3xl text-foreground">{item.title}</h2>
                        <p className="mt-3 max-w-3xl text-sm leading-8 text-muted-foreground">
                          {item.snippet?.replace(/<[^>]+>/g, "") || "스니펫이 아직 없는 결과입니다."}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                          <span>{formatDate(item.updatedAt)}</span>
                          <span>Page {item.pageId}</span>
                        </div>
                      </div>
                      <span className="shrink-0 pt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">open</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-8 text-sm leading-7 text-muted-foreground">일치하는 결과가 없습니다. 검색어의 철자나 tenant 범위를 다시 확인하세요.</div>
              )}
            </div>
          </section>

          <aside className="space-y-8 xl:col-span-3">
            <SidebarBox title="Recent searches">
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Kubernetes ingress</p>
                <p>Redis cluster shard</p>
                <p>API rate limiting</p>
              </div>
            </SidebarBox>
            <SidebarBox title="Applied context">
              <p className="text-sm leading-7 text-muted-foreground">
                {tenantId ? `현재 tenant ${tenantId}` : "tenant 없음"} · {guidebookId ? `guidebook ${guidebookId}` : "all guidebooks"} · page 결과는 canonical route로 정규화됩니다.
              </p>
            </SidebarBox>
            <SidebarBox title="Editor’s note">
              <p className="text-sm leading-7 text-muted-foreground">
                검색 화면은 문서 카드보다 리스트와 문맥 위계를 우선합니다. 헤드라인, 스니펫, 날짜, 가이드북 정보만으로 빠르게 스캔 가능해야 합니다.
              </p>
            </SidebarBox>
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

function SidebarBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-border bg-panel px-5 py-5">
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}
