# Hyperframes Composition Brief: Applume

## Objective
Create a short launch-style brag video for Applume — a structured tracker for university admissions and job applications — in the shape of an agency SaaS demo film.

## Output
- Composition directory: `brag-output-2026-09-21-170952/composition/`
- Rendered video: `brag-output-2026-09-21-170952/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 24.90s

## Source Material
- Project root: `D:/Web Apps/Applications-Tracker`
- Primary files read: `index.html`, `src/index.css`, `src/pages/LandingPage.jsx`, `src/components/dashboard/FocusThisWeek.jsx`, `src/components/dashboard/DashboardOverview.jsx`, `src/components/dashboard/UpcomingDeadlinesCard.jsx`, `src/components/applications/KanbanBoard.jsx`, `src/components/brand/Logo.jsx`, `src/utils/statusTone.js`, `src/utils/constants.js`, `package.json`
- Product name: **Applume**
- Tagline / strongest claim: **"Every application. One calm place."** (the real h1)
- Reference the user supplied: Zelios' fintech SaaS demo film for IbanFirst (0:47). The beats being borrowed, in order: floating product surfaces at depth on a glowing dark stage → kinetic type whose last word lands in a different colour → brand lockup with a glowing capsule badge → real product screens with push-ins and a working cursor → **one control spotlit out of a dimmed UI** → a flip out of the dark into light for the final logo and URL.
- Key UI moments to recreate:
  1. `KanbanBoard` cards (`KanbanCard`) — type chip, priority dot, name, program/role, deadline pill, coloured left rule.
  2. `FocusThisWeek` — eyebrow `TODAY FOCUS`, heading `Action queue`, the `Review queue` button, and the four `FocusTile`s with their icon chip, uppercase action label, big tabular number and label.
  3. The how-it-works paste flow (`Paste the source` → `We draft the details` → `You review and save`) as a working panel with a cursor.
  4. The `KanbanBoard` column layout — `Applying / Submitted / Interview / Accepted` with `COLUMN_BORDER` left rules.
  5. The `Logo` lockup — real mark plus `App` + accent `lume` wordmark, with the light/dark image swap the component performs.
- Copy that must appear verbatim:
  - `Tired of filling spreadsheets for every application?`
  - `University + Job applications`
  - `TODAY FOCUS` / `Action queue`
  - `Deadlines, interviews, and setup gaps that need you.`
  - `Overdue` / `Due in 7 days` / `Interviews` / `Missing docs`
  - `Review` / `Open` / `Filter` / `Fix` (the tiles' action labels)
  - `Review queue`
  - `Paste the source`
  - `Institution` / `Program` / `City` / `Deadline` / `Type`
  - `TU Munich` / `M.Sc. Computer Science` / `Munich` / `15 Jun` / `University`
  - `Add application`
  - `Saved`
  - `Applying` / `Submitted` / `Interview` / `Accepted`
  - `Every application. One calm place.`
  - `applume.app`

## Creative Direction
- Tone preset: **app-store**
- Creative direction: *"agency SaaS demo film — glowing dark stage, floating product surfaces, one thing at a time, resolving into light."*
- Interpretation: six scenes, feature-forward, clean slides and smooth wipes, no hard cuts. Entrances are quick (0.35–0.6s) then stop dead so type stays readable; the camera does slow push-ins, never zoom punches. Energy comes from depth, glow and rhythm rather than speed.
- Angle: the reference film, rebuilt out of Applume's own material. The adaptation that earns it: **Applume already ships a dark theme** (`src/index.css` `.dark` — `#0e100f` ground, `#171b19` cards, `#17b083` accent), so the glowing dark stage is the product's real second skin rather than a borrowed costume. Scenes 1–5 run in that dark theme; on the 21.29s strong cue the whole stage **flips to the light theme** (`#fbfbf8` + `#009966`) for the payoff and CTA — the reference's dark→light arc, performed with two themes the product genuinely has.
- Hook: **pain first, in the audience's own words.** Four real application cards drift in at depth, blurred and dim, then a question wipes in word by word across them over two balanced lines — `Tired of filling spreadsheets for every application?` — with `spreadsheets` landing muted grey instead of white and staying dimmer. No declarative "deserves better than" framing anywhere in the opening; the video asks the viewer's own question and then spends the next twenty seconds answering it.
- Outro / punchline: the stage washes to warm off-white, the real h1 lands in Fraunces with `calm` in accent green, then the logo lockup and a solid green `applume.app` capsule. Nothing else.
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals — no particles, no floating geometry, no stock motion graphics
  - Unrelated visual redesign — every surface must be traceable to a real component
  - Any generic paper-plane glyph. The brand mark is the real image: `assets/img/logo-dark.png` on the dark stage, `assets/img/Logo.png` on the light payoff.

