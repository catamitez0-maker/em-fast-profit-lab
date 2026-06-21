import { existsSync, readFileSync } from "node:fs";
import assert from "node:assert/strict";

const slugs = [
  "monetization-command-center",
  "reviewspark-local",
  "quotequick-pro",
  "menu-margin-lab",
  "invoice-nudge",
  "stayreply-kit",
  "chargeback-evidence-kit",
  "return-reply-pro",
  "alttext-cataloger",
  "churn-save-script",
  "inboxready-deliverability-audit",
  "ai-search-presence-monitor",
  "vibecode-security-smoke-test",
  "supportbot-qa-harness",
  "ai-disclosure-register-kit"
];
const sharedSlugs = slugs.filter((slug) => slug !== "reviewspark-local");
assert.ok(existsSync(new URL("../docs/launch-playbook.md", import.meta.url)), "missing launch playbook");
assert.ok(existsSync(new URL("../projects/shared/app-utils.js", import.meta.url)), "missing shared app utilities");
assert.ok(existsSync(new URL("../projects/shared/app-shell.css", import.meta.url)), "missing shared app shell CSS");

for (const slug of slugs) {
  for (const file of ["README.md", "docs/opportunity-analysis.md", "docs/monetization-package.md", "src/index.html", "src/app.js", "src/styles.css"]) {
    const path = new URL(`../projects/${slug}/${file}`, import.meta.url);
    assert.ok(existsSync(path), `${slug} missing ${file}`);
  }
  const sample = slug === "reviewspark-local" ? "data/sample_reviews.csv" : "data/sample.csv";
  assert.ok(existsSync(new URL(`../projects/${slug}/${sample}`, import.meta.url)), `${slug} missing sample data`);
  const html = readFileSync(new URL(`../projects/${slug}/src/index.html`, import.meta.url), "utf8");
  assert.ok(html.includes("<title>"), `${slug} missing title`);
  if (sharedSlugs.includes(slug)) {
    const css = readFileSync(new URL(`../projects/${slug}/src/styles.css`, import.meta.url), "utf8");
    assert.ok(html.includes("../../shared/app-utils.js"), `${slug} missing shared app runtime`);
    assert.ok(css.includes("../../shared/app-shell.css"), `${slug} missing shared CSS import`);
  }
}
console.log("Portfolio smoke checks passed");
