// One-off: register phrase keys built via template literals (t(`phrases.${x}`))
// that the static scanner can't see, and drop mis-escaped keys.
import { loadTranslations, writeTranslations } from "./i18n-lib.mjs";
import { OUTCOME_REASONS } from "../src/utils/constants.js";

const DYNAMIC_KEYS = [
  "Still up", "Good morning", "Good afternoon", "Good evening",
  "Add your first application record", "Try AI auto-fill from a posting",
  "Add a real deadline", "Move a record through the pipeline",
  "Profile", "Appearance", "Account and session", "Theme and default view",
  "Accepted", "Rejected", "Deferred",
  "Congrats — what worked?", "Sorry about this one", "On hold — what happened?",
  "A few seconds now helps you see what your successful applications have in common.",
  "Capturing why helps you spot patterns and adjust the next applications.",
  "A quick note keeps the context when this application comes back around.",
  "What helped most?", "What was the reason?",
  "e.g., Applied 3 weeks early, tailored the motivation letter to the program...",
  "e.g., They asked for a language certificate I didn't have yet...",
  "e.g., Waitlisted, decision expected in August...",
  ...Object.values(OUTCOME_REASONS).flat(),
];

const data = await loadTranslations();
const en = data.translations.en.phrases;
let added = 0;
for (const key of DYNAMIC_KEYS) {
  if (!(key in en)) { en[key] = key; added += 1; }
}
let removed = 0;
for (const key of Object.keys(en)) {
  if (key.includes('\\"')) { delete en[key]; removed += 1; }
}
writeTranslations(data);
console.log(`registered ${added} dynamic keys, removed ${removed} bad keys, en total = ${Object.keys(en).length}`);
