import { AppShell } from "@/shared/layout/app-shell";
import { WikiExperience, WikiSidebarPanel, WikiTocPanel } from "@/features/wiki/wiki-experience";
import { getActiveTenantId, loadGuidebookNav, loadPageDetail, loadViewerSession } from "@/server/api";

type GuidebookPageProps = {
  params: Promise<{ guidebookId: string; pageId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export default async function GuidebookPage({ params, searchParams }: GuidebookPageProps) {
  const [viewer, resolvedParams, resolvedSearchParams] = await Promise.all([loadViewerSession(), params, searchParams]);
  const tenantId = getActiveTenantId(resolvedSearchParams.tenantId) ?? viewer.activeTenantId;
  const pageId = Number(resolvedParams.pageId);
  const guidebookId = Number(resolvedParams.guidebookId);

  const detailResult = await loadPageDetail(pageId, tenantId);
  const navResult =
    detailResult.ok && tenantId
      ? await loadGuidebookNav(detailResult.data.page.guidebookId || guidebookId, tenantId)
      : null;

  return (
    <AppShell
      viewer={viewer}
      preferredTenantId={tenantId}
      sidebar={tenantId && detailResult.ok ? <WikiSidebarPanel nav={navResult?.ok ? navResult.data : null} tenantId={tenantId} activePageId={pageId} /> : undefined}
      aside={detailResult.ok ? <WikiTocPanel sections={detailResult.data.page.sections} /> : undefined}
    >
      <WikiExperience
        viewer={viewer}
        tenantId={tenantId}
        guidebookId={guidebookId}
        pageId={pageId}
        detail={detailResult.ok ? detailResult.data : null}
        nav={navResult?.ok ? navResult.data : null}
        error={detailResult.ok ? null : detailResult.error}
      />
    </AppShell>
  );
}
