import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";

export function EmptyState() {
  return (
    <Card className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--surface-card)]">
      <CardContent className="grid place-items-center p-12 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)]">
          <Icon name="search" className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold text-[var(--text-strong)]">No matching records</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-muted)]">
          Clear filters or add a new application record to keep building your tracker.
        </p>
      </CardContent>
    </Card>
  );
}

export function EmptyDashboard({ onAdd, onImport }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-16 text-center"
    >
      <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-[16px] border border-[var(--border)] bg-[var(--surface-card)] shadow-sm">
        <Icon name="dashboard" className="h-9 w-9 text-[var(--text-soft)]" />
      </div>
      <h2 className="font-display text-2xl font-semibold text-[var(--text-strong)]">Track your first application</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--text-muted)]">
        Add one real application or import an existing backup. Applume will keep deadlines, links, notes, documents, and next steps together.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-2.5">
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-[10px] bg-[var(--applume-accent-strong)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--applume-accent-ink)]"
        >
          <Icon name="plus" className="h-4 w-4" /> Add application
        </button>
        <button
          type="button"
          onClick={onImport}
          className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--border)] bg-[var(--surface-card)] px-5 py-2.5 text-sm font-semibold text-[var(--text-muted)] transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] hover:text-[var(--applume-accent-hover)]"
        >
          <Icon name="upload" className="h-4 w-4" /> Import backup
        </button>
      </div>
    </motion.div>
  );
}
