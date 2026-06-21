const appName = "ReturnReply Pro";
const { $, safeNumber, money, csvToRows, csvCell, badgeCell, renderTableInto, download, copyText, toast, bindTabs } = window.AppKit;
let requests = [];

function parseReturns(text) {
  const rows = csvToRows(text);
  const headers = rows.shift()?.map((header) => header.trim().toLowerCase()) || [];
  const get = (row, name, fallbackIndex) => row[headers.indexOf(name) >= 0 ? headers.indexOf(name) : fallbackIndex] || "";
  return rows.map((row) => ({ order: get(row, "order", 0).trim(), item: get(row, "item", 1).trim(), reason: get(row, "reason", 2).trim(), days: safeNumber(get(row, "days_since_delivery", 3)), condition: get(row, "condition", 4).trim(), value: safeNumber(get(row, "value", 5)) })).filter((row) => row.order && row.item);
}

function classify(row) {
  const windowDays = safeNumber($("#windowDays").value, 30);
  const reason = row.reason.toLowerCase();
  if (/defect|damaged|not as described|wrong/.test(reason)) return { decision: "review", path: "replacement or refund", badge: "badge warn" };
  if (row.days <= windowDays && /unworn|unused|new/i.test(row.condition)) return { decision: "approve", path: "refund or exchange", badge: "badge" };
  if (row.days <= windowDays + 15) return { decision: "save", path: "store credit", badge: "badge warn" };
  return { decision: "decline", path: "policy exception review", badge: "badge bad" };
}

function reply(row) {
  const store = $("#store").value.trim() || "our store";
  const lead = $("#lead").value.trim() || "Support";
  if (row.decision === "approve") return `Hi, thanks for sending the return request for ${row.item} (${row.order}). It is inside our return window, so we can approve a refund or exchange once the item is received in returnable condition. - ${lead}, ${store}`;
  if (row.decision === "save") return `Hi, thanks for the note on ${row.item} (${row.order}). This is slightly outside the clean auto-approval path, but we can offer store credit to keep this easy. Reply if that works and we will send the next step. - ${lead}`;
  if (row.decision === "review") return `Hi, I am sorry ${row.item} did not meet expectations. We are reviewing this as a product issue and can help with replacement, refund, or a make-good after confirming details. - ${lead}`;
  return `Hi, thanks for contacting us about ${row.item}. This request is outside the standard return policy, so we need a manual review before promising a refund. We will check the order details and reply with the best available option. - ${lead}`;
}

function generate() {
  requests = parseReturns($("#returnData").value).map((row) => ({ ...row, ...classify(row) }));
  $("#requestCount").textContent = requests.length;
  $("#autoApprove").textContent = requests.filter((request) => request.decision === "approve").length;
  $("#reviewCount").textContent = requests.filter((request) => request.decision === "review" || request.decision === "decline").length;
  $("#saveValue").textContent = money(requests.filter((request) => request.decision === "save").reduce((sum, request) => sum + request.value, 0));
  renderTableInto($("#queueOut"), ["Order", "Item", "Reason", "Days", "Value", "Decision", "Path"], requests.map((request) => [request.order, request.item, request.reason, request.days, money(request.value), badgeCell(request.decision, request.badge), request.path]));
  $("#messagesOut").value = requests.map((request) => `${request.order} / ${request.item}\n${reply(request)}`).join("\n\n");
  $("#briefOut").value = `${appName}\nStore: ${$("#store").value}\nRequests: ${requests.length}\nAuto-approved: ${requests.filter((request) => request.decision === "approve").length}\nManual review: ${requests.filter((request) => request.decision === "review" || request.decision === "decline").length}\nFast offer: $99 setup, then $49/month return reply queue.`;
  toast("Return queue generated");
}

function exportCsv() {
  const rows = [["order", "item", "reason", "days", "value", "decision", "path", "reply"], ...requests.map((request) => [request.order, request.item, request.reason, request.days, request.value, request.decision, request.path, reply(request)])];
  download("return-reply-queue.csv", rows.map((row) => row.map(csvCell).join(",")).join("\n"), "text/csv;charset=utf-8");
}

bindTabs();
$("#generateBtn").addEventListener("click", generate);
$("#exportBtn").addEventListener("click", exportCsv);
$("#copyBtn").addEventListener("click", () => copyText($("#messagesOut").value));
generate();
