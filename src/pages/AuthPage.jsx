import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { trackEvent } from "@/utils/analytics";
import { Icon } from "@/components/ui/Icon";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { PaperPlane } from "@/components/brand/PaperPlane";
import { Logo } from "@/components/brand/Logo";
import { useLanguage } from "@/i18n";

function mapAuthError(error) {
  const msg = (error?.message || "").toLowerCase();
  if (msg.includes("invalid login credentials") || msg.includes("invalid credentials")) return "Incorrect email or password. Please try again.";
  if (msg.includes("email not confirmed")) return "Please confirm your email first - check your inbox for the confirmation link.";
  if (msg.includes("provider") && (msg.includes("not enabled") || msg.includes("unsupported"))) return "Google sign-in isn't available right now. Please use your email instead.";
  if (msg.includes("already registered") || msg.includes("user already registered")) return "An account with this email already exists.";
  if (msg.includes("password") && (msg.includes("6") || msg.includes("characters") || msg.includes("weak") || msg.includes("short"))) return "Password must be at least 6 characters long.";
  if (msg.includes("invalid email") || msg.includes("unable to validate")) return "Enter a valid email address.";
  if (msg.includes("rate limit") || msg.includes("too many requests") || msg.includes("over_email_send_rate_limit")) return "Too many attempts - please wait a minute and try again.";
  if (msg.includes("network") || msg.includes("failed to fetch") || msg.includes("load failed")) return "Connection error - check your internet and try again.";
  if (msg.includes("signup is disabled") || msg.includes("signups not allowed")) return "New sign-ups are temporarily closed. Please check back soon.";
  return error?.message || "Something went wrong. Please try again.";
}

function authRedirectUrl() {
  if (typeof window === "undefined") return "https://applume.app/";
  return `${window.location.origin}/`;
}

function GoogleMark() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.23c0-.78-.07-1.53-.2-2.23H12v4.22h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.52Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.43l-3.24-2.51c-.9.6-2.04.95-3.38.95-2.6 0-4.8-1.76-5.6-4.12H3.06v2.59A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.4 13.89a6 6 0 0 1 0-3.78V7.52H3.06a10 10 0 0 0 0 8.96l3.34-2.59Z" />
      <path fill="#EA4335" d="M12 5.99c1.47 0 2.8.5 3.84 1.5l2.86-2.86A9.6 9.6 0 0 0 12 2 10 10 0 0 0 3.06 7.52l3.34 2.59C7.2 7.75 9.4 5.99 12 5.99Z" />
    </svg>
  );
}

const inputBase =
  "h-12 w-full rounded-[10px] border bg-[var(--surface-card)] px-4 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--text-soft)] focus:ring-2";
const inputOk = "border-[var(--border-strong)] focus:border-[var(--brand)] focus:ring-[var(--ring)]";
const inputErr = "border-[color-mix(in_srgb,var(--danger)_55%,transparent)] focus:border-[var(--danger)] focus:ring-[color-mix(in_srgb,var(--danger)_22%,transparent)]";

function SuccessPanel({ title, email, body, onBack }) {
  return (
    <motion.div key="sent" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="py-2 text-center">
      <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-[14px] bg-[var(--applume-accent-soft)] text-[var(--applume-accent)]">
        <Icon name="mail" className="h-6 w-6" />
      </div>
      <h2 className="font-display text-[1.6rem] leading-tight text-[var(--text-strong)]">{title}</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">We sent it to</p>
      <p className="mt-1 break-all text-sm font-semibold text-[var(--ink)]">{email}</p>
      <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-[var(--text-muted)]">{body}</p>
      <div className="mt-4 rounded-[10px] border border-[color-mix(in_srgb,var(--warning)_28%,transparent)] bg-[var(--warning-soft)] px-4 py-3 text-left">
        <p className="text-xs font-medium text-[var(--warning-ink)]">Not in your inbox? Check your spam folder — it may take a minute to arrive.</p>
      </div>
      <button type="button" onClick={onBack} className="mt-6 h-12 w-full rounded-[10px] bg-[var(--applume-accent-strong)] text-sm font-semibold text-white transition-colors hover:bg-[var(--applume-accent-ink)]">
        Back to sign in
      </button>
    </motion.div>
  );
}

