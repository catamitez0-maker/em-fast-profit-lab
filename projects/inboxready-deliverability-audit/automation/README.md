# InboxReady Sales Automation Kit

This kit turns the InboxReady offer into a repeatable sales and delivery workflow.

## Run

```bash
node projects/inboxready-deliverability-audit/scripts/run-automation.mjs
```

## Inputs

| File | Purpose |
| --- | --- |
| `data/leads.csv` | Seed prospect list with segment, volume, platform, contact route, and personalized opener |
| `data/sample.csv` | Campaign and sender posture rows for the audit engine |
| `data/client-intake.csv` | Client/domain metadata used in report headers |

## Generated Outputs

| File | Purpose |
| --- | --- |
| `automation/generated/scored-leads.csv` | Ranked lead list with tier, score, reason, and next step |
| `automation/generated/outreach-queue.csv` | Mail-ready queue with first touch and two follow-ups |
| `automation/generated/outreach-sequences.md` | Human-readable copy for the top outreach targets |
| `automation/generated/audit-results.csv` | Campaign-level status, risk score, and fix list |
| `automation/generated/sample-audit-report.md` | Public sample report format for selling the offer |
| `automation/generated/delivery-report.md` | Client-facing report format after paid intake |
| `automation/generated/handoff-checklist.md` | Human review checklist before delivery |

## Operating Rule

Use the automation to prepare the work, not to spam. The bundled lead list is seed data for workflow testing and targeting shape; replace or verify contact routes before sending anything. Send manually or through a compliant mail tool, and review every report before delivery.
