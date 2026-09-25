# Brag Plan: Applume

## What is this app?
Applume is a structured tracker for university admissions and job applications — every deadline, document, link, note and next step lives on the application it belongs to, instead of rotting in a spreadsheet.

## The angle
The user supplied a reference: **Zelios' fintech SaaS demo film for IbanFirst** (0:47) — a glowing dark stage, product surfaces floating in 3D depth, kinetic type where the last word lands in a different colour, single controls spotlit out of a dimmed UI, real screens pushed into with a cursor doing the work, and a final flip out of the dark into light for the logo and URL.

This video is that film, built entirely out of Applume's own material. The adaptation that makes it work: **Applume already ships a dark theme.** `src/index.css` has a full `.dark` token set — `#0e100f` ground, `#171b19` cards, a brighter `#17b083` accent. So the dark glowing stage is not a costume borrowed from a fintech ad, it is the product's real second skin. The film opens on that dark stage, demos the working app in it, then **flips to the light theme (`#fbfbf8` + `#009966`) on the strongest beat in the track** for the payoff and the CTA — which is exactly the reference's dark→light arc, done in two themes the product genuinely has.

Specific to Applume because every surface on screen is a real component: the dashboard's Action queue tiles, the paste→draft flow, the Kanban columns, the real logo lockup. Nothing here would fit another product.

Different from the previous cut in `brag-output/` on purpose: that one was a quiet editorial product film on warm off-white. This one is an agency-grade demo reel.

## Hook (first 2-3 seconds)
**Pain first, in the audience's own words.** Black-green depth with a soft green glow wall behind. Four real Applume application cards drift in out of focus at different depths — TU Munich, SAP, BMW Group, Zalando — scattered, unreadable, going nowhere. They are the grind, rendered as objects rather than described.

Then the question wipes in word by word across them, in two balanced lines:

> **Tired of filling `spreadsheets`**
> **for every application?**

`spreadsheets` arrives in muted grey and stays dimmer than the rest: the reference's "Save tim**e**" trick, pointed at the thing that is actually failing the viewer. It sits mid-sentence rather than last, because the dimmed word should be the problem, not just the final beat.

The video then answers its own question — product name, then the product doing the work, then the payoff. Nothing declarative or preachy up front; no "deserves better than" framing. The viewer recognises their own Tuesday night before they are told anything.

## Key moments (the middle)
- **The lockup with a badge.** The real `Logo.png` mark and the `App`+green`lume` wordmark rise on the glow wall, with a glowing green capsule under it reading `University + Job applications` — the reference's "AI-powered" pill, carrying Applume's actual dual-audience positioning.
- **The Action queue, counting.** The real `FocusThisWeek` card from the dashboard: eyebrow `TODAY FOCUS`, heading `Action queue`, and four tiles arriving one per beat with their numbers ticking up — `2 Overdue`, `5 Due in 7 days`, `3 Interviews`, `4 Missing docs`. A slow push-in across the whole scene.
- **One control, spotlit.** The card dims to almost nothing and the `Review queue` button lifts out of it, glowing, alone in frame. The reference's "New mail" shot.
- **Paste → drafted → saved.** A truncated link chip drops into `Paste the source`, a cursor presses the solid green `Add application`, and five fields fill themselves one per beat — Institution, Program, City, Deadline, Type. A green `Saved` chip lands on the strongest cue in that stretch.
- **The whole search at once.** Pull back to the Kanban board — `Applying / Submitted / Interview / Accepted` — with four cards landing into their columns, the last one green under Accepted.

## Outro / punchline
On the 21.29s strong cue the entire stage **flips from the dark theme to the light one** — the ground washes from `#0e100f` to `#fbfbf8`, the board dissolving through it. The product's real h1 lands in Fraunces: **"Every application. One calm place."** with `calm` in `#009966`. Then the logo lockup and a solid green `applume.app` capsule. Nothing else. The film ends the way the reference does: name, URL, silence.

## User flow worth showing
Pulled from `src/components/dashboard/FocusThisWeek.jsx`, the how-it-works section of `src/pages/LandingPage.jsx`, `src/utils/ai.js` and `src/components/applications/KanbanBoard.jsx`:

1. **Entry** — paste the source (a university or job posting link).
2. **Key action** — Applume drafts the fields; you review and save.
3. **Result** — a record carrying its deadline, documents and next step, sitting on a board with everything else — and a dashboard that tells you what needs you this week.

Scenes 3, 4 and 5 are all the working app. Scenes 1, 2 and 6 frame them.

