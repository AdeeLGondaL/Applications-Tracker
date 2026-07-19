// One-off: register the landing page's data-array strings (rendered via
// t(`phrases.${...}`) template literals the static scanner can't see).
import { loadTranslations, writeTranslations } from "./i18n-lib.mjs";

const KEYS = [
  // demo: university records
  "University / Program", "Deadline soon", "Preparing", "Researching",
  "15 Jun", "01 Jul", "20 Jul", "9 days left", "25 days left", "44 days left",
  "Upload certified transcript", "Request module description", "Review prerequisites",
  "Curriculum vitae", "Transcript", "Motivation letter", "Language proof", "Portfolio", "Program page saved",
  "Check certified transcript requirements before submitting.",
  "Compare module catalogue with the admission requirements.",
  "Confirm current credits meet the entry requirement.",
  "Admissions portal", "Program page",
  // demo: job records
  "Company / Role", "Materials", "Applied", "To apply",
  "Prep today", "Follow up 18 Jun", "Round 2", "Awaiting reply",
  "Prepare project examples", "Follow up with recruiter", "Tailor résumé to the role",
  "Résumé", "Interview notes", "Portfolio link", "Questions", "Cover note",
  "Recruiter note", "Job post archived", "Job post saved", "Skills matched", "Salary note",
  "Prepare a concise story about the dashboard project.",
  "Follow up if there's no answer by next Tuesday.",
  "Add the analytics coursework before applying.",
  "Job listing",
  // demo sidebar
  "Calendar", "Notes", "Links",
  // vocabulary switch table
  "Company", "Program", "Role", "Cover letter",
  // core system
  "Deadlines that stay in view",
  "Every record carries its own deadline with clear emphasis as it approaches — nothing hides in a cell.",
  "Documents attached to the application",
  "Transcripts, résumés, letters and portfolios live on the record they belong to, tracked as a simple checklist.",
  "A next action, always",
  "Each application names the single next step, so you always know what to do without re-reading everything.",
  "Notes, links and context",
  "The portal link, recruiter thread and your own notes stay together — the memory a spreadsheet row can't hold.",
  // how it works steps
  "Paste the source", "Add a link to a university or job posting — start from text you already have.",
  "We draft the details", "Applume extracts and fills the key fields, so you don't have to.",
  "You review and save", "Confirm, adjust if needed, and add what matters. Nothing is stored without your review.",
  // faqs
  "Does it work for both university and job applications?",
  "Yes. The same structure tracks admissions and job searches — the labels adapt to each (program vs role, transcript vs résumé, admissions portal vs job listing).",
  "Can I import my current spreadsheet?",
  "Yes — import a CSV and map your columns to Applume's fields. Your existing rows become structured records you can build on.",
  "Is my data private?",
  "Your applications are private to your account. Nothing is public unless you deliberately share a read-only link.",
  "Can I get my data out?",
  "Yes — export your applications to CSV or JSON at any time. Your records are yours to keep.",
  "Do I need a credit card to start?",
  "No. You can start tracking for free without a credit card.",
  // record card morph
  "Portal link saved",
  // header nav
  "FAQ",
];

const data = await loadTranslations();
const en = data.translations.en.phrases;
let added = 0;
for (const key of KEYS) {
  if (!(key in en)) { en[key] = key; added += 1; }
}
writeTranslations(data);
console.log(`registered ${added} landing keys, en total = ${Object.keys(en).length}`);
