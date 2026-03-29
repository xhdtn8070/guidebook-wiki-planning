import type { Route } from "next";
import { redirect } from "next/navigation";
import { AppShell } from "@/shared/layout/app-shell";
import { buildOnboardingHref } from "@/shared/lib/routes";
import { TenantWorkspaceExperience } from "@/features/tenant/tenant-workspace-experience";
import { loadGuidebooks, loadHome, loadTenant, loadViewerSession } from "@/server/api";

type TenantWorkspacePageProps = {
  params: Promise<{ tenantId: string }>;
};

export const dynamic = "force-dynamic";

export default async function TenantWorkspacePage({ params }: TenantWorkspacePageProps) {
  const [viewer, resolvedParams] = await Promise.all([loadViewerSession(), params]);
  const tenantId = Number(resolvedParams.tenantId);
  const isMember = viewer.tenants.some((item) => item.tenantId === tenantId);

  if (viewer.user && viewer.tenants.length === 0) {
    redirect(buildOnboardingHref(`/tenant/${tenantId}`) as Route);
  }

  const tenantResult = await loadTenant(tenantId);
  const [guidebooksResult, homeResult] = viewer.user && isMember ? await Promise.all([loadGuidebooks(tenantId), loadHome()]) : [null, null];

  return (
    <AppShell viewer={viewer} preferredTenantId={tenantId}>
      <TenantWorkspaceExperience
        viewer={viewer}
        tenantId={tenantId}
        tenant={tenantResult.ok ? tenantResult.data : null}
        guidebooks={guidebooksResult?.ok ? guidebooksResult.data : null}
        home={homeResult?.ok ? homeResult.data : null}
        error={!tenantResult.ok ? tenantResult.error : null}
      />
    </AppShell>
  );
}
