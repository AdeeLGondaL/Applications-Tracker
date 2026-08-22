// Auto-fills missing translations for every language via the Groq API — no
// hand-maintained catalogs. Safe to re-run any time: it only translates keys
// a language doesn't have yet (everything else is left untouched).
//
//   node scripts/i18n-translate.mjs [--dry] [--langs de,fr]
//
// API key: GROQ_API_KEY env var, or VITE_GROQ_API_KEY from .env.
// Model: GROQ_MODEL env var (defaults to openai/gpt-oss-120b).
//
// Resilient by design: translations.js is rewritten after every batch (not
// just at the end), and transient failures (429 rate limit, 5xx) are retried
// with backoff — a mid-run crash never loses already-translated batches;
// re-running the script picks up exactly where it left off.
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadTranslations, writeTranslations } from "./i18n-lib.mjs";

const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const BATCH = 20;
const MAX_RETRIES = 6;
const BATCH_DELAY_MS = 1500; // pace requests to stay under the TPM limit
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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Parses "Please try again in 365ms" / "in 1.2s" out of a Groq rate-limit
// message; falls back to exponential backoff if the message doesn't have it.
function retryDelayMs(message, attempt) {
  const match = /try again in ([\d.]+)(ms|s)/i.exec(message || "");
  if (match) {
    const value = parseFloat(match[1]);
    return Math.ceil(match[2] === "s" ? value * 1000 : value) + 250;
  }
  return Math.min(2 ** attempt * 500, 15000);
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

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
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
    if (res.ok) {
      const body = await res.json();
      return JSON.parse(body.choices[0].message.content);
    }
    const text = await res.text();
    const retryable = res.status === 429 || res.status >= 500;
    if (!retryable || attempt === MAX_RETRIES) {
      throw new Error(`Groq ${res.status}: ${text.slice(0, 300)}`);
    }
    const wait = retryDelayMs(text, attempt);
    console.log(`    Groq ${res.status}, retrying in ${wait}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`);
    await sleep(wait);
  }
  throw new Error("unreachable");
}

const key = apiKey();
const data = await loadTranslations();
const { translations, LANGUAGES } = data;
const en = translations.en.phrases;
const enKeys = Object.keys(en);

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
    console.log(`  batch ${Math.floor(i / BATCH) + 1}/${Math.ceil(missing.length / BATCH)}: ${applied}/${batch.length}`);
    // Persist after every batch so a later failure (this language or the
    // next) never loses work already done.
    writeTranslations(data);
    if (i + BATCH < missing.length) await sleep(BATCH_DELAY_MS);
  }
}

console.log(dry ? "\n(dry run — nothing written)" : "\ntranslations.js is up to date.");
