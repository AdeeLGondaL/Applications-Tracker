import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

const pipelineStages = [
  { label: "Saved", count: 12 },
  { label: "Preparing", count: 7 },
  { label: "Applied", count: 18 },
  { label: "Interview", count: 4 },
  { label: "Offer", count: 2 },
];

const problemCards = [
  ["Missed deadlines", "Application dates stay buried until the final week."],
  ["Scattered documents", "CVs, transcripts, portfolios, and links drift across folders."],
  ["Messy spreadsheets", "Rows work at first, then lose context as the search grows."],
  ["No clear progress", "It becomes hard to see what needs action today."],
];

const spreadsheetRows = [
  ["TU Munich", "Documents missing", "Deadline soon", "15 Jun"],
  ["Google Internship", "Preparing", "CV ready", "18 Jun"],
  ["DAAD Scholarship", "Applied", "Waiting", "25 Jun"],
  ["Amsterdam University", "Submitted", "Interview pending", "01 Jul"],
];

const features = [
  {
    title: "Application tracker",
    copy: "Track universities, jobs, internships, and scholarships in one place.",
    preview: ["University", "Job", "Internship", "Scholarship"],
    icon: "dashboard",
  },
  {
    title: "Deadline management",
    copy: "See urgent tasks and upcoming deadlines before they become a problem.",
    preview: ["15 Jun", "18 Jun", "01 Jul"],
    icon: "calendar",
  },
  {
    title: "Document checklist",
    copy: "Keep CVs, motivation letters, transcripts, portfolios, and links organized.",
    preview: ["CV", "Transcript", "Portfolio", "Link"],
    icon: "check",
  },
  {
    title: "Status pipeline",
    copy: "Know exactly where every application stands.",
    preview: ["Saved", "Applied", "Interview"],
    icon: "filter",
  },
  {
    title: "Notes and next steps",
    copy: "Store follow-ups, interview notes, requirements, and reminders.",
    preview: ["Follow up", "Prep notes", "Requirement"],
    icon: "edit",
  },
  {
    title: "Progress overview",
    copy: "Understand your application journey with simple visual stats.",
    preview: ["41 total", "4 interviews", "2 offers"],
    icon: "eye",
  },
];

const storySteps = [
  ["Discover opportunity", "Save the role, program, internship, or scholarship before it disappears."],
  ["Save it in Applume", "Turn the source into a structured application record."],
  ["Prepare documents", "Keep every CV, transcript, portfolio, and portal link attached."],
  ["Submit application", "Move the record through the pipeline with a clear next step."],
  ["Track outcome", "Review status, notes, and progress without rebuilding a spreadsheet."],
];

const brand = {
  primary: "#0D9488",
  dark: "#0F766E",
  soft: "#ECFDF5",
  border: "rgba(13,148,136,0.18)",
  shadow: "rgba(13,148,136,0.18)",
};

function PlaneIcon({ className = "" }) {
  return (
    <img src="/Logo.png" alt="" aria-hidden="true" className={`object-contain ${className}`} />
  );
}

function BrandMark({ className = "h-10 w-10" }) {
  return <img src="/Logo.png" alt="Applume" className={`object-contain ${className}`} style={{ mixBlendMode: "multiply" }} />;
}

function ScrollProgress() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 34, restDelta: 0.001 });
  return <motion.div className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-emerald-600" style={{ scaleX: reducedMotion ? 1 : scaleX }} />;
}

function Reveal({ children, className = "", delay = 0 }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 32 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.18 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
      {children}
    </p>
  );
}

