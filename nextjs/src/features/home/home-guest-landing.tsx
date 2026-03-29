import Link from "next/link";
import { ArrowRight, BookOpen, Code, Search as SearchIcon, Zap } from "@/shared/icons";
import { buttonStyles } from "@/shared/ui/button";

const quickStartItems = [
  {
    title: "Search-first docs shell",
    description: "검색, tenant context, 권한 게이트를 중심에 둔 제품형 위키 라우팅을 먼저 고정합니다.",
    icon: SearchIcon,
  },
  {
    title: "BFF auth bridge",
    description: "OAuth ticket 교환과 토큰 보관은 Next session route로 흡수하고, 프론트는 canonical page route만 사용합니다.",
    icon: Zap,
  },
  {
    title: "Reader + admin entry",
    description: "문서 읽기와 관리자 진입을 같은 page id 계약 위에 얹고, 에디터 본체는 이후 단계로 분리합니다.",
    icon: Code,
  },
];

export function HomeGuestLanding() {
  return (
    <div className="space-y-8">
      <section className="hero-gradient overflow-hidden rounded-[32px] border border-border shadow-theme-lg">
        <div className="grid gap-10 px-6 py-8 md:px-10 md:py-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="pill pill-ghost">Guidebook Wiki</span>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-6xl">
              Lovable midnight 톤을 흡수한 문서 중심 Next BFF를 다시 세웁니다.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/78">
              이 프론트는 더 이상 mock flow를 흉내내지 않습니다. 실제 백엔드 <code>/api/home</code>, <code>/api/wiki/nav</code>,{" "}
              <code>/api/search/pages</code>, <code>/api/pages/{"{pageId}"}</code> 계약에 맞춰 읽기, 검색, 인증, 관리자 진입을 고정한 상태에서
              디자인을 다시 다듬는 단계입니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login" className={buttonStyles({ size: "lg" })}>
                카카오 로그인
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/search" className={buttonStyles({ variant: "outline", size: "lg" })}>
                검색 구조 보기
              </Link>
            </div>
          </div>

          <aside className="surface-elevated rounded-[28px] border border-border px-5 py-5 shadow-theme-md">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Design basis</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-border bg-background/40 px-4 py-4">
                <p className="text-sm font-semibold text-foreground">Modern minimal docs UI</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  위키지만 오래된 백오피스처럼 보이지 않게, 얇은 보더와 낮은 채도의 surface로 제품형 문서 셸을 만듭니다.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background/40 px-4 py-4">
                <p className="text-sm font-semibold text-foreground">Full-flow scope</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  홈, 검색, 문서 리더, 로그인, auth bridge, 관리자 진입까지 한 흐름으로 연결합니다.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {quickStartItems.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="surface-elevated rounded-[28px] border border-border px-5 py-5 shadow-theme-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-xl font-semibold tracking-tight text-foreground">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <article className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold text-foreground">Quick start</p>
          </div>
          <ol className="mt-5 grid gap-4 md:grid-cols-3">
            <li className="rounded-2xl border border-border bg-background/40 px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">1</p>
              <p className="mt-3 text-base font-semibold text-foreground">로그인</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">OAuth redirect와 ticket exchange를 Next session route로 연결합니다.</p>
            </li>
            <li className="rounded-2xl border border-border bg-background/40 px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">2</p>
              <p className="mt-3 text-base font-semibold text-foreground">Workspace 선택</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">상단 workspace chooser가 `X-Tenant-Id`를 고정하고 읽기/검색 호출에 주입합니다.</p>
            </li>
            <li className="rounded-2xl border border-border bg-background/40 px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">3</p>
              <p className="mt-3 text-base font-semibold text-foreground">Search or read</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">검색 결과에서 canonical page route로 진입하고, reader와 admin entry를 같은 id 축으로 묶습니다.</p>
            </li>
          </ol>
        </article>

        <aside className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Current direction</p>
          <p className="mt-3 text-xl font-semibold tracking-tight text-foreground">Midnight docs shell</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Lovable의 제품감은 유지하되, 지나치게 콘솔 같거나 복고적인 위키 무드는 줄이고 좀 더 정제된 modern minimal docs UI로 다시 다듬을 예정입니다.
          </p>
        </aside>
      </section>
    </div>
  );
}
