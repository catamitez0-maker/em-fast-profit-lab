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
