# StayReply Kit

StayReply Kit is a static MVP for Airbnb hosts and small short-term-rental operators. It generates guest replies, scheduled messages, review responses, issue-handling copy, and cleaner/ops checklists.

## First Buyer

Airbnb hosts, co-hosts, cleaners who support guest communication, and small property managers with one to five listings.

## First Offer

Sell a `Host Messaging Setup` for `$99`:

- Build core pre-arrival, check-in, issue, checkout, and review templates.
- Tune tone for the property and host.
- Deliver copy/paste replies plus an operations checklist.
- Offer `$39/month` per-property tuning for seasonal updates and review replies.

## Run

Open the app directly:

```text
src/index.html
```

Use `data/sample.csv` as demo context or paste a real guest message into the form.

## Delivery Checklist

- Collect property name, city, host name, house rules, and common guest questions.
- Generate the core template pack and review it for policy/local-rule fit.
- Deliver the message pack as copyable text plus a cleaner checklist.
- Keep platform policy and local compliance decisions with the owner.

## Files

```text
docs/opportunity-analysis.md   Market signal and project decision
docs/monetization-package.md   Pricing, sales copy, delivery, and upsells
src/index.html                 Static host-message app
src/app.js                     Template and checklist generation logic
data/sample.csv                Demo host context
tests/smoke-test.mjs           Packaging checks
```

## Validate

```bash
node --check src/app.js
node tests/smoke-test.mjs
```
