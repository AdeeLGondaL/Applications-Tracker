// The real Applume logo (paper-plane + handshake) as the brand lockup.
// Light surfaces use Logo.png (dark handshake, white knocked out via multiply);
// dark surfaces use logo-dark.png (light handshake).
export function Logo({ className = "", imgClass = "h-8 w-8", showWordmark = true, wordmarkClass = "text-[17px]" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src="/Logo.png"
        alt="Applume"
        className={`${imgClass} shrink-0 object-contain block dark:hidden`}
        style={{ mixBlendMode: "multiply" }}
      />
      <img
        src="/logo-dark.png"
        alt="Applume"
        aria-hidden="true"
        className={`${imgClass} shrink-0 object-contain hidden dark:block`}
      />
      {showWordmark && (
        <span className={`font-bold tracking-tight text-[var(--ink)] ${wordmarkClass}`}>
          App<span className="text-[var(--applume-accent)]">lume</span>
        </span>
      )}
    </span>
  );
}

export default Logo;
