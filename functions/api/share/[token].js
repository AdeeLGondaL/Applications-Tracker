const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function onRequest(context) {
  const token = context.params.token;

  if (!UUID_RE.test(token)) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const supabaseUrl = context.env.VITE_SUPABASE_URL;
  const serviceKey = context.env.SUPABASE_SERVICE_KEY;

  const res = await fetch(
    `${supabaseUrl}/rest/v1/applications?user_id=eq.${token}&select=id,name,programRole,type,status,priority,deadline,city,language,employmentType,workMode&order=deadline.asc`,
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
