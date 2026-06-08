import { useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

const applications = [
  {
    name: "TU Munich",
    detail: "M.Sc. Computer Science",
    status: "Deadline soon",
    tone: "amber",
    meta: ["Portal saved", "4/5 documents", "Transcript pending"],
  },
  {
    name: "BMW Group",
    detail: "Working Student QA",
    status: "Applied",
    tone: "blue",
    meta: ["CV attached", "Job post saved", "Follow-up next week"],
  },
  {
    name: "TU Berlin",
    detail: "M.Sc. Data Science",
    status: "Documents",
    tone: "emerald",
    meta: ["Deadline tracked", "Notes ready", "Motivation letter draft"],
  },
];

const oldSheetRows = [
  ["Name", "Due", "Status", "Where"],
  ["TUM", "15 Jun", "?", "email"],
  ["BMW", "", "applied", "tab 8"],
  ["Berlin", "01 Jul", "todo", "portal"],
  ["Saarland", "?", "notes?", "drive"],
];

const recordPanels = {
  deadline: {
    label: "Deadline radar",
    nav: "Radar",
    tone: "amber",
    title: "3",
    detail: "open records need attention this week",
    items: ["TUM closes in 7 days", "Berlin needs transcript", "BMW needs follow-up"],
  },
  dossier: {
    label: "Application dossier",
    nav: "Dossier",
    tone: "emerald",
    title: "4 of 5",
    detail: "required materials are ready",
    items: ["CV attached", "Portal link saved", "Module notes added"],
  },
  ai: {
    label: "AI record draft",
    nav: "AI draft",
    tone: "violet",
    title: "12 fields",
    detail: "prepared from a pasted job post or program page",
    items: ["Company found", "Role extracted", "Requirements summarized"],
  },
};

const pains = [
  {
    icon: "calendar",
    title: "Deadlines hide in columns",
    copy: "Dates get typed once, then ignored until the last minute. Applume keeps deadline pressure visible.",
    tone: "amber",
  },
  {
    icon: "link",
    title: "Links scatter everywhere",
    copy: "Portal pages, job posts, email threads, and document folders stay attached to the record that needs them.",
    tone: "blue",
  },
  {
    icon: "copy",
    title: "Rows become duplicates",
    copy: "No more five slightly different rows for the same opportunity. Each application has one source of truth.",
    tone: "slate",
  },
  {
    icon: "sparkles",
    title: "Manual entry kills momentum",
    copy: "Paste a posting or program page and start from a drafted record instead of a blank form.",
    tone: "violet",
  },
];

const dossierItems = [
  { label: "Status", value: "Applying", tone: "violet" },
  { label: "Deadline", value: "15 Jun", tone: "amber" },
  { label: "Documents", value: "4/5 ready", tone: "emerald" },
  { label: "Next step", value: "Upload transcript", tone: "blue" },
];

const workflowViews = [
  {
    title: "Table",
    copy: "Scan every field when you want spreadsheet speed without spreadsheet mess.",
    icon: "dashboard",
  },
  {
    title: "Cards",
    copy: "Review one application as a dossier before interviews, deadlines, or portal updates.",
    icon: "copy",
  },
  {
    title: "Board",
    copy: "Move applications through stages when the job hunt or admissions process gets busy.",
    icon: "filter",
  },
];

function ScrollThread() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 170, damping: 35, restDelta: 0.001 });
  return <motion.div className="fixed left-0 right-0 top-0 z-[70] h-[3px] origin-left bg-emerald-500" style={{ scaleX }} />;
}

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
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
  const shareText = "Track every university and job application in one organized workspace.";

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

