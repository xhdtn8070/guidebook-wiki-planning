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
              {isSignup ? "첫 OAuth 인증으로 계정을 만들고 바로 워크스페이스를 시작합니다." : "로그인 후 바로 개인 홈과 워크스페이스 허브로 이어집니다."}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-8 text-foreground/80">
              {isSignup
                ? "회원가입은 별도 폼이 아니라 첫 인증 자체로 끝납니다. 아직 워크스페이스가 없으면 onboarding으로, 이미 공간이 있으면 개인 홈으로 바로 이동합니다."
                : "Auth Hub는 세션을 만드는 표면입니다. 이후 `/auth` bridge가 ticket를 교환하고, 홈과 워크스페이스 허브는 같은 httpOnly session shell 위에서 이어집니다."}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <Link
                href={buildLoginHref(redirectTo)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${!isSignup ? "bg-foreground text-background" : "border border-border bg-background/70 text-foreground"}`}
              >
                로그인
              </Link>
              <Link
                href={buildSignupHref(redirectTo)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${isSignup ? "bg-foreground text-background" : "border border-border bg-background/70 text-foreground"}`}
              >
                회원가입
              </Link>
            </div>

            <div className="mt-8 grid gap-3">
              {providerCards.map((provider) => {
                const href = provider.key === "kakao" ? kakaoHref : googleHref;
                return (
                  <Link
                    key={provider.key}
                    href={href as Route}
                    className={`rounded-[26px] px-5 py-5 transition-transform hover:-translate-y-0.5 ${provider.tone}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-base font-semibold">{provider.label}</p>
                        <p className={`mt-2 text-sm leading-7 ${provider.key === "kakao" ? "text-[#111827]/80" : "text-white/72"}`}>{provider.description}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <aside className="px-7 py-8 lg:px-8 lg:py-10">
            <div className="rounded-[26px] border border-border bg-background/55 px-5 py-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Zap className="h-4 w-4 text-primary" />
                OAuth flow
              </div>
              <ol className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground">
                <li>1. provider 인증을 시작하면 원래 복귀 경로를 httpOnly 쿠키로 잠깐 보관합니다.</li>
                <li>2. backend callback이 ticket를 만들고 프론트 `/auth` bridge로 다시 내려옵니다.</li>
                <li>3. 프론트가 ticket를 실제 토큰으로 교환하고, 이후 화면은 모두 같은 session shell로 이어집니다.</li>
              </ol>
            </div>

            <div className="mt-4 rounded-[26px] border border-border bg-background/55 px-5 py-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CheckCircle className="h-4 w-4 text-primary" />
                로그인 뒤 분기
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                <li>워크스페이스가 없으면 바로 onboarding으로 이동합니다.</li>
                <li>이미 공간이 있으면 개인 홈에서 최근 문서와 워크스페이스를 먼저 보여줍니다.</li>
                <li>원래 보던 reader나 tenant 허브가 있으면 그 경로를 우선 복구합니다.</li>
              </ul>
            </div>

            <div className="mt-4 rounded-[26px] border border-border bg-background/55 px-5 py-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Layers className="h-4 w-4 text-primary" />
                현재 세션
              </div>
              {viewer.user ? (
                <div className="mt-4 space-y-2 text-sm leading-7 text-muted-foreground">
                  <p>
                    이미 <span className="font-semibold text-foreground">{viewer.user.displayName}</span> 계정으로 로그인되어 있습니다.
                  </p>
                  <p>다른 계정으로 다시 인증하려면 위 provider 버튼을 사용하면 됩니다.</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Link href="/" className={buttonStyles({ variant: "outline", size: "sm" })}>
                      개인 홈
                    </Link>
                    <Link href="/me" className={buttonStyles({ variant: "quiet", size: "sm" })}>
                      마이페이지
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-2 text-sm leading-7 text-muted-foreground">
                  <p>첫 인증은 계정 생성으로 처리되고, 이후부터는 같은 provider 목록에서 로그인과 계정 전환을 모두 처리합니다.</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Link href="/introduce" className={buttonStyles({ variant: "outline", size: "sm" })}>
                      서비스 소개
                    </Link>
                    <a href="/auth" className={buttonStyles({ variant: "quiet", size: "sm" })}>
                      Auth bridge 보기
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-[26px] border border-border bg-background/40 px-5 py-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <BookOpen className="h-4 w-4 text-primary" />
                Signup model
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                회원가입은 별도 폼 대신 OAuth 첫 로그인으로 끝납니다. 이 단계에서 개인 계정을 만들고, tenant와 첫 guidebook 생성은 onboarding에서 이어집니다.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
