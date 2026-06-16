const STORAGE_KEY = "applume_analytics_events";
const MAX_EVENTS = 200;

export function trackEvent(name, properties = {}) {
  if (!name || typeof window === "undefined") return;

  const event = {
    name,
    properties,
    timestamp: new Date().toISOString(),
  };

  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const next = Array.isArray(existing) ? [...existing, event].slice(-MAX_EVENTS) : [event];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Analytics should never interrupt the user's workflow.
  }

  if (import.meta.env.DEV) {
    console.info("[Applume analytics]", event);
  }
}

export function trackOnce(name, properties = {}) {
  if (!name || typeof window === "undefined") return;
  const key = `applume_event_once_${name}`;
  try {
    if (localStorage.getItem(key) === "true") return;
    localStorage.setItem(key, "true");
  } catch {
    // Continue with best-effort tracking.
  }
  trackEvent(name, properties);
}
