import { ApplicationDrawer } from "applume";
import { filledForm, sampleApps, noop } from "./_fixtures";

// ApplicationDrawer is a full-viewport overlay (position: fixed). The wrapper's
// `transform` makes the fixed children resolve to this box instead of the page,
// so the slide-in panel renders at full height inside the preview card.
const stage = {
  position: "relative",
  transform: "translateZ(0)",
  width: 900,
  height: 680,
  overflow: "hidden",
  borderRadius: 16,
  background: "#f1f5f9",
} as const;

export const EditRecord = () => (
  <div style={stage}>
    <ApplicationDrawer
      form={filledForm}
      editingId="app-1"
      applications={sampleApps}
      onChange={noop}
      onBatchChange={noop}
      onSave={noop}
      onClose={noop}
    />
  </div>
);
