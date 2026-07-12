import { Card, CardContent } from "applume";

// CardContent is the padded body region of a Card. It is always composed inside
// a Card — shown here with a couple of padding scales.
export const InsideCard = () => (
  <div style={{ display: "grid", gap: 16, maxWidth: 360 }}>
    <Card>
      <CardContent className="p-4">
        <p className="text-sm font-bold">Compact padding (p-4)</p>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-bold">Roomy padding (p-6)</p>
        <p className="mt-1 text-sm text-slate-500">Content sits inside the card's rounded surface.</p>
      </CardContent>
    </Card>
  </div>
);
