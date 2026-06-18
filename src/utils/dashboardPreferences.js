export const DASHBOARD_PREFS_STORAGE_KEY = "applume.dashboard.preferences.v1";

export const DASHBOARD_ZONES = ["focus", "kpis", "primary", "secondary", "supporting"];

export const DASHBOARD_WIDGETS = [
  { id: "focusThisWeek", title: "Focus this week", description: "Your action queue for deadlines, interviews, and setup gaps.", defaultSize: "large", allowedSizes: ["large"], category: "focus" },
  { id: "quickActions", title: "Quick actions", description: "Fast ways to add records, import data, and copy calendar links.", defaultSize: "medium", allowedSizes: ["medium"], category: "focus" },
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
  { id: "applicationsByStatus", title: "Applications by status", description: "A simple status distribution for your tracker.", defaultSize: "medium", allowedSizes: ["medium", "large"], category: "pipeline" },
  { id: "deadlinesNext30Days", title: "Deadlines next 30 days", description: "Deadline pressure over the next month.", defaultSize: "medium", allowedSizes: ["medium", "large"], category: "deadlines" },
  { id: "submissionTrend", title: "Submission trend", description: "Recent submitted-or-beyond movement.", defaultSize: "medium", allowedSizes: ["medium", "large"], category: "activity" },
  { id: "jobResponseRate", title: "Job response rate", description: "Job applications with interviews or positive outcomes.", defaultSize: "medium", allowedSizes: ["medium", "large"], category: "activity" },
  { id: "universityDeadlineDistribution", title: "University deadline distribution", description: "University deadlines grouped by timing.", defaultSize: "medium", allowedSizes: ["medium", "large"], category: "deadlines" },
];

export const DASHBOARD_PRESETS = [
  {
    id: "calm",
    title: "Calm overview",
    description: "A balanced view of your applications, deadlines, and progress.",
    zones: {
      focus: ["focusThisWeek", "quickActions"],
      kpis: ["applicationsTracked", "dueSoon", "actionNeeded", "submissionProgress"],
      primary: ["pipelineSummary", "upcomingDeadlines"],
      secondary: ["documentReadiness", "recentActivity"],
      supporting: [],
    },
  },
  {
    id: "deadline",
    title: "Deadline focus",
    description: "Prioritize urgent applications, deadlines, and next steps.",
    zones: {
      focus: ["focusThisWeek", "quickActions"],
      kpis: ["dueSoon", "actionNeeded", "submissionProgress"],
      primary: ["upcomingDeadlines"],
      secondary: ["calendarPreview", "documentReadiness"],
      supporting: ["missingInformation", "pipelineSummary"],
    },
  },
  {
    id: "pipeline",
    title: "Pipeline focus",
    description: "See where every application stands and what is moving forward.",
    zones: {
      focus: [],
      kpis: ["submissionProgress", "applicationsTracked"],
      primary: ["pipelineSummary", "applicationsByStatus"],
      secondary: ["recentActivity", "upcomingDeadlines"],
      supporting: [],
    },
  },
  {
    id: "documents",
    title: "Document readiness",
    description: "Focus on missing documents, notes, and application requirements.",
    zones: {
      focus: [],
      kpis: ["applicationsTracked"],
      primary: ["documentReadiness"],
      secondary: ["missingInformation", "upcomingDeadlines"],
      supporting: ["pipelineSummary", "calendarPreview"],
    },
  },
  {
    id: "jobs",
    title: "Job search mode",
    description: "Track follow-ups, interviews, responses, and job application movement.",
    zones: {
      focus: ["focusThisWeek", "quickActions"],
      kpis: [],
      primary: ["interviewsFollowups", "pipelineSummary"],
      secondary: ["recentActivity", "jobResponseRate"],
      supporting: ["upcomingDeadlines"],
    },
  },
  {
    id: "universities",
    title: "University mode",
    description: "Stay on top of deadlines, documents, portals, and university requirements.",
    zones: {
      focus: [],
      kpis: ["applicationsTracked"],
      primary: ["upcomingDeadlines"],
      secondary: ["documentReadiness", "missingInformation"],
      supporting: ["pipelineSummary", "calendarPreview"],
    },
  },
];

const WIDGET_IDS = new Set(DASHBOARD_WIDGETS.map((widget) => widget.id));
const ZONE_IDS = new Set(DASHBOARD_ZONES);
const DEFAULT_PRESET_ID = "calm";

const FALLBACK_ZONE_BY_ID = {
  focusThisWeek: "focus",
  quickActions: "focus",
  applicationsTracked: "kpis",
  dueSoon: "kpis",
  actionNeeded: "kpis",
  submissionProgress: "kpis",
  pipelineSummary: "primary",
  upcomingDeadlines: "primary",
  documentReadiness: "secondary",
  recentActivity: "secondary",
  calendarPreview: "supporting",
  interviewsFollowups: "primary",
  missingInformation: "secondary",
  applicationsByStatus: "primary",
  deadlinesNext30Days: "supporting",
  submissionTrend: "supporting",
  jobResponseRate: "secondary",
  universityDeadlineDistribution: "supporting",
};