## Tone
- Preset: **app-store**
- Creative direction: *"agency SaaS demo film — glowing dark stage, floating product surfaces, one thing at a time, resolving into light."*
- Interpretation: six scenes, feature-forward, clean slides and smooth wipes, no hard cuts and no chaos. Entrances are quick (0.35–0.6s) and then stop dead so type stays readable; camera does slow push-ins rather than zoom punches. Energy comes from depth, glow and rhythm, not from speed. The product is treated as a real, shipping, serious product — because it is.

## Format: landscape — 1920x1080
## Duration: 24.90s

## Visual identity (from the project)
Both theme token sets are real and both come straight from `src/index.css` `:root` / `.dark`.

**Dark stage (scenes 1–5) — the `.dark` token set**
- Background: `#0e100f` (`--surface`); alt `#161a18`; card `#171b19`
- Accent: `#17b083` (`--applume-accent`); strong `#23c091`; ink `#9fe4cd`; bright `#2fd39c`
- Text: `#eaece9` ink, `#f5f7f4` strong, `#99a09a` muted, `#6d746f` soft
- Border: `#262b28`; strong `#343a35`
- Glow wall: a wide radial of `#17b083` at very low alpha behind everything, the dark-theme stand-in for the reference's violet wall

**Light payoff (scene 6) — the `:root` token set**
- Background: `#fbfbf8`; card `#ffffff`
- Accent: `#009966`; solid `#007c53` on white ink (`--accent-solid` / `--accent-solid-ink`)
- Text: `#15181a` ink, `#0c0e0f` strong, `#5b6560` muted

**Shared**
- Status tones: warning `#b7791f` / soft `#f9f2e2`; info `#3763d8` / soft `#eef2fd`; danger `#c8394f`
- Display font: **Fraunces** (Google Fonts, opsz 9..144, wght 400..600) — ship the latin subset locally
- Body font: **Inter** (400/500/600/700) — ship the latin subset locally
- Brand mark: the **real logo**. `logo-dark.png` on the dark stage, `Logo.png` on the light payoff — the same swap `src/components/brand/Logo.jsx` does. Never a generic paper-plane glyph.
- Glyph note: the latin subsets carry no `✓`, `☐`, `→` or `·`-heavy decoration. Every check, arrow, calendar and link icon is **inline SVG**.
- Strongest visual elements: the `FocusThisWeek` tile grid, the solid-accent button pairing, the Kanban column left-rules, the record card's green border and shadow.

## Share copy (draft)
Applume turns the spreadsheet you stopped updating into a tracker that actually remembers — deadlines, documents, next steps, for university and job applications alike.

## Audio direction
- Role: **present, rhythmic bed with clean UI accents** — this is a demo reel, so the music carries more of the edit than a quiet product film would, and the cuts sit on the pulse.
- Music: `hitslab-product-launch-advertisement-commercial-music-301409.mp3` (user-supplied, 101.33 BPM, 64.86s). Already analysed in a previous run on this project; the cue JSON is reused rather than re-derived.
- Music treatment: the track's 1.02s lead-in is trimmed (`data-media-start="1.02"`) so video frame 0 lands on its first strong downbeat. Gain **0.23** — a touch hotter than the previous cut's 0.195, because this edit has fewer silent passages and the bed is meant to be felt. 0.3s fade-in so the downbeat still lands; fade out 23.8 → 24.90 so the final lockup breathes.
- Music cue guidance: `assets/music/hitslab-product-launch.music-cues.{json,md}`. **All times below are video time = music time − 1.02s.**
  - Strong-cue locks (3): **3.81s** the line completes and `spreadsheet` dims · **17.15s** the `Saved` chip lands on the drafted record · **21.29s** the dark→light flip, the payoff.
  - Beat-grid windows: floating cards **0.63 / 1.27 / 1.91 / 2.53** · focus tiles **8.36 / 8.95 / 9.53 / 10.15** · autofill values **14.27 / 14.87 / 15.48 / 16.04 / 16.59** · board cards **18.37 / 19.04 / 19.58 / 20.13** · outro **22.46 / 23.01**.
  - Readability rule: the tile set and the autofill set each arrive fast on consecutive beats and then **hold complete** (2.36s and 1.17s respectively). No single line of text is ever pulled off screen on a beat.