export default function AuthPage({ mode: initialMode, onModeChange, onClose }) {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  // The URL (/signin | /signup) is the source of truth for the mode;
  // the reset flow is a local sub-state layered on top of /signin.
  const [isReset, setIsReset] = useState(false);
  const authMode = isReset ? "reset" : initialMode === "signup" ? "signup" : "signin";
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [signupSent, setSignupSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  useEffect(() => {
    trackEvent("auth_view", { mode: initialMode || "signin" });
  }, [initialMode]);

  function switchAuthMode(mode) {
    setIsReset(mode === "reset");
    if (onModeChange && mode !== "reset") onModeChange(mode);
    setAuthError("");
    setFieldErrors({ email: "", password: "" });
    setSignupSent(false);
    setResetSent(false);
    setAgreedToPrivacy(false);
  }

  function validateAuth() {
    const errors = { email: "", password: "" };
    if (!authEmail.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) errors.email = "Enter a valid email address.";
    if (authMode !== "reset") {
      if (!authPassword) errors.password = "Password is required.";
      else if (authMode === "signup" && authPassword.length < 6) errors.password = "Password must be at least 6 characters.";
    }
    setFieldErrors(errors);
    return !errors.email && !errors.password;
  }

  function handleAuthSubmit() {
    if (authLoading || oauthLoading) return;
    if (authMode === "signin") signIn();
    else if (authMode === "reset") sendReset();
    else signUp();
  }

  async function sendReset() {
    if (!validateAuth()) return;
    setAuthError("");
    setAuthLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(authEmail, {
      redirectTo: `${window.location.origin}/reset`,
    });
    setAuthLoading(false);
    if (error) { setAuthError(mapAuthError(error)); return; }
    trackEvent("password_reset_requested");
    setResetSent(true);
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
    trackEvent("signup_submitted");
    setSignupSent(true);
  }

  async function signInWithGoogle() {
    if (authLoading || oauthLoading) return;
    setAuthError("");
    setFieldErrors({ email: "", password: "" });
    setSignupSent(false);
    setOauthLoading(true);
    trackEvent("google_signin_clicked", { mode: authMode });
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: authRedirectUrl(),
      },
    });
    if (error) {
      setOauthLoading(false);
      setAuthError(mapAuthError(error));
    }
  }

  const heading = authMode === "signin" ? "Welcome back" : authMode === "reset" ? "Reset your password" : "Create your account";
  const subheading = authMode === "signin"
    ? "Return to your structured application tracker."
    : authMode === "reset"
      ? "Enter your email and we'll send a link to choose a new password."
      : "Start with one record. Grow it into your full tracker.";

  const points = [
    ["Application dossiers", "Notes, links and files stay attached to each opportunity."],
    ["Deadline radar", "Urgent and overdue items surface without sorting columns."],
    ["Table, cards or board", "Switch views without ever changing your data."],
    ["Export anytime", "Download CSV or JSON whenever you want a backup."],
  ];

  return (
    <div className="min-h-dvh bg-[var(--surface)] text-[var(--ink)]">
      {/* Full-width 50/50 split so the left panel's surface bleeds to the
          screen's left edge and meets the center. */}
      <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-2 lg:items-start">

        {/* ── Left editorial brand panel — fixed height so it never shifts
            when the form grows/shrinks between sign in and create account ─ */}
        <div className="relative order-2 hidden flex-col justify-between overflow-hidden border-r border-[var(--border)] bg-[var(--surface-alt)] px-10 py-10 lg:order-1 lg:flex lg:sticky lg:top-0 lg:h-dvh xl:px-16">
          {/* subtle plane motif */}
          {!reduce && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -right-10 top-24 text-[var(--applume-accent)]"
              style={{ opacity: 0.08 }}
              initial={{ y: 0 }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            >
              <PaperPlane className="h-64 w-64" />
            </motion.div>
          )}
          <a href="/" className="relative w-fit"><Logo imgClass="h-9 w-9" wordmarkClass="text-lg" /></a>

          <div className="relative max-w-md">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">Spreadsheet, rebuilt as a workspace</p>
            <h1 className="font-display mt-4 text-[clamp(1.9rem,2.8vw,2.7rem)] leading-[1.06] tracking-[-0.015em] text-[var(--text-strong)]">
              Your applications, out of the spreadsheet.
            </h1>
            <p className="mt-4 text-[15px] leading-7 text-[var(--text-muted)]">
              Deadlines, statuses, links, documents and next steps — attached to each record.
            </p>
            <ul className="mt-6">
              {points.slice(0, 3).map(([title, desc]) => (
                <li key={title} className="grid grid-cols-[auto_1fr] gap-x-3 border-t border-[var(--border)] py-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--applume-accent)]" />
                  <span>
                    <span className="block text-sm font-semibold text-[var(--ink)]">{title}</span>
                    <span className="block text-[13px] leading-6 text-[var(--text-muted)]">{desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="relative text-xs text-[var(--text-soft)]">
            Private to your account · Export anytime · No credit card
          </p>
        </div>

        {/* ── Right form column ──────────────────────────────────────── */}
        <div className="order-1 flex min-h-dvh flex-col px-4 py-8 sm:px-8 lg:order-2 lg:px-12 lg:py-12">
          <div className="mb-8 flex items-center justify-between">
            <button type="button" onClick={onClose} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--ink)]">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              {t("phrases.Back to home")}
            </button>
            <LanguageSwitcher compact />
          </div>

          {/* mobile wordmark */}
          <a href="/" className="mb-8 flex justify-center lg:hidden"><Logo imgClass="h-9 w-9" wordmarkClass="text-lg" /></a>

          <div className="mx-auto my-auto w-full max-w-md py-4">
            {signupSent ? (
              <SuccessPanel
                title="Check your inbox"
                email={authEmail}
                body="Click the link in your email to activate your account, then return here to sign in."
                onBack={() => switchAuthMode("signin")}
              />
            ) : resetSent ? (
              <SuccessPanel
                title="Check your inbox"
                email={authEmail}
                body="Click the link in your email to choose a new password."
                onBack={() => switchAuthMode("signin")}
              />
            ) : (
              <div>
                {/* mode switch */}
                {authMode !== "reset" && (
                  <div className="mb-8 mx-auto flex w-fit rounded-[10px] border border-[var(--border)] p-1 lg:mx-0">
                    {[{ id: "signin", label: t("phrases.Sign in") }, { id: "signup", label: t("phrases.Create account") }].map(({ id, label }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => switchAuthMode(id)}
                        className={`rounded-[7px] px-4 py-1.5 text-sm font-semibold transition-colors ${authMode === id ? "bg-[var(--applume-accent-soft)] text-[var(--applume-accent-hover)]" : "text-[var(--text-muted)] hover:text-[var(--ink)]"}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}

                {authMode === "reset" && (
                  <button type="button" onClick={() => switchAuthMode("signin")} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--ink)]">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    Back to sign in
                  </button>
                )}

                <motion.div key={authMode} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
                  <div className="mb-7 text-center lg:text-left">
                    <h2 className="font-display text-[1.9rem] leading-tight tracking-[-0.01em] text-[var(--text-strong)]">{heading}</h2>
                    <p className="mt-1.5 text-[15px] text-[var(--text-muted)]">{subheading}</p>
                  </div>

                  {authMode !== "reset" && (
                    <div className="mb-6 space-y-3">
                      <button
                        type="button"
                        onClick={signInWithGoogle}
                        disabled={authLoading || oauthLoading}
                        className="flex h-12 w-full items-center justify-center gap-3 rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface-card)] px-4 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--surface-soft)] disabled:opacity-60"
                      >
                        {oauthLoading ? (
                          <>
                            <svg className="h-4 w-4 animate-spin text-[var(--text-soft)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" /></svg>
                            Connecting to Google...
                          </>
                        ) : (
                          <><GoogleMark />{t("phrases.Continue with Google")}</>
                        )}
                      </button>
                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-[var(--border)]" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-soft)]">or use email</span>
                        <div className="h-px flex-1 bg-[var(--border)]" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Email */}
                    <div className="grid gap-1.5">
                      <label className="text-[13px] font-semibold text-[var(--text-muted)]">{t("phrases.Email")}</label>
                      <input
                        value={authEmail}
                        onChange={(e) => { setAuthEmail(e.target.value); setFieldErrors((f) => ({ ...f, email: "" })); setAuthError(""); }}
                        onKeyDown={(e) => { if (e.key === "Enter") handleAuthSubmit(); }}
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        className={`${inputBase} ${fieldErrors.email ? inputErr : inputOk}`}
                      />
                      <AnimatePresence>
                        {fieldErrors.email && (
                          <motion.p role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }} className="flex items-center gap-1.5 text-xs font-medium text-[var(--danger)]">
                            <Icon name="close" className="h-3 w-3 shrink-0" />{fieldErrors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Password */}
                    {authMode !== "reset" && (
                      <div className="grid gap-1.5">
                        <label className="text-[13px] font-semibold text-[var(--text-muted)]">{t("phrases.Password")}</label>
                        <div className="relative">
                          <input
                            value={authPassword}
                            onChange={(e) => { setAuthPassword(e.target.value); setFieldErrors((f) => ({ ...f, password: "" })); setAuthError(""); }}
                            onKeyDown={(e) => { if (e.key === "Enter") handleAuthSubmit(); }}
                            type={showPassword ? "text" : "password"}
                            placeholder={authMode === "signup" ? "Min. 6 characters" : "Enter your password"}
                            autoComplete={authMode === "signup" ? "new-password" : "current-password"}
                            className={`${inputBase} pr-12 ${fieldErrors.password ? inputErr : inputOk}`}
                          />
                          <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3.5 top-3.5 text-[var(--text-soft)] transition-colors hover:text-[var(--ink)]" tabIndex={-1} aria-label={showPassword ? "Hide password" : "Show password"}>
                            <Icon name={showPassword ? "eyeOff" : "eye"} className="h-4 w-4" />
                          </button>
                        </div>
                        <AnimatePresence>
                          {fieldErrors.password && (
                            <motion.p role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }} className="flex items-center gap-1.5 text-xs font-medium text-[var(--danger)]">
                              <Icon name="close" className="h-3 w-3 shrink-0" />{fieldErrors.password}
                            </motion.p>
                          )}
                        </AnimatePresence>
                        {authMode === "signup" && authPassword.length > 0 && !fieldErrors.password && (
                          <PasswordStrength password={authPassword} />
                        )}
                        {authMode === "signin" && (
                          <button type="button" onClick={() => switchAuthMode("reset")} className="justify-self-end text-xs font-semibold text-[var(--applume-accent-hover)] hover:underline">
                            Forgot password?
                          </button>
                        )}
                      </div>
                    )}

                    {/* General error */}
                    <AnimatePresence>
                      {authError && (
                        <motion.div role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className="flex items-start gap-2.5 rounded-[10px] border border-[color-mix(in_srgb,var(--danger)_35%,transparent)] bg-[var(--danger-soft)] px-4 py-3">
                          <Icon name="close" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--danger)]" />
                          <div>
                            <p className="text-sm font-medium text-[var(--danger)]">{authError}</p>
                            {authError.includes("already exists") && (
                              <button type="button" onClick={() => switchAuthMode("signin")} className="mt-1 text-xs font-semibold text-[var(--danger)] underline underline-offset-2 hover:no-underline">Sign in instead</button>
                            )}
                            {authError.includes("confirm your email") && (
                              <p className="mt-1 text-xs text-[var(--danger)]">Check your spam folder if you can't find it.</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Privacy consent — signup only */}
                    {authMode === "signup" && (
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          required
                          checked={agreedToPrivacy}
                          onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--border-strong)] accent-[var(--applume-accent)]"
                        />
                        <span className="text-[13px] leading-6 text-[var(--text-muted)]">
                          I agree to the{" "}
                          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--applume-accent-hover)] hover:underline">Privacy Policy</a>
                          . My data is stored securely and I can delete it at any time.
                        </span>
                      </label>
                    )}

                    {/* Submit */}
                    <button
                      type="button"
                      onClick={handleAuthSubmit}
                      disabled={authLoading || oauthLoading || (authMode === "signup" && !agreedToPrivacy)}
                      className="h-12 w-full rounded-[10px] bg-[var(--applume-accent-strong)] text-sm font-semibold text-white transition-colors hover:bg-[var(--applume-accent-ink)] disabled:opacity-50 disabled:hover:bg-[var(--applume-accent-strong)]"
                    >
                      {authLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" /></svg>
                          {authMode === "signin" ? "Signing in..." : authMode === "reset" ? "Sending link..." : "Creating account..."}
                        </span>
                      ) : authMode === "signin" ? t("phrases.Sign in") : authMode === "reset" ? "Send reset link" : t("phrases.Create account")}
                    </button>

                    {authMode !== "reset" && (
                      <p className="text-center text-[11px] leading-5 text-[var(--text-soft)]">
                        By continuing you agree to Applume's{" "}
                        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--applume-accent-hover)] hover:underline">Privacy Policy</a>.
                      </p>
                    )}
                  </div>

                  {/* privacy reassurance */}
                  <div className="mt-7 flex items-start gap-3 border-t border-[var(--border)] pt-6">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-[8px] bg-[var(--applume-accent-soft)] text-[var(--applume-accent)]"><Icon name="shield" className="h-3.5 w-3.5" /></span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--ink)]">Your data stays private</p>
                      <p className="mt-0.5 text-[13px] leading-6 text-[var(--text-muted)]">Applications are private to your account. Export or delete anytime — nothing is visible to anyone else unless you share a link yourself.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>

          <footer className="mt-8 flex flex-col items-center gap-2 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--text-soft)] sm:flex-row sm:justify-between">
            <p>© {new Date().getFullYear()} Applume</p>
            <p className="flex items-center gap-3">
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--ink)]">Privacy</a>
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--ink)]">Terms</a>
              <a href="mailto:hello@applume.app" className="transition-colors hover:text-[var(--ink)]">Contact</a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
