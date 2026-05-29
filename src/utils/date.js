import { EMPTY_FORM } from "@/utils/constants";

export function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function parseDate(value) {
  if (!value) return null;
  const parts = String(value).split("-").map(Number);
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return null;
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function daysUntil(value, baseDate = new Date()) {
  const target = parseDate(value);
  if (!target) return null;
  const base = new Date(baseDate);
  base.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - base.getTime()) / 86400000);
}

export function formatDate(value) {
  const date = parseDate(value);
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export function deadlineInfo(value) {
  const days = daysUntil(value);
  if (days === null) return { label: "No deadline", tone: "neutral", sort: 999999 };
  if (days < 0) return { label: `${Math.abs(days)}d overdue`, tone: "danger", sort: days };
  if (days <= 14) return { label: `${days}d left`, tone: "warning", sort: days };
  if (days <= 45) return { label: `${days}d left`, tone: "notice", sort: days };
  return { label: `${days}d left`, tone: "success", sort: days };
}

export function priorityRank(priority) {
  return { High: 0, Medium: 1, Low: 2 }[priority] ?? 9;
}

export function normalize(item) {
  return { id: item.id || makeId(), ...EMPTY_FORM, ...item, lastUpdated: item.lastUpdated || todayIso() };
}

function runTests() {
  const base = new Date(2026, 4, 2);
  console.assert(daysUntil("2026-05-03", base) === 1, "daysUntil tomorrow failed");
  console.assert(daysUntil("2026-05-01", base) === -1, "daysUntil overdue failed");
  console.assert(daysUntil("", base) === null, "empty date should be null");
  console.assert(formatDate("") === "—", "empty formatted date failed");
  console.assert(priorityRank("High") < priorityRank("Low"), "priority rank failed");
  console.assert(deadlineInfo("").sort === 999999, "missing deadline sort failed");
  console.assert(normalize({ name: "Test" }).status === "Not Open Yet", "normalize default status failed");
}
if (import.meta.env.DEV) runTests();
