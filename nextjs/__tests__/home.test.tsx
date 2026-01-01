import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import HomePage from "../src/app/page";

describe("HomePage", () => {
  it("렌더링 시 테넌트 이름과 CTA가 표시된다", async () => {
    const ui = await HomePage();
    render(ui as unknown as JSX.Element);

    expect(screen.getByText("API 실전 플레이북 위키")).toBeInTheDocument();
    expect(screen.getByText("문서 바로가기")).toBeInTheDocument();
  });
});
