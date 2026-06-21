import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const html = readFileSync(new URL("../src/index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const js = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
const packageDoc = readFileSync(new URL("../docs/monetization-package.md", import.meta.url), "utf8");

[
  "businessName",
  "reviewText",
  "analyzeBtn",
  "replyList",
  "exportBtn",
  "campaignView",
  "briefOutput"
].forEach((id) => {
  assert.match(html, new RegExp(`id=\\"${id}\\"`));
});

[
  "parseCsv",
  "generateReply",
  "exportCsv",
  "renderCampaign",
  "ReviewSpark"
].forEach((token) => {
  assert.ok(js.includes(token), `missing ${token}`);
});

assert.ok(css.includes("@media (max-width: 760px)"), "missing mobile breakpoint");
assert.ok(packageDoc.includes("$149"), "missing quick monetization price");

console.log("Smoke checks passed");
