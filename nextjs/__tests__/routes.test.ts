import assert from "assert";
import { buildPageHref, parseBackendPageUrl, toFrontendHref } from "../src/shared/lib/routes";

const parsed = parseBackendPageUrl("/t/12/g/8/p/144");
assert.deepStrictEqual(parsed, {
  tenantId: 12,
  guidebookId: 8,
  pageId: 144,
});

assert.strictEqual(buildPageHref({ guidebookId: 8, pageId: 144, tenantId: 12 }), "/guidebooks/8/pages/144?tenantId=12");
assert.strictEqual(toFrontendHref("/t/12/g/8/p/144"), "/guidebooks/8/pages/144?tenantId=12");

console.log("routes.test 통과");
