# Brag Plan: Applume

## What is this app?
Applume is a structured tracker for university admissions and job applications — deadlines, documents, notes, links and next steps living on the application they belong to, instead of rotting in a spreadsheet nobody updates.

## The angle
The product's own thesis is already the best line it has: **"A spreadsheet remembers the row. Applume remembers the application."** The video is that sentence, staged.

Open on the mess everybody recognises — a three-row sheet whose Status column says `applying?`, `sent`, `todo` and whose Date column says `?`. Then resolve it. No jokes bolted on: the comedy is that the viewer has personally written `todo` in a cell and never gone back. The resolution is calm, not triumphant — which is the actual product promise ("One calm place").

Specific to Applume because every frame is built from the repo's own copy, demo records, palette and type. Nothing here would fit another product.

## Hook (first 2-3 seconds)
Frame 0 is already the spreadsheet — no build-on, no title card. A soft highlight walks down the Status column and the three vague cells light up in sequence: `applying?` … `sent` … `todo`. Then the lone `?` in the Date column pulses once. Zero reading effort, instant recognition, and the `?` is the punchline of the hook.

## Key moments (the middle)
- The sheet card lifting away and the Applume record card rising into its place — the landing page's scroll-scrubbed morph, played as an edit.
- Four document checkboxes ticking one at a time on the record: Curriculum vitae, Transcript, Motivation letter, Portal link saved — with `Transcript` deliberately left unticked, because that is the whole point of a checklist.
- The paste → autofill → saved beat: a link chip drops into "Paste the source", the green button is clicked, and five fields fill themselves in one by one (Institution, Program, City, Deadline, Type).
- The board settling — cards landing under Applying / Submitted / Interview / Accepted, so you see the whole search at once.

## Outro / punchline
The board softly recedes, the real Applume logo lockup rises, and the h1 lands in Fraunces: **"Every application. One calm place."** Subline in the product's own trust copy: *Free to use · Private by default · Export anytime*. One dry, quiet logo hit. Nothing shouts.

## User flow worth showing
Pulled from `src/pages/LandingPage.jsx` (how-it-works), `src/utils/ai.js` (AI autofill) and `src/components/applications/KanbanBoard.jsx`:

1. **Entry** — paste the source (a university or job posting link, or text you already have).
2. **Key action** — Applume drafts the details; you review and save. Fields fill themselves in.
3. **Result** — a record that carries its deadline, its document checklist and its single next action, sitting on a board with everything else.

Scenes 4 and 5 are the centrepiece and both are the working app. Scenes 1-3 are the thesis that earns them.

## Tone
- Preset: **polished**
- Creative direction: *"the calm after the spreadsheet"* — a quiet premium product film that opens on the mess and resolves into order.
- Interpretation: Five scenes, long settled holds, soft crossfades and slides, no hard cuts, no zoom punches, no flashing. Every entrance is fast (0.35-0.55s) and then stops moving, so the pace reads brisk while the type stays readable. Applume's own voice is editorial and restrained — Fraunces serif, warm off-white, exactly one green. A chaotic edit would contradict the product it is selling.

## Format: landscape — 1920x1080
## Duration: 24.9s

