import { AppShell } from "@/shared/layout/app-shell";
import { SearchExperience } from "@/features/search/search-experience";
import { getActiveTenantId, loadSearch, loadViewerSession } from "@/server/api";

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
  const result = query.trim() && tenantId ? await loadSearch({ query, tenantId, guidebookId, cursor }) : null;

  return (
    <AppShell viewer={viewer} preferredTenantId={tenantId ?? viewer.activeTenantId}>
      <SearchExperience viewer={viewer} query={query} guidebookId={guidebookId} tenantId={tenantId} result={result} />
    </AppShell>
  );
}
