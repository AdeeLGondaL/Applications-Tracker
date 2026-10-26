export function Brand({ dark = false }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <img
        src={dark ? "/logo-dark.png" : "/Logo.png"}
        alt="Applume"
        className="h-9 w-9 shrink-0 object-contain"
        style={dark ? undefined : { mixBlendMode: "multiply" }}
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-black leading-tight">Applume</p>
        <p className="text-[10px] leading-snug text-slate-400 dark:text-[#71717a]">Structured application tracking</p>
      </div>
    </div>
  );
}
