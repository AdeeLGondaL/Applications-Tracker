import { Brand } from "applume";

// NOTE: Brand renders the app's logo from /Logo.png, a public asset that isn't
// part of the design-system bundle, so the logo image itself won't resolve in
// this preview (the wordmark + tagline render normally).
export const Default = () => (
  <div style={{ padding: 8 }}>
    <Brand />
  </div>
);

export const OnDark = () => (
  <div style={{ padding: 16, background: "#0f172a", borderRadius: 16, color: "#fff" }}>
    <Brand dark />
  </div>
);
