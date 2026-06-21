const { $, safeNumber, money, el, csvCell, badgeCell, renderTableInto, tableNode, download, copyText, toast, bindTabs } = window.AppKit;

const offers = [
  {
    slug: "inboxready-deliverability-audit",
    name: "InboxReady Deliverability Audit",
    buyer: "Newsletter, outbound, ecommerce, or agency sender",
    offer: "Deliverability compliance audit",
    price: 149,
    retainer: 99,
    deliveryHours: 1,
    score: 96,
    channel: "Newsletter operators, small SaaS teams, DTC brands, outbound agencies",
    input: "Campaign export plus SPF, DKIM, DMARC, unsubscribe, bounce, and complaint posture",
    artifact: "Inbox readiness score, blocker list, watch items, DNS/campaign fix plan, CSV export",
    hook: "Email revenue can disappear quietly when authentication, unsubscribe, bounces, or complaints drift out of shape.",
    upsell: "Monthly sender monitoring plus pre-launch campaign checklist",
    risk: "Confirm DNS and header evidence before final delivery; do not guarantee inbox placement."
  },
  {
    slug: "ai-search-presence-monitor",
    name: "AI Search Presence Monitor",
    buyer: "SEO agency, local business, ecommerce brand, or B2B SaaS team",
    offer: "AI-search visibility audit",
    price: 199,
    retainer: 299,
    deliveryHours: 1.25,
    score: 94,
    channel: "SEO agencies, content teams, local business owners, ecommerce operators",
    input: "25 buyer-intent prompts with AI answer mentions, positions, competitors, citations, and gaps",
    artifact: "Visibility score, missing prompt list, competitor notes, and content-fix backlog",
    hook: "AI answers may mention competitors while skipping you; I can show the exact prompts and pages to fix first.",
    upsell: "Monthly prompt tracking and content backlog refresh",
    risk: "Treat AI answer snapshots as volatile; repeat prompt sets consistently."
  },
  {
    slug: "vibecode-security-smoke-test",
    name: "VibeCode Security Smoke Test",
    buyer: "AI-built app founder, no-code builder, indie SaaS, or small agency",
    offer: "Launch security smoke test",
    price: 249,
    retainer: 199,
    deliveryHours: 1.5,
    score: 88,
    channel: "AI builder communities, launch posts, no-code agencies, indie SaaS groups",
    input: "App routes, stack, launch date, and smoke-test findings for auth, secrets, payments, uploads, and LLM features",
    artifact: "Launch gate, critical findings, remediation queue, and retest checklist",
    hook: "Before you share the app publicly, I can catch the obvious launch blockers that AI-built apps often miss.",
    upsell: "Monthly release-gate retest for active builders",
    risk: "Position as a smoke test, not a full penetration test or compliance certification."
  },
  {
    slug: "supportbot-qa-harness",
    name: "SupportBot QA Harness",
    buyer: "SaaS support leader, Shopify support team, or helpdesk AI implementer",
    offer: "Bot QA regression pack",
    price: 299,
    retainer: 399,
    deliveryHours: 1.5,
    score: 86,
    channel: "Support leaders, helpdesk AI consultants, CX communities, Shopify app teams",
    input: "Support scenarios, approved policies, bot answers, required keywords, and forbidden claims",
    artifact: "Pass-rate report, critical gap queue, policy-drift notes, and regression CSV",
    hook: "A support bot that gives one wrong refund or policy answer can create tickets, refunds, and trust damage.",
    upsell: "Monthly bot regression run after policy or knowledge-base changes",
    risk: "Use approved policies as source of truth; do not evaluate legal or medical support claims without expert review."
  },
  {
    slug: "ai-disclosure-register-kit",
    name: "AI Disclosure Register Kit",
    buyer: "Marketing team, publisher, agency, or SMB using generated content",
    offer: "AI-content disclosure readiness pack",
    price: 199,
    retainer: 149,
    deliveryHours: 1,
    score: 84,
    channel: "Marketing agencies, content teams, publishers, ecommerce creative teams",
    input: "AI content inventory with asset, campaign, channel, AI use, human review, label status, and region",
    artifact: "Disclosure register, label queue, review gaps, reusable policy copy, CSV export",
    hook: "If your team uses generated images, videos, or copy, a clean register is the fastest way to know what needs labels and review.",
    upsell: "Monthly content inventory refresh and label QA",
    risk: "Sell operational readiness and evidence organization, not legal advice."
  },
  {
    slug: "return-reply-pro",
    name: "ReturnReply Pro",
    buyer: "DTC support lead or ecommerce operator",
    offer: "Return queue setup",
    price: 149,
    retainer: 199,
    deliveryHours: 1,
    score: 91,
    channel: "Shopify agencies, DTC founder communities, support job posts",
    input: "10-50 return requests with item, reason, days since order, condition, and value",
    artifact: "Decision queue, reply pack, exchange/store-credit save paths, CSV export",
    hook: "Returns are already costing you margin; I can turn a messy return inbox into a clear decision queue in 24 hours.",
    upsell: "Weekly return review plus policy copy updates",
    risk: "Do not promise legal compliance or override the merchant policy."
  },
  {
    slug: "alttext-cataloger",
    name: "AltText Cataloger",
    buyer: "Ecommerce catalog, SEO, or accessibility owner",
    offer: "Catalog alt-text pass",
    price: 199,
    retainer: 299,
    deliveryHours: 1.5,
    score: 89,
    channel: "Shopify stores, catalog teams, accessibility consultants, ecommerce agencies",
    input: "Image filename, product name, category, color, material, and image context",
    artifact: "Alt text CSV, accessibility flags, brief for catalog owner",
    hook: "I can clean up 100 product-image alt texts this week and return a CSV your team can upload.",
    upsell: "Monthly new-SKU alt text pass",
    risk: "Position as assistive content review, not a full accessibility audit."
  },
  {
    slug: "chargeback-evidence-kit",
    name: "Chargeback Evidence Kit",
    buyer: "Shopify, Stripe, or digital-goods merchant",
    offer: "Dispute evidence packet",
    price: 249,
    retainer: 349,
    deliveryHours: 1.25,
    score: 87,
    channel: "Merchant forums, Shopify partners, Stripe-heavy SaaS and digital product founders",
    input: "Dispute reason, deadline, order record, proof of delivery, customer history, policy screenshots",
    artifact: "Evidence checklist, missing-item flags, counterargument draft, customer contact note",
    hook: "If a dispute deadline is coming up, I can organize the evidence into a clean packet before submission.",
    upsell: "Monthly dispute-prevention checklist and template maintenance",
    risk: "Human review is mandatory; never guarantee win rate."
  },
  {
    slug: "invoice-nudge",
    name: "InvoiceNudge",
    buyer: "Freelancer, agency, consultant, or small B2B operator",
    offer: "AR follow-up setup",
    price: 99,
    retainer: 79,
    deliveryHours: 0.75,
    score: 84,
    channel: "LinkedIn, local B2B groups, freelancer communities, agency owners",
    input: "Client, invoice number, due date, amount, and payment status",
    artifact: "Reminder queue, message sequence, owner cash-flow brief",
    hook: "I can turn your overdue invoice list into a polite follow-up queue and ready-to-send reminders.",
    upsell: "Weekly AR queue maintenance",
    risk: "Keep tone supportive; do not present as collections or legal advice."
  },
  {
    slug: "reviewspark-local",
    name: "ReviewSpark Local",
    buyer: "Local service business owner",
    offer: "Review cleanup sprint",
    price: 149,
    retainer: 149,
    deliveryHours: 1.5,
    score: 80,
    channel: "Google Maps, Yelp, local SEO agencies, chambers of commerce",
    input: "Recent reviews with rating, text, date, and owner response status",
    artifact: "Reply bank, issue themes, 30-day recovery plan",
    hook: "I noticed a few public reviews that could use stronger owner replies; I can draft a cleanup pack this week.",
    upsell: "Monthly review response maintenance",
    risk: "Avoid fake reviews or reputation manipulation."
  },
  {
    slug: "quotequick-pro",
    name: "QuoteQuick Pro",
    buyer: "Home-service contractor or trade business",
    offer: "Quote response setup",
    price: 199,
    retainer: 99,
    deliveryHours: 1.25,
    score: 78,
    channel: "Contractor websites, Google local services, Thumbtack-like profiles",
    input: "Lead request, trade, rate, hours, materials, and markup",
    artifact: "Quote scope, SMS/email follow-up, terms, CSV estimate",
    hook: "I can help you answer quote requests faster with clear ranges and follow-up copy.",
    upsell: "Monthly seasonal quote-template refresh",
    risk: "Final estimates must be approved by the licensed professional."
  },
  {
    slug: "churn-save-script",
    name: "ChurnSave Script",
    buyer: "Subscription support or lifecycle owner",
    offer: "Cancellation-save script pack",
    price: 149,
    retainer: 249,
    deliveryHours: 1,
    score: 76,
    channel: "SaaS communities, app founders, membership operators",
    input: "Customer, plan, MRR, tenure, cancellation reason, risk, and support load",
    artifact: "Save queue, compliant save scripts, confirmation copy",
    hook: "I can turn cancellation reasons into support-safe save scripts without adding friction to cancellation.",
    upsell: "Monthly churn-reason review",
    risk: "Keep cancellation flows transparent and low-friction."
  },
  {
    slug: "menu-margin-lab",
    name: "MenuMargin Lab",
    buyer: "Independent restaurant, cafe, bar, or food truck",
    offer: "Menu margin audit",
    price: 149,
    retainer: 99,
    deliveryHours: 1.5,
    score: 73,
    channel: "Independent menus, local restaurant groups, food truck communities",
    input: "Menu item, category, price, cost, weekly sales, and prep minutes",
    artifact: "Margin table, price suggestions, promo copy",
    hook: "I can flag underpriced menu items and send back a clean price-action list.",
    upsell: "Monthly menu margin refresh",
    risk: "Recommendations are planning aids, not final pricing decisions."
  },
  {
    slug: "stayreply-kit",
    name: "StayReply Kit",
    buyer: "Airbnb host, co-host, or short-term rental manager",
    offer: "Host messaging setup",
    price: 99,
    retainer: 79,
    deliveryHours: 0.75,
    score: 70,
    channel: "Host groups, multi-property listings, co-host directories",
    input: "Property details, city, host name, scenario, and guest message",
    artifact: "Guest replies, scheduled messages, ops checklist, upsell note",
    hook: "I can build the core message pack hosts keep rewriting by hand.",
    upsell: "Seasonal guest message refresh",
    risk: "Host policies and platform rules stay with the owner."
  }
];

