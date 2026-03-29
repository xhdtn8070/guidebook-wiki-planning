import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, BookOpen, Layers, Search as SearchIcon, Spark, Star, Zap } from "@/shared/icons";
import { buildLoginHref, buildSearchHref, buildSignupHref, buildTenantHref } from "@/shared/lib/routes";
import { buttonStyles } from "@/shared/ui/button";

const quickStartCards = [
  {
    title: "빠른 시작",
    description: "tenant를 만든 뒤 첫 guidebook을 열고, reader와 검색 흐름을 같은 셸에서 시작합니다.",
  },
  {
    title: "OAuth bridge",
    description: "프론트 `/auth` 브리지가 ticket를 실제 세션으로 교환하고 작업면으로 다시 돌려보냅니다.",
  },
  {
    title: "운영 진입",
    description: "읽기, 검색, 관리자 진입이 서로 끊기지 않고 같은 문서 제품 안에서 이어집니다.",
  },
];

const popularTopics = ["카카오 OAuth 설정", "워크스페이스 온보딩", "PG 검색 구성", "플러그인 블록 시작"];
const recentUpdates = ["reader shell 재정의", "tenant-aware home 분리", "로컬 OAuth 자동화", "실데이터 시드 루프"];
const searchTopics = [
  { label: "온보딩 체크리스트", query: "온보딩 체크리스트" },
  { label: "OAuth 브리지", query: "OAuth bridge" },
  { label: "검색 설계", query: "workspace search" },
];

const principles = [
  {
    title: "검색이 제품의 시작점",
    body: "상단 검색은 보조 기능이 아니라 reader, workspace, admin entry를 하나로 엮는 핵심 입력면입니다.",
    icon: SearchIcon,
  },
  {
    title: "개인 홈과 워크스페이스 홈 분리",
    body: "로그인 직후에는 개인 흐름을 먼저 보여주고, 특정 워크스페이스에 들어가면 guidebook 디렉터리와 내 작업 흐름을 함께 보여줍니다.",
    icon: Layers,
  },
  {
    title: "운영 가능한 docs shell",
    body: "단순 랜딩이나 오래된 위키처럼 보이지 않고, 실제 운영·검색·읽기가 가능한 제품 표면으로 설계합니다.",
    icon: BookOpen,
  },
];

