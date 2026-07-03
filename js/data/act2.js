// ============================================================
// act2.js — Act II: The Mines of Moria
// Control Flow & Collections — the two great loops and the four
// vessels (lists, tuples, dicts, sets), taught in the long dark.
// ============================================================

const py = String.raw;

export default {
  id: 'act2',
  numeral: 'II',
  arc: 'Control Flow & Collections',
  title: 'The Mines of Moria',
  tagline: 'Far beneath the world, the dark keeps a tally of its own.',
  sigil: '⛏️',
  epigraph: {
    text: 'The drums do not hurry, and they do not rest. Learn their patience, or be gathered into it.',
    source: 'runes cut above the stair of the second deep',
  },
  intro: 'The door closes behind you, and the arithmetic of survival changes. Act I '
    + 'taught you to speak to the machine — single words, single choices. The mines do '
    + 'not deal in singles. Down here the work is **repetition**: a thousand stairs, a '
    + 'thousand names on a roll, the same question asked of the dark until the dark answers.\n\n'
    + 'In this act you will bind the two great loops — `while`, which repeats until a '
    + 'condition releases it, and `for`, which walks a known procession — and master the '
    + 'four vessels that hold what the deep gives back: **lists** that keep order, '
    + '**tuples** that keep faith, **dictionaries** that keep records, and **sets** that '
    + 'keep nothing twice. Last, you will learn to fold a whole loop into a single line, '
    + 'and what such folding costs. At the bottom of it all, something older than the '
    + 'mines is waiting to grade your work.',

  lessons: [

    // ----------------------------------------------------------
    // a2l1 — while loops
    // ----------------------------------------------------------
    {
      id: 'a2l1',
      title: 'The Endless Stair',
      concept: 'while loops, loop counters, break and continue',
      xp: 30,
      narrative: 'The West-gate seals behind you with a sound like a tomb accepting its '
        + 'dead. Ahead, the Endless Stair spirals down into a dark that has not tasted '
        + 'torchlight in an age. The dwarves who cut these steps numbered every one of '
        + 'them; those who stopped counting are still down there, walking. The Codex is '
        + 'blunt on this point: repetition without an ending condition is not '
        + 'persistence — it is damnation. Learn to command the loop, or the loop will '
        + 'command you.',
      sections: [
        {
          heading: 'The loop that walks until told otherwise',
          body: 'A **while loop** repeats a block of code for as long as a condition '
            + 'stays `True`. Think of a sentinel posted at each landing who asks one '
            + 'question before letting you take another flight — that question is the '
            + '**condition**, and it is tested *before every pass*, never after.\n\n'
            + '- The line starts with `while`, then the condition, then a colon.\n'
            + '- The indented lines beneath it are the **body** — the work repeated on each pass.\n'
            + '- When the condition is finally `False`, Python skips past the loop and carries on.',
          code: py`torches = 3
while torches > 0:
    print("A torch still burns. Descend.")
    torches = torches - 1
print("The last torch is out.")`,
          note: 'Read the example aloud as Python does: *is torches greater than zero?* '
            + 'Yes — burn one, descend, ask again. The moment the answer is no, the '
            + 'sentinel steps aside and the line after the loop runs exactly once.',
        },
        {
          heading: 'The counter, and the two ways to feed it',
          body: 'Most while loops walk on a **counter** — a variable that tracks how far '
            + 'you have come. The pattern has three parts, and all three are load-bearing:\n\n'
            + '- **Create** the counter before the loop: `step = 1`.\n'
            + '- **Test** it in the condition: `while step <= 5:`.\n'
            + '- **Change** it inside the body: `step = step + 1`, or the shorthand `step += 1`.\n\n'
            + 'The shorthand `+=` means *add to what is already there*. And recall the '
            + 'f-string from Act I: `f"Step {step}"` builds text with the counter’s '
            + 'current value folded in.',
          code: py`step = 1
while step <= 5:
    print(f"Step {step} of the stair")
    step += 1`,
          note: 'Omit the third part — the change — and you have written an **infinite '
            + 'loop**: the condition stays `True` forever, and the program never ends. '
            + 'Python raises no error for this; it simply obeys, endlessly. The Forge '
            + 'cuts such spells down after thirty seconds. The mines are not so merciful.',
        },
        {
          heading: 'Two words of power: break and continue',
          body: 'Two statements bend a loop mid-stride:\n\n'
            + '- `break` ends the loop **immediately**. Python abandons the body and '
            + 'jumps to the first line after the loop, no matter what the condition says.\n'
            + '- `continue` abandons only the **current pass** and returns straight to '
            + 'the condition for the next one.\n\n'
            + 'One warning, written in older blood than yours: when you use `continue` '
            + 'inside a while loop, update your counter *first*. Skip that, and the loop '
            + 'returns to test the same value it just fled from — forever.',
          code: py`step = 1
while step <= 6:
    if step == 3:
        step += 1
        continue          # the third step is missing; say nothing of it
    if step == 5:
        print("Something moves below. Stop.")
        break
    print(f"Step {step}")
    step += 1`,
        },
      ],
      challenge: {
        title: 'Count the Descent',
        prompt: 'The stair must be counted aloud, or it rearranges itself behind you. '
          + 'But the fourth step was shattered in some old ruin — name it and it names '
          + 'you back — and at the eighth, the drums answer.\n\n'
          + 'Write a program that:\n\n'
          + '- Creates a variable `step` set to `1`.\n'
          + '- Runs a `while` loop while `step` is less than or equal to `10`.\n'
          + '- Inside, if `step` equals `8`: prints exactly `The drums begin.` and ends the loop with `break`.\n'
          + '- Otherwise, if `step` equals `4`: adds 1 to `step` and skips the rest of the pass with `continue` — the shattered step is passed in silence.\n'
          + '- Otherwise: prints `Step ` followed by the number (`Step 1`, `Step 2`, and so on) and adds 1 to `step`.\n\n'
          + 'The expected output is exactly seven lines: `Step 1`, `Step 2`, `Step 3`, '
          + '`Step 5`, `Step 6`, `Step 7`, and finally `The drums begin.`',
        starter: py`# The stair must be counted aloud, or it shifts behind you.
step = 1

# TODO: while step is 10 or less:
#   if step == 8 -> print "The drums begin." then break
#   if step == 4 -> add 1 to step, then continue (name nothing)
#   otherwise    -> print f"Step {step}" then add 1 to step
`,
        solution: py`step = 1
while step <= 10:
    if step == 8:
        print("The drums begin.")
        break
    if step == 4:
        step += 1
        continue
    print(f"Step {step}")
    step += 1`,
        hints: [
          'Three things every counted while loop needs: a counter created before the loop, a condition that tests it, and a line inside that changes it. The starter gives you the first.',
          'Order the checks inside the loop: first `if step == 8:` (print, then `break`), then `if step == 4:` (`step += 1`, then `continue`). Only when neither fires do you print `f"Step {step}"` and increment.',
          'The skeleton is: `while step <= 10:` — inside it, the step-8 check prints and breaks; the step-4 check increments and continues; the final two lines print the step and increment. Mind the indentation: all of it lives inside the loop.',
        ],
        validation: py`lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert len(lines) == 7, f"The dark counted {len(lines)} spoken lines, not 7. Check the silent skip at step 4 and the break at step 8."
assert lines[0] == "Step 1", "The count must begin with the line: Step 1"
assert "Step 4" not in _stdout, "You named the shattered fourth step. It must be skipped with continue -- print nothing for it."
assert lines[3] == "Step 5", "After the silent fourth step, the next spoken line must be: Step 5"
assert "Step 8" not in _stdout and "Step 9" not in _stdout and "Step 10" not in _stdout, "The count went past the drums. break must end the loop at step 8, before any later step is spoken."
assert lines[-1] == "The drums begin.", "The final line must be exactly: The drums begin."
assert step == 8, "When the loop breaks, step should still be 8 -- break fires before the counter moves again."`,
        successText: 'Seven lines spoken, and the stair holds. Far below, something has begun to keep your count for you.',
        xp: 60,
      },
      quiz: [
        {
          q: 'When does a `while` loop check its condition?',
          options: [
            'After the loop has finished',
            'Only when `break` is used',
            'Before every pass through its body',
            'Once, when Python first reaches the loop',
          ],
          answer: 2,
          explain: 'The condition is tested before each pass: if it is True the body runs '
            + 'and Python returns to test again. The check-once idea describes `if`, not `while`.',
        },
        {
          q: 'A loop starts with `n = 0` and runs `while n < 3:`, printing `n` and then adding 1 on each pass. What is printed?',
          options: [
            '0, 1, 2',
            '1, 2, 3',
            '0, 1, 2, 3',
            'Nothing — the condition is never true',
          ],
          answer: 0,
          explain: 'n is printed before it grows: 0, then 1, then 2. When n reaches 3 the '
            + 'condition `n < 3` turns False, so 3 itself is never printed.',
        },
        {
          q: 'What is the difference between `break` and `continue`?',
          options: [
            '`break` pauses the loop; `continue` resumes it',
            '`break` ends the loop entirely; `continue` skips to the next pass',
            '`continue` ends the loop; `break` skips one pass',
            'They are interchangeable',
          ],
          answer: 1,
          explain: '`break` abandons the loop and jumps past it for good. `continue` abandons '
            + 'only the current pass and returns to the condition. Nothing pauses a loop.',
        },
        {
          q: 'A `while` loop’s counter is never updated inside the body. What happens?',
          options: [
            'Python raises a LoopError',
            'The loop runs exactly once',
            'Python updates the counter automatically',
            'The loop runs forever — an infinite loop',
          ],
          answer: 3,
          explain: 'If nothing in the body moves the condition toward False, it stays True '
            + 'forever. Python raises no error — it obeys, endlessly — which is exactly why '
            + 'the counter pattern has three parts: create, test, change.',
        },
      ],
    },

    // ----------------------------------------------------------
    // a2l2 — for loops and range()
    // ----------------------------------------------------------
    {
      id: 'a2l2',
      title: 'Marching in Ranks',
      concept: 'for loops, range() with start, stop, and step, and looping over strings',
      xp: 30,
      narrative: 'You press yourself into a broken doorway as they pass: rank upon rank '
        + 'of goblins, moving to a drum you feel in your teeth. They do not decide to '
        + 'march. The drum decides, and their feet obey — first rank, second rank, '
        + 'third, each taking its number in turn until the column is spent. The Codex '
        + 'names this the second great repetition: not a loop that waits upon a '
        + 'condition, but one that walks a known procession from first to last and '
        + 'stops of its own accord.',
      sections: [
        {
          heading: 'A procession with a known end',
          body: 'A **for loop** visits each item of a sequence, one at a time, and stops '
            + 'when the sequence is spent. Where `while` waits on a condition, `for` '
            + 'walks a procession whose length is already known.\n\n'
            + 'The commonest procession is made by `range()`. Writing `for n in range(5):` '
            + 'gives the **loop variable** `n` each value in turn: `0, 1, 2, 3, 4`. Two '
            + 'laws govern it: counting starts at **0** unless you say otherwise, and the '
            + 'stop value is **never included**. No counter to create, feed, or forget — '
            + 'the for loop manages its own.',
          code: py`for n in range(5):
    print(f"Rank {n} passes.")
print("The column has gone by.")`,
          note: 'Choose your loop by what you know. Know *how many times*? Use `for` with '
            + '`range`. Know only *the condition that ends it*? Use `while`. The drum '
            + 'knows its count; the sentinel knows only its question.',
        },
        {
          heading: 'Start, stop, step',
          body: '`range()` takes up to three numbers, and each form has its use:\n\n'
            + '- `range(stop)` — from 0 up to (not including) `stop`.\n'
            + '- `range(start, stop)` — begin somewhere other than 0.\n'
            + '- `range(start, stop, step)` — move by `step` each time. A **negative** step counts *down*.\n\n'
            + 'In every form the stop value is the wall you never touch: `range(1, 6)` '
            + 'ends at 5, and `range(10, 0, -2)` ends at 2.',
          code: py`for n in range(1, 6):
    print(f"Level {n} below the gate")

for n in range(10, 0, -2):
    print(f"{n} heartbeats until the drums")`,
        },
        {
          heading: 'Every letter a footfall',
          body: 'A string is a sequence too — of characters — and a for loop will walk it '
            + 'exactly as it walks a range. Each pass hands the loop variable one '
            + 'character, in order, spaces and all.',
          code: py`word = "doom"
for letter in word:
    print(letter)`,
          note: 'The graffito scratched into the eastern arch is a single word. The '
            + 'machine reads it the way you did when your torch found it: one letter at '
            + 'a time, each worse than the last.',
        },
      ],
      challenge: {
        title: 'The Muster of the Deep',
        prompt: 'From your hiding place you transcribe the whole muster: the ranks as '
          + 'they pass, the failing heartbeats of the guard who counted them, and the '
          + 'word the last one scratched into the wall.\n\n'
          + 'Write a program with three movements, in this order:\n\n'
          + '- Using a `for` loop and `range(1, 6)`, print `Rank 1 marches.` through `Rank 5 marches.` — five lines.\n'
          + '- Using a `for` loop and a `range` that counts *down by twos*, print the odd numbers from `9` to `1` (9, 7, 5, 3, 1), each on its own line.\n'
          + '- Using a `for` loop over the string `"doom"`, print each of its four letters on its own line.\n\n'
          + 'Fourteen lines in all. The ward below counts every one.',
        starter: py`# Three movements: the muster, the countdown, the word on the wall.

# TODO 1: for n in range(1, 6) -> print f"Rank {n} marches."

# TODO 2: a range that walks 9, 7, 5, 3, 1 -> print each number

# TODO 3: loop over the string "doom" -> print each letter
`,
        solution: py`for n in range(1, 6):
    print(f"Rank {n} marches.")

for n in range(9, 0, -2):
    print(n)

for letter in "doom":
    print(letter)`,
        hints: [
          '`range(1, 6)` yields 1, 2, 3, 4, 5 — the stop value is never included. That is the whole first movement: one loop, one print.',
          'To walk downward, give range all three numbers: start at 9, stop past the end of the count (0 serves), and step by -2. Print the loop variable itself.',
          'The third movement needs no range at all: `for letter in "doom":` hands you each character in turn — print the loop variable inside the loop.',
        ],
        validation: py`lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert len(lines) == 14, f"The muster heard {len(lines)} lines, not 14 (5 ranks + 5 numbers + 4 letters)."
assert lines[0] == "Rank 1 marches." and lines[4] == "Rank 5 marches.", "Ranks 1 through 5 must march first, each announcing: Rank N marches."
assert "Rank 0" not in _stdout and "Rank 6" not in _stdout, "Only ranks 1 through 5 march. Check the start and stop of your first range."
assert lines[5:10] == ["9", "7", "5", "3", "1"], "The countdown must be exactly 9, 7, 5, 3, 1 -- a range starting at 9 with a step of -2."
assert lines[10:14] == ["d", "o", "o", "m"], "The word on the wall must be spelled out d, o, o, m -- loop over the string and print each letter."`,
        successText: 'The column passes and does not see you. You have learned to count as the drum counts.',
        xp: 60,
      },
      quiz: [
        {
          q: 'What values does `range(4)` produce?',
          options: [
            '1, 2, 3, 4',
            '0, 1, 2, 3',
            '0, 1, 2, 3, 4',
            'Four values chosen at random',
          ],
          answer: 1,
          explain: 'range starts at 0 by default and always stops before its stop value: '
            + '0, 1, 2, 3. Nothing about range is random — it is a fixed procession.',
        },
        {
          q: 'What does `range(2, 11, 3)` produce?',
          options: [
            '2, 5, 8, 11',
            '3, 6, 9',
            '2, 3, 4, 5, 6, 7, 8, 9, 10',
            '2, 5, 8',
          ],
          answer: 3,
          explain: 'Start at 2 and step by 3: 2, 5, 8. The next stride lands on 11 — the '
            + 'stop value, which is never included — so the march halts at 8.',
        },
        {
          q: 'What does `for ch in "orc":` loop over?',
          options: [
            'Each character: "o", then "r", then "c"',
            'Each word in the string',
            'The numbers 0, 1, 2',
            'Nothing — strings cannot be looped',
          ],
          answer: 0,
          explain: 'A string is a sequence of characters, and a for loop visits them one '
            + 'at a time. If you wanted the numbers 0, 1, 2 you would loop over '
            + 'range(len("orc")) instead.',
        },
        {
          q: 'You must repeat an action exactly 12 times. Which loop states that intent most directly?',
          options: [
            '`for n in range(1, 12):`',
            'A `while` loop with a hand-fed counter',
            '`for n in range(12):`',
            'A `while` loop that breaks on the twelfth pass',
          ],
          answer: 2,
          explain: '`range(12)` runs the body exactly 12 times with no counter to '
            + 'mismanage. Beware the tempting `range(1, 12)` — the stop is excluded, so '
            + 'it runs only 11. A while loop works, but you must feed and test it yourself.',
        },
      ],
    },

    // ----------------------------------------------------------
    // a2l3 — lists
    // ----------------------------------------------------------
    {
      id: 'a2l3',
      title: 'The Company Assembled',
      concept: 'lists — creating, indexing, slicing, and mutating them',
      xp: 35,
      narrative: 'Nine set out from the gate. You know this because the Codex keeps a '
        + 'roll of them, scratched in a margin that smells of iron: a single ordered '
        + 'line of names, first to last. Order is not decoration down here — it is who '
        + 'walks point, who guards the rear, who stands nearest the dark when it comes. '
        + 'And the roll *changes*. Names are added at torch-lit councils and struck out '
        + 'in tunnels no torch survives. A record that gains and loses its members '
        + 'needs a vessel built for change. Python calls it a list.',
      sections: [
        {
          heading: 'One vessel, many names',
          body: 'A **list** holds many values in a single variable, in a fixed order. '
            + 'You build one with square brackets, the values separated by commas. A '
            + 'list may hold strings, numbers, booleans — anything — and `len()` tells '
            + 'you how many it currently holds.',
          code: py`company = ["Gandalf", "Aragorn", "Legolas", "Gimli", "Frodo"]
print(len(company))
print(company)`,
        },
        {
          heading: 'Summon by number',
          body: 'Each position in a list has an **index** — its number in the line, '
            + 'counted from **0**, not 1. `company[0]` is the first name, `company[1]` '
            + 'the second. Negative indexes count backward from the end: `-1` is the '
            + 'last, `-2` the one before it.\n\n'
            + 'Ask past the end — `company[9]` on a five-name roll — and Python raises '
            + 'an `IndexError`. And to ask whether a value is present at all, use `in`, '
            + 'which answers `True` or `False`.',
          code: py`company = ["Gandalf", "Aragorn", "Legolas", "Gimli", "Frodo"]
print(company[0])           # Gandalf -- the first, at index 0
print(company[2])           # Legolas
print(company[-1])          # Frodo -- negative indexes count from the end
print("Gimli" in company)   # True`,
        },
        {
          heading: 'Cut a portion',
          body: 'A **slice** copies a stretch of the list: `company[start:stop]` takes '
            + 'everything from index `start` up to — never including — index `stop`. '
            + 'The same exclusion law as `range`, and it is no coincidence.\n\n'
            + '- Omit the start — `company[:3]` — and the slice begins at the front.\n'
            + '- Omit the stop — `company[2:]` — and it runs to the end.\n'
            + '- The original list is untouched; a slice is a copy.',
          code: py`company = ["Gandalf", "Aragorn", "Legolas", "Gimli", "Frodo"]
vanguard = company[0:2]
print(vanguard)          # ['Gandalf', 'Aragorn']
print(company[2:])       # ['Legolas', 'Gimli', 'Frodo']
print(company[:3])       # ['Gandalf', 'Aragorn', 'Legolas']`,
        },
        {
          heading: 'The roll changes',
          body: 'Lists are **mutable** — they change in place, and every hand that holds '
            + 'the list sees the change. Four operations keep the roll:\n\n'
            + '- `.append(x)` adds `x` at the end.\n'
            + '- `.insert(i, x)` pushes `x` in at index `i`; everything after shifts down.\n'
            + '- `.remove(x)` strikes the first entry *equal to* `x`.\n'
            + '- `.pop(i)` removes the entry at index `i` **and hands it back** to you. With no index, it takes the last.',
          code: py`company = ["Aragorn", "Legolas"]
company.append("Gimli")          # add to the end
company.insert(0, "Gandalf")     # push in at index 0
company.remove("Legolas")        # strike the first matching name
fallen = company.pop(0)          # remove index 0 AND catch what it returns
print(company)                   # ['Aragorn', 'Gimli']
print(fallen)                    # Gandalf`,
          note: '`.remove` wants a **value**; `.pop` wants an **index**. Confuse the two '
            + 'and the wrong name is struck from the roll — an error the mines rarely '
            + 'let you amend.',
        },
      ],
      challenge: {
        title: 'Keeping the Roll',
        prompt: 'The roll must be kept even as the mines unmake it. Perform the rites '
          + 'in order, exactly as the ledger demands.\n\n'
          + 'Write a program that:\n\n'
          + '- Creates a list named `company` containing exactly these five names, in this order: `"Gandalf"`, `"Aragorn"`, `"Boromir"`, `"Legolas"`, `"Gimli"`.\n'
          + '- A halfling is sworn in at the rear: appends `"Frodo"`.\n'
          + '- Another shadows the wizard, second in line: inserts `"Sam"` at index `1`.\n'
          + '- The horn-bearer takes another road: removes `"Boromir"` by value.\n'
          + '- At the bridge, the front of the line is taken: pops index `0` and stores the returned name in a variable named `lost`.\n'
          + '- Prints `lost`, then prints how many names remain using `len()`, then prints the last name on the roll using a negative index.\n\n'
          + 'Three printed lines: the name taken, the count remaining, the rearguard.',
        starter: py`# The roll of the company. Keep it true; the mines will test it.

# TODO 1: company = the five names, in order
# TODO 2: append "Frodo"
# TODO 3: insert "Sam" at index 1
# TODO 4: remove "Boromir"
# TODO 5: lost = the name popped from index 0
# TODO 6: print lost, then len(company), then the last name via a negative index
`,
        solution: py`company = ["Gandalf", "Aragorn", "Boromir", "Legolas", "Gimli"]
company.append("Frodo")
company.insert(1, "Sam")
company.remove("Boromir")
lost = company.pop(0)
print(lost)
print(len(company))
print(company[-1])`,
        hints: [
          'Build the list first: square brackets, five quoted names separated by commas. Every later rite operates on that one list, in the order given.',
          '`.append("Frodo")` adds at the end; `.insert(1, "Sam")` pushes in at index 1; `.remove("Boromir")` strikes a value; `.pop(0)` removes index 0 and hands the name back — catch it: `lost = company.pop(0)`.',
          'The last three lines are exactly: `print(lost)`, then `print(len(company))`, then `print(company[-1])`.',
        ],
        validation: py`assert isinstance(company, list), "The roll must be a list named company -- square brackets, five names to start."
assert company == ["Sam", "Aragorn", "Legolas", "Gimli", "Frodo"], f"The roll reads {company} -- expected ['Sam', 'Aragorn', 'Legolas', 'Gimli', 'Frodo']. Re-walk the rites in order: build, append, insert at 1, remove, pop index 0."
assert lost == "Gandalf", "The bridge took the FRONT of the line: pop index 0 and keep what it returns in a variable named lost."
lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert "Gandalf" in lines, "Print the name held in lost -- the ledger must record who was taken."
assert "5" in lines, "Print how many names remain, using len(company). It should be 5."
assert lines[-1] == "Frodo", "The last printed line must be the rearguard: Frodo, fetched with company[-1]."`,
        successText: 'Five names remain, and the ledger knows exactly whom the dark has taken. Keep writing.',
        xp: 65,
      },
      quiz: [
        {
          q: 'In the list `ranks = ["Balin", "Oin", "Ori"]`, what is `ranks[0]`?',
          options: [
            '"Balin"',
            '"Oin"',
            '0',
            'An IndexError',
          ],
          answer: 0,
          explain: 'Indexes are counted from 0, so ranks[0] is the first name, "Balin". '
            + 'The second name, "Oin", lives at ranks[1].',
        },
        {
          q: 'What does `ranks[-1]` give you?',
          options: [
            'The list reversed',
            'An IndexError — indexes cannot be negative',
            'The last item',
            'The first item',
          ],
          answer: 2,
          explain: 'Negative indexes count backward from the end: -1 is the last item, '
            + '-2 the one before it. Python permits them precisely so you need not know '
            + 'the list’s length first.',
        },
        {
          q: 'With `ranks = ["a", "b", "c", "d"]`, what is `ranks[1:3]`?',
          options: [
            '["b", "c", "d"]',
            '["b", "c"]',
            '["a", "b", "c"]',
            '["c", "d"]',
          ],
          answer: 1,
          explain: 'A slice runs from the start index up to but never including the stop: '
            + 'indexes 1 and 2, giving ["b", "c"]. The stop index is a wall, not a member.',
        },
        {
          q: 'What is the difference between `.remove("Ori")` and `.pop(2)`?',
          options: [
            '`.remove` returns the item; `.pop` does not',
            '`.pop` strikes a matching value; `.remove` works by index',
            'There is no difference',
            '`.remove` strikes the first matching value; `.pop` removes at an index and returns the item',
          ],
          answer: 3,
          explain: '.remove searches for the first equal value and deletes it, returning '
            + 'nothing. .pop takes an index, deletes what lives there, and hands it back '
            + 'to you — which is why you can catch it in a variable.',
        },
      ],
    },

    // ----------------------------------------------------------
    // a2l4 — tuples
    // ----------------------------------------------------------
    {
      id: 'a2l4',
      title: 'Unbreakable Oaths',
      concept: 'tuples — immutable sequences, packing, unpacking, and swapping',
      xp: 35,
      narrative: 'In the Chamber of Records you find a slab of black stone, and on it '
        + 'an inscription cut so deep the chisel must have gone to the wrist: a name, '
        + 'a title, a year. You understand at once that this is not a ledger. Ledgers '
        + 'are kept by the living and revised by the dying. This was made once, to be '
        + 'true forever. Python keeps such records too — sequences that cannot be '
        + 'appended to, struck from, or amended. It calls them tuples, and their '
        + 'permanence is not a limitation. It is the point.',
      sections: [
        {
          heading: 'Carved, not written',
          body: 'A **tuple** is a sequence like a list, but **immutable** — once made, '
            + 'it cannot be changed. You write one with parentheses instead of square '
            + 'brackets. Reading works exactly as with lists: indexing, `len()`, `in`, '
            + 'looping. Changing does not: no `.append`, no `.remove`, and assigning to '
            + 'an index raises a `TypeError`.\n\n'
            + 'One trap for the unwary: a tuple of a single value **needs a trailing '
            + 'comma**. `("Durin")` is just a string in parentheses; `("Durin",)` is a tuple.',
          code: py`tomb = ("Balin", "Lord of Moria", 2994)
print(tomb[0])        # Balin -- read it like any sequence
print(len(tomb))      # 3

# tomb[0] = "Frar"    # TypeError: the stone does not bend
lone = ("Durin",)     # one value still needs its comma
print(type(lone))`,
        },
        {
          heading: 'Packing and unpacking',
          body: 'Write values separated by commas and Python **packs** them into a tuple '
            + '— the parentheses are often optional; the commas do the work. The '
            + 'reverse is **unpacking**: put the same number of variable names on the '
            + 'left, and each receives one part, in order.\n\n'
            + 'The counts must match. Unpack a three-part tuple into two names and '
            + 'Python raises a `ValueError` — the stone gives all of itself or nothing.',
          code: py`record = "Balin", "son of Fundin"     # packing -- the commas do the work
name, lineage = record                # unpacking -- counts must match
print(name)
print(lineage)`,
        },
        {
          heading: 'The swap without a third hand',
          body: 'To exchange two variables, apprentices use a third as a holding cell. '
            + 'Tuple packing makes the third hand unnecessary: `a, b = b, a`.\n\n'
            + 'It works because Python builds the right-hand side *first* — packing the '
            + 'old values into a tuple — and only then unpacks it into the left. '
            + 'Nothing is overwritten before it has been read.',
          code: py`first_watch = "Oin"
second_watch = "Ori"
first_watch, second_watch = second_watch, first_watch
print(first_watch)     # Ori
print(second_watch)    # Oin`,
        },
        {
          heading: 'When to carve instead of write',
          body: 'Choose the vessel by the nature of the record:\n\n'
            + '- A **tuple** for records fixed at the moment of making — a name and a year, a pair of coordinates, a date. Its shape *is* its meaning.\n'
            + '- A **list** for anything that grows, shrinks, or is amended — rosters, queues, logs.\n'
            + '- A tuple also *declares intent*: whoever reads your code knows this record was never meant to change — and Python will enforce the oath on your behalf.',
          note: 'Immutability is a defense, not a decoration. What cannot be changed '
            + 'cannot be corrupted by a careless hand three hundred lines away — or by '
            + 'yours, at the end of a long watch.',
        },
      ],
      challenge: {
        title: 'The Tomb-Script',
        prompt: 'A tomb must be cut for the Lord of Moria, and tomb-script tolerates no '
          + 'revision. Cut once, read forever.\n\n'
          + 'Write a program that:\n\n'
          + '- Creates a tuple named `tomb` holding exactly these three values, in order: `"Balin"`, `"Lord of Moria"`, `2994`.\n'
          + '- Unpacks `tomb` into three variables named `name`, `title`, and `year`, in a single line.\n'
          + '- Prints one line combining the first two, exactly: `Balin, Lord of Moria` (an f-string serves well).\n'
          + '- Prints a second line, exactly: `Fell in the year 2994` — built from the `year` variable, not retyped.\n'
          + '- The two door-wards below stand at the wrong doors. Swaps `first_watch` and `second_watch` in ONE line, using tuple packing — no third variable.\n'
          + '- Prints `first_watch`, then `second_watch`, each on its own line.',
        starter: py`# The stone is cut once. Measure twice.
first_watch = "Oin"
second_watch = "Ori"

# TODO 1: tomb = a tuple of "Balin", "Lord of Moria", 2994
# TODO 2: unpack tomb into name, title, year (one line)
# TODO 3: print f"{name}, {title}"
# TODO 4: print f"Fell in the year {year}"
# TODO 5: swap the two watches in one line, no third variable
# TODO 6: print first_watch, then second_watch
`,
        solution: py`first_watch = "Oin"
second_watch = "Ori"

tomb = ("Balin", "Lord of Moria", 2994)
name, title, year = tomb
print(f"{name}, {title}")
print(f"Fell in the year {year}")
first_watch, second_watch = second_watch, first_watch
print(first_watch)
print(second_watch)`,
        hints: [
          'A tuple looks like a list wearing parentheses: `tomb = ("Balin", "Lord of Moria", 2994)`. Indexing works as with lists; changing it does not.',
          'Unpacking mirrors packing: `name, title, year = tomb` gives each variable one part, in order — three names on the left for three values in the tuple.',
          'The swap is one line: `first_watch, second_watch = second_watch, first_watch`. Python packs the right side into a tuple before touching the left, so nothing is lost.',
        ],
        validation: py`assert isinstance(tomb, tuple), "tomb must be a tuple -- parentheses, not square brackets. The stone does not bend."
assert tomb == ("Balin", "Lord of Moria", 2994), f"The stone reads {tomb} -- it must be exactly ('Balin', 'Lord of Moria', 2994)."
assert name == "Balin" and title == "Lord of Moria" and year == 2994, "The unpacking is wrong: name, title, year must each take their part of tomb, in order, in one line."
assert first_watch == "Ori" and second_watch == "Oin", "The watches still stand at the wrong doors. Swap them: first_watch, second_watch = second_watch, first_watch"
lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert "Balin, Lord of Moria" in lines, "The first carved line must read exactly: Balin, Lord of Moria"
assert "Fell in the year 2994" in lines, "The second carved line must read exactly: Fell in the year 2994"
assert lines[-2:] == ["Ori", "Oin"], "The last two printed lines must be the swapped watches: Ori, then Oin."`,
        successText: 'The chisel lifts. What you have cut will outlast every hand that comes to read it.',
        xp: 65,
      },
      quiz: [
        {
          q: 'You run `oath = ("iron", "silence")` and then `oath[0] = "gold"`. What happens?',
          options: [
            'The tuple becomes ("gold", "silence")',
            'Python silently ignores the change',
            'A new tuple is created automatically',
            'Python raises a TypeError — tuples cannot be changed',
          ],
          answer: 3,
          explain: 'Tuples are immutable: no item assignment, no append, no remove. The '
            + 'attempt raises TypeError. To "change" a tuple you must build a new one and '
            + 'rebind the name.',
        },
        {
          q: 'How do you write a tuple containing only one value?',
          options: [
            '`("Durin")` — parentheses are enough',
            '`("Durin",)` — with a trailing comma',
            '`tuple["Durin"]`',
            'A tuple cannot hold just one value',
          ],
          answer: 1,
          explain: 'Parentheses alone are mere grouping: ("Durin") is only the string. '
            + 'The comma is what makes the tuple — ("Durin",) works, and so does the '
            + 'bare form "Durin", though it is easy to misread.',
        },
        {
          q: 'After `a, b = b, a` runs, what is true?',
          options: [
            'a and b have exchanged their values',
            'a and b are now equal',
            'Python raises an error — a name cannot appear on both sides',
            'Only a has changed',
          ],
          answer: 0,
          explain: 'The right-hand side is packed into a tuple from the OLD values before '
            + 'any assignment happens, so the exchange is safe and complete. No temporary '
            + 'variable is needed.',
        },
        {
          q: 'Which record is best kept as a tuple rather than a list?',
          options: [
            'A roster that gains and loses members',
            'A log that grows with each event',
            'A fixed pair of coordinates that must never change',
            'A queue of tasks consumed one by one',
          ],
          answer: 2,
          explain: 'Tuples suit records whose shape and content are fixed at creation, '
            + 'and they announce that intent to every reader. Anything that grows, '
            + 'shrinks, or is amended wants a list.',
        },
      ],
    },

    // ----------------------------------------------------------
    // a2l5 — dictionaries
    // ----------------------------------------------------------
    {
      id: 'a2l5',
      title: 'The Book of Mazarbul',
      concept: 'dictionaries — key-value pairs, lookup, .get(), updating, deleting, and looping',
      xp: 35,
      narrative: 'The book lies on a shattered lectern, its spine broken, its pages '
        + 'stiff with old smoke. It is not a story. It is a register: each line a name, '
        + 'and against each name a fate, in whatever hand still had strength to write '
        + 'it. You do not read such a book by counting pages — you ask it a question. '
        + '*What became of Ori?* And the book answers, if the name is there, or wounds '
        + 'you if it is not. Python keeps registers of this kind: not positions in a '
        + 'line, but names bound to answers. It calls them dictionaries.',
      sections: [
        {
          heading: 'A register of names and fates',
          body: 'A **dictionary** (type `dict`) stores **key–value pairs**: each **key** '
            + 'is bound to one **value**. You build one with curly braces, each pair '
            + 'written `key: value` and separated by commas. To look a value up, put '
            + 'the key in square brackets — you ask by *name*, not by position. `len()` '
            + 'counts the entries.',
          code: py`book = {
    "Balin": "lord of Moria",
    "Ori": "keeper of records",
    "Oin": "seeker of the gate",
}
print(book["Ori"])      # keeper of records
print(len(book))        # 3`,
          note: 'Ask for a name the book does not hold — `book["Nain"]` — and Python '
            + 'answers with violence: a **KeyError**. The register does not apologize '
            + 'for its gaps.',
        },
        {
          heading: 'Asking without waking the dead',
          body: 'The gentler question is `.get()`. `book.get("Nain")` returns `None` '
            + 'when the key is absent, and `book.get("Nain", "unrecorded")` returns '
            + 'your chosen default instead. No error either way.\n\n'
            + 'To learn merely whether a name is present, use `in` — on a dictionary it '
            + 'examines the **keys**, never the values.',
          code: py`book = {"Balin": "lord of Moria", "Ori": "keeper of records"}
print(book.get("Ori", "unrecorded"))      # keeper of records
print(book.get("Nain", "unrecorded"))     # unrecorded -- no error raised
print("Balin" in book)                    # True: in asks about KEYS
print("lord of Moria" in book)            # False: values are not searched`,
        },
        {
          heading: 'New entries, altered fates, torn pages',
          body: 'The same square-bracket syntax that reads an entry also writes one:\n\n'
            + '- `book["Floi"] = "fallen"` — a key the book lacks: a **new** entry is added.\n'
            + '- `book["Balin"] = "fallen"` — a key it has: the old value is **overwritten**. One entry per key; a dictionary never holds duplicates.\n'
            + '- `del book["Ori"]` — the entry is removed outright, key and value together. Deleting a missing key raises `KeyError`.',
          code: py`book = {"Balin": "alive", "Ori": "alive"}
book["Floi"] = "fallen"     # a new line in the book
book["Balin"] = "fallen"    # the same key rewritten -- one entry per key
del book["Ori"]             # the page torn out entirely
print(book)`,
        },
        {
          heading: 'Reading every page',
          body: 'Loop over a dictionary and you receive its **keys**, in the order the '
            + 'entries were added. Three views refine the reading:\n\n'
            + '- `.keys()` — the names alone.\n'
            + '- `.values()` — the fates alone.\n'
            + '- `.items()` — each entry as a `(key, value)` pair, which two loop variables unpack exactly as you unpacked the tomb-script.',
          code: py`book = {"Balin": "fallen", "Ori": "alive"}
for name, fate in book.items():
    print(f"{name}: {fate}")

for fate in book.values():
    print(fate)`,
        },
      ],
      challenge: {
        title: 'Keeper of the Book',
        prompt: 'The last keeper is dead. The book is yours now, and the register must '
          + 'be brought up to date before the ink in the well goes hard.\n\n'
          + 'Write a program that:\n\n'
          + '- Creates a dict named `book` with exactly these three entries, in this order: `"Balin"` mapped to `"alive"`, `"Ori"` mapped to `"alive"`, `"Oin"` mapped to `"alive"`.\n'
          + '- Rewrites the entry for `"Balin"` to `"fallen"`.\n'
          + '- Adds a new entry: `"Floi"` mapped to `"fallen"`.\n'
          + '- The Watcher leaves nothing to record: deletes the `"Oin"` entry entirely, with `del`.\n'
          + '- Asks the book safely about `"Nain"` using `.get()` with the default `"unrecorded"`, and prints the answer.\n'
          + '- Loops over `book.items()` and prints one line per entry in the form `name: fate` — for example `Ori: alive`.\n\n'
          + 'Four printed lines in all: the safe answer, then the three surviving entries in the book’s own order.',
        starter: py`# The Book of Mazarbul. Whoever holds it, keeps it.

# TODO 1: book = the three entries, each name mapped to "alive"
# TODO 2: rewrite Balin's fate to "fallen"
# TODO 3: add the entry Floi -> "fallen"
# TODO 4: del the Oin entry
# TODO 5: print book.get("Nain", "unrecorded")
# TODO 6: loop over book.items() and print f"{name}: {fate}" for each
`,
        solution: py`book = {"Balin": "alive", "Ori": "alive", "Oin": "alive"}
book["Balin"] = "fallen"
book["Floi"] = "fallen"
del book["Oin"]
print(book.get("Nain", "unrecorded"))
for name, fate in book.items():
    print(f"{name}: {fate}")`,
        hints: [
          'The register is built once with curly braces — three pairs of name: "alive" — then edited line by line beneath.',
          'Writing uses the reading syntax: book["Balin"] = "fallen" rewrites an existing key, and the same form with a new key adds a page. del book["Oin"] tears one out. book.get("Nain", "unrecorded") asks without the risk of KeyError.',
          'The final reading is: for name, fate in book.items(): print(f"{name}: {fate}") — two loop variables, unpacked from each pair, exactly as with tuples.',
        ],
        validation: py`assert isinstance(book, dict), "book must be a dictionary -- curly braces binding each name to a fate."
assert "Oin" not in book, "The Watcher left nothing: the Oin entry must be deleted with del, not rewritten."
assert book == {"Balin": "fallen", "Ori": "alive", "Floi": "fallen"}, f"The register reads {book} -- expected Balin: fallen, Ori: alive, Floi: fallen, and no page for Oin."
lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert "unrecorded" in lines, "Ask the book about Nain with .get and the default 'unrecorded', then print what it answers."
assert "Balin: fallen" in lines, "The reading must include the line: Balin: fallen"
assert "Ori: alive" in lines, "The reading must include the line: Ori: alive"
assert "Floi: fallen" in lines, "The reading must include the line: Floi: fallen"
assert lines[-3:] == ["Balin: fallen", "Ori: alive", "Floi: fallen"], "The three entries must be read in the book's own order -- Balin, Ori, Floi -- by looping over book.items()."`,
        successText: 'The register is current. You try not to wonder whose hand will update it after yours.',
        xp: 70,
      },
      quiz: [
        {
          q: 'What does `book["Durin"]` do when `"Durin"` is not a key in `book`?',
          options: [
            'Returns None',
            'Returns an empty string',
            'Raises a KeyError',
            'Adds "Durin" with a blank value',
          ],
          answer: 2,
          explain: 'Square-bracket lookup demands the key exist; a missing key raises '
            + 'KeyError. It is .get() that returns None — or your chosen default — instead.',
        },
        {
          q: 'What does `book.get("Durin", "gone")` return when the key is missing?',
          options: [
            '"gone"',
            'None',
            'It raises a KeyError',
            '"Durin"',
          ],
          answer: 0,
          explain: '.get takes an optional second argument returned when the key is '
            + 'absent — here "gone". Without a default it returns None. It never raises '
            + 'for a missing key.',
        },
        {
          q: 'What does `for name, fate in book.items():` give you on each pass?',
          options: [
            'Two keys at a time',
            'One key only',
            'One value only',
            'One key and its value, unpacked into the two variables',
          ],
          answer: 3,
          explain: '.items() yields each entry as a (key, value) pair, and the two loop '
            + 'variables unpack it — the same tuple unpacking you learned at the tomb. '
            + 'Looping the dict bare yields only keys.',
        },
        {
          q: 'What does `"Balin" in book` test, when `book` is a dict?',
          options: [
            'Whether "Balin" appears as a key or a value',
            'Whether "Balin" is one of the keys',
            'Whether "Balin" is one of the values',
            'Whether book is empty',
          ],
          answer: 1,
          explain: 'On a dictionary, `in` asks only about keys. To search the fates '
            + 'rather than the names, ask `"Balin" in book.values()`.',
        },
      ],
    },

    // ----------------------------------------------------------
    // a2l6 — sets
    // ----------------------------------------------------------
    {
      id: 'a2l6',
      title: 'No Shadow Passes Twice',
      concept: 'sets — deduplication, membership, add and discard, union, intersection, difference',
      xp: 35,
      narrative: 'The gate-ward of the second hall kept a tally of everything that '
        + 'crossed his threshold, and he kept it the only way that mattered: a thing '
        + 'already counted was not counted again. An orc that came through five times '
        + 'was one orc. His slate held no order, no ranks, no first or last — only the '
        + 'one question the deep asks of every list of horrors: *what is actually down '
        + 'here?* Python has such a slate. It discards repetition on contact, answers '
        + 'membership in an instant, and is called a set.',
      sections: [
        {
          heading: 'The slate that refuses repetition',
          body: 'A **set** is an unordered collection of **unique** values. Write one '
            + 'with curly braces — values only, no colons — or build one from any '
            + 'sequence with `set()`, which melts duplicates on contact.\n\n'
            + '- No order means **no indexing**: there is no first member of a set.\n'
            + '- Adding a value the set already holds changes nothing.\n'
            + '- `len()` counts the distinct members — often the very question you are asking.',
          code: py`sightings = ["orc", "orc", "troll", "orc", "goblin"]
horde = set(sightings)
print(len(horde))     # 3 -- however loud the reports, three shapes
print(horde)          # each name once; the display order is not promised`,
          note: 'One rune of warning: `{}` with nothing inside is an empty **dict**, not '
            + 'an empty set. The empty slate is spelled `set()`.',
        },
        {
          heading: 'The gate’s only question',
          body: 'A set exists to answer `in` — *has this thing been seen?* — and it '
            + 'answers instantly, however vast the tally grows.\n\n'
            + '- `.add(x)` marks a new sighting; adding a known one changes nothing.\n'
            + '- `.discard(x)` strikes a value, and stays **silent** if it was never there.\n'
            + '- `.remove(x)` also strikes, but raises `KeyError` when the value is absent. Prefer `.discard` when absence is no crime.',
          code: py`horde = {"orc", "troll", "goblin"}
print("troll" in horde)     # True
horde.add("balrog")
horde.add("orc")            # already known -- nothing changes
horde.discard("goblin")     # struck from the slate
horde.discard("dragon")     # never there -- discard keeps its silence
print(len(horde))           # 3: orc, troll, balrog`,
        },
        {
          heading: 'Where two hosts meet',
          body: 'Two tallies can be weighed against each other with three operators:\n\n'
            + '- `a | b` — **union**: everything seen in either.\n'
            + '- `a & b` — **intersection**: only what both have seen.\n'
            + '- `a - b` — **difference**: what `a` saw that `b` did not. Order matters here; `b - a` is a different slate.\n\n'
            + 'Because sets promise no order, display them predictably by handing them '
            + 'to `sorted()`, which returns an ordered **list** of the members.',
          code: py`west_door = {"orc", "troll", "balrog"}
east_door = {"orc", "warg"}

print(sorted(west_door | east_door))   # union: seen at either door
print(sorted(west_door & east_door))   # intersection: seen at both
print(sorted(west_door - east_door))   # difference: the west's alone`,
        },
      ],
      challenge: {
        title: 'The Watcher’s Tally',
        prompt: 'Reports come in from both doors of the second hall — sloppy and '
          + 'repetitive, as fear makes them. Reduce them to truth. The starter gives '
          + 'you the raw `sightings` from the west door and the finished `east_door` tally.\n\n'
          + 'Write a program that:\n\n'
          + '- Builds a set named `west_door` from the `sightings` list, collapsing the duplicates.\n'
          + '- Adds `"balrog"` to `west_door` — the last report was written in a shaking hand.\n'
          + '- Strikes `"goblin"` from `west_door` using `.discard()` — that report was withdrawn.\n'
          + '- Builds `both` — the creatures reported at BOTH doors (intersection).\n'
          + '- Builds `all_foes` — the creatures reported at EITHER door (union).\n'
          + '- Builds `west_only` — the creatures reported at the west door but not the east (difference).\n'
          + '- Prints four lines, in order: `len(west_door)`, then `sorted(all_foes)`, then whether `"balrog"` is in `both` (it should print `True`), then `sorted(west_only)`.',
        starter: py`# Raw reports from the west door -- fear repeats itself.
sightings = ["orc", "orc", "cave troll", "orc", "goblin", "cave troll"]

# The east door's tally, already clean.
east_door = {"orc", "warg", "balrog"}

# TODO 1: west_door = a set built from sightings
# TODO 2: add "balrog" to west_door
# TODO 3: discard "goblin" from west_door
# TODO 4: both = intersection; all_foes = union; west_only = difference
# TODO 5: print len(west_door), sorted(all_foes), "balrog" in both, sorted(west_only)
`,
        solution: py`sightings = ["orc", "orc", "cave troll", "orc", "goblin", "cave troll"]
east_door = {"orc", "warg", "balrog"}

west_door = set(sightings)
west_door.add("balrog")
west_door.discard("goblin")
both = west_door & east_door
all_foes = west_door | east_door
west_only = west_door - east_door
print(len(west_door))
print(sorted(all_foes))
print("balrog" in both)
print(sorted(west_only))`,
        hints: [
          '`set(sightings)` melts the duplicates on contact. After that, `.add` and `.discard` adjust the tally one creature at a time.',
          'The three combinations are operators between the two sets: `&` keeps only what both hold, `|` merges everything, and `-` keeps what the left set alone holds.',
          'The four prints, in order: `print(len(west_door))`, `print(sorted(all_foes))`, `print("balrog" in both)`, `print(sorted(west_only))`.',
        ],
        validation: py`assert isinstance(west_door, set), "west_door must be a set -- build it with set(sightings)."
assert west_door == {"orc", "cave troll", "balrog"}, f"The west tally holds {sorted(west_door)} -- expected balrog, cave troll, orc. Dedupe the sightings, add the balrog, discard the goblin."
assert both == {"orc", "balrog"}, "both must be the intersection of west_door and east_door -- the & operator."
assert all_foes == {"orc", "cave troll", "balrog", "warg"}, "all_foes must be the union of west_door and east_door -- the | operator."
assert west_only == {"cave troll"}, "west_only must be the difference west_door - east_door, in that order."
lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert len(lines) >= 4, "Four lines must be printed: the count, the union, the balrog question, the difference."
assert lines[0] == "3", "The first printed line must be len(west_door) -- which should be 3."
assert lines[1] == "['balrog', 'cave troll', 'orc', 'warg']", "The second line must be sorted(all_foes), printed as the list it returns."
assert lines[2] == "True", "The third line must print whether 'balrog' is in both -- and it should be True."
assert lines[3] == "['cave troll']", "The fourth line must be sorted(west_only)."`,
        successText: 'The tally is clean: three shapes at the west door — and one of them should not be possible.',
        xp: 70,
      },
      quiz: [
        {
          q: 'What is `set(["orc", "orc", "warg", "orc"])`?',
          options: [
            'A set of 4 values',
            'A set of 2 values: {"orc", "warg"}',
            'A list of 2 values',
            'An error — sets cannot be built from lists',
          ],
          answer: 1,
          explain: 'Building a set collapses duplicates; each value survives exactly once. '
            + 'That is the fastest answer to the question "how many DIFFERENT things are here?"',
        },
        {
          q: 'What is the difference between `horde.discard("warg")` and `horde.remove("warg")`?',
          options: [
            'remove is silent if the value is absent; discard raises KeyError',
            'discard removes every copy; remove takes only one',
            'discard is silent if the value is absent; remove raises KeyError',
            'There is no difference',
          ],
          answer: 2,
          explain: 'Both strike the value when present. When it is absent, .remove raises '
            + 'KeyError while .discard does nothing. (And a set never holds copies, so '
            + 'there are no "copies" to speak of.)',
        },
        {
          q: 'What does `{1, 2, 3} & {2, 3, 4}` evaluate to?',
          options: [
            '{2, 3}',
            '{1, 2, 3, 4}',
            '{1}',
            '{1, 4}',
          ],
          answer: 0,
          explain: '`&` is intersection: only values present in BOTH sets survive. '
            + '{1, 2, 3, 4} would be the union (|), and {1} the difference of the first '
            + 'set minus the second.',
        },
        {
          q: 'Why does `horde[0]` fail when `horde` is a set?',
          options: [
            'Sets are empty until looped over',
            'Sets allow only negative indexes',
            'It does not fail — it returns the smallest member',
            'Sets are unordered — there is no position 0 to ask for',
          ],
          answer: 3,
          explain: 'A set keeps no order, so indexing is meaningless and raises TypeError. '
            + 'To display one predictably, sort it into a list first: sorted(horde).',
        },
      ],
    },

    // ----------------------------------------------------------
    // a2l7 — comprehensions
    // ----------------------------------------------------------
    {
      id: 'a2l7',
      title: 'One Line to Rule Them All',
      concept: 'list comprehensions, filtering with if, and dict and set comprehensions',
      xp: 40,
      narrative: 'On the lowest inhabited level you find a smith’s workshop, and in '
        + 'it the pattern for a terrible economy: whole furnaces of labor folded into a '
        + 'single band of script. The Codex is candid about the price of such '
        + 'compression. A loop that builds a list takes four honest lines — create, '
        + 'walk, test, append — and any apprentice can read them by torchlight. The '
        + 'forge-write does the same work in one line, beautiful and dense, and it will '
        + 'cut the hand that wields it carelessly. Learn to fold the loop. Learn also '
        + 'when to leave it unfolded.',
      sections: [
        {
          heading: 'The loop, folded',
          body: 'A **list comprehension** builds a new list in a single expression:\n\n'
            + '- The shape is `[expression for item in iterable]`.\n'
            + '- Read it aloud as: *build a list of EXPRESSION, for each ITEM in ITERABLE*.\n'
            + '- It replaces the four-line ritual of creating an empty list, walking a loop, and appending.\n\n'
            + 'The example folds one loop both ways. (Recall from Act I: `.upper()` '
            + 'returns the shouted copy of a string — the original is untouched.)',
          code: py`names = ["balin", "oin", "ori"]

# The long way: create, walk, append
shouts = []
for name in names:
    shouts.append(name.upper())
print(shouts)

# The folded way -- identical result, one line
shouts = [name.upper() for name in names]
print(shouts)`,
        },
        {
          heading: 'A condition at the gate',
          body: 'Add `if condition` at the end and the comprehension becomes a filter: '
            + 'only items that pass the test are admitted to the new list. The rest are '
            + 'turned away without record.\n\n'
            + 'Transformation and filtering combine freely — change the expression at '
            + 'the front, guard the gate at the back.',
          code: py`depths = [3, 12, 7, 30, 18, 4]
deep = [d for d in depths if d > 10]
print(deep)                    # [12, 30, 18]

names = ["balin", "oin", "ori", "floi"]
short_marks = [name.upper() for name in names if len(name) == 3]
print(short_marks)             # ['OIN', 'ORI']`,
        },
        {
          heading: 'Other vessels, same fold',
          body: 'The fold is not confined to lists:\n\n'
            + '- A **dict comprehension** uses braces and a colon: `{name: len(name) for name in names}` binds each key to a computed value.\n'
            + '- A **set comprehension** uses braces without a colon: `{name[0] for name in names}` collects unique results, duplicates collapsing as sets always do.',
          code: py`names = ["balin", "oin", "ori"]
rune_count = {name: len(name) for name in names}
print(rune_count)              # {'balin': 5, 'oin': 3, 'ori': 3}

first_runes = {name[0] for name in names}
print(len(first_runes))        # 2 -- 'b' and 'o'; the second 'o' collapses`,
          note: 'Power tempts. When a comprehension no longer reads aloud in one breath '
            + '— loops nested in loops, conditions stacked on conditions — unfold it '
            + 'back into an honest loop. The next reader of your code is usually you, '
            + 'in a worse hour, by a weaker light.',
        },
      ],
      challenge: {
        title: 'Forged in One Line',
        prompt: 'The forge-patterns must be cut into the workshop wall before you '
          + 'descend further — one line each, as the smiths left them. The starter '
          + 'gives you the raw stock: `names` and `depths`.\n\n'
          + 'Write a program that:\n\n'
          + '- Builds `carved` with ONE list comprehension: every name from `names`, uppercased with `.upper()`, in the same order.\n'
          + '- Builds `deep` with ONE list comprehension using an `if`: only the numbers from `depths` greater than `10`, in their original order.\n'
          + '- Builds `rune_count` with ONE dict comprehension: each name from `names` mapped to its length, using `len()`.\n'
          + '- Prints three lines, in order: `len(carved)`, then `deep` itself, then `rune_count["balin"]`.',
        starter: py`# The forge-patterns. One line each; the fold is the lesson.
names = ["balin", "oin", "ori", "floi", "nain", "frar", "loni"]
depths = [3, 12, 7, 30, 18, 4]

# TODO 1: carved = one list comprehension -- every name uppercased
# TODO 2: deep = one list comprehension -- only the depths greater than 10
# TODO 3: rune_count = one dict comprehension -- each name mapped to len(name)
# TODO 4: print len(carved), then deep, then rune_count["balin"]
`,
        solution: py`names = ["balin", "oin", "ori", "floi", "nain", "frar", "loni"]
depths = [3, 12, 7, 30, 18, 4]

carved = [name.upper() for name in names]
deep = [d for d in depths if d > 10]
rune_count = {name: len(name) for name in names}
print(len(carved))
print(deep)
print(rune_count["balin"])`,
        hints: [
          'The shape is always `[what-to-keep for item in source]`. For `carved`, the what-to-keep is `name.upper()`.',
          'The filter trails the for clause: `[d for d in depths if d > 10]`. No else, no extra clauses — what fails the test is simply never admitted.',
          'The dict fold trades brackets for braces and keeps a colon: `{name: len(name) for name in names}`.',
        ],
        validation: py`assert carved == ["BALIN", "OIN", "ORI", "FLOI", "NAIN", "FRAR", "LONI"], f"carved reads {carved} -- it must be every name from names, uppercased, in the same order."
assert deep == [12, 30, 18], f"deep reads {deep} -- it must keep only the depths greater than 10, in their original order."
assert isinstance(rune_count, dict), "rune_count must be a dict -- braces with a key: value expression inside."
assert rune_count == {"balin": 5, "oin": 3, "ori": 3, "floi": 4, "nain": 4, "frar": 4, "loni": 4}, "rune_count must map each name to its length -- len(name) is the value expression."
lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert len(lines) >= 3, "Three lines must be printed: the count of carved, the deep list, and the runes in the lord's name."
assert lines[0] == "7", "The first printed line must be len(carved) -- seven names were carved."
assert lines[1] == "[12, 30, 18]", "The second printed line must be the deep list itself."
assert lines[2] == "5", "The third printed line must be rune_count['balin'] -- five runes in the lord's name."`,
        successText: 'Three workings, three lines. The forge approves — and it will remember your signature.',
        xp: 80,
      },
      quiz: [
        {
          q: 'What does `[n * n for n in range(4)]` produce?',
          options: [
            '[1, 4, 9, 16]',
            '[0, 1, 2, 3]',
            '[16]',
            '[0, 1, 4, 9]',
          ],
          answer: 3,
          explain: 'range(4) yields 0 through 3, and each is squared as it is admitted: '
            + '[0, 1, 4, 9]. The tempting [1, 4, 9, 16] forgets that range starts at 0 '
            + 'and never includes its stop.',
        },
        {
          q: 'Where does the filtering `if` belong in `[w for w in words if len(w) > 3]`?',
          options: [
            'After the `for` clause, at the end',
            'Immediately after the opening bracket',
            'Between the expression and the `for`',
            'Comprehensions cannot filter',
          ],
          answer: 0,
          explain: 'A simple filter always trails the for clause. Only items that pass '
            + 'are handed to the expression at the front; the rest never existed as far '
            + 'as the new list knows.',
        },
        {
          q: 'What does `{ch for ch in "moria"}` build?',
          options: [
            'A dict mapping each character to its position',
            'A list of five characters',
            'A set of the unique characters in the word',
            'A string with its duplicates removed',
          ],
          answer: 2,
          explain: 'Braces without a colon make a set comprehension: unique members, no '
            + 'order. The five letters of "moria" happen to be distinct — but "doom" '
            + 'would yield only three.',
        },
        {
          q: 'Which loop does `[w for w in words if len(w) > 3]` replace?',
          options: [
            'One that removes short words from `words` itself',
            'One that appends each long word to a new, empty list',
            'One that counts the long words',
            'One that sorts `words` by length',
          ],
          answer: 1,
          explain: 'A comprehension always builds a NEW list; the source is untouched. '
            + 'The unfolded form creates an empty list, walks words, tests each, and '
            + 'appends the survivors.',
        },
      ],
    },
  ],

  // ----------------------------------------------------------
  // Boss — Durin's Bane
  // ----------------------------------------------------------
  boss: {
    id: 'act2-boss',
    title: 'Durin’s Bane',
    narrative: 'It was never the orcs you were counting toward. The drums stop, all at '
      + 'once, and the silence after them is worse — a pressure, like deep water. Then '
      + 'the far end of the hall brightens, and brightness is the one thing you never '
      + 'learned to fear down here. It comes wreathed in fire and carrying shadow the '
      + 'way a king carries a mantle. Everything the mines taught you — the counted '
      + 'stair, the marshalled ranks, the roll, the stone, the book, the tally, the '
      + 'fold — is now simply what stands between you and the deep. Answer truly, and '
      + 'work quickly.',
    defeatText: 'The fire passes over you, and the mines add one more uncounted name to their dark ledger.',
    victoryText: 'The bridge takes it. The fire falls away into a dark even it cannot light, and for the first time since the gate, you hear nothing at all.',
    xp: 300,
    flawlessBonus: 50,
    gauntlet: [
      {
        q: 'A `while` loop’s body reaches a `break` statement and runs it. What happens?',
        options: [
          'The current pass ends and the condition is tested again',
          'The loop ends immediately; execution continues after the loop',
          'The loop restarts from its first pass',
          'Python raises an error unless the condition is already False',
        ],
        answer: 1,
        explain: 'break abandons the loop outright, whatever the condition says, and '
          + 'execution resumes at the first line after the loop. Returning to the '
          + 'condition is continue’s work, not break’s.',
      },
      {
        q: 'What does `range(1, 10, 3)` produce?',
        options: [
          '1, 4, 7, 10',
          '3, 6, 9',
          '1, 4, 7',
          '1, 3, 5, 7, 9',
        ],
        answer: 2,
        explain: 'Start at 1 and stride by 3: 1, 4, 7. The next stride lands on 10 — '
          + 'the stop value, which range never includes.',
      },
      {
        q: 'With `roll = ["Balin", "Oin", "Ori", "Floi", "Frar"]`, what is `roll[-2]`?',
        options: [
          '"Floi"',
          '"Frar"',
          '"Oin"',
          'An IndexError',
        ],
        answer: 0,
        explain: 'Negative indexes count back from the end: -1 is "Frar", so -2 is '
          + '"Floi". Nothing here is out of range.',
      },
      {
        q: 'Which of these operations succeeds on the tuple `oath = ("stone", "silence")`?',
        options: [
          '`oath.append("iron")`',
          '`oath[0] = "iron"`',
          '`oath.remove("stone")`',
          '`print(oath[1])`',
        ],
        answer: 3,
        explain: 'Reading a tuple is always permitted — indexing, len, looping, '
          + 'unpacking. Changing one never is: append, remove, and item assignment all '
          + 'raise errors on the unbending stone.',
      },
      {
        q: 'What does `book.get("Nain")` return when `"Nain"` is not in the dict `book`?',
        options: [
          'It raises a KeyError',
          'None',
          '"Nain"',
          'False',
        ],
        answer: 1,
        explain: '.get never raises for a missing key: with no default supplied it '
          + 'returns None. Square-bracket lookup is the form that answers absence with '
          + 'a KeyError.',
      },
      {
        q: 'What is `len(set("doom"))`?',
        options: [
          '4',
          '1',
          '3',
          '2',
        ],
        answer: 2,
        explain: 'set("doom") collects the unique characters: d, o, m. The second o '
          + 'collapses into the first — a set holds nothing twice — leaving 3.',
      },
    ],
    finalChallenge: {
      title: 'The Last Page',
      prompt: 'One page of the book remains blank, and the duty of it falls to you: '
        + 'the final tally of everything the watches reported before the end. The '
        + 'starter gives you `watch_reports` — every sighting shouted down the stair, '
        + 'raw and repetitive.\n\n'
        + 'Write a program that, in order:\n\n'
        + '- Creates an empty dict named `tally`.\n'
        + '- Loops over `watch_reports` and counts each creature: for every report, set `tally[foe] = tally.get(foe, 0) + 1`.\n'
        + '- Builds a list named `great_threats` holding the creatures counted `2` or more times, in the order they appear in `tally` (a comprehension over `tally.items()` serves, or an honest loop with `.append`).\n'
        + '- Prints `len(watch_reports)` — the number of reports taken.\n'
        + '- Loops over `tally.items()` and prints one line per creature in the form `orc: 4` (name, colon, space, count).\n'
        + '- Prints `great_threats` itself, last.\n\n'
        + 'Six printed lines: the count of reports, the four creatures of the tally, and the list of great threats.',
      starter: py`# Every sighting, exactly as it was shouted down the stair.
watch_reports = ["orc", "orc", "troll", "goblin", "orc", "goblin", "orc", "troll", "balrog"]

# TODO 1: tally = empty dict; loop the reports; tally[foe] = tally.get(foe, 0) + 1
# TODO 2: great_threats = the creatures counted 2 or more times, in tally order
# TODO 3: print len(watch_reports)
# TODO 4: print each tally entry as  name: count  (one line each)
# TODO 5: print great_threats
`,
      solution: py`watch_reports = ["orc", "orc", "troll", "goblin", "orc", "goblin", "orc", "troll", "balrog"]

tally = {}
for foe in watch_reports:
    tally[foe] = tally.get(foe, 0) + 1

great_threats = [foe for foe, count in tally.items() if count >= 2]

print(len(watch_reports))
for foe, count in tally.items():
    print(f"{foe}: {count}")
print(great_threats)`,
      validation: py`assert isinstance(tally, dict), "tally must be a dict mapping each creature to its count."
assert tally == {"orc": 4, "troll": 2, "goblin": 2, "balrog": 1}, f"The tally reads {tally} -- count every report with tally.get(foe, 0) + 1, starting from an empty dict."
assert great_threats == ["orc", "troll", "goblin"], f"great_threats reads {great_threats} -- it must hold the creatures counted 2 or more times, in tally order."
lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert len(lines) == 6, f"The page holds {len(lines)} lines, not 6 (the report count, four tally lines, the threats)."
assert lines[0] == "9", "The first printed line must be len(watch_reports): 9."
assert "orc: 4" in lines and "troll: 2" in lines and "goblin: 2" in lines and "balrog: 1" in lines, "Each creature must be read out as  name: count  -- four lines, from tally.items()."
assert lines[-1] == "['orc', 'troll', 'goblin']", "The last line must be the great_threats list itself, printed whole."`,
      xp: 0,
    },
  },

  // ----------------------------------------------------------
  // Codex — the act's vocabulary
  // ----------------------------------------------------------
  codex: [
    { term: 'while', def: 'A loop that repeats its indented body for as long as its condition remains `True`, testing before every pass.' },
    { term: 'break', def: 'Ends the enclosing loop immediately; execution continues at the first line after the loop.' },
    { term: 'continue', def: 'Abandons the current pass of a loop and returns to the top for the next one.' },
    { term: 'infinite loop', def: 'A `while` loop whose condition never becomes `False`, so it never ends — usually a counter nobody updates.' },
    { term: 'for', def: 'A loop that visits each item of a sequence in turn and stops by itself when the sequence is spent.' },
    { term: 'range()', def: 'Produces a run of numbers from a start (default 0) up to — never including — a stop, moving by a step (default 1).' },
    { term: 'list', def: 'An ordered, changeable collection written in square brackets; the vessel for anything that grows or shrinks.' },
    { term: 'index', def: 'A position number in a sequence, counted from 0; negative indexes count backward from the end.' },
    { term: 'slice', def: 'A copied stretch of a sequence, `seq[start:stop]`, including the start position but never the stop.' },
    { term: '.append()', def: 'Adds one value to the end of a list, changing the list in place.' },
    { term: 'tuple', def: 'An immutable sequence written in parentheses: read like a list, but never changed after creation.' },
    { term: 'unpacking', def: 'Splitting a sequence into named variables in one line, as in `name, year = record`; the counts on both sides must match.' },
    { term: 'dictionary', def: 'A collection of key–value pairs in curly braces; values are looked up by key, not by position.' },
    { term: '.get()', def: 'Dictionary lookup that returns a default (or `None`) for a missing key instead of raising a `KeyError`.' },
    { term: 'set', def: 'An unordered collection of unique values; duplicates collapse on entry and membership tests are instant.' },
    { term: 'comprehension', def: 'A one-line expression that builds a list, dict, or set from a loop, optionally filtered by an `if`.' },
  ],
};
