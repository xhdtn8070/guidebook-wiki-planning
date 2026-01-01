import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Star, Edit, Shield, Eye } from "lucide-react";
import { LayoutRoot, SidebarNav, OnPageTOC } from "@/components/layout";
import { ActionBlock } from "@/components/wiki/ActionBlock";
import { Button } from "@/components/ui/button";
import {
  fetchWikiGroups,
  fetchWikiNav,
  fetchWikiPage,
  getDefaultPathForGroup,
  getPagerForPath,
  tenantInfo,
  wikiGroups,
  wikiNavTree,
} from "@/lib/wikiData";

const DocsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const slugFromPath = location.pathname.replace(/^\/docs\/?/, "");

  const groupsQuery = useQuery({
    queryKey: ["wiki-groups"],
    queryFn: fetchWikiGroups,
    initialData: { success: true, data: { groups: wikiGroups, tenantCode: tenantInfo.code }, error: null },
  });
  const groups = groupsQuery.data?.data?.groups ?? [];
  const initialGroupId = searchParams.get("groupId") ?? groups[0]?.id;

  const effectiveSlug = slugFromPath || getDefaultPathForGroup(initialGroupId) || "";

  useEffect(() => {
    if (!slugFromPath && effectiveSlug && initialGroupId) {
      navigate(`/docs/${effectiveSlug}?groupId=${initialGroupId}`, { replace: true });
    }
  }, [slugFromPath, effectiveSlug, initialGroupId, navigate]);

  const navQuery = useQuery({
    queryKey: ["wiki-nav", initialGroupId],
    queryFn: () => fetchWikiNav(initialGroupId as string),
    enabled: Boolean(initialGroupId),
    initialData: initialGroupId
      ? { success: true, data: { groupId: initialGroupId, nodes: wikiNavTree[initialGroupId] ?? [] }, error: null }
      : undefined,
  });

  const navNodes = navQuery.data?.data?.nodes ?? [];

  const pageQuery = useQuery({
    queryKey: ["wiki-page", initialGroupId, effectiveSlug],
    queryFn: () => fetchWikiPage(initialGroupId as string, effectiveSlug),
    enabled: Boolean(initialGroupId && effectiveSlug),
  });

  const page = pageQuery.data?.data;
  const pageError = pageQuery.data?.error;

  const pager = useMemo(() => getPagerForPath(navNodes, effectiveSlug), [navNodes, effectiveSlug]);

  if (pageQuery.isLoading || pageQuery.isFetching) {
    return (
      <LayoutRoot>
        <div className="flex flex-1">
          <SidebarNav groupId={initialGroupId ?? "api-guide"} nodes={navNodes} currentPath={effectiveSlug} />
          <main className="flex-1 min-w-0 p-6 lg:p-8 flex items-center justify-center text-muted-foreground">
            문서를 불러오는 중입니다...
          </main>
        </div>
      </LayoutRoot>
    );
  }

  if (pageError) {
    return (
      <LayoutRoot>
        <div className="flex flex-1">
          <SidebarNav groupId={initialGroupId ?? "api-guide"} nodes={navNodes} currentPath={effectiveSlug} />
          <main className="flex-1 min-w-0 p-6 lg:p-8 flex items-center justify-center">
            <div className="p-6 rounded-xl border border-border bg-card shadow-theme-sm max-w-md text-center space-y-3">
              <h2 className="text-lg font-semibold">문서를 찾을 수 없습니다</h2>
              <p className="text-sm text-muted-foreground">{pageError.message}</p>
              <Button variant="outline" onClick={() => navigate("/")}>홈으로 돌아가기</Button>
            </div>
          </main>
        </div>
      </LayoutRoot>
    );
  }

  if (!page) {
    return (
      <LayoutRoot>
        <div className="flex flex-1">
          <SidebarNav groupId={initialGroupId ?? "api-guide"} nodes={navNodes} currentPath={effectiveSlug} />
          <main className="flex-1 min-w-0 p-6 lg:p-8 flex items-center justify-center text-muted-foreground">
            문서를 불러오는 중입니다...
          </main>
        </div>
      </LayoutRoot>
    );
  }

  return (
    <LayoutRoot>
      <div className="flex flex-1">
        <SidebarNav
          groupId={page.groupId}
          nodes={navNodes}
          currentPath={page.fullPath}
          onNavigate={(fullPath) => navigate(`/docs/${fullPath}?groupId=${page.groupId}`)}
        />

        <main className="flex-1 min-w-0 p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <nav className="text-sm text-muted-foreground mb-4">{page.breadcrumb.join(" / ")}</nav>

            {/* Header */}
            <header className="pb-4 mb-6 border-b border-border">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="pill text-xs">{page.gateType}</span>
                    <span className="pill text-xs bg-muted text-muted-foreground">{page.visibility}</span>
                  </div>
                  <h1 className="text-2xl font-bold mt-1">{page.title}</h1>
                  <p className="text-muted-foreground">{page.summary}</p>
                  <p className="text-xs text-muted-foreground">
                    업데이트: {new Date(page.updatedAt).toLocaleDateString()} · {page.updatedBy.displayName}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button size="sm">
                    <Edit className="h-4 w-4 mr-1" /> 수정
                  </Button>
                </div>
              </div>
            </header>

            {/* Content */}
            <article className="prose prose-sm max-w-none">
              <section id="overview" className="scroll-mt-20">
                <h2>요약</h2>
                <p>{page.summary}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Shield className="h-3 w-3" /> GateType: {page.gateType}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3 w-3" /> Visibility: {page.visibility}
                  </span>
                </div>
              </section>

              <section id="prerequisites" className="scroll-mt-20 mt-8">
                <h2>MDX 본문 스냅샷</h2>
                <pre className="code-block whitespace-pre-wrap">{page.contentMdx}</pre>
              </section>

              <section id="flow" className="scroll-mt-20 mt-8">
                <h2>연동 흐름</h2>
                <p className="text-muted-foreground">
                  페이지 데이터에 포함된 <code>fullPath</code>와 <code>gateType</code>을 기준으로 API 호출 순서를 따라갑니다.
                </p>
                <div id="step-1" className="scroll-mt-20 mt-4">
                  <h3>Step 1. 앱 등록</h3>
                  <p>카카오 개발자 콘솔에서 앱을 만들고 client id를 발급합니다.</p>
                </div>
                <div id="step-2" className="scroll-mt-20 mt-3">
                  <h3>Step 2. 콜백 설정</h3>
                  <p>Next.js BFF 경로를 Redirect URI로 등록하고, <code>X-Tenant</code> 헤더를 검증합니다.</p>
                </div>
                <div id="step-3" className="scroll-mt-20 mt-3">
                  <h3>Step 3. 토큰 발급</h3>
                  <p>권한 체크 후 <code>/api/v1/wiki/pages</code> 응답을 렌더링하며 ActionBlock으로 테스트합니다.</p>
                </div>
              </section>

              {page.actionBlock && (
                <section id="code-example" className="scroll-mt-20 mt-8">
                  <h2>액션 블록</h2>
                  <ActionBlock
                    type={page.actionBlock.type}
                    endpoint={page.actionBlock.endpoint}
                    initialUrl={page.actionBlock.sampleUrl}
                    authOptions={page.actionBlock.authOptions}
                    className="my-4"
                  />
                </section>
              )}

              <section id="faq" className="scroll-mt-20 mt-8">
                <h2>권한/응답 포맷</h2>
                <p>
                  README의 공통 응답 포맷({`{ success, data, error }`})을 그대로 UI에 매핑했습니다. 권한이 부족하면
                  <code>permission.canView</code> 플래그로 분기해 광고/구독/로그인 유도를 표시할 수 있습니다.
                </p>
              </section>
            </article>

            {/* Bottom Pager */}
            <nav className="flex justify-between mt-12 pt-6 border-t border-border">
              <Button
                variant="ghost"
                className="gap-2"
                disabled={!pager.prev}
                onClick={() =>
                  pager.prev && navigate(`/docs/${pager.prev.fullPath}?groupId=${page.groupId}`)
                }
              >
                <ChevronLeft className="h-4 w-4" /> 이전: {pager.prev?.title ?? "없음"}
              </Button>
              <Button
                variant="ghost"
                className="gap-2"
                disabled={!pager.next}
                onClick={() =>
                  pager.next && navigate(`/docs/${pager.next.fullPath}?groupId=${page.groupId}`)
                }
              >
                다음: {pager.next?.title ?? "없음"} <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        </main>

        <OnPageTOC items={page.toc} />
      </div>
    </LayoutRoot>
  );
};

export default DocsPage;
