
const variants = {
  default: "bg-slate-950 text-white hover:bg-slate-800 dark:bg-[#f0f0f0] dark:text-slate-900 dark:hover:bg-white",
  outline: "border border-slate-200 bg-white text-slate-950 hover:bg-slate-50 dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:text-[#f0f0f0] dark:hover:bg-[#242428]",
};

export function Button({ variant = "default", className = "", children, type = "button", ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${variants[variant] ?? variants.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
