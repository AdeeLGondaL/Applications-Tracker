import { STATUSES, PRIORITIES } from "@/utils/constants";
import { documentsToText } from "@/utils/documents";

export function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export function toCsv(rows) {
  const headers = ["type", "status", "name", "programRole", "city", "openingDate", "deadline", "applicationType", "priority", "link", "documents", "notes", "lastUpdated"];
  return [
    headers.join(","),
    ...rows.map((row) =>
      headers
        // documents is stored as JSON; export the readable "✓ CV; Transcript"
        // form (the importer's legacy parser round-trips the ✓ prefix).
        .map((key) => csvEscape(key === "documents" ? documentsToText(row[key]) : row[key]))
        .join(",")
    ),
  ].join("\n");
}

// ---------------------------------------------------------------------------
// CSV import: parsing, column guessing, and value cleanup for spreadsheets
// exported from Google Sheets / Excel (comma, semicolon, or tab delimited).
// ---------------------------------------------------------------------------

function detectDelimiter(text) {
  const firstLine = text.slice(0, text.indexOf("\n") === -1 ? text.length : text.indexOf("\n"));
  let inQuotes = false;
  const counts = { ",": 0, ";": 0, "\t": 0 };
  for (const ch of firstLine) {
    if (ch === '"') inQuotes = !inQuotes;
    else if (!inQuotes && ch in counts) counts[ch] += 1;
  }
  const [delimiter, count] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return count > 0 ? delimiter : ",";
}

export function parseCsv(text) {
  const input = String(text ?? "").replace(/^\uFEFF/, ""); // strip Excel BOM
  if (!input.trim()) return [];
  const delimiter = detectDelimiter(input);

  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') { cell += '"'; i++; }
        else inQuotes = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && input[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      rows.push(row);
      row = [];
    } else {
      cell += ch;
    }
  }
  if (cell !== "" || row.length > 0) { row.push(cell); rows.push(row); }

  return rows
    .map((cells) => cells.map((value) => value.trim()))
    .filter((cells) => cells.some((value) => value !== ""));
}

const FIELD_ALIASES = {
  name: ["name", "university", "company", "school", "employer", "organization", "organisation", "institution", "uni", "universität", "hochschule", "firma", "unternehmen", "arbeitgeber"],
  programRole: ["program", "programme", "course", "degree", "major", "role", "position", "job", "jobtitle", "title", "studiengang", "stelle", "beruf"],
  city: ["city", "location", "place", "campus", "stadt", "ort", "standort"],
  deadline: ["deadline", "due", "duedate", "applyby", "closing", "closingdate", "frist", "bewerbungsfrist", "termin"],
  openingDate: ["opens", "opening", "openingdate", "start", "startdate", "posted", "posteddate", "opendate"],
  status: ["status", "stage", "state", "progress", "phase"],
  priority: ["priority", "prio", "importance", "priorität"],
  link: ["link", "url", "website", "portal", "applicationlink", "joblink", "webseite"],
  notes: ["notes", "note", "comments", "comment", "remarks", "nextstep", "nextsteps", "todo", "anmerkungen", "notizen"],
  documents: ["documents", "docs", "requirements", "requireddocuments", "unterlagen", "dokumente"],
  applicationType: ["applicationtype", "method", "platform", "via", "channel", "howtoapply"],
  type: ["type", "category", "kind", "art", "typ"],
  language: ["language", "teachinglanguage", "sprache", "unterrichtssprache"],
  employmentType: ["employmenttype", "contract", "contracttype", "jobtype", "anstellungsart"],
  workMode: ["workmode", "remote", "onsite", "arbeitsmodus"],
};

export const IMPORT_FIELDS = [
  { key: "name", label: "University / Company", required: true },
  { key: "programRole", label: "Program / Role" },
  { key: "type", label: "Type (University/Job)" },
  { key: "status", label: "Status" },
  { key: "deadline", label: "Deadline" },
  { key: "openingDate", label: "Opening date" },
  { key: "city", label: "City / Location" },
  { key: "link", label: "Link / Portal URL" },
  { key: "priority", label: "Priority" },
  { key: "documents", label: "Documents" },
  { key: "notes", label: "Notes / Next step" },
  { key: "applicationType", label: "How to apply" },
  { key: "language", label: "Teaching language" },
  { key: "employmentType", label: "Employment type" },
  { key: "workMode", label: "Work mode" },
];

