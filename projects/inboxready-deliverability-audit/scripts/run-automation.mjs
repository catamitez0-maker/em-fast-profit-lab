import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const defaultOutDir = path.join(projectRoot, "automation", "generated");

const paths = {
  leads: path.join(projectRoot, "data", "leads.csv"),
  campaigns: path.join(projectRoot, "data", "sample.csv"),
  intake: path.join(projectRoot, "data", "client-intake.csv"),
  outDir: defaultOutDir
};

const args = process.argv.slice(2);
for (let index = 0; index < args.length; index += 1) {
  const flag = args[index];
  const value = args[index + 1];
  if (flag === "--leads" && value) paths.leads = path.resolve(value);
  if (flag === "--campaigns" && value) paths.campaigns = path.resolve(value);
  if (flag === "--intake" && value) paths.intake = path.resolve(value);
  if (flag === "--out" && value) paths.outDir = path.resolve(value);
}

mkdirSync(paths.outDir, { recursive: true });

const trim = (value) => String(value ?? "").trim();
const lower = (value) => trim(value).toLowerCase();
const number = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

function csvToRows(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === "\"" && quoted && next === "\"") {
      cell += "\"";
      index += 1;
    } else if (char === "\"") {
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
  return rows.filter((cells) => cells.some((value) => trim(value)));
}

function csvRecords(filePath) {
  const rows = csvToRows(readFileSync(filePath, "utf8"));
  const headers = rows.shift()?.map((header) => lower(header)) || [];
  return rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, trim(row[index] ?? "")])));
}

function csvCell(value) {
  let text = String(value ?? "");
  if (/^[=+\-@]/.test(text.trim())) text = `'${text}`;
  return `"${text.replace(/"/g, "\"\"")}"`;
}

function writeCsv(fileName, headers, rows) {
  const body = [headers, ...rows.map((row) => headers.map((header) => row[header] ?? ""))];
  writeFileSync(path.join(paths.outDir, fileName), `${body.map((row) => row.map(csvCell).join(",")).join("\n")}\n`);
}

function writeText(fileName, text) {
  writeFileSync(path.join(paths.outDir, fileName), text.endsWith("\n") ? text : `${text}\n`);
}

function scoreLead(lead) {
  const segment = lower(lead.segment);
  const signals = lower(`${lead.signals} ${lead.pain_trigger} ${lead.platform} ${lead.list_type}`);
  let score = 35;
  const reasons = [];

  if (["newsletter", "outbound", "agency"].includes(segment)) {
    score += 22;
    reasons.push(`${lead.segment} buyer has direct deliverability pain`);
  } else if (segment === "ecommerce" || segment === "saas") {
    score += 16;
    reasons.push(`${lead.segment} email revenue or lifecycle dependency`);
  }

  if (number(lead.monthly_sends) >= 40000) {
    score += 18;
    reasons.push("high monthly send volume");
  } else if (number(lead.monthly_sends) >= 10000) {
    score += 12;
    reasons.push("meaningful monthly send volume");
  } else if (number(lead.monthly_sends) >= 5000) {
    score += 8;
    reasons.push("enough volume for a quick audit");
  }

  if (/outbound|cold|agency|client/.test(signals)) {
    score += 12;
    reasons.push("client or outbound sender-risk signal");
  }
  if (/newsletter|sponsor|creator|weekly/.test(signals)) {
    score += 10;
    reasons.push("newsletter revenue signal");
  }
  if (/klaviyo|mailchimp|convertkit|beehiiv|hubspot|customer\.io|omnisend|activecampaign/.test(signals)) {
    score += 8;
    reasons.push("known email platform");
  }
  if (/launch|seasonal|promo|promotion|product drop/.test(signals)) {
    score += 7;
    reasons.push("near-campaign timing hook");
  }
  if (!lead.contact_route || lower(lead.contact_route).includes("research")) {
    score -= 10;
    reasons.push("contact route needs enrichment");
  }

  const bounded = Math.max(0, Math.min(100, score));
  const tier = bounded >= 82 ? "A" : bounded >= 68 ? "B" : "C";
  return {
    ...lead,
    score: bounded,
    tier,
    reason: reasons.join("; "),
    next_step: tier === "A" ? "send first-touch audit pitch" : tier === "B" ? "send softer sample-first pitch" : "enrich or hold"
  };
}

