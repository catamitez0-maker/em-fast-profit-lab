import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

const publicPages = [
  "../index.html",
  "../pay/index.html",
  "../samples/index.html",
  "../projects/index.html",
  "../outreach.html",
  "../offers/return-reply-pro/index.html",
  "../offers/alttext-cataloger/index.html",
  "../offers/chargeback-evidence-kit/index.html"
];

for (const path of publicPages) {
  const html = read(path);
  assert.doesNotMatch(html, /<style>|style="/, `${path} should use shared site CSS instead of inline styles`);
  assert.match(html, /assets\/site\.css|\.\.\/assets\/site\.css|\.\.\/\.\.\/assets\/site\.css/, `${path} should load shared site CSS`);
}

const siteCss = read("../assets/site.css");
assert.ok(siteCss.includes(".home-hero"), "site CSS should style the public hero");
assert.ok(siteCss.includes("command-center-preview.png"), "home hero should use the real preview image");
assert.ok(siteCss.includes(".lead-row"), "site CSS should style the outreach queue");
assert.doesNotMatch(siteCss, /font-size:\s*clamp\(/, "site CSS should avoid viewport-scaled font sizes");
assert.doesNotMatch(siteCss, /letter-spacing:\s*-[^;]+/, "site CSS should avoid negative letter spacing");

const outreach = read("../outreach.html");
const outreachJs = read("../assets/outreach.js");
assert.ok(outreach.includes("assets/outreach.js"), "outreach page should load the dynamic queue script");
assert.doesNotMatch(outreach, /mailto:/, "outreach HTML should not duplicate generated mailto links");
assert.ok(outreachJs.includes('fetch("data/prospect-leads.csv"'), "outreach script should load leads from CSV");
assert.ok(outreachJs.includes("textContent"), "outreach script should render text through DOM textContent");
assert.doesNotMatch(outreachJs, /\.innerHTML\s*=|\.outerHTML\s*=|insertAdjacentHTML|eval\(|new Function/, "outreach script should avoid dangerous DOM or dynamic execution patterns");
assert.doesNotMatch(outreachJs, /split\(['"]?,['"]?\)/, "outreach script should not split CSV on raw commas");

const leadCsv = read("../data/prospect-leads.csv");
assert.equal(leadCsv.trim().split(/\r?\n/).length - 1, 34, "prospect lead CSV should keep the 34-lead launch queue");

const payPage = read("../pay/index.html");
assert.ok(payPage.includes("Book pilot"), "pay page should expose a pilot booking action");
assert.ok(payPage.includes("ReturnReply Pro"), "pay page should list ReturnReply Pro");
assert.ok(payPage.includes("AltText Cataloger"), "pay page should list AltText Cataloger");
assert.ok(payPage.includes("Chargeback Evidence Kit"), "pay page should list Chargeback Evidence Kit");
assert.ok(payPage.includes("InboxReady Deliverability Audit"), "pay page should list InboxReady Deliverability Audit");
assert.ok(payPage.includes("AI Search Presence Monitor"), "pay page should list AI Search Presence Monitor");
assert.ok(payPage.includes("VibeCode Security Smoke Test"), "pay page should list VibeCode Security Smoke Test");
assert.ok(payPage.includes("SupportBot QA Harness"), "pay page should list SupportBot QA Harness");
assert.ok(payPage.includes("AI Disclosure Register Kit"), "pay page should list AI Disclosure Register Kit");

for (const slug of ["return-reply-pro", "alttext-cataloger", "chargeback-evidence-kit"]) {
  const input = read(`../samples/${slug}/input.csv`);
  const output = read(`../samples/${slug}/output.csv`);
  const brief = read(`../samples/${slug}/delivery-brief.md`);
  assert.ok(input.includes(","), `${slug} sample input should be CSV-like`);
  assert.ok(output.includes(","), `${slug} sample output should be CSV-like`);
  assert.ok(brief.includes("Follow-Up Offer"), `${slug} brief should include a follow-up offer`);
}

console.log("Site smoke checks passed");