const PRESET_SIZE_OVERRIDES = {
  deadline: { upcomingDeadlines: "large" },
  documents: { documentReadiness: "large" },
  universities: { upcomingDeadlines: "large" },
};

function findPreset(presetId) {
  return DASHBOARD_PRESETS.find((preset) => preset.id === presetId) || DASHBOARD_PRESETS[0];
}

function widgetDefinition(id) {
  return DASHBOARD_WIDGETS.find((widget) => widget.id === id);
}

function zoneForPresetWidget(preset, id) {
  return DASHBOARD_ZONES.find((zone) => preset.zones[zone]?.includes(id));
}

function orderForPresetWidget(preset, zone, id) {
  const index = preset.zones[zone]?.indexOf(id) ?? -1;
  return index >= 0 ? index + 1 : 999;
}

function sizeForPresetWidget(presetId, zone, id) {
  const definition = widgetDefinition(id);
  const override = PRESET_SIZE_OVERRIDES[presetId]?.[id];
  if (override && definition?.allowedSizes.includes(override)) return override;
  if (zone === "kpis") return "small";
  if (zone === "focus" && id === "focusThisWeek") return "large";
  if (zone === "primary" && findPreset(presetId).zones.primary.length === 1 && definition?.allowedSizes.includes("large")) return "large";
  return definition?.defaultSize || "medium";
}

function buildPresetWidgets(presetId = DEFAULT_PRESET_ID) {
  const preset = findPreset(presetId);
  const visibleIds = new Set(DASHBOARD_ZONES.flatMap((zone) => preset.zones[zone] || []));
  return DASHBOARD_WIDGETS.map((definition) => {
    const zone = zoneForPresetWidget(preset, definition.id) || FALLBACK_ZONE_BY_ID[definition.id] || "supporting";
    return {
      id: definition.id,
      visible: visibleIds.has(definition.id),
      zone,
      order: orderForPresetWidget(preset, zone, definition.id),
      size: sizeForPresetWidget(preset.id, zone, definition.id),
    };
  });
}

function cloneDefault() {
  return {
    preset: DEFAULT_PRESET_ID,
    updatedAt: new Date().toISOString(),
    widgets: buildPresetWidgets(DEFAULT_PRESET_ID),
  };
}

export const defaultDashboardPreferences = cloneDefault();

export function normalizeDashboardPreferences(preferences) {
  const fallback = cloneDefault();
  if (!preferences || !Array.isArray(preferences.widgets)) return fallback;

  const preset = findPreset(preferences.preset || DEFAULT_PRESET_ID);
  const savedById = new Map(preferences.widgets.filter((widget) => WIDGET_IDS.has(widget.id)).map((widget) => [widget.id, widget]));
  const presetWidgets = buildPresetWidgets(preset.id);
  const presetById = new Map(presetWidgets.map((widget) => [widget.id, widget]));

  const widgets = DASHBOARD_WIDGETS.map((definition) => {
    const saved = savedById.get(definition.id);
    const presetWidget = presetById.get(definition.id);
    const savedZone = ZONE_IDS.has(saved?.zone) ? saved.zone : null;
    const zone = savedZone || presetWidget?.zone || FALLBACK_ZONE_BY_ID[definition.id] || "supporting";
    const savedSize = definition.allowedSizes.includes(saved?.size) ? saved.size : null;
    const size = savedSize || presetWidget?.size || sizeForPresetWidget(preset.id, zone, definition.id);
    return {
      id: definition.id,
      visible: typeof saved?.visible === "boolean" ? saved.visible : Boolean(presetWidget?.visible),
      zone,
      order: Number.isFinite(saved?.order) ? saved.order : presetWidget?.order || 999,
      size,
    };
  });

  const normalizedWidgets = DASHBOARD_ZONES.flatMap((zone) => (
    widgets
      .filter((widget) => widget.zone === zone)
      .sort((a, b) => a.order - b.order)
      .map((widget, index) => ({ ...widget, order: index + 1 }))
  ));

  return {
    preset: preferences.preset || DEFAULT_PRESET_ID,
    updatedAt: preferences.updatedAt || new Date().toISOString(),
    widgets: normalizedWidgets,
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
  const preset = findPreset(presetId);
  const presetWidgets = buildPresetWidgets(preset.id);
  const presetById = new Map(presetWidgets.map((widget) => [widget.id, widget]));
  return normalizeDashboardPreferences({
    ...currentPreferences,
    preset: preset.id,
    updatedAt: new Date().toISOString(),
    widgets: currentPreferences.widgets.map((widget) => {
      const presetWidget = presetById.get(widget.id);
      return presetWidget ? { ...widget, ...presetWidget } : widget;
    }),
  });
}

export function resetDashboardPreferences() {
  return cloneDefault();
}
