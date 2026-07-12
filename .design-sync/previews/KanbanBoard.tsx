import { KanbanBoard } from "applume";
import { sampleApps, noop } from "./_fixtures";

export const Board = () => (
  <KanbanBoard apps={sampleApps} onEdit={noop} onDelete={noop} onStatusChange={noop} />
);
