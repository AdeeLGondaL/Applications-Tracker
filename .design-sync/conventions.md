# Applume — how to build with this design system

Applume is a React + Tailwind CSS application tracker (universities & jobs). Components ship compiled from `window.Applume`; style them with the tokens and Tailwind classes below.

## Required wrapper: LanguageProvider

Most components call `useLanguage()` internally (for translation, labels, and date/deadline formatting). **Wrap your tree in `LanguageProvider` or those components throw at render.** It also provides `t`, `label`, `formatDate`, and `deadlineInfo`.

```jsx
import { LanguageProvider, Metric, Card, CardContent } from "applume";

<LanguageProvider>
  <Metric icon="job" label="Total applications" value={24} accent="accent" progressValue={46} />
</LanguageProvider>
```

Components that are pure markup (Button, Card, Field, Input, Icon, EmptyDashboard, ProgressCard) work without it, but wrapping everything in `LanguageProvider` is always safe.

## Styling idiom: tokens + Tailwind utilities

Components carry their own Tailwind classes; you rarely restyle them. For your own layout glue, use Tailwind utility classes and reference the design tokens as CSS variables — e.g. `className="bg-[var(--surface-card)] text-[var(--ink)]"`.

Brand & surface tokens (defined in `_ds_bundle.css`, reachable via `styles.css`):

| Token | Use |
|---|---|
| `--applume-accent`, `--applume-accent-hover`, `--applume-accent-ink` | primary brand green (#009966) and its darker steps |
| `--applume-accent-soft`, `--applume-accent-muted`, `--applume-accent-border` | tinted accent backgrounds / borders |
| `--brand`, `--brand-strong`, `--brand-tint` | aliases of the accent scale |
| `--surface`, `--surface-page`, `--surface-card`, `--surface-soft` | page and card backgrounds |
| `--ink`, `--text-strong`, `--text-muted`, `--text-soft` | text colors |
| `--border`, `--border-subtle`, `--border-strong` | borders |
| `--info`, `--warning`, `--danger` (+ `-soft` variants) | status colors |

Dark mode is class-based: add `class="dark"` on an ancestor.

## Component API cues (see each `<Name>.prompt.md` / `<Name>.d.ts` for full props)

- **Button** — `variant`: `"default"` (green) or `"outline"`; pass an `Icon` as a child.
- **Badge** — `tone`: `success | danger | warning | notice | neutral | blue | violet | dark`.
- **Priority** — `priority`: `"High" | "Medium" | "Low"` (renders a toned Badge).
- **Icon** — `name`: one of `dashboard, university, job, plus, search, download, upload, edit, copy, trash, link, close, reset, filter, calendar, check, eye, eyeOff, mail, share, messageSquare, shield, sparkles, sun, moon, language`; size via `className="h-5 w-5"`.
- **Card / CardContent** — the base surface; put content inside `CardContent` (`className="p-5"`).
- **Field / Input / Textarea / Select** — form primitives; `Field` wraps a labeled control (`required`, `wide`); `Select` takes `options` as strings or `{label, value}`.
- **Metric** — KPI tile: `icon, label, value, hint, accent` (`slate|blue|accent|emerald|violet|rose`), `danger`, `progressValue`.
- Data components (**ApplicationCard/Grid/Table, KanbanBoard, PipelineCard, UpcomingDeadlinesCard, dashboard panels**) take an `app`/`apps`/`applications` array. An app has: `id, type ("University"|"Job"), status, name, programRole, city, deadline (YYYY-MM-DD), priority, link, documents, notes, lastUpdated`. Statuses: `Not Open Yet, Open, Applying, Submitted, Awaiting Response, Interview, Accepted, Rejected, Deferred`.

## Where the truth lives

- `styles.css` → `_ds_bundle.css` — the token definitions and compiled component styles. Read it before inventing colors.
- `components/<group>/<Name>/<Name>.prompt.md` — usage + examples; `<Name>.d.ts` — the exact props.