- Audio-reactive treatment: **subtle**. Music bass drives only the green glow wall's intensity across scenes 1–5 and a ≤2% scale on the closing logo mark. No waveform, no equalizer, no pulsing type.
- SFX posture: **moderate** — more present than a polished film, still motion-matched and clean. Roughly eight cue groups across 24.9s, all tied to something the eye sees move.
- Audio-coupled moments: four soft passes as the cards drift in; a low hit as the line completes; a warm announce on the lockup; four tile taps; a hover-glow on the spotlit button; a chip drop, a button click and five quiet field settles; a confirm tone on `Saved`; four card taps on the board; one transition swell on the light flip; one dry logo hit.
- Restraint rule: no risers, no cinematic braams, no keyboard clatter beds, no casino sounds. Nothing bright or hissy repeated. If a cue is not matching something visibly moving, it does not go in.

## Privacy note
Every record on screen comes from the repo's own published landing-page demo set in `src/pages/LandingPage.jsx` (TU Munich, SAP, BMW Group, Zalando, Saarland University) and the demo user `Aiden Chen` already shipped in that file. The pasted source in Scene 4 is a **truncated path with no domain** (`…/msc-computer-science/apply`). The admin email in `src/utils/constants.js`, `.env`, Supabase keys and anything belonging to a real user are excluded from the plan, the composition and the render.

## Storyboard

### Scene 1 — The grind — 4.92s (0.00 → 4.92)
Near-black `#0e100f` ground with a wide, very low-alpha `#17b083` glow wall centred behind everything. Four real Applume Kanban cards drift in at different depths and rotations, blurred and dim (opacity ~0.35, 8–14px blur) — `TU Munich`, `SAP`, `BMW Group`, `Zalando`, each with its type chip, priority dot and deadline pill. They are scenery, not reading: nothing on them is meant to be legible.
From the 1.27s beat the pain question wipes in word by word across the centre in Fraunces, over two balanced lines: **"Tired of filling spreadsheets / for every application?"** Every word lands in `#f5f7f4` except `spreadsheets`, which lands in muted `#6d746f` and stays there. On the **3.81s strong cue** the floating cards dim another step and drift slightly further out, leaving the question alone.
Sequential/interaction: **yes** — four cards arrive at half-beat spacing (0.00 / 0.30 / 0.60 / 0.90); they are non-text accents so tight spacing is safe. The question is one unit, fully settled by 2.23s and held to 4.70s (2.47s on seven words, clear of the 2.1s floor).
Audio intent: unease with momentum — the bed is already running and confident, the picture is not.
Audio-coupled idea: four soft low passes as the cards drift; one low dry hit as the line completes.
Music: bed from frame 0, full.
Transition mood: **smooth wipe** → Scene 2

### Scene 2 — The lockup (the answer) — 2.29s (4.92 → 7.21)
The cards clear. The glow wall brightens and pulls to centre. The real `logo-dark.png` mark rises with the wordmark `App` + `lume` in `#17b083`, scale 0.92 → 1, settling by 5.40s. At 5.47s a glowing green capsule fades up beneath it: **`University + Job applications`** — `#9fe4cd` text on a `rgba(23,176,131,0.14)` fill with a `#17b083` border and an outer glow.
This is the answer to the question scene 1 just asked: *which* applications? Both kinds. The badge carries Applume's dual-audience positioning rather than a generic feature claim.
Sequential/interaction: **yes** — mark and wordmark together, then the badge. Badge settles 5.83s and holds to 7.00s.
Audio intent: arrival. This is the product introducing itself.
Audio-coupled idea: one warm announce hit on the lockup; a soft shimmer as the badge glows up.
Music: bed continues, unchanged.
Transition mood: **clean slide** → Scene 3

### Scene 3 — What needs you this week — 5.30s (7.21 → 12.51)
The real `FocusThisWeek` card from the dashboard, rendered in dark-theme tokens on `#171b19` with a `#262b28` border and the component's own soft accent wash in the top-right corner. It rises into frame (y +40 → 0) by 7.78s carrying its eyebrow `TODAY FOCUS` in `#23c091`, its heading `Action queue` in Fraunces, and the subline `Deadlines, interviews, and setup gaps that need you.`
Four tiles then land one per beat at **8.36 / 8.95 / 9.53 / 10.15**, each with its icon chip, its uppercase action label, a big tabular number and a two-word label: **`2 Overdue`** (danger tint), **`5 Due in 7 days`** (warning tint), **`3 Interviews`** (neutral), **`4 Missing docs`** (neutral). Each number ticks up from 0 to its value over ~0.4s as its tile arrives. The full set of four then holds, complete and still, from 10.15 → 11.43 (2.36s including the settle).
A slow push-in runs across the whole scene (scale 1.00 → 1.05, no motion blur).
At the **11.43s** beat the card dims to ~0.2 and the `Review queue` button lifts out of it toward centre, scaling to ~1.5 with a `#17b083` glow — one control, alone, exactly the reference's isolated-button shot. It holds lit to 12.51s.
Sequential/interaction: **yes** — four tiles on consecutive beats with count-ups, then a simulated spotlight on a single control.
Audio intent: competence and grip. The product knows what you should do today.
Audio-coupled idea: a soft settle as the card rises; four clean taps on the tiles; a low hover-glow swell as the button lifts out.
Music: bed continues, a touch more present.
Transition mood: **smooth wipe** → Scene 4

