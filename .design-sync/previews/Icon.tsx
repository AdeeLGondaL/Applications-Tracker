import { Icon } from "applume";

const names = [
  "dashboard", "university", "job", "plus", "search", "download", "upload",
  "edit", "copy", "trash", "link", "calendar", "check", "filter", "sparkles",
  "shield", "mail", "language", "sun", "moon",
];

export const Gallery = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 16, maxWidth: 520 }}>
    {names.map((n) => (
      <div key={n} style={{ display: "grid", placeItems: "center", color: "#334155" }} title={n}>
        <Icon name={n} className="h-5 w-5" />
      </div>
    ))}
  </div>
);

export const Sizes = () => (
  <div style={{ display: "flex", gap: 16, alignItems: "center", color: "#009966" }}>
    <Icon name="sparkles" className="h-4 w-4" />
    <Icon name="sparkles" className="h-6 w-6" />
    <Icon name="sparkles" className="h-8 w-8" />
  </div>
);
