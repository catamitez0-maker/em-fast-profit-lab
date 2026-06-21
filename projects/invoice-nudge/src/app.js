const appName = "InvoiceNudge";
const { $, safeNumber, money, csvToRows, csvCell, badgeCell, renderTableInto, download, copyText, toast, bindTabs } = window.AppKit;
let invoices = [];

function parseCsv(text) {
  const rawRows = csvToRows(text);
  if (!rawRows.length) return [];
  const headers = rawRows[0].map((header) => header.trim().toLowerCase());
  const hasHeader = ["client", "invoice", "due_date", "amount"].some((header) => headers.includes(header));
  const dataRows = hasHeader ? rawRows.slice(1) : rawRows;
  const get = (row, name, fallbackIndex) => row[headers.indexOf(name) >= 0 ? headers.indexOf(name) : fallbackIndex] || "";
  return dataRows.map((row) => ({ client: get(row, "client", 0).trim() || "Unnamed client", invoice: get(row, "invoice", 1).trim() || "Unnumbered invoice", due: get(row, "due_date", 2).trim(), amount: safeNumber(get(row, "amount", 3)), status: get(row, "status", 4).trim() || "unpaid" })).filter((invoice) => invoice.amount > 0).filter((invoice) => !/^(paid|closed|void|cancelled)$/i.test(invoice.status));
}

function daysLate(due) {
  const today = new Date($("#today").value);
  const dueDate = new Date(due);
  if (Number.isNaN(today.getTime()) || Number.isNaN(dueDate.getTime())) return 0;
  return Math.max(0, Math.floor((today - dueDate) / 86400000));
}

function stage(days) {
  if (days >= 30) return "firm";
  if (days >= 14) return "priority";
  if (days >= 1) return "friendly";
  return "not due";
}

function generate() {
  invoices = parseCsv($("#invoiceData").value).map((invoice) => {
    const days = daysLate(invoice.due);
    return { ...invoice, days, stage: stage(days) };
  });
  render();
  toast("Reminder queue generated");
}

function reminder(invoice) {
  const business = $("#business").value.trim() || "the business";
  const sender = $("#sender").value.trim() || "the team";
  if (invoice.days === 0) return `Hi ${invoice.client}, friendly note that ${invoice.invoice} for ${money(invoice.amount)} is due on ${invoice.due || "the agreed date"}. Thank you, ${sender} at ${business}.`;
  if (invoice.stage === "friendly") return `Hi ${invoice.client}, I hope you are well. I am checking on ${invoice.invoice} for ${money(invoice.amount)}, which appears ${invoice.days} days past due. Could you confirm the payment timing when you have a moment? Thank you, ${sender}`;
  if (invoice.stage === "priority") return `Hi ${invoice.client}, following up on ${invoice.invoice} for ${money(invoice.amount)}, now ${invoice.days} days past due. Could you please confirm whether payment has been scheduled or if anything is needed from us? Thank you, ${sender}`;
  return `Hi ${invoice.client}, ${invoice.invoice} for ${money(invoice.amount)} is now ${invoice.days} days past due. Please reply with payment status or a scheduled payment date today so we can keep the account current. Thank you, ${sender}`;
}

function render() {
  const overdue = invoices.filter((invoice) => invoice.days > 0);
  const total = overdue.reduce((sum, invoice) => sum + invoice.amount, 0);
  $("#openCount").textContent = invoices.length;
  $("#overdueTotal").textContent = money(total);
  $("#urgentCount").textContent = invoices.filter((invoice) => invoice.days >= 14).length;
  $("#avgDays").textContent = overdue.length ? Math.round(overdue.reduce((sum, invoice) => sum + invoice.days, 0) / overdue.length) : 0;
  renderTableInto($("#queueOut"), ["Client", "Invoice", "Amount", "Due", "Days Late", "Stage"], invoices.map((invoice) => [invoice.client, invoice.invoice, money(invoice.amount), invoice.due || "missing", invoice.days, badgeCell(invoice.stage, invoice.days >= 14 ? "badge bad" : invoice.days > 0 ? "badge warn" : "badge")]));
  $("#messagesOut").value = invoices.map((invoice) => `${invoice.client} / ${invoice.invoice}\n${reminder(invoice)}`).join("\n\n");
  $("#briefOut").value = `${appName}\nBusiness: ${$("#business").value}\nOpen invoices: ${invoices.length}\nOverdue total: ${money(total)}\nPriority follow-ups: ${invoices.filter((invoice) => invoice.days >= 14).length}\nFast offer: $49/month to prepare weekly reminder queue and copy.`;
}

function exportCsv() {
  const output = [["client", "invoice", "amount", "due_date", "days_late", "stage", "reminder"], ...invoices.map((invoice) => [invoice.client, invoice.invoice, invoice.amount, invoice.due, invoice.days, invoice.stage, reminder(invoice)])];
  download("invoice-nudge-queue.csv", output.map((row) => row.map(csvCell).join(",")).join("\n"), "text/csv;charset=utf-8");
}

bindTabs();
$("#generateBtn").addEventListener("click", generate);
$("#exportBtn").addEventListener("click", exportCsv);
$("#copyBtn").addEventListener("click", () => copyText($("#messagesOut").value));
$("#sampleBtn").addEventListener("click", () => {
  $("#invoiceData").value = "client,invoice,due_date,amount,status\nDelta Design,INV-221,2026-05-15,3200,unpaid\nOak Dental,INV-224,2026-06-18,780,unpaid\nMetro Build,INV-198,2026-04-30,9100,unpaid";
  generate();
});
generate();
