// Coverage checker for the keyed i18n system.
//
//   node scripts/i18n-scan.mjs         — report t("phrases.…") keys used in code
//                                        but missing from the en catalog, plus
//                                        per-language translation coverage.
//   node scripts/i18n-scan.mjs --fix   — also register missing keys in en
//                                        (value = the English key itself).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { loadTranslations, writeTranslations } from "./i18n-lib.mjs";

const SRC = resolve(process.cwd(), "src");
const fix = process.argv.includes("--fix");

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, files);
    else if (/\.(jsx?|mjs)$/.test(name)) files.push(path);
  }
  return files;
}

const usedKeys = new Set();
for (const file of walk(SRC)) {
  if (file.replace(/\\/g, "/").endsWith("src/i18n/translations.js")) continue;
  const text = readFileSync(file, "utf8");
  // t("phrases.X") / t('phrases.X') / t(`phrases.X`) — key runs to the closing
  // quote; source escapes (\" \' \\) are resolved to the runtime string.
  const unescape = (s) => s.replace(/\\(.)/g, "$1");
  for (const match of text.matchAll(/\bt\(\s*"phrases\.((?:[^"\\]|\\.)+)"/g)) usedKeys.add(unescape(match[1]));
  for (const match of text.matchAll(/\bt\(\s*'phrases\.((?:[^'\\]|\\.)+)'/g)) usedKeys.add(unescape(match[1]));
  for (const match of text.matchAll(/\bt\(\s*`phrases\.((?:[^`\\$]|\\.)+)`/g)) usedKeys.add(unescape(match[1]));
}

const data = await loadTranslations();
const en = data.translations.en.phrases;

const unregistered = [...usedKeys].filter((key) => !(key in en)).sort();

console.log(`t("phrases.…") keys in code: ${usedKeys.size}`);
console.log(`registered in en catalog:   ${Object.keys(en).length}`);
if (unregistered.length) {
  console.log(`\nMISSING from en catalog (${unregistered.length}):`);
  unregistered.forEach((key) => console.log(`  - ${key}`));
} else {
  console.log("\nAll code keys are registered in the en catalog.");
}

if (fix && unregistered.length) {
  for (const key of unregistered) en[key] = key;
  writeTranslations(data);
  console.log(`\n--fix: registered ${unregistered.length} keys in en.`);
}

console.log("\nTranslation coverage (missing keys fall back to English):");
const total = Object.keys(en).length + (fix ? 0 : unregistered.length);
for (const [code, lang] of Object.entries(data.translations)) {
  if (code === "en") continue;
  const have = Object.keys(lang.phrases || {}).filter((key) => key in en).length;
  console.log(`  ${code.padEnd(8)} ${have}/${Object.keys(en).length} translated`);
}
if (!fix && unregistered.length) {
  console.log("\nRun with --fix to register the missing keys, then scripts/i18n-translate.mjs to fill translations.");
}
