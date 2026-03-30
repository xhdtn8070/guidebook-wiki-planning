import type { Route } from "next";
import { redirect } from "next/navigation";
import { AppShell } from "@/shared/layout/app-shell";
import { WorkspaceRail } from "@/shared/layout/workspace-rail";
import { createGuidebookAction } from "@/app/tenant/[tenantId]/actions";
import { buildOnboardingHref } from "@/shared/lib/routes";
import { TenantWorkspaceExperience } from "@/features/tenant/tenant-workspace-experience";
import { loadGuidebooks, loadHome, loadTenant, loadViewerSession } from "@/server/api";

type TenantWorkspacePageProps = {
  params: Promise<{ tenantId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export default async function TenantWorkspacePage({ params, searchParams }: TenantWorkspacePageProps) {
  const [viewer, resolvedParams, resolvedSearchParams] = await Promise.all([loadViewerSession(), params, searchParams]);
  const tenantId = Number(resolvedParams.tenantId);
  const isMember = viewer.tenants.some((item) => item.tenantId === tenantId);
  const status =
    resolvedSearchParams.status === "created" || resolvedSearchParams.status === "error"
      ? resolvedSearchParams.status
      : null;
  const code = typeof resolvedSearchParams.code === "string" ? resolvedSearchParams.code : null;

  if (viewer.user && viewer.tenants.length === 0) {
    redirect(buildOnboardingHref(`/tenant/${tenantId}`) as Route);
  }

  const tenantResult = await loadTenant(tenantId);
  const [guidebooksResult, homeResult] = viewer.user && isMember ? await Promise.all([loadGuidebooks(tenantId), loadHome()]) : [null, null];
  const adminHref =
    guidebooksResult?.ok && guidebooksResult.data.items[0] ? `/admin/guidebooks/${guidebooksResult.data.items[0].guidebookId}?tenantId=${tenantId}` : null;

  return (
    <AppShell
      viewer={viewer}
      preferredTenantId={tenantId}
      sidebar={viewer.user ? <WorkspaceRail viewer={viewer} activeItem="directory" activeTenantId={tenantId} adminHref={adminHref} /> : undefined}
    >
      <TenantWorkspaceExperience
        viewer={viewer}
        tenantId={tenantId}
        tenant={tenantResult.ok ? tenantResult.data : null}
        guidebooks={guidebooksResult?.ok ? guidebooksResult.data : null}
        home={homeResult?.ok ? homeResult.data : null}
        error={!tenantResult.ok ? tenantResult.error : null}
        createGuidebookAction={createGuidebookAction.bind(null, tenantId)}
        status={status}
        code={code}
      />
    </AppShell>
  );
}
