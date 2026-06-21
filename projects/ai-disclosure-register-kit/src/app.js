const appName = "AI Disclosure Register Kit";
const { $, csvToRows, csvCell, badgeCell, renderTableInto, download, copyText, toast, bindTabs } = window.AppKit;
let assetRows = [];
let queueRows = [];

function get(row, headers, name, fallbackIndex) {
  const index = headers.indexOf(name);
  return row[index >= 0 ? index : fallbackIndex] || "";
}

function parseAssets(text) {
  const rows = csvToRows(text);
  const headers = rows.shift()?.map((header) => header.trim().toLowerCase()) || [];
  return rows.map((row) => ({
    asset: get(row, headers, "asset", 0).trim(),
    campaign: get(row, headers, "campaign", 1).trim(),
    channel: get(row, headers, "channel", 2).trim(),
    assetType: get(row, headers, "asset_type", 3).trim().toLowerCase(),
    aiUsed: get(row, headers, "ai_used", 4).trim().toLowerCase(),
    humanReview: get(row, headers, "human_review", 5).trim().toLowerCase(),
    labelPresent: get(row, headers, "label_present", 6).trim().toLowerCase(),
    region: get(row, headers, "region", 7).trim(),
    riskNotes: get(row, headers, "risk_notes", 8).trim()
  })).filter((row) => row.asset && row.aiUsed);
}

function classify(row) {
  const generated = row.aiUsed === "generated";
  const needsLabel = generated || /image|video|audio/.test(row.assetType) || row.region.toLowerCase().includes("eu");
  const hasLabel = row.labelPresent === "yes";
  const reviewed = row.humanReview === "yes";
  const status = !reviewed ? "review gap" : needsLabel && !hasLabel ? "label gap" : "ready";
  const badge = status === "ready" ? "badge" : status === "review gap" ? "badge bad" : "badge warn";
  const action = status === "ready"
    ? "Keep in register and refresh monthly"
    : !reviewed
      ? "Add human review owner before publishing or republishing"
      : "Add visible disclosure label and note placement in register";
  const label = needsLabel ? $("#labelText").value.trim() || "Created or assisted with AI; reviewed by our team." : "Internal register only";
  return { ...row, generated, needsLabel, hasLabel, reviewed, status, badge, action, label };
}

function generate() {
  assetRows = parseAssets($("#assetData").value).map(classify);
  queueRows = assetRows.filter((row) => row.status !== "ready");
  const ready = assetRows.filter((row) => row.status === "ready").length;
  const readiness = assetRows.length ? Math.round((ready / assetRows.length) * 100) : 0;
  $("#readiness").textContent = `${readiness}%`;
  $("#unlabeled").textContent = assetRows.filter((row) => row.needsLabel && !row.hasLabel).length;
  $("#reviewGaps").textContent = assetRows.filter((row) => !row.reviewed).length;
  renderTableInto($("#registerOut"), ["Asset", "Channel", "AI Use", "Review", "Label", "Status", "Notes"], assetRows.map((row) => [row.asset, row.channel, row.aiUsed, row.humanReview, row.labelPresent, badgeCell(row.status, row.badge), row.riskNotes || "-"]));
  renderTableInto($("#labelsOut"), ["Priority", "Asset", "Action", "Disclosure Text", "Owner"], queueRows.map((row) => [badgeCell(row.status, row.badge), row.asset, row.action, row.label, $("#owner").value.trim() || "Marketing Ops"]));
  $("#policyOut").value = policyPack(readiness);
  toast("Disclosure register generated");
}

function policyPack(readiness) {
  const org = $("#org").value.trim() || "Organization";
  return `${appName}
Organization: ${org}
Review month: ${$("#month").value.trim() || "not provided"}
Assets reviewed: ${assetRows.length}
Readiness: ${readiness}%
Unlabeled assets: ${assetRows.filter((row) => row.needsLabel && !row.hasLabel).length}
Human-review gaps: ${assetRows.filter((row) => !row.reviewed).length}

Disclosure standard:
${$("#labelText").value.trim() || "Created or assisted with AI; reviewed by our team."}

Operating policy:
- Keep an AI-use register for generated or AI-assisted marketing, web, social, and help content.
- Assign a human reviewer before publishing customer-facing content.
- Add visible labels where the asset is generated, synthetic, materially altered, or used in higher-risk regions.
- Refresh the register monthly and before major launches.

Paid delivery:
- $199 readiness pack: inventory, label queue, disclosure copy, and owner checklist.
- $149/month refresh: update register and QA labels across new content.`;
}

function exportCsv() {
  const rows = [["asset", "campaign", "channel", "asset_type", "ai_used", "human_review", "label_present", "status", "action", "label"], ...assetRows.map((row) => [row.asset, row.campaign, row.channel, row.assetType, row.aiUsed, row.humanReview, row.labelPresent, row.status, row.action, row.label])];
  download("ai-disclosure-register.csv", rows.map((row) => row.map(csvCell).join(",")).join("\n"), "text/csv;charset=utf-8");
}

bindTabs();
$("#generateBtn").addEventListener("click", generate);
$("#exportBtn").addEventListener("click", exportCsv);
$("#copyBtn").addEventListener("click", () => copyText($("#policyOut").value));
$("#sampleBtn").addEventListener("click", generate);
generate();
