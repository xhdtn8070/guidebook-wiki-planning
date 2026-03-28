import { AppShell } from "@/shared/layout/app-shell";
import { LoginPanel } from "@/features/auth/login-panel";
import { loadViewerSession } from "@/server/api";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const viewer = await loadViewerSession();
  const resolvedSearchParams = await searchParams;
  const redirectTo = typeof resolvedSearchParams.redirect === "string" ? resolvedSearchParams.redirect : "/";

  return (
    <AppShell viewer={viewer}>
      <LoginPanel redirectTo={redirectTo} />
    </AppShell>
  );
}
