import { redirect } from "next/navigation";
import { AppShell } from "@/shared/layout/app-shell";
import { HomeDashboard } from "@/features/home/home-dashboard";
import { HomeSignedOutGate } from "@/features/home/home-signed-out-gate";
import { StatusPanel } from "@/shared/ui/status-panel";
import { loadHome, loadViewerSession } from "@/server/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const viewer = await loadViewerSession();
  if (viewer.user && viewer.tenants.length === 0) {
    redirect("/onboarding");
  }

  const homeResult = viewer.user ? await loadHome() : null;

  return (
    <AppShell viewer={viewer} preferredTenantId={viewer.activeTenantId}>
      {viewer.user ? (
        homeResult?.ok ? (
          <HomeDashboard home={homeResult.data} viewer={viewer} />
        ) : (
          <StatusPanel
            eyebrow={homeResult?.error.code ?? "HOME"}
            title="개인 홈을 불러오지 못했습니다."
            description={homeResult?.error.message ?? "최근 문서와 알림을 다시 불러오는 중 문제가 발생했습니다."}
            tone="warning"
          />
        )
      ) : (
        <HomeSignedOutGate />
      )}
    </AppShell>
  );
}
