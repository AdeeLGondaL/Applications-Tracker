import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { STATUSES } from "@/utils/constants";
import { useLanguage } from "@/i18n";

const STATUS_COLOR = {
  "Not Open Yet":      "bg-[var(--border-strong)]",
  "Open":              "bg-[var(--applume-accent)]",
  "Applying":          "bg-[var(--warning)]",
  "Submitted":         "bg-[var(--info)]",
  "Awaiting Response": "bg-[var(--info)]",
  "Interview":         "bg-[var(--info)]",
  "Accepted":          "bg-[var(--applume-accent)]",
  "Rejected":          "bg-[var(--danger)]",
  "Deferred":          "bg-[var(--border-strong)]",
};

const PHASES = [
  { label: "Planning", statuses: ["Not Open Yet", "Open"], color: "bg-[var(--border-strong)]" },
  { label: "Preparing", statuses: ["Applying"], color: "bg-[var(--warning)]" },
  { label: "Submitted", statuses: ["Submitted", "Awaiting Response", "Interview"], color: "bg-[var(--applume-accent)]" },
  { label: "Outcome", statuses: ["Accepted", "Rejected", "Deferred"], color: "bg-[var(--text-muted)]" },
];

export function PipelineCard({ pipeline, total }) {
  const { label, t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const rows = STATUSES.map((status) => ({
    status,
    count: pipeline.find((p) => p.status === status)?.count || 0,
    color: STATUS_COLOR[status] || "bg-[var(--border-strong)]",
  }));
  const activeRows = rows.filter((row) => row.count > 0);
  const segments = PHASES.map((phase) => ({
    ...phase,
    count: phase.statuses.reduce((sum, status) => sum + (pipeline.find((p) => p.status === status)?.count || 0), 0),
  }));
  const submittedOrBeyond = segments.find((segment) => segment.label === "Submitted")?.count || 0;
  const submittedPct = total > 0 ? Math.round((submittedOrBeyond / total) * 100) : 0;
  const insight = submittedOrBeyond > 0
    ? "Most applications are already submitted or waiting for response."
    : "Start by moving records from planning into preparation.";

  return (
    <Card className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-card)] shadow-[0_1px_0_rgba(0,0,0,0.02),0_18px_50px_-40px_rgba(12,20,16,0.28)]">
      <CardContent className="p-4 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold leading-tight text-[var(--text-strong)]">{t("phrases.Pipeline summary")}</h2>
            <p className="mt-1 text-[13px] leading-5 text-[var(--text-muted)]">{t("phrases.Your applications grouped into clear progress stages.")}</p>
          </div>
          {activeRows.length > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className="shrink-0 rounded-[9px] border border-[var(--border)] bg-[var(--surface-card)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] hover:text-[var(--applume-accent-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--applume-accent)] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[var(--surface-card)]"
            >
              {expanded ? t("phrases.Hide detail") : t("phrases.Details")}
            </button>
          )}
        </div>

        {total === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-4">
            <p className="text-sm font-bold text-[var(--text-strong)]">{t("phrases.No pipeline data yet.")}</p>
            <p className="mt-1 text-sm font-semibold leading-6 text-[var(--text-muted)]">Add your first application to start tracking progress.</p>
          </div>
        ) : (
          <div>
            <div className="mb-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--applume-accent)]">{t("phrases.Submitted or beyond")}</p>
              <p className="mt-1 text-lg font-bold text-[var(--text-strong)]">{submittedOrBeyond} {t("common.of")} {total} {t("phrases.applications")}</p>
              <p className="mt-1 text-[13px] leading-5 text-[var(--text-muted)]">{insight}</p>
            </div>

            <div className="flex h-3.5 overflow-hidden rounded-full bg-[var(--surface-soft)]" aria-label={`Application pipeline summary. ${submittedPct}% submitted or beyond.`}>
              {segments.map(({ label, count, color }) => {
                const pct = total > 0 ? (count / total) * 100 : 0;
                if (count === 0) return null;
                return (
                  <motion.div
                    key={label}
                    className={`${color} h-full`}
                    title={`${label}: ${count}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                );
              })}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {segments.map(({ label, count, color }) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${color}`} />
                      <span className="text-xs font-semibold text-[var(--text-strong)]">{t(`phrases.${label}`)}</span>
                    </div>
                    <p className="mt-2 text-[13px] text-[var(--text-muted)]">
                      <span className="font-bold text-[var(--text-strong)]">{count}</span>
                      {count > 0 && <span> - {pct}%</span>}
                    </p>
                  </div>
                );
              })}
            </div>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="space-y-2.5">
                    {activeRows.map(({ status, count, color }) => {
                      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={status} className="sm:flex sm:items-center sm:gap-3">
                  <div className="mb-1.5 flex min-w-0 items-center justify-between gap-3 sm:mb-0 sm:w-36 sm:shrink-0">
                    <div className="min-w-0 truncate text-[13px] font-semibold text-[var(--text-muted)]">{label("status", status)}</div>
                    <div className="shrink-0 text-right text-[13px] sm:hidden">
                      <span className="font-bold text-[var(--text-strong)]">{count}</span>
                      {pct > 0 && <span className="ml-1 text-[var(--text-soft)]">{pct}%</span>}
                    </div>
                  </div>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-soft)] sm:h-2">
                    <motion.div
                      className={`h-full rounded-full ${color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                    />
                  </div>
                  <div className="hidden w-16 shrink-0 text-right text-[13px] sm:block">
                    <span className="font-bold text-[var(--text-strong)]">{count}</span>
                    {pct > 0 && <span className="ml-1 text-[var(--text-soft)]">{pct}%</span>}
                  </div>
                </div>
              );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
