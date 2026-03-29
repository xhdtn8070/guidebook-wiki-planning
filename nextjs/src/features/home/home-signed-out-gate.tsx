import Link from "next/link";
import { ArrowRight, Bell, BookOpen, Layers, Search as SearchIcon, Star } from "@/shared/icons";
import { buttonStyles } from "@/shared/ui/button";

export function HomeSignedOutGate() {
  return (
    <div className="space-y-6">
      <section className="surface-elevated grid gap-6 overflow-hidden rounded-[34px] border border-border px-6 py-8 shadow-theme-lg lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
        <div className="max-w-3xl">
          <span className="pill">Personal home</span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-6xl">
            로그인하면 내가 다시 봐야 할 문서와 내 워크스페이스가 한 화면에 정리됩니다.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            홈은 서비스 소개 페이지가 아니라, 로그인 이후의 개인 작업면입니다. 최근 이어서 본 문서, 중요 문서, 알림, 내가 속한 워크스페이스를 먼저 보여주고
            실제 작업은 각 워크스페이스 허브와 reader로 이어집니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className={buttonStyles({ size: "lg" })}>
              로그인하고 내 홈 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/introduce" className={buttonStyles({ variant: "outline", size: "lg" })}>
              서비스 소개 보기
            </Link>
          </div>
        </div>

        <aside className="quiet-grid rounded-[28px] border border-border bg-background/72 p-5">
          <div className="rounded-[24px] border border-border bg-[hsl(var(--surface-strong))] px-5 py-5 shadow-theme-md">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">After login</p>
            <div className="mt-4 space-y-3">
              {[
                {
                  icon: SearchIcon,
                  title: "검색으로 바로 진입",
                  body: "문서, 용어, 코드 식별자를 워크스페이스 문맥 안에서 바로 찾습니다.",
                },
                {
                  icon: BookOpen,
                  title: "최근 보던 문서 재개",
                  body: "reader route와 tenant context를 유지한 채 마지막 문서로 복귀합니다.",
                },
                {
                  icon: Layers,
                  title: "내 워크스페이스 허브",
                  body: "개인 홈에서 공간을 고르고, 각 workspace에서 guidebook 디렉터리로 이어집니다.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-border bg-background/55 px-4 py-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Icon className="h-4 w-4 text-primary" />
                      {item.title}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          {
            icon: BookOpen,
            title: "최근 이어서 보기",
            body: "내가 마지막에 읽던 문서를 다시 열고 흐름을 잃지 않습니다.",
          },
          {
            icon: Star,
            title: "중요 문서 정리",
            body: "즐겨찾기한 문서를 개인 홈과 workspace 허브에서 다시 좁혀 봅니다.",
          },
          {
            icon: Bell,
            title: "나와 관련된 이벤트",
            body: "초대, 권한 변경, 시스템 알림처럼 나와 직접 연결된 이벤트를 먼저 봅니다.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="surface-elevated rounded-[26px] border border-border px-5 py-5 shadow-theme-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-xl font-semibold tracking-tight text-foreground">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
