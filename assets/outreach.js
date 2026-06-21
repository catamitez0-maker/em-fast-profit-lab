(() => {
  const STATUS_OPTIONS = ["ready", "sent", "warm", "sample requested", "paid", "not now"];
  const STATUS_KEY = "em-outreach-status-v2";
  const OFFER_COPY = {
    "ReturnReply Pro": {
      subject: "quick ReturnReply Pro cleanup",
      service: "ReturnReply Pro",
      summary: "You send 10-50 return request rows, and I send back a decision queue, customer replies, and exchange/store-credit paths within 24 hours.",
      price: "The first pass is $149."
    },
    "AltText Cataloger": {
      subject: "quick AltText Cataloger cleanup",
      service: "AltText Cataloger",
      summary: "You send product image rows, and I send back a 100-image alt text CSV with accessibility flags within 24 hours.",
      price: "The first pass is $199."
    },
    "Chargeback Evidence Kit": {
      subject: "quick Chargeback Evidence Kit cleanup",
      service: "Chargeback Evidence Kit",
      summary: "You send one anonymized dispute or refund record, and I send back an evidence checklist, missing-item list, and counterargument draft within 24 hours.",
      price: "The first pass is $249."
    },
    InvoiceNudge: {
      subject: "quick InvoiceNudge cleanup",
      service: "InvoiceNudge",
      summary: "You send five open invoice or order-follow-up rows, and I send back a polite follow-up queue and reminder sequence within 24 hours.",
      price: "The first pass is $99."
    }
  };

  const state = {
    leads: [],
    statuses: readStatuses()
  };

  const $ = (selector) => document.querySelector(selector);

  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined && text !== null) node.textContent = String(text);
    if (className) node.className = className;
    return node;
  }

  function csvToRows(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];

      if (char === '"' && quoted && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === "," && !quoted) {
        row.push(cell);
        cell = "";
      } else if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && next === "\n") index += 1;
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }

    row.push(cell);
    rows.push(row);
    return rows.filter((cells) => cells.some((value) => String(value).trim()));
  }

  function rowsToObjects(rows) {
    const [headers, ...body] = rows;
    return body.map((row) => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = row[index] || "";
      });
      return item;
    });
  }

  function readStatuses() {
    try {
      return JSON.parse(localStorage.getItem(STATUS_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveStatuses() {
    try {
      localStorage.setItem(STATUS_KEY, JSON.stringify(state.statuses));
    } catch {
      showToast("Status storage unavailable");
    }
  }

  function isEmail(route) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(String(route).trim());
  }

  function pitchFor(lead) {
    const offer = OFFER_COPY[lead.offer] || OFFER_COPY["ReturnReply Pro"];
    return [
      "Hi there,",
      "",
      lead.personalized_opening,
      "",
      `I run a small productized service called ${offer.service}. ${offer.summary}`,
      "",
      `${offer.price} If helpful, reply with 'sample' and I will send an anonymized example before you decide.`,
      "",
      "Best,",
      "{your_name}",
      "",
      "If this is not relevant, reply 'not now' and I will close the loop."
    ].join("\n");
  }

  function mailtoFor(lead) {
    const offer = OFFER_COPY[lead.offer] || OFFER_COPY["ReturnReply Pro"];
    const subject = `${offer.subject} for ${lead.prospect}`;
    return `mailto:${lead.contact_route}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(pitchFor(lead))}`;
  }

  function statusFor(lead) {
    return state.statuses[lead.priority] || "ready";
  }

  function renderLead(lead) {
    const article = el("article", null, "lead-row");
    article.dataset.status = statusFor(lead);
    article.dataset.search = [
      lead.prospect,
      lead.offer,
      lead.contact_route,
      lead.personalized_opening,
      lead.why_fit,
      lead.source_note
    ].join(" ").toLowerCase();

    article.appendChild(el("div", lead.priority, "lead-number"));

    const title = el("div", null, "lead-title");
    title.appendChild(el("strong", lead.prospect));
    title.appendChild(el("span", lead.offer, "tag"));
    title.appendChild(el("span", statusFor(lead), "status-pill"));
    article.appendChild(title);

    const contact = el("div");
    contact.appendChild(el("span", "Contact", "lead-label"));
    contact.appendChild(el("p", lead.contact_route, "lead-note"));
    const source = el("a", "Check source", "source-link");
    source.href = lead.public_source;
    source.target = "_blank";
    source.rel = "noopener";
    contact.appendChild(source);
    article.appendChild(contact);

    const opening = el("div");
    opening.appendChild(el("span", "Personalized opening", "lead-label"));
    opening.appendChild(el("p", lead.personalized_opening, "lead-note"));
    article.appendChild(opening);

    const actions = el("div", null, "lead-actions");
    const primary = el("a", isEmail(lead.contact_route) ? "Open email" : "Open contact page", "button mini");
    primary.href = isEmail(lead.contact_route) ? mailtoFor(lead) : lead.public_source;
    if (!isEmail(lead.contact_route)) {
      primary.target = "_blank";
      primary.rel = "noopener";
    }
    actions.appendChild(primary);

    const copy = el("button", "Copy pitch", "button secondary mini");
    copy.type = "button";
    copy.addEventListener("click", () => copyText(pitchFor(lead)));
    actions.appendChild(copy);

    const select = el("select", null, "status-select");
    STATUS_OPTIONS.forEach((status) => {
      const option = el("option", status);
      option.value = status;
      select.appendChild(option);
    });
    select.value = statusFor(lead);
    select.addEventListener("change", () => {
      state.statuses[lead.priority] = select.value;
      article.dataset.status = select.value;
      title.querySelector(".status-pill").textContent = select.value;
      saveStatuses();
      updateCounts();
      applyFilters();
    });
    actions.appendChild(select);
    article.appendChild(actions);
    return article;
  }

  function renderLeads() {
    const list = $("#leadList");
    list.replaceChildren();
    state.leads.forEach((lead) => list.appendChild(renderLead(lead)));
    updateCounts();
    applyFilters();
  }

  function updateCounts() {
    const rows = [...document.querySelectorAll(".lead-row")];
    const byStatus = (status) => rows.filter((row) => row.dataset.status === status).length;
    $("#total").textContent = rows.length;
    $("#ready").textContent = byStatus("ready");
    $("#sent").textContent = byStatus("sent");
    $("#warm").textContent = byStatus("warm") + byStatus("sample requested");
    $("#paid").textContent = byStatus("paid");
  }

  function applyFilters() {
    const query = $("#filter").value.trim().toLowerCase();
    const status = $("#statusFilter").value;
    document.querySelectorAll(".lead-row").forEach((row) => {
      const matchesQuery = !query || row.dataset.search.includes(query);
      const matchesStatus = status === "all" || row.dataset.status === status;
      row.hidden = !(matchesQuery && matchesStatus);
    });
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Pitch copied");
    } catch {
      showToast("Copy unavailable");
    }
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1500);
  }

  function copyTopReady() {
    const row = [...document.querySelectorAll(".lead-row")].find((item) => !item.hidden && item.dataset.status === "ready");
    if (!row) {
      showToast("No visible ready lead");
      return;
    }
    row.querySelector("button").click();
  }

  async function init() {
    $("#filter").addEventListener("input", applyFilters);
    $("#statusFilter").addEventListener("change", applyFilters);
    $("#copyTop").addEventListener("click", copyTopReady);

    try {
      const response = await fetch("data/prospect-leads.csv", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const csv = await response.text();
      state.leads = rowsToObjects(csvToRows(csv));
      renderLeads();
    } catch {
      $("#leadList").replaceChildren(el("div", "Unable to load data/prospect-leads.csv. Use a local web server or the published GitHub Pages URL.", "empty-state"));
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
