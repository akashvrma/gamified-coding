// ============================================================
// act3.js — Act III: The Department of Mysteries
// Functions & Program Structure: def, parameters, return,
// scope, lambdas, exceptions, files, imports.
// Written to docs/CONTENT_SPEC.md (v1).
// ============================================================

const py = String.raw;

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
  // Codex — this act's vocabulary
  // ----------------------------------------------------------
  codex: [
    { term: 'def', def: 'The keyword that creates a **function** — a named, reusable block of code whose body runs only when called.' },
    { term: 'parameter', def: 'A named slot in a function’s `def` line that receives a value each time the function is called.' },
    { term: 'argument', def: 'The actual value supplied for a parameter at the moment of a call.' },
    { term: 'return', def: 'Ends a function immediately and hands a value back to the caller — the call expression becomes that value.' },
    { term: 'None', def: 'Python’s value for *nothing here* — what every function returns when it never reaches a `return`.' },
    { term: '*args', def: 'A starred parameter that gathers all extra positional arguments into a **tuple**.' },
    { term: '**kwargs', def: 'A double-starred parameter that gathers all extra keyword arguments into a **dict** of name to value.' },
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
