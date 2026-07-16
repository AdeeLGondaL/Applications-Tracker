import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { useLanguage } from "@/i18n";

// Header avatar chip + dropdown. Owns all of its open/close behaviour:
// hover-open with a short close delay on fine pointers, click-toggle on touch,
// outside-click and Escape to dismiss.
export function ProfileMenu({ email, onSettings, onCalendarSync, onShareTracker, onFeedback, onSignOut, onDeleteAccount }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const closeTimer = useRef(null);

  function clearCloseTimer() {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function canHover() {
    return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }

  function openMenu() {
    clearCloseTimer();
    setOpen(true);
  }

  function closeMenu() {
    clearCloseTimer();
    setOpen(false);
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  }

  useEffect(() => {
    function handleClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  function run(action) {
    closeMenu();
    action();
  }

  const itemClass = "flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--surface-soft)]";

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => { if (canHover()) openMenu(); }}
      onMouseLeave={() => { if (canHover()) scheduleClose(); }}
      onFocus={openMenu}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) scheduleClose(); }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          clearCloseTimer();
          if (canHover()) setOpen(true);
          else setOpen((v) => !v);
        }}
        className="flex h-9 shrink-0 items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface-card)] p-1 pr-1 text-left transition-colors hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] sm:pr-2.5"
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--applume-accent)] text-xs font-bold text-white">
          {email?.[0]?.toUpperCase() || "?"}
        </span>
        <span className="hidden max-w-[8rem] truncate text-xs font-semibold text-[var(--ink)] lg:block">
          {email}
        </span>
        <svg className="hidden h-3 w-3 shrink-0 text-[var(--text-soft)] sm:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-1.5 w-64 overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface-card)] py-1 shadow-[0_18px_50px_-30px_rgba(12,20,16,0.4)]"
            role="menu"
          >
            <div className="border-b border-[var(--border)] px-4 py-3">
              <p className="truncate text-xs font-semibold text-[var(--ink)]">{email}</p>
              <p className="text-[10px] text-[var(--text-soft)]">{t("phrases.Signed in")}</p>
            </div>
            <button type="button" onClick={() => run(onSettings)} className={itemClass}>
              <Icon name="sliders" className="h-3.5 w-3.5 text-[var(--text-muted)]" /> {t("phrases.Settings")}
            </button>
            <div className="mx-3 my-1 border-t border-[var(--border)]" />
            <button type="button" onClick={() => run(onCalendarSync)} className={itemClass}>
              <Icon name="calendar" className="h-3.5 w-3.5 text-[var(--info)]" /> {t("phrases.Calendar sync")}
            </button>
            <button type="button" onClick={() => run(onShareTracker)} className={itemClass}>
              <Icon name="share" className="h-3.5 w-3.5 text-[var(--applume-accent)]" /> {t("phrases.Share tracker")}
            </button>
            <button type="button" onClick={() => run(onFeedback)} className={itemClass}>
              <Icon name="messageSquare" className="h-3.5 w-3.5 text-[var(--applume-accent)]" /> {t("phrases.Share feedback")}
            </button>
            <div className="mx-3 my-1 border-t border-[var(--border)]" />
            <button type="button" onClick={() => run(onSignOut)} className={itemClass}>
              <Icon name="reset" className="h-3.5 w-3.5" /> {t("phrases.Sign out")}
            </button>
            <button
              type="button"
              onClick={() => run(onDeleteAccount)}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[var(--danger)] transition-colors hover:bg-[var(--danger-soft)]"
            >
              {t("phrases.Delete account")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
