import { InlineStatusPicker } from "applume";
import { noop } from "./_fixtures";

// The picker's trigger is a status Badge; clicking opens the status menu.
export const Triggers = () => (
  <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
    <InlineStatusPicker status="Applying" onStatusChange={noop} />
    <InlineStatusPicker status="Interview" onStatusChange={noop} />
    <InlineStatusPicker status="Accepted" onStatusChange={noop} />
    <InlineStatusPicker status="Rejected" onStatusChange={noop} />
  </div>
);
