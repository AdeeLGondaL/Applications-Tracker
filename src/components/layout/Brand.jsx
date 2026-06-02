export function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src="/Logo.png"
        alt="ApplyBuddy"
        className="h-9 w-9 object-contain shrink-0 dark:brightness-150"
        style={{ mixBlendMode: "multiply" }}
      />
      <div>
        <p className="text-sm font-black leading-tight">ApplyBuddy</p>
        <p className="text-[10px] text-slate-400 dark:text-[#71717a]">Your application buddy</p>
      </div>
    </div>
  );
}
