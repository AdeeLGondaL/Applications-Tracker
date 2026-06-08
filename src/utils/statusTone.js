export function statusTone(status) {
  const map = {
    Accepted: "success",
    Rejected: "danger",
    "Awaiting Response": "blue",
    Applying: "violet",
    Submitted: "blue",
    Interview: "violet",
    Open: "success",
    "Not Open Yet": "neutral",
    Deferred: "notice",
  };
  return map[status] || "neutral";
}
