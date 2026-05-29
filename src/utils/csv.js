export function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export function toCsv(rows) {
  const headers = ["type", "status", "name", "programRole", "city", "openingDate", "deadline", "applicationType", "priority", "link", "documents", "notes", "lastUpdated"];
  return [headers.join(","), ...rows.map((row) => headers.map((key) => csvEscape(row[key])).join(","))].join("\n");
}
