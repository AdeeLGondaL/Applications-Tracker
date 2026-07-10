const SESSION_KEY = "applume_session_id";

function getSessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

export function trackEvent(name, properties = {}) {
  if (!name || typeof window === "undefined") return;

  if (import.meta.env.DEV) {
    console.info("[Applume analytics]", name, properties);
    return; // Pages Functions don't run under `vite dev`
  }

  try {
    const payload = JSON.stringify({ name, properties, sessionId: getSessionId() });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Analytics should never interrupt the user's workflow.
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
