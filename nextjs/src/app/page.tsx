import Link from "next/link";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { Button } from "@/components/ui/button";
import { popularDocs, recentDocs } from "@/lib/mockData";
import { BookOpen, Code2, Search, Zap, ChevronRight } from "@/components/icons";

export default function HomePage() {
  return (
    <LayoutShell>
      <main className="flex-1">
        <section className="hero-gradient relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-background/40" />
          <div className="relative container max-w-5xl py-16 px-6">
            <div className="max-w-2xl animate-fade-in">
              <span className="pill-ghost inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary mb-4">
                Tenant · playbook.guidebook.wiki
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">API 실전 플레이북 위키</h1>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                REST API 연동부터 OAuth 인증, 플러그인 개발까지.
                멀티 테넌트 위키 플랫폼에서 필요한 모든 문서를 한곳에서 찾아보세요.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="shadow-theme-md" asChild>
                  <Link href="/docs/getting-started">
                    시작하기 <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/docs/getting-started">문서 바로가기</Link>
                </Button>
                <Button size="lg" variant="ghost" asChild>
                  <Link href="/auth/login">로그인/회원가입</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container max-w-5xl py-12 px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: "빠른 시작", desc: "API 연동을 위한 기본 설정과 첫 번째 호출까지 안내합니다.", link: "/docs/getting-started" },
              { icon: Code2, title: "API 레퍼런스", desc: "모든 엔드포인트와 파라미터를 상세히 문서화했습니다.", link: "/docs/api-reference" },
              { icon: Zap, title: "플러그인 블록", desc: "문서 내에서 직접 API를 테스트하고 실행해보세요.", link: "/docs/plugins" },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.link}
                className="group p-5 rounded-xl border border-border bg-card shadow-theme-sm hover:shadow-theme-md hover:border-primary/30 transition-all duration-200"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="container max-w-5xl py-8 px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-5 rounded-xl border border-border bg-card shadow-theme-sm">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" /> 인기 문서
              </h3>
              <ul className="space-y-2">
                {popularDocs.map((doc) => (
                  <li key={doc.id}>
                    <Link href="/docs/getting-started" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {doc.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card shadow-theme-sm">
              <h3 className="font-semibold mb-4">최근 업데이트</h3>
              <ul className="space-y-2">
                {recentDocs.map((doc) => (
                  <li key={doc.id} className="flex justify-between text-sm">
                    <Link href="/docs/getting-started" className="text-muted-foreground hover:text-primary transition-colors">
                      {doc.title}
                    </Link>
                    <span className="text-xs text-muted-foreground">{doc.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </LayoutShell>
  );
}
