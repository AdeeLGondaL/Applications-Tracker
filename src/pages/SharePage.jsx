import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { statusTone } from "@/utils/statusTone";
import { formatDate, deadlineInfo } from "@/utils/date";

function DeadlineBadge({ deadline }) {
  if (!deadline) return <span className="text-xs text-slate-400">No deadline</span>;
  const info = deadlineInfo(deadline);
  const toneClass = {
    danger:  "text-rose-600 bg-rose-50 border border-rose-200",
    warning: "text-orange-600 bg-orange-50 border border-orange-200",
    notice:  "text-amber-600 bg-amber-50 border border-amber-200",
    success: "text-emerald-600 bg-emerald-50 border border-emerald-200",
    neutral: "text-slate-500 bg-slate-50 border border-slate-200",
  }[info.tone] || "text-slate-500 bg-slate-50 border border-slate-200";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${toneClass}`}>
      <Icon name="calendar" className="h-3 w-3" />
      {formatDate(deadline)} - {info.label}
    </span>
  );
}

function PriorityDot({ priority }) {
  const colorClass = priority === "High" ? "bg-rose-500" : priority === "Medium" ? "bg-amber-400" : "bg-slate-300";
  return <span className={`inline-block h-2 w-2 rounded-full ${colorClass}`} title={`${priority} priority`} />;
}

function AppCard({ app }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3.5 shadow-sm">
      <div className="mt-0.5 flex-shrink-0">
        <PriorityDot priority={app.priority} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-slate-900">{app.name}</p>
            {app.programRole && (
              <p className="mt-0.5 truncate text-xs text-slate-500">{app.programRole}</p>
            )}
          </div>
          <Badge tone={statusTone(app.status)}>{app.status}</Badge>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <DeadlineBadge deadline={app.deadline} />
          {app.city && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-8-7.3-8-12a8 8 0 1 1 16 0c0 4.7-8 12-8 12Z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              {app.city}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function GroupSection({ title, icon, apps, accent }) {
  if (!apps.length) return null;
  const accentClass = {
    blue:   "text-blue-600 bg-blue-50",
    violet: "text-violet-600 bg-violet-50",
  }[accent] || "text-slate-600 bg-slate-50";

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <span className={`grid h-7 w-7 place-items-center rounded-xl ${accentClass}`}>
          <Icon name={icon} className="h-4 w-4" />
        </span>
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">{title}</h2>
        <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">{apps.length}</span>
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
    <div className="min-h-screen bg-slate-50 text-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-emerald-500 text-white shadow-sm">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3 2 8l10 5 10-5-10-5Zm-6 9v5c3 2 9 2 12 0v-5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">Applume</p>
              <p className="text-[10px] text-slate-400">Shared Application Tracker</p>
            </div>
          </div>
          {status === "ok" && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
              {apps.length} application{apps.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {status === "loading" && (
          <div className="flex items-center justify-center py-24">
            <svg className="h-6 w-6 animate-spin text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" />
            </svg>
            <span className="ml-3 text-sm text-slate-400">Loading applications...</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-rose-50">
              <Icon name="close" className="h-7 w-7 text-rose-500" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Link unavailable</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              {error || "This share link is invalid or the user has no applications."}
            </p>
          </div>
        )}

        {status === "ok" && apps.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-slate-100">
              <Icon name="dashboard" className="h-7 w-7 text-slate-400" />
            </div>
            <h2 className="text-lg font-black text-slate-900">No applications yet</h2>
            <p className="mt-2 text-sm text-slate-500">This tracker is empty.</p>
          </div>
        )}

        {status === "ok" && apps.length > 0 && (
          <>
            {/* Summary strip */}
            <div className="mb-8 flex flex-wrap gap-3">
              {universities.length > 0 && (
                <div className="flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-3.5 py-2">
                  <Icon name="university" className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-bold text-blue-700">{universities.length} Universit{universities.length !== 1 ? "ies" : "y"}</span>
                </div>
              )}
              {jobs.length > 0 && (
                <div className="flex items-center gap-2 rounded-2xl border border-violet-100 bg-violet-50 px-3.5 py-2">
                  <Icon name="job" className="h-4 w-4 text-violet-600" />
                  <span className="text-sm font-bold text-violet-700">{jobs.length} Job{jobs.length !== 1 ? "s" : ""}</span>
                </div>
              )}
            </div>

            <GroupSection title="Universities" icon="university" apps={universities} accent="blue" />
            <GroupSection title="Jobs" icon="job" apps={jobs} accent="violet" />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center">
        <p className="text-sm font-semibold text-slate-600">Track your own applications for free</p>
        <p className="mt-1 text-xs text-slate-400">Structured tracker - Export anytime - Private by default</p>
        <a
          href={appUrl}
          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-600"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3 2 8l10 5 10-5-10-5Zm-6 9v5c3 2 9 2 12 0v-5" />
          </svg>
          Start tracking with Applume
        </a>
      </footer>
    </div>
  );
}
