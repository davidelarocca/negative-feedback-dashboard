# The Broken Loop

A 15-minute leadership training on delivering negative feedback, aboard a Costa
Cruises ship. Audience: Directors and Heads of Department. Delivered fullscreen
over a video call, driven entirely from the keyboard.

Two files, two halves of one session:

| File | Ground | Role |
|---|---|---|
| `broken-loop-deck.html` | light | 22 slides. Carries the argument. |
| `broken-loop.html` | dark | The decision console. The checkpoint in the middle of it. |

The presenter runs the deck to slide 18, hands over to the console, plays the
eight cases with the room answering out loud, and returns to the deck at slide 19.

The contrast between the two is load-bearing: the light ground is the argument,
the dark ground is where the room stops listening and starts deciding. They do
not match in tone. They match in system — same palette, same type, same spacing
rhythm, inverted.

---

# Part one — the console

An interactive decision console. It is not a quiz. There is no answer key. Every
choice moves three instruments, and no choice moves all three in the same
direction for free. The point the console makes on its own, without stating it,
is that **the fast option and the good option are different options, and the
difference is measured in minutes.**

## 1. Running it

**Open `broken-loop.html`.** Double-click it — that is the whole procedure.

One self-contained file. Every style, script, the Poppins typeface and the Costa
mark are inside it, so it cannot be separated from its assets by being emailed,
copied to a USB stick, or dropped on a ship's laptop.

- No server, no build step, no install, no folder to keep alongside it.
- **Fully offline** — no network access of any kind. The build fails if any
  external reference survives into the output.
- Nothing is stored or transmitted. State lives in memory and disappears with
  the tab.

Press **F11** for fullscreen. The design targets 1920×1080 and degrades to laptop
screens down to 1280×800.

## 2. Presenter controls

| Key | Action |
|---|---|
| `→` / `Space` / `Page Down` | Advance |
| `←` / `Page Up` | Back |
| `1` `2` `3` `4` | Select an option |
| `S` | Skip the current case without recording it |
| `E` | End the round and jump to the summary, using only the cases played |
| `N` | Toggle facilitator notes (hidden by default) |
| `R` | Reset |

`←` from a consequence screen removes that decision so the case can be re-taken.
`R` asks for a second press before wiping a session in progress.

Option order is **shuffled on every load**, so position is never a tell. The
facilitator panel shows which key currently maps to which authored option
(`1 = C`, `2 = A`, …) so the trainer can follow their own notes.

## 3. The instruments

Three gauges, always visible, always moving together:

- **Trust** — the effect on the person in front of you
- **Signal** — whether that person will bring you the next problem
- **Standard** — whether the behaviour actually changes

Each option carries a delta of −3…+3 on each gauge plus a **time cost in minutes**.
Gauges accumulate across the eight cases on a bounded ±24 scale. Needles swing past
their target and settle; that is the only motion in the console.

**Loop Integrity** is a composite percentage: each gauge normalised against the
±3-per-case band it could have moved through, then averaged.

**Time is the fourth variable and the most important one.** The summary compares
the room's total against the fastest possible path through the same cases, and
shows what that path costs on the three instruments. Through all eight cases the
fastest route takes **17 minutes** and leaves Trust −5, Signal −8, Standard −11.
That comparison is the largest element on the screen and the closing argument of
the session.

## 4. The model

Costa's improvement cycle only closes if somebody says that something did not work.
Negative feedback is that joint. Delivered badly, the loop breaks at five points,
each mapped to a Carnival core value:

| Value | Break point |
|---|---|
| Respect & Protect | The moment: where, when, in front of whom |
| Listen & Learn | The diagnosis: verdict before question |
| Speak Up | The consequence: people stop reporting, so data stops arriving |
| Better Together | The audience: witnesses learn more than the recipient |
| Always Improving | The outcome: adjusting on incomplete information |

The repair sequence is **Stop. Ask. Agree.** Every consequence screen names which
of the five points held or broke.

## 5. Brand implementation

Built to the Costa on-board communication guideline.

**Colour** — every value in the file comes from the Costa palette. Primary
`#0071A3` (Pantone 7690 C) and `#F9B000` (Pantone 143 C); the console ground,
panels and hairlines are drawn from the secondary grid (`#00324A`, `#005982`,
`#1C414C`, `#588D9C`, `#8DAAC9`, `#EBE9E8`).

