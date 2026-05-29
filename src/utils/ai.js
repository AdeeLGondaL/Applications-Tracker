export function parsePageMeta(html, sourceUrl) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const getMeta = (p) =>
    doc.querySelector(`meta[property="${p}"]`)?.getAttribute("content") ||
    doc.querySelector(`meta[name="${p}"]`)?.getAttribute("content") || "";
  const result = {};

  const urlLower = (sourceUrl || "").toLowerCase();
  const looksLikeUni = /\buni\b|universit|hochschul|college|\.edu\b|ac\.(uk|at|de|nz|au)/.test(urlLower);
  const getDomain = () => { try { return new URL(sourceUrl).hostname.replace(/^www\./, ""); } catch { return ""; } };
  const isInstitution = (s) => /uni|universit|hochschul|college|gmbh|ag\b|inc\b|ltd\b|corp\b/i.test(s);

  for (const script of doc.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const raw = JSON.parse(script.textContent);
      const items = Array.isArray(raw) ? raw : raw["@graph"] ? raw["@graph"] : [raw];
      const job = items.find((i) => i["@type"] === "JobPosting");
      const course = items.find((i) => ["Course", "EducationalOccupationalProgram"].includes(i["@type"]));

      if (job) {
        result.type = "Job";
        result.name = job.hiringOrganization?.name || getMeta("og:site_name") || "";
        result.programRole = job.title || job.name || "";
        const loc = Array.isArray(job.jobLocation) ? job.jobLocation[0] : job.jobLocation;
        if (loc?.address) result.city = loc.address.addressLocality || "";
        if (job.validThrough) result.deadline = job.validThrough.slice(0, 10);
        if (job.datePosted) result.openingDate = job.datePosted.slice(0, 10);
        if (job.employmentType) {
          const et = String(job.employmentType).toUpperCase();
          if (et.includes("FULL")) result.employmentType = "Full-time";
          else if (et.includes("PART")) result.employmentType = "Part-time";
          else if (et.includes("INTERN")) result.employmentType = "Internship";
          else if (et.includes("TEMP") || et.includes("CONTRACT")) result.employmentType = "Freelance / Contract";
        }
        if (job.jobLocationType === "TELECOMMUTE") result.workMode = "Remote";
        if (job.description) result.notes = job.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300);
        break;
      }
      if (course) {
        result.type = "University";
        result.programRole = course.name || "";
        const provider = Array.isArray(course.provider) ? course.provider[0] : course.provider;
        result.name = provider?.name || getMeta("og:site_name") || "";
        const lang = Array.isArray(course.inLanguage) ? course.inLanguage[0] : course.inLanguage;
        if (lang) result.language = String(lang).startsWith("en") ? "English" : String(lang).startsWith("de") ? "German" : "";
        break;
      }
    } catch {}
  }

  if (!result.name) {
    const ogTitle = getMeta("og:title") || doc.title || "";
    const siteName = getMeta("og:site_name") || "";
    const atMatch = ogTitle.match(/^(.+?)\s+(?:at|@|bei)\s+(.+)$/i);
    const pipeMatch = ogTitle.match(/^(.+?)\s*[|–\-]\s*(.+)$/);
    if (atMatch) {
      result.programRole = atMatch[1].trim();
      result.name = atMatch[2].trim();
    } else if (pipeMatch) {
      const [left, right] = [pipeMatch[1].trim(), pipeMatch[2].trim()];
      if (isInstitution(right) && !isInstitution(left)) { result.programRole = left; result.name = right; }
      else if (isInstitution(left) && !isInstitution(right)) { result.programRole = right; result.name = left; }
      else if (siteName) { result.programRole = left; result.name = siteName; }
      else { result.programRole = left; result.name = right; }
    } else if (siteName) {
      result.name = siteName;
      if (ogTitle && ogTitle !== siteName) result.programRole = ogTitle;
    } else {
      result.name = getDomain();
      result.programRole = ogTitle;
    }
  }

  if (!result.type) result.type = looksLikeUni ? "University" : "Job";
  if (!result.notes) { const d = getMeta("og:description") || getMeta("description"); if (d) result.notes = d.slice(0, 300); }
  if (!result.link) result.link = getMeta("og:url") || sourceUrl || "";
  return result;
}

export async function callGeminiExtract(input) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error("Add VITE_GROQ_API_KEY to your .env to enable AI extraction.");

  const isUrl = /^https?:\/\//i.test(input.trim());
  let content = input.trim();

  if (isUrl) {
    const proxies = [
      (u) => fetch(`https://corsproxy.io/?url=${encodeURIComponent(u)}`).then(async (r) => { if (!r.ok) throw new Error(r.status); return r.text(); }),
      (u) => fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(u)}`).then(async (r) => { if (!r.ok) throw new Error(r.status); const d = await r.json(); if (!d.contents) throw new Error("empty"); return d.contents; }),
    ];
    let html = null;
    for (const proxy of proxies) {
      try { html = await Promise.race([proxy(input.trim()), new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 12000))]); break; } catch {}
    }
    if (!html) throw new Error("This page blocked automated access. Copy the text from the page and paste it here instead.");
    const text = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    content = `Source URL: ${input.trim()}\n\n${text}`;
  }

  const prompt = `Extract application details from the content below. Return ONLY a valid JSON object with exactly these fields (use "" for any not found):

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

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", "authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
    }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || `API error ${res.status}`); }
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || "";
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Could not parse AI response.");
  return JSON.parse(match[0]);
}
