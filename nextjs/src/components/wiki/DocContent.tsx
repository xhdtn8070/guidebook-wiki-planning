import { WikiDocPage } from "@/lib/wikiData";
import { ActionBlock } from "./ActionBlock";

interface DocContentProps {
  page: WikiDocPage;
}

export function DocContent({ page }: DocContentProps) {
  return (
    <article className="prose prose-sm max-w-none">
      <section id="overview" className="scroll-mt-20">
        <h2>요약</h2>
        <p>{page.summary}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">GateType: {page.gateType}</span>
          <span className="inline-flex items-center gap-1">Visibility: {page.visibility}</span>
        </div>
      </section>

      <section id="prerequisites" className="scroll-mt-20 mt-8">
        <h2>MDX 본문 스냅샷</h2>
        <pre className="code-block whitespace-pre-wrap">{page.contentMdx}</pre>
      </section>

      <section id="flow" className="scroll-mt-20 mt-8">
        <h2>연동 흐름</h2>
        <p className="text-muted-foreground">
          페이지 데이터의 <code>fullPath</code>와 <code>gateType</code>을 기준으로 BFF 호출 순서를 설계했습니다.
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
          README의 공통 응답 포맷(<code>&#123; success, data, error &#125;</code>)을 그대로 UI에 매핑했습니다.{" "}
          <code>permission.canView</code> 플래그로 광고/구독/로그인 유도를 표현할 수 있습니다.
        </p>
      </section>
    </article>
  );
}
