import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const html = readFileSync(new URL("../src/index.html", import.meta.url), "utf8");
const js = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

assert.ok(html.includes("Monetization Command Center"), "missing product title");
assert.ok(html.includes("../../shared/app-utils.js"), "missing shared runtime");
assert.ok(css.includes("../../shared/app-shell.css"), "missing shared CSS import");
assert.ok(js.includes("ReturnReply Pro"), "missing priority offer");
assert.ok(js.includes("InboxReady Deliverability Audit"), "missing InboxReady offer");
assert.ok(js.includes("AI Search Presence Monitor"), "missing AI Search offer");
assert.ok(js.includes("VibeCode Security Smoke Test"), "missing VibeCode offer");
assert.ok(js.includes("SupportBot QA Harness"), "missing SupportBot offer");
assert.ok(js.includes("AI Disclosure Register Kit"), "missing AI Disclosure offer");
assert.ok(js.includes("exportPlan"), "missing CSV export");
assert.ok(js.includes("copyText"), "missing outreach copy action");
assert.doesNotMatch(js, /\.innerHTML\s*=/, "should not assign innerHTML");

console.log("monetization-command-center smoke checks passed");
