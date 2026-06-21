const appName = "QuoteQuick Pro";
const { $, safeNumber, money, el, tableNode, csvCell, download, copyText, toast, bindTabs } = window.AppKit;
let pack = {};

function val(selector) {
  return $(selector).value.trim();
}

function num(selector) {
  return safeNumber($(selector).value);
}

function detectFlags(text) {
  const lower = text.toLowerCase();
  const flags = [];
  if (/emergency|leak|no heat|no ac|warm air|sparking|flood/.test(lower)) flags.push("urgent scheduling");
  if (/permit|panel|roof|gas|electrical/.test(lower)) flags.push("permit or licensed review");
  if (/cost|price|quote|budget/.test(lower)) flags.push("price sensitivity");
  if (text.length < 80) flags.push("scope unclear");
  return flags;
}

function build() {
  const lead = val("#lead");
  const flags = detectFlags(lead);
  const labor = num("#rate") * num("#hours");
  const material = num("#materials") * (1 + num("#markup") / 100);
  const total = labor + material;
  const cost = num("#materials") + labor * 0.58;
  const margin = Math.max(0, (total - cost) / Math.max(total, 1));
  pack = { business: val("#business"), trade: val("#trade"), city: val("#city"), owner: val("#owner"), lead, flags, labor, material, total, deposit: total * 0.3, margin };
  render();
  toast("Quote pack generated");
}

function render() {
  $("#total").textContent = money(pack.total || 0);
  $("#deposit").textContent = money(pack.deposit || 0);
  $("#flags").textContent = (pack.flags || []).length;
  $("#margin").textContent = `${Math.round((pack.margin || 0) * 100)}%`;
  const rows = [
    ["Labor", `${num("#hours")} hrs`, money(pack.labor || 0)],
    ["Materials plus markup", `${num("#markup")}% markup`, money(pack.material || 0)],
    ["Estimated total", "Before tax or change orders", money(pack.total || 0)],
    ["Suggested deposit", "30% to schedule", money(pack.deposit || 0)]
  ];
  renderScope(rows);
  renderMessages();
}

function renderScope(rows) {
  const output = $("#scopeOutput");
  const copy = el("p", `${pack.business || "The contractor"} should respond as a ${pack.trade || "home service pro"} in ${pack.city || "the local area"} with a clear diagnostic step, a cost range, and a scheduling path.`);
  const flags = el("p");
  (pack.flags || []).forEach((flag) => flags.appendChild(el("span", flag, "badge warn")));
  output.replaceChildren(el("h2", "Draft Scope"), copy, tableNode(["Line", "Note", "Amount"], rows), flags);
}

function renderMessages() {
  const owner = pack.owner || "the owner";
  const business = pack.business || "the business";
  const trade = pack.trade || "home service";
  $("#smsOut").value = `Hi {{first_name}}, this is ${owner} from ${business}. Based on your note, we recommend a diagnostic visit for ${trade} service. A rough planning range is ${money((pack.total || 0) * 0.85)}-${money((pack.total || 0) * 1.2)} before any hidden issues. We can hold a spot this week: {{booking_link}}`;
  $("#emailOut").value = `Subject: ${business} estimate next steps\n\nHi {{first_name}},\n\nThanks for reaching out. From your request, the likely first step is a diagnostic visit and a written scope before work begins. Planning estimate: ${money(pack.total || 0)}. Suggested deposit to schedule: ${money(pack.deposit || 0)}.\n\nWhat is included:\n- Labor planning: ${num("#hours")} hours\n- Materials allowance: ${money(pack.material || 0)}\n- Clear approval before any change order\n\nBest,\n${owner}`;
  $("#followOut").value = `Day 1: Send estimate and booking link.\nDay 2: "Any questions about scope or timing?"\nDay 5: Offer two appointment windows.\nDay 10: Close the loop and ask if the project is still active.`;
  $("#termsOut").value = "Draft only. Final quote depends on inspection, access, parts availability, code requirements, permits, and customer approval.";
  $("#briefOut").value = `${appName}\nBuyer: ${business}\nLead risk flags: ${(pack.flags || []).join(", ") || "none"}\nFast offer: $199 setup for 10 lead-to-quote templates and follow-up sequences.\nUpsell: $79/month to maintain quote packs and seasonal offers.`;
}

function exportCsv() {
  const rows = [["line", "note", "amount"], ["Labor", `${num("#hours")} hours`, Math.round(pack.labor || 0)], ["Materials", "marked up", Math.round(pack.material || 0)], ["Total", "draft estimate", Math.round(pack.total || 0)]];
  download("quotequick-estimate.csv", rows.map((row) => row.map(csvCell).join(",")).join("\n"), "text/csv;charset=utf-8");
}

function copyPack() {
  copyText([$("#smsOut").value, $("#emailOut").value, $("#briefOut").value].join("\n\n"));
}

bindTabs();
$("#generateBtn").addEventListener("click", build);
$("#exportBtn").addEventListener("click", exportCsv);
$("#copyBtn").addEventListener("click", copyPack);
$("#sampleBtn").addEventListener("click", () => {
  $("#lead").value = "Water heater is leaking near the base. We need a replacement quote and want to know if you can come tomorrow morning.";
  $("#trade").value = "plumbing contractor";
  $("#hours").value = 3;
  $("#materials").value = 950;
  build();
});
build();
