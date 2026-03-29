import Link from "next/link";
import { ArrowRight, BookOpen, Layers, Search as SearchIcon, Spark, Zap } from "@/shared/icons";
import { buttonStyles } from "@/shared/ui/button";

const pillars = [
  {
    title: "Search-first knowledge product",
    description: "상단 검색이 단순 도구가 아니라 제품의 중심 상호작용이 되도록 reader, workspace, admin entry를 같은 셸로 묶습니다.",
    icon: SearchIcon,
  },
  {
    title: "Tenant-aware workspace model",
    description: "개인 홈과 워크스페이스 홈을 분리해, 첫 사용자는 제품을 이해하고 기존 사용자는 바로 자신이 속한 위키 허브로 들어갑니다.",
    icon: Layers,
  },
  {
    title: "Operational docs shell",
    description: "좌측 nav, 중앙 reader, 우측 TOC는 제품형 문서 서비스 감각으로 유지하되, 오래된 위키나 콘솔처럼 보이지 않게 정제합니다.",
    icon: BookOpen,
  },
];

const featureRail = [
  "OAuth bridge 기반 httpOnly session",
  "Canonical page route + guidebook/page id 축",
  "Signed-out introduce / signed-in home 분리",
  "Workspace onboarding → first guidebook 생성",
];

export function IntroduceExperience() {
  return (
    <div className="space-y-12">
      <section className="-mx-4 overflow-hidden md:-mx-6 xl:-mx-8">
        <div className="hero-gradient border-y border-border px-4 py-10 md:px-6 md:py-14 xl:px-8">
          <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div className="max-w-4xl">
              <span className="pill">Guidebook Wiki</span>
              <h1 className="mt-6 text-5xl font-extrabold tracking-[-0.06em] text-foreground md:text-7xl">
                오래된 위키가 아니라, 운영과 읽기가 함께 이어지는 modern knowledge product.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/78">
                Guidebook Wiki는 문서를 모아두는 저장소가 아니라, 검색과 권한, 워크스페이스, 운영 진입이 하나의 제품 경험으로 이어지는 문서 시스템입니다.
                첫 방문자는 소개에서 제품의 모양을 이해하고, 로그인 후에는 바로 자신의 workspace hub로 들어갑니다.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className={buttonStyles({ size: "lg" })}>
                  카카오로 시작하기
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/" className={buttonStyles({ variant: "outline", size: "lg" })}>
                  현재 앱 홈 보기
                </Link>
              </div>
            </div>

            <div className="rounded-[32px] border border-border bg-[hsl(var(--surface-strong))] p-5 shadow-theme-lg">
              <div className="rounded-[28px] border border-border bg-background/72 p-4">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground text-sm font-extrabold text-background">G</div>
                  <div className="min-w-0 flex-1 rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm text-muted-foreground">
                    Search docs, tokens, workflows, onboarding
                  </div>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)_120px]">
                  <div className="space-y-2">
                    {["Introduce", "Workspace", "Reader", "Admin entry"].map((label) => (
                      <div key={label} className="rounded-2xl border border-border bg-secondary/50 px-3 py-2 text-xs font-medium text-foreground/90">
                        {label}
                      </div>
                    ))}
                  </div>
                  <div className="rounded-[24px] border border-border bg-[hsl(var(--surface-strong))] px-5 py-5 shadow-theme-md">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Product shell</p>
                    <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">검색에서 reader와 onboarding까지 이어지는 하나의 표면</p>
                    <div className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground">
                      <p>첫 사용자는 `/introduce`에서 제품 정체성을 이해합니다.</p>
                      <p>로그인 후에는 `/`와 `/tenant/[tenantId]`가 개인 홈과 워크스페이스 허브를 분리합니다.</p>
                      <p>reader와 admin entry는 여전히 동일한 page id 기준 route를 공유합니다.</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {["TOC", "Context", "Actions", "Session"].map((label) => (
                      <div key={label} className="rounded-2xl border border-border bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {featureRail.map((item) => (
                  <div key={item} className="rounded-2xl border border-border bg-background/55 px-4 py-4 text-sm text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Visual thesis</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Brand-first but operationally dense.</h2>
          <p className="max-w-xl text-base leading-8 text-muted-foreground">
            이 제품은 랜딩처럼 보이기만 해서는 안 되고, 실제 문서 운영 시스템처럼 읽혀야 합니다. 그래서 소개 페이지에서도 허세보다 구조를 먼저 보여주고,
            검색과 워크스페이스 허브를 첫 번째 행동으로 드러냅니다.
          </p>
        </div>
        <div className="divide-y divide-border rounded-[28px] border border-border bg-[hsl(var(--surface-strong))] px-6 py-4 shadow-theme-md">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article key={pillar.title} className="flex gap-4 py-5 first:pt-1 last:pb-1">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{pillar.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="surface-elevated rounded-[30px] border border-border px-6 py-6 shadow-theme-md">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Spark className="h-4 w-4 text-primary" />
            First-user flow
          </div>
          <ol className="mt-5 grid gap-4 md:grid-cols-3">
            <li className="rounded-2xl border border-border bg-background/45 px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">1</p>
              <p className="mt-3 text-base font-semibold text-foreground">Introduce</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">서비스 정체성과 workspace model을 먼저 이해합니다.</p>
            </li>
            <li className="rounded-2xl border border-border bg-background/45 px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">2</p>
              <p className="mt-3 text-base font-semibold text-foreground">Onboarding</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">tenant를 만들고 첫 guidebook을 등록해 곧바로 실제 문서 표면으로 들어갑니다.</p>
            </li>
            <li className="rounded-2xl border border-border bg-background/45 px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">3</p>
              <p className="mt-3 text-base font-semibold text-foreground">Read & operate</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">search, reader, admin entry가 같은 제품 셸 위에서 이어집니다.</p>
            </li>
          </ol>
        </article>

        <aside className="surface-elevated rounded-[30px] border border-border px-6 py-6 shadow-theme-md">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Zap className="h-4 w-4 text-primary" />
            Why now
          </div>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            백엔드 API 구조는 이미 정리됐습니다. 이제 필요한 건 그 계약을 실제 사용자 여정과 제품 첫인상으로 번역하는 일입니다. 이 소개 페이지와 이후 workspace
            home은 그 기준면이 됩니다.
          </p>
        </aside>
      </section>
    </div>
  );
}
