import { Icon } from "@/components/ui/Icon";

export function NavItem({ icon, label, count, active = false, alert = false, collapsed = false, onClick }) {
  const hasCount = typeof count === "number" && count > 0;
  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? label : undefined}
      aria-current={active ? "page" : undefined}
      className={`group flex w-full items-center rounded-xl py-2 text-sm font-semibold transition-colors ${
        collapsed ? "justify-center px-0" : "justify-between px-3"
      } ${
        active
          ? "bg-[var(--applume-accent-strong)] text-white shadow-sm shadow-[var(--applume-accent-shadow)] dark:bg-[#1c1c1f] dark:text-white"
          : "text-slate-500 hover:bg-[var(--applume-accent-soft)] hover:text-[var(--applume-accent-ink)] dark:text-[#71717a] dark:hover:bg-[#1c1c1f] dark:hover:text-[#f0f0f0]"
      }`}
    >
      <span className="flex items-center gap-2.5">
        <span className="relative">
          <Icon name={icon} className={active ? "text-white" : "text-slate-400 group-hover:text-[var(--applume-accent)] dark:group-hover:text-[#d4d4d8]"} />
          {/* Collapsed: the count moves onto the icon as a small badge */}
          {collapsed && hasCount && (
            <span
              className={`absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-black leading-none ${
                alert ? "bg-[var(--danger)] text-white" : "bg-slate-200 text-slate-600 dark:bg-[#2a2a2e] dark:text-[#d4d4d8]"
              }`}
            >
              {count > 99 ? "99+" : count}
            </span>
          )}
        </span>
        <span className={collapsed ? "sr-only" : "whitespace-nowrap"}>{label}</span>
      </span>
      {!collapsed && hasCount && (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-bold ${
            active
              ? "bg-white/20 text-white"
              : alert
              ? "bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400"
              : "bg-slate-100 text-slate-500 dark:bg-[#1c1c1f] dark:text-[#71717a]"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
