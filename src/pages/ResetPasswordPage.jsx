import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Icon } from "@/components/ui/Icon";
import { PasswordStrength } from "@/components/ui/PasswordStrength";

// Landing target for Supabase password-recovery links (/reset).
// The supabase client parses the recovery token from the URL automatically;
// we wait for that session, then let the user choose a new password.
export default function ResetPasswordPage() {
  const [status, setStatus] = useState("checking"); // checking | ready | invalid | done
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const { data: authState } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY" || session) setStatus((s) => (s === "checking" ? "ready" : s));
    });

    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) setStatus((s) => (s === "checking" ? "ready" : s));
    });

    const timeout = window.setTimeout(() => {
      if (active) setStatus((s) => (s === "checking" ? "invalid" : s));
    }, 8000);

    return () => {
      active = false;
      window.clearTimeout(timeout);
      authState.subscription.unsubscribe();
    };
  }, []);

  async function handleSave() {
    if (saving) return;
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError("");
    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (updateError) { setError(updateError.message || "Could not update your password. Please try again."); return; }
    setStatus("done");
  }

  return (
    <div className="min-h-screen bg-[#F6FBFA] text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
        <div className="mb-8 flex items-center justify-center gap-3">
          <img src="/Logo.png" alt="Applume logo" className="h-12 w-12 object-contain" style={{ mixBlendMode: "multiply" }} />
          <span className="text-2xl font-black tracking-tight">
            <span className="text-slate-950 dark:text-slate-50">App</span><span className="text-emerald-600">lume</span>
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/70 dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-900/50">
          {status === "checking" && (
            <div className="py-6 text-center">
              <svg className="mx-auto h-6 w-6 animate-spin text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" />
              </svg>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Checking your reset link...</p>
            </div>
          )}

          {status === "invalid" && (
            <div className="py-2 text-center">
              <h1 className="text-2xl font-black">This link has expired</h1>
              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Password reset links only work once and expire quickly. Request a new one from the sign-in page.
              </p>
              <a href="/" className="mt-6 block w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-500">
                Back to sign in
              </a>
            </div>
          )}

          {status === "ready" && (
            <div>
              <h1 className="text-2xl font-black">Choose a new password</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">You'll use this to sign in from now on.</p>

              <div className="mt-6 grid gap-1.5">
                <label htmlFor="new-password" className="text-sm font-bold text-slate-700 dark:text-slate-200">New password</label>
                <div className="relative">
                  <input
                    id="new-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    autoComplete="new-password"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm outline-none transition-all duration-150 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-600 dark:focus:bg-slate-600 dark:focus:ring-emerald-900/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-3.5 text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <Icon name={showPassword ? "eyeOff" : "eye"} className="h-4 w-4" />
                  </button>
                </div>
                {password.length > 0 && <PasswordStrength password={password} />}
                {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !password}
                className="mt-5 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save new password"}
              </button>
            </div>
          )}

          {status === "done" && (
            <div className="py-2 text-center">
              <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-emerald-50 dark:bg-emerald-900/40">
                <Icon name="check" className="h-7 w-7 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-black">Password updated</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">You're signed in with your new password.</p>
              <a href="/" className="mt-6 block w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-500">
                Go to your tracker
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
