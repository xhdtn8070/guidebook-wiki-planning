import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Spark } from "@/shared/icons";
import { buttonStyles } from "@/shared/ui/button";

type LoginPanelProps = {
  redirectTo: string;
};

export function LoginPanel({ redirectTo }: LoginPanelProps) {
  const oauthHref = `/api/session/oauth/kakao?redirect=${encodeURIComponent(redirectTo)}`;
  const googleHref = `/api/session/oauth/google?redirect=${encodeURIComponent(redirectTo)}`;

  return (
    <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[32px] border border-border bg-panel-soft px-7 py-8 md:px-10 md:py-12">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Sign in</p>
        <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl">
          카카오 인증을 연결해 읽기, 검색, 관리 흐름을 바로 이어갑니다.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-8 text-muted-foreground">
          이 프론트는 백엔드의 실제 `Authorization`과 `X-Tenant-Id` 계약 위에서 동작합니다. 로그인 후에는 최근 문서,
          검색, 워크스페이스 전환, 관리자 진입 상태를 바로 확인할 수 있습니다.
        </p>

        <div className="mt-8 grid max-w-xl gap-3">
          <Link href={oauthHref as Route} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#FEE500] px-5 text-sm font-semibold text-[#111827] transition-transform hover:-translate-y-0.5">
            카카오로 로그인
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href={googleHref as Route} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#111827] px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
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

      <aside className="rounded-[32px] border border-border bg-panel px-6 py-7">
        <div className="flex items-center gap-3 text-sm font-medium text-foreground">
          <Spark className="h-4 w-4" />
          OAuth bridge
        </div>
        <dl className="mt-6 space-y-5 text-sm">
          <div>
            <dt className="text-muted-foreground">1. Redirect</dt>
            <dd className="mt-1 leading-7 text-foreground">백엔드의 `/oauth/login` 테스트 페이지처럼 provider redirect를 시작하되, Next가 복귀 경로를 쿠키로 보존합니다.</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">2. Ticket exchange</dt>
            <dd className="mt-1 leading-7 text-foreground">백엔드 `auth.html`과 동일하게 `/auth#ticket=...`를 읽지만, 저장은 browser storage 대신 httpOnly 쿠키로 끝냅니다.</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">3. BFF ready</dt>
            <dd className="mt-1 leading-7 text-foreground">
              이후 모든 프론트 fetch는 Next wrapper를 통해 `Bearer`와 `X-Tenant-Id`를 자동 주입합니다.
            </dd>
          </div>
        </dl>
      </aside>
    </section>
  );
}
