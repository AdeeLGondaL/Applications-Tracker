import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './i18n'

const container = document.getElementById('root')
const app = (
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
)

if (container.hasChildNodes()) {
  // Prerendered page (see scripts/prerender.mjs): hydrate the static HTML.
  // The flag lets entrance animations skip re-hiding already-visible content.
  window.__APPLUME_PRERENDERED = true
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
