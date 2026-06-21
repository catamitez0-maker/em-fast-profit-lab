const appName = "ReviewSpark Local";

const sampleReviews = [
  {
    platform: "Google",
    rating: 5,
    author: "Maria S",
    date: "2026-06-01",
    text: "The staff was patient and explained everything clearly. I loved how clean the office felt.",
    status: "unanswered"
  },
  {
    platform: "Google",
    rating: 2,
    author: "Jason T",
    date: "2026-06-03",
    text: "I waited almost 40 minutes past my appointment time and nobody updated me.",
    status: "unanswered"
  },
  {
    platform: "Yelp",
    rating: 4,
    author: "Priya K",
    date: "2026-06-04",
    text: "Great service overall. The price was a little higher than I expected but the quality was solid.",
    status: "unanswered"
  },
  {
    platform: "Facebook",
    rating: 5,
    author: "Chris M",
    date: "2026-06-06",
    text: "Fast scheduling and friendly front desk. I will come back.",
    status: "unanswered"
  },
  {
    platform: "Google",
    rating: 3,
    author: "Angela R",
    date: "2026-06-08",
    text: "The technician was nice, but the follow-up call never happened.",
    status: "unanswered"
  }
];

const topicMap = [
  { key: "staff", words: ["staff", "team", "front desk", "technician", "doctor", "server", "employee"], label: "team experience" },
  { key: "speed", words: ["fast", "quick", "wait", "late", "slow", "minutes", "appointment"], label: "speed and timing" },
  { key: "clean", words: ["clean", "spotless", "dirty", "office", "room"], label: "cleanliness" },
  { key: "price", words: ["price", "cost", "expensive", "cheap", "value", "quote"], label: "pricing clarity" },
  { key: "quality", words: ["quality", "great", "excellent", "bad", "solid", "poor"], label: "service quality" },
  { key: "followup", words: ["follow-up", "follow up", "call", "updated", "response", "communication"], label: "follow-up communication" },
  { key: "schedule", words: ["scheduling", "schedule", "appointment", "booking"], label: "scheduling" }
];

let currentReviews = [];

const $ = (selector) => document.querySelector(selector);

function getBusinessContext() {
  return {
    businessName: $("#businessName").value.trim() || "the business",
    industry: $("#industry").value.trim() || "local business",
    city: $("#city").value.trim() || "your area",
    ownerName: $("#ownerName").value.trim() || "the owner",
    tone: document.querySelector("input[name='tone']:checked")?.value || "warm"
  };
}

function parsePastedReviews(raw) {
  return raw
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const parts = line.split("|").map((part) => part.trim());
      if (parts.length >= 3 && Number.isFinite(Number(parts[0]))) {
        return {
          platform: "Google",
          rating: clampRating(Number(parts[0])),
          author: parts[1] || `Customer ${index + 1}`,
          date: new Date().toISOString().slice(0, 10),
          text: parts.slice(2).join(" | "),
          status: "unanswered"
        };
      }

      return {
        platform: "Google",
        rating: inferRating(line),
        author: `Customer ${index + 1}`,
        date: new Date().toISOString().slice(0, 10),
        text: line,
        status: "unanswered"
      };
    });
}

function parseCsv(text) {
  const rows = csvToRows(text);
  if (!rows.length) return [];

  const headers = rows[0].map((header) => header.trim().toLowerCase());
  const hasHeader = headers.some((header) => ["rating", "author", "text", "review"].includes(header));
  const dataRows = hasHeader ? rows.slice(1) : rows;

  return dataRows
    .filter((row) => row.some(Boolean))
    .map((row, index) => {
      const get = (name, fallbackIndex) => {
        const headerIndex = headers.indexOf(name);
        return row[headerIndex >= 0 ? headerIndex : fallbackIndex] || "";
      };

      const text = get("text", 4) || get("review", 4) || row[row.length - 1] || "";

      return {
        platform: get("platform", 0) || "Google",
        rating: clampRating(Number(get("rating", 1)) || inferRating(text)),
        author: get("author", 2) || `Customer ${index + 1}`,
        date: get("date", 3) || new Date().toISOString().slice(0, 10),
        text,
        status: get("status", 5) || "unanswered"
      };
    });
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
  return rows;
}

function clampRating(value) {
  if (!Number.isFinite(value)) return 3;
  return Math.max(1, Math.min(5, Math.round(value)));
}

