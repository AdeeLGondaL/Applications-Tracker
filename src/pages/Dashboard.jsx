import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Brand } from "@/components/layout/Brand";
import { NavItem } from "@/components/layout/NavItem";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";
import { OnboardingWizard } from "@/components/dashboard/OnboardingWizard";
import { FocusThisWeek } from "@/components/dashboard/FocusThisWeek";
import { PipelineCard } from "@/components/dashboard/PipelineCard";
import { UpcomingDeadlinesCard } from "@/components/dashboard/UpcomingDeadlinesCard";
import {
  NextStepCoveragePanel,
  QuickActionsPanel,
  RecentActivityPanel,
  StatusDistributionPanel,
} from "@/components/dashboard/OptionalPanels";
import { Toolbar } from "@/components/applications/Toolbar";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { ApplicationGrid } from "@/components/applications/ApplicationCard";
import { KanbanBoard } from "@/components/applications/KanbanBoard";
import { ApplicationDrawer } from "@/components/applications/ApplicationDrawer";
import { ImportCsvModal } from "@/components/applications/ImportCsvModal";
import { BulkActionBar } from "@/components/applications/BulkActionBar";
import { EmptyDashboard } from "@/components/applications/EmptyState";
import AdminPanel from "@/pages/AdminPanel";
import { useTheme } from "@/hooks/useTheme";
import { STATUSES, ACTIONABLE_STATUSES, ADMIN_EMAIL, EMPTY_FORM } from "@/utils/constants";
import { makeId, todayIso, daysUntil, deadlineInfo, priorityRank, normalize } from "@/utils/date";
import { toCsv } from "@/utils/csv";
import { trackEvent, trackOnce } from "@/utils/analytics";
import { useLanguage } from "@/i18n";

