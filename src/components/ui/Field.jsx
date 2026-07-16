import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

export function DrawerSection({ label, children }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-soft)]">{label}</p>
        <div className="flex-1 border-t border-[var(--border)]" />
      </div>
      {children}
    </div>
  );
}

export function Field({ label, children, required = false, wide = false }) {
  return (
    <label className={`grid gap-1.5 text-[13px] font-semibold text-[var(--text-muted)] ${wide ? "sm:col-span-2" : ""}`}>
      <span>
        {label}
        {required && <span className="text-[var(--danger)]"> *</span>}
      </span>
      {children}
    </label>
  );
}

const controlBase =
  "w-full min-w-0 rounded-[var(--radius)] border border-[var(--border-strong)] bg-[var(--surface-card)] text-[var(--ink)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--text-soft)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--ring)]";

export function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`${controlBase} h-11 px-3 text-sm ${className}`}
    />
  );
}

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      rows={props.rows ?? 4}
      className={`${controlBase} resize-none px-3 py-3 text-sm ${className}`}
    />
  );
}

// Custom listbox that matches the app's dropdown recipe (token surface,
// rounded-[12px], soft shadow, y-6/150ms motion) instead of the OS-rendered
// native <select> popup. Keeps the native API shape: onChange receives
// { target: { value } }, options are strings or { label, value }.
export function Select({ options, value, onChange, className = "", ...props }) {
  const normalized = options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option
  );
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const listboxId = useId();

  const selectedIndex = normalized.findIndex((option) => option.value === value);
  const selected = normalized[selectedIndex];

  useEffect(() => {
    if (!open) return undefined;
    function handleClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (!open || highlight < 0) return;
    listRef.current?.children[highlight]?.scrollIntoView({ block: "nearest" });
  }, [open, highlight]);

  function openMenu() {
    setHighlight(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }

  function commit(index) {
    const option = normalized[index];
    if (!option) return;
    onChange?.({ target: { value: option.value } });
    setOpen(false);
  }

  function handleKeyDown(e) {
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setHighlight((i) => Math.min(i + 1, normalized.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlight((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setHighlight(0);
        break;
      case "End":
        e.preventDefault();
        setHighlight(normalized.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        commit(highlight);
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  }

  return (
    <div ref={rootRef} className={`relative min-w-0 ${className}`}>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-activedescendant={open && highlight >= 0 ? `${listboxId}-${highlight}` : undefined}
        onKeyDown={handleKeyDown}
        onClick={() => (open ? setOpen(false) : openMenu())}
        className={`${controlBase} flex h-11 items-center justify-between gap-2 px-3 text-sm font-medium`}
        {...props}
      >
        <span className="truncate text-left">{selected?.label ?? ""}</span>
        <svg
          className={`h-3.5 w-3.5 shrink-0 text-[var(--text-soft)] transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-1.5 max-h-64 w-full min-w-40 overflow-y-auto rounded-[12px] border border-[var(--border)] bg-[var(--surface-card)] py-1 shadow-[0_18px_50px_-30px_rgba(12,20,16,0.4)]"
          >
            {normalized.map((option, index) => (
              <li key={option.value} id={`${listboxId}-${index}`} role="option" aria-selected={option.value === value}>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => commit(index)}
                  onMouseEnter={() => setHighlight(index)}
                  className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm font-medium transition-colors ${
                    index === highlight ? "bg-[var(--surface-soft)] text-[var(--text-strong)]" : "text-[var(--ink)]"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === value && <Icon name="check" className="h-3.5 w-3.5 shrink-0 text-[var(--applume-accent)]" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
