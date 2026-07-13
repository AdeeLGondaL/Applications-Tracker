import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Logo } from "@/components/brand/Logo";
import { PaperPlane } from "@/components/brand/PaperPlane";
import { trackEvent } from "@/utils/analytics";

/* ────────────────────────────────────────────────────────────────────────
   Curated, truthful demo data (universities + jobs).
   ──────────────────────────────────────────────────────────────────────── */
const demoSets = {
  university: {
    label: "University",
    identity: "University / Program",
    docLabel: "Documents",
    records: [
      {
        id: "tum", name: "TU Munich", detail: "M.Sc. Computer Science", city: "Munich",
        status: "Deadline soon", tone: "warning", deadline: "15 Jun", deadlineNote: "9 days left",
        next: "Upload certified transcript",
        docs: [["Curriculum vitae", true], ["Transcript", false], ["Motivation letter", true], ["Language proof", false]],
        note: "Check certified transcript requirements before submitting.",
        source: "Admissions portal",
      },
      {
        id: "berlin", name: "TU Berlin", detail: "M.Sc. Data Science", city: "Berlin",
        status: "Preparing", tone: "info", deadline: "01 Jul", deadlineNote: "25 days left",
        next: "Request module description",
        docs: [["Curriculum vitae", true], ["Transcript", true], ["Language proof", false], ["Portfolio", false]],
        note: "Compare module catalogue with the admission requirements.",
        source: "Admissions portal",
      },
      {
        id: "saarland", name: "Saarland University", detail: "M.Sc. Visual Computing", city: "Saarbrücken",
        status: "Researching", tone: "neutral", deadline: "20 Jul", deadlineNote: "44 days left",
        next: "Review prerequisites",
        docs: [["Program page saved", true], ["Curriculum vitae", false], ["Transcript", false], ["Motivation letter", false]],
        note: "Confirm current credits meet the entry requirement.",
        source: "Program page",
      },
    ],
  },
  job: {
    label: "Job",
    identity: "Company / Role",
    docLabel: "Materials",
    records: [
      {
        id: "sap", name: "SAP", detail: "Frontend Engineering Intern", city: "Walldorf · Hybrid",
        status: "Interview", tone: "warning", deadline: "Prep today", deadlineNote: "Round 2",
        next: "Prepare project examples",
        docs: [["Résumé", true], ["Interview notes", true], ["Portfolio link", true], ["Questions", false]],
        note: "Prepare a concise story about the dashboard project.",
        source: "Job listing",
      },
      {
        id: "bmw", name: "BMW Group", detail: "Working Student, QA", city: "Munich · Hybrid",
        status: "Applied", tone: "info", deadline: "Follow up 18 Jun", deadlineNote: "Awaiting reply",
        next: "Follow up with recruiter",
        docs: [["Résumé", true], ["Cover note", true], ["Recruiter note", true], ["Job post archived", true]],
        note: "Follow up if there's no answer by next Tuesday.",
        source: "Job listing",
      },
      {
        id: "zalando", name: "Zalando", detail: "Junior Product Analyst", city: "Berlin · Remote",
        status: "To apply", tone: "neutral", deadline: "No deadline", deadlineNote: "Open",
        next: "Tailor résumé to the role",
        docs: [["Job post saved", true], ["Résumé", false], ["Skills matched", true], ["Salary note", true]],
        note: "Add the analytics coursework before applying.",
        source: "Job listing",
      },
    ],
  },
};

const toneStyles = {
  warning: "border-[color-mix(in_srgb,var(--warning)_28%,transparent)] bg-[var(--warning-soft)] text-[var(--warning-ink)]",
  info: "border-[color-mix(in_srgb,var(--info)_26%,transparent)] bg-[var(--info-soft)] text-[var(--info)]",
  neutral: "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)]",
  success: "border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] text-[var(--applume-accent-hover)]",
};

const vocab = [
  ["Institution", "University", "Company"],
  ["Position", "Program", "Role"],
  ["Primary document", "Transcript", "Résumé"],
  ["Written case", "Motivation letter", "Cover letter"],
  ["Where you apply", "Admissions portal", "Job listing"],
];

