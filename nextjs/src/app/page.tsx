import { AppShell } from "@/shared/layout/app-shell";
import { HomeDashboard } from "@/features/home/home-dashboard";
import { HomeGuestLanding } from "@/features/home/home-guest-landing";
import { loadHome, loadViewerSession } from "@/server/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [viewer, homeResult] = await Promise.all([loadViewerSession(), loadHome()]);

  return (
    <AppShell viewer={viewer}>
      {homeResult.ok ? <HomeDashboard home={homeResult.data} viewer={viewer} /> : <HomeGuestLanding />}
    </AppShell>
  );
}
