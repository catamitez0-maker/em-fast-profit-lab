const appName = "VibeCode Security Smoke Test";
const { $, csvRecords, csvCell, badgeCell, renderTableInto, download, copyText, toast, bindTabs } = window.AppKit;
let findings = [];

const severityWeight = { critical: 4, high: 3, medium: 2, low: 1 };

const trim = (value) => String(value || "").trim();
const lower = (value) => trim(value).toLowerCase();

function parseFindings(text) {
  return csvRecords(text, [
    { key: "area", header: "area", index: 0, transform: trim },
    { key: "route", header: "route", index: 1, transform: trim },
    { key: "check", header: "check", index: 2, transform: trim },
    { key: "severity", header: "severity", index: 3, transform: lower },
    { key: "authRequired", header: "auth_required", index: 4, transform: lower },
    { key: "publicData", header: "public_data", index: 5, transform: trim },
    { key: "llmFeature", header: "llm_feature", index: 6, transform: lower },
    { key: "evidence", header: "evidence", index: 7, transform: trim }
  ]).filter((row) => row.area && row.check);
}

function classify(row) {
  const weight = severityWeight[row.severity] || 1;
  const gate = weight >= 4 || (weight >= 3 && row.authRequired === "no") ? "must fix" : weight >= 3 ? "fix before scale" : "monitor";
  const badge = gate === "must fix" ? "badge bad" : gate === "fix before scale" ? "badge warn" : "badge";
  const owner = row.area === "payments" ? "payment engineer" : row.area === "llm" ? "AI feature owner" : row.area === "auth" ? "app developer" : "founder or developer";
  const fix = remediation(row);
  return { ...row, weight, gate, badge, owner, fix };
}

function remediation(row) {
  if (row.area === "auth") return "Require server-side session checks and add a logged-out regression test.";
  if (row.area === "secrets") return "Move secrets to server-only environment variables and rotate exposed keys.";
  if (row.area === "payments") return "Verify webhook signatures and store idempotency keys for payment events.";
  if (row.area === "llm") return "Add prompt-injection tests, output boundaries, and sensitive-context filtering.";
  if (row.area === "storage") return "Add file type allowlists, size limits, malware review, and private storage policies.";
  return "Document expected behavior, add a regression check, and retest before launch.";
}

function generate() {
  findings = parseFindings($("#findingData").value).map(classify).sort((a, b) => b.weight - a.weight);
  const critical = findings.filter((row) => row.severity === "critical").length;
  const high = findings.filter((row) => row.severity === "high").length;
  const mustFix = findings.filter((row) => row.gate === "must fix").length;
  $("#critical").textContent = critical;
  $("#high").textContent = high;
  $("#gate").textContent = mustFix ? "Hold" : high ? "Limited" : "Pass";
  renderTableInto($("#findingsOut"), ["Area", "Route", "Severity", "Gate", "Finding", "Evidence"], findings.map((row) => [row.area, row.route, row.severity, badgeCell(row.gate, row.badge), row.check, row.evidence]));
  renderTableInto($("#gatePlanOut"), ["Priority", "Owner", "Fix", "Retest"], findings.map((row) => [badgeCell(row.severity, row.severity === "critical" ? "badge bad" : row.severity === "high" ? "badge warn" : "badge"), row.owner, row.fix, retest(row)]));
  $("#reportOut").value = report(mustFix, high);
  toast("Security gate generated");
}

function retest(row) {
  if (row.area === "llm") return "Run adversarial prompt and confirm policy or secrets are not exposed.";
  if (row.area === "payments") return "Send signed and unsigned webhook fixtures.";
  if (row.area === "auth") return "Open route in a fresh browser session and verify redirect.";
  return `Repeat ${row.route || row.area} smoke check after fix.`;
}

function report(mustFix, high) {
  return `${appName}
App: ${$("#appNameInput").value.trim() || "App"}
Stack: ${$("#stack").value.trim() || "Unknown"}
Launch date: ${$("#launchDate").value.trim() || "not provided"}
Launch gate: ${mustFix ? "HOLD" : high ? "LIMITED PASS" : "PASS"}
Findings: ${findings.length}
Must-fix before launch: ${mustFix}

Paid delivery:
- $249 launch smoke test: auth, secrets, payments, uploads, and LLM abuse checklist.
- $199/month release gate: retest risky areas before each public release.

Required fixes:
${findings.filter((row) => row.gate !== "monitor").map((row) => `- ${row.route}: ${row.fix}`).join("\n") || "- No launch blockers found in this smoke test."}`;
}

function exportCsv() {
  const rows = [["area", "route", "severity", "gate", "finding", "evidence", "owner", "fix"], ...findings.map((row) => [row.area, row.route, row.severity, row.gate, row.check, row.evidence, row.owner, row.fix])];
  download("vibecode-security-findings.csv", rows.map((row) => row.map(csvCell).join(",")).join("\n"), "text/csv;charset=utf-8");
}

bindTabs();
$("#generateBtn").addEventListener("click", generate);
$("#exportBtn").addEventListener("click", exportCsv);
$("#copyBtn").addEventListener("click", () => copyText($("#reportOut").value));
$("#sampleBtn").addEventListener("click", generate);
generate();