function inferRating(text) {
  const lower = text.toLowerCase();
  const negativeHits = ["bad", "wait", "late", "rude", "dirty", "never", "expensive", "slow"].filter((word) => lower.includes(word)).length;
  const positiveHits = ["great", "excellent", "friendly", "clean", "fast", "loved", "patient", "quality"].filter((word) => lower.includes(word)).length;
  if (negativeHits > positiveHits) return 2;
  if (positiveHits >= 2) return 5;
  if (positiveHits === 1) return 4;
  return 3;
}

function extractTopics(text) {
  const lower = text.toLowerCase();
  const topics = topicMap
    .filter((topic) => topic.words.some((word) => lower.includes(word)))
    .map((topic) => topic.label);
  return topics.length ? topics : ["customer experience"];
}

function getSentiment(review) {
  if (review.rating >= 4) return "positive";
  if (review.rating <= 2) return "negative";
  return "mixed";
}

function getUrgency(review) {
  const lower = review.text.toLowerCase();
  const urgentWords = ["wait", "late", "never", "rude", "dirty", "unsafe", "refund", "charged", "complaint"];
  if (review.rating <= 2 || urgentWords.some((word) => lower.includes(word))) return "same day";
  if (review.rating === 3) return "this week";
  return "normal";
}

function detailPhrase(topics) {
  const primary = topics[0];
  const map = {
    "team experience": "your note about our team",
    "speed and timing": "your feedback about timing",
    cleanliness: "your comment about the space",
    "pricing clarity": "your note about pricing",
    "service quality": "your feedback on the quality of the visit",
    "follow-up communication": "your note about follow-up communication",
    scheduling: "your feedback about scheduling",
    "customer experience": "the details you shared"
  };
  return map[primary] || "the details you shared";
}

function generateReply(review, context) {
  const sentiment = getSentiment(review);
  const topics = extractTopics(review.text);
  const detail = detailPhrase(topics);
  const name = review.author.split(" ")[0].replace(/[^a-z]/gi, "") || "there";
  const signature = context.ownerName ? ` - ${context.ownerName}, ${context.businessName}` : ` - ${context.businessName}`;

  const openers = {
    warm: `Hi ${name}, thank you for taking the time to share this.`,
    direct: `Hi ${name}, thanks for the feedback.`,
    polished: `Hi ${name}, thank you for your thoughtful review.`
  };

  if (sentiment === "negative") {
    return `${openers[context.tone]} I am sorry ${detail} did not match the standard we want for every ${context.industry} visit. We are reviewing this with the team so we can improve the experience for guests in ${context.city}. Please contact us directly so we can understand what happened and make the next step easier.${signature}`;
  }

  if (sentiment === "mixed") {
    return `${openers[context.tone]} We appreciate ${detail}, and we are glad there were parts of the experience that worked well. We are also noting the area you called out so the team can tighten it up for future visits in ${context.city}.${signature}`;
  }

  const closer = context.tone === "direct"
    ? "We appreciate your trust and hope to see you again soon."
    : "It means a lot to know that came through, and we will share your note with the team.";

  return `${openers[context.tone]} We are happy to hear ${detail} made your experience with ${context.businessName} a good one. ${closer}${signature}`;
}

function scoreGenericRisk(reply, review) {
  const topics = extractTopics(review.text);
  const lowerReply = reply.toLowerCase();
  const mentionsTopic = topics.some((topic) => topic.split(" ").some((token) => token.length > 4 && lowerReply.includes(token)));
  const short = reply.length < 170;
  const cliche = ["valued customer", "sorry for any inconvenience", "we appreciate your business"].some((phrase) => lowerReply.includes(phrase));
  return [!mentionsTopic, short, cliche].filter(Boolean).length;
}

function enrichReviews(reviews) {
  const context = getBusinessContext();
  return reviews.map((sourceReview, index) => {
    const source = sourceReview && typeof sourceReview === "object" ? sourceReview : {};
    const review = {
      platform: String(source.platform || "Google"),
      rating: clampRating(Number(source.rating)),
      author: String(source.author || `Customer ${index + 1}`),
      date: String(source.date || new Date().toISOString().slice(0, 10)),
      text: String(source.text || ""),
      status: String(source.status || "unanswered"),
      reply: typeof source.reply === "string" ? source.reply : ""
    };
    const reply = review.reply || generateReply(review, context);
    return {
      ...review,
      topics: extractTopics(review.text),
      sentiment: getSentiment(review),
      urgency: getUrgency(review),
      reply,
      genericRisk: scoreGenericRisk(reply, review)
    };
  });
}

