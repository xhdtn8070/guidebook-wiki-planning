import Link from "next/link";
import type { Route } from "next";
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

  return (
    <div className="space-y-10">
      <section className="border-b border-border pb-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Search</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-foreground">문서 검색은 결과 카드가 아니라 문맥 리스트로 읽힙니다.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          검색 화면은 `q` search param을 단일 기준으로 사용합니다. tenant가 있어야 `X-Tenant-Id`를 넣고 `/api/search/pages`를
          호출할 수 있습니다.
        </p>
      </section>

      <form action="/search" className="grid gap-4 rounded-[28px] border border-border bg-panel px-5 py-5 md:grid-cols-[minmax(0,1fr)_140px_180px]">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={query} placeholder="용어, 제목, 코드 식별자를 검색하세요" className="pl-11" />
        </div>
        <Input name="guidebookId" defaultValue={guidebookId ?? ""} placeholder="guidebook id" inputMode="numeric" />
        <Input name="tenantId" defaultValue={tenantId ?? ""} placeholder="tenant id" inputMode="numeric" />
      </form>

      {requiresLogin ? (
        <StatusPanel
          eyebrow="Auth"
          title="검색 전에 로그인 세션이 필요합니다."
          description="현재 백엔드 검색 API는 인증 필수입니다. 로그인 후 active tenant를 선택하면 바로 같은 URL 구조에서 검색을 이어갈 수 있습니다."
          actionHref={
            `/login?redirect=${encodeURIComponent(hasTenant ? `/search?tenantId=${tenantId}${query ? `&q=${encodeURIComponent(query)}` : ""}` : "/search")}` as Route
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
      ) : !query.trim() ? (
        <StatusPanel
          eyebrow="Ready"
          title="검색어를 넣으면 바로 실제 `/api/search/pages`에 연결됩니다."
          description="이 단계에서는 검색 리스트의 밀도, 결과 문맥, 페이지 canonical route 변환이 핵심입니다."
          tone="muted"
        />
      ) : result && !result.ok ? (
        <StatusPanel eyebrow={result.error.code} title="검색 결과를 불러오지 못했습니다." description={result.error.message} tone="warning" />
      ) : (
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_260px]">
          <section className="divide-y divide-border border-t border-border">
            {result?.ok && result.data.items.length > 0 ? (
              result.data.items.map((item) => (
                <Link
                  key={item.pageId}
                  href={buildPageHref({ guidebookId: item.guidebookId, pageId: item.pageId, tenantId }) as Route}
                  className="block py-5 first:pt-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-medium tracking-tight text-foreground">{item.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {item.snippet?.replace(/<[^>]+>/g, "") || "스니펫이 아직 없는 결과입니다."}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {formatDate(item.updatedAt)}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-5 text-sm text-muted-foreground">일치하는 결과가 없습니다.</div>
            )}
          </section>

          <aside className="rounded-[28px] border border-border bg-panel px-5 py-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">State rules</p>
            <ul className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
              <li>검색은 `q` search param 기반으로만 동작합니다.</li>
              <li>결과 링크는 pageId 기준 canonical route로 정규화됩니다.</li>
              <li>`tenantId`가 없으면 네트워크 호출 대신 명시적 게이트를 노출합니다.</li>
            </ul>
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
