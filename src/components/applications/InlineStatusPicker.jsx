import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { statusTone } from "@/utils/statusTone";
import { STATUSES } from "@/utils/constants";
import { useLanguage } from "@/i18n";

export function InlineStatusPicker({ status, onStatusChange }) {
  const { label } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="group flex items-center gap-1 rounded-full transition"
        title="Change status"
      >
        <Badge tone={statusTone(status)}>{label("status", status)}</Badge>
        <Icon name="edit" className="h-2.5 w-2.5 text-[var(--text-soft)] opacity-0 transition-opacity group-hover:opacity-100" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-1.5 max-h-64 w-48 overflow-y-auto rounded-[12px] border border-[var(--border)] bg-[var(--surface-card)] py-1 shadow-[0_18px_50px_-30px_rgba(12,20,16,0.4)]"
          >
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { onStatusChange(s); setOpen(false); }}
                className="flex w-full items-center justify-between px-3 py-2 text-left transition hover:bg-[var(--surface-soft)]"
              >
                <Badge tone={statusTone(s)}>{label("status", s)}</Badge>
                {s === status && <Icon name="check" className="h-3 w-3 text-[var(--applume-accent)]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
