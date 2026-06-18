import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { STATUSES } from "@/utils/constants";

const STATUS_COLOR = {
  "Not Open Yet":      "bg-slate-300",
  "Open":              "bg-blue-400",
  "Applying":          "bg-[var(--warning)]",
  "Submitted":         "bg-[var(--applume-accent)]",
  "Awaiting Response": "bg-amber-400",
  "Interview":         "bg-orange-500",
  "Accepted":          "bg-[var(--applume-accent)]",
  "Rejected":          "bg-rose-400",
  "Deferred":          "bg-slate-400",
};

const PHASES = [
  { label: "Planning", statuses: ["Not Open Yet", "Open"], color: "bg-slate-400" },
  { label: "Preparing", statuses: ["Applying"], color: "bg-[var(--warning)]" },
  { label: "Submitted", statuses: ["Submitted", "Awaiting Response", "Interview"], color: "bg-[var(--applume-accent)]" },
  { label: "Outcome", statuses: ["Accepted", "Rejected", "Deferred"], color: "bg-slate-700 dark:bg-slate-300" },
];

export function PipelineCard({ pipeline, total }) {
  const [expanded, setExpanded] = useState(false);
  const rows = STATUSES.map((status) => ({
    status,
    count: pipeline.find((p) => p.status === status)?.count || 0,
    color: STATUS_COLOR[status] || "bg-slate-300",
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
    <Card className="rounded-[22px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)] dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1A1D22] dark:shadow-none dark:ring-1 dark:ring-white/5">
      <CardContent className="p-4 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-black leading-tight text-slate-950 dark:text-white">Pipeline summary</h2>
            <p className="mt-1 text-[13px] leading-5 text-slate-500 dark:text-[#9AA4B2]">Your applications grouped into clear progress stages.</p>
          </div>
          {activeRows.length > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] hover:text-[var(--applume-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--applume-accent)] focus:ring-offset-2 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#20242A] dark:text-[#9AA4B2] dark:focus:ring-offset-[#1A1D22]"
            >
              {expanded ? "Hide detail" : "Details"}
            </button>
          )}
        </div>

        {total === 0 ? (
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-4 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#20242A]">
            <p className="text-sm font-black text-slate-800 dark:text-[#F8FAFC]">No pipeline data yet.</p>
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-500 dark:text-[#9AA4B2]">Add your first application to start tracking progress.</p>
          </div>
        ) : (
          <div>
            <div className="mb-4 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#20242A]">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--applume-accent)]">Submitted or beyond</p>
              <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">{submittedOrBeyond} of {total} applications</p>
              <p className="mt-1 text-[13px] leading-5 text-slate-500 dark:text-[#9AA4B2]">{insight}</p>
            </div>

            <div className="flex h-3.5 overflow-hidden rounded-full bg-slate-100 dark:bg-[#20242A]" aria-label={`Application pipeline summary. ${submittedPct}% submitted or beyond.`}>
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
                  <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#20242A]">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${color}`} />
                      <span className="text-xs font-bold text-slate-700 dark:text-[#d4d4d8]">{label}</span>
                    </div>
                    <p className="mt-2 text-[13px] text-slate-500 dark:text-[#9AA4B2]">
                      <span className="font-black text-slate-900 dark:text-white">{count}</span>
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
                    <div className="min-w-0 truncate text-[13px] font-semibold text-slate-500 dark:text-[#9AA4B2]">{status}</div>
                    <div className="shrink-0 text-right text-[13px] sm:hidden">
                      <span className="font-black text-slate-800 dark:text-white">{count}</span>
                      {pct > 0 && <span className="ml-1 text-slate-400 dark:text-[#9AA4B2]">{pct}%</span>}
                    </div>
                  </div>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-[#20242A] sm:h-2">
                    <motion.div
                      className={`h-full rounded-full ${color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                    />
                  </div>
                  <div className="hidden w-16 shrink-0 text-right text-[13px] sm:block">
                    <span className="font-black text-slate-800 dark:text-white">{count}</span>
                    {pct > 0 && <span className="ml-1 text-slate-400 dark:text-[#9AA4B2]">{pct}%</span>}
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