function HeroScene({ sheetY, recordY, routeScale }) {
  const arrowX = useTransform(routeScale, [0.2, 1], [-160, 170]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[62rem] bg-[linear-gradient(to_right,rgba(15,23,42,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[size:72px_48px] opacity-50" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-[#f7f5ef]" />
      <motion.div
        className="absolute left-[18%] right-[18%] top-[31rem] hidden h-px origin-left bg-gradient-to-r from-transparent via-emerald-500/70 to-transparent sm:block"
        style={{ scaleX: routeScale }}
      />
      <motion.div
        className="absolute left-[47%] top-[30.1rem] hidden h-5 w-5 rotate-45 border-r-2 border-t-2 border-emerald-500/80 sm:block"
        style={{ x: arrowX }}
      />
      <motion.div
        className="absolute left-[7%] top-36 hidden w-60 rotate-[-8deg] rounded-lg border border-slate-200 bg-white/90 p-3 shadow-xl shadow-slate-900/10 backdrop-blur-sm sm:block"
        style={{ y: sheetY }}
        animate={{ rotate: [-8, -6, -8] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="mb-2 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-300" />
          <span className="h-2 w-2 rounded-full bg-amber-300" />
          <span className="h-2 w-2 rounded-full bg-emerald-300" />
        </div>
        <div className="grid grid-cols-4 gap-1 text-[9px] font-bold text-slate-400">
          {oldSheetRows.flat().map((cell, index) => (
            <span key={`${cell}-${index}`} className={`truncate rounded border px-1.5 py-1 ${cell === "?" || cell === "" || cell === "notes?" ? "border-rose-100 bg-rose-50 text-rose-500" : "border-slate-100 bg-slate-50"}`}>
              {cell || "-"}
            </span>
          ))}
        </div>
      </motion.div>
      <motion.div
        className="absolute right-[2%] top-20 hidden w-56 rotate-[7deg] rounded-lg border border-emerald-100 bg-white/95 p-4 shadow-xl shadow-emerald-900/10 backdrop-blur-sm lg:block"
        style={{ y: recordY }}
        animate={{ rotate: [7, 5, 7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Application record</p>
        <p className="mt-2 text-sm font-black text-slate-900">TU Munich</p>
        <div className="mt-3 space-y-1.5">
          {["Deadline: 15 Jun", "Documents: 4 of 5", "Portal link saved"].map((line) => (
            <div key={line} className="rounded-md bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-800">{line}</div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function WorkspacePreview() {
  const [activePanel, setActivePanel] = useState("deadline");
  const [selectedRecord, setSelectedRecord] = useState(applications[0].name);
  const panel = recordPanels[activePanel];
  const selected = applications.find((app) => app.name === selectedRecord) || applications[0];

  const panelTone = {
    amber: "border-amber-200 bg-amber-50 text-amber-950",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-950",
    violet: "border-violet-200 bg-violet-50 text-violet-950",
  }[panel.tone];
  const panelAccent = {
    amber: "text-amber-700",
    emerald: "text-emerald-700",
    violet: "text-violet-700",
  }[panel.tone];

  return (
    <div id="example-tracker" className="mx-4 mt-10 max-w-[358px] scroll-mt-24 sm:mx-auto sm:max-w-6xl sm:px-6">
      <motion.div
        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10"
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          </div>
          <div className="hidden text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 sm:block">Spreadsheet to structured workspace</div>
          <div className="hidden text-[10px] font-semibold text-slate-400 sm:block">applume.app</div>
        </div>

        <div className="grid lg:grid-cols-[0.88fr_1.12fr]">
          <div className="border-b border-slate-200 bg-slate-950 p-5 text-white lg:border-b-0 lg:border-r">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Before</p>
                <h3 className="mt-1 text-lg font-black">A sheet that keeps growing</h3>
              </div>
              <span className="hidden rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-slate-300 sm:inline">fragile rows</span>
            </div>
            <div className="overflow-hidden rounded-lg border border-white/10">
              {oldSheetRows.map((row, rowIndex) => (
                <div
                  key={row.join("-")}
                  className="grid grid-cols-4 border-b border-white/10 last:border-b-0"
                >
                  {row.map((cell, cellIndex) => (
                    <span
                      key={`${cell}-${cellIndex}`}
                      className={`truncate px-2.5 py-2 text-[11px] ${rowIndex === 0 ? "bg-white/10 font-black text-slate-300" : cell === "?" || cell === "" || cell === "notes?" ? "bg-rose-500/10 font-semibold text-rose-200" : "text-slate-400"}`}
                    >
                      {cell || "-"}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-400">
              Helpful at the start. Hard to trust once every application needs documents, portals, notes, and dates.
            </p>
          </div>

          <div className="bg-[#f7f5ef] p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">After</p>
                <h3 className="mt-1 text-xl font-black text-slate-950">Records with the context built in</h3>
              </div>
              <motion.button type="button" className="rounded-lg bg-slate-950 px-4 py-2 text-xs font-bold text-white" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Add record
              </motion.button>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_0.78fr]">
              <div className="space-y-3">
                {applications.map(({ name, detail, status, tone, meta }) => {
                  const toneClass = {
                    amber: "bg-amber-100 text-amber-800",
                    blue: "bg-blue-100 text-blue-800",
                    emerald: "bg-emerald-100 text-emerald-800",
                  }[tone];
                  return (
                    <motion.button
                      key={name}
                      type="button"
                      onClick={() => setSelectedRecord(name)}
                      className={`w-full rounded-lg border p-4 text-left transition ${selectedRecord === name ? "border-emerald-300 bg-white shadow-md shadow-emerald-900/5" : "border-slate-200 bg-white/80 hover:border-slate-300"}`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-slate-950">{name}</p>
                          <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">{detail}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ${toneClass}`}>{status}</span>
                      </div>
                      <div className="mt-4 grid grid-cols-1 gap-2 text-[10px] font-bold text-slate-500 min-[390px]:grid-cols-3">
                        {meta.map((item) => (
                          <span key={item} className="rounded-md bg-slate-50 px-2 py-1.5">{item}</span>
                        ))}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-1 rounded-lg bg-white p-1">
                  {Object.entries(recordPanels).map(([key, item]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActivePanel(key)}
                      className={`rounded-md px-2 py-2 text-[10px] font-black transition ${activePanel === key ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100"}`}
                    >
                      {item.nav}
                    </button>
                  ))}
                </div>
                <motion.div
                  key={activePanel}
                  className={`rounded-lg border p-4 ${panelTone}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className={`text-xs font-black uppercase tracking-[0.18em] ${panelAccent}`}>{panel.label}</p>
                  <p className="mt-3 text-3xl font-black text-slate-950">{panel.title}</p>
                  <p className="text-xs font-semibold opacity-75">{panel.detail}</p>
                  <div className="mt-3 space-y-2">
                    {panel.items.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs font-bold">
                        <Icon name="check" className={`h-3.5 w-3.5 ${panelAccent}`} />
                        {item}
                      </div>
                    ))}
                  </div>
                </motion.div>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Selected record</p>
                  <p className="mt-2 text-sm font-black text-slate-950">{selected.name}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{selected.detail}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function PainCard({ icon, title, copy, tone = "emerald", delay }) {
  const iconTone = {
    emerald: "text-emerald-300",
    amber: "text-amber-300",
    blue: "text-blue-300",
    violet: "text-violet-300",
    slate: "text-slate-300",
  }[tone];

  return (
    <Reveal delay={delay} className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
      <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 280, damping: 22 }}>
        <div className={`mb-5 grid h-10 w-10 place-items-center rounded-lg bg-white/10 ${iconTone}`}>
          <Icon name={icon} className="h-4 w-4" />
        </div>
        <h3 className="text-base font-black">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
      </motion.div>
    </Reveal>
  );
}

function DossierSection() {
  return (
    <section id="features" className="scroll-mt-20 bg-[#f7f5ef] px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <Reveal>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">The Applume record</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Every application gets a dossier, not just a row.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Keep the practical speed of a spreadsheet, then add the structure that high-volume applications actually need.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {dossierItems.map((item) => (
                <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                  <p className="mt-2 text-sm font-black text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Dossier preview</p>
                  <h3 className="mt-2 text-2xl font-black text-slate-950">Application details stay together.</h3>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-black text-amber-800">7 days left</span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["Portal link", "Saved with login notes"],
                  ["Documents", "CV, transcript, portfolio"],
                  ["Program notes", "Requirements and modules"],
                  ["Next step", "Upload certified transcript"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-700">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-dashed border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-black text-emerald-900">AI fill keeps the first draft moving.</p>
                <p className="mt-1 text-xs leading-5 text-emerald-800/70">
                  Paste a role description or admissions page. Applume prepares fields you can review before saving.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function WorkflowSection() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-white px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Views for your workflow</p>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Ask better questions than a spreadsheet can answer.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Switch views based on what you are trying to do: scan, decide, prepare, or follow up.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {workflowViews.map((view, index) => (
            <Reveal key={view.title} delay={index * 0.08} className="rounded-lg border border-slate-200 bg-[#f7f5ef] p-6">
              <ToneIcon icon={view.icon} tone={index === 0 ? "emerald" : index === 1 ? "blue" : "violet"} />
              <h3 className="mt-5 text-lg font-black text-slate-950">{view.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{view.copy}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-6 rounded-xl border border-slate-200 bg-slate-950 p-6 text-white sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Export anytime</p>
              <h3 className="mt-4 text-3xl font-black leading-tight">Your data stays portable.</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Download CSV when you want spreadsheet flexibility, or JSON when you want a full backup.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-white px-4 py-4 text-slate-950">
                <p className="text-xs font-black">applications.csv</p>
                <p className="mt-1 text-[10px] font-semibold text-slate-500">Readable in Sheets or Excel</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/10 px-4 py-4">
                <p className="text-xs font-black">backup.json</p>
                <p className="mt-1 text-[10px] font-semibold text-slate-400">Full tracker backup</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function LandingPage({ onGetStarted }) {
  const { scrollY } = useScroll();
  const sheetY = useSpring(useTransform(scrollY, [0, 700], [0, -90]), { stiffness: 70, damping: 24 });
  const recordY = useSpring(useTransform(scrollY, [0, 700], [0, 70]), { stiffness: 70, damping: 24 });
  const routeScale = useSpring(useTransform(scrollY, [0, 520], [0.2, 1]), { stiffness: 90, damping: 26 });

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
            <motion.button type="button" onClick={onGetStarted} className="hidden rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white sm:block" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              Sign in
            </motion.button>
            <motion.button type="button" onClick={onGetStarted} className="hidden rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 sm:inline-flex" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <span>Start tracking free</span>
            </motion.button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden px-4 pb-12 pt-16 text-center sm:px-6 sm:pt-24">
        <HeroScene sheetY={sheetY} recordY={recordY} routeScale={routeScale} />
        <div className="relative z-10 mx-auto max-w-4xl">
          <span className="inline-flex max-w-[calc(100vw-2rem)] items-center justify-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700 shadow-sm sm:px-4 sm:text-[11px] sm:tracking-[0.2em]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="sm:hidden">Spreadsheet escapees</span>
            <span className="hidden sm:inline">No more spreadsheet chaos</span>
          </span>

          <h1
            className="mx-auto mt-7 max-w-[22rem] text-[2.1rem] font-black leading-[1.06] tracking-tight min-[420px]:max-w-4xl min-[420px]:text-[2.3rem] sm:text-[3.75rem] lg:text-[4.65rem]"
          >
            <span className="block sm:inline">Track every </span>
            <span className="block sm:inline">university and job </span>
            <span className="block sm:inline">application in one </span>
            <span className="block sm:inline">organized workspace.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-[18rem] text-base leading-7 text-slate-600 sm:max-w-2xl sm:text-lg sm:leading-8">
            <span className="sm:hidden">Track applications with deadlines, docs, links, and next steps.</span>
            <span className="hidden sm:inline">Applume helps you manage deadlines, required documents, portal links, notes, statuses, and next steps without messy spreadsheets.</span>
          </p>

          <div
            className="mx-auto mt-7 grid max-w-3xl gap-2 text-left text-xs font-black text-slate-600 sm:grid-cols-3"
          >
            {["No messy spreadsheets", "No missed deadlines", "No lost portal links"].map((item) => (
              <span key={item} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center shadow-sm">
                {item}
              </span>
            ))}
          </div>

          <div
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <motion.button type="button" onClick={onGetStarted} className="w-full rounded-lg bg-slate-950 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-slate-900/20 transition hover:bg-slate-800 sm:w-auto" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              Build my tracker
            </motion.button>
            <motion.a href="#example-tracker" className="w-full rounded-lg border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              View example tracker
            </motion.a>
          </div>

          <motion.p
            className="mx-auto mt-5 max-w-xl text-xs leading-5 text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.58, duration: 0.5 }}
          >
            Built for students, graduates, and job seekers managing multiple applications at once.
          </motion.p>
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

      <section id="why-applume" className="scroll-mt-20 bg-slate-950 px-4 py-24 text-white sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Reveal className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">The real problem</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              A spreadsheet works until the search becomes serious.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              The first five applications are easy. The next fifty need deadlines, documents, portal links, interview notes, and a reliable next action.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pains.map((item, index) => (
              <PainCard key={item.title} {...item} delay={index * 0.06} />
            ))}
          </div>
        </div>
      </section>

      <DossierSection />
      <WorkflowSection />

      <section className="bg-[#f7f5ef] px-4 py-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-3">
          {[
            { icon: "shield", title: "Private by design", copy: "Your tracker belongs to your account. Shared tracker links are intentional, not automatic.", tone: "emerald" },
            { icon: "download", title: "No lock-in", copy: "Export CSV or JSON whenever you want. Applume improves the spreadsheet without trapping your data.", tone: "blue" },
            { icon: "messageSquare", title: "Built from feedback", copy: "The product includes an in-app feedback channel so real application workflows can shape what comes next.", tone: "violet" },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <ToneIcon icon={item.icon} tone={item.tone} />
              <h3 className="mt-5 text-lg font-black text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-[#f7f5ef] px-4 pb-24 sm:px-6">
        <Reveal className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-slate-950 px-6 py-16 text-center text-white shadow-2xl shadow-slate-900/15 sm:px-12">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Bring order to the list</p>
          <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Turn your application sheet into a finished workspace.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400">
            Keep the speed of a spreadsheet, then add the structure needed to stay prepared and consistent.
          </p>
          <motion.button type="button" onClick={onGetStarted} className="mt-8 rounded-lg bg-emerald-500 px-9 py-4 text-base font-bold text-white shadow-xl shadow-emerald-500/25 transition hover:bg-emerald-400" whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
            Create your tracker
          </motion.button>
        </Reveal>
      </section>

      <LandingFooter />
    </div>
  );
}
