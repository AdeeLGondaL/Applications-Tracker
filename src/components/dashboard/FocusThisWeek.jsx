import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";

// Tiles stay neutral by default; only genuine attention items (overdue, due soon)
// pick up a soft token tint. Interviews / missing-docs read calmly in neutral.
const HOT_TONE = {
  danger: {
    tile: "border-[color-mix(in_srgb,var(--danger)_24%,var(--border))] bg-[var(--danger-soft)]",
    chip: "bg-[color-mix(in_srgb,var(--danger)_16%,transparent)] text-[var(--danger)]",
    value: "text-[var(--danger)]",
  },
  warning: {
    tile: "border-[color-mix(in_srgb,var(--warning)_26%,var(--border))] bg-[var(--warning-soft)]",
    chip: "bg-[color-mix(in_srgb,var(--warning)_16%,transparent)] text-[var(--warning-ink)]",
    value: "text-[var(--warning-ink)]",
  },
};

function FocusTile({ icon, label, value, detail, hot = false, tone = null, actionLabel, onClick, ariaLabel }) {
  const t = hot && tone ? HOT_TONE[tone] : null;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex min-h-[9rem] min-w-0 flex-col rounded-[12px] border p-4 text-left transition hover:border-[var(--applume-accent-border)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--applume-accent)] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[var(--surface-card)] sm:p-5 ${
        t ? t.tile : "border-[var(--border)] bg-[var(--surface-soft)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[10px] ${t ? t.chip : "bg-[var(--surface-card)] text-[var(--text-muted)] ring-1 ring-[var(--border)]"}`}>
          <Icon name={icon} className="h-4 w-4" />
        </span>
        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-card)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--text-soft)]">
          {actionLabel}
        </span>
      </div>
      <p className={`mt-5 font-display text-[30px] font-semibold tabular-nums leading-none ${t ? t.value : "text-[var(--text-strong)]"}`}>{value}</p>
      <p className="mt-2 text-sm font-semibold text-[var(--text-strong)]">{label}</p>
      <p className="mt-1 text-[13px] leading-5 text-[var(--text-muted)]">{detail}</p>
    </button>
  );
}

export function FocusThisWeek({
  overdueCount,
  dueSoonCount,
  interviewCount,
  missingDocsCount,
  onReviewUrgent,
  onReviewInterviews,
  onReviewDocuments,
}) {
  return (
    <Card className="relative h-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-card)] shadow-[0_1px_0_rgba(0,0,0,0.02),0_18px_50px_-40px_rgba(12,20,16,0.3)]">
      {/* Intentional accent: one soft wash instead of scattered colour */}
      <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[var(--applume-accent-soft)] opacity-50 blur-3xl" />
      <CardContent className="relative p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--applume-accent-hover)]">Today focus</p>
            <h2 className="mt-1 font-display text-lg font-semibold leading-tight text-[var(--text-strong)]">Action queue</h2>
            <p className="mt-1 text-[13px] leading-5 text-[var(--text-muted)]">
              Deadlines, interviews, and setup gaps that need you.
            </p>
          </div>
          <button
            type="button"
            onClick={onReviewUrgent}
            aria-label="Review overdue and urgent applications"
            className="rounded-[9px] border border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] px-3 py-2 text-xs font-bold text-[var(--applume-accent-hover)] transition hover:bg-[var(--applume-accent-soft-2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--applume-accent)] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[var(--surface-card)]"
          >
            Review queue
          </button>
        </div>
        <div className="grid gap-3 min-[520px]:grid-cols-2 xl:grid-cols-4">
          <FocusTile
            icon="reset"
            label="Overdue"
            value={overdueCount}
            detail={overdueCount > 0 ? "Needs attention before anything else." : "No overdue active records."}
            hot={overdueCount > 0}
            tone="danger"
            actionLabel="Review"
            onClick={onReviewUrgent}
            ariaLabel="Review overdue applications"
          />
          <FocusTile
            icon="calendar"
            label="Due in 7 days"
            value={dueSoonCount}
            detail={dueSoonCount > 0 ? "Upcoming deadlines to prepare now." : "Nothing due in the next week."}
            hot={dueSoonCount > 0}
            tone="warning"
            actionLabel="Open"
            onClick={onReviewUrgent}
            ariaLabel="Open applications due in the next seven days"
          />
          <FocusTile
            icon="job"
            label="Interviews"
            value={interviewCount}
            detail={interviewCount > 0 ? "Active interview-stage records." : "No active interview records yet."}
            actionLabel="Filter"
            onClick={onReviewInterviews}
            ariaLabel="Filter interview applications"
          />
          <FocusTile
            icon="check"
            label="Missing docs"
            value={missingDocsCount}
            detail={missingDocsCount > 0 ? "Records with unchecked documents." : "Every document is checked off."}
            actionLabel="Fix"
            onClick={onReviewDocuments}
            ariaLabel="Fix applications with missing document context"
          />
        </div>
      </CardContent>
    </Card>
  );
}
