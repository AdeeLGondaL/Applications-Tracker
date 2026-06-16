import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";

export function DocumentsCompletenessCard({ total, documented, incompleteItems = [], onOpenRecord }) {
  const pct = total > 0 ? Math.round((documented / total) * 100) : 0;

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:shadow-none dark:ring-1 dark:ring-white/5">
      <CardContent className="p-4 sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-slate-950 dark:text-white">Document readiness</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-[#71717a]">
              {documented} of {total} records include document notes.
            </p>
          </div>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--applume-accent-soft)] text-[var(--applume-accent)] ring-1 ring-[var(--applume-accent-border)]">
            <Icon name="check" className="h-4 w-4" />
          </div>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-[#2a2a2e]" aria-label={`${pct}% document readiness`}>
          <div className="h-full rounded-full bg-[var(--applume-accent)]" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-[#d4d4d8]">{pct}% ready</span>
          <span className="text-slate-400 dark:text-[#71717a]">{Math.max(0, total - documented)} need setup</span>
        </div>

        {incompleteItems.length > 0 ? (
          <div className="mt-4 space-y-2">
            {incompleteItems.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => onOpenRecord?.(app)}
                className="flex w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-left transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] dark:border-[#2a2a2e] dark:bg-[#111113] dark:hover:bg-[#1c1c1f]"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-slate-800 dark:text-white">{app.name}</span>
                  <span className="block truncate text-xs text-slate-500 dark:text-[#71717a]">{app.programRole || app.type}</span>
                </span>
                <span className="shrink-0 text-xs font-bold text-[var(--applume-accent-hover)]">Open</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-[var(--applume-accent-soft)] px-3 py-3 text-sm font-semibold text-[var(--applume-accent-hover)]">
            Every active record has document context.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
