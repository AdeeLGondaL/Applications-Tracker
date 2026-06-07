import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

function getSteps(applications, userId) {
  const aiUsed = (() => {
    try { return !!localStorage.getItem("onboarding_ai_used"); } catch { return false; }
  })();

  const milestoneStatuses = ["Applying", "Submitted", "Awaiting Response", "Interview", "Accepted", "Rejected", "Deferred"];

  return [
    {
      id: "first_app",
      label: "Add your first application",
      done: applications.length >= 1,
      action: null,
    },
    {
      id: "ai_used",
      label: "Try AI auto-fill",
      done: aiUsed,
      action: null,
    },
    {
      id: "deadline",
      label: "Track a deadline",
      done: applications.some((a) => a.deadline && a.deadline.trim() !== ""),
      actionLabel: "Add a deadline when adding an app",
      action: null,
    },
    {
      id: "milestone",
      label: "Reach your first milestone",
      done: applications.some((a) => milestoneStatuses.includes(a.status)),
      action: null,
    },
  ];
}

export function OnboardingChecklist({ userId, applications, onAddApplication, onOpenFeedback }) {
  const dismissedKey = `onboarding_dismissed_${userId}`;

  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(dismissedKey) === "true"; } catch { return false; }
  });
  const [allDoneAnimating, setAllDoneAnimating] = useState(false);

  const steps = getSteps(applications, userId);
  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;

  useEffect(() => {
    if (allDone && !dismissed) {
      const timer = setTimeout(() => {
        setAllDoneAnimating(true);
        setTimeout(() => {
          try { localStorage.setItem(dismissedKey, "true"); } catch {}
          setDismissed(true);
        }, 2000);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [allDone, dismissed, dismissedKey]);

  function handleDismiss() {
    try { localStorage.setItem(dismissedKey, "true"); } catch {}
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
            ? "border-emerald-300 bg-emerald-50 dark:border-emerald-700/60 dark:bg-emerald-900/30"
            : "border-emerald-100 bg-white dark:border-emerald-900/50 dark:bg-emerald-900/20"
        }`}
      >
        <div className="p-5">
          {allDoneAnimating ? (
            <div className="flex items-center justify-center gap-3 py-2">
              <span className="text-base font-black text-emerald-700 dark:text-emerald-300">
                You're all set! 🎉
              </span>
            </div>
          ) : (
            <>
              {/* Header row */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-emerald-100 dark:bg-emerald-800/50">
                    <Icon name="sparkles" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white">
                      Get started with Applume
                    </p>
                    <p className="text-xs text-slate-500 dark:text-[#a1a1aa]">
                      {completedCount} of {steps.length} steps complete
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
                  className="h-full rounded-full bg-emerald-500"
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
                          ? "border-emerald-500 bg-emerald-500"
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
                        className="shrink-0 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800/60 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                      >
                        Add application
                      </button>
                    )}
                    {!step.done && step.id === "deadline" && (
                      <span className="shrink-0 text-[10px] font-semibold text-slate-400 dark:text-[#52525b]">
                        Add a deadline when adding an app
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
