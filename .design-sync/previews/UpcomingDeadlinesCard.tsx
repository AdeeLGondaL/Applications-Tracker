import { UpcomingDeadlinesCard } from "applume";
import { sampleApps, noop } from "./_fixtures";

export const List = () => (
  <div style={{ maxWidth: 380 }}>
    <UpcomingDeadlinesCard apps={sampleApps.slice(0, 4)} onOpenRecord={noop} onAddDeadline={noop} />
  </div>
);
