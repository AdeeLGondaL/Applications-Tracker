import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { trackEvent } from "@/utils/analytics";

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
    tone: "emerald",
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

const pipelineSteps = [
  {
    label: "Saved",
    copy: "Opportunity and source link are captured.",
  },
  {
    label: "Preparing",
    copy: "Documents and notes stay attached.",
  },
  {
    label: "Applied",
    copy: "Submission date and status are visible.",
  },
  {
    label: "Interview",
    copy: "Prep notes and follow-ups stay close.",
  },
  {
    label: "Offer",
    copy: "Final decision is easy to review.",
  },
];

const transformationRows = [
  ["TU Munich", "Deadline soon", "Documents missing"],
  ["Google Internship", "Preparing", "CV ready"],
  ["DAAD Scholarship", "Applied", "Waiting"],
  ["Amsterdam University", "Submitted", "Interview pending"],
];

const transformationCards = [
  {
    name: "TU Munich",
    detail: "M.Sc. Computer Science",
    status: "Deadline soon",
    meta: "Documents missing",
    tone: "amber",
  },
  {
    name: "Google Internship",
    detail: "Software Engineering Intern",
    status: "Preparing",
    meta: "CV ready",
    tone: "emerald",
  },
  {
    name: "Amsterdam University",
    detail: "Submitted application",
    status: "Submitted",
    meta: "Interview pending",
    tone: "blue",
  },
];

// Entrance reveals via IntersectionObserver + the Web Animations API — no
// animation library needed. Animates opacity/transform only, so content is
// never removed from the accessibility tree.
function useScrollReveal(ref, {
  selector = null,
  y = 16,
  scale = 1,
  duration = 0.55,
  stagger = 0.06,
  delay = 0,
  immediate = false,
} = {}) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    // Prerendered hero is already visible as static HTML; re-hiding it to
    // replay the entrance would flash the content away.
    if (immediate && window.__APPLUME_PRERENDERED) return undefined;

    const targets = selector ? Array.from(root.querySelectorAll(selector)) : [root];
    if (!targets.length) return undefined;

    const animations = [];
    const play = () => {
      targets.forEach((el, i) => {
        el.style.opacity = "";
        const from = `translateY(${y}px)${scale !== 1 ? ` scale(${scale})` : ""}`;
        animations.push(el.animate(
          [
            { opacity: 0, transform: from },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: duration * 1000,
            delay: (delay + i * stagger) * 1000,
            easing: "cubic-bezier(0.33, 1, 0.68, 1)",
            fill: "backwards",
          }
        ));
      });
    };

    if (immediate || !("IntersectionObserver" in window)) {
      play();
      return () => animations.forEach((animation) => animation.cancel());
    }

    targets.forEach((el) => { el.style.opacity = "0"; });
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        play();
      }
    }, { rootMargin: "0px 0px -15% 0px" });
    observer.observe(root);

    return () => {
      observer.disconnect();
      targets.forEach((el) => { el.style.opacity = ""; });
      animations.forEach((animation) => animation.cancel());
    };
  }, [delay, duration, immediate, ref, scale, selector, stagger, y]);
}

