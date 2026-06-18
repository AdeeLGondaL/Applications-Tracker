import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";

function PanelShell({ title, description, icon = "dashboard", children }) {
  return (
    <Card className="h-full rounded-[22px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)] dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1A1D22] dark:shadow-none dark:ring-1 dark:ring-white/5">
      <CardContent className="flex h-full flex-col p-4 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-black leading-tight text-slate-950 dark:text-white">{title}</h2>
            <p className="mt-1 text-[13px] leading-5 text-slate-500 dark:text-[#9AA4B2]">{description}</p>
          </div>
          {icon && (
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--applume-accent-soft)] text-[var(--applume-accent)] ring-1 ring-[var(--applume-accent-border)] dark:bg-[rgba(0,153,102,0.16)]">
              <Icon name={icon} className="h-4 w-4" />
            </div>
          )}
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

export function QuickActionsPanel({ onAddUniversity, onAddJob, onImport, onCalendarSync }) {
  return (
    <PanelShell title="Quick actions" description="Fast ways to keep your tracker moving." icon={null}>
      <div className="grid gap-2.5">
        <button type="button" onClick={onAddUniversity} className="flex h-11 items-center gap-2.5 rounded-xl bg-slate-950 px-3.5 text-left text-sm font-bold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--applume-accent)] focus:ring-offset-2 dark:bg-[#F8FAFC] dark:text-slate-900 dark:focus:ring-offset-[#1A1D22]">
          <Icon name="university" className="h-4 w-4" /> Add university
        </button>
        <button type="button" onClick={onAddJob} className="flex h-11 items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 text-left text-sm font-bold text-slate-700 transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--applume-accent)] focus:ring-offset-2 dark:border-[rgba(255,255,255,0.09)] dark:text-[#F8FAFC] dark:hover:bg-[#20242A] dark:focus:ring-offset-[#1A1D22]">
          <Icon name="job" className="h-4 w-4" /> Add job
        </button>
        <button type="button" onClick={onImport} className="flex h-11 items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 text-left text-sm font-bold text-slate-700 transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--applume-accent)] focus:ring-offset-2 dark:border-[rgba(255,255,255,0.09)] dark:text-[#F8FAFC] dark:hover:bg-[#20242A] dark:focus:ring-offset-[#1A1D22]">
          <Icon name="upload" className="h-4 w-4" /> Import backup
        </button>
        <button type="button" onClick={onCalendarSync} className="flex h-11 items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 text-left text-sm font-bold text-slate-700 transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--applume-accent)] focus:ring-offset-2 dark:border-[rgba(255,255,255,0.09)] dark:text-[#F8FAFC] dark:hover:bg-[#20242A] dark:focus:ring-offset-[#1A1D22]">
          <Icon name="calendar" className="h-4 w-4" /> Copy calendar URL
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
            <button key={app.id} type="button" onClick={() => onOpenRecord?.(app)} aria-label={`Open ${app.name} application`} className="flex w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-left transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--applume-accent)] focus:ring-offset-2 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#20242A] dark:focus:ring-offset-[#1A1D22]">
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">{app.name}</span>
                <span className="block truncate text-[13px] leading-5 text-slate-500 dark:text-[#9AA4B2]">{app.status} - {app.lastUpdated}</span>
              </span>
              <span className="shrink-0 text-xs font-bold text-[var(--applume-accent-hover)]">Open</span>
            </button>
          ))}
        </div>
      )}
    </PanelShell>
  );
}

export function NextStepCoveragePanel({ total, withNextStep, onAddNextSteps }) {
  const missing = Math.max(total - withNextStep, 0);
  const pct = total > 0 ? Math.round((withNextStep / total) * 100) : 0;

  return (
    <PanelShell title="Next step coverage" description="How many records have an actionable next step." icon="check">
      {total === 0 ? (
        <EmptyPanel title="No next steps yet." actionLabel="Add application" onAction={onAddNextSteps}>
          Add your first application to start planning what happens next.
        </EmptyPanel>
      ) : (
        <div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#20242A]">
            <p className="text-3xl font-black leading-none text-slate-950 dark:text-white">{withNextStep} of {total}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-[#9AA4B2]">
              applications have a next step. {missing} need setup.
            </p>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200/70 dark:bg-[#111318]" aria-label={`${pct}% next step coverage`}>
              <div className="h-full rounded-full bg-[var(--applume-accent)]" style={{ width: `${pct}%` }} />
            </div>
          </div>
          {missing > 0 && (
            <button type="button" onClick={onAddNextSteps} className="mt-3 w-full rounded-xl border border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] px-3 py-2.5 text-sm font-black text-[var(--applume-accent-hover)] transition hover:bg-[var(--applume-accent-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--applume-accent)] focus:ring-offset-2 dark:border-[rgba(0,153,102,0.28)] dark:bg-[rgba(0,153,102,0.16)] dark:text-[var(--applume-accent-muted)] dark:focus:ring-offset-[#1A1D22]">
              Add next steps
            </button>
          )}
        </div>
      )}
    </PanelShell>
  );
}
