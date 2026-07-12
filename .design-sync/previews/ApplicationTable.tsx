import { ApplicationTable } from "applume";
import { sampleApps, selectedIds, noop } from "./_fixtures";

export const Table = () => (
  <ApplicationTable
    apps={sampleApps}
    selectedIds={selectedIds}
    onEdit={noop}
    onDelete={noop}
    onDuplicate={noop}
    onStatusChange={noop}
    onToggleSelect={noop}
    onSelectAll={noop}
  />
);
