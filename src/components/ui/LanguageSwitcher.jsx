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
        className="flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 text-sm font-bold text-slate-600 transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] hover:text-[var(--applume-accent-hover)] dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:text-[#a1a1aa] dark:hover:bg-[#2e2e32]"
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
            transition={{ duration: 0.14 }}
            className={`absolute top-full z-50 mt-1.5 max-h-80 w-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white py-1 text-start shadow-xl shadow-slate-200/80 dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:shadow-none dark:ring-1 dark:ring-white/5 ${align === "left" ? "left-0" : "right-0"}`}
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
                className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-[#d4d4d8] dark:hover:bg-[#242428]"
              >
                <span className="min-w-0">
                  <span className="block truncate">{language.nativeName}</span>
                  <span className="block truncate text-[11px] font-medium text-slate-400 dark:text-[#71717a]">{language.name}</span>
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
