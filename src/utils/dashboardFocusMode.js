export const DASHBOARD_FOCUS_MODE_STORAGE_KEY = "applume.dashboard.focusMode.v1";

export const DASHBOARD_FOCUS_MODES = [
  { id: "calm", label: "Calm overview" },
  { id: "deadline", label: "Deadline focus" },
  { id: "documents", label: "Document readiness" },
  { id: "pipeline", label: "Pipeline focus" },
  { id: "jobs", label: "Job search" },
  { id: "universities", label: "University mode" },
];

const MODE_IDS = new Set(DASHBOARD_FOCUS_MODES.map((mode) => mode.id));

function storageKey(userId) {
  return `${DASHBOARD_FOCUS_MODE_STORAGE_KEY}:${userId || "anonymous"}`;
}

export function normalizeDashboardFocusMode(mode) {
  return MODE_IDS.has(mode) ? mode : "calm";
}

export function loadDashboardFocusMode(userId) {
  if (typeof window === "undefined") return "calm";
  try {
    return normalizeDashboardFocusMode(localStorage.getItem(storageKey(userId)) || localStorage.getItem(DASHBOARD_FOCUS_MODE_STORAGE_KEY));
  } catch {
    return "calm";
  }
}

export function saveDashboardFocusMode(mode, userId) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userId), normalizeDashboardFocusMode(mode));
}
