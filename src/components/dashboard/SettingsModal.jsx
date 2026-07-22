import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { useLanguage } from "@/i18n";
import { loadShareTokens, ensureShareToken, rotateShareToken, revokeShareToken } from "@/lib/shareTokens";

const CATEGORIES = [
  { id: "profile", label: "Profile", icon: "user", hint: "Account and session" },
  { id: "sharing", label: "Sharing", icon: "share", hint: "Public links and access" },
  { id: "appearance", label: "Appearance", icon: "sliders", hint: "Theme and default view" },
];

function Segmented({ value, onChange, options, ariaLabel }) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex flex-wrap gap-1 rounded-[12px] border border-[var(--border)] bg-[var(--surface-soft)] p-1"
    >
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`flex items-center gap-2 rounded-[9px] px-3.5 py-2 text-sm font-semibold transition ${
              active
                ? "bg-[var(--surface-card)] text-[var(--text-strong)] shadow-sm ring-1 ring-[var(--border)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-strong)]"
            }`}
          >
            {o.icon && <Icon name={o.icon} className="h-4 w-4" />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function SettingRow({ title, description, children }) {
  return (
    <div className="border-b border-[var(--border-subtle)] py-5 first:pt-0 last:border-b-0">
      <p className="text-sm font-semibold text-[var(--text-strong)]">{title}</p>
      {description && <p className="mt-1 text-[13px] leading-5 text-[var(--text-muted)]">{description}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function ProfilePanel({ session, onSignOut, onDeleteAccount }) {
  const { t } = useLanguage();
  const email = session?.user?.email || "";
  return (
    <div>
      <div className="flex items-center gap-3.5 rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--applume-accent)] text-lg font-bold text-white">
          {email[0]?.toUpperCase() || "?"}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--text-strong)]">{email}</p>
          <p className="text-[13px] text-[var(--text-muted)]">{t("phrases.Signed in")}</p>
        </div>
      </div>

      <SettingRow
        title={t("phrases.Sign out")}
        description={t("phrases.End this session on this device.")}
      >
        <button
          type="button"
          onClick={onSignOut}
          className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--border)] bg-[var(--surface-card)] px-4 py-2.5 text-sm font-semibold text-[var(--text-strong)] transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--surface-soft)]"
        >
          <Icon name="reset" className="h-4 w-4" /> {t("phrases.Sign out")}
        </button>
      </SettingRow>

      <SettingRow
        title={t("phrases.Delete account")}
        description={t("phrases.Permanently remove your account and all application data. This cannot be undone.")}
      >
        <button
          type="button"
          onClick={onDeleteAccount}
          className="inline-flex items-center gap-2 rounded-[10px] border border-[color-mix(in_srgb,var(--danger)_30%,transparent)] bg-[var(--danger-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--danger)] transition hover:bg-[color-mix(in_srgb,var(--danger)_16%,transparent)]"
        >
          <Icon name="trash" className="h-4 w-4" /> {t("phrases.Delete account")}
        </button>
      </SettingRow>
    </div>
  );
}

