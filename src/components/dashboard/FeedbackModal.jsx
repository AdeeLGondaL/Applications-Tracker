import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Field, Input, Textarea } from "@/components/ui/Field";

export function FeedbackModal({ session, onClose }) {
  const [type, setType] = useState("bug");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [steps, setSteps] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!title.trim() || !desc.trim()) return;
    setLoading(true);
    setError("");
    const { error: sbError } = await supabase.from("feedback").insert({
      user_id: session.user.id,
      email: session.user.email,
      type,
      title: title.trim(),
      description: desc.trim(),
      steps: steps.trim() || null,
    });
    setLoading(false);
    if (sbError) setError("Couldn't send feedback. Please try again.");
    else setSent(true);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 backdrop-blur-sm sm:items-center px-4 pb-4 sm:pb-0"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl shadow-slate-900/20 dark:bg-[#1c1c1f] dark:ring-1 dark:ring-white/5"
        initial={{ opacity: 0, scale: 0.95, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 24 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="sent" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="py-6 text-center">
              <motion.div
                className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-[18px] bg-[var(--applume-accent-soft)] dark:bg-[rgba(0,153,102,0.18)]"
                initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 }}
              >
                <Icon name="check" className="h-7 w-7 text-[var(--applume-accent)]" />
              </motion.div>
              <h3 className="text-xl font-black text-slate-950 dark:text-white">Feedback received</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-[#a1a1aa]">
                {type === "bug" ? "Thanks for reporting. We'll investigate and fix it." : "Great idea. We'll consider it for a future update."}
              </p>
              <button type="button" onClick={onClose} className="mt-6 rounded-2xl bg-slate-950 px-8 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-[#f0f0f0] dark:text-slate-900 dark:hover:bg-white">
                Done
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>

              {/* Header */}
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-950 dark:text-white">Share feedback</h2>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-[#a1a1aa]">Help make Applume better for everyone.</p>
                </div>
                <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-[#3a3a3e] dark:text-[#a1a1aa] dark:hover:bg-[#2e2e32]">
                  <Icon name="close" />
                </button>
              </div>

              {/* Type pill switcher */}
              <div className="relative mb-5 flex rounded-2xl bg-slate-100 p-1 dark:bg-[#2a2a2e]">
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-xl bg-white shadow-sm transition-transform duration-200 ease-out dark:bg-[#1c1c1f] ${type === "feature" ? "translate-x-full rtl:-translate-x-full" : "translate-x-0"}`}
                />
                {[{ id: "bug", label: "Bug report" }, { id: "feature", label: "Feature request" }].map(({ id, label }) => (
                  <button key={id} type="button" onClick={() => setType(id)} className="relative z-10 flex-1 rounded-xl py-2 text-sm font-bold">
                    <span className={`transition-colors ${type === id ? "text-slate-950 dark:text-white" : "text-slate-400 dark:text-[#71717a]"}`}>{label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <Field label={type === "bug" ? "What's the issue?" : "What would you like to see?"} required>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !loading) submit(); }}
                    placeholder={type === "bug" ? "e.g., Export button doesn't work on mobile" : "e.g., Email reminders before deadlines"}
                  />
                </Field>

                <Field label={type === "bug" ? "What happened?" : "Why would this help you?"} required>
                  <Textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder={type === "bug"
                      ? "Describe what went wrong and what you expected instead..."
                      : "Explain the problem this would solve, or how you'd use it..."}
                  />
                </Field>

                <AnimatePresence>
                  {type === "bug" && (
                    <motion.div initial={{ opacity: 0, height: 0, overflow: "hidden" }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                      <Field label="Steps to reproduce (optional)">
                        <Textarea
                          value={steps}
                          onChange={(e) => setSteps(e.target.value)}
                          placeholder={"1. Go to the export menu\n2. Click Download CSV\n3. Nothing happens"}
                        />
                      </Field>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {error && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-xs font-semibold text-rose-600">
                      <Icon name="close" className="h-3 w-3 shrink-0" />{error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <Button
                  onClick={submit}
                  disabled={loading || !title.trim() || !desc.trim()}
                  className="h-11 w-full rounded-2xl text-sm font-bold transition disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" />
                      </svg>
                      Sending...
                    </span>
                  ) : type === "bug" ? "Submit bug report" : "Submit feature request"}
                </Button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
