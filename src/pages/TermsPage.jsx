const SECTIONS = [
  {
    title: "1. What Applume is",
    body: [
      "Applume is a free web application for tracking university admissions and job applications. You create an account, add your applications, and Applume keeps deadlines, statuses, documents, links, and notes organized in one place.",
    ],
  },
  {
    title: "2. Your account",
    body: [
      "You need an account to use Applume. You are responsible for keeping your sign-in credentials safe and for everything that happens under your account. You must be at least 16 years old (or the minimum age of digital consent in your country) to create an account.",
    ],
  },
  {
    title: "3. Your data belongs to you",
    body: [
      "Everything you store in Applume - applications, deadlines, notes, documents lists, links - remains yours. You can export it as CSV or JSON at any time, and you can delete your account (which permanently removes your data) whenever you want. See the Privacy Policy for details on how your data is stored and protected.",
    ],
  },
  {
    title: "4. Acceptable use",
    body: [
      "Use Applume for tracking your own applications. Don't attempt to access other users' data, disrupt the service, abuse the AI autofill or import features with automated bulk requests, or use Applume for anything unlawful.",
    ],
  },
  {
    title: "5. AI features",
    body: [
      "AI autofill drafts application details from pages or text you provide. It can make mistakes - always review extracted fields before saving. AI output is a convenience, not advice, and Applume is not responsible for decisions made based on it.",
    ],
  },
  {
    title: "6. The service is provided as-is",
    body: [
      "Applume is free and provided \"as is\" without warranties of any kind. We work to keep it fast, secure, and available, but we can't guarantee uninterrupted service or zero data loss - please keep backups of anything critical (the export button exists for a reason). To the maximum extent permitted by law, Applume's liability for any claim related to the service is limited to the amount you paid for it (which, for the free service, is zero).",
    ],
  },
  {
    title: "7. Changes to the service or these terms",
    body: [
      "Applume evolves - features may be added, changed, or removed. If these terms change in a meaningful way, we'll note the new date at the top of this page. Continuing to use Applume after a change means you accept the updated terms.",
    ],
  },
  {
    title: "8. Termination",
    body: [
      "You can stop using Applume and delete your account at any time. We may suspend accounts that violate these terms or abuse the service, and will be reasonable about it.",
    ],
  },
  {
    title: "9. Contact",
    body: [
      "Questions about these terms? Email hello@applume.app.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <header className="mb-12 border-b border-slate-200 pb-10">
          <div className="flex items-center gap-4">
            <img
              src="/Logo.png"
              alt="Applume logo"
              className="h-14 w-14 shrink-0 object-contain"
              style={{ mixBlendMode: "multiply" }}
            />
            <div>
              <h1 className="text-3xl font-black leading-tight tracking-tight">
                <span className="text-slate-950">App</span><span className="text-emerald-600">lume</span>
              </h1>
              <p className="mt-0.5 text-sm text-slate-600">Terms of Service</p>
            </div>
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-slate-500">Last updated: July 2026</p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            The short version: Applume is a free tracker for your applications. Your data stays yours, export it anytime,
            be reasonable, and we'll do the same. The details follow in plain language.
          </p>
        </header>

        <main className="space-y-10">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 text-xl font-black text-slate-950">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-sm leading-7 text-slate-600">{paragraph}</p>
              ))}
            </section>
          ))}
        </main>

        <footer className="mt-14 border-t border-slate-200 pt-8 text-sm text-slate-500">
          <p>
            See also the{" "}
            <a href="/privacy" className="font-semibold text-emerald-600 hover:underline">Privacy Policy</a>
            {" "}- or head{" "}
            <a href="/" className="font-semibold text-emerald-600 hover:underline">back to Applume</a>.
          </p>
        </footer>
      </div>
    </div>
  );
}
