import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { PasswordStrength } from "@/components/ui/PasswordStrength";

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
    <footer className="mt-16 border-t border-slate-200 pt-10 pb-8 text-center dark:border-slate-800">
      <p className="text-sm font-black text-slate-800 dark:text-slate-100">Know someone still tracking applications in spreadsheets?</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Share ApplyBuddy — free forever, no credit card, no ads.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        {typeof navigator !== "undefined" && !!navigator.share && (
          <button type="button" onClick={handleNativeShare} className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100">
            <Icon name="share" className="h-3.5 w-3.5" /> Share
          </button>
        )}
        <button type="button" onClick={handleCopy} className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-bold transition ${copied ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"}`}>
          <Icon name={copied ? "check" : "copy"} className="h-3.5 w-3.5" />
          {copied ? "Copied!" : "Copy link"}
        </button>
        {socials.map(({ label, href, hover }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 ${hover}`}>{label}</a>
        ))}
      </div>
      <p className="mt-8 text-xs text-slate-400 dark:text-slate-500">
        © {new Date().getFullYear()} ApplyBuddy · Free forever · No credit card required
        {" · "}
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Privacy Policy</a>
      </p>
    </footer>
  );
}

function mapAuthError(error) {
  const msg = (error?.message || "").toLowerCase();
  if (msg.includes("invalid login credentials") || msg.includes("invalid credentials")) return "Incorrect email or password. Please try again.";
  if (msg.includes("email not confirmed")) return "Please confirm your email first — check your inbox for the confirmation link.";
  if (msg.includes("already registered") || msg.includes("user already registered")) return "An account with this email already exists.";
  if (msg.includes("password") && (msg.includes("6") || msg.includes("characters") || msg.includes("weak") || msg.includes("short"))) return "Password must be at least 6 characters long.";
  if (msg.includes("invalid email") || msg.includes("unable to validate")) return "Enter a valid email address.";
  if (msg.includes("rate limit") || msg.includes("too many requests") || msg.includes("over_email_send_rate_limit")) return "Too many attempts — please wait a minute and try again.";
  if (msg.includes("network") || msg.includes("failed to fetch") || msg.includes("load failed")) return "Connection error — check your internet and try again.";
  if (msg.includes("signup is disabled") || msg.includes("signups not allowed")) return "New sign-ups are currently disabled. Contact the administrator.";
  return error?.message || "Something went wrong. Please try again.";
}

export default function AuthPage({ mode: initialMode, onModeChange, onClose }) {
  const [authMode, setAuthMode] = useState(initialMode || "signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [signupSent, setSignupSent] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  function switchAuthMode(mode) {
    setAuthMode(mode);
    if (onModeChange) onModeChange(mode);
    setAuthError("");
    setFieldErrors({ email: "", password: "" });
    setSignupSent(false);
    setAgreedToPrivacy(false);
  }

  function validateAuth() {
    const errors = { email: "", password: "" };
    if (!authEmail.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) errors.email = "Enter a valid email address.";
    if (!authPassword) errors.password = "Password is required.";
    else if (authMode === "signup" && authPassword.length < 6) errors.password = "Password must be at least 6 characters.";
    setFieldErrors(errors);
    return !errors.email && !errors.password;
  }

  function handleAuthSubmit() {
    if (authLoading) return;
    if (authMode === "signin") signIn();
    else signUp();
  }

  async function signIn() {
    if (!validateAuth()) return;
    setAuthError("");
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    setAuthLoading(false);
    if (error) { setAuthError(mapAuthError(error)); return; }
    // session change will be picked up by App's auth listener
  }

  async function signUp() {
    if (!validateAuth()) return;
    setAuthError("");
    setAuthLoading(true);
    const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
    setAuthLoading(false);
    if (error) { setAuthError(mapAuthError(error)); return; }
    setSignupSent(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 text-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-12 sm:px-6 lg:px-8">
        <motion.button
          type="button"
          onClick={onClose}
          className="mb-6 flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-400 transition hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to home
        </motion.button>

        <div className="my-auto grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

          {/* Left hero */}
          <motion.div className="space-y-8" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: "easeOut" }}>

            {/* Brand wordmark */}
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.45 }}>
              <div className="flex items-center gap-4">
                <img src="/Logo.png" alt="ApplyBuddy logo" className="h-20 w-20 object-contain shrink-0 sm:h-24 sm:w-24 dark:brightness-150" style={{ mixBlendMode: "multiply" }} />
                <div>
                  <h1 className="text-[3rem] font-black leading-none tracking-tight sm:text-6xl lg:text-[3.5rem]">
                    <span className="text-slate-950 dark:text-slate-50">Apply</span><span className="text-emerald-600">Buddy</span>
                  </h1>
                  <p className="mt-2 text-base font-semibold text-slate-500 dark:text-slate-400">Your buddy for every application.</p>
                </div>
              </div>
            </motion.div>

            <div className="space-y-4">
              <motion.span
                className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700"
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.3 }}
              >
                Free · No credit card
              </motion.span>
              <motion.p
                className="max-w-md text-base leading-7 text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.35 }}
              >
                One dashboard for all your university and job applications. Deadlines, statuses, documents — always in one place.
              </motion.p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: "Private & secure",   desc: "Your data is isolated per account in Supabase.",         icon: "check"    },
                { title: "Deadline alerts",    desc: "Spot overdue and urgent applications at a glance.",      icon: "calendar" },
                { title: "Full pipeline view", desc: "Track every stage from open to accepted.",               icon: "dashboard"},
                { title: "Export anytime",     desc: "Download your data as CSV or JSON backup.",              icon: "download" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.07, duration: 0.35 }}
                >
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40">
                    <Icon name={item.icon} className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right form card */}
          <motion.div
            className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/70 dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-900/50"
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
          >
            <AnimatePresence mode="wait">
              {signupSent ? (
                /* Email confirmation success screen */
                <motion.div key="signup-sent" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.25 }} className="py-2 text-center">
                  <motion.div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-emerald-50 dark:bg-emerald-900/40" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}>
                    <Icon name="mail" className="h-7 w-7 text-emerald-600" />
                  </motion.div>
                  <h2 className="text-2xl font-black text-slate-950 dark:text-slate-50">Check your inbox</h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">We sent a confirmation link to</p>
                  <p className="mt-1 break-all font-bold text-slate-800 dark:text-slate-100">{authEmail}</p>
                  <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Click the link in your email to activate your account, then return here to sign in.
                  </p>
                  <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left dark:border-amber-800 dark:bg-amber-900/30">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Not in your inbox? Check your spam folder. The email may take a minute to arrive.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => switchAuthMode("signin")}
                    className="mt-6 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-500"
                  >
                    Back to sign in
                  </button>
                </motion.div>
              ) : (
                /* Sign in / Sign up form */
                <motion.div key="auth-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

                  {/* Sliding tab switcher */}
                  <div className="mb-8 flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-700">
                    {[{ id: "signin", label: "Sign in" }, { id: "signup", label: "Sign up" }].map(({ id, label }) => (
                      <button key={id} type="button" onClick={() => switchAuthMode(id)} className="relative flex-1 rounded-xl py-2.5 text-sm font-bold">
                        {authMode === id && (
                          <motion.span layoutId="auth-tab-pill" className="absolute inset-0 rounded-xl bg-white shadow-sm dark:bg-slate-600" transition={{ type: "spring", stiffness: 400, damping: 35 }} />
                        )}
                        <span className={`relative z-10 transition-colors ${authMode === id ? "text-slate-950 dark:text-slate-100" : "text-slate-400 dark:text-slate-500"}`}>{label}</span>
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div key={authMode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
                      <div className="mb-6">
                        <h2 className="text-2xl font-black text-slate-950 dark:text-slate-50">{authMode === "signin" ? "Welcome back" : "Create your account"}</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{authMode === "signin" ? "Sign in to access your applications." : "Start tracking for free — takes 30 seconds."}</p>
                      </div>

                      <div className="space-y-4">
                        {/* Email field */}
                        <div className="grid gap-1.5">
                          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Email address</label>
                          <input
                            value={authEmail}
                            onChange={(e) => { setAuthEmail(e.target.value); setFieldErrors((f) => ({ ...f, email: "" })); setAuthError(""); }}
                            onKeyDown={(e) => { if (e.key === "Enter") handleAuthSubmit(); }}
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            className={`h-12 rounded-2xl border bg-slate-50 px-4 text-sm outline-none transition-all duration-150 focus:bg-white focus:ring-4 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-600 ${fieldErrors.email ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100 dark:border-rose-700 dark:focus:ring-rose-900/40" : "border-slate-200 focus:border-emerald-300 focus:ring-emerald-50 dark:border-slate-600 dark:focus:border-emerald-600 dark:focus:ring-emerald-900/30"}`}
                          />
                          <AnimatePresence>
                            {fieldErrors.email && (
                              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }} className="flex items-center gap-1.5 text-xs font-semibold text-rose-600">
                                <Icon name="close" className="h-3 w-3 shrink-0" />{fieldErrors.email}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Password field */}
                        <div className="grid gap-1.5">
                          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Password</label>
                          <div className="relative">
                            <input
                              value={authPassword}
                              onChange={(e) => { setAuthPassword(e.target.value); setFieldErrors((f) => ({ ...f, password: "" })); setAuthError(""); }}
                              onKeyDown={(e) => { if (e.key === "Enter") handleAuthSubmit(); }}
                              type={showPassword ? "text" : "password"}
                              placeholder={authMode === "signup" ? "Min. 6 characters" : "Enter your password"}
                              autoComplete={authMode === "signup" ? "new-password" : "current-password"}
                              className={`h-12 w-full rounded-2xl border bg-slate-50 px-4 pr-12 text-sm outline-none transition-all duration-150 focus:bg-white focus:ring-4 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-600 ${fieldErrors.password ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100 dark:border-rose-700 dark:focus:ring-rose-900/40" : "border-slate-200 focus:border-emerald-300 focus:ring-emerald-50 dark:border-slate-600 dark:focus:border-emerald-600 dark:focus:ring-emerald-900/30"}`}
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
                          <AnimatePresence>
                            {fieldErrors.password && (
                              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }} className="flex items-center gap-1.5 text-xs font-semibold text-rose-600">
                                <Icon name="close" className="h-3 w-3 shrink-0" />{fieldErrors.password}
                              </motion.p>
                            )}
                          </AnimatePresence>
                          {authMode === "signup" && authPassword.length > 0 && !fieldErrors.password && (
                            <PasswordStrength password={authPassword} />
                          )}
                        </div>

                        {/* General auth error */}
                        <AnimatePresence>
                          {authError && (
                            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 dark:border-rose-800 dark:bg-rose-900/30">
                              <Icon name="close" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                              <div>
                                <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">{authError}</p>
                                {authError.includes("already exists") && (
                                  <button type="button" onClick={() => switchAuthMode("signin")} className="mt-1 text-xs font-bold text-rose-600 underline underline-offset-2 hover:no-underline dark:text-rose-400">
                                    Sign in instead →
                                  </button>
                                )}
                                {authError.includes("confirm your email") && (
                                  <p className="mt-1 text-xs text-rose-500 dark:text-rose-400">Check your spam folder if you can't find it.</p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Privacy consent checkbox — signup only */}
                        {authMode === "signup" && (
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              required
                              checked={agreedToPrivacy}
                              onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-emerald-600"
                            />
                            <span className="text-sm text-slate-600">
                              I agree to the{" "}
                              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-600 hover:underline">
                                Privacy Policy
                              </a>
                              . I understand my data is stored securely and I can delete it at any time.
                            </span>
                          </label>
                        )}

                        {/* Submit button */}
                        <Button
                          onClick={handleAuthSubmit}
                          disabled={authLoading || (authMode === "signup" && !agreedToPrivacy)}
                          className="h-12 w-full rounded-2xl bg-emerald-600 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                        >
                          {authLoading ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" />
                              </svg>
                              {authMode === "signin" ? "Signing in…" : "Creating account…"}
                            </span>
                          ) : authMode === "signin" ? "Sign in to account" : "Create free account"}
                        </Button>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 dark:border-emerald-900/50 dark:bg-emerald-900/20">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-emerald-100 dark:bg-emerald-800/60">
                        <Icon name="check" className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-emerald-900 dark:text-emerald-300">Your data stays private</p>
                        <p className="mt-1 text-xs leading-5 text-emerald-700/70 dark:text-emerald-400/70">Each account is isolated in Supabase. Your applications are only visible to you.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>

        <LandingFooter />
      </div>
    </div>
  );
}
