import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const html = readFileSync(new URL("../src/index.html", import.meta.url), "utf8");
const js = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const doc = readFileSync(new URL("../docs/monetization-package.md", import.meta.url), "utf8");

assert.ok(html.includes("Generate Register"), "missing generate action");
assert.ok(html.includes("../../shared/app-utils.js"), "missing shared runtime");
assert.ok(css.includes("../../shared/app-shell.css"), "missing shared CSS");
assert.ok(doc.includes("Price"), "missing pricing table");
assert.ok(js.includes("AI Disclosure Register Kit"), "missing app name");
assert.ok(js.includes("csvRecords"), "missing shared CSV record parser");
assert.ok(js.includes("exportCsv"), "missing CSV export");
console.log("ai-disclosure-register-kit smoke checks passed");
