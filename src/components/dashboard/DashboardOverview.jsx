import { Icon } from "@/components/ui/Icon";
import { FocusThisWeek } from "@/components/dashboard/FocusThisWeek";
import { PipelineCard } from "@/components/dashboard/PipelineCard";
import { UpcomingDeadlinesCard } from "@/components/dashboard/UpcomingDeadlinesCard";
import { RecentActivityPanel } from "@/components/dashboard/OptionalPanels";
import { useLanguage } from "@/i18n";

function PanelGrid({ children }) {
  return (
    <div className="grid grid-cols-1 gap-4 min-[900px]:grid-cols-12 min-[900px]:items-start min-[900px]:gap-6">
      {children}
    </div>
  );
}

function PanelSpan({ span = 6, children }) {
  const spanClass = {
    4: "min-[900px]:col-span-4",
    5: "min-[900px]:col-span-5",
    6: "min-[900px]:col-span-6",
    7: "min-[900px]:col-span-7",
    8: "min-[900px]:col-span-8",
    12: "min-[900px]:col-span-12",
  }[span] || "min-[900px]:col-span-6";

  return (
    <div className={`min-w-0 ${spanClass}`}>
      {children}
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 className="mb-3 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">
      {children}
      <span className="h-px flex-1 bg-[var(--border)]" />
    </h2>
  );
}

function ApplicationReadinessPanel({ total, documented, incompleteItems, onOpenRecord }) {
  const pct = total > 0 ? Math.round((documented / total) * 100) : 0;
  const summary = `${pct}% ready · ${documented} of ${total} records include document notes · ${incompleteItems.length} need setup`;

  return (
    <div className="h-full rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-card)] p-4 shadow-[0_1px_0_rgba(0,0,0,0.02),0_18px_50px_-40px_rgba(12,20,16,0.28)] sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold leading-tight text-[var(--text-strong)]">Application readiness</h2>
          <p className="mt-1 text-[13px] leading-5 text-[var(--text-muted)]">
            Documents, deadlines, links, and next steps that still need setup.
          </p>
        </div>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)]">
          <Icon name="dashboard" className="h-4 w-4" />
        </div>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-soft)]" aria-label={`${pct}% application readiness`}>
        <div className="h-full rounded-full bg-[var(--applume-accent)]" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-3 text-sm font-semibold leading-6 text-[var(--text-strong)]">{summary}</p>

      {incompleteItems.length > 0 ? (
        <div className="mt-4 space-y-2">
          {incompleteItems.slice(0, 5).map(({ app, missing }) => (
            <button
              key={app.id}
              type="button"
              onClick={() => onOpenRecord?.(app)}
              aria-label={`Fix missing ${missing.join(", ")} for ${app.name}`}
              className="flex w-full min-w-0 items-center justify-between gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3 text-left transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--applume-accent)] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[var(--surface-card)]"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-[var(--text-strong)]">{app.name}</span>
                <span className="block truncate text-[13px] leading-5 text-[var(--text-muted)]">Missing {missing.join(", ")}</span>
              </span>
              <span className="shrink-0 text-xs font-bold text-[var(--applume-accent-hover)]">Fix</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-[10px] border border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] px-3 py-4">
          <p className="text-sm font-bold text-[var(--applume-accent-hover)]">Everything important is set up.</p>
          <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
            Applications with missing documents, deadlines, links, or next steps will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

// The Overview tab's two-tier panel grid: "needs your attention" first,
// portfolio-level progress second.
export function DashboardOverview({
  applications,
  total,
  pipeline,
  topDeadlines,
  focusThisWeek,
  documentReadiness,
  onOpenRecord,
  onAddDeadline,
  onReviewUrgent,
  onReviewInterviews,
  onReviewDocuments,
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      {/* Tier 1 — act on this now */}
      <section>
        <SectionHeading>{t("phrases.Needs your attention")}</SectionHeading>
        <div className="space-y-4 min-[900px]:space-y-6">
          <FocusThisWeek
            overdueCount={focusThisWeek.overdueItems.length}
            dueSoonCount={focusThisWeek.dueSoonItems.length}
            interviewCount={focusThisWeek.interviewItems.length}
            missingDocsCount={focusThisWeek.missingDocumentItems.length}
            onReviewUrgent={onReviewUrgent}
            onReviewInterviews={() => onReviewInterviews(focusThisWeek.interviewItems[0])}
            onReviewDocuments={() => onReviewDocuments(focusThisWeek.missingDocumentItems[0])}
          />
          <PanelGrid>
            <PanelSpan span={6}>
              <UpcomingDeadlinesCard apps={topDeadlines} onOpenRecord={onOpenRecord} onAddDeadline={onAddDeadline} />
            </PanelSpan>
            <PanelSpan span={6}>
              <ApplicationReadinessPanel
                total={total}
                documented={documentReadiness.documented}
                incompleteItems={documentReadiness.incompleteItems}
                onOpenRecord={onOpenRecord}
              />
            </PanelSpan>
          </PanelGrid>
        </div>
      </section>

      {/* Tier 2 — how the whole tracker is trending */}
      <section>
        <SectionHeading>{t("phrases.Your progress")}</SectionHeading>
        <PanelGrid>
          <PanelSpan span={7}>
            <PipelineCard pipeline={pipeline} total={total} />
          </PanelSpan>
          <PanelSpan span={5}>
            <RecentActivityPanel applications={applications} onOpenRecord={onOpenRecord} />
          </PanelSpan>
        </PanelGrid>
      </section>
    </div>
  );
}