## Visual Identity
Exact token values from `src/index.css`. Two sets, both real.

**Dark stage (scenes 1–5), the `.dark` block**
- Background `#0e100f`; alt `#161a18`; soft `#1a1f1d`; card `#171b19`
- Accent `#17b083`; strong `#23c091`; ink `#9fe4cd`; bright `#2fd39c`; soft `rgba(23,176,131,0.14)`; border `rgba(23,176,131,0.28)`
- Text `#eaece9` ink, `#f5f7f4` strong, `#99a09a` muted, `#6d746f` soft
- Border `#262b28`; subtle `#21251f`; strong `#343a35`
- Accent-solid pairing on dark: fill `#17b083`, ink `#06231a`
- Glow wall: a wide, very low-alpha `#17b083` radial behind everything — the dark-theme equivalent of the reference's violet wall

**Light payoff (scene 6), the `:root` block**
- Background `#fbfbf8`; card `#ffffff`
- Accent `#009966`; accent-solid `#007c53` with `#ffffff` ink
- Text `#15181a` ink, `#0c0e0f` strong, `#5b6560` muted, `#8b938e` soft
- Border `#e6e8e2`

**Shared**
- Status: warning `#b7791f` / soft `#f9f2e2` / ink `#8a5a12`; info `#3763d8` / soft `#eef2fd`; danger `#c8394f` / soft `#fcf0f1`. On the dark stage these are used as low-alpha tints of the same hues.
- Radii from the token scale: `6 / 9 / 12 / 16 / 22`px
- Display font: **Fraunces** — shipped locally at `assets/fonts/Fraunces-latin.woff2` with an in-file `@font-face` (latin subset of the same Google family `index.html` loads)
- Body font: **Inter** — shipped locally at `assets/fonts/Inter-latin.woff2`
- Glyph note: the latin subsets carry no `✓`, `☐`, `→` or box-drawing glyphs. Every check, calendar, link, university and job icon is **inline SVG**.
- Visual references from the project: `KanbanCard`, `FocusTile`, `FocusThisWeek`'s corner accent wash, `COLUMN_BORDER`, `DEADLINE_TONE_CLASS`, `PRIORITY_COLOR`, the `--accent-solid` / `--accent-solid-ink` button pairing, `Logo`.

## Storyboard
Use the storyboard in `brag-output-2026-09-21-170952/brag-plan.md` as the creative contract.

