import { AppShell } from "@/shared/layout/app-shell";
import { AdminGuidebookExperience } from "@/features/admin/admin-experience";
import { getActiveTenantId, loadGuidebookPages, loadGuidebookPermissionMe, loadGuidebooks, loadViewerSession } from "@/server/api";

type AdminGuidebookPageProps = {
  params: Promise<{ guidebookId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export default async function AdminGuidebookPage({ params, searchParams }: AdminGuidebookPageProps) {
  const [viewer, resolvedParams, resolvedSearchParams] = await Promise.all([loadViewerSession(), params, searchParams]);
  const tenantId = getActiveTenantId(resolvedSearchParams.tenantId) ?? viewer.activeTenantId;
  const guidebookId = Number(resolvedParams.guidebookId);

  const [pagesResult, permissionResult, guidebooksResult] = await Promise.all([
    loadGuidebookPages(guidebookId, tenantId),
    loadGuidebookPermissionMe(guidebookId, tenantId),
    loadGuidebooks(tenantId),
  ]);

  return (
    <AppShell viewer={viewer} preferredTenantId={tenantId}>
      <AdminGuidebookExperience
        viewer={viewer}
        guidebookId={guidebookId}
        tenantId={tenantId}
        pages={pagesResult.ok ? pagesResult.data : null}
        permission={permissionResult.ok ? permissionResult.data : null}
        guidebooks={guidebooksResult.ok ? guidebooksResult.data : null}
      />
    </AppShell>
  );
}