Gauge movement deliberately avoids green/red. Gain is the brand yellow, loss the
brand's dark amber `#C77706`. A needle moving along a single-hue scale reads as
measurement rather than verdict — which is what the brief requires: *the
instruments move; the console does not judge.*

**Type** — Poppins throughout, subset to Latin + Latin-Ext and embedded as WOFF2
data URIs (weights 300/400/600/700, ~36 KB total). Instrument read-outs use
Poppins with tabular figures rather than importing a monospace that is not part
of the Costa system.

The guideline's typographic rules are implemented as reusable classes:

| Rule | Class | Behaviour |
|---|---|---|
| Yellow dot | `.dot` | Circle at 0.23em — a Poppins full stop set 20% larger. `.dot--small` takes the text colour below the 20pt minimum. |
| Yellow line | `.ruled` | Begins one type space after the title and extends right, justifying to the body text. Height 0.085em, the font's underscore. |
| Yellow line, vertical | `.vruled` | Same proportions, beside a title or body block. |
| Title construction | `.title-stack` | Light first line over bold second line. |
| Body copy | `.body-copy` | Justified. |

**Mark** — the Costa "C", white with the yellow hull, chosen for the dark ground.
Cropped to its content box and embedded at 3× the rendered size.

## 6. Editing

All training copy lives in `src/console/04-content.js` and nowhere else. Rendering
logic in `src/console/05-app.js` contains no training text. Change a case, then
rebuild:

```
python3 tools/build.py          # both files
python3 tools/build.py console  # just the console
python3 tools/build.py deck     # just the deck
```

Each option is:

```js
{ id:'D',                                  // authored letter, kept for the notes
  label:'Aside, ask, agree, brief',        // shown on the card and in the strip
  text:'Take him aside, name the specific gap…',
  d:{ trust:2, signal:2, standard:3 },     // −3…+3 each
  min:6,                                   // time cost in minutes
  holds:ALL,                               // or breaks:['respect','listen']
  escalate:true, absorb:true,              // optional, feed the profile
  conseq:'The section runs its sanitizer log…' }
```

To change a case's facilitator note, set `note` on the case. To retime the
session, change `min` values — the fastest path recomputes itself.

### Files

```
broken-loop.html            ← GENERATED, self-contained. Open and share this.
broken-loop-deck.html       ← GENERATED, self-contained. The presentation.

src/console/01-head.html       tokens, brand type rules, shell, instrument rail
src/console/02-css.html        screens, options, summary, responsive
src/console/03-body.html       markup
src/console/04-content.js      ALL training copy — the only file to edit
src/console/05-app.js          state, gauges, scoring, presenter controls

src/deck/01-head.html          tokens, type scale, the five motion effects
src/deck/02-css.html           slide layouts, presenter chrome, handoff
src/deck/03-slides.js          ALL presentation copy — the only file to edit
src/deck/04-body.html          markup
src/deck/05-app.js             canvas scaling, reveals, rail, inversion, handoff

tools/build.py                 inlines fonts + mark, verifies nothing leaks out
tools/subset-fonts.py          regenerates the WOFF2 subsets from the full TTFs
assets/fonts/                  Poppins + IBM Plex Mono subsets, OFL licence
```

Both HTML files are generated — edit `src/` and rebuild rather than editing them
by hand.

## 7. Accessibility and robustness

- Visible keyboard focus on every control; options are real `<button>`s and work
  with mouse and touch as well as the keyboard.
- `prefers-reduced-motion` is respected — needles land instantly.
- Nothing on screen is below 18px at the 1920 target; body copy is ~22px.
- The page never scrolls horizontally. Minutes spent and the reset control stay
  on screen at every supported size; the instruments compress instead.
- Poppins is licensed under the SIL Open Font Licence 1.1, which permits
  embedding. Licence text: `assets/fonts/OFL.txt`.

---

# Part two — the deck

22 slides, light ground, one idea per slide. Same constraints as the console:
one self-contained file, fully offline, keyboard-first.

## 8. Running it

