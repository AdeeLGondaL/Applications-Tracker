// Admin-only feedback management. Resolving/deleting feedback must go through
// the service key (RLS blocks the anon key from updating other users' rows),
// and the admin identity is verified server-side here — the client-side email
// gate in the UI is convenience, not the security boundary.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const INT_RE = /^\d+$/;
const DEFAULT_ADMIN_EMAIL = "ahmedadeel783@gmail.com";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
    });
  }
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);
  const token = authHeader.slice(7);

  const supabaseUrl = env.VITE_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_KEY;
  const adminEmail = (env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).toLowerCase();
  if (!supabaseUrl || !serviceKey) return json({ error: "Server misconfigured" }, 500);

  // Verify the caller and confirm they are the admin.
  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${token}` },
  });
  if (!userRes.ok) return json({ error: "Invalid token" }, 401);
  const user = await userRes.json();
  if ((user?.email || "").toLowerCase() !== adminEmail) return json({ error: "Forbidden" }, 403);

  let body;
  try { body = await request.json(); } catch { return json({ error: "Bad request" }, 400); }
  const { id, action } = body || {};
  if (id === undefined || id === null || !(UUID_RE.test(String(id)) || INT_RE.test(String(id)))) {
    return json({ error: "Invalid id" }, 400);
  }

  const base = `${supabaseUrl}/rest/v1/feedback?id=eq.${encodeURIComponent(String(id))}`;
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };

  let res;
  if (action === "delete") {
    res = await fetch(base, { method: "DELETE", headers });
  } else if (action === "resolve" || action === "reopen") {
    res = await fetch(base, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ resolved: action === "resolve" }),
    });
  } else {
    return json({ error: "Invalid action" }, 400);
  }

  if (!res.ok) return json({ error: "Update failed" }, 502);
  const rows = await res.json().catch(() => []);
  if (!Array.isArray(rows) || rows.length === 0) return json({ error: "Not found" }, 404);

  return json({ success: true });
}
