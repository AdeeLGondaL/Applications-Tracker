import { ImportCsvModal } from "applume";
import { noop } from "./_fixtures";

// Full-viewport modal (position: fixed); the transformed wrapper scopes the
// fixed overlay to this box so the centered dialog renders inside the card.
const stage = {
  position: "relative",
  transform: "translateZ(0)",
  width: 840,
  height: 660,
  overflow: "hidden",
  borderRadius: 16,
  background: "#f1f5f9",
} as const;

export const ChooseFile = () => (
  <div style={stage}>
    <ImportCsvModal onClose={noop} onImport={noop} />
  </div>
);
