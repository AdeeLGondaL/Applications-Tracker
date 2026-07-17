import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
import { STATUSES } from "@/utils/constants";
import { useLanguage } from "@/i18n";

const STATUS_DISTRIBUTION_COLORS = {
  "Not Open Yet": "bg-slate-400",
  "Open": "bg-blue-400",
  "Applying": "bg-[var(--warning)]",
  "Submitted": "bg-[var(--applume-accent)]",
  "Awaiting Response": "bg-amber-400",
  "Interview": "bg-orange-500",
  "Accepted": "bg-emerald-500",
  "Rejected": "bg-rose-400",
  "Deferred": "bg-slate-500",
};

function PanelShell({ title, description, icon = "dashboard", children }) {
  return (
    <Card className="h-full rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-card)] shadow-[0_1px_0_rgba(0,0,0,0.02),0_18px_50px_-40px_rgba(12,20,16,0.28)]">
      <CardContent className="flex h-full flex-col p-4 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold leading-tight text-[var(--text-strong)]">{title}</h2>
            <p className="mt-1 text-[13px] leading-5 text-[var(--text-muted)]">{description}</p>
          </div>
          {icon && (
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)]">
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
    <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-4">
      {title && <p className="text-sm font-bold text-[var(--text-strong)]">{title}</p>}
      <p className={`${title ? "mt-1" : ""} text-sm leading-6 text-[var(--text-muted)]`}>{children}</p>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="mt-3 rounded-[9px] border border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] px-3 py-2 text-xs font-bold text-[var(--applume-accent-hover)] transition hover:bg-[var(--applume-accent-soft-2)]">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function QuickActionsPanel({ onAddUniversity, onAddJob, onImport, onCalendarSync }) {
  const { t } = useLanguage();
  return (
    <PanelShell title={t("phrases.Quick actions")} description={t("phrases.Fast ways to keep your tracker moving.")} icon={null}>
      <div className="grid gap-2.5">
        <button type="button" onClick={onAddUniversity} className="flex h-11 items-center gap-2.5 rounded-xl bg-slate-950 px-3.5 text-left text-sm font-bold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--applume-accent)] focus:ring-offset-2 dark:bg-[#F8FAFC] dark:text-slate-900 dark:focus:ring-offset-[#1A1D22]">
          <Icon name="university" className="h-4 w-4" /> {t("phrases.Add university")}
        </button>
        <button type="button" onClick={onAddJob} className="flex h-11 items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 text-left text-sm font-bold text-slate-700 transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--applume-accent)] focus:ring-offset-2 dark:border-[rgba(255,255,255,0.09)] dark:text-[#F8FAFC] dark:hover:bg-[#20242A] dark:focus:ring-offset-[#1A1D22]">
          <Icon name="job" className="h-4 w-4" /> {t("phrases.Add job")}
        </button>
        <button type="button" onClick={onImport} className="flex h-11 items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 text-left text-sm font-bold text-slate-700 transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--applume-accent)] focus:ring-offset-2 dark:border-[rgba(255,255,255,0.09)] dark:text-[#F8FAFC] dark:hover:bg-[#20242A] dark:focus:ring-offset-[#1A1D22]">
          <Icon name="upload" className="h-4 w-4" /> {t("phrases.Import backup")}
        </button>
        <button type="button" onClick={onCalendarSync} className="flex h-11 items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 text-left text-sm font-bold text-slate-700 transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--applume-accent)] focus:ring-offset-2 dark:border-[rgba(255,255,255,0.09)] dark:text-[#F8FAFC] dark:hover:bg-[#20242A] dark:focus:ring-offset-[#1A1D22]">
          <Icon name="calendar" className="h-4 w-4" /> {t("phrases.Copy calendar URL")}
        </button>
      </div>
    </PanelShell>
  );
}

export function RecentActivityPanel({ applications, onOpenRecord }) {
  const { formatDate, label, t } = useLanguage();
  const recent = [...applications].sort((a, b) => String(b.lastUpdated).localeCompare(String(a.lastUpdated))).slice(0, 5);
  return (
    <PanelShell title={t("phrases.Recent activity")} description={t("phrases.Recently added and updated applications.")} icon="reset">
      {recent.length === 0 ? (
        <EmptyPanel title={t("phrases.No recent activity yet.")}>
          {t("phrases.Updates will appear here after you add or edit applications.")}
        </EmptyPanel>
      ) : (
        <div className="space-y-2.5">
          {recent.map((app) => (
            <button key={app.id} type="button" onClick={() => onOpenRecord?.(app)} aria-label={`Open ${app.name} application`} className="flex w-full min-w-0 items-center justify-between gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3 text-left transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--applume-accent)] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[var(--surface-card)]">
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-[var(--text-strong)]">{app.name}</span>
              <span className="block truncate text-[13px] leading-5 text-[var(--text-muted)]">{label("status", app.status)} - {formatDate(app.lastUpdated)}</span>
              </span>
              <span className="shrink-0 text-xs font-bold text-[var(--applume-accent-hover)]">{t("phrases.Open")}</span>
            </button>
          ))}
        </div>
      )}
    </PanelShell>
  );
}

export function NextStepCoveragePanel({ total, withNextStep, onAddNextSteps }) {
  const { t } = useLanguage();
  const missing = Math.max(total - withNextStep, 0);
  const pct = total > 0 ? Math.round((withNextStep / total) * 100) : 0;

  return (
    <PanelShell title={t("phrases.Next step coverage")} description={t("phrases.How many records have an actionable next step.")} icon="check">
      {total === 0 ? (
        <EmptyPanel title={t("phrases.No next steps yet.")} actionLabel={t("phrases.Add application")} onAction={onAddNextSteps}>
          Add your first application to start planning what happens next.
        </EmptyPanel>
      ) : (
        <div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#20242A]">
            <p className="text-3xl font-black leading-none text-slate-950 dark:text-white">{withNextStep} of {total}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-[#9AA4B2]">
              {t("phrases.applications have a next step.")} {missing} {t("phrases.need setup.")}
            </p>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200/70 dark:bg-[#111318]" aria-label={`${pct}% next step coverage`}>
              <div className="h-full rounded-full bg-[var(--applume-accent)]" style={{ width: `${pct}%` }} />
            </div>
          </div>
          {missing > 0 && (
            <button type="button" onClick={onAddNextSteps} className="mt-3 w-full rounded-xl border border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] px-3 py-2.5 text-sm font-black text-[var(--applume-accent-hover)] transition hover:bg-[var(--applume-accent-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--applume-accent)] focus:ring-offset-2 dark:border-[rgba(0,153,102,0.28)] dark:bg-[rgba(0,153,102,0.16)] dark:text-[var(--applume-accent-muted)] dark:focus:ring-offset-[#1A1D22]">
              {t("phrases.Add next steps")}
            </button>
          )}
        </div>
      )}
    </PanelShell>
  );
}

export function StatusDistributionPanel({ applications }) {
  const { label, t } = useLanguage();
  const total = applications.length;
  const rows = STATUSES.map((status) => ({
    status,
    count: applications.filter((app) => app.status === status).length,
    color: STATUS_DISTRIBUTION_COLORS[status] || "bg-slate-300",
  })).filter((row) => row.count > 0);
  const topRows = [...rows]
    .sort((a, b) => b.count - a.count || STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status))
    .slice(0, 5);

  return (
    <PanelShell title={t("phrases.Status distribution")} description={t("phrases.Where your tracker currently stands.")} icon="dashboard">
      {total === 0 ? (
        <EmptyPanel title="No status data yet.">
          Add applications to see how records are distributed across statuses.
        </EmptyPanel>
      ) : (
        <div>
          <div className="flex h-3.5 overflow-hidden rounded-full bg-slate-100 dark:bg-[#20242A]" aria-label={`Status distribution across ${total} applications`}>
            {rows.map(({ status, count, color }) => (
              <div
                key={status}
                className={`${color} h-full`}
                style={{ width: `${(count / total) * 100}%` }}
                title={`${status}: ${count}`}
              />
            ))}
          </div>

          <div className="mt-4 space-y-2.5">
            {topRows.map(({ status, count, color }) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={status} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#20242A]">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${color}`} />
                    <span className="truncate text-sm font-bold text-slate-800 dark:text-[#F8FAFC]">{label("status", status)}</span>
                  </div>
                  <span className="shrink-0 text-xs font-black text-slate-500 dark:text-[#9AA4B2]">{count} · {pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PanelShell>
  );
}