export function IntroduceExperience() {
  return (
    <div className="space-y-10">
      <section className="-mx-4 overflow-hidden md:-mx-6 xl:-mx-8">
        <div className="hero-gradient border-y border-border px-4 py-10 md:px-6 md:py-16 xl:px-8">
          <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[minmax(0,1.06fr)_430px] lg:items-end">
            <div className="max-w-4xl">
              <span className="pill">Knowledge product</span>
              <h1 className="mt-6 text-5xl font-extrabold tracking-[-0.075em] text-foreground md:text-7xl">
                팀의 source of truth를 검색 중심의 workspace product로 다시 세웁니다.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/78">
                Guidebook Wiki는 단순 위키가 아니라, 검색에서 reader와 workspace hub, onboarding까지 자연스럽게 이어지는 운영형 문서 제품입니다.
                첫 방문자는 제품의 성격을 이해하고, 로그인 후에는 바로 자신의 문서 흐름으로 들어갑니다.
              </p>

              <div className="mt-10 max-w-3xl rounded-[32px] border border-border bg-background/82 p-4 shadow-theme-lg">
                <div className="rounded-[26px] border border-border bg-[hsl(var(--surface-elevated))] px-4 py-4 md:px-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <SearchIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">Search-first workspace</p>
                      <p className="text-sm text-muted-foreground">문서, 용어, 코드 식별자, 운영 플로우를 하나의 검색 입력면에서 엽니다.</p>
                    </div>
                    <Link href={buildSearchHref("") as Route} className="hidden rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground md:inline-flex">
                      Search shell
                    </Link>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {searchTopics.map((topic) => (
                      <Link
                        key={topic.label}
                        href={buildLoginHref(buildSearchHref(topic.query))}
                        className="rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                      >
                        {topic.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className={buttonStyles({ size: "lg" })}>
                  카카오로 시작하기
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={buildSignupHref()} className={buttonStyles({ variant: "outline", size: "lg" })}>
                  회원가입
                </Link>
                <Link href={buildTenantHref(1) as Route} className={buttonStyles({ variant: "outline", size: "lg" })}>
                  데모 워크스페이스 보기
                </Link>
              </div>
              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Signed-out", value: "Introduce poster" },
                  { label: "Signed-in", value: "Personal home" },
                  { label: "Workspace", value: "Tenant hub" },
                ].map((item) => (
                  <div key={item.label} className="rounded-[22px] border border-border bg-background/62 px-4 py-4 shadow-theme-sm">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-[34px] border border-border bg-[hsl(var(--surface-strong))] p-5 shadow-theme-lg">
              <div className="rounded-[28px] border border-border bg-background/82 p-4">
                <div className="rounded-[24px] border border-border bg-[hsl(var(--surface-elevated))] px-5 py-5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-primary">Workspace preview · demo</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Engineering Design Lab</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    로그인 후에는 개인 홈에서 최근 흐름을 보고, 워크스페이스 허브에서는 대표 guidebook과 디렉터리를 같은 셸 안에서 엽니다.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">Workspace hub</span>
                    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">Guidebook directory</span>
                    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">Search-first</span>
                  </div>
                </div>

                <div className="mt-4 grid gap-4">
                  <div className="rounded-[24px] border border-border bg-[hsl(var(--surface-elevated))] px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Popular topics</p>
                    <ul className="mt-3 space-y-3 text-sm text-foreground">
                      {popularTopics.map((item) => (
                        <li key={item} className="flex items-center gap-3">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[24px] border border-border bg-[hsl(var(--surface-elevated))] px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Latest changes</p>
                    <ul className="mt-3 space-y-3 text-sm text-foreground">
                      {recentUpdates.map((item) => (
                        <li key={item} className="flex items-center justify-between gap-3">
                          <span className="truncate">{item}</span>
                          <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">now</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_360px]">
        <article className="surface-elevated rounded-[30px] border border-border px-6 py-6 shadow-theme-md">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Getting started</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">첫 사용자의 흐름을 설명이 아니라 동선으로 정리합니다.</h2>
            </div>
            <Link href={buildTenantHref(1) as Route} className="hidden text-sm font-semibold text-primary md:inline-flex">
              Demo workspace
            </Link>
          </div>
          <div className="mt-5 divide-y divide-border">
            {quickStartCards.map((item, index) => (
              <div key={item.title} className="grid gap-4 py-5 first:pt-0 last:pb-0 md:grid-cols-[84px_minmax(0,1fr)]">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Step {index + 1}</p>
                  <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Zap className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <aside className="surface-elevated rounded-[30px] border border-border px-6 py-6 shadow-theme-md">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Star className="h-4 w-4 text-primary" />
            First-user flow
          </div>
          <ol className="mt-5 space-y-4">
            {[
              {
                title: "Introduce",
                body: "서비스 정체성과 workspace model을 먼저 이해합니다.",
              },
              {
                title: "Personal home",
                body: "로그인 직후에는 최근 흐름과 중요한 문서만 먼저 봅니다.",
              },
              {
                title: "Tenant hub",
                body: "특정 workspace에 들어가면 guidebook 디렉터리와 운영 진입으로 내려갑니다.",
              },
            ].map((item, index) => (
              <li key={item.title} className="rounded-[24px] border border-border bg-background/55 px-5 py-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{index + 1}</p>
                <p className="mt-3 text-xl font-semibold tracking-tight text-foreground">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <article className="surface-elevated rounded-[30px] border border-border px-6 py-6 shadow-theme-md">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Spark className="h-4 w-4 text-primary" />
            Design principles
          </div>
          <div className="mt-5 divide-y divide-border">
            {principles.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <aside className="hero-gradient overflow-hidden rounded-[30px] border border-border px-6 py-6 shadow-theme-md">
          <p className="text-[11px] uppercase tracking-[0.18em] text-primary">The product promise</p>
          <h2 className="mt-4 max-w-sm text-3xl font-bold tracking-tight text-foreground">검색, reader, workspace 운영이 같은 제품 표면으로 읽혀야 합니다.</h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-foreground/72">
            오래된 위키처럼 문서를 그냥 나열하지 않고, 검색과 컨텍스트, 운영 진입이 하나의 knowledge product로 이어지게 만드는 것이 이 프로젝트의 핵심입니다.
          </p>
          <div className="mt-8 grid gap-3">
            {[
              "개인 홈과 workspace home을 분리해 첫 사용 맥락을 명확히 한다.",
              "검색 입력면을 첫 뷰의 주인공으로 올려 문서 접근을 가볍게 만든다.",
              "reader와 admin entry를 같은 셸 철학 안에서 확장한다.",
            ].map((item) => (
              <div key={item} className="rounded-[22px] border border-border bg-background/58 px-4 py-4 text-sm leading-7 text-foreground/80">
                {item}
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
