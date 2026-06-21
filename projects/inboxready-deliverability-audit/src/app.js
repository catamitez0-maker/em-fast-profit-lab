const appName = "InboxReady Deliverability Audit";
const { $, safeNumber, csvRecords, csvCell, badgeCell, renderTableInto, download, copyText, toast, bindTabs } = window.AppKit;
let auditRows = [];

const trim = (value) => String(value || "").trim();
const lower = (value) => trim(value).toLowerCase();

function parseCampaigns(text) {
  return csvRecords(text, [
    { key: "campaign", header: "campaign", index: 0, transform: trim },
    { key: "fromDomain", header: "from_domain", index: 1, transform: trim },
    { key: "platform", header: "platform", index: 2, transform: trim },
    { key: "volume", header: "volume", index: 3, transform: safeNumber },
    { key: "bounceRate", header: "bounce_rate", index: 4, transform: safeNumber },
    { key: "spamRate", header: "spam_rate", index: 5, transform: safeNumber },
    { key: "authentication", header: "authentication", index: 6, transform: lower },
    { key: "dmarc", header: "dmarc", index: 7, transform: lower },
    { key: "unsubscribe", header: "unsubscribe", index: 8, transform: lower },
    { key: "domainAgeDays", header: "domain_age_days", index: 9, transform: safeNumber },
    { key: "subject", header: "subject", index: 10, transform: trim }
  ]).filter((row) => row.campaign && row.fromDomain);
}

function classify(row) {
  const issues = [];
  let risk = 0;
  if (!row.authentication.includes("spf") || !row.authentication.includes("dkim")) {
    risk += 28;
    issues.push("Add aligned SPF and DKIM");
  }
  if (!row.dmarc.includes("quarantine") && !row.dmarc.includes("reject")) {
    risk += 24;
    issues.push("Move DMARC toward quarantine or reject");
  }
  if (!row.unsubscribe.includes("one-click")) {
    risk += 18;
    issues.push("Add one-click unsubscribe");
  }
  if (row.bounceRate > 2) {
    risk += 14;
    issues.push("Clean list before next send");
  }
  if (row.spamRate > 0.1) {
    risk += 14;
    issues.push("Reduce complaint-prone segments");
  }
  if (row.domainAgeDays < 90 && row.volume > 500) {
    risk += 10;
    issues.push("Warm newer sender domain gradually");
  }
  const status = risk >= 50 ? "blocker" : risk >= 24 ? "monitor" : "ready";
  const badge = status === "blocker" ? "badge bad" : status === "monitor" ? "badge warn" : "badge";
  return { ...row, risk, status, badge, fixes: issues.length ? issues.join("; ") : "Keep current controls and monitor trend" };
}

function readinessScore(rows) {
  if (!rows.length) return 0;
  const averageRisk = rows.reduce((sum, row) => sum + row.risk, 0) / rows.length;
  return Math.max(0, Math.round(100 - averageRisk));
}

function generate() {
  auditRows = parseCampaigns($("#campaignData").value).map(classify);
  const score = readinessScore(auditRows);
  $("#score").textContent = score;
  $("#blockers").textContent = auditRows.filter((row) => row.status === "blocker").length;
  $("#monitors").textContent = auditRows.filter((row) => row.status === "monitor").length;
  renderTableInto($("#auditOut"), ["Campaign", "Platform", "Volume", "Bounce", "Spam", "Status", "Fix"], auditRows.map((row) => [row.campaign, row.platform, row.volume, `${row.bounceRate}%`, `${row.spamRate}%`, badgeCell(row.status, row.badge), row.fixes]));
  renderTableInto($("#fixesOut"), ["Priority", "Action", "Owner", "Revenue Hook"], fixPlan(score).map((row) => [badgeCell(row.priority, row.className), row.action, row.owner, row.hook]));
  $("#briefOut").value = clientBrief(score);
  toast("Deliverability audit generated");
}

function fixPlan(score) {
  const rows = [];
  const blockers = auditRows.filter((row) => row.status === "blocker");
  const monitors = auditRows.filter((row) => row.status === "monitor");
  blockers.forEach((row) => rows.push({ priority: "blocker", className: "badge bad", action: `${row.campaign}: ${row.fixes}`, owner: "Client DNS or email admin", hook: "Fix before the next high-volume send" }));
  monitors.forEach((row) => rows.push({ priority: "watch", className: "badge warn", action: `${row.campaign}: ${row.fixes}`, owner: "Marketing ops", hook: "Review during monthly monitor" }));
  if (score >= 80) rows.push({ priority: "ready", className: "badge", action: "Set a monthly baseline for bounces, complaints, authentication, and unsubscribe checks.", owner: $("#lead").value || "EM Lab", hook: "$99/month monitoring" });
  return rows;
}

function clientBrief(score) {
  const client = $("#client").value.trim() || "Client";
  const domain = $("#domain").value.trim() || "primary sending domain";
  const blockers = auditRows.filter((row) => row.status === "blocker");
  return `${appName}
Client: ${client}
Domain: ${domain}
Inbox readiness score: ${score}/100
Campaigns reviewed: ${auditRows.length}
Blockers: ${blockers.length}

Recommended paid delivery:
- $149 one-time audit: verify SPF, DKIM, DMARC posture, unsubscribe readiness, bounce and complaint risks.
- $99/month monitor: review sending metrics before launches and keep a fix backlog.

Top next actions:
${fixPlan(score).map((row) => `- ${row.action}`).join("\n") || "- Keep current controls and monitor monthly."}

Sales note: the buyer understands this quickly because poor deliverability turns directly into lost email revenue.`;
}

function exportCsv() {
  const rows = [["campaign", "from_domain", "platform", "volume", "bounce_rate", "spam_rate", "status", "risk", "fixes"], ...auditRows.map((row) => [row.campaign, row.fromDomain, row.platform, row.volume, row.bounceRate, row.spamRate, row.status, row.risk, row.fixes])];
  download("inboxready-deliverability-audit.csv", rows.map((row) => row.map(csvCell).join(",")).join("\n"), "text/csv;charset=utf-8");
}

bindTabs();
$("#generateBtn").addEventListener("click", generate);
$("#exportBtn").addEventListener("click", exportCsv);
$("#copyBtn").addEventListener("click", () => copyText($("#briefOut").value));
$("#sampleBtn").addEventListener("click", generate);
generate();
