import { DrawerSection, Field, Input } from "applume";

export const LabeledSection = () => (
  <div style={{ maxWidth: 460 }}>
    <DrawerSection label="Institution">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="University name" required>
          <Input defaultValue="TU Munich" />
        </Field>
        <Field label="City / Campus">
          <Input defaultValue="Munich" />
        </Field>
      </div>
    </DrawerSection>
  </div>
);
