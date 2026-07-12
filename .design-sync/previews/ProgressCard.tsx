import { ProgressCard } from "applume";

export const Default = () => (
  <div style={{ maxWidth: 320 }}>
    <ProgressCard progress={64} submitted={11} total={17} />
  </div>
);

export const Early = () => (
  <div style={{ maxWidth: 320 }}>
    <ProgressCard progress={12} submitted={2} total={16} />
  </div>
);
