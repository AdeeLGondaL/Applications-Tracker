import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icon } from "@/components/ui/Icon";

gsap.registerPlugin(ScrollTrigger);

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

function useGsapReveal(ref, {
  selector = null,
  trigger = null,
  start = "top 82%",
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

    const mm = gsap.matchMedia(root);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const targets = selector ? gsap.utils.toArray(selector, root) : [root];
      if (!targets.length) return;

      const fromVars = { autoAlpha: 0, y };
      if (scale !== 1) fromVars.scale = scale;

      const tweenVars = {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration,
        delay,
        stagger,
        ease: "power3.out",
        clearProps: "transform,opacity,visibility",
      };

      if (!immediate) {
        tweenVars.scrollTrigger = {
          trigger: trigger ? root.querySelector(trigger) || root : root,
          start,
          once: true,
        };
      }

      gsap.fromTo(targets, fromVars, tweenVars);
    });

    return () => mm.revert();
  }, [delay, duration, immediate, ref, scale, selector, stagger, start, trigger, y]);
}

function ToneIcon({ icon, tone = "emerald" }) {
  const toneClass = {
    emerald: "border-[#2F8F88]/20 bg-[#EEF7F5] text-[#2F8F88]",
    amber: "border-[#D58A55]/25 bg-[#D58A55]/10 text-[#8A4E27]",
    blue: "border-[#2F8F88]/15 bg-[#EEF7F5] text-[#256E68]",
    slate: "border-[rgba(23,49,46,0.08)] bg-[#F6FBFA] text-[#667A75]",
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
    <footer className="border-t border-[rgba(23,49,46,0.08)] bg-white px-6 py-12 text-center">
      <p className="text-sm font-black text-[#17312E]">Know someone still managing applications in a spreadsheet?</p>
      <p className="mt-1 text-xs text-[#667A75]">Share Applume as their structured tracker.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        {typeof navigator !== "undefined" && !!navigator.share && (
          <button type="button" onClick={handleNativeShare} className="flex items-center gap-2 rounded-xl border border-[#2F8F88]/20 bg-[#EEF7F5] px-4 py-2.5 text-sm font-bold text-[#256E68] transition hover:border-[#2F8F88]/35 hover:bg-[#E1F0ED]">
            <Icon name="share" className="h-3.5 w-3.5" /> Share
          </button>
        )}
        <button type="button" onClick={handleCopy} className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${copied ? "border-[#2F8F88]/20 bg-[#EEF7F5] text-[#256E68]" : "border-[rgba(23,49,46,0.08)] bg-white text-[#17312E] hover:border-[#2F8F88]/25 hover:bg-[#F6FBFA]"}`}>
          <Icon name={copied ? "check" : "copy"} className="h-3.5 w-3.5" />
          {copied ? "Copied" : "Copy link"}
        </button>
        {socials.map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border border-[rgba(23,49,46,0.08)] bg-white px-4 py-2.5 text-sm font-bold text-[#667A75] transition hover:border-[#2F8F88]/25 hover:bg-[#F6FBFA]">
            {label}
          </a>
        ))}
      </div>
      <p className="mt-8 text-xs text-[#667A75]">
        &copy; {new Date().getFullYear()} Applume - Structured application tracking
        {" - "}
        <a href="/privacy" className="text-[#667A75] transition-colors hover:text-[#17312E]">Privacy Policy</a>
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
  useGsapReveal(demoRef, { selector: ".js-hero-demo", y: 14, scale: 0.985, duration: 0.9, stagger: 0, start: "top 88%" });

  function switchMode(nextMode) {
    setMode(nextMode);
    setSelectedId(demoSets[nextMode].records[0].id);
  }

  const toneClass = {
    amber: "bg-[#D58A55]/15 text-[#8A4E27]",
    blue: "bg-[#EEF7F5] text-[#256E68]",
    emerald: "bg-[#EEF7F5] text-[#256E68]",
  }[selected.tone];

  return (
    <div ref={demoRef} id="example-tracker" className="mx-auto mt-12 w-full max-w-[calc(100vw-2rem)] scroll-mt-24 px-0 sm:mt-14 sm:max-w-6xl sm:px-6">
      <div className="js-hero-demo overflow-hidden rounded-3xl border border-[rgba(23,49,46,0.08)] bg-white shadow-lg shadow-[#17312E]/[0.06]">
        <div className="flex flex-col items-stretch gap-3 border-b border-[rgba(23,49,46,0.08)] bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#D58A55]/45" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#C7DDD9]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#2F8F88]" />
            <span className="ml-1 text-[9px] font-black uppercase tracking-[0.16em] text-[#667A75] sm:ml-2 sm:text-[10px] sm:tracking-[0.2em]">Product demo</span>
          </div>
          <div className="grid w-full grid-cols-2 rounded-2xl border border-[rgba(23,49,46,0.08)] bg-[#F6FBFA] p-1 sm:w-auto">
            {Object.entries(demoSets).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => switchMode(key)}
                className={`rounded-xl px-2 py-2 text-[11px] font-black transition sm:px-3 sm:text-xs ${mode === key ? "bg-[#2F8F88] text-white shadow-sm shadow-[#17312E]/5" : "text-[#667A75] hover:bg-white"}`}
              >
                {value.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid bg-[#F6FBFA] lg:grid-cols-[0.72fr_1.28fr]">
          <div className="border-b border-[rgba(23,49,46,0.08)] bg-[#163734] p-4 text-white lg:border-b-0 lg:border-r lg:p-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <div className="flex items-center gap-2 text-[#9AD6D1]">
                <Icon name="sparkles" className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.18em]">AI autofill draft</span>
              </div>
              <p className="mt-3 text-sm font-black">{active.pasteTitle}</p>
              <p className="mt-2 rounded-xl border border-white/10 bg-[#0F2C29]/60 px-3 py-3 text-xs leading-5 text-[#BFD3CF]">
                {active.pasteText}
              </p>
              <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#9AD6D1]">Saved to Applume</p>
                <div className="mt-3 rounded-lg border border-[#9AD6D1]/35 bg-[#2F8F88]/10 p-3">
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
                      className={`w-full rounded-2xl border p-3 text-left transition ${activeRecord ? "border-[#9AD6D1] bg-white text-[#17312E] shadow-sm shadow-[#17312E]/5" : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black">{record.name}</p>
                          <p className={`mt-0.5 truncate text-xs font-semibold ${activeRecord ? "text-[#667A75]" : "text-[#BFD3CF]"}`}>{record.detail}</p>
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
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2F8F88]">{active.context}</p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-[#17312E]">{selected.name}</h3>
                <p className="mt-1 text-sm font-semibold text-[#667A75]">{selected.detail}</p>
              </div>
              <div className="rounded-2xl border border-[#D58A55]/25 bg-[#D58A55]/10 px-3 py-2 text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8A4E27]">Deadline</p>
                <p className="mt-1 text-sm font-black text-[#17312E]">{selected.deadline}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {selected.fields.map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-[rgba(23,49,46,0.08)] bg-white px-4 py-3 shadow-sm shadow-[#17312E]/[0.03]">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#667A75]">{label}</p>
                  <p className="mt-2 text-sm font-black text-[#17312E]">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.78fr]">
              <div className="rounded-2xl border border-[rgba(23,49,46,0.08)] bg-white p-4 shadow-sm shadow-[#17312E]/[0.03]">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#667A75]">Document checklist</p>
                <div className="mt-3 space-y-2">
                  {selected.checklist.map((item) => {
                    const done = !item.toLowerCase().includes("pending");
                    return (
                      <div key={item} className="flex items-center gap-2 text-sm font-semibold text-[#17312E]">
                        <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${done ? "border-[#2F8F88]/25 bg-[#EEF7F5] text-[#2F8F88]" : "border-[#D58A55]/25 bg-[#D58A55]/10 text-[#8A4E27]"}`}>
                          <Icon name={done ? "check" : "calendar"} className="h-3 w-3" />
                        </span>
                        <span>{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-2xl border border-[#17312E]/10 bg-[#17312E] p-4 text-white shadow-sm shadow-[#17312E]/5">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9AD6D1]">Notes and next step</p>
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
  useGsapReveal(ref, { selector: ".js-transform-heading", duration: 0.7, stagger: 0 });
  useGsapReveal(ref, { selector: ".js-transform-card-reveal", duration: 0.55, stagger: 0.06, start: "top 78%" });

  return (
    <section ref={ref} className="border-y border-[rgba(23,49,46,0.08)] bg-white px-4 py-24 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="js-transform-heading mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2F8F88]">Spreadsheet chaos to Applume clarity</p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-[#17312E] sm:text-5xl">
            From spreadsheet chaos to application clarity.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#667A75]">
            Applume turns scattered rows into application records with deadlines, status, documents, and next steps in one place.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="js-transform-card-reveal overflow-hidden rounded-2xl border border-[rgba(23,49,46,0.08)] bg-[#F6FBFA] shadow-sm shadow-[#17312E]/[0.03]">
            <div className="border-b border-[rgba(23,49,46,0.08)] bg-white px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#667A75]">Before</p>
              <p className="mt-1 text-lg font-black text-[#17312E]">Spreadsheet rows with hidden context</p>
            </div>
            <div className="overflow-x-auto p-3">
              <div className="min-w-[34rem] rounded-xl border border-[rgba(23,49,46,0.08)] bg-white text-left text-xs font-semibold text-[#667A75]">
                <div className="grid grid-cols-[1.2fr_0.9fr_1.1fr] border-b border-[rgba(23,49,46,0.08)] bg-[#EEF7F5] text-[10px] font-black uppercase tracking-[0.14em] text-[#667A75]">
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
                          {highlight && <span className="pointer-events-none absolute inset-x-2 inset-y-2 rounded-lg bg-[#2F8F88]/10 ring-1 ring-inset ring-[#2F8F88]/25" />}
                          <span className={`relative z-10 ${highlight ? "text-[#256E68]" : ""}`}>{value}</span>
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="js-transform-card-reveal mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F8F88] text-white shadow-sm shadow-[#17312E]/5 lg:h-14 lg:w-14">
            <Icon name="sparkles" className="h-5 w-5" />
          </div>

          <div className="js-transform-card-reveal rounded-2xl border border-[#2F8F88]/20 bg-[#EEF7F5] p-4 shadow-sm shadow-[#17312E]/[0.03]">
            <div className="mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#2F8F88]">After</p>
              <p className="mt-1 text-lg font-black text-[#17312E]">Applume records with clear next steps</p>
            </div>
            <div className="grid gap-3">
              {transformationCards.map((card) => {
                const toneClass = {
                  amber: "border-[#D58A55]/25 bg-[#D58A55]/10 text-[#8A4E27]",
                  blue: "border-[#2F8F88]/15 bg-[#EEF7F5] text-[#256E68]",
                  emerald: "border-[#2F8F88]/15 bg-[#EEF7F5] text-[#256E68]",
                }[card.tone];

                return (
                  <div key={card.name} className="rounded-2xl border border-[rgba(23,49,46,0.08)] bg-white p-4 shadow-sm shadow-[#17312E]/[0.03]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-[#17312E]">{card.name}</p>
                        <p className="mt-1 truncate text-xs font-semibold text-[#667A75]">{card.detail}</p>
                      </div>
                      <span className={`shrink-0 rounded-md border px-2 py-1 text-[10px] font-black ${toneClass}`}>{card.status}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#F6FBFA] px-3 py-2 text-xs font-bold text-[#667A75]">
                      <Icon name={card.tone === "amber" ? "calendar" : "check"} className={`h-3.5 w-3.5 ${card.tone === "amber" ? "text-[#8A4E27]" : "text-[#2F8F88]"}`} />
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
  useGsapReveal(sectionRef, { selector: ".js-gsap-heading", duration: 0.7 });
  useGsapReveal(sectionRef, { selector: ".js-gsap-card", duration: 0.55, stagger: 0.06, start: "top 78%" });

  return (
    <section ref={sectionRef} id="why-applume" className="scroll-mt-20 bg-[#17312E] px-4 py-24 text-white sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="js-gsap-heading max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9AD6D1]">Where spreadsheets break</p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            It is not the tracking that is hard. It is keeping the context alive.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#BFD3CF]">
            Applications become stressful when dates, documents, links, notes, and next steps live in different places. Applume is built around that exact moment.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {painCards.map((item) => (
            <div key={item.title} className="js-gsap-card rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-sm shadow-black/5">
              <div className="mb-5">
                <ToneIcon icon={item.icon} tone={item.tone} />
              </div>
              <h3 className="text-base font-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#BFD3CF]">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureSection() {
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef, { selector: ".js-gsap-heading", duration: 0.7 });
  useGsapReveal(sectionRef, { selector: ".js-gsap-card", duration: 0.55, stagger: 0.06, start: "top 78%" });

  return (
    <section ref={sectionRef} id="features" className="scroll-mt-20 bg-[#F6FBFA] px-4 py-24 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="js-gsap-heading">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2F8F88]">Every application becomes a record</p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              Not another list. A place for the whole application.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#667A75]">
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
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#2F8F88]">{label}</p>
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
  useGsapReveal(sectionRef, { selector: ".js-gsap-heading", duration: 0.7 });
  useGsapReveal(sectionRef, { selector: ".js-gsap-card", duration: 0.55, stagger: 0.06, start: "top 78%" });

  return (
    <section ref={sectionRef} className="bg-white px-4 py-24 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="js-gsap-heading text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2F8F88]">Built for admissions and job hunts</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            Same chaos, different applications. Applume handles both.
          </h2>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {audienceCards.map((card, index) => (
            <div key={card.title} className="js-gsap-card rounded-2xl border border-[rgba(23,49,46,0.08)] bg-[#F6FBFA] p-6 shadow-sm shadow-[#17312E]/[0.03]">
              <ToneIcon icon={card.icon} tone={index === 0 ? "emerald" : "blue"} />
              <h3 className="mt-5 text-2xl font-black text-[#17312E]">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#667A75]">{card.copy}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {card.items.map((item) => (
                  <span key={item} className="rounded-xl border border-[rgba(23,49,46,0.08)] bg-white px-3 py-2 text-xs font-black text-[#667A75]">{item}</span>
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
    <div className="js-gsap-card mt-8 rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-sm shadow-black/5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9AD6D1]">Application pipeline</p>
          <h3 className="mt-2 text-2xl font-black leading-tight text-white sm:text-3xl">Saved to offer, every step stays visible.</h3>
        </div>
        <p className="max-w-sm text-sm leading-6 text-[#BFD3CF]">
          A quiet path keeps progress visible without adding another stressful dashboard.
        </p>
      </div>

      <div className="relative mt-8">
        <div className="pointer-events-none absolute left-6 right-6 top-5 hidden h-px bg-white/15 md:block">
          <div className="h-px w-full bg-[#9AD6D1]/70" />
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          {pipelineSteps.map((step, index) => (
            <div key={step.label} className="relative min-h-[8.5rem] rounded-2xl border border-white/10 bg-[#163734]/55 p-4 pt-12 text-left shadow-sm shadow-black/5">
              <span className="absolute left-4 top-4 grid h-4 w-4 place-items-center rounded-full border border-[#9AD6D1]/60 bg-[#2F8F88]">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9AB2AD]">Step {index + 1}</p>
              <h4 className="mt-2 text-base font-black text-white">{step.label}</h4>
              <p className="mt-2 text-xs leading-5 text-[#BFD3CF]">{step.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowItWorksSection() {
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef, { selector: ".js-gsap-heading", duration: 0.7 });
  useGsapReveal(sectionRef, { selector: ".js-gsap-card", duration: 0.55, stagger: 0.06, start: "top 78%" });

  return (
    <section ref={sectionRef} id="how-it-works" className="scroll-mt-20 bg-[#17312E] px-4 py-24 text-white sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="js-gsap-heading max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9AD6D1]">From paste to tracker</p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            Make logging an application feel lighter than filling a row.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#BFD3CF]">
            The product should reduce friction, not add another chore. Applume keeps manual control while making the first draft faster.
          </p>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {flowSteps.map((step) => (
            <div key={step.label} className="js-gsap-card rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-sm shadow-black/5">
              <div className="inline-flex rounded-xl bg-[#2F8F88]/20 px-3 py-1.5 text-xs font-black text-[#9AD6D1]">{step.label}</div>
              <h3 className="mt-5 text-xl font-black">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#BFD3CF]">{step.copy}</p>
            </div>
          ))}
        </div>
        <ApplicationPipeline />
        <div className="js-gsap-card mt-6 rounded-2xl border border-white/10 bg-white p-6 text-[#17312E] shadow-sm shadow-black/5">
          <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2F8F88]">Grounded trust</p>
              <h3 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">Private by default. Export whenever you want.</h3>
              <p className="mt-3 text-sm leading-6 text-[#667A75]">
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
                  <p className="mt-1 text-xs font-semibold text-[#667A75]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FounderNote({ onGetStarted }) {
  const sectionRef = useRef(null);
  useGsapReveal(sectionRef, { selector: ".js-gsap-card", y: 18, duration: 0.7, stagger: 0.06 });

  return (
    <section ref={sectionRef} className="bg-[#F6FBFA] px-4 py-24 sm:px-6 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
        <div className="js-gsap-card rounded-2xl border border-[rgba(23,49,46,0.08)] bg-white p-6 shadow-sm shadow-[#17312E]/[0.03]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2F8F88]">A note from the builder</p>
          <p className="mt-5 text-xl font-black leading-8 text-[#17312E]">
            Applume exists because application tracking should feel like control, not another spreadsheet you slowly abandon.
          </p>
          <p className="mt-4 text-sm leading-6 text-[#667A75]">
            The goal is simple: keep the speed people like about spreadsheets, then add the structure that deadlines, documents, links, and interviews actually need.
          </p>
        </div>
        <div className="js-gsap-card rounded-2xl border border-[#17312E]/10 bg-[#17312E] p-8 text-white shadow-lg shadow-[#17312E]/[0.08]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9AD6D1]">Bring order to the list</p>
          <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            Turn your application sheet into a finished workspace.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#BFD3CF]">
            Keep the speed of a spreadsheet, then add the structure needed to stay prepared and consistent.
          </p>
          <button type="button" onClick={onGetStarted} className="mt-8 rounded-xl bg-[#2F8F88] px-9 py-4 text-base font-bold text-white shadow-sm shadow-black/10 transition hover:bg-[#256E68]">
            Create your tracker
          </button>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage({ onGetStarted }) {
  const heroRef = useRef(null);
  useGsapReveal(heroRef, { selector: ".js-hero-reveal", y: 16, duration: 0.7, stagger: 0.08, immediate: true });

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F6FBFA] text-[#17312E]">
      <nav className="sticky top-0 z-50 border-b border-[rgba(23,49,46,0.08)] bg-[#F6FBFA]/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/Logo.png" alt="Applume" className="h-8 w-8 object-contain" style={{ mixBlendMode: "multiply" }} />
            <span className="text-sm font-black tracking-tight">
              <span className="text-[#17312E]">App</span><span className="text-[#2F8F88]">lume</span>
            </span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-semibold text-[#667A75] sm:flex">
            <a href="#why-applume" className="transition hover:text-[#17312E]">Why Applume</a>
            <a href="#features" className="transition hover:text-[#17312E]">Features</a>
            <a href="#how-it-works" className="transition hover:text-[#17312E]">How it works</a>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onGetStarted} className="hidden rounded-xl px-3.5 py-2 text-sm font-semibold text-[#667A75] transition hover:bg-white hover:text-[#17312E] sm:block">
              Sign in
            </button>
            <button type="button" onClick={onGetStarted} className="hidden rounded-xl bg-[#2F8F88] px-4 py-2 text-sm font-bold text-white shadow-sm shadow-[#17312E]/5 transition hover:bg-[#256E68] sm:inline-flex">
              <span>Start tracking free</span>
            </button>
          </div>
        </div>
      </nav>

      <section ref={heroRef} className="relative overflow-hidden px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-24 lg:pb-24 lg:pt-28">
        <div className="relative z-10 mx-auto max-w-4xl">
          <span
            className="js-hero-reveal inline-flex max-w-[calc(100vw-2rem)] items-center justify-center gap-2 rounded-full border border-[rgba(23,49,46,0.08)] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#2F8F88] shadow-sm shadow-[#17312E]/[0.03] sm:px-4 sm:text-[11px] sm:tracking-[0.18em]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#2F8F88]" />
            Built for spreadsheet escapees
          </span>

          <h1
            className="js-hero-reveal mx-auto mt-7 max-w-[17rem] text-[1.72rem] font-black leading-[1.08] tracking-tight min-[420px]:max-w-4xl min-[420px]:text-[2.8rem] sm:text-[4rem] sm:leading-[1.04] lg:text-[4.75rem]"
          >
            <span className="block sm:hidden">Applications</span>
            <span className="block sm:hidden">deserve better</span>
            <span className="block sm:hidden">than a</span>
            <span className="block sm:hidden">spreadsheet.</span>
            <span className="hidden sm:inline">Your applications deserve better than </span>
            <span className="hidden sm:block">a spreadsheet.</span>
          </h1>

          <p
            className="js-hero-reveal mx-auto mt-6 max-w-[21rem] text-base leading-7 text-[#667A75] sm:max-w-2xl sm:text-lg sm:leading-8"
          >
            Applume turns job and university applications into calm, structured records with deadlines, documents, links, notes, statuses, and next steps.
          </p>

          <div
            className="js-hero-reveal mx-auto mt-7 grid w-full max-w-sm gap-2 text-xs font-bold text-[#667A75] sm:max-w-2xl sm:grid-cols-3"
          >
            {["12 tabs open", "Deadline hidden in a row", "Portal link lost again"].map((item) => (
              <span key={item} className="rounded-xl border border-[rgba(23,49,46,0.08)] bg-white/90 px-3 py-2.5 text-center shadow-sm shadow-[#17312E]/[0.03]">
                {item}
              </span>
            ))}
          </div>

          <div
            className="js-hero-reveal mx-auto mt-9 flex w-full max-w-xs flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row"
          >
            <button type="button" onClick={onGetStarted} className="w-full rounded-xl bg-[#2F8F88] px-8 py-3.5 text-base font-bold text-white shadow-sm shadow-[#17312E]/5 transition hover:bg-[#256E68] sm:w-auto">
              Build my tracker
            </button>
            <a href="#example-tracker" className="w-full rounded-xl border border-[rgba(23,49,46,0.08)] bg-white/95 px-6 py-3.5 text-sm font-bold text-[#17312E] shadow-sm shadow-[#17312E]/[0.03] transition hover:border-[#2F8F88]/30 hover:bg-white hover:text-[#256E68] sm:w-auto">
              See the product demo
            </a>
          </div>

          <p
            className="js-hero-reveal mx-auto mt-5 max-w-[17rem] text-xs leading-5 text-[#667A75] sm:max-w-xl"
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
      <FounderNote onGetStarted={onGetStarted} />
      <LandingFooter />
    </div>
  );
}