function firstTouch(lead) {
  const sampleAsk = lead.tier === "A"
    ? "If you send the domain and one recent campaign export, I can turn it into a fixed-price audit."
    : "If useful, I can send a tiny anonymized sample first so you can see the format.";
  return {
    subject: `${lead.prospect}: quick sender-risk check before the next campaign`,
    body: [
      "Hi there,",
      "",
      lead.personalized_opening,
      "",
      "I run a fixed-scope service called InboxReady. It checks SPF/DKIM/DMARC posture, one-click unsubscribe readiness, bounce and complaint risk, and campaign-level blockers.",
      "",
      "The first audit is $149 and comes back as a plain-English score, fix list, and CSV your team can keep.",
      "",
      `${sampleAsk} Worth a quick look this week?`,
      "",
      "Best,",
      "{{your_name}}"
    ].join("\n")
  };
}

function followUps(lead) {
  return [
    {
      subject: `Re: ${lead.prospect} sender-risk check`,
      body: `Hi there,\n\nQuick bump. The useful part is not a long report; it is a short blocker list before the next campaign. For ${lead.prospect}, I would check authentication, unsubscribe path, bounces, and complaint risk first.\n\nShould I send a sample format?`
    },
    {
      subject: `closing the loop on InboxReady`,
      body: `Hi there,\n\nI will close the loop for now. If inbox placement or Gmail/Yahoo sender rules become a priority before a launch, the $149 InboxReady audit is built for a one-domain quick pass.\n\nBest,\n{{your_name}}`
    }
  ];
}

function classifyCampaign(row) {
  const issues = [];
  let risk = 0;
  const authentication = lower(row.authentication);
  const dmarc = lower(row.dmarc);
  const unsubscribe = lower(row.unsubscribe);
  const bounceRate = number(row.bounce_rate);
  const spamRate = number(row.spam_rate);
  const domainAgeDays = number(row.domain_age_days);
  const volume = number(row.volume);

  if (!authentication.includes("spf") || !authentication.includes("dkim")) {
    risk += 28;
    issues.push("Add aligned SPF and DKIM");
  }
  if (!dmarc.includes("quarantine") && !dmarc.includes("reject")) {
    risk += 24;
    issues.push("Move DMARC toward quarantine or reject");
  }
  if (!unsubscribe.includes("one-click")) {
    risk += 18;
    issues.push("Add one-click unsubscribe");
  }
  if (bounceRate > 2) {
    risk += 14;
    issues.push("Clean list before next send");
  }
  if (spamRate > 0.1) {
    risk += 14;
    issues.push("Reduce complaint-prone segments");
  }
  if (domainAgeDays < 90 && volume > 500) {
    risk += 10;
    issues.push("Warm newer sender domain gradually");
  }

  const status = risk >= 50 ? "blocker" : risk >= 24 ? "monitor" : "ready";
  return {
    campaign: row.campaign,
    from_domain: row.from_domain,
    platform: row.platform,
    volume,
    bounce_rate: bounceRate,
    spam_rate: spamRate,
    status,
    risk,
    fixes: issues.length ? issues.join("; ") : "Keep current controls and monitor trend"
  };
}

function auditCampaigns(campaigns) {
  const rows = campaigns.map(classifyCampaign);
  const score = rows.length ? Math.max(0, Math.round(100 - rows.reduce((sum, row) => sum + row.risk, 0) / rows.length)) : 0;
  return {
    rows,
    score,
    blockers: rows.filter((row) => row.status === "blocker"),
    monitors: rows.filter((row) => row.status === "monitor"),
    ready: rows.filter((row) => row.status === "ready")
  };
}

