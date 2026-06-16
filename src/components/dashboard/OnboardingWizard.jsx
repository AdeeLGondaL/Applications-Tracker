import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { trackEvent } from "@/utils/analytics";

const PATHS = [
  { id: "universities", label: "Universities", icon: "university", copy: "Admissions, documents, intake windows, and portals." },
  { id: "jobs", label: "Jobs", icon: "job", copy: "Roles, follow-ups, interviews, and resume versions." },
  { id: "both", label: "Both", icon: "dashboard", copy: "One calm workspace for every application." },
];

const CONTEXTS = [
  { id: "deadlines", label: "Deadline control" },
  { id: "documents", label: "Document readiness" },
  { id: "status", label: "Status movement" },
];

export function OnboardingWizard({ userId, onStart, onImport, onSkip }) {
  const [step, setStep] = useState(0);
  const [path, setPath] = useState("both");
  const [context, setContext] = useState("deadlines");

  useEffect(() => {
    trackEvent("onboarding_started", { userId });
  }, [userId]);

  function choosePath(nextPath) {
    setPath(nextPath);
    trackEvent("tracking_path_selected", { path: nextPath });
  }

  function finishWithStart(type) {
    trackEvent("import_method_selected", { method: "manual", path, context });
    onStart(type);
  }

  function finishWithImport() {
    trackEvent("import_method_selected", { method: "backup", path, context });
    onImport();
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="mx-auto max-w-5xl"
      aria-labelledby="onboarding-title"
    >
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:ring-1 dark:ring-white/5">
        <div className="border-b border-slate-100 p-5 dark:border-[#2a2a2e] sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--applume-accent)]">First setup</p>
              <h2 id="onboarding-title" className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                Build your first managed pipeline
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-[#a1a1aa]">
                Start with one real application. You can import more later, but one complete record is enough to make Applume useful today.
              </p>
            </div>
            <button
              type="button"
              onClick={onSkip}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-50 dark:border-[#2a2a2e] dark:text-[#a1a1aa] dark:hover:bg-[#242428]"
            >
              Skip for now
            </button>
          </div>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-[#2a2a2e]">
            <div className="h-full rounded-full bg-[var(--applume-accent)] transition-all duration-300" style={{ width: `${((step + 1) / 3) * 100}%` }} />
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {step === 0 && (
            <div>
              <h3 className="text-lg font-black text-slate-950 dark:text-white">What are you tracking first?</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {PATHS.map((item) => {
                  const active = path === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => choosePath(item.id)}
                      className={`min-h-[10rem] rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] ring-2 ring-[var(--applume-accent-border)]"
                          : "border-slate-200 bg-white hover:border-[var(--applume-accent-border)] hover:bg-slate-50 dark:border-[#2a2a2e] dark:bg-[#111113] dark:hover:bg-[#242428]"
                      }`}
                    >
                      <span className={`grid h-10 w-10 place-items-center rounded-xl ${active ? "bg-white text-[var(--applume-accent)]" : "bg-slate-100 text-slate-500 dark:bg-[#2a2a2e] dark:text-[#a1a1aa]"}`}>
                        <Icon name={item.icon} className="h-4 w-4" />
                      </span>
                      <span className="mt-4 block text-base font-black text-slate-950 dark:text-white">{item.label}</span>
                      <span className="mt-1 block text-sm leading-6 text-slate-500 dark:text-[#71717a]">{item.copy}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="text-lg font-black text-slate-950 dark:text-white">What would make this feel under control?</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-[#71717a]">We will use this to emphasize the right checklist prompts.</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {CONTEXTS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setContext(item.id)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                      context === item.id
                        ? "border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] text-[var(--applume-accent-hover)]"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-[#2a2a2e] dark:bg-[#111113] dark:text-[#d4d4d8] dark:hover:bg-[#242428]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-[#2a2a2e] dark:bg-[#111113]">
                <p className="text-sm font-bold text-slate-800 dark:text-[#d4d4d8]">
                  Start small: one application, one deadline or next step, and one status.
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-[#71717a]">
                  That is enough to turn a blank workspace into a managed pipeline.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-black text-slate-950 dark:text-white">How do you want to start?</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <button type="button" onClick={() => finishWithStart(path === "jobs" ? "Job" : "University")} className="rounded-2xl bg-slate-950 p-4 text-left text-white transition hover:bg-slate-800 dark:bg-[#f0f0f0] dark:text-slate-900 dark:hover:bg-white">
                  <Icon name="plus" className="h-4 w-4" />
                  <span className="mt-4 block text-base font-black">Add first record</span>
                  <span className="mt-1 block text-sm leading-6 opacity-75">Create one real application manually.</span>
                </button>
                <button type="button" onClick={finishWithImport} className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] dark:border-[#2a2a2e] dark:bg-[#111113] dark:hover:bg-[#242428]">
                  <Icon name="upload" className="h-4 w-4 text-[var(--applume-accent)]" />
                  <span className="mt-4 block text-base font-black text-slate-950 dark:text-white">Import backup</span>
                  <span className="mt-1 block text-sm leading-6 text-slate-500 dark:text-[#71717a]">Bring existing Applume JSON data back in.</span>
                </button>
                <button type="button" onClick={() => finishWithStart("Job")} className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] dark:border-[#2a2a2e] dark:bg-[#111113] dark:hover:bg-[#242428]">
                  <Icon name="job" className="h-4 w-4 text-[var(--info)]" />
                  <span className="mt-4 block text-base font-black text-slate-950 dark:text-white">Start with a job</span>
                  <span className="mt-1 block text-sm leading-6 text-slate-500 dark:text-[#71717a]">Use recruiter, interview, and follow-up context.</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 dark:border-[#2a2a2e] sm:px-6">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            disabled={step === 0}
            className="rounded-xl px-3 py-2 text-sm font-bold text-slate-400 transition hover:text-slate-700 disabled:opacity-40 dark:hover:text-[#d4d4d8]"
          >
            Back
          </button>
          {step < 2 && (
            <button
              type="button"
              onClick={() => setStep((current) => Math.min(2, current + 1))}
              className="rounded-xl bg-[var(--applume-accent)] px-4 py-2 text-sm font-bold text-white transition hover:bg-[var(--applume-accent-hover)]"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </motion.section>
  );
}
