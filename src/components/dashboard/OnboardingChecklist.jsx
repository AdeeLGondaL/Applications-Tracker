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
        className={`mb-5 overflow-hidden rounded-[2rem] border shadow-sm ${
          allDoneAnimating
            ? "border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] dark:border-[rgba(0,153,102,0.36)] dark:bg-[rgba(0,153,102,0.18)]"
            : "border-[var(--applume-accent-border)] bg-white dark:border-[rgba(0,153,102,0.24)] dark:bg-[rgba(0,153,102,0.1)]"
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
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-[var(--applume-accent-soft)] dark:bg-[rgba(0,153,102,0.18)]">
                    <Icon name="sparkles" className="h-4 w-4 text-[var(--applume-accent)] dark:text-[var(--applume-accent-muted)]" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white">
                      Build your structured tracker
                    </p>
                    <p className="text-xs text-slate-500 dark:text-[#a1a1aa]">
                      {completedCount} of {steps.length} setup steps complete
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  title="Dismiss"
                  onClick={handleDismiss}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 dark:border-[#2a2a2e] dark:text-[#71717a] dark:hover:bg-[#1c1c1f] dark:hover:text-[#d4d4d8]"
                >
                  <Icon name="close" className="h-3 w-3" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-[#2a2a2e]">
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
                          : "border-slate-300 bg-white dark:border-[#3a3a3e] dark:bg-[#111113]"
                      }`}
                    >
                      {step.done && (
                        <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </span>

                    {/* Step text */}
                    <span className={`flex-1 text-sm ${step.done ? "text-slate-400 line-through dark:text-[#52525b]" : "text-slate-700 dark:text-[#d4d4d8]"}`}>
                      {step.label}
                    </span>

                    {/* Action button or hint */}
                    {!step.done && step.id === "first_app" && onAddApplication && (
                      <button
                        type="button"
                        onClick={onAddApplication}
                        className="shrink-0 rounded-xl border border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] px-3 py-1 text-xs font-bold text-[var(--applume-accent-hover)] transition hover:bg-[var(--applume-accent-muted)] dark:border-[rgba(0,153,102,0.32)] dark:bg-[rgba(0,153,102,0.16)] dark:text-[var(--applume-accent-muted)] dark:hover:bg-[rgba(0,153,102,0.24)]"
                      >
                        Add application
                      </button>
                    )}
                    {!step.done && step.id === "deadline" && (
                      <span className="shrink-0 text-[10px] font-semibold text-slate-400 dark:text-[#52525b]">
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
