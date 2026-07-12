import { Metric } from "applume";

export const Grid = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(180px, 1fr))", gap: 16, maxWidth: 560 }}>
    <Metric icon="job" label="Total applications" value={24} hint="Across all tracks" accent="accent" />
    <Metric icon="check" label="Submitted" value={11} hint="46% of pipeline" accent="blue" progressValue={46} />
    <Metric icon="calendar" label="Interviews" value={3} hint="This month" accent="violet" />
    <Metric icon="reset" label="Due this week" value={2} hint="Deadlines closing" danger />
  </div>
);

export const WithProgress = () => (
  <div style={{ maxWidth: 260 }}>
    <Metric icon="check" label="Documents ready" value="8 / 12" hint="67% complete" accent="accent" progressValue={67} />
  </div>
);

export const Urgent = () => (
  <div style={{ maxWidth: 260 }}>
    <Metric icon="reset" label="Overdue" value={4} hint="Needs attention now" danger />
  </div>
);
