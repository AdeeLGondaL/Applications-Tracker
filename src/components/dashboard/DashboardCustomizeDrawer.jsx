import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { DASHBOARD_PRESETS, applyDashboardPreset, resetDashboardPreferences } from "@/utils/dashboardPreferences";

function reorderVisible(preferences, fromId, direction) {
  const visible = preferences.widgets.filter((widget) => widget.visible).sort((a, b) => a.order - b.order);
  const index = visible.findIndex((widget) => widget.id === fromId);
  const nextIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || nextIndex < 0 || nextIndex >= visible.length) return preferences;
  const reordered = [...visible];
  [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
  const orderMap = new Map(reordered.map((widget, i) => [widget.id, i + 1]));
  return {
    ...preferences,
    preset: "custom",
    widgets: preferences.widgets.map((widget) => orderMap.has(widget.id) ? { ...widget, order: orderMap.get(widget.id) } : widget),
  };
}

function PanelRow({ widget, definition, index, total, onHide, onShow, onMoveUp, onMoveDown, onSizeChange, hidden = false }) {
  const title = definition?.title || widget.id;
  const description = definition?.description || "Dashboard panel";
  const allowedSizes = definition?.allowedSizes || [widget.size];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-[#2a2a2e] dark:bg-[#111113]">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-900 dark:text-white">{title}</p>
          <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-[#71717a]">{description}</p>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-500 dark:bg-[#2a2a2e] dark:text-[#a1a1aa]">
          {widget.size}
        </span>
      </div>
      {!hidden && allowedSizes.length > 1 && (
        <div className="mt-3 flex flex-wrap items-center gap-1 rounded-xl bg-slate-50 p-1 dark:bg-[#1c1c1f]" aria-label={`${title} size`}>
          {allowedSizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onSizeChange?.(size)}
              aria-pressed={widget.size === size}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-black capitalize transition ${
                widget.size === size
                  ? "bg-white text-[var(--applume-accent-hover)] shadow-sm ring-1 ring-[var(--applume-accent-border)] dark:bg-[#111113] dark:text-[var(--applume-accent-muted)]"
                  : "text-slate-500 hover:text-slate-900 dark:text-[#a1a1aa] dark:hover:text-white"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {hidden ? (
          <button type="button" onClick={onShow} className="rounded-xl bg-[var(--applume-accent)] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[var(--applume-accent-hover)]">
            Show
          </button>
        ) : (
          <>
            <button type="button" onClick={onMoveUp} disabled={index === 0} aria-label={`Move ${title} up`} className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-[#2a2a2e] dark:text-[#a1a1aa] dark:hover:bg-[#242428]">
              Move up
            </button>
            <button type="button" onClick={onMoveDown} disabled={index === total - 1} aria-label={`Move ${title} down`} className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-[#2a2a2e] dark:text-[#a1a1aa] dark:hover:bg-[#242428]">
              Move down
            </button>
            <button type="button" onClick={onHide} aria-label={`Hide ${title}`} className="ml-auto rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-slate-50 dark:border-[#2a2a2e] dark:text-[#a1a1aa] dark:hover:bg-[#242428]">
              Hide
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function DashboardCustomizeDrawer({ open, preferences, registry, onChange, onClose, onSave, onReset }) {
  const reduceMotion = useReducedMotion();
  const closeButtonRef = useRef(null);
  const [resetConfirming, setResetConfirming] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const timer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(document.querySelectorAll("[data-dashboard-customize-drawer] button:not([disabled])"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      previous?.focus?.();
    };
  }, [open, onClose]);

  const visible = preferences.widgets.filter((widget) => widget.visible).sort((a, b) => a.order - b.order);
  const hidden = preferences.widgets.filter((widget) => !widget.visible).sort((a, b) => a.order - b.order);

  function setWidgetVisible(id, visibleValue) {
    const nextOrder = Math.max(0, ...preferences.widgets.filter((widget) => widget.visible).map((widget) => widget.order)) + 1;
    onChange({
      ...preferences,
      preset: "custom",
      widgets: preferences.widgets.map((widget) => widget.id === id ? { ...widget, visible: visibleValue, order: visibleValue ? nextOrder : widget.order } : widget),
    });
  }

  function setWidgetSize(id, size) {
    onChange({
      ...preferences,
      preset: "custom",
      widgets: preferences.widgets.map((widget) => widget.id === id ? { ...widget, size } : widget),
    });
  }

  function applyPreset(presetId) {
    setResetConfirming(false);
    onChange(applyDashboardPreset(preferences, presetId));
  }

  function resetLayout() {
    if (!resetConfirming) {
      setResetConfirming(true);
      return;
    }
    setResetConfirming(false);
    onReset(resetDashboardPreferences());
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-slate-950/25 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.16 }}
          onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
        >
          <motion.aside
            data-dashboard-customize-drawer
            role="dialog"
            aria-modal="true"
            aria-labelledby="customize-dashboard-title"
            className="absolute bottom-0 right-0 top-auto flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 dark:border-[#2a2a2e] dark:bg-[#111113] md:bottom-auto md:top-0 md:h-full md:max-h-none md:max-w-xl md:rounded-none md:border-y-0 md:border-r-0"
            initial={{ x: reduceMotion ? 0 : 32, opacity: reduceMotion ? 1 : 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reduceMotion ? 0 : 32, opacity: reduceMotion ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
          >
            <div className="border-b border-slate-100 p-5 dark:border-[#2a2a2e]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="customize-dashboard-title" className="text-xl font-black text-slate-950 dark:text-white">Customize dashboard</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-[#a1a1aa]">
                    Choose the panels that help you stay focused. You can change this anytime.
                  </p>
                </div>
                <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close customize dashboard" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-[#2a2a2e] dark:text-[#a1a1aa] dark:hover:bg-[#242428]">
                  <Icon name="close" className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-5">
              <section>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Start with a focus</h3>
                <div className="mt-3 grid gap-2">
                  {DASHBOARD_PRESETS.map((preset) => {
                    const selected = preferences.preset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyPreset(preset.id)}
                        aria-pressed={selected}
                        className={`rounded-2xl border p-3 text-left transition ${
                          selected
                            ? "border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] ring-2 ring-[var(--applume-accent-border)]"
                            : "border-slate-200 bg-white hover:bg-slate-50 dark:border-[#2a2a2e] dark:bg-[#111113] dark:hover:bg-[#242428]"
                        }`}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="font-black text-slate-900 dark:text-white">{preset.title}</span>
                          {selected && <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-[var(--applume-accent-hover)] ring-1 ring-[var(--applume-accent-border)]">Selected</span>}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-[#71717a]">{preset.description}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Visible panels</h3>
                <div className="mt-3 space-y-2.5">
                  {visible.map((widget, index) => (
                    <PanelRow
                      key={widget.id}
                      widget={widget}
                      definition={registry[widget.id]}
                      index={index}
                      total={visible.length}
                      onHide={() => setWidgetVisible(widget.id, false)}
                      onMoveUp={() => onChange(reorderVisible(preferences, widget.id, "up"))}
                      onMoveDown={() => onChange(reorderVisible(preferences, widget.id, "down"))}
                      onSizeChange={(size) => setWidgetSize(widget.id, size)}
                    />
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Hidden panels</h3>
                <div className="mt-3 space-y-2.5">
                  {hidden.length === 0 ? (
                    <p className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-500 dark:bg-[#1c1c1f] dark:text-[#71717a]">All panels are currently visible.</p>
                  ) : hidden.map((widget) => (
                    <PanelRow
                      key={widget.id}
                      hidden
                      widget={widget}
                      definition={registry[widget.id]}
                      onShow={() => setWidgetVisible(widget.id, true)}
                    />
                  ))}
                </div>
              </section>
            </div>

            <div className="border-t border-slate-100 bg-white p-4 dark:border-[#2a2a2e] dark:bg-[#111113]">
              {resetConfirming && (
                <div className="mb-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-[#2a2a2e] dark:bg-[#1c1c1f]">
                  <p className="text-sm font-black text-slate-900 dark:text-white">Reset dashboard layout?</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-[#71717a]">This will restore the calm default layout. Your applications and records will not be changed.</p>
                </div>
              )}
              <div className="flex flex-wrap items-center justify-end gap-2">
                <button type="button" onClick={resetLayout} className="mr-auto rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-[#2a2a2e] dark:text-[#a1a1aa] dark:hover:bg-[#242428]">
                  {resetConfirming ? "Reset layout" : "Reset to calm default"}
                </button>
                <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-[#2a2a2e] dark:text-[#a1a1aa] dark:hover:bg-[#242428]">
                  Cancel
                </button>
                <button type="button" onClick={onSave} className="rounded-xl bg-[var(--applume-accent)] px-4 py-2 text-sm font-bold text-white transition hover:bg-[var(--applume-accent-hover)]">
                  Save layout
                </button>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
