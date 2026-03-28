import { AppShell } from "@/shared/layout/app-shell";
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

  const [detailResult, permissionResult] = await Promise.all([loadPageDetail(pageId, tenantId), loadPagePermissionMe(pageId, tenantId)]);

  return (
    <AppShell viewer={viewer}>
      <AdminPageExperience
        viewer={viewer}
        pageId={pageId}
        tenantId={tenantId}
        detail={detailResult.ok ? detailResult.data : null}
        permission={permissionResult.ok ? permissionResult.data : null}
      />
    </AppShell>
  );
}
