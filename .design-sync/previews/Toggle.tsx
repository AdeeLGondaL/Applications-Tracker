import { Toggle } from "applume";

export const SegmentedControl = () => (
  <div style={{ display: "inline-flex", gap: 4, padding: 4, borderRadius: 16, background: "#f1f5f9" }}>
    <Toggle active={true} onClick={() => {}}>Table</Toggle>
    <Toggle active={false} onClick={() => {}}>Cards</Toggle>
    <Toggle active={false} onClick={() => {}}>Kanban</Toggle>
  </div>
);