const coreSystem = [
  { n: "01", title: "Deadlines that stay in view", copy: "Every record carries its own deadline with clear emphasis as it approaches — nothing hides in a cell." },
  { n: "02", title: "Documents attached to the application", copy: "Transcripts, résumés, letters and portfolios live on the record they belong to, tracked as a simple checklist." },
  { n: "03", title: "A next action, always", copy: "Each application names the single next step, so you always know what to do without re-reading everything." },
  { n: "04", title: "Notes, links and context", copy: "The portal link, recruiter thread and your own notes stay together — the memory a spreadsheet row can't hold." },
];

const faqs = [
  { q: "Does it work for both university and job applications?", a: "Yes. The same structure tracks admissions and job searches — the labels adapt to each (program vs role, transcript vs résumé, admissions portal vs job listing)." },
  { q: "Can I import my current spreadsheet?", a: "Yes — import a CSV and map your columns to Applume's fields. Your existing rows become structured records you can build on." },
  { q: "Is my data private?", a: "Your applications are private to your account. Nothing is public unless you deliberately share a read-only link." },
  { q: "Can I get my data out?", a: "Yes — export your applications to CSV or JSON at any time. Your records are yours to keep." },
  { q: "Do I need a credit card to start?", a: "No. You can start tracking for free without a credit card." },
];

const sidebarNav = [
  ["dashboard", "Applications", true],
  ["calendar", "Calendar", false],
  ["copy", "Documents", false],
  ["edit", "Notes", false],
  ["link", "Links", false],
  ["shield", "Settings", false],
];

/* ── Editorial section label ────────────────────────────────────────────── */
function SectionLabel({ index, children }) {
  return (
    <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">
      {index ? <span className="tabular-nums text-[var(--applume-accent)]">{index}</span> : null}
      {index ? <span className="text-[var(--border-strong)]">/</span> : null}
      <span>{children}</span>
    </div>
  );
}

/* Reveal: fires once the element is meaningfully in view (not while it's still
   near the bottom edge), so the motion is actually seen. */
