import { Info } from "applume";

export const Pair = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxWidth: 380 }}>
    <Info label="City" value="Munich" />
    <Info label="Deadline" value="15 Sep 2026" />
    <Info label="Type" value="University" />
    <Info label="Priority" value="High" />
  </div>
);
