export function DrawerSection({ label, children }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <p className="shrink-0 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-[#71717a]">{label}</p>
        <div className="flex-1 border-t border-slate-100 dark:border-[#2a2a2e]" />
      </div>
      {children}
    </div>
  );
}

export function Field({ label, children, required = false, wide = false }) {
  return (
    <label className={`grid gap-2 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

export function Input({ className = "", disabled = false, ...props }) {
  return (
    <input
      {...props}
      disabled={disabled}
      className={`h-10 min-w-0 w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none placeholder:text-slate-400 transition-all duration-200 
        focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:ring-offset-0
        disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
        dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500
        dark:focus:border-emerald-500 dark:focus:ring-emerald-600/50 dark:focus:ring-offset-slate-900
        dark:disabled:border-slate-700 dark:disabled:bg-slate-950 dark:disabled:text-slate-600 
        ${className}`}
    />
  );
}

export function Textarea({ className = "", disabled = false, rows = 4, ...props }) {
  return (
    <textarea
      {...props}
      disabled={disabled}
      rows={rows}
      className={`w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none placeholder:text-slate-400 transition-all duration-200 resize-y
        focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:ring-offset-0
        disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed disabled:resize-none
        dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500
        dark:focus:border-emerald-500 dark:focus:ring-emerald-600/50 dark:focus:ring-offset-slate-900
        dark:disabled:border-slate-700 dark:disabled:bg-slate-950 dark:disabled:text-slate-600
        ${className}`}
    />
  );
}

export function Select({ options, disabled = false, ...props }) {
  const normalized = options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option
  );
  return (
    <select
      {...props}
      disabled={disabled}
      className="h-10 min-w-0 w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none transition-all duration-200
        focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:ring-offset-0
        disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
        dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100
        dark:focus:border-emerald-500 dark:focus:ring-emerald-600/50 dark:focus:ring-offset-slate-900
        dark:disabled:border-slate-700 dark:disabled:bg-slate-950 dark:disabled:text-slate-600"
    >
      {normalized.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