## Visual identity (from the project)
Straight from `src/index.css` `:root` (light theme only — the warm off-white is the brand's calm).

- Background: `#fbfbf8` (`--surface`), section alt `#f3f4ef`, card `#ffffff`
- Accent: `#009966` (`--applume-accent`); strong/solid `#007c53`; ink `#04553a`; soft `#e8f6f0`; border `rgba(0,153,102,0.2)`
- Text: `#15181a` (ink), `#0c0e0f` (strong), `#5b6560` (muted), `#8b938e` (soft)
- Border: `#e6e8e2`; strong `#d2d6cf`
- Deadline/warning: `#b7791f` on `#f9f2e2`, ink `#8a5a12`
- Info: `#3763d8` on `#eef2fd`
- Display font: **Fraunces** (Google Fonts, opsz 9..144, wght 400..600)
- Body font: **Inter** (400/500/600/700)
- Strongest visual element: the spreadsheet-card → record-card morph in `SpreadsheetMorph` (`src/pages/LandingPage.jsx`), plus the record's amber deadline pill and green checkbox list.
- Brand mark: the **real logo** at `public/Logo.png` (paper-plane + handshake), wordmark `App` + green `lume`. Never a generic paper-plane glyph.

## Share copy (draft)
A spreadsheet remembers the row. Applume remembers the application. Every deadline, document and next step for your uni and job applications — in one calm place.

## Audio direction
- Role: **warm restrained bed** — the music supports the resolve, it never drives the edit.
- Music: `hitslab-product-launch-advertisement-commercial-music-301409.mp3` (user-supplied, 101.33 BPM, 64.9s). Slower and more deliberate than the bundled options, which suits the polished tone — the whole edit breathes about 13% wider than it did at 114.84 BPM.
- Music treatment: the track's 1.02s lead-in is trimmed (`data-media-start="1.02"`) so video frame 0 lands on its first strong downbeat. Gain 0.195 — the track measures 2.5 LU hotter than the bundled bed, so the level is corrected to match. 0.3s fade-in (short, so the downbeat still lands), fade out 23.8→24.9s. No swells, no risers.
- Music cue guidance: analysed with `analyze_music_cues.py` → `assets/music/hitslab-product-launch.music-cues.{json,md}`. All times below are **video** time (music time minus the 1.02s trim). Strong-cue locks for the majors: **3.81s** (sheet→record morph), **11.43s** (the green thesis line), **17.15s** (the final autofill value), **21.29s** (the green Accepted card). Beat-grid windows: status cells **1.27 / 1.91 / 2.53**, checklist rows **5.47 / 6.05 / 6.65 / 7.21**, autofill values **14.87 / 15.48 / 16.04 / 16.59 / 17.15**, board cards **19.58 / 20.13 / 20.71 / 21.29**, outro **21.89 / 22.05 / 22.20 / 22.60**. Restraint note: polished tone — cues are alignment hints only; never let the grid rush a line of text off screen.
- Audio-reactive treatment: **subtle**. Use music RMS/bass to let the record card's green shadow depth and the closing lockup's presence breathe very slightly — amplitude small enough that you feel it rather than see it. No waveform/equalizer visuals, no pulsing text, nothing that competes with the type.
- SFX posture: **sparse**, motion-matched, professional restraint. Roughly six cue groups in 24.9s.
- Audio-coupled moments: the three status cells lighting in sequence (dry, near-silent ticks); the card morph (one soft settle); four checkbox ticks; the button click on autofill; five field settles (one shared soft cascade); one dry logo hit at the lockup.
- Restraint rule: **no** whooshes on crossfades, no impact/riser stingers, no casino or keyboard-clatter beds. If a cue is not matching something the eye actually sees move, it does not go in. Silence is an acceptable answer for any scene.

## Privacy note
All on-screen records come from the repo's own published landing-page demo set (TU Munich, SAP, Zalando, BMW Group). The pasted source in Scene 4 is shown as a **truncated link chip with no domain** (`…/msc-computer-science/apply`) so no real host appears. The admin email in `src/utils/constants.js`, the `.env` contents, Supabase keys and any real user data are excluded from the plan, the composition and the render.

## Storyboard

### Scene 1 — The row — 3.81s (0.00 → 3.81)
Warm off-white full frame. A single white card, centred and slightly wide, titled with the project's own eyebrow `A SPREADSHEET ROW` in uppercase tracked grey. Inside, the exact table from `SheetCard`: columns **Name / Status / Date**; rows `TU Munich · applying? · 15/6`, `SAP intern · sent · —`, `Zalando · todo · ?`. Everything present and settled at frame 0 — muted, no green anywhere.
A soft grey highlight bar walks down the Status column; `applying?`, `sent`, `todo` each get a faint amber underline as it passes. At 2.53s the `?` in the Date column pulses once, on the same beat as the Zalando row, and holds.
Sequential/interaction: **yes** — three status cells light one after another (~0.6s apart on the beat grid), then the `?` pulse. No text enters, so the grid can run at beat spacing safely.
Audio intent: near-silence with a low warm bed underneath. Slightly uncomfortable stillness — the feeling of looking at your own neglected sheet.
Audio-coupled idea: three very dry, very quiet interface ticks under the highlight sweep; nothing on the `?`.
Music: warm bed, low, already running.
Transition mood: **soft** → Scene 2

### Scene 2 — Row becomes record — 5.14s (3.81 → 8.95)
On the 3.70s strong cue the sheet card lifts and dissolves (y −30, scale → 0.94, opacity → 0), a small circular green arrow badge flashes at centre, and the Applume record card rises into the same footprint (y +46 → 0, scale 0.94 → 1) carrying the green-tinted border and green drop shadow from `RecordCard`.
Card contents, in order: green eyebrow `AN APPLUME RECORD` → title `TU Munich · M.Sc. Computer Science` → amber pill `Deadline 15 Jun · 9 days` and grey pill `Next: upload transcript` → the four-item document checklist. Checkboxes tick one at a time: **Curriculum vitae ✓**, **Transcript ☐ (stays unticked)**, **Motivation letter ✓**, **Portal link saved ✓**. Full card holds settled for ≥1.2s after the last tick.
Sequential/interaction: **yes** — four checklist rows arrive on the beat grid (5.47 / 6.05 / 6.65 / 7.21); each label is 2-3 words and all four stay on screen together through the hold, so the set clears the reading floor.
Audio intent: relief. The moment the mess resolves into structure.
Audio-coupled idea: one soft card settle on the morph; three small dry ticks on the ticked boxes only — the unticked Transcript stays silent, which is the joke.
Music: warm bed continues, unchanged.
Transition mood: **soft crossfade** → Scene 3

### Scene 3 — The line — 4.72s (8.95 → 13.67)
Full-frame type on warm off-white. No card, no chrome — maximum calm. Fraunces, tight leading, left-aligned in a centred measure:
line 1, ink `#15181a`: **"A spreadsheet remembers the row."**
line 2, accent `#009966`: **"Applume remembers the application."**
Line 1 rises in on the **9.53s strong cue**. Line 2 lands on the **11.43s strong cue**. Both hold fully settled until 13.43s — roughly 1.5s on the complete statement, past the floor for nine words.
Sequential/interaction: **yes** — two lines, deliberately spaced, no third element competing.
Audio intent: the thesis. Let the bed carry it; this is the one scene that should feel like it's being said, not shown.
Audio-coupled idea: none. No SFX in this scene at all.
Music: warm bed, low.
Transition mood: **soft slide** → Scene 4

### Scene 4 — Paste it in — 5.37s (13.67 → 19.04)
The working app. A clean white panel on the off-white ground, chrome kept minimal: a field labelled `Paste the source`. A truncated link chip with a link icon slides into the field (`…/msc-computer-science/apply`) — no domain shown. A cursor moves to the solid green `Add application` button and clicks it; the button shows its pressed state.
Five read-only field rows then fill themselves in, one per beat from 14.87s: **Institution → TU Munich**, **Program → M.Sc. Computer Science**, **City → Munich**, **Deadline → 15 Jun**, **Type → University**. Each value fades up into its slot with a tiny settle; labels are present from the start so only the values are new reading. The final value lands on the **17.15s strong cue**, so the form completes on a hit; all five then hold together, complete, from 17.47s to 18.80s.
Sequential/interaction: **yes** — a simulated paste and a simulated button click, then five sequential value fills on the beat grid. Values are 1-3 words and accumulate rather than replace, so the full set is on screen for ~1.5s at the end.
Audio intent: competence. Quiet, quick, effortless — the product doing the boring work for you.
Audio-coupled idea: one soft UI click on the button press; the five field fills share a single very quiet cascade rather than five separate hits.
Music: warm bed, a touch more present.
Transition mood: **clean slide** → Scene 5

### Scene 5 — One calm place — 5.86s (19.04 → 24.90)
Pull back to the board. Four columns from `KanbanBoard` — **Applying / Submitted / Interview / Accepted** — with compact cards landing into them on the beat grid (19.58 / 20.13 / 20.71 / 21.29): TU Munich under Applying, BMW Group under Submitted, SAP under Interview, and last — on the **21.29s strong cue** — Saarland University under Accepted with the green left border, so the payoff card lands on a hit. Status dots and the coloured left rules do the work; card text stays small and is scenery, not reading.
At 21.89s the board softly recedes (slight scale down, fade toward the off-white) and the closing lockup rises: the **real `Logo.png` mark** beside the wordmark `App` + green `lume`. Below it in Fraunces: **"Every application. One calm place."** Then, small and grey: `applume.app · Free to use · Private by default · Export anytime`. Headline holds settled 22.75s → 24.30s (1.55s on five words, clear of the floor); everything fades out over 24.30–24.90s.
Sequential/interaction: **yes** — board cards land one by one; no interaction simulated here, the pull-back is the move.
Audio intent: resolution and quiet confidence. Land it, don't celebrate it.
Audio-coupled idea: four soft card-settle taps as the board fills; one dry, low logo hit as the lockup arrives. Nothing after that.
Music: bed continues, then fades out under the final hold so the last ~0.4s is close to silent.
Transition mood: **fade to off-white** → end

**Music mood for this video:** warm, unhurried, business-calm — supportive bed, never the driver.
**Audio summary:** A low warm bed runs the whole 24.9s under roughly six sparse, motion-matched cue groups — dry ticks on the spreadsheet sweep, a soft settle on the morph, three checkbox ticks, one button click, a quiet field cascade, four card taps and one dry logo hit — with Scene 3 left deliberately silent so the thesis line carries alone, and the bed fading out under the final frame.
