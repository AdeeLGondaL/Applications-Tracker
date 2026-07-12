import { Field, Input, Textarea, Select } from "applume";

export const TextField = () => (
  <div style={{ maxWidth: 420 }}>
    <Field label="Program / Role">
      <Input placeholder="MSc Computer Science" defaultValue="MSc Computer Science" />
    </Field>
  </div>
);

export const RequiredField = () => (
  <div style={{ maxWidth: 420 }}>
    <Field label="University / Company" required>
      <Input placeholder="TU Munich" defaultValue="TU Munich" />
    </Field>
  </div>
);

export const SelectField = () => (
  <div style={{ maxWidth: 420 }}>
    <Field label="Priority">
      <Select options={["High", "Medium", "Low"]} defaultValue="High" />
    </Field>
  </div>
);

export const FormGrid = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 560 }}>
    <Field label="City">
      <Input placeholder="Munich" defaultValue="Munich" />
    </Field>
    <Field label="Type">
      <Select options={["University", "Job"]} defaultValue="University" />
    </Field>
    <Field label="Notes" wide>
      <Textarea placeholder="Add context, reminders, or next steps…" defaultValue="Need two academic references before the deadline." />
    </Field>
  </div>
);
