import { motion } from "framer-motion";

export function PasswordStrength({ password }) {
  if (!password) return null;
  if (password.length < 6) {
    return (
      <div className="space-y-1">
        <div className="h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-[#2a2a2e]">
          <div className="h-full w-[15%] rounded-full bg-rose-400" />
        </div>
        <p className="text-xs font-semibold text-rose-500">Too short — minimum 6 characters</p>
      </div>
    );
  }
  const extras = [
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
    password.length >= 12,
  ].filter(Boolean).length;
  const levels = [
    { label: "Weak",   color: "bg-orange-400", text: "text-orange-500", pct: "30%"  },
    { label: "Fair",   color: "bg-yellow-400", text: "text-yellow-600", pct: "55%"  },
    { label: "Good",   color: "bg-blue-400",   text: "text-blue-500",   pct: "75%"  },
    { label: "Strong", color: "bg-emerald-400",text: "text-emerald-500",pct: "100%" },
  ];
  const lvl = levels[Math.min(extras, 3)];
  return (
    <div className="space-y-1">
      <div className="h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-[#2a2a2e]">
        <motion.div
          className={`h-full rounded-full ${lvl.color}`}
          initial={{ width: 0 }}
          animate={{ width: lvl.pct }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>
      <p className={`text-xs font-semibold ${lvl.text}`}>{lvl.label}</p>
    </div>
  );
}

export function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 dark:bg-[#2a2a2e]">
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-400 dark:text-[#71717a]">{label}</p>
      <p className="mt-1 truncate text-sm font-bold text-slate-700 dark:text-[#d4d4d8]">{value}</p>
    </div>
  );
}
