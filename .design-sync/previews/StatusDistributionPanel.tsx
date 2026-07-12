import { StatusDistributionPanel } from "applume";
import { sampleApps } from "./_fixtures";

export const Panel = () => (
  <div style={{ maxWidth: 360 }}>
    <StatusDistributionPanel applications={sampleApps} />
  </div>
);
