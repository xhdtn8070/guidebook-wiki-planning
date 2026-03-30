import { AppShell } from "@/shared/layout/app-shell";
import { WorkspaceRail } from "@/shared/layout/workspace-rail";
import { createPageAction, movePageAction, updateGuidebookAction } from "@/app/admin/guidebooks/[guidebookId]/actions";
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
  const status =
    resolvedSearchParams.status === "updated" || resolvedSearchParams.status === "error"
      ? resolvedSearchParams.status
      : null;
  const code = typeof resolvedSearchParams.code === "string" ? resolvedSearchParams.code : null;

  const [pagesResult, permissionResult, guidebooksResult] = await Promise.all([
    loadGuidebookPages(guidebookId, tenantId),
    loadGuidebookPermissionMe(guidebookId, tenantId),
    loadGuidebooks(tenantId),
  ]);

  return (
    <AppShell
      viewer={viewer}
      preferredTenantId={tenantId}
      sidebar={<WorkspaceRail viewer={viewer} activeItem="admin" activeTenantId={tenantId} adminHref={tenantId != null ? `/admin/guidebooks/${guidebookId}?tenantId=${tenantId}` : null} />}
    >
      <AdminGuidebookExperience
        viewer={viewer}
        guidebookId={guidebookId}
        tenantId={tenantId}
        pages={pagesResult.ok ? pagesResult.data : null}
        permission={permissionResult.ok ? permissionResult.data : null}
        guidebooks={guidebooksResult.ok ? guidebooksResult.data : null}
        updateGuidebookAction={updateGuidebookAction.bind(null, guidebookId, tenantId)}
        createPageAction={createPageAction.bind(null, guidebookId, tenantId)}
        movePageAction={movePageAction.bind(null, guidebookId, tenantId)}
        status={status}
        code={code}
      />
    </AppShell>
  );
}