function render() {
  currentReviews = enrichReviews(currentReviews);
  renderMetrics();
  renderReplies();
  renderCampaign();
  renderBrief();
  try {
    localStorage.setItem("reviewspark-state", JSON.stringify(currentReviews));
  } catch {
    // Local storage can be unavailable or full in private browser modes.
  }
}

function renderMetrics() {
  const count = currentReviews.length;
  const avg = count ? currentReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / count : 0;
  const urgent = currentReviews.filter((review) => review.urgency === "same day").length;
  const generic = currentReviews.filter((review) => review.genericRisk > 0).length;

  $("#reviewCount").textContent = count;
  $("#avgRating").textContent = avg.toFixed(1);
  $("#urgentCount").textContent = urgent;
  $("#genericRisk").textContent = generic;
}

function renderReplies() {
  const list = $("#replyList");
  list.replaceChildren();

  if (!currentReviews.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Paste reviews or load the sample to generate replies.";
    list.appendChild(empty);
    return;
  }

  currentReviews.forEach((review, index) => {
    list.appendChild(createReplyItem(review, index));
  });

  list.querySelectorAll("[data-reply-index]").forEach((textarea) => {
    textarea.addEventListener("input", (event) => {
      const index = Number(event.target.dataset.replyIndex);
      currentReviews[index].reply = event.target.value;
      currentReviews[index].genericRisk = scoreGenericRisk(event.target.value, currentReviews[index]);
      renderMetrics();
    });
  });

  list.querySelectorAll("[data-copy-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const review = currentReviews[Number(button.dataset.copyIndex)];
      copyText(review.reply);
    });
  });

  list.querySelectorAll("[data-refresh-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.refreshIndex);
      currentReviews[index].reply = generateReply(currentReviews[index], getBusinessContext());
      render();
    });
  });
}

function createReplyItem(review, index) {
  const item = document.createElement("article");
  item.className = "reply-item";

  const head = document.createElement("div");
  head.className = "reply-head";

  const details = document.createElement("div");
  const title = document.createElement("h3");
  title.append(document.createTextNode(review.author), " ");
  const rating = document.createElement("span");
  rating.setAttribute("aria-label", "rating");
  rating.textContent = `${"*".repeat(review.rating)}${"-".repeat(5 - review.rating)}`;
  title.appendChild(rating);

  const meta = document.createElement("p");
  meta.textContent = `${review.platform} | ${review.date} | ${review.text}`;
  details.append(title, meta);

  const badges = document.createElement("div");
  badges.className = "badges";
  badges.append(
    createBadge(review.urgency, review.urgency === "same day" ? "bad" : "warn"),
    createBadge(review.topics[0] || "customer experience"),
    createBadge(`risk ${review.genericRisk}`, review.genericRisk ? "warn" : "")
  );

  head.append(details, badges);

  const body = document.createElement("div");
  body.className = "reply-body";
  const textarea = document.createElement("textarea");
  textarea.dataset.replyIndex = String(index);
  textarea.value = review.reply;

  const actions = document.createElement("div");
  actions.className = "reply-actions";
  const copy = document.createElement("button");
  copy.className = "secondary";
  copy.type = "button";
  copy.dataset.copyIndex = String(index);
  copy.textContent = "Copy";
  const refresh = document.createElement("button");
  refresh.className = "secondary";
  refresh.type = "button";
  refresh.dataset.refreshIndex = String(index);
  refresh.textContent = "Refresh";
  actions.append(copy, refresh);

  body.append(textarea, actions);
  item.append(head, body);
  return item;
}

function createBadge(label, tone = "") {
  const badge = document.createElement("span");
  badge.className = tone ? `badge ${tone}` : "badge";
  badge.textContent = label;
  return badge;
}
function renderCampaign() {
  const context = getBusinessContext();
  const topics = topTopics();
  const bestTopic = topics[0] || "the experience";

  $("#smsOutput").value = `Hi {{first_name}}, this is ${context.businessName}. Thank you for visiting us. If you have 30 seconds, would you share an honest review about your experience? Your feedback helps local customers in ${context.city} choose with confidence: {{review_link}}`;

  $("#emailOutput").value = `Subject: Thank you for choosing ${context.businessName}\n\nHi {{first_name}},\n\nThank you for trusting us with your recent visit. If you have a moment, we would be grateful for an honest review. Reviews help our team improve and help neighbors in ${context.city} know what to expect.\n\nLeave a review here: {{review_link}}\n\nThank you,\n${context.ownerName}`;

  $("#postOutput").value = [
    `1. This week at ${context.businessName}: what customers are saying about ${bestTopic}.`,
    `2. Behind the scenes: how our team keeps ${topics[1] || "the customer experience"} consistent for every visit.`,
    `3. Local trust note: why recent reviews help ${context.city} customers choose the right ${context.industry}.`,
    "4. Thank-you post: highlight a real customer theme without quoting private details."
  ].join("\n\n");
}

