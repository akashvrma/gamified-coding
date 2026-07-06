# The Dark Codex — Content Specification (v1)

This document is the **binding contract** for curriculum data files
(`js/data/act1.js` … `js/data/act10.js`). The engine, the CPython validator
(`tools/validate_content.mjs`), and all review passes assume it exactly.

## 1. File shape

Each act file is an ES module whose **default export** is one act object.
The first line after the header comment MUST be:

```js
const py = String.raw;
```

All Python source fields (`code`, `starter`, `solution`, `validation`) MUST be
written as tagged template literals using `py`, e.g. ``starter: py`...` ``.
`String.raw` preserves backslashes so Python `"\n"` survives. Because of this:

- **NEVER use a backtick anywhere inside Python code fields** (Python never needs one).
- **NEVER use `${` inside Python code fields** (f-strings use single braces: `f"{name}"` is fine).
- Plain prose fields (narrative, prompts, hints…) are ordinary single-quoted or
  template strings — escape as JS normally requires.

## 2. Act object schema

```js
export default {
  id: 'act1',              // exactly 'act1' … 'act10'
  numeral: 'I',            // 'I' … 'X'
  arc: 'Python Fundamentals',       // plain-English subject of the act
  title: 'The Restricted Section',  // themed act name
  tagline: 'one italic sentence of dark flavor',
  sigil: '🕯️',            // one emoji used as the act's map sigil
  epigraph: { text: 'a short dark quotation (invented, in-universe voice)', source: 'attribution' },
  intro: 'markdown-lite paragraph(s) — what this act covers, themed but concrete',
  lessons: [ /* exactly 7 lesson objects, see §3 */ ],
  boss: { /* see §4 */ },
  codex: [ { term: 'print()', def: 'one-sentence plain definition, markdown-lite' }, ... ],
                            // 10–16 entries covering the act's Python vocabulary
};
```

## 3. Lesson object schema

```js
{
  id: 'a1l1',              // act number + lesson number: a1l1 … a5l7
  title: 'The First Incantation',   // themed
  concept: 'print(), comments, and how Python reads your code',  // PLAIN english
  xp: 30,                  // completion bonus, 25–40
  narrative: 'markdown-lite. 60–120 words of dark story that frames the concept.',
  sections: [              // 2–5 teaching sections
    {
      heading: 'themed but descriptive',
      body: 'markdown-lite prose. THE TEACHING LIVES HERE — precise, plain, beginner-honest. Use `inline code`, **bold**, bullet lists ("- " lines).',
      code: py`# optional runnable Python example (omit field if none)`,
      note: 'optional one-paragraph dark-lore aside that reinforces the concept (omit if none)',
    },
  ],
  challenge: {
    title: 'themed',
    prompt: 'markdown-lite. Themed framing FOLLOWED BY exact technical requirements. The learner must know precisely what to write without guessing.',
    starter: py`# starter code with TODO comments`,
    solution: py`# a complete working solution`,
    hints: ['hint 1 (gentle nudge)', 'hint 2 (concrete)', 'hint 3 (nearly the answer)'],
    validation: py`# assertions, see §5`,
    successText: 'one dark, satisfying sentence',
    xp: 60,                // 50–100; later lessons higher
  },
  quiz: [                  // 3–4 questions
    {
      q: 'question text; may contain `inline code`',
      options: ['4 options', '...', '...', '...'],   // exactly 4
      answer: 0,           // index of the correct option
      explain: 'why the right answer is right (and the tempting wrong one is wrong)',
    },
  ],

  // ---- OPTIONAL riders (all additive; lessons without them stay valid) ----

  extras: [                // 0–3 per lesson; optional side workings after the quiz
    {
      id: 'a2l5x1',        // REQUIRED, stable: lessonId + 'x' + n (state keys on it;
                           // index-keyed records would break on reorder)
      kind: 'echo',        // 'echo' | 'cursed' | 'ward'
      title: 'themed',
      prompt: 'markdown-lite; themed framing then exact requirements',
      starter: py`...`,
      solution: py`...`,
      validation: py`...`, // same quality bar and contract as challenges (§5)
      successText: 'one dark sentence',
      hints: ['...'],      // echo: exactly 2 · cursed/ward: exactly 3
      xp: 20,              // echo 15–25 · cursed 20–40 · ward 40–60
    },
  ],

  trace: [                 // 0–3 per lesson; "The Scrying" — rendered between
    {                      // challenge and quiz; never gating; 5 XP first-try
      id: 'a1l2t1',        // REQUIRED, stable: lessonId + 't' + n
      code: py`...`,       // ≤ 12 lines; runs standalone, deterministic, stdlib-only
      q: 'The scrying: what does this working print?',
      options: ['...', '...', '...', '...'],  // exactly 4
      answer: 1,           // MACHINE-VERIFIED: the validator EXECUTES `code` in
                           // CPython and asserts stripped stdout equals
                           // options[answer] exactly (repr quoting and all;
                           // multi-line outputs joined with real newlines in the
                           // option string). A mis-keyed answer fails the build.
      raises: 'NameError', // OPTIONAL: the item's truth is "this exception type is
                           // raised" — the code must die of exactly this exception;
                           // stdout comparison is skipped.
      explain: 'must repair the misconception behind each distractor',
    },
  ],
}
```

Inside `challenge` (and boss `finalChallenge`), one more optional field:

```js
  // Shown by the Codex's 6-fail rescue as a kindred working — a solved
  // sibling problem, never this challenge's own answer. Schema live now;
  // content arrives Wave 2.
  workedExample: { intro: '...', code: py`...`, outro: '...' },