function Reveal({ children, className = "", delay = 0, amount = 0.35 }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ── Interactive product demo (sidebar · list · detail) ─────────────────── */
function ProductDemo() {
  const [mode, setMode] = useState("university");
  const set = demoSets[mode];
  const [activeId, setActiveId] = useState(set.records[0].id);
  const active = useMemo(() => set.records.find((r) => r.id === activeId) ?? set.records[0], [set, activeId]);

  function switchMode(next) {
    setMode(next);
    setActiveId(demoSets[next].records[0].id);
  }

  const readyCount = active.docs.filter(([, done]) => done).length;

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-card)] shadow-[0_1px_0_rgba(0,0,0,0.02),0_28px_70px_-38px_rgba(12,20,16,0.4)]">
      {/* chrome */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2 text-[var(--text-soft)]">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-strong)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-strong)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-strong)]" />
          <span className="ml-2 hidden text-xs font-medium text-[var(--text-muted)] sm:inline">applume.app / applications</span>
        </div>
        <div className="flex rounded-[8px] border border-[var(--border)] p-0.5">
          {["university", "job"].map((m) => (
            <button key={m} type="button" onClick={() => switchMode(m)}
              className={`rounded-[6px] px-2.5 py-1 text-xs font-semibold transition-colors ${mode === m ? "bg-[var(--applume-accent-soft)] text-[var(--applume-accent-hover)]" : "text-[var(--text-muted)] hover:text-[var(--ink)]"}`}>
              {demoSets[m].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] xl:grid-cols-[9.5rem_minmax(0,0.82fr)_minmax(0,1.22fr)]">
        {/* sidebar (xl only — keeps the detail pane roomy at smaller widths) */}
        <nav className="hidden flex-col justify-between border-r border-[var(--border)] p-2.5 xl:flex">
          <div className="grid gap-0.5">
            <div className="mb-1 px-2 pt-1"><Logo imgClass="h-5 w-5" wordmarkClass="text-[13px]" /></div>
            {sidebarNav.map(([icon, label, on]) => (
              <span key={label} className={`flex items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-[13px] font-medium ${on ? "bg-[var(--applume-accent-soft)] text-[var(--applume-accent-hover)]" : "text-[var(--text-muted)]"}`}>
                <Icon name={icon} className="h-3.5 w-3.5" /> {label}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-[var(--border)] px-2 pt-2.5">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--applume-accent)] text-[10px] font-bold text-white">AC</span>
            <span className="text-xs font-medium text-[var(--text-muted)]">Aiden Chen</span>
          </div>
        </nav>

        {/* list */}
        <div className="border-b border-[var(--border)] lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-4 pt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">
            <span>{set.identity}</span><span>{set.records.length}</span>
          </div>
          <ul className="p-2">
            {set.records.map((r) => {
              const on = r.id === active.id;
              return (
                <li key={r.id}>
                  <button type="button" onClick={() => setActiveId(r.id)}
                    className={`flex w-full items-center gap-3 rounded-[10px] px-3 py-3 text-left transition-colors ${on ? "bg-[var(--applume-accent-soft)]" : "hover:bg-[var(--surface-soft)]"}`}>
                    <span className={`h-8 w-[3px] shrink-0 rounded-full ${on ? "bg-[var(--applume-accent)]" : "bg-transparent"}`} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-[var(--ink)]">{r.name}</span>
                        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${toneStyles[r.tone]}`}>{r.status}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-[var(--text-muted)]">{r.detail}</span>
                      <span className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--text-soft)]"><Icon name="calendar" className="h-3 w-3" /> {r.deadline}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* detail */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-[var(--ink)]">{active.name}</p>
              <p className="mt-0.5 text-sm text-[var(--text-muted)]">{active.detail} · {active.city}</p>
            </div>
            <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${toneStyles[active.tone]}`}>{active.status}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className={`rounded-[10px] border p-3 ${active.tone === "warning" ? toneStyles.warning : "border-[var(--border)] bg-[var(--surface-soft)]"}`}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] opacity-70">Deadline</p>
              <p className="mt-1 text-sm font-semibold">{active.deadline}</p>
              <p className="text-[11px] opacity-75">{active.deadlineNote}</p>
            </div>
            <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface-soft)] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-soft)]">Next action</p>
              <p className="mt-1 text-sm font-medium text-[var(--ink)]">{active.next}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-soft)]">
              <span>{set.docLabel}</span><span className="shrink-0 whitespace-nowrap tabular-nums">{readyCount}/{active.docs.length} ready</span>
            </div>
            <ul className="mt-2 grid gap-1.5">
              {active.docs.map(([label, done]) => (
                <li key={label} className="flex items-center gap-2.5 text-sm">
                  <span className={`grid h-4 w-4 place-items-center rounded-[5px] border ${done ? "border-[var(--applume-accent)] bg-[var(--applume-accent)] text-white" : "border-[var(--border-strong)] text-transparent"}`}><Icon name="check" className="h-2.5 w-2.5" /></span>
                  <span className={done ? "text-[var(--ink)]" : "text-[var(--text-muted)]"}>{label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 rounded-[10px] bg-[var(--surface-soft)] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-soft)]">Note · {active.source}</p>
            <p className="mt-1 text-[13px] leading-6 text-[var(--text-muted)]">{active.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroContent({ onGetStarted }) {
  return (
    <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-12 xl:gap-16">
      <div className="relative z-10">
        <SectionLabel>Application tracking, reconsidered</SectionLabel>
        <h1 className="font-display mt-6 text-[clamp(2.5rem,5.2vw,4.25rem)] leading-[1.02] tracking-[-0.02em] text-[var(--text-strong)]">
          Every application.<br />One&nbsp;calm&nbsp;place.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-8 text-[var(--text-muted)]">
          Track deadlines, documents, notes, links and next steps — without maintaining another spreadsheet.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button type="button" onClick={onGetStarted} className="inline-flex min-h-12 items-center gap-2 rounded-[11px] bg-[var(--applume-accent-strong)] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--applume-accent-ink)]">
            Start tracking free <Icon name="plus" className="h-4 w-4" />
          </button>
          <a href="#how-it-works" className="inline-flex min-h-12 items-center gap-2 rounded-[11px] px-4 text-[15px] font-medium text-[var(--ink)] transition-colors hover:text-[var(--applume-accent-hover)]">
            View product <Icon name="download" className="h-4 w-4 rotate-[-90deg]" />
          </a>
        </div>
        <p className="mt-5 text-[13px] text-[var(--text-soft)]">Free to use · Private by default · Export anytime</p>
      </div>
      <div className="relative z-10 lg:pl-2">
        <ProductDemo />
      </div>
    </div>
  );
}

function Hero({ onGetStarted }) {
  return (
    <section className="pb-16 pt-16 sm:pt-24">
      <HeroContent onGetStarted={onGetStarted} />
    </section>
  );
}

/* ── FAQ item ───────────────────────────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-[var(--border)]">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center justify-between gap-6 py-5 text-left">
        <span className="text-base font-medium text-[var(--ink)]">{q}</span>
        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--border)] text-[var(--text-muted)] transition-transform ${open ? "rotate-45" : ""}`}><Icon name="plus" className="h-3.5 w-3.5" /></span>
      </button>
      {open && <p className="max-w-2xl pb-5 text-[15px] leading-7 text-[var(--text-muted)]">{a}</p>}
    </div>
  );
}

/* ── Spreadsheet → record morph ─────────────────────────────────────────
   On desktop the section pins and the spreadsheet card cross-morphs into the
   Applume record, scrubbed by scroll progress — so it plays forward as you
   scroll down and reverses as you scroll back up, then releases when done. */
const sheetCard = (
  <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-card)] p-6 shadow-[0_1px_0_rgba(0,0,0,0.02),0_18px_50px_-40px_rgba(12,20,16,0.3)]">
    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-soft)]">A spreadsheet row</p>
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-left text-[13px] text-[var(--text-muted)]">
        <thead className="text-[11px] uppercase tracking-[0.1em] text-[var(--text-soft)]">
          <tr className="border-b border-[var(--border)]"><th className="py-2 pr-3 font-semibold">Name</th><th className="py-2 pr-3 font-semibold">Status</th><th className="py-2 font-semibold">Date</th></tr>
        </thead>
        <tbody>
          <tr className="border-b border-[var(--border)]"><td className="py-2 pr-3">TU Munich</td><td className="py-2 pr-3">applying?</td><td className="py-2">15/6</td></tr>
          <tr className="border-b border-[var(--border)]"><td className="py-2 pr-3">SAP intern</td><td className="py-2 pr-3">sent</td><td className="py-2">—</td></tr>
          <tr><td className="py-2 pr-3">Zalando</td><td className="py-2 pr-3">todo</td><td className="py-2">?</td></tr>
        </tbody>
      </table>
    </div>
    <p className="mt-4 text-[13px] leading-6 text-[var(--text-soft)]">Documents, links, notes and next steps don't fit — so they end up in other tabs, emails and your memory.</p>
  </div>
);

const recordCard = (
  <div className="rounded-[var(--radius-lg)] border border-[var(--applume-accent-border)] bg-[var(--surface-card)] p-6 shadow-[0_18px_50px_-30px_rgba(0,153,102,0.55)]">
    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--applume-accent-hover)]">An Applume record</p>
    <p className="mt-4 text-base font-semibold text-[var(--ink)]">TU Munich · M.Sc. Computer Science</p>
    <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
      <span className={`rounded-full border px-2 py-0.5 font-semibold ${toneStyles.warning}`}>Deadline 15 Jun · 9 days</span>
      <span className={`rounded-full border px-2 py-0.5 font-semibold ${toneStyles.neutral}`}>Next: upload transcript</span>
    </div>
    <ul className="mt-4 grid gap-1.5 text-sm">
      {[["Curriculum vitae", true], ["Transcript", false], ["Motivation letter", true], ["Portal link saved", true]].map(([l, d]) => (
        <li key={l} className="flex items-center gap-2.5">
          <span className={`grid h-4 w-4 place-items-center rounded-[5px] border ${d ? "border-[var(--applume-accent)] bg-[var(--applume-accent)] text-white" : "border-[var(--border-strong)] text-transparent"}`}><Icon name="check" className="h-2.5 w-2.5" /></span>
          <span className={d ? "text-[var(--ink)]" : "text-[var(--text-muted)]"}>{l}</span>
        </li>
      ))}
    </ul>
  </div>
);

