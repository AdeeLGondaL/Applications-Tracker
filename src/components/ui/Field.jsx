export function DrawerSection({ label, children }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <p className="shrink-0 text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <div className="flex-1 border-t border-slate-100" />
      </div>
      {children}
    </div>
  );
}

export function Field({ label, children, required = false, wide = false }) {
  return (
    <label className={`grid gap-1.5 text-sm font-bold text-slate-700 ${wide ? "sm:col-span-2" : ""}`}>
      <span>
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

export function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 ${className}`}
    />
  );
}

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      rows={4}
      className={`resize-none rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 ${className}`}
    />
  );
}

export function Select({ options, ...props }) {
  const normalized = options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option
  );
  return (
    <select
      {...props}
      className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
    >
      {normalized.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