```

**Word budget:** a lesson's narrative plus its section bodies should target
**≤ ~650 words**. The validator prints a warning (never an error) past that
line — trim, don't split.

## 3b. Echo design law (`kind: 'echo'`)

- Same **deep structure** as the host lesson's challenge, different surface;
  at most one direction-reversal per lesson.
- Starter one notch leaner than the lesson's own starter.
- Validation quality bar identical to challenges: behavioral, multi-input,
  diagnostic messages. The CPython gate runs echoes exactly like challenges
  (solution must pass; unmodified starter must fail).
- Exactly 2 lean hints; XP 15–25; never gates anything.

## 3c. Cursed-scroll design law (`kind: 'cursed'`)

- The prompt is a **symptom report, never a bug report** — what the haunted
  program does wrong, not where the wound is.
- The starter is a complete, runnable, WRONG 15–25-line program with a
  mend-in-place header comment.
- Hints in diagnosis order: how to observe → the wrong mental model → the fix.
- successText names the bug's true name; the bug gains a codex entry.
- Exactly 3 hints; XP 20–40.

## 3d. Ward-craft law (`kind: 'ward'`)

- The learner writes the tests: a `ward(candidate)` function judged by playing
  prosecutor — one true implementation must pass silently, each impostor must
  be bitten, with per-impostor diagnostic messages.
- Exactly 3 hints; XP 40–60.

## 4. Boss object schema

```js
{
  id: 'act1-boss',
  title: 'The Dementor’s Gate',     // themed warden name
  narrative: 'markdown-lite, 60–120 words. High stakes, dark, ties the act together.',
  defeatText: 'one sentence shown when the learner loses all three lives',
  victoryText: 'one sentence shown on victory',
  xp: 250,                 // act1 250 → act5 450 (act1:250, act2:300, act3:350, act4:400, act5:450)
  flawlessBonus: 50,
  gauntlet: [ /* 6 quiz questions, same shape as lesson quiz, drawn from the WHOLE act */ ],
  finalChallenge: {        // same shape as lesson challenge but NO hints field needed
    title: '...', prompt: '...', starter: py`...`, solution: py`...`,
    validation: py`...`, xp: 0,   // xp ignored; boss.xp is the reward
  },
}
```

## 5. The validation contract (CRITICAL)

Validation code runs **after** the learner's code, in the **same namespace**,
with two extra bindings:

- `_stdout` — a `str` holding everything the learner's code printed.
- `_source` — a `str` holding the learner's code exactly as submitted.
  **Behavior first, source only for intent, use sparingly**: reach for
  `_source` only when behavior cannot express the requirement (e.g. "the
  count must be computed with `len()`, never typed by hand"). Never use
  `inspect.getsource` — code exec'd from `<your-spell>` has no file backing
  and it raises `OSError` in both harnesses.

Rules:

- Express every check as `assert <cond>, "<themed but DIAGNOSTIC message>"`.
  The message must tell the learner *what* is wrong in plain terms after the flavor,
  e.g. `assert "Nagini" in _stdout, "The ward heard no mention of Nagini — did you print the serpent's name?"`
- Check **behavior, not source text**. Call the learner's functions/classes with
  several inputs, including an edge case. For print-based early lessons, assert on `_stdout`.
- When the challenge defines functions/classes, validation may call them directly
  (they are in the namespace). Guard with
  `assert "spell_name" in dir() or True` style only if needed — prefer direct use;
  a missing name raising `NameError` is surfaced to the learner as a validation error, which is acceptable.
- Validation MUST pass against the provided `solution` (this is machine-checked;
  a failure blocks the build).
- Validation must be **deterministic**: no randomness, no time, no network.
- Keep validation honest but not brittle: don't require exact whitespace unless
  the lesson is about exact output; strip lines where sensible.

## 6. Python rules (Pyodide runtime)

- Python 3.11 semantics. **Standard library only** — and only modules that exist
  in Pyodide's stdlib (math, random, functools, itertools, collections, abc,
  dataclasses, json, io, textwrap, typing are all safe). No pip packages.
- **NEVER use `input()`** in examples-to-run, starters, solutions, or validation.
  You may *mention* it in prose with a note that the Forge does not support it.
- File I/O (`open`) works (in-memory FS) — Act 3's file lesson may use it; write
  files before reading them within the same program.
- No `while True:` in starters without an obvious break path (30s timeout kills it).
- Everything must be deterministic. If teaching `random`, seed it in examples
  and avoid it entirely in validation-checked code paths.

## 7. Voice & tone (the whole point)

- **Dark, literary, adult.** The registers of the source material's darkest
  corners: horcruxes, dementors, the Ring's corruption, Moria's dead, the
  Nazgûl. Dread, bargains, costs, forbidden knowledge. NEVER whimsical-cute,
  never Bertie Botts, never "yer a wizard" cheer.
- **Legally careful:** evoke, don't quote. Invent in-universe-*style* epigraphs
  and attribute them to invented voices ("a burned page of the Codex",
  "carved above the gate at Khazad-dûm" is fine — never quote real book/film lines verbatim).
- **Pedagogy beats theme.** Theme frames; plain language teaches. Every prompt
  states exact requirements (function names, parameter counts, return types,
  exact strings to print) *after* the flavor. A beginner with zero background
  must be able to succeed from the section text alone.
- Explain like a patient mentor to a total beginner in early acts; assume
  accumulated knowledge later. Define every term the first time it appears.
- Analogy discipline: one analogy per concept, then the real mechanics.

## 8. Worked example lesson (canonical quality bar)

```js
{
  id: 'a1l1',
  title: 'The First Incantation',
  concept: 'print(), your first program, and how Python reads code',
  xp: 30,
  narrative: 'The book opens itself. Its first page is empty save for a single '
    + 'instruction, written in a hand that presses too hard: *make the machine speak*. '
    + 'Every dark working that follows — every ward, every horcrux of data, every '
    + 'bound daemon — begins with this smallest of spells. Speak through the machine, '
    + 'and it will never again be silent.',
  sections: [
    {
      heading: 'The spell that speaks',
      body: 'Python is a language for commanding machines. A **program** is a list of '
        + 'instructions, read top to bottom, one line at a time.\n\n'
        + 'The first instruction every sorcerer learns is `print()` — it makes the '
        + 'machine write text to the screen. Whatever you place between the '
        + 'parentheses, wrapped in quotes, is spoken aloud:',
      code: py`print("The Codex is open.")
print("There is no closing it now.")`,
      note: 'The quotes matter. Text in quotes is called a **string** — a captured '
        + 'phrase the machine carries but does not interpret. Forget the quotes and '
        + 'Python will try to *understand* the words instead of speaking them — and fail.',
    },
    {
      heading: 'Marks the machine ignores',
      body: 'A line beginning with `#` is a **comment** — a margin note for human '
        + 'eyes only. Python skips it entirely.\n\n'
        + '- Comments explain *why* code exists.\n'
        + '- They cost nothing and save the sorcerer who comes after you.\n'
        + '- That sorcerer is usually you, three weeks later, at midnight.',
      code: py`# This line is ignored. Write your intent here.
print("Only this line runs.")`,
    },
  ],
  challenge: {
    title: 'Wake the Codex',
    prompt: 'The Codex demands proof you can make the machine speak.\n\n'
      + 'Write a program that prints **exactly** these two lines, in this order:\n\n'
      + '- `I have opened the Codex.`\n'
      + '- `I accept what follows.`',
    starter: py`# Print the two lines of the oath, in order.
# Line 1: I have opened the Codex.
# Line 2: I accept what follows.
`,
    solution: py`print("I have opened the Codex.")
print("I accept what follows.")`,
    hints: [
      'Each line of the oath needs its own print().',
      'The text must match exactly — capital letters and the final periods included.',
      'print("I have opened the Codex.") is the whole first line. Now write the second.',
    ],
    validation: py`lines = [l for l in _stdout.splitlines() if l.strip()]
assert len(lines) >= 2, "The Codex heard fewer than two lines. Use print() twice."
assert lines[0] == "I have opened the Codex.", "The first line is wrong. It must be exactly: I have opened the Codex."
assert lines[1] == "I accept what follows.", "The second line is wrong. It must be exactly: I accept what follows."`,
    successText: 'The ink drinks your words. Somewhere far below, something turns over in its sleep.',
    xp: 50,
  },
  quiz: [
    {
      q: 'What does `print("Lumos")` do?',
      options: [
        'Displays the text Lumos on the screen',
        'Sends the word Lumos to a printer',
        'Creates a variable named Lumos',
        'Runs a spell called Lumos',
      ],
      answer: 0,
      explain: 'print() writes text to the screen (the console). It has nothing to do '
        + 'with paper printers, and quoted text is just data — not a command.',
    },
    // ... 2–3 more
  ],
}
```

## 8b. Data-science acts (acts 6–7) — additional rules

Acts 6–7 teach scientific Python (the prerequisite skills for applied
ML/data-science courses). Everything in this spec still applies, plus:

- **Allowed libraries**: `numpy`, `pandas`, `matplotlib`, `sklearn` (scikit-learn),
  and stdlib (`math`, `random`, `collections`, `statistics`). The engine
  auto-loads these in the browser via Pyodide on first import (a few seconds;
  the narrative should acknowledge the first summoning takes a moment).
  **NO tensorflow/keras/scapy/requests** — not available in Pyodide. Neural
  networks may be taught conceptually and/or implemented in tiny form with
  numpy only.
- **Determinism is law**: every use of randomness must be seeded
  (`np.random.seed(0)`, `random_state=0` on every sklearn estimator/splitter).
  Validation must never depend on unseeded randomness, dict-order accidents,
  or floating-point equality (use `abs(a-b) < 1e-6` or `np.allclose`).
- **Datasets are conjured, not fetched**: challenges generate their small
  datasets in code (lists/arrays/DataFrames built inline, or seeded synthetic
  data). No file downloads, no bundled CSVs, no network. Keep data tiny
  (≤ a few hundred rows) so browser runs stay fast.
- **Plots**: the harness captures the last matplotlib figure and shows it to
  the learner. Validation must check figures via their object model
  (`len(ax.lines)`, `ax.get_title()`, computed data) or via the underlying
  numbers — never via rendered pixels. Always have solutions call
  `plt.title(...)`/labels so the habit sticks.
- **Themed but honest framing**: exercises wrap the same *kinds* of tasks a
  data-science-for-security course uses (parsing structured records, feature
  matrices, anomaly hunting, clustering entities, classifying events) in the
  Codex's dark-fantasy fiction. Never reference any commercial course, its
  text, or its datasets.

## 8c. Autopsy section format

A misconception autopsy is an ordinary lesson section whose `heading` begins
`Autopsy:`. Its body, in order: (a) the false belief quoted in second person;
(b) a ≤10-line runnable exhibit with the prediction stated first; (c) the
actual output; (d) the true model as one bolded law; (e) one line honoring
where the false model came from.

## 9. Hard checklist per act (validated mechanically)

- Exactly 7 lessons, ids `aNl1..aNl7`; one boss; 10–16 codex entries.
- Every challenge: solution passes its own validation in CPython 3.11.
- Every quiz question: exactly 4 options, `answer` in 0..3, non-empty `explain`.
- No `input(`, no backticks, no `${` inside any `py` field.
- All XP values within specified ranges.
- Every extra (`extras[]`): required stable id `aNlMx<n>`, kind in
  echo/cursed/ward, per-kind hint count and XP range (§3), solution passes its
  validation in CPython, unmodified starter fails it.
- Every trace (`trace[]`): required stable id `aNlMt<n>`, exactly 4 options,
  `answer` in 0..3, non-empty `explain`; the code is **executed** — stripped
  stdout must equal `options[answer]` exactly, or the code must die of the
  exception type named in `raises`.
