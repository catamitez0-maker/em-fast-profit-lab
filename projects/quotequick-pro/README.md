# QuoteQuick Pro

QuoteQuick Pro is a static MVP for home-service contractors. It turns an inbound project lead into a draft scope, estimated price range, booking message, follow-up note, and owner brief.

## First Buyer

Small HVAC, plumbing, electrical, roofing, landscaping, and remodeling contractors that already receive leads but respond slowly or inconsistently.

## First Offer

Sell a `Quote Response Setup` for `$199`:

- Configure the contractor's default rate, markup, trade, and city.
- Build 10 reusable quote packs for common project types.
- Deliver SMS, email, follow-up, terms, and owner briefing copy.
- Offer a `$79/month` follow-up plan for 30 quote packs or seasonal promos.

## Run

Open the app directly:

```text
src/index.html
```

Use `data/sample.csv` as demo input or paste a real lead into the form.

## Delivery Checklist

- Confirm the contractor's trade, location, hourly rate, and markup.
- Generate quote packs for common service calls.
- Export the CSV and paste the best messages into the customer's CRM or inbox drafts.
- Remind the contractor that final pricing must be approved by the licensed pro.

## Files

```text
docs/opportunity-analysis.md   Market signal and project decision
docs/monetization-package.md   Pricing, sales copy, delivery, and upsells
src/index.html                 Static quote-pack app
src/app.js                     Estimate and message generation logic
data/sample.csv                Demo lead inputs
tests/smoke-test.mjs           Packaging checks
```

## Validate

```bash
node --check src/app.js
node tests/smoke-test.mjs
```
