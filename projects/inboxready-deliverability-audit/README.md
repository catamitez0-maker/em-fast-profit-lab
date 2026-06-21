# InboxReady Deliverability Audit

InboxReady turns pasted email campaign and sender-authentication data into an inbox readiness score, blocker list, and client-facing fix plan.

## Run

Open:

```text
projects/inboxready-deliverability-audit/src/index.html
```

## Fast Offer

- Entry price: $149 deliverability compliance audit
- Recurring offer: $99/month sender monitoring and pre-campaign checklist
- Buyer: newsletter operators, DTC stores, outbound teams, and marketing agencies

## Delivery

Ask the buyer for a campaign export and their current SPF, DKIM, DMARC, unsubscribe, bounce, and complaint posture. Paste the rows into the tool, generate the report, export the CSV, and send the client brief.

## Sales Automation

Run the full sales and delivery kit:

```bash
node projects/inboxready-deliverability-audit/scripts/run-automation.mjs
```

It generates:

- `automation/generated/scored-leads.csv`
- `automation/generated/outreach-queue.csv`
- `automation/generated/outreach-sequences.md`
- `automation/generated/audit-results.csv`
- `automation/generated/sample-audit-report.md`
- `automation/generated/delivery-report.md`
- `automation/generated/handoff-checklist.md`

Use `data/leads.csv` for the prospect pool, `data/sample.csv` for campaign audit rows, and `data/client-intake.csv` for report metadata.
