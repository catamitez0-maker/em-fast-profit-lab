# Customer Acquisition Plan

This file converts the first public lead search into a manual, compliant outbound plan.

## First Target Segment

Start with small Shopify apparel and DTC stores because they show public return-policy pages, public contact routes, and likely repeat support work.

Primary offer: ReturnReply Pro.

Secondary offers:

- AltText Cataloger for stores with broad product catalogs.
- Chargeback Evidence Kit for merchants with refund/dispute-sensitive products.
- InvoiceNudge for custom-order or small service-like sellers.

## Lead File

Use:

```text
data/prospect-leads.csv
data/outreach-crm.csv
docs/outreach-drafts.md
```

The file includes public source URL, contact route, fit reason, and a personalized first line. Do not blast the list. Send one message at a time after checking the current page.

## Outreach Rules

- Personalize the first sentence with one page-specific observation.
- Offer a sample before asking for payment.
- Include a clear opt-out line in email.
- Do not make legal, compliance, dispute-win, or accessibility-audit claims.
- Use only the minimum data needed for a pilot and invite anonymized rows.

## First Campaign

Daily target: 15 carefully personalized messages.

Offer:

```text
ReturnReply Pro: $149 return queue setup
```

CTA:

```text
Worth sending a 10-row sample so I can show the output format?
```

## First Email Template

Subject: quick return reply cleanup for {{store}}

Hi {{name}},

{{personalized_opening}}

I run a small productized service called ReturnReply Pro. You send 10-50 return request rows, and I send back a decision queue, customer replies, and exchange/store-credit paths within 24 hours.

Entry setup is $149. If helpful, reply with `sample` and I will send an anonymized example first.

Best,
{{your_name}}

If this is not relevant, reply `not now` and I will close the loop.

## Success Gate

After 40 messages:

- Keep the campaign if there are at least 4 warm replies.
- Change the offer if there are replies but no input-ready prospects.
- Change the segment if reply rate is below 3%.