### Scene 4 — Paste it, and it's drafted — 5.25s (12.51 → 17.76)
The spotlit button recedes and a clean dark panel slides in: a field labelled `Paste the source`, and under it five read-only rows whose labels are present from the start — `Institution`, `Program`, `City`, `Deadline`, `Type` — with empty value slots.
On the **13.67s strong cue** a truncated link chip with an inline link icon drops into the field: `…/msc-computer-science/apply` (no domain). At ~14.0s a cursor moves to the solid green `Add application` button and presses it; the button shows its pressed state.
The five values then fill themselves in at **14.27 / 14.87 / 15.48 / 16.04 / 16.59**: **TU Munich**, **M.Sc. Computer Science**, **Munich**, **15 Jun**, **University**. Each fades up into its slot with a small settle; only the values are new reading, and they accumulate rather than replace, so all five are on screen together from 16.59s.
On the **17.15s strong cue** a green `Saved` chip with an inline check lands at the panel's corner and the panel picks up a `#17b083` border and outer glow. Everything holds to 17.76s.
Sequential/interaction: **yes** — a simulated paste, a simulated button press, then five sequential value fills on consecutive beats, held complete for 1.17s.
Audio intent: effortless. The boring work happening without you.
Audio-coupled idea: a soft drop as the chip lands; one clean UI click on the press; five very quiet field settles; one short confirm tone on `Saved`.
Music: bed continues.
Transition mood: **clean slide** → Scene 5

### Scene 5 — Everything, at once — 3.53s (17.76 → 21.29)
Pull back. The real `KanbanBoard` in dark theme: four columns headed **`Applying`**, **`Submitted`**, **`Interview`**, **`Accepted`**, each with its count chip, all present and readable from 17.76s. Compact cards then land into their columns at **18.37 / 19.04 / 19.58 / 20.13** — `TU Munich` under Applying with the `#b7791f` left rule, `BMW Group` under Submitted with the `#3763d8` rule, `SAP` under Interview, and last, `Saarland University` under Accepted with the `#17b083` rule. Card text is deliberately small and is scenery; the columns and the coloured rules do the reading. The board holds settled 20.13 → 21.29 (1.16s).
Sequential/interaction: **yes** — four cards land one per beat; the pull-back is the camera move.
Audio intent: scope. The whole search in one shot.
Audio-coupled idea: four soft card taps as they land.
Music: bed continues, building toward the flip.
Transition mood: **dramatic wash to light** → Scene 6

### Scene 6 — One calm place — 3.61s (21.29 → 24.90)
On the **21.29s strong cue** the stage flips: the ground washes from `#0e100f` to `#fbfbf8` over ~0.45s, the board dissolving up and out through the wash, the green glow warming from `#17b083` to `#009966` as it goes. The light theme, arriving.
The product's real h1 lands in Fraunces at ~21.6s, settled by 21.9s: **"Every application. One calm place."** — `#0c0e0f` with **`calm`** in `#009966`. It holds to 24.30s (2.4s on five words).
At **22.46s** the real `Logo.png` mark and the `App` + green `lume` wordmark rise beneath it, and at **23.01s** a solid `#007c53` capsule with white ink: **`applume.app`**. Both hold; the mark breathes ≤2% with the bass. Everything fades out 24.50 → 24.90 as the music fades under it.
Sequential/interaction: **yes** — wash, headline, lockup, URL capsule, each on its own beat.
Audio intent: resolution and invitation. Land it, name it, stop.
Audio-coupled idea: one warm transition swell on the wash; one dry logo hit as the lockup lands. Nothing after.
Music: bed through the flip, fading 23.8 → 24.90 so the last beat is nearly silent.
Transition mood: **fade to off-white** → end

**Music mood for this video:** confident, mid-tempo commercial launch — present enough to drive the cuts, never louder than the product.
**Audio summary:** A full-strength bed runs the whole 24.9s under roughly eight motion-matched cue groups — soft passes on the drifting cards, a dry hit on the headline, a warm announce on the lockup, four tile taps, a hover swell on the spotlit button, a chip drop plus click plus quiet field cascade plus confirm tone on the draft, four card taps on the board, and a transition swell and single logo hit across the light flip — with the bed fading out under the final lockup.

