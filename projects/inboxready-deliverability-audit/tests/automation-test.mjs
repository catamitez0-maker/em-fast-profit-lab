import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";

const projectRoot = new URL("../", import.meta.url);
const script = new URL("../scripts/run-automation.mjs", import.meta.url);
const generated = new URL("../automation/generated/", import.meta.url);

execFileSync("node", [script.pathname], { cwd: projectRoot, stdio: "pipe" });

for (const file of [
  "scored-leads.csv",
  "outreach-queue.csv",
  "outreach-sequences.md",
  "audit-results.csv",
  "sample-audit-report.md",
  "delivery-report.md",
  "handoff-checklist.md"
]) {
  assert.ok(existsSync(new URL(file, generated)), `missing generated ${file}`);
}

const scored = readFileSync(new URL("scored-leads.csv", generated), "utf8");
const outreach = readFileSync(new URL("outreach-sequences.md", generated), "utf8");
const report = readFileSync(new URL("delivery-report.md", generated), "utf8");

assert.ok(scored.includes("tier"), "scored leads should include tier");
assert.ok(scored.includes("Inbox Pilot Agency") || scored.includes("Outbound Sprint Co"), "scored leads should include strong fit leads");
assert.ok(outreach.includes("The first audit is $149"), "outreach should include entry price");
assert.ok(report.includes("Inbox Readiness"), "delivery report should include readiness section");
assert.ok(report.includes("Human review required"), "delivery report should include review caveat");

console.log("inboxready automation checks passed");