const morphHeading = (
  <>
    <SectionLabel index="01">From row to record</SectionLabel>
    <h2 className="font-display mt-6 max-w-3xl text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.06] tracking-[-0.015em]">
      A spreadsheet remembers the row.<br />
      <span className="text-[var(--applume-accent)]">Applume remembers the application.</span>
    </h2>
  </>
);

function SpreadsheetMorph() {
  const reduce = useReducedMotion();
  const wrapRef = useRef(null);
  // Deterministic progress: 0 when the pin region's top reaches the viewport
  // top, 1 after it has scrolled its full pinnable distance. Updates on scroll
  // so it plays forward on the way down and reverses on the way up.
  const p = useMotionValue(0);
  useEffect(() => {
    if (reduce) return undefined;
    const el = wrapRef.current;
    if (!el) return undefined;
    const onScroll = () => {
      const pinLen = el.offsetHeight - window.innerHeight;
      const prog = pinLen > 0 ? Math.min(Math.max(-el.getBoundingClientRect().top / pinLen, 0), 1) : 0;
      p.set(prog);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduce, p]);

  const sheetO = useTransform(p, [0.05, 0.46], [1, 0]);
  const sheetY = useTransform(p, [0.05, 0.46], [0, -30]);
  const sheetS = useTransform(p, [0.05, 0.46], [1, 0.94]);
  const recO = useTransform(p, [0.4, 0.8], [0, 1]);
  const recY = useTransform(p, [0.4, 0.8], [46, 0]);
  const recS = useTransform(p, [0.4, 0.8], [0.94, 1]);
  const arrowO = useTransform(p, [0.24, 0.4, 0.56], [0, 0.9, 0]);

  if (reduce) {
    return (
      <section id="why-applume" className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          {morphHeading}
          <div className="mt-12 grid gap-4 lg:grid-cols-2">{sheetCard}{recordCard}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="why-applume" className="border-t border-[var(--border)]">
      {/* mobile: static stack (no pin) */}
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:hidden">
        {morphHeading}
        <div className="mt-10 grid gap-4">{sheetCard}{recordCard}</div>
      </div>

      {/* desktop: pinned, scroll-scrubbed morph — cards left, heading right */}
      <div ref={wrapRef} className="relative hidden lg:block lg:h-[200vh]">
        <div className="sticky top-16 flex h-[calc(100dvh-4rem)] items-center">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-center gap-12 px-6 xl:gap-20">
            {/* morphing stage (left) */}
            <div className="relative h-[340px]">
              <motion.div style={{ opacity: sheetO, y: sheetY, scale: sheetS }} className="absolute inset-x-0 top-0 origin-center">{sheetCard}</motion.div>
              <motion.div aria-hidden style={{ opacity: arrowO }} className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface-card)] text-[var(--applume-accent)] shadow-sm"><Icon name="download" className="h-4 w-4 rotate-[-90deg]" /></span>
              </motion.div>
              <motion.div style={{ opacity: recO, y: recY, scale: recS }} className="absolute inset-x-0 top-0 origin-center">{recordCard}</motion.div>
            </div>
            {/* heading (right) */}
            <div>{morphHeading}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Landing page
   ──────────────────────────────────────────────────────────────────────── */
export default function LandingPage({ onGetStarted, onSignIn }) {
  useEffect(() => {
    trackEvent("landing_view");
  }, []);

  const nav = [
    ["Why Applume", "#why-applume"],
    ["How it works", "#how-it-works"],
    ["Features", "#features"],
    ["FAQ", "#faq"],
  ];

  return (
    <div className="relative min-h-dvh bg-[var(--surface)] text-[var(--ink)]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--applume-accent)] focus:px-4 focus:py-2 focus:text-white">Skip to content</a>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" aria-label="Applume home"><Logo /></a>
          <nav className="hidden items-center gap-8 md:flex">
            {nav.map(([label, href]) => (
              <a key={href} href={href} className="text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--ink)]">{label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-1.5">
            <LanguageSwitcher compact />
            <button type="button" onClick={onSignIn} className="hidden min-h-10 rounded-[9px] px-3.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--ink)] sm:block">Sign in</button>
            <button type="button" onClick={onGetStarted} className="inline-flex min-h-10 items-center rounded-[9px] bg-[var(--applume-accent-strong)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--applume-accent-ink)]">Start free</button>
          </div>
        </div>
      </header>

      <main id="main">
        <Hero onGetStarted={onGetStarted} />

        {/* ── Spreadsheet → record morph (scroll-scrubbed) ─────────────── */}
        <SpreadsheetMorph />

        {/* ── Opportunity import flow ──────────────────────────────────── */}
        <section id="how-it-works" className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <Reveal>
              <SectionLabel index="02">Less data entry</SectionLabel>
              <h2 className="font-display mt-6 max-w-3xl text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.06] tracking-[-0.015em]">
                Paste the opportunity. Review the details. Keep moving.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--border)] md:grid-cols-3">
              {[
                ["01", "Paste the source", "Add a link to a university or job posting — start from text you already have."],
                ["02", "We draft the details", "Applume extracts and fills the key fields, so you don't have to."],
                ["03", "You review and save", "Confirm, adjust if needed, and add what matters. Nothing is stored without your review."],
              ].map(([n, t, c], i) => (
                <Reveal key={n} delay={i * 0.06} className="bg-[var(--surface-card)] p-7">
                  <span className="font-display text-3xl text-[var(--applume-accent)]">{n}</span>
                  <p className="mt-4 text-lg font-semibold text-[var(--ink)]">{t}</p>
                  <p className="mt-2 text-[15px] leading-7 text-[var(--text-muted)]">{c}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Core system ──────────────────────────────────────────────── */}
        <section id="features" className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <Reveal>
              <SectionLabel index="03">The core system</SectionLabel>
              <h2 className="font-display mt-6 max-w-3xl text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.06] tracking-[-0.015em]">
                Four things a spreadsheet can't keep together.
              </h2>
            </Reveal>
            <div className="mt-10">
              {coreSystem.map((f, i) => (
                <Reveal key={f.n} delay={i * 0.03} amount={0.5}>
                  <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-[var(--border)] py-8 sm:grid-cols-[5rem_1fr_1fr] sm:gap-x-10">
                    <span className="font-display text-2xl text-[var(--applume-accent)]">{f.n}</span>
                    <h3 className="text-xl font-semibold tracking-[-0.01em] text-[var(--ink)]">{f.title}</h3>
                    <p className="col-span-2 text-[15px] leading-7 text-[var(--text-muted)] sm:col-span-1 sm:col-start-3 sm:row-start-1">{f.copy}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── University & jobs vocabulary switch ───────────────────────── */}
        <section className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              <Reveal>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 text-sm">
                  <div className="pb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--applume-accent-hover)]">University</div>
                  <div />
                  <div className="pb-3 text-right text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--info)]">Job</div>
                  {vocab.map(([, u, j]) => (
                    <div key={u} className="contents">
                      <div className="border-t border-[var(--border)] py-3.5 font-medium text-[var(--ink)]">{u}</div>
                      <div className="border-t border-[var(--border)] py-3.5 text-center text-[var(--text-soft)]"><Icon name="download" className="mx-auto h-3.5 w-3.5 rotate-[-90deg]" /></div>
                      <div className="border-t border-[var(--border)] py-3.5 text-right font-medium text-[var(--ink)]">{j}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.06} className="lg:pl-4">
                <SectionLabel index="04">One system, two worlds</SectionLabel>
                <h2 className="font-display mt-6 text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.06] tracking-[-0.015em]">
                  University and jobs, in the same calm structure.
                </h2>
                <p className="mt-6 max-w-md text-[15px] leading-7 text-[var(--text-muted)]">
                  The structure never changes — only the words do. Switch a record between a university application and a job application and the labels follow.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Trust + FAQ ──────────────────────────────────────────────── */}
        <section id="faq" className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <Reveal>
                <SectionLabel index="05">Frequently asked</SectionLabel>
                <h2 className="font-display mt-6 text-[clamp(2rem,4.2vw,3rem)] leading-[1.06] tracking-[-0.015em]">Questions, answered.</h2>
                <p className="mt-6 max-w-sm text-[15px] leading-7 text-[var(--text-muted)]">
                  A few things people ask before moving their applications over.
                </p>
                <p className="mt-4 max-w-sm text-[15px] leading-7 text-[var(--text-muted)]">
                  Anything else on your mind?{" "}
                  <a href="mailto:hello@applume.app" className="font-medium text-[var(--applume-accent-hover)] hover:underline">Email us</a> — we read every message.
                </p>
              </Reveal>
              <Reveal delay={0.06}>
                <div>{faqs.map((f) => <FaqItem key={f.q} {...f} />)}</div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Closing CTA ──────────────────────────────────────────────── */}
        <section className="border-t border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)]">
          <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 sm:py-32">
            <Reveal>
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-[12px] bg-[var(--surface-card)] text-[var(--applume-accent)] ring-1 ring-[var(--applume-accent-border)]"><PaperPlane className="h-6 w-6" /></div>
              <h2 className="font-display mx-auto mt-8 max-w-3xl text-[clamp(2.2rem,5vw,3.75rem)] leading-[1.04] tracking-[-0.02em]">
                Your applications deserve more than another abandoned spreadsheet.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-[var(--text-muted)]">Start free today. Move one application out of the spreadsheet and feel the difference.</p>
              <button type="button" onClick={onGetStarted} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-[11px] bg-[var(--applume-accent-strong)] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--applume-accent-ink)]">
                Start tracking free <Icon name="plus" className="h-4 w-4" />
              </button>
              <p className="mt-6 text-[13px] text-[var(--text-soft)]">Private to your account · CSV &amp; JSON export · No credit card required</p>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ── Footer ─────────────────────────────────────────────────────────────── */
function Footer() {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.origin : "https://applume.app";
  const shareText = "Every application. One calm place. — Applume";
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  function handleCopy() {
    navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {});
  }
  function handleNativeShare() {
    navigator.share({ title: "Applume", text: shareText, url }).catch(() => {});
  }

  const socials = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${url}`)}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { label: "X / Twitter", href: `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}` },
  ];
  const pill = "inline-flex items-center gap-1.5 rounded-[9px] border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--text-muted)] transition-colors hover:border-[var(--applume-accent-border)] hover:text-[var(--ink)]";

  const heading = "text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]";
  const link = "text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--ink)]";

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-[var(--text-muted)]">One calm workspace for university and job applications — deadlines, documents, notes and next steps included.</p>
            <p className="mt-6 text-sm font-semibold text-[var(--ink)]">Know someone still stuck in a spreadsheet?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {canNativeShare && (
                <button type="button" onClick={handleNativeShare} className={pill}>
                  <Icon name="share" className="h-3.5 w-3.5" /> Share
                </button>
              )}
              <button type="button" onClick={handleCopy} className={pill}>
                <Icon name={copied ? "check" : "copy"} className="h-3.5 w-3.5" /> {copied ? "Link copied" : "Copy link"}
              </button>
              {socials.map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={pill}>{label}</a>
              ))}
            </div>
          </div>
          <div>
            <p className={heading}>Guides</p>
            <ul className="mt-4 grid gap-2.5">
              <li><a className={link} href="/university-application-tracker">University application tracker</a></li>
              <li><a className={link} href="/huntr-alternative">Huntr alternative</a></li>
              <li><a className={link} href="/teal-alternative">Teal alternative</a></li>
            </ul>
          </div>
          <div>
            <p className={heading}>Company</p>
            <ul className="mt-4 grid gap-2.5">
              <li><a className={link} href="mailto:hello@applume.app">Contact</a></li>
              <li><a className={link} href="/privacy">Privacy</a></li>
              <li><a className={link} href="/terms">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-[var(--border)] pt-6 text-xs text-[var(--text-soft)] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Applume. Applications deserve better than a spreadsheet.</p>
          <p>Private to your account · Export anytime</p>
        </div>
      </div>
    </footer>
  );
}