function GlassCard({ children, className = "" }) {
  return (
    <div className={`rounded-[2rem] border border-[rgba(15,23,42,0.08)] bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}

function FloatingPlaneJourney() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["6vh", "88vh"]);
  const x = useTransform(scrollYProgress, [0, 0.22, 0.48, 0.72, 1], ["78vw", "66vw", "17vw", "72vw", "50vw"]);
  const rotate = useTransform(scrollYProgress, [0, 0.22, 0.48, 0.72, 1], [-8, 18, 138, 28, 92]);
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.92, 1], [0, 1, 1, 0.9]);

  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-20 hidden overflow-hidden lg:block" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M78 7 C88 18, 58 26, 67 39 C76 55, 20 52, 18 69 C17 84, 72 78, 50 93" stroke={brand.primary} strokeWidth="0.18" strokeDasharray="1 1.8" fill="none" filter="url(#softTrail)" />
        <defs>
          <filter id="softTrail">
            <feGaussianBlur stdDeviation="0.08" />
          </filter>
        </defs>
      </svg>
      <motion.div className="absolute left-0 top-0 drop-shadow-[0_16px_28px_rgba(13,148,136,0.22)]" style={{ x, y, rotate, opacity }}>
        <PlaneIcon className="h-11 w-11" />
      </motion.div>
    </div>
  );
}

function MobileMenu({ onGetStarted }) {
  const [open, setOpen] = useState(false);
  const links = [
    ["Features", "#features"],
    ["How it works", "#how-it-works"],
    ["Pricing", "#pricing"],
    ["FAQ", "#faq"],
  ];

  return (
    <div className="sm:hidden">
      <button type="button" aria-label="Open navigation menu" onClick={() => setOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white/80 text-slate-900 shadow-sm">
        <span className="flex h-4 w-5 flex-col justify-between">
          <span className="h-0.5 rounded-full bg-current" />
          <span className="h-0.5 rounded-full bg-current" />
          <span className="h-0.5 rounded-full bg-current" />
        </span>
      </button>
      {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="absolute left-4 right-4 top-[4.6rem] rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
          <div className="grid gap-1">
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
                {label}
              </a>
            ))}
          </div>
          <button type="button" onClick={onGetStarted} className="mt-3 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700">
            Start free
          </button>
        </motion.div>
      )}
    </div>
  );
}

function Navigation({ onGetStarted }) {
  return (
    <nav className="sticky top-0 z-[70] border-b border-[rgba(15,23,42,0.08)] bg-[#FAFAF7]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3" aria-label="Applume home">
          <BrandMark />
          <span className="text-lg font-black tracking-tight text-slate-950">Applume</span>
        </a>
        <div className="hidden items-center gap-8 text-sm font-bold text-slate-500 sm:flex">
          <a href="#features" className="transition hover:text-slate-950">Features</a>
          <a href="#how-it-works" className="transition hover:text-slate-950">How it works</a>
          <a href="#pricing" className="transition hover:text-slate-950">Pricing</a>
          <a href="#faq" className="transition hover:text-slate-950">FAQ</a>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <button type="button" onClick={onGetStarted} className="rounded-full px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-white hover:text-slate-950">
            Log in
          </button>
          <button type="button" onClick={onGetStarted} className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700">
            Start free
          </button>
        </div>
        <MobileMenu onGetStarted={onGetStarted} />
      </div>
    </nav>
  );
}

function ProductMockup() {
  const reducedMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const statuses = ["Saved", "Preparing", "Applied", "Interview", "Offer"];

  function handleMove(event) {
    if (reducedMotion || window.innerWidth < 1024) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: y * -5, rotateY: x * 7 });
  }

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ rotateX: 0, rotateY: 0 })}
      animate={tilt}
      transition={{ type: "spring", stiffness: 140, damping: 20 }}
      className="relative mx-auto w-full max-w-[calc(100vw-2rem)] overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/85 p-2 shadow-[0_32px_90px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:max-w-2xl sm:p-3"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="grid min-h-[31rem] min-w-0 overflow-hidden rounded-[1.55rem] border border-slate-200 bg-white text-slate-950 lg:grid-cols-[12rem_1fr]">
        <aside className="hidden border-r border-slate-200 bg-slate-50/70 p-5 lg:block">
          <div className="mb-8 flex items-center gap-2 text-emerald-700">
            <PlaneIcon className="h-6 w-6" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Applume</span>
          </div>
          {["Dashboard", "Applications", "Documents", "Calendar", "Settings"].map((item, index) => (
            <div key={item} className={`mb-2 rounded-2xl px-3 py-2 text-sm font-bold ${index === 0 ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100" : "text-slate-500"}`}>
              {item}
            </div>
          ))}
        </aside>
        <div className="min-w-0 bg-[#f8fafc] p-4 text-slate-950 sm:p-5">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700 sm:tracking-[0.2em]">Application workspace</p>
              <h3 className="mt-2 text-2xl font-black leading-tight">Today needs attention</h3>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-black text-amber-800">3 deadlines</div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["Total", "41"],
              ["Preparing", "7"],
              ["Interviews", "4"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-black">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {statuses.map((status, index) => (
              <div key={status} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{status}</p>
                <div className="mt-3 space-y-2">
                  {index < 3 && (
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <p className="text-xs font-black">{index === 0 ? "DAAD Scholarship" : index === 1 ? "Google Internship" : "TU Munich"}</p>
                      <p className="mt-1 text-[11px] font-bold text-slate-500">{index === 2 ? "Deadline 15 Jun" : "Documents ready"}</p>
                    </div>
                  )}
                  {index === 3 && (
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                      <p className="text-xs font-black">Amsterdam Univ.</p>
                      <p className="mt-1 text-[11px] font-bold text-emerald-700">Interview pending</p>
                    </div>
                  )}
                  {index === 4 && (
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                      <p className="text-xs font-black">Offer</p>
                      <p className="mt-1 text-[11px] font-bold text-emerald-700">2 active</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_0.85fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Document checklist</p>
              {["CV ready", "Transcript pending", "Portfolio linked"].map((item, index) => (
                <div key={item} className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <span className={`grid h-5 w-5 place-items-center rounded-md border ${index === 1 ? "border-amber-200 bg-amber-50 text-amber-600" : "border-emerald-200 bg-emerald-50 text-emerald-600"}`}>
                    <Icon name={index === 1 ? "calendar" : "check"} className="h-3 w-3" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Next step</p>
              <p className="mt-3 text-sm font-bold leading-6 text-slate-700">Upload certified transcript before submission.</p>
            </div>
          </div>
        </div>
      </div>
      <motion.div className="absolute -left-6 top-16 hidden rounded-3xl border border-white/70 bg-white/90 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl lg:block" animate={reducedMotion ? undefined : { y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
        <p className="text-xs font-black text-slate-950">Deadline radar</p>
        <p className="mt-1 text-xs font-bold text-amber-600">TU Munich in 4 days</p>
      </motion.div>
      <motion.div className="absolute -right-8 bottom-16 hidden rounded-3xl border border-white/70 bg-white/90 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl lg:block" animate={reducedMotion ? undefined : { y: [0, 12, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}>
        <p className="text-xs font-black text-slate-950">Progress</p>
        <p className="mt-1 text-xs font-bold text-emerald-700">24 applications active</p>
      </motion.div>
    </motion.div>
  );
}

function HeroSection({ onGetStarted }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const planeX = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0, 40, 20, -20]);
  const planeY = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0, -20, 20, 58]);
  const planeRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-12, 12, 42]);
  const mockupScale = useTransform(scrollYProgress, [0, 0.6, 1], [0.96, 1, 1.03]);
  const mockupOpacity = useTransform(scrollYProgress, [0, 0.2, 1], [0.72, 1, 1]);

  return (
    <section ref={ref} className="relative min-h-[125vh] overflow-hidden bg-[#FAFAF7] px-4 sm:px-6">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(13,148,136,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(13,148,136,0.055)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-200/35 blur-3xl" />
      <div className="sticky top-20 mx-auto grid w-full max-w-7xl min-w-0 min-h-[min(calc(100vh-5rem),860px)] items-center gap-12 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
        <div className="relative z-10 w-full max-w-[calc(100vw-2rem)] min-w-0 lg:max-w-none">
          <motion.div className="mb-7 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-emerald-800 shadow-sm backdrop-blur-xl sm:text-xs sm:tracking-[0.14em]" initial={false}>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="min-w-0 whitespace-normal">Built for students, job seekers, and applicants</span>
          </motion.div>
          <h1 className="max-w-3xl text-[2.75rem] font-black leading-[0.98] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Replace your{" "}
            <span className="relative inline-block text-emerald-600">
              <span className="relative z-10">application spreadsheet</span>
              <span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-emerald-200/70" />
            </span>
            .
          </h1>
          <p className="mt-7 max-w-[22rem] break-words text-lg leading-8 text-slate-600 sm:max-w-2xl sm:text-xl">
            Track deadlines, documents, statuses, and next steps for every university or job application in one organized workspace.
          </p>
          <div className="mt-9 flex w-full max-w-[22rem] flex-col gap-3 sm:max-w-none sm:flex-row">
            <button type="button" onClick={onGetStarted} className="w-full rounded-full bg-emerald-600 px-7 py-4 text-base font-black text-white shadow-xl shadow-emerald-600/25 transition hover:-translate-y-0.5 hover:bg-emerald-700 sm:w-auto">
              Start tracking for free
            </button>
            <a href="#how-it-works" className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white/75 px-7 py-4 text-center text-base font-black text-slate-800 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white sm:w-auto">
              See how it works
              <span className="grid h-6 w-6 place-items-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">&gt;</span>
            </a>
          </div>
          <p className="mt-5 flex max-w-[22rem] items-start gap-2 text-sm font-bold leading-6 text-slate-500 sm:max-w-none">
            <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
            <span>No more messy spreadsheets. No more missed deadlines.</span>
          </p>
        </div>
        <motion.div className="relative z-10 w-full max-w-[calc(100vw-2rem)] min-w-0 justify-self-center lg:max-w-none" style={{ scale: reducedMotion ? 1 : mockupScale, opacity: reducedMotion ? 1 : mockupOpacity }}>
          <motion.div className="absolute -left-2 -top-12 z-10 drop-shadow-[0_16px_30px_rgba(13,148,136,0.25)] sm:-left-10" style={{ x: reducedMotion ? 0 : planeX, y: reducedMotion ? 0 : planeY, rotate: reducedMotion ? -12 : planeRotate }}>
            <PlaneIcon className="h-12 w-12 sm:h-16 sm:w-16" />
          </motion.div>
          <ProductMockup />
        </motion.div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="bg-[#FAFAF7] px-4 py-28 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionLabel>Problem</SectionLabel>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">Application tracking should not feel chaotic.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Applume gives scattered application work a clear home: deadlines, documents, notes, statuses, and next steps.</p>
        </Reveal>
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {problemCards.map(([title, copy], index) => (
            <Reveal key={title} delay={index * 0.06}>
              <GlassCard className="h-full p-6">
                <div className={`grid h-11 w-11 place-items-center rounded-2xl ${index === 0 ? "bg-rose-50 text-rose-600" : index === 1 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-700"}`}>
                  <Icon name={index === 0 ? "calendar" : index === 1 ? "copy" : index === 2 ? "dashboard" : "eye"} />
                </div>
                <h3 className="mt-8 text-xl font-black text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpreadsheetTransformSection() {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const sheetOpacity = useTransform(scrollYProgress, [0.1, 0.55], [1, 0.22]);
  const sheetScale = useTransform(scrollYProgress, [0.1, 0.65], [1, 0.92]);
  const cardsY = useTransform(scrollYProgress, [0.2, 0.78], [90, 0]);
  const cardsOpacity = useTransform(scrollYProgress, [0.25, 0.62], [0, 1]);

  return (
    <section ref={ref} id="how-it-works" className="relative overflow-hidden bg-white px-4 py-28 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionLabel>From chaos to clarity</SectionLabel>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">Messy spreadsheet {"->"} organized tracker.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Rows become application records with deadlines, documents, statuses, and next steps attached.</p>
        </Reveal>
        <div className="relative mt-16 min-h-[38rem]">
          <motion.div className="absolute inset-x-0 top-0 mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-slate-50/80 p-5 shadow-xl shadow-slate-200/50" style={{ opacity: reducedMotion ? 0.35 : sheetOpacity, scale: reducedMotion ? 0.96 : sheetScale }}>
            <div className="grid grid-cols-4 gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              {["Application", "Status", "Documents", "Deadline"].map((heading) => (
                <div key={heading} className="rounded-xl bg-white px-3 py-3">{heading}</div>
              ))}
            </div>
            <div className="mt-2 grid gap-2">
              {spreadsheetRows.map((row) => (
                <div key={row[0]} className="grid grid-cols-4 gap-2 text-sm font-bold text-slate-600">
                  {row.map((cell) => (
                    <div key={cell} className="truncate rounded-xl border border-slate-200 bg-white px-3 py-4">{cell}</div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div className="absolute inset-x-0 top-16 mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ y: reducedMotion ? 0 : cardsY, opacity: reducedMotion ? 1 : cardsOpacity }}>
            {spreadsheetRows.map((row, index) => (
              <GlassCard key={row[0]} className="p-5">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{row[1]}</span>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">{row[3]}</span>
                </div>
                <h3 className="text-xl font-black text-slate-950">{row[0]}</h3>
                <p className="mt-2 text-sm font-bold text-slate-500">{row[2]}</p>
                <div className="mt-6 h-2 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-400" style={{ width: `${44 + index * 12}%` }} />
                </div>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PipelineSection() {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const lineScale = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);
  const planeX = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "94%"]);

  return (
    <section ref={ref} className="overflow-hidden bg-[#FAFAF7] px-4 py-28 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionLabel>Pipeline</SectionLabel>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">Follow every application from saved to offer.</h2>
        </Reveal>
        <div className="relative mt-16 rounded-[2rem] border border-[rgba(15,23,42,0.08)] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="absolute left-8 right-8 top-1/2 hidden h-1 -translate-y-1/2 rounded-full bg-slate-100 lg:block">
            <motion.div className="h-full origin-left rounded-full bg-gradient-to-r from-emerald-700 via-emerald-500 to-teal-300" style={{ scaleX: reducedMotion ? 1 : lineScale }} />
            <motion.div className="absolute -top-5 drop-shadow-[0_12px_24px_rgba(13,148,136,0.22)]" style={{ left: reducedMotion ? "94%" : planeX }}>
              <PlaneIcon className="h-10 w-10 rotate-45" />
            </motion.div>
          </div>
          <div className="relative z-10 grid gap-4 lg:grid-cols-5">
            {pipelineStages.map((stage, index) => (
              <Reveal key={stage.label} delay={index * 0.06}>
                <motion.div whileInView={reducedMotion ? undefined : { scale: [0.96, 1.03, 1] }} viewport={{ once: false, amount: 0.7 }} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-200 hover:shadow-[0_20px_50px_rgba(13,148,136,0.12)]">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{stage.label}</p>
                  <motion.p className="mt-6 text-5xl font-black text-slate-950" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}>
                    {stage.count}
                  </motion.p>
                  <p className="mt-2 text-sm font-bold text-slate-500">applications</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section id="features" className="bg-white px-4 py-28 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl">
          <SectionLabel>Features</SectionLabel>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">A premium workspace for the full application workflow.</h2>
        </Reveal>
        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={(index % 3) * 0.06} className={index === 0 || index === 5 ? "lg:col-span-2" : ""}>
              <GlassCard className="group h-full overflow-hidden p-6 transition duration-500 hover:-translate-y-1 hover:shadow-[0_36px_100px_rgba(13,148,136,0.14)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Icon name={feature.icon} className="h-5 w-5" />
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Applume</div>
                </div>
                <h3 className="mt-8 text-2xl font-black text-slate-950">{feature.title}</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">{feature.copy}</p>
                <div className="mt-8 rounded-[1.35rem] border border-slate-200 bg-slate-50 p-3">
                  <div className="grid gap-2">
                    {feature.preview.map((item) => (
                      <div key={item} className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm">{item}</div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScrollStorySection() {
  return (
    <section className="bg-[#FAFAF7] px-4 py-28 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionLabel>Scroll story</SectionLabel>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">From opportunity to outcome.</h2>
        </Reveal>
        <div className="relative mt-16">
          <div className="absolute bottom-0 left-5 top-0 w-px bg-gradient-to-b from-emerald-600 via-teal-400 to-emerald-200 sm:left-1/2" />
          {storySteps.map(([title, copy], index) => (
            <Reveal key={title} delay={index * 0.04} className={`relative mb-8 flex ${index % 2 === 0 ? "sm:justify-start" : "sm:justify-end"}`}>
              <div className="absolute left-0 top-7 grid h-10 w-10 place-items-center rounded-full border border-white bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 sm:left-1/2 sm:-translate-x-1/2">
                {index + 1}
              </div>
              <GlassCard className="ml-16 w-full p-6 sm:ml-0 sm:w-[44%]">
                <div className="mb-5 drop-shadow-[0_12px_24px_rgba(13,148,136,0.18)]">
                  <PlaneIcon className="h-7 w-7 rotate-45" />
                </div>
                <h3 className="text-2xl font-black text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
                <div className="mt-6 rounded-2xl bg-slate-50 p-3">
                  <div className="h-2 w-2/3 rounded-full bg-emerald-200" />
                  <div className="mt-3 h-2 w-1/2 rounded-full bg-teal-100" />
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingFAQ({ onGetStarted }) {
  const faqs = [
    ["Is Applume only for jobs?", "No. It is built for universities, jobs, internships, and scholarships."],
    ["Can I start without importing data?", "Yes. Start with one record, then add applications as you go."],
    ["Will I keep control of my data?", "Yes. Applume focuses on private account data and exportable records."],
  ];

  return (
    <section className="bg-white px-4 py-24 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <GlassCard id="pricing" className="p-8">
          <SectionLabel>Pricing</SectionLabel>
          <h2 className="mt-5 text-4xl font-black text-slate-950">Start free while Applume grows.</h2>
          <p className="mt-4 text-slate-600">Create a tracker, organize your records, and help shape the product with feedback.</p>
          <button type="button" onClick={onGetStarted} className="mt-8 rounded-full bg-emerald-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700">Start tracking for free</button>
        </GlassCard>
        <div id="faq" className="grid gap-4">
          {faqs.map(([question, answer]) => (
            <GlassCard key={question} className="p-6">
              <h3 className="text-xl font-black text-slate-950">{question}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onGetStarted }) {
  const reducedMotion = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-[#FAFAF7] px-4 py-28 sm:px-6">
      <motion.div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(13,148,136,0.20),transparent_34%),radial-gradient(circle_at_72%_62%,rgba(16,185,129,0.14),transparent_34%),radial-gradient(circle_at_28%_72%,rgba(236,253,245,0.92),transparent_32%)]" animate={reducedMotion ? undefined : { scale: [1, 1.04, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
      <Reveal className="relative mx-auto max-w-5xl rounded-[2.5rem] border border-white/80 bg-white/80 p-8 text-center shadow-[0_40px_120px_rgba(15,23,42,0.14)] backdrop-blur-2xl sm:p-14">
        <div className="mx-auto mb-8 grid h-16 w-16 place-items-center rounded-[1.4rem] border border-emerald-100 bg-white shadow-xl shadow-emerald-600/20">
          <PlaneIcon className="h-8 w-8 rotate-45" />
        </div>
        <h2 className="text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">Stop managing your future in a spreadsheet.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">Build a clearer application workflow with Applume.</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={onGetStarted} className="rounded-full bg-emerald-600 px-8 py-4 text-base font-black text-white shadow-xl shadow-emerald-600/25 transition hover:-translate-y-0.5 hover:bg-emerald-700">Start tracking for free</button>
          <a href="#how-it-works" className="rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5">View demo</a>
        </div>
      </Reveal>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t border-[rgba(15,23,42,0.08)] bg-white px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm font-bold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-slate-950">
          <PlaneIcon className="h-5 w-5 rotate-45" />
          <span>Applume</span>
        </div>
        <div className="flex gap-5">
          <a href="/privacy" className="hover:text-slate-950">Privacy</a>
          <a href="#features" className="hover:text-slate-950">Features</a>
          <a href="#faq" className="hover:text-slate-950">FAQ</a>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FAFAF7] font-sans text-slate-950 antialiased">
      <ScrollProgress />
      <FloatingPlaneJourney />
      <Navigation onGetStarted={onGetStarted} />
      <main>
        <HeroSection onGetStarted={onGetStarted} />
        <ProblemSection />
        <SpreadsheetTransformSection />
        <PipelineSection />
        <FeatureSection />
        <ScrollStorySection />
        <PricingFAQ onGetStarted={onGetStarted} />
        <FinalCTA onGetStarted={onGetStarted} />
      </main>
      <LandingFooter />
    </div>
  );
}
