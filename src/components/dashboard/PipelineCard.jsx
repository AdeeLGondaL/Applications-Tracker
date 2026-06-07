import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { STATUSES } from "@/utils/constants";

const STATUS_COLOR = {
  "Not Open Yet":      "bg-slate-300",
  "Open":              "bg-sky-400",
  "Applying":          "bg-violet-500",
  "Submitted":         "bg-emerald-500",
  "Awaiting Response": "bg-amber-400",
  "Interview":         "bg-orange-500",
  "Accepted":          "bg-emerald-500",
  "Rejected":          "bg-rose-400",
  "Deferred":          "bg-slate-400",
};

export function PipelineCard({ pipeline, total }) {
  const rows = STATUSES.map((status) => ({
    status,
    count: pipeline.find((p) => p.status === status)?.count || 0,
    color: STATUS_COLOR[status] || "bg-slate-300",
  }));

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:shadow-none dark:ring-1 dark:ring-white/5">
      <CardContent className="p-4 sm:p-5">
        <div className="mb-5">
          <h2 className="text-base font-black">Status breakdown</h2>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-[#71717a]">{total} total · status breakdown</p>
        </div>

        {total === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400 dark:text-[#71717a]">No applications yet.</p>
        ) : (
          <div className="space-y-3 sm:space-y-2.5">
            {rows.map(({ status, count, color }, i) => {
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
                      transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 + i * 0.04 }}
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
        )}
      </CardContent>
    </Card>
  );
}
