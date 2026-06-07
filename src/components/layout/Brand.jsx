export function Brand({ dark = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src={dark ? "/logo-dark.png" : "/Logo.png"}
        alt="Applume"
        className="h-9 w-9 shrink-0 object-contain"
        style={dark ? undefined : { mixBlendMode: "multiply" }}
      />
      <div>
        <p className="text-sm font-black leading-tight">Applume</p>
        <p className="text-[10px] text-slate-400 dark:text-[#71717a]">Track every application</p>
      </div>
    </div>
  );
}
