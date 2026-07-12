import { Textarea } from "applume";

export const Basic = () => (
  <div style={{ maxWidth: 420 }}>
    <Textarea placeholder="Add context, reminders, or next steps…" />
  </div>
);

export const Filled = () => (
  <div style={{ maxWidth: 420 }}>
    <Textarea defaultValue="Check credit-transfer requirements; email admissions about module equivalency before the deadline." />
  </div>
);
