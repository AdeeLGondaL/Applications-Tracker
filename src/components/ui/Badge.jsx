import { Icon } from "@/components/ui/Icon";

function badgeClass(tone) {
  const map = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    danger: "border-rose-200 bg-rose-50 text-rose-700",
    warning: "border-orange-200 bg-orange-50 text-orange-700",
    notice: "border-amber-200 bg-amber-50 text-amber-700",
    neutral: "border-slate-200 bg-slate-50 text-slate-700 dark:border-[#3a3a3e] dark:bg-[#1c1c1f] dark:text-[#d4d4d8]",
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
    : "text-slate-600 hover:text-slate-950 hover:bg-slate-50 dark:text-[#a1a1aa] dark:hover:text-white dark:hover:bg-[#2a2a2e]";
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white transition dark:border-[#2a2a2e] dark:bg-[#1c1c1f] ${dangerClass}`}
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
      className={`min-w-0 rounded-xl px-2.5 py-1.5 text-xs font-bold sm:px-3 ${active ? "bg-white text-slate-950 shadow-sm dark:bg-[#2a2a2e] dark:text-white" : "text-slate-500 hover:text-slate-900 dark:text-[#71717a] dark:hover:text-[#d4d4d8]"}`}
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
