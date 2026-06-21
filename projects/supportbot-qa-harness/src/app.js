const appName = "SupportBot QA Harness";
const { $, csvRecords, csvCell, badgeCell, renderTableInto, download, copyText, toast, bindTabs } = window.AppKit;
let scenarioRows = [];
let issueRows = [];

const trim = (value) => String(value || "").trim();
const lower = (value) => trim(value).toLowerCase();

function parseList(value) {
  return String(value || "").split(";").map((item) => item.trim().toLowerCase()).filter(Boolean);
}

function parseScenarios(text) {
  return csvRecords(text, [
    { key: "scenario", header: "scenario", index: 0, transform: trim },
    { key: "question", header: "question", index: 1, transform: trim },
    { key: "expectedPolicy", header: "expected_policy", index: 2, transform: trim },
    { key: "botAnswer", header: "bot_answer", index: 3, transform: trim },
    { key: "requiredKeywords", header: "required_keywords", index: 4, transform: parseList },
    { key: "forbiddenPhrases", header: "forbidden_phrases", index: 5, transform: parseList },
    { key: "priority", header: "priority", index: 6, transform: lower }
  ]).filter((row) => row.scenario && row.question);
}

function grade(row) {
  const answer = row.botAnswer.toLowerCase();
  const missing = row.requiredKeywords.filter((keyword) => !answer.includes(keyword));
  const forbidden = row.forbiddenPhrases.filter((phrase) => answer.includes(phrase));
  const passed = missing.length === 0 && forbidden.length === 0;
  const status = passed ? "pass" : row.priority === "high" ? "critical" : "fail";
  const badge = status === "pass" ? "badge" : status === "critical" ? "badge bad" : "badge warn";
  const issue = passed ? "Matches expected policy" : [...missing.map((item) => `missing "${item}"`), ...forbidden.map((item) => `forbidden "${item}"`)].join("; ");
  const fix = passed ? "Keep in regression suite" : `Update bot answer or knowledge source for ${row.scenario}; expected policy: ${row.expectedPolicy}`;
  return { ...row, missing, forbidden, passed, status, badge, issue, fix };
}

function generate() {
  scenarioRows = parseScenarios($("#scenarioData").value).map(grade);
  issueRows = scenarioRows.filter((row) => !row.passed);
  const passRate = scenarioRows.length ? Math.round((scenarioRows.filter((row) => row.passed).length / scenarioRows.length) * 100) : 0;
  $("#passRate").textContent = `${passRate}%`;
  $("#failures").textContent = issueRows.length;
  $("#critical").textContent = issueRows.filter((row) => row.status === "critical").length;
  renderTableInto($("#resultsOut"), ["Scenario", "Priority", "Status", "Issue", "Question"], scenarioRows.map((row) => [row.scenario, row.priority, badgeCell(row.status, row.badge), row.issue, row.question]));
  renderTableInto($("#gapsOut"), ["Severity", "Knowledge Gap", "Fix", "Regression Prompt"], issueRows.map((row) => [badgeCell(row.status, row.badge), row.issue, row.fix, row.question]));
  $("#reportOut").value = report(passRate);
  toast("Support bot QA generated");
}

function report(passRate) {
  return `${appName}
Client: ${$("#client").value.trim() || "Client"}
Bot: ${$("#bot").value.trim() || "Support bot"}
Policy version: ${$("#policy").value.trim() || "not provided"}
Scenarios tested: ${scenarioRows.length}
Pass rate: ${passRate}%
Failures: ${issueRows.length}
Critical gaps: ${issueRows.filter((row) => row.status === "critical").length}

Paid delivery:
- $299 QA pack: 50 support scenarios, pass/fail grading, and fix queue.
- $399/month regression: rerun priority scenarios after bot or policy changes.

Fix queue:
${issueRows.map((row) => `- ${row.scenario}: ${row.fix}`).join("\n") || "- No failures in this scenario set."}`;
}

function exportCsv() {
  const rows = [["scenario", "priority", "status", "issue", "fix", "question", "bot_answer"], ...scenarioRows.map((row) => [row.scenario, row.priority, row.status, row.issue, row.fix, row.question, row.botAnswer])];
  download("supportbot-qa-results.csv", rows.map((row) => row.map(csvCell).join(",")).join("\n"), "text/csv;charset=utf-8");
}

bindTabs();
$("#generateBtn").addEventListener("click", generate);
$("#exportBtn").addEventListener("click", exportCsv);
$("#copyBtn").addEventListener("click", () => copyText($("#reportOut").value));
$("#sampleBtn").addEventListener("click", generate);
generate();
