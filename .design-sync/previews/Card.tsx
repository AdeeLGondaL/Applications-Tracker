import { Card, CardContent } from "applume";

export const Basic = () => (
  <div style={{ maxWidth: 360 }}>
    <Card>
      <CardContent className="p-5">
        <p className="text-sm font-black">Application summary</p>
        <p className="mt-1 text-sm text-slate-500">
          A rounded surface with a subtle border and shadow — the base container for cards across Applume.
        </p>
      </CardContent>
    </Card>
  </div>
);

export const WithHeaderAndActions = () => (
  <div style={{ maxWidth: 360 }}>
    <Card>
      <CardContent className="p-5">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p className="text-base font-black">Documents</p>
          <span className="text-xs font-bold text-[var(--applume-accent)]">Edit</span>
        </div>
        <p className="mt-2 text-sm text-slate-500">CV, transcript, motivation letter</p>
      </CardContent>
    </Card>
  </div>
);
