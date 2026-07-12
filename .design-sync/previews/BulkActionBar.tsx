import { BulkActionBar } from "applume";
import { noop } from "./_fixtures";

// Fixed action bar pinned near the bottom of the viewport (appears when rows are
// selected). The transformed wrapper scopes the fixed positioning to this box so
// the bar renders within the preview card instead of escaping to the page.
const stage = {
  position: "relative",
  transform: "translateZ(0)",
  width: 820,
  height: 180,
  overflow: "hidden",
  borderRadius: 16,
  background: "#f8fafc",
} as const;

export const Selected = () => (
  <div style={stage}>
    <BulkActionBar count={3} onStatusChange={noop} onPriorityChange={noop} onDelete={noop} onClear={noop} />
  </div>
);