---

## As built — deltas from the storyboard above

The scene boundaries, durations and the three strong-cue locks all shipped as
planned (24.90s total). Six things moved during implementation, all of them to
protect reading time or to fix a rendering artefact:

1. **Scene 1, card arrivals** — planned on the beat grid (0.63 / 1.27 / 1.91 /
   2.53). Shipped at **half-beat spacing (0.00 / 0.30 / 0.60 / 0.90)**. On the
   full grid the headline could not start until 1.91s, which left it only 1.57s
   settled against a 1.8s floor for six words. Moving the cards to half-beats
   frees the headline to start on the **1.27s** beat and hold **1.98s**.
2. **Scene 1, the hit** — the low impact fires at 1.85s so its transient peaks
   on the **1.91s strong cue**, landing the line rather than opening it.
3. **Scene 3, the tiles** — the four `FocusTile` detail sentences ("Needs
   attention before anything else." etc.) were **cut**. Four extra sentences
   inside a 3s window is exactly the "too much text for the scene length"
   failure; the icon chip, action pill, number and label carry the tile.
4. **Scene 4, the fills** — the five values land at **half-beat spacing**
   (14.27 / 14.57 / 14.86 / 15.16 / 15.45) rather than one per beat. That is
   the reference film's fast form-fill, and it buys the completed set **1.87s**
   of settled hold before the panel leaves — a full beat-spaced version left
   the last value only 0.7s, under its floor. The press moved to the **13.67s**
   strong cue and `Saved` keeps the **17.15s** lock.
5. **Scene 5, clip length** — the board clip runs to **21.90s**, 0.61s past the
   scene boundary, so it can dissolve out *underneath* the light wash instead
   of hard-cutting at 21.29s. Its content is fully gone by 21.57s and the wash
   is opaque at 21.74s, so no text is ever measured against a half-opacity
   ground.
6. **Grain dither added** — the low-alpha radial ramps (the dark glow wall and
   the light wash) banded into visible concentric rings at 8-bit, badly enough
   to see on the outro. A fixed-seed `feTurbulence` tile now sits over both at
   ~5% opacity. It is seeded, so it stays deterministic across renders.

Verified after build: `hyperframes check` clean (0 errors, 0 layout issues,
50/50 WCAG AA), all six clips and all 27 `<audio>` elements confirmed as direct
children of the composition root, render 1920x1080 / 30fps / 747 frames /
24.90s with AAC stereo at -26.6 dB mean and -5.3 dB peak.

---

## Revision — opening re-pitched (pain-first)

The original opening line, `Applications deserve better than a spreadsheet.`,
was cut at the user's direction: too declarative, and it tells the viewer a
verdict instead of showing them themselves. The video now opens on the pain in
the audience's own register and lets the product be the answer.

- **New line:** *"Tired of filling spreadsheets for every application?"* — a
  question, two balanced lines, with `spreadsheets` dimmed mid-sentence rather
  than the last word dimmed. Set at `max-width: 950px` so it breaks as
  `Tired of filling spreadsheets` / `for every application?` instead of
  stranding a word on a third line.
- **Scene 1 grew one beat** (4.33s → **4.92s**) to buy the extra word its
  reading time: settled 2.23s, held to 4.70s = **2.47s** on seven words,
  against a 2.1s floor.
- **Scene 2 gave up that beat** (2.88s → **2.29s**, now 4.92 → 7.21). Retimed:
  lockup 4.96, badge 5.47 (beat), exit 7.00. Its SFX moved with it — the
  lockup hit to 4.95, the badge accent to 5.47.
- **Scenes 3–6 are untouched.** Every strong-cue lock survives: 3.81s (cards
  fall back), 13.67s (the click), 17.15s (`Saved`), 21.29s (the light flip).
- **The arc is now explicit:** question → product name → *which* applications
  (the badge answers scene 1 directly) → the product doing the work → payoff.
  The closing line, `Every application. One calm place.`, now reads as the
  answer to the opening question rather than a standalone claim.

Re-verified after the change: `check` clean (0 errors, 0 layout issues, 50/50
WCAG AA), render 1920x1080 / 30fps / 747 frames / 24.90s, AAC stereo at
-26.6 dB mean and -5.3 dB peak, poster re-pulled at 3.0s and re-baked as
frame 0.
