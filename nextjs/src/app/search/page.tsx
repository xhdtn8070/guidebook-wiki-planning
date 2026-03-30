import { AppShell } from "@/shared/layout/app-shell";
import { SearchExperience } from "@/features/search/search-experience";
import { getActiveTenantId, loadGuidebooks, loadSearch, loadStarredPages, loadViewerSession } from "@/server/api";

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";
  const tenantId = getActiveTenantId(resolvedSearchParams.tenantId);
  const guidebookId =
    typeof resolvedSearchParams.guidebookId === "string" && resolvedSearchParams.guidebookId
      ? Number(resolvedSearchParams.guidebookId)
      : null;
  const cursor = typeof resolvedSearchParams.cursor === "string" ? resolvedSearchParams.cursor : null;

  const viewer = await loadViewerSession();
  const [result, guidebooksResult, starredResult] = await Promise.all([
    query.trim() && tenantId ? loadSearch({ query, tenantId, guidebookId, cursor }) : Promise.resolve(null),
    tenantId ? loadGuidebooks(tenantId) : Promise.resolve(null),
    viewer.user ? loadStarredPages(null, 200) : Promise.resolve(null),
  ]);

  return (
    <AppShell viewer={viewer} preferredTenantId={tenantId ?? viewer.activeTenantId}>
      <SearchExperience
        viewer={viewer}
        query={query}
        guidebookId={guidebookId}
        tenantId={tenantId}
        cursor={cursor}
        result={result}
        guidebooks={guidebooksResult?.ok ? guidebooksResult.data.items : []}
        starredPageIds={starredResult?.ok ? starredResult.data.items.map((item) => item.pageId) : []}
      />
    </AppShell>
  );
}
