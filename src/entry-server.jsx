import { StrictMode } from "react";
import { prerender } from "react-dom/static";
import { Router } from "wouter";
import App from "@/App";
import { LanguageProvider } from "@/i18n";

async function streamToString(stream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let html = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    html += decoder.decode(value, { stream: true });
  }
  return html + decoder.decode();
}

// Build-time static rendering (scripts/prerender.mjs). `prerender` waits for
// Suspense/lazy to resolve, so lazy routes like /privacy render fully.
export async function render(path) {
  const { prelude } = await prerender(
    <StrictMode>
      <LanguageProvider>
        <Router ssrPath={path}>
          <App />
        </Router>
      </LanguageProvider>
    </StrictMode>
  );
  return streamToString(prelude);
}
