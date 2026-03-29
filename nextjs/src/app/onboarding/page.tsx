import type { Route } from "next";
import { redirect } from "next/navigation";
import { createWorkspaceAction } from "@/app/onboarding/actions";
import { OnboardingExperience } from "@/features/onboarding/onboarding-experience";
import { AppShell } from "@/shared/layout/app-shell";
import { buildTenantHref } from "@/shared/lib/routes";
import { loadViewerSession } from "@/server/api";

type OnboardingPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const [viewer, resolvedSearchParams] = await Promise.all([loadViewerSession(), searchParams]);
  const redirectTo = typeof resolvedSearchParams.redirect === "string" ? resolvedSearchParams.redirect : null;
  const errorCode = typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : null;

  if (viewer.user && viewer.tenants.length > 0) {
    redirect(buildTenantHref(viewer.activeTenantId ?? viewer.tenants[0].tenantId) as Route);
  }

  return (
    <AppShell viewer={viewer}>
      <OnboardingExperience viewer={viewer} redirectTo={redirectTo} errorCode={errorCode} action={createWorkspaceAction} />
    </AppShell>
  );
}
