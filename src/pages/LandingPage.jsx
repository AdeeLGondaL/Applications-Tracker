import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

const demoSets = {
  university: {
    label: "University",
    headline: "Admissions tracker",
    context: "Programs, portals, transcripts, motivation letters, deadlines.",
    pasteTitle: "Paste an admissions page",
    pasteText: "M.Sc. Computer Science - deadline 15 Jun - transcript, CV, motivation letter required...",
    records: [
      {
        id: "tum",
        name: "TU Munich",
        detail: "M.Sc. Computer Science",
        status: "Deadline soon",
        deadline: "15 Jun",
        tone: "amber",
        fields: [
          ["Documents", "4/5 ready"],
          ["Portal link", "Saved"],
          ["Next step", "Upload transcript"],
          ["Notes", "Module fit added"],
        ],
        checklist: ["CV attached", "Transcript pending", "Motivation letter drafted", "Portal account ready"],
        activity: "Last note: check certified transcript requirements before submitting.",
      },
      {
        id: "berlin",
        name: "TU Berlin",
        detail: "M.Sc. Data Science",
        status: "Documents",
        deadline: "01 Jul",
        tone: "emerald",
        fields: [
          ["Documents", "3/5 ready"],
          ["Portal link", "Saved"],
          ["Next step", "Request module description"],
          ["Notes", "Language proof needed"],
        ],
        checklist: ["CV attached", "Transcript attached", "Language proof pending", "Requirements saved"],
        activity: "Last note: compare module catalog with admission requirements.",
      },
      {
        id: "saarland",
        name: "Saarland University",
        detail: "Visual Computing",
        status: "Researching",
        deadline: "20 Jul",
        tone: "blue",
        fields: [
          ["Documents", "1/5 ready"],
          ["Portal link", "Not saved"],
          ["Next step", "Review prerequisites"],
          ["Notes", "Portfolio optional"],
        ],
        checklist: ["Program page saved", "CV pending", "Transcript pending", "Motivation letter pending"],
        activity: "Last note: ask whether current credits meet the entry requirement.",
      },
    ],
  },
  job: {
    label: "Job",
    headline: "Job search tracker",
    context: "Roles, recruiters, resumes, interviews, follow-ups, saved job posts.",
    pasteTitle: "Paste a job post",
    pasteText: "Working Student QA - BMW Group - hybrid Munich - apply with CV and portfolio...",
    records: [
      {
        id: "bmw",
        name: "BMW Group",
        detail: "Working Student QA",
        status: "Applied",
        deadline: "Follow up 18 Jun",
        tone: "blue",
        fields: [
          ["Resume", "Submitted"],
          ["Job link", "Saved"],
          ["Next step", "Follow up recruiter"],
          ["Notes", "Testing tools listed"],
        ],
        checklist: ["CV attached", "Cover note saved", "Recruiter note ready", "Job post archived"],
        activity: "Last note: follow up if there is no answer by next Tuesday.",
      },
      {
        id: "sap",
        name: "SAP",
        detail: "Frontend Intern",
        status: "Interview",
        deadline: "Prep today",
        tone: "amber",
        fields: [
          ["Resume", "Tailored"],
          ["Job link", "Saved"],
          ["Next step", "Prepare examples"],
          ["Notes", "React project relevant"],
        ],
        checklist: ["CV attached", "Interview notes drafted", "Portfolio link checked", "Questions prepared"],
        activity: "Last note: prepare a concise story about the dashboard project.",
      },
      {
        id: "zalando",
        name: "Zalando",
        detail: "Junior Product Analyst",
        status: "To apply",
        deadline: "No deadline",
        tone: "emerald",
        fields: [
          ["Resume", "Needs edit"],
          ["Job link", "Saved"],
          ["Next step", "Tailor CV"],
          ["Notes", "SQL requested"],
        ],
        checklist: ["Job post saved", "CV pending", "Skills matched", "Salary note added"],
        activity: "Last note: add analytics coursework before applying.",
      },
    ],
  },
};

