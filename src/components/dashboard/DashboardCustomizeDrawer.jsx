import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { DASHBOARD_PRESETS, DASHBOARD_ZONES, applyDashboardPreset, resetDashboardPreferences } from "@/utils/dashboardPreferences";

function reorderVisible(preferences, fromId, direction) {
  const activeWidget = preferences.widgets.find((widget) => widget.id === fromId);
  const activeZone = activeWidget?.zone;
  const visible = preferences.widgets.filter((widget) => widget.visible && widget.zone === activeZone).sort((a, b) => a.order - b.order);
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
  const zoneLabel = widget.zone ? widget.zone.charAt(0).toUpperCase() + widget.zone.slice(1) : "Panel";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1A1D22]">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-900 dark:text-white">{title}</p>
          <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-[#9AA4B2]">{description}</p>
        </div>
        <span className="shrink-0 rounded-full bg-[var(--applume-accent-soft)] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[var(--applume-accent-hover)] ring-1 ring-[var(--applume-accent-border)] dark:bg-[rgba(0,153,102,0.16)] dark:text-[var(--applume-accent-muted)]">
          {hidden ? "Hidden" : "Visible"}
        </span>
      </div>
      <p className="mt-3 text-[11px] font-black uppercase tracking-wide text-slate-400 dark:text-[#9AA4B2]">{zoneLabel}</p>
      {!hidden && allowedSizes.length > 1 && (
        <div className="mt-2">
          <p className="mb-1.5 text-xs font-bold text-slate-500 dark:text-[#9AA4B2]">Size</p>
          <div className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-50 p-1 dark:bg-[#20242A]" aria-label={`${title} size`}>
          {allowedSizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onSizeChange?.(size)}
              aria-pressed={widget.size === size}
              className={`rounded-lg px-3 py-1.5 text-xs font-black capitalize transition ${
                widget.size === size
                  ? "bg-white text-[var(--applume-accent-hover)] shadow-sm ring-1 ring-[var(--applume-accent-border)] dark:bg-[#1A1D22] dark:text-[var(--applume-accent-muted)]"
                  : "text-slate-500 hover:text-slate-900 dark:text-[#9AA4B2] dark:hover:text-white"
              }`}
            >
              {size}
            </button>
          ))}
          </div>
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {hidden ? (
          <button type="button" onClick={onShow} aria-label={`Show ${title}`} className="rounded-xl bg-[var(--applume-accent)] px-3 py-2 text-xs font-bold text-white transition hover:bg-[var(--applume-accent-hover)]">
            Show
          </button>
        ) : (
          <>
            <span className="mr-1 text-xs font-bold text-slate-500 dark:text-[#9AA4B2]">Order</span>
            <button type="button" onClick={onMoveUp} disabled={index === 0} aria-label={`Move ${title} up`} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-[rgba(255,255,255,0.09)] dark:text-[#9AA4B2] dark:hover:bg-[#20242A]">
              Move up
            </button>
            <button type="button" onClick={onMoveDown} disabled={index === total - 1} aria-label={`Move ${title} down`} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-[rgba(255,255,255,0.09)] dark:text-[#9AA4B2] dark:hover:bg-[#20242A]">
              Move down
            </button>
            <button type="button" onClick={onHide} aria-label={`Hide ${title}`} className="ml-auto rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-50 dark:border-[rgba(255,255,255,0.09)] dark:text-[#9AA4B2] dark:hover:bg-[#20242A]">
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

  const visible = preferences.widgets
    .filter((widget) => widget.visible)
    .sort((a, b) => DASHBOARD_ZONES.indexOf(a.zone) - DASHBOARD_ZONES.indexOf(b.zone) || a.order - b.order);
  const hidden = preferences.widgets
    .filter((widget) => !widget.visible)
    .sort((a, b) => DASHBOARD_ZONES.indexOf(a.zone) - DASHBOARD_ZONES.indexOf(b.zone) || a.order - b.order);

  function setWidgetVisible(id, visibleValue) {
    const current = preferences.widgets.find((widget) => widget.id === id);
    const zone = current?.zone || "supporting";
    const nextOrder = Math.max(0, ...preferences.widgets.filter((widget) => widget.visible && widget.zone === zone).map((widget) => widget.order)) + 1;
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
            className="absolute bottom-0 right-0 top-auto flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1A1D22] md:bottom-auto md:top-0 md:h-full md:max-h-none md:w-[min(440px,100vw)] md:rounded-none md:border-y-0 md:border-r-0"
            initial={{ x: reduceMotion ? 0 : 32, opacity: reduceMotion ? 1 : 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reduceMotion ? 0 : 32, opacity: reduceMotion ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
          >
            <div className="border-b border-slate-100 p-5 dark:border-[rgba(255,255,255,0.09)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="customize-dashboard-title" className="text-xl font-black text-slate-950 dark:text-white">Customize dashboard</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-[#9AA4B2]">
                    Choose the panels that help you stay focused. You can change this anytime.
                  </p>
                </div>
                <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close customize dashboard" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-[rgba(255,255,255,0.09)] dark:text-[#9AA4B2] dark:hover:bg-[#20242A]">
                  <Icon name="close" className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto p-5">
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
                            ? "border-[var(--applume-accent)] bg-[var(--applume-accent-soft)] ring-1 ring-[var(--applume-accent-border)] dark:bg-[rgba(0,153,102,0.16)]"
                            : "border-slate-200 bg-white hover:bg-slate-50 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#20242A] dark:hover:bg-[#252A31]"
                        }`}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="font-black text-slate-900 dark:text-white">{preset.title}</span>
                          {selected && <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-[var(--applume-accent-hover)] ring-1 ring-[var(--applume-accent-border)]">Selected</span>}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-[#9AA4B2]">{preset.description}</span>
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
                    <p className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-500 dark:bg-[#20242A] dark:text-[#9AA4B2]">All panels are currently visible.</p>
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

            <div className="sticky bottom-0 border-t border-slate-100 bg-white p-4 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1A1D22]">
              {resetConfirming && (
                <div className="mb-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#20242A]">
                  <p className="text-sm font-black text-slate-900 dark:text-white">Reset dashboard layout?</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-[#9AA4B2]">This restores the calm default view. Your applications and records will not be changed.</p>
                </div>
              )}
              <div className="flex flex-wrap items-center justify-end gap-2">
                <button type="button" onClick={resetLayout} className="mr-auto rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-[rgba(255,255,255,0.09)] dark:text-[#9AA4B2] dark:hover:bg-[#20242A]">
                  {resetConfirming ? "Reset layout" : "Reset to calm default"}
                </button>
                <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-[rgba(255,255,255,0.09)] dark:text-[#9AA4B2] dark:hover:bg-[#20242A]">
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
