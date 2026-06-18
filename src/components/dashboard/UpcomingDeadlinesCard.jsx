import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { deadlineInfo, formatDate } from "@/utils/date";

function toneForDeadline(info) {
  if (info.tone === "danger") return "danger";
  if (info.tone === "warning" || info.tone === "notice") return "warning";
  return "neutral";
}

export function UpcomingDeadlinesCard({ apps, onOpenRecord }) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1A1D22] dark:shadow-none dark:ring-1 dark:ring-white/5">
      <CardContent className="p-4 sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-slate-950 dark:text-white">Upcoming deadlines</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-[#9AA4B2]">Top records that need time-sensitive action.</p>
          </div>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--warning-soft)] text-[var(--warning)] ring-1 ring-orange-100">
            <Icon name="calendar" className="h-4 w-4" />
          </div>
        </div>

        {apps.length === 0 ? (
          <p className="rounded-xl bg-[var(--applume-accent-soft)] px-3 py-4 text-sm font-semibold text-[var(--applume-accent-hover)]">
            No deadlines are waiting for action. Add deadlines to records when you want them surfaced here.
          </p>
        ) : (
          <div className="space-y-2.5">
            {apps.map((app, i) => {
              const info = deadlineInfo(app.deadline);
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.04, duration: 0.22 }}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#20242A]"
                >
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold leading-tight text-slate-900 dark:text-white">{app.name}</p>
                      <p className="mt-1 truncate text-xs text-slate-500 dark:text-[#9AA4B2]">{app.programRole || app.type}</p>
                    </div>
                    <span className="shrink-0 self-start">
                      <Badge tone={toneForDeadline(info)}>{info.label}</Badge>
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-[#9AA4B2]">{formatDate(app.deadline)}</p>
                    {onOpenRecord && (
                      <button
                        type="button"
                        onClick={() => onOpenRecord(app)}
                        className="rounded-lg px-2 py-1 text-xs font-bold text-[var(--applume-accent-hover)] transition hover:bg-[var(--applume-accent-soft)]"
                      >
                        Open
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
