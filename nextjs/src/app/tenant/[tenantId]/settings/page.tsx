import { redirect } from "next/navigation";
import type { Route } from "next";
import { AppShell } from "@/shared/layout/app-shell";
import { WorkspaceRail } from "@/shared/layout/workspace-rail";
import { updateTenantSettingsAction } from "@/app/tenant/[tenantId]/settings/actions";
import { buildLoginHref, buildOnboardingHref } from "@/shared/lib/routes";
import { TenantSettingsExperience } from "@/features/tenant/tenant-settings-experience";
import { loadGuidebooks, loadTenant, loadViewerSession } from "@/server/api";

type TenantSettingsPageProps = {
  params: Promise<{ tenantId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export default async function TenantSettingsPage({ params, searchParams }: TenantSettingsPageProps) {
  const [viewer, resolvedParams, resolvedSearchParams] = await Promise.all([loadViewerSession(), params, searchParams]);
  const tenantId = Number(resolvedParams.tenantId);
  const status =
    resolvedSearchParams.status === "updated" || resolvedSearchParams.status === "error"
      ? resolvedSearchParams.status
      : null;
  const code = typeof resolvedSearchParams.code === "string" ? resolvedSearchParams.code : null;

  if (!viewer.user) {
    redirect(buildLoginHref(`/tenant/${tenantId}/settings`) as Route);
  }

  if (viewer.tenants.length === 0) {
    redirect(buildOnboardingHref(`/tenant/${tenantId}/settings`) as Route);
  }

  const isMember = viewer.tenants.some((item) => item.tenantId === tenantId);
  const tenantResult = await loadTenant(tenantId);
  const guidebooksResult = isMember ? await loadGuidebooks(tenantId) : null;
  const adminHref =
    guidebooksResult?.ok && guidebooksResult.data.items[0] ? `/admin/guidebooks/${guidebooksResult.data.items[0].guidebookId}?tenantId=${tenantId}` : null;

  return (
    <AppShell
      viewer={viewer}
      preferredTenantId={tenantId}
      sidebar={<WorkspaceRail viewer={viewer} activeItem="workspaces" activeTenantId={tenantId} adminHref={adminHref} />}
    >
      <TenantSettingsExperience
        viewer={viewer}
        tenantId={tenantId}
        tenant={tenantResult.ok ? tenantResult.data : null}
        guidebooks={guidebooksResult?.ok ? guidebooksResult.data : null}
        error={!tenantResult.ok ? tenantResult.error : null}
        action={updateTenantSettingsAction.bind(null, tenantId)}
        status={status}
        code={code}
      />
    </AppShell>
  );
}
