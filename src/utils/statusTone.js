// Collapsed onto the editorial 5-tone system used across the app
// (success · info · warning · neutral · danger) — no saturated blue/violet/amber
// sprawl, so status reads calmly and stays on-brand.
export function statusTone(status) {
  const map = {
    "Not Open Yet": "neutral",
    Open: "success",
    Applying: "warning",
    Submitted: "info",
    "Awaiting Response": "info",
    Interview: "info",
    Accepted: "success",
    Rejected: "danger",
    Deferred: "neutral",
  };
  return map[status] || "neutral";
}
