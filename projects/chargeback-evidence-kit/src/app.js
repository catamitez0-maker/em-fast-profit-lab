const appName = "Chargeback Evidence Kit";
const { $, money, csvToRows, csvCell, badgeCell, renderTableInto, download, copyText, toast, bindTabs } = window.AppKit;
let evidence = [];

const requiredByReason = {
  fraudulent: ["receipt", "customer_message", "ip_match"],
  not_received: ["receipt", "shipping", "customer_message"],
  product_unacceptable: ["receipt", "refund_policy", "customer_message"],
  duplicate: ["receipt", "refund_policy"],
  subscription_cancelled: ["receipt", "refund_policy", "customer_message"]
};

function parseEvidence(text) {
  const rows = csvToRows(text);
  const headers = rows.shift()?.map((header) => header.trim().toLowerCase()) || [];
  const get = (row, name, fallbackIndex) => row[headers.indexOf(name) >= 0 ? headers.indexOf(name) : fallbackIndex] || "";
  return rows.map((row) => ({ type: get(row, "type", 0).trim(), detail: get(row, "detail", 1).trim(), date: get(row, "date", 2).trim(), available: /^(yes|true|available|y)$/i.test(get(row, "available", 3).trim()) })).filter((row) => row.type && row.detail);
}

function daysUntil(date) {
  const diff = new Date(date) - new Date();
  return Number.isFinite(diff) ? Math.max(0, Math.ceil(diff / 86400000)) : 0;
}

function generate() {
  evidence = parseEvidence($("#evidenceData").value);
  const required = requiredByReason[$("#reason").value] || [];
  const missing = required.filter((type) => !evidence.some((item) => item.type === type && item.available));
  const ready = required.length ? Math.round(((required.length - missing.length) / required.length) * 100) : 100;
  $("#evidenceCount").textContent = evidence.length;
  $("#missingCount").textContent = missing.length;
  $("#daysLeft").textContent = daysUntil($("#deadline").value);
  $("#readiness").textContent = `${ready}%`;
  renderTableInto($("#checklistOut"), ["Type", "Evidence", "Date", "Status"], evidence.map((item) => [item.type, item.detail, item.date, badgeCell(item.available ? "ready" : "missing", item.available ? "badge" : "badge warn")]));
  renderCopy(missing, ready);
  toast("Evidence pack generated");
}

function renderCopy(missing, ready) {
  const merchant = $("#merchant").value.trim() || "the merchant";
  const reason = $("#reason").value.replace(/_/g, " ");
  const amount = money($("#amount").value);
  const order = $("#orderId").value.trim() || "the order";
  const available = evidence.filter((item) => item.available).map((item) => `- ${item.type}: ${item.detail}`).join("\n");
  $("#argumentOut").value = `We are challenging the ${reason} dispute for ${order} (${amount}). The available record shows the customer completed the purchase and the merchant can document the transaction lifecycle.\n\nEvidence included:\n${available || "- No evidence marked ready yet"}\n\nMissing before submission:\n${missing.map((item) => `- ${item}`).join("\n") || "- none"}`;
  $("#customerOut").value = `Hi ${$("#customer").value || "there"}, we received a payment dispute for ${order}. We want to resolve this quickly. Could you confirm whether this was intentional, and whether a refund, replacement, or store credit would solve the issue?`;
  $("#briefOut").value = `${appName}\nMerchant: ${merchant}\nProcessor: ${$("#processor").value}\nOrder: ${order}\nAmount: ${amount}\nReadiness: ${ready}%\nNext action: collect missing evidence, combine files by evidence type, and submit before ${$("#deadline").value}.\nFast offer: $149 per evidence packet, then $299/month for weekly dispute ops.`;
}

function exportCsv() {
  const rows = [["type", "detail", "date", "available"], ...evidence.map((item) => [item.type, item.detail, item.date, item.available ? "yes" : "no"] )];
  download("chargeback-evidence.csv", rows.map((row) => row.map(csvCell).join(",")).join("\n"), "text/csv;charset=utf-8");
}

bindTabs();
$("#generateBtn").addEventListener("click", generate);
$("#exportBtn").addEventListener("click", exportCsv);
$("#copyBtn").addEventListener("click", () => copyText([$("#argumentOut").value, $("#customerOut").value, $("#briefOut").value].join("\n\n")));
generate();
