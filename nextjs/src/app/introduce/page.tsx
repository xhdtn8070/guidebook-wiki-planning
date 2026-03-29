import { AppShell } from "@/shared/layout/app-shell";
import { IntroduceExperience } from "@/features/introduce/introduce-experience";
import { loadViewerSession } from "@/server/api";

export const dynamic = "force-dynamic";

export default async function IntroducePage() {
  const viewer = await loadViewerSession();

  return (
    <AppShell viewer={viewer} preferredTenantId={viewer.activeTenantId}>
      <IntroduceExperience />
    </AppShell>
  );
}
