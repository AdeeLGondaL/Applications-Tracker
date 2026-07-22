const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Resolves a revocable share token to the owning user_id via the share_tokens
// table (service role, bypasses RLS). Returns null when the token has been
// revoked or never existed — so old links stop working immediately.
async function userIdForToken(supabaseUrl, serviceKey, column, token) {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/share_tokens?${column}=eq.${token}&select=user_id`,
    { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0]?.user_id ?? null;
}

export async function onRequest(context) {
  const token = context.params.token;

  if (!UUID_RE.test(token)) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const supabaseUrl = context.env.VITE_SUPABASE_URL;
  const serviceKey = context.env.SUPABASE_SERVICE_KEY;

  const userId = await userIdForToken(supabaseUrl, serviceKey, "share_token", token);
  if (!userId) {
    return new Response(JSON.stringify({ error: "This share link is no longer active." }), { status: 404, headers: { "Content-Type": "application/json" } });
  }

  const res = await fetch(
    `${supabaseUrl}/rest/v1/applications?user_id=eq.${userId}&select=id,name,programRole,type,status,priority,deadline,city,language,employmentType,workMode&order=deadline.asc`,
    { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
  );

  if (!res.ok) return new Response(JSON.stringify({ error: "Failed" }), { status: 502, headers: { "Content-Type": "application/json" } });
  const apps = await res.json();

  return new Response(JSON.stringify(apps), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache",
    },
  });
}
