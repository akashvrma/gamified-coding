// ============================================================
// act3.js — Act III: The Department of Mysteries
// Functions & Program Structure: def, parameters, return,
// scope, lambdas, exceptions, files, imports.
// Written to docs/CONTENT_SPEC.md (v1).
// ============================================================

const py = String.raw;

import rite from './act3rite.js';

export default {
  id: 'act3',
  numeral: 'III',
  arc: 'Functions & Program Structure',
  title: 'The Department of Mysteries',
  tagline: 'The doors have no handles, the corridors rearrange, and the dead keep working.',
  sigil: '🔮',
  epigraph: {
    text: 'Do not ask what lies behind the doors. Ask why the doors were given locks on the outside.',
    source: 'unsigned notes of an Unspeakable, recovered after the flood',
  },
  intro: 'Nine levels beneath the visible world, the Department of Mysteries keeps what the '
    + 'surface cannot bear to know — and it keeps it *organized*. That is the horror and the '
    + 'lesson of this place: dread, filed correctly.\n\n'
    + 'Until now you have written incantations that run once, top to bottom, and are gone. In '
    + 'this act you learn structure: how to seal a working into a **function** with `def`, feed '
    + 'it **parameters**, and take back what it **returns**; where names live and die (**scope**); '
    + 'how to pass spells from hand to hand as values (`lambda`, `sorted(key=...)`); how to '
    + 'contain failure instead of dying of it (`try`, `except`, `raise`); how to pour memory '
    + 'into files that outlast the moment (`open`, `with`); and how to bind other volumes into '
    + 'your own (`import`). Seven doors. Then the flooded levels, and what walks up out of them.',

  lessons: [

    // ----------------------------------------------------------
    // a3l1 — Forging Spells
    // ----------------------------------------------------------
    {
      id: 'a3l1',
      title: 'Forging Spells',
      concept: 'def, parameters vs arguments, return vs print, and None',
      xp: 32,
      narrative: 'The lift falls past every floor that admits to existing and opens on a circular '
        + 'room of black doors. An Unspeakable waits — or the robe waits; whether anyone is inside '
        + 'it never becomes clear. Its first teaching is chalked on a slate: *a working spoken once '
        + 'is weather; a working named is a weapon.* Everything you have written so far ran once '
        + 'and dissolved. Here you will seal your incantations into names — spells that can be '
        + 'invoked a thousand times, that take what they are given and hand something back.',
      sections: [
        {
          heading: 'def — sealing a working into a name',
          body: 'A **function** is a named, reusable block of code. Think of it as a sealed '
            + 'scroll: writing the scroll and breaking its seal are different acts.\n\n'
            + 'You create one with `def`, followed by the name, parentheses, and a colon. The '
            + 'indented lines beneath are the **body** — the working itself.\n\n'
            + '- `def` only *creates* the function and binds it to the name. The body does not run yet.\n'
            + '- Writing the name with parentheses — `open_door()` — is a **call**. That is what runs the body.\n'
            + '- A function can be called any number of times; each call runs the body from the top.\n\n'
            + 'One more mark you will find chalked into the trials ahead: `pass` is a placeholder '
            + 'statement that does nothing — it holds a required indented body open until you '
            + 'replace it with real code. Delete it when your real working arrives.',
          code: py`def open_door():
    print("The handleless door swings inward.")

# The def above did nothing visible. Calling is what acts:
open_door()
open_door()`,
        },
        {
          heading: 'Parameters and arguments',
          body: 'A function becomes powerful when it accepts input. Names listed between the '
            + 'parentheses of the `def` line are **parameters** — empty slots, waiting.\n\n'
            + 'The actual values you place in those slots when you call the function are '
            + '**arguments**. Each call binds the parameters afresh: `seer` and `year` mean one '
            + 'thing during the first call below, another during the second, and nothing at all '
            + 'in between.',
          code: py`def label_orb(seer, year):
    print(f"Orb of {seer}, catalogued {year}")

label_orb("Cassandra", 1802)   # "Cassandra" and 1802 are arguments
label_orb("Mopsus", 1750)      # fresh values, same working`,
          note: 'The distinction is worth keeping sharp: **parameter** is the name in the '
            + 'definition; **argument** is the value at the call. The Unspeakables file them in '
            + 'separate drawers, and so should you.',
        },
        {
          heading: 'return — handing the result back',
          body: 'So far your functions only `print` — they shout into the room and keep nothing. '
            + '`print` writes text to the screen, and then the value is spent.\n\n'
            + '`return` is different: it ends the function **immediately** and hands a value back '
            + 'to whoever called it. The call expression itself *becomes* that value — you can '
            + 'store it in a variable, pass it onward, or fold it into a larger working.\n\n'
            + 'And if a function never reaches a `return`? It still hands something back: `None`, '
            + 'Python’s word for *nothing here*. Every function returns; some just return silence.',
          code: py`def orb_shelf(row, position):
    return row * 100 + position

spot = orb_shelf(9, 7)
print(spot)                              # 907 — the value came back
print(orb_shelf(1, 2) + orb_shelf(3, 4)) # returned values combine

def shout(word):
    print(word)          # shouts, but returns nothing

echo = shout("Silence")
print(echo)              # None — the call handed back only silence`,
          note: '`None` is not the string `"None"`, not zero, not an error. It is a real value '
            + 'meaning *absence* — the sound a function makes when it has nothing to give. If a '
            + 'variable you expected to hold a result holds `None` instead, you almost certainly '
            + 'printed where you should have returned.',
        },
        {
          heading: 'Autopsy: “print is how a function answers”',
          body: 'You may believe by now: *“print is how a function gives back its answer — I '
            + 'watched the number appear.”* The Department keeps a working that died of that '
            + 'belief, and tonight the jar is opened. Read it and commit to a prediction '
            + 'before the reveal: the believer expects `8`, then `9`.',
          code: py`def double(n):
    print(n * 2)          # a shout — text, sent to the human

result = double(4)        # the believer predicts: result holds 8
print(result + 1)         # the believer predicts: 9`,
          note: 'What actually happens: `8` appears — then the working dies of '
            + '`TypeError: unsupported operand type(s) for +: \'NoneType\' and \'int\'`. '
            + '`double` shouted at the screen and returned nothing, so `result` holds `None`, '
            + 'and `None + 1` is nonsense the machine refuses to compute. **The law: `print` '
            + 'sends text to a human; `return` hands a value to the code. Only a returned '
            + 'value can travel onward.** The false model was honestly earned — in every '
            + 'working before this act, the screen was the only place a result ever needed '
            + 'to go, so printing and producing looked identical. They part ways here.',
        },
      ],
      challenge: {
        title: 'The Cataloguer’s Trial',
        prompt: 'In the Hall of Prophecy the racks stretch beyond the lamplight, and every orb '
          + 'must bear a label and a shelf-number before the lamps go out. The robe hands you the '
          + 'branding iron.\n\n'
          + 'Write **two functions**:\n\n'
          + '- `inscribe(seer, subject)` — two parameters. **Returns** (does not print) exactly '
          + 'the string `Prophecy: SEER concerning SUBJECT`, where SEER and SUBJECT are the '
          + 'argument values. Example: `inscribe("Trelawney", "the serpent")` returns '
          + '`Prophecy: Trelawney concerning the serpent`.\n'
          + '- `orb_number(row, shelf)` — **returns** the integer `row * 100 + shelf`. Example: '
          + '`orb_number(9, 7)` returns `907`.\n\n'
          + 'Nothing needs to be printed. The ward will call your functions itself.',
        starter: py`# Two workings for the Hall of Prophecy.

def inscribe(seer, subject):
    # TODO: RETURN the string "Prophecy: <seer> concerning <subject>"
    # (return it — do not print it)
    pass


def orb_number(row, shelf):
    # TODO: RETURN row * 100 + shelf
    pass
`,
        solution: py`def inscribe(seer, subject):
    return f"Prophecy: {seer} concerning {subject}"


def orb_number(row, shelf):
    return row * 100 + shelf
`,
        hints: [
          'A function hands a value back with `return`, not `print()`. If the ward says you returned None, you printed instead of returning.',
          'Build the label with an f-string: `f"Prophecy: {seer} concerning {subject}"` — then return that string.',
          'The whole body of `inscribe` is one line: `return f"Prophecy: {seer} concerning {subject}"`. The whole body of `orb_number` is `return row * 100 + shelf`.',
        ],
        validation: py`r = inscribe("Trelawney", "the serpent")
assert r is not None, "inscribe handed back None — the Hall records nothing. Use return, not print."
assert isinstance(r, str), "inscribe must return a string label."
assert r == "Prophecy: Trelawney concerning the serpent", "The label is misforged. Expected exactly: Prophecy: Trelawney concerning the serpent"
assert inscribe("Croaker", "the Veil") == "Prophecy: Croaker concerning the Veil", "inscribe must work for any seer and subject — build the label from the parameters, not fixed text."
assert inscribe("", "silence") == "Prophecy:  concerning silence", "Even a nameless seer receives a label. Do not add or trim characters."
n = orb_number(9, 7)
assert n is not None, "orb_number handed back None — return the number."
assert isinstance(n, int), "orb_number must return an integer, not a string."
assert n == 907, "orb_number(9, 7) should be 907 — row * 100 + shelf."
assert orb_number(0, 3) == 3, "Row zero exists in the Hall. orb_number(0, 3) should be 3."
assert orb_number(12, 0) == 1200, "orb_number(12, 0) should be 1200."`,
        successText: 'The orb accepts your label and dims, satisfied — and a thousand unlabelled others turn very slightly toward you.',
        xp: 65,
      },
      quiz: [
        {
          q: 'In `def brand(mark, depth):` and the call `brand("orb", 3)` — what are `mark`, `depth`, and `"orb"`?',
          options: [
            '`mark` and `depth` are arguments; `"orb"` is a parameter',
            '`mark` and `depth` are parameters; `"orb"` is an argument',
            'All three are parameters',
            'All three are arguments',
          ],
          answer: 1,
          explain: 'Parameters are the named slots in the def line; arguments are the actual '
            + 'values supplied at the call. `mark` and `depth` wait in the definition; `"orb"` '
            + 'and `3` arrive when the function is invoked.',
        },
        {
          q: 'Given `def shout(word): print(word)` — what does `print(shout("dusk"))` display?',
          options: [
            '`dusk` on one line, then `None` on the next',
            '`dusk` twice',
            '`None` only',
            '`dusk` only',
          ],
          answer: 0,
          explain: 'The call runs first: shout prints `dusk`. But shout has no return, so the '
            + 'call itself evaluates to None — and the outer print dutifully displays that None. '
            + 'Printing is not returning.',
        },
        {
          q: 'Which statement about `return` is true?',
          options: [
            '`return` displays a value on the screen',
            '`return` may only appear once per function',
            '`return` ends the function immediately and hands its value to the caller',
            'A function without `return` cannot be called',
          ],
          answer: 2,
          explain: 'return terminates the call on the spot and delivers the value to the caller. '
            + 'It displays nothing (that is print’s job), it can appear many times, and functions '
            + 'without it are perfectly callable — they just return None.',
        },
        {
          q: 'What happens at the moment Python reads a `def` block, before any call?',
          options: [
            'The body runs once, as a test',
            'The function is created and bound to its name; the body waits',
            'Nothing — `def` lines are ignored like comments',
            'Python immediately asks for the arguments',
          ],
          answer: 1,
          explain: 'def is an act of creation, not execution: it forges the function object and '
            + 'binds the name. The body only runs when called — which is why a def with a bug in '
            + 'its logic can sit quietly until the first invocation.',
        },
      ],
      extras: [
        {
          id: 'a3l1x1',
          kind: 'echo',
          title: 'Echo: The Twelve Doors',
          prompt: 'The circular room turns, and when it stills, every door needs a fresh plate '
            + 'and a fresh code. The same craft echoes back at you.\n\n'
            + '- `door_plate(keeper, chamber)` — **returns** (never prints) exactly the string '
            + '`CHAMBER, kept by KEEPER`. Example: `door_plate("Croaker", "Time")` returns '
            + '`Time, kept by Croaker` — note the chamber comes first.\n'
            + '- `door_code(level, door)` — **returns** the integer `level * 12 + door`. '
            + 'Example: `door_code(3, 4)` returns `40`.',
          starter: py`def door_plate(keeper, chamber):
    # return "<chamber>, kept by <keeper>"
    pass


def door_code(level, door):
    pass
`,
          solution: py`def door_plate(keeper, chamber):
    return f"{chamber}, kept by {keeper}"


def door_code(level, door):
    return level * 12 + door
`,
          hints: [
            'Both bodies are single return lines — no print anywhere. The chamber goes FIRST on the plate, even though the keeper is the first parameter.',
            'door_plate: return f"{chamber}, kept by {keeper}" — and door_code: return level * 12 + door.',
          ],
          validation: py`p = door_plate("Croaker", "Time")
assert p is not None, "door_plate handed back None — return the plate, do not print it."
assert p == "Time, kept by Croaker", "The plate is misforged. Expected exactly: Time, kept by Croaker — the chamber comes first."
assert door_plate("Bode", "Space") == "Space, kept by Bode", "door_plate must build the plate from its parameters, not fixed text."
assert door_plate("", "Death") == "Death, kept by ", "Even an unnamed keeper is recorded. Add or trim nothing."
c = door_code(3, 4)
assert c is not None, "door_code handed back None — return the number."
assert c == 40, "door_code(3, 4) should be 40 — level * 12 + door."
assert door_code(0, 7) == 7, "The surface counts as level zero: door_code(0, 7) should be 7."
assert door_code(9, 0) == 108, "door_code(9, 0) should be 108."`,
          successText: 'The plates seat themselves, and the room rotates once — approval, or appetite.',
          xp: 18,
        },
        {
          id: 'a3l1x2',
          kind: 'echo',
          title: 'Echo: The Vault of Drawers',
          prompt: 'Below the Hall of Prophecy lie the cold vaults, where what is no longer '
            + 'foretold is filed away. Every drawer wants a plate and a code.\n\n'
            + '- `coffin_plate(name, year)` — **returns** (never prints) exactly the string '
            + '`NAME, taken YEAR`. Example: `coffin_plate("Elspeth Crane", 1877)` returns '
            + '`Elspeth Crane, taken 1877`.\n'
            + '- `vault_code(wing, drawer)` — **returns** the integer `wing * 40 + drawer`. '
            + 'Example: `vault_code(3, 7)` returns `127`.',
          starter: py`def coffin_plate(name, year):
    pass


def vault_code(wing, drawer):
    pass
`,
          solution: py`def coffin_plate(name, year):
    return f"{name}, taken {year}"


def vault_code(wing, drawer):
    return wing * 40 + drawer
`,
          hints: [
            'Both bodies are single return lines — no print anywhere. Build the plate with an f-string from both parameters, in the order given.',
            'coffin_plate: return f"{name}, taken {year}" — and vault_code: return wing * 40 + drawer.',
          ],
          validation: py`assert "coffin_plate" in dir(), "The Codex finds no coffin_plate — the working must bear exactly that name."
assert "vault_code" in dir(), "The Codex finds no vault_code — the working must bear exactly that name."
p = coffin_plate("Elspeth Crane", 1877)
assert p is not None, "coffin_plate handed back None — return the plate, do not print it."
assert isinstance(p, str), "coffin_plate must return a string plate."
assert p == "Elspeth Crane, taken 1877", "The plate is misforged. Expected exactly: Elspeth Crane, taken 1877"
assert coffin_plate("Bode", 1899) == "Bode, taken 1899", "coffin_plate must build the plate from its parameters, not fixed text."
assert coffin_plate("", 1900) == ", taken 1900", "Even the nameless are dated. Add or trim nothing."
c = vault_code(3, 7)
assert c is not None, "vault_code handed back None — return the number."
assert isinstance(c, int), "vault_code must return an integer, not a string."
assert c == 127, "vault_code(3, 7) should be 127 — wing * 40 + drawer."
assert vault_code(0, 5) == 5, "The ground wing counts as zero: vault_code(0, 5) should be 5."
assert vault_code(9, 0) == 360, "vault_code(9, 0) should be 360."`,
          successText: 'The plate slides home and the drawer takes its number with a sound like a knuckle cracking.',
          xp: 16,
        },
        {
          id: 'a3l1x3',
          kind: 'refactor',
          title: 'The Second Hand: The Bloated Brand',
          prompt: 'The registry keeps one working that tells the truth in twelve live lines '
            + 'where five would serve. The Unspeakables do not rewrite what works — they '
            + '**reduce** it, and the reduction must not change one grain of behavior. This '
            + 'is the Trial of the Second Hand.\n\n'
            + 'The starter’s `shelf_labels(seers)` takes a list of seer names and returns a '
            + 'list of labels `Orb of NAME` — in order, skipping any empty-string names, `[]` '
            + 'for an empty shelf. It already does all of this correctly.\n\n'
            + 'Mend it **in place**:\n\n'
            + '- keep the name `shelf_labels` and identical behavior on every input\n'
            + '- your whole submission, comments and blank lines aside, must stand at '
            + '**five live lines or fewer**\n'
            + '- no semicolon-stitching — the ward counts statements, not just lines',
          starter: py`# The Second Hand: this working already tells the truth — it is
# merely bloated. Mend IN PLACE: same name, same behavior, at most
# FIVE live lines once comments and blanks are stripped away.

def shelf_labels(seers):
    labels = []
    seen_any = False
    for seer in seers:
        name = seer
        if name != "":
            seen_any = True
            labels.append("Orb of " + name)
    if seen_any == False:
        return []
    result = labels
    return result
`,
          solution: py`def shelf_labels(seers):
    return ["Orb of " + seer for seer in seers if seer != ""]
`,
          hints: [
            'Observe before cutting: which lines ever change what comes back? The seen_any flag guards a case the empty list already answers, name is a shadow of seer, and result a shadow of labels. Strike the shadows and the flag first.',
            'The idiom: a list comprehension gathers and filters in one line — [expression for item in sequence if test] builds the whole list at once.',
            'The cut: the entire body is one line — return ["Orb of " + seer for seer in seers if seer != ""]. The empty shelf answers [] on its own.',
          ],
          validation: py`def _ref_labels(seers):
    out = []
    for seer in seers:
        if seer != "":
            out.append("Orb of " + seer)
    return out

assert "shelf_labels" in dir(), "The Codex finds no shelf_labels — the mended working must keep its name exactly."
_trials = [
    [],
    [""],
    ["Cassandra"],
    ["Cassandra", "", "Mopsus", "Tycho"],
    ["", "", ""],
    ["Croaker", "Bode", "Croaker"],
]
for _t in _trials:
    try:
        _got = shelf_labels(list(_t))
    except TypeError:
        raise AssertionError("shelf_labels could not be summoned with a single list — the mend must keep its one-parameter shape: shelf_labels(seers).")
    _want = _ref_labels(_t)
    assert _got == _want, "The behavior broke: shelf_labels(" + repr(_t) + ") must still return " + repr(_want) + " but gave " + repr(_got) + ". The Second Hand reshapes; it never changes what the working does."
_live = [_ln.strip() for _ln in _source.splitlines() if _ln.strip() != "" and not _ln.strip().startswith("#")]
assert all(";" not in _l for _l in _live), "A semicolon stitches several statements onto one line — the ward counts statements, not just lines. Unstitch it and truly compress the logic."
assert len(_live) <= 5, "Still too heavy: " + str(len(_live)) + " live lines remain, and the registry accepts five at most. Fold the flag, the shadow names, and the loop into fewer, truer lines — a comprehension carries the whole hunt."`,
          successText: 'Twelve lines become two, and the working is not merely smaller — it is finally visible at a glance. The second hand cuts; it never breaks.',
          xp: 50,
        },
      ],
      trace: [
        {
          id: 'a3l1t1',
          code: py`def kindle(wick):
    print("lit: " + wick)

flame = kindle("black taper")
print(flame)`,
          q: 'The scrying: what does this working print?',
          options: [
            'lit: black taper\nlit: black taper',
            'lit: black taper',
            'lit: black taper\nNone',
            'An error — flame was never given a value',
          ],
          answer: 2,
          explain: 'kindle prints its message but has no return, so the call itself hands back '
            + 'None — and the outer print faithfully displays it. Printing is not returning '
            + '(option one), print(None) is not silence (option two), and the assignment is '
            + 'legal: flame holds a real value, None (option four).',
        },
        {
          id: 'a3l1t2',
          code: py`def gate(depth):
    if depth > 5:
        return "sealed"
    return "open"
    print("beyond the veil")

print(gate(9))
print(gate(2))`,
          q: 'The scrying: what does this working print?',
          options: [
            'sealed\nopen',
            'sealed\nopen\nbeyond the veil',
            'sealed\nbeyond the veil\nopen\nbeyond the veil',
            'open\nopen',
          ],
          answer: 0,
          explain: 'return ends the call on the spot: depth 9 takes the first return, depth 2 '
            + 'the second. The final print stands after an unconditional return and can never '
            + 'run — dead code, silently unreachable. The function did not need to finish its '
            + 'body to answer; return IS the finishing.',
        },
      ],
    },

    // ----------------------------------------------------------
    // a3l2 — The Shape of a Spell
    // ----------------------------------------------------------
    {
      id: 'a3l2',
      title: 'The Shape of a Spell',
      concept: 'default parameter values, keyword arguments, *args and **kwargs',
      xp: 33,
      narrative: 'The second door opens on the Chamber of Instruments: rows of brass mechanisms, '
        + 'each with slots for what it consumes. Some slots stand pre-filled with a dull grey '
        + 'default, content to be ignored. Some demand to be addressed by name before they accept '
        + 'anything. And one machine at the far end takes whatever is poured into it — one '
        + 'offering or a hundred — and does not complain. The robe gestures at the rows: *learn '
        + 'the shapes. Feed a machine wrongly and you will learn what it does with mistakes.*',
      sections: [
        {
          heading: 'Default values — a slot already filled',
          body: 'A parameter can carry a **default value**, written with `=` in the `def` line. '
            + 'If the caller supplies that argument, the default is ignored; if the caller omits '
            + 'it, the default quietly fills the slot.\n\n'
            + '- Defaults make an argument *optional*.\n'
            + '- Parameters with defaults must come **after** parameters without them: '
            + '`def ward(target, strength=3):` is legal; the reverse is not.',
          code: py`def ward(target, strength=3):
    return f"{target} warded at strength {strength}"

print(ward("the lift"))        # strength falls back to 3
print(ward("the Veil", 9))     # the caller overrides the default`,
          note: 'A trap for later, filed now: a default is created **once**, when `def` runs — '
            + 'not at every call. Give a parameter a default of `[]` and every call shares the '
            + '*same* list, accumulating each other’s leavings. When you need a fresh list per '
            + 'call, default to `None` and build the list inside the body.',
        },
        {
          heading: 'Keyword arguments — naming what you pass',
          body: 'At the call site you may pass any argument by its parameter’s name: '
            + '`ward(strength=9, target="the door")`. These are **keyword arguments**.\n\n'
            + '- Among keyword arguments, order stops mattering.\n'
            + '- They document the call: `bind("Muffliato", silent=True)` reads; `bind("Muffliato", True)` mumbles.\n'
            + '- One law is absolute: **positional arguments must come before keyword arguments**. '
            + '`bind(name="Nox", 2)` is a SyntaxError — Python refuses to guess where the bare `2` belongs.',
          code: py`def bind(name, power=1, silent=False):
    if silent:
        return f"{name} bound at power {power}, without a sound"
    return f"{name} bound at power {power}"

print(bind("Colloportus", power=4))
print(bind("Muffliato", silent=True, power=2))  # keyword order is free`,
        },
        {
          heading: '*args and **kwargs — spells of unknown appetite',
          body: 'Some workings cannot know in advance how much they will be fed. Two shapes '
            + 'handle this:\n\n'
            + '- A parameter written `*args` gathers **all extra positional arguments** into a '
            + '**tuple**. The star does the gathering; the name `args` is only convention.\n'
            + '- A parameter written `**kwargs` gathers **all extra keyword arguments** into a '
            + '**dict** of name to value.\n\n'
            + 'You will *read* these shapes constantly in other people’s spells. Write them '
            + 'sparingly — a function that accepts anything promises nothing.',
          code: py`def gather(*args, **kwargs):
    print("positional offerings:", args)
    print("named offerings:     ", kwargs)

gather(1, 2, 3, sigil="veil", depth=9)

def total(*levels):
    result = 0
    for level in levels:
        result = result + level
    return result

print(total(3, 4, 5))   # 12
print(total())          # 0 — feeding it nothing is allowed`,
        },
      ],
      challenge: {
        title: 'Wards of Variable Strength',
        prompt: 'The Chamber’s registry must accept bindings however the Unspeakables phrase '
          + 'them — terse, named, or omitted entirely — and it must total the power of any number '
          + 'of wards at once.\n\n'
          + 'Write **two functions**:\n\n'
          + '- `bind_spell(name, power=1)` — `power` defaults to `1`. **Returns** exactly the '
          + 'string `NAME bound at power POWER`. It must work called with just a name, with a '
          + 'positional power, or with `power=` as a keyword.\n'
          + '- `total_power(*levels)` — accepts **any number** of positional numeric arguments '
          + 'and **returns** their sum. Called with no arguments at all, it returns `0`.',
        starter: py`# Two shapes for the Chamber of Instruments.

def bind_spell(name, power):
    # TODO: give power a default of 1 in the line above,
    # then return "<name> bound at power <power>"
    pass


# TODO: define total_power so it accepts ANY number of
# positional arguments and returns their sum (0 for none).
`,
        solution: py`def bind_spell(name, power=1):
    return f"{name} bound at power {power}"


def total_power(*levels):
    result = 0
    for level in levels:
        result = result + level
    return result
`,
        hints: [
          'The default lives in the def line: `def bind_spell(name, power=1):`. Then return an f-string built from both parameters.',
          'For total_power, put a star on the parameter: `def total_power(*levels):`. Inside the body, `levels` is a tuple you can loop over.',
          'Start a counter at 0, add each level with a for loop, and return the counter. With no arguments the loop never runs, so 0 comes back on its own.',
        ],
        validation: py`assert bind_spell("Lumos") == "Lumos bound at power 1", "Called with only a name, power must fall back to its default of 1."
assert bind_spell("Reducto", 5) == "Reducto bound at power 5", "A positional power must override the default."
assert bind_spell("Nox", power=8) == "Nox bound at power 8", "bind_spell must accept power as a keyword argument."
assert total_power() == 0, "An empty invocation carries no power — total_power() must return 0."
assert total_power(7) == 7, "A single offering: total_power(7) should be 7."
assert total_power(1, 2, 3, 4) == 10, "total_power(1, 2, 3, 4) should be 10."
assert total_power(5, -2) == 3, "Drained wards count against the total: total_power(5, -2) should be 3."`,
        successText: 'The registry swallows every phrasing without complaint — which is precisely what makes the Unspeakables trust it, and you uneasy.',
        xp: 70,
      },
      quiz: [
        {
          q: 'Given `def ward(target, strength=3):`, what happens on the call `ward("the lift")`?',
          options: [
            'An error — strength was not supplied',
            'The call runs with strength = 3, the default',
            'The call runs with strength = None',
            'The call runs with strength = 0',
          ],
          answer: 1,
          explain: 'A parameter with a default is optional. Omit it and the default fills the '
            + 'slot — 3 here. No error, no None; that is the entire purpose of defaults.',
        },
        {
          q: 'Which call is a SyntaxError?',
          options: [
            '`bind("Nox", 2)`',
            '`bind("Nox", power=2)`',
            '`bind(name="Nox", 2)`',
            '`bind(name="Nox", power=2)`',
          ],
          answer: 2,
          explain: 'Positional arguments must come before keyword arguments. Once you have '
            + 'named an argument, a bare positional value after it leaves Python unable to tell '
            + 'which slot it belongs to — so it refuses outright.',
        },
        {
          q: 'Inside `def gather(*shards):`, what is `shards`?',
          options: [
            'A tuple holding all the positional arguments passed',
            'A list holding all the positional arguments passed',
            'A dict of argument names to values',
            'Only the first argument',
          ],
          answer: 0,
          explain: 'The single star gathers every extra positional argument into a tuple. A dict '
            + 'of names to values is what the double star (**kwargs) collects.',
        },
        {
          q: 'What does `**kwargs` collect?',
          options: [
            'All positional arguments, squared',
            'The extra keyword arguments, as a dict of name to value',
            'The function’s return values',
            'Every global variable in the program',
          ],
          answer: 1,
          explain: 'The double star gathers keyword arguments the def line did not name '
            + 'explicitly, into a dict. It has nothing to do with arithmetic or globals — the '
            + 'stars are gathering syntax, not multiplication.',
        },
      ],
      extras: [
        {
          id: 'a3l2x1',
          kind: 'echo',
          title: 'Echo: The Dosing Bench',
          prompt: 'A second bench of brass instruments, the same shapes wearing different '
            + 'fittings.\n\n'
            + '- `label_vial(contents, potency=1)` — `potency` defaults to `1`. **Returns** '
            + 'exactly the string `CONTENTS at potency POTENCY`. It must work called with just '
            + 'the contents, with a positional potency, or with `potency=` as a keyword.\n'
            + '- `combined_dose(*drops)` — accepts **any number** of positional numbers and '
            + '**returns** their sum; called with nothing, it returns `0`.',
          starter: py`def label_vial(contents, potency):
    # give potency a default of 1 above, then return the label
    pass


# define combined_dose so it accepts any number of drops
`,
          solution: py`def label_vial(contents, potency=1):
    return f"{contents} at potency {potency}"


def combined_dose(*drops):
    total = 0
    for drop in drops:
        total = total + drop
    return total
`,
          hints: [
            'The default lives in the def line — def label_vial(contents, potency=1): — and the star lives in the other: def combined_dose(*drops):.',
            'Inside combined_dose, drops is a tuple: start total at 0, add each drop in a loop, return total.',
          ],
          validation: py`assert label_vial("dittany") == "dittany at potency 1", "With no potency given, the default of 1 must fill the slot."
assert label_vial("moonseed", 6) == "moonseed at potency 6", "A positional potency must override the default."
assert label_vial("hemlock", potency=9) == "hemlock at potency 9", "label_vial must accept potency as a keyword argument."
assert combined_dose() == 0, "An empty bench doses nothing — combined_dose() must return 0."
assert combined_dose(4) == 4, "A single offering: combined_dose(4) should be 4."
assert combined_dose(1, 2, 3) == 6, "combined_dose(1, 2, 3) should be 6."
assert combined_dose(10, -4) == 6, "Antidotes count against the dose: combined_dose(10, -4) should be 6."`,
          successText: 'Every phrasing feeds cleanly, and the machine at the far end does not even pause.',
          xp: 18,
        },
        {
          id: 'a3l2x2',
          kind: 'cursed',
          title: 'Cursed Scroll: The Watch That Never Disbands',
          prompt: 'A scroll from the flooded levels, still running, still wrong. The night '
            + 'watch was mustered with two names and the day watch with two others — yet the '
            + 'ledger reports **both** watches at four men, and the day watch answers with the '
            + 'night’s dead in its ranks. No error is ever raised. The scroll runs clean, and '
            + 'it lies.\n\n'
            + 'Mend it **in place** — do not rewrite the working from nothing. When mended:\n\n'
            + '- a muster with **no watch given** must begin a genuinely fresh watch, every time\n'
            + '- a watch **passed in explicitly** must still be honoured\n'
            + '- the two printed lines must each hold exactly their own two names',
          starter: py`# The Watch Ledger. It runs without error — and it lies.
# Mend the working IN PLACE; do not rewrite it from nothing.

def muster(name, watch=[]):
    # a recruit joins the given watch; with no watch given,
    # a NEW watch is (supposedly) begun for them
    watch.append(name)
    return watch


def report(label, watch):
    return label + ": " + ", ".join(watch)


night = muster("Bode")
night = muster("Croaker", night)

day = muster("Rookwood")
day = muster("Selwyn", day)

print(report("night watch", night))
print(report("day watch", day))
`,
          solution: py`# The Watch Ledger — mended in place.

def muster(name, watch=None):
    # a recruit joins the given watch; with no watch given,
    # a NEW watch truly begins for them
    if watch is None:
        watch = []
    watch.append(name)
    return watch


def report(label, watch):
    return label + ": " + ", ".join(watch)


night = muster("Bode")
night = muster("Croaker", night)

day = muster("Rookwood")
day = muster("Selwyn", day)

print(report("night watch", night))
print(report("day watch", day))
`,
          hints: [
            'Observe before you cut: call muster("test") twice with no watch and print what comes back each time — then look hard at what the “fresh” watch already contains.',
            'The false model: “watch=[] builds a new list at each call.” It does not. The default value is created ONCE, when Python reads the def line — and every bare call shares that one list.',
            'The mend is two lines: def muster(name, watch=None): — then inside the body, if watch is None: watch = [] before the append. Now each bare call truly begins fresh.',
          ],
          validation: py`w1 = muster("Alpha")
assert w1 == ["Alpha"], "A muster with no watch given must begin a FRESH watch — this one arrived already holding earlier recruits. The default list is created once, at def, and shared by every call."
w2 = muster("Omega")
assert w2 == ["Omega"], "The second bare muster still remembers the first — each call without a watch must build its own new list. Default to None and create the list inside the body."
assert w1 == ["Alpha"], "Enlisting Omega altered Alpha's watch — the two musters share one list. They must not."
assert muster("Two", ["One"]) == ["One", "Two"], "A watch passed in explicitly must still be honoured: muster('Two', ['One']) should be ['One', 'Two']."
assert report("dawn", ["a", "b"]) == "dawn: a, b", "report must not change — label, colon, space, names joined by comma-space."
lines = [l for l in _stdout.splitlines() if l.strip()]
assert "night watch: Bode, Croaker" in lines, "The night watch should muster exactly Bode and Croaker."
assert "day watch: Rookwood, Selwyn" in lines, "The day watch should muster exactly Rookwood and Selwyn — no dead men carried over from the night."`,
          successText: 'Named and broken: the mutable default argument — forged once at def, shared by every call that leans on it, mended with None.',
          xp: 30,
        },
        {
          id: 'a3l2x3',
          kind: 'echo',
          title: 'Echo: The Sconce Ledger',
          prompt: 'The corridors are lit by sconces, and the wax is accounted for like '
            + 'everything else down here.\n\n'
            + '- `light_sconce(hall, candles=1)` — `candles` defaults to `1`. **Returns** '
            + 'exactly the string `HALL lit by CANDLES candles`. It must work called with '
            + 'just a hall, with a positional count, or with `candles=` as a keyword.\n'
            + '- `wax_spent(*stubs)` — accepts **any number** of positional numbers and '
            + '**returns** their sum; called with nothing, it returns `0`.',
          starter: py`def light_sconce(hall, candles):
    # candles should default to 1
    pass


# define wax_spent to accept any number of stubs
`,
          solution: py`def light_sconce(hall, candles=1):
    return f"{hall} lit by {candles} candles"


def wax_spent(*stubs):
    total = 0
    for stub in stubs:
        total = total + stub
    return total
`,
          hints: [
            'The default lives in one def line — light_sconce(hall, candles=1) — and the star in the other: def wax_spent(*stubs).',
            'Inside wax_spent, stubs is a tuple: start a total at 0, add each stub in a loop, and return the total.',
          ],
          validation: py`assert "light_sconce" in dir(), "The Codex finds no light_sconce — the working must bear exactly that name."
assert "wax_spent" in dir(), "The Codex finds no wax_spent — the working must bear exactly that name."
try:
    r = light_sconce("the round room")
except TypeError:
    raise AssertionError("light_sconce refused a lone hall — give candles a default of 1 in the def line, so the count may be omitted.")
assert r == "the round room lit by 1 candles", "Called with only a hall, candles must fall back to its default of 1."
assert light_sconce("the tank row", 6) == "the tank row lit by 6 candles", "A positional count must override the default."
assert light_sconce("the lift shaft", candles=9) == "the lift shaft lit by 9 candles", "light_sconce must accept candles as a keyword argument."
try:
    t = wax_spent()
except TypeError:
    raise AssertionError("wax_spent refused an empty call — a starred parameter (*stubs) accepts any number of offerings, including none.")
assert t == 0, "An unlit night spends nothing — wax_spent() must return 0."
assert wax_spent(4) == 4, "A single offering: wax_spent(4) should be 4."
assert wax_spent(1, 2, 3) == 6, "wax_spent(1, 2, 3) should be 6."
assert wax_spent(7, -2) == 5, "Reclaimed wax counts against the total: wax_spent(7, -2) should be 5."`,
          successText: 'The sconces take their count in any phrasing, and the dark between them keeps its own.',
          xp: 17,
        },
      ],
      trace: [
        {
          id: 'a3l2t1',
          code: py`def gather(relic, hoard=[]):
    hoard.append(relic)
    return hoard

print(gather("ash"))
print(gather("bone"))`,
          q: 'The scrying: what does this working print?',
          options: [
            "['ash']\n['bone']",
            "['ash', 'bone']\n['ash', 'bone']",
            'ash\nbone',
            "['ash']\n['ash', 'bone']",
          ],
          answer: 3,
          explain: 'The default list is created once, when def runs — and both calls share it. '
            + 'The first call prints its one relic; by the second, the same list has '
            + 'accumulated both. A fresh list per call (option one) is exactly what a mutable '
            + 'default does NOT give you — the Cursed Scroll on this page asks you to break '
            + 'that very curse.',
        },
        {
          id: 'a3l2t2',
          code: py`def brand(name, depth=2, silent=False):
    if silent:
        return f"{name}:{depth}:hushed"
    return f"{name}:{depth}"

print(brand("veil", silent=True))
print(brand("orb", 7))`,
          q: 'The scrying: what does this working print?',
          options: [
            'veil:2\norb:7',
            'veil:2:hushed\norb:7',
            'veil:True:hushed\norb:7',
            'An error — depth must be supplied before silent',
          ],
          answer: 1,
          explain: 'A keyword argument lands in its named slot: silent=True leaves depth at its '
            + 'default of 2, so the first line reads veil:2:hushed. In the second call the bare '
            + '7 fills the next positional slot — depth. Nothing is illegal here; defaults make '
            + 'the skipped slots optional.',
        },
      ],
    },

    // ----------------------------------------------------------
    // a3l3 — The Boundaries of Power
    // ----------------------------------------------------------
    {
      id: 'a3l3',
      title: 'The Boundaries of Power',
      concept: 'scope — local vs global names, shadowing, and why mutating globals corrupts',
      xp: 34,
      narrative: 'There is a ledger in the Department that every working may read and none may '
        + 'touch. The robe explains why exactly once, and quietly. Years ago an Unspeakable let '
        + 'his functions write straight into shared ink — each spell adjusting totals no caller '
        + 'ever saw. The corruption spread working by working until nobody could say what any '
        + 'spell truly did anymore, and the floor was sealed with him still on it. The lesson '
        + 'outlived him, chalked on the slate: *power passes in through the front door and out '
        + 'through the same — or it rots the whole house.*',
      sections: [
        {
          heading: 'Local names live and die inside the circle',
          body: 'A variable assigned inside a function is **local**: it is born when the call '
            + 'begins and destroyed when the call returns. Outside the function, it simply does '
            + 'not exist — using it there raises a `NameError`.\n\n'
            + 'Picture a chalk circle drawn for one ritual. Whatever names you conjure inside it '
            + 'are swept away when the circle is scrubbed — and every new call draws a fresh '
            + 'circle. This region where a name is visible is called its **scope**.',
          code: py`def kindle():
    flame = "green"          # local — born inside this call
    print("inside the circle:", flame)

kindle()
kindle()                     # a fresh circle, a fresh flame
# print(flame)  # <- would raise NameError: the local died at return`,
        },
        {
          heading: 'Reading out, writing in: shadowing',
          body: 'Names assigned at the file’s top level are **global** — visible everywhere in '
            + 'the file. A function may freely **read** a global.\n\n'
            + 'But the moment a function *assigns* to that name, Python creates a **new local** '
            + 'with the same name. The local **shadows** the global — stands in front of it, '
            + 'inside that function only — and the global itself is untouched. Beginners read '
            + 'the code below and expect 99 at the end. Scope says otherwise.',
          code: py`depth = 9                  # global — top level of the file

def report():
    print("the lift reads depth:", depth)   # reading a global: fine

def rename():
    depth = 99             # a NEW local named depth — a shadow
    print("inside rename:", depth)

report()
rename()
print("outside, unchanged:", depth)   # still 9`,
        },
        {
          heading: 'Why mutating globals corrupts a program',
          body: 'Python does provide a key to the ledger: the `global` keyword lets a function '
            + 'rebind a global name. Treat it as a curse. A function that silently rewrites '
            + 'shared state acts *at a distance* — the call site shows nothing changing, so '
            + 'every caller must be read, and feared, together. Such functions cannot be tested '
            + 'alone and cannot be trusted alone.\n\n'
            + 'The Unspeakables’ discipline instead: **pass values in as arguments; return '
            + 'results out; let the caller store them.** A function that touches only its '
            + 'parameters and locals is predictable — same input, same output, no ghosts.',
          code: py`# The corrupted way — action at a distance:
reserve = 10

def bad_drain():
    global reserve
    reserve = reserve - 3   # no caller ever sees this cost

# The clean way — the cost is visible at the call site:
def drained_by(amount, cost):
    return amount - cost

reserve = drained_by(reserve, 3)
print(reserve)   # 7 — and the line above SHOWS the change happening`,
          note: 'The sealed floor is real in every large codebase: one `global` invites the '
            + 'next, until the program is a single haunted room where anything might change '
            + 'anything. You will not use the `global` keyword again in this Codex.',
        },
      ],
      challenge: {
        title: 'The Untouched Ledger',
        prompt: 'The starter code holds the ledger: `ward_strength = 10`. You will compute '
          + 'drains and restorations against it **without ever touching it** — no reassigning '
          + '`ward_strength`, no `global` keyword. Values in, values out.\n\n'
          + 'Write **two functions**:\n\n'
          + '- `drained(strength, cost)` — **returns** `strength - cost`, but never less than '
          + '`0`. Example: `drained(4, 9)` returns `0`, not `-5`.\n'
          + '- `restored(strength, amount)` — **returns** `strength + amount`, but never more '
          + 'than `100`. Example: `restored(90, 20)` returns `100`.\n\n'
          + 'Both functions must work purely from their parameters. The ward will check that '
          + 'the ledger still reads exactly `10` when your code has finished.',
        starter: py`ward_strength = 10   # the ledger — leave this line, and leave it be

def drained(strength, cost):
    # TODO: return strength - cost, but never less than 0
    pass


def restored(strength, amount):
    # TODO: return strength + amount, but never more than 100
    pass
`,
        solution: py`ward_strength = 10   # the ledger — read, never touched

def drained(strength, cost):
    result = strength - cost
    if result < 0:
        result = 0
    return result


def restored(strength, amount):
    result = strength + amount
    if result > 100:
        result = 100
    return result
`,
        hints: [
          'Work only with the parameters. Compute `strength - cost` into a local variable, then clamp it before returning.',
          'Clamping is an if: `if result < 0: result = 0` — then `return result`. restored mirrors it with `> 100` and a cap of 100.',
          'drained in three lines: `result = strength - cost`, then `if result < 0: result = 0`, then `return result`. Build restored the same way, capped at 100.',
        ],
        validation: py`assert drained(10, 3) == 7, "drained(10, 3) should be 7."
assert drained(5, 5) == 0, "An exact drain leaves nothing: drained(5, 5) should be 0."
assert drained(4, 9) == 0, "The ledger never reads below zero: drained(4, 9) should be 0, not negative."
assert drained(100, 0) == 100, "A costless drain changes nothing: drained(100, 0) should be 100."
assert restored(10, 5) == 15, "restored(10, 5) should be 15."
assert restored(90, 20) == 100, "The cap holds: restored(90, 20) should be 100."
assert restored(100, 1) == 100, "Already full: restored(100, 1) should stay 100."
assert restored(0, 0) == 0, "Nothing restored to nothing is still nothing: restored(0, 0) should be 0."
assert ward_strength == 10, "The ledger itself was altered — your code must not reassign ward_strength or use the global keyword. Pass values in, return values out."`,
        successText: 'The ledger reads ten, as it read ten before you came — and the sealed floor below stays sealed.',
        xp: 70,
      },
      quiz: [
        {
          q: 'A function assigns `count = 9` inside its body, and nothing else uses that name. After the function returns, what is `count` outside it?',
          options: [
            '9',
            '0',
            'It does not exist — the local died with the call; using it raises NameError',
            'None',
          ],
          answer: 2,
          explain: 'Locals live only for the duration of the call. Once the function returns, '
            + 'the name is gone as though it never was — outside, Python raises NameError, not '
            + 'a leftover value.',
        },
        {
          q: '`depth = 4` sits at the top of the file. Inside a function you write `depth = 40` with no `global` keyword. What have you done?',
          options: [
            'Changed the global to 40',
            'Created a new local `depth` that shadows the global; the global stays 4',
            'Caused an error — a name cannot be reused inside a function',
            'Created a constant',
          ],
          answer: 1,
          explain: 'Assignment inside a function creates a local. The local shadows — stands in '
            + 'front of — the global within that function, and the global is untouched. This '
            + 'silent shadowing is why many "my variable didn’t change" hauntings occur.',
        },
        {
          q: 'Why do disciplined sorcerers shun the `global` keyword?',
          options: [
            'It is slower than local access',
            'It lets a function change shared state invisibly, so call sites lie about what happens',
            'It only works in old versions of Python',
            'It makes the variable immutable',
          ],
          answer: 1,
          explain: 'The rot is invisibility: a call like `bad_drain()` shows nothing being '
            + 'modified, yet the shared state shifts. Every function touching that global '
            + 'becomes entangled with every other. Performance is not the issue — trust is.',
        },
        {
          q: 'What is the clean alternative to a function that mutates a global total?',
          options: [
            'Print the total instead of storing it',
            'Give the global a longer, scarier name',
            'Take the total as a parameter and return the new total for the caller to store',
            'Delete the global after each call',
          ],
          answer: 2,
          explain: 'Pass values in, return values out. `total = add_cost(total, 3)` shows the '
            + 'change at the call site, keeps the function testable in isolation, and leaves no '
            + 'hidden hand on the ledger.',
        },
      ],
      extras: [
        {
          id: 'a3l3x1',
          kind: 'echo',
          title: 'Echo: The Lamp Ledger',
          prompt: 'Another ledger, the same discipline. The starter holds `lamp_oil = 12` — '
            + 'read it if you like, but never touch it: no reassignment, no `global`.\n\n'
            + '- `spent(oil, hours)` — **returns** `oil - hours`, but never less than `0`.\n'
            + '- `refilled(oil, amount)` — **returns** `oil + amount`, but never more than `24`.\n\n'
            + 'The ward will check the ledger still reads exactly `12` when your code has finished.',
          starter: py`lamp_oil = 12   # the ledger — read, never touched

def spent(oil, hours):
    pass


def refilled(oil, amount):
    pass
`,
          solution: py`lamp_oil = 12   # the ledger — read, never touched

def spent(oil, hours):
    result = oil - hours
    if result < 0:
        result = 0
    return result


def refilled(oil, amount):
    result = oil + amount
    if result > 24:
        result = 24
    return result
`,
          hints: [
            'Work purely from the parameters: compute the new value into a local, clamp it with an if, then return it.',
            'spent: result = oil - hours; if result < 0: result = 0; return result. refilled mirrors it, capped at 24.',
          ],
          validation: py`assert spent(12, 5) == 7, "spent(12, 5) should be 7."
assert spent(3, 3) == 0, "An exact burn leaves nothing: spent(3, 3) should be 0."
assert spent(2, 9) == 0, "The ledger never reads below zero: spent(2, 9) should be 0, not negative."
assert refilled(12, 6) == 18, "refilled(12, 6) should be 18."
assert refilled(20, 10) == 24, "The reservoir caps at 24: refilled(20, 10) should be 24."
assert refilled(24, 1) == 24, "Already brimming: refilled(24, 1) should stay 24."
assert refilled(0, 0) == 0, "Nothing added to nothing is still nothing."
assert lamp_oil == 12, "The ledger itself was altered — pass values in, return values out, and leave lamp_oil be."`,
          successText: 'The lamps burn on borrowed arithmetic, and the ledger never once feels your hand.',
          xp: 18,
        },
        {
          id: 'a3l3x2',
          kind: 'echo',
          title: 'Echo: The Tank Gauge',
          prompt: 'The preserved failures float at a pressure the gauge alone may declare. '
            + 'The starter holds `tank_pressure = 6` — read it if you must, never touch it: '
            + 'no reassignment, no `global`.\n\n'
            + '- `vented(pressure, loss)` — **returns** `pressure - loss`, but never less than `0`.\n'
            + '- `pumped(pressure, gain)` — **returns** `pressure + gain`, but never more than `12`.\n\n'
            + 'The ward will check the gauge still reads exactly `6` when your code has finished.',
          starter: py`tank_pressure = 6   # the gauge — read, never touched

def vented(pressure, loss):
    pass


def pumped(pressure, gain):
    pass
`,
          solution: py`tank_pressure = 6   # the gauge — read, never touched

def vented(pressure, loss):
    result = pressure - loss
    if result < 0:
        result = 0
    return result


def pumped(pressure, gain):
    result = pressure + gain
    if result > 12:
        result = 12
    return result
`,
          hints: [
            'Work purely from the parameters: compute the new value into a local, clamp it with an if, then return it — the gauge global is never assigned.',
            'vented: result = pressure - loss; if result < 0: result = 0; return result. pumped mirrors it, capped at 12.',
          ],
          validation: py`assert "vented" in dir(), "The Codex finds no vented — the working must bear exactly that name."
assert "pumped" in dir(), "The Codex finds no pumped — the working must bear exactly that name."
assert vented(6, 2) == 4, "vented(6, 2) should be 4."
assert vented(3, 3) == 0, "An exact venting leaves nothing: vented(3, 3) should be 0."
assert vented(2, 7) == 0, "The gauge never reads below zero: vented(2, 7) should be 0, not negative."
assert vented(12, 0) == 12, "A costless venting changes nothing: vented(12, 0) should be 12."
assert pumped(6, 3) == 9, "pumped(6, 3) should be 9."
assert pumped(10, 5) == 12, "The tank caps at 12: pumped(10, 5) should be 12."
assert pumped(12, 1) == 12, "Already at the red line: pumped(12, 1) should stay 12."
assert pumped(0, 0) == 0, "Nothing pumped into nothing is still nothing."
assert tank_pressure == 6, "The gauge itself was altered — your code must not reassign tank_pressure or use the global keyword. Pass values in, return values out."`,
          successText: 'The needle never moves, and the thing in the tank goes on failing at exactly six.',
          xp: 16,
        },
      ],
      trace: [
        {
          id: 'a3l3t1',
          code: py`depth = 9

def sink():
    depth = 90
    print(depth)

sink()
print(depth)`,
          q: 'The scrying: what does this working print?',
          options: [
            '90\n9',
            '90\n90',
            '9\n9',
            'An error — depth is defined twice',
          ],
          answer: 0,
          explain: 'Assignment inside a function creates a LOCAL. Inside sink, that local (90) '
            + 'shadows the global; the moment the call returns, the shadow dies, and the '
            + 'global — never touched — still reads 9. Reusing the name is no error; it is '
            + 'scope doing its quiet, treacherous work.',
        },
        {
          id: 'a3l3t2',
          code: py`fuel = 5

def burn(cost):
    remaining = fuel - cost
    return remaining

print(burn(2))
print(burn(4))
print(fuel)`,
          q: 'The scrying: what does this working print?',
          options: [
            '3\n1\n1',
            'An error — fuel is not visible inside burn',
            '3\n1\n5',
            '3\n-1\n5',
          ],
          answer: 2,
          explain: 'A function may freely READ a global, so each call computes from fuel = 5: '
            + 'first 3, then 1. remaining is a fresh local in each call, and nothing ever '
            + 'assigns to fuel, which still reads 5. Option four is the trap: calls do not '
            + 'remember each other’s locals — every circle is drawn fresh.',
        },
      ],
    },

    // ----------------------------------------------------------
    // a3l4 — Nameless Magic
    // ----------------------------------------------------------
    {
      id: 'a3l4',
      title: 'Nameless Magic',
      concept: 'functions as values, lambda, sorted(key=...), map and filter',
      xp: 35,
      narrative: 'Deeper in, you pass workings that have no names at all — small spells traded '
        + 'from hand to hand like coins, spent where they are needed and never spoken of again. '
        + 'The robe demonstrates: it hands one function to another as though passing a key, and '
        + 'the second performs the first without ever knowing what it was given. This is the '
        + 'discipline of nameless magic. A function is a *thing* — it can be held, given, '
        + 'listed, chosen among. Tonight you learn to hold spells the way the dead hold '
        + 'grudges: firmly, and without needing to say the name.',
      sections: [
        {
          heading: 'A function is a value',
          body: 'In Python, a function is an object, exactly as an `int` or a `str` is. The '
            + 'name you gave it with `def` is only a variable that happens to hold a function.\n\n'
            + 'That means you can:\n\n'
            + '- bind it to another name — **without parentheses**; parentheses mean *call now*\n'
            + '- pass it as an argument to another function\n'
            + '- store it in a list or dict and choose one later\n\n'
            + 'A function that receives or returns another function is called a **higher-order '
            + 'function**. They are how you hand behavior around, not just data.',
          code: py`def toll(name):
    return f"The bell tolls for {name}"

rite = toll                    # no parentheses — the function itself
print(rite("the ninth door"))  # both names ring the same bell

def perform(spell, target):
    return spell(target)       # call whatever function was handed in

print(perform(toll, "the archivist"))`,
        },
        {
          heading: 'lambda — a spell too small to name',
          body: 'A **lambda** is a function with no name: `lambda parameters: expression`. The '
            + 'expression after the colon is computed and returned automatically — no `return` '
            + 'keyword, and no statements, just the one expression.\n\n'
            + '- `lambda n: n * 2` is a function value like any other.\n'
            + '- Use a lambda where a tiny, throwaway function is needed for a single moment.\n'
            + '- Anything longer than one clear expression deserves a `def` and a name.',
          code: py`doubled = lambda n: n * 2
print(doubled(13))     # 26

# The def equivalent — same working, with a name:
def doubled_def(n):
    return n * 2

print(doubled_def(13))`,
          note: 'Assigning a lambda to a name, as above, is only for demonstration — if a spell '
            + 'is worth a name, forge it with `def`. The lambda’s true habitat is the next '
            + 'section: slipped inline into another function’s hands, used once, never named.',
        },
        {
          heading: 'sorted(key=...) — ordering by a chosen truth',
          body: '`sorted(iterable)` returns a **new** sorted list and leaves the original '
            + 'untouched. Its `key` parameter accepts a *function*: Python calls it once per '
            + 'element and sorts by what it returns, not by the elements themselves.\n\n'
            + '- `key=lambda orb: orb[1]` sorts tuples by their second field.\n'
            + '- Add `reverse=True` to order highest first.\n'
            + '- This is nameless magic at work: the key function is handed over, used, discarded.',
          code: py`orbs = [("Tycho", 3), ("Cassandra", 9), ("Mopsus", 6)]

by_threat = sorted(orbs, key=lambda orb: orb[1], reverse=True)
print(by_threat)   # most dangerous first
print(orbs)        # the original shelf is unchanged`,
        },
        {
          heading: 'map and filter — and why you may not need them',
          body: 'Two ancient higher-order functions take a function and a sequence:\n\n'
            + '- `map(f, seq)` applies `f` to every element.\n'
            + '- `filter(f, seq)` keeps only the elements where `f` returns a truthy value.\n\n'
            + 'Both return a lazy **iterator**, not a list — wrap them in `list()` to see the '
            + 'contents. You already know a clearer form: the comprehensions of Act II say the '
            + 'same thing and show their logic openly. Read map and filter fluently in others’ '
            + 'grimoires; in your own, prefer the comprehension unless a function is already in hand.',
          code: py`years = [1802, 1750, 1899]

print(list(map(lambda y: y + 100, years)))
print(list(filter(lambda y: y > 1800, years)))

# The same workings as comprehensions — usually the clearer form:
print([y + 100 for y in years])
print([y for y in years if y > 1800])`,
        },
        {
          heading: 'The spell that summons itself',
          body: 'A function may call any function — including itself. This is **recursion**: '
            + 'a working that performs one step, then invokes itself to finish the rest.\n\n'
            + 'Two parts, always:\n\n'
            + '- The **base case** — the condition under which the function stops and simply '
            + 'returns. It is the ward against infinite descent; omit it and the calls never end.\n'
            + '- The **recursive case** — do one step, then call yourself with a *smaller* '
            + 'problem, each call one stair closer to the base case.\n\n'
            + 'Recursion earns its keep when the data itself is nested — structures within '
            + 'structures, rooms within rooms. For walking a flat sequence, a plain loop says '
            + 'the same thing more clearly and more cheaply.',
          code: py`def descend(steps):
    if steps == 0:                 # the base case — the ward
        print("Bottom. Something is waiting.")
        return
    print(f"Step {steps} — deeper.")
    descend(steps - 1)             # the spell summons itself

descend(3)`,
          note: 'Every unfinished call stands waiting on the one beneath it, and Python will '
            + 'hold only about 1000 such calls before it refuses with a RecursionError — the '
            + 'interpreter’s own ward against a bottomless stair. Descend a thousand steps '
            + 'and the machine itself turns you back.',
        },
      ],
      challenge: {
        title: 'The Ordering of Orbs',
        prompt: 'A shelf of prophecy orbs has come down in the night, and the Unspeakables '
          + 'must know which to fear first. Each orb is a tuple: `(seer, year, danger)` — for '
          + 'example `("Cassandra", 1802, 9)`.\n\n'
          + 'Write **two functions**:\n\n'
          + '- `by_danger(orbs)` — **returns a NEW list** of the orbs ordered by danger '
          + '(index `2`), **highest first**. The original list must be left unchanged — use '
          + '`sorted()` with a `key`, not `.sort()`.\n'
          + '- `dangerous_names(orbs, threshold)` — **returns** a list of just the seer names '
          + '(index `0`) of orbs whose danger is **greater than or equal to** `threshold`, in '
          + 'their original shelf order.\n\n'
          + 'Both must return `[]` when given an empty shelf or when nothing qualifies.',
        starter: py`# Each orb is a tuple: (seer, year, danger)

def by_danger(orbs):
    # TODO: return a NEW list, most dangerous first (index 2).
    # Use sorted() with a key — do not modify the original.
    pass


def dangerous_names(orbs, threshold):
    # TODO: return the seer names (index 0) of orbs whose
    # danger (index 2) is >= threshold, in original order
    pass
`,
        solution: py`def by_danger(orbs):
    return sorted(orbs, key=lambda orb: orb[2], reverse=True)


def dangerous_names(orbs, threshold):
    return [orb[0] for orb in orbs if orb[2] >= threshold]
`,
        hints: [
          'sorted() returns a new list and takes a key function. The danger sits at index 2 of each tuple.',
          'For by_danger: `sorted(orbs, key=lambda orb: orb[2], reverse=True)` — reverse=True puts the highest danger first.',
          'dangerous_names is one comprehension: `[orb[0] for orb in orbs if orb[2] >= threshold]` — the name out front, the test at the back.',
        ],
        validation: py`shelf = [("Cassandra", 1802, 9), ("Tycho", 1899, 3), ("Mopsus", 1750, 6)]
ordered = by_danger(shelf)
assert ordered is not None, "by_danger handed back None — return the sorted list."
assert ordered == [("Cassandra", 1802, 9), ("Mopsus", 1750, 6), ("Tycho", 1899, 3)], "by_danger must order the orbs by danger, highest first."
assert shelf[1] == ("Tycho", 1899, 3), "The original shelf was reordered — by_danger must return a NEW list. Use sorted(), not .sort()."
assert by_danger([]) == [], "An empty shelf sorts to an empty list."
assert dangerous_names(shelf, 6) == ["Cassandra", "Mopsus"], "dangerous_names(shelf, 6) should be the names only, in shelf order: Cassandra, then Mopsus."
assert dangerous_names(shelf, 1) == ["Cassandra", "Tycho", "Mopsus"], "A threshold of 1 keeps every orb, in original order."
assert dangerous_names(shelf, 10) == [], "No orb reaches danger 10 — expected an empty list."
assert dangerous_names([], 5) == [], "An empty shelf names no one."`,
        successText: 'The orbs settle into their new order with a sound like teeth — and the most dangerous of them is now closest to the door.',
        xp: 75,
      },
      quiz: [
        {
          q: 'If `toll` is a function, what does `rite = toll` (no parentheses) do?',
          options: [
            'Calls toll and stores its result in rite',
            'Copies the function’s source code into rite',
            'Raises a TypeError — functions cannot be assigned',
            'Binds a second name to the same function object; `rite(...)` now calls it',
          ],
          answer: 3,
          explain: 'Without parentheses there is no call — you are handling the function itself '
            + 'as a value. Both names now point at one function object. Parentheses are the '
            + 'moment of invocation, nothing else.',
        },
        {
          q: 'Which of these is a lambda that returns its argument tripled?',
          options: [
            '`lambda n: return n * 3`',
            '`lambda n: n * 3`',
            '`lambda(n): n * 3`',
            '`def lambda n: n * 3`',
          ],
          answer: 1,
          explain: 'Parameters come before the colon, a single expression after — and its value '
            + 'is returned automatically. Writing `return` inside a lambda is a SyntaxError, '
            + 'and lambda takes no parentheses around its parameters.',
        },
        {
          q: 'What does `sorted(orbs, key=lambda o: o[2])` return?',
          options: [
            'A new list of the orbs, ordered by each one’s index-2 value',
            'Nothing — it sorts `orbs` in place',
            'The largest element of orbs',
            'A list containing only the index-2 values',
          ],
          answer: 0,
          explain: 'sorted always builds a new list and leaves the original alone (that is '
            + '.sort()’s territory, and only on lists). The key function is consulted for '
            + 'ordering, but the full elements — not the keys — populate the result.',
        },
        {
          q: 'In Python 3, `map(f, items)` hands you…',
          options: [
            'A list, immediately computed',
            'A lazy iterator — wrap it in `list()` to see the results',
            'A dict of inputs to outputs',
            'Nothing — it modifies items in place',
          ],
          answer: 1,
          explain: 'map and filter are lazy: they produce an iterator that computes values only '
            + 'as they are consumed. Print one raw and you get an unhelpful object tag — '
            + 'list() forces the working to completion.',
        },
        {
          q: 'In a recursive function, what is the base case?',
          options: [
            'The first call, made from outside the function',
            'The condition where the function stops calling itself and simply returns',
            'The largest input the function can accept',
            'The line where the function calls itself',
          ],
          answer: 1,
          explain: 'The base case is the ward: the branch that returns without another '
            + 'self-call, so the descent ends. Without one, the function summons itself until '
            + 'Python halts it with a RecursionError — the self-call is the descent, not the '
            + 'stopping of it.',
        },
      ],
      extras: [
        {
          id: 'a3l4x1',
          kind: 'echo',
          title: 'Echo: The Shelf of Tomes',
          prompt: 'A different shelf has come down in the night: tomes this time, each a tuple '
            + '`(title, year, rot)` — for example `("Case 91", 1802, 4)`. The Unspeakables '
            + 'read oldest first.\n\n'
            + '- `oldest_first(tomes)` — **returns a NEW list** of the tomes ordered by year '
            + '(index `1`), **lowest first**. Use `sorted()` with a `key`; the original list '
            + 'must be left unchanged.\n'
            + '- `rotted_titles(tomes, limit)` — **returns** a list of just the titles '
            + '(index `0`) of tomes whose rot (index `2`) is **greater than or equal to** '
            + '`limit`, in original shelf order.\n\n'
            + 'Both must return `[]` for an empty shelf or when nothing qualifies.',
          starter: py`# Each tome is a tuple: (title, year, rot)

def oldest_first(tomes):
    pass


def rotted_titles(tomes, limit):
    pass
`,
          solution: py`def oldest_first(tomes):
    return sorted(tomes, key=lambda tome: tome[1])


def rotted_titles(tomes, limit):
    return [tome[0] for tome in tomes if tome[2] >= limit]
`,
          hints: [
            'The year sits at index 1, and sorted() already puts the lowest first — sorted(tomes, key=lambda tome: tome[1]) needs no reverse.',
            'rotted_titles is one comprehension: [tome[0] for tome in tomes if tome[2] >= limit].',
          ],
          validation: py`shelf = [("Case 91", 1802, 4), ("The Veil Papers", 1750, 9), ("Inventory of Doors", 1899, 2)]
ordered = oldest_first(shelf)
assert ordered is not None, "oldest_first handed back None — return the sorted list."
assert ordered == [("The Veil Papers", 1750, 9), ("Case 91", 1802, 4), ("Inventory of Doors", 1899, 2)], "oldest_first must order the tomes by year, lowest first."
assert shelf[0] == ("Case 91", 1802, 4), "The original shelf was reordered — return a NEW list with sorted(), not .sort()."
assert oldest_first([]) == [], "An empty shelf sorts to an empty list."
assert rotted_titles(shelf, 4) == ["Case 91", "The Veil Papers"], "rotted_titles(shelf, 4) should keep only titles with rot 4 or more, in shelf order."
assert rotted_titles(shelf, 1) == ["Case 91", "The Veil Papers", "Inventory of Doors"], "A limit of 1 keeps every tome, in original order."
assert rotted_titles(shelf, 10) == [], "Nothing rots that far — expected an empty list."
assert rotted_titles([], 3) == [], "An empty shelf names nothing."`,
          successText: 'The tomes settle by age, and the rot answers title by title — the shelf knows its own decay.',
          xp: 20,
        },
        {
          id: 'a3l4x2',
          kind: 'echo',
          title: 'Echo: The Night Watch Roster',
          prompt: 'The night roster has come down from the ninth level, and the wardens '
            + 'must be ranked before the lamps are doused. Each posting is a tuple: '
            + '`(name, corridor, dread)` — for example `("Una Thorn", "tank row", 9)`.\n\n'
            + '- `by_dread(wardens)` — **returns a NEW list** of the postings ordered by '
            + 'dread (index `2`), **highest first**. Use `sorted()` with a `key`; the '
            + 'original list must be left unchanged.\n'
            + '- `haunted_names(wardens, threshold)` — **returns** a list of just the names '
            + '(index `0`) of postings whose dread is **greater than or equal to** '
            + '`threshold`, in original roster order.\n\n'
            + 'Both must return `[]` for an empty roster or when nothing qualifies.',
          starter: py`# Each posting is a tuple: (name, corridor, dread)

def by_dread(wardens):
    pass


def haunted_names(wardens, threshold):
    pass
`,
          solution: py`def by_dread(wardens):
    return sorted(wardens, key=lambda posting: posting[2], reverse=True)


def haunted_names(wardens, threshold):
    return [posting[0] for posting in wardens if posting[2] >= threshold]
`,
          hints: [
            'The dread sits at index 2 — sorted(wardens, key=lambda posting: posting[2], reverse=True) puts the worst corridor first and leaves the roster untouched.',
            'haunted_names is one comprehension: [posting[0] for posting in wardens if posting[2] >= threshold].',
          ],
          validation: py`assert "by_dread" in dir(), "The Codex finds no by_dread — the working must bear exactly that name."
assert "haunted_names" in dir(), "The Codex finds no haunted_names — the working must bear exactly that name."
roster = [("Marlowe Fen", "east stair", 4), ("Una Thorn", "tank row", 9), ("Odile Marsh", "round room", 6)]
ordered = by_dread(roster)
assert ordered is not None, "by_dread handed back None — return the sorted list; .sort() returns nothing."
assert ordered == [("Una Thorn", "tank row", 9), ("Odile Marsh", "round room", 6), ("Marlowe Fen", "east stair", 4)], "by_dread must order the postings by dread (index 2), highest first."
assert roster[0] == ("Marlowe Fen", "east stair", 4), "The original roster was reordered — by_dread must return a NEW list. Use sorted(), not .sort()."
assert by_dread([]) == [], "An empty roster sorts to an empty list."
assert haunted_names(roster, 6) == ["Una Thorn", "Odile Marsh"], "haunted_names(roster, 6) should be the names only, in roster order: Una Thorn, then Odile Marsh."
assert haunted_names(roster, 1) == ["Marlowe Fen", "Una Thorn", "Odile Marsh"], "A threshold of 1 keeps every warden, in original order."
assert haunted_names(roster, 10) == [], "No corridor reaches dread 10 tonight — expected an empty list."
assert haunted_names([], 5) == [], "An empty roster names no one."`,
          successText: 'The roster reorders itself worst-first, and the tank row, as always, tops the list.',
          xp: 18,
        },
      ],
      trace: [
        {
          id: 'a3l4t1',
          code: py`def toll(name):
    return f"bell for {name}"

rite = toll
print(rite("the archivist"))
print(toll is rite)`,
          q: 'The scrying: what does this working print?',
          options: [
            'bell for the archivist\nFalse',
            'bell for the archivist\nTrue',
            'An error — toll cannot be assigned without parentheses',
            'bell for toll\nTrue',
          ],
          answer: 1,
          explain: 'rite = toll, without parentheses, binds a second name to the SAME function '
            + 'object — calling rite rings toll, and `is` confirms one object under two names. '
            + 'No copy is made, and the assignment is perfectly legal: a function is a value, '
            + 'exactly as an int is.',
        },
        {
          id: 'a3l4t2',
          code: py`orbs = [("Tycho", 3), ("Mopsus", 6), ("Cassandra", 9)]
first = sorted(orbs, key=lambda o: o[1], reverse=True)[0]
print(first[0])
print(len(orbs))`,
          q: 'The scrying: what does this working print?',
          options: [
            'Tycho\n3',
            '9\n3',
            'Cassandra\n9',
            'Cassandra\n3',
          ],
          answer: 3,
          explain: 'reverse=True puts the highest key first, and the key is o[1] — so the first '
            + 'element of the new list is ("Cassandra", 9), and first[0] is the seer’s name. '
            + 'The key only decides the ordering; the full tuples fill the result. And sorted '
            + 'built a NEW list — orbs still holds all three, so len is 3.',
        },
      ],
    },

    // ----------------------------------------------------------
    // a3l5 — Containment Wards
    // ----------------------------------------------------------
    {
      id: 'a3l5',
      title: 'Containment Wards',
      concept: 'exceptions — try/except/else/finally, raising ValueError, and the bare-except trap',
      xp: 36,
      narrative: 'One room is nothing but tanks — greenish fluid, and in every tank a failure. '
        + 'Not creatures. *Failures*, preserved: each jar a working that went wrong in a way '
        + 'nobody predicted, kept so it can never go wrong twice. The robe raps a tank with one '
        + 'knuckle and the thing inside flinches. The slate reads: *everything fails. The craft '
        + 'is deciding where the failure is allowed to stop.* Tonight you build containment — '
        + 'wards that catch one named disaster, refuse bad offerings at the threshold, and '
        + 'reseal themselves whether the working lives or dies.',
      sections: [
        {
          heading: 'When a spell fails: exceptions',
          body: 'When an operation cannot proceed — turning `"nine"` into an integer, dividing '
            + 'by zero — Python **raises an exception**: an object describing the failure, with '
            + 'a type such as `ValueError` or `ZeroDivisionError`. Unhandled, it stops the '
            + 'program and prints a traceback.\n\n'
            + 'A `try` block is a containment tank around dangerous lines:\n\n'
            + '- The `try:` body runs normally — until something raises.\n'
            + '- At the first raise, Python abandons the rest of the `try` body and looks for a '
            + 'matching `except`.\n'
            + '- `except ValueError:` catches exactly that type; the program then *continues*, alive.',
          code: py`scrawl = "nine"

try:
    count = int(scrawl)
    print("counted:", count)      # skipped — the line above raised
except ValueError:
    print("not a number — the ward absorbed the failure")

print("the floor still stands")   # execution continues past the tank`,
        },
        {
          heading: 'else and finally — the full ward',
          body: 'Two more clauses complete the containment:\n\n'
            + '- `else:` runs **only if the try body raised nothing** — the place for work that '
            + 'should happen on success but stay outside the tank.\n'
            + '- `finally:` runs **no matter what** — success, failure, even an early `return`. '
            + 'It is where you reseal: closing what was opened, releasing what was held.',
          code: py`runes = ["3", "x", "12"]

for rune in runes:
    try:
        value = int(rune)
    except ValueError:
        print(rune, "-> refused")
    else:
        print(rune, "-> accepted as", value)
    finally:
        print("   (the tank reseals)")`,
        },
        {
          heading: 'raise — refusing bad offerings yourself',
          body: 'Your own functions must guard their own doors. When an argument is '
            + 'unacceptable, **raise** an exception at the threshold:\n\n'
            + '- `raise ValueError("the tank would shatter")` creates the exception, with a '
            + 'message, and hurls it up to the caller.\n'
            + '- Fail **loudly at the door** rather than corrupt quietly deep inside — a wrong '
            + 'answer that looks right is far worse than a crash.\n'
            + '- Callers who expect the refusal can catch it with `except ValueError as err:` '
            + 'and read the message from `err`.',
          code: py`def open_tank(pressure):
    if pressure > 10:
        raise ValueError("the tank would shatter")
    return f"tank open at pressure {pressure}"

print(open_tank(4))

try:
    open_tank(99)
except ValueError as err:
    print("refused:", err)`,
        },
        {
          heading: 'The bare except — a ward that eats everything',
          body: 'Writing `except:` with **no type** catches *every* exception — including ones '
            + 'that are nothing but your own bugs: the `NameError` from a misspelled variable, '
            + 'the `TypeError` from a wrong argument. The ward devours the evidence, the program '
            + 'limps on wrong, and you hunt a silent corruption for hours.\n\n'
            + '- Always name the exception you expect. Catch the **narrowest** type that fits.\n'
            + '- If you truly cannot handle a failure, let it rise — a loud crash close to the '
            + 'cause is a gift.',
          code: py`def read_pressure(dial):
    try:
        return int(dial)
    except ValueError:      # catch ONLY what you expect
        return 0

print(read_pressure("12"))
print(read_pressure("veil"))
# A bare "except:" here would also have swallowed a misspelled
# variable name — and that bug would rot, unseen, for weeks.`,
        },
        {
          heading: 'The ward’s anatomy',
          body: 'A confession, this deep in: every trial you have passed on every floor was '
            + 'judged by lines like these — `assert condition, "message"`. If the condition '
            + 'holds, `assert` does nothing at all; if it fails, it raises an `AssertionError` '
            + 'carrying the message. That is the entire machinery of judgement.\n\n'
            + 'The ward-smith’s three laws:\n\n'
            + '- **Test the promise** — call the working with lawful inputs and assert the exact values it owes you.\n'
            + '- **Test the edge** — the boundaries are where impostors hide; the middle mostly tests itself.\n'
            + '- **Test the refusal** — offer it something forbidden inside `try`/`except` and assert the exception truly came. A ward that admits everything guards nothing.\n\n'
            + 'The surface world calls this craft **testing**, and its common rite is *pytest*: '
            + 'files of functions named `test_...`, each full of these same asserts, discovered '
            + 'and run by a single command, failures reported plainly. The Forge cannot run '
            + 'pytest — but every assert you write here is that craft, unrenamed.',
          code: py`def check_seal(candidate):
    assert candidate(4) == 8, "a lawful doubling came back wrong"
    refused = False
    try:
        candidate(-1)          # the forbidden offering
    except ValueError:
        refused = True
    assert refused, "the refusal never came"`,
        },
      ],
      challenge: {
        title: 'The Pressure Seals',
        prompt: 'The tanks feed on a shared power reserve, and the seals must refuse any draw '
          + 'that would break them — loudly, by name, at the threshold.\n\n'
          + 'Write **two functions**:\n\n'
          + '- `draw_power(reserve, amount)` — the strict seal:\n'
          + '  - if `amount` is less than or equal to `0`, raise `ValueError("nothing to draw")`\n'
          + '  - if `amount` is greater than `reserve`, raise `ValueError("the reserve would break")`\n'
          + '  - otherwise **return** `reserve - amount`\n'
          + '- `safe_draw(reserve, amount)` — the contained caller: call `draw_power(reserve, amount)` '
          + 'inside a `try` and return its result; if it raises `ValueError`, catch it and '
          + 'return `reserve` unchanged.',
        starter: py`# Two workings for the pressure seals.

def draw_power(reserve, amount):
    # TODO:
    #  - amount <= 0        -> raise ValueError("nothing to draw")
    #  - amount > reserve   -> raise ValueError("the reserve would break")
    #  - otherwise          -> return reserve - amount
    pass


def safe_draw(reserve, amount):
    # TODO: try draw_power(reserve, amount) and return its result;
    # if it raises ValueError, return reserve unchanged
    pass
`,
        solution: py`def draw_power(reserve, amount):
    if amount <= 0:
        raise ValueError("nothing to draw")
    if amount > reserve:
        raise ValueError("the reserve would break")
    return reserve - amount


def safe_draw(reserve, amount):
    try:
        return draw_power(reserve, amount)
    except ValueError:
        return reserve
`,
        hints: [
          'draw_power is two guard clauses and a return: check the two bad cases first, raising ValueError with the exact message for each, then return the difference.',
          'The raise syntax: `raise ValueError("nothing to draw")` — it ends the function on the spot, like a return that screams.',
          'safe_draw wraps one call: `try: return draw_power(reserve, amount)` then `except ValueError: return reserve`. The except clause is the whole safety net.',
        ],
        validation: py`assert draw_power(10, 4) == 6, "A lawful draw: draw_power(10, 4) should return 6."
assert draw_power(5, 5) == 0, "Draining the reserve exactly is allowed: draw_power(5, 5) should be 0."

raised = False
try:
    draw_power(10, 0)
except ValueError as err:
    raised = True
    assert "nothing" in str(err), "The zero-draw refusal must carry the message: nothing to draw"
assert raised, "draw_power(10, 0) must raise ValueError — a draw of nothing is a malformed rite."

raised = False
try:
    draw_power(10, -3)
except ValueError:
    raised = True
assert raised, "A negative draw must also raise ValueError."

raised = False
try:
    draw_power(3, 5)
except ValueError as err:
    raised = True
    assert "break" in str(err), "Overdrawing must raise ValueError with the message: the reserve would break"
assert raised, "draw_power(3, 5) must raise ValueError — the reserve cannot cover it."

assert safe_draw(10, 4) == 6, "On a lawful draw, safe_draw returns the new reserve: safe_draw(10, 4) should be 6."
assert safe_draw(10, 50) == 10, "When draw_power refuses, safe_draw must return the reserve unchanged."
assert safe_draw(10, 0) == 10, "safe_draw(10, 0) should return 10 — the refusal is contained, not repeated."
assert safe_draw(0, 1) == 0, "An empty reserve stays empty."`,
        successText: 'The seals refuse, contain, and reseal — and in its tank, one old failure turns away, deprived of company.',
        xp: 75,
      },
      quiz: [
        {
          q: '`int("veil")` fails. Which exception is raised, and which clause catches it?',
          options: [
            'TypeError — caught by `except TypeError:`',
            'ValueError — caught by `except ValueError:`',
            'NameError — caught by `except NameError:`',
            'It does not fail — it returns 0',
          ],
          answer: 1,
          explain: 'The argument has the right *type* (a string) but an unacceptable *value* — '
            + 'so int raises ValueError. TypeError is for wrong kinds of things entirely, like '
            + 'int(["v"]).',
        },
        {
          q: 'When does the `else` clause of a `try` statement run?',
          options: [
            'Always, immediately after finally',
            'Only when the try body raised an exception',
            'Only when the try body raised no exception',
            'Only when there is no except clause',
          ],
          answer: 2,
          explain: 'else is the success path: it runs only if the try body completed without '
            + 'raising. It exists so success-only work can sit outside the guarded block, where '
            + 'its own failures will not be mistaken for the one you meant to catch.',
        },
        {
          q: 'What is guaranteed about a `finally` clause?',
          options: [
            'It runs only if the try body succeeded',
            'It runs only if an exception was raised',
            'It is skipped when the function returns early',
            'It runs no matter what — success, exception, or early return',
          ],
          answer: 3,
          explain: 'finally is unconditional: Python executes it on the way out of the try '
            + 'statement regardless of how the exit happens — even a return inside the try '
            + 'detours through finally first. That is what makes it fit for cleanup.',
        },
        {
          q: 'Your function receives an argument it cannot honour. The disciplined response is…',
          options: [
            'Return None and hope the caller checks',
            'Print a warning and continue anyway',
            'Raise `ValueError` with a message naming what was wrong',
            'Wrap everything in a bare except so nothing escapes',
          ],
          answer: 2,
          explain: 'Fail loudly at the door. A raised ValueError with a clear message stops the '
            + 'corruption at its source and tells the caller exactly what to fix. Returning '
            + 'None invites the failure to surface later, far from its cause — and the bare '
            + 'except is the trap that hides your own bugs.',
        },
      ],
      extras: [
        {
          id: 'a3l5x1',
          kind: 'echo',
          title: 'Echo: The Lift Refuses',
          prompt: 'The lift beneath the Department obeys the same containment law as the '
            + 'tanks: refuse loudly at the threshold, contain the refusal above.\n\n'
            + '- `descend(current, floors)` — the strict machinery:\n'
            + '  - if `floors` is less than or equal to `0`, raise `ValueError("the lift refuses idle orders")`\n'
            + '  - if `current + floors` is greater than `9`, raise `ValueError("nothing lies below the ninth")`\n'
            + '  - otherwise **return** `current + floors`\n'
            + '- `safe_descend(current, floors)` — call `descend(current, floors)` inside a '
            + '`try` and return its result; if it raises `ValueError`, catch it and return '
            + '`current` unchanged.',
          starter: py`def descend(current, floors):
    # floors <= 0           -> ValueError("the lift refuses idle orders")
    # current + floors > 9  -> ValueError("nothing lies below the ninth")
    pass


def safe_descend(current, floors):
    pass
`,
          solution: py`def descend(current, floors):
    if floors <= 0:
        raise ValueError("the lift refuses idle orders")
    if current + floors > 9:
        raise ValueError("nothing lies below the ninth")
    return current + floors


def safe_descend(current, floors):
    try:
        return descend(current, floors)
    except ValueError:
        return current
`,
          hints: [
            'descend is two guard clauses and a return — raise ValueError with the exact message for each unlawful order, then return the new floor.',
            'safe_descend wraps one call: try: return descend(current, floors), then except ValueError: return current.',
          ],
          validation: py`assert descend(2, 3) == 5, "A lawful descent: descend(2, 3) should be 5."
assert descend(0, 9) == 9, "Landing exactly on the ninth floor is lawful: descend(0, 9) should be 9."
raised = False
try:
    descend(4, 0)
except ValueError as err:
    raised = True
    assert "refuses" in str(err), "The idle-order refusal must carry the message: the lift refuses idle orders"
assert raised, "descend(4, 0) must raise ValueError — the lift does not honour idle orders."
raised = False
try:
    descend(4, -2)
except ValueError:
    raised = True
assert raised, "A negative descent must also raise ValueError."
raised = False
try:
    descend(7, 5)
except ValueError as err:
    raised = True
    assert "ninth" in str(err), "The overrun refusal must carry the message: nothing lies below the ninth"
assert raised, "descend(7, 5) must raise ValueError — there is nothing below the ninth."
assert safe_descend(2, 3) == 5, "A lawful order passes straight through: safe_descend(2, 3) should be 5."
assert safe_descend(7, 5) == 7, "When descend refuses, safe_descend must return the current floor unchanged."
assert safe_descend(4, 0) == 4, "safe_descend(4, 0) should be 4 — the refusal is contained, not repeated."`,
          successText: 'The lift refuses what it must and carries what it may — containment, floor by floor.',
          xp: 20,
        },
        {
          id: 'a3l5x2',
          kind: 'ward',
          title: 'The Ward-Craft',
          prompt: 'Every trial on this floor has ended the same way: an unseen ward reading '
            + 'your work and biting when it lied. Tonight the slate turns. **You** forge the '
            + 'ward — and the Department will feed it impostors.\n\n'
            + 'The contract of `brew_strength(herbs, moon_phase)`, the working your ward must '
            + 'interrogate:\n\n'
            + '- returns `herbs * 3`\n'
            + '- returns `5` more than that when `moon_phase` is exactly `"full"`\n'
            + '- `herbs` of `0` is lawful: `0` on a dark night, `5` under a full moon\n'
            + '- `herbs` below `0` must raise `ValueError`\n\n'
            + 'Write **one function**, `ward(candidate)`. `candidate` is *some implementation* '
            + 'of `brew_strength`, handed to your ward. Call `candidate(...)` with inputs of '
            + 'your choosing and `assert` the whole contract: exact lawful values, the zero '
            + 'boundary, and the refusal — for that last, call it with negative herbs inside '
            + '`try`/`except ValueError` and assert the exception truly came. Your ward must '
            + 'finish **silently** for a lawful candidate and raise `AssertionError` for every '
            + 'impostor.',
          starter: py`# The contract of brew_strength(herbs, moon_phase):
#   - returns herbs * 3
#   - +5 more when moon_phase == "full"
#   - herbs == 0 is lawful (0 dark, 5 full)
#   - herbs < 0 must raise ValueError

def ward(candidate):
    # TODO: assert the promise, the edge, and the refusal
    pass
`,
          solution: py`def ward(candidate):
    # the promise — exact values on lawful inputs
    assert candidate(2, "dark") == 6, "a dark-night brew of 2 herbs must be 6"
    assert candidate(4, "full") == 17, "a full-moon brew of 4 herbs must be 17"
    # the edge — the zero boundary
    assert candidate(0, "dark") == 0, "zero herbs on a dark night must brew 0"
    assert candidate(0, "full") == 5, "zero herbs under a full moon must brew 5"
    # the refusal — the forbidden offering
    refused = False
    try:
        candidate(-1, "dark")
    except ValueError:
        refused = True
    assert refused, "negative herbs must raise ValueError"
`,
          hints: [
            'Begin with the promise: assert candidate(2, "dark") == 6, and an exact full-moon value such as assert candidate(4, "full") == 17. Wrong values on lawful inputs are the first impostors to bite.',
            'Now the edge the contract names: assert candidate(0, "dark") == 0 and candidate(0, "full") == 5. An impostor that is wrong only at zero walks past every other check.',
            'Last, the refusal: set refused = False, call candidate(-1, "dark") inside try/except ValueError, set refused = True inside the except, then assert refused. A candidate that never raises must be bitten too.',
          ],
          validation: py`def _true_brew(herbs, moon_phase):
    if herbs < 0:
        raise ValueError("herbs below zero")
    strength = herbs * 3
    if moon_phase == "full":
        strength = strength + 5
    return strength

def _impostor_moonblind(herbs, moon_phase):
    if herbs < 0:
        raise ValueError("herbs below zero")
    return herbs * 3

def _impostor_offbyone(herbs, moon_phase):
    if herbs < 0:
        raise ValueError("herbs below zero")
    strength = herbs * 3
    if moon_phase == "full":
        strength = strength + 4
    return strength

def _impostor_neverraises(herbs, moon_phase):
    strength = herbs * 3
    if moon_phase == "full":
        strength = strength + 5
    return strength

def _impostor_boundary(herbs, moon_phase):
    if herbs < 0:
        raise ValueError("herbs below zero")
    if herbs == 0:
        return 1
    strength = herbs * 3
    if moon_phase == "full":
        strength = strength + 5
    return strength

def _impostor_wrongbase(herbs, moon_phase):
    if herbs < 0:
        raise ValueError("herbs below zero")
    strength = herbs * 2
    if moon_phase == "full":
        strength = strength + 5
    return strength

assert callable(ward), "The Codex finds no ward(candidate) function to judge with."

try:
    ward(_true_brew)
except AssertionError as e:
    raise AssertionError("Your ward bit the one lawful brewer (" + str(e) + ") — recheck your expected values against the contract: herbs * 3, plus 5 only under a full moon.")
except ValueError:
    raise AssertionError("A refusal escaped your ward uncontained — call the candidate with negative herbs inside try/except ValueError, so a lawful refusal is caught, not fatal.")
except TypeError:
    raise AssertionError("Your ward mis-called the candidate — brew_strength takes BOTH herbs and moon_phase, so summon it with two offerings, e.g. candidate(2, 'dark'), never candidate(2) alone.")

_impostors = [
    (_impostor_moonblind, "your ward admitted the impostor that ignores the moon — assert an exact full-moon value, e.g. candidate(4, 'full') == 17, not just dark-night brews"),
    (_impostor_offbyone, "your ward admitted the impostor that is off by one under the full moon — assert the exact full-moon value: candidate(4, 'full') == 17, no looser"),
    (_impostor_neverraises, "your ward admitted the impostor that never raises — test the forbidden offering: call candidate(-1, ...) in try/except ValueError and assert the refusal truly came"),
    (_impostor_boundary, "your ward admitted the impostor that is wrong at zero herbs — test the boundary: candidate(0, 'dark') must be 0"),
    (_impostor_wrongbase, "your ward admitted the impostor that mis-brews the base draught — assert a plain dark-night value, e.g. candidate(2, 'dark') == 6"),
]
for _imp, _msg in _impostors:
    _caught = False
    try:
        ward(_imp)
    except AssertionError:
        _caught = True
    except ValueError:
        raise AssertionError("your ward let a candidate's ValueError fly uncaught — wrap the negative-herbs call in try/except ValueError and assert on a flag instead")
    assert _caught, _msg`,
          successText: 'Five impostors bitten, one lawful brewer admitted in silence — the judging is yours now, and it was always the harder craft.',
          xp: 50,
        },
        {
          id: 'a3l5x3',
          kind: 'echo',
          title: 'Echo: The Feeding of the Tanks',
          prompt: 'The tanks must be fed, and the feeding obeys the same containment law: '
            + 'refuse loudly at the threshold, contain the refusal above.\n\n'
            + '- `feed_tank(volume, dose)` — the strict valve:\n'
            + '  - if `dose` is less than or equal to `0`, raise `ValueError("nothing to feed")`\n'
            + '  - if `volume + dose` is greater than `100`, raise `ValueError("the tank would overflow")`\n'
            + '  - otherwise **return** `volume + dose`\n'
            + '- `safe_feed(volume, dose)` — call `feed_tank(volume, dose)` inside a `try` '
            + 'and return its result; if it raises `ValueError`, catch it and return '
            + '`volume` unchanged.',
          starter: py`def feed_tank(volume, dose):
    # dose <= 0            -> ValueError("nothing to feed")
    # volume + dose > 100  -> ValueError("the tank would overflow")
    pass


def safe_feed(volume, dose):
    pass
`,
          solution: py`def feed_tank(volume, dose):
    if dose <= 0:
        raise ValueError("nothing to feed")
    if volume + dose > 100:
        raise ValueError("the tank would overflow")
    return volume + dose


def safe_feed(volume, dose):
    try:
        return feed_tank(volume, dose)
    except ValueError:
        return volume
`,
          hints: [
            'feed_tank is two guard clauses and a return — raise ValueError with the exact message for each unlawful dose, then return the new volume.',
            'safe_feed wraps one call: try: return feed_tank(volume, dose), then except ValueError: return volume.',
          ],
          validation: py`assert "feed_tank" in dir(), "The Codex finds no feed_tank — the working must bear exactly that name."
assert "safe_feed" in dir(), "The Codex finds no safe_feed — the working must bear exactly that name."
assert feed_tank(40, 20) == 60, "A lawful feeding: feed_tank(40, 20) should return 60."
assert feed_tank(90, 10) == 100, "Filling the tank exactly to the brim is lawful: feed_tank(90, 10) should be 100."
raised = False
try:
    feed_tank(50, 0)
except ValueError as err:
    raised = True
    assert "nothing" in str(err), "The empty-dose refusal must carry the message: nothing to feed"
assert raised, "feed_tank(50, 0) must raise ValueError — the tanks are not fed with nothing."
raised = False
try:
    feed_tank(50, -5)
except ValueError:
    raised = True
assert raised, "A negative dose must also raise ValueError."
raised = False
try:
    feed_tank(95, 10)
except ValueError as err:
    raised = True
    assert "overflow" in str(err), "The overfill refusal must carry the message: the tank would overflow"
assert raised, "feed_tank(95, 10) must raise ValueError — the tank cannot hold it."
assert safe_feed(40, 20) == 60, "A lawful feeding passes straight through: safe_feed(40, 20) should be 60."
assert safe_feed(95, 10) == 95, "When feed_tank refuses, safe_feed must return the volume unchanged."
assert safe_feed(50, 0) == 50, "safe_feed(50, 0) should be 50 — the refusal is contained, not repeated."
assert safe_feed(0, 101) == 0, "Even an empty tank refuses what it cannot hold."`,
          successText: 'The valves refuse, contain, and hold — and whatever is in the tanks is fed exactly what the law allows.',
          xp: 18,
        },
      ],
      trace: [
        {
          id: 'a3l5t1',
          code: py`try:
    n = int("9")
except ValueError:
    print("refused")
else:
    print("accepted", n)
finally:
    print("resealed")`,
          q: 'The scrying: what does this working print?',
          options: [
            'accepted 9',
            'accepted 9\nresealed',
            'refused\nresealed',
            'accepted 9\nrefused\nresealed',
          ],
          answer: 1,
          explain: '"9" converts cleanly, so except never fires; else runs precisely BECAUSE '
            + 'nothing was raised; and finally runs no matter what. The clauses are not a '
            + 'sequence to be read top to bottom — each has its condition: except on failure, '
            + 'else on success, finally always.',
        },
        {
          id: 'a3l5t2',
          code: py`try:
    print("first")
    n = int("veil")
    print("second")
except ValueError:
    print("caught")
finally:
    print("sealed")`,
          q: 'The scrying: what does this working print?',
          options: [
            'first\ncaught\nsealed',
            'first\nsecond\ncaught\nsealed',
            'caught\nsealed',
            'first\ncaught',
          ],
          answer: 0,
          explain: 'The try body runs until the moment of the raise: "first" prints, '
            + 'int("veil") explodes, and "second" is abandoned — Python jumps straight to the '
            + 'matching except, and finally reseals as it always does. What ran before the '
            + 'failure is not undone (option three), and finally is never skipped (option four).',
        },
      ],
    },

    // ----------------------------------------------------------
    // a3l6 — The Pensieve
    // ----------------------------------------------------------
    {
      id: 'a3l6',
      title: 'The Pensieve',
      concept: 'files — open() modes, write, read/readlines, and the with statement',
      xp: 38,
      narrative: 'At the corridor’s end stands a basin of carved stone, and in it something '
        + 'that moves like liquid but remembers like a mind. Everything you have written so far '
        + 'has died with its run — every variable, every list, gone the moment the interpreter '
        + 'closes its eye. The basin is the answer to that dying. Pour a thought in and it '
        + 'keeps; return in an hour or a decade and draw it out unchanged. The robe teaches the '
        + 'rites of pouring and of drawing back — and the seal that must close over the basin '
        + 'every time, without exception.',
      sections: [
        {
          heading: 'open() — pouring thought into the basin',
          body: '`open(path, mode)` connects your program to a file and returns a **file '
            + 'object**. The **mode** string declares your intent:\n\n'
            + '- `"w"` — write. Creates the file, or **erases it completely** if it exists. Unforgiving.\n'
            + '- `"r"` — read. The file must exist, or `FileNotFoundError` rises.\n'
            + '- `"a"` — append. Adds to the end, preserving what is there.\n\n'
            + '`.write(text)` pours exactly the text you give — **no newline is added**. To end '
            + 'a line, write `"\\n"` yourself. And a file opened must be closed with `.close()`, '
            + 'or written drops may never reach the basin at all.',
          code: py`vial = open("memory.txt", "w")    # "w": create, or erase and begin again
vial.write("The lift descends.\n")
vial.write("The doors rotate.\n")
vial.close()                       # seal it — unsealed vials lose drops`,
        },
        {
          heading: 'with — the seal that cannot be forgotten',
          body: 'Sorcerers forget to close things. Exceptions make them forget: if a raise '
            + 'occurs between `open()` and `.close()`, the close never happens.\n\n'
            + 'The `with` statement makes the seal automatic:\n\n'
            + '- `with open(path, mode) as f:` opens the file and binds it to `f`.\n'
            + '- When the indented block ends — normally **or by exception** — the file is '
            + 'closed for you. Always.\n\n'
            + 'From this page onward, `with` is the only way you open a file.',
          code: py`with open("memory.txt", "a") as vial:   # "a" appends to the end
    vial.write("A door without a handle.\n")

# Here, outside the block, the vial is already sealed.
print("the basin holds three memories")`,
        },
        {
          heading: 'Drawing memories back out',
          body: 'Opened with `"r"`, a file offers several rites of retrieval:\n\n'
            + '- `.read()` — the entire contents as **one string**, newlines included.\n'
            + '- `.readlines()` — a **list** of lines, each still wearing its `"\\n"`.\n'
            + '- Looping `for line in f:` — one line at a time, memory-light.\n\n'
            + 'The clinging newlines are the classic snare: strip them with `.rstrip("\\n")` on '
            + 'each line, or take `.read().splitlines()`, which returns the lines already bare. '
            + 'Write first, read after — within one program, the basin holds.',
          code: py`with open("memory.txt", "r") as vial:
    whole = vial.read()
print(whole)               # one string, three lines

with open("memory.txt", "r") as vial:
    for line in vial:
        print("drawn:", line.rstrip("\n"))`,
          note: 'In the Forge, files live in an in-memory vault that lasts for a single run — '
            + 'each casting begins with the basin swept clean. On a true machine, what you '
            + 'write with "w" persists on disk long after the program dies. Treat every write '
            + 'as permanent, and you will never be surprised.',
        },
        {
          heading: 'The modern door — pathlib',
          body: 'Beside the old door of `open()` stands a newer one. `from pathlib import '
            + 'Path` gives you the **Path** object — a path that is a *thing*, not a bare '
            + 'string — and three rites that open, act, and seal in one motion:\n\n'
            + '- `Path(p).write_text(text)` — pours the whole string into the file, replacing '
            + 'whatever was there. No mode, no close.\n'
            + '- `Path(p).read_text()` — draws the entire contents back as one string.\n'
            + '- `Path(p).exists()` — `True` or `False`: is anything there at all? A question '
            + '`open()` can only answer by dying of `FileNotFoundError`.\n\n'
            + 'For whole-file work this is the cleaner rite; keep `open()` and `with` for '
            + 'appending, or for walking a great file line by line. Both doors open onto the '
            + 'same basin — here in the Forge and on any true machine alike.',
          code: py`from pathlib import Path

basin = Path("echo.txt")
basin.write_text("The lift descends.\nThe doors rotate.\n")
print(basin.exists())                  # True
print(basin.read_text().splitlines())  # ['The lift descends.', 'The doors rotate.']
print(Path("unpoured.txt").exists())   # False`,
        },
        {
          heading: 'The structured phial — json',
          body: 'Plain lines suit plain memories. But some memories arrive with *structure* — '
            + 'a dict holding lists holding dicts — and flattening them into prose would '
            + 'break their shape. The `json` module keeps the shape:\n\n'
            + '- `json.dumps(data)` renders dicts, lists, strings, numbers, and booleans into '
            + '**one string** — a phial fit for any basin.\n'
            + '- `json.loads(text)` reverses the rite exactly: the string wakes back into '
            + 'live Python structures.\n\n'
            + 'Navigate the restored nest one bracket per layer, left to right: '
            + '`data["records"]` is a list, `[0]` its first dict, `["name"]` a field within. '
            + 'Nearly every ledger the outside world will hand you — records, reports, the '
            + 'answers of distant archives — wears this nested shape.',
          code: py`import json

archive = {"basin": "west wing", "records": [
    {"name": "the veil breathes", "potency": 3},
    {"name": "a door refuses all keys", "potency": 7},
]}

phial = json.dumps(archive)              # structure -> one string
print(type(phial).__name__)              # str

with open("archive.json", "w") as f:
    f.write(phial)

with open("archive.json", "r") as f:
    restored = json.loads(f.read())      # string -> live structure

print(restored["records"][0]["name"])    # the veil breathes
print(restored["records"][1]["potency"]) # 7`,
          note: 'The shorter rite: `json.dump(data, f)` pours straight into an open file, and '
            + '`json.load(f)` draws straight back out — the same magic with the middle string '
            + 'left unspoken.',
        },
      ],
      challenge: {
        title: 'The Basin Holds',
        prompt: 'The Unspeakables entrust you with the evening’s memories. They must be '
          + 'poured into the basin, one per line — and they must come back out exactly as they '
          + 'went in.\n\n'
          + 'Write **two functions**:\n\n'
          + '- `store_memories(path, memories)` — `memories` is a list of strings. Open `path` '
          + 'in **write mode** using `with`, and write each memory on its own line. **Return** '
          + 'the number of memories written.\n'
          + '- `recall_memories(path)` — open `path` in **read mode** using `with`, and '
          + '**return** a list of the lines **without** their trailing newline characters.\n\n'
          + 'An empty list stored must come back as an empty list. Storing to the same path '
          + 'twice must leave only the second pouring — write mode replaces.',
        starter: py`# The rites of pouring and drawing.

def store_memories(path, memories):
    # TODO: open path in "w" mode using with;
    # write each memory followed by "\n";
    # return how many memories were written
    pass


def recall_memories(path):
    # TODO: open path in "r" mode using with;
    # return a list of lines WITHOUT trailing newlines
    pass
`,
        solution: py`def store_memories(path, memories):
    with open(path, "w") as basin:
        for memory in memories:
            basin.write(memory + "\n")
    return len(memories)


def recall_memories(path):
    with open(path, "r") as basin:
        return [line.rstrip("\n") for line in basin]
`,
        hints: [
          'store_memories: `with open(path, "w") as basin:` then loop over memories, writing each one plus "\\n". After the with block, return len(memories).',
          'recall_memories: open with "r" and either loop the file stripping each line, or take basin.read().splitlines() — both return bare lines.',
          'The whole of recall_memories can be: `with open(path, "r") as basin:` then `return [line.rstrip("\\n") for line in basin]`.',
        ],
        validation: py`n = store_memories("pensieve.txt", ["the veil breathes", "a door refuses all keys", "the orbs hum in the dark"])
assert n == 3, "store_memories must return how many memories it wrote — 3 here."
back = recall_memories("pensieve.txt")
assert isinstance(back, list), "recall_memories must return a list of strings."
assert back == ["the veil breathes", "a door refuses all keys", "the orbs hum in the dark"], "The memories came back altered — one list item per line, with no newline characters attached."
assert store_memories("void.txt", []) == 0, "Storing nothing returns 0."
assert recall_memories("void.txt") == [], "An empty basin recalls an empty list."
store_memories("pensieve.txt", ["only this remains"])
assert recall_memories("pensieve.txt") == ["only this remains"], "Write mode must replace what was there — the old memories should be gone entirely."`,
        successText: 'The silver surface stills. What you poured in will outlast the pouring — which is the whole terror of writing anything down.',
        xp: 75,
      },
      quiz: [
        {
          q: 'What does `open("codex.txt", "w")` do if the file already exists?',
          options: [
            'Appends new writes to the end of it',
            'Raises FileExistsError',
            'Opens it and erases its contents immediately',
            'Opens it read-only for safety',
          ],
          answer: 2,
          explain: 'Mode "w" truncates: the old contents are gone the instant the file opens, '
            + 'before you write a single character. Appending is mode "a" — choose your mode '
            + 'the way you would choose a curse: deliberately.',
        },
        {
          q: 'Why prefer `with open(...) as f:` over calling `f.close()` yourself?',
          options: [
            'It runs measurably faster',
            'The file is closed automatically when the block ends — even if an exception fires inside',
            'It lets you omit the mode argument',
            'It reads the whole file into memory for you',
          ],
          answer: 1,
          explain: 'The with statement guarantees the close on every exit path, including the '
            + 'ones you did not plan — an exception mid-block still seals the file. Manual '
            + 'close() is exactly one raise away from never running.',
        },
        {
          q: 'What is the difference between `f.read()` and `f.readlines()`?',
          options: [
            'read gives the whole file as one string; readlines gives a list of lines, newlines still attached',
            'They are identical',
            'read gives a list; readlines gives one string',
            'readlines strips the newline characters for you',
          ],
          answer: 0,
          explain: 'read returns a single string of everything; readlines splits it into a list '
            + 'of lines — but leaves each "\\n" clinging to its line. Nothing strips newlines '
            + 'for you except your own rstrip, or splitlines().',
        },
        {
          q: 'A program runs `f.write("ash")` twice, then the file is read. What does it contain?',
          options: [
            '`ash` on two separate lines',
            '`ashash` on one line — write adds no newline unless you include one',
            '`ash` once — the second write is ignored',
            'Nothing — write only stages text without saving',
          ],
          answer: 1,
          explain: 'write pours exactly what it is given, nothing more. Line breaks exist only '
            + 'where you write "\\n" yourself — forget it and your records fuse into one long '
            + 'unreadable strand.',
        },
      ],
      extras: [
        {
          id: 'a3l6x1',
          kind: 'echo',
          title: 'Echo: The Roll of the Drowned',
          prompt: 'A narrower basin: the roll of those lost to the flooded levels, one name '
            + 'per line, first name first.\n\n'
            + '- `etch_roll(path, names)` — `names` is a list of strings. Open `path` in '
            + '**write mode** with `with`, write each name on its own line, and **return** '
            + 'how many names were written.\n'
            + '- `first_etched(path)` — open `path` in **read mode** with `with` and '
            + '**return** the first line without its newline — or the empty string `""` if '
            + 'the file holds nothing.',
          starter: py`def etch_roll(path, names):
    pass


def first_etched(path):
    # return the first line (no newline), or "" if empty
    pass
`,
          solution: py`def etch_roll(path, names):
    with open(path, "w") as roll:
        for name in names:
            roll.write(name + "\n")
    return len(names)


def first_etched(path):
    with open(path, "r") as roll:
        lines = roll.read().splitlines()
    if lines == []:
        return ""
    return lines[0]
`,
          hints: [
            'etch_roll mirrors the pouring rite: with open(path, "w") as roll:, write each name plus "\\n", then return len(names) after the block ends.',
            'In first_etched, read().splitlines() gives bare lines — return lines[0] if the list holds anything, otherwise "".',
          ],
          validation: py`n = etch_roll("drowned.txt", ["Bode", "Rookwood", "Croaker"])
assert n == 3, "etch_roll must return how many names it wrote — 3 here."
assert first_etched("drowned.txt") == "Bode", "The first name etched must come back first, without its newline."
etch_roll("drowned.txt", ["Selwyn"])
assert first_etched("drowned.txt") == "Selwyn", "Write mode replaces — after a second etching, only the new roll remains."
assert etch_roll("empty.txt", []) == 0, "Etching no names returns 0."
try:
    _first = first_etched("empty.txt")
except IndexError:
    raise AssertionError("An empty roll answers with the empty string, not an error.")
assert _first == "", "An empty roll answers with the empty string, not an error."`,
          successText: 'The roll takes the names without complaint. It has taken many.',
          xp: 20,
        },
        {
          id: 'a3l6x2',
          kind: 'echo',
          title: 'Echo: The Sealed Phial',
          prompt: 'One basin remains, and it answers only to the modern door: **pathlib**, '
            + 'no `open()` anywhere in the working.\n\n'
            + '- `pour_phial(path, memories)` — `memories` is a list of strings. Build one '
            + 'string holding each memory followed by a newline, pour it with '
            + '`Path(path).write_text(...)`, and **return** how many memories were poured. '
            + 'Pouring an empty list must write an empty file — no stray newline.\n'
            + '- `drain_phial(path)` — if `Path(path).exists()` is `False`, **return** `[]`. '
            + 'Otherwise **return** the lines of `Path(path).read_text()` without their '
            + 'newlines (`.splitlines()` gives them back bare).',
          starter: py`from pathlib import Path

def pour_phial(path, memories):
    pass


def drain_phial(path):
    # a phial that was never poured drains to []
    pass
`,
          solution: py`from pathlib import Path

def pour_phial(path, memories):
    text = ""
    for memory in memories:
        text = text + memory + "\n"
    Path(path).write_text(text)
    return len(memories)


def drain_phial(path):
    phial = Path(path)
    if not phial.exists():
        return []
    return phial.read_text().splitlines()
`,
          hints: [
            'Build one string — each memory plus "\\n" — then a single Path(path).write_text(text) pours and seals in one rite. Return len(memories) after.',
            'drain_phial: bind phial = Path(path); if not phial.exists(): return [] — otherwise return phial.read_text().splitlines().',
          ],
          validation: py`assert "pour_phial" in dir(), "The Codex finds no pour_phial — the working must bear exactly that name."
assert "drain_phial" in dir(), "The Codex finds no drain_phial — the working must bear exactly that name."
n = pour_phial("phial.txt", ["the veil breathes", "the ninth door hums"])
assert n == 2, "pour_phial must return how many memories it poured — 2 here."
back = drain_phial("phial.txt")
assert isinstance(back, list), "drain_phial must return a list of strings."
assert back == ["the veil breathes", "the ninth door hums"], "The memories came back altered — one list item per line, with no newline characters attached."
pour_phial("phial.txt", ["only this survives"])
assert drain_phial("phial.txt") == ["only this survives"], "write_text replaces the whole phial — after a second pouring, only the new memory remains."
assert pour_phial("hollow.txt", []) == 0, "Pouring nothing returns 0."
assert drain_phial("hollow.txt") == [], "An empty phial drains to an empty list — take care that pouring no memories writes no stray newline."
try:
    _ghost = drain_phial("never_poured.txt")
except FileNotFoundError:
    raise AssertionError("drain_phial went digging for a phial that was never poured — ask Path(path).exists() first and return [] when the phial is absent.")
assert _ghost == [], "A phial that never existed drains to [] — the exists() check is the ward."
assert "Path(" in _source, "This echo walks the modern door — bind Path from pathlib and let it do the pouring, not open()."
assert "open(" not in _source, "The old door creaks — leave open() behind here; Path.write_text and Path.read_text seal themselves."`,
          successText: 'The phial seals itself — no mode, no close, no drop lost. The modern door swings both ways.',
          xp: 20,
        },
      ],
      trace: [
        {
          id: 'a3l6t1',
          code: py`with open("vial.txt", "w") as f:
    f.write("ash")
    f.write("bone")

with open("vial.txt") as f:
    print(f.read())`,
          q: 'The scrying: what does this working print?',
          options: [
            'ash\nbone',
            'ash bone',
            'ashbone',
            'bone',
          ],
          answer: 2,
          explain: 'write pours exactly what it is given — no newline, no space. Two writes to '
            + 'the same open file continue the strand: ashbone. Truncation happens at open, '
            + 'not per write — only reopening in "w" erases (option four’s fear belongs to the '
            + 'next scrying).',
        },
        {
          id: 'a3l6t2',
          code: py`with open("basin.txt", "w") as f:
    f.write("first pouring\n")

with open("basin.txt", "w") as f:
    f.write("second pouring\n")

with open("basin.txt") as f:
    print(len(f.readlines()))`,
          q: 'The scrying: what does this working print?',
          options: [
            '1',
            '2',
            '0',
            'An error — the basin was opened while it already held text',
          ],
          answer: 0,
          explain: 'Opening in "w" truncates: the second open erased the first pouring before '
            + 'a single character was written. One line survives. Adding to what exists is '
            + 'mode "a" — and reopening an existing file is never an error; the mode simply '
            + 'decides the fate of what was there.',
        },
      ],
    },

    // ----------------------------------------------------------
    // a3l7 — Assembling the Grimoire
    // ----------------------------------------------------------
    {
      id: 'a3l7',
      title: 'Assembling the Grimoire',
      concept: 'import and from...import, the standard library, and if __name__ == "__main__"',
      xp: 40,
      narrative: 'The last room is a library, though nothing in it was written here. The great '
        + 'grimoires of the Department were never *authored* — they were assembled: a chapter '
        + 'of arithmetic bound in from one volume, a chapter of chance from another, tallies '
        + 'and ledgers from a third. The robe lays your own thin work beside them, and the '
        + 'message is plain enough: you were never meant to write everything yourself. Tonight '
        + 'you learn to bind other volumes into your own — and to mark which of your pages '
        + 'should fire only when your book is the one being read.',
      sections: [
        {
          heading: 'import — binding another volume',
          body: 'A **module** is a file of Python that other programs can use. The standard '
            + 'library — hundreds of modules — ships with Python itself. Three rites of binding:\n\n'
            + '- `import math` — binds the whole module; reach inside with a dot: `math.sqrt(81)`.\n'
            + '- `from math import floor` — pulls one name straight into your namespace: `floor(9.87)`.\n'
            + '- `import random as rng` — binds the module under an **alias** you choose.\n\n'
            + 'Prefer plain `import` when reading clarity matters — `math.sqrt` announces where '
            + 'the power comes from. Imports belong at the top of the file, where every reader '
            + 'can take inventory.',
          code: py`import math
from math import floor
import random as rng

print(math.sqrt(81))    # 9.0 — reached through the module
print(floor(9.87))      # 9   — pulled in by name
rng.seed(13)            # fix fate before asking it anything
print(rng.randint(1, 100))   # the same number every run — seeded`,
        },
        {
          heading: 'The shelves already stocked',
          body: 'Three volumes you will open constantly:\n\n'
            + '- `math` — `sqrt`, `floor`, `isqrt` (the integer square root), the constant `pi`.\n'
            + '- `random` — `randint`, `choice`, `shuffle`. Chance is only *seeming*: call '
            + '`random.seed(n)` first and the entire sequence is fixed, repeatable, tame. '
            + 'Seeded chance is how the Unspeakables test prophecy without waiting for it.\n'
            + '- `collections.Counter` — feed it any sequence and it tallies the occurrences of '
            + 'each element into a dict-like ledger; `.most_common(n)` returns the top `n` as '
            + '`(element, count)` pairs.',
          code: py`from collections import Counter

sightings = ["wraith", "orb", "wraith", "door", "wraith", "orb"]
tally = Counter(sightings)
print(tally)                 # each apparition, counted
print(tally.most_common(1))  # [('wraith', 3)] — the most frequent
print(tally["door"])         # 1 — ask it like a dict`,
        },
        {
          heading: 'The name a file wears: __name__',
          body: 'Every module carries a hidden variable, `__name__`. Its value depends on how '
            + 'the file is being read:\n\n'
            + '- Run **directly**, the file wears the name `"__main__"`.\n'
            + '- **Imported** by another file, it wears its own module name instead — and its '
            + 'top-level code runs once at import.\n\n'
            + 'So the guard `if __name__ == "__main__":` marks pages that fire only when *your* '
            + 'book is the one open on the lectern — demonstrations, test castings — while '
            + 'importers receive your functions silently, without side effects.\n\n'
            + 'The Forge runs your code **as** `__main__`, so a guarded block *does* execute here.',
          code: py`print(__name__)     # in the Forge: __main__

def summon():
    return "the archive answers"

if __name__ == "__main__":
    # Fires when run directly. Silent if this file were imported.
    print("run directly —", summon())`,
        },
        {
          heading: 'Dissection: the counting of doors',
          body: 'A finished working from the archive, read as the machine reads it — every '
            + 'binding in order, nothing skipped.\n\n'
            + '- **Lines 1–2** bind the tools: `Counter` pulled straight into the namespace, '
            + 'the whole `math` volume reached by dot.\n'
            + '- **The def** creates `dominant_door` and binds the name. Nothing inside runs yet.\n'
            + '- **Inside, when called:** `Counter(trials)` tallies the list; `.most_common(1)` '
            + 'returns a **list** holding one `(name, count)` pair; `[0]` takes the pair out, '
            + 'and the two-name assignment unpacks it into `name` and `count`.\n'
            + '- **The return** hands back the f-string — the call becomes that value.\n'
            + '- **The guard:** the Forge runs this file directly, so `__name__` wears '
            + '`"__main__"` and the block fires.\n'
            + '- **The first print** finally runs the body: oak appears three times, so '
            + '`oak x3` is spoken.\n'
            + '- **The second print:** `len(doors)` is 5, and `math.isqrt(5)` is `2` — the '
            + 'integer part, nothing rounded up.\n\n'
            + 'Now hold it still and turn it. What would change if another file *imported* '
            + 'this one? The imports and the `def` would still run — but `__name__` would '
            + 'wear the module’s own name, the guard would stay dark, and nothing would '
            + 'print. That silence is the guard’s entire purpose. And what would change if '
            + 'the unpacking line dropped its `[0]` — `name, count = tally.most_common(1)`? '
            + 'The right side would be a list holding a single pair, and Python, told to '
            + 'unpack one item into two names, would die of '
            + '`ValueError: not enough values to unpack`. The pair must be taken *out* of '
            + 'the list before it is opened.',
          code: py`from collections import Counter
import math

def dominant_door(trials):
    tally = Counter(trials)
    name, count = tally.most_common(1)[0]
    return f"{name} x{count}"

if __name__ == "__main__":
    doors = ["oak", "iron", "oak", "veil", "oak"]
    print(dominant_door(doors))
    print(math.isqrt(len(doors)))`,
        },
      ],
      challenge: {
        title: 'The Grimoire Assembled',
        prompt: 'Your final working on this floor binds borrowed volumes into a working of '
          + 'your own: a rune-tally from the ledger-keepers, a root from the arithmeticians, '
          + 'and a page that fires only under the `__main__` guard.\n\n'
          + 'Requirements:\n\n'
          + '- Import `Counter` from `collections`, and import `math`.\n'
          + '- `most_common_rune(text)` — remove the spaces from `text` (for example with '
          + '`text.replace(" ", "")`), tally the remaining characters with `Counter`, and '
          + '**return the single most common character**.\n'
          + '- `ward_root(n)` — **return** the integer part of the square root of `n` (use '
          + '`math.isqrt(n)`, or `int(math.sqrt(n))`). Example: `ward_root(17)` returns `4`.\n'
          + '- At the bottom of the file, inside an `if __name__ == "__main__":` guard, print '
          + 'the result of `most_common_rune("department of mysteries")` — it should print `e`.',
        starter: py`# TODO: import Counter from collections, and import math


def most_common_rune(text):
    # TODO: ignore spaces, tally the remaining characters,
    # and return the single most common character
    pass


def ward_root(n):
    # TODO: return the integer part of the square root of n
    pass


# TODO: add the __main__ guard here and, inside it,
# print(most_common_rune("department of mysteries"))
`,
        solution: py`from collections import Counter
import math


def most_common_rune(text):
    counts = Counter(text.replace(" ", ""))
    return counts.most_common(1)[0][0]


def ward_root(n):
    return math.isqrt(n)


if __name__ == "__main__":
    print(most_common_rune("department of mysteries"))
`,
        hints: [
          'Top of the file: `from collections import Counter` and `import math`. Then Counter(some_string) tallies its characters.',
          'Counter’s .most_common(1) returns a list holding one (character, count) pair — so most_common(1)[0][0] is the character itself.',
          'ward_root is one line: `return math.isqrt(n)`. The guard is exactly `if __name__ == "__main__":` with the print indented beneath it.',
        ],
        validation: py`assert most_common_rune("veil of the veil") == "e", "In 'veil of the veil' (spaces ignored) the most common character is e."
assert most_common_rune("xxxyz") == "x", "most_common_rune('xxxyz') should be x."
assert most_common_rune("d o o m") == "o", "Spaces are not runes — strip them before counting, or the void wins the tally."
assert most_common_rune("k") == "k", "A single rune is its own majority."
assert ward_root(16) == 4, "ward_root(16) should be 4."
assert ward_root(17) == 4, "ward_root(17) should be 4 — the integer part only, no rounding up."
assert ward_root(1) == 1, "ward_root(1) should be 1."
assert ward_root(0) == 0, "ward_root(0) should be 0."
printed = [line.strip() for line in _stdout.splitlines()]
assert "e" in printed, "The guarded page never fired — the Forge runs your code as __main__, so the guard block should have printed e."`,
        successText: 'The borrowed chapters seat themselves into your spine of code as though they had always belonged there. Assembled, the grimoire is heavier than the sum of its parts.',
        xp: 80,
      },
      quiz: [
        {
          q: 'After `import math`, how do you call its square-root function?',
          options: [
            '`sqrt(9)`',
            '`math.sqrt(9)`',
            '`import sqrt` and then `sqrt(9)`',
            '`math->sqrt(9)`',
          ],
          answer: 1,
          explain: 'Plain import binds the module object; its contents are reached with a dot. '
            + 'Bare `sqrt(9)` works only after `from math import sqrt` — a different rite of binding.',
        },
        {
          q: 'What does `from collections import Counter` change, compared with `import collections`?',
          options: [
            'It loads the module twice',
            'It lets you write `Counter(...)` directly, without the `collections.` prefix',
            'It renames the whole module to Counter',
            'It imports every name collections contains',
          ],
          answer: 1,
          explain: 'from...import pulls the one named thing into your namespace directly. With '
            + 'plain import you would write collections.Counter each time. Neither loads '
            + 'anything twice — Python caches modules after the first import.',
        },
        {
          q: 'What is the value of `Counter("aabac").most_common(1)`?',
          options: [
            '`[("a", 3)]`',
            '`"a"`',
            '`3`',
            '`{"a": 3}`',
          ],
          answer: 0,
          explain: 'most_common(n) always returns a list of (element, count) pairs — even for '
            + 'n=1. To extract just the character, index in: most_common(1)[0][0].',
        },
        {
          q: 'When does the body of `if __name__ == "__main__":` run?',
          options: [
            'Every time the module is imported by another file',
            'Never — it is purely documentation',
            'Only when the file is executed directly — and the Forge runs your code that way',
            'Only when called from inside a function',
          ],
          answer: 2,
          explain: 'Run directly, a file wears the name "__main__" and the guard passes. '
            + 'Imported, it wears its module name and the guard block stays dark — which is '
            + 'the point: importers get your functions without your demonstrations.',
        },
      ],
      extras: [
        {
          id: 'a3l7x1',
          kind: 'echo',
          title: 'Echo: The Assembled Report',
          prompt: 'One more binding before the floor floods. This time the tally falls on '
            + 'whole words, and the root rounds **up**.\n\n'
            + '- Import `Counter` from `collections`, and import `math`.\n'
            + '- `most_common_word(text)` — split `text` into words with `text.split()`, '
            + 'tally the words with `Counter`, and **return the single most common word**.\n'
            + '- `ceil_root(n)` — **return** the square root of `n` rounded **up** to an '
            + 'integer (use `math.ceil(math.sqrt(n))`). Example: `ceil_root(17)` returns `5`.\n'
            + '- Inside an `if __name__ == "__main__":` guard, print the result of '
            + '`most_common_word("the veil the door the dark")` — it should print `the`.',
          starter: py`# imports first


def most_common_word(text):
    pass


def ceil_root(n):
    pass


# the guard, then the print
`,
          solution: py`from collections import Counter
import math


def most_common_word(text):
    counts = Counter(text.split())
    return counts.most_common(1)[0][0]


def ceil_root(n):
    return math.ceil(math.sqrt(n))


if __name__ == "__main__":
    print(most_common_word("the veil the door the dark"))
`,
          hints: [
            'text.split() breaks the text into a list of words; Counter of that list tallies whole words, and .most_common(1)[0][0] is the word itself.',
            'ceil_root is one line: return math.ceil(math.sqrt(n)). The guard is exactly if __name__ == "__main__": with the print indented beneath it.',
          ],
          validation: py`assert most_common_word("door door veil") == "door", "most_common_word('door door veil') should be door."
assert most_common_word("ash bone ash bone ash") == "ash", "The tally must count whole words, not characters."
assert most_common_word("silence") == "silence", "A single word is its own majority."
assert ceil_root(16) == 4, "ceil_root(16) should be 4 — a perfect square needs no rounding."
assert ceil_root(17) == 5, "ceil_root(17) should be 5 — the root rounds UP."
assert ceil_root(1) == 1, "ceil_root(1) should be 1."
assert ceil_root(0) == 0, "ceil_root(0) should be 0."
printed = [line.strip() for line in _stdout.splitlines()]
assert "the" in printed, "The guarded page never fired — the Forge runs your code as __main__, so the guard should have printed: the"`,
          successText: 'The report binds itself shut. Below, faintly, water.',
          xp: 22,
        },
        {
          id: 'a3l7x2',
          kind: 'echo',
          title: 'Echo: The Watch Tally',
          prompt: 'The night watch files its sightings as a list, and the archive wants the '
            + 'worst of them named.\n\n'
            + '- Import `Counter` from `collections`, and import `math`.\n'
            + '- `most_seen(sightings)` — `sightings` is a **list of strings**. Tally the '
            + 'elements with `Counter` and **return the single most common one**.\n'
            + '- `patrol_root(n)` — **return** the integer part of the square root of `n` '
            + '(use `math.isqrt(n)`). Example: `patrol_root(26)` returns `5`.\n'
            + '- Inside an `if __name__ == "__main__":` guard, print the result of '
            + '`most_seen(["wraith", "orb", "wraith", "door", "wraith"])` — it should '
            + 'print `wraith`.',
          starter: py`# imports first


def most_seen(sightings):
    pass


def patrol_root(n):
    pass
`,
          solution: py`from collections import Counter
import math


def most_seen(sightings):
    tally = Counter(sightings)
    return tally.most_common(1)[0][0]


def patrol_root(n):
    return math.isqrt(n)


if __name__ == "__main__":
    print(most_seen(["wraith", "orb", "wraith", "door", "wraith"]))
`,
          hints: [
            'Counter accepts a list directly — Counter(sightings) tallies the elements, and .most_common(1)[0][0] is the element itself, not the pair.',
            'patrol_root is one line: return math.isqrt(n). The guard is exactly if __name__ == "__main__": with the print indented beneath it.',
          ],
          validation: py`assert "most_seen" in dir(), "The Codex finds no most_seen — the working must bear exactly that name."
assert "patrol_root" in dir(), "The Codex finds no patrol_root — the working must bear exactly that name."
assert most_seen(["orb", "wraith", "orb"]) == "orb", "most_seen must return the single most common SIGHTING — most_common(1) hands back a list of (element, count) pairs; take [0][0]."
assert most_seen(["door", "door", "veil", "veil", "door"]) == "door", "most_seen(['door', 'door', 'veil', 'veil', 'door']) should be door."
assert most_seen(["lone"]) == "lone", "A single sighting is its own majority."
assert patrol_root(25) == 5, "patrol_root(25) should be 5."
assert patrol_root(26) == 5, "patrol_root(26) should be 5 — the integer part only, no rounding up."
assert patrol_root(1) == 1, "patrol_root(1) should be 1."
assert patrol_root(0) == 0, "patrol_root(0) should be 0."
printed = [line.strip() for line in _stdout.splitlines()]
assert "wraith" in printed, "The guarded page never fired — the Forge runs your code as __main__, so the guard should have printed: wraith"`,
          successText: 'The tally names the wraith, as every tally in this place eventually does.',
          xp: 20,
        },
      ],
      trace: [
        {
          id: 'a3l7t1',
          code: py`from collections import Counter

tally = Counter("mystery")
print(tally["y"])
print(tally.most_common(1)[0][0])`,
          q: 'The scrying: what does this working print?',
          options: [
            '2\nm',
            '1\ny',
            "2\n('y', 2)",
            '2\ny',
          ],
          answer: 3,
          explain: '"mystery" holds two y’s and one of everything else, so tally["y"] is 2 and '
            + 'y tops the tally. most_common(1) returns a LIST of (element, count) pairs — the '
            + 'first [0] takes the pair, the second [0] takes the element. Stop one bracket '
            + 'early and you print the whole pair (option three).',
        },
        {
          id: 'a3l7t2',
          code: py`from math import floor

print(floor(3.9))
print(sqrt(16))`,
          q: 'The scrying: what comes of running this working?',
          options: [
            '3\n4.0',
            '3 — then it dies of NameError: only floor was pulled from math, so sqrt was never bound',
            '4\n4.0',
            '3\n4',
          ],
          answer: 1,
          raises: 'NameError',
          explain: 'from math import floor binds exactly one name. floor(3.9) prints 3 — floor '
            + 'drops toward zero, it does not round — and then sqrt raises NameError: '
            + 'importing one name does not smuggle in its siblings. You would need '
            + 'from math import sqrt, or import math and math.sqrt.',
        },
      ],
    },
  ],

  // ----------------------------------------------------------
  // Boss — The Inferi Horde
  // ----------------------------------------------------------
  boss: {
    id: 'act3-boss',
    title: 'The Inferi Horde',
    narrative: 'They come up through the flooded levels, sodden and patient: the Inferi Horde — '
      + 'every working ever abandoned half-finished in the Department, given drowned flesh and '
      + 'a single instruction: *press forward*. Wards fail politely. The Horde does not. '
      + 'Between the water and the archive stands one spell registry, and you are what tends '
      + 'it. Register only lawful workings. Refuse corrupt offerings loudly, by name and by '
      + 'type. Cast what is bound; let what is unbound fail without dragging you down with it. '
      + 'The dead will test every door tonight. Be the one door that holds.',
    defeatText: 'The water closes over the archive, and somewhere beneath it a thousand half-finished workings add your name to the roll.',
    victoryText: 'The Horde recedes into the flooded dark, and the registry — your registry — still answers to its name.',
    xp: 350,
    flawlessBonus: 50,
    barks: {
      intro: [
        'We are every working you left half-finished. We have learned to press forward.',
        'The water is already at the last door. Register only the lawful, and it may yet hold.',
      ],
      hit: [
        'A door opened that should have stayed shut. We are inside the registry now.',
        'You named an unbound thing lawful. It wears our drowned flesh already.',
        'The ward thins exactly where you were certain and wrong. We felt the gap.',
        'Another entry rots in your book — and rot is the ladder we climb.',
        'You reached for the answer, and the cold water reached back up your arm.',
      ],
      playerFail: [
        'The working came apart in your hands. We heard it fall from three levels down.',
        'It would not seal. Every spell you cannot finish rises to join our ranks.',
        'The registry refused your hand. Mend it, before the water mends it for you.',
      ],
      lastCandle: [
        'One candle left, and the flood is at your knees. We can wait. You cannot.',
        'The last flame gutters in the wet air. Hold the door, keeper. Only you hold it.',
      ],
      death: [
        'The door held. We sink back into the half-finished dark, unfiled once more.',
        'The registry answers to its name, not to ours. The water forgets. We do not.',
      ],
    },
    premortem: {
      prompt: 'Before the Horde reaches the last door, plan the registry’s defense. Three '
        + 'workings must cooperate: one that admits a spell, one that casts it, one that '
        + 'contains a failed cast. Where should the first ward stand?',
      options: [
        'At the threshold: refuse an unlawful spell — a bad name, a power out of bounds, a '
          + 'duplicate — before it is ever written, so a refusal can never be un-refused.',
        'At the end: register every spell first, then walk the finished registry and strike '
          + 'out any that broke a rule.',
        'At the cast: enter every spell, cast each once to see which ones fail, and remove '
          + 'the ones that error.',
        'Nowhere yet: build the failure-catcher first, so any error anywhere is contained '
          + 'and the registry never halts.',
      ],
      answer: 0,
      explain: 'Guard at the gate. The final trial demands that a refused spell never enter '
        + 'the registry — the only way to honor that is to check the name, the power bounds, '
        + 'and the duplicate and raise BEFORE the entry is written. Register-then-sweep leaves '
        + 'a window in which the corruption already stands inside; casting each spell to test '
        + 'it invites the very failure you set out to refuse; and building the catch-all first '
        + 'only defers the judging you must do at the threshold. Validate first, store second, '
        + 'contain last.',
    },
    gauntlet: [
      {
        q: 'A sorcerer writes `def mark(rune): rune * 2` — no return statement. What is the value of `mark("x")`?',
        options: [
          '`"xx"`',
          '`None`',
          '`"x2"`',
          'A SyntaxError — every function must return something',
        ],
        answer: 1,
        explain: 'The body computes "xx" — and discards it. Without return, the result never '
          + 'leaves the function; the call evaluates to None. Functions are not required to '
          + 'return, but silence is all you get when they do not.',
      },
      {
        q: 'Given `def seal(door, strength=5):`, which call fails?',
        options: [
          '`seal("oak")`',
          '`seal("oak", 9)`',
          '`seal(strength=2, door="iron")`',
          '`seal()`',
        ],
        answer: 3,
        explain: '`door` has no default, so it must be supplied — seal() raises TypeError for '
          + 'the missing argument. The keyword call in option three is legal: named arguments '
          + 'may arrive in any order.',
      },
      {
        q: 'Top level: `power = 3`. A function body assigns `power = 30` (no `global`) and is called. What does `print(power)` show afterward?',
        options: [
          '`30`',
          '`3`',
          'Nothing — a NameError is raised',
          '`33`',
        ],
        answer: 1,
        explain: 'The assignment inside the function forged a new local that shadowed the '
          + 'global for the length of one call, then died. The global was never touched — it '
          + 'still reads 3. Changing it would require the global keyword, which the disciplined refuse.',
      },
      {
        q: 'What does `sorted(spells, key=lambda s: s[1])` do?',
        options: [
          'Returns a new list of the spells, ordered by each one’s second element; `spells` is unchanged',
          'Reorders `spells` in place and returns None',
          'Returns a list containing only the second elements',
          'Raises an error — key must be a named function, not a lambda',
        ],
        answer: 0,
        explain: 'sorted builds a fresh list, consulting the key function for each element’s '
          + 'ranking while keeping the full elements in the result. In-place reordering is '
          + '.sort(); and a lambda is a function value like any other — keys accept it gladly.',
      },
      {
        q: 'Why is a bare `except:` — no exception type — a trap?',
        options: [
          'It is slower than a typed except',
          'It catches everything, including unrelated bugs like a misspelled name, and hides them',
          'It only catches ValueError',
          'Python raises a SyntaxError for it',
        ],
        answer: 1,
        explain: 'A bare except devours every exception — including the NameError that was '
          + 'trying to tell you about a typo. The program limps on, silently wrong. Name the '
          + 'narrowest exception you expect, and let the rest rise loudly.',
      },
      {
        q: 'The file `veils.py` contains `print(__name__)` at top level. What prints when another file runs `import veils`?',
        options: [
          '`__main__`',
          '`veils`',
          '`veils.py`',
          'Nothing — imported code never runs',
        ],
        answer: 1,
        explain: 'Importing runs the module’s top-level code once, with __name__ set to the '
          + 'module’s own name — "veils", no extension. Only direct execution wears '
          + '"__main__", which is exactly what the __main__ guard tests for.',
      },
    ],
    finalChallenge: {
      title: 'The Spell Registry',
      prompt: 'The Horde is at the last door. The archive survives only if its registry of '
        + 'workings is incorruptible: every entry validated at the threshold, every refusal '
        + 'loud, every casting contained.\n\n'
        + 'Build **three cooperating functions**. The registry itself is a dict mapping spell '
        + 'name to power, created by the caller and passed in.\n\n'
        + '- `register_spell(registry, name, power)`:\n'
        + '  - if `name` is the empty string, raise `ValueError("a spell must bear a name")`\n'
        + '  - if `power` is less than `1` or greater than `10`, raise '
        + '`ValueError("power out of bounds")`\n'
        + '  - if `name` is already a key in `registry`, raise '
        + '`ValueError("that spell is already bound")`\n'
        + '  - otherwise store `registry[name] = power` and **return** `registry`. A refused '
        + 'spell must never enter the registry.\n'
        + '- `cast(registry, name)`:\n'
        + '  - if `name` is not in `registry`, raise `KeyError("no such spell")`\n'
        + '  - otherwise **return** the string `NAME strikes at power POWER`, reading the '
        + 'power from the registry\n'
        + '- `safe_cast(registry, name)`:\n'
        + '  - call `cast(registry, name)` in a `try` and return its result\n'
        + '  - if it raises `KeyError`, return exactly `the spell fizzles`',
      starter: py`# The last door. Three workings, or the water takes the archive.

def register_spell(registry, name, power):
    # TODO: refuse empty names, powers outside 1..10, and
    # duplicate names — each with ValueError and its message.
    # Otherwise store the spell and return the registry.
    pass


def cast(registry, name):
    # TODO: unknown name -> raise KeyError("no such spell");
    # otherwise return "<name> strikes at power <power>"
    pass


def safe_cast(registry, name):
    # TODO: try cast(); on KeyError return "the spell fizzles"
    pass
`,
      solution: py`def register_spell(registry, name, power):
    if name == "":
        raise ValueError("a spell must bear a name")
    if power < 1 or power > 10:
        raise ValueError("power out of bounds")
    if name in registry:
        raise ValueError("that spell is already bound")
    registry[name] = power
    return registry


def cast(registry, name):
    if name not in registry:
        raise KeyError("no such spell")
    return f"{name} strikes at power {registry[name]}"


def safe_cast(registry, name):
    try:
        return cast(registry, name)
    except KeyError:
        return "the spell fizzles"
`,
      validation: py`grimoire = {}
result = register_spell(grimoire, "Firestorm", 7)
assert result is grimoire, "register_spell must return the very registry it was given."
assert grimoire == {"Firestorm": 7}, "After one registration the registry should hold exactly Firestorm at power 7."
register_spell(grimoire, "Veilbind", 10)
register_spell(grimoire, "Emberward", 1)
assert grimoire["Veilbind"] == 10 and grimoire["Emberward"] == 1, "Powers 1 and 10 sit exactly on the lawful bounds and must be accepted."

raised = False
try:
    register_spell(grimoire, "", 5)
except ValueError:
    raised = True
assert raised, "An empty name must raise ValueError — a spell must bear a name."

raised = False
try:
    register_spell(grimoire, "Hollowflame", 0)
except ValueError:
    raised = True
assert raised, "Power 0 is out of bounds — ValueError required."

raised = False
try:
    register_spell(grimoire, "Hollowflame", 11)
except ValueError:
    raised = True
assert raised, "Power 11 is out of bounds — ValueError required."
assert "Hollowflame" not in grimoire, "A refused spell must never enter the registry."

raised = False
try:
    register_spell(grimoire, "Firestorm", 3)
except ValueError:
    raised = True
assert raised, "Binding a name twice must raise ValueError."
assert grimoire["Firestorm"] == 7, "A refused duplicate must not overwrite the original binding."

assert cast(grimoire, "Firestorm") == "Firestorm strikes at power 7", "cast must return '<name> strikes at power <power>', read from the registry."
assert cast(grimoire, "Veilbind") == "Veilbind strikes at power 10", "cast must read the power from the registry, not invent one."

raised = False
try:
    cast(grimoire, "Gravemist")
except KeyError:
    raised = True
assert raised, "Casting an unregistered spell must raise KeyError."

assert safe_cast(grimoire, "Emberward") == "Emberward strikes at power 1", "safe_cast must pass a lawful casting straight through."
assert safe_cast(grimoire, "Gravemist") == "the spell fizzles", "safe_cast must catch the KeyError and return exactly: the spell fizzles"`,
      xp: 0,
    },
  },

  // ----------------------------------------------------------
  // The Great Working — GW-A: The Drowned Ledger
  // Post-boss epilogue project (spec §9). Five stages over one
  // messy fixture file; validations are cumulative by hand.
  // ----------------------------------------------------------
  working: {
    id: 'gwledger',
    title: 'The Drowned Ledger',
    brief: 'The divers brought it up in oilcloth: the lake’s own ledger, the roll of everyone '
      + 'the flooded levels ever kept. The water has been at it for years — entries bloated '
      + 'with whitespace, pages gone blank, souls recorded twice and three times by clerks '
      + 'writing in a panic as the levels rose, lines dissolved past reading. The Unspeakables '
      + 'want it *filed*: restored, tallied, and fair-copied into a report the archive will '
      + 'accept. That is your commission. One working, raised in five stages, each stage '
      + 'standing on the one before — draw the surviving lines, name the drowned, tally the '
      + 'chambers, write the fair copy, then harden the whole against the water’s next '
      + 'attempt. The sodden page is poured anew before every run, and your code carries '
      + 'forward from stage to stage. What you finish here leaves the Department with you.',
    epigraph: {
      text: 'The lake returns what it takes. Never in the condition it was lent.',
      source: 'plaque above the ledger-room drain, ninth level',
    },
    stages: [
      {
        id: 'gwledgers1',
        title: 'Drawing the Pages',
        brief: 'The oilcloth is unrolled and the page laid flat: names, water, and worse. '
          + 'Before anything can be judged, it must be legible.\n\n'
          + 'Write `clean_lines(path)`:\n\n'
          + '- open `path` for reading, using `with`\n'
          + '- **strip** each line of leading and trailing whitespace\n'
          + '- **drop** every line that is blank once stripped\n'
          + '- **return** the survivors as a list of strings, in their original order\n\n'
          + 'Nothing more — no splitting, no judging. Half-dissolved entries ride through '
          + 'untouched, inner spaces and all. The ledger waits in `drowned_ledger.txt`, '
          + 'poured anew before every run; seventeen lines should come back from it.',
        starter: py`# The Drowned Ledger — stage 1: draw the pages.
# The lake's page waits in drowned_ledger.txt; the Codex
# pours it anew before every run.

def clean_lines(path):
    # TODO: open path for reading, using with;
    # strip each line of leading and trailing whitespace;
    # drop every line that is blank once stripped;
    # return the survivors as a list of strings, in order
    pass
`,
        setup: py`_LEDGER_PAGES = [
    "Broderick Bode|Space|1899",
    "",
    "  Elspeth Crane|Time|1877",
    "Augustus Rookwood|Prophecy|1881",
    "Silas Vane|1885",
    "   ",
    "Broderick Bode|Space|1899",
    "Marlowe Fen|Thought|1877",
    "Odile Marsh|Time|1869",
    "the ninth level",
    "   Augustus Rookwood|Prophecy|1881   ",
    "Corvus Selwyn | Death | 1877",
    "",
    "Tobias Whitlock|Prophecy|1885",
    "Odile Marsh|Time|1869",
    "Hesper Gaunt|Death|1866",
    "what the water kept",
    "  Una Thorn|Thought|1902",
    "Marlowe Fen|Thought|1877   ",
    "Edric Blackwood|Prophecy|1902",
]
with open("drowned_ledger.txt", "w") as _page:
    _page.write("\n".join(_LEDGER_PAGES) + "\n")
`,
        validation: py`assert "clean_lines" in dir(), "The Codex finds no clean_lines — the working must bear exactly that name, taking one parameter: the path."
try:
    _drawn = clean_lines("drowned_ledger.txt")
except FileNotFoundError:
    raise AssertionError("clean_lines went diving for a page that was never lent to it — open exactly the path it is handed, nothing else.")
except TypeError:
    raise AssertionError("clean_lines could not be summoned with a single argument — define it as clean_lines(path), one parameter, the path to the ledger.")
assert _drawn is not None, "clean_lines handed back None — return the cleaned lines; what is not returned, the lake keeps."
assert isinstance(_drawn, list), "clean_lines must return a list of strings, one per surviving line."
assert all(isinstance(_l, str) for _l in _drawn), "clean_lines must return the lines as strings, untouched — no splitting, no converting; that work belongs to a later stage."
assert all(_l == _l.strip() for _l in _drawn), "A line came back still dripping — strip leading and trailing whitespace from every line."
assert all(_l != "" for _l in _drawn), "A blank line slipped through the net — drop every line that is empty once stripped."
assert len(_drawn) == 17, "Seventeen entries survive once the blanks are drained — clean_lines returned " + str(len(_drawn)) + "."
assert _drawn[0] == "Broderick Bode|Space|1899", "The first entry must come back exactly as written: Broderick Bode|Space|1899."
assert _drawn[1] == "Elspeth Crane|Time|1877", "The second survivor should be Elspeth Crane, stripped bare — blanks are dropped entirely, not kept as ghosts in the order."
assert "Silas Vane|1885" in _drawn, "Silas Vane has dissolved past reading, but his line must SURVIVE this stage — cleaning is not judging; the malformed are dealt with later."
assert "Corvus Selwyn | Death | 1877" in _drawn, "Corvus Selwyn arrives with water between his fields — at this stage strip only the ends of each line; the inner spaces are a later stage's burden."
with open("_probe.txt", "w") as _pf:
    _pf.write("  one \n\n two\n   \nthree  \n")
_probe = clean_lines("_probe.txt")
assert _probe == ["one", "two", "three"], "Handed a different page, clean_lines must do the same work — expected ['one', 'two', 'three'], got " + repr(_probe) + "."`,
        canon: py`# The Drowned Ledger — stage 1: draw the pages.

def clean_lines(path):
    with open(path, "r") as page:
        raw = page.read().splitlines()
    cleaned = []
    for line in raw:
        line = line.strip()
        if line != "":
            cleaned.append(line)
    return cleaned
`,
        xp: 35,
      },
      {
        id: 'gwledgers2',
        title: 'Naming the Drowned',
        brief: 'Legible is not the same as whole. Write `parse_entries(lines)` — it takes the '
          + 'cleaned lines and reads each against the ledger’s rule of three: '
          + '`name|chamber|year`.\n\n'
          + '- split each line on the pipe `|`\n'
          + '- a line that does not yield **exactly three** fields is malformed: add one to a '
          + 'count and move on — it never becomes a record\n'
          + '- for lawful lines, **strip each field** and build the dict '
          + '`{"name": ..., "chamber": ..., "year": ...}` with the year as an `int`\n'
          + '- **return the pair** `(records, malformed)` — the list first, the count second\n\n'
          + 'Keep the duplicates: the clerks re-recorded souls as the water rose, and folding '
          + 'them is the next stage’s work. Stage one must still hold — the ward re-reads it.',
        starter: py`# The Drowned Ledger — stage 2: name the drowned.
# (Your stage-1 working carries forward; this text is the fallback.)

def clean_lines(path):
    with open(path, "r") as page:
        raw = page.read().splitlines()
    cleaned = []
    for line in raw:
        line = line.strip()
        if line != "":
            cleaned.append(line)
    return cleaned


def parse_entries(lines):
    # TODO: split each line on "|".
    # Exactly three fields -> a record dict:
    #   {"name": ..., "chamber": ..., "year": int(...)}
    # with each field stripped.
    # Anything else adds one to the malformed count and is skipped.
    # return records, malformed
    pass
`,
        setup: py`_LEDGER_PAGES = [
    "Broderick Bode|Space|1899",
    "",
    "  Elspeth Crane|Time|1877",
    "Augustus Rookwood|Prophecy|1881",
    "Silas Vane|1885",
    "   ",
    "Broderick Bode|Space|1899",
    "Marlowe Fen|Thought|1877",
    "Odile Marsh|Time|1869",
    "the ninth level",
    "   Augustus Rookwood|Prophecy|1881   ",
    "Corvus Selwyn | Death | 1877",
    "",
    "Tobias Whitlock|Prophecy|1885",
    "Odile Marsh|Time|1869",
    "Hesper Gaunt|Death|1866",
    "what the water kept",
    "  Una Thorn|Thought|1902",
    "Marlowe Fen|Thought|1877   ",
    "Edric Blackwood|Prophecy|1902",
]
with open("drowned_ledger.txt", "w") as _page:
    _page.write("\n".join(_LEDGER_PAGES) + "\n")
`,
        validation: py`assert "clean_lines" in dir(), "Stage one has gone missing — clean_lines(path) must still stand; every later floor rests on it."
_drawn = clean_lines("drowned_ledger.txt")
assert isinstance(_drawn, list) and len(_drawn) == 17, "clean_lines has regressed — it must still return the 17 stripped survivors. A later stage may not break an earlier one."
assert all(_l == _l.strip() and _l != "" for _l in _drawn), "clean_lines has regressed — lines must still come back stripped, with every blank dropped."
assert "parse_entries" in dir(), "The Codex finds no parse_entries — the working must bear exactly that name, taking one parameter: the cleaned lines."
try:
    _got = parse_entries(_drawn)
except ValueError:
    raise AssertionError("parse_entries died turning a rotten field into a number — count the fields FIRST and skip any line that does not split into exactly three; only then trust the year.")
except IndexError:
    raise AssertionError("parse_entries reached for a field the water already took — a malformed line has fewer than three parts; count it and move on, never index into it.")
assert _got is not None, "parse_entries handed back None — return the records AND the malformed count, together."
assert isinstance(_got, (tuple, list)) and len(_got) == 2, "parse_entries must return the pair (records, malformed) — the list of records first, the count of the unreadable second."
_records, _malformed = _got
assert isinstance(_records, list), "The first of the pair must be the list of records."
assert _malformed == 3, "Three entries dissolved beyond reading — the malformed count should be 3, got " + str(_malformed) + "."
assert len(_records) == 14, "Fourteen entries still parse, duplicates and all — got " + str(len(_records)) + ". Folding the duplicates is the NEXT stage; keep them for now."
assert isinstance(_records[0], dict), "Each record must be a dict carrying the keys name, chamber, and year."
assert set(_records[0].keys()) == {"name", "chamber", "year"}, "Each record carries exactly three keys — name, chamber, year — got " + str(sorted(_records[0].keys())) + "."
assert _records[0] == {"name": "Broderick Bode", "chamber": "Space", "year": 1899}, "The first record is misread — it should be Broderick Bode, chamber Space, year 1899."
assert isinstance(_records[0]["year"], int), "The year must come back as an int — pass the third field through int()."
_selwyn = [_r for _r in _records if "Selwyn" in _r["name"]]
assert len(_selwyn) == 1, "Corvus Selwyn should parse to exactly one record."
assert _selwyn[0]["name"] == "Corvus Selwyn" and _selwyn[0]["chamber"] == "Death", "Corvus Selwyn drowned with water around his pipes — strip EACH FIELD after splitting, or his name comes back still wet."
_r2, _m2 = parse_entries(["A|B|1", "gone under", "C|D|2", "x|y", "p|q|r|4"])
assert _m2 == 3, "Handed other lines, the count must still hold: one bare phrase, one two-field line, one four-field line — 3 malformed, got " + str(_m2) + "."
assert _r2 == [{"name": "A", "chamber": "B", "year": 1}, {"name": "C", "chamber": "D", "year": 2}], "parse_entries must work on whatever lines it is handed, in order — not only the pages of this lake."`,
        canon: py`# The Drowned Ledger — stage 2: name the drowned.

def clean_lines(path):
    with open(path, "r") as page:
        raw = page.read().splitlines()
    cleaned = []
    for line in raw:
        line = line.strip()
        if line != "":
            cleaned.append(line)
    return cleaned


def parse_entries(lines):
    records = []
    malformed = 0
    for line in lines:
        parts = line.split("|")
        if len(parts) != 3:
            malformed = malformed + 1
            continue
        records.append({
            "name": parts[0].strip(),
            "chamber": parts[1].strip(),
            "year": int(parts[2].strip()),
        })
    return records, malformed
`,
        xp: 40,
      },
      {
        id: 'gwledgers3',
        title: 'The Tally of the Lake',
        brief: 'Now the ledger stops being lines and becomes the dead. Write '
          + '`ledger_report(records)`, returning a dict of exactly six keys:\n\n'
          + '- `souls` — the count of **unique** entries; two records are the same soul only '
          + 'when name, chamber AND year all match; keep each soul’s first record, in order\n'
          + '- `duplicates` — how many records were folded away as re-recordings\n'
          + '- `chambers` — a dict of chamber to unique-soul count\n'
          + '- `earliest` / `latest` — the lowest and highest year among the unique souls\n'
          + '- `first_drowned` — the **name** of the earliest-year soul\n\n'
          + 'Stages one and two must still hold — regressions are how ledgers drown twice.',
        starter: py`# The Drowned Ledger — stage 3: the tally of the lake.
# (Your stage-2 working carries forward; this text is the fallback.)

def clean_lines(path):
    with open(path, "r") as page:
        raw = page.read().splitlines()
    cleaned = []
    for line in raw:
        line = line.strip()
        if line != "":
            cleaned.append(line)
    return cleaned


def parse_entries(lines):
    records = []
    malformed = 0
    for line in lines:
        parts = line.split("|")
        if len(parts) != 3:
            malformed = malformed + 1
            continue
        records.append({
            "name": parts[0].strip(),
            "chamber": parts[1].strip(),
            "year": int(parts[2].strip()),
        })
    return records, malformed


def ledger_report(records):
    # TODO: fold the duplicates — same name, chamber AND year —
    # keeping each soul's first record, in order. Then return a
    # dict with exactly six keys:
    #   souls, duplicates, chambers, earliest, latest, first_drowned
    pass
`,
        setup: py`_LEDGER_PAGES = [
    "Broderick Bode|Space|1899",
    "",
    "  Elspeth Crane|Time|1877",
    "Augustus Rookwood|Prophecy|1881",
    "Silas Vane|1885",
    "   ",
    "Broderick Bode|Space|1899",
    "Marlowe Fen|Thought|1877",
    "Odile Marsh|Time|1869",
    "the ninth level",
    "   Augustus Rookwood|Prophecy|1881   ",
    "Corvus Selwyn | Death | 1877",
    "",
    "Tobias Whitlock|Prophecy|1885",
    "Odile Marsh|Time|1869",
    "Hesper Gaunt|Death|1866",
    "what the water kept",
    "  Una Thorn|Thought|1902",
    "Marlowe Fen|Thought|1877   ",
    "Edric Blackwood|Prophecy|1902",
]
with open("drowned_ledger.txt", "w") as _page:
    _page.write("\n".join(_LEDGER_PAGES) + "\n")
`,
        validation: py`assert "clean_lines" in dir(), "Stage one has gone missing — clean_lines(path) must still stand."
assert "parse_entries" in dir(), "Stage two has gone missing — parse_entries(lines) must still stand."
_drawn = clean_lines("drowned_ledger.txt")
assert isinstance(_drawn, list) and len(_drawn) == 17 and all(_l == _l.strip() and _l != "" for _l in _drawn), "clean_lines has regressed — 17 stripped, non-blank survivors, exactly as stage one swore. A later stage may not break an earlier one."
_records, _malformed = parse_entries(_drawn)
assert len(_records) == 14 and _malformed == 3, "parse_entries has regressed — 14 records and 3 malformed from the ledger, as stage two swore."
assert _records[0] == {"name": "Broderick Bode", "chamber": "Space", "year": 1899}, "parse_entries has regressed — the first record must still read Broderick Bode, Space, 1899."
assert "ledger_report" in dir(), "The Codex finds no ledger_report — the working must bear exactly that name, taking the list of records."
try:
    _report = ledger_report(_records)
except KeyError:
    raise AssertionError("ledger_report reached into a record for a key that is not there — every record holds exactly name, chamber, and year.")
except ValueError:
    raise AssertionError("ledger_report collapsed mid-tally — likely min() or max() over an empty gathering. Fold the duplicates first, then measure what remains.")
assert _report is not None, "ledger_report handed back None — return the report dict."
assert isinstance(_report, dict), "ledger_report must return a dict — the report itself."
for _k in ["souls", "duplicates", "chambers", "earliest", "latest", "first_drowned"]:
    assert _k in _report, "The report is missing its " + _k + " entry — six keys, named exactly."
assert _report["souls"] == 10, "Ten souls remain once the panicked re-recordings are folded — got " + str(_report["souls"]) + ". Two records are the same soul only when name, chamber AND year all match."
assert _report["duplicates"] == 4, "Four entries were re-recordings of souls already filed — got " + str(_report["duplicates"]) + "."
assert _report["chambers"] == {"Space": 1, "Time": 2, "Prophecy": 3, "Thought": 2, "Death": 2}, "The chamber tally is wrong — count each UNIQUE soul once under its chamber; got " + str(_report["chambers"]) + "."
assert _report["earliest"] == 1866 and _report["latest"] == 1902, "The years are misread — among the unique souls the earliest drowning is 1866 and the latest 1902."
assert _report["first_drowned"] == "Hesper Gaunt", "first_drowned holds the NAME of the earliest-year soul — Hesper Gaunt, taken 1866; got " + repr(_report["first_drowned"]) + "."
_small = [
    {"name": "A", "chamber": "X", "year": 5},
    {"name": "B", "chamber": "X", "year": 3},
    {"name": "A", "chamber": "X", "year": 5},
    {"name": "A", "chamber": "Y", "year": 5},
]
_sr = ledger_report(_small)
assert _sr["souls"] == 3 and _sr["duplicates"] == 1, "Handed other records the tally must still hold: A|X|5 recorded twice is ONE soul, and A in a DIFFERENT chamber is another soul entirely — expected 3 souls and 1 duplicate, got " + str(_sr["souls"]) + " and " + str(_sr["duplicates"]) + "."
assert _sr["chambers"] == {"X": 2, "Y": 1}, "On those records chamber X holds two unique souls and Y one — got " + str(_sr["chambers"]) + "."
assert _sr["first_drowned"] == "B" and _sr["earliest"] == 3 and _sr["latest"] == 5, "On those records B went under first, in year 3, and the latest year is 5."`,
        canon: py`# The Drowned Ledger — stage 3: the tally of the lake.

def clean_lines(path):
    with open(path, "r") as page:
        raw = page.read().splitlines()
    cleaned = []
    for line in raw:
        line = line.strip()
        if line != "":
            cleaned.append(line)
    return cleaned


def parse_entries(lines):
    records = []
    malformed = 0
    for line in lines:
        parts = line.split("|")
        if len(parts) != 3:
            malformed = malformed + 1
            continue
        records.append({
            "name": parts[0].strip(),
            "chamber": parts[1].strip(),
            "year": int(parts[2].strip()),
        })
    return records, malformed


def ledger_report(records):
    unique = []
    seen = set()
    for record in records:
        key = (record["name"], record["chamber"], record["year"])
        if key not in seen:
            seen.add(key)
            unique.append(record)
    chambers = {}
    for record in unique:
        chambers[record["chamber"]] = chambers.get(record["chamber"], 0) + 1
    years = [record["year"] for record in unique]
    first = min(unique, key=lambda record: record["year"])
    return {
        "souls": len(unique),
        "duplicates": len(records) - len(unique),
        "chambers": chambers,
        "earliest": min(years),
        "latest": max(years),
        "first_drowned": first["name"],
    }
`,
        xp: 45,
      },
      {
        id: 'gwledgers4',
        title: 'The Fair Copy',
        brief: 'The Unspeakables file nothing they cannot read at arm’s length. Write '
          + '`file_report(src_path, dst_path)`: run the whole restoration — `clean_lines`, '
          + 'then `parse_entries`, then `ledger_report` — on `src_path`; add the malformed '
          + 'count to the report dict under the key `malformed`; write the fair copy to '
          + '`dst_path`; **return** the enlarged dict.\n\n'
          + 'The copy, line by line, each line built with an **f-string**:\n\n'
          + '- `THE DROWNED LEDGER`\n'
          + '- `souls: N`, `duplicates: N`, `malformed: N`, `earliest: Y`, `latest: Y`, '
          + '`first drowned: NAME` — in that order\n'
          + '- then one line per chamber, `CHAMBER: COUNT`, in alphabetical order\n\n'
          + 'All three earlier stages must still hold — the ward reads the copy back, '
          + 'character by character.',
        starter: py`# The Drowned Ledger — stage 4: the fair copy.
# (Your stage-3 working carries forward; this text is the fallback.)

def clean_lines(path):
    with open(path, "r") as page:
        raw = page.read().splitlines()
    cleaned = []
    for line in raw:
        line = line.strip()
        if line != "":
            cleaned.append(line)
    return cleaned


def parse_entries(lines):
    records = []
    malformed = 0
    for line in lines:
        parts = line.split("|")
        if len(parts) != 3:
            malformed = malformed + 1
            continue
        records.append({
            "name": parts[0].strip(),
            "chamber": parts[1].strip(),
            "year": int(parts[2].strip()),
        })
    return records, malformed


def ledger_report(records):
    unique = []
    seen = set()
    for record in records:
        key = (record["name"], record["chamber"], record["year"])
        if key not in seen:
            seen.add(key)
            unique.append(record)
    chambers = {}
    for record in unique:
        chambers[record["chamber"]] = chambers.get(record["chamber"], 0) + 1
    years = [record["year"] for record in unique]
    first = min(unique, key=lambda record: record["year"])
    return {
        "souls": len(unique),
        "duplicates": len(records) - len(unique),
        "chambers": chambers,
        "earliest": min(years),
        "latest": max(years),
        "first_drowned": first["name"],
    }


def file_report(src_path, dst_path):
    # TODO: clean_lines -> parse_entries -> ledger_report on src_path;
    # add the malformed count to the report under the key "malformed";
    # write the fair copy to dst_path, every line an f-string:
    #   THE DROWNED LEDGER
    #   souls / duplicates / malformed / earliest / latest / first drowned
    #   then CHAMBER: COUNT lines in alphabetical order;
    # return the enlarged report dict
    pass
`,
        setup: py`_LEDGER_PAGES = [
    "Broderick Bode|Space|1899",
    "",
    "  Elspeth Crane|Time|1877",
    "Augustus Rookwood|Prophecy|1881",
    "Silas Vane|1885",
    "   ",
    "Broderick Bode|Space|1899",
    "Marlowe Fen|Thought|1877",
    "Odile Marsh|Time|1869",
    "the ninth level",
    "   Augustus Rookwood|Prophecy|1881   ",
    "Corvus Selwyn | Death | 1877",
    "",
    "Tobias Whitlock|Prophecy|1885",
    "Odile Marsh|Time|1869",
    "Hesper Gaunt|Death|1866",
    "what the water kept",
    "  Una Thorn|Thought|1902",
    "Marlowe Fen|Thought|1877   ",
    "Edric Blackwood|Prophecy|1902",
]
with open("drowned_ledger.txt", "w") as _page:
    _page.write("\n".join(_LEDGER_PAGES) + "\n")
`,
        validation: py`assert "clean_lines" in dir() and "parse_entries" in dir() and "ledger_report" in dir(), "An earlier stage has gone missing — clean_lines, parse_entries, and ledger_report must all still stand."
_drawn = clean_lines("drowned_ledger.txt")
assert isinstance(_drawn, list) and len(_drawn) == 17 and all(_l == _l.strip() and _l != "" for _l in _drawn), "clean_lines has regressed — 17 stripped, non-blank survivors, exactly as stage one swore. A later stage may not break an earlier one."
_records, _malformed = parse_entries(_drawn)
assert len(_records) == 14 and _malformed == 3, "parse_entries has regressed — 14 records and 3 malformed, as stage two swore."
_prior = ledger_report(_records)
assert _prior["souls"] == 10 and _prior["duplicates"] == 4 and _prior["first_drowned"] == "Hesper Gaunt", "ledger_report has regressed — ten souls, four re-recordings, Hesper Gaunt first taken, as stage three swore."
assert "file_report" in dir(), "The Codex finds no file_report — the working must bear exactly that name: file_report(src_path, dst_path)."
try:
    _summary = file_report("drowned_ledger.txt", "fair_copy.txt")
except FileNotFoundError:
    raise AssertionError("file_report went looking for the wrong page — read exactly src_path and write exactly dst_path, the two paths it is handed.")
except TypeError:
    raise AssertionError("file_report could not be summoned with two arguments — define it as file_report(src_path, dst_path), and hand each path to the right rite.")
assert _summary is not None, "file_report handed back None — return the enlarged report dict."
assert isinstance(_summary, dict), "file_report must return the summary dict — the report, enlarged with the malformed count."
assert _summary.get("malformed") == 3, "The summary must carry the malformed count under the key malformed — 3 for this page, got " + repr(_summary.get("malformed")) + "."
assert _summary.get("souls") == 10 and _summary.get("duplicates") == 4, "The summary must carry the whole report — souls 10 and duplicates 4 alongside the rest."
import os as _os
assert _os.path.exists("fair_copy.txt"), "No fair copy was written — file_report must write the report file at dst_path."
with open("fair_copy.txt", "r") as _fc:
    _lines = _fc.read().splitlines()
assert len(_lines) == 12, "The fair copy runs twelve lines — the header, six counts, and five chambers; got " + str(len(_lines)) + "."
assert _lines[0] == "THE DROWNED LEDGER", "The fair copy must open with the header, exactly: THE DROWNED LEDGER — got " + repr(_lines[0]) + "."
assert _lines[1] == "souls: 10", "Line two must read exactly souls: 10 — got " + repr(_lines[1]) + "."
assert _lines[2] == "duplicates: 4" and _lines[3] == "malformed: 3", "Lines three and four must read exactly duplicates: 4, then malformed: 3."
assert _lines[4] == "earliest: 1866" and _lines[5] == "latest: 1902", "Lines five and six must read exactly earliest: 1866, then latest: 1902."
assert _lines[6] == "first drowned: Hesper Gaunt", "Line seven must read exactly first drowned: Hesper Gaunt — got " + repr(_lines[6]) + "."
assert _lines[7:] == ["Death: 2", "Prophecy: 3", "Space: 1", "Thought: 2", "Time: 2"], "The chambers close the copy, one per line as CHAMBER: COUNT, in alphabetical order — got " + str(_lines[7:]) + "."
with open("_second_page.txt", "w") as _sp:
    _sp.write("Mira Voss|Time|1900\n\nMira Voss|Time|1900\ngone under\n")
_s2 = file_report("_second_page.txt", "_second_copy.txt")
assert _s2.get("souls") == 1 and _s2.get("duplicates") == 1 and _s2.get("malformed") == 1, "Handed a different page, file_report must run the whole restoration on THAT page — one soul, one re-recording, one line beyond reading."
with open("_second_copy.txt", "r") as _sc:
    _l2 = _sc.read().splitlines()
assert _l2[0] == "THE DROWNED LEDGER" and _l2[1] == "souls: 1" and _l2[7:] == ["Time: 1"], "The second fair copy must wear the same form — the header, then souls: 1, closing with a single chamber line: Time: 1."
assert ('f"' in _source) or ("f'" in _source), "The fair copy is to be written with f-strings — build each line as an f-string, not by stitching pieces together with +."`,
        canon: py`# The Drowned Ledger — stage 4: the fair copy.

def clean_lines(path):
    with open(path, "r") as page:
        raw = page.read().splitlines()
    cleaned = []
    for line in raw:
        line = line.strip()
        if line != "":
            cleaned.append(line)
    return cleaned


def parse_entries(lines):
    records = []
    malformed = 0
    for line in lines:
        parts = line.split("|")
        if len(parts) != 3:
            malformed = malformed + 1
            continue
        records.append({
            "name": parts[0].strip(),
            "chamber": parts[1].strip(),
            "year": int(parts[2].strip()),
        })
    return records, malformed


def ledger_report(records):
    unique = []
    seen = set()
    for record in records:
        key = (record["name"], record["chamber"], record["year"])
        if key not in seen:
            seen.add(key)
            unique.append(record)
    chambers = {}
    for record in unique:
        chambers[record["chamber"]] = chambers.get(record["chamber"], 0) + 1
    years = [record["year"] for record in unique]
    first = min(unique, key=lambda record: record["year"])
    return {
        "souls": len(unique),
        "duplicates": len(records) - len(unique),
        "chambers": chambers,
        "earliest": min(years),
        "latest": max(years),
        "first_drowned": first["name"],
    }


def file_report(src_path, dst_path):
    lines = clean_lines(src_path)
    records, malformed = parse_entries(lines)
    report = ledger_report(records)
    report["malformed"] = malformed
    with open(dst_path, "w") as fair:
        fair.write("THE DROWNED LEDGER\n")
        fair.write(f"souls: {report['souls']}\n")
        fair.write(f"duplicates: {report['duplicates']}\n")
        fair.write(f"malformed: {report['malformed']}\n")
        fair.write(f"earliest: {report['earliest']}\n")
        fair.write(f"latest: {report['latest']}\n")
        fair.write(f"first drowned: {report['first_drowned']}\n")
        for chamber in sorted(report["chambers"]):
            fair.write(f"{chamber}: {report['chambers'][chamber]}\n")
    return report
`,
        xp: 50,
      },
      {
        id: 'gwledgers5',
        title: 'Against the Water',
        brief: 'Last, the water itself. Some night this working will be pointed at a page '
          + 'that is not there, and it must refuse in its own voice, not die in the '
          + 'machine’s.\n\n'
          + '- Harden `clean_lines`: catch `FileNotFoundError` around the `open` and raise '
          + 'in its place a `ValueError` whose message is, via f-string, '
          + '`the lake gave up no page named PATH`\n'
          + '- `file_report` must let that refusal rise — and it must **never** write a fair '
          + 'copy for a page it could not read\n'
          + '- close the working: under `if __name__ == "__main__":`, call '
          + '`file_report("drowned_ledger.txt", "ledger_report.txt")` inside a `try` and '
          + 'print, from the summary’s `souls`, `duplicates`, and `malformed` via one '
          + 'f-string, exactly `filed: 10 souls, 4 re-recordings, 3 beyond reading`; on '
          + '`ValueError`, print the error instead\n\n'
          + 'Everything prior must still stand.',
        starter: py`# The Drowned Ledger — stage 5: against the water.
# (Your stage-4 working carries forward; this text is the fallback.)
#
# TODO (1): harden clean_lines — catch FileNotFoundError around the
# open and raise ValueError with the message, via f-string:
#   the lake gave up no page named PATH
# TODO (2): at the bottom, under if __name__ == "__main__":, call
# file_report("drowned_ledger.txt", "ledger_report.txt") inside a try
# and print one f-string built from the summary:
#   filed: N souls, N re-recordings, N beyond reading
# On ValueError, print the error instead.

def clean_lines(path):
    with open(path, "r") as page:
        raw = page.read().splitlines()
    cleaned = []
    for line in raw:
        line = line.strip()
        if line != "":
            cleaned.append(line)
    return cleaned


def parse_entries(lines):
    records = []
    malformed = 0
    for line in lines:
        parts = line.split("|")
        if len(parts) != 3:
            malformed = malformed + 1
            continue
        records.append({
            "name": parts[0].strip(),
            "chamber": parts[1].strip(),
            "year": int(parts[2].strip()),
        })
    return records, malformed


def ledger_report(records):
    unique = []
    seen = set()
    for record in records:
        key = (record["name"], record["chamber"], record["year"])
        if key not in seen:
            seen.add(key)
            unique.append(record)
    chambers = {}
    for record in unique:
        chambers[record["chamber"]] = chambers.get(record["chamber"], 0) + 1
    years = [record["year"] for record in unique]
    first = min(unique, key=lambda record: record["year"])
    return {
        "souls": len(unique),
        "duplicates": len(records) - len(unique),
        "chambers": chambers,
        "earliest": min(years),
        "latest": max(years),
        "first_drowned": first["name"],
    }


def file_report(src_path, dst_path):
    lines = clean_lines(src_path)
    records, malformed = parse_entries(lines)
    report = ledger_report(records)
    report["malformed"] = malformed
    with open(dst_path, "w") as fair:
        fair.write("THE DROWNED LEDGER\n")
        fair.write(f"souls: {report['souls']}\n")
        fair.write(f"duplicates: {report['duplicates']}\n")
        fair.write(f"malformed: {report['malformed']}\n")
        fair.write(f"earliest: {report['earliest']}\n")
        fair.write(f"latest: {report['latest']}\n")
        fair.write(f"first drowned: {report['first_drowned']}\n")
        for chamber in sorted(report["chambers"]):
            fair.write(f"{chamber}: {report['chambers'][chamber]}\n")
    return report
`,
        setup: py`_LEDGER_PAGES = [
    "Broderick Bode|Space|1899",
    "",
    "  Elspeth Crane|Time|1877",
    "Augustus Rookwood|Prophecy|1881",
    "Silas Vane|1885",
    "   ",
    "Broderick Bode|Space|1899",
    "Marlowe Fen|Thought|1877",
    "Odile Marsh|Time|1869",
    "the ninth level",
    "   Augustus Rookwood|Prophecy|1881   ",
    "Corvus Selwyn | Death | 1877",
    "",
    "Tobias Whitlock|Prophecy|1885",
    "Odile Marsh|Time|1869",
    "Hesper Gaunt|Death|1866",
    "what the water kept",
    "  Una Thorn|Thought|1902",
    "Marlowe Fen|Thought|1877   ",
    "Edric Blackwood|Prophecy|1902",
]
with open("drowned_ledger.txt", "w") as _page:
    _page.write("\n".join(_LEDGER_PAGES) + "\n")
`,
        validation: py`assert "clean_lines" in dir() and "parse_entries" in dir() and "ledger_report" in dir() and "file_report" in dir(), "An earlier stage has gone missing — all four workings must still stand: clean_lines, parse_entries, ledger_report, file_report."
_drawn = clean_lines("drowned_ledger.txt")
assert isinstance(_drawn, list) and len(_drawn) == 17 and all(_l == _l.strip() and _l != "" for _l in _drawn), "clean_lines has regressed on a page that exists — 17 stripped, non-blank survivors, exactly as before. Hardening must not change lawful behavior."
_records, _malformed = parse_entries(_drawn)
assert len(_records) == 14 and _malformed == 3, "parse_entries has regressed — 14 records and 3 malformed, as stage two swore."
_prior = ledger_report(_records)
assert _prior["souls"] == 10 and _prior["duplicates"] == 4 and _prior["first_drowned"] == "Hesper Gaunt", "ledger_report has regressed — ten souls, four re-recordings, Hesper Gaunt first taken, as stage three swore."
_summary = file_report("drowned_ledger.txt", "fair_copy.txt")
assert _summary.get("malformed") == 3 and _summary.get("souls") == 10, "file_report has regressed — the summary must still carry souls 10 and malformed 3."
with open("fair_copy.txt", "r") as _fc:
    _lines = _fc.read().splitlines()
assert len(_lines) == 12 and _lines[0] == "THE DROWNED LEDGER" and _lines[6] == "first drowned: Hesper Gaunt", "The fair copy has regressed — twelve lines, the header first, Hesper Gaunt still first taken."
import os as _os
_refused = False
try:
    clean_lines("no_such_page.txt")
except ValueError as _err:
    _refused = True
    assert "no page" in str(_err), "The refusal must speak the authored line — raise ValueError with a message that contains: gave up no page."
except FileNotFoundError:
    raise AssertionError("A missing page still dies of FileNotFoundError — catch it inside clean_lines and raise ValueError in its place, carrying the authored message.")
assert _refused, "clean_lines admitted a page that does not exist — when the file is missing it must raise ValueError, not answer quietly."
_doomed = False
try:
    file_report("no_such_page.txt", "doomed_copy.txt")
except ValueError:
    _doomed = True
except FileNotFoundError:
    raise AssertionError("file_report on a missing page must refuse as ValueError — let the hardened refusal in clean_lines rise through it untouched.")
assert _doomed, "file_report on a missing page must raise ValueError — the refusal travels up from clean_lines."
assert not _os.path.exists("doomed_copy.txt"), "A fair copy was written for a page that could not be read — read the source FIRST; only a lawful reading earns a written report."
_spoken = [_l.strip() for _l in _stdout.splitlines() if _l.strip()]
assert "filed: 10 souls, 4 re-recordings, 3 beyond reading" in _spoken, "The closing page never spoke — under the if __name__ == '__main__' guard, file_report the ledger and print exactly: filed: 10 souls, 4 re-recordings, 3 beyond reading"`,
        canon: py`# The Drowned Ledger — restored, tallied, fair-copied, hardened.

def clean_lines(path):
    try:
        with open(path, "r") as page:
            raw = page.read().splitlines()
    except FileNotFoundError:
        raise ValueError(f"the lake gave up no page named {path}")
    cleaned = []
    for line in raw:
        line = line.strip()
        if line != "":
            cleaned.append(line)
    return cleaned


def parse_entries(lines):
    records = []
    malformed = 0
    for line in lines:
        parts = line.split("|")
        if len(parts) != 3:
            malformed = malformed + 1
            continue
        records.append({
            "name": parts[0].strip(),
            "chamber": parts[1].strip(),
            "year": int(parts[2].strip()),
        })
    return records, malformed


def ledger_report(records):
    unique = []
    seen = set()
    for record in records:
        key = (record["name"], record["chamber"], record["year"])
        if key not in seen:
            seen.add(key)
            unique.append(record)
    chambers = {}
    for record in unique:
        chambers[record["chamber"]] = chambers.get(record["chamber"], 0) + 1
    years = [record["year"] for record in unique]
    first = min(unique, key=lambda record: record["year"])
    return {
        "souls": len(unique),
        "duplicates": len(records) - len(unique),
        "chambers": chambers,
        "earliest": min(years),
        "latest": max(years),
        "first_drowned": first["name"],
    }


def file_report(src_path, dst_path):
    lines = clean_lines(src_path)
    records, malformed = parse_entries(lines)
    report = ledger_report(records)
    report["malformed"] = malformed
    with open(dst_path, "w") as fair:
        fair.write("THE DROWNED LEDGER\n")
        fair.write(f"souls: {report['souls']}\n")
        fair.write(f"duplicates: {report['duplicates']}\n")
        fair.write(f"malformed: {report['malformed']}\n")
        fair.write(f"earliest: {report['earliest']}\n")
        fair.write(f"latest: {report['latest']}\n")
        fair.write(f"first drowned: {report['first_drowned']}\n")
        for chamber in sorted(report["chambers"]):
            fair.write(f"{chamber}: {report['chambers'][chamber]}\n")
    return report


if __name__ == "__main__":
    try:
        summary = file_report("drowned_ledger.txt", "ledger_report.txt")
        print(f"filed: {summary['souls']} souls, {summary['duplicates']} re-recordings, {summary['malformed']} beyond reading")
    except ValueError as err:
        print(err)
`,
        xp: 55,
      },
    ],
  },

  // ----------------------------------------------------------
  // Rite — Leaving the Codex (see act3rite.js)
  // ----------------------------------------------------------
  rite,

  // ----------------------------------------------------------
  // Codex — this act's vocabulary
  // ----------------------------------------------------------
  codex: [
    { term: 'def', def: 'The keyword that creates a **function** — a named, reusable block of code whose body runs only when called.' },
    { term: 'parameter', def: 'A named slot in a function’s `def` line that receives a value each time the function is called.' },
    { term: 'argument', def: 'The actual value supplied for a parameter at the moment of a call.' },
    { term: 'return', def: 'Ends a function immediately and hands a value back to the caller — the call expression becomes that value.' },
    { term: 'None', def: 'Python’s value for *nothing here* — what every function returns when it never reaches a `return`.' },
    { term: '*args / **kwargs', def: 'The gathering parameters: `*args` collects extra positional arguments into a **tuple**; `**kwargs` collects extra keyword arguments into a **dict** of name to value.' },
    { term: 'mutable default argument', def: 'The silent curse of `def f(x, acc=[])`: the default is created **once**, at `def`, and shared by every call — default to `None` and build a fresh list inside the body.' },
    { term: 'scope', def: 'The region of code where a name is visible — locals live and die inside their function; globals span the file.' },
    { term: 'shadowing', def: 'When an assignment inside a function creates a local that hides a global of the same name, leaving the global untouched.' },
    { term: 'lambda', def: 'An unnamed function of one expression — `lambda n: n * 2` — whose result is returned automatically.' },
    { term: 'key function', def: 'A function handed to `sorted(iterable, key=...)`; it is called on each element and the results decide the ordering.' },
    { term: 'exception', def: 'An object Python **raises** when an operation cannot proceed; unhandled, it stops the program with a traceback.' },
    { term: 'raise', def: 'Deliberately throws an exception — `raise ValueError("message")` — to refuse bad input loudly at the threshold.' },
    { term: 'finally', def: 'The clause of a `try` statement that runs no matter what — success, exception, or early return — used for cleanup.' },
    { term: 'with', def: 'A statement that opens a resource such as `open(path, mode)` and guarantees it is closed when the block ends, even on error.' },
    { term: 'import', def: 'Binds another module’s workings into your file — `import math`, `from math import sqrt`, or aliased with `as`.' },
  ],
};
