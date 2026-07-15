import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { trackOnce } from "@/utils/analytics";

function getSteps(applications) {
  const aiUsed = (() => {
    try { return !!localStorage.getItem("onboarding_ai_used"); } catch { return false; }
  })();

  const milestoneStatuses = ["Applying", "Submitted", "Awaiting Response", "Interview", "Accepted", "Rejected", "Deferred"];

  return [
    {
      id: "first_app",
      label: "Add your first application record",
      done: applications.length >= 1,
      action: null,
    },
    {
      id: "ai_used",
      label: "Try AI auto-fill from a posting",
      done: aiUsed,
      action: null,
    },
    {
      id: "deadline",
      label: "Add a real deadline",
      done: applications.some((a) => a.deadline && a.deadline.trim() !== ""),
      actionLabel: "Add a deadline when adding an app",
      action: null,
    },
    {
      id: "milestone",
      label: "Move a record through the pipeline",
      done: applications.some((a) => milestoneStatuses.includes(a.status)),
      action: null,
    },
  ];
}

export function OnboardingChecklist({ userId, applications, onAddApplication }) {
  const dismissedKey = `onboarding_dismissed_${userId}`;

  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(dismissedKey) === "true"; } catch { return false; }
  });
  const [allDoneAnimating, setAllDoneAnimating] = useState(false);

  const steps = getSteps(applications);
  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;

  useEffect(() => {
    if (allDone && !dismissed) {
      trackOnce("onboarding_checklist_completed", { source: "dashboard_checklist" });
      const timer = setTimeout(() => {
        setAllDoneAnimating(true);
        setTimeout(() => {
          try { localStorage.setItem(dismissedKey, "true"); } catch { /* ignore storage failures */ }
          setDismissed(true);
        }, 2000);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [allDone, dismissed, dismissedKey]);

  function handleDismiss() {
    try { localStorage.setItem(dismissedKey, "true"); } catch { /* ignore storage failures */ }
    setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className={`mb-5 overflow-hidden rounded-[var(--radius-lg)] border shadow-[0_1px_0_rgba(0,0,0,0.02),0_18px_50px_-40px_rgba(12,20,16,0.28)] ${
          allDoneAnimating
            ? "border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)]"
            : "border-[var(--border)] bg-[var(--surface-card)]"
        }`}
      >
        <div className="p-5">
          {allDoneAnimating ? (
            <div className="flex items-center justify-center gap-3 py-2">
              <span className="text-base font-black text-[var(--applume-accent-hover)] dark:text-[var(--applume-accent-muted)]">
                Your tracker foundation is ready.
              </span>
            </div>
          ) : (
            <>
              {/* Header row */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[var(--applume-accent-soft)]">
                    <Icon name="sparkles" className="h-4 w-4 text-[var(--applume-accent)]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-strong)]">
                      Build your structured tracker
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {completedCount} of {steps.length} setup steps complete
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  title="Dismiss"
                  onClick={handleDismiss}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-[9px] border border-[var(--border)] text-[var(--text-soft)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text-strong)]"
                >
                  <Icon name="close" className="h-3 w-3" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-soft)]">
                <motion.div
                  className="h-full rounded-full bg-[var(--applume-accent)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount / steps.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>

              {/* Steps list */}
              <ul className="space-y-2.5">
                {steps.map((step) => (
                  <li key={step.id} className="flex items-center gap-3">
                    {/* Checkbox circle */}
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        step.done
                          ? "border-[var(--applume-accent)] bg-[var(--applume-accent)]"
                          : "border-[var(--border-strong)] bg-[var(--surface-card)]"
                      }`}
                    >
                      {step.done && (
                        <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </span>

                    {/* Step text */}
                    <span className={`flex-1 text-sm ${step.done ? "text-[var(--text-soft)] line-through" : "text-[var(--text-strong)]"}`}>
                      {step.label}
                    </span>

                    {/* Action button or hint */}
                    {!step.done && step.id === "first_app" && onAddApplication && (
                      <button
                        type="button"
                        onClick={onAddApplication}
                        className="shrink-0 rounded-[9px] border border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] px-3 py-1 text-xs font-bold text-[var(--applume-accent-hover)] transition hover:bg-[var(--applume-accent-soft-2)]"
                      >
                        Add application
                      </button>
                    )}
                    {!step.done && step.id === "deadline" && (
                      <span className="shrink-0 text-[10px] font-semibold text-[var(--text-soft)]">
                        Add a deadline inside any record
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