Scene summary:
1. **The grind** — 4.92s (0.00→4.92) — four blurred application cards drift in at depth on the glow wall; the pain question wipes in word by word over two lines. Must read: `Tired of filling spreadsheets for every application?` with `spreadsheets` muted.
2. **The lockup (the answer)** — 2.29s (4.92→7.21) — real dark logo mark + `App`/`lume` wordmark + glowing capsule answering *which* applications. Must read: `University + Job applications`.
3. **What needs you this week** — 5.30s (7.21→12.51) — the `FocusThisWeek` card; four tiles land on consecutive beats with count-ups; then the card dims and `Review queue` lifts out spotlit. Must read: `TODAY FOCUS`, `Action queue`, the four tile labels and numbers, `Review queue`.
4. **Paste it, and it's drafted** — 5.25s (12.51→17.76) — link chip drops into `Paste the source`, cursor presses `Add application`, five values fill on consecutive beats, `Saved` chip lands. Must read: the five field labels and their five values.
5. **Everything, at once** — 3.53s (17.76→21.29) — the board; four cards land into `Applying / Submitted / Interview / Accepted`, the last green under Accepted.
6. **One calm place** — 3.61s (21.29→24.90) — the stage washes dark→light; the h1 lands with `calm` in `#009966`; logo lockup and the `applume.app` capsule follow. Must read: `Every application. One calm place.`, `applume.app`.

## Audio
- Audio role: **present, rhythmic bed with clean UI accents.** This is a demo reel, so the music carries more of the edit than a quiet product film would and the cuts sit on the pulse.
- Audio arc: full-strength bed from frame 0; soft passes as the cards drift; a low dry hit as the headline completes; a warm announce on the lockup; four tile taps; a swell as the button lifts out spotlit; a chip drop, a click, five quiet field settles and a confirm tone on `Saved`; four card taps on the board; a transition swell on the light flip and one dry logo hit; bed fades out under the final lockup.
- Music: `assets/music/hitslab-product-launch-advertisement-commercial-music-301409.mp3` — **user-supplied**, 101.33 BPM, 64.86s.
  - *Not a bundled track:* the tone→track table in `audio.md` does not apply.
  - *Lead-in trimmed:* `data-media-start="1.02"` so video frame 0 sits on the track's first strong downbeat. This offset was measured by cross-correlation in a previous run on this project and verified at 1.020s.
  - *Gain:* **0.23**, a touch hotter than the previous cut's 0.195, because this edit has no silent passages and the bed is meant to be felt. Volume is a `data-automation` lane, not a tween.
- Music treatment: 0.3s fade-in (short, so the opening downbeat still lands), flat through the body, fade out 23.8 → 24.90 so the final lockup breathes.
- Music cue guidance: `assets/music/hitslab-product-launch.music-cues.{json,md}` (analysed previously with `analyze_music_cues.py`; 101.33 BPM, beat ≈ 0.592s). **Every timestamp below is video time = music time − 1.02s.**
  - Strong-cue locks (3): **3.81s** the headline completes and the cards dim back · **17.15s** the `Saved` chip lands on the drafted record · **21.29s** the dark→light flip. A fourth, **13.67s**, is used for the link chip drop because it falls naturally on the scene's first beat.
  - Beat-grid windows: floating cards 0.63 / 1.27 / 1.91 / 2.53 · focus tiles 8.36 / 8.95 / 9.53 / 10.15 · autofill values 14.27 / 14.87 / 15.48 / 16.04 / 16.59 · board cards 18.37 / 19.04 / 19.58 / 20.13 · outro 22.46 / 23.01.
  - Readability rule: the tile set and the autofill set each arrive fast on consecutive beats and then **hold complete** — 2.36s and 1.17s respectively. No line of text is ever pulled off screen on a beat.
- Audio-reactive treatment: **subtle**. Per-frame data was pre-extracted for this exact track and trim (30fps, bass envelope) and ships at `assets/music/audio-data.js`. Sample it onto one CSS custom property every other frame as zero-duration `tl.set` calls so it stays seek-safe. Bass drives exactly two things: the glow wall's intensity across scenes 1–5, and a ≤2% scale on the closing logo mark. No waveform, no equalizer, no pulsing text.
- Audio-coupled moments:
  - Scene 1, cards drifting — four very quiet warm passes at 0.63 / 1.27 / 1.91 / 2.53
  - Scene 1, headline completes — one low dry hit at 1.91
  - Scene 2, lockup — one warm announce at 4.33; a soft accent as the badge glows at 4.90
  - Scene 3, card rises — one soft settle at 7.21
  - Scene 3, tiles — four clean taps at 8.36 / 8.95 / 9.53 / 10.15
  - Scene 3, button spotlight — one low swell at 11.43
  - Scene 4 — chip drop at 13.67, one UI click on the visible press at 14.0, five very quiet settles on the value fills, one confirm tone at 17.15
  - Scene 5, board — four soft card taps at 18.37 / 19.04 / 19.58 / 20.13
  - Scene 6 — one transition swell on the wash at 21.29; one dry logo hit at 22.46. Nothing after.
