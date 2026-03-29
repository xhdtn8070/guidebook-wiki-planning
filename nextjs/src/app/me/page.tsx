import { AppShell } from "@/shared/layout/app-shell";
import { WorkspaceRail } from "@/shared/layout/workspace-rail";
import { MeExperience } from "@/features/me/me-experience";
import { loadViewerSession } from "@/server/api";
import { updateProfileAction } from "@/app/me/actions";

type MePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export default async function MePage({ searchParams }: MePageProps) {
  const [viewer, resolvedSearchParams] = await Promise.all([loadViewerSession(), searchParams]);
  const status =
    resolvedSearchParams.status === "updated" || resolvedSearchParams.status === "error"
      ? resolvedSearchParams.status
      : null;
  const code = typeof resolvedSearchParams.code === "string" ? resolvedSearchParams.code : null;

  return (
    <AppShell viewer={viewer} preferredTenantId={viewer.activeTenantId} sidebar={<WorkspaceRail viewer={viewer} activeItem="me" activeTenantId={viewer.activeTenantId} />}>
      <MeExperience viewer={viewer} action={updateProfileAction} status={status} code={code} />
    </AppShell>
  );
}
