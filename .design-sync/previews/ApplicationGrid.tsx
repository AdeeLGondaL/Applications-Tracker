import { ApplicationGrid } from "applume";
import { sampleApps, selectedIds, noop } from "./_fixtures";

export const Grid = () => (
  <ApplicationGrid
    apps={sampleApps}
    selectedIds={selectedIds}
    onEdit={noop}
    onDelete={noop}
    onDuplicate={noop}
    onStatusChange={noop}
    onToggleSelect={noop}
  />
);
