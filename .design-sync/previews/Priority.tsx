import { Priority } from "applume";

export const Levels = () => (
  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
    <Priority priority="High" />
    <Priority priority="Medium" />
    <Priority priority="Low" />
  </div>
);
