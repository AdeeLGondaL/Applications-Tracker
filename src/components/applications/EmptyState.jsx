import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";

export function EmptyState() {
  return (
    <Card className="rounded-[2rem] border border-dashed border-slate-300 bg-white dark:border-[#2a2a2e] dark:bg-[#1c1c1f]">
      <CardContent className="grid place-items-center p-12 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-3xl bg-slate-100 text-slate-500 dark:bg-[#1c1c1f] dark:text-[#71717a]">
          <Icon name="search" className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-black">No applications found</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-[#71717a]">
          Clear filters or add a new application to start tracking.
        </p>
      </CardContent>
    </Card>
  );
}

export function EmptyDashboard({ onAdd }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-16 text-center"
    >
      <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-[#1c1c1f] dark:ring-[#2a2a2e]">
        <Icon name="dashboard" className="h-9 w-9 text-slate-300 dark:text-[#3a3a3e]" />
      </div>
      <h2 className="text-2xl font-black">Nothing tracked yet</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400 dark:text-[#71717a]">
        Add your first application record to replace scattered spreadsheet rows with deadlines, links, notes, and next steps.
      </p>
      <div className="mt-7">
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-[#f0f0f0] dark:text-slate-900 dark:hover:bg-white"
        >
          <Icon name="plus" className="h-4 w-4" /> Add application
        </button>
      </div>
    </motion.div>
  );
}
