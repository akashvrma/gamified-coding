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
        {
          heading: 'A rune to recognize: the walrus :=',
          body: 'One last mark, taught for **reading**, not for duty. Python has an '
            + '**assignment expression**, spelled `:=` and nicknamed the *walrus* for '
            + 'its sideways face. Inside a condition it does two things in one breath: '
            + '`(depth := depth + 3)` binds `depth` to the new value, and the whole '
            + 'parenthesized expression *is* that value, ready to be tested on the spot.\n\n'
            + 'You will meet it most often in loops that fetch-and-test in a single '
            + 'line. In another sorcerer’s scroll, a shape like '
            + '`while (line := next_rune()) != "END":` reads as: *draw the next rune, '
            + 'name it `line`, and while it is not END, work the body on it.*\n\n'
            + 'Be plain about the law here: **writing** the walrus is optional style, '
            + 'never obligation. The two-line form — assign on one line, test on the '
            + 'next — is always lawful and often clearer. But other hands fold their '
            + 'loops this way, so your eyes must know how to unfold it.',
          code: py`depth = 0
while (depth := depth + 3) < 10:
    print(f"{depth} fathoms of rope paid out")
print("The rope is spent.")`,
          note: 'Read the condition aloud: *grow depth by three, keep the new value, '
            + 'and ask whether it is still under ten.* The binding happens first, the '
            + 'test second — every pass, including the last one that fails.',
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
        workedExample: {
          intro: 'The Codex turns to a page in a smaller hand — an apprentice of the '
            + 'second deep who never climbed back past it. Her task was kindred to '
            + 'yours: nine bells in the guard-hall, rung and counted aloud, the '
            + 'cracked third passed in silence, the sixth where the rope failed and '
            + 'the ringing had to end. Read the order of her checks: the ending first, '
            + 'the skipping second, the honest work last.',
          code: py`bell = 1
while bell <= 9:
    if bell == 6:
        print("The rope has gone slack.")
        break
    if bell == 3:
        bell += 1
        continue
    print(f"Bell {bell} rings")
    bell += 1`,
          outro: 'Her bells are not your stair, but the skeleton is one skeleton: '
            + 'create the counter, test it, change it — and feed it yourself before '
            + 'every `continue`, or the loop returns to the same bell forever. The '
            + 'page turns back. Count your own descent now, in your own hand.',
        },
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
            'Python detects that the loop cannot end and raises an error',
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

      extras: [
        {
          id: 'a2l1x1',
          kind: 'echo',
          title: 'The Hall of Doors',
          prompt: 'The stair was not the last thing that must be counted. Twelve doors '
            + 'line the eastern hall, and each must be tested aloud — save the third, '
            + 'which wiser hands bricked shut, and the tenth, where the testing ends.\n\n'
            + 'Write a program that:\n\n'
            + '- Creates a variable `door` set to `1`.\n'
            + '- Runs a `while` loop while `door` is less than or equal to `12`.\n'
            + '- Inside, if `door` equals `10`: prints exactly `Something knocks back.` and ends the loop with `break`.\n'
            + '- Otherwise, if `door` equals `3`: adds 1 to `door` and skips the rest of the pass with `continue` — the bricked door is passed in silence.\n'
            + '- Otherwise: prints `Door ` then the number then ` holds` (`Door 1 holds`, `Door 2 holds`, and so on), and adds 1 to `door`.\n\n'
            + 'Nine lines in all: eight doors that hold, and the answer from behind the tenth.',
          starter: py`# Twelve doors. Test each aloud -- with two exceptions.
door = 1

# TODO: while door <= 12 -- at door 10, print "Something knocks back." and break;
# at door 3, move on in silence with continue; otherwise print f"Door {door} holds"
`,
          solution: py`door = 1
while door <= 12:
    if door == 10:
        print("Something knocks back.")
        break
    if door == 3:
        door += 1
        continue
    print(f"Door {door} holds")
    door += 1`,
          hints: [
            'The shape is the stair you have already counted: the breaking check first (print, then break), the skipping check second (add 1, then continue), and only then the ordinary print-and-add.',
            'Inside the loop: if door == 10, print "Something knocks back." and break; if door == 3, door += 1 then continue; the last two lines print f"Door {door} holds" and add 1.',
          ],
          validation: py`lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert len(lines) == 9, f"The hall heard {len(lines)} lines, not 9 -- eight doors hold, then the tenth answers. Check the silent third door and the break at the tenth."
assert lines[0] == "Door 1 holds", "The testing begins at the first door, with the line: Door 1 holds"
assert "Door 3" not in _stdout, "The third door is bricked shut -- pass it with continue and print nothing for it."
assert lines[2] == "Door 4 holds", "After the silent third door, the next spoken line must be: Door 4 holds"
assert "Door 10" not in _stdout and "Door 11" not in _stdout and "Door 12" not in _stdout, "The testing must stop at the tenth door -- break before any later door is named."
assert lines[-1] == "Something knocks back.", "The final line must be exactly: Something knocks back."
assert door == 10, "When the loop breaks, door should still be 10 -- break fires before the counter moves again."`,
          successText: 'Eight doors hold. The tenth you leave to whatever is holding it from the other side.',
          xp: 20,
        },
        {
          id: 'a2l1x2',
          kind: 'echo',
          title: 'The Oil Ration',
          prompt: 'Light is arithmetic down here. Five flasks of oil remain, and the '
            + 'dark must be told the count as each one burns.\n\n'
            + 'Write a program that:\n\n'
            + '- Creates a variable `flasks` set to `5`.\n'
            + '- Runs a `while` loop while `flasks` is greater than `0`.\n'
            + '- Inside, prints `Flasks left: ` followed by the current count (`Flasks left: 5` first), then subtracts 1 from `flasks`.\n'
            + '- After the loop — outside it — prints exactly `The dark takes the rest.`\n\n'
            + 'Six lines: five counts falling from 5 to 1, then the closing line once.',
          starter: py`# Five flasks. Count each one down into the dark.
flasks = 5

# TODO: while flasks > 0 -> print f"Flasks left: {flasks}", then burn one
# TODO: after the loop -> print "The dark takes the rest."
`,
          solution: py`flasks = 5
while flasks > 0:
    print(f"Flasks left: {flasks}")
    flasks -= 1
print("The dark takes the rest.")`,
          hints: [
            'The counter pattern, walked downward: created at 5, tested with > 0, changed with flasks -= 1 inside the body.',
            'The body is two lines -- print(f"Flasks left: {flasks}") then flasks -= 1 -- and the closing print stands AFTER the loop, unindented, so it runs exactly once.',
          ],
          validation: py`lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert len(lines) == 6, f"The dark heard {len(lines)} lines, not 6 -- five counted flasks, then the closing line once."
assert lines[0] == "Flasks left: 5", "The count begins at the full ration: Flasks left: 5"
assert lines[4] == "Flasks left: 1", "The last counted flask must be: Flasks left: 1"
assert "Flasks left: 0" not in _stdout, "Zero is never announced -- the condition flasks > 0 ends the loop before it can be."
assert lines[-1] == "The dark takes the rest.", "The final line must be exactly: The dark takes the rest."
assert flasks == 0, "After the loop, flasks should have burned down to exactly 0."`,
          successText: 'The last flask gutters out on schedule. What follows is arithmetic of a different kind.',
          xp: 15,
        },
      ],

      trace: [
        {
          id: 'a2l1t1',
          code: py`step = 1
while step < 6:
    if step == 3:
        break
    print(step)
    step += 1
print("out")`,
          q: 'The scrying: what does this working print?',
          options: [
            '1\n2',
            '1\n2\n3\nout',
            '1\n2\nout',
            '1\n2\n3\n4\n5\nout',
          ],
          answer: 2,
          explain: 'On the pass where step is 3, break fires BEFORE the print, so 3 is '
            + 'never spoken — and break abandons only the loop, not the program, so the '
            + 'line after the loop still runs. The first option kills too much; the '
            + 'second breaks a line too late; the last mistakes break for continue.',
        },
        {
          id: 'a2l1t2',
          code: py`n = 0
count = 0
while n < 10:
    n += 3
    count += 1
print(n)
print(count)`,
          q: 'The scrying: what does this working print?',
          options: [
            '12\n4',
            '9\n3',
            '10\n4',
            '12\n3',
          ],
          answer: 0,
          explain: 'The condition is tested only at the top of each pass, never '
            + 'mid-stride: when n is 9 the loop is admitted once more, and n strides to '
            + '12 — past the wall. Four passes run (n becomes 3, 6, 9, 12). A counter '
            + 'stops ON the boundary only when its strides happen to land there.',
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
        workedExample: {
          intro: 'The Codex keeps another watcher’s transcription, taken at a '
            + 'different door in a steadier hour: five empty galleries called in '
            + 'order, a count falling by fives, and a four-rune word found cut into '
            + 'the floor. Mark the walls he never touches — his first range ends at '
            + '7, and his downward march carries all three numbers.',
          code: py`for n in range(3, 8):
    print(f"Gallery {n} is empty.")

for n in range(20, 0, -5):
    print(n)

for rune in "warg":
    print(rune)`,
          outro: 'Three processions, three shapes: a bounded walk, a negative stride, '
            + 'a word taken letter by letter. Your muster wants the same three shapes '
            + 'wearing different numbers. His page returns to the binding; write your own.',
        },
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

      extras: [
        {
          id: 'a2l2x1',
          kind: 'echo',
          title: 'The Levels and the Knells',
          prompt: 'Below the second hall the levels must be sounded, and then the old '
            + 'bell rope pulled — it still answers, at intervals of three.\n\n'
            + 'Write a program with two movements, in this order:\n\n'
            + '- Using a `for` loop and `range(2, 7)`, print `Level 2 is silent.` through `Level 6 is silent.` — five lines.\n'
            + '- Using a `for` loop and a `range` that counts *down by threes*, print the numbers `12`, `9`, `6`, `3`, each on its own line.\n\n'
            + 'Nine lines in all.',
          starter: py`# Two movements: the silent levels, then the knells.

# TODO 1: range(2, 7) -> print f"Level {n} is silent."

# TODO 2: a range that tolls 12, 9, 6, 3 -> print each number
`,
          solution: py`for n in range(2, 7):
    print(f"Level {n} is silent.")

for n in range(12, 0, -3):
    print(n)`,
          hints: [
            'range(2, 7) walks 2, 3, 4, 5, 6 -- the stop is a wall, never a member. One loop, one print.',
            'The knells need all three numbers: range(12, 0, -3) -- start at 12, step by -3, stop anywhere past 3 (0 serves). Print the loop variable bare.',
          ],
          validation: py`lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert len(lines) == 9, f"The deep heard {len(lines)} lines, not 9 (five levels + four knells)."
assert lines[0] == "Level 2 is silent." and lines[4] == "Level 6 is silent.", "The levels run 2 through 6, each announcing: Level N is silent."
assert "Level 1" not in _stdout and "Level 7" not in _stdout, "Only levels 2 through 6 are sounded. Check the start and stop of your first range."
assert lines[5:9] == ["12", "9", "6", "3"], "The knells must toll exactly 12, 9, 6, 3 -- a range starting at 12 with a step of -3."`,
          successText: 'Five silences and four knells, in perfect order. Something below has learned your rhythm.',
          xp: 20,
        },
        {
          id: 'a2l2x2',
          kind: 'echo',
          title: 'The Word in the Arch',
          prompt: 'A single word is scratched into the eastern arch, and beneath it a '
            + 'line of even-numbered tally marks. Read both back to the dark.\n\n'
            + 'Write a program that:\n\n'
            + '- Using a `for` loop over the string `"bane"`, prints each of its four letters on its own line.\n'
            + '- Using a `for` loop and a three-number `range`, prints the even numbers from `2` to `10` (2, 4, 6, 8, 10), each on its own line.\n\n'
            + 'Nine lines in all.',
          starter: py`# First the word, letter by letter. Then the even marks, 2 through 10.
`,
          solution: py`for letter in "bane":
    print(letter)

for n in range(2, 11, 2):
    print(n)`,
          hints: [
            'A string is a procession of characters: for letter in "bane": hands you each one in turn -- print the loop variable.',
            'To include 10, the wall must stand past it: range(2, 11, 2). The stop is never touched, so 11 lets 10 through.',
          ],
          validation: py`lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert len(lines) == 9, f"The arch heard {len(lines)} lines, not 9 (four letters + five even marks)."
assert lines[0:4] == ["b", "a", "n", "e"], "The word must be spelled b, a, n, e -- loop over the string itself and print each letter."
assert lines[4:9] == ["2", "4", "6", "8", "10"], "The marks must run 2, 4, 6, 8, 10 -- start at 2, step by 2, and stop PAST 10 (11 serves)."`,
          successText: 'The word hangs in the air a moment longer than your voice should allow.',
          xp: 15,
        },
      ],

      trace: [
        {
          id: 'a2l2t1',
          code: py`for n in range(10, 4, -2):
    print(n)`,
          q: 'The scrying: what does this working print?',
          options: [
            '10\n8\n6\n4',
            '10\n8\n6',
            'Nothing — a range cannot walk downward',
            '10\n9\n8\n7\n6\n5',
          ],
          answer: 1,
          explain: 'A negative step walks down perfectly well: 10, 8, 6. The next stride '
            + 'lands on 4 — the stop, which is never included, descending or not. The '
            + 'last option forgets the step entirely and shuffles down by ones.',
        },
        {
          id: 'a2l2t2',
          code: py`total = 0
for n in range(1, 5):
    total += n
print(total)`,
          q: 'The scrying: what does this working print?',
          options: [
            '15',
            '6',
            '0',
            '10',
          ],
          answer: 3,
          explain: 'range(1, 5) yields 1, 2, 3, 4 — never the stop — and their sum is 10. '
            + 'The answer 15 lets the 5 in; 6 stops a stride too early (1+2+3); 0 forgets '
            + 'that the loop body runs at all, gathering as it goes.',
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
        {
          heading: 'Autopsy: the box that never was',
          body: 'You may believe, by now, that a variable is a **box** — that '
            + '`roll = ["Balin", "Oin"]` puts a list inside a box named `roll`, and that '
            + '`watch = roll` fills a second box with a copy of its own. The belief has '
            + 'served you since your first line of Act I. The Codex keeps its failed '
            + 'models preserved in jars, and it opens this one here, where it dies.\n\n'
            + 'If the box-model were true, the working below would print `2` — only the '
            + 'second box grew — and then `False`, two boxes being two separate things. '
            + 'Commit to that prediction before you read past the code:',
          code: py`roll = ["Balin", "Oin"]
watch = roll                  # a second box, holding a copy?
watch.append("Ori")
print(len(roll))              # the box-model predicts: 2
print(watch is roll)          # ...and predicts: False
print(id(watch) == id(roll))  # every object bears one serial number`,
          note: 'It prints `3`, then `True`, then `True`. The box-model is wrong twice, '
            + 'and the truth is this: **names bind to objects; assignment copies the '
            + 'binding, never the object.** There is exactly one list here wearing two '
            + 'name-tags — `is` confirms it, and `id()`, the object’s serial number, '
            + 'agrees. A change made through either name is seen through both, because '
            + 'there is no "both". To truly copy a roll, say so deliberately: '
            + '`watch = roll[:]` or `watch = list(roll)`. Honor the dead model as you '
            + 'jar it: through all of Act I it never lied to you, for numbers and '
            + 'strings are never changed in place, only replaced — binding and copying '
            + 'looked identical until tonight, at the first vessel that can change.',
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
          + '- Prints `lost`, then prints `len(company)` on its own line — it should output `5` — then prints `company[-1]` on its own line: the last name on the roll, fetched by negative index.\n\n'
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
        workedExample: {
          intro: 'The Codex opens the pack-master’s leaf. He kept the train’s roll to '
            + 'the very door of the deep, and his rites are your rites wearing humbler '
            + 'names. Watch each one land: append at the rear, insert shoving '
            + 'everything behind it one place down, remove striking a value, pop '
            + 'taking an index — and handing back what it took.',
          code: py`train = ["pony", "mule", "ox", "goat"]
train.append("hound")
train.insert(1, "ram")
train.remove("ox")
strayed = train.pop(0)
print(strayed)
print(len(train))
print(train[-1])`,
          outro: 'The pop is the rite most hands fumble: it returns the taken thing, '
            + 'and he caught it in a name before the dark could have it. Four beasts '
            + 'stand on his roll; none of them are yours. Keep your own company now, '
            + 'rite for rite, in the ledger’s order.',
        },
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

      extras: [
        {
          id: 'a2l3x1',
          kind: 'echo',
          title: 'The Relic Chest',
          prompt: 'The company’s chest is opened once, at the door of the deep, and '
            + 'everything that enters or leaves it must be accounted for.\n\n'
            + 'Write a program that:\n\n'
            + '- Creates a list named `chest` containing exactly these four relics, in order: `"axe"`, `"lantern"`, `"rope"`, `"horn"`.\n'
            + '- Appends `"map"`.\n'
            + '- Inserts `"key"` at index `2`.\n'
            + '- Removes `"rope"` by value.\n'
            + '- Pops the LAST relic — `.pop()` with no index — and stores what it returns in a variable named `taken`.\n'
            + '- Prints `taken`, then `len(chest)` on its own line, then `chest[0]` on its own line.',
          starter: py`# The chest is opened once. Account for everything.

# TODO: build chest (axe, lantern, rope, horn); append "map"; insert "key" at 2;
# remove "rope"; taken = pop the LAST relic; print taken, len(chest), chest[0]
`,
          solution: py`chest = ["axe", "lantern", "rope", "horn"]
chest.append("map")
chest.insert(2, "key")
chest.remove("rope")
taken = chest.pop()
print(taken)
print(len(chest))
print(chest[0])`,
          hints: [
            '.append adds at the end, .insert(2, "key") pushes in at index 2, .remove strikes a value by name -- and .pop() with empty parentheses takes the LAST thing in the chest, handing it back.',
            'The rites in order: chest.append("map"), chest.insert(2, "key"), chest.remove("rope"), taken = chest.pop() -- then print taken, len(chest), and chest[0].',
          ],
          validation: py`assert isinstance(chest, list), "chest must be a list -- square brackets, four relics to start."
assert chest == ["axe", "lantern", "key", "horn"], f"The chest holds {chest} -- expected ['axe', 'lantern', 'key', 'horn']. Walk the rites in order: build, append, insert at 2, remove, pop the last."
assert taken == "map", "pop() with no index takes the LAST relic -- catch what it returns in a variable named taken."
lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert len(lines) >= 3, "Three lines must be printed: what was taken, the count, the first relic."
assert lines[0] == "map", "The first printed line must be taken -- the ledger records what left the chest."
assert lines[1] == "4", "The second printed line must be len(chest) -- four relics remain."
assert lines[2] == "axe", "The third printed line must be chest[0] -- the first relic, still in its place."`,
          successText: 'Four relics, one taken, all accounted for. The dark audits carelessness at unkind rates.',
          xp: 20,
        },
        {
          id: 'a2l3x2',
          kind: 'echo',
          title: 'Vanguard and Rearguard',
          prompt: 'The marching order is fixed and must not be disturbed — but the '
            + 'watch-captain wants copies: who walks at the front, who guards the rear.\n\n'
            + 'The starter gives you `line`. Write a program that:\n\n'
            + '- Builds `vanguard` — the FIRST two names, cut with a slice.\n'
            + '- Builds `rearguard` — the LAST two names, cut with a slice built on negative indexes.\n'
            + '- Prints `vanguard`, then `rearguard`, then `line[3]` on its own line, then `len(line)` on its own line — which must still be `6`: a slice copies, it does not wound.',
          starter: py`# The marching order. Cut copies; wound nothing.
line = ["Gandalf", "Aragorn", "Sam", "Frodo", "Legolas", "Gimli"]

# TODO: vanguard = first two (slice); rearguard = last two (negative slice);
# print vanguard, rearguard, line[3], len(line)
`,
          solution: py`line = ["Gandalf", "Aragorn", "Sam", "Frodo", "Legolas", "Gimli"]
vanguard = line[:2]
rearguard = line[-2:]
print(vanguard)
print(rearguard)
print(line[3])
print(len(line))`,
          hints: [
            'A slice that omits its start begins at the front: line[:2]. Negative indexes slice too: line[-2:] runs from the second-from-last to the end.',
            'Four prints, in order: print(vanguard), print(rearguard), print(line[3]), print(len(line)). The slices copied; the line still holds six.',
          ],
          validation: py`assert vanguard == ["Gandalf", "Aragorn"], f"vanguard reads {vanguard} -- it must be the first two, cut with a slice such as line[:2]."
assert rearguard == ["Legolas", "Gimli"], f"rearguard reads {rearguard} -- the last two, cut with negative indexes: line[-2:]."
assert line == ["Gandalf", "Aragorn", "Sam", "Frodo", "Legolas", "Gimli"], "The line itself has been disturbed -- a slice is a copy; the original must be untouched."
lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert len(lines) >= 4, "Four lines must be printed: the vanguard, the rearguard, the fourth walker, the count."
assert lines[0] == "['Gandalf', 'Aragorn']", "The first printed line must be the vanguard list itself."
assert lines[1] == "['Legolas', 'Gimli']", "The second printed line must be the rearguard list itself."
assert lines[2] == "Frodo", "The third printed line must be line[3] -- indexes count from 0, so the fourth walker is Frodo."
assert lines[3] == "6", "The last printed line must be len(line): all six still march."`,
          successText: 'The captain takes the copies. The line marches on, unwounded and unaware.',
          xp: 20,
        },
        {
          id: 'a2l3x3',
          kind: 'cursed',
          title: 'The Posting-Rite',
          prompt: 'A scroll from the Second Hall, found still warm beside its keeper. '
            + 'Its rite posts the mustered watch to their stations, and it runs without '
            + 'a single error — yet the hall stands half-guarded. Six names were '
            + 'mustered last night; the rite swears it walked the whole roll, but only '
            + 'three dwarves stand at their posts, and the other three swear no one '
            + 'ever called them. No exception. No warning. Just a watch that comes '
            + 'back short.\n\n'
            + 'Mend the rite **in place** — the wound is one line. When it is healed, '
            + '`post_the_watch` must return EVERY mustered name, in muster order, and '
            + 'must leave the muster list itself empty.',
          starter: py`# THE POSTING-RITE -- found among the last keeper's effects.
# It runs clean and it lies. Mend it IN PLACE; do not rewrite it from nothing.

def post_the_watch(muster):
    # Move every name from the muster to its post, in order.
    # When the rite ends, the muster must be empty: everyone posted.
    posted = []
    for name in muster:
        posted.append(name)
        muster.remove(name)
    return posted

watch = ["Balin", "Frar", "Loni", "Nali", "Ori", "Floi"]
posted = post_the_watch(watch)
print(f"{len(posted)} stand at their posts")
print(f"{len(watch)} names were never called")`,
          solution: py`# THE POSTING-RITE -- mended.

def post_the_watch(muster):
    # Move every name from the muster to its post, in order.
    # When the rite ends, the muster must be empty: everyone posted.
    posted = []
    for name in muster[:]:      # walk a COPY; strike from the original
        posted.append(name)
        muster.remove(name)
    return posted

watch = ["Balin", "Frar", "Loni", "Nali", "Ori", "Floi"]
posted = post_the_watch(watch)
print(f"{len(posted)} stand at their posts")
print(f"{len(watch)} names were never called")`,
          hints: [
            'Make the rite confess before you cut: put print(name, muster) as the first line inside the loop and run it. Count how many names the loop actually greets, and watch what the muster looks like while it is being walked.',
            'You are trusting the loop to walk the muster as it stood when the loop began. It does not. A for loop reads the LIVING list by position, and every .remove shifts what remains one place left -- the next name steps into the struck one’s place, and the loop strides straight over it.',
            'Never mutate the procession you are walking. Walk a copy and strike from the original -- for name in muster[:]: -- or drain the list with while muster: posted.append(muster.pop(0)). Either mend is lawful; the loop head is the wounded line.',
          ],
          validation: py`squad = ["Oin", "Nain", "Frar", "Frar"]
got = post_the_watch(squad)
assert got == ["Oin", "Nain", "Frar", "Frar"], f"A muster of four posted {got} -- every name must be posted, in muster order. The rite still skips whoever follows a struck name."
assert squad == [], f"The muster still holds {squad} -- when the rite ends, every name must have been struck from it."
lone = ["Durin"]
assert post_the_watch(lone) == ["Durin"] and lone == [], "A muster of one: the single name must be posted and the muster left empty."
none_mustered = []
assert post_the_watch(none_mustered) == [], "An empty muster posts no one -- and must not raise."
lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert "6 stand at their posts" in lines, "The scroll's own casting must report: 6 stand at their posts"
assert "0 names were never called" in lines, "The scroll's own casting must report: 0 names were never called"`,
          successText: 'The rite is mended, and the bug has its true name — mutation while iterating: strike from a list while walking it, and the walk skips whoever steps into the struck one’s place.',
          xp: 30,
        },
      ],

      trace: [
        {
          id: 'a2l3t1',
          code: py`roll = ["Balin", "Oin"]
watch = roll
watch.append("Ori")
print(len(roll))
print(watch is roll)`,
          q: 'The scrying: what does this working print?',
          options: [
            '2\nFalse',
            '3\nTrue',
            '2\nTrue',
            '3\nFalse',
          ],
          answer: 1,
          explain: 'The autopsy’s law: names bind to objects, and assignment copies the '
            + 'binding, never the object. watch and roll are two name-tags on ONE list, '
            + 'so the append is seen through both names (3) and `is` confirms a single '
            + 'object (True). The box-model answers 2 and False — wrong twice.',
        },
        {
          id: 'a2l3t2',
          code: py`line = ["Gandalf", "Aragorn", "Legolas", "Gimli"]
rear = line[1:3]
rear.append("Frodo")
print(rear)
print(len(line))`,
          q: 'The scrying: what does this working print?',
          options: [
            "['Aragorn', 'Legolas', 'Frodo']\n4",
            "['Aragorn', 'Legolas', 'Gimli', 'Frodo']\n4",
            "['Aragorn', 'Legolas', 'Frodo']\n5",
            "['Legolas', 'Gimli', 'Frodo']\n4",
          ],
          answer: 0,
          explain: 'A slice is a COPY: line[1:3] takes indexes 1 and 2 — the stop is a '
            + 'wall — giving a new list that grows to three when Frodo joins, while the '
            + 'original still holds four. The second option lets the stop in; the third '
            + 'imagines the slice aliasing the original; the fourth counts positions '
            + 'from 1 instead of 0.',
        },
      ],
    },

    // ----------------------------------------------------------
    // a2l4 — tuples
    // ----------------------------------------------------------
    {
      id: 'a2l4',
      title: 'Cut in Stone',
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
        workedExample: {
          intro: 'This page is cut, not written — the work of an apprentice who '
            + 'carved a waymarker before the bridge took him. One tuple, made once. '
            + 'One unpacking, counts matched. Two lines built from the parts. And at '
            + 'the close, two lamps exchanged in a single line, with no third hand to '
            + 'steady them.',
          code: py`marker = ("Nain", "keeper of the forge", 2990)
name, office, year = marker
print(f"{name}, {office}")
print(f"Lost in the year {year}")

east_lamp = "lit"
west_lamp = "dark"
east_lamp, west_lamp = west_lamp, east_lamp
print(east_lamp)
print(west_lamp)`,
          outro: 'Mark the swap before you go: the right side packs the old values '
            + 'into a tuple before the left side takes anything, so nothing is '
            + 'overwritten unread. His stone stands finished. Yours is still blank — '
            + 'go cut it, and measure twice.',
        },
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

      extras: [
        {
          id: 'a2l4x1',
          kind: 'echo',
          title: 'The Second Stone',
          prompt: 'Another slab waits in the Chamber of Records, and the chisel is '
            + 'still warm from the first.\n\n'
            + 'Write a program that:\n\n'
            + '- Creates a tuple named `stone` holding exactly these three values, in order: `"Frar"`, `"warden of the bridge"`, `2989`.\n'
            + '- Unpacks `stone` into three variables named `name`, `rank`, and `year`, in a single line.\n'
            + '- Prints one line, exactly: `Frar, warden of the bridge` — built from `name` and `rank`.\n'
            + '- Prints a second line, exactly: `Taken in the year 2989` — built from `year`, not retyped.\n'
            + '- The two watches below stand at the wrong doors: swaps `gate_watch` and `deep_watch` in ONE line, with tuple packing — no third variable.\n'
            + '- Prints `gate_watch`, then `deep_watch`, each on its own line.',
          starter: py`# A second stone. Cut once; read forever.
gate_watch = "Nali"
deep_watch = "Loni"

# TODO: stone = the three values; unpack into name, rank, year;
# print the two carved lines; swap the watches in one line; print both
`,
          solution: py`gate_watch = "Nali"
deep_watch = "Loni"

stone = ("Frar", "warden of the bridge", 2989)
name, rank, year = stone
print(f"{name}, {rank}")
print(f"Taken in the year {year}")
gate_watch, deep_watch = deep_watch, gate_watch
print(gate_watch)
print(deep_watch)`,
          hints: [
            'Carve, then read: stone = ("Frar", "warden of the bridge", 2989) and name, rank, year = stone -- three names on the left for three parts, in order.',
            'The swap needs no third hand: gate_watch, deep_watch = deep_watch, gate_watch. Python packs the right side before it touches the left.',
          ],
          validation: py`assert isinstance(stone, tuple), "stone must be a tuple -- parentheses, not square brackets. The stone does not bend."
assert stone == ("Frar", "warden of the bridge", 2989), f"The stone reads {stone} -- it must be exactly ('Frar', 'warden of the bridge', 2989)."
assert name == "Frar" and rank == "warden of the bridge" and year == 2989, "Unpack stone into name, rank, year in one line -- each takes its part, in order."
assert gate_watch == "Loni" and deep_watch == "Nali", "The watches still stand at the wrong doors -- swap them in ONE line: gate_watch, deep_watch = deep_watch, gate_watch"
lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert "Frar, warden of the bridge" in lines, "The first carved line must read exactly: Frar, warden of the bridge"
assert "Taken in the year 2989" in lines, "The second carved line must read exactly: Taken in the year 2989 -- built from the year variable."
assert lines[-2:] == ["Loni", "Nali"], "The last two printed lines must be the swapped watches: Loni, then Nali."`,
          successText: 'The stone takes the words, and the doors take their proper wards. Neither will move again.',
          xp: 20,
        },
        {
          id: 'a2l4x2',
          kind: 'echo',
          title: 'The Marker in the Third Hall',
          prompt: 'A waymarker must be recorded before the descent: where it stands, '
            + 'and how deep. And one name must be carved alone — mind the comma.\n\n'
            + 'Write a program that:\n\n'
            + '- Creates a tuple named `post` by PACKING two values — `"third hall"` and `21` — the commas do the work; parentheses are optional.\n'
            + '- Unpacks `post` into `hall` and `depth` in one line.\n'
            + '- Prints exactly: `The marker stands in the third hall` — built from `hall` with an f-string.\n'
            + '- Prints exactly: `21 fathoms down` — built from `depth`.\n'
            + '- Creates `lone` — a tuple holding ONLY the value `"Durin"` — and prints `len(lone)` on its own line.',
          starter: py`# One marker, one depth, one name carved alone.
`,
          solution: py`post = "third hall", 21
hall, depth = post
print(f"The marker stands in the {hall}")
print(f"{depth} fathoms down")
lone = ("Durin",)
print(len(lone))`,
          hints: [
            'Packing is the commas: post = "third hall", 21. Unpacking mirrors it: hall, depth = post.',
            'A one-value tuple keeps its comma: lone = ("Durin",). Without the comma the parentheses are mere grouping, and you have carved nothing but a string.',
          ],
          validation: py`assert isinstance(post, tuple) and post == ("third hall", 21), f"post reads {post!r} -- pack exactly 'third hall' and 21, in that order; the commas do the work."
assert hall == "third hall" and depth == 21, "Unpack post into hall and depth in one line: hall, depth = post"
assert isinstance(lone, tuple), "lone must be a tuple -- without its trailing comma, ('Durin') is only a string in parentheses."
assert len(lone) == 1 and lone[0] == "Durin", f"lone reads {lone!r} -- a tuple of exactly ONE value: ('Durin',)."
lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert "The marker stands in the third hall" in lines, "The first line must read exactly: The marker stands in the third hall"
assert "21 fathoms down" in lines, "The second line must read exactly: 21 fathoms down -- built from depth."
assert lines[-1] == "1", "The last printed line must be len(lone) -- one value, one member: 1."`,
          successText: 'The marker is fixed, and the lone name keeps its comma like a held breath.',
          xp: 15,
        },
      ],

      trace: [
        {
          id: 'a2l4t1',
          code: py`tomb = ("Balin", "Fundin", "Nain", "Durin")
print(tomb[-2])
print(tomb[1])`,
          q: 'The scrying: what does this working print?',
          options: [
            'Fundin\nNain',
            'Nain\nBalin',
            'Nain\nFundin',
            'An IndexError — indexes cannot be negative',
          ],
          answer: 2,
          explain: 'Negative indexes count backward from the end: -1 is Durin, so -2 is '
            + 'Nain. Forward indexes count from 0, so tomb[1] is Fundin, the SECOND '
            + 'name — the option answering Balin counts from 1. Python permits negative '
            + 'indexes precisely so you need not know the length first.',
        },
        {
          id: 'a2l4t2',
          code: py`oath = ("stone", "silence", "iron")
print(oath[0])
oath[2] = "gold"
print(oath)`,
          q: 'The scrying: what becomes of this working?',
          options: [
            "It prints stone, then ('stone', 'silence', 'gold')",
            "It prints stone, then ('stone', 'silence', 'iron') — the change is ignored",
            'Nothing — Python refuses the program before any line runs',
            'It prints stone — then dies of a TypeError: a tuple cannot be assigned to',
          ],
          answer: 3,
          raises: 'TypeError',
          explain: 'Python runs top to bottom, so the first print speaks before anything '
            + 'goes wrong — then the item assignment raises TypeError, because tuples do '
            + 'not bend. Nothing is ever silently ignored, and this is a runtime death, '
            + 'not a refusal: the program is legal to read, fatal to run.',
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
            + '— Python’s special value meaning *nothing here* — when the key is '
            + 'absent, and `book.get("Nain", "unrecorded")` returns your chosen '
            + 'default instead. No error either way.\n\n'
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
        {
          heading: 'Dissection: the closing of a register',
          body: 'Ten lines, read as the machine reads them — every binding, every '
            + 'mutation, every spoken word, in order.\n\n'
            + '- **Line 1** builds a two-entry register and binds the name `fates` to it: Balin and Ori, both alive.\n'
            + '- **Line 2** writes through an existing key: Balin’s value becomes `"fallen"`. His fate changes; his place in the order does not.\n'
            + '- **Line 3** writes through a key the register lacks, so a page is added at the end: Floi, lost. Three entries now.\n'
            + '- **Line 4** tears out Ori entirely, key and value. Two entries remain: Balin, then Floi.\n'
            + '- **Line 5** asks after Oin with `.get`. Oin is absent, so the default is handed back and `report` binds to `"unrecorded"`. The register itself is untouched — `.get` never writes.\n'
            + '- **Line 6** prints `unrecorded`.\n'
            + '- **Line 7** prints `2`.\n'
            + '- **Lines 8–9** walk `.items()` in insertion order, printing `Balin: fallen`, then `Floi: lost`.\n'
            + '- **Line 10** prints `False`: `in` examines keys, and `"lost"` lives among the values, where `in` never looks.\n\n'
            + 'Now hold the working still and turn it. What would change if line 5 '
            + 'used square brackets — `fates["Oin"]`? The program would die of a '
            + 'KeyError before a single line was spoken, for nothing has printed yet '
            + 'when the lookup fails. And what would change if line 4 ran twice? The '
            + 'second `del` would find no Ori to tear out and raise a KeyError of its '
            + 'own — deletion, unlike a set’s `.discard`, keeps no silence for the absent.',
          code: py`fates = {"Balin": "alive", "Ori": "alive"}
fates["Balin"] = "fallen"
fates["Floi"] = "lost"
del fates["Ori"]
report = fates.get("Oin", "unrecorded")
print(report)
print(len(fates))
for name, fate in fates.items():
    print(f"{name}: {fate}")
print("lost" in fates)`,
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
        workedExample: {
          intro: 'The Book of Mazarbul is not the only register the Codex remembers. '
            + 'This leaf kept the armory, in a script gone brown at the edges: three '
            + 'entries built at one stroke, one rewritten through its own key, one '
            + 'added by the same syntax, one torn out with `del` — then the safe '
            + 'question, and the full reading in the register’s own order.',
          code: py`armory = {"axes": "kept", "shields": "kept", "spears": "kept"}
armory["axes"] = "spent"
armory["torches"] = "spent"
del armory["spears"]
print(armory.get("mail", "unlisted"))
for item, state in armory.items():
    print(f"{item}: {state}")`,
          outro: 'One syntax reads and writes alike: brackets on a known key rewrite '
            + 'it, on an unknown key add it — and only `.get` asks without the risk '
            + 'of waking a KeyError. The armory closed long ago. Your book lies open, '
            + 'waiting on its keeper.',
        },
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

      extras: [
        {
          id: 'a2l5x1',
          kind: 'echo',
          title: 'The Ledger of the Gates',
          prompt: 'The Book of Mazarbul is not the only register in the deep. The '
            + 'gate-ledger tracks every door the hold still claims, and keeping it '
            + 'current has just become your duty too.\n\n'
            + 'Write a program that:\n\n'
            + '- Creates a dict named `gates` with exactly these three entries, in this order: `"west gate"` mapped to `"open"`, `"east gate"` mapped to `"open"`, `"north stair"` mapped to `"open"`.\n'
            + '- Rewrites the entry for `"west gate"` to `"sealed"`.\n'
            + '- Adds a new entry: `"deep gate"` mapped to `"sealed"`.\n'
            + '- Deletes the `"north stair"` entry entirely, with `del`.\n'
            + '- Asks the ledger safely about `"south door"` using `.get()` with the default `"unknown"`, and prints the answer.\n'
            + '- Loops over `gates.items()` and prints one line per entry in the form `name: state`.\n\n'
            + 'Four printed lines: the safe answer, then the three doors in the ledger’s own order.',
          starter: py`# The gate-ledger. What it does not record, the hold does not hold.

# TODO: build gates (three entries); reseal the west; add the deep gate;
# del the north stair; print gates.get("south door", "unknown");
# then print every entry as  name: state
`,
          solution: py`gates = {"west gate": "open", "east gate": "open", "north stair": "open"}
gates["west gate"] = "sealed"
gates["deep gate"] = "sealed"
del gates["north stair"]
print(gates.get("south door", "unknown"))
for name, state in gates.items():
    print(f"{name}: {state}")`,
          hints: [
            'Build once with braces, then edit: square brackets rewrite an existing key or add a new one, and del gates["north stair"] tears the page out.',
            'The safe question is gates.get("south door", "unknown") -- and the reading is for name, state in gates.items(): print(f"{name}: {state}").',
          ],
          validation: py`assert isinstance(gates, dict), "gates must be a dictionary -- curly braces binding each door to a state."
assert "north stair" not in gates, "The north stair page must be torn out with del, not rewritten."
assert gates == {"west gate": "sealed", "east gate": "open", "deep gate": "sealed"}, f"The ledger reads {gates} -- expected west gate: sealed, east gate: open, deep gate: sealed, and no page for the north stair."
lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert "unknown" in lines, "Ask after the south door with .get and the default 'unknown', and print what the ledger answers."
assert lines[-3:] == ["west gate: sealed", "east gate: open", "deep gate: sealed"], "The three doors must be read in the ledger's own order -- west, east, deep -- by looping over gates.items()."`,
          successText: 'Three doors, three verdicts, and one question the ledger could not answer. Yet.',
          xp: 20,
        },
        {
          id: 'a2l5x2',
          kind: 'echo',
          title: 'The Ration Count',
          prompt: 'The stores must be counted against the winter below. Entries are '
            + 'not only written and torn — they are *re-reckoned*, each new value '
            + 'computed from the old one.\n\n'
            + 'Write a program that:\n\n'
            + '- Creates a dict named `stores` with exactly these entries, in this order: `"grain"` mapped to `40`, `"oil"` mapped to `12`, `"salt"` mapped to `9`.\n'
            + '- The third deep draws its share: rewrites `"grain"` to its CURRENT value minus `15` — read the old value in the same line that stores the new.\n'
            + '- Adds a new entry: `"waybread"` mapped to `6`.\n'
            + '- Prints `len(stores)`, then prints whether `"oil"` is `in` `stores` (it should print `True`).\n'
            + '- Loops over `stores.items()` and prints one line per entry in the form `name: count` — for example `oil: 12`.\n\n'
            + 'Six printed lines in all.',
          starter: py`# The winter count. The deep draws first; the ledger records all.

# TODO: build stores; grain loses 15 (computed, not retyped); add waybread -> 6;
# print len(stores), then "oil" in stores, then every entry as  name: count
`,
          solution: py`stores = {"grain": 40, "oil": 12, "salt": 9}
stores["grain"] = stores["grain"] - 15
stores["waybread"] = 6
print(len(stores))
print("oil" in stores)
for name, count in stores.items():
    print(f"{name}: {count}")`,
          hints: [
            'A value is rewritten through its own reading: stores["grain"] = stores["grain"] - 15 -- the right side reads the old number before the left side stores the new.',
            'Then print(len(stores)), print("oil" in stores), and the items() loop printing f"{name}: {count}" for each entry.',
          ],
          validation: py`assert isinstance(stores, dict), "stores must be a dictionary -- braces, each provision bound to its count."
assert stores.get("grain") == 25, f"grain reads {stores.get('grain')} -- it must be re-reckoned from its own value: 40 minus the deep's 15 is 25."
assert stores == {"grain": 25, "oil": 12, "salt": 9, "waybread": 6}, f"The stores read {stores} -- expected grain: 25, oil: 12, salt: 9, waybread: 6."
lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert len(lines) == 6, f"The count spoke {len(lines)} lines, not 6 -- the size, the oil question, and four entries."
assert lines[0] == "4", "The first printed line must be len(stores) -- four provisions after the additions."
assert lines[1] == "True", "The second line asks whether 'oil' is in stores -- in examines keys, and it should answer True."
assert lines[2:] == ["grain: 25", "oil: 12", "salt: 9", "waybread: 6"], "Read every entry in the ledger's own order: name, colon, space, count."`,
          successText: 'The winter is counted. Whether it is survivable is a different ledger.',
          xp: 20,
        },
      ],

      trace: [
        {
          id: 'a2l5t1',
          code: py`book = {"Ori": "alive", "Balin": "alive"}
book["Balin"] = "fallen"
book["Floi"] = "lost"
for name in book:
    print(name)`,
          q: 'The scrying: what does this working print?',
          options: [
            'Ori\nBalin\nFloi',
            'Balin\nFloi\nOri',
            'alive\nfallen\nlost',
            'Ori\nBalin\nBalin\nFloi',
          ],
          answer: 0,
          explain: 'A dict keeps INSERTION order: Ori was written first, Balin second — '
            + 'and rewriting Balin changes his fate, never his place, one entry per key. '
            + 'Floi, the only new key, joins at the end. Dicts never alphabetize, and '
            + 'looping one bare yields KEYS, not values — the fates go unspoken.',
        },
        {
          id: 'a2l5t2',
          code: py`fates = {"Balin": "fallen"}
print(fates.get("Balin", "unrecorded"))
print(fates.get("Oin"))
print(len(fates))`,
          q: 'The scrying: what does this working print?',
          options: [
            'fallen\nunrecorded\n1',
            'unrecorded\nNone\n1',
            'fallen\nNone\n1',
            'fallen\nA KeyError is raised for Oin',
          ],
          answer: 2,
          explain: 'When the key exists, .get returns the stored value and the default is '
            + 'never consulted; when it is missing and no default was given, .get answers '
            + 'None. It NEVER raises — that is square-bracket lookup’s violence — and it '
            + 'never writes: the book still holds one page. The first option imagines the '
            + 'earlier default carrying over to a later question.',
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
            + 'Because sets promise no order, display them predictably with '
            + '**`sorted(iterable)`** — a built-in that takes any collection Python can '
            + 'walk through and returns a NEW ordered **list**, leaving the set itself '
            + 'untouched. You will study it properly in Act III; here it has one duty: '
            + 'making an unordered tally printable in a fixed order.',
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
        workedExample: {
          intro: 'Before the second hall had a Watcher it had an ore-clerk, and the '
            + 'Codex kept her slate. The hauls came up repeating themselves; she '
            + 'melted them to shapes with `set()`, corrected the tally with one add '
            + 'and one discard, then weighed her shaft against the south with the '
            + 'three operators — `&` for both, `|` for either, `-` for hers alone.',
          code: py`hauls = ["iron", "iron", "silver", "iron", "lead", "silver"]
north_shaft = set(hauls)
north_shaft.add("mithril")
north_shaft.discard("lead")
south_shaft = {"iron", "copper", "mithril"}
shared = north_shaft & south_shaft
every_ore = north_shaft | south_shaft
north_only = north_shaft - south_shaft
print(len(north_shaft))
print(sorted(every_ore))
print("mithril" in shared)
print(sorted(north_only))`,
          outro: 'Note where she leaned on `sorted()`: a set promises no order, and a '
            + 'clerk who prints one bare is trusting the dark to be tidy. Her ores '
            + 'are not your horrors, but the weighing is the same weighing. Go reduce '
            + 'your own reports to truth.',
        },
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

      extras: [
        {
          id: 'a2l6x1',
          kind: 'echo',
          title: 'The Tally of the Bridge',
          prompt: 'The bridge-watch shouts its sightings down the hall, and fear '
            + 'repeats itself. The stair-watch keeps a cleaner slate. Weigh the two '
            + 'against each other.\n\n'
            + 'The starter gives you `reports` and `stair_watch`. Write a program that:\n\n'
            + '- Builds a set named `bridge_watch` from the `reports` list, collapsing the duplicates.\n'
            + '- Adds `"wight"` to `bridge_watch`.\n'
            + '- Strikes `"bat"` from `bridge_watch` using `.discard()` — that report was withdrawn.\n'
            + '- Builds `both` — the creatures on BOTH slates (intersection).\n'
            + '- Builds `either` — the creatures on EITHER slate (union).\n'
            + '- Builds `bridge_only` — the creatures the bridge alone saw (difference, bridge minus stair).\n'
            + '- Prints four lines, in order: `len(bridge_watch)`, then `sorted(either)`, then `sorted(both)`, then `sorted(bridge_only)`.',
          starter: py`# Raw shouts from the bridge; a clean slate from the stair.
reports = ["orc", "bat", "orc", "wraith", "bat"]
stair_watch = {"orc", "ghoul"}

# TODO: bridge_watch = set of reports; add the wight; discard the bat;
# both / either / bridge_only; print len, sorted either, sorted both, sorted bridge_only
`,
          solution: py`reports = ["orc", "bat", "orc", "wraith", "bat"]
stair_watch = {"orc", "ghoul"}

bridge_watch = set(reports)
bridge_watch.add("wight")
bridge_watch.discard("bat")
both = bridge_watch & stair_watch
either = bridge_watch | stair_watch
bridge_only = bridge_watch - stair_watch
print(len(bridge_watch))
print(sorted(either))
print(sorted(both))
print(sorted(bridge_only))`,
          hints: [
            'set(reports) melts the repetitions on contact; .add and .discard then adjust the slate one shape at a time.',
            'The weighings are operators: & for both, | for either, - for the bridge alone. Print each through sorted() so the unordered slate speaks in a fixed order.',
          ],
          validation: py`assert isinstance(bridge_watch, set), "bridge_watch must be a set -- build it with set(reports)."
assert bridge_watch == {"orc", "wraith", "wight"}, f"The bridge slate holds {sorted(bridge_watch)} -- expected orc, wight, wraith. Dedupe the reports, add the wight, discard the bat."
assert both == {"orc"}, "both must be the intersection of the two slates -- the & operator."
assert either == {"orc", "wraith", "wight", "ghoul"}, "either must be the union of the two slates -- the | operator."
assert bridge_only == {"wraith", "wight"}, "bridge_only must be the difference bridge_watch - stair_watch, in that order."
lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert len(lines) >= 4, "Four lines must be printed: the count, the union, the intersection, the bridge's own."
assert lines[0] == "3", "The first printed line must be len(bridge_watch) -- three shapes."
assert lines[1] == "['ghoul', 'orc', 'wight', 'wraith']", "The second line must be sorted(either), printed as the list it returns."
assert lines[2] == "['orc']", "The third line must be sorted(both) -- only the orc walks on both slates."
assert lines[3] == "['wight', 'wraith']", "The fourth line must be sorted(bridge_only)."`,
          successText: 'Two slates, one truth — and the bridge has seen something the stair has not.',
          xp: 20,
        },
        {
          id: 'a2l6x2',
          kind: 'echo',
          title: 'How Many Shapes',
          prompt: 'Seven crossings were shouted from the causeway last night. The '
            + 'gate-ward’s question is not how many shouts — it is how many *shapes*.\n\n'
            + 'The starter gives you `crossings`. Write a program that:\n\n'
            + '- Builds a set named `distinct` from the `crossings` list.\n'
            + '- Prints `len(crossings)` — every shout, repetitions and all.\n'
            + '- Prints `len(distinct)` — the shapes actually seen.\n'
            + '- Prints whether `"balrog"` is `in` `distinct` (it should print `False`).\n'
            + '- Adds `"balrog"` to `distinct` with `.add()`, then prints `len(distinct)` again.\n\n'
            + 'Four printed lines: `7`, `3`, `False`, `4`.',
          starter: py`# Seven shouts. Fewer shapes. Count both.
crossings = ["orc", "orc", "warg", "orc", "troll", "warg", "orc"]
`,
          solution: py`crossings = ["orc", "orc", "warg", "orc", "troll", "warg", "orc"]
distinct = set(crossings)
print(len(crossings))
print(len(distinct))
print("balrog" in distinct)
distinct.add("balrog")
print(len(distinct))`,
          hints: [
            'The list counts shouts; the set counts shapes. distinct = set(crossings) is the whole first step.',
            'Order matters at the end: ask "balrog" in distinct BEFORE the add, then distinct.add("balrog"), then the new length.',
          ],
          validation: py`assert isinstance(distinct, set), "distinct must be a set -- set(crossings) melts the duplicates."
assert distinct == {"orc", "warg", "troll", "balrog"}, f"After the add, the slate must hold balrog, orc, troll, warg -- it reads {sorted(distinct)}."
lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert len(lines) == 4, f"The ward heard {len(lines)} lines, not 4 -- shouts, shapes, the question, the new count."
assert lines[0] == "7", "First print len(crossings) -- every shout, repetition and all: 7."
assert lines[1] == "3", "Then len(distinct) -- three shapes were ever actually seen."
assert lines[2] == "False", "Ask 'balrog' in distinct BEFORE the add -- the slate should answer False."
assert lines[3] == "4", "After distinct.add('balrog'), the count must be 4."`,
          successText: 'Three shapes became four. The ward does not thank you for the arithmetic.',
          xp: 15,
        },
      ],

      trace: [
        {
          id: 'a2l6t1',
          code: py`marks = ["orc", "warg", "orc", "orc", "warg"]
seen = set(marks)
seen.add("warg")
seen.discard("troll")
print(len(seen))`,
          q: 'The scrying: what does this working print?',
          options: [
            '5',
            '2',
            '3',
            'A KeyError — "troll" was never on the slate',
          ],
          answer: 1,
          explain: 'set(marks) collapses five marks into two shapes: orc and warg. Adding '
            + 'a warg the slate already knows changes nothing, and .discard keeps its '
            + 'silence for the absent troll — it is .remove that answers absence with a '
            + 'KeyError. Two shapes remain.',
        },
        {
          id: 'a2l6t2',
          code: py`west = {"orc", "troll"}
east = {"orc", "warg"}
print(sorted(west & east))
print(sorted(west - east))`,
          q: 'The scrying: what does this working print?',
          options: [
            "['orc', 'troll', 'warg']\n['troll']",
            "['orc']\n['warg']",
            "{'orc'}\n{'troll'}",
            "['orc']\n['troll']",
          ],
          answer: 3,
          explain: '& keeps only what BOTH doors saw — the orc — and - keeps what the '
            + 'west alone saw: the troll, since the difference reads left to right. And '
            + 'sorted() returns a LIST, so the display wears square brackets, not '
            + 'braces. The first option mistakes & for the union |; the second reverses '
            + 'the difference.',
        },
      ],
    },

    // ----------------------------------------------------------
    // a2l7 — comprehensions
    // ----------------------------------------------------------
    {
      id: 'a2l7',
      title: 'The Smith’s One Line',
      concept: 'list comprehensions, filtering with if, dict and set comprehensions, enumerate() and zip()',
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
            + '- The shape is `[expression for item in source]` — the source being a list, a string, or a range: anything Python can walk through.\n'
            + '- Read it aloud as: *build a list of EXPRESSION, for each ITEM in SOURCE*.\n'
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
          note: 'One more fold the smiths permitted: a second `for` clause, read left to '
            + 'right like nested loops. `[f"{hall}{door}" for hall in "AB" for door in "12"]` '
            + 'crosses every hall with every door — A1, A2, B1, B2 — and the same double '
            + 'fold flattens a nested list: `[rune for row in wall for rune in row]` walks '
            + 'each row, then each rune within it. But power tempts. Beyond two fors — or '
            + 'when a comprehension no longer reads aloud in one breath, conditions stacked '
            + 'on conditions — unfold it back into an honest loop. The next reader of your '
            + 'code is usually you, in a worse hour, by a weaker light.',
        },
        {
          heading: 'Walking with numbers, walking in step',
          body: 'Two more built-ins fold common loop labor, and the smiths used both:\n\n'
            + '- `enumerate(items)` walks a source and hands you **two** loop variables '
            + 'per pass: the position and the value, paired — no hand-fed counter to '
            + 'create, feed, or forget. Give it `start=1` to number from 1 instead of 0.\n'
            + '- `zip(a, b)` walks two sources **in step**, pairing first with first, '
            + 'second with second, and stopping the moment the shorter is spent.',
          code: py`names = ["balin", "oin", "ori"]
fates = ["fallen", "fallen", "lost"]

for number, name in enumerate(names, start=1):
    print(f"{number}. {name}")

for name, fate in zip(names, fates):
    print(f"{name} -- {fate}")`,
          note: 'Each pass hands back a pair, and two loop variables unpack it — the '
            + 'same unpacking you cut into the tomb-script. And `zip` keeps no record '
            + 'of the longer source’s leftovers: whatever has no partner goes uncounted.',
        },
        {
          heading: 'Dissection: three folds and a numbered reading',
          body: 'Ten lines, read at the smith’s pace — one line, one consequence.\n\n'
            + '- **Lines 1–2** bind the raw stock: four names, four depths.\n'
            + '- **Line 3** folds a transform: a NEW list of the four names, shouted. `names` is untouched — a fold never wounds its source.\n'
            + '- **Line 4** folds a filter: the gate admits only 26 and 14, in source order, so `risky` is `[26, 14]`.\n'
            + '- **Line 5** folds two sources at once: `zip` pairs each name with its depth, first with first, and the dict fold binds them — four entries.\n'
            + '- **Line 6** prints `OIN`: index 1 is the *second* mark, for the count began at 0.\n'
            + '- **Line 7** prints `[26, 14]`.\n'
            + '- **Line 8** looks up ori’s depth in the new dict and prints `14`.\n'
            + '- **Lines 9–10** walk `enumerate(marks, start=1)`, two loop variables unpacking each pair: `1. BALIN`, `2. OIN`, `3. ORI`, `4. FLOI`.\n\n'
            + 'Now hold it still and turn it. What would change if line 4 demanded '
            + '`d > 30`? The gate would admit nothing, `risky` would be the empty '
            + 'list, and line 7 would print bare brackets — a fold that admits '
            + 'nothing still forges a list. And what would change if `depths` held '
            + 'three numbers instead of four? Line 5’s `zip` would stop with the '
            + 'shorter roll — floi would go unposted, three entries instead of four — '
            + 'while lines 3 and 9–10, which read only `names`, would not change by a '
            + 'single rune.',
          code: py`names = ["balin", "oin", "ori", "floi"]
depths = [9, 26, 14, 3]
marks = [n.upper() for n in names]
risky = [d for d in depths if d > 10]
posted = {n: d for n, d in zip(names, depths)}
print(marks[1])
print(risky)
print(posted["ori"])
for i, m in enumerate(marks, start=1):
    print(f"{i}. {m}")`,
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
        workedExample: {
          intro: 'The smith left more than patterns on the wall. The Codex holds one '
            + 'of his practice-leaves — the same three folds, cut on humbler stock: '
            + 'the transform riding at the front of the bracket, the filter trailing '
            + 'the `for`, and the dict fold keeping its colon between key and value.',
          code: py`ores = ["iron", "silver", "mithril", "lead"]
loads = [6, 19, 2, 44, 13]

stamped = [ore.upper() for ore in ores]
heavy = [x for x in loads if x > 12]
runes_in = {ore: len(ore) for ore in ores}
print(len(stamped))
print(heavy)
print(runes_in["mithril"])`,
          outro: 'Read each fold aloud in one breath — *a list of `ore.upper()`, for '
            + 'each ore in ores* — and notice that no source is ever wounded: every '
            + 'fold forges new metal. His stock goes back on the rack. Yours is '
            + 'waiting, one line each.',
        },
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
        {
          q: 'What does `for n, name in enumerate(["Balin", "Oin"]):` give you on its first pass?',
          options: [
            '`n = 0` and `name = "Balin"`',
            '`n = 1` and `name = "Balin"`',
            '`n = "Balin"` and `name = "Oin"`',
            'An error — a for loop takes only one variable',
          ],
          answer: 0,
          explain: 'enumerate hands back (position, value) pairs, and positions count '
            + 'from 0 unless you pass start=1. The two loop variables unpack each pair '
            + '— the same tuple unpacking used throughout this act.',
        },
      ],

      extras: [
        {
          id: 'a2l7x1',
          kind: 'echo',
          title: 'Patterns for the East Wall',
          prompt: 'The east wall wants patterns of its own, cut in the smiths’ '
            + 'economy: one line each. The starter gives you the raw stock: `runes` '
            + 'and `weights`.\n\n'
            + 'Write a program that:\n\n'
            + '- Builds `lowered` with ONE list comprehension: every rune from `runes`, lowercased with `.lower()`, in the same order.\n'
            + '- Builds `heavy` with ONE list comprehension using an `if`: only the numbers from `weights` greater than `20`, in their original order.\n'
            + '- Builds `first_marks` with ONE dict comprehension: each rune from `runes` mapped to its FIRST character, `rune[0]`.\n'
            + '- Prints three lines, in order: `len(lowered)`, then `heavy` itself, then `first_marks["KHAZAD"]`.',
          starter: py`# The east wall. One line per pattern; the fold is the point.
runes = ["KHAZAD", "DUM", "BARUK"]
weights = [25, 8, 31, 14]
`,
          solution: py`runes = ["KHAZAD", "DUM", "BARUK"]
weights = [25, 8, 31, 14]

lowered = [rune.lower() for rune in runes]
heavy = [w for w in weights if w > 20]
first_marks = {rune: rune[0] for rune in runes}
print(len(lowered))
print(heavy)
print(first_marks["KHAZAD"])`,
          hints: [
            'Each fold is one line: the transform rides at the front ([rune.lower() for ...]), the filter trails the for (if w > 20), and the dict fold keeps a colon between key and value.',
            'The three folds: lowered = [r.lower() for r in runes], heavy = [w for w in weights if w > 20], first_marks = {r: r[0] for r in runes} -- then the three prints.',
          ],
          validation: py`assert lowered == ["khazad", "dum", "baruk"], f"lowered reads {lowered} -- every rune from runes, lowercased, in the same order."
assert heavy == [25, 31], f"heavy reads {heavy} -- keep only the weights greater than 20, in their original order."
assert isinstance(first_marks, dict), "first_marks must be a dict -- braces, with rune: rune[0] inside."
assert first_marks == {"KHAZAD": "K", "DUM": "D", "BARUK": "B"}, f"first_marks reads {first_marks} -- each rune mapped to its FIRST character, rune[0]."
lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert len(lines) >= 3, "Three lines must be printed: the count, the heavy list, the first mark of KHAZAD."
assert lines[0] == "3", "The first printed line must be len(lowered) -- three runes were lowered."
assert lines[1] == "[25, 31]", "The second printed line must be the heavy list itself."
assert lines[2] == "K", "The third printed line must be first_marks['KHAZAD'] -- the single character K."`,
          successText: 'Three patterns, three lines. The wall accepts them without comment, which is how walls approve.',
          xp: 20,
        },
        {
          id: 'a2l7x2',
          kind: 'echo',
          title: 'Numbered and Posted',
          prompt: 'The night watch must be read out twice: once numbered, once '
            + 'posted — and the wall demands the smiths’ economy here too: each roll '
            + 'folded in **one comprehension line** before it is spoken. The starter '
            + 'gives you `names` and `posts` — and there is one more post than there '
            + 'are dwarves left to fill it.\n\n'
            + 'Write a program that:\n\n'
            + '- Builds `numbered` with ONE list comprehension over `enumerate(names, start=1)`: the strings `1. Frar`, `2. Loni`, `3. Nali`, in order.\n'
            + '- Builds `posted` with ONE list comprehension over `zip(names, posts)`: one string per pair in the form `Frar guards the gate`.\n'
            + '- Prints every line of `numbered`, then every line of `posted` — six lines in all; the fourth post goes unguarded, and unspoken.',
          starter: py`# Three dwarves, four posts. Fold each roll in ONE line; say nothing of the gap.
names = ["Frar", "Loni", "Nali"]
posts = ["gate", "bridge", "stair", "well"]

# TODO 1: numbered = one list comprehension over enumerate(names, start=1)
# TODO 2: posted = one list comprehension over zip(names, posts)
# TODO 3: print each numbered line, then each posted line -- six in all
`,
          solution: py`names = ["Frar", "Loni", "Nali"]
posts = ["gate", "bridge", "stair", "well"]

numbered = [f"{n}. {name}" for n, name in enumerate(names, start=1)]
posted = [f"{name} guards the {post}" for name, post in zip(names, posts)]

for line in numbered:
    print(line)
for line in posted:
    print(line)`,
          hints: [
            'A comprehension can unpack pairs just as a loop does: [f"{n}. {name}" for n, name in enumerate(names, start=1)] -- two loop variables inside one fold, no hand-fed counter.',
            'posted folds the same way over zip(names, posts): [f"{name} guards the {post}" for name, post in zip(names, posts)] -- zip stops with the shorter roll. Then print each line of both lists.',
          ],
          validation: py`assert "numbered" in dir(), "The wall finds no numbered. Fold it in one line: a list comprehension over enumerate(names, start=1)."
assert numbered == ["1. Frar", "2. Loni", "3. Nali"], f"numbered reads {numbered} -- one comprehension over enumerate(names, start=1), each entry in the form 1. Frar. Numbering starts at 1."
assert "posted" in dir(), "The wall finds no posted. Fold it in one line: a list comprehension over zip(names, posts)."
assert posted == ["Frar guards the gate", "Loni guards the bridge", "Nali guards the stair"], f"posted reads {posted} -- one comprehension over zip(names, posts), each entry in the form Frar guards the gate. zip pairs first with first."
_live = "\n".join(ln for ln in _source.splitlines() if not ln.lstrip().startswith("#"))
assert any("[" in ln and " for " in ln for ln in _live.splitlines()), "The wall wants the fold itself -- build the rolls as comprehensions, [expression for ... in ...], not an unfolded loop of appends."
lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert len(lines) == 6, f"The reading spoke {len(lines)} lines, not 6 -- three numbered, then three posted."
assert lines[:3] == ["1. Frar", "2. Loni", "3. Nali"], "The numbered reading comes first, one line each: 1. Frar, 2. Loni, 3. Nali."
assert lines[3:] == ["Frar guards the gate", "Loni guards the bridge", "Nali guards the stair"], "The posted reading must follow in step: Frar to the gate, Loni to the bridge, Nali to the stair."
assert "well" not in _stdout, "No one guards the well -- zip pairs only while BOTH rolls last; the leftover post goes unspoken."`,
          successText: 'Three numbered, three posted, and one well left to guard itself. It has managed so far.',
          xp: 20,
        },
      ],

      trace: [
        {
          id: 'a2l7t1',
          code: py`depths = [4, 11, 8, 30]
deep = [d * 2 for d in depths if d > 10]
print(deep)
print(len(depths))`,
          q: 'The scrying: what does this working print?',
          options: [
            '[22, 60]\n4',
            '[8, 22, 16, 60]\n4',
            '[11, 30]\n4',
            '[22, 60]\n2',
          ],
          answer: 0,
          explain: 'The gate admits only 11 and 30, and the expression at the front '
            + 'doubles each as it enters: [22, 60]. The source is never touched — a '
            + 'comprehension builds a NEW list — so depths still holds four. The second '
            + 'option forgets the filter; the third forgets the transform; the fourth '
            + 'imagines the source consumed by the fold.',
        },
        {
          id: 'a2l7t2',
          code: py`names = ["Frar", "Loni", "Nali"]
for n, name in enumerate(names, start=1):
    if n == 2:
        continue
    print(f"{n}. {name}")`,
          q: 'The scrying: what does this working print?',
          options: [
            '1. Frar\n2. Nali',
            '1. Frar\n2. Loni\n3. Nali',
            '1. Frar\n3. Nali',
            '0. Frar\n2. Nali',
          ],
          answer: 2,
          explain: 'enumerate numbers every pass — start=1, so Frar is 1, Loni 2, Nali '
            + '3 — and continue merely silences the second pass; it does not renumber '
            + 'the third. Nali keeps the 3 enumerate gave him. The first and last '
            + 'options imagine the count closing over the gap.',
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

    barks: {
      intro: [
        'I was in the dark before the dark had a name. Your little counts end here.',
        'The drums were a courtesy. This is the bridge, and the bridge is mine.',
      ],
      hit: [
        'Struck. The roll of the fallen gains a letter of your name.',
        'Your count falters. The deep does not.',
        'One more wrong answer and the mountain will not remember you were asked.',
        'The stair taught you nothing it did not teach the dead.',
        'Fire takes the careless first. It is taking its time with you.',
      ],
      playerFail: [
        'Your working cracks like a propped gallery. I have brought down better.',
        'The forge refuses it. The dark would have been less gentle.',
        'Cast and fail, cast and fail — the bridge has outlasted patience older than yours.',
      ],
      lastCandle: [
        'One candle stands between you and my whole night. Guard it.',
        'I have watched cities gutter out. Yours is one flame.',
        'The dark leans close now. It wants to see your last light work.',
      ],
      death: [
        'The bridge breaks... and the deep takes back what was always its own.',
        'I fell before your kind could count. Falling is not ending. We are patient, down here.',
      ],
    },
    premortem: {
      prompt: 'The Warden bars the bridge, and the Codex asks one question before '
        + 'the first blow falls. The Last Page will demand three workings raised in '
        + 'order: a tally counted out of raw reports, a list filtered from that '
        + 'tally, and a fixed procession of printed lines. Which do you forge and '
        + 'prove FIRST?',
      options: [
        'The tally loop — every later movement reads from it, so it must stand before anything is built on it',
        'The printed lines — output is what the ward grades, so print first and fill in the logic after',
        'The filtered list — it is the subtlest line, so take it while your head is clearest',
        'All three at once, then run once at the end — fewer castings means fewer chances to fail',
      ],
      answer: 0,
      explain: 'Forge the foundation and prove it before building upward: the '
        + 'filtered list and every printed line read from the finished tally, so a '
        + 'wound there poisons all three movements. Print-first grades nothing real, '
        + 'the subtlest line still needs data to stand on, and one grand casting at '
        + 'the end leaves you no idea which movement failed.',
    },
  },

  // ----------------------------------------------------------
  // Codex — the act's vocabulary
  // ----------------------------------------------------------
  codex: [
    { term: 'while', def: 'A loop that repeats its indented body for as long as its condition remains `True`, testing before every pass.' },
    { term: 'break / continue', def: '`break` ends the enclosing loop immediately; `continue` abandons only the current pass and returns to the condition for the next.' },
    { term: 'infinite loop', def: 'A `while` loop whose condition never becomes `False`, so it never ends — usually a counter nobody updates.' },
    { term: 'for', def: 'A loop that visits each item of a sequence in turn and stops by itself when the sequence is spent.' },
    { term: 'range()', def: 'Produces a run of numbers from a start (default 0) up to — never including — a stop, moving by a step (default 1).' },
    { term: 'list', def: 'An ordered, changeable collection written in square brackets; the vessel for anything that grows or shrinks.' },
    { term: 'index', def: 'A position number in a sequence, counted from 0; negative indexes count backward from the end.' },
    { term: 'slice', def: 'A copied stretch of a sequence, `seq[start:stop]`, including the start position but never the stop.' },
    { term: '.append()', def: 'Adds one value to the end of a list, changing the list in place.' },
    { term: 'mutation while iterating', def: 'Striking items from a list while a loop walks it: each removal shifts the survivors left, and the walk silently skips whoever steps into the struck one’s place — no error, just a wrong result. Walk a copy (`items[:]`) and mutate the original.' },
    { term: 'tuple', def: 'An immutable sequence written in parentheses: read like a list, but never changed after creation.' },
    { term: 'unpacking', def: 'Splitting a sequence into named variables in one line, as in `name, year = record`; the counts on both sides must match.' },
    { term: 'dictionary', def: 'A collection of key–value pairs in curly braces; values are looked up by key, not by position.' },
    { term: '.get()', def: 'Dictionary lookup that returns a default for a missing key instead of raising a `KeyError`; with no default given it returns `None`, Python’s special value meaning *nothing here*.' },
    { term: 'set', def: 'An unordered collection of unique values; duplicates collapse on entry and membership tests are instant.' },
    { term: 'comprehension', def: 'A one-line expression that builds a list, dict, or set from a loop, optionally filtered by an `if`.' },
  ],
};
