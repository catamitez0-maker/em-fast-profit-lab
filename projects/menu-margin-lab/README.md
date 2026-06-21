# MenuMargin Lab

MenuMargin Lab is a static MVP for independent restaurants. It audits menu item economics, flags items above target food-cost thresholds, suggests price changes, and generates staff/promo copy.

## First Buyer

Independent cafes, bars, food trucks, fast-casual operators, and single-location restaurants that cannot keep raising prices broadly but need margin relief.

## First Offer

Sell a `Menu Margin Audit` for `$149`:

- Review up to 20 menu items.
- Flag items with weak gross margin or high food cost.
- Recommend specific price changes and weekly promo ideas.
- Offer a `$49/month` weekly menu ops plan.

## Run

Open the app directly:

```text
src/index.html
```

Use `data/sample.csv` as demo input or paste menu rows into the CSV field.

## Delivery Checklist

- Ask for item name, category, menu price, food cost, and weekly sales.
- Generate the audit and sort for high-volume, low-margin items first.
- Deliver the suggested changes with plain-language reasoning.
- Include one promotion that moves a high-margin item rather than discounting a weak one.

## Files

```text
docs/opportunity-analysis.md   Market signal and project decision
docs/monetization-package.md   Pricing, sales copy, delivery, and upsells
src/index.html                 Static margin-audit app
src/app.js                     Menu math and copy generation logic
data/sample.csv                Demo menu input
tests/smoke-test.mjs           Packaging checks
```

## Validate

```bash
node --check src/app.js
node tests/smoke-test.mjs
```
