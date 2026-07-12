import { QuickActionsPanel } from "applume";
import { noop } from "./_fixtures";

export const Panel = () => (
  <div style={{ maxWidth: 340 }}>
    <QuickActionsPanel onAddUniversity={noop} onAddJob={noop} onImport={noop} onCalendarSync={noop} />
  </div>
);
