import { AppShell } from "@/shared/layout/app-shell";
import { WorkspaceRail } from "@/shared/layout/workspace-rail";
import { updatePageAction } from "@/app/admin/pages/[pageId]/actions";
import { AdminPageExperience } from "@/features/admin/admin-experience";
import { getActiveTenantId, loadPageDetail, loadPagePermissionMe, loadViewerSession } from "@/server/api";

type AdminPageProps = {
  params: Promise<{ pageId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export default async function AdminPage({ params, searchParams }: AdminPageProps) {
  const [viewer, resolvedParams, resolvedSearchParams] = await Promise.all([loadViewerSession(), params, searchParams]);
  const tenantId = getActiveTenantId(resolvedSearchParams.tenantId) ?? viewer.activeTenantId;
  const pageId = Number(resolvedParams.pageId);
  const status =
    resolvedSearchParams.status === "updated" || resolvedSearchParams.status === "error"
      ? resolvedSearchParams.status
      : null;
  const code = typeof resolvedSearchParams.code === "string" ? resolvedSearchParams.code : null;

  const [detailResult, permissionResult] = await Promise.all([loadPageDetail(pageId, tenantId), loadPagePermissionMe(pageId, tenantId)]);

  return (
    <AppShell
      viewer={viewer}
      preferredTenantId={tenantId}
      sidebar={<WorkspaceRail viewer={viewer} activeItem="admin" activeTenantId={tenantId} adminHref={tenantId != null ? `/admin/pages/${pageId}?tenantId=${tenantId}` : null} />}
    >
      <AdminPageExperience
        viewer={viewer}
        pageId={pageId}
        tenantId={tenantId}
        detail={detailResult.ok ? detailResult.data : null}
        permission={permissionResult.ok ? permissionResult.data : null}
        updatePageAction={updatePageAction.bind(null, pageId, tenantId)}
        status={status}
        code={code}
      />
    </AppShell>
  );
}
