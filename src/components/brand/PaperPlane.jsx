// Applume paper-plane motif — a custom SVG dart derived from the logo's
// angular plane (two folded facets pointing up-and-right). Uses currentColor
// so it can be tinted via text color. Purely decorative by default.
export function PaperPlane({ className = "", style, title }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      style={style}
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      {/* Upper wing (lighter facet) */}
      <path d="M4 30 L58 6 L28 34 Z" fill="currentColor" opacity="0.55" />
      {/* Lower body (solid facet) with the center fold */}
      <path d="M28 34 L58 6 L34 44 L26 38 Z" fill="currentColor" />
      {/* Fold highlight */}
      <path d="M58 6 L28 34" stroke="currentColor" strokeOpacity="0.9" strokeWidth="0" />
    </svg>
  );
}

export default PaperPlane;
