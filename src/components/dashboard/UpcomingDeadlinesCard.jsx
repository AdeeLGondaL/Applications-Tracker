import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/i18n";

function toneForDeadline(info) {
  if (info.tone === "danger") return "danger";
  if (info.tone === "warning" || info.tone === "notice") return "warning";
  return "neutral";
}

export function UpcomingDeadlinesCard({ apps, onOpenRecord, onAddDeadline }) {
  const { deadlineInfo, formatDate, label, t } = useLanguage();
  return (
    <Card className="rounded-[22px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)] dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1A1D22] dark:shadow-none dark:ring-1 dark:ring-white/5">
      <CardContent className="p-4 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-black leading-tight text-slate-950 dark:text-white">{t("phrases.Upcoming deadlines")}</h2>
            <p className="mt-1 text-[13px] leading-5 text-slate-500 dark:text-[#9AA4B2]">{t("phrases.Top records that need time-sensitive action.")}</p>
          </div>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--warning-soft)] text-[var(--warning)] ring-1 ring-orange-100 dark:bg-amber-900/20 dark:ring-amber-800/50">
            <Icon name="calendar" className="h-4 w-4" />
          </div>
        </div>

        {apps.length === 0 ? (
          <div className="rounded-xl bg-[var(--applume-accent-soft)] px-3 py-4 dark:bg-[rgba(0,153,102,0.16)]">
            <p className="text-sm font-black text-[var(--applume-accent-hover)] dark:text-[var(--applume-accent-muted)]">{t("phrases.No upcoming deadlines.")}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-[#9AA4B2]">
              Add a deadline to an application and it will appear here.
            </p>
            {onAddDeadline && (
              <button
                type="button"
                onClick={onAddDeadline}
                className="mt-3 rounded-xl border border-[var(--applume-accent-border)] bg-white px-3 py-2 text-xs font-black text-[var(--applume-accent-hover)] transition hover:bg-[var(--applume-accent-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--applume-accent)] focus:ring-offset-2 dark:bg-[#1A1D22] dark:focus:ring-offset-[#1A1D22]"
              >
                {t("phrases.Add deadline")}
              </button>
            )}
          </div>
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
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#20242A]"
                >
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold leading-tight text-slate-900 dark:text-white">{app.name}</p>
                      <p className="mt-1 truncate text-[13px] leading-5 text-slate-500 dark:text-[#9AA4B2]">{app.programRole || label("type", app.type)}</p>
                    </div>
                    <span className="shrink-0 self-start">
                      <Badge tone={toneForDeadline(info)}>{info.label}</Badge>
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-[13px] font-semibold text-slate-500 dark:text-[#9AA4B2]">{formatDate(app.deadline)}</p>
                    {onOpenRecord && (
                      <button
                        type="button"
                        onClick={() => onOpenRecord(app)}
                        aria-label={`${t("phrases.Open")} ${app.name}`}
                        className="rounded-lg px-2 py-1 text-xs font-bold text-[var(--applume-accent-hover)] transition hover:bg-[var(--applume-accent-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--applume-accent)] focus:ring-offset-2 dark:focus:ring-offset-[#20242A]"
                      >
                        {t("phrases.Open")}
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
