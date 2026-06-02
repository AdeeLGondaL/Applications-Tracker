export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto max-w-3xl px-6 py-12">

        {/* Header */}
        <header className="mb-12 border-b border-slate-200 pb-10">
          <div className="flex items-center gap-4 mb-6">
            <img
              src="/Logo.png"
              alt="ApplyBuddy logo"
              className="h-14 w-14 object-contain shrink-0"
              style={{ mixBlendMode: "multiply" }}
            />
            <div>
              <h1 className="text-3xl font-black leading-tight tracking-tight">
                <span className="text-slate-950">Apply</span><span className="text-emerald-600">Buddy</span>
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">Privacy Policy</p>
            </div>
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Last updated: June 2026</p>
        </header>

        {/* Body */}
        <div className="space-y-10">

          {/* 1. Who we are */}
          <section>
            <h2 className="text-xl font-black text-slate-950 mb-3">1. Who we are</h2>
            <p className="text-slate-700 leading-7">
              ApplyBuddy is a free personal application tracker for university and job applications. It is a
              personal project provided free of charge, with no advertising, no subscriptions, and no monetisation
              of user data. The service is accessible at <span className="font-semibold">applybuddy.netlify.app</span>.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* 2. What data we collect */}
          <section>
            <h2 className="text-xl font-black text-slate-950 mb-3">2. What data we collect</h2>
            <div className="space-y-5 text-slate-700 leading-7">
              <div>
                <p className="font-bold text-slate-900 mb-1">Account data</p>
                <p>
                  When you create an account, we collect your email address. This is used solely to authenticate
                  you and to send the one-time email confirmation required to activate your account. We do not
                  send marketing emails.
                </p>
              </div>
              <div>
                <p className="font-bold text-slate-900 mb-1">Application data</p>
                <p>
                  We store the university and job application details you manually enter into the tracker —
                  such as institution names, programme or role titles, deadlines, statuses, priority levels,
                  and any notes you add. This data is entirely created by you.
                </p>
              </div>
              <div>
                <p className="font-bold text-slate-900 mb-1">AI processing (auto-fill feature)</p>
                <p>
                  When you use the AI auto-fill feature, the text or URL you provide — which may include job
                  descriptions or programme details — is sent to Groq's API for processing. This data is used
                  solely to generate a pre-filled application form. We do not store this data beyond the
                  duration of the API request, and it is not retained on our servers.
                </p>
              </div>
              <div>
                <p className="font-bold text-slate-900 mb-1">Theme preference</p>
                <p>
                  Your light/dark theme preference is stored locally in your browser's <code className="rounded bg-slate-100 px-1 py-0.5 text-xs font-mono">localStorage</code>.
                  This data never leaves your device and is never sent to any server.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm">
                <p className="font-bold text-slate-800 mb-1">Cookies</p>
                <p className="text-slate-600">
                  ApplyBuddy does not use cookies. Authentication is handled entirely through browser
                  localStorage via Supabase Auth — no cookies are set.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 3. How we use your data */}
          <section>
            <h2 className="text-xl font-black text-slate-950 mb-3">3. How we use your data</h2>
            <ul className="space-y-2 text-slate-700 leading-7 list-disc list-inside">
              <li>To provide and improve the application tracking service</li>
              <li>To send you the one-time account verification email required to activate your account</li>
              <li>To process AI auto-fill requests when you explicitly use that feature</li>
            </ul>
            <p className="mt-4 text-slate-700 leading-7">
              We do not sell, share, rent, or otherwise monetise your personal data. We do not use your data
              for advertising or profiling.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* 4. Data storage and security */}
          <section>
            <h2 className="text-xl font-black text-slate-950 mb-3">4. Data storage and security</h2>
            <div className="space-y-3 text-slate-700 leading-7">
              <p>
                Your data is stored securely in Supabase's database. Row-level security (RLS) policies are
                enforced at the database level, meaning only you can read or write your own data — even at
                the database query level, other users' data is inaccessible to you.
              </p>
              <p>
                All data is encrypted in transit using HTTPS/TLS. The app is hosted on Cloudflare's global
                edge network, which provides additional DDoS protection and infrastructure security.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 5. Sub-processors */}
          <section>
            <h2 className="text-xl font-black text-slate-950 mb-3">5. Sub-processors</h2>
            <p className="text-slate-700 leading-7 mb-5">
              We rely on the following third-party services to operate ApplyBuddy. Each processes data only
              as necessary to provide their service.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">
                    <th className="px-4 py-3 font-black text-slate-800">Provider</th>
                    <th className="px-4 py-3 font-black text-slate-800">Purpose</th>
                    <th className="px-4 py-3 font-black text-slate-800">Website</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-3 font-semibold text-slate-800">Supabase</td>
                    <td className="px-4 py-3 text-slate-600">Authentication and database (servers in US/EU)</td>
                    <td className="px-4 py-3">
                      <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline font-semibold">supabase.com</a>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-3 font-semibold text-slate-800">Cloudflare</td>
                    <td className="px-4 py-3 text-slate-600">App hosting and edge functions</td>
                    <td className="px-4 py-3">
                      <a href="https://cloudflare.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline font-semibold">cloudflare.com</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-800">Groq</td>
                    <td className="px-4 py-3 text-slate-600">AI text processing (only when auto-fill feature is used)</td>
                    <td className="px-4 py-3">
                      <a href="https://groq.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline font-semibold">groq.com</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 6. Your rights under GDPR */}
          <section>
            <h2 className="text-xl font-black text-slate-950 mb-3">6. Your rights under GDPR</h2>
            <p className="text-slate-700 leading-7 mb-5">
              If you are located in the European Economic Area (EEA) or the United Kingdom, you have the
              following rights regarding your personal data:
            </p>
            <div className="space-y-4">
              {[
                {
                  right: "Right of access",
                  desc: "You can view all your data in the app at any time. All application data you have entered is displayed directly in your dashboard.",
                },
                {
                  right: "Right to rectification",
                  desc: "You can edit or correct any data directly within the app at any time.",
                },
                {
                  right: "Right to erasure (right to be forgotten)",
                  desc: "You can permanently delete your account and all associated data at any time. Go to Settings → Delete Account. Upon deletion, all your application data and account information are permanently removed.",
                },
                {
                  right: "Data portability",
                  desc: "You can export all your application data as a CSV file at any time using the Export button in the dashboard. A full JSON backup is also available.",
                },
                {
                  right: "Right to object",
                  desc: "You can stop using the service and delete your account at any time. There are no lock-in periods or contractual obligations.",
                },
              ].map(({ right, desc }) => (
                <div key={right} className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <div>
                    <p className="font-bold text-slate-900">{right}</p>
                    <p className="mt-0.5 text-slate-600 leading-6 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 7. Data retention */}
          <section>
            <h2 className="text-xl font-black text-slate-950 mb-3">7. Data retention</h2>
            <p className="text-slate-700 leading-7">
              Your data is kept for as long as your account remains active. When you delete your account,
              all application data and account information are permanently removed from our systems within
              24 hours. We do not retain backups of deleted accounts beyond that window.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* 8. Contact */}
          <section>
            <h2 className="text-xl font-black text-slate-950 mb-3">8. Contact</h2>
            <p className="text-slate-700 leading-7">
              For any privacy-related questions, to exercise your data rights, or to raise a concern, please
              use the feedback form inside the app (available after signing in). We aim to respond to all
              privacy requests within 30 days.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* 9. Changes to this policy */}
          <section>
            <h2 className="text-xl font-black text-slate-950 mb-3">9. Changes to this policy</h2>
            <p className="text-slate-700 leading-7">
              We may update this Privacy Policy from time to time. When we do, we will update the "Last
              updated" date at the top of this page. Continued use of ApplyBuddy after any changes
              constitutes your acceptance of the revised policy. We encourage you to review this page
              periodically.
            </p>
          </section>

        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-200 pt-8 pb-4 flex flex-col items-center gap-3 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to ApplyBuddy
          </a>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} ApplyBuddy</p>
        </footer>

      </div>
    </div>
  );
}
