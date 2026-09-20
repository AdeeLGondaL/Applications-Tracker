import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { useLanguage } from "@/i18n";

// One line per trigger so the ask refers to what the user just did, rather than
// arriving as a generic "rate us" interruption.
const SUBLINE = {
  outcome: "phrases.You just logged an outcome. How well did Applume keep up?",
  milestone: "phrases.You're five applications in. Has anything felt clunky?",
  tenure: "phrases.You've been tracking for a couple of weeks. What would you change first?",
};

export function FeedbackPrompt({ trigger, onAccept, onDismiss }) {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <motion.aside
      // Announced politely rather than focus-trapped: this is an invitation, not
      // a task, and it must never interrupt what the user is typing.
      role="status"
      aria-live="polite"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-[8.5rem] right-3 z-40 w-[min(21rem,calc(100vw-1.5rem))] rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-card)] p-4 shadow-[0_24px_60px_-32px_rgba(12,20,16,0.45)] min-[380px]:right-4 md:bottom-5 md:right-5"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px] border border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] text-[var(--applume-accent-hover)]">
          <Icon name="messageSquare" className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-tight text-[var(--text-strong)]">
            {t("phrases.How's Applume working for you?")}
          </p>
          <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
            {t(SUBLINE[trigger] || SUBLINE.tenure)}
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          title={t("phrases.Dismiss")}
          aria-label={t("phrases.Dismiss")}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-[9px] text-[var(--text-soft)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text-strong)]"
        >
          <Icon name="close" className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* The shared primitive carries the dark-mode pairing (light accent on dark
          ink); a hand-rolled white-on-accent button fails contrast in dark mode. */}
      <div className="mt-3.5 flex gap-2">
        <Button onClick={onAccept} className="flex-1">
          {t("phrases.Share feedback")}
        </Button>
        <Button variant="outline" onClick={onDismiss}>
          {t("phrases.Not now")}
        </Button>
      </div>
    </motion.aside>
  );
}
