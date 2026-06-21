# Code Audit Report

Generated: 2026-06-21

## Scope

This pass audited the public marketing site, offer pages, outreach queue, shared lightweight app shell, ReviewSpark standalone styling, and smoke-test coverage.

## Remediations Completed

- Replaced duplicated public-page inline CSS with `assets/site.css`.
- Rebuilt `outreach.html` as a lightweight shell that reads `data/prospect-leads.csv` through `assets/outreach.js`.
- Removed hardcoded outreach mailto rows from HTML and now generate mailto/contact actions from source data.
- Added `tests/site-smoke-test.mjs` to check shared CSS usage, outreach CSV loading, dangerous DOM patterns, and launch lead count.
- Updated homepage design to use the real command-center preview as a first-viewport brand signal.
- Unified the project portfolio and offer pages around one visual system.
- Updated `projects/shared/app-shell.css` so lightweight apps share a cleaner operational UI.
- Removed repeated inline spacing styles from project demo pages with the shared `.field-stack` utility.
- Updated ReviewSpark standalone styles to match the refreshed palette and avoid viewport-scaled font sizing.

## Controlled Duplication

`src/` and `projects/reviewspark-local/src/` remain duplicated intentionally. They are byte-identical for the core ReviewSpark app and support both the root demo entry point and the portfolio packaging entry point. Existing tests keep the app logic synchronized.

## Validation

Run:

```bash
for f in $(rg --files -g '*.js' -g '*.mjs'); do node --check "$f" || exit 1; done
node tests/smoke-test.mjs
node tests/portfolio-smoke-test.mjs
node tests/security-smoke-test.mjs
node tests/site-smoke-test.mjs
node tests/round2-backtest.mjs
for t in projects/*/tests/smoke-test.mjs; do node "$t" || exit 1; done
```

Local static checks confirmed `index.html`, `outreach.html`, `assets/site.css`, `assets/outreach.js`, and `data/prospect-leads.csv` return HTTP 200 from a simple static server.

## Follow-Up Audit: 2026 Opportunity Batch

Scope: the five 2026 opportunity projects, `projects/shared/app-utils.js`, the Monetization Command Center, and the portfolio validation tests.

Remediations completed:

- Added shared `csvRecords()` to `projects/shared/app-utils.js` so new CSV-driven tools no longer duplicate header mapping code.
- Precomputed CSV header indexes inside `csvRecords()` to avoid repeated header scans during record parsing.
- Refactored InboxReady, AI Search Presence Monitor, VibeCode Security Smoke Test, SupportBot QA Harness, and AI Disclosure Register Kit to use the shared CSV record mapper.
- Updated the Monetization Command Center from the old nine-offer model to the current fourteen-offer portfolio and set InboxReady as the default operating wedge.
- Updated Command Center docs, sample offer matrix, and smoke tests so the five new products are covered by the internal sales system.
- Removed ignored local zip artifacts from `outputs/`; `outputs/.gitkeep` remains so the directory structure is preserved.
- Re-ran residual scans for old "nine products" wording and duplicated CSV getter helpers; no active code or docs still use those stale patterns.

Validation completed:

```bash
node --check src/app.js
node --check projects/reviewspark-local/src/app.js
node --check projects/quotequick-pro/src/app.js
node --check projects/menu-margin-lab/src/app.js
node --check projects/invoice-nudge/src/app.js
node --check projects/stayreply-kit/src/app.js
node --check projects/chargeback-evidence-kit/src/app.js
node --check projects/return-reply-pro/src/app.js
node --check projects/alttext-cataloger/src/app.js
node --check projects/churn-save-script/src/app.js
node --check projects/monetization-command-center/src/app.js
node --check projects/inboxready-deliverability-audit/src/app.js
node --check projects/ai-search-presence-monitor/src/app.js
node --check projects/vibecode-security-smoke-test/src/app.js
node --check projects/supportbot-qa-harness/src/app.js
node --check projects/ai-disclosure-register-kit/src/app.js
node --check projects/shared/app-utils.js
node --check assets/outreach.js
node tests/smoke-test.mjs
node tests/portfolio-smoke-test.mjs
node tests/security-smoke-test.mjs
node tests/site-smoke-test.mjs
node tests/round2-backtest.mjs
node tests/opportunity-scan-implementation-test.mjs
for t in projects/*/tests/smoke-test.mjs; do node "$t" || exit 1; done
git diff --check
```

Local HTTP checks confirmed the project hub, Monetization Command Center, and the five new project pages return HTTP 200 from a simple static server.
