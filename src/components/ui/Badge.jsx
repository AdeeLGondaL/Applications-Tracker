import { Icon } from "@/components/ui/Icon";

function badgeClass(tone) {
  const map = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    danger: "border-rose-200 bg-rose-50 text-rose-700",
    warning: "border-orange-200 bg-orange-50 text-orange-700",
    notice: "border-amber-200 bg-amber-50 text-amber-700",
    neutral: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    violet: "border-violet-200 bg-violet-50 text-violet-700",
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
  const tone = priority === "High" ? "danger" : priority === "Medium" ? "notice" : "neutral";
  return <Badge tone={tone}>{priority}</Badge>;
}

export function IconButton({ icon, label, onClick, danger = false }) {
  const dangerClass = danger
    ? "text-rose-600 hover:border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/40"
    : "text-slate-600 hover:text-slate-950 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700";
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white transition dark:border-slate-700 dark:bg-slate-800 ${dangerClass}`}
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
      className={`rounded-xl px-3 py-1.5 text-xs font-bold ${active ? "bg-white text-slate-950 shadow-sm dark:bg-slate-700 dark:text-slate-100" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"}`}
    >
      {children}
    </button>
  );
}

export function statusTone(status) {
  const map = {
    Accepted: "success",
    Rejected: "danger",
    "Awaiting Response": "blue",
    Applying: "violet",
    Submitted: "blue",
    Interview: "violet",
    Open: "success",
    "Not Open Yet": "neutral",
    Deferred: "notice",
  };
  return map[status] || "neutral";
}
