# Fast-Profit Launch Playbook

This playbook turns the MVP portfolio into a practical revenue test. The goal is not to build a polished SaaS company on day one; it is to sell a narrowly scoped service-backed result, deliver it with the static tool, then decide which wedge deserves deeper product work.

Start every sales block from the internal dashboard:

```text
projects/monetization-command-center/src/index.html
```

Use it to pick the week's focus offer, calculate expected sprint cash, copy outreach, and follow the paid-delivery checklist.

## Priority Order

| Rank | Project | First Offer | Why First |
| --- | --- | ---: | --- |
| 1 | ReturnReply Pro | $149 setup, then $199/month | Strong blend of demand, delivery speed, and clear ecommerce buyer. |
| 2 | AltText Cataloger | $199 pass, then $299/month | Bulk repeatability and visible catalog/accessibility pressure. |
| 3 | Chargeback Evidence Kit | $249 packet | Urgent revenue-protection pain and deadline-driven buying. |
| 4 | InvoiceNudge | $99 setup, then $79/month | Clear cash-flow pain and recurring service potential. |
| 5 | ReviewSpark Local | $149 sprint | Pain is public and prospecting is easy: find unanswered or generic review replies. |

## 14-Day Revenue Sprint

### Days 1-2: Package

- Pick one wedge in the command center. Default to ReturnReply Pro.
- Create one checkout or invoice link per offer.
- Prepare a one-page sample output from the app for each offer.
- Make a small prospect sheet with 50 businesses per wedge.

### Days 3-7: Outreach

- Send 30 personalized messages per day.
- Include one concrete observation, one sample outcome, and one low-friction CTA.
- Track replies as `interested`, `not now`, `wrong person`, `booked`, or `paid`.
- Sell setup calls only after the prospect has seen a sample.

### Days 8-10: Deliver

- For each paying customer, collect the minimum input file or pasteable rows.
- Generate the output inside the project app.
- Deliver a PDF/email summary plus the exportable rows from the tool.
- Ask for permission to turn anonymized before/after work into a sample.

### Days 11-14: Decide

- Continue only projects that produce at least 2 warm replies per 20 personalized outreaches.
- Keep a project if one customer pays or two customers request a follow-up.
- Drop or reposition any offer that gets compliments but no buying signal.

## Complete Strategy

Use these files for the full monetization system:

- `docs/monetization-strategy.md`
- `docs/sales-scripts.md`
- `docs/revenue-ops-sop.md`
- `data/monetization-offer-matrix.csv`

## Daily Prospecting Filters

| Project | Where to Look | Buying Signal |
| --- | --- | --- |
| ReviewSpark Local | Google Maps, Yelp, local SEO agency client lists | Unanswered reviews, generic owner replies, recent low-star reviews. |
| QuoteQuick Pro | Google local services, Thumbtack-like profiles, contractor websites | Slow quote form, vague service pages, no project intake detail. |
| MenuMargin Lab | Independent restaurant menus and social pages | Large menus, no current promos, price-sensitive comments. |
| InvoiceNudge | Freelancers, agencies, local B2B service firms | Public posts about cash flow, manual billing, project-based services. |
| StayReply Kit | Airbnb listings and host groups | Multi-property hosts, repeated guest questions, slow response complaints. |

## Minimum Delivery Standard

Every paid delivery should include:

- Customer input snapshot.
- Tool-generated output.
- 3 specific recommendations.
- Copy the customer can use immediately.
- A next-step upsell, maintenance plan, or monthly review option.

## Validation Metrics

| Metric | Good Signal | Bad Signal |
| --- | ---: | ---: |
| Personalized outreach reply rate | 10%+ | Under 3% |
| Paid conversion from warm replies | 20%+ | Under 5% |
| Delivery time per customer | Under 45 minutes | Over 2 hours |
| Willingness to share sample/testimonial | 30%+ | Under 10% |
| Monthly upsell interest | 20%+ | Under 5% |

## What To Build Next

Only deepen the product after sales evidence:

- Add CSV import/export polish after 3 paid deliveries.
- Add account/login only after recurring customers ask for saved history.
- Add integrations only after manual import becomes the main bottleneck.
- Add payment and onboarding automation after the offer has repeatable close rates.


## Round 2 Single-Product Sprint

The second batch adds four narrow products. Use them when the prospect already has a spreadsheet or support queue and wants one finished artifact.

| Rank | Project | First Offer | Why |
| --- | --- | ---: | --- |
| 1 | ReturnReply Pro | $99 setup | Huge returns pain, clear support-owner buyer, low delivery friction. |
| 2 | AltText Cataloger | $129 pass | Very single-purpose, easy bulk delivery, tied to accessibility/catalog pressure. |
| 3 | Chargeback Evidence Kit | $149 packet | High-value pain, but evidence must be reviewed carefully before submission. |
| 4 | ChurnSave Script | $149 pack | Useful for subscription teams, but cancellation policy tone must stay low-friction. |

### 7-Day Backtest-to-Revenue Loop

- Day 1: Build one anonymized sample output for each project using the sample CSV.
- Days 2-4: Send 20 targeted outreaches per day for the top two projects.
- Day 5: Keep only offers with at least 2 warm replies per 20 messages.
- Days 6-7: Deliver one paid or free pilot and measure delivery time under 45 minutes.

### Backtest Gate

Do not deepen the product until it passes all three gates:

- At least 40/50 in `data/round2-backtest.csv`.
- `node tests/round2-backtest.mjs` passes.
- One real prospect confirms they already have the input rows needed.
