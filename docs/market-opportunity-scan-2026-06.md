# Market Opportunity Scan: Next 5 Money-Lab Projects

Date: 2026-06-21

## Decision

Build the next money-lab batch around five narrow, service-led products that can be sold before a full SaaS build. The filter is:

- current demand signal from 2026 platform, regulatory, or behavior shifts;
- clear buyer with budget or pain;
- unmet need not already covered by the current EM ecommerce operations portfolio;
- first MVP deliverable can be a static tool, CSV workflow, checklist, or productized audit;
- first revenue can happen through a paid pilot in days, not months.

## Selected 5

| Rank | Project | Buyer | First Paid Offer | Why This Is Worth Building Now |
| --- | --- | --- | --- | --- |
| 1 | AI Search Presence Monitor | SEO agencies, local businesses, ecommerce brands | $199 AI-search visibility audit | Search is moving into AI Overviews, AI Mode, query fan-out, and agentic experiences. Buyers need to know whether they are cited, omitted, or misrepresented. |
| 2 | InboxReady Deliverability Audit | Small businesses, newsletters, outbound teams, agencies | $149 deliverability compliance audit | Gmail and Yahoo requirements are concrete and technical; many senders need SPF/DKIM/DMARC, one-click unsubscribe, complaint-rate, and sending-limit checks. |
| 3 | VibeCode Security Smoke Test | AI-built app founders, no-code/vibe-code builders, small agencies | $249 launch security smoke test | AI coding adoption is high, trust is weak, and AI/LLM app risks are now formal enough to productize as a pre-launch review. |
| 4 | SupportBot QA Harness | Customer support teams, SaaS operators, Shopify support teams | $299 bot QA pack for 50 support scenarios | Support teams are investing in AI, but maturity is low and customers still punish bad first-contact resolution. |
| 5 | AI Disclosure Register Kit | Marketing teams, publishers, agencies, SMBs using generative AI | $199 AI-content disclosure readiness pack | EU AI Act transparency obligations for AI-generated content make content inventory, labeling, and evidence logs a near-term need. |

## Evidence And Opportunity Logic

### 1. AI Search Presence Monitor

Google now publishes explicit guidance for generative AI features in Search, including AI Overviews and AI Mode, and says AI search still depends on crawlability, technical SEO, useful content, local business data, and ecommerce product data. Google’s 2026 Search update describes AI agents and an upgraded AI-powered Search box as a major shift. SparkToro’s 2026 zero-click analysis argues that less than one third of Google searches still send a click, while Cloudflare data shows AI crawler activity can spike quickly.

The gap: SMBs and agencies can buy broad SEO tooling, but they often cannot answer one tactical question: “For the 25 questions our buyers ask, does AI search mention us, competitors, or neither?” A small monitor can produce a sales-useful audit quickly.

MVP:

- prompt list builder by buyer intent;
- manual or semi-automated result capture;
- citation/mention scoring;
- local/ecommerce presence checklist;
- content-fix backlog.

Why first: fastest to package, easiest to sell to agencies, and does not require sensitive customer data.

### 2. InboxReady Deliverability Audit

Gmail sender guidelines require DMARC alignment for direct email and one-click unsubscribe for high-volume marketing/subscribed messages. Yahoo’s sender guidance requires list-unsubscribe support, visible unsubscribe links, honoring unsubscribes within 2 days, and keeping spam complaint rates below 0.3%. Google Workspace’s published limits also create practical constraints around daily messages, external recipients, unique recipients, and per-message recipient caps.

The gap: email providers state the rules, but small businesses still struggle to translate DNS records, message headers, unsubscribe flow, and sending quotas into a pass/fail action list.

MVP:

- DNS record checker for SPF, DKIM selector notes, DMARC policy;
- message-header checklist;
- one-click unsubscribe evidence checklist;
- Google Workspace limit planner;
- “fix this with your DNS/email provider” report.

Why second: extremely fast to build and sell, with clear pass/fail output.

### 3. VibeCode Security Smoke Test

Stack Overflow reports more than 84% of respondents used or planned to use AI tools in 2025, while only 29% said they trust AI. OWASP’s LLM Top 10 names prompt injection, insecure output handling, training data poisoning, model denial of service, and supply chain vulnerabilities as core risks. The practical buyer gap is not enterprise AppSec; it is the founder shipping an AI-built app with no review loop.

The gap: enterprise security tools exist, but the no-code/vibe-code buyer needs a simple launch gate: no exposed secrets, no dangerous DOM patterns, no obvious auth/session mistakes, safe AI output handling, and basic deployment headers.

MVP:

- repo/file scanner for high-risk patterns;
- env/secret hygiene checklist;
- frontend XSS/dangerous DOM check;
- LLM output handling checklist;
- launch-readiness score and fix list.

