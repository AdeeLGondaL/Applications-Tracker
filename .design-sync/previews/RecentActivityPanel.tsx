import { RecentActivityPanel } from "applume";
import { sampleApps, noop } from "./_fixtures";

export const Panel = () => (
  <div style={{ maxWidth: 360 }}>
    <RecentActivityPanel applications={sampleApps} onOpenRecord={noop} />
  </div>
);
