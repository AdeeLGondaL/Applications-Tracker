import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

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
    { label: "WhatsApp",   href: `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + url)}`, hover: "hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700" },
    { label: "LinkedIn",   href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, hover: "hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700" },
    { label: "X / Twitter",href: `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, hover: "hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900" },
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
          className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-bold transition ${
            copied
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          }`}
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
      <p className="mt-8 text-xs text-slate-400">
        © {new Date().getFullYear()} ApplyBuddy · Free forever · No credit card required
      </p>
    </footer>
  );
}

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-white text-slate-950">

      {/* Sticky nav */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img src="/Logo.png" alt="ApplyBuddy" className="h-9 w-9 object-contain" style={{ mixBlendMode: "multiply" }} />
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

      {/* Hero */}
      <section className="relative overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] py-24 sm:py-32">
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700">
              Free · No credit card · No ads
            </span>
          </motion.div>

          <motion.div
            className="mt-6 flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
          >
            <img src="/Logo.png" alt="ApplyBuddy logo" className="h-36 w-36 object-contain sm:h-44 sm:w-44" style={{ mixBlendMode: "multiply" }} />
            <h1 className="text-[4rem] font-black leading-none tracking-tight sm:text-7xl lg:text-8xl">
              <span className="text-slate-950">Apply</span><span className="text-emerald-600">Buddy</span>
            </h1>
          </motion.div>

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
                    ["TU Munich",     "M.Sc. CS",          "7d left",  "amber"],
                    ["Saarland Uni",  "M.Sc. AI",          "14d left", "orange"],
                    ["BMW Group",     "Working Student",    "Applying", "blue"],
                    ["TU Berlin",     "M.Sc. Data Sci",    "32d left", "emerald"],
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
              <svg className="h-5 w-5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem */}
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
              { icon: "close",  title: "Deadlines buried in emails",   desc: "By the time you find the portal link, the application window has already closed." },
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

      {/* Features */}
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
              { icon: "dashboard",  color: "bg-slate-50",   title: "One dashboard",    desc: "All your university and job applications in a single, clean view — no tabs, no switching." },
              { icon: "calendar",   color: "bg-emerald-50", title: "Smart deadlines",  desc: "Only apps still open count as urgent. Submitted or accepted? They drop off the clock." },
              { icon: "university", color: "bg-blue-50",    title: "Full pipeline",    desc: "From Not Open Yet to Accepted — every stage tracked, every status visible at a glance." },
              { icon: "check",      color: "bg-slate-50",   title: "Private by design",desc: "Row-level security via Supabase. Your applications are only ever visible to you." },
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

      {/* How it works */}
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
              { step: "01", icon: "plus",      title: "Add your applications",      desc: "University or job — fill in what you know. Each entry takes 30 seconds. Update anything later." },
              { step: "02", icon: "calendar",  title: "Track every deadline",       desc: "Upcoming deadlines sort themselves by urgency. Overdue ones surface immediately." },
              { step: "03", icon: "dashboard", title: "Stay ahead of the pipeline", desc: "Update statuses as you progress. See the full picture — what's open, applied, submitted, done." },
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

      {/* Final CTA */}
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
