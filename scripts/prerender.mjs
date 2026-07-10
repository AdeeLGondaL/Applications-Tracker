// Build-time prerendering: injects static HTML for the marketing pages into
// the built SPA shell so first paint and crawlers don't depend on JS.
// Runs after `vite build` + `vite build --ssr` (see the "build" npm script).
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { render } = await import(pathToFileURL(resolve(root, "dist-ssr/entry-server.js")));

const template = readFileSync(resolve(root, "dist/index.html"), "utf8");
const ROOT_DIV = '<div id="root"></div>';
if (!template.includes(ROOT_DIV)) {
  throw new Error("prerender: could not find the root div in dist/index.html");
}

const pages = [
  { route: "/", out: "dist/index.html", title: null },
  { route: "/privacy", out: "dist/privacy/index.html", title: "Privacy Policy - Applume" },
  { route: "/terms", out: "dist/terms/index.html", title: "Terms of Service - Applume" },
];

for (const page of pages) {
  const html = await render(page.route);
  if (!html || html.length < 500) {
    throw new Error(`prerender: suspiciously small output for ${page.route} (${html.length} chars)`);
  }
  let out = template.replace(ROOT_DIV, `<div id="root">${html}</div>`);
  if (page.title) {
    out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${page.title}</title>`);
  }
  const target = resolve(root, page.out);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, out);
  console.log(`prerendered ${page.route} -> ${page.out} (${(html.length / 1024).toFixed(1)} kB)`);
}

// The SSR bundle is only needed during this script.
rmSync(resolve(root, "dist-ssr"), { recursive: true, force: true });