const painCards = [
  {
    icon: "calendar",
    title: "Deadlines hide until they are urgent",
    copy: "A date in a spreadsheet cell does not feel important until it is already too close.",
    tone: "amber",
  },
  {
    icon: "link",
    title: "Links scatter across tabs and inboxes",
    copy: "Portal pages, job posts, folders, and emails drift away from the application they belong to.",
    tone: "blue",
  },
  {
    icon: "copy",
    title: "Rows stop carrying enough context",
    copy: "A serious search needs documents, status, notes, next steps, and a reliable history.",
    tone: "slate",
  },
  {
    icon: "sparkles",
    title: "Manual entry breaks momentum",
    copy: "Starting every application from a blank row is exactly where good tracking habits fade.",
    tone: "violet",
  },
];

const audienceCards = [
  {
    icon: "university",
    title: "For university applications",
    copy: "Track programs, admissions portals, document checklists, transcripts, motivation letters, and hard deadlines.",
    items: ["Transcript", "Motivation letter", "Portal link"],
  },
  {
    icon: "job",
    title: "For job applications",
    copy: "Track roles, companies, recruiter notes, resumes, interviews, follow-ups, and saved job descriptions.",
    items: ["CV", "Recruiter note", "Follow-up"],
  },
];

const flowSteps = [
  {
    label: "Paste",
    title: "Drop in a posting or program page",
    copy: "Start from the text you already have instead of rebuilding the same details by hand.",
  },
  {
    label: "Review",
    title: "Applume prepares the record",
    copy: "AI autofill can draft the obvious fields while you stay in control of what gets saved.",
  },
  {
    label: "Track",
    title: "Keep every next step visible",
    copy: "Move from a messy list to a workspace that keeps deadlines, documents, links, and notes together.",
  },
];

function ScrollThread() {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, { stiffness: 170, damping: 35, restDelta: 0.001 });
  return <motion.div className="fixed left-0 right-0 top-0 z-[70] h-[3px] origin-left bg-emerald-500" style={{ scaleX: reducedMotion ? 1 : scaleX }} />;
}

function Reveal({ children, className = "", delay = 0 }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ToneIcon({ icon, tone = "emerald" }) {
  const toneClass = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    violet: "border-violet-200 bg-violet-50 text-violet-700",
    slate: "border-slate-200 bg-slate-50 text-slate-700",
  }[tone];

  return (
    <div className={`grid h-10 w-10 place-items-center rounded-lg border ${toneClass}`}>
      <Icon name={icon} className="h-4 w-4" />
    </div>
  );
}

function LandingFooter() {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.origin : "https://applume.app";
  const shareText = "Your applications deserve better than a spreadsheet.";

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
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${url}`)}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { label: "X / Twitter", href: `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}` },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-10 text-center">
      <p className="text-sm font-black text-slate-800">Know someone still managing applications in a spreadsheet?</p>
      <p className="mt-1 text-xs text-slate-500">Share Applume as their structured tracker.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        {typeof navigator !== "undefined" && !!navigator.share && (
          <button type="button" onClick={handleNativeShare} className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100">
            <Icon name="share" className="h-3.5 w-3.5" /> Share
          </button>
        )}
        <button type="button" onClick={handleCopy} className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold transition ${copied ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"}`}>
          <Icon name={copied ? "check" : "copy"} className="h-3.5 w-3.5" />
          {copied ? "Copied" : "Copy link"}
        </button>
        {socials.map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
            {label}
          </a>
        ))}
      </div>
      <p className="mt-8 text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Applume - Structured application tracking
        {" - "}
        <a href="/privacy" className="text-slate-400 transition-colors hover:text-slate-600">Privacy Policy</a>
      </p>
    </footer>
  );
}

