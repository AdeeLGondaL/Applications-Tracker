const NAME_RE = /^[a-z0-9_]{1,48}$/;
const MAX_BODY_BYTES = 2048;

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== "POST") return new Response(null, { status: 405 });

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return new Response(null, { status: 413 });

  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  const { name, properties, sessionId } = body || {};
  if (typeof name !== "string" || !NAME_RE.test(name)) return new Response(null, { status: 400 });

  const supabaseUrl = env.VITE_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !serviceKey) return new Response(null, { status: 503 });

  const row = {
    name,
    properties: properties && typeof properties === "object" && !Array.isArray(properties) ? properties : {},
    session_id: typeof sessionId === "string" ? sessionId.slice(0, 64) : null,
    country: request.headers.get("CF-IPCountry") || null,
  };

  const res = await fetch(`${supabaseUrl}/rest/v1/events`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });
  return new Response(null, { status: res.ok ? 204 : 500 });
}
