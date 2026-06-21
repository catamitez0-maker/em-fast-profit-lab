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

const rows = csvToRows(readFileSync(new URL("../data/round2-backtest.csv", import.meta.url), "utf8"))
  .slice(1)
  .map(([project, demand, singleProduct, monetization, deliverySpeed, riskControl, total]) => ({
    project,
    demand: +demand,
    singleProduct: +singleProduct,
    monetization: +monetization,
    deliverySpeed: +deliverySpeed,
    riskControl: +riskControl,
    total: +total
  }));

assert.equal(rows.length, 4, "round 2 should include four selected projects");
for (const row of rows) {
  assert.ok(row.demand >= 8, `${row.project} demand score too low`);
  assert.ok(row.singleProduct >= 9, `${row.project} is not single-purpose enough`);
  assert.ok(row.total >= 40, `${row.project} did not pass backtest threshold`);
  for (const file of ["README.md", "docs/opportunity-analysis.md", "docs/monetization-package.md", "src/index.html", "src/app.js", "src/styles.css", "data/sample.csv", "tests/smoke-test.mjs"]) {
    assert.ok(existsSync(new URL(`../projects/${row.project}/${file}`, import.meta.url)), `${row.project} missing ${file}`);
  }
}

assert.ok(existsSync(new URL("../docs/round2-backtest-report.md", import.meta.url)), "missing round 2 backtest report");
const memo = readFileSync(new URL("../docs/market-round-2.md", import.meta.url), "utf8");
for (const source of ["Stripe", "Axios", "European Accessibility Act", "W3C", "Guardian"]) {
  assert.ok(memo.includes(source), `market memo missing ${source}`);
}

console.log("Round 2 backtest checks passed");
