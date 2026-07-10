import { supabase } from "@/lib/supabaseClient";

const ERROR_MESSAGES = {
  invalid_url: "That link doesn't look reachable. Try pasting the text instead.",
  fetch_timeout: "The page took too long to load. Try pasting the text instead.",
  fetch_failed: "Could not fetch the page. Try pasting the text instead.",
  rate_limited: "You've used AI autofill a lot in the last few minutes. Please wait a bit and try again.",
  ai_failed: "AI extraction didn't work this time. Please try again or fill the fields manually.",
};

export async function callAiExtract(input) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Please sign in again to use AI autofill.");

  const res = await fetch("/api/ai-extract", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({ input: input.trim() }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    if (res.status === 401) throw new Error("Please sign in again to use AI autofill.");
    throw new Error(ERROR_MESSAGES[body.error] || ERROR_MESSAGES.ai_failed);
  }

  const { fields } = await res.json();
  return fields;
}
