import { AppShell } from "@/shared/layout/app-shell";
import { WikiExperience, WikiSidebarPanel, WikiTocPanel } from "@/features/wiki/wiki-experience";
import { collectSectionFileIds } from "@/shared/lib/sections";
import { getActiveTenantId, loadFileAccessUrls, loadGuidebookNav, loadPageDetail, loadStarredPages, loadViewerSession } from "@/server/api";

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
  const [navResult, starredResult, fileAccessResult] = await Promise.all([
    detailResult.ok && tenantId ? loadGuidebookNav(detailResult.data.page.guidebookId || guidebookId, tenantId) : Promise.resolve(null),
    viewer.user ? loadStarredPages(null, 200) : Promise.resolve(null),
    detailResult.ok ? loadFileAccessUrls(collectSectionFileIds(detailResult.data.page.sections)) : Promise.resolve(null),
  ]);

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
        starredPageIds={starredResult?.ok ? starredResult.data.items.map((item) => item.pageId) : []}
        fileAccessById={fileAccessResult?.ok ? fileAccessResult.data.byId : {}}
        error={detailResult.ok ? null : detailResult.error}
      />
    </AppShell>
  );
}
