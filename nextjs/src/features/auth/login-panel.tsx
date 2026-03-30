import Link from "next/link";
import type { Route } from "next";
import type { ViewerSession } from "@/shared/lib/api-types";
import { ArrowRight, BookOpen, CheckCircle, Layers, Zap } from "@/shared/icons";
import { buildLoginHref, buildSignupHref } from "@/shared/lib/routes";
import { buttonStyles } from "@/shared/ui/button";

type LoginPanelProps = {
  viewer: ViewerSession;
  redirectTo: string;
  mode: "login" | "signup";
};

const providerCards = [
  {
    key: "kakao",
    label: "카카오로 계속하기",
    description: "항상 계정 입력을 요구해 계정 전환과 QA 자동화가 쉬운 기본 로그인 경로입니다.",
    tone: "bg-[#FEE500] text-[#111827]",
  },
  {
    key: "google",
    label: "Google로 계속하기",
    description: "업무용 계정이나 외부 협업용 계정을 같은 Auth Hub에서 바로 연결합니다.",
    tone: "bg-[#101828] text-white",
  },
] as const;

export function LoginPanel({ viewer, redirectTo, mode }: LoginPanelProps) {
  const kakaoHref = `/api/session/oauth/kakao?redirect=${encodeURIComponent(redirectTo)}`;
  const googleHref = `/api/session/oauth/google?redirect=${encodeURIComponent(redirectTo)}`;
  const isSignup = mode === "signup";

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_360px]">
      <div className="surface-elevated overflow-hidden rounded-[34px] border border-border shadow-theme-lg">
        <div className="grid gap-0 lg:grid-cols-[0.92fr_minmax(0,1fr)]">
          <div className="hero-gradient border-b border-border px-7 py-8 lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
            <span className="pill">{isSignup ? "Create account" : "Auth hub"}</span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-5xl">
              {isSignup ? "첫 OAuth 인증으로 가입하고, 바로 첫 워크스페이스를 시작합니다." : "로그인하면 바로 개인 홈과 워크스페이스 허브로 이어집니다."}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-8 text-foreground/80">
              {isSignup
                ? "회원가입은 별도 입력 폼이 아니라 첫 OAuth 인증으로 끝납니다. 공간이 없으면 onboarding으로, 이미 있으면 개인 홈으로 바로 이동합니다."
                : "세션이 만들어지면 먼저 개인 홈으로, 이후 워크스페이스 허브와 reader·관리 화면이 같은 shell 안에서 이어집니다."}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <Link
                href={buildLoginHref(redirectTo)}
                prefetch={false}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${!isSignup ? "bg-foreground text-background" : "border border-border bg-background/70 text-foreground"}`}
              >
                로그인
              </Link>
              <Link
                href={buildSignupHref(redirectTo)}
                prefetch={false}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${isSignup ? "bg-foreground text-background" : "border border-border bg-background/70 text-foreground"}`}
              >
                회원가입
              </Link>
            </div>

            <div className="mt-8 grid gap-3">
              {providerCards.map((provider) => {
                const href = provider.key === "kakao" ? kakaoHref : googleHref;
                return (
                  <a
                    key={provider.key}
                    href={href}
                    className={`block rounded-[26px] px-5 py-5 transition-transform hover:-translate-y-0.5 ${provider.tone}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-base font-semibold">{provider.label}</p>
                        <p className={`mt-2 text-sm leading-7 ${provider.key === "kakao" ? "text-[#111827]/80" : "text-white/72"}`}>{provider.description}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 shrink-0" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          <aside className="px-7 py-8 lg:px-8 lg:py-10">
            <div className="rounded-[26px] border border-border bg-background/55 px-5 py-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Zap className="h-4 w-4 text-primary" />
                인증 흐름
              </div>
              <div className="mt-5 space-y-5">
              <div>
                  <p className="text-sm font-semibold text-foreground">{isSignup ? "첫 OAuth 인증으로 바로 가입" : "로그인 후 이전 흐름으로 복귀"}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {isSignup
                      ? "첫 provider 인증 자체가 계정 생성입니다. 이후 tenant가 없으면 onboarding으로, 있으면 개인 홈으로 넘어갑니다."
                      : "provider 인증을 시작하면 원래 보던 경로를 잠깐 저장하고, 인증 뒤에는 그 위치를 우선 복구합니다."}
                  </p>
                </div>
                <div className="grid gap-3">
                  <StepRow number="1" text="provider 인증 시작" />
                  <StepRow number="2" text="backend callback이 ticket 생성" />
                  <StepRow number="3" text="프론트 /auth bridge가 토큰 교환" />
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[26px] border border-border bg-background/55 px-5 py-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CheckCircle className="h-4 w-4 text-primary" />
                로그인 뒤 화면
              </div>
              <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                <p>첫 사용자는 onboarding으로, 기존 사용자는 개인 홈 또는 원래 보던 reader·워크스페이스 허브로 돌아갑니다.</p>
                {viewer.user ? (
                  <div className="rounded-2xl border border-border bg-background px-4 py-4">
                    <p>
                      이미 <span className="font-semibold text-foreground">{viewer.user.displayName}</span> 계정으로 로그인되어 있습니다.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link href="/" className={buttonStyles({ variant: "outline", size: "sm" })}>
                        개인 홈
                      </Link>
                      <Link href="/me" className={buttonStyles({ variant: "quiet", size: "sm" })}>
                        마이페이지
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link href="/introduce" className={buttonStyles({ variant: "outline", size: "sm" })}>
                      서비스 소개
                    </Link>
                    <p className="rounded-xl border border-border bg-background px-3 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">Kakao는 항상 계정 입력을 다시 요구합니다.</p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function StepRow({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{number}</span>
      <p className="text-sm text-foreground">{text}</p>
    </div>
  );
}
