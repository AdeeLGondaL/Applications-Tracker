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
    <Card className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-card)] shadow-[0_1px_0_rgba(0,0,0,0.02),0_18px_50px_-40px_rgba(12,20,16,0.28)]">
      <CardContent className="p-4 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold leading-tight text-[var(--text-strong)]">{t("phrases.Upcoming deadlines")}</h2>
            <p className="mt-1 text-[13px] leading-5 text-[var(--text-muted)]">{t("phrases.Top records that need time-sensitive action.")}</p>
          </div>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)]">
            <Icon name="calendar" className="h-4 w-4" />
          </div>
        </div>

        {apps.length === 0 ? (
          <div className="rounded-[10px] border border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] px-3 py-4">
            <p className="text-sm font-bold text-[var(--applume-accent-hover)]">{t("phrases.No upcoming deadlines.")}</p>
            <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
              Add a deadline to an application and it will appear here.
            </p>
            {onAddDeadline && (
              <button
                type="button"
                onClick={onAddDeadline}
                className="mt-3 rounded-[9px] border border-[var(--applume-accent-border)] bg-[var(--surface-card)] px-3 py-2 text-xs font-bold text-[var(--applume-accent-hover)] transition hover:bg-[var(--applume-accent-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--applume-accent)] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[var(--surface-card)]"
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
                  className="rounded-[10px] border border-[var(--border)] bg-[var(--surface-soft)] p-3.5"
                >
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold leading-tight text-[var(--text-strong)]">{app.name}</p>
                      <p className="mt-1 truncate text-[13px] leading-5 text-[var(--text-muted)]">{app.programRole || label("type", app.type)}</p>
                    </div>
                    <span className="shrink-0 self-start">
                      <Badge tone={toneForDeadline(info)}>{info.label}</Badge>
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-[13px] font-semibold text-[var(--text-muted)]">{formatDate(app.deadline)}</p>
                    {onOpenRecord && (
                      <button
                        type="button"
                        onClick={() => onOpenRecord(app)}
                        aria-label={`${t("phrases.Open")} ${app.name}`}
                        className="rounded-lg px-2 py-1 text-xs font-bold text-[var(--applume-accent-hover)] transition hover:bg-[var(--applume-accent-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--applume-accent)] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[var(--surface-card)]"
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
