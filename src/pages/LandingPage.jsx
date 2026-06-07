import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

const applications = [
  { name: "TU Munich", detail: "M.Sc. Computer Science", status: "Deadline soon", tone: "amber" },
  { name: "BMW Group", detail: "Working Student QA", status: "Applied", tone: "blue" },
  { name: "TU Berlin", detail: "M.Sc. Data Science", status: "Documents", tone: "emerald" },
];

const oldSheetRows = [
  ["Name", "Deadline", "Status", "Link"],
  ["TUM", "15 Jun", "?", "mail"],
  ["BMW", "", "applied", "tab 8"],
  ["Berlin", "01 Jul", "todo", "portal"],
  ["Saarland", "?", "notes?", "email"],
];

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

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
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + url)}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { label: "X / Twitter", href: `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}` },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-10 text-center">
      <p className="text-sm font-black text-slate-800">Know someone still managing applications in a spreadsheet?</p>
      <p className="mt-1 text-xs text-slate-500">Share Applume as their structured tracker.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        {typeof navigator !== "undefined" && !!navigator.share && (
          <button type="button" onClick={handleNativeShare} className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100">
            <Icon name="share" className="h-3.5 w-3.5" /> Share
          </button>
        )}
        <button type="button" onClick={handleCopy} className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${copied ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"}`}>
          <Icon name={copied ? "check" : "copy"} className="h-3.5 w-3.5" />
          {copied ? "Copied" : "Copy link"}
        </button>
        {socials.map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
            {label}
          </a>
        ))}
      </div>
      <p className="mt-8 text-xs text-slate-400">
        © {new Date().getFullYear()} Applume · Structured application tracking
        {" · "}
        <a href="/privacy" className="text-slate-400 transition-colors hover:text-slate-600">Privacy Policy</a>
      </p>
    </footer>
  );
}

function HeroScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[62rem] bg-[linear-gradient(to_right,rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.08)_1px,transparent_1px)] bg-[size:72px_48px] opacity-40" />
      <motion.div
        className="absolute left-[7%] top-36 hidden w-60 rotate-[-8deg] border border-slate-200 bg-white/80 p-3 shadow-xl shadow-slate-900/10 backdrop-blur-sm sm:block"
        animate={{ y: [0, -8, 0], rotate: [-8, -6, -8] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="grid grid-cols-3 gap-1 text-[9px] font-bold text-slate-400">
          {["School", "Due", "State", "TUM", "15/6", "???", "BMW", "-", "sent", "Berlin", "1/7", "todo"].map((cell, index) => (
            <span key={`${cell}-${index}`} className="truncate border border-slate-100 bg-slate-50 px-1.5 py-1">{cell}</span>
          ))}
        </div>
      </motion.div>
      <motion.div
        className="absolute right-[8%] top-28 hidden w-64 rotate-[7deg] border border-emerald-100 bg-white/85 p-4 shadow-xl shadow-emerald-900/10 backdrop-blur-sm lg:block"
        animate={{ y: [0, 10, 0], rotate: [7, 5, 7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Application record</p>
        <p className="mt-2 text-sm font-black text-slate-900">TU Munich</p>
        <div className="mt-3 space-y-1.5">
          {["Deadline: 15 Jun", "Documents: 4 of 5", "Portal link saved"].map((line) => (
            <div key={line} className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-800">{line}</div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function WorkspacePreview() {
  return (
    <Reveal className="mx-auto mt-14 max-w-6xl px-4 sm:px-6">
      <div className="overflow-hidden border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          </div>
          <div className="hidden text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 sm:block">Spreadsheet to structured tracker</div>
          <div className="text-[10px] font-semibold text-slate-400">applume.app</div>
        </div>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-slate-200 bg-slate-950 p-5 text-white lg:border-b-0 lg:border-r">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Before</p>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-slate-300">spreadsheet drift</span>
            </div>
            <div className="overflow-hidden border border-white/10">
              {oldSheetRows.map((row, rowIndex) => (
                <div key={row.join("-")} className="grid grid-cols-4 border-b border-white/10 last:border-b-0">
                  {row.map((cell, cellIndex) => (
                    <span
                      key={`${cell}-${cellIndex}`}
                      className={`truncate px-2.5 py-2 text-[11px] ${rowIndex === 0 ? "bg-white/10 font-black text-slate-300" : cell === "?" || cell === "-" || cell === "notes?" ? "bg-rose-500/10 font-semibold text-rose-200" : "text-slate-400"}`}
                    >
                      {cell}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#f7f5ef] p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">After</p>
                <h3 className="mt-1 text-xl font-black text-slate-950">Application records with context</h3>
              </div>
              <button type="button" className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white">Add record</button>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_0.75fr]">
              <div className="space-y-3">
                {applications.map(({ name, detail, status, tone }) => {
                  const toneClass = {
                    amber: "bg-amber-100 text-amber-800",
                    blue: "bg-blue-100 text-blue-800",
                    emerald: "bg-emerald-100 text-emerald-800",
                  }[tone];
                  return (
                    <div key={name} className="border border-slate-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-black text-slate-950">{name}</p>
                          <p className="mt-0.5 text-xs font-semibold text-slate-500">{detail}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ${toneClass}`}>{status}</span>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] font-bold text-slate-500">
                        <span className="bg-slate-50 px-2 py-1.5">Portal</span>
                        <span className="bg-slate-50 px-2 py-1.5">Notes</span>
                        <span className="bg-slate-50 px-2 py-1.5">Files</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3">
                <div className="border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Deadline radar</p>
                  <p className="mt-3 text-3xl font-black text-slate-950">3</p>
                  <p className="text-xs font-semibold text-amber-800/70">open applications need attention this week</p>
                </div>
                <div className="border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Dossier checklist</p>
                  <div className="mt-3 space-y-2">
                    {["CV attached", "Portal link saved", "Module notes added"].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                        <Icon name="check" className="h-3.5 w-3.5 text-emerald-600" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-violet-200 bg-violet-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">AI assist</p>
                  <p className="mt-2 text-xs leading-5 text-violet-900/70">Paste a job post or program page and let Applume draft the record fields.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function FeatureCard({ icon, title, children, tone = "emerald" }) {
  const toneClass = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    violet: "bg-violet-50 text-violet-700 border-violet-100",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  }[tone];

  return (
    <Reveal className={`border bg-white p-6 shadow-sm ${toneClass}`}>
      <div className="mb-5 grid h-11 w-11 place-items-center bg-white/70">
        <Icon name={icon} className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{children}</p>
    </Reveal>
  );
}

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f5ef] text-slate-950">
      <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-[#f7f5ef]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <img src="/Logo.png" alt="Applume" className="h-8 w-8 object-contain" style={{ mixBlendMode: "multiply" }} />
            <span className="text-sm font-black tracking-tight">
              <span className="text-slate-950">App</span><span className="text-emerald-600">lume</span>
            </span>
          </div>
          <div className="hidden items-center gap-7 text-sm font-semibold text-slate-500 sm:flex">
            <a href="#records" className="transition hover:text-slate-950">Records</a>
            <a href="#workflow" className="transition hover:text-slate-950">Workflow</a>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onGetStarted} className="hidden rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white sm:block">
              Sign in
            </button>
            <button type="button" onClick={onGetStarted} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800">
              Start tracking
            </button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28">
        <HeroScene />
        <div className="relative z-10 mx-auto max-w-4xl">
          <motion.span
            className="inline-flex items-center gap-2 border border-emerald-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700 shadow-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Built for spreadsheet escapees
          </motion.span>

          <motion.h1
            className="mx-auto mt-8 max-w-4xl text-[2.75rem] font-black leading-[1.02] tracking-tight sm:text-[4.25rem] lg:text-[5rem]"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            Replace your application spreadsheet with Applume.
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            Track university admissions and job applications in one structured workspace: deadlines, documents, statuses, notes, and next steps.
          </motion.p>

          <motion.div
            className="mt-7 flex flex-wrap items-center justify-center gap-2.5 text-xs font-black text-slate-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38, duration: 0.5 }}
          >
            {["No spreadsheet chaos", "No lost deadlines", "No scattered links"].map((item) => (
              <span key={item} className="border border-slate-200 bg-white px-3 py-2 shadow-sm">
                {item}
              </span>
            ))}
          </motion.div>

          <motion.div
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.5 }}
          >
            <button type="button" onClick={onGetStarted} className="w-full rounded-xl bg-slate-950 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-slate-900/20 transition hover:bg-slate-800 active:scale-[0.98] sm:w-auto">
              Build my tracker
            </button>
            <a href="#records" className="w-full rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto">
              See the workspace
            </a>
          </motion.div>
        </div>

        <WorkspacePreview />
      </section>

      <section className="border-y border-slate-200 bg-white py-8">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-6 text-center sm:grid-cols-4">
          {[
            { value: "Rows", label: "become records" },
            { value: "Links", label: "stay attached" },
            { value: "Dates", label: "become radar" },
            { value: "CSV", label: "exports anytime" },
          ].map(({ value, label }) => (
            <Reveal key={label}>
              <p className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{value}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-24 text-white sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Why spreadsheets break down</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              A row is not enough for a real application.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {[
              { icon: "link", title: "Links drift away", desc: "Portal links, email threads, and job posts end up scattered across browser tabs and inboxes." },
              { icon: "calendar", title: "Deadlines need context", desc: "A date alone does not tell you whether documents, notes, or next steps are ready." },
              { icon: "copy", title: "Rows get duplicated", desc: "One copied row becomes five versions of the truth. Applume keeps one record per application." },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08} className="border border-white/10 bg-white/[0.04] p-7">
                <div className="mb-5 grid h-11 w-11 place-items-center bg-white/10 text-emerald-300">
                  <Icon name={item.icon} className="h-5 w-5" />
                </div>
                <h3 className="text-base font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="records" className="bg-[#f7f5ef] px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Reveal className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">The Applume record</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              From spreadsheet rows to application records.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Each application gets its own dossier: deadline, status, portal link, documents, notes, and the next step you need to take.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            <FeatureCard icon="dashboard" title="Application dossier" tone="emerald">
              Keep institution, role, city, requirements, notes, documents, and saved links together instead of spreading them across columns.
            </FeatureCard>
            <FeatureCard icon="calendar" title="Deadline radar" tone="amber">
              See urgent and overdue applications based on open statuses, so submitted or finished records stop shouting for attention.
            </FeatureCard>
            <FeatureCard icon="sparkles" title="AI record draft" tone="violet">
              Paste a job post, program page, or description and let AI prepare the first version of the record for you.
            </FeatureCard>
          </div>
        </div>
      </section>

      <section id="workflow" className="bg-white px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Views for your workflow</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Use the view that matches the question.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal className="border border-slate-200 bg-[#f7f5ef] p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Table", desc: "Scan every field like a cleaner spreadsheet." },
                  { label: "Cards", desc: "Review one application at a time." },
                  { label: "Board", desc: "Move records by status when that helps." },
                ].map((view) => (
                  <div key={view.label} className="border border-slate-200 bg-white p-4">
                    <p className="text-sm font-black text-slate-950">{view.label}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{view.desc}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.08} className="border border-slate-200 bg-slate-950 p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Export anytime</p>
              <h3 className="mt-4 text-2xl font-black">Your data is not trapped.</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Download CSV when you want spreadsheet flexibility, or JSON when you want a full backup.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-950">applications.csv</span>
                <span className="rounded-xl bg-white/10 px-3 py-2 text-xs font-black text-white">backup.json</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f5ef] px-4 py-24 sm:px-6">
        <Reveal className="mx-auto max-w-5xl border border-slate-200 bg-slate-950 px-6 py-16 text-center text-white sm:px-12">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Bring order to the list</p>
          <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Turn your application sheet into a workspace.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400">
            Keep the practical spreadsheet spirit, but give every application the structure it deserves.
          </p>
          <button type="button" onClick={onGetStarted} className="mt-8 rounded-xl bg-emerald-500 px-9 py-4 text-base font-bold text-white shadow-xl shadow-emerald-500/25 transition hover:bg-emerald-400">
            Create your tracker
          </button>
        </Reveal>
      </section>

      <LandingFooter />
    </div>
  );
}
