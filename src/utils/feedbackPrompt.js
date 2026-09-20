// Deciding when Applume may ask a user for feedback.
//
// The rule behind every constant here: ask only at a moment the user has just
// formed an opinion (they hit a milestone, they logged a real outcome, they have
// lived with the product for a while), ask at most once per browser session, and
// back off for a long time once they answer or wave it away. Nagging costs more
// goodwill than the feedback is worth.

const DAY = 24 * 60 * 60 * 1000;

export const SNOOZE_DAYS = 60; // after "Not now" or the close button
export const ANSWERED_DAYS = 180; // after they opened the feedback form from a prompt
export const MILESTONE_COUNT = 5; // applications tracked
export const TENURE_DAYS = 14; // since signup

const SESSION_FLAG = "applume_feedback_prompt_shown";

function storageKey(userId) {
  return `applume_feedback_prompt_${userId || "anonymous"}`;
}

// Storage can throw (private mode, blocked site data) or hold junk from an older
// build. Every read degrades to "never asked", every write degrades to a no-op —
// a broken prompt must never break the dashboard.
export function readPromptState(userId) {
  const empty = { used: [], blockedUntil: 0 };
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    return {
      used: Array.isArray(parsed?.used) ? parsed.used.filter((v) => typeof v === "string") : [],
      blockedUntil: Number(parsed?.blockedUntil) || 0,
    };
  } catch {
    return empty;
  }
}

function writePromptState(userId, state) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(state));
  } catch {
    // Preference persistence is nice-to-have; without it the session flag still
    // keeps the user from being asked twice in one sitting.
  }
}

function remember(userId, trigger, blockedDays) {
  const current = readPromptState(userId);
  writePromptState(userId, {
    used: [...new Set([...current.used, trigger])],
    blockedUntil: Date.now() + blockedDays * DAY,
  });
}

export function recordDismissed(userId, trigger) {
  remember(userId, trigger, SNOOZE_DAYS);
}

export function recordAccepted(userId, trigger) {
  remember(userId, trigger, ANSWERED_DAYS);
}

export function shownThisSession() {
  try {
    return sessionStorage.getItem(SESSION_FLAG) === "true";
  } catch {
    return false;
  }
}

export function markShownThisSession() {
  try {
    sessionStorage.setItem(SESSION_FLAG, "true");
  } catch {
    // Without sessionStorage the prompt may reappear after a reload; the
    // localStorage back-off still stops it from becoming a nag.
  }
}

// Returns the trigger to ask on, or null. Ordered strongest signal first: a
// logged outcome means they have just seen how well the tracking held up.
export function selectTrigger({ applications = [], createdAt, state, now = Date.now() }) {
  if (!state || now < state.blockedUntil) return null;
  const unused = (trigger) => !state.used.includes(trigger);

  if (unused("outcome") && applications.some((a) => a.status === "Accepted" || a.status === "Rejected")) {
    return "outcome";
  }
  if (unused("milestone") && applications.length >= MILESTONE_COUNT) {
    return "milestone";
  }
  if (unused("tenure") && createdAt) {
    const age = now - new Date(createdAt).getTime();
    if (Number.isFinite(age) && age >= TENURE_DAYS * DAY) return "tenure";
  }
  return null;
}
