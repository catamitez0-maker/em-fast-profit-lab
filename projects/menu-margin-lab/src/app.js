const appName = "MenuMargin Lab";
const { $, safeNumber, money, csvToRows, csvCell, badgeCell, renderTableInto, download, copyText, toast, bindTabs } = window.AppKit;
let rows = [];

function percentInput(selector, fallback) {
  const value = Number($(selector).value);
  if (!Number.isFinite(value)) return fallback / 100;
  return Math.min(0.95, Math.max(0.01, value / 100));
}

function parseCsv(text) {
  const rawRows = csvToRows(text);
  if (!rawRows.length) return [];
  const headers = rawRows[0].map((header) => header.trim().toLowerCase());
  const hasHeader = ["item", "price", "food_cost"].some((header) => headers.includes(header));
  const dataRows = hasHeader ? rawRows.slice(1) : rawRows;
  const get = (row, name, fallbackIndex) => row[headers.indexOf(name) >= 0 ? headers.indexOf(name) : fallbackIndex] || "";
  return dataRows.map((row) => ({ item: get(row, "item", 0).trim() || "Untitled item", category: get(row, "category", 1).trim() || "General", price: safeNumber(get(row, "price", 2)), cost: safeNumber(get(row, "food_cost", 3)), sold: safeNumber(get(row, "weekly_sold", 4)) })).filter((row) => row.price > 0);
}

function audit() {
  const target = percentInput("#target", 30);
  const overhead = percentInput("#overhead", 18);
  rows = parseCsv($("#menuData").value).map((row) => {
    const foodPct = row.cost / row.price;
    const profit = row.price - row.cost - row.price * overhead;
    const suggested = Math.max(row.price, Math.ceil((row.cost / target) * 2) / 2);
    const lift = Math.max(0, suggested - row.price) * row.sold;
    return { ...row, foodPct, profit, suggested, lift, flag: foodPct > target ? "Reprice" : "Healthy" };
  });
  render();
  toast("Menu audit generated");
}

function render() {
  const count = rows.length;
  const avg = count ? rows.reduce((sum, row) => sum + row.foodPct, 0) / count : 0;
  const risk = rows.filter((row) => row.flag === "Reprice").length;
  const lift = rows.reduce((sum, row) => sum + row.lift, 0);
  $("#items").textContent = count;
  $("#avgCost").textContent = `${Math.round(avg * 100)}%`;
  $("#atRisk").textContent = risk;
  $("#lift").textContent = money(lift);
  renderAuditTable();
  const top = rows.slice().sort((a, b) => b.lift - a.lift)[0];
  $("#postOut").value = `This week at ${$("#business").value}: try our ${top?.item || "featured item"} and pair it with a high-margin drink. Fresh, fast, and built for ${$("#city").value} lunch plans.`;
  $("#staffOut").value = `Focus item: ${top?.item || "none"}. Suggested menu price: ${money(top?.suggested || 0)}. If guests ask, explain ingredient quality and the pairing option.`;
  $("#briefOut").value = `${appName}\nRestaurant: ${$("#business").value}\nItems reviewed: ${count}\nAt-risk items: ${risk}\nEstimated weekly lift from suggested prices: ${money(lift)}\nFast offer: $149 audit, then $49/month for weekly margin and promo updates.`;
}

function renderAuditTable() {
  renderTableInto($("#auditOut"), ["Item", "Category", "Price", "Food Cost", "Suggested", "Weekly Lift", "Status"], rows.map((row) => [row.item, row.category, money(row.price), `${Math.round(row.foodPct * 100)}%`, money(row.suggested), money(row.lift), badgeCell(row.flag, row.flag === "Reprice" ? "badge warn" : "badge")]));
}

function exportCsv() {
  const output = [["item", "category", "price", "food_cost_pct", "suggested_price", "weekly_lift", "status"], ...rows.map((row) => [row.item, row.category, row.price, Math.round(row.foodPct * 100), row.suggested, Math.round(row.lift), row.flag])];
  download("menu-margin-audit.csv", output.map((row) => row.map(csvCell).join(",")).join("\n"), "text/csv;charset=utf-8");
}

bindTabs();
$("#generateBtn").addEventListener("click", audit);
$("#exportBtn").addEventListener("click", exportCsv);
$("#copyBtn").addEventListener("click", () => copyText($("#briefOut").value));
$("#sampleBtn").addEventListener("click", () => {
  $("#menuData").value = "item,category,price,food_cost,weekly_sold\nBreakfast Burrito,Brunch,13,5.9,70\nCold Brew,Drinks,5,0.9,180\nChicken Bowl,Entrees,15,6.4,95\nCookie,Dessert,4,1.3,130";
  audit();
});
audit();