- SFX selection guidance: match motion, never decorate it. app-store tone → clean, warm, low high-frequency risk; nothing hissy repeated.
- SFX analysis guidance: `<skill-dir>/assets/sfx/sfx-analysis.md`. Files already copied into `assets/sfx/`, all from the low-risk picks except one single-use success tone:
  - `impact/impactSoft_medium_000.ogg` — card drifts, chip drop, board card taps
  - `impact/impactSoft_medium_001.ogg` — lockup announce
  - `impact/impactSoft_medium_003.ogg` — the Action queue card rising
  - `impact/impactSoft_heavy_001.ogg` — the light-flip swell
  - `impact/impactSoft_heavy_002.ogg` — the headline hit
  - `impact/impactSoft_heavy_003.ogg` — the button-spotlight swell
  - `impact/impactBell_heavy_000.ogg` — the `Saved` confirm (used exactly once)
  - `interface/bong_001.ogg` — badge accent, logo hit
  - `interface/click_002.ogg` — the button press
  - `ui/click2.ogg` — tile taps
  - `ui/rollover2.ogg` — field settles
- Exact SFX choice: Hyperframes owns final filenames, timestamps, density and volume against the implemented animation.
- Audio files: already copied into `brag-output-2026-09-21-170952/composition/assets/music/` and `.../assets/sfx/`.

## Hyperframes Instructions
Build with the current Hyperframes domain skills (`hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, `hyperframes-cli`). This is the `/brag` workflow, not the generic promo / launch-video workflow.

Requirements:
- Real project UI, copy and palette in every scene; scenes 3, 4 and 5 are the working app.
- All text held past the reading floor (short label ≥0.8s settled; sentence ≥0.3s/word). The two sequential sets arrive on consecutive beats and then hold complete.
- Duration exactly 24.90s, inside the 15–25s window.
- Music at 0.23 via a `data-automation` volume lane, plus roughly eight motion-matched SFX groups.
- Three strong-cue locks and five beat-grid sequences, each marked in the source with `// beat-locked:` / `// beat-grid:`.
- One subtle audio-reactive property with two non-text consumers.
- All assets local and relative; no absolute paths, no network fonts.
- `npx hyperframes check` is the single gate before render.

### Implementation notes
- **Scene 6's theme flip** is the one place two scenes must be alive at once: the light wash has to cross-dissolve over the receding board. Author the wash as a full-bleed element inside the scene-6 clip that starts at 21.29 and covers the frame by ~21.74, and let scene 5's board fade up and out through it. Everywhere else, clips are strictly back to back and each fades its own content out onto the shared ground, which reads as a soft dip and keeps the contrast audit clean.
- **Known trap on this project** (learned the hard way on the previous cut): `hyperframes preview` and `check` rewrite `index.html` in place — they stamp `data-hf-id` on every element and re-serialise the browser's normalised DOM back to disk. Run `npx hyperframes preview --stop` before any scripted edit, match on ids rather than on full tag text, and after any structural edit **parse the HTML and assert every scene clip and every `<audio>` is a direct child of the composition root**. `check` passes on broken nesting, so it does not prove the tree is right.
- Keep the composition monolithic: six clips in one file stays readable. `lint` prefers sub-compositions for Studio ergonomics and will warn; that is acceptable at this size.
