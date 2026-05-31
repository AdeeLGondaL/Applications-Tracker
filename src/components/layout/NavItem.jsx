import { Icon } from "@/components/ui/Icon";

export function NavItem({ icon, label, count, active = false, alert = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
        active
          ? "bg-slate-950 text-white shadow-sm dark:bg-slate-700 dark:text-white"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      }`}
    >
      <span className="flex items-center gap-2.5">
        <Icon name={icon} className={active ? "text-white" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"} />
        {label}
      </span>
      {typeof count === "number" && count > 0 && (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-bold ${
            active
              ? "bg-white/20 text-white"
              : alert
              ? "bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400"
              : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
