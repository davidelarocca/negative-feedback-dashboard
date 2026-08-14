# The Broken Loop — Feedback Decision Console

An interactive decision console for a 15-minute leadership training on delivering
negative feedback, aboard a Costa Cruises ship. The trainer presents it fullscreen
over a video call and drives it entirely from the keyboard. Directors and Heads of
Department answer out loud; the trainer registers the room's choice.

It is not a quiz. There is no answer key. Every choice moves three instruments, and
no choice moves all three in the same direction for free. The point the console
makes on its own, without stating it, is that **the fast option and the good option
are different options, and the difference is measured in minutes.**

---

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

All training copy lives in `src/04-content.js` and nowhere else. Rendering logic
in `src/05-app.js` contains no training text. Change a case, then rebuild:

```
python3 tools/build.py          # regenerates broken-loop.html from src/
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
src/01-head.html               tokens, brand type rules, shell, instrument rail
src/02-css.html                screens, options, summary, responsive
src/03-body.html               markup
src/04-content.js              ALL training copy — the only file to edit
src/05-app.js                  state, gauges, scoring, presenter controls
tools/build.py                 inlines fonts + mark, verifies nothing leaks out
tools/subset-fonts.py          regenerates the WOFF2 subsets from the full TTFs
assets/fonts/                  Poppins subsets + OFL licence
```

`broken-loop.html` is generated — edit `src/` and rebuild rather than editing it
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
