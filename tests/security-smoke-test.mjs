import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

const reviewSparkApps = [
  "../src/app.js",
  "../projects/reviewspark-local/src/app.js"
];

const lightweightApps = [
  "../projects/monetization-command-center/src/app.js",
  "../projects/quotequick-pro/src/app.js",
  "../projects/menu-margin-lab/src/app.js",
  "../projects/invoice-nudge/src/app.js",
  "../projects/stayreply-kit/src/app.js",
  "../projects/chargeback-evidence-kit/src/app.js",
  "../projects/return-reply-pro/src/app.js",
  "../projects/alttext-cataloger/src/app.js",
  "../projects/churn-save-script/src/app.js",
  "../projects/inboxready-deliverability-audit/src/app.js",
  "../projects/ai-search-presence-monitor/src/app.js",
  "../projects/vibecode-security-smoke-test/src/app.js",
  "../projects/supportbot-qa-harness/src/app.js",
  "../projects/ai-disclosure-register-kit/src/app.js"
];

const lightweightHtmlFiles = lightweightApps.map((path) => path.replace("/src/app.js", "/src/index.html"));
const sharedRuntimePath = "../projects/shared/app-utils.js";
const sharedRuntime = read(sharedRuntimePath);
const dangerousPattern = /\.innerHTML\s*=|\.outerHTML\s*=|insertAdjacentHTML|eval\(|new Function/;

for (const path of [...reviewSparkApps, ...lightweightApps, sharedRuntimePath]) {
  const js = path === sharedRuntimePath ? sharedRuntime : read(path);
  assert.doesNotMatch(js, dangerousPattern, `${path} should avoid dangerous DOM or dynamic execution patterns`);
}

for (const path of lightweightHtmlFiles) {
  const html = read(path);
  assert.ok(html.includes("../../shared/app-utils.js"), `${path} should load shared app utilities before app.js`);
}

assert.ok(sharedRuntime.includes("textContent"), "shared runtime should render text through DOM textContent");
assert.ok(sharedRuntime.includes("copyText"), "shared runtime should report clipboard failures");
assert.ok(sharedRuntime.includes("csvCell"), "shared runtime should quote CSV exports");
assert.ok(sharedRuntime.includes("^[=+\\-@]"), "shared runtime should guard spreadsheet formula injection");
assert.ok(sharedRuntime.includes("csvToRows"), "shared runtime should parse quoted CSV rows");
assert.doesNotMatch(sharedRuntime, /split\(['"]?,['"]?\)/, "shared runtime should not split CSV on raw commas");

for (const path of [
  "../projects/monetization-command-center/src/app.js",
  "../projects/quotequick-pro/src/app.js",
  "../projects/menu-margin-lab/src/app.js",
  "../projects/invoice-nudge/src/app.js",
  "../projects/chargeback-evidence-kit/src/app.js",
  "../projects/return-reply-pro/src/app.js",
  "../projects/alttext-cataloger/src/app.js",
  "../projects/churn-save-script/src/app.js",
  "../projects/inboxready-deliverability-audit/src/app.js",
  "../projects/ai-search-presence-monitor/src/app.js",
  "../projects/vibecode-security-smoke-test/src/app.js",
  "../projects/supportbot-qa-harness/src/app.js",
  "../projects/ai-disclosure-register-kit/src/app.js"
]) {
  const js = read(path);
  assert.ok(js.includes("csvCell"), `${path} should use safe CSV cells from AppKit`);
  assert.match(js, /text\/csv;charset=utf-8/, `${path} should export CSV with a CSV MIME type`);
}

for (const path of [
  "../projects/menu-margin-lab/src/app.js",
  "../projects/invoice-nudge/src/app.js",
  "../projects/chargeback-evidence-kit/src/app.js",
  "../projects/return-reply-pro/src/app.js",
  "../projects/alttext-cataloger/src/app.js",
  "../projects/churn-save-script/src/app.js",
  "../projects/inboxready-deliverability-audit/src/app.js",
  "../projects/ai-search-presence-monitor/src/app.js",
  "../projects/vibecode-security-smoke-test/src/app.js",
  "../projects/supportbot-qa-harness/src/app.js",
  "../projects/ai-disclosure-register-kit/src/app.js"
]) {
  const js = read(path);
  assert.ok(js.includes("csvToRows"), `${path} should use quoted CSV parsing from AppKit`);
  assert.doesNotMatch(js, /split\(['"]?,['"]?\)/, `${path} should not split CSV on raw commas`);
}

for (const path of reviewSparkApps) {
  const js = read(path);
  assert.ok(js.includes("textContent"), `${path} should use textContent/DOM writes for rendered text`);
  assert.ok(js.includes("copyText"), `${path} should report clipboard failures`);
  assert.ok(js.includes("csvCell"), `${path} should quote CSV exports`);
  assert.match(js, /text\/csv;charset=utf-8/, `${path} should export CSV with a CSV MIME type`);
  assert.ok(js.includes("^[=+\\-@]"), `${path} should guard spreadsheet formula injection`);
  assert.ok(js.includes("csvToRows"), `${path} should parse quoted CSV rows`);
  assert.doesNotMatch(js, /split\(['"]?,['"]?\)/, `${path} should not split CSV on raw commas`);
}

const rootReviewSpark = read("../src/app.js");
const projectReviewSpark = read("../projects/reviewspark-local/src/app.js");
assert.equal(rootReviewSpark, projectReviewSpark, "ReviewSpark root and project copies should stay in sync");
assert.ok(rootReviewSpark.includes("createReplyItem"), "ReviewSpark should render replies with DOM nodes");
assert.ok(rootReviewSpark.includes("Local storage can be unavailable"), "ReviewSpark should tolerate localStorage failures");

console.log("Security smoke checks passed");