let plan = {};

function number(selector) {
  return safeNumber($(selector).value);
}

function selectedOffer() {
  return offers.find((offer) => offer.slug === $("#focusOffer").value) || offers[0];
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem("monetizationCommandCenter") || "{}");
    ["focusOffer", "leadsPerDay", "replyRate", "closeRate", "sprintDays", "retainerAttach", "deliveryHours", "personalization"].forEach((id) => {
      if (saved[id] !== undefined && $(`#${id}`)) $(`#${id}`).value = saved[id];
    });
  } catch {
    localStorage.removeItem("monetizationCommandCenter");
  }
}

function saveState() {
  const state = {};
  ["focusOffer", "leadsPerDay", "replyRate", "closeRate", "sprintDays", "retainerAttach", "deliveryHours", "personalization"].forEach((id) => {
    state[id] = $(`#${id}`).value;
  });
  try {
    localStorage.setItem("monetizationCommandCenter", JSON.stringify(state));
  } catch {
    toast("Local save unavailable");
  }
}

function calculate() {
  const offer = selectedOffer();
  const leads = number("#leadsPerDay") * number("#sprintDays");
  const warmReplies = leads * number("#replyRate") / 100;
  const sales = warmReplies * number("#closeRate") / 100;
  const retainerCustomers = sales * number("#retainerAttach") / 100;
  const deliveryHours = Math.max(number("#deliveryHours"), offer.deliveryHours);
  const hours = sales * deliveryHours + leads * 0.035;
  plan = {
    offer,
    leads,
    warmReplies,
    sales,
    retainerCustomers,
    sprintCash: sales * offer.price,
    mrr: retainerCustomers * offer.retainer,
    hours,
    effectiveRate: hours ? (sales * offer.price) / hours : 0
  };
  render();
  saveState();
}

