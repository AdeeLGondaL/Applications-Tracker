import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Brand } from "@/components/layout/Brand";
import { NavItem } from "@/components/layout/NavItem";
import { Metric } from "@/components/dashboard/Metric";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";
import { PipelineCard } from "@/components/dashboard/PipelineCard";
import { UpcomingDeadlinesCard } from "@/components/dashboard/UpcomingDeadlinesCard";
import { InlineStatusPicker } from "@/components/applications/InlineStatusPicker";
import { Toolbar } from "@/components/applications/Toolbar";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { ApplicationCard, ApplicationGrid } from "@/components/applications/ApplicationCard";
import { KanbanBoard } from "@/components/applications/KanbanBoard";
import { ApplicationDrawer } from "@/components/applications/ApplicationDrawer";
import { BulkActionBar } from "@/components/applications/BulkActionBar";
import { EmptyState, EmptyDashboard } from "@/components/applications/EmptyState";
import AdminPanel from "@/pages/AdminPanel";
import { useTheme } from "@/hooks/useTheme";
import { StatCard } from "@/components/ui/StatCard";
import { STATUSES, PRIORITIES, ACTIONABLE_STATUSES, ADMIN_EMAIL, EMPTY_FORM } from "@/utils/constants";
import { makeId, todayIso, daysUntil, deadlineInfo, priorityRank, normalize } from "@/utils/date";
import { toCsv } from "@/utils/csv";

