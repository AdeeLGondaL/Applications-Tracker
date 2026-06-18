import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";

const ACCENT = {
  slate:   { icon: "bg-slate-100 text-slate-600 dark:bg-[#2a2a2e] dark:text-[#a1a1aa]",     ring: "ring-slate-200 dark:ring-[#3a3a3e]"   },
  blue:    { icon: "bg-[var(--info-soft)] text-[var(--info)] dark:bg-blue-900/40 dark:text-blue-400", ring: "ring-blue-100 dark:ring-blue-800" },
  accent:  { icon: "bg-[var(--applume-accent-soft)] text-[var(--applume-accent)] dark:bg-[rgba(0,153,102,0.18)] dark:text-[var(--applume-accent-muted)]", ring: "ring-[var(--applume-accent-border)] dark:ring-[rgba(0,153,102,0.32)]" },
  emerald: { icon: "bg-[var(--applume-accent-soft)] text-[var(--applume-accent)] dark:bg-[rgba(0,153,102,0.18)] dark:text-[var(--applume-accent-muted)]", ring: "ring-[var(--applume-accent-border)] dark:ring-[rgba(0,153,102,0.32)]" },
  violet:  { icon: "bg-violet-50 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400", ring: "ring-violet-100 dark:ring-violet-800" },
  rose:    { icon: "bg-rose-50 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",        ring: "ring-rose-100 dark:ring-rose-800"      },
};

export function Metric({ icon, label, value, hint, accent = "slate", danger = false, delay = 0, progressValue = null }) {
  const a = ACCENT[danger ? "rose" : accent] || ACCENT.slate;
  return (
    <motion.div data-kpi-card className="h-full min-h-[150px] max-h-[190px]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, delay }}>
      <Card className="h-full min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1A1D22] dark:shadow-none dark:ring-1 dark:ring-white/5 dark:hover:bg-[#20242A]">
        <CardContent className="flex h-full flex-col p-4 sm:p-5">
          <div className="mb-4 flex min-w-0 items-start justify-between gap-2">
            <div className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${a.icon} ${a.ring}`}>
              <Icon name={icon} />
            </div>
            {danger && value > 0 && (
              <span className="shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">
                Urgent
              </span>
            )}
          </div>
          <p className="text-2xl font-black tabular-nums leading-none sm:text-3xl">{value}</p>
          <p className="mt-1.5 break-words text-sm font-bold text-slate-700 dark:text-[#d4d4d8]">{label}</p>
          <p className="mt-0.5 break-words text-xs text-slate-400 dark:text-[#71717a]">{hint}</p>
          <div className="mt-auto pt-4">
            <div
              className={`h-1.5 overflow-hidden rounded-full ${typeof progressValue === "number" ? "bg-slate-100 dark:bg-[#2a2a2e]" : "bg-transparent"}`}
              aria-hidden={typeof progressValue === "number" ? undefined : true}
              aria-label={typeof progressValue === "number" ? `${progressValue}% ${label}` : undefined}
            >
              {typeof progressValue === "number" && (
              <motion.div
                className="h-full rounded-full bg-[var(--applume-accent)]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, Math.min(100, progressValue))}%` }}
                transition={{ duration: 0.35, ease: "easeOut", delay: delay + 0.05 }}
              />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