function HeroBackground() {
  const { scrollY } = useScroll();
  const reducedMotion = useReducedMotion();
  const y = useSpring(useTransform(scrollY, [0, 700], [0, 80]), { stiffness: 70, damping: 24 });
  const routeScale = useSpring(useTransform(scrollY, [0, 520], [0.25, 1]), { stiffness: 90, damping: 26 });
  const sheetOpacity = useTransform(scrollY, [0, 460], [0.9, 0.25]);
  const recordOpacity = useTransform(scrollY, [0, 460], [0.2, 0.9]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[58rem] bg-[linear-gradient(to_right,rgba(15,23,42,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[size:72px_48px] opacity-50" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-[#f7f5ef]" />
      <motion.div
        className="absolute left-[8%] top-28 hidden w-56 rotate-[-7deg] rounded-lg border border-rose-100 bg-white/90 p-3 shadow-xl shadow-slate-900/10 sm:block"
        style={{ y: reducedMotion ? 0 : y, opacity: reducedMotion ? 0.75 : sheetOpacity }}
      >
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-rose-500">Messy sheet</p>
        <div className="grid grid-cols-4 gap-1 text-[9px] font-bold text-slate-400">
          {["Name", "Due", "Status", "Where", "TUM", "15 Jun", "?", "email", "BMW", "", "applied", "tab 12", "SAP", "?", "maybe", "inbox"].map((cell, index) => (
            <span key={`${cell}-${index}`} className={`truncate rounded border px-1.5 py-1 ${cell === "?" || cell === "" || cell === "tab 12" ? "border-rose-100 bg-rose-50 text-rose-500" : "border-slate-100 bg-slate-50"}`}>
              {cell || "-"}
            </span>
          ))}
        </div>
      </motion.div>
      <motion.div
        className="absolute left-[19%] right-[19%] top-[31rem] hidden h-px origin-left bg-gradient-to-r from-transparent via-emerald-500/70 to-transparent sm:block"
        style={{ scaleX: reducedMotion ? 0.75 : routeScale }}
      />
      <motion.div
        className="absolute right-[4%] top-24 hidden w-60 rotate-[6deg] rounded-lg border border-emerald-100 bg-white/95 p-4 shadow-xl shadow-emerald-900/10 lg:block"
        style={{ opacity: reducedMotion ? 0.8 : recordOpacity }}
      >
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Applume record</p>
        <p className="mt-2 text-sm font-black text-slate-900">One application, all context</p>
        <div className="mt-3 space-y-1.5">
          {["Deadline visible", "Documents tracked", "Portal link attached"].map((line) => (
            <div key={line} className="rounded-md bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-800">{line}</div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function ProductDemo() {
  const [mode, setMode] = useState("university");
  const [selectedId, setSelectedId] = useState(demoSets.university.records[0].id);
  const reducedMotion = useReducedMotion();
  const active = demoSets[mode];
  const selected = active.records.find((record) => record.id === selectedId) || active.records[0];

  function switchMode(nextMode) {
    setMode(nextMode);
    setSelectedId(demoSets[nextMode].records[0].id);
  }

  const toneClass = {
    amber: "bg-amber-100 text-amber-800",
    blue: "bg-blue-100 text-blue-800",
    emerald: "bg-emerald-100 text-emerald-800",
  }[selected.tone];

  return (
    <div id="example-tracker" className="mx-auto mt-12 w-full max-w-[calc(100vw-2rem)] scroll-mt-24 px-0 sm:max-w-6xl sm:px-6">
      <motion.div
        className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-900/10"
        initial={false}
        whileInView={reducedMotion ? undefined : { y: [8, 0] }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-col items-stretch gap-3 border-b border-slate-200 bg-slate-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            <span className="ml-1 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400 sm:ml-2 sm:text-[10px] sm:tracking-[0.2em]">Product demo</span>
          </div>
          <div className="grid w-full grid-cols-2 rounded-lg border border-slate-200 bg-white p-1 sm:w-auto">
            {Object.entries(demoSets).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => switchMode(key)}
                className={`rounded-md px-2 py-2 text-[11px] font-black transition sm:px-3 sm:text-xs ${mode === key ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-50"}`}
              >
                {value.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid bg-[#f7f5ef] lg:grid-cols-[0.78fr_1.22fr]">
          <div className="border-b border-slate-200 bg-slate-950 p-4 text-white lg:border-b-0 lg:border-r lg:p-5">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center gap-2 text-emerald-300">
                <Icon name="sparkles" className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.18em]">AI autofill draft</span>
              </div>
              <p className="mt-3 text-sm font-black">{active.pasteTitle}</p>
              <p className="mt-2 rounded-md border border-white/10 bg-slate-900 px-3 py-3 text-xs leading-5 text-slate-400">
                {active.pasteText}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Name found", "Deadline found", "Checklist started"].map((item) => (
                  <span key={item} className="rounded-md bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-200">{item}</span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{active.headline}</p>
              <div className="space-y-2">
                {active.records.map((record) => {
                  const activeRecord = record.id === selected.id;
                  return (
                    <motion.button
                      key={record.id}
                      type="button"
                      onClick={() => setSelectedId(record.id)}
                      className={`w-full rounded-lg border p-3 text-left transition ${activeRecord ? "border-emerald-300 bg-white text-slate-950" : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"}`}
                      whileHover={reducedMotion ? undefined : { x: 4 }}
                      whileTap={reducedMotion ? undefined : { scale: 0.99 }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black">{record.name}</p>
                          <p className={`mt-0.5 truncate text-xs font-semibold ${activeRecord ? "text-slate-500" : "text-slate-400"}`}>{record.detail}</p>
                        </div>
                        <span className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-black ${activeRecord ? toneClass : "bg-white/10 text-slate-300"}`}>{record.status}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">{active.context}</p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{selected.name}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">{selected.detail}</p>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-700">Deadline</p>
                <p className="mt-1 text-sm font-black text-amber-950">{selected.deadline}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {selected.fields.map(([label, value]) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
                  <p className="mt-2 text-sm font-black text-slate-900">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.78fr]">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Document checklist</p>
                <div className="mt-3 space-y-2">
                  {selected.checklist.map((item, index) => {
                    const done = !item.toLowerCase().includes("pending");
                    return (
                      <div key={item} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${done ? "border-emerald-200 bg-emerald-50 text-emerald-600" : "border-amber-200 bg-amber-50 text-amber-600"}`}>
                          <Icon name={done ? "check" : "calendar"} className="h-3 w-3" />
                        </span>
                        <span>{index === 0 ? item : item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-950 p-4 text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">Notes and next step</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{selected.activity}</p>
                <div className="mt-4 rounded-md bg-white/10 px-3 py-2 text-xs font-bold text-slate-200">
                  Everything stays attached to this record.
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function TransformationStrip() {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const sheetX = useTransform(scrollYProgress, [0, 0.55], [0, -44]);
  const recordX = useTransform(scrollYProgress, [0.2, 0.75], [44, 0]);
  const sheetOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0.36]);
  const recordOpacity = useTransform(scrollYProgress, [0.15, 0.75], [0.44, 1]);

  return (
    <section ref={ref} className="border-y border-slate-200 bg-white px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <motion.div className="rounded-lg border border-rose-100 bg-rose-50 p-4" style={{ x: reducedMotion ? 0 : sheetX, opacity: reducedMotion ? 1 : sheetOpacity }}>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-rose-500">Before</p>
          <p className="mt-2 text-lg font-black text-slate-950">Rows full of question marks</p>
          <div className="mt-4 grid grid-cols-4 gap-1 text-[10px] font-bold">
            {["Name", "Due", "Status", "Where", "TUM", "15 Jun", "?", "inbox", "BMW", "", "applied", "tab 12"].map((cell, index) => (
              <span key={`${cell}-${index}`} className={`truncate rounded-md border px-2 py-1.5 ${cell === "?" || cell === "" || cell === "tab 12" ? "border-rose-200 bg-white text-rose-500" : "border-slate-200 bg-white text-slate-500"}`}>
                {cell || "-"}
              </span>
            ))}
          </div>
        </motion.div>
        <div className="mx-auto grid h-11 w-11 place-items-center rounded-lg bg-slate-950 text-emerald-300">
          <Icon name="sparkles" className="h-5 w-5" />
        </div>
        <motion.div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4" style={{ x: reducedMotion ? 0 : recordX, opacity: reducedMotion ? 1 : recordOpacity }}>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">After</p>
          <p className="mt-2 text-lg font-black text-slate-950">Records with context</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {["Deadline visible", "Documents attached", "Next step ready"].map((item) => (
              <span key={item} className="rounded-md border border-emerald-200 bg-white px-3 py-2 text-center text-xs font-black text-emerald-800">{item}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section id="why-applume" className="scroll-mt-20 bg-slate-950 px-4 py-24 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Where spreadsheets break</p>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            It is not the tracking that is hard. It is keeping the context alive.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-400">
            Applications become stressful when dates, documents, links, notes, and next steps live in different places. Applume is built around that exact moment.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {painCards.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06} className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
              <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 280, damping: 22 }}>
                <div className="mb-5">
                  <ToneIcon icon={item.icon} tone={item.tone} />
                </div>
                <h3 className="text-base font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.copy}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section id="features" className="scroll-mt-20 bg-[#f7f5ef] px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Every application becomes a record</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Not another list. A place for the whole application.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Each record keeps the practical pieces together: status, deadline, documents, links, notes, next action, and exportable data.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="grid gap-3 sm:grid-cols-2">
            {[
              ["Status", "Applying, interview, offer, rejected"],
              ["Deadline", "Urgent and overdue items stay visible"],
              ["Documents", "CV, transcript, portfolio, motivation letter"],
              ["Links", "Portal pages, job posts, folders, emails"],
              ["Notes", "Interview prep and admissions requirements"],
              ["Export", "CSV or JSON when you want your data out"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">{label}</p>
                <p className="mt-2 text-sm font-semibold leading-5 text-slate-700">{value}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function AudienceSection() {
  return (
    <section className="bg-white px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Built for admissions and job hunts</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Same chaos, different applications. Applume handles both.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {audienceCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.08} className="rounded-lg border border-slate-200 bg-[#f7f5ef] p-6">
              <ToneIcon icon={card.icon} tone={index === 0 ? "emerald" : "blue"} />
              <h3 className="mt-5 text-2xl font-black text-slate-950">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.copy}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {card.items.map((item) => (
                  <span key={item} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600">{item}</span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-slate-950 px-4 py-24 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">From paste to tracker</p>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Make logging an application feel lighter than filling a row.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-400">
            The product should reduce friction, not add another chore. Applume keeps manual control while making the first draft faster.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {flowSteps.map((step, index) => (
            <Reveal key={step.label} delay={index * 0.08} className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
              <div className="inline-flex rounded-md bg-emerald-400/10 px-3 py-1.5 text-xs font-black text-emerald-300">{step.label}</div>
              <h3 className="mt-5 text-xl font-black">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{step.copy}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.14} className="mt-6 rounded-lg border border-white/10 bg-white p-5 text-slate-950">
          <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Grounded trust</p>
              <h3 className="mt-3 text-3xl font-black leading-tight">Private by default. Export whenever you want.</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Sign in with Google or email. Your records belong to your account, and shared tracker links are intentional.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Google/email", "Sign-in options"],
                ["CSV/JSON", "No lock-in"],
                ["Feedback", "Built with users"],
              ].map(([value, label]) => (
                <div key={value} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-black">{value}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FounderNote({ onGetStarted }) {
  return (
    <section className="bg-[#f7f5ef] px-4 py-24 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
        <Reveal className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">A note from the builder</p>
          <p className="mt-5 text-xl font-black leading-8 text-slate-950">
            Applume exists because application tracking should feel like control, not another spreadsheet you slowly abandon.
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            The goal is simple: keep the speed people like about spreadsheets, then add the structure that deadlines, documents, links, and interviews actually need.
          </p>
        </Reveal>
        <Reveal delay={0.08} className="rounded-lg border border-slate-200 bg-slate-950 p-8 text-white shadow-2xl shadow-slate-900/15">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Bring order to the list</p>
          <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Turn your application sheet into a finished workspace.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
            Keep the speed of a spreadsheet, then add the structure needed to stay prepared and consistent.
          </p>
          <motion.button type="button" onClick={onGetStarted} className="mt-8 rounded-lg bg-emerald-500 px-9 py-4 text-base font-bold text-white shadow-xl shadow-emerald-500/25 transition hover:bg-emerald-400" whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
            Create your tracker
          </motion.button>
        </Reveal>
      </div>
    </section>
  );
}

export default function LandingPage({ onGetStarted }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f5ef] text-slate-950">
      <ScrollThread />
      <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-[#f7f5ef]/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/Logo.png" alt="Applume" className="h-8 w-8 object-contain" style={{ mixBlendMode: "multiply" }} />
            <span className="text-sm font-black tracking-tight">
              <span className="text-slate-950">App</span><span className="text-emerald-600">lume</span>
            </span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-semibold text-slate-500 sm:flex">
            <a href="#why-applume" className="transition hover:text-slate-950">Why Applume</a>
            <a href="#features" className="transition hover:text-slate-950">Features</a>
            <a href="#how-it-works" className="transition hover:text-slate-950">How it works</a>
          </div>
          <div className="flex items-center gap-2">
            <motion.button type="button" onClick={onGetStarted} className="hidden rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white sm:block" whileHover={reducedMotion ? undefined : { y: -1 }} whileTap={reducedMotion ? undefined : { scale: 0.98 }}>
              Sign in
            </motion.button>
            <motion.button type="button" onClick={onGetStarted} className="hidden rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 sm:inline-flex" whileHover={reducedMotion ? undefined : { y: -1 }} whileTap={reducedMotion ? undefined : { scale: 0.98 }}>
              <span>Start tracking free</span>
            </motion.button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
        <HeroBackground />
        <div className="relative z-10 mx-auto max-w-5xl">
          <motion.span
            className="inline-flex max-w-[calc(100vw-2rem)] items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700 shadow-sm sm:px-4 sm:text-[11px] sm:tracking-[0.2em]"
            whileHover={reducedMotion ? undefined : { y: -2 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Built for spreadsheet escapees
          </motion.span>

          <motion.h1
            className="mx-auto mt-7 max-w-[17rem] text-[1.62rem] font-black leading-[1.1] tracking-tight min-[420px]:max-w-5xl min-[420px]:text-[2.7rem] sm:text-[4rem] sm:leading-[1.03] lg:text-[5.15rem]"
            initial={false}
          >
            <span className="block sm:hidden">Applications</span>
            <span className="block sm:hidden">deserve better</span>
            <span className="block sm:hidden">than a</span>
            <span className="block sm:hidden">spreadsheet.</span>
            <span className="hidden sm:inline">Your applications deserve better than </span>
            <span className="hidden sm:block">a spreadsheet.</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-[19rem] text-base leading-7 text-slate-600 sm:max-w-3xl sm:text-lg sm:leading-8"
            initial={false}
          >
            Applume turns job and university applications into structured records with deadlines, documents, links, notes, statuses, and next steps.
          </motion.p>

          <motion.div
            className="mx-auto mt-7 grid w-full max-w-sm gap-2 text-xs font-black text-slate-600 sm:max-w-3xl sm:grid-cols-3"
            initial={false}
          >
            {["12 tabs open", "Deadline hidden in a row", "Portal link lost again"].map((item) => (
              <span key={item} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center shadow-sm">
                {item}
              </span>
            ))}
          </motion.div>

          <motion.div
            className="mx-auto mt-9 flex w-full max-w-xs flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row"
            initial={false}
          >
            <motion.button type="button" onClick={onGetStarted} className="w-full rounded-lg bg-slate-950 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-slate-900/20 transition hover:bg-slate-800 sm:w-auto" whileHover={reducedMotion ? undefined : { y: -2 }} whileTap={reducedMotion ? undefined : { scale: 0.98 }}>
              Build my tracker
            </motion.button>
            <motion.a href="#example-tracker" className="w-full rounded-lg border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto" whileHover={reducedMotion ? undefined : { y: -2 }} whileTap={reducedMotion ? undefined : { scale: 0.98 }}>
              See the product demo
            </motion.a>
          </motion.div>

          <motion.p
            className="mx-auto mt-5 max-w-[17rem] text-xs leading-5 text-slate-500 sm:max-w-xl"
            initial={false}
          >
            For students, graduates, and job seekers managing multiple applications at once.
          </motion.p>
        </div>

        <ProductDemo />
      </section>

      <TransformationStrip />
      <ProblemSection />
      <FeatureSection />
      <AudienceSection />
      <HowItWorksSection />
      <FounderNote onGetStarted={onGetStarted} />
      <LandingFooter />
    </div>
  );
}
