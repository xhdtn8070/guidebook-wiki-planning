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
      <section className="hero-gradient overflow-hidden rounded-[36px] border border-border shadow-theme-lg">
        <div className="grid gap-10 px-6 py-8 md:px-10 md:py-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <span className="pill pill-ghost">Guidebook Wiki</span>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-6xl">
              읽기, 검색, 권한 흐름이 한 셸 안에서 이어지는 운영형 위키를 다시 세웁니다.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/78">
              이 프론트는 mock을 흉내내는 화면이 아닙니다. 실제 백엔드 <code>/api/home</code>, <code>/api/wiki/nav</code>,{" "}
              <code>/api/search/pages</code>, <code>/api/pages/{"{pageId}"}</code> 계약에 맞춰 읽기, 검색, 인증, 관리자 진입을 먼저 고정하고,
              그 위에 modern minimal docs UI를 다시 입히는 단계입니다.
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
            <div className="mt-8 grid max-w-3xl gap-3 text-sm text-muted-foreground md:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-background/55 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Locked</p>
                <p className="mt-2 font-semibold text-foreground">Canonical routes</p>
                <p className="mt-2 leading-7">문서 읽기, 검색, 로그인, 관리자 진입 경로는 이미 백엔드 계약과 맞춰져 있습니다.</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/55 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Context</p>
                <p className="mt-2 font-semibold text-foreground">Tenant-aware shell</p>
                <p className="mt-2 leading-7">tenant는 route가 아니라 session context로 유지되고, 검색과 reader에 같은 방식으로 주입됩니다.</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/55 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Goal</p>
                <p className="mt-2 font-semibold text-foreground">Product-grade docs</p>
                <p className="mt-2 leading-7">랜딩보다는 제품형 문서 서비스처럼 보이되, 첫 화면의 존재감은 더 강하게 가져갑니다.</p>
              </div>
            </div>
          </div>

          <aside className="surface-elevated quiet-grid relative overflow-hidden rounded-[30px] border border-border px-5 py-5 shadow-theme-md">
            <div className="absolute right-[-36px] top-[-36px] h-28 w-28 rounded-full bg-primary/12 blur-3xl" />
            <div className="relative">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Shell preview</p>
              <div className="mt-4 rounded-[26px] border border-border/80 bg-background/82 p-3 shadow-theme-sm">
                <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-foreground text-xs font-bold text-background">G</div>
                  <div className="min-w-0 flex-1 rounded-2xl border border-border/80 bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
                    Search docs, terms, code identifiers
                  </div>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-[160px_minmax(0,1fr)_110px]">
                  <div className="space-y-2">
                    {["Getting started", "Workspace setup", "Permissions", "Publishing"].map((label) => (
                      <div key={label} className="rounded-2xl border border-border/70 bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
                        {label}
                      </div>
                    ))}
                  </div>
                  <div className="rounded-[22px] border border-border/70 bg-background/85 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Reader</p>
                    <p className="mt-3 text-lg font-semibold text-foreground">Guidebook publishing workflow</p>
                    <div className="mt-3 space-y-2">
                      <div className="h-2 rounded-full bg-foreground/10" />
                      <div className="h-2 w-5/6 rounded-full bg-foreground/10" />
                      <div className="h-2 w-4/6 rounded-full bg-foreground/10" />
                    </div>
                    <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 px-3 py-3 text-xs text-muted-foreground">
                      Gate states, search handoff, and admin entry stay in the same shell.
                    </div>
                  </div>
                  <div className="space-y-2">
                    {["Overview", "Roles", "Tokens", "Publish"].map((label) => (
                      <div key={label} className="rounded-2xl border border-border/70 bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="surface-elevated rounded-[28px] border border-border px-6 py-6 shadow-theme-md">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Why this rebuild</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">현재 Next는 구조의 source of truth이고, Lovable은 스타일 reference입니다.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              그래서 리디자인도 기존 프로토타입이 아니라, 이 Next 셸을 기준으로 요청해야 합니다. 구조와 상태는 이미 잠겨 있고, 이제 더 강한 정보 위계와 브랜드 톤을
              올릴 차례입니다.
            </p>
          </div>
          <div className="divide-y divide-border">
            {quickStartItems.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
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
          <p className="mt-3 text-xl font-semibold tracking-tight text-foreground">Modern minimal docs UI</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Lovable의 제품감은 유지하되, 콘솔 풍과 복고적인 위키 무드는 덜고 더 밝고 정제된 운영형 문서 UI로 재정렬합니다.
          </p>
        </aside>
      </section>
    </div>
  );
}
