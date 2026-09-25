# Hyperframes Composition Brief: Applume

## Objective
Create a short launch-style brag video for Applume — a structured tracker for university admissions and job applications.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 24.9s

## Source Material
- Project root: `D:/Web Apps/Applications-Tracker`
- Primary files read: `index.html`, `src/index.css`, `src/pages/LandingPage.jsx`, `src/components/brand/Logo.jsx`, `src/components/applications/KanbanBoard.jsx`, `src/utils/statusTone.js`, `src/utils/constants.js`, `src/utils/ai.js`, `package.json`
- Product name: **Applume**
- Tagline / strongest claim: **"A spreadsheet remembers the row. Applume remembers the application."**
- Key UI moments to recreate:
  1. `SheetCard` — the three-row spreadsheet with `applying?` / `sent` / `todo` and a bare `?` in the Date column.
  2. `RecordCard` — the green-bordered Applume record with the amber deadline pill, the next-action pill and the four-item document checklist.
  3. The paste → AI-autofill → saved flow from the how-it-works section and `src/utils/ai.js`.
  4. `KanbanBoard` — Applying / Submitted / Interview / Accepted columns with the status-coloured left rules.
- Copy that must appear verbatim:
  - `A spreadsheet row`
  - `An Applume record`
  - `A spreadsheet remembers the row.`
  - `Applume remembers the application.`
  - `Deadline 15 Jun · 9 days`
  - `Next: upload transcript`
  - `Curriculum vitae` / `Transcript` / `Motivation letter` / `Portal link saved`
  - `Paste the source`
  - `Every application. One calm place.`
  - `Free to use · Private by default · Export anytime`
  - `applume.app`

## Creative Direction
- Tone preset: **polished**
- Creative direction: *"the calm after the spreadsheet"*
- Interpretation: five scenes, long settled holds, soft handoffs, no hard cuts, no zoom punches, no flashing. Entrances are fast (0.35-0.55s) and then stop moving, so pace reads brisk while type stays readable.
- Angle: the product's own thesis, staged. Open on the mess everyone recognises — a sheet whose Status column says `applying?`, `sent`, `todo` and whose Date column says `?` — then resolve it into structure. The comedy is recognition, not a joke: the viewer has personally typed `todo` into a cell and never gone back. The resolution is calm rather than triumphant, because that is the literal product promise.
- Hook: frame 0 is already the spreadsheet. A soft highlight walks down the Status column, lighting `applying?` … `sent` … `todo`, and the lone `?` pulses. No reading required.
- Outro / punchline: the board recedes, the real logo lockup rises, and **"Every application. One calm place."** lands in Fraunces over the product's own trust line.
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - Unrelated visual redesign
  - Any generic paper-plane glyph — the brand mark is `assets/img/Logo.png`, the real logo, always

## Visual Identity
Exact token values from `src/index.css` `:root` (light theme only).

- Background: `#fbfbf8`; soft surface `#f4f6f2`; card `#ffffff`
- Text: `#15181a` ink, `#0c0e0f` strong, `#5b6560` muted, `#8b938e` soft
- Accent: `#009966`; solid/strong `#007c53`; ink `#04553a`; soft `#e8f6f0`; border `rgba(0,153,102,0.2)`
- Border: `#e6e8e2`; strong `#d2d6cf`
- Warning (deadline): `#b7791f`, soft `#f9f2e2`, ink `#8a5a12`
- Info (submitted / interview): `#3763d8`, soft `#eef2fd`
- Display font: **Fraunces** — shipped locally at `assets/fonts/Fraunces-latin.woff2` with an in-file `@font-face` (Google Fonts latin subset; same family `index.html` loads)
- Body font: **Inter** — shipped locally at `assets/fonts/Inter-latin.woff2`
- Glyph note: the latin subsets do not carry `✓`, `☐` or `→`. Every check, arrow and link icon is **inline SVG**, not a text glyph.
- Visual references from the project: `SheetCard`, `RecordCard`, the circular green arrow badge between them, `KanbanBoard` column rules, the solid-accent button pairing (`--accent-solid` / `--accent-solid-ink`).

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. **The row** — 3.81s (0.00→3.81) — the spreadsheet card, settled at frame 0. Must read: `A spreadsheet row`, and the cells `applying?`, `sent`, `todo`, `?`.
2. **Row becomes record** — 5.14s (3.81→8.95) — sheet lifts, green arrow badge flashes, record card rises. Must read: `An Applume record`, `TU Munich · M.Sc. Computer Science`, `Deadline 15 Jun · 9 days`, `Next: upload transcript`, the four checklist labels. `Transcript` stays **unticked**.
3. **The line** — 4.72s (8.95→13.67) — full-frame Fraunces. Must read both thesis lines, second in accent green.
4. **Paste it in** — 5.37s (13.67→19.04) — the working app: link chip pastes into `Paste the source`, cursor clicks the green button, five values fill themselves in. Must read: `Institution → TU Munich`, `Program → M.Sc. Computer Science`, `City → Munich`, `Deadline → 15 Jun`, `Type → University`.
5. **One calm place** — 5.86s (19.04→24.90) — board fills under Applying / Submitted / Interview / Accepted, then recedes into the logo lockup. Must read: `Every application. One calm place.` and the trust subline.