function render() {
  $("#salesOut").textContent = plan.sales.toFixed(1);
  $("#cashOut").textContent = money(plan.sprintCash);
  $("#mrrOut").textContent = money(plan.mrr);
  $("#rateOut").textContent = `${money(plan.effectiveRate)}/h`;
  $("#sideOffer").textContent = plan.offer.name;
  $("#sideReason").textContent = plan.offer.hook;
  renderPriority();
  renderCalculator();
  renderScripts();
  renderDelivery();
}

function renderPriority() {
  const rows = [...offers].sort((a, b) => b.score - a.score).map((offer, index) => [
    index + 1,
    offer.name,
    money(offer.price),
    money(offer.retainer),
    badgeCell(String(offer.score), offer.score >= 85 ? "badge" : offer.score >= 75 ? "badge warn" : "badge bad"),
    offer.buyer
  ]);
  const topThree = [...offers].sort((a, b) => b.score - a.score).slice(0, 3).map((offer) => offer.name).join(", ");
  const note = el("p", `Sell one wedge at a time. Current top three: ${topThree}.`);
  const table = tableNode(["Rank", "Offer", "Entry", "Retainer", "Score", "Buyer"], rows);
  table.classList.add("score-table");
  $("#priorityOut").replaceChildren(note, table);
}

