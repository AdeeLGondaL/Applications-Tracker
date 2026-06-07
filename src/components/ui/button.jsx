
const variants = {
  default: "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 font-semibold shadow-md hover:shadow-lg transition-all active:shadow-sm",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 font-semibold transition-all shadow-sm hover:shadow-md",
  outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 font-semibold transition-all shadow-sm hover:shadow-md",
  ghost: "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 font-semibold transition-all",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-lg",
  lg: "px-6 py-3 text-base rounded-lg",
};

export function Button({ 
  variant = "default", 
  size = "md",
  className = "", 
  children, 
  type = "button", 
  ...props 
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${sizes[size]} ${variants[variant] ?? variants.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
