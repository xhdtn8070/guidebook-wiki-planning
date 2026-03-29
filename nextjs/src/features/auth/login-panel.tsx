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
    <section className="animate-rise-in grid min-h-[calc(100vh-12rem)] gap-0 overflow-hidden border border-border bg-panel lg:grid-cols-2">
      <div className="flex items-center px-8 py-12 md:px-14">
        <div className="max-w-[420px]">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Spark className="h-4 w-4" />
            <span className="italic">The Editorial Archive</span>
          </div>
          <h1 className="mt-6 text-5xl text-foreground md:text-6xl">로그인</h1>
          <p className="mt-5 text-sm leading-8 text-muted-foreground">
            세션 상태를 실제 가이드북 읽기, 검색 및 접근 제어 UX에 연결합니다. 로그인 후에는 tenant 선택과 canonical route가 같은 흐름 안에서 이어집니다.
          </p>

          <div className="mt-10 grid gap-3">
            <Link href={oauthHref as Route} className="inline-flex h-11 items-center justify-center gap-2 bg-[#FEE500] px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111827] transition-transform hover:-translate-y-0.5">
              Kakao login
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={googleHref as Route} className="inline-flex h-11 items-center justify-center gap-2 border border-border bg-white px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition-transform hover:-translate-y-0.5">
              Google login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className={buttonStyles({ variant: "outline", size: "lg" })}>
              홈으로 돌아가기
            </Link>
            <a href="/auth" className={buttonStyles({ variant: "quiet", size: "lg" })}>
              Auth bridge 보기
            </a>
          </div>

          <p className="mt-14 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">2026 selective access protocol in effect.</p>
        </div>
      </div>

      <aside className="relative border-l border-border bg-[linear-gradient(180deg,#f8f5ef_0%,#f1ece3_72%,#efe8de_100%)] px-8 py-12 md:px-12">
        <p className="editorial-eyebrow">OAuth bridge</p>
        <h2 className="mt-4 text-4xl text-foreground">인증 프로세스</h2>
        <ol className="mt-8 space-y-7">
          <ProcessStep index="1" title="Redirect" description="사용자 인증 요청을 provider 쪽으로 넘기되, Next가 복귀 경로를 쿠키로 보존합니다." />
          <ProcessStep index="2" title="Ticket Exchange" description="브리지 페이지가 티켓을 감지하고 세션 토큰을 httpOnly 쿠키로 교환합니다." />
          <ProcessStep index="3" title="BFF Ready" description="이후 모든 API fetch는 Next wrapper가 `Bearer`와 `X-Tenant-Id`를 자동 주입합니다." />
        </ol>

        <div className="mt-16 max-w-[280px] border border-border bg-panel px-5 py-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">System status</p>
          <p className="mt-3 text-sm font-medium text-foreground">Issued with selective archive access.</p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">Node · EA-9931-X · protocol WIKI-ACCESS-84</p>
        </div>
      </aside>
    </section>
  );
}

function ProcessStep({ index, title, description }: { index: string; title: string; description: string }) {
  return (
    <li className="flex gap-4">
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center border border-border text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {index}
      </span>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p>
      </div>
    </li>
  );
}
