# design-sync notes — Applume

Repo-specific gotchas for syncing this design system. Read before re-syncing.

## What this repo is

- Applume is a **Vite + React 19 + Tailwind v4 app**, not a packaged component library.
  There is no library `dist/` entry and no shipped `.d.ts`, so the converter runs in
  **synth-entry mode** (`--entry ./dist/index.es.js` is a non-existent path on purpose —
  it forces the soft-miss → synthesize-from-`src/` path). Component discovery is the
  content scan over `src/components/**`, which finds **40 exported components** across 26
  files (several files export multiple: Badge.jsx → Badge/Priority/IconButton/Toggle,
  Field.jsx → Field/Input/Textarea/Select/DrawerSection, card.jsx → Card/CardContent,
  PasswordStrength.jsx → PasswordStrength/Info, OptionalPanels.jsx → 4 panels,
  EmptyState.jsx → EmptyState/EmptyDashboard, ApplicationCard.jsx → ApplicationCard/ApplicationGrid).

## Build

- `cfg.buildCmd` is `npm run build`, but the converter does NOT need it — synth-entry reads
  `src/` directly. `dist/assets/index-*.css` IS needed (it's `cfg.cssEntry`, the compiled
  Tailwind stylesheet). If `dist/` is stale/absent, run `npm run build` first, then update
  `cfg.cssEntry` to the new hashed filename (`dist/assets/index-<hash>.css`).
- CSS entry filename is content-hashed by Vite — **on any re-sync after an app rebuild,
  re-point `cfg.cssEntry`** at the current `dist/assets/index-*.css` or validate warns
  `[CSS_IMPORT_MISSING]`.

## Provider + i18n

- Every component that calls `useLanguage()` needs `LanguageProvider` — set as `cfg.provider`.
  The preview emit wraps each card in it automatically.
- `cfg.extraEntries` includes `./src/i18n/index.js` so `LanguageProvider`/`useLanguage`/
  `LANGUAGES` land on `window.Applume`.

## Supabase stub (required)

- `@/lib/supabaseClient` **throws at module load** when `VITE_SUPABASE_*` env vars are
  absent (they always are in the preview bundle), which aborts the whole IIFE before
  `window.Applume` is assigned. `src/utils/ai.js` imports it, and `ApplicationDrawer`
  imports `ai.js`, so the throw reaches the component graph.
- Fixed by mapping `@/lib/supabaseClient` → `.design-sync/stubs/supabaseClient.js` in
  `.design-sync/tsconfig.json` `paths` (the converter's esbuild honors tsconfig paths for
  `@/` imports). The stub is inert and also drops the 196KB `@supabase/supabase-js` dep
  from the bundle. **Keep this mapping** — without it every preview fails at load.

## framer-motion entrance animations → blank captures (IMPORTANT)

- Many components wrap their root in a framer-motion `motion.div` with `initial={{opacity:0}}`
  and an entrance animation (ApplicationCard, Metric, PipelineCard, ProgressCard,
  OnboardingWizard, UpcomingDeadlinesCard, FocusThisWeek, EmptyState, LanguageSwitcher,
  BulkActionBar, InlineStatusPicker, ImportCsvModal, etc.). `package-capture.mjs` screenshots
  right after networkidle — **before the entrance animation completes** — so these cards
  capture BLANK even though the component renders fine.
- Fixed WITHOUT forking the harness: `.design-sync/motion-static.js` sets
  `MotionGlobalConfig.skipAnimations = true` (snaps framer-motion to each animation's final
  keyframe) **gated on `navigator.webdriver`** — true under Playwright, false in a real
  browser. It's added to `cfg.extraEntries` so it's bundled into the SAME IIFE as the
  components (shares their framer-motion instance). Real designs the Claude Design agent
  builds keep their animations; only headless captures render static.
