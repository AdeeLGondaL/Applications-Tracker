// Structured document checklists stored in the existing `documents` text
// column: a JSON array `[{ label, done, url? }]`. Legacy free text (and the
// comma-separated strings AI autofill / CSV import produce) parses into
// unchecked items, so no database migration is needed.

const MAX_ITEMS = 30;
const MAX_LABEL = 120;

export const DOCUMENT_TEMPLATES = {
  University: ["CV", "Transcript", "Motivation letter", "Language certificate"],
  Job: ["CV", "Cover letter", "Portfolio", "References"],
};

function sanitizeItem(raw) {
  if (!raw || typeof raw !== "object") return null;
  const label = String(raw.label ?? "").trim().slice(0, MAX_LABEL);
  if (!label) return null;
  const item = { label, done: raw.done === true };
  const url = String(raw.url ?? "").trim();
  if (url) item.url = url;
  return item;
}

// Accepts: JSON array string, array (already parsed), or legacy free text.
export function parseDocuments(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeItem).filter(Boolean).slice(0, MAX_ITEMS);
  }
  const text = String(value ?? "").trim();
  if (!text) return [];
  if (text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed.map(sanitizeItem).filter(Boolean).slice(0, MAX_ITEMS);
    } catch {
      // fall through to legacy text parsing
    }
  }
  // Legacy text: split on newlines / commas / semicolons / middots.
  // A leading "✓ " marks a completed item (round-trips the CSV export format).
  return text
    .split(/[\n,;·]+/)
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed) return null;
      const done = /^✓\s*/.test(trimmed);
      return sanitizeItem({ label: trimmed.replace(/^✓\s*/, ""), done });
    })
    .filter(Boolean)
    .slice(0, MAX_ITEMS);
}

export function serializeDocuments(items) {
  const clean = (items || []).map(sanitizeItem).filter(Boolean).slice(0, MAX_ITEMS);
  return clean.length ? JSON.stringify(clean) : "";
}

export function documentsProgress(value) {
  const items = parseDocuments(value);
  const done = items.filter((item) => item.done).length;
  return { items, total: items.length, done, complete: items.length > 0 && done === items.length };
}

// Human-readable form for CSV export and plain-text surfaces: "✓ CV; Transcript".
export function documentsToText(value) {
  const items = parseDocuments(value);
  return items.map((item) => `${item.done ? "✓ " : ""}${item.label}`).join("; ");
}

function normalizeUrl(url) {
  return String(url || "").trim().replace(/\/+$/, "").toLowerCase();
}

// Derived document library: every checklist item with a link, deduped by URL.
// The label and source application come from the first place the link appeared
// (oldest record wins), so renames elsewhere don't create duplicates.
export function buildDocumentLibrary(applications) {
  const byUrl = new Map();
  const ordered = [...(applications || [])].sort((a, b) =>
    String(a.lastUpdated || "").localeCompare(String(b.lastUpdated || ""))
  );
  for (const app of ordered) {
    for (const item of parseDocuments(app.documents)) {
      if (!item.url) continue;
      const key = normalizeUrl(item.url);
      if (!key) continue;
      const existing = byUrl.get(key);
      if (existing) {
        existing.count += 1;
        if (!existing.apps.includes(app.name)) existing.apps.push(app.name);
      } else {
        byUrl.set(key, {
          url: item.url,
          label: item.label,
          sourceId: app.id,
          sourceName: app.name,
          count: 1,
          apps: [app.name],
        });
      }
    }
  }
  return [...byUrl.values()];
}

if (import.meta.env?.DEV) {
  const roundTrip = parseDocuments(serializeDocuments([{ label: "CV", done: true }, { label: "Transcript" }]));
  console.assert(roundTrip.length === 2 && roundTrip[0].done === true, "documents JSON round-trip failed");
  console.assert(parseDocuments("CV, transcript, motivation letter").length === 3, "legacy split failed");
  console.assert(parseDocuments("✓ CV; Transcript")[0].done === true, "✓ marker parse failed");
  console.assert(documentsToText('[{"label":"CV","done":true}]') === "✓ CV", "toText failed");
  console.assert(documentsProgress("").total === 0, "empty progress failed");
}
