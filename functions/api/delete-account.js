export async function onRequest(context) {
  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Authorization, Content-Type" } });
  }

  const authHeader = context.request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });

  const token = authHeader.slice(7);
  const supabaseUrl = context.env.VITE_SUPABASE_URL;
  const serviceKey = context.env.SUPABASE_SERVICE_KEY;

  // Verify the user's JWT to get their ID
  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${token}` },
  });
  if (!userRes.ok) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401, headers: { "Content-Type": "application/json" } });
  const user = await userRes.json();
  const userId = user?.id;
  if (!userId) return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: { "Content-Type": "application/json" } });

  // Delete all applications
  await fetch(`${supabaseUrl}/rest/v1/applications?user_id=eq.${userId}`, {
    method: "DELETE",
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" },
  });

  // Delete auth user
  const deleteRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
    method: "DELETE",
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });

  if (!deleteRes.ok) return new Response(JSON.stringify({ error: "Failed to delete account" }), { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}