function reportMarkdown(title, intake, audit, mode) {
  const blockerText = audit.blockers.map((row) => `- ${row.campaign}: ${row.fixes}`).join("\n") || "- No hard blockers found in this sample.";
  const monitorText = audit.monitors.map((row) => `- ${row.campaign}: ${row.fixes}`).join("\n") || "- No watch items found in this sample.";
  const close = mode === "sample"
    ? "This is a sample format. A paid audit replaces sample rows with the buyer's real sender data and campaign export."
    : "Human review required before sending final DNS instructions or claiming a sender policy is fully compliant.";

  return `# ${title}

Client: ${intake.client}
Domain: ${intake.domain}
Platform: ${intake.primary_platform}
Monthly sends: ${intake.monthly_sends}

## Inbox Readiness

Score: ${audit.score}/100
Campaigns reviewed: ${audit.rows.length}
Blockers: ${audit.blockers.length}
Watch items: ${audit.monitors.length}

## Blockers

${blockerText}

## Watch Items

${monitorText}

## Paid Offer

- One-time InboxReady audit: $149
- Rush audit: $249
- Monthly sender monitor: $99/month

## Delivery Notes

${close}
`;
}

function handoffChecklist(intake, audit) {
  return `# InboxReady Delivery Handoff

Client: ${intake.client}
Domain: ${intake.domain}

## Before Sending Final Report

- Confirm SPF and DKIM evidence from DNS or message headers.
- Confirm DMARC policy and alignment against the sending domain.
- Confirm one-click unsubscribe evidence for marketing or subscribed messages.
- Review bounce and complaint rates with the client-provided ESP export.
- Reword fixes for the client's exact ESP or DNS provider.

## Upsell Trigger

Offer the $99/month sender monitor if any blocker or watch item appears, or if monthly sends exceed 10,000.

Current blocker count: ${audit.blockers.length}
Current watch count: ${audit.monitors.length}
`;
}

const leads = csvRecords(paths.leads).map(scoreLead).sort((a, b) => b.score - a.score || a.prospect.localeCompare(b.prospect));
const intake = csvRecords(paths.intake)[0] || { client: "Sample Client", domain: "example.com", monthly_sends: "0", primary_platform: "Unknown" };
const campaigns = csvRecords(paths.campaigns);
const audit = auditCampaigns(campaigns);

const scoredLeadRows = leads.map((lead, index) => ({ rank: index + 1, ...lead }));
writeCsv("scored-leads.csv", ["rank", "tier", "score", "prospect", "segment", "website", "contact_route", "platform", "monthly_sends", "reason", "next_step"], scoredLeadRows);

const outreachRows = leads.map((lead, index) => {
  const touch = firstTouch(lead);
  const [followUp1, followUp2] = followUps(lead);
  return {
    rank: index + 1,
    prospect: lead.prospect,
    tier: lead.tier,
    score: lead.score,
    contact_route: lead.contact_route,
    subject: touch.subject,
    email_body: touch.body,
    follow_up_1: followUp1.body,
    follow_up_2: followUp2.body
  };
});
writeCsv("outreach-queue.csv", ["rank", "prospect", "tier", "score", "contact_route", "subject", "email_body", "follow_up_1", "follow_up_2"], outreachRows);

const outreachMarkdown = leads.slice(0, 12).map((lead, index) => {
  const touch = firstTouch(lead);
  const [followUp1, followUp2] = followUps(lead);
  return `## ${index + 1}. ${lead.prospect} (${lead.tier}, ${lead.score})

Reason: ${lead.reason}

### First Touch

Subject: ${touch.subject}

${touch.body}

### Follow-Up 1

${followUp1.body}

### Follow-Up 2

${followUp2.body}
`;
}).join("\n");
writeText("outreach-sequences.md", `# InboxReady Outreach Sequences\n\n${outreachMarkdown}`);

writeCsv("audit-results.csv", ["campaign", "from_domain", "platform", "volume", "bounce_rate", "spam_rate", "status", "risk", "fixes"], audit.rows);
writeText("sample-audit-report.md", reportMarkdown("InboxReady Sample Audit Report", intake, audit, "sample"));
writeText("delivery-report.md", reportMarkdown("InboxReady Client Delivery Report", intake, audit, "delivery"));
writeText("handoff-checklist.md", handoffChecklist(intake, audit));

console.log(`InboxReady automation complete: ${leads.length} leads scored, ${audit.rows.length} campaign rows audited.`);
console.log(`Generated files in ${paths.outDir}`);
