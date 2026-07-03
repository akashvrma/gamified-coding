# ☠ The Dark Codex — A Grimoire of Python

> *One tongue to rule them all.*

**The Dark Codex** is a gamified, browser-based course that takes a complete
beginner — someone who has never written a line of code — through Python and
object-oriented programming to genuine expertise. It is themed on the **dark
sides** of two mythologies: the forbidden library, dementors and horcruxes of
the wizarding world, and the mines, wraiths and ring-forges of Middle-earth.
No child-friendly whimsy; the Codex deals in dread, bargains, and forbidden
knowledge — and in exact, honest Python.

Every spell you cast is **real Python 3**, executed by a full interpreter
(Pyodide/WebAssembly) running in your browser. Nothing is simulated, nothing
leaves your machine.

---

## Quick start

```bash
# from the repository root
python3 -m http.server 8000
# then open http://localhost:8000
```

Any static file server works (the app is plain HTML/CSS/ES-modules — no build
step). It also deploys directly to GitHub Pages. An internet connection is
needed on first run to fetch the Python interpreter from the Pyodide CDN.

## The journey — noob → expert

| Act | Realm | You learn |
|-----|-------|-----------|
| **I — The Restricted Section** | The forbidden library | `print`, variables, strings, numbers, booleans, conditionals, reading tracebacks |
| **II — The Mines of Moria** | The long dark | `while`/`for` loops, lists, tuples, dicts, sets, comprehensions |
| **III — The Department of Mysteries** | Locked rooms | functions, arguments, scope, lambdas, exceptions, files, modules |
| **IV — The Forging of the One Ring** | Sammath Naur | classes, `self`, encapsulation, properties, inheritance, polymorphism, dunder methods, composition |
| **V — The Deathly Hallows Protocol** | Mastery of death | iterators, generators, decorators, context managers, dataclasses, ABCs, design patterns |

Each act holds **seven trials** (lessons) and ends with a **warden** (boss
battle): a six-question gauntlet fought on three lives, then a final working
of code with no hints and no mercy.

## How a trial works

1. **The narrative** frames the concept in dark lore.
2. **The sections** teach it plainly — every term defined, every example runnable.
3. **The Forge** gives you a real editor. Write Python, cast the spell, and a
   hidden ward (Python assertions) grades your work *by behavior*, with
   diagnostic messages when it rejects you.
4. **The Interrogation** — a short quiz with honest distractors and
   explanations for every answer.

## The dark bargain (gamification)

- **XP and twelve ranks**, from *Muggle of the Shire* to *The Nameless One*.
- **Seventeen achievements** — some earned by skill, some by scars
  (fail ten spells and you are *Splinched*).
- **Allegiance**: swear to the Path of the Wand or the Path of the Ring;
  your magic (the UI) takes its color.
- **Streaks** for consecutive days of study; **lives** in boss gauntlets;
  **flawless bonuses** for perfect runs.
- Progress persists in `localStorage` — private to your browser.
  *Obliviate* (in the Sanctum) erases everything.

## Architecture

```
index.html            app shell
css/styles.css        the visual grimoire (dark fantasy, two allegiance accents)
js/main.js            bootstrap + hash router
js/views.js           every screen: map, act, lesson forge, boss arena, sanctum, codex
js/state.js           persistence, XP, unlock rules, streaks (localStorage)
js/gamification.js    ranks, achievements, event bus
js/runner.js          main-thread client for the Python worker (timeouts, respawn)
js/worker.js          Web Worker hosting Pyodide + the grading harness
js/data/act1..5.js    the curriculum (see docs/CONTENT_SPEC.md)
js/data/curriculum.js act assembly + lookups
tools/                content gate: schema checks + CPython grading of every challenge
```

Design principles:

- **No build step, no framework** — vanilla ES modules; deployable anywhere.
- **Real execution, honest grading** — each challenge ships hidden Python
  assertions that run against the learner's namespace and captured stdout.
  A runaway `while True:` is killed after 30 s (the interpreter lives in a
  worker and is respawned).
- **Content as data** — the entire curriculum is declarative
  (`docs/CONTENT_SPEC.md`); `npm run validate` re-grades every challenge
  solution in CPython and enforces the schema.

## Validating content

```bash
npm run validate     # schema checks + grades all ~40 challenges in CPython
```

## A note on the theme

The Codex *evokes* its mythologies in original prose; it does not reproduce
copyrighted text. It is a work of parody and pedagogy, unaffiliated with any
estate, studio, or dark lord.
