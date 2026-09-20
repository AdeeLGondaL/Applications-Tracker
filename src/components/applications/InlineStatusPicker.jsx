import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { statusTone } from "@/utils/statusTone";
import { STATUSES } from "@/utils/constants";
import { useLanguage } from "@/i18n";

const MENU_WIDTH = 192; // w-48
const MENU_MAX_HEIGHT = 256; // max-h-64
const MIN_MENU_HEIGHT = 160;
const GAP = 6;

export function InlineStatusPicker({ status, onStatusChange }) {
  const { label, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // The picker lives inside the table's scroll container, which would clip a
  // normally-positioned menu — so the menu is portalled to the body and pinned
  // to the trigger, flipping above it when there is no room below.
  const place = useCallback(() => {
    const trigger = buttonRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight || MENU_MAX_HEIGHT;
    const viewportW = window.innerWidth || document.documentElement.clientWidth || MENU_WIDTH;
    const spaceBelow = viewportH - rect.bottom;
    const flip = spaceBelow < MENU_MAX_HEIGHT + GAP && rect.top > spaceBelow;
    setCoords({
      left: Math.max(8, Math.min(rect.left, viewportW - MENU_WIDTH - 8)),
      top: flip ? undefined : rect.bottom + GAP,
      bottom: flip ? viewportH - rect.top + GAP : undefined,
      // Never collapse to an unusable sliver if the viewport reports oddly.
      maxHeight: Math.max(MIN_MENU_HEIGHT, Math.min(MENU_MAX_HEIGHT, (flip ? rect.top : spaceBelow) - GAP - 8)),
    });
  }, []);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e) {
      if (buttonRef.current?.contains(e.target)) return;
      if (menuRef.current?.contains(e.target)) return;
      setOpen(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    // Reposition on resize; close on scroll so the menu never drifts away from
    // its row while the table or page scrolls underneath it.
    function handleScroll() {
      setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", place);
    };
  }, [open, place]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="group flex items-center gap-1 rounded-full transition"
        title={t("phrases.Change status")}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Badge tone={statusTone(status)}>{label("status", status)}</Badge>
        <Icon name="edit" className="h-2.5 w-2.5 text-[var(--text-soft)] opacity-0 transition-opacity group-hover:opacity-100" />
      </button>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && coords && (
            <motion.div
              ref={menuRef}
              role="listbox"
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                position: "fixed",
                left: coords.left,
                top: coords.top,
                bottom: coords.bottom,
                width: MENU_WIDTH,
                maxHeight: coords.maxHeight,
              }}
              className="z-[100] overflow-y-auto rounded-[12px] border border-[var(--border)] bg-[var(--surface-card)] py-1 shadow-[0_18px_50px_-30px_rgba(12,20,16,0.4)]"
            >
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="option"
                  aria-selected={s === status}
                  onClick={(e) => { e.stopPropagation(); onStatusChange(s); setOpen(false); }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left transition hover:bg-[var(--surface-soft)]"
                >
                  <Badge tone={statusTone(s)}>{label("status", s)}</Badge>
                  {s === status && <Icon name="check" className="h-3 w-3 text-[var(--applume-accent)]" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
