import { Select } from "applume";

export const StringOptions = () => (
  <div style={{ maxWidth: 260 }}>
    <Select options={["High", "Medium", "Low"]} defaultValue="High" />
  </div>
);

export const LabelValueOptions = () => (
  <div style={{ maxWidth: 260 }}>
    <Select
      defaultValue="deadline"
      options={[
        { label: "Sort by deadline", value: "deadline" },
        { label: "Sort by priority", value: "priority" },
        { label: "Sort by name", value: "name" },
      ]}
    />
  </div>
);
