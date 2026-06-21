const appName = "ChurnSave Script";
const { $, safeNumber, money, csvToRows, csvCell, badgeCell, renderTableInto, download, copyText, toast, bindTabs } = window.AppKit;
let scenarios = [];

function parseScenarios(text) {
  const rows = csvToRows(text);
  const headers = rows.shift()?.map((header) => header.trim().toLowerCase()) || [];
  const get = (row, name, fallbackIndex) => row[headers.indexOf(name) >= 0 ? headers.indexOf(name) : fallbackIndex] || "";
  return rows.map((row) => ({ customer: get(row, "customer", 0).trim(), plan: get(row, "plan", 1).trim(), mrr: safeNumber(get(row, "mrr", 2)), tenure: safeNumber(get(row, "tenure_months", 3)), reason: get(row, "reason", 4).trim(), usage: get(row, "usage", 5).trim().toLowerCase(), lastLogin: safeNumber(get(row, "last_login_days", 6)) })).filter((row) => row.customer);
}

function score(row) {
  let risk = 40;
  if (row.usage === "low") risk += 35;
  if (row.lastLogin > 30) risk += 20;
  if (/too expensive|price|cost/.test(row.reason)) risk += 10;
  if (row.tenure > 12 && row.usage !== "low") risk -= 15;
  return Math.max(0, Math.min(100, risk));
}

function offer(row) {
  const discount = Math.min(50, safeNumber($("#discount").value, 25));
  if (/too expensive|price|cost/.test(row.reason)) return `${discount}% discount for 2 billing cycles or annual downgrade option`;
  if (/missing feature|competitor/.test(row.reason)) return "15-minute product fit call plus roadmap/workaround note";
  if (/not using|low/.test(row.reason) || row.usage === "low") return "30-day pause, onboarding reset, and usage checklist";
  return "low-friction cancellation plus feedback capture";
}

function script(row) {
  const product = $("#product").value || "the product";
  const rep = $("#rep").value || "Support";
  const cancelLine = $("#policy").value === "strict-compliance" ? "If you still want to cancel, I can process that now." : "If this does not help, I will still make cancellation simple.";
  return `${row.customer} (${row.plan}, ${money(row.mrr)}/mo)\nReason: ${row.reason}\nOffer: ${row.offer}\nScript: Hi ${row.customer}, I can help with that. Before I close the account, the best fit based on your reason is: ${row.offer}. ${cancelLine}\nConfirmation: Your ${product} subscription is canceled effective {{date}}. You will keep access through {{access_end}}. - ${rep}`;
}

function generate() {
  scenarios = parseScenarios($("#scenarioData").value).map((row) => ({ ...row, risk: score(row), offer: offer(row) }));
  const saveable = scenarios.filter((row) => row.risk < 80).length;
  const arr = scenarios.reduce((sum, row) => sum + row.mrr * 12, 0);
  const avg = scenarios.length ? Math.round(scenarios.reduce((sum, row) => sum + row.risk, 0) / scenarios.length) : 0;
  $("#scenarioCount").textContent = scenarios.length;
  $("#saveableCount").textContent = saveable;
  $("#arrAtRisk").textContent = money(arr);
  $("#avgRisk").textContent = avg;
  renderTableInto($("#queueOut"), ["Customer", "Plan", "Reason", "Risk", "Offer"], scenarios.map((row) => [row.customer, row.plan, row.reason, badgeCell(String(row.risk), row.risk >= 80 ? "badge bad" : row.risk >= 60 ? "badge warn" : "badge"), row.offer]));
  $("#scriptsOut").value = scenarios.map(script).join("\n\n");
  $("#briefOut").value = `${appName}\nProduct: ${$("#product").value}\nScenarios: ${scenarios.length}\nSaveable: ${saveable}\nARR at risk: ${money(arr)}\nAverage risk: ${avg}\nFast offer: $149 to build the top cancellation-save scripts and confirmation copy.`;
  toast("Save scripts generated");
}

function exportCsv() {
  const rows = [["customer", "plan", "mrr", "reason", "risk", "offer", "script"], ...scenarios.map((row) => [row.customer, row.plan, row.mrr, row.reason, row.risk, row.offer, script(row)])];
  download("churn-save-scripts.csv", rows.map((row) => row.map(csvCell).join(",")).join("\n"), "text/csv;charset=utf-8");
}

bindTabs();
$("#generateBtn").addEventListener("click", generate);
$("#exportBtn").addEventListener("click", exportCsv);
$("#copyBtn").addEventListener("click", () => copyText($("#scriptsOut").value));
generate();
