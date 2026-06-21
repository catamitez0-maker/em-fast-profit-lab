# EM Fast-Profit Lab

This workspace contains nine small, service-led micro-SaaS MVPs designed for quick monetization, plus one internal command center for selling them. Each project is separated under `projects/` with its own demo app, market note, monetization package, sample data, and smoke test.

## Portfolio

Open the project hub:

```text
projects/index.html
```

The public marketing landing page is:

```text
index.html
```

| # | Project | Path | Fast Offer |
| --- | --- | --- | --- |
| 00 | Monetization Command Center | `projects/monetization-command-center/src/index.html` | revenue operations |
| 01 | ReviewSpark Local | `projects/reviewspark-local/src/index.html` | $149 review cleanup sprint |
| 02 | QuoteQuick Pro | `projects/quotequick-pro/src/index.html` | $199 quote response setup |
| 03 | MenuMargin Lab | `projects/menu-margin-lab/src/index.html` | $149 menu margin audit |
| 04 | InvoiceNudge | `projects/invoice-nudge/src/index.html` | $49/month reminder queue |
| 05 | StayReply Kit | `projects/stayreply-kit/src/index.html` | $99 host messaging setup |
| 06 | Chargeback Evidence Kit | `projects/chargeback-evidence-kit/src/index.html` | $149 dispute evidence packet |
| 07 | ReturnReply Pro | `projects/return-reply-pro/src/index.html` | $99 return queue setup |
| 08 | AltText Cataloger | `projects/alttext-cataloger/src/index.html` | $129 catalog alt-text pass |
| 09 | ChurnSave Script | `projects/churn-save-script/src/index.html` | $149 cancellation-save script |

## Market Analysis

See [docs/opportunity-portfolio.md](docs/opportunity-portfolio.md) for the first portfolio decision memo and source links. See [docs/market-round-2.md](docs/market-round-2.md) for the second market scan focused on high-demand single-product MVPs, [docs/round2-backtest-report.md](docs/round2-backtest-report.md) for the backtest results and improvements, and [docs/monetization-strategy.md](docs/monetization-strategy.md) for the complete go-to-market strategy.

## Launch Execution

Start with the revenue sprint:

```text
docs/launch-playbook.md
```

The playbook ranks the original five projects, adds a second sprint for projects 06-09, and gives validation metrics for deciding which project deserves deeper product work.

For customer acquisition, start with:

```text
docs/customer-acquisition-plan.md
data/prospect-leads.csv
data/outreach-crm.csv
docs/outreach-drafts.md
docs/promotion-content-pack.md
outreach.html
```


## Runtime Structure

The nine lightweight project apps share a small static runtime:

```text
projects/shared/app-utils.js
projects/shared/app-shell.css
```

Each lightweight project keeps a local `src/index.html`, `src/app.js`, and `src/styles.css`; the local CSS imports the shared shell, and HTML loads `app-utils.js` before the project script. ReviewSpark Local remains available both at `src/` and `projects/reviewspark-local/src/` for backward-compatible standalone packaging, with tests keeping both copies in sync.

## Validate

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
node --check projects/shared/app-utils.js
node tests/portfolio-smoke-test.mjs
node tests/security-smoke-test.mjs
node tests/round2-backtest.mjs
```

Each project also includes its own `tests/smoke-test.mjs`; run all of them after changing shared runtime or shell styles.

## Packaged Output

The current packaged outputs are:

```text
outputs/fast-profit-projects-portfolio.zip
outputs/market-demand-single-products.zip
outputs/monetization-ready-portfolio.zip
```
