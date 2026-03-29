import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, BookOpen, Zap } from "@/shared/icons";
import { buttonStyles } from "@/shared/ui/button";

type LoginPanelProps = {
  redirectTo: string;
};

export function LoginPanel({ redirectTo }: LoginPanelProps) {
  const oauthHref = `/api/session/oauth/kakao?redirect=${encodeURIComponent(redirectTo)}`;
  const googleHref = `/api/session/oauth/google?redirect=${encodeURIComponent(redirectTo)}`;

  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="hero-gradient overflow-hidden rounded-[32px] border border-border px-7 py-8 shadow-theme-lg md:px-10 md:py-12">
        <span className="pill pill-ghost">Sign in</span>
        <h1 className="mt-5 max-w-xl text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-5xl">
          카카오 인증을 연결해 읽기, 검색, 관리자 진입 흐름을 바로 이어갑니다.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-8 text-foreground/80">
          이 프론트는 실제 <code>Authorization</code>과 <code>X-Tenant-Id</code> 계약 위에서 동작합니다. 로그인 후에는 최근 문서, 검색, 워크스페이스 전환, 관리자 진입 상태를 바로 확인할 수 있습니다.
        </p>

        <div className="mt-8 grid max-w-xl gap-3">
          <Link href={oauthHref as Route} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-5 text-sm font-semibold text-[#111827] transition-transform hover:-translate-y-0.5">
            카카오로 로그인
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href={googleHref as Route} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
            Google로 로그인
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/" className={buttonStyles({ variant: "outline", size: "lg" })}>
              홈으로 돌아가기
            </Link>
            <a href="/auth" className={buttonStyles({ variant: "quiet", size: "lg" })}>
              Auth bridge 보기
            </a>
          </div>
        </div>
      </div>

      <aside className="surface-elevated rounded-[32px] border border-border px-6 py-7 shadow-theme-md">
        <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
          <Zap className="h-4 w-4 text-primary" />
          OAuth bridge
        </div>
        <dl className="mt-6 space-y-5 text-sm">
          <div className="rounded-2xl border border-border bg-background/35 px-4 py-4">
            <dt className="text-muted-foreground">1. Redirect</dt>
            <dd className="mt-1 leading-7 text-foreground">Next가 backend `/api/oauth/:provider/login/frontend`로 로그인 시작을 넘기고, 원래 복귀 경로는 httpOnly 쿠키로 보존합니다.</dd>
          </div>
          <div className="rounded-2xl border border-border bg-background/35 px-4 py-4">
            <dt className="text-muted-foreground">2. Ticket exchange</dt>
            <dd className="mt-1 leading-7 text-foreground">OAuth 완료 후 프론트 `/auth#ticket=...`가 ticket를 읽고 실제 토큰으로 교환한 뒤, 저장은 browser storage 대신 httpOnly 쿠키로 끝냅니다.</dd>
          </div>
          <div className="rounded-2xl border border-border bg-background/35 px-4 py-4">
            <dt className="text-muted-foreground">3. BFF ready</dt>
            <dd className="mt-1 leading-7 text-foreground">이후 모든 프론트 fetch는 Next wrapper를 통해 `Bearer`와 `X-Tenant-Id`를 자동 주입합니다.</dd>
          </div>
        </dl>
        <div className="mt-6 rounded-2xl border border-border bg-background/35 px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            Canonical flow
          </div>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">로그인 이후에는 홈, 검색, reader, admin entry가 모두 같은 session shell 위에서 이어집니다.</p>
        </div>
      </aside>
    </section>
  );
}
