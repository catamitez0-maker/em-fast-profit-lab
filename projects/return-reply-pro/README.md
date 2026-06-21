# ReturnReply Pro

ReturnReply Pro is a single-purpose static MVP for ecommerce support teams. It converts return request rows into decisions, customer replies, and an owner brief.

## First Buyer

DTC stores, small retailers, ecommerce agencies, apparel and accessories sellers.

## First Offer

$99 return queue setup, $49/month weekly return reply ops.

## Run

Open the app directly:

```text
src/index.html
```

Use `data/sample.csv` as demo input or paste customer rows into the app.

## Delivery Checklist

- Collect the minimum CSV rows from the customer.
- Generate the output inside the app.
- Review edge cases and anything that touches policy, legal, or compliance.
- Export the CSV and deliver the copyable brief.
- Offer a monthly refresh only after one paid delivery.

## Files

```text
docs/opportunity-analysis.md   Market signal and project decision
docs/monetization-package.md   Pricing, sales copy, delivery, and upsells
src/index.html                 Static single-product app
src/app.js                     Generation and export logic
data/sample.csv                Demo input data
tests/smoke-test.mjs           Packaging and safety checks
```

## Validate

```bash
node --check src/app.js
node tests/smoke-test.mjs
```
