import { NextStepCoveragePanel } from "applume";
import { noop } from "./_fixtures";

export const Panel = () => (
  <div style={{ maxWidth: 340 }}>
    <NextStepCoveragePanel total={24} withNextStep={17} onAddNextSteps={noop} />
  </div>
);
