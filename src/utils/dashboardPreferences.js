export const DASHBOARD_PREFS_STORAGE_KEY = "applume.dashboard.preferences.v1";

export const DASHBOARD_WIDGETS = [
  { id: "focusThisWeek", title: "Focus this week", description: "Your action queue for deadlines, interviews, and setup gaps.", defaultSize: "large", allowedSizes: ["large"], category: "focus" },
  { id: "applicationsTracked", title: "Applications tracked", description: "Total university and job records in your tracker.", defaultSize: "small", allowedSizes: ["small"], category: "metrics" },
  { id: "dueSoon", title: "Due soon", description: "Applications with deadlines in the next seven days.", defaultSize: "small", allowedSizes: ["small"], category: "deadlines" },
  { id: "actionNeeded", title: "Action needed", description: "Overdue and soon-due active applications.", defaultSize: "small", allowedSizes: ["small"], category: "focus" },
  { id: "submissionProgress", title: "Submission progress", description: "Share of records at submitted stage or beyond.", defaultSize: "small", allowedSizes: ["small"], category: "metrics" },
  { id: "pipelineSummary", title: "Pipeline summary", description: "Status movement across your application stages.", defaultSize: "medium", allowedSizes: ["medium", "large"], category: "pipeline" },
  { id: "upcomingDeadlines", title: "Upcoming deadlines", description: "Top records that need time-sensitive action.", defaultSize: "medium", allowedSizes: ["medium", "large"], category: "deadlines" },
  { id: "documentReadiness", title: "Document readiness", description: "Records with document notes and requirement context.", defaultSize: "medium", allowedSizes: ["medium", "large"], category: "documents" },
  { id: "recentActivity", title: "Recent activity", description: "Recently added and updated applications.", defaultSize: "medium", allowedSizes: ["medium", "large"], category: "activity" },
  { id: "calendarPreview", title: "Calendar preview", description: "Upcoming deadlines and interview-stage work.", defaultSize: "medium", allowedSizes: ["medium", "large"], category: "calendar" },
  { id: "interviewsFollowups", title: "Interviews and follow-ups", description: "Interview-stage records and follow-up notes.", defaultSize: "medium", allowedSizes: ["medium", "large"], category: "activity" },
  { id: "missingInformation", title: "Missing information", description: "Records missing deadlines, links, documents, or notes.", defaultSize: "medium", allowedSizes: ["medium", "large"], category: "documents" },
  { id: "quickActions", title: "Quick actions", description: "Fast ways to add records, import data, and copy calendar links.", defaultSize: "medium", allowedSizes: ["medium"], category: "focus" },
  { id: "applicationsByStatus", title: "Applications by status", description: "A simple status distribution for your tracker.", defaultSize: "medium", allowedSizes: ["medium", "large"], category: "pipeline" },
  { id: "deadlinesNext30Days", title: "Deadlines next 30 days", description: "Deadline pressure over the next month.", defaultSize: "medium", allowedSizes: ["medium", "large"], category: "deadlines" },
  { id: "submissionTrend", title: "Submission trend", description: "Recent submitted-or-beyond movement.", defaultSize: "medium", allowedSizes: ["medium", "large"], category: "activity" },
  { id: "jobResponseRate", title: "Job response rate", description: "Job applications with interviews or positive outcomes.", defaultSize: "medium", allowedSizes: ["medium", "large"], category: "activity" },
  { id: "universityDeadlineDistribution", title: "University deadline distribution", description: "University deadlines grouped by timing.", defaultSize: "medium", allowedSizes: ["medium", "large"], category: "deadlines" },
];

const DEFAULT_WIDGETS = [
  { id: "focusThisWeek", visible: true, order: 1, size: "large" },
  { id: "applicationsTracked", visible: true, order: 2, size: "small" },
  { id: "dueSoon", visible: true, order: 3, size: "small" },
  { id: "actionNeeded", visible: true, order: 4, size: "small" },
  { id: "submissionProgress", visible: true, order: 5, size: "small" },
  { id: "pipelineSummary", visible: true, order: 6, size: "medium" },
  { id: "upcomingDeadlines", visible: true, order: 7, size: "medium" },
  { id: "documentReadiness", visible: true, order: 8, size: "medium" },
  { id: "recentActivity", visible: false, order: 9, size: "medium" },
  { id: "calendarPreview", visible: false, order: 10, size: "medium" },
  { id: "interviewsFollowups", visible: false, order: 11, size: "medium" },
  { id: "missingInformation", visible: false, order: 12, size: "medium" },
  { id: "quickActions", visible: false, order: 13, size: "medium" },
  { id: "applicationsByStatus", visible: false, order: 14, size: "medium" },
  { id: "deadlinesNext30Days", visible: false, order: 15, size: "medium" },
  { id: "submissionTrend", visible: false, order: 16, size: "medium" },
  { id: "jobResponseRate", visible: false, order: 17, size: "medium" },
  { id: "universityDeadlineDistribution", visible: false, order: 18, size: "medium" },
];

export const defaultDashboardPreferences = {
  preset: "calm",
  updatedAt: new Date().toISOString(),
  widgets: DEFAULT_WIDGETS,
};

