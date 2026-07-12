import { LanguageSwitcher } from "applume";

export const Default = () => (
  <div style={{ display: "flex", gap: 16, alignItems: "center", minHeight: 48 }}>
    <LanguageSwitcher />
  </div>
);

export const Compact = () => (
  <div style={{ display: "flex", gap: 16, alignItems: "center", minHeight: 48 }}>
    <LanguageSwitcher compact />
  </div>
);
