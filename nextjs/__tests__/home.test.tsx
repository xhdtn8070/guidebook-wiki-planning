import assert from "assert";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import HomePage from "../src/app/page";

(async () => {
  const ui = await HomePage();
  const html = renderToStaticMarkup(ui as unknown as ReactElement);

  assert.ok(html.includes("API 실전 플레이북 위키"), "테넌트 이름이 렌더링되어야 합니다.");
  assert.ok(html.includes("문서 바로가기"), "CTA 버튼 문구가 렌더링되어야 합니다.");

  // 노드 테스트 러너와 호환 가능한 간단한 로그 출력
  console.log("HomePage 테스트 통과");
})();
