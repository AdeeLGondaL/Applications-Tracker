import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { useLanguage } from "@/i18n";

function greetingKey(hour) {
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// Pick the single most useful thing to say right now, in priority order:
// overdue → due soon → interviews → missing setup → all caught up.
// Sentences are t() keys with {count}/{pct} params so every language works.
function resolveInsight(t, { overdue, dueSoon, interviews, missingDocs, progress }, handlers) {
  if (overdue > 0) {
    return {
      tone: "danger",
      icon: "reset",
      text: overdue === 1
        ? t("phrases.1 application is past deadline and still active.")
        : t("phrases.{count} applications are past deadline and still active.", { count: overdue }),
      cta: t("phrases.Review overdue"),
      onCta: handlers.onReviewUrgent,
    };
  }
  if (dueSoon > 0) {
    return {
      tone: "warning",
      icon: "calendar",
      text: dueSoon === 1
        ? t("phrases.1 deadline lands within the next 7 days — worth preparing now.")
        : t("phrases.{count} deadlines land within the next 7 days — worth preparing now.", { count: dueSoon }),
      cta: t("phrases.See what's due"),
      onCta: handlers.onReviewUrgent,
    };
  }
  if (interviews > 0) {
    return {
      tone: "info",
      icon: "job",
      text: interviews === 1
        ? t("phrases.1 application is at the interview stage. Keep the momentum going.")
        : t("phrases.{count} applications are at the interview stage. Keep the momentum going.", { count: interviews }),
      cta: t("phrases.View interviews"),
      onCta: handlers.onReviewInterviews,
    };
  }
  if (missingDocs > 0) {
    return {
      tone: "accent",
      icon: "check",
      text: missingDocs === 1
        ? t("phrases.1 record still needs its documents checked off to be decision-ready.")
        : t("phrases.{count} records still need their documents checked off to be decision-ready.", { count: missingDocs }),
      cta: t("phrases.Complete setup"),
      onCta: handlers.onReviewDocuments,
    };
  }
  return {
    tone: "accent",
    icon: "sparkles",
    text: t("phrases.You're all caught up — nothing urgent today. {pct}% of your applications are submitted or beyond.", { pct: progress }),
    cta: t("phrases.Add application"),
    onCta: handlers.onAddApplication,
  };
}

const TONE = {
  danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
  info: "bg-[var(--info-soft)] text-[var(--info)]",
  accent: "bg-[var(--applume-accent-soft)] text-[var(--applume-accent-hover)] dark:text-[var(--applume-accent-muted)]",
};

function Stat({ value, label }) {
  return (
    <div className="min-w-0 rounded-[12px] border border-[var(--border-subtle)] bg-[var(--surface-soft)] px-4 py-3 text-center">
      <p className="text-2xl font-black tabular-nums leading-none text-[var(--text-strong)]">{value}</p>
      <p className="mt-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
    </div>
  );
}

export function DashboardGreeting({ name, stats, missingDocs, onReviewUrgent, onReviewInterviews, onReviewDocuments, onAddApplication }) {
  const { t } = useLanguage();
  const hour = new Date().getHours();
  const greetingWord = t(`phrases.${greetingKey(hour)}`);
  const greeting = name ? `${greetingWord}, ${name}` : greetingWord;
  const insight = resolveInsight(
    t,
    {
      overdue: stats.overdue,
      dueSoon: stats.dueSoon7,
      interviews: stats.interviews,
      missingDocs,
      progress: stats.progress,
    },
    { onReviewUrgent, onReviewInterviews, onReviewDocuments, onAddApplication },
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--surface-card)] p-5 shadow-sm dark:shadow-none dark:ring-1 dark:ring-white/5 sm:p-7"
    >
      {/* Soft brand wash, purely decorative */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--applume-accent-soft)] opacity-60 blur-2xl"
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-semibold leading-tight tracking-[-0.01em] text-[var(--text-strong)] sm:text-3xl">
            {greeting}
          </h2>
          <div className="mt-3 flex items-start gap-2.5">
            <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${TONE[insight.tone]}`}>
              <Icon name={insight.icon} className="h-4 w-4" />
            </span>
            <p className="max-w-xl text-[15px] leading-6 text-[var(--text-muted)]">{insight.text}</p>
          </div>
          <button
            type="button"
            onClick={insight.onCta}
            className="mt-5 inline-flex items-center gap-2 rounded-[10px] bg-[var(--applume-accent)] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--applume-accent-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--applume-accent)] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[var(--surface-card)]"
          >
            {insight.cta === t("phrases.Add application") && <Icon name="plus" className="h-4 w-4" />}
            {insight.cta}
          </button>
        </div>

        <div className="grid shrink-0 grid-cols-3 gap-2.5 sm:gap-3 lg:w-[340px]">
          <Stat value={stats.total} label={t("phrases.Tracked")} />
          <Stat value={`${stats.progress}%`} label={t("phrases.Submitted")} />
          <Stat value={stats.actionNeeded} label={t("phrases.Needs action")} />
        </div>
      </div>
    </motion.section>
  );
}
