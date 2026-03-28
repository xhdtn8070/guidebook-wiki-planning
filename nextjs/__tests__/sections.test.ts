import assert from "assert";
import { extractTableOfContents, summarizeSections } from "../src/shared/lib/sections";

const sections = [
  { type: "HEADING", level: 1, text: "개요", id: "overview" },
  { type: "MARKDOWN", content: "첫 번째 문단입니다." },
  {
    type: "TABS",
    items: [
      {
        key: "api",
        label: "API",
        content: [{ type: "MARKDOWN", content: "API 예제" }],
      },
    ],
  },
] as const;

const toc = extractTableOfContents(sections as never);
assert.deepStrictEqual(toc, [{ id: "overview", label: "개요", level: 1 }]);
assert.ok(summarizeSections(sections as never).includes("API 예제"));

console.log("sections.test 통과");
