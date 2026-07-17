// Shared helpers for the i18n tooling: load the live translations module and
// serialize it back to src/i18n/translations.js in the keyed-object format
// (English source string = key; non-en languages store only overrides).
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

export const TRANSLATIONS_PATH = resolve(process.cwd(), "src/i18n/translations.js");
export const LANG_ORDER = ["en", "zh-Hans", "hi", "es", "ar", "fr", "bn", "pt", "id", "ur", "de"];

export async function loadTranslations() {
  // cache-bust so repeated runs in one process see fresh content
  const url = `${pathToFileURL(TRANSLATIONS_PATH).href}?t=${Date.now()}`;
  const mod = await import(url);
  return {
    translations: mod.translations,
    LANGUAGES: mod.LANGUAGES,
    RTL_LANGS: mod.RTL_LANGS,
    STORAGE_KEY: mod.STORAGE_KEY,
  };
}

const lit = (value) => JSON.stringify(value);

function objLines(obj, indent) {
  const pad = " ".repeat(indent);
  const entries = Object.entries(obj);
  if (entries.length === 0) return "{}";
  const body = entries
    .map(([k, v]) => {
      const key = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : lit(k);
      const val = typeof v === "object" && v !== null ? objLines(v, indent + 2) : lit(v);
      return `${pad}  ${key}: ${val},`;
    })
    .join("\n");
  return `{\n${body}\n${pad}}`;
}

function diffAgainstEn(langObj, enObj) {
  const out = {};
  for (const [k, v] of Object.entries(langObj)) {
    const base = enObj?.[k];
    if (typeof v === "object" && v !== null) {
      const nested = diffAgainstEn(v, base || {});
      if (Object.keys(nested).length > 0) out[k] = nested;
    } else if (v !== base) {
      out[k] = v;
    }
  }
  return out;
}

export function writeTranslations({ translations, LANGUAGES, RTL_LANGS, STORAGE_KEY }) {
  const en = translations.en;
  let src = `// Applume UI translations.
//
// Structure: translations[lang] = { common, deadline, labels, phrases }.
// - phrases is a keyed object: the KEY is the exact English source string used
//   in components via t("phrases....."). No positional arrays — adding or
//   removing a phrase cannot shift other languages' entries.
// - Every language except "en" lists only the entries it overrides; the
//   provider falls back to translations.en per key (then to the key itself),
//   so a missing entry renders English rather than mis-translating.
// - labels follow the same override + fallback rule.
//
// Tooling (run from the repo root):
//   node scripts/i18n-scan.mjs [--fix]   — find t("phrases.…") keys missing from
//                                          the en catalog; --fix registers them.
//   node scripts/i18n-translate.mjs      — auto-fill missing translations for all
//                                          languages via the Groq API.

export const STORAGE_KEY = ${lit(STORAGE_KEY)};

export const RTL_LANGS = new Set(${lit([...RTL_LANGS])});

export const LANGUAGES = [
${LANGUAGES.map((l) => `  { code: ${lit(l.code)}, name: ${lit(l.name)}, nativeName: ${lit(l.nativeName)}, locale: ${lit(l.locale)} },`).join("\n")}
];

export const translations = {
`;
  for (const code of LANG_ORDER) {
    const full = translations[code];
    if (!full) continue;
    const emit = code === "en"
      ? full
      : {
          common: diffAgainstEn(full.common || {}, en.common),
          deadline: diffAgainstEn(full.deadline || {}, en.deadline),
          labels: diffAgainstEn(full.labels || {}, en.labels),
          phrases: diffAgainstEn(full.phrases || {}, en.phrases),
        };
    const key = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(code) ? code : lit(code);
    src += `  ${key}: ${objLines(emit, 2)},\n`;
  }
  src += `};\n`;
  writeFileSync(TRANSLATIONS_PATH, src);
}
