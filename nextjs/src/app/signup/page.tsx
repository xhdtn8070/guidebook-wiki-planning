import { redirect } from "next/navigation";

type SignupPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const resolvedSearchParams = await searchParams;
  const redirectTo = typeof resolvedSearchParams.redirect === "string" ? resolvedSearchParams.redirect : "/";
  redirect(`/login?mode=signup&redirect=${encodeURIComponent(redirectTo)}`);
}