function normalizeHeader(header) {
  return String(header ?? "").toLowerCase().replace(/[^a-zà-ÿä-ü]/gi, "");
}

export function guessColumnField(header) {
  const cleaned = normalizeHeader(header);
  if (!cleaned) return "";
  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    if (aliases.some((alias) => cleaned === alias)) return field;
  }
  // Substring matching only for reasonably long tokens — short aliases like
  // "ort" or "uni" would otherwise match inside unrelated words ("portallink").
  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    if (aliases.some((alias) =>
      (alias.length >= 4 && cleaned.includes(alias)) ||
      (cleaned.length >= 4 && alias.includes(cleaned))
    )) return field;
  }
  return "";
}

export function guessMapping(headers) {
  const used = new Set();
  return headers.map((header) => {
    const guess = guessColumnField(header);
    if (!guess || used.has(guess)) return "";
    used.add(guess);
    return guess;
  });
}

const STATUS_SYNONYMS = [
  [/reject|declin|denied|absage/i, "Rejected"],
  [/accept|offer|admitted|zusage/i, "Accepted"],
  [/interview|gespräch/i, "Interview"],
  [/wait|await|pending|response|antwort/i, "Awaiting Response"],
  [/submit|applied|sent|eingereicht|beworben/i, "Submitted"],
  [/apply|progress|preparing|draft|writing/i, "Applying"],
  [/defer|postpon|verschoben/i, "Deferred"],
  [/not\s*open|wishlist|interested|research|planned|idea/i, "Not Open Yet"],
  [/open|offen/i, "Open"],
];

export function cleanImportValue(field, rawValue) {
  const value = String(rawValue ?? "").trim();
  if (!value) return "";

  if (field === "deadline" || field === "openingDate") return parseFlexibleDate(value);

  if (field === "status") {
    const exact = STATUSES.find((s) => s.toLowerCase() === value.toLowerCase());
    if (exact) return exact;
    const synonym = STATUS_SYNONYMS.find(([re]) => re.test(value));
    return synonym ? synonym[1] : "";
  }

  if (field === "priority") {
    const exact = PRIORITIES.find((p) => p.toLowerCase() === value.toLowerCase());
    if (exact) return exact;
    if (/high|hoch|urgent|1/i.test(value)) return "High";
    if (/low|niedrig|3/i.test(value)) return "Low";
    if (/med|mittel|2/i.test(value)) return "Medium";
    return "";
  }

  if (field === "type") {
    if (/uni|college|school|master|bachelor|phd|studium|degree/i.test(value)) return "University";
    if (/job|work|intern|company|role|stelle|arbeit/i.test(value)) return "Job";
    return "";
  }

  return value.slice(0, 2000);
}

// Accepts ISO (2026-07-15), European (15.07.2026, 15/07/2026), US (07/15/2026),
// and short-year variants. Ambiguous day/month prefers day-first (EU exports).
export function parseFlexibleDate(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";

  const iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return toIsoDate(iso[1], iso[2], iso[3]);

  const dmy = text.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
  if (dmy) {
    let [, a, b, year] = dmy;
    if (year.length === 2) year = `20${year}`;
    let day = Number(a);
    let month = Number(b);
    if (day <= 12 && month > 12) [day, month] = [month, day];
    return toIsoDate(year, month, day);
  }

  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime()) && parsed.getFullYear() > 1990) {
    return toIsoDate(parsed.getFullYear(), parsed.getMonth() + 1, parsed.getDate());
  }
  return "";
}

function toIsoDate(year, month, day) {
  const m = Number(month);
  const d = Number(day);
  if (m < 1 || m > 12 || d < 1 || d > 31) return "";
  return `${year}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
