import { AppShell } from "@/shared/layout/app-shell";
import { AuthTicketBridge } from "@/features/auth/auth-ticket-bridge";
import { loadViewerSession } from "@/server/api";

export const dynamic = "force-dynamic";

export default async function AuthPage() {
  const viewer = await loadViewerSession();

  return (
    <AppShell viewer={viewer} variant="minimal">
      <AuthTicketBridge providerLabel="Auth ticket" />
    </AppShell>
  );
}