## Audio
- Audio role: **warm restrained bed** with sparse, motion-matched accents.
- Audio arc: low bed from frame 0; three dry ticks under the spreadsheet sweep; a soft settle and three checkbox ticks on the record; **total silence under Scene 3** so the thesis carries alone; one button click and a quiet cascade on the autofill; four card taps and one dry logo hit at the close; bed fades out under the final hold.
- Music: `assets/music/hitslab-product-launch-advertisement-commercial-music-301409.mp3` — **user-supplied**, 101.33 BPM, 64.9s.
  - *Not a bundled track:* the user supplied this one, so `audio.md`'s tone→track table does not apply. It analyses at 101.33 BPM — slower than any bundled option — which suits `polished`: the whole edit breathes ~13% wider than it did at 114.84 BPM. Restraint comes from gain, fades and SFX density as before.
  - *Lead-in trimmed:* `data-media-start="1.02"` drops the track's intro so video frame 0 sits on its first strong downbeat. Verified by cross-correlating the rendered audio against the source — measured offset 1.020s.
  - *Gain matched:* the track measures **-12.1 LUFS** over the used window against the previous bed's **-14.6 LUFS**, so the lane runs at **0.195** rather than 0.26. Rendered bed measures -28.4 dB mean, within 0.2 dB of the previous cut.
- Music treatment: 0.3s fade-in — deliberately short so the opening downbeat still lands — then a flat bed, fading out 23.8→24.9s so the final frame breathes. Volume is a `data-automation` lane, not a tween. No swells, no risers.
- Music cue guidance: analysed with `analyze_music_cues.py` → `assets/music/hitslab-product-launch.music-cues.{json,md}` (101.33 BPM, beat ≈ 0.592s). Every time below is **video** time, i.e. music time minus the 1.02s trim.
  - Strong-cue locks (4): **3.81s** sheet→record morph · **11.43s** the accent thesis line · **17.15s** the final autofill value, so the form completes on a hit · **21.29s** the green Accepted card, the payoff. Line 1 of the thesis also happens to land on the 9.53s strong cue.
  - Beat-grid windows: status cells 1.27 / 1.91 / 2.53 · checklist rows 5.47 / 6.05 / 6.65 / 7.21 · autofill values 14.87 / 15.48 / 16.04 / 16.59 / 17.15 · board cards 19.58 / 20.13 / 20.71 / 21.29 · outro 21.89 / 22.05 / 22.20 / 22.60.
- Audio-reactive treatment: **subtle**. Per-frame data pre-extracted with the `hyperframes-creative` extractor (30fps, 16 bands), then reduced to a bass envelope over the video's length in `assets/music/audio-data.js`. It is sampled onto one CSS custom property every other frame as zero-duration sets, so it is seek-safe. Bass drives only two things: the record card's green shadow depth in Scene 2, and a ≤2% scale on the closing logo mark. No waveform, no equalizer, no pulsing text.
- Audio-coupled moments:
  - Scene 1, status-column sweep — three dry rollover ticks at 1.27 / 1.91 / 2.53, very quiet
  - Scene 2, record rises — one soft warm settle at the start of the rise
  - Scene 2, checklist — one tick per **ticked** box only (3 of 4); `Transcript` is deliberately silent
  - Scene 3 — **no SFX at all**
  - Scene 4, button press — one UI click on the visible press
  - Scene 4, value cascade — two very quiet accents bookending the five fills, not five hits
  - Scene 5, board — four soft card taps; one dry logo accent as the lockup lands
- SFX selection guidance: match motion, never decorate it. Polished tone → 2-3 subtle families, nothing aggressive, nothing bright or clicky repeated.
- SFX analysis guidance: `<skill-dir>/assets/sfx/sfx-analysis.md`. All picks are **low high-frequency risk**: `ui/rollover2.ogg`, `ui/click2.ogg`, `interface/click_002.ogg`, `interface/bong_001.ogg`, `impact/impactSoft_medium_000.ogg`, `impact/impactSoft_medium_002.ogg`.
- Audio files: copied into `brag-output/composition/assets/music/` and `brag-output/composition/assets/sfx/`.

## Hyperframes Instructions
Built with the current Hyperframes domain skills (`hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, `hyperframes-cli`). This is the `/brag` workflow, not the generic promo / launch-video workflow.

Requirements met by the composition:
- Real project UI, copy and palette in every scene.
- All text held past the reading floor (short label ≥0.8s settled, sentence ≥0.3s/word).
- Duration 24.9s, inside the 15-25s window.
- Music plus six sparse SFX groups; Scene 3 intentionally silent.
- Three strong-cue locks, four beat-grid sequences, each marked in the source.
- Subtle audio-reactive treatment on two non-text elements.
- All assets local and relative; no absolute paths.
- `npx hyperframes check` is the single gate before render.

### Implementation note
Storyboard scenes 1 and 2 are authored as **one** clip (`#sc-stage`, 0→7.91s) holding the sheet card, the arrow badge and the record card in a single centred grid cell, because the row→record morph has to cross over inside one clip window. The four clips (`sc-stage`, `sc-thesis`, `sc-auto`, `sc-outro`) are strictly back to back — no two scenes are ever alive at the same time. Each scene fades its own content out onto the shared off-white ground, which reads as a soft dip transition and keeps the WCAG contrast pass clean (overlapping scenes were measuring half-opacity text against half-opacity panels).

The composition is monolithic rather than split into sub-compositions. `lint` prefers sub-compositions for Studio timeline ergonomics and reports that as a warning; at four clips the single file stays readable and avoids mount risk. Split it if the project grows.
