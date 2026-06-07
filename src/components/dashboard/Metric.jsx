import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";

const ACCENT = {
  slate:   { icon: "bg-slate-100 text-slate-600 dark:bg-[#2a2a2e] dark:text-[#a1a1aa]",     ring: "ring-slate-200 dark:ring-[#3a3a3e]"   },
  blue:    { icon: "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",        ring: "ring-blue-100 dark:ring-blue-800"      },
  violet:  { icon: "bg-violet-50 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400", ring: "ring-violet-100 dark:ring-violet-800" },
  emerald: { icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400", ring: "ring-emerald-100 dark:ring-emerald-800" },
  rose:    { icon: "bg-rose-50 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",        ring: "ring-rose-100 dark:ring-rose-800"      },
};

export function Metric({ icon, label, value, hint, accent = "slate", danger = false, delay = 0 }) {
  const a = ACCENT[danger ? "rose" : accent] || ACCENT.slate;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}>
      <Card className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:shadow-none dark:ring-1 dark:ring-white/5 dark:hover:bg-[#242428]">
        <CardContent className="p-4 sm:p-5">
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
