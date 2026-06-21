const { $, safeNumber, money, el, csvCell, badgeCell, renderTableInto, tableNode, download, copyText, toast, bindTabs } = window.AppKit;

const offers = [
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
  const note = el("p", "Sell the top three first: ReturnReply Pro for fast ecommerce operations pain, AltText Cataloger for bulk repeatability, and Chargeback Evidence Kit for high-urgency revenue protection.");
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
  $("#focusOffer").value = "return-reply-pro";
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
  select.value = "return-reply-pro";
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