function renderBrief() {
  const context = getBusinessContext();
  const urgent = currentReviews.filter((review) => review.urgency === "same day");
  const topics = topTopics();
  const avg = currentReviews.length
    ? (currentReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / currentReviews.length).toFixed(1)
    : "0.0";

  $("#briefOutput").value = [
    `Client: ${context.businessName}`,
    `Location: ${context.city}`,
    `Average rating in batch: ${avg}`,
    `Reviews processed: ${currentReviews.length}`,
    `Same-day attention: ${urgent.length}`,
    "",
    "Top themes:",
    ...topics.slice(0, 5).map((topic, index) => `${index + 1}. ${topic}`),
    "",
    "Recommended next actions:",
    "1. Post same-day replies for low-rating reviews first.",
    "2. Personalize replies where the generic-risk score is above 0.",
    "3. Ask recent happy customers for honest reviews using the SMS template.",
    "4. Publish one Google Business Profile post based on the strongest positive theme.",
    "",
    "Commercial angle:",
    "Offer a $149 cleanup sprint now, then a $49/month response maintenance plan."
  ].join("\n");
}

function topTopics() {
  const counts = new Map();
  currentReviews.forEach((review) => {
    extractTopics(review.text).forEach((topic) => {
      counts.set(topic, (counts.get(topic) || 0) + 1);
    });
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([topic]) => topic);
}

function exportCsv() {
  if (!currentReviews.length) {
    showToast("No reviews to export");
    return;
  }

  const headers = ["platform", "rating", "author", "date", "text", "urgency", "topics", "reply"];
  const rows = currentReviews.map((review) => [
    review.platform,
    review.rating,
    review.author,
    review.date,
    review.text,
    review.urgency,
    review.topics.join("; "),
    review.reply
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "reviewspark-replies.csv";
  link.click();
  URL.revokeObjectURL(url);
  showToast("CSV exported");
}

function csvCell(value) {
  let text = String(value ?? "");
  if (/^[=+\-@]/.test(text.trim())) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function copyAllReplies() {
  if (!currentReviews.length) {
    showToast("No replies to copy");
    return;
  }

  const text = currentReviews
    .map((review) => `${review.author} (${review.rating} stars)\n${review.reply}`)
    .join("\n\n");
  copyText(text);
}

async function copyText(text) {
  if (!navigator.clipboard?.writeText) {
    showToast("Copy unavailable");
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied");
  } catch {
    showToast("Copy failed");
  }
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function bindEvents() {
  $("#loadSampleBtn").addEventListener("click", () => {
    currentReviews = sampleReviews.map((review) => ({ ...review }));
    $("#reviewText").value = currentReviews.map((review) => `${review.rating} | ${review.author} | ${review.text}`).join("\n");
    render();
    showToast("Sample loaded");
  });

  $("#analyzeBtn").addEventListener("click", () => {
    const pasted = parsePastedReviews($("#reviewText").value);
    currentReviews = pasted.length ? pasted : currentReviews;
    render();
    showToast("Replies generated");
  });

  $("#exportBtn").addEventListener("click", exportCsv);
  $("#copyAllBtn").addEventListener("click", copyAllReplies);

  $("#csvInput").addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    currentReviews = parseCsv(text);
    $("#reviewText").value = currentReviews.map((review) => `${review.rating} | ${review.author} | ${review.text}`).join("\n");
    render();
    showToast("CSV imported");
  });

  document.querySelectorAll("input[name='tone'], #businessName, #industry, #city, #ownerName").forEach((input) => {
    input.addEventListener("input", () => {
      currentReviews = currentReviews.map((review) => ({ ...review, reply: "" }));
      render();
    });
  });

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
      tab.classList.add("active");
      $(`#${tab.dataset.view}View`).classList.add("active");
    });
  });
}

function restoreState() {
  try {
    currentReviews = JSON.parse(localStorage.getItem("reviewspark-state") || "[]");
  } catch {
    currentReviews = [];
  }

  if (!currentReviews.length) {
    currentReviews = parsePastedReviews($("#reviewText").value);
  }

  render();
}

bindEvents();
restoreState();
