import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/i18n";
import { Icon } from "@/components/ui/Icon";

export function LanguageSwitcher({ compact = false, align = "right", className = "" }) {
  const { lang, languages, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const active = languages.find((language) => language.code === lang) || languages[0];

  useEffect(() => {
    if (!open) return undefined;
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`.trim()} data-i18n-ignore>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        title={t("common.changeLanguage")}
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-[9px] border border-[var(--border-strong)] bg-[var(--surface-card)] px-2.5 text-sm font-semibold text-[var(--text-muted)] transition-colors hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] hover:text-[var(--applume-accent-hover)]"
      >
        <Icon name="language" className="h-4 w-4" />
        {!compact && <span className="hidden sm:inline">{active.nativeName}</span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full z-50 mt-1.5 max-h-80 w-56 overflow-y-auto rounded-[12px] border border-[var(--border)] bg-[var(--surface-card)] py-1 text-start shadow-[0_18px_50px_-30px_rgba(12,20,16,0.4)] ${align === "left" ? "left-0" : "right-0"}`}
            role="menu"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                type="button"
                role="menuitemradio"
                aria-checked={language.code === lang}
                onClick={() => {
                  setLanguage(language.code);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--surface-soft)]"
              >
                <span className="min-w-0">
                  <span className="block truncate">{language.nativeName}</span>
                  <span className="block truncate text-[11px] font-medium text-[var(--text-soft)]">{language.name}</span>
                </span>
                {language.code === lang && <Icon name="check" className="h-3.5 w-3.5 shrink-0 text-[var(--applume-accent)]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
