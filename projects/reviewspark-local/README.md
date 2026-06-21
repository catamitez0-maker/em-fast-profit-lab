# ReviewSpark Local

ReviewSpark Local is a fast-monetization micro-SaaS MVP for local businesses and small agencies. It turns batches of customer reviews into personalized owner replies, trust signals, Google Business Profile post ideas, review request messages, and exportable work queues.

The first sellable wedge is simple: help local businesses respond to every review quickly without sounding like a template.

## Why This Project

Public market signals point to review management as a high-urgency, low-integration pain:

- Google says review replies and review volume/ratings affect how a business stands out in local results.
- BrightLocal's 2026 consumer review survey reports that 89% of consumers expect business owners to respond to reviews, 81% expect a reply within a week, and generic replies can hurt trust.
- Incumbents such as Podium and BrightLocal are broad platforms with sales-led or bundled pricing, leaving room for a narrow, cheap, instantly usable tool.

See [docs/opportunity-analysis.md](docs/opportunity-analysis.md) for the decision memo.

## Run

Open the app directly:

```text
src/index.html
```

No build step or backend is required. The MVP runs fully in the browser and stores work locally.

## Validate

```bash
node --check src/app.js
node tests/smoke-test.mjs
```

## Files

```text
docs/opportunity-analysis.md   Market evidence and selected project
docs/monetization-package.md   Pricing, offer, landing copy, sales scripts
src/index.html                 Static MVP app
src/styles.css                 Responsive app styling
src/app.js                     Review analysis and response generation
data/sample_reviews.csv        Demo input data
tests/smoke-test.mjs           Lightweight packaging checks
```
