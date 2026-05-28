import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TYPES = ["University", "Job"];
const STATUSES = ["Not Open Yet", "Open", "Applying", "Submitted", "Awaiting Response", "Interview", "Accepted", "Rejected", "Deferred"];
const PRIORITIES = ["High", "Medium", "Low"];
const ACTIONABLE_STATUSES = ["Not Open Yet", "Open", "Applying"];

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
  return [headers.join(","), ...rows.map((row) => headers.map((key) => csvEscape(row[key])).join(","))].join("\n");
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
if (import.meta.env.DEV) runTests();

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
    eye: "M2 12s3.3-7 10-7 10 7 10 7-3.3 7-10 7-10-7-10-7M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
    eyeOff: "M17.9 17.9A10 10 0 0 1 12 20c-7 0-11-8-11-8a18 18 0 0 1 5.1-5.9M9.9 4.2A9 9 0 0 1 12 4c7 0 11 8 11 8a18 18 0 0 1-2.2 3.2m-6.7-1a3 3 0 1 1-4.2-4.2M2 2l20 20",
    mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 0 8 9 8-9",
    share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13",
  };
  return (
    <svg className={`h-4 w-4 ${className}`.trim()} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={icons[name] || icons.dashboard} />
    </svg>
  );
}

function LandingFooter() {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.origin : "https://applybuddy.netlify.app";
  const shareText = "Track all your university and job applications in one place — try ApplyBuddy, it's free!";

  function handleNativeShare() {
    navigator.share({ title: "ApplyBuddy", text: shareText, url }).catch(() => {});
  }

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }).catch(() => {});
  }

  const socials = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + url)}`, hover: "hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700" },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, hover: "hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700" },
    { label: "X / Twitter", href: `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, hover: "hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900" },
  ];

  return (
    <footer className="mt-16 border-t border-slate-200 pt-10 pb-8 text-center">
      <p className="text-sm font-black text-slate-800">Know someone still tracking applications in spreadsheets?</p>
      <p className="mt-1 text-xs text-slate-500">Share ApplyBuddy — free forever, no credit card, no ads.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        {typeof navigator !== "undefined" && !!navigator.share && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
          >
            <Icon name="share" className="h-3.5 w-3.5" />
            Share
          </button>
        )}
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-bold transition ${copied ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"}`}
        >
          <Icon name={copied ? "check" : "copy"} className="h-3.5 w-3.5" />
          {copied ? "Copied!" : "Copy link"}
        </button>
        {socials.map(({ label, href, hover }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition ${hover}`}
          >
            {label}
          </a>
        ))}
      </div>
      <p className="mt-8 text-xs text-slate-400">© {new Date().getFullYear()} ApplyBuddy · Free forever · No credit card required</p>
    </footer>
  );
}

function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-white text-slate-950">

      {/* ── Sticky nav ── */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-600 shadow-sm shadow-emerald-600/30">
              <Icon name="dashboard" className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-black tracking-tight">
              <span className="text-slate-950">Apply</span><span className="text-emerald-600">Buddy</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onGetStarted} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Sign in</button>
            <button type="button" onClick={onGetStarted} className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-500 shadow-sm shadow-emerald-600/25">Get started free</button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] py-24 sm:py-32">
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700">
              Free · No credit card · No ads
            </span>
          </motion.div>

          <motion.h1
            className="mt-6 text-[4.5rem] font-black leading-none tracking-tight sm:text-8xl lg:text-9xl"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
          >
            <span className="text-slate-950">Apply</span><span className="text-emerald-600">Buddy</span>
          </motion.h1>

          <motion.p
            className="mt-5 text-xl font-semibold text-slate-500 sm:text-2xl"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.45 }}
          >
            Your buddy for every application.
          </motion.p>

          <motion.p
            className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-400"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.4 }}
          >
            Track university admissions and job applications in one place. Deadlines, statuses, documents — never scattered again.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }}
          >
            <button type="button" onClick={onGetStarted} className="rounded-2xl bg-emerald-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500">
              Start tracking for free
            </button>
            <button type="button" onClick={onGetStarted} className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Already have an account →
            </button>
          </motion.div>

          {/* Dashboard mockup */}
          <motion.div
            className="mx-auto mt-16 max-w-3xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10"
            initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-rose-300" />
              <div className="h-3 w-3 rounded-full bg-amber-300" />
              <div className="h-3 w-3 rounded-full bg-emerald-300" />
              <div className="mx-auto h-5 w-48 rounded-lg bg-slate-200/80 text-center text-[10px] font-semibold leading-5 text-slate-400">applybuddy.netlify.app</div>
            </div>
            <div className="flex">
              {/* Fake sidebar */}
              <div className="hidden w-40 shrink-0 border-r border-slate-100 bg-white p-3 sm:block">
                <div className="mb-3 flex items-center gap-2 px-2 py-1.5">
                  <div className="h-5 w-5 rounded-lg bg-emerald-600" />
                  <div className="h-2.5 w-16 rounded bg-slate-950" />
                </div>
                {["Dashboard", "Universities", "Jobs", "Urgent"].map((item, i) => (
                  <div key={item} className={`mb-0.5 flex items-center gap-2 rounded-xl px-2 py-1.5 ${i === 0 ? "bg-slate-100" : ""}`}>
                    <div className={`h-3 w-3 rounded-md ${i === 0 ? "bg-slate-400" : "bg-slate-200"}`} />
                    <span className="text-[10px] font-semibold text-slate-500">{item}</span>
                  </div>
                ))}
              </div>
              {/* Fake main */}
              <div className="flex-1 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="h-2 w-12 rounded bg-slate-200" />
                    <div className="mt-1 h-4 w-24 rounded bg-slate-950" />
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-7 w-20 rounded-xl bg-slate-950" />
                    <div className="h-7 w-16 rounded-xl border border-slate-200" />
                  </div>
                </div>
                <div className="mb-3 grid grid-cols-5 gap-2">
                  {[["12", "slate"], ["8", "blue"], ["4", "violet"], ["3", "rose"], ["5", "emerald"]].map(([v, c], i) => (
                    <div key={i} className={`rounded-xl bg-${c}-50 p-2`}>
                      <div className="mb-1 h-1.5 w-8 rounded bg-slate-200" />
                      <span className={`text-sm font-black text-${c}-${c === "slate" ? "800" : "600"}`}>{v}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  {[
                    ["TU Munich", "M.Sc. CS", "7d left", "amber"],
                    ["Saarland Uni", "M.Sc. AI", "14d left", "orange"],
                    ["BMW Group", "Working Student", "Applying", "blue"],
                    ["TU Berlin", "M.Sc. Data Sci", "32d left", "emerald"],
                  ].map(([name, role, tag, c]) => (
                    <div key={name} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5">
                      <div>
                        <p className="text-[11px] font-bold">{name}</p>
                        <p className="text-[9px] text-slate-400">{role}</p>
                      </div>
                      <span className={`rounded-full bg-${c}-50 px-2 py-0.5 text-[9px] font-bold text-${c}-700`}>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scroll cue */}
          <motion.div className="mt-12 flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}>
              <svg className="h-5 w-5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div className="text-center" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">Sound familiar?</p>
            <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Tracking applications<br />shouldn't be this hard.
            </h2>
          </motion.div>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              { icon: "close",  title: "Deadlines buried in emails",  desc: "By the time you find the portal link, the application window has already closed." },
              { icon: "copy",   title: "Spreadsheets that fall apart", desc: "Formulas break, rows get duplicated, columns drift. Nothing stays in sync." },
              { icon: "search", title: "No idea where you stand",      desc: "Did you submit that one? What's still missing? You genuinely can't tell." },
            ].map((item, i) => (
              <motion.div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-6" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: i * 0.1, duration: 0.45 }}>
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-2xl bg-white/10">
                  <Icon name={item.icon} className="h-4 w-4 text-slate-300" />
                </div>
                <h3 className="text-base font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div className="text-center" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-black uppercase tracking-widest text-emerald-600">What you get</p>
            <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Everything you need.<br />Nothing you don't.
            </h2>
          </motion.div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "dashboard",  color: "bg-slate-50",   title: "One dashboard",       desc: "All your university and job applications in a single, clean view — no tabs, no switching." },
              { icon: "calendar",   color: "bg-emerald-50", title: "Smart deadlines",      desc: "Only apps still open count as urgent. Submitted or accepted? They drop off the clock." },
              { icon: "university", color: "bg-blue-50",    title: "Full pipeline",        desc: "From Not Open Yet to Accepted — every stage tracked, every status visible at a glance." },
              { icon: "check",      color: "bg-slate-50",   title: "Private by design",    desc: "Row-level security via Supabase. Your applications are only ever visible to you." },
            ].map((item, i) => (
              <motion.div key={item.title} className={`rounded-3xl ${item.color} p-6`} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: i * 0.08, duration: 0.45 }}>
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-2xl bg-white shadow-sm">
                  <Icon name={item.icon} className="h-4 w-4 text-slate-700" />
                </div>
                <h3 className="text-base font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div className="text-center" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Three steps</p>
            <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Up and running<br />in 60 seconds.
            </h2>
          </motion.div>
          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {[
              { step: "01", icon: "plus",      title: "Add your applications",        desc: "University or job — fill in what you know. Each entry takes 30 seconds. Update anything later." },
              { step: "02", icon: "calendar",  title: "Track every deadline",         desc: "Upcoming deadlines sort themselves by urgency. Overdue ones surface immediately." },
              { step: "03", icon: "dashboard", title: "Stay ahead of the pipeline",   desc: "Update statuses as you progress. See the full picture — what's open, applied, submitted, done." },
            ].map((item, i) => (
              <motion.div key={item.step} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: i * 0.12, duration: 0.45 }}>
                <div className="mb-4 flex items-start gap-3">
                  <span className="text-5xl font-black leading-none text-slate-100">{item.step}</span>
                  <div className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-50">
                    <Icon name={item.icon} className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>
                <h3 className="text-base font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            className="rounded-[2.5rem] bg-slate-950 px-8 py-16 text-center text-white sm:px-16"
            initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }}
          >
            <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-300">
              Free forever · No credit card
            </span>
            <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Take control of<br />your applications.
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-slate-400">
              A clean dashboard that keeps you ahead — from first deadline to final decision.
            </p>
            <motion.button
              type="button"
              onClick={onGetStarted}
              className="mt-8 rounded-2xl bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-500"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              Create your free account →
            </motion.button>
          </motion.div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

function mapAuthError(error) {
  const msg = (error?.message || "").toLowerCase();
  if (msg.includes("invalid login credentials") || msg.includes("invalid credentials")) return "Incorrect email or password. Please try again.";
  if (msg.includes("email not confirmed")) return "Please confirm your email first — check your inbox for the confirmation link.";
  if (msg.includes("already registered") || msg.includes("user already registered")) return "An account with this email already exists.";
  if (msg.includes("password") && (msg.includes("6") || msg.includes("characters") || msg.includes("weak") || msg.includes("short"))) return "Password must be at least 6 characters long.";
  if (msg.includes("invalid email") || msg.includes("unable to validate")) return "Enter a valid email address.";
  if (msg.includes("rate limit") || msg.includes("too many requests") || msg.includes("over_email_send_rate_limit")) return "Too many attempts — please wait a minute and try again.";
  if (msg.includes("network") || msg.includes("failed to fetch") || msg.includes("load failed")) return "Connection error — check your internet and try again.";
  if (msg.includes("signup is disabled") || msg.includes("signups not allowed")) return "New sign-ups are currently disabled. Contact the administrator.";
  return error?.message || "Something went wrong. Please try again.";
}

export default function ApplicationTrackerWebsite() {
  const [applications, setApplications] = useState([]);
  const [session, setSession] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [signupSent, setSignupSent] = useState(false);
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
  const exportMenuRef = useRef(null);

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
      setApplications([]); // eslint-disable-line react-hooks/set-state-in-effect
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
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
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

  function validateAuth() {
    const errors = { email: "", password: "" };
    if (!authEmail.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) errors.email = "Enter a valid email address.";
    if (!authPassword) errors.password = "Password is required.";
    else if (authMode === "signup" && authPassword.length < 6) errors.password = "Password must be at least 6 characters.";
    setFieldErrors(errors);
    return !errors.email && !errors.password;
  }

  function switchAuthMode(mode) {
    setAuthMode(mode);
    setAuthError("");
    setFieldErrors({ email: "", password: "" });
    setSignupSent(false);
  }

  function handleAuthSubmit() {
    if (authLoading) return;
    if (authMode === "signin") signIn();
    else signUp();
  }

  async function signIn() {
    if (!validateAuth()) return;
    setAuthError("");
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    setAuthLoading(false);
    if (error) {
      setAuthError(mapAuthError(error));
      return;
    }
    setToast("Signed in successfully.");
  }

  async function signUp() {
    if (!validateAuth()) return;
    setAuthError("");
    setAuthLoading(true);
    const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
    setAuthLoading(false);
    if (error) {
      const mapped = mapAuthError(error);
      setAuthError(mapped);
      return;
    }
    setSignupSent(true);
  }

  function notify(msg, kind = "success") {
    setToast(msg);
    setToastKind(kind);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setApplications([]);
    setSession(null);
    notify("Signed out.", "info");
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
      if (error) {
        notify(error.message, "error");
        return;
      }
      setApplications((old) => old.map((app) => (app.id === editingId ? normalize({ ...app, ...payload }) : app)));
      notify("Application updated.");
    } else {
      const newApp = { id: makeId(), ...payload };
      const { error } = await supabase.from("applications").insert([newApp]);
      if (error) {
        notify(error.message, "error");
        return;
      }
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
    if (!session?.user) {
      notify("Please sign in to delete applications.", "error");
      return;
    }

    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);
    if (error) {
      notify(error.message, "error");
      return;
    }
    setApplications((old) => old.filter((entry) => entry.id !== id));
    notify("Application deleted.");
  }

  async function duplicateApplication(app) {
    if (!session?.user) {
      notify("Please sign in to duplicate applications.", "error");
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
      notify(error.message, "error");
      return;
    }
    setApplications((old) => [normalize(newApp), ...old]);
    notify("Application duplicated.");
  }

  async function resetSampleData() {
    if (!session?.user) {
      notify("Please sign in to reset sample data.", "error");
      return;
    }
    const ok = typeof window === "undefined" ? true : window.confirm("Replace current data with sample data?");
    if (!ok) return;

    setLoading(true);
    const userId = session.user.id;
    const items = SAMPLE_DATA.map((app) => ({ ...app, id: makeId(), lastUpdated: todayIso(), user_id: userId }));
    const { error: deleteError } = await supabase.from("applications").delete().eq("user_id", userId);
    if (deleteError) {
      notify(deleteError.message, "error");
      setLoading(false);
      return;
    }
    const { error: insertError } = await supabase.from("applications").insert(items);
    setLoading(false);
    if (insertError) {
      notify(insertError.message, "error");
      return;
    }
    setApplications(items.map(normalize));
    notify("Sample data restored.");
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
      notify("Please sign in to import data.", "error");
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
        notify("Backup imported.");
      } catch {
        notify("Could not import this JSON file.", "error");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  if (!session && !showAuth) return <LandingPage onGetStarted={() => setShowAuth(true)} />;

  if (!session) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-12 sm:px-6 lg:px-8">
        <motion.button
          type="button"
          onClick={() => setShowAuth(false)}
          className="mb-6 flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-400 transition hover:text-slate-700"
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          Back to home
        </motion.button>
        <div className="my-auto grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

          {/* ── Left hero ── */}
          <motion.div className="space-y-8" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: "easeOut" }}>

            {/* Giant brand wordmark */}
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.45 }}>
              <h1 className="text-[4rem] font-black leading-none tracking-tight sm:text-7xl lg:text-[5rem]">
                <span className="text-slate-950">Apply</span><span className="text-emerald-600">Buddy</span>
              </h1>
              <p className="mt-3 text-base font-semibold text-slate-500 sm:text-lg">Your buddy for every application.</p>
            </motion.div>

            <div className="space-y-4">
              <motion.span
                className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700"
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.3 }}
              >
                Free · No credit card
              </motion.span>
              <motion.p
                className="max-w-md text-base leading-7 text-slate-500"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.35 }}
              >
                One dashboard for all your university and job applications. Deadlines, statuses, documents — always in one place.
              </motion.p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: "Private & secure", desc: "Your data is isolated per account in Supabase.", icon: "check" },
                { title: "Deadline alerts", desc: "Spot overdue and urgent applications at a glance.", icon: "calendar" },
                { title: "Full pipeline view", desc: "Track every stage from open to accepted.", icon: "dashboard" },
                { title: "Export anytime", desc: "Download your data as CSV or JSON backup.", icon: "download" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.07, duration: 0.35 }}
                >
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Icon name={item.icon} className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Right form card ── */}
          <motion.div
            className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/70"
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
          >
            <AnimatePresence mode="wait">
              {signupSent ? (
                /* ── Email confirmation success screen ── */
                <motion.div key="signup-sent" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.25 }} className="py-2 text-center">
                  <motion.div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-emerald-50" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}>
                    <Icon name="mail" className="h-7 w-7 text-emerald-600" />
                  </motion.div>
                  <h2 className="text-2xl font-black text-slate-950">Check your inbox</h2>
                  <p className="mt-2 text-sm text-slate-500">We sent a confirmation link to</p>
                  <p className="mt-1 break-all font-bold text-slate-800">{authEmail}</p>
                  <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-slate-500">
                    Click the link in your email to activate your account, then return here to sign in.
                  </p>
                  <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left">
                    <p className="text-xs font-semibold text-amber-700">Not in your inbox? Check your spam folder. The email may take a minute to arrive.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => switchAuthMode("signin")}
                    className="mt-6 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-500"
                  >
                    Back to sign in
                  </button>
                </motion.div>
              ) : (
                /* ── Sign in / Sign up form ── */
                <motion.div key="auth-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

                  {/* Sliding tab switcher */}
                  <div className="mb-8 flex rounded-2xl bg-slate-100 p-1">
                    {[{ id: "signin", label: "Sign in" }, { id: "signup", label: "Sign up" }].map(({ id, label }) => (
                      <button key={id} type="button" onClick={() => switchAuthMode(id)} className="relative flex-1 rounded-xl py-2.5 text-sm font-bold">
                        {authMode === id && (
                          <motion.span layoutId="auth-tab-pill" className="absolute inset-0 rounded-xl bg-white shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 35 }} />
                        )}
                        <span className={`relative z-10 transition-colors ${authMode === id ? "text-slate-950" : "text-slate-400"}`}>{label}</span>
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div key={authMode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
                      <div className="mb-6">
                        <h2 className="text-2xl font-black text-slate-950">{authMode === "signin" ? "Welcome back" : "Create your account"}</h2>
                        <p className="mt-1 text-sm text-slate-500">{authMode === "signin" ? "Sign in to access your applications." : "Start tracking for free — takes 30 seconds."}</p>
                      </div>

                      <div className="space-y-4">
                        {/* Email field */}
                        <div className="grid gap-1.5">
                          <label className="text-sm font-bold text-slate-700">Email address</label>
                          <input
                            value={authEmail}
                            onChange={(e) => { setAuthEmail(e.target.value); setFieldErrors((f) => ({ ...f, email: "" })); setAuthError(""); }}
                            onKeyDown={(e) => { if (e.key === "Enter") handleAuthSubmit(); }}
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            className={`h-12 rounded-2xl border bg-slate-50 px-4 text-sm outline-none transition-all duration-150 focus:bg-white focus:ring-4 ${fieldErrors.email ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100" : "border-slate-200 focus:border-emerald-300 focus:ring-emerald-50"}`}
                          />
                          <AnimatePresence>
                            {fieldErrors.email && (
                              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }} className="flex items-center gap-1.5 text-xs font-semibold text-rose-600">
                                <Icon name="close" className="h-3 w-3 shrink-0" />{fieldErrors.email}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Password field */}
                        <div className="grid gap-1.5">
                          <label className="text-sm font-bold text-slate-700">Password</label>
                          <div className="relative">
                            <input
                              value={authPassword}
                              onChange={(e) => { setAuthPassword(e.target.value); setFieldErrors((f) => ({ ...f, password: "" })); setAuthError(""); }}
                              onKeyDown={(e) => { if (e.key === "Enter") handleAuthSubmit(); }}
                              type={showPassword ? "text" : "password"}
                              placeholder={authMode === "signup" ? "Min. 6 characters" : "Enter your password"}
                              autoComplete={authMode === "signup" ? "new-password" : "current-password"}
                              className={`h-12 w-full rounded-2xl border bg-slate-50 px-4 pr-12 text-sm outline-none transition-all duration-150 focus:bg-white focus:ring-4 ${fieldErrors.password ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100" : "border-slate-200 focus:border-emerald-300 focus:ring-emerald-50"}`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((s) => !s)}
                              className="absolute right-3.5 top-3.5 text-slate-400 transition hover:text-slate-600"
                              tabIndex={-1}
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              <Icon name={showPassword ? "eyeOff" : "eye"} className="h-4 w-4" />
                            </button>
                          </div>
                          <AnimatePresence>
                            {fieldErrors.password && (
                              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }} className="flex items-center gap-1.5 text-xs font-semibold text-rose-600">
                                <Icon name="close" className="h-3 w-3 shrink-0" />{fieldErrors.password}
                              </motion.p>
                            )}
                          </AnimatePresence>
                          {authMode === "signup" && authPassword.length > 0 && !fieldErrors.password && (
                            <PasswordStrength password={authPassword} />
                          )}
                        </div>

                        {/* General auth error */}
                        <AnimatePresence>
                          {authError && (
                            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                              <Icon name="close" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                              <div>
                                <p className="text-sm font-semibold text-rose-700">{authError}</p>
                                {authError.includes("already exists") && (
                                  <button type="button" onClick={() => switchAuthMode("signin")} className="mt-1 text-xs font-bold text-rose-600 underline underline-offset-2 hover:no-underline">
                                    Sign in instead →
                                  </button>
                                )}
                                {authError.includes("confirm your email") && (
                                  <p className="mt-1 text-xs text-rose-500">Check your spam folder if you can't find it.</p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Submit button */}
                        <Button
                          onClick={handleAuthSubmit}
                          disabled={authLoading}
                          className="h-12 w-full rounded-2xl bg-emerald-600 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-60"
                        >
                          {authLoading ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" />
                              </svg>
                              {authMode === "signin" ? "Signing in…" : "Creating account…"}
                            </span>
                          ) : authMode === "signin" ? "Sign in to account" : "Create free account"}
                        </Button>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-emerald-100">
                        <Icon name="check" className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-emerald-900">Your data stays private</p>
                        <p className="mt-1 text-xs leading-5 text-emerald-700/70">Each account is isolated in Supabase. Your applications are only visible to you.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>

        <LandingFooter />
      </div>
    </div>
  );

  const VIEW_META = {
    dashboard:    { title: "Dashboard",    sub: "Overview" },
    universities: { title: "Universities", sub: "Applications" },
    jobs:         { title: "Jobs",         sub: "Applications" },
    urgent:       { title: "Urgent",       sub: "Action needed" },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">

        {/* ── Sidebar ── */}
        <aside className="max-md:hidden md:flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-4 py-4">
            <Brand />
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <p className="mb-1.5 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Menu</p>
            <nav className="space-y-0.5">
              <NavItem active={sidebarView === "dashboard"} onClick={() => handleSidebarView("dashboard")} icon="dashboard" label="Dashboard" />
              <NavItem active={sidebarView === "universities"} onClick={() => handleSidebarView("universities")} icon="university" label="Universities" count={stats.universities} />
              <NavItem active={sidebarView === "jobs"} onClick={() => handleSidebarView("jobs")} icon="job" label="Jobs" count={stats.jobs} />
              <NavItem active={sidebarView === "urgent"} onClick={() => handleSidebarView("urgent")} icon="calendar" label="Urgent" count={stats.urgent + stats.overdue} alert={stats.urgent + stats.overdue > 0} />
            </nav>

            <div className="mt-6 px-1">
              <p className="mb-3 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Progress</p>
              <ProgressCard progress={stats.progress} submitted={stats.submitted} total={stats.total} />
            </div>
          </div>

          <div className="border-t border-slate-100 px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-950 text-xs font-black text-white">
                {session?.user?.email?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-700">{session?.user?.email}</p>
                <p className="text-[10px] text-slate-400">Signed in</p>
              </div>
              <button onClick={signOut} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-50">
                Out
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="min-w-0 flex-1">

          {/* Header */}
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <AnimatePresence mode="wait">
                <motion.div key={sidebarView} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.15 }}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{VIEW_META[sidebarView]?.sub}</p>
                  <h1 className="text-xl font-black leading-tight">{VIEW_META[sidebarView]?.title}</h1>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => openNew(sidebarView === "jobs" ? "Job" : "University")}
                  className="rounded-xl bg-slate-950 text-white hover:bg-slate-800 h-9 px-3.5 text-sm"
                >
                  <Icon name="plus" className="mr-1.5" />
                  <span className="hidden sm:inline">Add application</span>
                  <span className="sm:hidden">Add</span>
                </Button>

                <div ref={exportMenuRef} className="relative">
                  <button
                    onClick={() => setExportMenuOpen((v) => !v)}
                    className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    <Icon name="download" className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Export</span>
                    <svg className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <AnimatePresence>
                    {exportMenuOpen && (
                      <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.15 }} className="absolute right-0 top-full z-50 mt-1.5 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-200/80">
                        <button onClick={() => { downloadFile("applications.csv", toCsv(applications), "text/csv"); setExportMenuOpen(false); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                          <Icon name="download" className="h-3.5 w-3.5 text-slate-400" /> Export CSV
                        </button>
                        <button onClick={() => { downloadFile("applications-backup.json", JSON.stringify(applications, null, 2), "application/json"); setExportMenuOpen(false); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                          <Icon name="download" className="h-3.5 w-3.5 text-slate-400" /> Download backup
                        </button>
                        <div className="mx-3 my-1 border-t border-slate-100" />
                        <label className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                          <Icon name="upload" className="h-3.5 w-3.5 text-slate-400" /> Import backup
                          <input type="file" accept="application/json" className="hidden" onChange={(e) => { importJson(e); setExportMenuOpen(false); }} />
                        </label>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div key={sidebarView} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>

                {sidebarView === "dashboard" && (
                  <>
                    {loading && applications.length === 0 ? (
                      <div className="flex items-center justify-center py-20">
                        <svg className="h-6 w-6 animate-spin text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" /></svg>
                        <span className="ml-3 text-sm text-slate-400">Loading your applications…</span>
                      </div>
                    ) : applications.length === 0 ? (
                      <EmptyDashboard onAdd={() => openNew()} />
                    ) : (
                      <>
                        <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                          <Metric icon="dashboard" label="Total"            value={stats.total}                       hint="All tracked entries"             accent="slate"   delay={0}    />
                          <Metric icon="university" label="Universities"    value={stats.universities}                hint="Master's applications"           accent="blue"    delay={0.05} />
                          <Metric icon="job"        label="Jobs"            value={stats.jobs}                        hint="Work applications"               accent="violet"  delay={0.1}  />
                          <Metric icon="calendar"   label="Needs attention" value={stats.urgent + stats.overdue}     hint={stats.urgent + stats.overdue === 0 ? "All deadlines on track" : `${stats.overdue} overdue · ${stats.urgent} due soon`} danger={stats.urgent + stats.overdue > 0} delay={0.15} />
                          <Metric icon="check"      label="Submitted +"     value={stats.submitted}                  hint={stats.accepted > 0 || stats.interviews > 0 ? `${stats.accepted} accepted · ${stats.interviews} interviews` : "Submitted or further"} accent="emerald" delay={0.2}  />
                        </div>
                        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
                          <PipelineCard pipeline={pipeline} total={stats.total} onReset={resetSampleData} />
                          <UpcomingDeadlinesCard apps={topDeadlines} />
                        </div>
                      </>
                    )}
                  </>
                )}

                {sidebarView !== "dashboard" && (
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
                      <ApplicationTable apps={filtered} onEdit={openEdit} onDelete={deleteApplication} onDuplicate={duplicateApplication} />
                    ) : (
                      <ApplicationGrid apps={filtered} onEdit={openEdit} onDelete={deleteApplication} onDuplicate={duplicateApplication} />
                    )}
                  </>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          <LandingFooter />
        </main>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <ApplicationDrawer
            form={form}
            editingId={editingId}
            onChange={(field, value) => setForm((old) => ({ ...old, [field]: value }))}
            onSave={saveApplication}
            onClose={() => { setDrawerOpen(false); setEditingId(null); setForm(EMPTY_FORM); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`fixed bottom-5 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-2xl ${
              toastKind === "error" ? "border-rose-200 bg-rose-50 text-rose-800" :
              toastKind === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" :
              "border-slate-200 bg-white text-slate-700"
            }`}
          >
            <div className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${toastKind === "error" ? "bg-rose-200 text-rose-700" : toastKind === "success" ? "bg-emerald-200 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
              <Icon name={toastKind === "error" ? "close" : "check"} className="h-3 w-3" />
            </div>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-white shadow-sm">
        <Icon name="dashboard" className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-black leading-tight">ApplyBuddy</p>
        <p className="text-[10px] text-slate-400">Your application buddy</p>
      </div>
    </div>
  );
}

function NavItem({ icon, label, count, active = false, alert = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
        active ? "bg-slate-950 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span className="flex items-center gap-2.5">
        <Icon name={icon} className={active ? "text-white" : "text-slate-400 group-hover:text-slate-600"} />
        {label}
      </span>
      {typeof count === "number" && count > 0 && (
        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
          active ? "bg-white/20 text-white" : alert ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500"
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

function ProgressCard({ progress, submitted, total }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-600">Submission progress</span>
        <span className="text-xs font-black text-slate-900">{progress}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
        <motion.div
          className="h-full rounded-full bg-slate-950"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        />
      </div>
      <p className="mt-2.5 text-[10px] leading-4 text-slate-400">
        {submitted} of {total} reached submitted or further.
      </p>
    </div>
  );
}

const ACCENT = {
  slate:   { icon: "bg-slate-100 text-slate-600",   ring: "ring-slate-200" },
  blue:    { icon: "bg-blue-50 text-blue-600",       ring: "ring-blue-100" },
  violet:  { icon: "bg-violet-50 text-violet-600",   ring: "ring-violet-100" },
  emerald: { icon: "bg-emerald-50 text-emerald-600", ring: "ring-emerald-100" },
  rose:    { icon: "bg-rose-50 text-rose-600",       ring: "ring-rose-100" },
};

function Metric({ icon, label, value, hint, accent = "slate", danger = false, delay = 0 }) {
  const a = ACCENT[danger ? "rose" : accent] || ACCENT.slate;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}>
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          <div className="mb-4 flex items-start justify-between">
            <div className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${a.icon} ${a.ring}`}>
              <Icon name={icon} />
            </div>
            {danger && value > 0 && (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-rose-600">
                Urgent
              </span>
            )}
          </div>
          <p className="text-3xl font-black tabular-nums leading-none">{value}</p>
          <p className="mt-1.5 text-sm font-bold text-slate-700">{label}</p>
          <p className="mt-0.5 text-xs text-slate-400">{hint}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const STATUS_COLOR = {
  "Not Open Yet":      "bg-slate-300",
  "Open":              "bg-sky-400",
  "Applying":          "bg-violet-500",
  "Submitted":         "bg-emerald-500",
  "Awaiting Response": "bg-amber-400",
  "Interview":         "bg-orange-500",
  "Accepted":          "bg-emerald-500",
  "Rejected":          "bg-rose-400",
  "Deferred":          "bg-slate-400",
};

function PipelineCard({ pipeline, total, onReset }) {
  const rows = STATUSES.map((status) => ({
    status,
    count: pipeline.find((p) => p.status === status)?.count || 0,
    color: STATUS_COLOR[status] || "bg-slate-300",
  }));

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-5">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-black">Application Pipeline</h2>
            <p className="mt-0.5 text-xs text-slate-400">{total} total · status breakdown</p>
          </div>
          <button onClick={onReset} className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
            <Icon name="reset" className="h-3.5 w-3.5" /> Reset data
          </button>
        </div>

        {total === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">No applications yet.</p>
        ) : (
          <div className="space-y-2.5">
            {rows.map(({ status, count, color }, i) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={status} className="flex items-center gap-3">
                  <div className="w-36 shrink-0 truncate text-xs font-semibold text-slate-500">{status}</div>
                  <div className="flex-1 overflow-hidden rounded-full bg-slate-100 h-2">
                    <motion.div
                      className={`h-full rounded-full ${color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 + i * 0.04 }}
                    />
                  </div>
                  <div className="w-16 shrink-0 text-right text-xs">
                    <span className="font-black text-slate-800">{count}</span>
                    {pct > 0 && <span className="ml-1 text-slate-400">{pct}%</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function UpcomingDeadlinesCard({ apps }) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-slate-950 text-white shadow-sm">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/10">
            <Icon name="calendar" className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-black">Upcoming Deadlines</h2>
            <p className="text-[10px] text-slate-400">Sorted by urgency</p>
          </div>
        </div>

        {apps.length === 0 ? (
          <p className="py-4 text-sm text-slate-400">No deadlines set yet. Add applications with deadlines to see them here.</p>
        ) : (
          <div className="space-y-2.5">
            {apps.map((app, i) => {
              const info = deadlineInfo(app.deadline);
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.25 }}
                  className="rounded-xl bg-white/10 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 truncate text-sm font-bold leading-tight">{app.name}</p>
                    <Badge tone="dark">{info.label}</Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-400">{app.programRole}</p>
                  <p className="mt-1.5 text-[10px] text-slate-500">{formatDate(app.deadline)}</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyDashboard({ onAdd }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="py-16 text-center">
      <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <Icon name="dashboard" className="h-9 w-9 text-slate-300" />
      </div>
      <h2 className="text-2xl font-black">Nothing tracked yet</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
        Add your first application to start building your pipeline, tracking deadlines, and measuring progress.
      </p>
      <div className="mt-7">
        <button onClick={onAdd} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800">
          <Icon name="plus" className="h-4 w-4" /> Add application
        </button>
      </div>
    </motion.div>
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

function DrawerSection({ label, children }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <p className="shrink-0 text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <div className="flex-1 border-t border-slate-100" />
      </div>
      {children}
    </div>
  );
}

function ApplicationDrawer({ form, editingId, onChange, onSave, onClose }) {
  const isUni = form.type === "University";
  return (
    <motion.div className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 250 }} className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">{editingId ? "Edit record" : "New record"}</p>
            <h2 className="mt-1 text-2xl font-black">{editingId ? "Update application" : "Add application"}</h2>
            <p className="mt-1 text-sm text-slate-500">Fill only what you know now — you can update anything later.</p>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-50"><Icon name="close" /></button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 space-y-7 overflow-y-auto p-6">

          {/* Type pill switcher */}
          <div className="flex rounded-2xl bg-slate-100 p-1">
            {TYPES.map((t) => (
              <button key={t} type="button" onClick={() => onChange("type", t)} className="relative flex-1 rounded-xl py-2.5 text-sm font-bold">
                {form.type === t && (
                  <motion.span layoutId="drawer-type-pill" className="absolute inset-0 rounded-xl bg-white shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 35 }} />
                )}
                <span className={`relative z-10 flex items-center justify-center gap-2 transition-colors ${form.type === t ? "text-slate-950" : "text-slate-400"}`}>
                  <Icon name={t === "University" ? "university" : "job"} className="h-3.5 w-3.5" />
                  {t}
                </span>
              </button>
            ))}
          </div>

          {/* Section: Institution / Company */}
          <DrawerSection label={isUni ? "Institution" : "Company"}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={isUni ? "University name" : "Company name"} required>
                <Input value={form.name} onChange={(e) => onChange("name", e.target.value)} placeholder={isUni ? "e.g., TU Munich, Saarland University" : "e.g., Siemens, BMW, Bosch"} />
              </Field>
              <Field label={isUni ? "Program / Course" : "Role / Job title"} required>
                <Input value={form.programRole} onChange={(e) => onChange("programRole", e.target.value)} placeholder={isUni ? "e.g., M.Sc. Computer Science" : "e.g., Software Engineer Intern"} />
              </Field>
              <Field label={isUni ? "City / Campus" : "Location"}>
                <Input value={form.city} onChange={(e) => onChange("city", e.target.value)} placeholder={isUni ? "e.g., Berlin, Munich, Stuttgart" : "e.g., Stuttgart · Remote · Hybrid"} />
              </Field>
              <Field label={isUni ? "Application portal URL" : "Job listing URL"}>
                <Input value={form.link} onChange={(e) => onChange("link", e.target.value)} placeholder={isUni ? "https://portal.university.de/..." : "https://careers.company.com/..."} />
              </Field>
            </div>
          </DrawerSection>

          {/* Section: Timeline */}
          <DrawerSection label="Timeline">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={isUni ? "Portal opens" : "Date posted"}>
                <Input type="date" value={form.openingDate} onChange={(e) => onChange("openingDate", e.target.value)} />
              </Field>
              <Field label="Application deadline">
                <Input type="date" value={form.deadline} onChange={(e) => onChange("deadline", e.target.value)} />
              </Field>
            </div>
          </DrawerSection>

          {/* Section: Application */}
          <DrawerSection label="Application">
            <div className="grid gap-4">
              <Field label="How to apply">
                <Input value={form.applicationType} onChange={(e) => onChange("applicationType", e.target.value)} placeholder={isUni ? "e.g., uni-assist, direct portal, Hochschulstart, email" : "e.g., LinkedIn, company website, referral, recruiter"} />
              </Field>
              <Field label={isUni ? "Documents required" : "Documents to prepare"}>
                <Textarea value={form.documents} onChange={(e) => onChange("documents", e.target.value)} placeholder={isUni ? "e.g., CV, transcript, module handbook, motivation letter, language certificate (IELTS/TOEFL)" : "e.g., CV, cover letter, portfolio link, references, work samples"} />
              </Field>
            </div>
          </DrawerSection>

          {/* Section: Tracking */}
          <DrawerSection label="Tracking">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Status">
                <Select value={form.status} onChange={(e) => onChange("status", e.target.value)} options={STATUSES} />
              </Field>
              <Field label="Priority">
                <Select value={form.priority} onChange={(e) => onChange("priority", e.target.value)} options={PRIORITIES} />
              </Field>
            </div>
          </DrawerSection>

          {/* Section: Notes */}
          <DrawerSection label="Notes & next action">
            <Textarea value={form.notes} onChange={(e) => onChange("notes", e.target.value)} placeholder={isUni ? "e.g., Check credit transfer requirements, contact admissions about module equivalency" : "e.g., Tailor CV to automotive sector, highlight Python and ML experience"} />
          </DrawerSection>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 p-5">
          <Button variant="outline" onClick={onClose} className="rounded-2xl bg-white">Cancel</Button>
          <Button onClick={onSave} className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800">
            <Icon name={editingId ? "edit" : "plus"} className="mr-2" />
            {editingId ? "Save changes" : "Create application"}
          </Button>
        </div>

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

function PasswordStrength({ password }) {
  if (!password) return null;
  if (password.length < 6) {
    return (
      <div className="space-y-1">
        <div className="h-1 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-[15%] rounded-full bg-rose-400" />
        </div>
        <p className="text-xs font-semibold text-rose-500">Too short — minimum 6 characters</p>
      </div>
    );
  }
  const extras = [/[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password), password.length >= 12].filter(Boolean).length;
  const levels = [
    { label: "Weak", color: "bg-orange-400", text: "text-orange-500", pct: "30%" },
    { label: "Fair", color: "bg-yellow-400", text: "text-yellow-600", pct: "55%" },
    { label: "Good", color: "bg-blue-400", text: "text-blue-500", pct: "75%" },
    { label: "Strong", color: "bg-emerald-400", text: "text-emerald-500", pct: "100%" },
  ];
  const lvl = levels[Math.min(extras, 3)];
  return (
    <div className="space-y-1">
      <div className="h-1 overflow-hidden rounded-full bg-slate-100">
        <motion.div className={`h-full rounded-full ${lvl.color}`} initial={{ width: 0 }} animate={{ width: lvl.pct }} transition={{ duration: 0.35, ease: "easeOut" }} />
      </div>
      <p className={`text-xs font-semibold ${lvl.text}`}>{lvl.label}</p>
    </div>
  );
}
