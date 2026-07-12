import { Badge } from "applume";

const wrap = { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" } as const;

export const Tones = () => (
  <div style={wrap}>
    <Badge tone="success">Accepted</Badge>
    <Badge tone="warning">9d left</Badge>
    <Badge tone="notice">Interview</Badge>
    <Badge tone="danger">Overdue</Badge>
    <Badge tone="neutral">Draft</Badge>
    <Badge tone="blue">Open</Badge>
    <Badge tone="violet">Submitted</Badge>
  </div>
);

export const OnDark = () => (
  <div style={{ background: "#0f172a", padding: 16, borderRadius: 16, display: "inline-flex", gap: 10 }}>
    <Badge tone="dark">Selected</Badge>
    <Badge tone="dark">3 items</Badge>
  </div>
);