function FeedbackModal({ session, onClose }) {
  const [type, setType] = useState("bug");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [steps, setSteps] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!title.trim() || !desc.trim()) return;
    setLoading(true);
    setError("");
    const { error: sbError } = await supabase.from("feedback").insert({
      user_id: session.user.id,
      email: session.user.email,
      type,
      title: title.trim(),
      description: desc.trim(),
      steps: steps.trim() || null,
    });
    setLoading(false);
    if (sbError) setError("Couldn't send feedback. Please try again.");
    else setSent(true);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 backdrop-blur-sm sm:items-center px-4 pb-4 sm:pb-0"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl shadow-slate-900/20 dark:bg-[#1c1c1f] dark:ring-1 dark:ring-white/5"
        initial={{ opacity: 0, scale: 0.95, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 24 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="sent" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="py-6 text-center">
              <motion.div
                className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-[var(--applume-accent-soft)] dark:bg-[rgba(0,153,102,0.18)]"
                initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 }}
              >
                <Icon name="check" className="h-7 w-7 text-[var(--applume-accent)]" />
              </motion.div>
              <h3 className="text-xl font-black text-slate-950 dark:text-white">Feedback received</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-[#a1a1aa]">
                {type === "bug" ? "Thanks for reporting. We'll investigate and fix it." : "Great idea. We'll consider it for a future update."}
              </p>
              <button type="button" onClick={onClose} className="mt-6 rounded-2xl bg-slate-950 px-8 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-[#f0f0f0] dark:text-slate-900 dark:hover:bg-white">
                Done
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>

              {/* Header */}
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-950 dark:text-white">Share feedback</h2>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-[#a1a1aa]">Help make Applume better for everyone.</p>
                </div>
                <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-[#3a3a3e] dark:text-[#a1a1aa] dark:hover:bg-[#2e2e32]">
                  <Icon name="close" />
                </button>
              </div>

              {/* Type pill switcher */}
              <div className="relative mb-5 flex rounded-2xl bg-slate-100 p-1 dark:bg-[#2a2a2e]">
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-xl bg-white shadow-sm transition-transform duration-200 ease-out dark:bg-[#1c1c1f] ${type === "feature" ? "translate-x-full rtl:-translate-x-full" : "translate-x-0"}`}
                />
                {[{ id: "bug", label: "Bug report" }, { id: "feature", label: "Feature request" }].map(({ id, label }) => (
                  <button key={id} type="button" onClick={() => setType(id)} className="relative z-10 flex-1 rounded-xl py-2 text-sm font-bold">
                    <span className={`transition-colors ${type === id ? "text-slate-950 dark:text-white" : "text-slate-400 dark:text-[#71717a]"}`}>{label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <Field label={type === "bug" ? "What's the issue?" : "What would you like to see?"} required>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !loading) submit(); }}
                    placeholder={type === "bug" ? "e.g., Export button doesn't work on mobile" : "e.g., Email reminders before deadlines"}
                  />
                </Field>

                <Field label={type === "bug" ? "What happened?" : "Why would this help you?"} required>
                  <Textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder={type === "bug"
                      ? "Describe what went wrong and what you expected instead..."
                      : "Explain the problem this would solve, or how you'd use it..."}
                  />
                </Field>

                <AnimatePresence>
                  {type === "bug" && (
                    <motion.div initial={{ opacity: 0, height: 0, overflow: "hidden" }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                      <Field label="Steps to reproduce (optional)">
                        <Textarea
                          value={steps}
                          onChange={(e) => setSteps(e.target.value)}
                          placeholder={"1. Go to the export menu\n2. Click Download CSV\n3. Nothing happens"}
                        />
                      </Field>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {error && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-xs font-semibold text-rose-600">
                      <Icon name="close" className="h-3 w-3 shrink-0" />{error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <Button
                  onClick={submit}
                  disabled={loading || !title.trim() || !desc.trim()}
                  className="h-11 w-full rounded-2xl text-sm font-bold transition disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" />
                      </svg>
                      Sending...
                    </span>
                  ) : type === "bug" ? "Submit bug report" : "Submit feature request"}
                </Button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

const VIEW_META = {
  dashboard:    { title: "Overview",           sub: "Tracker overview" },
  universities: { title: "University records", sub: "Admissions"       },
  jobs:         { title: "Job records",        sub: "Applications"     },
  urgent:       { title: "Upcoming deadlines", sub: "Action needed"    },
  admin:        { title: "Feedback inbox", sub: "Admin"         },
};

function DashboardLayout({ children }) {
  return (
    <div className="grid grid-cols-1 gap-4 min-[900px]:grid-cols-12 min-[900px]:items-start min-[900px]:gap-6">
      {children}
    </div>
  );
}

function DashboardSpan({ span = 6, children }) {
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

function ApplicationReadinessPanel({ total, documented, incompleteItems, onOpenRecord }) {
  const pct = total > 0 ? Math.round((documented / total) * 100) : 0;
  const summary = `${pct}% ready · ${documented} of ${total} records include document notes · ${incompleteItems.length} need setup`;

  return (
    <div className="h-full rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)] dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1A1D22] dark:ring-1 dark:ring-white/5 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black leading-tight text-slate-950 dark:text-white">Application readiness</h2>
          <p className="mt-1 text-[13px] leading-5 text-slate-500 dark:text-[#9AA4B2]">
            Documents, deadlines, links, and next steps that still need setup.
          </p>
        </div>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-[#20242A] dark:text-[#9AA4B2] dark:ring-[rgba(255,255,255,0.09)]">
          <Icon name="dashboard" className="h-4 w-4" />
        </div>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-[#20242A]" aria-label={`${pct}% application readiness`}>
        <div className="h-full rounded-full bg-[var(--applume-accent)]" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-3 text-sm font-black leading-6 text-slate-800 dark:text-[#F8FAFC]">{summary}</p>

      {incompleteItems.length > 0 ? (
        <div className="mt-4 space-y-2">
          {incompleteItems.slice(0, 5).map(({ app, missing }) => (
            <button
              key={app.id}
              type="button"
              onClick={() => onOpenRecord?.(app)}
              aria-label={`Fix missing ${missing.join(", ")} for ${app.name}`}
              className="flex w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-left transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--applume-accent)] focus:ring-offset-2 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#20242A] dark:hover:bg-[#252A31] dark:focus:ring-offset-[#1A1D22]"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-slate-800 dark:text-white">{app.name}</span>
                <span className="block truncate text-[13px] leading-5 text-slate-500 dark:text-[#9AA4B2]">Missing {missing.join(", ")}</span>
              </span>
              <span className="shrink-0 text-xs font-black text-[var(--applume-accent-hover)]">Fix</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl bg-[var(--applume-accent-soft)] px-3 py-4 dark:bg-[rgba(0,153,102,0.16)]">
          <p className="text-sm font-black text-[var(--applume-accent-hover)] dark:text-[var(--applume-accent-muted)]">Everything important is set up.</p>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-[#9AA4B2]">
            Applications with missing documents, deadlines, links, or next steps will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

export default function Dashboard({ session }) {
  const { label, t } = useLanguage();
  const { dark, toggle: toggleTheme } = useTheme();
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("deadline");
  const [viewMode, setViewMode] = useState(() => (
    typeof window !== "undefined" && window.innerWidth < 768 ? "cards" : "table"
  ));
  const [sidebarView, setSidebarView] = useState("dashboard");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastKind, setToastKind] = useState("success");
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [csvImportOpen, setCsvImportOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [onboardingWizardDone, setOnboardingWizardDone] = useState(() => {
    try {
      return localStorage.getItem(`applume_onboarding_wizard_${session?.user?.id || "anonymous"}`) === "true";
    } catch {
      return false;
    }
  });
  const [selectedIds, setSelectedIds] = useState(new Set());
  const exportMenuRef = useRef(null);
  const importInputRef = useRef(null);
  const profileMenuRef = useRef(null);
  const profileMenuCloseTimer = useRef(null);

  useEffect(() => {
    if (!session?.user) return;
    fetchApplications();
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function handleClick(e) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) setExportMenuOpen(false);
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) setProfileMenuOpen(false);
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") setProfileMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
      if (profileMenuCloseTimer.current) window.clearTimeout(profileMenuCloseTimer.current);
    };
  }, []);

  useEffect(() => {
    try {
      const suffix = session?.user?.id || "anonymous";
      localStorage.removeItem("applume.dashboard.preferences.v1");
      localStorage.removeItem(`applume.dashboard.preferences.v1:${suffix}`);
      localStorage.removeItem("applume.dashboard.focusMode.v1");
      localStorage.removeItem(`applume.dashboard.focusMode.v1:${suffix}`);
    } catch {
      // Dashboard cleanup should never block the normal app.
    }
  }, [session?.user?.id]);

  async function fetchApplications() {
    if (!session?.user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", session.user.id)
      .order("lastUpdated", { ascending: false });
    if (error) {
      notify(error.message, "error");
    } else {
      setApplications(data.map(normalize));
    }
    setLoading(false);
  }

  function notify(msg, kind = "success") {
    setToast(msg);
    setToastKind(kind);
  }

  function completeOnboardingWizard() {
    try {
      localStorage.setItem(`applume_onboarding_wizard_${session?.user?.id || "anonymous"}`, "true");
    } catch {
      // The wizard can still continue when storage is unavailable.
    }
    setOnboardingWizardDone(true);
  }

  function openImportPicker() {
    trackEvent("import_method_selected", { method: "backup" });
    importInputRef.current?.click();
  }

  function skipOnboardingWizard() {
    trackEvent("onboarding_checklist_completed", { skipped: true, source: "wizard" });
    completeOnboardingWizard();
  }

  function openNewTracked(type = "University", source = "manual") {
    trackEvent("dashboard_focus_card_clicked", {
      action: "add_application",
      type,
      source,
    });
    openNew(type);
  }

  function openUrgentQueue(source = "focus") {
    trackEvent("dashboard_focus_card_clicked", { card: "urgent", source });
    handleSidebarView("urgent");
    setSortBy("deadline");
  }

  function openInterviewQueue(firstItem) {
    trackEvent("dashboard_focus_card_clicked", { card: "interviews" });
    if (firstItem) {
      openEdit(firstItem);
      return;
    }
    handleSidebarView("jobs");
    setStatusFilter("Interview");
  }

  function openDocumentQueue(firstItem) {
    trackEvent("dashboard_focus_card_clicked", { card: "missing_documents" });
    if (firstItem) openEdit(firstItem);
  }

  function openNextStepQueue(firstItem) {
    trackEvent("dashboard_next_step_coverage_clicked", { source: "dashboard" });
    if (firstItem) {
      openEdit(firstItem);
      return;
    }
    openNewTracked("University", "next_step_coverage");
  }

  function clearProfileMenuCloseTimer() {
    if (profileMenuCloseTimer.current) {
      window.clearTimeout(profileMenuCloseTimer.current);
      profileMenuCloseTimer.current = null;
    }
  }

  function canHoverProfileMenu() {
    return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }

  function openProfileMenu() {
    clearProfileMenuCloseTimer();
    setProfileMenuOpen(true);
  }

  function closeProfileMenu() {
    clearProfileMenuCloseTimer();
    setProfileMenuOpen(false);
  }

  function scheduleProfileMenuClose() {
    clearProfileMenuCloseTimer();
    profileMenuCloseTimer.current = window.setTimeout(() => setProfileMenuOpen(false), 140);
  }

  function copyCalendarUrl() {
    if (!session?.user) return;
    const url = `https://${window.location.host}/calendar/${session.user.id}.ics`;
    navigator.clipboard.writeText(url);
    trackEvent("calendar_sync_connected", { method: "copied_url" });
    notify("Calendar URL copied. Paste it in Google Calendar > Other calendars > From URL.", "success");
  }

  function copyShareUrl() {
    if (!session?.user) return;
    const url = `https://${window.location.host}/share/${session.user.id}`;
    navigator.clipboard.writeText(url);
    notify("Share link copied! Anyone with this link can view your tracker.", "success");
  }

  async function signOut() {
    await supabase.auth.signOut();
    setApplications([]);
    notify("Signed out.", "info");
  }

  async function handleDeleteAccount() {
    if (!window.confirm("Permanently delete your account and all data? This cannot be undone.")) return;
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const res = await fetch("/api/delete-account", {
        method: "POST",
        headers: { Authorization: `Bearer ${currentSession.access_token}` },
      });
      if (!res.ok) throw new Error("Failed");
      await supabase.auth.signOut();
      notify("Your account has been deleted.", "success");
    } catch {
      notify("Failed to delete account. Please try again.", "error");
    }
  }

  function handleSidebarView(view) {
    setSidebarView(view);
    setQuery("");
    setSelectedIds(new Set());
  }

  const stats = useMemo(() => {
    const total = applications.length;
    const universities = applications.filter((app) => app.type === "University").length;
    const jobs = applications.filter((app) => app.type === "Job").length;
    const submitted = applications.filter((app) => ["Submitted", "Awaiting Response", "Interview", "Accepted"].includes(app.status)).length;
    const accepted = applications.filter((app) => app.status === "Accepted").length;
    const interviews = applications.filter((app) => app.status === "Interview").length;
    const dueSoon7 = applications.filter((app) => {
      if (!ACTIONABLE_STATUSES.includes(app.status)) return false;
      const d = daysUntil(app.deadline);
      return d !== null && d >= 0 && d <= 7;
    }).length;
    const overdue = applications.filter((app) => {
      if (!ACTIONABLE_STATUSES.includes(app.status)) return false;
      const d = daysUntil(app.deadline);
      return d !== null && d < 0;
    }).length;
    const actionNeeded = dueSoon7 + overdue;
    return { total, universities, jobs, submitted, accepted, interviews, dueSoon7, urgent: dueSoon7, overdue, actionNeeded, progress: total ? Math.round((submitted / total) * 100) : 0 };
  }, [applications]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const urgentOnly = sidebarView === "urgent";
    const effectiveTypeFilter = sidebarView === "universities" ? "University" : sidebarView === "jobs" ? "Job" : typeFilter;
    return [...applications]
      .filter((app) => effectiveTypeFilter === "All" || app.type === effectiveTypeFilter)
      .filter((app) => statusFilter === "All" || app.status === statusFilter)
      .filter((app) => priorityFilter === "All" || app.priority === priorityFilter)
      .filter((app) => !q || [app.name, app.programRole, app.city, app.status, app.priority, app.applicationType, app.documents, app.notes].join(" ").toLowerCase().includes(q))
      .filter((app) => {
        if (!urgentOnly) return true;
        if (!ACTIONABLE_STATUSES.includes(app.status)) return false;
        const days = daysUntil(app.deadline);
        return days !== null && days <= 14;
      })
      .sort((a, b) => {
        if (sortBy === "deadline") return deadlineInfo(a.deadline).sort - deadlineInfo(b.deadline).sort;
        if (sortBy === "priority") return priorityRank(a.priority) - priorityRank(b.priority);
        if (sortBy === "updated") return String(b.lastUpdated).localeCompare(String(a.lastUpdated));
        if (sortBy === "status") return a.status.localeCompare(b.status);
        return a.name.localeCompare(b.name);
      });
  }, [applications, query, typeFilter, statusFilter, priorityFilter, sortBy, sidebarView]);

  const topDeadlines = useMemo(() => {
    return [...applications]
      .filter((app) => ACTIONABLE_STATUSES.includes(app.status) && daysUntil(app.deadline) !== null)
      .sort((a, b) => deadlineInfo(a.deadline).sort - deadlineInfo(b.deadline).sort)
      .slice(0, 5);
  }, [applications]);

  const pipeline = useMemo(() => {
    return STATUSES.map((status) => ({ status, count: applications.filter((app) => app.status === status).length }));
  }, [applications]);

  const documentReadiness = useMemo(() => {
    const documented = applications.filter((app) => String(app.documents || "").trim()).length;
    const incompleteItems = applications
      .map((app) => {
        const missing = [
          !app.deadline && "deadline",
          !String(app.documents || "").trim() && "documents",
          !String(app.link || "").trim() && "link",
          !String(app.notes || "").trim() && "next step",
        ].filter(Boolean);
        return { app, missing };
      })
      .filter((entry) => entry.missing.length > 0);
    return { documented, incompleteItems };
  }, [applications]);

  const nextStepCoverage = useMemo(() => {
    const itemsMissingNextStep = applications.filter((app) => !String(app.notes || "").trim());
    return {
      withNextStep: applications.length - itemsMissingNextStep.length,
      itemsMissingNextStep,
    };
  }, [applications]);

  const focusThisWeek = useMemo(() => {
    const overdueItems = applications.filter((app) => {
      if (!ACTIONABLE_STATUSES.includes(app.status)) return false;
      const d = daysUntil(app.deadline);
      return d !== null && d < 0;
    });
    const dueSoonItems = applications.filter((app) => {
      if (!ACTIONABLE_STATUSES.includes(app.status)) return false;
      const d = daysUntil(app.deadline);
      return d !== null && d >= 0 && d <= 7;
    });
    const interviewItems = applications.filter((app) => app.status === "Interview");
    const missingDocumentItems = applications.filter((app) => !String(app.documents || "").trim());
    return { overdueItems, dueSoonItems, interviewItems, missingDocumentItems };
  }, [applications]);

  const headerSummary = sidebarView === "dashboard"
    ? `${stats.total} tracked · ${stats.actionNeeded} needs action · ${stats.progress}% submitted or beyond`
    : VIEW_META[sidebarView]?.sub;

  function openNew(type = "University") {
    setForm({ ...EMPTY_FORM, type });
    setEditingId(null);
    setDrawerOpen(true);
  }

  function openEdit(app) {
    const { id, ...editable } = app;
    setForm({ ...EMPTY_FORM, ...editable });
    setEditingId(id);
    setDrawerOpen(true);
  }

  async function saveApplication() {
    if (!form.name.trim() || !form.programRole.trim()) {
      notify("Add name and course/job title first.", "error");
      return;
    }
    if (!session?.user) {
      notify("Please sign in to save applications.", "error");
      return;
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      programRole: form.programRole.trim(),
      lastUpdated: todayIso(),
      user_id: session.user.id,
    };

    const isFirstSavedRecord = !editingId && applications.length === 0;

    if (editingId) {
      const { error } = await supabase
        .from("applications")
        .update(payload)
        .eq("id", editingId)
        .eq("user_id", session.user.id);
      if (error) { notify(error.message, "error"); return; }
      setApplications((old) => old.map((app) => (app.id === editingId ? normalize({ ...app, ...payload }) : app)));
      notify("Application updated.");
    } else {
      const newApp = { id: makeId(), ...payload };
      const { error } = await supabase.from("applications").insert([newApp]);
      if (error) { notify(error.message, "error"); return; }
      setApplications((old) => [normalize(newApp), ...old]);
      if (isFirstSavedRecord) {
        trackOnce("first_record_created", { type: payload.type });
      }
      if (payload.deadline) {
        trackOnce("first_deadline_added", { type: payload.type });
      }
      if (payload.notes) {
        trackOnce("first_next_step_added", { type: payload.type });
      }
      if (payload.documents) {
        trackOnce("first_checklist_created", { type: payload.type });
      }
      notify("Application added.");
    }

    setDrawerOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function deleteApplication(id) {
    const app = applications.find((entry) => entry.id === id);
    const ok = typeof window === "undefined" ? true : window.confirm(`Delete ${app?.name || "this entry"}?`);
    if (!ok) return;
    if (!session?.user) { notify("Please sign in to delete applications.", "error"); return; }

    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);
    if (error) { notify(error.message, "error"); return; }
    setApplications((old) => old.filter((entry) => entry.id !== id));
    notify("Application deleted.");
  }

  async function updateStatus(id, newStatus) {
    const today = todayIso();
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: newStatus, lastUpdated: today } : a));
    const { error } = await supabase.from("applications").update({ status: newStatus, lastUpdated: today }).eq("id", id).eq("user_id", session.user.id);
    if (error) notify(error.message, "error");
    else trackOnce("first_status_updated", { status: newStatus });
  }

  function toggleSelect(id) {
    setSelectedIds((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }

  function selectAll(ids) {
    setSelectedIds((prev) => ids.length > 0 && ids.every((id) => prev.has(id)) ? new Set() : new Set(ids));
  }

  async function handleBulkStatusChange(newStatus) {
    const ids = [...selectedIds];
    const today = todayIso();
    setApplications((prev) => prev.map((a) => selectedIds.has(a.id) ? { ...a, status: newStatus, lastUpdated: today } : a));
    setSelectedIds(new Set());
    const { error } = await supabase.from("applications").update({ status: newStatus, lastUpdated: today }).in("id", ids).eq("user_id", session.user.id);
    if (error) notify(error.message, "error");
    else notify(`${ids.length} application${ids.length > 1 ? "s" : ""} updated.`);
  }

  async function handleBulkPriorityChange(newPriority) {
    const ids = [...selectedIds];
    const today = todayIso();
    setApplications((prev) => prev.map((a) => selectedIds.has(a.id) ? { ...a, priority: newPriority, lastUpdated: today } : a));
    setSelectedIds(new Set());
    const { error } = await supabase.from("applications").update({ priority: newPriority, lastUpdated: today }).in("id", ids).eq("user_id", session.user.id);
    if (error) notify(error.message, "error");
    else notify(`${ids.length} application${ids.length > 1 ? "s" : ""} updated.`);
  }

  async function handleBulkDelete() {
    const ids = [...selectedIds];
    setApplications((prev) => prev.filter((a) => !selectedIds.has(a.id)));
    if (editingId && selectedIds.has(editingId)) { setDrawerOpen(false); setEditingId(null); setForm(EMPTY_FORM); }
    setSelectedIds(new Set());
    const { error } = await supabase.from("applications").delete().in("id", ids).eq("user_id", session.user.id);
    if (error) notify(error.message, "error");
    else notify(`${ids.length} application${ids.length > 1 ? "s" : ""} deleted.`);
  }

  async function duplicateApplication(app) {
    if (!session?.user) { notify("Please sign in to duplicate applications.", "error"); return; }
    const newApp = {
      ...app,
      id: makeId(),
      name: `${app.name} copy`,
      status: "Not Open Yet",
      lastUpdated: todayIso(),
      user_id: session.user.id,
    };
    const { error } = await supabase.from("applications").insert([newApp]);
    if (error) { notify(error.message, "error"); return; }
    setApplications((old) => [normalize(newApp), ...old]);
    notify("Application duplicated.");
  }

  function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importCsvRows(apps) {
    if (!session?.user) { notify("Please sign in to import data.", "error"); return false; }
    const today = todayIso();
    const rows = apps.map((app) => normalize({
      ...app,
      id: makeId(),
      user_id: session.user.id,
      lastUpdated: today,
    }));
    const { error } = await supabase.from("applications").insert(rows);
    if (error) { notify(error.message, "error"); return false; }
    setApplications((old) => [...rows, ...old]);
    trackEvent("import_method_selected", { method: "csv", count: rows.length });
    if (rows.length > 0) trackOnce("first_record_created", { type: rows[0].type, source: "csv" });
    completeOnboardingWizard();
    notify(`${rows.length} application${rows.length === 1 ? "" : "s"} imported.`);
    return true;
  }

  function importJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!session?.user) { notify("Please sign in to import data.", "error"); event.target.value = ""; return; }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!Array.isArray(parsed)) throw new Error("Backup should be an array");
        const rows = parsed.map((item) => normalize({ ...item, id: item.id || makeId(), user_id: session.user.id }));
        const { error } = await supabase.from("applications").upsert(rows, { onConflict: "id" });
        if (error) throw error;
        setApplications(rows);
        trackEvent("import_method_selected", { method: "backup_uploaded", count: rows.length });
        if (rows.length > 0) trackOnce("first_record_created", { type: rows[0].type, source: "import" });
        completeOnboardingWizard();
        notify("Backup imported.");
      } catch {
        notify("Could not import this JSON file.", "error");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function renderDashboardPanel(panelId) {
    switch (panelId) {
      case "focusThisWeek":
        return (
          <FocusThisWeek
            showQuickActions={false}
            overdueCount={focusThisWeek.overdueItems.length}
            dueSoonCount={focusThisWeek.dueSoonItems.length}
            interviewCount={focusThisWeek.interviewItems.length}
            missingDocsCount={focusThisWeek.missingDocumentItems.length}
            onReviewUrgent={() => openUrgentQueue("focus_layer")}
            onReviewInterviews={() => openInterviewQueue(focusThisWeek.interviewItems[0])}
            onReviewDocuments={() => openDocumentQueue(focusThisWeek.missingDocumentItems[0])}
            onAddUniversity={() => openNewTracked("University", "focus")}
            onAddJob={() => openNewTracked("Job", "focus")}
            onImport={openImportPicker}
            onCalendarSync={copyCalendarUrl}
          />
        );
      case "pipelineSummary":
        return <PipelineCard pipeline={pipeline} total={stats.total} />;
      case "upcomingDeadlines":
        return <UpcomingDeadlinesCard apps={topDeadlines} onOpenRecord={openEdit} onAddDeadline={() => openNewTracked("University", "deadline_empty")} />;
      case "recentActivity":
        return <RecentActivityPanel applications={applications} onOpenRecord={openEdit} />;
      case "quickActions":
        return <QuickActionsPanel onAddUniversity={() => openNewTracked("University", "quick_actions")} onAddJob={() => openNewTracked("Job", "quick_actions")} onImport={openImportPicker} onCalendarSync={copyCalendarUrl} />;
      case "applicationReadiness":
        return (
          <ApplicationReadinessPanel
            total={stats.total}
            documented={documentReadiness.documented}
            incompleteItems={documentReadiness.incompleteItems}
            onOpenRecord={openEdit}
          />
        );
      case "nextStepCoverage":
        return (
          <NextStepCoveragePanel
            total={stats.total}
            withNextStep={nextStepCoverage.withNextStep}
            onAddNextSteps={() => openNextStepQueue(nextStepCoverage.itemsMissingNextStep[0])}
          />
        );
      case "statusDistribution":
        return <StatusDistributionPanel applications={applications} />;
      default:
        return null;
    }
  }

  function renderFixedDashboard() {
    return (
      <div className="space-y-4 min-[900px]:space-y-6">
        <DashboardLayout>
          <DashboardSpan span={8}>{renderDashboardPanel("focusThisWeek")}</DashboardSpan>
          <DashboardSpan span={4}>{renderDashboardPanel("quickActions")}</DashboardSpan>
          <DashboardSpan span={12}>{renderDashboardPanel("upcomingDeadlines")}</DashboardSpan>
        </DashboardLayout>

        <div className="hidden min-[900px]:grid min-[900px]:grid-cols-12 min-[900px]:items-start min-[900px]:gap-6">
          <div className="min-w-0 space-y-6 min-[900px]:col-span-7">
            {renderDashboardPanel("applicationReadiness")}
            {renderDashboardPanel("recentActivity")}
          </div>
          <div className="min-w-0 space-y-6 min-[900px]:col-span-5">
            {renderDashboardPanel("pipelineSummary")}
            {renderDashboardPanel("nextStepCoverage")}
            {renderDashboardPanel("statusDistribution")}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 min-[900px]:hidden">
          {renderDashboardPanel("applicationReadiness")}
          {renderDashboardPanel("pipelineSummary")}
          {renderDashboardPanel("recentActivity")}
          {renderDashboardPanel("nextStepCoverage")}
          {renderDashboardPanel("statusDistribution")}
        </div>
      </div>
    );
  }

  return (
    <div className={`${dark ? "dark" : ""} min-h-screen overflow-x-hidden bg-slate-50 text-slate-950 dark:bg-[#0F1115] dark:text-[#F8FAFC]`}>
      <div className="flex min-h-screen min-w-0">

        {/* Sidebar */}
        <aside className="max-md:hidden md:flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1A1D22]">
          <div className="border-b border-slate-100 px-4 py-4 dark:border-[rgba(255,255,255,0.09)]">
            <Brand dark={dark} />
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <p className="mb-1.5 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-[#52525b]">Menu</p>
            <nav className="space-y-0.5">
              <NavItem active={sidebarView === "dashboard"}    onClick={() => handleSidebarView("dashboard")}    icon="dashboard"  label="Dashboard"      />
              <NavItem active={sidebarView === "universities"} onClick={() => handleSidebarView("universities")} icon="university" label="Universities"    count={stats.universities} />
              <NavItem active={sidebarView === "jobs"}         onClick={() => handleSidebarView("jobs")}         icon="job"        label="Jobs"            count={stats.jobs} />
              <NavItem active={sidebarView === "urgent"}       onClick={() => handleSidebarView("urgent")}       icon="calendar"   label="Urgent"          count={stats.actionNeeded} alert={stats.actionNeeded > 0} />
              {session?.user?.email === ADMIN_EMAIL && (
                <NavItem active={sidebarView === "admin"} onClick={() => handleSidebarView("admin")} icon="shield" label="Feedback inbox" />
              )}
            </nav>

          </div>
        </aside>

        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-sm md:hidden dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1A1D22]/95">
          <div className="flex items-stretch">
            {[
              { view: "dashboard",    icon: "dashboard",  label: label("view", "Home")  },
              { view: "universities", icon: "university", label: label("view", "Uni")   },
              { view: "jobs",         icon: "job",        label: label("view", "Jobs")  },
              { view: "urgent",       icon: "calendar",   label: label("view", "Urgent")},
            ].map(({ view, icon, label }) => {
              const isActive = sidebarView === view;
              const badge = view === "urgent" ? stats.actionNeeded : 0;
              return (
                <button
                  key={view}
                  type="button"
                  onClick={() => handleSidebarView(view)}
                  className={`flex flex-1 flex-col items-center gap-1 py-2.5 transition-colors ${isActive ? "text-[var(--applume-accent)]" : "text-slate-400 dark:text-[#71717a]"}`}
                >
                  <div className="relative">
                    <Icon name={icon} className="h-5 w-5" />
                    {badge > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-black text-white">
                        {badge > 9 ? "9+" : badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold">{label}</span>
                </button>
              );
            })}
            {session?.user?.email === ADMIN_EMAIL && (
              <button
                type="button"
                onClick={() => handleSidebarView("admin")}
                className={`flex flex-1 flex-col items-center gap-1 py-2.5 transition-colors ${sidebarView === "admin" ? "text-[var(--applume-accent)]" : "text-slate-400 dark:text-[#71717a]"}`}
              >
                <Icon name="shield" className="h-5 w-5" />
                <span className="text-[10px] font-bold">{label("view", "Admin")}</span>
              </button>
            )}
          </div>
        </nav>

        {/* Main */}
        <main className="min-w-0 flex-1 overflow-x-hidden pb-20 md:pb-0">

          {/* Header */}
          <header className="sticky top-0 z-30 max-w-full border-b border-slate-200 bg-white/90 backdrop-blur dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1A1D22]/90">
            <div className="flex min-w-0 items-center justify-between gap-2 px-3 py-3 sm:px-6">
              <motion.div key={sidebarView} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }} className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-500 dark:text-[#a1a1aa]">{headerSummary}</p>
                <h1 className="truncate text-lg font-black leading-tight sm:text-xl">{t(`phrases.${VIEW_META[sidebarView]?.title}`)}</h1>
              </motion.div>

              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <Button
                  onClick={() => openNew(sidebarView === "jobs" ? "Job" : "University")}
                  className="h-9 rounded-xl px-2.5 text-sm sm:px-3.5"
                >
                  <Icon name="plus" className="sm:mr-1.5" />
                  <span className="hidden sm:inline">{t("phrases.Add application")}</span>
                  <span className="hidden min-[380px]:inline sm:hidden">{t("phrases.Add")}</span>
                </Button>

                <div ref={exportMenuRef} className="relative">
                  <button
                    onClick={() => setExportMenuOpen((v) => !v)}
                    className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:text-[#a1a1aa] dark:hover:bg-[#2e2e32] sm:px-3"
                  >
                    <Icon name="download" className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{t("phrases.Export")}</span>
                    <svg className="hidden h-3 w-3 text-slate-400 min-[380px]:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {exportMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full z-50 mt-1.5 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-200/80 dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:shadow-none dark:ring-1 dark:ring-white/5"
                      >
                        <button onClick={() => { downloadFile("applications.csv", toCsv(applications), "text/csv"); setExportMenuOpen(false); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-[#d4d4d8] dark:hover:bg-[#242428]">
                          <Icon name="download" className="h-3.5 w-3.5 text-slate-400" /> {t("phrases.Export CSV")}
                        </button>
                        <button onClick={() => { downloadFile("applications-backup.json", JSON.stringify(applications, null, 2), "application/json"); setExportMenuOpen(false); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-[#d4d4d8] dark:hover:bg-[#242428]">
                          <Icon name="download" className="h-3.5 w-3.5 text-slate-400" /> {t("phrases.Download backup")}
                        </button>
                        <div className="mx-3 my-1 border-t border-slate-100 dark:border-[#2a2a2e]" />
                        <button type="button" onClick={() => { setCsvImportOpen(true); setExportMenuOpen(false); }} className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-[#d4d4d8] dark:hover:bg-[#242428]">
                          <Icon name="upload" className="h-3.5 w-3.5 text-slate-400" /> Import CSV
                        </button>
                        <button type="button" onClick={() => { openImportPicker(); setExportMenuOpen(false); }} className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-[#d4d4d8] dark:hover:bg-[#242428]">
                          <Icon name="upload" className="h-3.5 w-3.5 text-slate-400" /> {t("phrases.Import backup")}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <input ref={importInputRef} type="file" accept="application/json" className="hidden" onChange={importJson} />

                <LanguageSwitcher compact />

                <button
                  type="button"
                  onClick={toggleTheme}
                  title={dark ? "Switch to light mode" : "Switch to dark mode"}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] hover:text-[var(--applume-accent-hover)] dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:text-[#a1a1aa] dark:hover:bg-[#2e2e32]"
                >
                  <Icon name={dark ? "sun" : "moon"} className="h-4 w-4" />
                </button>

                <div
                  ref={profileMenuRef}
                  className="relative"
                  onMouseEnter={() => { if (canHoverProfileMenu()) openProfileMenu(); }}
                  onMouseLeave={() => { if (canHoverProfileMenu()) scheduleProfileMenuClose(); }}
                  onFocus={openProfileMenu}
                  onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) scheduleProfileMenuClose(); }}
                >
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={profileMenuOpen}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      clearProfileMenuCloseTimer();
                      if (canHoverProfileMenu()) setProfileMenuOpen(true);
                      else setProfileMenuOpen((v) => !v);
                    }}
                    className="flex h-9 shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-1 text-left shadow-sm transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:hover:bg-[#2e2e32] sm:pr-2.5"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-950 text-xs font-black text-white dark:bg-[#d4d4d8] dark:text-slate-900">
                      {session?.user?.email?.[0]?.toUpperCase() || "?"}
                    </span>
                    <span className="hidden max-w-[8rem] truncate text-xs font-bold text-slate-700 dark:text-[#d4d4d8] lg:block">
                      {session?.user?.email}
                    </span>
                    <svg className="hidden h-3 w-3 shrink-0 text-slate-400 sm:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {profileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full z-50 mt-1.5 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-200/80 dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:shadow-none dark:ring-1 dark:ring-white/5"
                        role="menu"
                      >
                        <div className="border-b border-slate-100 px-4 py-3 dark:border-[#2a2a2e]">
                          <p className="truncate text-xs font-semibold text-slate-700 dark:text-[#a1a1aa]">{session?.user?.email}</p>
                          <p className="text-[10px] text-slate-400 dark:text-[#71717a]">{t("phrases.Signed in")}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            closeProfileMenu();
                            copyCalendarUrl();
                          }}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-[#d4d4d8] dark:hover:bg-[#242428]"
                        >
                          <Icon name="calendar" className="h-3.5 w-3.5 text-[var(--info)]" /> {t("phrases.Calendar sync")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            closeProfileMenu();
                            copyShareUrl();
                          }}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-[#d4d4d8] dark:hover:bg-[#242428]"
                        >
                          <Icon name="share" className="h-3.5 w-3.5 text-[var(--applume-accent)]" /> {t("phrases.Share tracker")}
                        </button>
                        <button type="button" onClick={() => { closeProfileMenu(); setFeedbackOpen(true); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-[#d4d4d8] dark:hover:bg-[#242428]">
                          <Icon name="messageSquare" className="h-3.5 w-3.5 text-[var(--applume-accent)]" /> {t("phrases.Share feedback")}
                        </button>
                        <div className="mx-3 my-1 border-t border-slate-100 dark:border-[#2a2a2e]" />
                        <button type="button" onClick={() => { closeProfileMenu(); signOut(); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-[#d4d4d8] dark:hover:bg-[#242428]">
                          <Icon name="reset" className="h-3.5 w-3.5" /> {t("phrases.Sign out")}
                        </button>
                        <button
                          type="button"
                          onClick={() => { closeProfileMenu(); handleDeleteAccount(); }}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-500 hover:text-rose-600 transition hover:bg-rose-50/60 dark:hover:bg-rose-900/10"
                        >
                          {t("phrases.Delete account")}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </div>
          </header>

          {/* Content */}
          <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-6 lg:px-8">
            <motion.div key={sidebarView} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>

                {sidebarView === "dashboard" && (
                  <>
                    {loading && applications.length === 0 ? (
                      <div className="flex items-center justify-center py-20">
                        <svg className="h-6 w-6 animate-spin text-slate-300 dark:text-[#52525b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" />
                        </svg>
                        <span className="ml-3 text-sm text-slate-400 dark:text-[#71717a]">Loading your applications...</span>
                      </div>
                    ) : applications.length === 0 && !onboardingWizardDone ? (
                      <OnboardingWizard
                        userId={session?.user?.id}
                        onStart={(type) => {
                          completeOnboardingWizard();
                          openNewTracked(type, "onboarding_wizard");
                        }}
                        onImport={() => {
                          completeOnboardingWizard();
                          openImportPicker();
                        }}
                        onImportCsv={() => {
                          trackEvent("import_method_selected", { method: "csv_opened", source: "onboarding_wizard" });
                          setCsvImportOpen(true);
                        }}
                        onSkip={skipOnboardingWizard}
                      />
                    ) : applications.length === 0 ? (
                      <EmptyDashboard
                        onAdd={() => openNewTracked("University", "empty_dashboard")}
                        onImport={openImportPicker}
                      />
                    ) : (
                      <>
                        {renderFixedDashboard()}
                        <div className="mt-4">
                          <OnboardingChecklist
                            userId={session?.user?.id}
                            applications={applications}
                            onAddApplication={() => { setDrawerOpen(true); setEditingId(null); setForm(EMPTY_FORM); }}
                            onOpenFeedback={() => setFeedbackOpen(true)}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}

                {sidebarView === "admin" && <AdminPanel />}

                {sidebarView !== "dashboard" && sidebarView !== "admin" && (
                  <>
                    <Toolbar
                      query={query} setQuery={setQuery}
                      typeFilter={typeFilter} setTypeFilter={setTypeFilter}
                      statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                      priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
                      sortBy={sortBy} setSortBy={setSortBy}
                      viewMode={viewMode} setViewMode={setViewMode}
                      showing={filtered.length} total={applications.length}
                    />
                    {viewMode === "table" ? (
                      <ApplicationTable
                        apps={filtered}
                        onEdit={openEdit}
                        onDelete={deleteApplication}
                        onDuplicate={duplicateApplication}
                        onStatusChange={updateStatus}
                        selectedIds={selectedIds}
                        onToggleSelect={toggleSelect}
                        onSelectAll={selectAll}
                      />
                    ) : viewMode === "kanban" ? (
                      <KanbanBoard
                        apps={filtered}
                        onEdit={openEdit}
                        onDelete={deleteApplication}
                        onStatusChange={updateStatus}
                      />
                    ) : (
                      <ApplicationGrid
                        apps={filtered}
                        onEdit={openEdit}
                        onDelete={deleteApplication}
                        onDuplicate={duplicateApplication}
                        onStatusChange={updateStatus}
                        selectedIds={selectedIds}
                        onToggleSelect={toggleSelect}
                      />
                    )}
                  </>
                )}

              </motion.div>
          </div>
        </main>
      </div>

      <BulkActionBar
        count={selectedIds.size}
        onStatusChange={handleBulkStatusChange}
        onPriorityChange={handleBulkPriorityChange}
        onDelete={handleBulkDelete}
        onClear={() => setSelectedIds(new Set())}
      />

      {/* Mobile floating feedback button */}
      <button
        type="button"
        onClick={() => setFeedbackOpen(true)}
        className="fixed bottom-[4.5rem] right-3 z-30 flex h-11 items-center gap-2 rounded-2xl bg-slate-950 px-3 text-sm font-bold text-white shadow-lg shadow-slate-900/25 transition hover:bg-slate-800 min-[380px]:right-4 min-[380px]:px-4 md:hidden dark:bg-[#f0f0f0] dark:text-slate-900 dark:hover:bg-white"
      >
        <Icon name="messageSquare" className="h-4 w-4" />
        <span className="hidden min-[380px]:inline">Feedback</span>
      </button>

      <AnimatePresence>
        {drawerOpen && (
          <ApplicationDrawer
            form={form}
            editingId={editingId}
            applications={applications}
            onChange={(field, value) => setForm((old) => ({ ...old, [field]: value }))}
            onBatchChange={(updates) => setForm((old) => ({ ...old, ...updates }))}
            onSave={saveApplication}
            onClose={() => { setDrawerOpen(false); setEditingId(null); setForm(EMPTY_FORM); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {feedbackOpen && (
          <FeedbackModal session={session} onClose={() => setFeedbackOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {csvImportOpen && (
          <ImportCsvModal onClose={() => setCsvImportOpen(false)} onImport={importCsvRows} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`fixed bottom-5 left-1/2 z-50 flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-2xl ${
              toastKind === "error"   ? "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-900/60 dark:text-rose-300" :
              toastKind === "success" ? "border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] text-[var(--applume-accent-ink)] dark:border-[rgba(0,153,102,0.36)] dark:bg-[rgba(0,153,102,0.18)] dark:text-[var(--applume-accent-muted)]" :
              "border-slate-200 bg-white text-slate-700 dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:text-[#d4d4d8]"
            }`}
          >
            <div className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${
              toastKind === "error"   ? "bg-rose-200 text-rose-700 dark:bg-rose-800 dark:text-rose-300"    :
              toastKind === "success" ? "bg-[var(--applume-accent-muted)] text-[var(--applume-accent-hover)] dark:bg-[rgba(0,153,102,0.24)] dark:text-[var(--applume-accent-muted)]" :
              "bg-slate-200 text-slate-600 dark:bg-[#2a2a2e] dark:text-[#a1a1aa]"
            }`}>
              <Icon name={toastKind === "error" ? "close" : "check"} className="h-3 w-3" />
            </div>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
