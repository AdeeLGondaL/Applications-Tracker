// Static, prerendered SEO landing pages (/huntr-alternative etc.).
// Content lives in PAGES; scripts/prerender.mjs renders each route to HTML.
// Keep claims about competitors conservative and factual — these pages only
// work if they stay honest.

const CHECK = (
  <svg className="h-4 w-4 shrink-0 text-[var(--applume-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);

const PAGES = {
  "huntr-alternative": {
    badge: "Applume vs Huntr",
    h1: "A free Huntr alternative built for students",
    intro:
      "Huntr is a solid job-search CRM — but it's job-only, and its free plan caps how much you can track. If you're a student juggling university applications alongside internships and working-student jobs, Applume tracks both in one free workspace.",
    rows: [
      ["University admissions tracking", "Yes - programs, portals, transcripts, deadlines", "No - job search only"],
      ["Job application tracking", "Yes", "Yes"],
      ["Price", "Free", "Free tier with limits; paid plan for full features"],
      ["Track unlimited applications", "Yes", "Limited on the free plan"],
      ["CSV import from your spreadsheet", "Yes, with column matching", "Import support varies by plan"],
      ["Export your data anytime", "CSV and JSON, one click", "Yes"],
    ],
    competitor: "Huntr",
    why: [
      "You're applying to degree programs and jobs at the same time - one tracker for both pipelines.",
      "You're price-sensitive - Applume's tracker is free, with no cap that forces an upgrade mid-season.",
      "You're switching from a spreadsheet - import your existing sheet as CSV and keep working.",
    ],
    honest:
      "Huntr is a mature product with a browser extension, contact tracking, and a job-search CRM feature set that goes deeper on the job-hunt side. If you're a professional running a long job search with networking contacts and you don't mind paying, Huntr is a fair choice. If you're a student tracking applications - especially university ones - Applume covers what you need for free.",
    faq: [
      ["Can I move my data from Huntr to Applume?", "Yes. Export your data from Huntr as CSV, then use Applume's CSV import - it matches columns like company, role, deadline, and status automatically."],
      ["Is Applume really free?", "Yes. The tracker is free to use with no record limit and no credit card. You can export or delete your data at any time."],
    ],
  },
  "teal-alternative": {
    badge: "Applume vs Teal",
    h1: "A free Teal alternative that also tracks university applications",
    intro:
      "Teal is a resume-first career platform with a good job tracker. But it's built around the US job hunt - resume optimization, keyword matching - and doesn't cover university admissions. Applume is a lighter, free tracker for people managing study programs and jobs side by side.",
    rows: [
      ["University admissions tracking", "Yes - programs, portals, documents, deadlines", "No - job search only"],
      ["Job application tracking", "Yes", "Yes"],
      ["Price", "Free", "Free tier; paid subscription for premium features"],
      ["Resume builder & keyword matching", "No - Applume tracks, it doesn't write", "Yes, a core feature"],
      ["CSV import from your spreadsheet", "Yes, with column matching", "Limited"],
      ["Export your data anytime", "CSV and JSON, one click", "Varies by feature"],
    ],
    competitor: "Teal",
    why: [
      "You need admissions and job tracking together - deadlines, transcripts, motivation letters, and interviews in one place.",
      "You want a tracker, not a platform - no resume-scoring upsells between you and your deadline list.",
      "You're outside the US - Applume handles university-style workflows and semicolon CSV exports from European spreadsheets.",
    ],
    honest:
      "If your main problem is your resume - tailoring it per job, matching keywords, tracking versions - Teal's resume tooling is genuinely useful and Applume doesn't try to replace it. If your main problem is keeping many applications organized without losing deadlines, that's exactly what Applume does, for free.",
    faq: [
      ["Can I use Applume and Teal together?", "Sure - some people write their resume in Teal and track everything in Applume. Your tracking data stays exportable either way."],
      ["Does Applume have AI features?", "Yes - paste a job posting or program page and AI autofill drafts the record for you. You review every field before saving."],
    ],
  },
  "university-application-tracker": {
    badge: "For applicants",
    h1: "A university application tracker that isn't a spreadsheet",
    intro:
      "Applying to universities means portals, transcripts, motivation letters, recommendation deadlines, and application windows that all behave differently. A spreadsheet holds the names - Applume holds the whole application: status, deadline, documents, links, notes, and your next step.",
    rows: [
      ["Deadline tracking", "Urgent and overdue items surface automatically", "You sort columns and hope"],
      ["Documents per application", "Checklist per record - CV, transcript, letters", "A cell of comma-separated text"],
      ["Portal links & logins", "Attached to each application", "Scattered across tabs and notes"],
      ["Status pipeline", "Not open yet → Applying → Submitted → Interview → Result", "Manual color coding"],
      ["Jobs & internships too", "Same workspace, job-specific fields", "A second messy sheet"],
      ["Price", "Free", "Free (but so is losing track)"],
    ],
    competitor: "A spreadsheet",
    why: [
      "Deadlines stop hiding - anything urgent or overdue is visible the moment you open the app.",
      "Each application keeps its documents, portal link, and notes together - no more hunting through tabs.",
      "Start from your existing sheet - CSV import matches your columns in one step.",
    ],
    honest:
      "Spreadsheets are genuinely great at custom columns and quick math, and if yours works for you, keep it - Applume exports back to CSV anytime, so you're never locked in. Applume earns its place when the sheet starts failing you: missed deadlines, lost links, and rows that can't hold the context a real application carries.",
    faq: [
      ["Does it work for job applications too?", "Yes - Applume tracks university and job applications in one workspace, each with its own fields (recruiters and interviews for jobs, programs and transcripts for universities)."],
      ["How do I get my spreadsheet in?", "Export it as CSV (File > Download > CSV in Google Sheets), upload it to Applume, and confirm the column matches. Deadlines, statuses, and links come along."],
    ],
  },
};

function Header() {
  return (
    <header className="border-b border-[rgba(23,49,46,0.08)] bg-[#F6FBFA]/92 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="/" className="flex min-h-11 items-center gap-2.5">
          <img src="/Logo.png" alt="Applume" className="h-8 w-8 object-contain" style={{ mixBlendMode: "multiply" }} />
          <span className="text-sm font-black tracking-tight">
            <span className="text-[#17312E]">App</span><span className="text-[var(--applume-accent)]">lume</span>
          </span>
        </a>
        <a href="/signup" className="inline-flex min-h-11 items-center rounded-xl bg-[var(--applume-accent)] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--applume-accent-hover)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--applume-accent)]">
          Start tracking free
        </a>
      </nav>
    </header>
  );
}

export default function SeoPage({ slug }) {
  const page = PAGES[slug];
  if (!page) {
    if (typeof window !== "undefined") window.location.replace("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F6FBFA] text-[#17312E]">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="inline-flex rounded-full border border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--applume-accent)]">
          {page.badge}
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">{page.h1}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#5A6B66] sm:text-lg sm:leading-8">{page.intro}</p>
        <a href="/signup" className="mt-8 inline-flex rounded-xl bg-[var(--applume-accent)] px-8 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-[var(--applume-accent-hover)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--applume-accent)]">
          Start tracking free
        </a>

        <section className="mt-16" aria-label="Comparison">
          <div className="overflow-x-auto rounded-2xl border border-[rgba(23,49,46,0.08)] bg-white shadow-sm">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-[rgba(23,49,46,0.08)] text-xs font-black uppercase tracking-wider text-[#5A6B66]">
                  <th scope="col" className="px-5 py-4"> </th>
                  <th scope="col" className="px-5 py-4 text-[var(--applume-accent)]">Applume</th>
                  <th scope="col" className="px-5 py-4">{page.competitor}</th>
                </tr>
              </thead>
              <tbody>
                {page.rows.map(([feature, applume, other]) => (
                  <tr key={feature} className="border-b border-[rgba(23,49,46,0.05)] last:border-b-0">
                    <th scope="row" className="px-5 py-4 font-bold">{feature}</th>
                    <td className="px-5 py-4 font-semibold text-[#17312E]">{applume}</td>
                    <td className="px-5 py-4 text-[#5A6B66]">{other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[#5A6B66]">
            Comparison reflects publicly available information as of mid-2026 and may change - check the other product's site for current details.
          </p>
        </section>

        <section className="mt-16 grid gap-4 lg:grid-cols-2" aria-label="Why Applume">
          <div className="rounded-2xl border border-[rgba(23,49,46,0.08)] bg-white p-7 shadow-sm">
            <h2 className="text-xl font-black">When Applume is the right pick</h2>
            <ul className="mt-4 space-y-3">
              {page.why.map((reason) => (
                <li key={reason} className="flex gap-3 text-sm leading-6 text-[#5A6B66]">
                  {CHECK}
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[rgba(23,49,46,0.08)] bg-white p-7 shadow-sm">
            <h2 className="text-xl font-black">And honestly, when it isn't</h2>
            <p className="mt-4 text-sm leading-7 text-[#5A6B66]">{page.honest}</p>
          </div>
        </section>

        <section className="mt-16" aria-label="Frequently asked questions">
          <h2 className="text-2xl font-black">Common questions</h2>
          <div className="mt-5 space-y-3">
            {page.faq.map(([q, a]) => (
              <div key={q} className="rounded-2xl border border-[rgba(23,49,46,0.08)] bg-white p-6 shadow-sm">
                <h3 className="text-base font-black">{q}</h3>
                <p className="mt-2 text-sm leading-7 text-[#5A6B66]">{a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-2xl bg-[#17312E] p-8 text-white sm:p-10" aria-label="Get started">
          <h2 className="text-2xl font-black sm:text-3xl">Track every application in one free workspace.</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#BFD3CF]">
            Deadlines, documents, portals, statuses, and next steps - for university and job applications alike. Import your spreadsheet and go.
          </p>
          <a href="/signup" className="mt-6 inline-flex rounded-xl bg-[var(--applume-accent)] px-8 py-3.5 text-base font-bold text-white transition hover:bg-[var(--applume-accent-hover)]">
            Start tracking free
          </a>
        </section>
      </main>

      <footer className="border-t border-[rgba(23,49,46,0.08)] py-8 text-center text-xs text-[#5A6B66]">
        <p>
          &copy; {new Date().getFullYear()} Applume
          {" - "}<a href="/" className="hover:text-[#17312E]">Home</a>
          {" - "}<a href="/privacy" className="hover:text-[#17312E]">Privacy</a>
          {" - "}<a href="/terms" className="hover:text-[#17312E]">Terms</a>
          {" - "}<a href="mailto:hello@applume.app" className="hover:text-[#17312E]">hello@applume.app</a>
        </p>
      </footer>
    </div>
  );
}
