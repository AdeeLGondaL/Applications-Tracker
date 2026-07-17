// Auto-fills missing translations for every language via the Groq API — no
// hand-maintained catalogs. Safe to re-run any time: it only translates keys
// a language doesn't have yet (everything else is left untouched).
//
//   node scripts/i18n-translate.mjs [--dry] [--langs de,fr]
//
// API key: GROQ_API_KEY env var, or VITE_GROQ_API_KEY from .env.
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadTranslations, writeTranslations } from "./i18n-lib.mjs";

const MODEL = "llama-3.3-70b-versatile";
const BATCH = 25;
const dry = process.argv.includes("--dry");
const langsArg = process.argv.find((a) => a.startsWith("--langs"));
const onlyLangs = langsArg ? langsArg.split("=")[1]?.split(",").map((s) => s.trim()) : null;

function apiKey() {
  if (process.env.GROQ_API_KEY) return process.env.GROQ_API_KEY;
  const envPath = resolve(process.cwd(), ".env");
  if (existsSync(envPath)) {
    const match = readFileSync(envPath, "utf8").match(/^VITE_GROQ_API_KEY=(.+)$/m);
    if (match) return match[1].trim();
  }
  throw new Error("No Groq key found (GROQ_API_KEY env var or VITE_GROQ_API_KEY in .env).");
}

async function translateBatch(key, languageName, entries) {
  const prompt = [
    `Translate the following user-interface strings from English to ${languageName}.`,
    "Context: Applume, a calm, minimalist web app for tracking university and job applications.",
    "Rules:",
    "- Keep placeholders like {count}, {total}, {pct} EXACTLY as written.",
    "- Keep the tone concise and friendly; these are buttons, labels, and short helper sentences.",
    '- Keep product names ("Applume", "Google Drive", "CSV", "Kanban") untranslated where natural.',
    "- Return ONLY a JSON object mapping each EXACT English input string to its translation.",
    "",
    JSON.stringify(entries),
  ].join("\n");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Groq ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const body = await res.json();
  return JSON.parse(body.choices[0].message.content);
}

const key = apiKey();
const data = await loadTranslations();
const { translations, LANGUAGES } = data;
const en = translations.en.phrases;
const enKeys = Object.keys(en);

let wroteAny = false;
for (const { code, name } of LANGUAGES) {
  if (code === "en") continue;
  if (onlyLangs && !onlyLangs.includes(code)) continue;
  const lang = translations[code];
  lang.phrases = lang.phrases || {};
  const missing = enKeys.filter((k) => !(k in lang.phrases));
  if (missing.length === 0) {
    console.log(`${code.padEnd(8)} complete`);
    continue;
  }
  console.log(`${code.padEnd(8)} translating ${missing.length} strings...`);
  if (dry) continue;
  for (let i = 0; i < missing.length; i += BATCH) {
    const batch = missing.slice(i, i + BATCH);
    const result = await translateBatch(key, name, batch);
    let applied = 0;
    for (const k of batch) {
      const value = result[k];
      if (typeof value === "string" && value.trim()) {
        lang.phrases[k] = value.trim();
        applied += 1;
      }
    }
    wroteAny = wroteAny || applied > 0;
    console.log(`  batch ${i / BATCH + 1}: ${applied}/${batch.length}`);
  }
}

if (wroteAny && !dry) {
  writeTranslations(data);
  console.log("\ntranslations.js updated.");
} else {
  console.log(dry ? "\n(dry run — nothing written)" : "\nNothing to write.");
}