- If a future re-sync sees motion-wrapped previews capturing blank again, confirm
  `.design-sync/motion-static.js` is still in `cfg.extraEntries` and still bundled (check
  the build log's `inlined npm packages` / that framer-motion is in the bundle).

## Grouping

- The converter groups by `src/components/<dir>`: `applications`, `dashboard`, `layout`, and
  **`general`** (for everything in `ui/` — `ui` is a GENERIC_DIR the converter collapses to
  `general`). The `general` bucket is therefore the **UI primitives** (Badge, Button, Card,
  Field, Icon, Input, Select, Textarea, LanguageSwitcher, PasswordStrength, Priority,
  IconButton, Toggle, Info, CardContent, DrawerSection).
- Secondary exports that aren't in a file named after them (ApplicationGrid, EmptyDashboard,
  the 4 OptionalPanels) don't fuzzy-match a src file so they ALSO default to `general`.
- **Do NOT use `componentSrcMap` to fix grouping in synth-entry mode**: pinning names there
  makes the pinned set the ENTIRE component list (synth mode has no `.d.ts` export set to add
  to), collapsing discovery from 40 → the pinned count. Grouping polish would need category
  stubs (which suppress the synthesized `## Examples` in prompt.md) or `@category` JSDoc in
  source — deferred as not worth the trade. `general` = UI primitives is documented, accepted.

## Overlay components (fixed-positioned) — preview wrapper technique

- ApplicationDrawer, ImportCsvModal (`fixed inset-0`) and BulkActionBar (`fixed` bottom bar)
  position against the viewport. In an isolated preview card their fixed root resolved
  against the story's transformed container and collapsed/clipped. Fix: wrap the component
  in a sized, `position: relative` container with `transform: translateZ(0)` — that makes the
  descendant `fixed` element resolve to the wrapper box, so the overlay renders in-card.
  See the `stage` style in those three `.design-sync/previews/*.tsx`. Keep the wrapper size
  <= the component's `cardMode: single` viewport in config.

## Previews / fixtures

- Authored previews live in `.design-sync/previews/<Name>.tsx`, import from `"applume"`
  (shimmed to `window.Applume`). Shared realistic data is `.design-sync/previews/_fixtures.jsx`
  (relative-imported; not a component so discovery ignores it). Deadlines are computed
  relative to render-time `now` so deadline tones stay correct on any re-sync.
- The capture browser's clock may differ from the stated "today" — absolute dates on cards
  are internally consistent with their relative "Nd left" labels regardless.

## Known render warns (triaged as legitimate)

- `[RENDER_THIN] Icon` — the Icon.tsx gallery renders SVG glyphs only (stroke paint, no
  text/background), which the paint heuristic reads as "thin". The icons render fine; benign.
- `[RENDER_THIN] ApplicationDrawer` — the drawer is `fixed inset-0`, so its measured
  in-flow height is 0px even though it renders fully (confirmed in the capture at the
  940x720 card viewport). Benign; it's an overlay component (cardMode single).
- Overlay components rendered via `cardMode: single` with a fixed viewport: ApplicationDrawer,
  ImportCsvModal (both `fixed inset-0`), BulkActionBar (`fixed` bottom bar), KanbanBoard and
  OnboardingWizard (wide). Their contact-sheet thumbnails (default 1200px viewport) can look
  cropped; the per-card viewport in config renders them correctly.
- `Metric` and `Icon` use `cardMode: column` because their multi-cell grid stories are wider
  than a product grid cell ([GRID_OVERFLOW]).

## Re-sync risks

- `cfg.cssEntry` hash rots on every app rebuild (see Build).
- The supabase stub and motion-static gate are load-bearing; both are committed under
  `.design-sync/`. If either is dropped, previews break (blank / IIFE throw).
- Synth-entry discovery yields 40 components from the content scan; a NEW component added to
  `src/components/**` is picked up automatically (do not enumerate in `componentSrcMap`).
- Capture render check uses the system Chrome via `DS_CHROMIUM_PATH` env var (no playwright
  chromium was installed). Set `DS_CHROMIUM_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'`
  before validate/capture, or install playwright chromium.
