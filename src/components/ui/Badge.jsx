import { Icon } from "@/components/ui/Icon";
import { useLanguage } from "@/i18n";

// Muted, token-based tints shared with the landing page. Legacy blue/violet/notice
// collapse onto the same 5-tone system so nothing renders as a saturated chip.
function badgeClass(tone) {
  const info = "border-[color-mix(in_srgb,var(--info)_26%,transparent)] bg-[var(--info-soft)] text-[var(--info)]";
  const warning = "border-[color-mix(in_srgb,var(--warning)_30%,transparent)] bg-[var(--warning-soft)] text-[var(--warning-ink)]";
  const map = {
    success: "border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] text-[var(--applume-accent-hover)]",
    danger: "border-[color-mix(in_srgb,var(--danger)_26%,transparent)] bg-[var(--danger-soft)] text-[var(--danger)]",
    warning,
    notice: warning,
    neutral: "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)]",
    blue: info,
    info,
    violet: info,
    dark: "border-white/10 bg-white/10 text-white",
  };
  return map[tone] || map.neutral;
}

export function Badge({ children, tone = "neutral" }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${badgeClass(tone)}`}>
      {children}
    </span>
  );
}

export function Priority({ priority }) {
  const { label } = useLanguage();
  const tone = priority === "High" ? "danger" : priority === "Medium" ? "notice" : "neutral";
  return <Badge tone={tone}>{label("priority", priority)}</Badge>;
}

export function IconButton({ icon, label, onClick, danger = false }) {
  const dangerClass = danger
    ? "text-[var(--danger)] hover:border-[color-mix(in_srgb,var(--danger)_30%,transparent)] hover:bg-[var(--danger-soft)]"
    : "text-[var(--text-muted)] hover:border-[var(--applume-accent-border)] hover:text-[var(--applume-accent-hover)] hover:bg-[var(--applume-accent-soft)]";
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`grid h-9 w-9 place-items-center rounded-[10px] border border-[var(--border)] bg-[var(--surface-card)] transition ${dangerClass}`}
    >
      <Icon name={icon} />
    </button>
  );
}

export function Toggle({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-0 rounded-[9px] px-2.5 py-1.5 text-xs font-semibold sm:px-3 ${active ? "bg-[var(--surface-card)] text-[var(--text-strong)] shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text-strong)]"}`}
    >
      {children}
    </button>
  );
}

