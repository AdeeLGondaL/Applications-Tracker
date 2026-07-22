import { supabase } from "@/lib/supabaseClient";

// Revocable public-access tokens. Instead of exposing the raw (permanent) user
// id in share/calendar links, each user has a row in `share_tokens` holding a
// random token per link type. Copying a link mints a token if none exists;
// revoking sets it to null so the old link stops resolving immediately.
//
// Requires the Phase 5.5 migration (see REDESIGN_PLAN.md):
//   create table public.share_tokens (
//     user_id uuid primary key references auth.users(id) on delete cascade,
//     share_token uuid unique, calendar_token uuid unique,
//     updated_at timestamptz not null default now()
//   );
//   alter table public.share_tokens enable row level security;
//   create policy "own share tokens" on public.share_tokens for all to authenticated
//     using (auth.uid() = user_id) with check (auth.uid() = user_id);

const COLUMN = { share: "share_token", calendar: "calendar_token" };

function newToken() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  // Fallback (older browsers): RFC4122-ish v4.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// Reads the current tokens for the signed-in user. Returns { share, calendar }
// (null when a link is not currently active). `unavailable: true` signals the
// table doesn't exist yet (migration not run) so the UI can explain that.
export async function loadShareTokens(userId) {
  if (!userId) return { share: null, calendar: null };
  const { data, error } = await supabase
    .from("share_tokens")
    .select("share_token, calendar_token")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    const missingTable = /relation .*share_tokens.* does not exist/i.test(error.message) || error.code === "42P01";
    return { share: null, calendar: null, unavailable: missingTable, error: error.message };
  }
  return { share: data?.share_token ?? null, calendar: data?.calendar_token ?? null };
}

// Ensures a token exists for `which` link type, minting one if needed.
// Returns { token } or { error } / { unavailable }.
export async function ensureShareToken(userId, which) {
  const column = COLUMN[which];
  if (!userId || !column) return { error: "Not signed in." };
  const current = await loadShareTokens(userId);
  if (current.unavailable) return current;
  if (current[which]) return { token: current[which] };

  const token = newToken();
  const { error } = await supabase
    .from("share_tokens")
    .upsert({ user_id: userId, [column]: token, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (error) {
    const missingTable = /relation .*share_tokens.* does not exist/i.test(error.message) || error.code === "42P01";
    return { error: error.message, unavailable: missingTable };
  }
  return { token };
}

// Rotates the token (new link, old one dies) or revokes it (token = null).
export async function setShareToken(userId, which, token) {
  const column = COLUMN[which];
  if (!userId || !column) return { error: "Not signed in." };
  const { error } = await supabase
    .from("share_tokens")
    .upsert({ user_id: userId, [column]: token, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (error) return { error: error.message };
  return { token };
}

export function rotateShareToken(userId, which) {
  return setShareToken(userId, which, newToken());
}

export function revokeShareToken(userId, which) {
  return setShareToken(userId, which, null);
}
