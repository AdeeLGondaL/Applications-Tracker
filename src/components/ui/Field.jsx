export function DrawerSection({ label, children }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-soft)]">{label}</p>
        <div className="flex-1 border-t border-[var(--border)]" />
      </div>
      {children}
    </div>
  );
}

export function Field({ label, children, required = false, wide = false }) {
  return (
    <label className={`grid gap-1.5 text-[13px] font-semibold text-[var(--text-muted)] ${wide ? "sm:col-span-2" : ""}`}>
      <span>
        {label}
        {required && <span className="text-[var(--danger)]"> *</span>}
      </span>
      {children}
    </label>
  );
}

const controlBase =
  "w-full min-w-0 rounded-[var(--radius)] border border-[var(--border-strong)] bg-[var(--surface-card)] text-[var(--ink)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--text-soft)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--ring)]";

export function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`${controlBase} h-11 px-3 text-sm ${className}`}
    />
  );
}

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      rows={props.rows ?? 4}
      className={`${controlBase} resize-none px-3 py-3 text-sm ${className}`}
    />
  );
}

export function Select({ options, className = "", ...props }) {
  const normalized = options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option
  );
  return (
    <select
      {...props}
      className={`${controlBase} h-11 w-full px-3 text-sm font-medium ${className}`}
    >
      {normalized.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
