import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

function FadeUp({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function LandingFooter() {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.origin : "https://applybuddy-a3m.pages.dev";
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
    { label: "WhatsApp",    href: `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + url)}` },
    { label: "LinkedIn",    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { label: "X / Twitter", href: `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}` },
  ];

  return (
    <footer className="border-t border-slate-100 pb-8 pt-12 text-center">
      <p className="text-sm font-black text-slate-800">Know someone still tracking applications in spreadsheets?</p>
      <p className="mt-1 text-xs text-slate-500">Share ApplyBuddy — free forever, no credit card, no ads.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        {typeof navigator !== "undefined" && !!navigator.share && (
          <button type="button" onClick={handleNativeShare} className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100">
            <Icon name="share" className="h-3.5 w-3.5" /> Share
          </button>
        )}
        <button type="button" onClick={handleCopy} className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-bold transition ${copied ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"}`}>
          <Icon name={copied ? "check" : "copy"} className="h-3.5 w-3.5" />
          {copied ? "Copied!" : "Copy link"}
        </button>
        {socials.map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
            {label}
          </a>
        ))}
      </div>
      <p className="mt-8 text-xs text-slate-400">
        © {new Date().getFullYear()} ApplyBuddy · Free forever · No credit card required
        {" · "}
        <a href="/privacy" className="text-slate-400 transition-colors hover:text-slate-600">Privacy Policy</a>
      </p>
    </footer>
  );
}

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-950">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 border-b border-slate-100/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <img src="/Logo.png" alt="ApplyBuddy" className="h-8 w-8 object-contain" style={{ mixBlendMode: "multiply" }} />
            <span className="text-sm font-black tracking-tight">
              <span className="text-slate-950">Apply</span><span className="text-emerald-600">Buddy</span>
            </span>
          </div>
          <div className="hidden items-center gap-7 text-sm font-semibold text-slate-500 sm:flex">
            <a href="#features" className="transition hover:text-slate-950">Features</a>
            <a href="#how-it-works" className="transition hover:text-slate-950">How it works</a>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onGetStarted} className="hidden rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:block">
              Sign in
            </button>
            <button type="button" onClick={onGetStarted} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800">
              Get started free
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 pb-0 pt-20 text-center sm:pt-28">
        {/* Ambient glow orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-emerald-400/[0.12] blur-3xl" />
          <div className="absolute right-0 top-1/2 h-[350px] w-[400px] translate-x-1/3 rounded-full bg-teal-300/[0.08] blur-3xl" />
          <div className="absolute left-0 top-1/2 h-[250px] w-[300px] -translate-x-1/3 rounded-full bg-emerald-200/[0.1] blur-3xl" />
        </div>

        {/* Announcement badge */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Free forever · No credit card · GDPR compliant
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="mx-auto mt-8 max-w-3xl text-[2.9rem] font-black leading-[1.05] tracking-tight sm:text-[3.75rem] lg:text-[4.5rem]"
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Track every application.
          <br />
          <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Miss nothing.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mx-auto mt-5 max-w-lg text-lg leading-8 text-slate-500"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.5 }}
        >
          One dashboard for university admissions and job applications.
          Deadlines, statuses, documents — always at a glance.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.45 }}
        >
          <button
            type="button"
            onClick={onGetStarted}
            className="rounded-2xl bg-slate-950 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-slate-900/20 transition hover:bg-slate-800 active:scale-[0.98]"
          >
            Start tracking for free →
          </button>
          <button
            type="button"
            onClick={onGetStarted}
            className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Sign in to your account
          </button>
        </motion.div>

        {/* Trust row */}
        <motion.div
          className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-400"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        >
          {["Always free", "No spreadsheets", "Row-level security", "Export anytime"].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 13 4 4L19 7" />
              </svg>
              {item}
            </span>
          ))}
        </motion.div>

        {/* App mockup */}
        <motion.div
          className="relative mx-auto mt-16 max-w-[58rem]"
          initial={{ opacity: 0, y: 64 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Glow halo */}
          <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[2.5rem] bg-gradient-to-b from-emerald-400/20 via-emerald-300/5 to-transparent blur-2xl" />
          {/* Bottom fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 rounded-b-[2rem] bg-gradient-to-b from-transparent to-white" />

          <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/10">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
              <div className="h-2.5 w-2.5 rounded-full bg-rose-300" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              <div className="mx-auto flex h-5 w-56 items-center justify-center gap-1.5 rounded-md border border-slate-200/60 bg-white px-3 text-[10px] font-medium text-slate-400">
                <svg className="h-2.5 w-2.5 shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0 1 10 0v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2z" clipRule="evenodd" />
                </svg>
                applybuddy-a3m.pages.dev
              </div>
            </div>

            {/* Dashboard layout */}
            <div className="flex min-h-[300px]">
              {/* Sidebar */}
              <div className="hidden w-44 shrink-0 border-r border-slate-100 bg-white p-3 sm:block">
                <div className="mb-4 flex items-center gap-2 px-2 py-1.5">
                  <div className="h-5 w-5 rounded-md bg-emerald-600" />
                  <div className="h-2.5 w-16 rounded bg-slate-900" />
                </div>
                {[
                  { label: "Dashboard",    active: true  },
                  { label: "Universities", active: false },
                  { label: "Jobs",         active: false },
                  { label: "Urgent",       active: false, badge: "3" },
                ].map(({ label, active, badge }) => (
                  <div key={label} className={`mb-0.5 flex items-center justify-between rounded-xl px-2 py-1.5 ${active ? "bg-slate-100" : ""}`}>
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-md ${active ? "bg-emerald-500" : "bg-slate-200"}`} />
                      <span className={`text-[10px] font-semibold ${active ? "text-slate-800" : "text-slate-400"}`}>{label}</span>
                    </div>
                    {badge && <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-black text-white">{badge}</span>}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="flex-1 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="mb-1 h-1.5 w-14 rounded-full bg-slate-200" />
                    <div className="h-4 w-24 rounded-lg bg-slate-900" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-7 w-24 rounded-xl bg-slate-950" />
                    <div className="h-7 w-16 rounded-xl border border-slate-200" />
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {[
                    { v: "12", bg: "bg-slate-50"   },
                    { v: "8",  bg: "bg-blue-50"    },
                    { v: "4",  bg: "bg-violet-50"  },
                    { v: "3",  bg: "bg-rose-50"    },
                    { v: "5",  bg: "bg-emerald-50" },
                  ].map(({ v, bg }, i) => (
                    <div key={i} className={`${bg} rounded-xl p-2.5`}>
                      <div className="mb-1 h-1.5 w-8 rounded-full bg-black/10" />
                      <span className="text-sm font-black text-slate-800">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  {[
                    { name: "TU Munich",    role: "M.Sc. Computer Science",  tag: "7 days left",  tagBg: "bg-amber-100",   tagTxt: "text-amber-700"   },
                    { name: "BMW Group",    role: "Working Student",          tag: "Applied",      tagBg: "bg-blue-100",    tagTxt: "text-blue-700"    },
                    { name: "TU Berlin",    role: "M.Sc. Data Science",       tag: "32 days left", tagBg: "bg-emerald-100", tagTxt: "text-emerald-700" },
                    { name: "Saarland Uni", role: "M.Sc. Artificial Intel.",  tag: "Interview",    tagBg: "bg-violet-100",  tagTxt: "text-violet-700"  },
                  ].map(({ name, role, tag, tagBg, tagTxt }) => (
                    <div key={name} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-6 w-6 shrink-0 rounded-lg bg-slate-200" />
                        <div>
                          <p className="text-[11px] font-bold text-slate-800">{name}</p>
                          <p className="text-[9px] text-slate-400">{role}</p>
                        </div>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${tagBg} ${tagTxt}`}>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="border-y border-slate-100 bg-slate-50/80 py-8">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
            {[
              { value: "100%",  label: "Free forever"        },
              { value: "0",     label: "Credit cards needed"  },
              { value: "GDPR",  label: "Compliant by design"  },
              { value: "2 min", label: "To get started"       },
            ].map(({ value, label }, i) => (
              <FadeUp key={label} delay={i * 0.07}>
                <p className="text-2xl font-black tracking-tight sm:text-3xl">{value}</p>
                <p className="mt-1 text-xs font-semibold text-slate-400">{label}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <FadeUp className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Sound familiar?</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Tracking applications<br />shouldn't be this hard.
            </h2>
          </FadeUp>
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {[
              { icon: "close",  iconBg: "bg-rose-500/20",  iconColor: "text-rose-300",  title: "Deadlines buried in emails",   desc: "By the time you find the portal link, the application window has already closed." },
              { icon: "copy",   iconBg: "bg-amber-500/20", iconColor: "text-amber-300", title: "Spreadsheets that fall apart", desc: "Formulas break, rows get duplicated, columns drift. Nothing stays in sync." },
              { icon: "search", iconBg: "bg-slate-700",    iconColor: "text-slate-300", title: "No idea where you stand",      desc: "Did you submit that one? What's still missing? You genuinely can't tell." },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.1} className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">
                <div className={`mb-5 grid h-11 w-11 place-items-center rounded-2xl ${item.iconBg}`}>
                  <Icon name={item.icon} className={`h-4 w-4 ${item.iconColor}`} />
                </div>
                <h3 className="text-base font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.desc}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES BENTO ── */}
      <section id="features" className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <FadeUp className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">What you get</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Everything you need.<br />Nothing you don't.
            </h2>
          </FadeUp>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* Big card — spans 2 cols */}
            <FadeUp delay={0} className="sm:col-span-2 rounded-3xl border border-slate-100 bg-slate-50 p-7">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-white shadow-lg">
                    <Icon name="dashboard" className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-black">One dashboard for everything</h3>
                  <p className="mt-2.5 text-sm leading-6 text-slate-500">
                    Universities and jobs, side by side. Every status, deadline, and detail — no tabs, no switching, no mental overhead.
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:w-52">
                  {[
                    { label: "All applications", value: "12", bg: "bg-slate-100",   text: "text-slate-900"   },
                    { label: "Due this week",    value: "3",  bg: "bg-rose-100",    text: "text-rose-700"    },
                    { label: "Accepted",         value: "2",  bg: "bg-emerald-100", text: "text-emerald-700" },
                  ].map(({ label, value, bg, text }) => (
                    <div key={label} className={`flex items-center justify-between rounded-2xl px-4 py-2.5 ${bg}`}>
                      <span className={`text-xs font-semibold ${text}`}>{label}</span>
                      <span className={`text-sm font-black ${text}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            {/* Smart deadlines */}
            <FadeUp delay={0.1} className="rounded-3xl border border-amber-100 bg-amber-50 p-7">
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/25">
                <Icon name="calendar" className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black">Smart deadlines</h3>
              <p className="mt-2 text-sm leading-6 text-amber-800/60">
                Only open applications count as urgent. Submitted? Off the clock automatically.
              </p>
              <div className="mt-4 space-y-2">
                {[
                  { name: "TU Munich",    days: "7 days",  bg: "bg-rose-100",  text: "text-rose-600"  },
                  { name: "RWTH Aachen", days: "21 days", bg: "bg-amber-100", text: "text-amber-700" },
                ].map(({ name, days, bg, text }) => (
                  <div key={name} className="flex items-center justify-between rounded-xl border border-amber-100 bg-white px-3 py-2 shadow-sm">
                    <span className="text-xs font-bold text-slate-700">{name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${bg} ${text}`}>{days}</span>
                  </div>
                ))}
              </div>
            </FadeUp>

            {/* AI auto-fill */}
            <FadeUp delay={0.12} className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 to-blue-50 p-7">
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-lg shadow-violet-500/25">
                <Icon name="sparkles" className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black">AI auto-fill</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Paste a job URL or description. AI extracts the name, role, deadline, and requirements instantly.
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-3 py-2.5 text-[10px] font-mono text-slate-400">
                <Icon name="link" className="h-3 w-3 shrink-0 text-violet-400" />
                https://tum.de/admissions/msc-cs
              </div>
            </FadeUp>

            {/* Kanban board */}
            <FadeUp delay={0.14} className="rounded-3xl border border-blue-100 bg-blue-50 p-7">
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/25">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="5" height="14" rx="1" />
                  <rect x="10" y="3" width="5" height="10" rx="1" />
                  <rect x="17" y="3" width="4" height="7" rx="1" />
                </svg>
              </div>
              <h3 className="text-lg font-black">Kanban board</h3>
              <p className="mt-2 text-sm leading-6 text-blue-800/60">
                Drag applications through your pipeline visually. See the full picture at a glance.
              </p>
              <div className="mt-4 flex gap-2">
                {[
                  { label: "Applying",  app: "TU Munich",  bg: "bg-white",       border: "border-blue-100"    },
                  { label: "Submitted", app: "BMW Group",  bg: "bg-emerald-50",  border: "border-emerald-100" },
                ].map(({ label, app, bg, border }) => (
                  <div key={label} className="flex-1">
                    <p className="mb-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                    <div className={`rounded-xl border px-2.5 py-2 text-[10px] font-bold text-slate-700 ${bg} ${border}`}>{app}</div>
                  </div>
                ))}
              </div>
            </FadeUp>

            {/* Calendar sync */}
            <FadeUp delay={0.16} className="rounded-3xl border border-emerald-100 bg-emerald-50 p-7">
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
                <Icon name="calendar" className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black">Calendar sync</h3>
              <p className="mt-2 text-sm leading-6 text-emerald-800/60">
                Subscribe to a live feed. Deadlines appear in Google Calendar automatically — no file downloads, ever.
              </p>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <FadeUp className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Three steps</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Up and running<br />in 60 seconds.
            </h2>
          </FadeUp>
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {[
              { step: "01", icon: "plus",     title: "Add your applications",      desc: "University or job — fill in what you know. Use AI auto-fill to add from a URL in seconds." },
              { step: "02", icon: "calendar", title: "Track every deadline",       desc: "Deadlines sort by urgency automatically. Overdue ones surface immediately — nothing slips." },
              { step: "03", icon: "check",    title: "Stay ahead of the pipeline", desc: "Update statuses as you progress. See what's open, applied, submitted, and accepted at a glance." },
            ].map((item, i) => (
              <FadeUp key={item.step} delay={i * 0.1} className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <span className="pointer-events-none absolute right-4 top-3 select-none text-7xl font-black leading-none text-slate-100">{item.step}</span>
                <div className="relative">
                  <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50">
                    <Icon name={item.icon} className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-black">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <FadeUp>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 px-8 py-20 text-center text-white sm:px-16">
              {/* Glow orbs inside */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/25 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-60 w-60 translate-x-1/3 translate-y-1/3 rounded-full bg-teal-500/15 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/3 translate-y-1/4 rounded-full bg-emerald-600/15 blur-2xl" />
              </div>
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Free forever · No credit card
                </span>
                <h2 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                  Take control of<br />your applications.
                </h2>
                <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-slate-400">
                  A clean dashboard that keeps you ahead — from first deadline to final decision.
                </p>
                <motion.button
                  type="button"
                  onClick={onGetStarted}
                  className="mt-8 rounded-2xl bg-emerald-500 px-10 py-4 text-base font-bold text-white shadow-xl shadow-emerald-500/30 transition hover:bg-emerald-400"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  Create your free account →
                </motion.button>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
