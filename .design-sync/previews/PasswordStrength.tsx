import { PasswordStrength } from "applume";

const row = { maxWidth: 320, marginBottom: 16 } as const;

export const Strengths = () => (
  <div style={{ maxWidth: 320 }}>
    <div style={row}><p className="mb-1 text-xs font-bold text-slate-500">Too short</p><PasswordStrength password="abc" /></div>
    <div style={row}><p className="mb-1 text-xs font-bold text-slate-500">Weak</p><PasswordStrength password="abcdef" /></div>
    <div style={row}><p className="mb-1 text-xs font-bold text-slate-500">Fair</p><PasswordStrength password="Abcdef1" /></div>
    <div style={row}><p className="mb-1 text-xs font-bold text-slate-500">Good</p><PasswordStrength password="Abcdef1!" /></div>
    <div style={{ maxWidth: 320 }}><p className="mb-1 text-xs font-bold text-slate-500">Strong</p><PasswordStrength password="Abcdef1!longpass" /></div>
  </div>
);
