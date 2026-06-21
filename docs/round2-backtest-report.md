# Round 2 Backtest Report

The second batch was backtested with a five-factor score: market demand, single-product clarity, monetization path, delivery speed, and risk control. A project passes only if demand is at least 8, single-product clarity is at least 9, and total score is at least 40 out of 50.

## Results

| Project | Demand | Single Product | Monetization | Delivery Speed | Risk Control | Total | Outcome |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Chargeback Evidence Kit | 9 | 9 | 8 | 8 | 7 | 41 | Pass |
| ReturnReply Pro | 9 | 9 | 8 | 9 | 8 | 43 | Pass |
| AltText Cataloger | 8 | 10 | 8 | 9 | 8 | 43 | Pass |
| ChurnSave Script | 8 | 9 | 8 | 9 | 7 | 41 | Pass |

## Improvements After Backtest

- Kept all four products as single-artifact tools instead of broader platforms.
- Added CSV import/export to every app because each buyer already owns rows in spreadsheets.
- Added DOM-safe rendering and CSV formula-injection protection through the global security smoke test.
- Added policy/compliance caveats in apps and README files for dispute, return, accessibility, and cancellation workflows.
- Updated the portfolio hub and README so projects 06-09 are discoverable from the same entry point as projects 01-05.

## Priority Recommendation

Start sales tests in this order:

1. ReturnReply Pro: strongest blend of demand, delivery speed, and low review risk.
2. AltText Cataloger: cleanest single-product boundary and easiest bulk delivery.
3. Chargeback Evidence Kit: strong pain and willingness to pay, but more risk-sensitive.
4. ChurnSave Script: good productized service, but cancellation copy needs careful customer policy review.
