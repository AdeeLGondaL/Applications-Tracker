import { NavItem } from "applume";

export const Sidebar = () => (
  <div style={{ display: "grid", gap: 6, width: 240, padding: 12, background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0" }}>
    <NavItem icon="dashboard" label="Dashboard" active onClick={() => {}} />
    <NavItem icon="university" label="Universities" count={12} onClick={() => {}} />
    <NavItem icon="job" label="Jobs" count={8} onClick={() => {}} />
    <NavItem icon="calendar" label="Deadlines" count={3} alert onClick={() => {}} />
    <NavItem icon="shield" label="Settings" onClick={() => {}} />
  </div>
);
