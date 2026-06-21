const appName = "AI Search Presence Monitor";
const { $, safeNumber, csvRecords, csvCell, badgeCell, renderTableInto, download, copyText, toast, bindTabs } = window.AppKit;
let promptRows = [];
let backlogRows = [];

const trim = (value) => String(value || "").trim();
const lower = (value) => trim(value).toLowerCase();

function parsePrompts(text) {
  return csvRecords(text, [
    { key: "prompt", header: "prompt", index: 0, transform: trim },
    { key: "engine", header: "engine", index: 1, transform: trim },
    { key: "mentioned", header: "mentioned", index: 2, transform: lower },
    { key: "position", header: "position", index: 3, transform: safeNumber },
    { key: "sentiment", header: "sentiment", index: 4, transform: lower },
    { key: "targetUrl", header: "target_url", index: 5, transform: trim },
    { key: "citedUrl", header: "cited_url", index: 6, transform: trim },
    { key: "competitor", header: "competitor", index: 7, transform: trim },
    { key: "gap", header: "gap", index: 8, transform: trim }
  ]).filter((row) => row.prompt && row.engine);
}

function classify(row) {
  const isMentioned = row.mentioned === "yes";
  const rankScore = isMentioned ? Math.max(0, 6 - row.position) : 0;
  const status = !isMentioned ? "missing" : row.position <= 3 ? "visible" : "weak";
  const priority = !isMentioned ? "high" : row.sentiment === "mixed" || row.position > 3 ? "medium" : "keep";
  const fix = !isMentioned
    ? `Create or refresh ${row.targetUrl || "target page"} for this prompt; include comparison, proof, and concise answer copy.`
    : row.position > 3
      ? `Improve ${row.targetUrl} with stronger claims, citations, and answer-ready headings.`
      : `Maintain ${row.targetUrl || row.citedUrl} and monitor competitor movement.`;
  const badge = status === "missing" ? "badge bad" : status === "weak" ? "badge warn" : "badge";
  return { ...row, isMentioned, rankScore, status, priority, fix, badge };
}

function generate() {
  promptRows = parsePrompts($("#promptData").value).map(classify);
  backlogRows = promptRows.filter((row) => row.priority !== "keep").sort((a, b) => priorityWeight(a.priority) - priorityWeight(b.priority));
  const visibility = promptRows.length ? Math.round((promptRows.filter((row) => row.isMentioned).length / promptRows.length) * 100) : 0;
  $("#visibility").textContent = `${visibility}%`;
  $("#topThree").textContent = promptRows.filter((row) => row.isMentioned && row.position <= 3).length;
  $("#missing").textContent = promptRows.filter((row) => !row.isMentioned).length;
  renderTableInto($("#presenceOut"), ["Prompt", "Engine", "Status", "Position", "Sentiment", "Competitor", "Gap"], promptRows.map((row) => [row.prompt, row.engine, badgeCell(row.status, row.badge), row.position || "-", row.sentiment || "-", row.competitor || "-", row.gap || "-"]));
  renderTableInto($("#backlogOut"), ["Priority", "Target URL", "Task", "Competitor", "Monthly Hook"], backlogRows.map((row) => [badgeCell(row.priority, row.priority === "high" ? "badge bad" : "badge warn"), row.targetUrl || "new page", row.fix, row.competitor || "-", "$299/month tracking"]));
  $("#briefOut").value = brief(visibility);
  toast("AI search monitor generated");
}

function priorityWeight(priority) {
  if (priority === "high") return 0;
  if (priority === "medium") return 1;
  return 2;
}

function brief(visibility) {
  const brand = $("#brand").value.trim() || "Brand";
  const site = $("#site").value.trim() || "site";
  return `${appName}
Brand: ${brand}
Website: ${site}
Category: ${$("#category").value.trim() || "category"}
Prompts reviewed: ${promptRows.length}
Visibility: ${visibility}%
Missing prompts: ${promptRows.filter((row) => !row.isMentioned).length}

Paid delivery:
- $199 audit: prompt matrix, competitor notes, visibility score, and content backlog.
- $299/month: repeated prompt tracking and content-fix queue.

This month's backlog:
${backlogRows.map((row) => `- ${row.prompt}: ${row.fix}`).join("\n") || "- No urgent gaps. Re-run the same prompt set next month."}`;
}

function exportCsv() {
  const rows = [["prompt", "engine", "status", "position", "sentiment", "target_url", "competitor", "priority", "fix"], ...promptRows.map((row) => [row.prompt, row.engine, row.status, row.position || "", row.sentiment, row.targetUrl, row.competitor, row.priority, row.fix])];
  download("ai-search-presence-backlog.csv", rows.map((row) => row.map(csvCell).join(",")).join("\n"), "text/csv;charset=utf-8");
}

bindTabs();
$("#generateBtn").addEventListener("click", generate);
$("#exportBtn").addEventListener("click", exportCsv);
$("#copyBtn").addEventListener("click", () => copyText($("#briefOut").value));
$("#sampleBtn").addEventListener("click", generate);
generate();
