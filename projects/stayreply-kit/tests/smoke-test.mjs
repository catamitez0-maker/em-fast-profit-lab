import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const html = readFileSync(new URL("../src/index.html", import.meta.url), "utf8");
const js = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const sharedCss = readFileSync(new URL("../../shared/app-shell.css", import.meta.url), "utf8");
const doc = readFileSync(new URL("../docs/monetization-package.md", import.meta.url), "utf8");

assert.ok(html.includes("Generate"), "missing generate action");
assert.ok(html.includes("../../shared/app-utils.js"), "missing shared app runtime");
assert.ok(css.includes("../../shared/app-shell.css"), "missing shared CSS import");
assert.ok(sharedCss.includes("@media (max-width:720px)"), "missing mobile CSS");
assert.ok(doc.includes("Price"), "missing pricing table");
assert.ok(js.includes("StayReply Kit"), "missing StayReply Kit");
assert.ok(js.includes("scenarioAdvice"), "missing scenarioAdvice");
assert.ok(js.includes("exportTxt"), "missing exportTxt");
console.log("stayreply-kit smoke checks passed");
