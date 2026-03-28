import Link from "next/link";
import { ArrowRight } from "@/shared/icons";
import { buttonStyles } from "@/shared/ui/button";

export function HomeGuestLanding() {
  return (
    <section className="grid min-h-[calc(100vh-10rem)] items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="pb-8">
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Guidebook Wiki</p>
        <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-[-0.05em] text-foreground md:text-7xl">
          읽기와 검색 중심의 위키 프론트를 Next BFF 위에 다시 세웁니다.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
          이 화면은 더 이상 mock API에 기대지 않습니다. 실제 백엔드 <code>/api/home</code>, <code>/api/wiki/nav</code>,{" "}
          <code>/api/search/pages</code>, <code>/api/pages/{"{pageId}"}</code> 계약을 기준으로 라우트와 상태를 다시 고정했고, 디자인은 그 구조 위에서 Stitch로 다시 받을 수
          있게 정리했습니다.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/login" className={buttonStyles({ size: "lg" })}>
            카카오 로그인
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/search" className={buttonStyles({ variant: "outline", size: "lg" })}>
            검색 골격 보기
          </Link>
        </div>
      </div>

      <aside className="relative overflow-hidden rounded-[36px] border border-border bg-panel-soft px-7 py-8">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Visual thesis</p>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">Quiet editorial control room</p>
        <div className="mt-8 space-y-7 text-sm leading-7 text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">Content plan</p>
            <p>홈, 그룹 전환, 문서 리더, 검색, 권한 게이트, 관리자 진입을 한 흐름으로 묶습니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Interaction thesis</p>
            <p>검색 우선, sticky nav/toc, 적은 색과 큰 타이포그래피로 빠른 스캔을 돕습니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Implementation note</p>
            <p>OAuth ticket 교환과 토큰 보관은 Next session route가 담당하고, 프론트는 canonical page route만 사용합니다.</p>
          </div>
        </div>
      </aside>
    </section>
  );
}
