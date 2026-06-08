import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { Badge, Priority } from "@/components/ui/Badge";
import { statusTone } from "@/utils/statusTone";
import { STATUSES, PRIORITIES } from "@/utils/constants";

export function BulkActionBar({ count, onStatusChange, onPriorityChange, onDelete, onClear }) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!statusOpen && !priorityOpen) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setStatusOpen(false);
        setPriorityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [statusOpen, priorityOpen]);

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className="fixed inset-x-0 bottom-[4.5rem] z-30 flex justify-center px-3 md:bottom-5 md:px-4"
        >
          <div
            ref={ref}
            className="flex max-w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 shadow-2xl shadow-slate-900/50 sm:px-4"
          >
            <span className="text-sm font-bold text-white">{count} selected</span>
            <div className="h-4 w-px bg-white/20" />

            {/* Set status */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setStatusOpen((v) => !v); setPriorityOpen(false); }}
                className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/20"
              >
                Set status
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <AnimatePresence>
                {statusOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.12 }}
                    className="absolute bottom-full left-0 mb-2 max-h-64 w-48 overflow-y-auto rounded-2xl border border-slate-200 bg-white py-1 shadow-xl dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:ring-1 dark:ring-white/5"
                  >
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => { onStatusChange(s); setStatusOpen(false); }}
                        className="flex w-full items-center px-3 py-2 transition hover:bg-slate-50 dark:hover:bg-[#242428]"
                      >
                        <Badge tone={statusTone(s)}>{s}</Badge>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Set priority */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setPriorityOpen((v) => !v); setStatusOpen(false); }}
                className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/20"
              >
                Set priority
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <AnimatePresence>
                {priorityOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.12 }}
                    className="absolute bottom-full left-0 mb-2 w-36 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-xl dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:ring-1 dark:ring-white/5"
                  >
                    {PRIORITIES.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => { onPriorityChange(p); setPriorityOpen(false); }}
                        className="flex w-full items-center px-3 py-2 transition hover:bg-slate-50 dark:hover:bg-[#242428]"
                      >
                        <Priority priority={p} />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-4 w-px bg-white/20" />
            <button
              type="button"
              onClick={onDelete}
              className="flex items-center gap-1.5 rounded-xl bg-rose-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-rose-600"
            >
              <Icon name="trash" className="h-3 w-3" /> Delete
            </button>
            <button
              type="button"
              onClick={onClear}
              className="grid h-7 w-7 place-items-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <Icon name="close" className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
