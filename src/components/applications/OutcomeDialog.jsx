import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Field, Select, Textarea } from "@/components/ui/Field";
import { OUTCOME_REASONS } from "@/utils/constants";

const COPY = {
  Accepted: {
    icon: "sparkles",
    chip: "bg-[var(--applume-accent-soft)] text-[var(--applume-accent-hover)]",
    title: "Congrats — what worked?",
    subtitle: "A few seconds now helps you see what your successful applications have in common.",
    reasonLabel: "What helped most?",
    notePlaceholder: "e.g., Applied 3 weeks early, tailored the motivation letter to the program...",
  },
  Rejected: {
    icon: "reset",
    chip: "bg-[var(--danger-soft)] text-[var(--danger)]",
    title: "Sorry about this one",
    subtitle: "Capturing why helps you spot patterns and adjust the next applications.",
    reasonLabel: "What was the reason?",
    notePlaceholder: "e.g., They asked for a language certificate I didn't have yet...",
  },
  Deferred: {
    icon: "calendar",
    chip: "bg-[var(--warning-soft)] text-[var(--warning-ink)]",
    title: "On hold — what happened?",
    subtitle: "A quick note keeps the context when this application comes back around.",
    reasonLabel: "What was the reason?",
    notePlaceholder: "e.g., Waitlisted, decision expected in August...",
  },
};

// Optional post-status-change reflection. Every path out of this dialog is
// safe: Skip, Escape, or the scrim simply close it — nothing is required.
export function OutcomeDialog({ name, status, onSave, onSkip }) {
  const copy = COPY[status] || COPY.Rejected;
  const reasons = OUTCOME_REASONS[status] || [];
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(8,12,10,0.45)] p-4 backdrop-blur-sm dark:bg-[rgba(2,4,3,0.6)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onSkip}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Outcome for ${name}`}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-[18px] border border-[var(--border)] bg-[var(--surface-card)] p-6 shadow-[0_24px_80px_-24px_rgba(12,20,16,0.5)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-[12px] ${copy.chip}`}>
              <Icon name={copy.icon} className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-xl font-semibold leading-tight text-[var(--text-strong)]">{copy.title}</h2>
              <p className="mt-1 truncate text-[13px] font-semibold text-[var(--text-muted)]">{name} · {status}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onSkip}
            aria-label="Skip"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-[var(--border)] text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text-strong)]"
          >
            <Icon name="close" />
          </button>
        </div>

        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{copy.subtitle}</p>

        <div className="mt-5 space-y-4">
          <Field label={copy.reasonLabel}>
            <Select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              options={[{ label: "Select a reason (optional)", value: "" }, ...reasons]}
            />
          </Field>
          <Field label="Anything worth remembering?">
            <Textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={copy.notePlaceholder}
            />
          </Field>
        </div>

        <p className="mt-3 text-[11px] leading-4 text-[var(--text-soft)]">
          Private to you. Stored with this application only.
        </p>

        <div className="mt-5 flex justify-end gap-2.5">
          <Button variant="outline" onClick={onSkip}>Skip</Button>
          <Button onClick={() => onSave({ reason, note })} disabled={!reason && !note.trim()}>
            Save outcome
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
