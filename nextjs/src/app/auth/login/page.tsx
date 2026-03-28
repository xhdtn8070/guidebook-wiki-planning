import { redirect } from "next/navigation";

type LegacyLoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LegacyLoginPage({ searchParams }: LegacyLoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const redirectTo = typeof resolvedSearchParams.redirect === "string" ? resolvedSearchParams.redirect : "/";
  redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`);
}
