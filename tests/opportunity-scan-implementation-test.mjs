import { existsSync, readFileSync } from "node:fs";
import assert from "node:assert/strict";

function csvToRows(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell);
  rows.push(row);
  return rows.filter((cells) => cells.some((cellValue) => cellValue.trim()));
}

const scanRows = csvToRows(readFileSync(new URL("../data/opportunity-scan-2026-06.csv", import.meta.url), "utf8")).slice(1);
assert.equal(scanRows.length, 5, "latest opportunity scan should contain five selected projects");

for (const row of scanRows) {
  const slug = row[1];
  for (const file of ["README.md", "docs/opportunity-analysis.md", "docs/monetization-package.md", "src/index.html", "src/app.js", "src/styles.css", "data/sample.csv", "tests/smoke-test.mjs"]) {
    assert.ok(existsSync(new URL(`../projects/${slug}/${file}`, import.meta.url)), `${slug} missing ${file}`);
  }
  const html = readFileSync(new URL(`../projects/${slug}/src/index.html`, import.meta.url), "utf8");
  const js = readFileSync(new URL(`../projects/${slug}/src/app.js`, import.meta.url), "utf8");
  assert.ok(html.includes("../../shared/app-utils.js"), `${slug} should load shared app utilities`);
  assert.ok(js.includes("exportCsv"), `${slug} should export a sellable artifact`);
}

const projectHub = readFileSync(new URL("../projects/index.html", import.meta.url), "utf8");
for (const row of scanRows) {
  assert.ok(projectHub.includes(`${row[1]}/src/index.html`), `project hub missing ${row[1]}`);
}

console.log("Opportunity scan implementation checks passed");
