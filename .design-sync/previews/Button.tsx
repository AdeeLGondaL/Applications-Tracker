import { Button, Icon } from "applume";

export const Variants = () => (
  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
    <Button>Save changes</Button>
    <Button variant="outline">Cancel</Button>
  </div>
);

export const WithIcons = () => (
  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
    <Button>
      <Icon name="plus" /> Add application
    </Button>
    <Button variant="outline">
      <Icon name="download" /> Import backup
    </Button>
    <Button variant="outline" className="text-rose-600">
      <Icon name="trash" /> Delete
    </Button>
  </div>
);

export const IconOnly = () => (
  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
    <Button className="rounded-2xl"><Icon name="edit" /></Button>
    <Button variant="outline" className="rounded-2xl"><Icon name="copy" /></Button>
  </div>
);