function ToneIcon({ icon, tone = "emerald" }) {
  const toneClass = {
    emerald: "border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] text-[var(--applume-accent)]",
    amber: "border-[#D58A55]/25 bg-[#D58A55]/10 text-[#8A4E27]",
    blue: "border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] text-[var(--applume-accent-hover)]",
    slate: "border-[rgba(23,49,46,0.08)] bg-[#F6FBFA] text-[#5A6B66]",
  }[tone];

  return (
    <div className={`grid h-10 w-10 place-items-center rounded-2xl border shadow-sm shadow-[#17312E]/[0.03] ${toneClass}`}>
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
    <footer className="border-t border-[rgba(23,49,46,0.08)] bg-white px-6 py-10 text-center">
      <p className="text-sm font-black text-[#17312E]">Know someone still managing applications in a spreadsheet?</p>
      <p className="mt-1 text-xs text-[#5A6B66]">Share Applume as their structured tracker.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        {typeof navigator !== "undefined" && !!navigator.share && (
          <button type="button" onClick={handleNativeShare} className="flex items-center gap-2 rounded-xl border border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] px-4 py-2.5 text-sm font-bold text-[var(--applume-accent-hover)] transition hover:border-[rgba(0,153,102,0.35)] hover:bg-[var(--applume-accent-muted)]">
            <Icon name="share" className="h-3.5 w-3.5" /> Share
          </button>
        )}
        <button type="button" onClick={handleCopy} className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${copied ? "border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] text-[var(--applume-accent-hover)]" : "border-[rgba(23,49,46,0.08)] bg-white text-[#17312E] hover:border-[var(--applume-accent-border)] hover:bg-[#F6FBFA]"}`}>
          <Icon name={copied ? "check" : "copy"} className="h-3.5 w-3.5" />
          {copied ? "Copied" : "Copy link"}
        </button>
        {socials.map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border border-[rgba(23,49,46,0.08)] bg-white px-4 py-2.5 text-sm font-bold text-[#5A6B66] transition hover:border-[var(--applume-accent-border)] hover:bg-[#F6FBFA] hover:text-[var(--applume-accent-hover)]">
            {label}
          </a>
        ))}
      </div>
      <p className="mt-8 text-xs text-[#5A6B66]">
        Compare:{" "}
        <a href="/university-application-tracker" className="text-[#5A6B66] underline-offset-2 transition-colors hover:text-[#17312E] hover:underline">University tracker</a>
        {" - "}
        <a href="/huntr-alternative" className="text-[#5A6B66] underline-offset-2 transition-colors hover:text-[#17312E] hover:underline">Huntr alternative</a>
        {" - "}
        <a href="/teal-alternative" className="text-[#5A6B66] underline-offset-2 transition-colors hover:text-[#17312E] hover:underline">Teal alternative</a>
      </p>
      <p className="mt-3 text-xs text-[#5A6B66]">
        &copy; {new Date().getFullYear()} Applume - Structured application tracking
        {" - "}
        <a href="/privacy" className="text-[#5A6B66] transition-colors hover:text-[#17312E]">Privacy Policy</a>
        {" - "}
        <a href="/terms" className="text-[#5A6B66] transition-colors hover:text-[#17312E]">Terms</a>
        {" - "}
        <a href="mailto:hello@applume.app" className="text-[#5A6B66] transition-colors hover:text-[#17312E]">hello@applume.app</a>
      </p>
    </footer>
  );
}

function ProductDemo() {
  const demoRef = useRef(null);
  const [mode, setMode] = useState("university");
  const [selectedId, setSelectedId] = useState(demoSets.university.records[0].id);
  const active = demoSets[mode];
  const selected = active.records.find((record) => record.id === selectedId) || active.records[0];
  useScrollReveal(demoRef, { selector: ".js-hero-demo", y: 14, scale: 0.985, duration: 0.9, stagger: 0 });

  function switchMode(nextMode) {
    setMode(nextMode);
    setSelectedId(demoSets[nextMode].records[0].id);
  }

  const toneClass = {
    amber: "bg-[#D58A55]/15 text-[#8A4E27]",
    blue: "bg-[var(--applume-accent-soft)] text-[var(--applume-accent-hover)]",
    emerald: "bg-[var(--applume-accent-soft)] text-[var(--applume-accent-hover)]",
  }[selected.tone];

  return (
    <div ref={demoRef} id="example-tracker" className="mx-auto mt-12 w-full max-w-[calc(100vw-2rem)] scroll-mt-24 px-0 sm:mt-14 sm:max-w-6xl sm:px-6">
      <div className="js-hero-demo overflow-hidden rounded-3xl border border-[rgba(23,49,46,0.08)] bg-white shadow-lg shadow-[#17312E]/[0.06]">
        <div className="flex flex-col items-stretch gap-3 border-b border-[rgba(23,49,46,0.08)] bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#D58A55]/45" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#C7DDD9]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--applume-accent)]" />
            <span className="ml-1 text-[9px] font-black uppercase tracking-[0.16em] text-[#5A6B66] sm:ml-2 sm:text-[10px] sm:tracking-[0.2em]">Product demo</span>
          </div>
          <div className="grid w-full grid-cols-2 rounded-2xl border border-[rgba(23,49,46,0.08)] bg-[#F6FBFA] p-1 sm:w-auto">
            {Object.entries(demoSets).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => switchMode(key)}
                className={`rounded-xl px-2 py-2 text-[11px] font-black transition sm:px-3 sm:text-xs ${mode === key ? "bg-[var(--applume-accent)] text-white shadow-sm shadow-[var(--applume-accent-shadow)]" : "text-[#5A6B66] hover:bg-white hover:text-[var(--applume-accent-hover)]"}`}
              >
                {value.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid bg-[#F6FBFA] lg:grid-cols-[0.72fr_1.28fr]">
          <div className="border-b border-[rgba(23,49,46,0.08)] bg-[#163734] p-4 text-white lg:border-b-0 lg:border-r lg:p-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <div className="flex items-center gap-2 text-[var(--applume-accent-muted)]">
                <Icon name="sparkles" className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.18em]">AI autofill draft</span>
              </div>
              <p className="mt-3 text-sm font-black">{active.pasteTitle}</p>
              <p className="mt-2 rounded-xl border border-white/10 bg-[#0F2C29]/60 px-3 py-3 text-xs leading-5 text-[#BFD3CF]">
                {active.pasteText}
              </p>
              <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--applume-accent-muted)]">Saved to Applume</p>
                <div className="mt-3 rounded-lg border border-[rgba(204,239,227,0.35)] bg-[rgba(0,153,102,0.12)] p-3">
                  <p className="text-sm font-black text-white">{selected.name}</p>
                  <p className="mt-1 text-xs font-semibold text-[#BFD3CF]">{selected.detail}</p>
                  <div className="mt-3 grid gap-2 text-[10px] font-bold text-[#CDEBE8] sm:grid-cols-3">
                    <span>Deadline: {selected.deadline}</span>
                    <span>Status: {selected.status}</span>
                    <span>Checklist ready</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#9AB2AD]">{active.headline}</p>
              <div className="space-y-2">
                {active.records.map((record) => {
                  const activeRecord = record.id === selected.id;
                  return (
                    <button
                      key={record.id}
                      type="button"
                      onClick={() => setSelectedId(record.id)}
                      className={`w-full rounded-2xl border p-3 text-left transition ${activeRecord ? "border-[var(--applume-accent-muted)] bg-white text-[#17312E] shadow-sm shadow-[var(--applume-accent-shadow)]" : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black">{record.name}</p>
                          <p className={`mt-0.5 truncate text-xs font-semibold ${activeRecord ? "text-[#5A6B66]" : "text-[#BFD3CF]"}`}>{record.detail}</p>
                        </div>
                        <span className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-black ${activeRecord ? toneClass : "bg-white/10 text-slate-300"}`}>{record.status}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--applume-accent)]">{active.context}</p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-[#17312E]">{selected.name}</h3>
                <p className="mt-1 text-sm font-semibold text-[#5A6B66]">{selected.detail}</p>
              </div>
              <div className="rounded-2xl border border-[#D58A55]/25 bg-[#D58A55]/10 px-3 py-2 text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8A4E27]">Deadline</p>
                <p className="mt-1 text-sm font-black text-[#17312E]">{selected.deadline}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {selected.fields.map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-[rgba(23,49,46,0.08)] bg-white px-4 py-3 shadow-sm shadow-[#17312E]/[0.03]">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#5A6B66]">{label}</p>
                  <p className="mt-2 text-sm font-black text-[#17312E]">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.78fr]">
              <div className="rounded-2xl border border-[rgba(23,49,46,0.08)] bg-white p-4 shadow-sm shadow-[#17312E]/[0.03]">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#5A6B66]">Document checklist</p>
                <div className="mt-3 space-y-2">
                  {selected.checklist.map((item) => {
                    const done = !item.toLowerCase().includes("pending");
                    return (
                      <div key={item} className="flex items-center gap-2 text-sm font-semibold text-[#17312E]">
                        <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${done ? "border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] text-[var(--applume-accent)]" : "border-[#D58A55]/25 bg-[#D58A55]/10 text-[#8A4E27]"}`}>
                          <Icon name={done ? "check" : "calendar"} className="h-3 w-3" />
                        </span>
                        <span>{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-2xl border border-[#17312E]/10 bg-[#17312E] p-4 text-white shadow-sm shadow-[#17312E]/5">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--applume-accent-muted)]">Notes and next step</p>
                <p className="mt-3 text-sm leading-6 text-[#D9E7E4]">{selected.activity}</p>
                <div className="mt-4 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-[#E7F2F0]">
                  Everything stays attached to this record.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TransformationStrip() {
  const ref = useRef(null);
  useScrollReveal(ref, { selector: ".js-transform-heading", duration: 0.7, stagger: 0 });
  useScrollReveal(ref, { selector: ".js-transform-card-reveal", duration: 0.55, stagger: 0.06 });

  return (
    <section ref={ref} className="border-y border-[rgba(23,49,46,0.08)] bg-white px-4 py-24 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="js-transform-heading mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--applume-accent)]">Spreadsheet chaos to Applume clarity</p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-[#17312E] sm:text-5xl">
            From spreadsheet chaos to application clarity.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#5A6B66]">
            Applume turns scattered rows into application records with deadlines, status, documents, and next steps in one place.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="js-transform-card-reveal overflow-hidden rounded-2xl border border-[rgba(23,49,46,0.08)] bg-[#F6FBFA] shadow-sm shadow-[#17312E]/[0.03]">
            <div className="border-b border-[rgba(23,49,46,0.08)] bg-white px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#5A6B66]">Before</p>
              <p className="mt-1 text-lg font-black text-[#17312E]">Spreadsheet rows with hidden context</p>
            </div>
            <div className="overflow-x-auto p-3">
              <div className="min-w-[34rem] rounded-xl border border-[rgba(23,49,46,0.08)] bg-white text-left text-xs font-semibold text-[#5A6B66]">
                <div className="grid grid-cols-[1.2fr_0.9fr_1.1fr] border-b border-[rgba(23,49,46,0.08)] bg-[var(--applume-accent-soft)] text-[10px] font-black uppercase tracking-[0.14em] text-[#5A6B66]">
                  <span className="px-3 py-2">Application</span>
                  <span className="px-3 py-2">Status</span>
                  <span className="px-3 py-2">Notes</span>
                </div>
                {transformationRows.map(([name, status, note], index) => (
                  <div key={name} className="grid grid-cols-[1.2fr_0.9fr_1.1fr] border-b border-[rgba(23,49,46,0.06)] last:border-b-0">
                    {[name, status, note].map((value, cellIndex) => {
                      const highlight = (index === 0 && cellIndex > 0) || (index === 3 && cellIndex === 2);
                      return (
                        <span key={value} className="relative overflow-hidden px-3 py-3">
                          {highlight && <span className="pointer-events-none absolute inset-x-2 inset-y-2 rounded-lg bg-[rgba(0,153,102,0.10)] ring-1 ring-inset ring-[var(--applume-accent-border)]" />}
                          <span className={`relative z-10 ${highlight ? "text-[var(--applume-accent-hover)]" : ""}`}>{value}</span>
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="js-transform-card-reveal mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--applume-accent)] text-white shadow-sm shadow-[var(--applume-accent-shadow)] lg:h-14 lg:w-14">
            <Icon name="sparkles" className="h-5 w-5" />
          </div>

          <div className="js-transform-card-reveal rounded-2xl border border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] p-4 shadow-sm shadow-[#17312E]/[0.03]">
            <div className="mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--applume-accent)]">After</p>
              <p className="mt-1 text-lg font-black text-[#17312E]">Applume records with clear next steps</p>
            </div>
            <div className="grid gap-3">
              {transformationCards.map((card) => {
                const toneClass = {
                  amber: "border-[#D58A55]/25 bg-[#D58A55]/10 text-[#8A4E27]",
                  blue: "border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] text-[var(--applume-accent-hover)]",
                  emerald: "border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] text-[var(--applume-accent-hover)]",
                }[card.tone];

                return (
                  <div key={card.name} className="rounded-2xl border border-[rgba(23,49,46,0.08)] bg-white p-4 shadow-sm shadow-[#17312E]/[0.03]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-[#17312E]">{card.name}</p>
                        <p className="mt-1 truncate text-xs font-semibold text-[#5A6B66]">{card.detail}</p>
                      </div>
                      <span className={`shrink-0 rounded-md border px-2 py-1 text-[10px] font-black ${toneClass}`}>{card.status}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#F6FBFA] px-3 py-2 text-xs font-bold text-[#5A6B66]">
                      <Icon name={card.tone === "amber" ? "calendar" : "check"} className={`h-3.5 w-3.5 ${card.tone === "amber" ? "text-[#8A4E27]" : "text-[var(--applume-accent)]"}`} />
                      {card.meta}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const sectionRef = useRef(null);
  useScrollReveal(sectionRef, { selector: ".js-gsap-heading", duration: 0.7 });
  useScrollReveal(sectionRef, { selector: ".js-gsap-card", duration: 0.55, stagger: 0.06 });

  return (
    <section ref={sectionRef} id="why-applume" className="scroll-mt-24 bg-white px-4 py-20 text-[#17312E] sm:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="js-gsap-heading max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--applume-accent)]">Where spreadsheets break</p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            It is not the tracking that is hard. It is keeping the context alive.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#5A6B66]">
            Applications become stressful when dates, documents, links, notes, and next steps live in different places. Applume is built around that exact moment.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {painCards.map((item) => (
            <div key={item.title} className="js-gsap-card rounded-2xl border border-[rgba(23,49,46,0.08)] bg-[#F6FBFA] p-6 shadow-sm shadow-[#17312E]/[0.03]">
              <div className="mb-5">
                <ToneIcon icon={item.icon} tone={item.tone} />
              </div>
              <h3 className="text-base font-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#5A6B66]">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureSection() {
  const sectionRef = useRef(null);
  useScrollReveal(sectionRef, { selector: ".js-gsap-heading", duration: 0.7 });
  useScrollReveal(sectionRef, { selector: ".js-gsap-card", duration: 0.55, stagger: 0.06 });

  return (
    <section ref={sectionRef} id="features" className="scroll-mt-24 bg-[#F6FBFA] px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="js-gsap-heading">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--applume-accent)]">Every application becomes a record</p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              Not another list. A place for the whole application.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#5A6B66]">
              Each record keeps the practical pieces together: status, deadline, documents, links, notes, next action, and exportable data.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Status", "Applying, interview, offer, rejected"],
              ["Deadline", "Urgent and overdue items stay visible"],
              ["Documents", "CV, transcript, portfolio, motivation letter"],
              ["Links", "Portal pages, job posts, folders, emails"],
              ["Notes", "Interview prep and admissions requirements"],
              ["Export", "CSV or JSON when you want your data out"],
            ].map(([label, value]) => (
              <div key={label} className="js-gsap-card rounded-2xl border border-[rgba(23,49,46,0.08)] bg-white p-4 shadow-sm shadow-[#17312E]/[0.03]">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--applume-accent)]">{label}</p>
                <p className="mt-2 text-sm font-semibold leading-5 text-[#17312E]">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AudienceSection() {
  const sectionRef = useRef(null);
  useScrollReveal(sectionRef, { selector: ".js-gsap-heading", duration: 0.7 });
  useScrollReveal(sectionRef, { selector: ".js-gsap-card", duration: 0.55, stagger: 0.06 });

  return (
    <section ref={sectionRef} className="bg-white px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="js-gsap-heading text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--applume-accent)]">Built for admissions and job hunts</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            Same chaos, different applications. Applume handles both.
          </h2>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {audienceCards.map((card, index) => (
            <div key={card.title} className="js-gsap-card rounded-2xl border border-[rgba(23,49,46,0.08)] bg-[#F6FBFA] p-6 shadow-sm shadow-[#17312E]/[0.03]">
              <ToneIcon icon={card.icon} tone={index === 0 ? "emerald" : "blue"} />
              <h3 className="mt-5 text-2xl font-black text-[#17312E]">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#5A6B66]">{card.copy}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {card.items.map((item) => (
                  <span key={item} className="rounded-xl border border-[rgba(23,49,46,0.08)] bg-white px-3 py-2 text-xs font-black text-[#5A6B66]">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ApplicationPipeline() {
  return (
    <div className="js-gsap-card mt-8 rounded-2xl border border-[rgba(23,49,46,0.08)] bg-white p-5 shadow-sm shadow-[#17312E]/[0.03] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--applume-accent)]">Application pipeline</p>
          <h3 className="mt-2 text-2xl font-black leading-tight text-[#17312E] sm:text-3xl">Saved to offer, every step stays visible.</h3>
        </div>
        <p className="max-w-sm text-sm leading-6 text-[#5A6B66]">
          A quiet path keeps progress visible without adding another stressful dashboard.
        </p>
      </div>

      <div className="relative mt-8">
        <div className="pointer-events-none absolute left-6 right-6 top-5 hidden h-px bg-[#D8DDD5] md:block">
          <div className="h-px w-full bg-[rgba(0,153,102,0.45)]" />
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          {pipelineSteps.map((step, index) => (
            <div key={step.label} className="relative min-h-[8.5rem] rounded-2xl border border-[rgba(23,49,46,0.08)] bg-[#F6FBFA] p-4 pt-12 text-left shadow-sm shadow-[#17312E]/[0.03]">
              <span className="absolute left-4 top-4 grid h-4 w-4 place-items-center rounded-full border border-[rgba(204,239,227,0.60)] bg-[var(--applume-accent)]">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#5A6B66]">Step {index + 1}</p>
              <h4 className="mt-2 text-base font-black text-[#17312E]">{step.label}</h4>
              <p className="mt-2 text-xs leading-5 text-[#5A6B66]">{step.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowItWorksSection() {
  const sectionRef = useRef(null);
  useScrollReveal(sectionRef, { selector: ".js-gsap-heading", duration: 0.7 });
  useScrollReveal(sectionRef, { selector: ".js-gsap-card", duration: 0.55, stagger: 0.06 });

  return (
    <section ref={sectionRef} id="how-it-works" className="scroll-mt-24 bg-[#F6FBFA] px-4 py-20 text-[#17312E] sm:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="js-gsap-heading max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--applume-accent)]">From paste to tracker</p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            Make logging an application feel lighter than filling a row.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#5A6B66]">
            The product should reduce friction, not add another chore. Applume keeps manual control while making the first draft faster.
          </p>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {flowSteps.map((step) => (
            <div key={step.label} className="js-gsap-card rounded-2xl border border-[rgba(23,49,46,0.08)] bg-white p-6 shadow-sm shadow-[#17312E]/[0.03]">
              <div className="inline-flex rounded-xl bg-[var(--applume-accent-soft)] px-3 py-1.5 text-xs font-black text-[var(--applume-accent-hover)]">{step.label}</div>
              <h3 className="mt-5 text-xl font-black">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#5A6B66]">{step.copy}</p>
            </div>
          ))}
        </div>
        <ApplicationPipeline />
        <div className="js-gsap-card mt-6 rounded-2xl border border-[rgba(23,49,46,0.08)] bg-white p-6 text-[#17312E] shadow-sm shadow-[#17312E]/[0.03]">
          <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--applume-accent)]">Grounded trust</p>
              <h3 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">Private by default. Export whenever you want.</h3>
              <p className="mt-3 text-sm leading-6 text-[#5A6B66]">
                Sign in with Google or email. Your records belong to your account, and shared tracker links are intentional.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Google/email", "Sign-in options"],
                ["CSV/JSON", "No lock-in"],
                ["Feedback", "Built with users"],
              ].map(([value, label]) => (
                <div key={value} className="rounded-2xl border border-[rgba(23,49,46,0.08)] bg-[#F6FBFA] p-4">
                  <p className="text-sm font-black">{value}</p>
                  <p className="mt-1 text-xs font-semibold text-[#5A6B66]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FAQ_ITEMS = [
  {
    q: "Is Applume really free?",
    a: "Yes. The tracker is free to use - no credit card, no trial countdown, no locked core features. If paid extras ever arrive, your tracker and your data stay free.",
  },
  {
    q: "Who can see my applications?",
    a: "Only you. Your records are private to your account. The single exception is a share link you create yourself - and you can turn it off at any time.",
  },
  {
    q: "Can I get my data out again?",
    a: "Anytime. Export everything as CSV or JSON with one click, and deleting your account permanently removes your data.",
  },
  {
    q: "I already track things in a spreadsheet. Do I have to start over?",
    a: "No. Import your existing sheet as a CSV and Applume matches your columns automatically - names, deadlines, statuses, links, and notes come along.",
  },
];

function FaqSection() {
  const sectionRef = useRef(null);
  useScrollReveal(sectionRef, { selector: ".js-gsap-card", y: 18, duration: 0.7, stagger: 0.06 });

  return (
    <section ref={sectionRef} id="faq" aria-labelledby="faq-title" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="js-gsap-card text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--applume-accent)]">Fair questions</p>
          <h2 id="faq-title" className="mt-4 text-3xl font-black leading-tight tracking-tight text-[#17312E] sm:text-4xl">
            Before you trust us with your applications.
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="js-gsap-card group rounded-2xl border border-[rgba(23,49,46,0.08)] bg-white px-6 py-5 shadow-sm shadow-[#17312E]/[0.03]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-black text-[#17312E] [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#F6FBFA] text-[#5A6B66] transition group-open:rotate-45">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-[#5A6B66]">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FounderNote({ onGetStarted }) {
  const sectionRef = useRef(null);
  useScrollReveal(sectionRef, { selector: ".js-gsap-card", y: 18, duration: 0.7, stagger: 0.06 });

  return (
    <section ref={sectionRef} aria-labelledby="final-cta-title" className="bg-white px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
        <div className="js-gsap-card rounded-2xl border border-[rgba(23,49,46,0.08)] bg-white p-6 shadow-sm shadow-[#17312E]/[0.03]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--applume-accent)]">A note from the builder</p>
          <p className="mt-5 text-xl font-black leading-8 text-[#17312E]">
            Applume exists because application tracking should feel like control, not another spreadsheet you slowly abandon.
          </p>
          <p className="mt-4 text-sm leading-6 text-[#5A6B66]">
            I built Applume to track my own university and job applications after my spreadsheet fell apart mid-season. The goal is simple: keep the speed of a spreadsheet, add the structure that deadlines, documents, links, and interviews actually need.
          </p>
          <div className="mt-6 flex items-center gap-3 border-t border-[rgba(23,49,46,0.08)] pt-5">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--applume-accent-soft)] text-sm font-black text-[var(--applume-accent)]">AA</div>
            <div>
              <p className="text-sm font-black text-[#17312E]">Adeel Ahmed</p>
              <p className="text-xs text-[#5A6B66]">Builder of Applume - <a href="mailto:hello@applume.app" className="font-semibold text-[var(--applume-accent)] hover:underline">hello@applume.app</a></p>
            </div>
          </div>
        </div>
        <div className="js-gsap-card rounded-2xl border border-[#17312E]/10 bg-[#17312E] p-8 text-white shadow-lg shadow-[#17312E]/[0.08]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--applume-accent-muted)]">Bring order to the list</p>
          <h2 id="final-cta-title" className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            Turn your application sheet into a finished workspace.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#BFD3CF]">
            Keep the speed of a spreadsheet, then add the structure needed to stay prepared and consistent.
          </p>
          <button type="button" onClick={onGetStarted} className="mt-8 rounded-xl bg-[var(--applume-accent)] px-9 py-4 text-base font-bold text-white shadow-sm shadow-[var(--applume-accent-shadow)] transition hover:bg-[var(--applume-accent-hover)]">
            Start tracking free
          </button>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage({ onGetStarted }) {
  const heroRef = useRef(null);
  useScrollReveal(heroRef, { selector: ".js-hero-reveal", y: 16, duration: 0.7, stagger: 0.08, immediate: true });

  useEffect(() => {
    trackEvent("landing_view");
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F6FBFA] text-[#17312E]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-[var(--applume-accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-50 border-b border-[rgba(23,49,46,0.08)] bg-[#F6FBFA]/92 backdrop-blur-xl">
        <nav aria-label="Primary" className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="/" className="flex min-h-11 items-center gap-2.5">
            <img src="/Logo.png" alt="Applume" className="h-8 w-8 object-contain" style={{ mixBlendMode: "multiply" }} />
            <span className="text-sm font-black tracking-tight">
              <span className="text-[#17312E]">App</span><span className="text-[var(--applume-accent)]">lume</span>
            </span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-semibold text-[#5A6B66] sm:flex">
            <a href="#why-applume" className="transition hover:text-[#17312E]">Why Applume</a>
            <a href="#features" className="transition hover:text-[#17312E]">Features</a>
            <a href="#how-it-works" className="transition hover:text-[#17312E]">How it works</a>
            <a href="#faq" className="transition hover:text-[#17312E]">FAQ</a>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />
            <button type="button" onClick={onGetStarted} className="hidden min-h-11 rounded-xl px-3.5 py-2 text-sm font-semibold text-[#5A6B66] transition hover:bg-white hover:text-[#17312E] sm:block">
              Sign in
            </button>
            <button type="button" onClick={onGetStarted} className="inline-flex min-h-11 rounded-xl bg-[var(--applume-accent)] px-4 py-2 text-sm font-bold text-white shadow-sm shadow-[var(--applume-accent-shadow)] transition hover:bg-[var(--applume-accent-hover)]">
              <span>Start tracking free</span>
            </button>
          </div>
        </nav>
      </header>

      <main id="main">
      <section ref={heroRef} className="relative overflow-hidden px-4 pb-16 pt-10 text-center sm:px-6 sm:pt-14 lg:pb-20 lg:pt-16">
        <div className="relative z-10 mx-auto max-w-4xl">
          <span
            className="js-hero-reveal inline-flex max-w-[calc(100vw-2rem)] items-center justify-center gap-2 rounded-full border border-[var(--applume-accent-border)] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--applume-accent)] shadow-sm shadow-[#17312E]/[0.03] sm:px-4 sm:text-[11px] sm:tracking-[0.18em]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--applume-accent)]" />
            Built for spreadsheet escapees
          </span>

          <h1
            className="js-hero-reveal mx-auto mt-5 max-w-[17rem] text-[1.72rem] font-black leading-[1.08] tracking-tight min-[420px]:max-w-4xl min-[420px]:text-[2.7rem] sm:text-[3.6rem] sm:leading-[1.04] lg:text-[4.25rem]"
          >
            <span className="block sm:hidden">Applications</span>
            <span className="block sm:hidden">deserve better</span>
            <span className="block sm:hidden">than a</span>
            <span className="block sm:hidden">spreadsheet.</span>
            <span className="hidden sm:inline">Your applications deserve better than </span>
            <span className="hidden sm:block">a spreadsheet.</span>
          </h1>

          <p
            className="js-hero-reveal mx-auto mt-5 max-w-[21rem] text-base leading-7 text-[#5A6B66] sm:max-w-2xl sm:text-lg sm:leading-8"
          >
            Applume turns job and university applications into calm, structured records with deadlines, documents, links, notes, statuses, and next steps.
          </p>

          <div
            className="js-hero-reveal mx-auto mt-6 grid w-full max-w-sm gap-2 text-xs font-bold text-[#5A6B66] sm:max-w-2xl sm:grid-cols-3"
          >
            {["University + job workflows", "Private by default", "Export anytime"].map((item) => (
              <span key={item} className="rounded-xl border border-[rgba(23,49,46,0.08)] bg-white/90 px-3 py-2.5 text-center shadow-sm shadow-[#17312E]/[0.03]">
                {item}
              </span>
            ))}
          </div>

          <div
            className="js-hero-reveal mx-auto mt-7 flex w-full max-w-xs flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row"
          >
            <button type="button" onClick={onGetStarted} className="w-full min-h-11 rounded-xl bg-[var(--applume-accent)] px-8 py-3.5 text-base font-bold text-white shadow-sm shadow-[var(--applume-accent-shadow)] transition hover:bg-[var(--applume-accent-hover)] sm:w-auto">
              Start tracking free
            </button>
            <a href="#example-tracker" className="w-full min-h-11 rounded-xl border border-[rgba(23,49,46,0.08)] bg-white/95 px-6 py-3.5 text-sm font-bold text-[#17312E] shadow-sm shadow-[#17312E]/[0.03] transition hover:border-[var(--applume-accent-border)] hover:bg-white hover:text-[var(--applume-accent-hover)] sm:w-auto">
              See the product demo
            </a>
          </div>

          <p
            className="js-hero-reveal mx-auto mt-4 max-w-[17rem] text-xs leading-5 text-[#5A6B66] sm:max-w-xl"
          >
            For students, graduates, and job seekers managing multiple applications at once.
          </p>
        </div>

        <ProductDemo />
      </section>

      <TransformationStrip />
      <ProblemSection />
      <FeatureSection />
      <AudienceSection />
      <HowItWorksSection />
      <FaqSection />
      <FounderNote onGetStarted={onGetStarted} />
      </main>
      <LandingFooter />
    </div>
  );
}
