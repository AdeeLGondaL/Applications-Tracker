import { Input } from "applume";

export const Text = () => (
  <div style={{ display: "grid", gap: 12, maxWidth: 360 }}>
    <Input placeholder="Search applications…" />
    <Input defaultValue="M.Sc. Computer Science" />
  </div>
);

export const WithLeadingIcon = () => (
  <div style={{ position: "relative", maxWidth: 360 }}>
    <svg style={{ position: "absolute", left: 12, top: 14, color: "#94a3b8" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 21l-4.3-4.3M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
    </svg>
    <Input className="pl-9" placeholder="Filter by name or city" />
  </div>
);

export const Date = () => (
  <div style={{ maxWidth: 220 }}>
    <Input type="date" defaultValue="2026-09-15" />
  </div>
);
