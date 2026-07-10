import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { trackEvent } from "@/utils/analytics";

const PATHS = [
  { id: "universities", label: "Universities", icon: "university", copy: "Admissions, documents, intake windows, and portals." },
  { id: "jobs", label: "Jobs", icon: "job", copy: "Roles, follow-ups, interviews, and resume versions." },
  { id: "both", label: "Both", icon: "dashboard", copy: "One calm workspace for every application." },
];

export function OnboardingWizard({ userId, onStart, onImport, onImportCsv, onSkip }) {
  const [step, setStep] = useState(0);
  const [path, setPath] = useState("both");

  useEffect(() => {
    trackEvent("onboarding_started", { userId });
  }, [userId]);

  function choosePath(nextPath) {
    setPath(nextPath);
    trackEvent("tracking_path_selected", { path: nextPath });
  }

  function finishWithStart(type) {
    trackEvent("import_method_selected", { method: "manual", path });
    onStart(type);
  }

  function finishWithImport() {
    trackEvent("import_method_selected", { method: "backup", path });
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
                Add your first application
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-[#a1a1aa]">
                One real application is enough to see how Applume works. You can add the rest anytime.
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
            <div className="h-full rounded-full bg-[var(--applume-accent)] transition-all duration-300" style={{ width: `${((step + 1) / 2) * 100}%` }} />
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
              <h3 className="text-lg font-black text-slate-950 dark:text-white">How do you want to start?</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <button type="button" onClick={onImportCsv} className="rounded-2xl bg-slate-950 p-4 text-left text-white transition hover:bg-slate-800 dark:bg-[#f0f0f0] dark:text-slate-900 dark:hover:bg-white">
                  <Icon name="upload" className="h-4 w-4" />
                  <span className="mt-4 block text-base font-black">Bring your spreadsheet</span>
                  <span className="mt-1 block text-sm leading-6 opacity-75">Import your existing sheet as CSV in one step.</span>
                </button>
                <button type="button" onClick={() => finishWithStart(path === "jobs" ? "Job" : "University")} className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] dark:border-[#2a2a2e] dark:bg-[#111113] dark:hover:bg-[#242428]">
                  <Icon name="plus" className="h-4 w-4 text-[var(--applume-accent)]" />
                  <span className="mt-4 block text-base font-black text-slate-950 dark:text-white">Add one manually</span>
                  <span className="mt-1 block text-sm leading-6 text-slate-500 dark:text-[#71717a]">Start fresh with one real application.</span>
                </button>
                <button type="button" onClick={finishWithImport} className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] dark:border-[#2a2a2e] dark:bg-[#111113] dark:hover:bg-[#242428]">
                  <Icon name="download" className="h-4 w-4 text-[var(--info)]" />
                  <span className="mt-4 block text-base font-black text-slate-950 dark:text-white">Restore a backup</span>
                  <span className="mt-1 block text-sm leading-6 text-slate-500 dark:text-[#71717a]">Bring existing Applume JSON data back in.</span>
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
          {step < 1 && (
            <button
              type="button"
              onClick={() => setStep((current) => Math.min(1, current + 1))}
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
