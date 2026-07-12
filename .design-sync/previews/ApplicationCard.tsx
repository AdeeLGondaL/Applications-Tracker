import { ApplicationCard } from "applume";
import { sampleApps, noop } from "./_fixtures";

export const University = () => (
  <div style={{ maxWidth: 380 }}>
    <ApplicationCard
      app={sampleApps[0]}
      onEdit={noop}
      onDelete={noop}
      onDuplicate={noop}
      onStatusChange={noop}
      selected={false}
      onToggleSelect={noop}
    />
  </div>
);

export const Job = () => (
  <div style={{ maxWidth: 380 }}>
    <ApplicationCard
      app={sampleApps[1]}
      onEdit={noop}
      onDelete={noop}
      onDuplicate={noop}
      onStatusChange={noop}
      selected={false}
      onToggleSelect={noop}
    />
  </div>
);

export const Selected = () => (
  <div style={{ maxWidth: 380 }}>
    <ApplicationCard
      app={sampleApps[2]}
      onEdit={noop}
      onDelete={noop}
      onDuplicate={noop}
      onStatusChange={noop}
      selected={true}
      onToggleSelect={noop}
    />
  </div>
);
