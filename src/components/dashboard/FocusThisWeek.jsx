import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";

function FocusTile({ icon, label, value, detail, tone = "slate", actionLabel, onClick }) {
  const toneClass = {
    danger: "bg-rose-50 text-rose-600 ring-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:ring-rose-800",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)] ring-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-800",
    accent: "bg-[var(--applume-accent-soft)] text-[var(--applume-accent)] ring-[var(--applume-accent-border)] dark:bg-[rgba(0,153,102,0.18)] dark:text-[var(--applume-accent-muted)] dark:ring-[rgba(0,153,102,0.32)]",
    blue: "bg-[var(--info-soft)] text-[var(--info)] ring-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-800",
    slate: "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-[#2a2a2e] dark:text-[#a1a1aa] dark:ring-[#3a3a3e]",
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[8.25rem] min-w-0 flex-col rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] dark:border-[#2a2a2e] dark:bg-[#111113] dark:hover:bg-[#1c1c1f]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 ${toneClass}`}>
          <Icon name={icon} className="h-4 w-4" />
        </span>
        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-400 ring-1 ring-slate-200 dark:bg-[#1c1c1f] dark:text-[#71717a] dark:ring-[#2a2a2e]">
          {actionLabel}
        </span>
      </div>
      <p className="mt-4 text-2xl font-black tabular-nums leading-none text-slate-950 dark:text-white">{value}</p>
      <p className="mt-1 text-sm font-black text-slate-800 dark:text-[#d4d4d8]">{label}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-[#71717a]">{detail}</p>
    </button>
  );
}

export function FocusThisWeek({
  showQuickActions = true,
  overdueCount,
  dueSoonCount,
  interviewCount,
  missingDocsCount,
  onReviewUrgent,
  onReviewInterviews,
  onReviewDocuments,
  onAddUniversity,
  onAddJob,
  onImport,
  onCalendarSync,
}) {
  const focusTone = overdueCount > 0 ? "danger" : dueSoonCount > 0 ? "warning" : "accent";

  return (
    <div className={showQuickActions ? "grid gap-4 xl:grid-cols-[1.45fr_0.55fr]" : "h-full"}>
      <Card className="h-full rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1A1D22] dark:shadow-none dark:ring-1 dark:ring-white/5">
        <CardContent className="p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--applume-accent)]">Today focus</p>
              <h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">Action queue</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-[#71717a]">
                Your action queue for deadlines, interviews, and setup gaps.
              </p>
            </div>
            <button
              type="button"
              onClick={onReviewUrgent}
              className="rounded-xl border border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] px-3 py-2 text-xs font-black text-[var(--applume-accent-hover)] transition hover:bg-[var(--applume-accent-muted)]"
            >
              Review queue
            </button>
          </div>
          <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <FocusTile
              icon="reset"
              label="Overdue"
              value={overdueCount}
              detail={overdueCount > 0 ? "Needs attention before anything else." : "No overdue active records."}
              tone={overdueCount > 0 ? "danger" : "slate"}
              actionLabel="Review"
              onClick={onReviewUrgent}
            />
            <FocusTile
              icon="calendar"
              label="Due in 7 days"
              value={dueSoonCount}
              detail={dueSoonCount > 0 ? "Upcoming deadlines to prepare now." : "Nothing due in the next week."}
              tone={focusTone}
              actionLabel="Open"
              onClick={onReviewUrgent}
            />
            <FocusTile
              icon="job"
              label="Interviews"
              value={interviewCount}
              detail={interviewCount > 0 ? "Active interview-stage records." : "No active interview records yet."}
              tone="blue"
              actionLabel="Filter"
              onClick={onReviewInterviews}
            />
            <FocusTile
              icon="check"
              label="Missing docs"
              value={missingDocsCount}
              detail={missingDocsCount > 0 ? "Records without document context." : "Document context is complete."}
              tone="accent"
              actionLabel="Fix"
              onClick={onReviewDocuments}
            />
          </div>
        </CardContent>
      </Card>

      {showQuickActions && (
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1A1D22] dark:shadow-none dark:ring-1 dark:ring-white/5">
        <CardContent className="flex h-full flex-col p-4 sm:p-5">
          <div>
            <h2 className="text-base font-black text-slate-950 dark:text-white">Quick actions</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-[#71717a]">
              Start from the action that gets your pipeline clearer fastest.
            </p>
          </div>
          <div className="mt-4 grid gap-2">
            <button type="button" onClick={onAddUniversity} className="flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2.5 text-left text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-[#f0f0f0] dark:text-slate-900 dark:hover:bg-white">
              <Icon name="university" className="h-4 w-4" /> Add university
            </button>
            <button type="button" onClick={onAddJob} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm font-bold text-slate-700 transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] dark:border-[#2a2a2e] dark:bg-[#111113] dark:text-[#d4d4d8] dark:hover:bg-[#242428]">
              <Icon name="job" className="h-4 w-4" /> Add job
            </button>
            <button type="button" onClick={onImport} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm font-bold text-slate-700 transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] dark:border-[#2a2a2e] dark:bg-[#111113] dark:text-[#d4d4d8] dark:hover:bg-[#242428]">
              <Icon name="upload" className="h-4 w-4" /> Import backup
            </button>
            <button type="button" onClick={onCalendarSync} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm font-bold text-slate-700 transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] dark:border-[#2a2a2e] dark:bg-[#111113] dark:text-[#d4d4d8] dark:hover:bg-[#242428]">
              <Icon name="calendar" className="h-4 w-4" /> Copy calendar URL
            </button>
          </div>
        </CardContent>
      </Card>
      )}
    </div>
  );
}