export const DASHBOARD_PRESETS = [
  {
    id: "calm",
    title: "Calm overview",
    description: "A balanced view of your applications, deadlines, and progress.",
    widgets: ["focusThisWeek", "applicationsTracked", "dueSoon", "actionNeeded", "submissionProgress", "pipelineSummary", "upcomingDeadlines", "documentReadiness"],
  },
  {
    id: "deadline",
    title: "Deadline focus",
    description: "Prioritize urgent applications, deadlines, and next steps.",
    widgets: ["focusThisWeek", "upcomingDeadlines", "actionNeeded", "calendarPreview", "documentReadiness", "pipelineSummary"],
  },
  {
    id: "pipeline",
    title: "Pipeline focus",
    description: "See where every application stands and what is moving forward.",
    widgets: ["pipelineSummary", "submissionProgress", "applicationsByStatus", "recentActivity", "upcomingDeadlines"],
  },
  {
    id: "documents",
    title: "Document readiness",
    description: "Focus on missing documents, notes, and application requirements.",
    widgets: ["documentReadiness", "missingInformation", "upcomingDeadlines", "applicationsTracked", "pipelineSummary"],
  },
  {
    id: "jobs",
    title: "Job search mode",
    description: "Track follow-ups, interviews, responses, and job application movement.",
    widgets: ["focusThisWeek", "interviewsFollowups", "pipelineSummary", "recentActivity", "jobResponseRate", "upcomingDeadlines"],
  },
  {
    id: "universities",
    title: "University mode",
    description: "Stay on top of deadlines, documents, portals, and university requirements.",
    widgets: ["upcomingDeadlines", "documentReadiness", "missingInformation", "pipelineSummary", "applicationsTracked", "calendarPreview"],
  },
];

const WIDGET_IDS = new Set(DASHBOARD_WIDGETS.map((widget) => widget.id));

function cloneDefault() {
  return {
    ...defaultDashboardPreferences,
    updatedAt: new Date().toISOString(),
    widgets: defaultDashboardPreferences.widgets.map((widget) => ({ ...widget })),
  };
}

export function normalizeDashboardPreferences(preferences) {
  const fallback = cloneDefault();
  if (!preferences || !Array.isArray(preferences.widgets)) return fallback;

  const byId = new Map(preferences.widgets.filter((widget) => WIDGET_IDS.has(widget.id)).map((widget) => [widget.id, widget]));
  const widgets = fallback.widgets.map((defaultWidget) => {
    const saved = byId.get(defaultWidget.id);
    const definition = DASHBOARD_WIDGETS.find((widget) => widget.id === defaultWidget.id);
    const savedSize = definition?.allowedSizes.includes(saved?.size) ? saved.size : defaultWidget.size;
    return {
      ...defaultWidget,
      ...saved,
      visible: typeof saved?.visible === "boolean" ? saved.visible : defaultWidget.visible,
      order: Number.isFinite(saved?.order) ? saved.order : defaultWidget.order,
      size: savedSize,
    };
  });

  return {
    preset: preferences.preset || "calm",
    updatedAt: preferences.updatedAt || new Date().toISOString(),
    widgets: widgets.sort((a, b) => a.order - b.order).map((widget, index) => ({ ...widget, order: index + 1 })),
  };
}

export function loadDashboardPreferences(userId) {
  if (typeof window === "undefined") return cloneDefault();
  try {
    const raw = localStorage.getItem(`${DASHBOARD_PREFS_STORAGE_KEY}:${userId || "anonymous"}`) || localStorage.getItem(DASHBOARD_PREFS_STORAGE_KEY);
    return normalizeDashboardPreferences(raw ? JSON.parse(raw) : null);
  } catch {
    return cloneDefault();
  }
}

export function saveDashboardPreferences(preferences, userId) {
  if (typeof window === "undefined") return;
  const normalized = normalizeDashboardPreferences({ ...preferences, updatedAt: new Date().toISOString() });
  localStorage.setItem(`${DASHBOARD_PREFS_STORAGE_KEY}:${userId || "anonymous"}`, JSON.stringify(normalized));
}

export function applyDashboardPreset(currentPreferences, presetId) {
  const preset = DASHBOARD_PRESETS.find((entry) => entry.id === presetId) || DASHBOARD_PRESETS[0];
  const sizeById = {
    focusThisWeek: "large",
    pipelineSummary: presetId === "pipeline" ? "large" : "medium",
    upcomingDeadlines: presetId === "deadline" || presetId === "universities" ? "large" : "medium",
    documentReadiness: presetId === "documents" ? "large" : "medium",
  };
  const visibleIds = new Set(preset.widgets);
  const orderMap = new Map(preset.widgets.map((id, index) => [id, index + 1]));
  const hiddenStart = preset.widgets.length + 1;

  return normalizeDashboardPreferences({
    ...currentPreferences,
    preset: preset.id,
    updatedAt: new Date().toISOString(),
    widgets: currentPreferences.widgets.map((widget) => ({
      ...widget,
      visible: visibleIds.has(widget.id),
      order: orderMap.get(widget.id) || hiddenStart + widget.order,
      size: sizeById[widget.id] || widget.size,
    })),
  });
}

export function resetDashboardPreferences() {
  return cloneDefault();
}
