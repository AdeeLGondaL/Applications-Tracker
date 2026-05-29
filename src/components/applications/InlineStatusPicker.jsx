import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { Badge, statusTone } from "@/components/ui/Badge";
import { STATUSES } from "@/utils/constants";

export function InlineStatusPicker({ status, onStatusChange }) {
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
        <Badge tone={statusTone(status)}>{status}</Badge>
        <Icon name="edit" className="h-2.5 w-2.5 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full z-50 mt-1.5 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-200/80"
          >
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { onStatusChange(s); setOpen(false); }}
                className="flex w-full items-center justify-between px-3 py-2 text-left transition hover:bg-slate-50"
              >
                <Badge tone={statusTone(s)}>{s}</Badge>
                {s === status && <Icon name="check" className="h-3 w-3 text-emerald-500" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