function renderCalculator() {
  const summary = el("div", null, "offer-summary");
  [
    ["Total Leads", Math.round(plan.leads)],
    ["Warm Replies", plan.warmReplies.toFixed(1)],
    ["Retainer Customers", plan.retainerCustomers.toFixed(1)]
  ].forEach(([label, value]) => {
    const card = el("div");
    card.append(el("strong", label), document.createTextNode(String(value)));
    summary.appendChild(card);
  });
  const calc = tableNode(["Metric", "Value"], [
    ["Selected offer", plan.offer.name],
    ["Entry price", money(plan.offer.price)],
    ["Monthly upsell", money(plan.offer.retainer)],
    ["Sprint cash", money(plan.sprintCash)],
    ["New MRR", money(plan.mrr)],
    ["Estimated labor", `${plan.hours.toFixed(1)} hours`]
  ]);
  $("#calcOut").replaceChildren(el("p", "Use conservative inputs until a real outreach batch proves otherwise.", "kpi-note"), summary, calc);
  renderTableInto($("#channelOut"), ["Channel", "Action"], [
    ["Primary", plan.offer.channel],
    ["Required input", plan.offer.input],
    ["Artifact", plan.offer.artifact],
    ["Upsell", plan.offer.upsell]
  ]);
}

function renderScripts() {
  const note = $("#personalization").value.trim();
  const script = `Subject: quick ${plan.offer.offer.toLowerCase()} for {{company}}\n\nHi {{name}},\n\n${note}\n\nI run a small productized service called ${plan.offer.name}. The offer is simple: send me the rows you already have, and I will return a ${plan.offer.artifact.toLowerCase()} within 24 hours.\n\nWhy now: ${plan.offer.hook}\n\nEntry price: ${money(plan.offer.price)}. If it helps, reply with \"sample\" and I will send a tiny anonymized example before you decide.\n\nBest,\n{{your_name}}\n\nFollow-up 1: Worth sending a 10-row sample so you can see the format?\nFollow-up 2: I can also do this as a one-time cleanup before you commit to anything monthly.\nClose: If timing is bad, should I check back next month or close the loop?`;
  $("#scriptOut").value = script;
}

function renderDelivery() {
  const rows = [
    ["1", "Collect minimum input", plan.offer.input],
    ["2", "Run tool", `Open projects/${plan.offer.slug}/src/index.html and generate the first artifact.`],
    ["3", "Human review", plan.offer.risk],
    ["4", "Package delivery", "Send CSV/TXT plus a short email summary with three recommendations."],
    ["5", "Ask for upsell", plan.offer.upsell]
  ];
  const checklist = tableNode(["Step", "Task", "Definition of Done"], rows);
  const list = el("ol", null, "step-list");
  ["Send invoice or checkout link before full delivery.", "Keep every first engagement under 60 minutes of labor.", "Ask for testimonial or anonymized sample after delivery.", "Convert only repeated requests into software features."].forEach((item) => list.appendChild(el("li", item)));
  $("#deliveryOut").replaceChildren(checklist, el("h2", "Operating Guardrails"), list);
}

function exportPlan() {
  const rows = [
    ["offer", "entry_price", "retainer", "score", "buyer", "channel", "input", "artifact"],
    ...offers.map((offer) => [offer.name, offer.price, offer.retainer, offer.score, offer.buyer, offer.channel, offer.input, offer.artifact])
  ];
  download("monetization-command-center.csv", rows.map((row) => row.map(csvCell).join(",")).join("\n"), "text/csv;charset=utf-8");
}

function resetDefaults() {
  localStorage.removeItem("monetizationCommandCenter");
  $("#focusOffer").value = "inboxready-deliverability-audit";
  $("#leadsPerDay").value = 30;
  $("#replyRate").value = 8;
  $("#closeRate").value = 20;
  $("#sprintDays").value = 14;
  $("#retainerAttach").value = 25;
  $("#deliveryHours").value = 1.25;
  $("#personalization").value = "I noticed your team already has the input rows needed, but the customer-facing response still looks manual.";
  calculate();
  toast("Defaults restored");
}

function init() {
  const select = $("#focusOffer");
  offers.forEach((offer) => {
    const option = document.createElement("option");
    option.value = offer.slug;
    option.textContent = offer.name;
    select.appendChild(option);
  });
  select.value = "inboxready-deliverability-audit";
  loadState();
  bindTabs();
  ["focusOffer", "leadsPerDay", "replyRate", "closeRate", "sprintDays", "retainerAttach", "deliveryHours", "personalization"].forEach((id) => {
    $(`#${id}`).addEventListener("input", calculate);
  });
  $("#generateBtn").addEventListener("click", calculate);
  $("#exportBtn").addEventListener("click", exportPlan);
  $("#copyBtn").addEventListener("click", () => copyText($("#scriptOut").value));
  $("#resetBtn").addEventListener("click", resetDefaults);
  calculate();
}

init();
