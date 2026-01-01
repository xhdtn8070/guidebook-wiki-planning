import Link from "next/link";
import { ApiShapeCard } from "@/components/wiki/ApiShapeCard";
import { Button } from "@/components/ui/button";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { apiExamples, fetchWikiGroups, fetchWikiNav, getDefaultPathForGroup, popularDocs, recentDocs, tenantInfo, wikiGroups, wikiNavTree } from "@/lib/wikiData";
import { BookOpen, GitBranch, Search, Server, ShieldCheck, Zap } from "lucide-react";

export default async function HomePage() {
  const groupsResponse = await fetchWikiGroups();
  const groups = groupsResponse.data?.groups ?? wikiGroups;
  const primaryGroup = groups[0];
  const defaultPath = getDefaultPathForGroup(primaryGroup?.id);
  const nav = primaryGroup ? await fetchWikiNav(primaryGroup.id) : { data: { nodes: [] } };
  const navNodes = nav.data?.nodes ?? [];
  const quickLinks = [
    navNodes.find((node) => node.fullPath === "kakao/oauth/intro"),
    navNodes.find((node) => node.fullPath === "api-reference/wiki-nav"),
    navNodes.find((node) => node.fullPath === "kakao/oauth/console"),
  ].filter(Boolean);

  return (
    <LayoutShell>
      <main className="flex-1">
        <section className="hero-gradient relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-background/40" />
          <div className="relative container max-w-5xl py-16 px-6">
            <div className="max-w-2xl space-y-4">
              <span className="pill-ghost inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary mb-4">
                Tenant · {tenantInfo.domain}
              </span>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">API 실전 플레이북 위키</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  REST API 연동부터 OAuth 인증, 플러그인 개발까지. {tenantInfo.tagline} 핵심 API 스키마를 그대로 써서
                  테넌트/그룹/문서 구조를 검증할 수 있습니다.
                </p>
              </div>
              {defaultPath && (
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="shadow-theme-md" asChild>
                    <Link href={`/docs/${defaultPath}?groupId=${primaryGroup?.id ?? "api-guide"}`}>시작하기</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href={`/docs/${defaultPath}?groupId=${primaryGroup?.id ?? "api-guide"}`}>문서 바로가기</Link>
                  </Button>
                  <Button size="lg" variant="ghost" asChild>
                    <Link href="/auth/login">로그인/회원가입</Link>
                  </Button>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="rounded-lg border border-border/60 bg-surface-elevated p-3 shadow-theme-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Server className="h-4 w-4 text-primary" />
                    BFF 헤더 정책
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">X-Tenant + Authorization 헤더를 항상 동반</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-surface-elevated p-3 shadow-theme-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    GateType 대응
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">FREE/AFTER_AD/SUBSCRIBER 권한 흐름 반영</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-surface-elevated p-3 shadow-theme-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <GitBranch className="h-4 w-4 text-primary" />
                    Nav & TOC 동기화
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">GET /wiki/nav 결과를 그대로 사이드바에 표시</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container max-w-5xl py-10 px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Docs IA</p>
              <h2 className="text-xl font-semibold mt-1">Nav 데이터로 바로 시작</h2>
            </div>
            <span className="pill text-[11px]">/api/v1/wiki/nav</span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {quickLinks.length > 0 ? (
              quickLinks.map((item) => (
                <Link
                  key={item!.id}
                  href={`/docs/${item!.fullPath}?groupId=${primaryGroup?.id ?? "api-guide"}`}
                  className="group p-5 rounded-xl border border-border bg-card shadow-theme-sm hover:shadow-theme-md hover:border-primary/30 transition-all duration-200 text-left"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    {item?.iconKey === "play" ? <Zap className="h-5 w-5 text-primary" /> : <BookOpen className="h-5 w-5 text-primary" />}
                  </div>
                  <h3 className="font-semibold mb-2">{item?.title}</h3>
                  <p className="text-sm text-muted-foreground">{item?.fullPath}</p>
                </Link>
              ))
            ) : (
              [1, 2, 3].map((i) => (
                <div key={i} className="p-5 rounded-xl border border-border bg-card shadow-theme-sm">
                  <div className="h-10 w-10 rounded-lg bg-muted mb-3" />
                  <div className="h-4 w-24 bg-muted rounded mb-2" />
                  <div className="h-3 w-32 bg-muted rounded" />
                </div>
              ))
            )}
          </div>
        </section>

        <section className="container max-w-5xl py-6 px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">테넌트 그룹 상태</h2>
            <span className="pill text-[11px] uppercase">/api/v1/wiki/groups</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {groups.map((group) => (
              <div key={group.id} className="p-4 rounded-xl border border-border bg-card shadow-theme-sm flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{group.name}</h3>
                  {!group.isUsable && (
                    <span className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full">잠금</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">status: {group.status}</p>
                <p className="text-xs text-muted-foreground">defaultPath: {group.defaultPath}</p>
                {group.isUsable ? (
                  <Button size="sm" variant="outline" className="w-fit" asChild>
                    <Link href={`/docs/${group.defaultPath}?groupId=${group.id}`}>이동하기</Link>
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="w-fit" disabled>
                    준비 중
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="container max-w-5xl py-10 px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">핵심 API 스냅샷</p>
              <h2 className="text-xl font-semibold mt-1">README에 정의된 데이터 구조 그대로</h2>
            </div>
            <span className="pill-ghost text-[11px]">BFF friendly</span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <ApiShapeCard
              title="문서 그룹 조회"
              endpoint={apiExamples.groups.endpoint}
              description="테넌트 코드와 함께 그룹/정렬 정보를 내려주는 응답 예시"
              sample={apiExamples.groups.response}
            />
            <ApiShapeCard
              title="문서 네비게이션"
              endpoint={apiExamples.nav.endpoint}
              description="SidebarNav가 그대로 사용하는 트리 응답"
              sample={apiExamples.nav.response}
            />
            <ApiShapeCard
              title="문서 본문"
              endpoint={apiExamples.page.endpoint}
              description="gateType·visibility·permission을 포함한 페이지 조회"
              sample={apiExamples.page.response}
            />
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
                    <Link
                      href={`/docs/${doc.path}?groupId=${doc.groupId}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
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
                    <Link
                      href={`/docs/${doc.path}?groupId=${doc.groupId}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
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