Why third: higher technical depth than InboxReady, but very aligned with this workspace and easy to demonstrate through code audits.

### 4. SupportBot QA Harness

Intercom’s 2026 customer service transformation report says 82% of senior leaders invested in AI for customer service over the last 12 months and 87% plan to invest in 2026, but only 10% report mature deployment. Zendesk’s CX Trends says 83% of consumers still believe experiences should be better, and 85% of CX leaders say customers will drop brands over unresolved issues even on first contact. Gartner also warns that GenAI cost per resolution may exceed $3 by 2030 and that AI-related regulation may increase assisted service volume.

The gap: teams are deploying AI support, but many lack regression tests for hallucination, policy mistakes, escalation, and missing knowledge.

MVP:

- upload FAQ/policy text;
- test scenario CSV;
- expected answer and escalation rule fields;
- generated pass/fail QA report;
- monthly regression pack.

Why fourth: strong demand, but better after the first three because it needs richer customer input and careful scoring.

### 5. AI Disclosure Register Kit

The European Commission says the AI Act entered into force on 1 August 2024 and is broadly applicable from 2 August 2026, with staged exceptions. The Commission’s Code of Practice on Transparency of AI-Generated Content says Article 50 transparency obligations for providers and deployers apply from 2 August 2026, covering marking, detection, and labeling of AI-generated content, deepfakes, and certain AI-generated publications.

The gap: content teams may know “we use AI,” but lack an inventory of which assets were AI-generated, which labels apply, who reviewed them, and what disclosure text was used.

MVP:

- AI-generated asset inventory CSV;
- disclosure label generator;
- content-review status board;
- evidence register export;
- disclaimer: operational support, not legal advice.

Why fifth: the timing is strong, but it has legal/compliance risk and should be sold as evidence-organization plus operational readiness, not legal compliance certification.

## Recommended Build Order

1. Build **InboxReady Deliverability Audit** first. It is the smallest MVP with the clearest pass/fail checks and fastest paid pilot.
2. Build **AI Search Presence Monitor** second. It has the best agency resale potential and strongest market narrative.
3. Build **VibeCode Security Smoke Test** third. It uses our existing code-audit strength and can be sold to AI builders.
4. Build **SupportBot QA Harness** fourth. It is valuable but needs more careful evaluation design.
5. Build **AI Disclosure Register Kit** fifth. It is timely but should be handled carefully because of regulatory claims.

## First 7-Day Execution Plan

| Day | Action |
| --- | --- |
| 1 | Scaffold InboxReady as a static tool: domain input, DNS checklist, sender requirement checklist, exportable report. |
| 2 | Create 20 outreach leads: newsletters, local agencies, small SaaS, Shopify brands with active newsletters. |
| 3 | Sell $149 InboxReady audit with a sample domain report. |
| 4 | Scaffold AI Search Presence Monitor with a 25-prompt manual capture workflow. |
| 5 | Create sample AI-search visibility report for EM Fast-Profit Lab and one public local business. |
| 6 | Scaffold VibeCode Security Smoke Test using current repo audit rules as seed checks. |
| 7 | Publish the new opportunity batch page and add 3 paid-pilot offers to `/pay/`. |

## Source Links

- Google Search Central, generative AI Search optimization: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google Search I/O 2026 update: https://blog.google/products-and-platforms/products/search/search-io-2026/
- SparkToro zero-click 2026 analysis: https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/
- Cloudflare crawl-to-click AI bot data: https://blog.cloudflare.com/crawlers-click-ai-bots-training/
- Gmail sender guidelines: https://support.google.com/mail/answer/81126?hl=en
- Yahoo sender best practices: https://senders.yahooinc.com/best-practices/
- Google Workspace Gmail sending limits: https://knowledge.workspace.google.com/admin/gmail/gmail-sending-limits-in-google-workspace
- Stack Overflow AI trust gap: https://stackoverflow.blog/2026/02/18/closing-the-developer-ai-trust-gap/
- OWASP Top 10 for LLM Applications: https://owasp.org/www-project-top-10-for-large-language-model-applications/
- Intercom 2026 Customer Service Transformation Report: https://www.intercom.com/customer-transformation-report
- Zendesk CX Trends 2026: https://cxtrends.zendesk.com/
- Gartner customer service GenAI cost prediction: https://www.gartner.com/en/newsroom/press-releases/2026-01-26-gartner-predicts-genai-cost-per-resolution-for-customer-service-will-exceed-offshore-human-agent-costs-by-2030
- European Commission AI Act timeline: https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
- European Commission Code of Practice on Transparency of AI-Generated Content: https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content
- EU AI Act Article 50 explainer text: https://artificialintelligenceact.eu/article/50/
