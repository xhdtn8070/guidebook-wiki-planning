import Link from "next/link";
import { ArrowRight } from "@/shared/icons";
import { buttonStyles } from "@/shared/ui/button";

export function HomeGuestLanding() {
  return (
    <div className="animate-rise-in space-y-16 pb-10">
      <section className="grid min-h-[calc(100vh-13rem)] items-start gap-12 pt-4 lg:grid-cols-2">
        <div className="flex flex-col justify-between py-8">
          <div>
            <p className="editorial-eyebrow">Guidebook Wiki</p>
            <h1 className="mt-6 max-w-3xl text-5xl text-foreground md:text-7xl">
              Guidebook Wiki: 읽기와 검색을 위한 사내 플랫폼.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
              Product, Partner, Operations 문서를 하나의 조용한 아카이브로 엮습니다. Next BFF가 실제 백엔드 세션과 tenant 컨텍스트를 붙잡고,
              검색과 문서 읽기, 관리자 진입까지 같은 구조 안에서 이어집니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login" className={buttonStyles({ size: "lg" })}>
                Set system in motion
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/search" className={buttonStyles({ variant: "outline", size: "lg" })}>
                View stitched archive
              </Link>
            </div>
          </div>

          <div className="mt-12 grid max-w-3xl gap-6 border-t border-border pt-8 md:grid-cols-3">
            <ValueBlock
              title="Visual thesis"
              description="큰 세리프 헤드라인과 얇은 레일, 카드보다 레이아웃 중심의 탐색 구조를 택합니다."
            />
            <ValueBlock
              title="Implementation"
              description="`/api/home`, `/api/wiki/nav`, `/api/search/pages`, `/api/pages/{pageId}` 계약을 그대로 유지합니다."
            />
            <ValueBlock
              title="Auth bridge"
              description="OAuth ticket 교환은 Next session route가 담당하고, 프론트는 canonical route만 노출합니다."
            />
          </div>
        </div>

        <aside className="relative flex min-h-[560px] items-end overflow-hidden border border-border bg-[#d8ddd6]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_20%,rgba(255,255,255,0.45),transparent_26%),linear-gradient(180deg,rgba(241,243,239,0.1),rgba(91,103,98,0.18))]" />
          <div className="absolute right-10 top-12 h-[420px] w-[240px] rounded-[140px] bg-[linear-gradient(180deg,rgba(230,232,228,0.88),rgba(145,153,148,0.62))] opacity-90 blur-[0.2px]" />
          <div className="absolute right-[5.5rem] top-[5.5rem] h-[330px] w-[150px] rounded-full border border-white/25 bg-[linear-gradient(180deg,rgba(240,242,237,0.66),rgba(126,136,132,0.46))]" />
          <div className="relative z-10 max-w-[260px] px-8 py-9 text-[#f6f4ef]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/72">Archive portrait</p>
            <p className="mt-3 text-sm leading-7 text-white/88">조용한 정보 밀도, 낮은 채도, 명확한 계층을 기본값으로 둔 1차 시안입니다.</p>
          </div>
        </aside>
      </section>

      <section className="grid gap-10 border-t border-border pt-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <p className="editorial-eyebrow">Design thesis & flow</p>
          <p className="mt-4 max-w-2xl text-2xl text-foreground">구조는 확정됐고, 이제 화면을 실제 제품처럼 읽히게 만드는 단계입니다.</p>
        </div>
        <blockquote className="border-l border-border pl-6 text-sm leading-8 text-muted-foreground lg:col-span-2">
          “이 시안은 단순한 위키가 아니라, 팀이 검색하고 읽고 관리하는 흐름을 하나의 에디토리얼 제품면으로 묶는 것을 목표로 합니다.”
        </blockquote>
      </section>
    </div>
  );
}

function ValueBlock({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}
