import { ActionBlock } from "./ActionBlock";
import { DocPage } from "@/lib/mockData";

interface DocContentProps {
  page: DocPage;
}

export function DocContent({ page }: DocContentProps) {
  return (
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
        <div id="step-3" className="scroll-mt-20">
          <h3>Step 3. 토큰 발급</h3>
          <p>인가 코드를 사용하여 Access Token을 발급받습니다.</p>
        </div>
      </section>

      <section id="code-example" className="scroll-mt-20 mt-8">
        <h2>코드 예시</h2>
        <ActionBlock type="API Console" endpoint="POST /oauth/token" className="my-4" />
      </section>

      <section id="faq" className="scroll-mt-20 mt-8">
        <h2>FAQ</h2>
        <p>
          <strong>Q:</strong> Access Token 만료 시 어떻게 갱신하나요?
        </p>
        <p>
          <strong>A:</strong> Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.
        </p>
      </section>
    </article>
  );
}
