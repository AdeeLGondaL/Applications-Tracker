const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function escapeIcs(str) {
  return String(str || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function toIcsDate(yyyy_mm_dd) {
  return yyyy_mm_dd.replace(/-/g, "");
}

function generateIcs(apps) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//Applume//Applume//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Applume Deadlines",
    "X-WR-TIMEZONE:UTC",
  ];

  for (const app of apps) {
    if (!app.deadline) continue;
    const dateStr = toIcsDate(app.deadline);
    // DTEND = deadline + 1 day
    const deadlineDateObj = new Date(app.deadline + "T00:00:00Z");
    deadlineDateObj.setDate(deadlineDateObj.getDate() + 1);
    const dtEnd = deadlineDateObj.toISOString().slice(0, 10).replace(/-/g, "");

    const summary = escapeIcs(`${app.name}${app.programRole ? " - " + app.programRole : ""}`);
    const description = escapeIcs(
      `Type: ${app.type || ""}\\nStatus: ${app.status || ""}\\nPriority: ${app.priority || ""}${app.notes ? "\\n\\n" + app.notes : ""}`
    );

    lines.push(
      "BEGIN:VEVENT",
      `UID:applume-${app.id}@applume.app`,
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${dtEnd}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      app.link ? `URL:${app.link}` : "",
      `END:VEVENT`
    );
  }

  lines.push("END:VCALENDAR");
  return lines.filter(Boolean).join("\r\n");
}

// Resolves a revocable calendar token to the owning user_id via share_tokens
// (service role). Returns null once the token is revoked, so the feed empties.
async function userIdForToken(supabaseUrl, serviceKey, token) {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/share_tokens?calendar_token=eq.${token}&select=user_id`,
    { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0]?.user_id ?? null;
}

export async function onRequest(context) {
  // token is the filename without .ics extension
  const raw = context.params.token;
  const token = raw.replace(/\.ics$/i, "");

  if (!UUID_RE.test(token)) {
    return new Response("Invalid token", { status: 400 });
  }

  const supabaseUrl = context.env.VITE_SUPABASE_URL;
  const serviceKey = context.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return new Response("Server misconfigured", { status: 500 });
  }

  const userId = await userIdForToken(supabaseUrl, serviceKey, token);
  if (!userId) {
    return new Response("This calendar link is no longer active", { status: 404 });
  }

  const res = await fetch(
    `${supabaseUrl}/rest/v1/applications?user_id=eq.${userId}&select=id,name,programRole,type,status,priority,deadline,link,notes&order=deadline.asc`,
    { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
  );

  if (!res.ok) return new Response("Failed to fetch data", { status: 502 });
  const apps = await res.json();

  const ics = generateIcs(apps);

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": "no-cache, no-store",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