// LandingFooter — inline here so Dashboard can render it at the bottom
function LandingFooter() {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.origin : "https://applume.app";
  const shareText = "Replace your application spreadsheet with Applume.";

  function handleNativeShare() {
    navigator.share({ title: "Applume", text: shareText, url }).catch(() => {});
  }

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }).catch(() => {});
  }

  const socials = [
    { label: "WhatsApp",   href: `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + url)}`, hover: "hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700" },
    { label: "LinkedIn",   href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, hover: "hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700" },
    { label: "X / Twitter",href: `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, hover: "hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900" },
  ];

  return (
    <footer className="mt-16 border-t border-slate-200 pt-10 pb-8 text-center dark:border-[#2a2a2e]">
      <p className="text-sm font-black text-slate-800 dark:text-[#f0f0f0]">Know someone still tracking applications in spreadsheets?</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-[#a1a1aa]">Share Applume as their structured tracker.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        {typeof navigator !== "undefined" && !!navigator.share && (
          <button type="button" onClick={handleNativeShare} className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100">
            <Icon name="share" className="h-3.5 w-3.5" /> Share
          </button>
        )}
        <button type="button" onClick={handleCopy} className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-bold transition ${copied ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:text-[#d4d4d8] dark:hover:bg-[#2e2e32]"}`}>
          <Icon name={copied ? "check" : "copy"} className="h-3.5 w-3.5" />
          {copied ? "Copied!" : "Copy link"}
        </button>
        {socials.map(({ label, href, hover }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:text-[#a1a1aa] ${hover}`}>{label}</a>
        ))}
      </div>
      <p className="mt-8 text-xs text-slate-400 dark:text-[#71717a]">
        © {new Date().getFullYear()} Applume · Structured application tracking
        {" · "}
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 dark:text-[#71717a] dark:hover:text-[#a1a1aa] transition-colors">Privacy Policy</a>
      </p>
    </footer>
  );
}

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
    if (sbError) setError("Couldn't send feedback — please try again.");
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
                className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-emerald-50 dark:bg-emerald-900/40"
                initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 }}
              >
                <Icon name="check" className="h-7 w-7 text-emerald-600" />
              </motion.div>
              <h3 className="text-xl font-black text-slate-950 dark:text-white">Feedback received</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-[#a1a1aa]">
                {type === "bug" ? "Thanks for reporting — we'll investigate and fix it." : "Great idea — we'll consider it for a future update."}
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
              <div className="mb-5 flex rounded-2xl bg-slate-100 p-1 dark:bg-[#2a2a2e]">
                {[{ id: "bug", label: "Bug report" }, { id: "feature", label: "Feature request" }].map(({ id, label }) => (
                  <button key={id} type="button" onClick={() => setType(id)} className="relative flex-1 rounded-xl py-2 text-sm font-bold">
                    {type === id && (
                      <motion.span layoutId="feedback-tab-pill" className="absolute inset-0 rounded-xl bg-white shadow-sm dark:bg-[#1c1c1f]" transition={{ type: "spring", stiffness: 400, damping: 35 }} />
                    )}
                    <span className={`relative z-10 transition-colors ${type === id ? "text-slate-950 dark:text-white" : "text-slate-400 dark:text-[#71717a]"}`}>{label}</span>
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
                      ? "Describe what went wrong and what you expected instead…"
                      : "Explain the problem this would solve, or how you'd use it…"}
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
                      Sending…
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
  dashboard:    { title: "Dashboard",      sub: "Overview"      },
  universities: { title: "Universities",   sub: "Applications"  },
  jobs:         { title: "Jobs",           sub: "Applications"  },
  urgent:       { title: "Urgent",         sub: "Action needed" },
  admin:        { title: "Feedback inbox", sub: "Admin"         },
};

export default function Dashboard({ session }) {
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
  const [viewMode, setViewMode] = useState("table");
  const [sidebarView, setSidebarView] = useState("dashboard");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastKind, setToastKind] = useState("success");
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const exportMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    if (!session?.user) {
      setApplications([]);
      return;
    }
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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) setMobileMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) setViewMode("cards");
  }, []);

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
    const urgent = applications.filter((app) => {
      if (!ACTIONABLE_STATUSES.includes(app.status)) return false;
      const d = daysUntil(app.deadline);
      return d !== null && d >= 0 && d <= 14;
    }).length;
    const overdue = applications.filter((app) => {
      if (!ACTIONABLE_STATUSES.includes(app.status)) return false;
      const d = daysUntil(app.deadline);
      return d !== null && d < 0;
    }).length;
    return { total, universities, jobs, submitted, accepted, interviews, urgent, overdue, progress: total ? Math.round((submitted / total) * 100) : 0 };
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
      .slice(0, 4);
  }, [applications]);

  const pipeline = useMemo(() => {
    return STATUSES.map((status) => ({ status, count: applications.filter((app) => app.status === status).length }));
  }, [applications]);

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
        notify("Backup imported.");
      } catch {
        notify("Could not import this JSON file.", "error");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  return (
    <div className={`${dark ? "dark" : ""} min-h-screen overflow-x-hidden bg-slate-50 text-slate-950 dark:bg-[#09090b] dark:text-white`}>
      <div className="flex min-h-screen min-w-0">

        {/* Sidebar */}
        <aside className="max-md:hidden md:flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-[#2a2a2e] dark:bg-[#09090b]">
          <div className="border-b border-slate-100 px-4 py-4 dark:border-[#2a2a2e]">
            <Brand dark={dark} />
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <p className="mb-1.5 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-[#52525b]">Menu</p>
            <nav className="space-y-0.5">
              <NavItem active={sidebarView === "dashboard"}    onClick={() => handleSidebarView("dashboard")}    icon="dashboard"  label="Dashboard"      />
              <NavItem active={sidebarView === "universities"} onClick={() => handleSidebarView("universities")} icon="university" label="Universities"    count={stats.universities} />
              <NavItem active={sidebarView === "jobs"}         onClick={() => handleSidebarView("jobs")}         icon="job"        label="Jobs"            count={stats.jobs} />
              <NavItem active={sidebarView === "urgent"}       onClick={() => handleSidebarView("urgent")}       icon="calendar"   label="Urgent"          count={stats.urgent + stats.overdue} alert={stats.urgent + stats.overdue > 0} />
              {session?.user?.email === ADMIN_EMAIL && (
                <NavItem active={sidebarView === "admin"} onClick={() => handleSidebarView("admin")} icon="shield" label="Feedback inbox" />
              )}
            </nav>

            <div className="mt-6 px-1">
              <p className="mb-3 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-[#52525b]">Progress</p>
              <ProgressCard progress={stats.progress} submitted={stats.submitted} total={stats.total} />
            </div>
          </div>

          {/* Share & Sync section */}
          <div className="px-3 pb-1">
            <div className="border-t border-slate-100 dark:border-[#2a2a2e] pt-3 pb-1">
              <p className="mb-1 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-[#52525b]">Share & Sync</p>
              <button
                type="button"
                onClick={() => {
                  const url = `https://${window.location.host}/calendar/${session.user.id}.ics`;
                  navigator.clipboard.writeText(url);
                  notify("Calendar URL copied! Paste it in Google Calendar → Other calendars → From URL", "success");
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-[#a1a1aa] dark:hover:bg-[#1c1c1f]"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Icon name="calendar" className="h-4 w-4" />
                </span>
                <span className="text-left leading-tight">
                  <span className="block text-xs font-black text-slate-800 dark:text-[#f0f0f0]">Calendar sync</span>
                  <span className="block text-[10px] text-slate-400 dark:text-[#71717a]">Copy subscription URL</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = `https://${window.location.host}/share/${session.user.id}`;
                  navigator.clipboard.writeText(url);
                  notify("Share link copied! Anyone with this link can view your tracker.", "success");
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-[#a1a1aa] dark:hover:bg-[#1c1c1f]"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <Icon name="share" className="h-4 w-4" />
                </span>
                <span className="text-left leading-tight">
                  <span className="block text-xs font-black text-slate-800 dark:text-[#f0f0f0]">Share tracker</span>
                  <span className="block text-[10px] text-slate-400 dark:text-[#71717a]">Read-only public link</span>
                </span>
              </button>
            </div>
          </div>

          {/* Theme toggle in sidebar */}
          <div className="px-4 pb-2">
            <button
              type="button"
              onClick={toggleTheme}
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
              className="mb-2 flex w-full items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:text-[#a1a1aa] dark:hover:bg-[#242428]"
            >
              <Icon name={dark ? "sun" : "moon"} className="h-3.5 w-3.5 shrink-0" />
              {dark ? "Light mode" : "Dark mode"}
            </button>
            <button
              type="button"
              onClick={() => setFeedbackOpen(true)}
              className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 px-3.5 py-3 text-left transition hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-900/15 dark:hover:bg-emerald-900/25"
            >
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-800/50 dark:text-emerald-400">
                  <Icon name="messageSquare" className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-black text-emerald-900 dark:text-emerald-300">Share feedback</p>
                  <p className="text-[10px] leading-4 text-emerald-700/70 dark:text-emerald-400/70">Bug report or feature idea</p>
                </div>
              </div>
            </button>
          </div>

          <div className="px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-950 text-xs font-black text-white dark:bg-[#d4d4d8] dark:text-slate-900">
                {session?.user?.email?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-700 dark:text-[#a1a1aa]">{session?.user?.email}</p>
                <p className="text-[10px] text-slate-400 dark:text-[#71717a]">Signed in</p>
              </div>
              <button onClick={signOut} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 dark:border-[#2a2a2e] dark:text-[#71717a] dark:hover:bg-[#1c1c1f]">
                Out
              </button>
            </div>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="mt-2 w-full text-left text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors px-0.5"
            >
              Delete account
            </button>
          </div>
        </aside>

        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-sm md:hidden dark:border-[#2a2a2e] dark:bg-[#09090b]/95">
          <div className="flex items-stretch">
            {[
              { view: "dashboard",    icon: "dashboard",  label: "Home"  },
              { view: "universities", icon: "university", label: "Uni"   },
              { view: "jobs",         icon: "job",        label: "Jobs"  },
              { view: "urgent",       icon: "calendar",   label: "Urgent"},
            ].map(({ view, icon, label }) => {
              const isActive = sidebarView === view;
              const badge = view === "urgent" ? stats.urgent + stats.overdue : 0;
              return (
                <button
                  key={view}
                  type="button"
                  onClick={() => handleSidebarView(view)}
                  className={`flex flex-1 flex-col items-center gap-1 py-2.5 transition-colors ${isActive ? "text-emerald-600" : "text-slate-400 dark:text-[#71717a]"}`}
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
                className={`flex flex-1 flex-col items-center gap-1 py-2.5 transition-colors ${sidebarView === "admin" ? "text-emerald-600" : "text-slate-400 dark:text-[#71717a]"}`}
              >
                <Icon name="shield" className="h-5 w-5" />
                <span className="text-[10px] font-bold">Admin</span>
              </button>
            )}
          </div>
        </nav>

        {/* Main */}
        <main className="min-w-0 flex-1 overflow-x-hidden pb-20 md:pb-0">

          {/* Header */}
          <header className="sticky top-0 z-30 max-w-full border-b border-slate-200 bg-white/90 backdrop-blur dark:border-[#2a2a2e] dark:bg-[#1c1c1f]/90">
            <div className="flex min-w-0 items-center justify-between gap-2 px-3 py-3 sm:px-6">
              <AnimatePresence mode="wait">
                <motion.div key={sidebarView} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.15 }} className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-[#71717a]">{VIEW_META[sidebarView]?.sub}</p>
                  <h1 className="truncate text-lg font-black leading-tight sm:text-xl">{VIEW_META[sidebarView]?.title}</h1>
                </motion.div>
              </AnimatePresence>

              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <Button
                  onClick={() => openNew(sidebarView === "jobs" ? "Job" : "University")}
                  className="h-9 rounded-xl px-2.5 text-sm sm:px-3.5"
                >
                  <Icon name="plus" className="sm:mr-1.5" />
                  <span className="hidden sm:inline">Add application</span>
                  <span className="hidden min-[380px]:inline sm:hidden">Add</span>
                </Button>

                <div ref={exportMenuRef} className="relative">
                  <button
                    onClick={() => setExportMenuOpen((v) => !v)}
                    className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:text-[#a1a1aa] dark:hover:bg-[#2e2e32] sm:px-3"
                  >
                    <Icon name="download" className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Export</span>
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
                          <Icon name="download" className="h-3.5 w-3.5 text-slate-400" /> Export CSV
                        </button>
                        <button onClick={() => { downloadFile("applications-backup.json", JSON.stringify(applications, null, 2), "application/json"); setExportMenuOpen(false); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-[#d4d4d8] dark:hover:bg-[#242428]">
                          <Icon name="download" className="h-3.5 w-3.5 text-slate-400" /> Download backup
                        </button>
                        <div className="mx-3 my-1 border-t border-slate-100 dark:border-[#2a2a2e]" />
                        <label className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-[#d4d4d8] dark:hover:bg-[#242428]">
                          <Icon name="upload" className="h-3.5 w-3.5 text-slate-400" /> Import backup
                          <input type="file" accept="application/json" className="hidden" onChange={(e) => { importJson(e); setExportMenuOpen(false); }} />
                        </label>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile: theme toggle + user menu */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  title={dark ? "Switch to light mode" : "Switch to dark mode"}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 md:hidden dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:text-[#a1a1aa] dark:hover:bg-[#2e2e32]"
                >
                  <Icon name={dark ? "sun" : "moon"} className="h-4 w-4" />
                </button>

                <div ref={mobileMenuRef} className="relative md:hidden">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen((v) => !v)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-950 text-xs font-black text-white dark:bg-[#d4d4d8] dark:text-slate-900"
                  >
                    {session?.user?.email?.[0]?.toUpperCase() || "?"}
                  </button>
                  <AnimatePresence>
                    {mobileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-200/80 dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:shadow-none dark:ring-1 dark:ring-white/5"
                      >
                        <div className="border-b border-slate-100 px-4 py-3 dark:border-[#2a2a2e]">
                          <p className="truncate text-xs font-semibold text-slate-700 dark:text-[#a1a1aa]">{session?.user?.email}</p>
                          <p className="text-[10px] text-slate-400 dark:text-[#71717a]">Signed in</p>
                        </div>
                        <button type="button" onClick={() => { setFeedbackOpen(true); setMobileMenuOpen(false); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-[#d4d4d8] dark:hover:bg-[#242428]">
                          <Icon name="messageSquare" className="h-3.5 w-3.5 text-slate-400" /> Share feedback
                        </button>
                        <div className="mx-3 my-1 border-t border-slate-100 dark:border-[#2a2a2e]" />
                        <button
                          type="button"
                          onClick={() => {
                            const url = `https://${window.location.host}/calendar/${session.user.id}.ics`;
                            navigator.clipboard.writeText(url);
                            notify("Calendar URL copied! Paste it in Google Calendar → Other calendars → From URL", "success");
                            setMobileMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-[#d4d4d8] dark:hover:bg-[#242428]"
                        >
                          <Icon name="calendar" className="h-3.5 w-3.5 text-blue-500" /> Calendar sync
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const url = `https://${window.location.host}/share/${session.user.id}`;
                            navigator.clipboard.writeText(url);
                            notify("Share link copied! Anyone with this link can view your tracker.", "success");
                            setMobileMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-[#d4d4d8] dark:hover:bg-[#242428]"
                        >
                          <Icon name="share" className="h-3.5 w-3.5 text-emerald-500" /> Share tracker
                        </button>
                        <div className="mx-3 my-1 border-t border-slate-100 dark:border-[#2a2a2e]" />
                        <button type="button" onClick={signOut} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-900/20">
                          <Icon name="reset" className="h-3.5 w-3.5" /> Sign out
                        </button>
                        <button
                          type="button"
                          onClick={() => { setMobileMenuOpen(false); handleDeleteAccount(); }}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-500 hover:text-rose-600 transition hover:bg-rose-50/60 dark:hover:bg-rose-900/10"
                        >
                          Delete account
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
            <AnimatePresence mode="wait">
              <motion.div key={sidebarView} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>

                {sidebarView === "dashboard" && (
                  <>
                    {loading && applications.length === 0 ? (
                      <div className="flex items-center justify-center py-20">
                        <svg className="h-6 w-6 animate-spin text-slate-300 dark:text-[#52525b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" />
                        </svg>
                        <span className="ml-3 text-sm text-slate-400 dark:text-[#71717a]">Loading your applications…</span>
                      </div>
                    ) : applications.length === 0 ? (
                      <EmptyDashboard onAdd={() => openNew()} />
                    ) : (
                      <>
                        <OnboardingChecklist
                          userId={session?.user?.id}
                          applications={applications}
                          onAddApplication={() => { setDrawerOpen(true); setEditingId(null); setForm(EMPTY_FORM); }}
                          onOpenFeedback={() => setFeedbackOpen(true)}
                        />

                        {/* Premium Dashboard Stats Header */}
                        <div className="mb-8 mt-8">
                          <div className="mb-4">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Command Center</h2>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Track your application pipeline at a glance</p>
                          </div>
                          <div className="grid grid-cols-1 gap-4 min-[640px]:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                              icon="briefcase"
                              label="Total Applied"
                              value={stats.total}
                              trend={stats.total > 0 ? "+12% this week" : null}
                              trendDirection="up"
                            />
                            <StatCard
                              icon="users"
                              label="Interviewing"
                              value={stats.interviews}
                              trend={stats.interviews > 0 ? "Active conversations" : "No interviews yet"}
                              trendDirection={stats.interviews > 0 ? "up" : "down"}
                            />
                            <StatCard
                              icon="award"
                              label="Offers"
                              value={stats.accepted}
                              trend={stats.accepted > 0 ? `${Math.round((stats.accepted / stats.total) * 100)}% success rate` : "Keep applying!"}
                              trendDirection={stats.accepted > 0 ? "up" : "down"}
                            />
                            <StatCard
                              icon="activity"
                              label="Response Rate"
                              value={`${stats.total > 0 ? Math.round(((stats.interviews + stats.accepted) / stats.total) * 100) : 0}%`}
                              trend={stats.total > 0 ? `${stats.interviews + stats.accepted} of ${stats.total} responded` : "Start tracking"}
                              trendDirection="up"
                            />
                          </div>
                        </div>

                        <div className="mb-5 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
                          <Metric icon="dashboard"  label="Total"            value={stats.total}                   hint="All tracked entries"             accent="slate"   delay={0}    />
                          <Metric icon="university" label="Universities"     value={stats.universities}            hint="Master's applications"           accent="blue"    delay={0.05} />
                          <Metric icon="job"        label="Jobs"             value={stats.jobs}                    hint="Work applications"               accent="violet"  delay={0.1}  />
                          <Metric icon="calendar"   label="Needs attention"  value={stats.urgent + stats.overdue}  hint={stats.urgent + stats.overdue === 0 ? "All deadlines on track" : `${stats.overdue} overdue · ${stats.urgent} due soon`} danger={stats.urgent + stats.overdue > 0} delay={0.15} />
                          <Metric icon="check"      label="Submitted +"      value={stats.submitted}               hint={stats.accepted > 0 || stats.interviews > 0 ? `${stats.accepted} accepted · ${stats.interviews} interviews` : "Submitted or further"} accent="emerald" delay={0.2} />
                        </div>
                        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
                          <PipelineCard pipeline={pipeline} total={stats.total} />
                          <UpcomingDeadlinesCard apps={topDeadlines} />
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
            </AnimatePresence>
          </div>

          <LandingFooter />
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
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`fixed bottom-5 left-1/2 z-50 flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-2xl ${
              toastKind === "error"   ? "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-900/60 dark:text-rose-300" :
              toastKind === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300" :
              "border-slate-200 bg-white text-slate-700 dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:text-[#d4d4d8]"
            }`}
          >
            <div className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${
              toastKind === "error"   ? "bg-rose-200 text-rose-700 dark:bg-rose-800 dark:text-rose-300"    :
              toastKind === "success" ? "bg-emerald-200 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-300" :
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