**Open `broken-loop-deck.html`.** Keep `broken-loop.html` in the same folder —
the deck loads it for the handoff on slide 18.

| Key | Action |
|---|---|
| `→` / `Space` / click | Advance one reveal step, then one slide |
| `←` | Back |
| `N` | Speaker notes |
| `F` | Fullscreen |
| `R` | Reset |
| `Esc` | Return from the console · close the notes panel |

The presenter strip sits bottom-left with the slide counter and an elapsed clock
that starts on the first key press. It is styled as part of the design because it
is visible on the shared screen.

## 9. The fixed canvas

Every slide is laid out inside a fixed **1280×720** canvas, centred and scaled to
the viewport with `transform: scale()`, recalculated on load and on resize. 1920×1080
and 1366×768 are therefore the same picture at two sizes — no reflow, no scrolling,
nothing the presenter did not rehearse. Nothing on any slide is below 18px inside
that canvas.

Two slides carry more than the base type scale fits in 720px, and the five
break-point slides give 52px of their height to the rail. Rather than shrinking
the whole deck to its worst case, those slides step down one density notch
(`.tight` for the 07–11 run, so the sequence still reads as one; `.dense` for the
heaviest standalone slides).

## 10. The handoff

Slide 18 hands over to the console, preferring the embedded route so the presenter
never leaves the deck:

1. The console is preloaded into a hidden full-bleed iframe when the deck opens,
   so there is nothing left to load at the handoff.
2. Local-file frames are cross-origin in Chrome, so the console announces itself
   over `postMessage` when it detects it is embedded. The deck waits for that
   handshake.
3. On the handshake, the frame fades in and takes keyboard focus. `Esc` inside the
   console posts back and the deck goes to slide 19.
4. **If the handshake never arrives** the frame is not usable, so the deck opens
   the console in a new tab instead of leaving a dead frame on screen. If the
   browser also blocks the popup, the slide says which file to open. `Esc` still
   returns to slide 19.

The console is unchanged when run on its own: the bridge is guarded by
`window.parent !== window` and does nothing standalone.

## 11. The inversion

Arriving at slide 18 the deck inverts from paper to the console's dark navy over
700ms, all type crossfading with it; slide 19 inverts back on its first step. These
are the only two full-screen transitions in the deck.

The dark values *are* the console's values — `#00324A` ground, `#EBE9E8` type — so
by the time the console appears the screen is already exactly its colour and there
is nothing to see happening. Verified in-browser: deck ground and console ground
both resolve to `rgb(0, 50, 74)`.

The ground is derived from position (`slide 18`, or `slide 19 step 0`) rather than
tracked as an event, so every route through it — forward, back, reset, returning
from the console — lands on the right colour.

## 12. Motion system

Five effects, defined once and reused. Everything else stays still so the
inversion lands.

| Effect | Where |
|---|---|
| Rise-in | 12px up + fade, 420ms ease-out, staggered 80ms across a group |
| Count-up | every statistic animates from zero over 900ms |
| Rule-draw | hairlines and dividers draw left to right over 500ms |
| The loop rail | slides 07–11: current break point in accent, passed ones dimmed, coming ones empty. Fades rather than cuts. |
| The inversion | slides 18 and 19 only |

`prefers-reduced-motion` reduces all of it to instant opacity changes.

## 13. Deck palette

The same Costa tokens as the console, inverted for a light ground:

| Role | Light | Dark (= console) |
|---|---|---|
| Ground | `#F7F4EF` | `#00324A` |
| Type | `#00324A` | `#EBE9E8` |
| Muted | `#85888C` | `#8DAAC9` |
| Accent | `#F9B000` | `#F9B000` |

The accent is identical on both grounds, so it survives the inversion unchanged.

Statistics take a direction of travel from the same convention as the console:
brand yellow for the positive figure, Costa dark amber `#C77706` for the negative.
Alert `#C8503C` and signal `#3FA675` are used **once**, on slide 15, where the gap
between 0% and 82% is the content rather than a decoration.

Type is Poppins for prose and **IBM Plex Mono** for eyebrows, sources and figures.
The mono is embedded rather than taken from a system stack: a system monospace
renders differently on every machine, which would break the guarantee that the
presenter sees what he rehearsed.
