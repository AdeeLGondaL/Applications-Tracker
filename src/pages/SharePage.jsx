import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/brand/Logo";
import { Badge } from "@/components/ui/Badge";
import { statusTone } from "@/utils/statusTone";
import { useLanguage } from "@/i18n";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

function DeadlineBadge({ deadline }) {
  const { deadlineInfo, formatDate, t } = useLanguage();
  if (!deadline) return <span className="text-xs text-[var(--text-soft)]">{t("deadline.none")}</span>;
  const info = deadlineInfo(deadline);
  const toneClass = {
    danger:  "text-rose-600 bg-rose-50 border border-rose-200",
    warning: "text-orange-600 bg-orange-50 border border-orange-200",
    notice:  "text-amber-600 bg-amber-50 border border-amber-200",
    success: "text-emerald-600 bg-emerald-50 border border-emerald-200",
    neutral: "text-[var(--text-muted)] bg-[var(--surface-soft)] border border-[var(--border)]",
  }[info.tone] || "text-[var(--text-muted)] bg-[var(--surface-soft)] border border-[var(--border)]";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${toneClass}`}>
      <Icon name="calendar" className="h-3 w-3" />
      {formatDate(deadline)} - {info.label}
    </span>
  );
}

function PriorityDot({ priority }) {
  const { label, t } = useLanguage();
  const colorClass = priority === "High" ? "bg-rose-500" : priority === "Medium" ? "bg-amber-400" : "bg-slate-300";
  return <span className={`inline-block h-2 w-2 rounded-full ${colorClass}`} title={`${label("priority", priority)} ${t("phrases.Priority").toLowerCase()}`} />;
}

function AppCard({ app }) {
  const { label } = useLanguage();
  return (
    <div className="flex items-start gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--surface-card)] px-4 py-3.5 shadow-sm">
      <div className="mt-1.5 flex-shrink-0">
        <PriorityDot priority={app.priority} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[var(--text-strong)]">{app.name}</p>
            {app.programRole && (
              <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">{app.programRole}</p>
            )}
          </div>
          <Badge tone={statusTone(app.status)}>{label("status", app.status)}</Badge>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <DeadlineBadge deadline={app.deadline} />
          {app.city && (
            <span className="inline-flex items-center gap-1 text-xs text-[var(--text-soft)]">
              <Icon name="pin" className="h-3 w-3" />
              {app.city}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function GroupSection({ title, icon, apps, accent }) {
  const { t } = useLanguage();
  if (!apps.length) return null;
  const accentClass = {
    blue:   "text-blue-600 bg-blue-50",
    violet: "text-violet-600 bg-violet-50",
  }[accent] || "text-[var(--text-muted)] bg-[var(--surface-soft)]";

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <span className={`grid h-7 w-7 place-items-center rounded-xl ${accentClass}`}>
          <Icon name={icon} className="h-4 w-4" />
        </span>
        <h2 className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)]">{t(`phrases.${title}`)}</h2>
        <span className="ml-1 rounded-full bg-[var(--surface-soft)] px-2 py-0.5 text-xs font-bold text-[var(--text-muted)]">{apps.length}</span>
      </div>
      <div className="space-y-2">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}

export default function SharePage({ token }) {
  const { label, t } = useLanguage();
  const [apps, setApps] = useState([]);
  const [status, setStatus] = useState(token ? "loading" : "error"); // "loading" | "ok" | "error"
  const [error, setError] = useState(token ? "" : "No token provided.");

  useEffect(() => {
    if (!token) return undefined;
    fetch(`/api/share/${token}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Invalid share link or no applications found.");
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Unexpected response from server.");
        setApps(data);
        setStatus("ok");
      })
      .catch((err) => {
        setError(err.message || "This share link is invalid or the user has no applications.");
        setStatus("error");
      });
  }, [token]);

  const universities = apps.filter((a) => a.type === "University");
  const jobs = apps.filter((a) => a.type === "Job");
  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://applume.app";

  return (
    <div className="min-h-screen bg-[var(--surface-page)] text-[var(--ink)]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-card)_88%,transparent)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <Logo imgClass="h-9 w-9" showWordmark={false} />
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--text-strong)]">Applume</p>
              <p className="truncate text-[10px] text-[var(--text-muted)]">{t("phrases.Shared Application Tracker")}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {status === "ok" && (
              <span className="rounded-full bg-[var(--surface-soft)] px-2.5 py-1 text-xs font-bold text-[var(--text-muted)]">
                {apps.length} application{apps.length !== 1 ? "s" : ""}
              </span>
            )}
            <LanguageSwitcher compact />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {status === "loading" && (
          <div className="flex items-center justify-center py-24">
            <svg className="h-6 w-6 animate-spin text-[var(--applume-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" />
            </svg>
            <span className="ml-3 text-sm text-[var(--text-muted)]">{t("phrases.Loading applications...")}</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 grid h-16 w-16 place-items-center rounded-[18px] bg-[var(--danger-soft)]">
              <Icon name="close" className="h-7 w-7 text-[var(--danger)]" />
            </div>
            <h2 className="font-display text-xl font-semibold text-[var(--text-strong)]">{t("phrases.Link unavailable")}</h2>
            <p className="mt-2 max-w-sm text-sm text-[var(--text-muted)]">
              {error || "This share link is invalid or the user has no applications."}
            </p>
          </div>
        )}

        {status === "ok" && apps.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 grid h-16 w-16 place-items-center rounded-[18px] bg-[var(--surface-soft)]">
              <Icon name="dashboard" className="h-7 w-7 text-[var(--text-soft)]" />
            </div>
            <h2 className="font-display text-xl font-semibold text-[var(--text-strong)]">{t("phrases.No applications yet")}</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">{t("phrases.This tracker is empty.")}</p>
          </div>
        )}

        {status === "ok" && apps.length > 0 && (
          <>
            {/* Summary strip */}
            <div className="mb-8 flex flex-wrap gap-3">
              {universities.length > 0 && (
                <div className="flex items-center gap-2 rounded-[12px] border border-blue-100 bg-blue-50 px-3.5 py-2">
                  <Icon name="university" className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-bold text-blue-700">{universities.length} {label("type", "University")}</span>
                </div>
              )}
              {jobs.length > 0 && (
                <div className="flex items-center gap-2 rounded-[12px] border border-violet-100 bg-violet-50 px-3.5 py-2">
                  <Icon name="job" className="h-4 w-4 text-violet-600" />
                  <span className="text-sm font-bold text-violet-700">{jobs.length} {label("type", "Job")}</span>
                </div>
              )}
            </div>

            <GroupSection title="Universities" icon="university" apps={universities} accent="blue" />
            <GroupSection title="Jobs" icon="job" apps={jobs} accent="violet" />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface-card)] py-8 text-center">
        <p className="text-sm font-semibold text-[var(--text-strong)]">{t("phrases.Track your own applications for free")}</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">{t("phrases.Structured tracker - Export anytime - Private by default")}</p>
        <a
          href={appUrl}
          className="mt-4 inline-flex items-center gap-2 rounded-[10px] bg-[var(--applume-accent)] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--applume-accent-hover)]"
        >
          {t("phrases.Start tracking with Applume")}
          <Icon name="share" className="h-4 w-4" />
        </a>
      </footer>
    </div>
  );
}
