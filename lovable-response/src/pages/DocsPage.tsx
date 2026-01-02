import React from 'react';
import { LayoutRoot, SidebarNav, OnPageTOC } from '@/components/layout';
import { ActionBlock } from '@/components/wiki/ActionBlock';
import { sampleDocPage } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star, Edit } from 'lucide-react';

const DocsPage = () => {
  const doc = sampleDocPage;

  return (
    <LayoutRoot>
      <div className="flex flex-1">
        <SidebarNav />
        
        <main className="flex-1 min-w-0 p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <nav className="text-sm text-muted-foreground mb-4">{doc.breadcrumb}</nav>

            {/* Header */}
            <header className="pb-4 mb-6 border-b border-border">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="pill text-xs mb-2">{doc.gateType?.toUpperCase() || 'PUBLIC'}</span>
                  <h1 className="text-2xl font-bold mt-2">{doc.title}</h1>
                  <p className="text-muted-foreground mt-1">{doc.lead}</p>
                  <p className="text-xs text-muted-foreground mt-2">업데이트: {doc.updated}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Star className="h-4 w-4" /></Button>
                  <Button size="sm"><Edit className="h-4 w-4 mr-1" /> 수정</Button>
                </div>
              </div>
            </header>

            {/* Content */}
            <article className="prose prose-sm max-w-none">
              <section id="overview" className="scroll-mt-20">
                <h2>요약</h2>
                <p>카카오 OAuth를 통해 사용자 인증을 구현하는 방법을 안내합니다.</p>
              </section>

              <section id="prerequisites" className="scroll-mt-20 mt-8">
                <h2>사전 준비</h2>
                <ul>
                  <li>카카오 개발자 계정</li>
                  <li>등록된 애플리케이션</li>
                  <li>Redirect URI 설정</li>
                </ul>
              </section>

              <section id="flow" className="scroll-mt-20 mt-8">
                <h2>연동 흐름</h2>
                <div id="step-1" className="scroll-mt-20">
                  <h3>Step 1. 앱 등록</h3>
                  <p>카카오 개발자 콘솔에서 애플리케이션을 등록합니다.</p>
                </div>
                <div id="step-2" className="scroll-mt-20">
                  <h3>Step 2. 콜백 설정</h3>
                  <p>OAuth 인증 후 리다이렉트할 Callback URL을 등록합니다.</p>
                </div>
              </section>

              <section id="code-example" className="scroll-mt-20 mt-8">
                <h2>코드 예시</h2>
                <ActionBlock type="API Console" endpoint="POST /oauth/token" className="my-4" />
              </section>

              <section id="faq" className="scroll-mt-20 mt-8">
                <h2>FAQ</h2>
                <p><strong>Q:</strong> Access Token 만료 시 어떻게 갱신하나요?</p>
                <p><strong>A:</strong> Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.</p>
              </section>
            </article>

            {/* Bottom Pager */}
            <nav className="flex justify-between mt-12 pt-6 border-t border-border">
              <Button variant="ghost" className="gap-2">
                <ChevronLeft className="h-4 w-4" /> 이전: 빠른 시작
              </Button>
              <Button variant="ghost" className="gap-2">
                다음: Google OAuth <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        </main>

        <OnPageTOC items={doc.toc} />
      </div>
    </LayoutRoot>
  );
};

export default DocsPage;
