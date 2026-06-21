const appName = "StayReply Kit";
const { $, download, copyText, toast, bindTabs } = window.AppKit;
let pack = {};

function ctx() {
  return { property: $("#property").value.trim() || "the property", city: $("#city").value.trim() || "the area", host: $("#host").value.trim() || "the host", scenario: $("#scenario").value, msg: $("#guestMsg").value.trim() };
}

function scenarioAdvice(context) {
  const map = {
    "pre-arrival": ["Confirm arrival details", "Send parking and Wi-Fi", "Offer early check-in only if calendar allows"],
    "late check-in": ["Reassure guest", "Repeat self check-in steps", "Confirm quiet hours"],
    "wifi issue": ["Acknowledge quickly", "Give router location", "Offer backup steps"],
    "noise concern": ["Apologize", "Restate quiet hours", "Document issue"],
    checkout: ["Send checkout list", "Thank guest", "Invite honest review"]
  };
  return map[context.scenario] || map["pre-arrival"];
}

function replyLine(context) {
  if (context.scenario === "wifi issue") return "I am sorry the Wi-Fi is giving you trouble. Please try the reset steps below, and I will help until it is resolved.";
  if (context.scenario === "late check-in") return "Late check-in is okay; the self check-in steps below will work after dark.";
  if (context.scenario === "noise concern") return "I am sorry for the disruption. I am documenting this and will help right away.";
  if (context.scenario === "checkout") return "Here are the simple checkout steps so departure is easy.";
  return "Parking and Wi-Fi are confirmed below; early check-in depends on same-day turnover and I will confirm as soon as possible.";
}

function generate() {
  const context = ctx();
  const tasks = scenarioAdvice(context);
  pack = { ...context, tasks };
  $("#templates").textContent = 4;
  $("#tasks").textContent = tasks.length;
  $("#replyOut").value = `Hi {{guest_first_name}}, thanks for the message. This is ${context.host} from ${context.property}. ${replyLine(context)} I will keep an eye out here if you need anything else before arrival.`;
  $("#scheduledOut").value = `Hi {{guest_first_name}}, welcome to ${context.property} in ${context.city}. Check-in details: {{checkin_steps}}. Wi-Fi: {{wifi_name}} / {{wifi_password}}. Parking: {{parking_note}}. Please message us here if anything needs attention.`;
  $("#reviewOut").value = `Thank you for staying at ${context.property}. We are glad you chose us for your ${context.city} trip, and we appreciate the helpful feedback. We would be happy to host you again.`;
  $("#upsellOut").value = "Optional add-on: We can share local food, coffee, and activity recommendations for your dates. Tell us your arrival time and we will send a short list.";
  $("#opsOut").value = `${tasks.map((task, index) => `${index + 1}. ${task}`).join("\n")}\n\nCleaner note:\n- Verify Wi-Fi card is visible\n- Photograph entry area after reset\n- Report maintenance issues before guest arrival`;
  $("#briefOut").value = `${appName}\nProperty: ${context.property}\nScenario: ${context.scenario}\nWhy it matters: Airbnb asks hosts to respond within 24 hours; response rate affects Superhost status and search placement.\nFast offer: $99 setup for core templates and issue replies, then $39/month per property for monthly tuning.`;
  toast("Host pack generated");
}

function copy() {
  copyText([$("#replyOut").value, $("#scheduledOut").value, $("#opsOut").value, $("#briefOut").value].join("\n\n"));
}

function exportTxt() {
  const text = [$("#replyOut").value, $("#scheduledOut").value, $("#reviewOut").value, $("#opsOut").value, $("#briefOut").value].join("\n\n");
  download("stayreply-kit.txt", text, "text/plain;charset=utf-8");
}

bindTabs();
$("#generateBtn").addEventListener("click", generate);
$("#copyBtn").addEventListener("click", copy);
$("#exportBtn").addEventListener("click", exportTxt);
$("#sampleBtn").addEventListener("click", () => {
  $("#scenario").value = "wifi issue";
  $("#guestMsg").value = "The Wi-Fi is not connecting and we have a video call in 20 minutes.";
  generate();
});
generate();
