import { renderToStaticMarkup } from "react-dom/server";
import HomePage from "../src/app/page";

describe("HomePage", () => {
  it("렌더링 시 테넌트 이름과 CTA가 표시된다", async () => {
    const ui = await HomePage();
    const html = renderToStaticMarkup(ui as unknown as JSX.Element);

    expect(html).toContain("API 실전 플레이북 위키");
    expect(html).toContain("문서 바로가기");
  });
});
