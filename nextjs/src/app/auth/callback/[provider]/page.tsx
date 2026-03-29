import { AppShell } from "@/shared/layout/app-shell";
import { AuthTicketBridge } from "@/features/auth/auth-ticket-bridge";
import { loadViewerSession } from "@/server/api";

type AuthCallbackPageProps = {
  params: Promise<{ provider: string }>;
};

export const dynamic = "force-dynamic";

export default async function AuthCallbackPage({ params }: AuthCallbackPageProps) {
  const viewer = await loadViewerSession();
  const resolvedParams = await params;

  return (
    <AppShell viewer={viewer} variant="minimal">
      <AuthTicketBridge providerLabel={`${resolvedParams.provider} callback`} />
    </AppShell>
  );
}
