# InvoiceNudge

InvoiceNudge is a static MVP for freelancers and small B2B service firms. It converts open invoices into an aging dashboard, reminder queue, polite collection messages, and an owner-ready status brief.

## First Buyer

Freelancers, agencies, consultants, bookkeepers, contractors, and small studios that chase overdue payments manually.

## First Offer

Sell a `Reminder Setup` for `$99`, then upsell a `$49/month` weekly AR queue:

- Import invoice rows from a spreadsheet export.
- Categorize reminders by due date and urgency.
- Generate friendly, firm, or concise follow-up messages.
- Deliver a weekly owner brief with overdue total and next actions.

## Run

Open the app directly:

```text
src/index.html
```

Use `data/sample.csv` as demo input or paste invoice rows into the CSV field.

## Delivery Checklist

- Ask for client name, invoice number, due date, amount, and status.
- Generate the reminder queue and review tone with the owner.
- Export the CSV and copy messages into email drafts.
- Keep positioning operational: this is not legal or collections advice.

## Files

```text
docs/opportunity-analysis.md   Market signal and project decision
docs/monetization-package.md   Pricing, sales copy, delivery, and upsells
src/index.html                 Static invoice-reminder app
src/app.js                     Aging and message generation logic
data/sample.csv                Demo invoice input
tests/smoke-test.mjs           Packaging checks
```

## Validate

```bash
node --check src/app.js
node tests/smoke-test.mjs
```
