import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Brand } from "@/components/layout/Brand";
import { NavItem } from "@/components/layout/NavItem";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";
import { OnboardingWizard } from "@/components/dashboard/OnboardingWizard";
import { DashboardGreeting } from "@/components/dashboard/DashboardGreeting";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { SettingsModal } from "@/components/dashboard/SettingsModal";
import { FeedbackModal } from "@/components/dashboard/FeedbackModal";
import { ProfileMenu } from "@/components/dashboard/ProfileMenu";
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
import { STATUSES, ACTIONABLE_STATUSES, ADMIN_EMAIL, EMPTY_FORM, OUTCOME_STATUSES } from "@/utils/constants";
import { OutcomeDialog } from "@/components/applications/OutcomeDialog";
import { makeId, todayIso, daysUntil, deadlineInfo, priorityRank, normalize } from "@/utils/date";
import { documentsProgress, buildDocumentLibrary } from "@/utils/documents";
import { DocumentLibraryView } from "@/components/documents/DocumentLibraryView";
import { ensureShareToken } from "@/lib/shareTokens";
import { toCsv } from "@/utils/csv";
import { trackEvent, trackOnce } from "@/utils/analytics";
import { useLanguage } from "@/i18n";

const VIEW_META = {
  dashboard:    { title: "Overview",           sub: "Tracker overview" },
  universities: { title: "University records", sub: "Admissions"       },
  jobs:         { title: "Job records",        sub: "Applications"     },
  urgent:       { title: "Upcoming deadlines", sub: "Action needed"    },
  documents:    { title: "Documents",          sub: "Linked files"     },
  admin:        { title: "Feedback inbox", sub: "Admin"         },
};

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
  const DEFAULT_VIEW_KEY = "applume_default_view";
  const [defaultView, setDefaultView] = useState(() => {
    try {
      const stored = localStorage.getItem(DEFAULT_VIEW_KEY);
      return ["cards", "table", "kanban"].includes(stored) ? stored : "cards";
    } catch { return "cards"; }
  });
  const [viewMode, setViewMode] = useState(defaultView);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [outcomePrompt, setOutcomePrompt] = useState(null); // { id, name, status }
  const outcomeMigrationWarned = useRef(false);
  const [sidebarView, setSidebarView] = useState("dashboard");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastKind, setToastKind] = useState("success");
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [csvImportOpen, setCsvImportOpen] = useState(false);
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
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
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

  async function copyCalendarUrl() {
    if (!session?.user) return;
    const result = await ensureShareToken(session.user.id, "calendar");
    if (result.unavailable) { notify(t("phrases.Sharing needs the database migration (see REDESIGN_PLAN.md)."), "error"); return; }
    if (result.error || !result.token) { notify(result.error || "Could not create the link.", "error"); return; }
    const url = `${window.location.origin}/calendar/${result.token}.ics`;
    navigator.clipboard.writeText(url);
    trackEvent("calendar_sync_connected", { method: "copied_url" });
    notify(t("phrases.Calendar URL copied. Paste it in Google Calendar > Other calendars > From URL."), "success");
  }

  async function copyShareUrl() {
    if (!session?.user) return;
    const result = await ensureShareToken(session.user.id, "share");
    if (result.unavailable) { notify(t("phrases.Sharing needs the database migration (see REDESIGN_PLAN.md)."), "error"); return; }
    if (result.error || !result.token) { notify(result.error || "Could not create the link.", "error"); return; }
    const url = `${window.location.origin}/share/${result.token}`;
    navigator.clipboard.writeText(url);
    notify(t("phrases.Share link copied. Manage or revoke it in Settings → Sharing."), "success");
  }

  function changeDefaultView(view) {
    if (!["cards", "table", "kanban"].includes(view)) return;
    try { localStorage.setItem(DEFAULT_VIEW_KEY, view); } catch { /* ignore storage failures */ }
    setDefaultView(view);
    setViewMode(view);
  }

  function setThemeMode(mode) {
    if ((mode === "dark") !== dark) toggleTheme();
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
    // "documented" = every checklist item is checked (not just non-empty text).
    const documented = applications.filter((app) => documentsProgress(app.documents).complete).length;
    const incompleteItems = applications
      .map((app) => {
        const docs = documentsProgress(app.documents);
        const undone = docs.total - docs.done;
        const missing = [
          !app.deadline && t("phrases.deadline"),
          !docs.complete && (docs.total === 0
            ? t("phrases.documents")
            : undone === 1 ? t("phrases.1 document") : t("phrases.{count} documents", { count: undone })),
          !String(app.link || "").trim() && t("phrases.link"),
          !String(app.notes || "").trim() && t("phrases.next step"),
        ].filter(Boolean);
        return { app, missing };
      })
      .filter((entry) => entry.missing.length > 0);
    return { documented, incompleteItems };
  }, [applications, t]);

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
    const missingDocumentItems = applications.filter((app) => !documentsProgress(app.documents).complete);
    return { overdueItems, dueSoonItems, interviewItems, missingDocumentItems };
  }, [applications]);

  const documentLibrary = useMemo(() => buildDocumentLibrary(applications), [applications]);

  const displayName = useMemo(() => {
    const meta = session?.user?.user_metadata || {};
    const raw = meta.full_name || meta.name || meta.display_name || "";
    const fromMeta = String(raw).trim().split(/\s+/)[0];
    if (fromMeta) return fromMeta.charAt(0).toUpperCase() + fromMeta.slice(1);
    const local = String(session?.user?.email || "").split("@")[0].replace(/[._+-].*$/, "").replace(/\d+/g, "");
    if (local.length >= 2) return local.charAt(0).toUpperCase() + local.slice(1);
    return "";
  }, [session]);

  const todayLabel = useMemo(() => {
    try {
      return new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
    } catch {
      return "";
    }
  }, []);

  const headerSummary = sidebarView === "dashboard"
    ? todayLabel
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
      const previous = applications.find((app) => app.id === editingId);
      const { error } = await supabase
        .from("applications")
        .update(payload)
        .eq("id", editingId)
        .eq("user_id", session.user.id);
      if (error) { notify(error.message, "error"); return; }
      setApplications((old) => old.map((app) => (app.id === editingId ? normalize({ ...app, ...payload }) : app)));
      notify("Application updated.");
      if (previous && payload.status !== previous.status) {
        appendStatusHistory(previous, payload.status, payload.lastUpdated);
        if (OUTCOME_STATUSES.includes(payload.status)) {
          setOutcomePrompt({ id: editingId, name: payload.name, status: payload.status });
        }
      }
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
    const current = applications.find((a) => a.id === id);
    const prevStatus = current?.status;
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: newStatus, lastUpdated: today } : a));
    const { error } = await supabase.from("applications").update({ status: newStatus, lastUpdated: today }).eq("id", id).eq("user_id", session.user.id);
    if (error) { notify(error.message, "error"); return; }
    trackOnce("first_status_updated", { status: newStatus });
    if (newStatus !== prevStatus) {
      appendStatusHistory(current, newStatus, today);
      if (OUTCOME_STATUSES.includes(newStatus)) {
        setOutcomePrompt({ id, name: current?.name || "", status: newStatus });
      }
    }
  }

  // Best-effort second write: status history lives in a jsonb column added by
  // the Phase 5.2 migration. If the column doesn't exist yet, the base status
  // update above has already succeeded — we just hint at the migration once.
  async function appendStatusHistory(app, newStatus, at) {
    if (!app || !session?.user) return;
    const history = [...(Array.isArray(app.statusHistory) ? app.statusHistory : []), { status: newStatus, at }];
    const { error } = await supabase.from("applications").update({ statusHistory: history }).eq("id", app.id).eq("user_id", session.user.id);
    if (error) warnOutcomeMigrationOnce();
    else setApplications((prev) => prev.map((a) => (a.id === app.id ? { ...a, statusHistory: history } : a)));
  }

  function warnOutcomeMigrationOnce() {
    if (outcomeMigrationWarned.current) return;
    outcomeMigrationWarned.current = true;
    notify("Outcome tracking needs the Phase 5.2 database migration (see REDESIGN_PLAN.md).", "error");
  }

  async function saveOutcome({ reason, note }) {
    const prompt = outcomePrompt;
    setOutcomePrompt(null);
    if (!prompt || !session?.user) return;
    const outcome = { result: prompt.status, reason: reason || "", note: String(note || "").trim(), at: todayIso() };
    const { error } = await supabase.from("applications").update({ outcome }).eq("id", prompt.id).eq("user_id", session.user.id);
    if (error) { warnOutcomeMigrationOnce(); return; }
    setApplications((prev) => prev.map((a) => (a.id === prompt.id ? { ...a, outcome } : a)));
    notify("Outcome saved.");
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
    // A copy starts fresh — don't inherit the source's history or outcome.
    if ("statusHistory" in newApp) newApp.statusHistory = [];
    if ("outcome" in newApp) newApp.outcome = null;
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

  return (
    <div className={`${dark ? "dark" : ""} min-h-dvh overflow-x-hidden bg-[var(--surface-page)] text-[var(--ink)]`}>
      <div className="flex min-h-dvh min-w-0">

        {/* Sidebar */}
        <aside className="max-md:hidden md:flex w-60 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface-card)]">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <Brand dark={dark} />
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-5">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-soft)]">Menu</p>
            <nav className="space-y-0.5">
              <NavItem active={sidebarView === "dashboard"}    onClick={() => handleSidebarView("dashboard")}    icon="dashboard"  label="Dashboard"      />
              <NavItem active={sidebarView === "universities"} onClick={() => handleSidebarView("universities")} icon="university" label="Universities"    count={stats.universities} />
              <NavItem active={sidebarView === "jobs"}         onClick={() => handleSidebarView("jobs")}         icon="job"        label="Jobs"            count={stats.jobs} />
              <NavItem active={sidebarView === "urgent"}       onClick={() => handleSidebarView("urgent")}       icon="calendar"   label="Urgent"          count={stats.actionNeeded} alert={stats.actionNeeded > 0} />
              <NavItem active={sidebarView === "documents"}    onClick={() => handleSidebarView("documents")}    icon="file"       label="Documents"       count={documentLibrary.length} />
              {session?.user?.email === ADMIN_EMAIL && (
                <NavItem active={sidebarView === "admin"} onClick={() => handleSidebarView("admin")} icon="shield" label="Feedback inbox" />
              )}
            </nav>

          </div>
        </aside>

        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-card)_92%,transparent)] backdrop-blur-md md:hidden">
          <div className="flex items-stretch">
            {[
              { view: "dashboard",    icon: "dashboard",  label: label("view", "Home")  },
              { view: "universities", icon: "university", label: label("view", "Uni")   },
              { view: "jobs",         icon: "job",        label: label("view", "Jobs")  },
              { view: "urgent",       icon: "calendar",   label: label("view", "Urgent")},
              { view: "documents",    icon: "file",       label: "Docs"                 },
            ].map(({ view, icon, label }) => {
              const isActive = sidebarView === view;
              const badge = view === "urgent" ? stats.actionNeeded : 0;
              return (
                <button
                  key={view}
                  type="button"
                  onClick={() => handleSidebarView(view)}
                  className={`flex flex-1 flex-col items-center gap-1 py-2.5 transition-colors ${isActive ? "text-[var(--applume-accent)]" : "text-[var(--text-soft)]"}`}
                >
                  <div className="relative">
                    <Icon name={icon} className="h-5 w-5" />
                    {badge > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--danger)] text-[8px] font-black text-white">
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
                className={`flex flex-1 flex-col items-center gap-1 py-2.5 transition-colors ${sidebarView === "admin" ? "text-[var(--applume-accent)]" : "text-[var(--text-soft)]"}`}
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
          <header className="sticky top-0 z-30 max-w-full border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-card)_85%,transparent)] backdrop-blur-md">
            <div className="flex min-w-0 items-center justify-between gap-2 px-3 py-3 sm:px-6">
              <motion.div key={sidebarView} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }} className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-[var(--text-muted)]">{headerSummary}</p>
                <h1 className="truncate text-xl font-semibold leading-tight tracking-[-0.01em] text-[var(--text-strong)]">{t(`phrases.${VIEW_META[sidebarView]?.title}`)}</h1>
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
                    className="flex h-9 items-center justify-center gap-1.5 rounded-[9px] border border-[var(--border-strong)] bg-[var(--surface-card)] px-2.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--ink)] sm:px-3"
                  >
                    <Icon name="download" className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{t("phrases.Export")}</span>
                    <svg className="hidden h-3 w-3 text-[var(--text-soft)] min-[380px]:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {exportMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface-card)] py-1 shadow-[0_18px_50px_-30px_rgba(12,20,16,0.4)]"
                      >
                        <button onClick={() => { downloadFile("applications.csv", toCsv(applications), "text/csv"); setExportMenuOpen(false); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--surface-soft)]">
                          <Icon name="download" className="h-3.5 w-3.5 text-[var(--text-soft)]" /> {t("phrases.Export CSV")}
                        </button>
                        <button onClick={() => { downloadFile("applications-backup.json", JSON.stringify(applications, null, 2), "application/json"); setExportMenuOpen(false); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--surface-soft)]">
                          <Icon name="download" className="h-3.5 w-3.5 text-[var(--text-soft)]" /> {t("phrases.Download backup")}
                        </button>
                        <div className="mx-3 my-1 border-t border-[var(--border)]" />
                        <button type="button" onClick={() => { setCsvImportOpen(true); setExportMenuOpen(false); }} className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--surface-soft)]">
                          <Icon name="upload" className="h-3.5 w-3.5 text-[var(--text-soft)]" /> Import CSV
                        </button>
                        <button type="button" onClick={() => { openImportPicker(); setExportMenuOpen(false); }} className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--surface-soft)]">
                          <Icon name="upload" className="h-3.5 w-3.5 text-[var(--text-soft)]" /> {t("phrases.Import backup")}
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
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-[9px] border border-[var(--border-strong)] bg-[var(--surface-card)] text-[var(--text-muted)] transition-colors hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] hover:text-[var(--applume-accent-hover)]"
                >
                  <Icon name={dark ? "sun" : "moon"} className="h-4 w-4" />
                </button>

                <ProfileMenu
                  email={session?.user?.email}
                  onSettings={() => setSettingsOpen(true)}
                  onCalendarSync={copyCalendarUrl}
                  onShareTracker={copyShareUrl}
                  onFeedback={() => setFeedbackOpen(true)}
                  onSignOut={signOut}
                  onDeleteAccount={handleDeleteAccount}
                />

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
                        <svg className="h-6 w-6 animate-spin text-[var(--applume-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" />
                        </svg>
                        <span className="ml-3 text-sm text-[var(--text-muted)]">Loading your applications...</span>
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
                      <div className="space-y-6">
                        <DashboardGreeting
                          name={displayName}
                          stats={stats}
                          missingDocs={focusThisWeek.missingDocumentItems.length}
                          onReviewUrgent={() => openUrgentQueue("greeting")}
                          onReviewInterviews={() => openInterviewQueue(focusThisWeek.interviewItems[0])}
                          onReviewDocuments={() => openDocumentQueue(focusThisWeek.missingDocumentItems[0])}
                          onAddApplication={() => openNewTracked("University", "greeting")}
                        />
                        <OnboardingChecklist
                          userId={session?.user?.id}
                          applications={applications}
                          onAddApplication={() => { setDrawerOpen(true); setEditingId(null); setForm(EMPTY_FORM); }}
                          onOpenFeedback={() => setFeedbackOpen(true)}
                        />
                        <DashboardOverview
                          applications={applications}
                          total={stats.total}
                          pipeline={pipeline}
                          topDeadlines={topDeadlines}
                          focusThisWeek={focusThisWeek}
                          documentReadiness={documentReadiness}
                          onOpenRecord={openEdit}
                          onAddDeadline={() => openNewTracked("University", "deadline_empty")}
                          onReviewUrgent={() => openUrgentQueue("focus_layer")}
                          onReviewInterviews={openInterviewQueue}
                          onReviewDocuments={openDocumentQueue}
                        />
                      </div>
                    )}
                  </>
                )}

                {sidebarView === "admin" && <AdminPanel />}

                {sidebarView === "documents" && (
                  <DocumentLibraryView
                    applications={applications}
                    onCopyLink={(url) => { navigator.clipboard.writeText(url); notify("Link copied."); }}
                  />
                )}

                {sidebarView !== "dashboard" && sidebarView !== "admin" && sidebarView !== "documents" && (
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
        {outcomePrompt && (
          <OutcomeDialog
            name={outcomePrompt.name}
            status={outcomePrompt.status}
            onSave={saveOutcome}
            onSkip={() => setOutcomePrompt(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {settingsOpen && (
          <SettingsModal
            session={session}
            dark={dark}
            onSetTheme={setThemeMode}
            defaultView={defaultView}
            onChangeDefaultView={changeDefaultView}
            onSignOut={() => { setSettingsOpen(false); signOut(); }}
            onDeleteAccount={() => { setSettingsOpen(false); handleDeleteAccount(); }}
            onNotify={notify}
            onClose={() => setSettingsOpen(false)}
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
