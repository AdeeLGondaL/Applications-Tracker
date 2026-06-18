import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
import { STATUSES } from "@/utils/constants";
import { daysUntil, deadlineInfo, formatDate } from "@/utils/date";

function PanelShell({ title, description, icon = "dashboard", children }) {
  return (
    <Card className="h-full rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1A1D22] dark:shadow-none dark:ring-1 dark:ring-white/5">
      <CardContent className="flex h-full flex-col p-4 sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-slate-950 dark:text-white">{title}</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-[#9AA4B2]">{description}</p>
          </div>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--applume-accent-soft)] text-[var(--applume-accent)] ring-1 ring-[var(--applume-accent-border)]">
            <Icon name={icon} className="h-4 w-4" />
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function EmptyPanel({ title, children, actionLabel, onAction }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-4 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#20242A]">
      {title && <p className="text-sm font-black text-slate-800 dark:text-[#F8FAFC]">{title}</p>}
      <p className={`${title ? "mt-1" : ""} text-sm font-semibold leading-6 text-slate-500 dark:text-[#9AA4B2]`}>{children}</p>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="mt-3 rounded-xl border border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] px-3 py-2 text-xs font-black text-[var(--applume-accent-hover)] transition hover:bg-[var(--applume-accent-muted)] dark:border-[rgba(0,153,102,0.28)] dark:bg-[rgba(0,153,102,0.16)] dark:text-[var(--applume-accent-muted)]">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function MiniBar({ label, value, total, color = "bg-[var(--applume-accent)]" }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-xs">
        <span className="truncate font-bold text-slate-700 dark:text-[#d4d4d8]">{label}</span>
        <span className="shrink-0 text-slate-400 dark:text-[#71717a]">{value}{total > 0 ? ` - ${pct}%` : ""}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-[#20242A]">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function QuickActionsPanel({ onAddUniversity, onAddJob, onImport, onCalendarSync }) {
  return (
    <PanelShell title="Quick actions" description="Fast ways to keep your tracker moving." icon="plus">
      <div className="grid gap-2">
        <button type="button" onClick={onAddUniversity} className="rounded-xl bg-slate-950 px-3 py-2.5 text-left text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-[#F8FAFC] dark:text-slate-900">
          Add university
        </button>
        <button type="button" onClick={onAddJob} className="rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-[rgba(255,255,255,0.09)] dark:text-[#F8FAFC] dark:hover:bg-[#20242A]">
          Add job
        </button>
        <button type="button" onClick={onImport} className="rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-[rgba(255,255,255,0.09)] dark:text-[#F8FAFC] dark:hover:bg-[#20242A]">
          Import backup
        </button>
        <button type="button" onClick={onCalendarSync} className="rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-[rgba(255,255,255,0.09)] dark:text-[#F8FAFC] dark:hover:bg-[#20242A]">
          Copy calendar URL
        </button>
      </div>
    </PanelShell>
  );
}

export function RecentActivityPanel({ applications, onOpenRecord }) {
  const recent = [...applications].sort((a, b) => String(b.lastUpdated).localeCompare(String(a.lastUpdated))).slice(0, 5);
  return (
    <PanelShell title="Recent activity" description="Recently added and updated applications." icon="reset">
      {recent.length === 0 ? (
        <EmptyPanel title="No recent activity yet.">
          Updates will appear here after you add or edit applications.
        </EmptyPanel>
      ) : (
        <div className="space-y-2.5">
          {recent.map((app) => (
            <button key={app.id} type="button" onClick={() => onOpenRecord?.(app)} className="flex w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-left transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] dark:border-[rgba(255,255,255,0.09)] dark:bg-[#20242A]">
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">{app.name}</span>
                <span className="block truncate text-xs text-slate-500 dark:text-[#9AA4B2]">{app.status} - {app.lastUpdated}</span>
              </span>
              <span className="shrink-0 text-xs font-bold text-[var(--applume-accent-hover)]">Open</span>
            </button>
          ))}
        </div>
      )}
    </PanelShell>
  );
}

export function CalendarPreviewPanel({ applications, onOpenRecord, onAddDeadline }) {
  const items = [...applications]
    .filter((app) => daysUntil(app.deadline) !== null)
    .sort((a, b) => deadlineInfo(a.deadline).sort - deadlineInfo(b.deadline).sort)
    .slice(0, 5);
  return (
    <PanelShell title="Calendar preview" description="Upcoming deadlines and interview-stage work." icon="calendar">
      {items.length === 0 ? (
        <EmptyPanel title="No upcoming dates yet." actionLabel="Add deadline" onAction={onAddDeadline}>
          Add deadlines or follow-up dates to build your calendar view.
        </EmptyPanel>
      ) : (
        <div className="space-y-2.5">
          {items.map((app) => (
            <button key={app.id} type="button" onClick={() => onOpenRecord?.(app)} className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-left transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] dark:border-[rgba(255,255,255,0.09)] dark:bg-[#20242A]">
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">{app.name}</span>
                <span className="block text-xs text-slate-500 dark:text-[#9AA4B2]">{formatDate(app.deadline)}</span>
              </span>
              <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-black text-slate-500 ring-1 ring-slate-200 dark:bg-[#1A1D22] dark:text-[#9AA4B2] dark:ring-[rgba(255,255,255,0.09)]">{deadlineInfo(app.deadline).label}</span>
            </button>
          ))}
        </div>
      )}
    </PanelShell>
  );
}

export function InterviewsFollowupsPanel({ applications, onOpenRecord, onReviewPipeline }) {
  const items = applications.filter((app) => app.status === "Interview" || String(app.notes || "").toLowerCase().includes("follow")).slice(0, 5);
  return (
    <PanelShell title="Interviews and follow-ups" description="Interview-stage records and follow-up notes." icon="job">
      {items.length === 0 ? (
        <EmptyPanel title="No interviews or follow-ups yet." actionLabel="Review pipeline" onAction={onReviewPipeline}>
          When an application reaches interview stage or has a follow-up note, it will appear here.
        </EmptyPanel>
      ) : (
        <div className="space-y-2.5">
          {items.map((app) => (
            <button key={app.id} type="button" onClick={() => onOpenRecord?.(app)} className="block w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-left transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] dark:border-[rgba(255,255,255,0.09)] dark:bg-[#20242A]">
              <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">{app.name}</span>
              <span className="mt-1 block truncate text-xs text-slate-500 dark:text-[#9AA4B2]">{app.notes || app.status}</span>
            </button>
          ))}
        </div>
      )}
    </PanelShell>
  );
}

export function MissingInformationPanel({ applications, onOpenRecord }) {
  const items = applications
    .map((app) => {
      const missing = [
        !app.deadline && "deadline",
        !app.documents && "documents",
        !app.link && "portal/link",
        !app.notes && "next step",
      ].filter(Boolean);
      return { app, missing };
    })
    .filter((entry) => entry.missing.length > 0)
    .slice(0, 5);

  return (
    <PanelShell title="Missing information" description="Records missing deadlines, links, documents, or notes." icon="check">
      {items.length === 0 ? (
        <EmptyPanel>All visible records include the key context Applume needs.</EmptyPanel>
      ) : (
        <div className="space-y-2.5">
          {items.map(({ app, missing }) => (
            <button key={app.id} type="button" onClick={() => onOpenRecord?.(app)} className="flex w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-left transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] dark:border-[rgba(255,255,255,0.09)] dark:bg-[#20242A]">
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">{app.name}</span>
                <span className="block truncate text-xs text-slate-500 dark:text-[#9AA4B2]">Missing {missing.join(", ")}</span>
              </span>
              <span className="shrink-0 text-xs font-bold text-[var(--applume-accent-hover)]">Fix</span>
            </button>
          ))}
        </div>
      )}
    </PanelShell>
  );
}

export function ApplicationsByStatusPanel({ applications }) {
  const total = applications.length;
  return (
    <PanelShell title="Applications by status" description="A simple status distribution for your tracker." icon="dashboard">
      {total === 0 ? <EmptyPanel>Add records to see status distribution.</EmptyPanel> : (
        <div className="space-y-3">
          {STATUSES.map((status) => (
            <MiniBar key={status} label={status} value={applications.filter((app) => app.status === status).length} total={total} />
          ))}
        </div>
      )}
    </PanelShell>
  );
}

export function DeadlinesNext30DaysPanel({ applications }) {
  const buckets = [
    { label: "Overdue", value: applications.filter((app) => daysUntil(app.deadline) < 0).length, color: "bg-rose-500" },
    { label: "0-7 days", value: applications.filter((app) => { const d = daysUntil(app.deadline); return d !== null && d >= 0 && d <= 7; }).length, color: "bg-[var(--warning)]" },
    { label: "8-30 days", value: applications.filter((app) => { const d = daysUntil(app.deadline); return d !== null && d >= 8 && d <= 30; }).length, color: "bg-[var(--applume-accent)]" },
  ];
  const total = buckets.reduce((sum, bucket) => sum + bucket.value, 0);
  return (
    <PanelShell title="Deadlines next 30 days" description="Deadline pressure over the next month." icon="calendar">
      {total === 0 ? <EmptyPanel>No dated deadlines in the next 30 days.</EmptyPanel> : (
        <div className="space-y-3">{buckets.map((bucket) => <MiniBar key={bucket.label} {...bucket} total={total} />)}</div>
      )}
    </PanelShell>
  );
}

export function SubmissionTrendPanel({ applications }) {
  const submitted = applications.filter((app) => ["Submitted", "Awaiting Response", "Interview", "Accepted"].includes(app.status)).length;
  return (
    <PanelShell title="Submission trend" description="Recent submitted-or-beyond movement." icon="check">
      <MiniBar label="Submitted or beyond" value={submitted} total={applications.length} />
      <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-[#71717a]">This first version summarizes current progress. A historical trend can be added once dated status history exists.</p>
    </PanelShell>
  );
}

export function JobResponseRatePanel({ applications, onAddJob }) {
  const jobs = applications.filter((app) => app.type === "Job");
  const responses = jobs.filter((app) => ["Interview", "Accepted"].includes(app.status)).length;
  return (
    <PanelShell title="Job response rate" description="Job applications with interviews or positive outcomes." icon="job">
      {jobs.length === 0 ? (
        <EmptyPanel title="Not enough job data yet." actionLabel="Add job" onAction={onAddJob}>
          Add job applications or mark responses to see your response rate.
        </EmptyPanel>
      ) : (
        <MiniBar label="Interviews or accepted" value={responses} total={jobs.length} color="bg-[var(--info)]" />
      )}
    </PanelShell>
  );
}

export function UniversityDeadlineDistributionPanel({ applications }) {
  const universities = applications.filter((app) => app.type === "University");
  const dated = universities.filter((app) => daysUntil(app.deadline) !== null);
  const buckets = [
    { label: "Due soon", value: dated.filter((app) => { const d = daysUntil(app.deadline); return d !== null && d <= 30; }).length, color: "bg-[var(--warning)]" },
    { label: "Later", value: dated.filter((app) => { const d = daysUntil(app.deadline); return d !== null && d > 30; }).length, color: "bg-[var(--applume-accent)]" },
  ];
  return (
    <PanelShell title="University deadline distribution" description="University deadlines grouped by timing." icon="university">
      {dated.length === 0 ? <EmptyPanel>Add university deadlines to see their distribution.</EmptyPanel> : (
        <div className="space-y-3">{buckets.map((bucket) => <MiniBar key={bucket.label} {...bucket} total={dated.length} />)}</div>
      )}
    </PanelShell>
  );
}
