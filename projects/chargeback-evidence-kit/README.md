# Chargeback Evidence Kit

Chargeback Evidence Kit is a single-purpose static MVP for merchants who need one clean dispute response packet. It converts evidence rows into a checklist, counterargument, customer outreach note, and owner brief.

## First Buyer

DTC brands, Shopify merchants, digital product sellers, agencies that support ecommerce ops.

## First Offer

$149 evidence packet, $299/month weekly dispute ops.

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
