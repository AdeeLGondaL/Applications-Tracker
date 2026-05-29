import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { deadlineInfo, formatDate } from "@/utils/date";

export function UpcomingDeadlinesCard({ apps }) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-slate-950 text-white shadow-sm">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/10">
            <Icon name="calendar" className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-black">Upcoming Deadlines</h2>
            <p className="text-[10px] text-slate-400">Sorted by urgency</p>
          </div>
        </div>

        {apps.length === 0 ? (
          <p className="py-4 text-sm text-slate-400">
            No deadlines set yet. Add applications with deadlines to see them here.
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
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.25 }}
                  className="rounded-xl bg-white/10 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 truncate text-sm font-bold leading-tight">{app.name}</p>
                    <Badge tone="dark">{info.label}</Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-400">{app.programRole}</p>
                  <p className="mt-1.5 text-[10px] text-slate-500">{formatDate(app.deadline)}</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
