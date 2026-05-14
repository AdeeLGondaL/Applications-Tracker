import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TYPES = ["University", "Job"];
const STATUSES = ["Not Open Yet", "Open", "Applying", "Submitted", "Awaiting Response", "Interview", "Accepted", "Rejected", "Deferred"];
const PRIORITIES = ["High", "Medium", "Low"];

const EMPTY_FORM = {
  type: "University",
  status: "Not Open Yet",
  name: "",
  programRole: "",
  city: "",
  openingDate: "",
  deadline: "",
  applicationType: "",
  priority: "Medium",
  link: "",
  documents: "",
  notes: "",
};

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function parseDate(value) {
  if (!value) return null;
  const parts = String(value).split("-").map(Number);
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return null;
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return Number.isNaN(date.getTime()) ? null : date;
}

function daysUntil(value, baseDate = new Date()) {
  const target = parseDate(value);
  if (!target) return null;
  const base = new Date(baseDate);
  base.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - base.getTime()) / 86400000);
}

function formatDate(value) {
  const date = parseDate(value);
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function deadlineInfo(value) {
  const days = daysUntil(value);
  if (days === null) return { label: "No deadline", tone: "neutral", sort: 999999 };
  if (days < 0) return { label: `${Math.abs(days)}d overdue`, tone: "danger", sort: days };
  if (days <= 14) return { label: `${days}d left`, tone: "warning", sort: days };
  if (days <= 45) return { label: `${days}d left`, tone: "notice", sort: days };
  return { label: `${days}d left`, tone: "success", sort: days };
}

function priorityRank(priority) {
  return { High: 0, Medium: 1, Low: 2 }[priority] ?? 9;
}

function normalize(item) {
  return { id: item.id || makeId(), ...EMPTY_FORM, ...item, lastUpdated: item.lastUpdated || todayIso() };
}

function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function toCsv(rows) {
  const headers = ["type", "status", "name", "programRole", "city", "openingDate", "deadline", "applicationType", "priority", "link", "documents", "notes", "lastUpdated"];
  return [headers.join(","), ...rows.map((row) => headers.map((key) => csvEscape(row[key])).join(",")).join("\n")].join("\n");
}

const SAMPLE_DATA = [
  { type: "University", status: "Applying", name: "TU Darmstadt", programRole: "M.Sc. Artificial Intelligence and Machine Learning", city: "Darmstadt", openingDate: "2026-04-01", deadline: "2026-07-15", applicationType: "University portal", priority: "High", link: "https://www.tu-darmstadt.de/studieren/studieninteressierte/bewerbung_zulassung_tu/online_bewerbung/index.en.jsp", documents: "CV, transcript, module handbook, language certificate", notes: "Strong AI/ML option. Check CS credit requirements." },
  { type: "University", status: "Open", name: "Saarland University", programRole: "M.Sc. Computer Science", city: "Saarbrücken", openingDate: "", deadline: "2026-05-15", applicationType: "SIC portal", priority: "High", link: "https://saarland-informatics-campus.de/en/studium-studies/master-english/application-guide/", documents: "CV, transcript, module handbook, motivation letter", notes: "Very strong CS and AI environment." },
  { type: "University", status: "Not Open Yet", name: "University of Bonn", programRole: "M.Sc. Computer Science", city: "Bonn", openingDate: "2026-04-15", deadline: "2026-05-01", applicationType: "University portal", priority: "High", link: "https://www.informatik.uni-bonn.de/en/studies/master-programs/master-computer-science", documents: "CV, transcript, module handbook", notes: "Short deadline. Prepare documents early." },
  { type: "University", status: "Not Open Yet", name: "University of Cologne", programRole: "M.Sc. Computational Sciences", city: "Cologne", openingDate: "2026-06-01", deadline: "2026-07-15", applicationType: "University portal", priority: "Medium", link: "https://computationalsciences.uni-koeln.de/info/application", documents: "CV, transcript, language certificate", notes: "Check if the course is too data-science heavy." },
  { type: "Job", status: "Open", name: "Mercedes-Benz", programRole: "Working Student / Internship", city: "Stuttgart", openingDate: "", deadline: "", applicationType: "Career portal", priority: "High", link: "", documents: "CV, cover letter", notes: "Tailor CV toward automotive software, AI, BMS, and testing." },
].map((item) => normalize({ ...item, id: makeId() }));

function runTests() {
  const base = new Date(2026, 4, 2);
  console.assert(daysUntil("2026-05-03", base) === 1, "daysUntil tomorrow failed");
  console.assert(daysUntil("2026-05-01", base) === -1, "daysUntil overdue failed");
  console.assert(daysUntil("", base) === null, "empty date should be null");
  console.assert(formatDate("") === "—", "empty formatted date failed");
  console.assert(priorityRank("High") < priorityRank("Low"), "priority rank failed");
  console.assert(deadlineInfo("").sort === 999999, "missing deadline sort failed");
  console.assert(toCsv([{ name: 'A "quoted" name' }]).includes('"A ""quoted"" name"'), "CSV escaping failed");
  console.assert(normalize({ name: "Test" }).status === "Not Open Yet", "normalize default status failed");
}
runTests();

function Icon({ name, className = "" }) {
  const icons = {
    dashboard: "M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z",
    university: "M12 3 2 8l10 5 10-5-10-5Zm-6 9v5c3 2 9 2 12 0v-5",
    job: "M4 7h16v12H4V7Zm4 0V5h8v2M4 12h16",
    plus: "M12 5v14M5 12h14",
    search: "M21 21l-4.3-4.3M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z",
    download: "M12 3v12m0 0 5-5m-5 5-5-5M4 17v3h16v-3",
    upload: "M12 21V9m0 0 5 5m-5-5-5 5M4 7V4h16v3",
    edit: "M4 20h4L19 9a3 3 0 0 0-4-4L4 16v4Z",
    copy: "M8 8h12v12H8V8ZM4 4h12v12H4V4Z",
    trash: "M4 7h16M9 7V5h6v2m-8 0 1 13h8l1-13",
    link: "M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1",
    close: "M6 6l12 12M18 6 6 18",
    reset: "M4 4v6h6M4 10a8 8 0 1 0 2-5",
    filter: "M4 6h16M7 12h10M10 18h4",
    calendar: "M4 5h16v15H4V5Zm4-2v4m8-4v4M4 10h16",
    check: "M20 6 9 17l-5-5",
  };
  return (
    <svg className={`h-4 w-4 ${className}`.trim()} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={icons[name] || icons.dashboard} />
    </svg>
  );
}

export default function ApplicationTrackerWebsite() {
  const [applications, setApplications] = useState([]);
  const [session, setSession] = useState(null);
  const [authMode, setAuthMode] = useState("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
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

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setApplications([]);
      return;
    }
    fetchApplications();
  }, [session]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function fetchApplications() {
    if (!session?.user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", session.user.id)
      .order("lastUpdated", { ascending: false });
    if (error) {
      setToast(error.message);
    } else {
      setApplications(data.map(normalize));
    }
    setLoading(false);
  }

  async function signIn() {
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    setAuthLoading(false);
    if (error) {
      setToast(error.message);
      return;
    }
    setToast("Signed in successfully.");
  }

  async function signUp() {
    setAuthLoading(true);
    const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
    setAuthLoading(false);
    if (error) {
      setToast(error.message);
      return;
    }
    setToast("Check your inbox to confirm your account.");
  }

  async function signOut() {
    await supabase.auth.signOut();
    setApplications([]);
    setSession(null);
    setToast("Signed out.");
  }

  function handleSidebarView(view) {
    setSidebarView(view);
    setQuery("");
  }

  const stats = useMemo(() => {
    const total = applications.length;
    const universities = applications.filter((app) => app.type === "University").length;
    const jobs = applications.filter((app) => app.type === "Job").length;
    const submitted = applications.filter((app) => ["Submitted", "Awaiting Response", "Interview", "Accepted"].includes(app.status)).length;
    const urgent = applications.filter((app) => {
      const d = daysUntil(app.deadline);
      return d !== null && d >= 0 && d <= 14;
    }).length;
    const overdue = applications.filter((app) => {
      const d = daysUntil(app.deadline);
      return d !== null && d < 0;
    }).length;
    return { total, universities, jobs, submitted, urgent, overdue, progress: total ? Math.round((submitted / total) * 100) : 0 };
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

  const nextDeadline = useMemo(() => {
    return [...applications]
      .filter((app) => daysUntil(app.deadline) !== null)
      .sort((a, b) => deadlineInfo(a.deadline).sort - deadlineInfo(b.deadline).sort)[0] || null;
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
    const { id, lastUpdated, ...editable } = app;
    setForm({ ...EMPTY_FORM, ...editable });
    setEditingId(id);
    setDrawerOpen(true);
  }

  async function saveApplication() {
    if (!form.name.trim() || !form.programRole.trim()) {
      setToast("Add name and course/job title first.");
      return;
    }
    if (!session?.user) {
      setToast("Please sign in to save applications.");
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
      if (error) {
        setToast(error.message);
        return;
      }
      setApplications((old) => old.map((app) => (app.id === editingId ? normalize({ ...app, ...payload }) : app)));
      setToast("Application updated.");
    } else {
      const newApp = { id: makeId(), ...payload };
      const { error } = await supabase.from("applications").insert([newApp]);
      if (error) {
        setToast(error.message);
        return;
      }
      setApplications((old) => [normalize(newApp), ...old]);
      setToast("Application added.");
    }

    setDrawerOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function deleteApplication(id) {
    const app = applications.find((entry) => entry.id === id);
    const ok = typeof window === "undefined" ? true : window.confirm(`Delete ${app?.name || "this entry"}?`);
    if (!ok) return;
    if (!session?.user) {
      setToast("Please sign in to delete applications.");
      return;
    }

    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);
    if (error) {
      setToast(error.message);
      return;
    }
    setApplications((old) => old.filter((entry) => entry.id !== id));
    setToast("Application deleted.");
  }

  async function duplicateApplication(app) {
    if (!session?.user) {
      setToast("Please sign in to duplicate applications.");
      return;
    }
    const newApp = {
      ...app,
      id: makeId(),
      name: `${app.name} copy`,
      status: "Not Open Yet",
      lastUpdated: todayIso(),
      user_id: session.user.id,
    };
    const { error } = await supabase.from("applications").insert([newApp]);
    if (error) {
      setToast(error.message);
      return;
    }
    setApplications((old) => [normalize(newApp), ...old]);
    setToast("Application duplicated.");
  }

  async function resetSampleData() {
    if (!session?.user) {
      setToast("Please sign in to reset sample data.");
      return;
    }
    const ok = typeof window === "undefined" ? true : window.confirm("Replace current data with sample data?");
    if (!ok) return;

    setLoading(true);
    const userId = session.user.id;
    const items = SAMPLE_DATA.map((app) => ({ ...app, id: makeId(), lastUpdated: todayIso(), user_id: userId }));
    const { error: deleteError } = await supabase.from("applications").delete().eq("user_id", userId);
    if (deleteError) {
      setToast(deleteError.message);
      setLoading(false);
      return;
    }
    const { error: insertError } = await supabase.from("applications").insert(items);
    setLoading(false);
    if (insertError) {
      setToast(insertError.message);
      return;
    }
    setApplications(items.map(normalize));
    setToast("Sample data restored.");
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
    if (!session?.user) {
      setToast("Please sign in to import data.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!Array.isArray(parsed)) throw new Error("Backup should be an array");
        const rows = parsed.map((item) => normalize({ ...item, id: item.id || makeId(), user_id: session.user.id }));
        const { error } = await supabase.from("applications").upsert(rows, { onConflict: "id" });
        if (error) throw error;
        setApplications(rows);
        setToast("Backup imported.");
      } catch {
        setToast("Could not import this JSON file.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  if (!session) return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white">Supabase-backed</span>
            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Application tracking made simple for students and job seekers.</h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600">Keep every university and job application in one secure place. Create an account, save your progress, and access your data everywhere.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-slate-900">Private accounts</p>
                <p className="mt-2 text-sm text-slate-500">Each user stores applications separately in Supabase.</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-slate-900">Dashboard insights</p>
                <p className="mt-2 text-sm text-slate-500">View conversions, deadlines and urgent items at a glance.</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-slate-900">Share the value</p>
                <p className="mt-2 text-sm text-slate-500">Invite friends or colleagues to use the app with their own account.</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-slate-900">Responsive UI</p>
                <p className="mt-2 text-sm text-slate-500">Use the same polished tracker from desktop or mobile.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Welcome back</p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">{authMode === "signin" ? "Sign in to your account" : "Create your free account"}</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">{authMode === "signin" ? "Sign in" : "Sign up"}</span>
            </div>

            <div className="space-y-5">
              <div className="grid gap-2">
                <label className="text-sm font-bold text-slate-700">Email address</label>
                <input value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} type="email" placeholder="you@example.com" className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <input value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} type="password" placeholder="Create a strong password" className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100" />
              </div>
              <Button onClick={authMode === "signin" ? signIn : signUp} disabled={!authEmail || !authPassword || authLoading} className="w-full rounded-2xl bg-slate-950 text-white hover:bg-slate-800">
                {authLoading ? "Working..." : authMode === "signin" ? "Sign in" : "Create account"}
              </Button>
              <button type="button" onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
                {authMode === "signin" ? "Need an account? Create one" : "Already have an account? Sign in"}
              </button>
            </div>

            <div className="mt-6 rounded-3xl bg-slate-950 px-5 py-4 text-white shadow-sm">
              <p className="text-sm font-black">Your data is secured</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">Each account is isolated in Supabase, so your applications remain private and accessible only to you.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="flex min-h-screen">
        <aside className="max-md:hidden md:block w-72 shrink-0 border-r border-slate-200 bg-white px-5 py-6">
          <Brand />
          <nav className="space-y-2 text-sm font-semibold">
            <NavItem active={sidebarView === "dashboard"} onClick={() => handleSidebarView("dashboard")} icon="dashboard" label="Dashboard" />
            <NavItem active={sidebarView === "universities"} onClick={() => handleSidebarView("universities")} icon="university" label="Universities" count={stats.universities} />
            <NavItem active={sidebarView === "jobs"} onClick={() => handleSidebarView("jobs")} icon="job" label="Jobs" count={stats.jobs} />
            <NavItem active={sidebarView === "urgent"} onClick={() => handleSidebarView("urgent")} icon="calendar" label="Urgent" count={stats.urgent + stats.overdue} />
          </nav>
          <ProgressCard progress={stats.progress} />
          <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950 p-4 text-white shadow-sm">
            <p className="text-sm font-black">Workflow tip</p>
            <p className="mt-2 text-xs leading-5 text-slate-300">Keep one next action per application so your dashboard stays actionable and easy to review.</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Personal application CRM</p>
                <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Job & University Application Tracker</h1>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Button onClick={() => openNew("University")} className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"><Icon name="plus" className="mr-2" /> Add application</Button>
                <Button variant="outline" onClick={() => downloadFile("applications.csv", toCsv(applications), "text/csv")} className="rounded-2xl bg-white"><Icon name="download" className="mr-2" /> CSV</Button>
                <Button variant="outline" onClick={() => downloadFile("applications-backup.json", JSON.stringify(applications, null, 2), "application/json")} className="rounded-2xl bg-white"><Icon name="download" className="mr-2" /> Backup</Button>
                <label className="inline-flex h-10 cursor-pointer items-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold shadow-sm hover:bg-slate-50">
                  <Icon name="upload" className="mr-2" /> Import
                  <input type="file" accept="application/json" className="hidden" onChange={importJson} />
                </label>
                <div className="ml-auto flex flex-wrap items-center gap-2">
                  {session?.user?.email && <span className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">Signed in as {session.user.email}</span>}
                  <Button variant="outline" onClick={signOut} className="rounded-2xl bg-white">Sign out</Button>
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {sidebarView === "dashboard" && (
              <>
                <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  <Metric icon="dashboard" label="Total" value={stats.total} hint="All tracked entries" />
                  <Metric icon="university" label="Universities" value={stats.universities} hint="Master applications" />
                  <Metric icon="job" label="Jobs" value={stats.jobs} hint="Work applications" />
                  <Metric icon="calendar" label="Needs attention" value={stats.urgent + stats.overdue} hint={`${stats.overdue} overdue, ${stats.urgent} urgent`} danger={stats.urgent + stats.overdue > 0} />
                  <Metric icon="check" label="Submitted+" value={stats.submitted} hint="Submitted or later" />
                </section>

                <section className="mb-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                  <PipelineCard pipeline={pipeline} onReset={resetSampleData} />
                  <NextDeadlineCard app={nextDeadline} />
                </section>
              </>
            )}

            {sidebarView !== "dashboard" && (
              <>
                <Toolbar
                  query={query}
                  setQuery={setQuery}
                  typeFilter={typeFilter}
                  setTypeFilter={setTypeFilter}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  priorityFilter={priorityFilter}
                  setPriorityFilter={setPriorityFilter}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  showing={filtered.length}
                  total={applications.length}
                />

                {viewMode === "table" ? (
                  <ApplicationTable apps={filtered} onEdit={openEdit} onDelete={deleteApplication} onDuplicate={duplicateApplication} />
                ) : (
                  <ApplicationGrid apps={filtered} onEdit={openEdit} onDelete={deleteApplication} onDuplicate={duplicateApplication} />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <ApplicationDrawer
            form={form}
            editingId={editingId}
            onChange={(field, value) => setForm((old) => ({ ...old, [field]: value }))}
            onSave={saveApplication}
            onClose={() => {
              setDrawerOpen(false);
              setEditingId(null);
              setForm(EMPTY_FORM);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold shadow-2xl">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Brand() {
  return (
    <div className="mb-8 flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white"><Icon name="dashboard" className="h-5 w-5" /></div>
      <div><p className="text-sm font-black">ApplyFlow</p><p className="text-xs text-slate-500">Tracker dashboard</p></div>
    </div>
  );
}

function NavItem({ icon, label, count, active = false, onClick }) {
  return (
    <button type="button" onClick={onClick} className={`w-full text-left flex items-center justify-between rounded-2xl px-3 py-2.5 transition ${active ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
      <span className="flex items-center gap-3"><Icon name={icon} /> {label}</span>
      {typeof count === "number" && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{count}</span>}
    </button>
  );
}

function ProgressCard({ progress }) {
  return (
    <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex justify-between text-sm"><span className="font-bold">Submission progress</span><span className="font-black">{progress}%</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-slate-950" style={{ width: `${progress}%` }} /></div>
      <p className="mt-3 text-xs leading-5 text-slate-500">Submitted, awaiting response, interview, and accepted are counted as progress.</p>
    </div>
  );
}

function Metric({ icon, label, value, hint, danger = false }) {
  return (
    <Card className="rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className={`grid h-11 w-11 place-items-center rounded-2xl ${danger ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-700"}`}><Icon name={icon} /></div>
          {danger && <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">Action</span>}
        </div>
        <p className="text-3xl font-black">{value}</p>
        <p className="mt-1 text-sm font-bold text-slate-700">{label}</p>
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      </CardContent>
    </Card>
  );
}

function PipelineCard({ pipeline, onReset }) {
  const visible = pipeline.filter((item) => item.count > 0 || ["Applying", "Submitted", "Awaiting Response", "Interview", "Accepted"].includes(item.status));
  return (
    <Card className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div><h2 className="text-lg font-black">Application pipeline</h2><p className="text-sm text-slate-500">Your current application status distribution.</p></div>
          <Button variant="outline" onClick={onReset} className="rounded-2xl bg-white"><Icon name="reset" className="mr-2" /> Reset</Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {visible.map((item) => <div key={item.status} className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><p className="text-2xl font-black">{item.count}</p><p className="mt-1 text-xs font-bold text-slate-500">{item.status}</p></div>)}
        </div>
      </CardContent>
    </Card>
  );
}

function NextDeadlineCard({ app }) {
  if (!app) {
    return (
      <Card className="rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-sm">
        <CardContent className="p-6"><Icon name="calendar" className="mb-4 h-8 w-8" /><h2 className="text-xl font-black">Next deadline focus</h2><p className="mt-3 text-sm text-slate-100">No deadlines added yet.</p></CardContent>
      </Card>
    );
  }
  const info = deadlineInfo(app.deadline);
  return (
    <Card className="rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-sm">
      <CardContent className="p-6">
        <Icon name="calendar" className="mb-4 h-8 w-8" />
        <h2 className="text-xl font-black">Next deadline focus</h2>
        <div className="mt-4"><Badge tone="dark">{info.label}</Badge><p className="mt-3 text-lg font-black">{app.name}</p><p className="mt-1 text-sm text-slate-100">{app.programRole}</p></div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm"><DarkInfo label="Deadline" value={formatDate(app.deadline)} /><DarkInfo label="Priority" value={app.priority} /></div>
      </CardContent>
    </Card>
  );
}

function Toolbar(props) {
  const { query, setQuery, typeFilter, setTypeFilter, statusFilter, setStatusFilter, priorityFilter, setPriorityFilter, sortBy, setSortBy, viewMode, setViewMode, showing, total } = props;
  return (
    <Card className="mb-4 rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="grid gap-3 lg:grid-cols-[1.5fr_0.8fr_0.9fr_0.8fr_0.8fr_auto]">
          <div className="relative"><Icon name="search" className="pointer-events-none absolute left-3 top-3.5 text-slate-400" /><Input className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search university, company, role, city, notes..." /></div>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} options={["All", ...TYPES]} />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={["All", ...STATUSES]} />
          <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} options={["All", ...PRIORITIES]} />
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} options={[{ label: "Deadline", value: "deadline" }, { label: "Priority", value: "priority" }, { label: "Updated", value: "updated" }, { label: "Status", value: "status" }, { label: "Name", value: "name" }]} />
          <div className="flex rounded-2xl border border-slate-200 bg-slate-50 p-1"><Toggle active={viewMode === "table"} onClick={() => setViewMode("table")}>Table</Toggle><Toggle active={viewMode === "cards"} onClick={() => setViewMode("cards")}>Cards</Toggle></div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1"><Icon name="filter" className="h-3 w-3" /> Showing {showing} of {total}</span>
          <button className="font-bold text-slate-700 hover:text-slate-950" onClick={() => { setQuery(""); setTypeFilter("All"); setStatusFilter("All"); setPriorityFilter("All"); }}>Clear filters</button>
        </div>
      </CardContent>
    </Card>
  );
}

function ApplicationTable({ apps, onEdit, onDelete, onDuplicate }) {
  if (!apps.length) return <EmptyState />;
  return (
    <Card className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1060px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Application</th><th className="px-4 py-4">Status</th><th className="px-4 py-4">Deadline</th><th className="px-4 py-4">Priority</th><th className="px-4 py-4">Documents</th><th className="px-4 py-4">Updated</th><th className="px-5 py-4 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">{apps.map((app) => <ApplicationRow key={app.id} app={app} onEdit={onEdit} onDelete={onDelete} onDuplicate={onDuplicate} />)}</tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function ApplicationRow({ app, onEdit, onDelete, onDuplicate }) {
  const info = deadlineInfo(app.deadline);
  return (
    <tr className="hover:bg-slate-50">
      <td className="px-5 py-4 align-top"><div className="flex gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-100"><Icon name={app.type === "University" ? "university" : "job"} /></div><div><p className="font-black">{app.name}</p><p className="mt-0.5 text-slate-600">{app.programRole}</p><p className="mt-1 text-xs text-slate-400">{app.city || "No city"} · {app.applicationType || "No channel"}</p>{app.link && <a href={app.link} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-950"><Icon name="link" className="h-3 w-3" /> Open link</a>}</div></div></td>
      <td className="px-4 py-4 align-top"><Badge tone={statusTone(app.status)}>{app.status}</Badge></td>
      <td className="px-4 py-4 align-top"><Badge tone={info.tone}>{info.label}</Badge><p className="mt-1 text-xs text-slate-400">{formatDate(app.deadline)}</p></td>
      <td className="px-4 py-4 align-top"><Priority priority={app.priority} /></td>
      <td className="max-w-[240px] px-4 py-4 align-top text-slate-600"><span className="line-clamp-2">{app.documents || "—"}</span></td>
      <td className="px-4 py-4 align-top text-slate-500">{formatDate(app.lastUpdated)}</td>
      <td className="px-5 py-4 align-top"><div className="flex justify-end gap-2"><IconButton label="Duplicate" icon="copy" onClick={() => onDuplicate(app)} /><IconButton label="Edit" icon="edit" onClick={() => onEdit(app)} /><IconButton label="Delete" icon="trash" danger onClick={() => onDelete(app.id)} /></div></td>
    </tr>
  );
}

function ApplicationGrid({ apps, onEdit, onDelete, onDuplicate }) {
  if (!apps.length) return <EmptyState />;
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{apps.map((app) => <ApplicationCard key={app.id} app={app} onEdit={onEdit} onDelete={onDelete} onDuplicate={onDuplicate} />)}</div>;
}

function ApplicationCard({ app, onEdit, onDelete, onDuplicate }) {
  const info = deadlineInfo(app.deadline);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="h-full rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <CardContent className="flex h-full flex-col p-5">
          <div className="mb-4 flex items-start justify-between"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100"><Icon name={app.type === "University" ? "university" : "job"} /></div><Badge tone={info.tone}>{info.label}</Badge></div>
          <p className="text-lg font-black leading-tight">{app.name}</p><p className="mt-1 text-sm font-semibold text-slate-600">{app.programRole}</p>
          <div className="mt-4 flex flex-wrap gap-2"><Badge tone={statusTone(app.status)}>{app.status}</Badge><Priority priority={app.priority} /></div>
          <div className="mt-4 grid grid-cols-2 gap-2"><Info label="City" value={app.city || "—"} /><Info label="Deadline" value={formatDate(app.deadline)} /></div>
          {app.notes && <p className="mt-4 line-clamp-3 rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">{app.notes}</p>}
          <div className="mt-auto flex gap-2 pt-5">{app.link && <a className="flex-1" href={app.link} target="_blank" rel="noreferrer"><Button variant="outline" className="w-full rounded-2xl bg-white"><Icon name="link" className="mr-2" /> Link</Button></a>}<Button variant="outline" className="rounded-2xl bg-white" onClick={() => onDuplicate(app)}><Icon name="copy" /></Button><Button className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800" onClick={() => onEdit(app)}><Icon name="edit" /></Button><Button variant="outline" className="rounded-2xl bg-white text-rose-600" onClick={() => onDelete(app.id)}><Icon name="trash" /></Button></div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ApplicationDrawer({ form, editingId, onChange, onSave, onClose }) {
  return (
    <motion.div className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 250 }} className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 p-6"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">{editingId ? "Edit record" : "New record"}</p><h2 className="mt-1 text-2xl font-black">{editingId ? "Update application" : "Add application"}</h2><p className="mt-1 text-sm text-slate-500">Fill only what you know now. You can update everything later.</p></div><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-50"><Icon name="close" /></button></div>
        <div className="flex-1 overflow-y-auto p-6"><div className="grid gap-4 sm:grid-cols-2"><Field label="Type"><Select value={form.type} onChange={(e) => onChange("type", e.target.value)} options={TYPES} /></Field><Field label="Status"><Select value={form.status} onChange={(e) => onChange("status", e.target.value)} options={STATUSES} /></Field><Field label="Priority"><Select value={form.priority} onChange={(e) => onChange("priority", e.target.value)} options={PRIORITIES} /></Field><Field label="Application channel"><Input value={form.applicationType} onChange={(e) => onChange("applicationType", e.target.value)} placeholder="Direct, uni-assist, referral" /></Field><Field label={form.type === "University" ? "University" : "Company"} required><Input value={form.name} onChange={(e) => onChange("name", e.target.value)} placeholder="e.g., Saarland University" /></Field><Field label={form.type === "University" ? "Course / Program" : "Job title"} required><Input value={form.programRole} onChange={(e) => onChange("programRole", e.target.value)} placeholder="e.g., Computer Science M.Sc." /></Field><Field label="City"><Input value={form.city} onChange={(e) => onChange("city", e.target.value)} placeholder="e.g., Stuttgart" /></Field><Field label="Portal / job link"><Input value={form.link} onChange={(e) => onChange("link", e.target.value)} placeholder="https://..." /></Field><Field label="Opening date"><Input type="date" value={form.openingDate} onChange={(e) => onChange("openingDate", e.target.value)} /></Field><Field label="Deadline"><Input type="date" value={form.deadline} onChange={(e) => onChange("deadline", e.target.value)} /></Field><Field label="Required documents" wide><Textarea value={form.documents} onChange={(e) => onChange("documents", e.target.value)} placeholder="CV, transcript, module handbook, cover letter" /></Field><Field label="Notes / next action" wide><Textarea value={form.notes} onChange={(e) => onChange("notes", e.target.value)} placeholder="What is missing? What should you do next?" /></Field></div></div>
        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 p-5"><Button variant="outline" onClick={onClose} className="rounded-2xl bg-white">Cancel</Button><Button onClick={onSave} className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"><Icon name={editingId ? "edit" : "plus"} className="mr-2" /> {editingId ? "Save changes" : "Create application"}</Button></div>
      </motion.aside>
    </motion.div>
  );
}

function EmptyState() {
  return <Card className="rounded-[2rem] border border-dashed border-slate-300 bg-white"><CardContent className="grid place-items-center p-12 text-center"><div className="grid h-14 w-14 place-items-center rounded-3xl bg-slate-100 text-slate-500"><Icon name="search" className="h-6 w-6" /></div><h3 className="mt-4 text-lg font-black">No applications found</h3><p className="mt-2 max-w-md text-sm leading-6 text-slate-500">Clear filters or add a new application to start tracking.</p></CardContent></Card>;
}

function statusTone(status) {
  const map = { Accepted: "success", Rejected: "danger", "Awaiting Response": "blue", Applying: "violet", Submitted: "blue", Interview: "violet", Open: "success", "Not Open Yet": "neutral", Deferred: "notice" };
  return map[status] || "neutral";
}

function badgeClass(tone) {
  const map = { success: "border-emerald-200 bg-emerald-50 text-emerald-700", danger: "border-rose-200 bg-rose-50 text-rose-700", warning: "border-orange-200 bg-orange-50 text-orange-700", notice: "border-amber-200 bg-amber-50 text-amber-700", neutral: "border-slate-200 bg-slate-50 text-slate-700", blue: "border-blue-200 bg-blue-50 text-blue-700", violet: "border-violet-200 bg-violet-50 text-violet-700", dark: "border-white/10 bg-white/10 text-white" };
  return map[tone] || map.neutral;
}

function Badge({ children, tone = "neutral" }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${badgeClass(tone)}`}>{children}</span>;
}

function Priority({ priority }) {
  const tone = priority === "High" ? "danger" : priority === "Medium" ? "notice" : "neutral";
  return <Badge tone={tone}>{priority}</Badge>;
}

function IconButton({ icon, label, onClick, danger = false }) {
  const dangerClass = danger ? "text-rose-600 hover:border-rose-200 hover:bg-rose-50" : "text-slate-600 hover:text-slate-950 hover:bg-slate-50";
  return <button type="button" title={label} onClick={onClick} className={`grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white transition ${dangerClass}`}><Icon name={icon} /></button>;
}

function Toggle({ active, children, onClick }) {
  return <button type="button" onClick={onClick} className={`rounded-xl px-3 py-1.5 text-xs font-bold ${active ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>{children}</button>;
}

function Field({ label, children, required = false, wide = false }) {
  return <label className={`grid gap-1.5 text-sm font-bold text-slate-700 ${wide ? "sm:col-span-2" : ""}`}><span>{label}{required && <span className="text-rose-500"> *</span>}</span>{children}</label>;
}

function Input({ className = "", ...props }) {
  return <input {...props} className={`h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 ${className}`} />;
}

function Textarea({ className = "", ...props }) {
  return <textarea {...props} rows={4} className={`resize-none rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 ${className}`} />;
}

function Select({ options, ...props }) {
  const normalized = options.map((option) => (typeof option === "string" ? { label: option, value: option } : option));
  return <select {...props} className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100">{normalized.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>;
}

function Info({ label, value }) {
  return <div className="rounded-2xl bg-slate-50 p-3"><p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 truncate text-sm font-bold text-slate-700">{value}</p></div>;
}

function DarkInfo({ label, value }) {
  return <div className="rounded-2xl bg-white/10 p-3"><p className="text-xs text-slate-100">{label}</p><p className="mt-1 font-bold text-slate-100">{value}</p></div>;
}
