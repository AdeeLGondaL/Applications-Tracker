// Shared button primitive. Editorial + token-driven: moderate radius, calm
// transitions, brand-green primary. Keeps the `default` / `outline` variant
// names used across the app; adds `ghost` and a `size` prop.
const base =
  "inline-flex items-center justify-center gap-2 font-semibold leading-none transition-[background-color,border-color,color,box-shadow] duration-150 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap";

const sizes = {
  sm: "h-9 px-3 text-[13px] rounded-[8px]",
  md: "h-11 px-4 text-sm rounded-[10px]",
  lg: "h-12 px-5 text-[15px] rounded-[11px]",
};

const variants = {
  default:
    "bg-[var(--applume-accent-strong)] text-white shadow-sm hover:bg-[var(--applume-accent-ink)] dark:bg-[var(--applume-accent)] dark:text-[#06231a] dark:hover:bg-[var(--applume-accent-strong)]",
  outline:
    "border border-[var(--border-strong)] bg-[var(--surface-card)] text-[var(--ink)] hover:border-[var(--applume-accent-border)] hover:bg-[var(--surface-soft)]",
  ghost:
    "text-[var(--ink)] hover:bg-[var(--surface-soft)]",
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
      className={`${base} ${sizes[size] ?? sizes.md} ${variants[variant] ?? variants.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
