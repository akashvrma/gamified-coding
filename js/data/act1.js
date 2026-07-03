// ============================================================
// act1.js — Act I: The Restricted Section (Python Fundamentals)
// print · variables · strings · numbers · booleans · branching
// · errors. See docs/CONTENT_SPEC.md for the binding contract.
// ============================================================
const py = String.raw;

export default {
  id: 'act1',
  numeral: 'I',
  arc: 'Python Fundamentals',
  title: 'The Restricted Section',
  tagline: 'Where the first words of power are shelved beside the reasons they were forbidden.',
  sigil: '🕯️',
  epigraph: {
    text: 'Do not pity the books their chains. The chains were never for the thieves.',
    source: 'inked inside the cover of a confiscated primer',
  },
  intro: 'Beyond the rope, beneath the sign that forbids you, the shelves keep the first '
    + 'grammar of power. This act teaches Python’s fundamentals, and teaches them completely: '
    + 'making the machine speak with `print()`, binding values into named variables, shaping '
    + 'text with strings, keeping the dark’s ledgers with numbers, weighing truth with '
    + 'booleans, forking your code’s path with `if`, and reading the marks that failure '
    + 'leaves behind.\n\n'
    + 'Nothing in this room is decoration. Each trial feeds the next, and the warden at the '
    + 'far end — a gate kept by something that drinks certainty — will test all seven at once.',

  lessons: [

    // ------------------------------------------------------------
    // a1l1 — print(), comments, top-to-bottom execution
    // ------------------------------------------------------------
    {
      id: 'a1l1',
      title: 'The First Incantation',
      concept: 'print(), comments, and how Python reads your code top to bottom',
      xp: 30,
      narrative: 'Past the rope, past the sign that forbids you, the Restricted Section keeps '
        + 'its own hours. The books here are chained not to stop thieves, but to stop the '
        + 'books. On a lectern lies a thin black primer — unchained, open, waiting, as though '
        + 'it had been expecting you in particular. Its first page holds a single demand in '
        + 'ink that has not dried in a century: *teach the machine to speak, and it will '
        + 'tell you everything it has ever been told.*',
      sections: [
        {
          heading: 'The spell that speaks',
          body: 'Python is a language for commanding machines. A **program** is a plain text '
            + 'file of instructions, and the **interpreter** is the thing that obeys it — it '
            + 'reads your file and performs each instruction in turn.\n\n'
            + 'The first instruction every practitioner learns is `print()`. It is a '
            + '**function** — a named action the language already knows — and whatever you '
            + 'place between its parentheses is written to the screen. Text must be wrapped '
            + 'in quotes; quoted text is called a **string**, a captured phrase the machine '
            + 'carries without trying to understand it. Each `print()` writes its text and '
            + 'ends the line, so two prints produce two lines.',
          code: py`print("The rope is behind you now.")
print("The shelves lean in to listen.")`,
          note: 'The quotes are not optional. Write `print(Nox)` without them and Python '
            + 'stops treating Nox as words to speak — it hunts for a *thing* by that name, '
            + 'finds nothing, and the spell collapses. You will meet that particular wound '
            + 'again in the final trial of this act.',
        },
        {
          heading: 'Top to bottom, without mercy',
          body: 'The interpreter reads a program the way a sentence is read under duress: '
            + 'the first line, then the second, then the third. Each line finishes '
            + 'completely before the next begins. Nothing is skipped, nothing is reordered, '
            + 'and nothing runs twice unless you demand it.\n\n'
            + 'This sounds obvious. It is also the single most useful fact you will ever '
            + 'know about a broken program: whatever went wrong, it went wrong at a '
            + '*specific line*, after every line above it had already done its work.',
          code: py`print("First: the door.")
print("Second: the dark behind it.")
print("Third: this line always speaks last.")`,
        },
        {
          heading: 'Margin notes the machine ignores',
          body: 'A line beginning with `#` is a **comment**. The interpreter skips it '
            + 'entirely — it exists for human eyes alone. A `#` partway through a line — '
            + 'outside of quotes — works the same way: everything after it is ignored. But '
            + 'a `#` *inside* a string is merely another character, printed like any other.\n\n'
            + '- Comments record *why* the code exists, not merely what it does.\n'
            + '- They cost the machine nothing and spare the reader everything.\n'
            + '- The reader is usually you, three weeks later, by failing candlelight.',
          code: py`# This note is for the next poor soul. Python never sees it.
print("Only this line runs.")  # this trailing note is skipped too`,
        },
      ],
      challenge: {
        title: 'Words at the Threshold',
        prompt: 'The threshold of the Restricted Section admits no silent visitors. It '
          + 'demands three spoken lines — exact, in order, and unflinching.\n\n'
          + 'Write a program that prints **exactly** these three lines, in this order:\n\n'
          + '- `The candle is lit.`\n'
          + '- `The shelves are watching.`\n'
          + '- `I read at my own peril.`\n\n'
          + 'Capitalisation, spacing and the final periods must match perfectly — the '
          + 'threshold does not negotiate.',
        starter: py`# Speak the three lines of entry, in order, one print() per line.
# Line 1: The candle is lit.
# Line 2: The shelves are watching.
# Line 3: I read at my own peril.
`,
        solution: py`print("The candle is lit.")
print("The shelves are watching.")
print("I read at my own peril.")`,
        hints: [
          'Three lines means three separate print() spells, one for each phrase, in order.',
          'Each phrase goes inside quotes, inside the parentheses: print("...") — copy the wording exactly, capital letters and periods included.',
          'The first line is print("The candle is lit.") — now speak the other two the same way.',
        ],
        validation: py`_lines = [ln for ln in _stdout.splitlines() if ln.strip()]
assert len(_lines) >= 3, "The threshold heard fewer than three lines. Use print() three times, once per phrase."
assert _lines[0] == "The candle is lit.", "The candle stays dark. Line 1 must be exactly: The candle is lit."
assert _lines[1] == "The shelves are watching.", "The shelves turn away. Line 2 must be exactly: The shelves are watching."
assert _lines[2] == "I read at my own peril.", "The oath is incomplete. Line 3 must be exactly: I read at my own peril."`,
        successText: 'The candle steadies and burns a shade too green. Somewhere in the stacks, your name is written down.',
        xp: 50,
      },
      quiz: [
        {
          q: 'What happens when Python runs `print("Nox")`?',
          options: [
            'It sends the word Nox to a paper printer',
            'It writes the text Nox to the screen',
            'It stores Nox in a variable named print',
            'It writes "Nox" to the screen with the quotes still around it',
          ],
          answer: 1,
          explain: 'print() writes text to the screen — the console. It has nothing to do '
            + 'with paper printers, and it stores nothing: the quoted text is spoken and gone. '
            + 'The quotes themselves are never printed — they only mark where the string '
            + 'begins and ends.',
        },
        {
          q: 'Which of these lines will Python ignore completely?',
          options: [
            'print("the ward is weakening")',
            'print("# the ward is weakening")',
            '# the ward is weakening',
            'ward = "weakening"',
          ],
          answer: 2,
          explain: 'A line beginning with # is a comment — the interpreter skips it. The '
            + 'second option is tempting, but its # lives *inside* the quotes, so it is just '
            + 'text and gets printed like any other character.',
        },
        {
          q: 'A program is five lines long. In what order does Python run them?',
          options: [
            'Top to bottom, one line at a time, each finishing before the next begins',
            'All five at once',
            'In whatever order finishes fastest',
            'Bottom to top',
          ],
          answer: 0,
          explain: 'Execution is strictly sequential: line 1 completes, then line 2, and so '
            + 'on. This is why an error can always be traced to one specific line — '
            + 'everything above it had already succeeded.',
        },
        {
          q: 'What goes wrong with `print(Lumos)` — no quotes?',
          options: [
            'It prints Lumos anyway',
            'It prints an empty line',
            'Python silently skips the line',
            'Python treats Lumos as a name to look up, finds nothing bound to it, and raises an error',
          ],
          answer: 3,
          explain: 'Without quotes, Lumos is not text — it is a *name*, and Python goes '
            + 'looking for whatever that name is bound to. Nothing is, so the spell dies '
            + 'with a NameError. Quotes are what make words into a string.',
        },
      ],
    },

    // ------------------------------------------------------------
    // a1l2 — variables, assignment, naming, dynamic typing, type()
    // ------------------------------------------------------------
    {
      id: 'a1l2',
      title: 'Vessels and Souls',
      concept: 'variables, assignment, naming rules, dynamic typing, and type()',
      xp: 30,
      narrative: 'The primer’s second chapter is stained, as if read most often by candle-drip '
        + 'and unsteady hands. It describes the oldest of dark economies: a value too '
        + 'precious to lose is split from the moment that made it and sealed inside a vessel '
        + 'with a name. Speak the name, and the value answers. The chapter’s author is '
        + 'unnervingly practical about the whole affair — every working you will ever build, '
        + 'a margin note insists, is only vessels, names, and the discipline to remember '
        + 'what you sealed where.',
      sections: [
        {
          heading: 'Binding a value to a name',
          body: 'A **variable** is a name bound to a value. The binding is made with a '
            + 'single `=`, the **assignment** rune: name on the left, value on the right. '
            + 'From that moment, writing the name summons the value.\n\n'
            + 'Binding the same name again *replaces* what it held — the old value is '
            + 'released and forgotten. A variable always answers with whatever it was given '
            + 'most recently.',
          code: py`soul_fragment = "diary"
print(soul_fragment)
soul_fragment = "ring"
print(soul_fragment)`,
          note: 'Read `=` as *becomes*, never as *equals*. Asking whether two values are '
            + 'equal is a different rune entirely — `==`, two signs — and you will weigh it '
            + 'properly in the trial called Truth and Lies.',
        },
        {
          heading: 'The law of names',
          body: 'Python accepts a name only if it obeys the law:\n\n'
            + '- Letters, digits and underscores only — `dark_mark_3` is legal.\n'
            + '- It must not *begin* with a digit — `3rd_mark` is refused.\n'
            + '- No spaces — `dark mark` is two names and a syntax wound.\n'
            + '- Reserved words like `if`, `else` and `class` belong to the language and cannot be taken.\n\n'
            + 'Names are **case-sensitive**: `Nagini` and `nagini` are two different '
            + 'vessels. By convention, Python names are written in `snake_case` — lowercase '
            + 'words joined by underscores. Above all, name vessels truthfully: a value '
            + 'sealed under a lying name betrays you later, when you have forgotten the lie.',
          code: py`victim_count = 13     # legal, and honest about what it holds
_veiled = "hidden"    # legal — a name may begin with an underscore
# 13th_victim = ...   -> refused: a name cannot begin with a digit
# victim count = ...  -> refused: a name cannot contain spaces`,
        },
        {
          heading: 'Souls have types; vessels do not',
          body: 'Every value has a **type** — the kind of thing it is. Text in quotes is a '
            + '`str` (a string); a whole number is an `int` (an integer). The built-in '
            + '`type()` function reveals the type of whatever you hand it.\n\n'
            + 'Python is **dynamically typed**: the type lives in the *value*, not the '
            + 'name. A vessel that held a string may be rebound to a number without '
            + 'complaint. Power, and a trap — the language will not stop you from changing '
            + 'a vessel’s nature mid-ritual, so your own discipline must.',
          code: py`prisoner = "the tall one"
print(type(prisoner))   # <class 'str'>
prisoner = 1943
print(type(prisoner))   # <class 'int'> — same name, new soul`,
        },
      ],
      challenge: {
        title: 'Seal the Vessels',
        prompt: 'A confiscated artifact has reached the Restricted ledger, and the ledger '
          + 'accepts only properly sealed entries: the vessel, the count, and proof of the '
          + 'count’s nature.\n\n'
          + 'Write a program that does exactly this:\n\n'
          + '- Create a variable named `vessel` bound to the string `cursed locket`.\n'
          + '- Create a variable named `fragments` bound to the integer `7` — a bare number, no quotes.\n'
          + '- Print the value of `vessel`.\n'
          + '- Print the value of `fragments`.\n'
          + '- Print `type(fragments)` by passing it straight to print: `print(type(fragments))`.',
        starter: py`# The ledger demands three sealed entries.
# 1) Bind the name vessel to the string "cursed locket".
# 2) Bind the name fragments to the integer 7 (no quotes).
# 3) Print vessel, then fragments, then type(fragments).
`,
        solution: py`vessel = "cursed locket"
fragments = 7
print(vessel)
print(fragments)
print(type(fragments))`,
        hints: [
          'An assignment is name = value. Strings wear quotes; integers go bare.',
          'fragments = "7" with quotes would seal a string that merely resembles a number — the ledger can tell the difference. Write fragments = 7.',
          "Three prints: print(vessel), print(fragments), print(type(fragments)) — the last reveals something like <class 'int'>.",
        ],
        validation: py`_names = dir()
assert "vessel" in _names, "The ledger finds no vessel. Create a variable named vessel bound to the string cursed locket."
assert "fragments" in _names, "The ledger finds no fragments. Create a variable named fragments bound to the integer 7."
assert vessel == "cursed locket", "vessel holds the wrong inscription. It must be exactly the string: cursed locket"
assert isinstance(fragments, int) and not isinstance(fragments, bool), "fragments must hold an integer - the number 7 without quotes."
assert fragments == 7, "fragments holds the wrong count. It must be exactly 7."
assert "cursed locket" in _stdout, "The vessel's name never reached the ledger. Print vessel."
assert "7" in _stdout, "The count of fragments never reached the ledger. Print fragments."
assert "<class 'int'>" in _stdout, "The count's nature was never proven. Print type(fragments)."`,
        successText: 'The entries dry instantly, as ink does when the book approves. Somewhere in its box, the locket taps once.',
        xp: 55,
      },
      quiz: [
        {
          q: 'After running `mark = 13`, what has happened?',
          options: [
            'Python has checked whether mark equals 13',
            'The number 13 has been printed',
            'The name mark is now bound to the value 13',
            'A new kind of number called mark has been created',
          ],
          answer: 2,
          explain: 'A single = is assignment: it binds the name on the left to the value on '
            + 'the right. Checking equality is the two-sign rune ==, a different act entirely.',
        },
        {
          q: 'Which of these is a legal variable name?',
          options: ['3rd_shelf', '_veiled_door', 'dark mark', 'class'],
          answer: 1,
          explain: 'Names may use letters, digits and underscores — and may begin with an '
            + 'underscore. They may not begin with a digit, may not contain spaces, and may '
            + 'not be reserved words like class.',
        },
        {
          q: 'What does `type("13")` report?',
          options: [
            "<class 'int'> — it is clearly a number",
            '13',
            'An error',
            "<class 'str'> — the quotes make it text, whatever it resembles",
          ],
          answer: 3,
          explain: 'Quotes decide everything: "13" is a string that happens to look like a '
            + 'number. The value 13 without quotes would be an int. Appearances deceive; '
            + 'type() does not.',
        },
        {
          q: 'Python is *dynamically typed*. What does that mean?',
          options: [
            'A name can be rebound to a value of a different type — the value carries the type, not the name',
            'You must declare each variable’s type before using it',
            'Variables change their values randomly while the program runs',
            'Only numbers have types',
          ],
          answer: 0,
          explain: 'The type belongs to the value inside the vessel, not to the vessel’s '
            + 'name. Rebinding a name to a value of another kind is legal — which is power, '
            + 'and a responsibility the language leaves entirely to you.',
        },
      ],
    },

    // ------------------------------------------------------------
    // a1l3 — strings
    // ------------------------------------------------------------
    {
      id: 'a1l3',
      title: 'The Serpent’s Tongue',
      concept: 'strings — quoting, joining, indexing, slicing, len(), and methods',
      xp: 35,
      narrative: 'There is a language the shelves use among themselves after the candles die '
        + '— a dry sliding of syllables, like scales drawn over parchment. The primer calls '
        + 'all captured speech by one name: the string. Whatever the dark needs said — a '
        + 'password, a prophecy, a victim’s name — travels as a string, and strings can be '
        + 'measured, cut, cleansed and rewoven by anyone who knows the forms. The chapter’s '
        + 'only warning is underlined twice, in a different hand: *those who cannot reshape '
        + 'words will, in time, be reshaped by them.*',
      sections: [
        {
          heading: 'Captured speech',
          body: 'A **string** is text held in quotes. Single quotes and double quotes forge '
            + 'the same creature — `\'nox\'` and `"nox"` are identical — so pick one style '
            + 'and keep to it.\n\n'
            + 'A string is a **sequence of characters**: letters, digits, punctuation and '
            + 'spaces, each occupying one position. The built-in `len()` reports how many '
            + 'characters a string holds — and spaces count, because a space is a character '
            + 'like any other.',
          code: py`hiss = "the chamber is open"
print(len(hiss))   # 19 - the spaces are counted too`,
        },
        {
          heading: 'Cutting the coils',
          body: 'Each character sits at a numbered position called an **index** — and the '
            + 'counting starts at `0`, not 1. `word[0]` is the first character; negative '
            + 'indices count backwards from the end, so `word[-1]` is the last.\n\n'
            + 'A **slice** takes a run of characters: `word[start:stop]` keeps everything '
            + 'from `start` up to but **not including** `stop`. Omit either number and the '
            + 'slice runs to that end of the string.',
          code: py`word = "basilisk"
print(word[0])     # b  - positions begin at 0
print(word[-1])    # k  - negatives count from the end
print(word[0:5])   # basil - start included, stop excluded
print(word[5:])    # isk   - omit the stop to run to the end`,
          note: 'The excluded stop feels like a cruelty until you notice its gift: '
            + '`word[0:5]` is exactly 5 characters long, and `word[:n]` plus `word[n:]` '
            + 'reassembles the whole word with nothing lost and nothing doubled.',
        },
        {
          heading: 'Reweaving',
          body: 'Strings carry **methods** — named operations summoned with a dot after the '
            + 'value. The four you will use most:\n\n'
            + '- `.upper()` and `.lower()` — the text in all capitals, or none.\n'
            + '- `.strip()` — the text with the whitespace shorn from both ends.\n'
            + '- `.replace(old, new)` — the text with every `old` exchanged for `new`.\n\n'
            + 'Mark this: a method hands you a **new** string. The original is never '
            + 'altered — strings in Python cannot be edited in place, only replaced. If you '
            + 'want to keep the result, bind it to a name.',
          code: py`whisper = "   the serpent stirs   "
print(whisper.strip())            # the serpent stirs
print(whisper.strip().upper())    # THE SERPENT STIRS
print("open the gate".replace("open", "seal"))   # seal the gate`,
        },
        {
          heading: 'The joining rune',
          body: 'The `+` rune joins strings end to end — with nothing between them, so '
            + 'supply your own spaces. It joins strings *only*: a number must be converted '
            + 'to text before it may pass, a rite the next chapter teaches — along with a '
            + 'finer instrument for weaving values into sentences.',
          code: py`warning = "beware " + "the " + "serpent"
print(warning)              # beware the serpent
print("open" + "gate")      # opengate - no space unless you supply one`,
        },
      ],
      challenge: {
        title: 'Cleanse the Whisper',
        prompt: 'A whisper has been scraped off the wall of a lower corridor, ragged with '
          + 'dead air at both ends. Before it can be entered into evidence, it must be '
          + 'cleansed, proclaimed, and countermanded.\n\n'
          + 'The starter binds `whisper` to the raw text. Write a program that:\n\n'
          + '- Binds `cleansed` to `whisper` with the surrounding spaces stripped away (use `.strip()`).\n'
          + '- Binds `proclaimed` to `cleansed` in all capitals (use `.upper()`).\n'
          + '- Binds `sealed` to `cleansed` with the word `open` replaced by `sealed` (use `.replace()`).\n'
          + '- Prints `proclaimed`, then prints `sealed`.\n'
          + '- Prints the cleansed whisper’s character count by handing `len(cleansed)` '
          + 'straight to print — a line holding the bare number `19`, counted, never typed by hand.',
        starter: py`# The whisper, exactly as it was scraped from the wall:
whisper = "   the chamber is open   "

# 1) cleansed   = whisper without the surrounding spaces
# 2) proclaimed = cleansed in ALL CAPITALS
# 3) sealed     = cleansed with "open" replaced by "sealed"
# 4) print proclaimed, then sealed
# 5) print len(cleansed) - the bare count, 19, on its own line
`,
        solution: py`whisper = "   the chamber is open   "
cleansed = whisper.strip()
proclaimed = cleansed.upper()
sealed = cleansed.replace("open", "sealed")
print(proclaimed)
print(sealed)
print(len(cleansed))`,
        hints: [
          'Methods hang off a value with a dot: whisper.strip() hands you a new string — it does not change whisper itself, so bind the result to a name.',
          'Chain the bindings in order: cleansed = whisper.strip(), then proclaimed = cleansed.upper(), then sealed = cleansed.replace("open", "sealed").',
          'The final line is print(len(cleansed)) — hand the count straight to print, just as you once printed type(fragments).',
        ],
        validation: py`assert "cleansed" in dir(), "There is no vessel named cleansed. Bind it to whisper.strip()."
assert cleansed == "the chamber is open", "cleansed still carries dead air. Strip the spaces from both ends of whisper with .strip()."
assert proclaimed == "THE CHAMBER IS OPEN", "proclaimed must be cleansed in ALL capitals - use .upper()."
assert sealed == "the chamber is sealed", "sealed must be cleansed with the word open exchanged for sealed - use .replace(\"open\", \"sealed\")."
assert "THE CHAMBER IS OPEN" in _stdout, "The proclamation was never printed. Print proclaimed."
assert "the chamber is sealed" in _stdout, "The countermand was never printed. Print sealed."
assert any(ln.strip() == "19" for ln in _stdout.splitlines()), "The count was never spoken. Print len(cleansed) - a line holding the bare number 19."`,
        successText: 'The wall drinks the corrected words. Far below the floorboards, something very long changes direction.',
        xp: 60,
      },
      quiz: [
        {
          q: 'What does `"Dark" + "Lord"` evaluate to?',
          options: [
            'Dark Lord — Python adds the space for you',
            'DarkLord — the + rune joins strings with nothing between them',
            'An error — strings cannot be added',
            'Dark+Lord',
          ],
          answer: 1,
          explain: 'Concatenation is a bare splice: the strings meet edge to edge. If you '
            + 'want a space, you must supply it yourself — "Dark" + " " + "Lord".',
        },
        {
          q: 'What is `"serpent"[0]`?',
          options: [
            'e — positions are counted from 1',
            'The whole word serpent',
            's — positions are counted from 0',
            'An error',
          ],
          answer: 2,
          explain: 'Indexing starts at zero: position 0 is the first character. The count-'
            + 'from-1 instinct is the single most common wound of this chapter — train it out early.',
        },
        {
          q: 'What does `"riddle"[1:4]` give?',
          options: [
            'idd — start 1 is included, stop 4 is excluded',
            'iddl — both ends are included',
            'rid — the first three letters',
            'dd',
          ],
          answer: 0,
          explain: 'A slice keeps positions start up to but not including stop: positions '
            + '1, 2 and 3 of riddle are i, d, d. The inclusive-stop reading is the tempting '
            + 'trap — Python never includes the stop.',
        },
        {
          q: 'After `spell = "nox"`, the line `spell.upper()` runs on its own. What does `print(spell)` show afterwards?',
          options: [
            'NOX — the method changed the string in place',
            'nox — .upper() handed back a new string, and nothing kept it; the original is untouched',
            'noxNOX',
            'An error — a method’s result must always be bound to a name',
          ],
          answer: 1,
          explain: 'String methods never alter the original — they return a new string, '
            + 'and a result no name catches is discarded on the spot. To keep it, bind it: '
            + 'spell = spell.upper().',
        },
      ],
    },

    // ------------------------------------------------------------
    // a1l4 — numbers, arithmetic, precedence, conversion
    // ------------------------------------------------------------
    {
      id: 'a1l4',
      title: 'Dark Arithmancy',
      concept: 'int and float, the arithmetic operators, precedence, type conversion, and f-strings',
      xp: 35,
      narrative: 'Arithmancy, the respectable schools insist, is the study of number as '
        + 'prophecy. The primer disagrees in the margins: number is not prophecy but '
        + 'bookkeeping, and the dark keeps immaculate books. Cells filled, souls owed, '
        + 'drops of venom to the dram — every bargain has a remainder somewhere, and the '
        + 'practitioner who cannot compute the remainder becomes it. This chapter teaches '
        + 'the machine’s two kinds of number, the operations that bind them, and the small '
        + 'rite of conversion that lets a number written as text be counted at all.',
      sections: [
        {
          heading: 'Two kinds of number',
          body: 'Python keeps two everyday numeric types. An **int** (integer) is a whole '
            + 'number — a count of indivisible things. A **float** carries a decimal point '
            + '— a measurement, with all a measurement’s imprecision.\n\n'
            + 'The familiar runes work as expected: `+` `-` `*` for add, subtract, '
            + 'multiply. But mark division well: `/` **always yields a float**, even when '
            + 'the division is exact — `12 / 4` is `3.0`, not `3`.',
          code: py`souls = 12        # int   - a whole count
dose = 2.5        # float - carries a decimal point
print(souls / 4)  # 3.0   - true division always yields a float
print(souls * 2)  # 24
print(souls - 13) # -1    - the ledger permits debt`,
        },
        {
          heading: 'The remainder always finds you',
          body: 'Three more runes complete the set:\n\n'
            + '- `//` — **floor division**: how many *whole* times the divisor fits; the '
            + 'rest is discarded. (True for the non-negative counts kept here — in truth '
            + '`//` rounds *down*, toward negative infinity.)\n'
            + '- `%` — **modulo**: the remainder that floor division discarded.\n'
            + '- `**` — power: `2 ** 10` is ten 2s multiplied together.\n\n'
            + 'Floor division and modulo are a pair: `227 // 13` tells you how many '
            + 'prisoners each of the 13 cells receives, and `227 % 13` how many stand '
            + 'unassigned in the corridor. Together they account for every last one.',
          code: py`prisoners = 227
cells = 13
print(prisoners // cells)  # 17 - prisoners per cell
print(prisoners % cells)   # 6  - left standing in the corridor
print(2 ** 10)             # 1024`,
        },
        {
          heading: 'Precedence, and changing a number’s nature',
          body: 'Python evaluates in mathematical order, not reading order: `**` first, '
            + 'then `*` `/` `//` `%`, then `+` `-`. Parentheses overrule everything — when '
            + 'in doubt, wrap the intent.\n\n'
            + 'Finally, the conversion rites. Text that merely *looks* like a number is '
            + 'still text: `"45" + 1` is refused with a TypeError, because Python will not '
            + 'guess whether you meant arithmetic or joining. Convert deliberately:\n\n'
            + '- `int("45")` — text to whole number.\n'
            + '- `float("2.5")` — text to decimal number.\n'
            + '- `str(13)` — number to text, so it may be joined with `+`.',
          code: py`print(2 + 3 * 4)     # 14 - multiplication binds tighter
print((2 + 3) * 4)   # 20 - parentheses overrule all
counted = "45"       # a string wearing a number's face
print(int(counted) + 5)    # 50
print("cell " + str(13))   # str() lets a number join text`,
          note: 'The refusal is a mercy. A language that quietly guessed would sometimes '
            + 'guess wrong, and you would never learn where. Python makes you name the '
            + 'conversion, so the intent is written where the next reader can see it.',
        },
      ],
      challenge: {
        title: 'The Ledger of the North Tower',
        prompt: 'A fresh intake has arrived at the prison in the cold sea, and the ledger '
          + 'must balance to the last soul: the wardens miscount nothing, forgive nothing, '
          + 'and inherit the previous keeper’s records as raw text.\n\n'
          + 'The starter provides `prisoners`, `cells`, and `old_ledger` (a count kept as '
          + 'a string by the last keeper). Write a program that:\n\n'
          + '- Binds `per_cell` to the whole number of prisoners each cell receives — floor division.\n'
          + '- Binds `left_over` to the remainder left standing in the corridor — modulo.\n'
          + '- Binds `total` to `prisoners` plus the old ledger’s count — convert `old_ledger` with `int()` first.\n'
          + '- Prints, using f-strings, exactly these three lines:\n\n'
          + '- `Each cell takes 17.`\n'
          + '- `6 wait in the corridor.`\n'
          + '- `The ledger holds 272 souls.`',
        starter: py`prisoners = 227
cells = 13
old_ledger = "45"   # the previous keeper counted in ink, not number

# 1) per_cell  = whole prisoners per cell (floor division)
# 2) left_over = the remainder (modulo)
# 3) total     = prisoners + the old ledger's count (convert it first)
# 4) print the three exact lines demanded by the ledger
`,
        solution: py`prisoners = 227
cells = 13
old_ledger = "45"
per_cell = prisoners // cells
left_over = prisoners % cells
total = prisoners + int(old_ledger)
print(f"Each cell takes {per_cell}.")
print(f"{left_over} wait in the corridor.")
print(f"The ledger holds {total} souls.")`,
        hints: [
          'The pair of runes: // keeps only the whole number of times the division fits; % keeps what was left over.',
          'old_ledger is text. "45" + 227 is a TypeError — write int(old_ledger) to make it a number before adding.',
          'The three prints are f-strings, e.g. print(f"Each cell takes {per_cell}.") — match the wording, spacing and periods exactly.',
        ],
        validation: py`assert "per_cell" in dir(), "The ledger finds no per_cell. Bind it with floor division: prisoners // cells."
assert per_cell == 17, "per_cell is miscounted. Floor division prisoners // cells gives 17."
assert isinstance(per_cell, int), "per_cell must be a whole number - use // (floor division), not / (true division)."
assert left_over == 6, "left_over is miscounted. The remainder prisoners % cells is 6."
assert total == 272, "total is miscounted. Convert the old count with int(old_ledger), then add it to prisoners: 272."
assert "Each cell takes 17." in _stdout, "The ledger's first line is missing or wrong. It must read exactly: Each cell takes 17."
assert "6 wait in the corridor." in _stdout, "The ledger's second line is missing or wrong. It must read exactly: 6 wait in the corridor."
assert "The ledger holds 272 souls." in _stdout, "The ledger's third line is missing or wrong. It must read exactly: The ledger holds 272 souls."`,
        successText: 'The columns balance to the last soul, and the ledger — satisfied — turns its own page.',
        xp: 60,
      },
      quiz: [
        {
          q: 'What does `7 / 2` evaluate to?',
          options: [
            '3 — Python drops the remainder',
            '3.5 — true division always produces a float',
            '3.5, but only if you write 7.0 instead of 7',
            '4 — Python rounds up',
          ],
          answer: 1,
          explain: 'The / rune performs true division and always yields a float — even '
            + '8 / 2 gives 4.0. Dropping the remainder is the work of //, a different rune '
            + 'with a different purpose.',
        },
        {
          q: 'What is `17 % 5`?',
          options: [
            '3 — how many times 5 fits',
            '3.4',
            '2 — the remainder after taking out whole fives',
            '85',
          ],
          answer: 2,
          explain: 'Modulo keeps what floor division discards: 5 fits into 17 three whole '
            + 'times (that is 17 // 5), leaving a remainder of 2. The two runes are a pair '
            + '— confuse them and your ledger lies.',
        },
        {
          q: 'What does `2 + 3 * 4` equal, and why?',
          options: [
            '20 — Python reads left to right',
            '24',
            '14, but only with parentheses added',
            '14 — multiplication binds tighter than addition',
          ],
          answer: 3,
          explain: 'Precedence follows mathematics, not reading order: 3 * 4 happens '
            + 'first, then the addition. To get 20 you would need to overrule precedence '
            + 'yourself, with (2 + 3) * 4.',
        },
        {
          q: 'What happens when you run `"13" + 4`?',
          options: [
            'A TypeError — text and a number refuse to join until you convert one of them',
            'It produces 17',
            'It produces the string 134',
            'Python converts the 4 to text automatically',
          ],
          answer: 0,
          explain: 'Python will not guess between arithmetic and joining, so it refuses. '
            + 'int("13") + 4 gives 17; "13" + str(4) gives "134". You must name which fate '
            + 'you intend.',
        },
      ],
    },

    // ------------------------------------------------------------
    // a1l5 — booleans, comparisons, and/or/not, truthiness
    // ------------------------------------------------------------
    {
      id: 'a1l5',
      title: 'Truth and Lies',
      concept: 'booleans, comparison operators, and/or/not, and the truthiness of empty things',
      xp: 35,
      narrative: 'Truth serums are wasted on people, the primer observes; people believe '
        + 'their own lies. The machine cannot. Beneath every ward, every gate and every '
        + 'trap in this library runs a current of pure verdict — True or False, with no '
        + 'chamber for perhaps. This chapter teaches you to ask questions the machine can '
        + 'answer absolutely, to bind separate verdicts into deeper judgements, and to '
        + 'learn the oldest secret of the empty things: that in Python, *nothing* is one '
        + 'of the most honest answers there is.',
      sections: [
        {
          heading: 'Two verdicts only',
          body: 'A **boolean** is a value with exactly two possible states: `True` or '
            + '`False`, capitalised exactly so. Booleans are made by **comparisons**:\n\n'
            + '- `==` equal, `!=` not equal\n'
            + '- `<` less, `>` greater\n'
            + '- `<=` at most, `>=` at least\n\n'
            + 'A comparison is a complete expression with a value of its own. `souls == 7` '
            + 'is not a wish and not an assignment — it *evaluates* to `True` or `False`, '
            + 'and that verdict can be printed, stored in a variable, or weighed by the '
            + 'forks you will build in the next trial.',
          code: py`souls = 7
print(souls == 7)    # True  - a question, answered
print(souls != 7)    # False
print(souls >= 10)   # False`,
          note: 'One sign binds, two signs ask. `souls = 7` seals a value into a vessel; '
            + '`souls == 7` merely inquires. Confusing the two has undone better '
            + 'practitioners than either of us.',
        },
        {
          heading: 'Binding verdicts together',
          body: 'Three logical runes combine verdicts into larger judgements:\n\n'
            + '- `and` — True only when **both** sides are True.\n'
            + '- `or` — True when **either** side is True.\n'
            + '- `not` — turns the verdict over: `not True` is `False`.\n\n'
            + 'Python is lazily efficient about it: `and` stops the moment one side fails, '
            + 'and `or` stops the moment one side succeeds. Nothing is checked that no '
            + 'longer matters.',
          code: py`of_age = False
escorted = True
print(of_age and escorted)  # False - and demands both
print(of_age or escorted)   # True  - or is satisfied by either
print(not of_age)           # True  - the verdict, overturned`,
        },
        {
          heading: 'The truth of empty things',
          body: 'Here is the secret the gates all use: in Python, **every** value can '
            + 'stand as a verdict. This is called **truthiness**. The empty things count '
            + 'as `False` — the empty string `""`, the number `0` — and the occupied '
            + 'things count as `True`: any non-empty text, any non-zero number.\n\n'
            + 'The built-in `bool()` reveals any value’s verdict. And because `not` works '
            + 'on any value, `not password` is a natural way to ask *is the password '
            + 'empty?* — a question you will put to real use in this trial.',
          code: py`print(bool(""))      # False - empty text holds nothing
print(bool("nox"))   # True  - any actual text
print(bool(0))       # False - zero is the empty number
print(bool(13))      # True`,
        },
      ],
      challenge: {
        title: 'The Gatekeeper’s Questions',
        prompt: 'A figure stands at the gate of the Restricted Section, and the gate asks '
          + 'its three questions of everyone — age, permission, and silence. It accepts '
          + 'only verdicts, never stories.\n\n'
          + 'The starter provides `age`, `slip_signed`, and `password_spoken`. Write a '
          + 'program that:\n\n'
          + '- Binds `of_age` to the verdict of the comparison: is `age` at least 17?\n'
          + '- Binds `admitted` to the verdict: `of_age` **or** `slip_signed`.\n'
          + '- Binds `silent` to the verdict: **not** `password_spoken` — the truthiness of empty text.\n'
          + '- Prints, using f-strings, exactly these three lines:\n\n'
          + '- `Of age: False`\n'
          + '- `Admitted: True`\n'
          + '- `Silent: True`',
        starter: py`# The figure at the gate, as the wards perceive it:
age = 16
slip_signed = True
password_spoken = ""

# 1) of_age   = the verdict: age at least 17
# 2) admitted = the verdict: of_age or slip_signed
# 3) silent   = the verdict: not password_spoken
# 4) print the three exact lines the gate demands
`,
        solution: py`age = 16
slip_signed = True
password_spoken = ""
of_age = age >= 17
admitted = of_age or slip_signed
silent = not password_spoken
print(f"Of age: {of_age}")
print(f"Admitted: {admitted}")
print(f"Silent: {silent}")`,
        hints: [
          'A comparison is already a verdict: age >= 17 evaluates to True or False on its own. Bind it straight to a name — no if required.',
          'or hands back True when either side passes; not turns a verdict over — and empty text "" already counts as False, so not password_spoken is True.',
          'of_age = age >= 17, admitted = of_age or slip_signed, silent = not password_spoken — then three f-string prints, e.g. print(f"Of age: {of_age}").',
        ],
        validation: py`assert "of_age" in dir(), "The gate finds no of_age. Bind it to the comparison age >= 17."
assert of_age is False, "of_age must be the verdict of age >= 17 - and for an age of 16, that verdict is False."
assert admitted is True, "admitted must be of_age or slip_signed - one True side is enough for or."
assert silent is True, "silent must be not password_spoken - empty text counts as False, and not overturns it to True."
assert "Of age: False" in _stdout, "The gate never heard the first verdict. Print exactly: Of age: False"
assert "Admitted: True" in _stdout, "The gate never heard the second verdict. Print exactly: Admitted: True"
assert "Silent: True" in _stdout, "The gate never heard the third verdict. Print exactly: Silent: True"`,
        successText: 'The gate weighs your three verdicts and finds them exact. Lying to it was never an option; being precise was.',
        xp: 65,
      },
      quiz: [
        {
          q: 'What does `5 > 3` evaluate to?',
          options: [
            'The text "yes"',
            'True — a boolean value',
            '5',
            'Nothing — comparisons only work inside an if',
          ],
          answer: 1,
          explain: 'A comparison is an ordinary expression that evaluates to a boolean. It '
            + 'needs no if around it — you can print it, store it, or combine it with '
            + 'and/or/not wherever you stand.',
        },
        {
          q: 'What is the difference between `=` and `==`?',
          options: [
            '= binds a value to a name; == asks whether two values are equal',
            'They are interchangeable',
            '== binds a value; = compares',
            '== only works on numbers',
          ],
          answer: 0,
          explain: 'One sign binds, two signs ask. Writing = where you meant == changes a '
            + 'question into an act — one of the oldest and best-hidden wounds in the craft.',
        },
        {
          q: 'What does `(4 > 2) and (1 > 3)` evaluate to?',
          options: [
            'True — one True side is enough',
            '4',
            'False — and requires both sides to be True',
            'An error',
          ],
          answer: 2,
          explain: 'and is the stricter rune: both sides must pass. One True side being '
            + 'enough is the law of or — keeping the two straight is half of this chapter.',
        },
        {
          q: 'What does `not ""` evaluate to?',
          options: [
            'False',
            'The empty string',
            'An error — not requires a boolean',
            'True — an empty string counts as False, and not overturns it',
          ],
          answer: 3,
          explain: 'Truthiness lets any value stand as a verdict: "" is one of the empty '
            + 'things and counts as False, so not "" is True. This is why not text is a '
            + 'natural way to ask whether text is empty.',
        },
      ],
    },

    // ------------------------------------------------------------
    // a1l6 — if / elif / else, nesting, indentation
    // ------------------------------------------------------------
    {
      id: 'a1l6',
      title: 'Forks in the Dark',
      concept: 'if, elif and else — branching, nesting, and indentation as law',
      xp: 40,
      narrative: 'Deep enough into the stacks, the aisles begin to choose for you: shelves '
        + 'close ranks, doors offer themselves, and the wrong turning is rarely the one '
        + 'that kills at once. The primer is blunt on the subject: a program that cannot '
        + 'choose is a corridor, and corridors get their walkers eaten. This chapter puts '
        + 'a fork in your code’s path — do this if that holds, otherwise do something '
        + 'else — and it names the law by which every Python choice is bound: '
        + 'indentation, exact and unforgiving.',
      sections: [
        {
          heading: 'The if — a door that needs a key',
          body: 'An `if` statement guards a block of code with a condition:\n\n'
            + '- The line starts with `if`, then a condition — any expression with a verdict — then a colon `:`.\n'
            + '- Below it, **indented by four spaces**, stands the block: the lines that run only when the verdict is `True`.\n'
            + '- The block ends where the indentation returns to the left margin.\n\n'
            + 'Indentation is not style here — it is **structure**. Python knows which '
            + 'lines belong to the `if` purely by how far they stand from the margin. '
            + 'Inconsistent indentation is not untidy; it is a different program, or a '
            + 'refusal to run at all.',
          code: py`threat = 8
if threat > 5:
    print("Ward the door.")
    print("Both these lines belong to the if.")
print("This line stands outside. It runs regardless.")`,
        },
        {
          heading: 'else and elif — the first true door wins',
          body: 'An `else` clause catches everything the `if` refused; an `elif` ("else '
            + 'if") adds another guarded door between them. A chain is read from the top:\n\n'
            + '- Conditions are tested in order, and **the first True one wins**.\n'
            + '- Exactly one branch of the chain runs — never two, never none (when an `else` is present).\n'
            + '- Later conditions are not even examined once a door has opened.\n\n'
            + 'Order your doors from most specific to least, and let `else` hold whatever '
            + 'remains.',
          code: py`hour = 3
if hour < 1:
    print("The library sleeps.")
elif hour < 4:
    print("Something walks the stacks.")
else:
    print("Dawn changes nothing down here.")`,
          note: 'Trace it: hour < 1 fails, so the chain tries the elif; hour < 4 holds, '
            + 'so that branch runs — and the else is never consulted. Had hour been 0, '
            + 'the first door would have opened and the elif would never have been tested, '
            + 'true or not.',
        },
        {
          heading: 'Choices within choices',
          body: 'Blocks nest. Inside an `if` branch you may open another `if`, indented '
            + 'one level deeper — four more spaces. This is how a program asks a second '
            + 'question only when the first answer made it matter.\n\n'
            + 'Nesting is power, and like all power it compounds into a debt: every level '
            + 'deep is a level the next reader must hold in mind. Two levels is craft. '
            + 'Five is a cry for help.',
          code: py`sighting = "wraith"
armed = False
if sighting == "wraith":
    if armed:
        print("Stand. Strike.")
    else:
        print("Run.")
else:
    print("The aisle is empty.")`,
        },
      ],
      challenge: {
        title: 'The Watcher in the Aisle',
        prompt: 'Something has drifted into the aisle ahead, and your ward must answer for '
          + 'you — correctly, and only once. A ward that speaks every warning at once is '
          + 'no ward at all.\n\n'
          + 'The starter provides `sighting` and `patronus_learned`. Write a single '
          + 'if / elif / else chain:\n\n'
          + '- If `sighting` equals `"dementor"`: print `A dementor drifts near.` — and then, '
          + '**nested inside that branch**, if `patronus_learned` is true print '
          + '`Your guardian light holds it back.`, otherwise print `You have nothing to hold it back.`\n'
          + '- Otherwise, if `sighting` equals `"poltergeist"`: print `Only a nuisance. Walk on.`\n'
          + '- Otherwise: print `The aisle is empty. For now.`\n\n'
          + 'With the starter’s values, exactly two lines should appear — the dementor '
          + 'line and the helpless one. No other branch may speak.',
        starter: py`# The aisle, as your ward perceives it:
sighting = "dementor"
patronus_learned = False

# Write the fork:
#   dementor     -> "A dementor drifts near."
#                   then, nested: guardian light held back, or nothing to hold it
#   poltergeist  -> "Only a nuisance. Walk on."
#   anything else -> "The aisle is empty. For now."
`,
        solution: py`sighting = "dementor"
patronus_learned = False
if sighting == "dementor":
    print("A dementor drifts near.")
    if patronus_learned:
        print("Your guardian light holds it back.")
    else:
        print("You have nothing to hold it back.")
elif sighting == "poltergeist":
    print("Only a nuisance. Walk on.")
else:
    print("The aisle is empty. For now.")`,
        hints: [
          'A chain is if / elif / else — each line ends in a colon, and each body is indented four spaces beneath its door.',
          'The comparison is sighting == "dementor" — two equals signs. The second if lives INSIDE the dementor branch, indented one level deeper (eight spaces).',
          'Shape: if sighting == "dementor": print the sighting line, then an indented if patronus_learned: / else: pair beneath it. Then elif sighting == "poltergeist": and finally else: for the empty aisle.',
        ],
        validation: py`assert "A dementor drifts near." in _stdout, 'The dementor branch never spoke. Compare with sighting == "dementor" and print: A dementor drifts near.'
assert "You have nothing to hold it back." in _stdout, "patronus_learned is False, so the nested else must print: You have nothing to hold it back."
assert "Your guardian light holds it back." not in _stdout, "The guardian line spoke although patronus_learned is False - your nested if is not checking the verdict."
assert "Only a nuisance. Walk on." not in _stdout, "The poltergeist line spoke for a dementor - only ONE branch of a chain may run."
assert "The aisle is empty. For now." not in _stdout, "The empty-aisle line spoke although the sighting is a dementor - your conditions are not guarding their doors."`,
        successText: 'The fork holds. The thing in the aisle finds only the one path you allowed it — and drifts back into the cold.',
        xp: 70,
      },
      quiz: [
        {
          q: 'Why does Python demand consistent indentation?',
          options: [
            'Indentation is how Python knows which lines belong to which branch — it is structure, not decoration',
            'It only makes code prettier; Python ignores it',
            'Only comments need to be indented',
            'Indentation makes the program run faster',
          ],
          answer: 0,
          explain: 'In Python, the indentation IS the block. There are no braces to fall '
            + 'back on — a line’s distance from the margin decides which door it stands '
            + 'behind, and inconsistency is an error, not a style choice.',
        },
        {
          q: 'In an `if` / `elif` / `else` chain, how many branches run?',
          options: [
            'Every branch whose condition is True',
            'Exactly one — the first whose condition is True, or the else if none are',
            'All of them, top to bottom',
            'None, unless you call the chain by name',
          ],
          answer: 1,
          explain: 'The chain is a corridor of doors tried in order: the first True '
            + 'condition claims the walker, and everything below — even later True '
            + 'conditions — is never examined.',
        },
        {
          q: 'With `wands = 5`: `if wands > 10:` … `elif wands > 2:` … `else:` — which branch runs?',
          options: [
            'The if — 5 is close enough to 10',
            'The else',
            'The elif — the if fails, and 5 > 2 is True',
            'Both the elif and the else',
          ],
          answer: 2,
          explain: 'Conditions are exact, not approximate: 5 > 10 is False, so the chain '
            + 'moves on; 5 > 2 is True, so the elif runs and the else is never reached.',
        },
        {
          q: 'What is wrong with the line `if lives > 0` on its own?',
          options: [
            'Nothing is wrong with it',
            'if must be written with a capital I',
            'lives must be wrapped in quotes',
            'It is missing the colon at the end — Python raises a SyntaxError',
          ],
          answer: 3,
          explain: 'Every if, elif and else line must end with a colon — it is the hinge '
            + 'on which the door swings. Omit it and Python refuses the grammar before '
            + 'the program runs a single line.',
        },
      ],
    },

    // ------------------------------------------------------------
    // a1l7 — errors, tracebacks, debugging mindset
    // ------------------------------------------------------------
    {
      id: 'a1l7',
      title: 'Reading the Dark Marks',
      concept: 'errors and tracebacks — SyntaxError, NameError, TypeError, IndexError, and a debugging mindset',
      xp: 40,
      narrative: 'Every failed working leaves a scar on the air. The practitioners call '
        + 'them dark marks; the interpreter calls them **tracebacks**. New students see a '
        + 'wall of accusation and look away — which is why new students remain new until '
        + 'something in the stacks eats them. The truth is gentler and stranger: a '
        + 'traceback is the most loyal informant you will ever own. It names the wound, '
        + 'points to the line, and has never once lied. This final chapter teaches you to '
        + 'read the marks calmly, from the last line upward, and to mend one wound at a '
        + 'time.',
      sections: [
        {
          heading: 'Anatomy of a dark mark',
          body: 'When code dies, Python prints a traceback. Read it **from the last line '
            + 'first**:\n\n'
            + '- The **last line** names the kind of error and gives its message — the wound and its cause.\n'
            + '- The lines above give the **location**: the file and line number where it happened.\n\n'
            + 'That is the whole discipline. Not the wall of text — the last line, then '
            + 'the line number, then the code standing at that address.',
          code: py`print(candel)

# The mark this leaves:
#   Traceback (most recent call last):
#     File "<spell>", line 1, in <module>
#   NameError: name 'candel' is not defined
#
# Last line first: a NameError, because nothing was ever bound
# to the name candel. The misspelling is now obvious.`,
        },
        {
          heading: 'The four marks you will meet first',
          body: 'Four wounds account for most early deaths:\n\n'
            + '- `SyntaxError` — broken grammar: a missing colon, an unclosed parenthesis or quote. Python refuses to start; **nothing runs at all**.\n'
            + '- `NameError` — a name that was never bound, usually a misspelling of one that was.\n'
            + '- `TypeError` — sound grammar, wrong kinds: `"souls: " + 3` asks text and number to join unconverted, and they refuse.\n'
            + '- `IndexError` — a position past the end of a sequence: `"nox"[7]` when the string ends at index 2.\n\n'
            + 'SyntaxError stands apart from the other three: it is caught **before** '
            + 'execution, so not even line one has run. The rest strike mid-flight, and '
            + 'every line above the wound has already done its work.',
          code: py`# SyntaxError - grammar broken; nothing runs at all:
#     print("nox"          <- the parenthesis was never closed
# NameError - the name was never bound (often a misspelling):
#     print(candel)
# TypeError - the kinds refuse to combine:
#     "souls: " + 3
# IndexError - a position beyond the end:
#     "nox"[7]`,
          note: 'One quirk worth its weight in silver: an unclosed parenthesis often '
            + 'makes Python point at the line *below* the true wound — it read onward, '
            + 'hoping the closure would come. When a SyntaxError makes no sense where it '
            + 'points, look one line up.',
        },
        {
          heading: 'The mindset that survives',
          body: 'Debugging is not divination; it is procedure. When a mark appears:\n\n'
            + '- Read the **last line**. Name the error kind aloud.\n'
            + '- Go to the **line number** it cites, and read the code standing there.\n'
            + '- Change **one thing**. Run again. One wound, one mending — never three guesses at once.\n'
            + '- When a vessel’s contents are in doubt, make the machine confess: print the value and look at it.\n\n'
            + 'An error is not a judgement of you. It is information — freely given, '
            + 'precisely aimed, and more honest than most allies you will keep.',
          code: py`# When unsure what a vessel actually holds, make it confess:
step = 2
print(f"step is {step} before the ritual begins")`,
        },
      ],
      challenge: {
        title: 'Mend the Wounded Ward',
        prompt: 'A dead apprentice’s ward still hangs on the door of the deepest aisle, '
          + 'too valuable to discard and too wounded to fire. It carries **four wounds** '
          + '— one `SyntaxError`, one `NameError`, one `TypeError`, one `IndexError` — '
          + 'and it must be mended, not rewritten.\n\n'
          + 'Cast the ward as it stands. Read the **last line** of the mark it leaves, '
          + 'mend that one wound, and cast again — four times, until it speaks exactly '
          + 'these five lines:\n\n'
          + '- `The incantation: lumen tenebris`\n'
          + '- `Its echo: LUMEN TENEBRIS`\n'
          + '- `The guardian is silver doe`\n'
          + '- `Letters counted: 14`\n'
          + '- `First letter: l`\n\n'
          + 'Keep the ward’s shape — fix the wounds, do not replace the ritual.',
        starter: py`# The dead apprentice's ward. Four wounds. Mend one at a time:
# cast, read the LAST line of the mark, fix, cast again.
incantation = "lumen tenebris"
echo = incantation.upper()
print("The incantation: " + incantation)
print("Its echo: " + echo
guardian = "silver doe"
print("The guardian is " + gaurdian)
print("Letters counted: " + len(incantation))
print("First letter: " + incantation[30])
`,
        solution: py`incantation = "lumen tenebris"
echo = incantation.upper()
print("The incantation: " + incantation)
print("Its echo: " + echo)
guardian = "silver doe"
print("The guardian is " + guardian)
print("Letters counted: " + str(len(incantation)))
print("First letter: " + incantation[0])`,
        hints: [
          'Cast the ward as-is and read only the LAST line of the mark: it names the wound and the line. Mend that one wound, then cast again — the next mark will be different.',
          'The four wounds, in the order the marks reveal them: a parenthesis never closed; a name spelled wrongly; a number glued to text without str(); an index far beyond the string’s end.',
          'Close print("Its echo: " + echo) with a final parenthesis, spell guardian correctly, wrap len(incantation) in str(...), and take index 0 for the first letter.',
        ],
        validation: py`_lines = [ln for ln in _stdout.splitlines() if ln.strip()]
assert len(_lines) == 5, "The mended ward must speak exactly five lines - it spoke a different number. Compare against the five demanded lines."
assert _lines[0] == "The incantation: lumen tenebris", "Line 1 is wrong. It must read exactly: The incantation: lumen tenebris"
assert _lines[1] == "Its echo: LUMEN TENEBRIS", "Line 2 is wrong - the unclosed parenthesis (the SyntaxError wound) hides on this print."
assert _lines[2] == "The guardian is silver doe", "Line 3 is wrong - check the spelling of the guardian's vessel (the NameError wound)."
assert _lines[3] == "Letters counted: 14", "Line 4 is wrong - a raw number cannot join text; wrap len(incantation) in str(...) (the TypeError wound)."
assert _lines[4] == "First letter: l", "Line 5 is wrong - the first letter lives at index 0, not 30 (the IndexError wound)."`,
        successText: 'The ward reknits itself, scar by scar. You did not guess — you read, and the marks obeyed.',
        xp: 75,
      },
      quiz: [
        {
          q: 'A traceback fills the screen. Where do you look first?',
          options: [
            'The first line',
            'The last line — it names the error type and its message',
            'The longest line',
            'Nowhere — restart the program and hope',
          ],
          answer: 1,
          explain: 'The last line carries the verdict: the kind of error and why. The '
            + 'lines above merely record where. Last line first, then the line number — '
            + 'that order is the whole discipline.',
        },
        {
          q: 'Running `print(candel)` when only `candle` was ever bound raises which mark?',
          options: [
            'SyntaxError',
            'TypeError',
            'NameError — Python has no binding called candel',
            'IndexError',
          ],
          answer: 2,
          explain: 'The grammar is sound and the types are fine — the failure is purely '
            + 'that the name candel was never bound to anything. Misspellings are the '
            + 'NameError’s favourite food.',
        },
        {
          q: '`"souls: " + 3` raises which mark, and why?',
          options: [
            'TypeError — a string and an integer refuse to join; convert with str(3) first',
            'SyntaxError — the line is ungrammatical',
            'NameError — souls was never defined',
            'No error — it prints souls: 3',
          ],
          answer: 0,
          explain: 'The grammar parses and every name resolves — the wound is in the '
            + '*kinds*. Text and number will not join until you convert one: '
            + '"souls: " + str(3), or an f-string that does it for you.',
        },
        {
          q: 'What makes `SyntaxError` different from the other marks?',
          options: [
            'It is the only error that can be safely ignored',
            'It only occurs inside if statements',
            'It appears after the program finishes',
            'It is caught before the program runs — Python refuses to start until the grammar is mended',
          ],
          answer: 3,
          explain: 'Syntax is checked before execution begins, so a SyntaxError means not '
            + 'even line one has run. The other marks strike mid-flight, with every line '
            + 'above the wound already executed.',
        },
      ],
    },
  ],

  // ------------------------------------------------------------
  // Boss — The Dementor's Gate
  // ------------------------------------------------------------
  boss: {
    id: 'act1-boss',
    title: 'The Dementor’s Gate',
    narrative: 'At the far end of the Restricted Section stands a gate that was never '
      + 'built — it *accreted*, the way ice accretes, out of every reader who failed '
      + 'here. The thing that keeps it does not want your blood; blood is cheap in a '
      + 'library. It wants your certainty: every rule this act taught you, held steady '
      + 'while the cold pulls at your reasons. Six questions in the dark, then one final '
      + 'working of code. Answer as though your warmest memory depended on it. This '
      + 'close to the gate, it does.',
    defeatText: 'The cold closes over your certainty, and the gate forgets you were ever there — study, return, and make it remember.',
    victoryText: 'The gate grinds open onto a darkness that smells of the next act — the fundamentals are yours now, and nothing at this depth can drink them back out of you.',
    xp: 250,
    flawlessBonus: 50,
    gauntlet: [
      {
        q: 'After `relic = "goblet"` and then `relic = 7`, what does `type(relic)` report?',
        options: [
          "<class 'str'> — the first binding is permanent",
          "<class 'int'> — the name was rebound; the newest value decides",
          'Both types at once',
          'An error — a name cannot change its type',
        ],
        answer: 1,
        explain: 'Assignment replaces: the vessel answers with whatever it was given '
          + 'most recently, and the type travels with the value. Dynamic typing makes '
          + 'the rebinding legal — and makes remembering it your burden.',
      },
      {
        q: 'What does `"horcrux"[1:4]` evaluate to?',
        options: [
          'hor — the first three letters',
          'orcr — positions 1 through 4 inclusive',
          'orc — positions 1, 2 and 3; the stop is excluded',
          'An IndexError',
        ],
        answer: 2,
        explain: 'Slices include the start and exclude the stop: positions 1, 2, 3 of '
          + 'horcrux are o, r, c. Reading the stop as included is the trap — Python '
          + 'never includes it.',
      },
      {
        q: 'What does `10 // 3` evaluate to?',
        options: [
          '3.3333…',
          '1 — the remainder',
          '30',
          '3 — floor division keeps the whole times and discards the rest',
        ],
        answer: 3,
        explain: 'Floor division answers how many whole times the divisor fits. The '
          + 'decimal answer belongs to /, and the remainder of 1 belongs to % — three '
          + 'runes, three different truths about the same division.',
      },
      {
        q: 'What does `bool("")` evaluate to — and then `bool("0")`?',
        options: [
          'False, then True — empty text is falsy, but any non-empty text (even "0") is truthy',
          'False, then False',
          'True, then True',
          'True, then False',
        ],
        answer: 0,
        explain: 'Truthiness weighs emptiness, not meaning: "" holds nothing and counts '
          + 'as False, while "0" holds a character and counts as True. Only the *number* '
          + '0 is falsy — the text "0" is an occupied vessel.',
      },
      {
        q: 'With `depth = 9`: `if depth > 20:` print A — `elif depth > 5:` print B — `elif depth > 8:` print C — `else:` print D. What prints?',
        options: [
          'B and C — both of their conditions are True',
          'B only — the first True condition wins; later True ones are never examined',
          'C only',
          'D',
        ],
        answer: 1,
        explain: 'depth > 20 fails, depth > 5 succeeds — and the chain ends there. That '
          + 'depth > 8 was also True changes nothing: once a door opens, the corridor '
          + 'below it goes dark.',
      },
      {
        q: 'A mark ends with `IndexError: string index out of range`. What happened?',
        options: [
          'A variable name was misspelled',
          'A string was added to a number',
          'The code asked for a position past the end of a string',
          'A parenthesis was never closed',
        ],
        answer: 2,
        explain: 'The last line names the wound exactly: an index beyond the sequence’s '
          + 'end. A misspelling would be a NameError, the failed joining a TypeError, and '
          + 'the unclosed parenthesis a SyntaxError before anything ran at all.',
      },
    ],
    finalChallenge: {
      title: 'The Toll of the Gate',
      prompt: 'The gate speaks your particulars back at you in its own dead voice, and it '
        + 'takes its toll in memories. Yours are counted. Complete the toll — every rune '
        + 'of this act, in one working.\n\n'
        + 'The starter provides `visitor` and `happy_memories`. Write a program that:\n\n'
        + '- Binds `announced` to `visitor` in ALL capitals (use `.upper()`).\n'
        + '- Prints, via an f-string around `announced`, exactly: `WHO GOES: BEARER OF THE MARK`\n'
        + '- Prints, via an f-string around `happy_memories`, exactly: `Memories offered: 0`\n'
        + '- Then a fork on `happy_memories`: if it is greater than 0, print '
        + '`The dementors pause, tasting light.` — otherwise print `Nothing warm remains. Pass.`\n\n'
        + 'With the starter’s values, exactly three lines must appear, and the fork must '
        + 'choose the cold branch.',
      starter: py`# The gate reads what you carry:
visitor = "bearer of the mark"
happy_memories = 0

# 1) announced = visitor in ALL CAPITALS
# 2) print, via f-string:  WHO GOES: BEARER OF THE MARK
# 3) print, via f-string:  Memories offered: 0
# 4) fork on happy_memories:
#      more than 0 -> "The dementors pause, tasting light."
#      otherwise   -> "Nothing warm remains. Pass."
`,
      solution: py`visitor = "bearer of the mark"
happy_memories = 0
announced = visitor.upper()
print(f"WHO GOES: {announced}")
print(f"Memories offered: {happy_memories}")
if happy_memories > 0:
    print("The dementors pause, tasting light.")
else:
    print("Nothing warm remains. Pass.")`,
      validation: py`assert "announced" in dir(), "The gate finds no vessel named announced. Bind it to visitor.upper()."
assert announced == "BEARER OF THE MARK", "announced must be visitor in ALL capitals - use .upper()."
assert "WHO GOES: BEARER OF THE MARK" in _stdout, "The challenge was never shouted. Print exactly: WHO GOES: BEARER OF THE MARK - via an f-string around announced."
assert "Memories offered: 0" in _stdout, "The toll was never counted aloud. Print exactly: Memories offered: 0 - via an f-string around happy_memories."
assert "Nothing warm remains. Pass." in _stdout, "With zero memories the gate must conclude: Nothing warm remains. Pass."
assert "The dementors pause, tasting light." not in _stdout, "The pause line spoke although happy_memories is 0 - your fork is not weighing the count."`,
      xp: 0,
    },
  },

  // ------------------------------------------------------------
  // Codex — the act's vocabulary
  // ------------------------------------------------------------
  codex: [
    { term: 'print()', def: 'The built-in function that writes a value to the screen, ending the line when it finishes.' },
    { term: 'comment', def: 'Anything after a `#` on a line — notes for human readers that Python skips entirely.' },
    { term: 'string', def: 'Text held in quotes; a sequence of characters the machine carries without interpreting.' },
    { term: 'variable', def: 'A name bound to a value with `=`, so the value can be summoned again by name.' },
    { term: 'dynamic typing', def: 'Python’s rule that the type lives in the value, not the name — a name may be rebound to a value of any type.' },
    { term: 'type()', def: 'A built-in that reveals what kind of value you hand it, such as `str`, `int` or `bool`.' },
    { term: 'f-string', def: 'A string prefixed with `f` in which anything wrapped in braces is replaced by its value, as in `f"{name} waits"`.' },
    { term: 'index', def: 'A position inside a sequence, counted from 0; negative indices count backwards from the end.' },
    { term: 'slice', def: 'A run of items taken with `[start:stop]` — the start is included, the stop is not.' },
    { term: 'len()', def: 'A built-in that reports how many items a sequence holds — for a string, its character count, spaces included.' },
    { term: 'floor division //', def: 'Division that keeps only the whole number of times the divisor fits, discarding the remainder.' },
    { term: 'modulo %', def: 'The remainder that floor division discards — `17 % 5` is `2`.' },
    { term: 'boolean', def: 'One of the two verdict values, `True` or `False`, produced by comparisons and combined with `and`, `or` and `not`.' },
    { term: 'truthiness', def: 'The rule that any value can stand as a verdict: empty things like `""` and `0` count as False, occupied things as True.' },
    { term: 'indentation', def: 'The spaces at the start of a line, which in Python define which block the line belongs to — structure, not decoration.' },
    { term: 'traceback', def: 'The report Python leaves when code dies; read its last line first — it names the error and its cause.' },
  ],
};
