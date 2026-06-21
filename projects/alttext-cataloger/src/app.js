const appName = "AltText Cataloger";
const { $, safeNumber, csvToRows, csvCell, badgeCell, renderTableInto, download, copyText, toast, bindTabs } = window.AppKit;
let items = [];

function parseCatalog(text) {
  const rows = csvToRows(text);
  const headers = rows.shift()?.map((header) => header.trim().toLowerCase()) || [];
  const get = (row, name, fallbackIndex) => row[headers.indexOf(name) >= 0 ? headers.indexOf(name) : fallbackIndex] || "";
  return rows.map((row) => ({ image: get(row, "image", 0).trim(), product: get(row, "product", 1).trim(), category: get(row, "category", 2).trim(), color: get(row, "color", 3).trim(), material: get(row, "material", 4).trim(), use: get(row, "use", 5).trim() })).filter((row) => row.image || row.product);
}

function makeAlt(item) {
  const tone = $("#tone").value;
  const maxLength = safeNumber($("#maxLen").value, 125);
  let alt = [item.color, item.material, item.product, item.use].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  if (tone === "premium") alt = `${item.product} in ${item.color || "shown color"}, ${item.material || "selected material"}, styled for ${item.use || item.category || "product detail"}`;
  if (tone === "technical") alt = `${item.product}; ${item.category}; color ${item.color || "not specified"}; material ${item.material || "not specified"}; view ${item.use || item.image}`;
  return alt.slice(0, maxLength);
}

function flags(item, alt) {
  const list = [];
  if (/^img[_-]?\d+|image|photo/i.test(item.image)) list.push("generic filename");
  if (!item.product || !item.color) list.push("missing attributes");
  if (alt.length > safeNumber($("#maxLen").value, 125) - 5) list.push("near length cap");
  if (!item.use) list.push("missing image purpose");
  return list;
}

function generate() {
  items = parseCatalog($("#catalogData").value).map((item) => {
    const alt = makeAlt(item);
    return { ...item, alt, flags: flags(item, alt) };
  });
  const totalFlags = items.reduce((sum, item) => sum + item.flags.length, 0);
  const avg = items.length ? Math.round(items.reduce((sum, item) => sum + item.alt.length, 0) / items.length) : 0;
  const coverage = items.length ? Math.round((items.filter((item) => item.alt && item.flags.length === 0).length / items.length) * 100) : 0;
  $("#imageCount").textContent = items.length;
  $("#flagCount").textContent = totalFlags;
  $("#avgLen").textContent = avg;
  $("#coverage").textContent = `${coverage}%`;
  renderTableInto($("#altsOut"), ["Image", "Product", "Alt Text", "Flags"], items.map((item) => [item.image, item.product, item.alt, badgeCell(item.flags.join("; ") || "ready", item.flags.length ? "badge warn" : "badge")]));
  $("#briefOut").value = `${appName}\nBrand: ${$("#brand").value}\nImages processed: ${items.length}\nAccessibility flags: ${totalFlags}\nAverage alt length: ${avg}\nFast offer: $129 for 100 product images, then $79/month for catalog updates.\nNote: final accessibility review should verify page context, not just image text.`;
  toast("Alt text generated");
}

function exportCsv() {
  const rows = [["image", "product", "alt_text", "flags"], ...items.map((item) => [item.image, item.product, item.alt, item.flags.join("; ")])];
  download("alttext-catalog.csv", rows.map((row) => row.map(csvCell).join(",")).join("\n"), "text/csv;charset=utf-8");
}

bindTabs();
$("#generateBtn").addEventListener("click", generate);
$("#exportBtn").addEventListener("click", exportCsv);
$("#copyBtn").addEventListener("click", () => copyText($("#briefOut").value));
generate();
