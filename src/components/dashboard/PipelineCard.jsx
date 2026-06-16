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

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:shadow-none dark:ring-1 dark:ring-white/5">
      <CardContent className="p-4 sm:p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-black">Pipeline summary</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-[#71717a]">{total} records grouped into four phases.</p>
          </div>
          {activeRows.length > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] hover:text-[var(--applume-accent-hover)] dark:border-[#2a2a2e] dark:bg-[#111113] dark:text-[#a1a1aa]"
            >
              {expanded ? "Hide detail" : "Details"}
            </button>
          )}
        </div>

        {total === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400 dark:text-[#71717a]">Add records to see your pipeline take shape.</p>
        ) : (
          <div>
            <div className="flex h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-[#2a2a2e]" aria-label="Application pipeline summary">
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

            <div className="mt-4 grid gap-2 sm:grid-cols-4">
              {segments.map(({ label, count, color }) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 dark:border-[#2a2a2e] dark:bg-[#111113]">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${color}`} />
                      <span className="text-xs font-bold text-slate-700 dark:text-[#d4d4d8]">{label}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-[#71717a]">
                      <span className="font-black text-slate-900 dark:text-white">{count}</span>
                      {count > 0 && <span> · {pct}%</span>}
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
                    <div className="min-w-0 truncate text-xs font-semibold text-slate-500 dark:text-[#71717a]">{status}</div>
                    <div className="shrink-0 text-right text-xs sm:hidden">
                      <span className="font-black text-slate-800 dark:text-white">{count}</span>
                      {pct > 0 && <span className="ml-1 text-slate-400 dark:text-[#71717a]">{pct}%</span>}
                    </div>
                  </div>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-[#2a2a2e] sm:h-2">
                    <motion.div
                      className={`h-full rounded-full ${color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                    />
                  </div>
                  <div className="hidden w-16 shrink-0 text-right text-xs sm:block">
                    <span className="font-black text-slate-800 dark:text-white">{count}</span>
                    {pct > 0 && <span className="ml-1 text-slate-400 dark:text-[#71717a]">{pct}%</span>}
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