function LinkManager({ icon, title, description, token, url, busy, onCopy, onCreate, onRegenerate, onRevoke }) {
  const { t } = useLanguage();
  const active = !!token;
  return (
    <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-[var(--border)] bg-[var(--surface-card)] text-[var(--text-muted)]">
          <Icon name={icon} className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-[var(--text-strong)]">{title}</p>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${active ? "bg-[var(--applume-accent-soft)] text-[var(--applume-accent-hover)]" : "bg-[var(--surface-card)] text-[var(--text-soft)] ring-1 ring-inset ring-[var(--border)]"}`}>
              {active ? t("phrases.Active") : t("phrases.Off")}
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-5 text-[var(--text-muted)]">{description}</p>

          {active ? (
            <>
              <p className="mt-3 truncate rounded-[8px] border border-[var(--border)] bg-[var(--surface-card)] px-2.5 py-1.5 font-mono text-[11px] text-[var(--text-muted)]" title={url}>{url}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={onCopy} className="inline-flex items-center gap-1.5 rounded-[9px] border border-[var(--border)] bg-[var(--surface-card)] px-3 py-1.5 text-xs font-semibold text-[var(--text-strong)] transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] hover:text-[var(--applume-accent-hover)]">
                  <Icon name="copy" className="h-3.5 w-3.5" /> {t("phrases.Copy link")}
                </button>
                <button type="button" disabled={busy} onClick={onRegenerate} className="inline-flex items-center gap-1.5 rounded-[9px] border border-[var(--border)] bg-[var(--surface-card)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition hover:text-[var(--text-strong)] disabled:opacity-50">
                  <Icon name="reset" className="h-3.5 w-3.5" /> {t("phrases.Regenerate")}
                </button>
                <button type="button" disabled={busy} onClick={onRevoke} className="inline-flex items-center gap-1.5 rounded-[9px] border border-[color-mix(in_srgb,var(--danger)_30%,transparent)] bg-[var(--danger-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--danger)] transition hover:bg-[color-mix(in_srgb,var(--danger)_16%,transparent)] disabled:opacity-50">
                  <Icon name="close" className="h-3.5 w-3.5" /> {t("phrases.Revoke access")}
                </button>
              </div>
            </>
          ) : (
            <button type="button" disabled={busy} onClick={onCreate} className="mt-3 inline-flex items-center gap-1.5 rounded-[9px] border border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--applume-accent-hover)] transition hover:bg-[var(--applume-accent-soft-2)] disabled:opacity-50">
              <Icon name="link" className="h-3.5 w-3.5" /> {t("phrases.Create link")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SharingPanel({ session, onNotify }) {
  const { t } = useLanguage();
  const userId = session?.user?.id;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const [tokens, setTokens] = useState({ share: null, calendar: null });
  const [unavailable, setUnavailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  async function refresh() {
    const r = await loadShareTokens(userId);
    setTokens({ share: r.share, calendar: r.calendar });
    setUnavailable(!!r.unavailable);
    setLoading(false);
  }

  useEffect(() => {
    let active = true;
    loadShareTokens(userId).then((r) => {
      if (!active) return;
      setTokens({ share: r.share, calendar: r.calendar });
      setUnavailable(!!r.unavailable);
      setLoading(false);
    });
    return () => { active = false; };
  }, [userId]);

  function urlFor(which, token) {
    return which === "share" ? `${origin}/share/${token}` : `${origin}/calendar/${token}.ics`;
  }

  async function copy(which) {
    await navigator.clipboard.writeText(urlFor(which, tokens[which]));
    onNotify?.(t("phrases.Link copied."), "success");
  }

  async function run(which, fn, successMsg) {
    setBusy(which);
    const r = await fn(userId, which);
    setBusy(null);
    if (r.unavailable) { setUnavailable(true); onNotify?.(t("phrases.Sharing needs the database migration (see REDESIGN_PLAN.md)."), "error"); return; }
    if (r.error) { onNotify?.(r.error, "error"); return; }
    await refresh();
    onNotify?.(successMsg, "success");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <svg className="h-5 w-5 animate-spin text-[var(--applume-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" /></svg>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-[13px] leading-5 text-[var(--text-muted)]">
        {t("phrases.Links are off until you create them. Anyone with an active link can view that data without signing in — revoke a link any time to cut off access instantly.")}
      </p>

      {unavailable && (
        <div className="rounded-[12px] border border-[color-mix(in_srgb,var(--warning)_30%,transparent)] bg-[var(--warning-soft)] px-3.5 py-3">
          <p className="text-[13px] leading-5 text-[var(--warning-ink)]">
            {t("phrases.Sharing needs a one-time database migration before it can be used. See REDESIGN_PLAN.md (Phase 5.5).")}
          </p>
        </div>
      )}

      <LinkManager
        icon="share"
        title={t("phrases.Shareable tracker link")}
        description={t("phrases.A read-only view of your universities and jobs — names, statuses, deadlines and priorities.")}
        token={tokens.share}
        url={tokens.share ? urlFor("share", tokens.share) : ""}
        busy={busy === "share"}
        onCopy={() => copy("share")}
        onCreate={() => run("share", ensureShareToken, t("phrases.Sharing link created."))}
        onRegenerate={() => run("share", rotateShareToken, t("phrases.New link generated. The old one no longer works."))}
        onRevoke={() => run("share", revokeShareToken, t("phrases.Access revoked. The link no longer works."))}
      />

      <LinkManager
        icon="calendar"
        title={t("phrases.Calendar feed")}
        description={t("phrases.A subscribe-able .ics feed of your deadlines for Google Calendar, Apple Calendar, or Outlook.")}
        token={tokens.calendar}
        url={tokens.calendar ? urlFor("calendar", tokens.calendar) : ""}
        busy={busy === "calendar"}
        onCopy={() => copy("calendar")}
        onCreate={() => run("calendar", ensureShareToken, t("phrases.Calendar feed created."))}
        onRegenerate={() => run("calendar", rotateShareToken, t("phrases.New link generated. The old one no longer works."))}
        onRevoke={() => run("calendar", revokeShareToken, t("phrases.Access revoked. The link no longer works."))}
      />
    </div>
  );
}

function AppearancePanel({ dark, onSetTheme, defaultView, onChangeDefaultView }) {
  const { t } = useLanguage();
  return (
    <div>
      <SettingRow title={t("phrases.Theme")} description={t("phrases.Choose a light or dark appearance for the app.")}>
        <Segmented
          ariaLabel="Theme"
          value={dark ? "dark" : "light"}
          onChange={onSetTheme}
          options={[
            { value: "light", label: t("phrases.Light"), icon: "sun" },
            { value: "dark", label: t("phrases.Dark"), icon: "moon" },
          ]}
        />
      </SettingRow>

      <SettingRow
        title={t("phrases.Default view")}
        description={t("phrases.How your university and job records open by default. You can still switch views anytime.")}
      >
        <Segmented
          ariaLabel="Default view"
          value={defaultView}
          onChange={onChangeDefaultView}
          options={[
            { value: "cards", label: t("phrases.Cards"), icon: "dashboard" },
            { value: "table", label: t("phrases.Table"), icon: "table" },
            { value: "kanban", label: t("phrases.Kanban"), icon: "columns" },
          ]}
        />
      </SettingRow>
    </div>
  );
}

export function SettingsModal({
  onClose,
  session,
  dark,
  onSetTheme,
  defaultView,
  onChangeDefaultView,
  onSignOut,
  onDeleteAccount,
  onNotify,
  initialCategory = "profile",
}) {
  const { t } = useLanguage();
  const [category, setCategory] = useState(initialCategory);

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center p-4 bg-[rgba(8,12,10,0.45)] backdrop-blur-sm dark:bg-[rgba(2,4,3,0.6)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--surface-card)] shadow-[0_24px_80px_-24px_rgba(12,20,16,0.5)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-6 py-4">
          <h2 className="font-display text-xl font-semibold text-[var(--text-strong)]">{t("phrases.Settings")}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="grid h-9 w-9 place-items-center rounded-[10px] border border-[var(--border)] text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text-strong)]"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
          {/* Category nav */}
          <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-[var(--border)] p-3 sm:w-56 sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r">
            {CATEGORIES.map((c) => {
              const active = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  aria-current={active ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-3 rounded-[10px] px-3 py-2.5 text-left transition sm:w-full ${
                    active
                      ? "bg-[var(--applume-accent-soft)] text-[var(--applume-accent-hover)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-strong)]"
                  }`}
                >
                  <Icon name={c.icon} className="h-4 w-4 shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{t(`phrases.${c.label}`)}</span>
                    <span className="hidden text-[11px] font-medium opacity-70 sm:block">{t(`phrases.${c.hint}`)}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Content */}
          <div className="min-w-0 flex-1 overflow-y-auto p-6">
            {category === "profile" && (
              <ProfilePanel session={session} onSignOut={onSignOut} onDeleteAccount={onDeleteAccount} />
            )}
            {category === "sharing" && (
              <SharingPanel session={session} onNotify={onNotify} />
            )}
            {category === "appearance" && (
              <AppearancePanel
                dark={dark}
                onSetTheme={onSetTheme}
                defaultView={defaultView}
                onChangeDefaultView={onChangeDefaultView}
              />
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
