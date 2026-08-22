const RATE_LIMIT_MAX = 10; // requests per window per user
const RATE_LIMIT_WINDOW_S = 300;
const DEFAULT_GROQ_MODEL = "openai/gpt-oss-120b"; // override with GROQ_MODEL env var
const MAX_INPUT_CHARS = 20000;
const MAX_PAGE_BYTES = 500 * 1024;
const FETCH_TIMEOUT_MS = 15000;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

function isBlockedHost(hostname) {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".local") || h.endsWith(".internal")) return true;
  if (h.includes(":")) return true; // IPv6 literals
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    return a === 0 || a === 10 || a === 127 || a === 169 && b === 254 || a === 172 && b >= 16 && b <= 31 || a === 192 && b === 168;
  }
  return false;
}

async function checkRateLimit(env, userId) {
  const kv = env.AI_RATE_LIMIT;
  if (!kv) return { allowed: true }; // KV binding not configured; skip limiting
  const key = `ai:${userId}`;
  const now = Math.floor(Date.now() / 1000);
  const stored = await kv.get(key, "json");
  const entry = stored && stored.reset > now ? stored : { count: 0, reset: now + RATE_LIMIT_WINDOW_S };
  if (entry.count >= RATE_LIMIT_MAX) return { allowed: false, retryAfter: entry.reset - now };
  entry.count += 1;
  await kv.put(key, JSON.stringify(entry), { expirationTtl: RATE_LIMIT_WINDOW_S + 60 });
  return { allowed: true };
}

async function fetchPageText(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("invalid_url");
  }
  if (!/^https?:$/.test(parsed.protocol) || isBlockedHost(parsed.hostname)) throw new Error("invalid_url");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(parsed.href, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });
  } catch (err) {
    throw new Error(err.name === "AbortError" ? "fetch_timeout" : "fetch_failed", { cause: err });
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) throw new Error("fetch_failed");
  const html = (await res.text()).slice(0, MAX_PAGE_BYTES);
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildPrompt(content) {
  return `Extract application details from the content below. Return ONLY a valid JSON object with exactly these fields (use "" for any not found):

{
  "type": "University" or "Job",
  "name": "university or company name",
  "programRole": "degree program or job title",
  "city": "city or location",
  "deadline": "YYYY-MM-DD or empty string",
  "openingDate": "YYYY-MM-DD or empty string",
  "applicationType": "application platform or method",
  "employmentType": "Full-time" | "Part-time" | "Internship" | "Working Student" | "Freelance / Contract" | "",
  "workMode": "Remote" | "Hybrid" | "Onsite" | "",
  "language": "English" | "German" | "English & German" | "",
  "documents": "comma-separated required documents",
  "link": "direct application URL if present",
  "notes": "key requirements, max 200 characters"
}

Content:
${content.slice(0, 8000)}`;
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Headers": "Authorization, Content-Type" } });
  }
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

  const supabaseUrl = env.VITE_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_KEY;
  const groqKey = env.GROQ_API_KEY;
  if (!supabaseUrl || !serviceKey || !groqKey) return json({ error: "Service not configured" }, 503);

  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: serviceKey, Authorization: authHeader },
  });
  if (!userRes.ok) return json({ error: "Unauthorized" }, 401);
  const user = await userRes.json();
  if (!user?.id) return json({ error: "Unauthorized" }, 401);

  const limit = await checkRateLimit(env, user.id);
  if (!limit.allowed) return json({ error: "rate_limited", retryAfter: limit.retryAfter }, 429);

  let input;
  try {
    input = (await request.json())?.input;
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }
  if (typeof input !== "string" || !input.trim()) return json({ error: "Invalid request body" }, 400);
  input = input.trim().slice(0, MAX_INPUT_CHARS);

  let content = input;
  if (/^https?:\/\//i.test(input)) {
    try {
      content = `Source URL: ${input}\n\n${await fetchPageText(input)}`;
    } catch (err) {
      return json({ error: err.message }, 422);
    }
  }

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${groqKey}` },
    body: JSON.stringify({
      model: env.GROQ_MODEL || DEFAULT_GROQ_MODEL,
      messages: [{ role: "user", content: buildPrompt(content) }],
      max_tokens: 1024,
    }),
  });
  if (!groqRes.ok) return json({ error: "ai_failed" }, 502);

  const data = await groqRes.json();
  const raw = data.choices?.[0]?.message?.content || "";
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return json({ error: "ai_failed" }, 502);

  try {
    return json({ fields: JSON.parse(match[0]) });
  } catch {
    return json({ error: "ai_failed" }, 502);
  }
}
