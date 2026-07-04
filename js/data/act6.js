// ============================================================
// act6.js — Act VI: The Hall of Prophecy (The Seer's Data)
// NumPy arrays, boolean masks & aggregation, matplotlib
// figures, pandas ledgers & wrangling, sqlite3 & HTML
// parsing, and the statistics that name outliers.
// ============================================================
const py = String.raw;

export default {
  id: 'act6',
  numeral: 'VI',
  arc: 'The Seer\'s Data',
  title: 'The Hall of Prophecy',
  tagline: 'Shelf upon shelf of glass futures — and every one of them is only a number until you learn to weigh it.',
  sigil: '🔮',
  epigraph: {
    text: 'Count them. Weigh them. Chart them. The future forgives nothing — least of all an unlabeled axis.',
    source: 'standing orders of the Keeper of Prophecies, ninth revision',
  },
  intro: 'Beneath the Ministry, past the last door the lifts admit to, lies the Hall of '
    + 'Prophecy: aisle after aisle of glowing orbs, each one a record, each record a '
    + 'number wearing a name. Five acts of sorcery brought you here. This act teaches '
    + 'you what the Unspeakables actually do all night.\n\n'
    + 'You will command whole shelves at once with **NumPy arrays**, sieve ten thousand '
    + 'readings with a single **boolean mask**, and make numbers confess visually with '
    + '**matplotlib**. You will keep the Ministry’s ledgers of the dead in **pandas** '
    + 'frames — sorting, grouping, and repairing what the clerks left blank. You will '
    + 'interrogate archives that speak only **SQL**, and pry prophecy out of scraped '
    + 'pages with **BeautifulSoup**. Last, you will learn the statistics of honesty — '
    + 'means that lie, medians that do not, and the z-scores that name which orb is '
    + 'screaming. New instruments must be summoned from the dark; the first summoning '
    + 'takes a breath, and after that they answer instantly. Seven trials. Then the '
    + 'Keeper itself.',

  lessons: [

    // ----------------------------------------------------------------
    // a6l1 — numpy arrays: creation, dtype, shape, vectorized math,
    //        2-D indexing, reshape
    // ----------------------------------------------------------------
    {
      id: 'a6l1',
      title: 'Shelves Without End',
      concept: 'NumPy arrays: np.array, dtype, shape, vectorized arithmetic, 2-D indexing, and reshape',
      xp: 40,
      narrative: 'There is a hall beneath the Ministry that the lifts do not admit to. '
        + 'Shelf after shelf recedes into a dark that swallows torchlight, and on every '
        + 'shelf sit the orbs — glass hearts, each holding one recorded glimmer of the '
        + 'future. Millions of them. You could walk the rows with a list and a lantern '
        + 'and die of age before the third aisle. The Unspeakables do not walk. They lay '
        + 'the whole hall out as a single object — one substance, one shape — and '
        + 'command it entire. Tonight you take up their first instrument: the array.',
      sections: [
        {
          heading: 'One substance, one shelf',
          body: 'A Python list will hold anything: numbers beside strings beside other '
            + 'lists. That generosity has a price — Python must inspect every element, '
            + 'one at a time. A **NumPy array** refuses the generosity and buys back the '
            + 'speed: every element is the same kind of value, packed shoulder to '
            + 'shoulder in memory.\n\n'
            + '- Build one with `np.array(...)` from a list — or a list of lists for two '
            + 'dimensions.\n'
            + '- `.dtype` names the one type every element shares.\n'
            + '- `.shape` gives the length along each dimension, **rows first**: `(4,)` '
            + 'is four values in a line; `(2, 3)` is two rows of three.\n\n'
            + 'The import convention `import numpy as np` is universal — `np` is the '
            + 'library’s short true name, and every grimoire you will ever read uses it.',
          code: py`import numpy as np

glow = np.array([7.0, 3.0, 8.0, 5.0])
print(glow.dtype)     # float64 — one type, shared by all
print(glow.shape)     # (4,) — four readings along one dimension

rack = np.array([[7, 3, 8],
                 [2, 9, 4]])
print(rack.shape)     # (2, 3) — two shelves, three orbs each
print(rack.ndim)      # 2 — rows and columns`,
          note: 'The first time you summon numpy, the Forge goes quiet for a moment — '
            + 'the engine is fetching the whole library down into the dark. It happens '
            + 'once. Every summoning after answers at once.',
        },
        {
          heading: 'Arithmetic without walking',
          body: 'To double every reading in a list, you must walk the list. To double '
            + 'every reading in an array, you simply say so — the operation applies to '
            + '**the whole array at once**, and the loop happens far below, in compiled '
            + 'code, hundreds of times faster than Python could walk it.\n\n'
            + '- *array op scalar* — the scalar is applied to every element (this '
            + 'stretching of one value across many is called **broadcasting**).\n'
            + '- *array op array* — elements are paired position by position; the '
            + 'shapes must agree.\n'
            + '- The result is a **new** array. The original is untouched.\n\n'
            + 'This style is called **vectorized** arithmetic, and it is the reason '
            + 'numpy exists. When you catch yourself writing a `for` loop over an '
            + 'array, stop and ask the array to do it instead.',
          code: py`import numpy as np

readings = [7, 3, 8, 5]

doubled = []                 # the old way — a walk
for r in readings:
    doubled.append(r * 2)
print(doubled)               # [14, 6, 16, 10]

glow = np.array(readings)    # the array way — one gesture
print(glow * 2)              # [14  6 16 10]
print(glow + glow)           # [14  6 16 10]
print(glow - 1)              # [ 6  2  7  4]
print(glow * glow)           # [49  9 64 25]`,
          note: 'Beware the same glyph meaning different laws: for a plain list, '
            + '`[7, 3, 8] * 2` does not double anything — it repeats the list end to '
            + 'end. Arrays are mathematical objects; lists are luggage.',
        },
        {
          heading: 'Rows, columns, and the fold',
          body: 'A two-dimensional array is addressed with one pair of brackets and a '
            + 'comma: `rack[row, column]`. Slices work in either position, and the '
            + 'bare colon `:` means *all of them*:\n\n'
            + '- `rack[0, 2]` — one orb: shelf 0, position 2.\n'
            + '- `rack[1]` — one whole shelf (a 1-D row).\n'
            + '- `rack[:, 0]` — position 0 from **every** shelf (a 1-D column).\n'
            + '- `rack[:, 1:]` — every shelf, positions 1 onward (still 2-D).\n\n'
            + 'And when the readings arrive as a flat line, `.reshape(rows, cols)` '
            + 'refolds them into a grid without copying a single value.',
          code: py`import numpy as np

rack = np.array([[7, 3, 8],
                 [2, 9, 4]])

print(rack[0, 2])     # 8 — shelf 0, orb 2
print(rack[1])        # [2 9 4] — one whole shelf
print(rack[:, 0])     # [7 2] — orb 0 from every shelf

flat = np.arange(6)   # [0 1 2 3 4 5]
print(flat.reshape(2, 3))`,
          note: 'reshape refolds; it does not invent. Six readings can become 2×3 or '
            + '3×2 — never 2×2. Ask for a shape whose cells do not match the count and '
            + 'numpy refuses with an error rather than guess.',
        },
      ],
      challenge: {
        title: 'The Cartography of Shelves',
        prompt: 'The Keeper hands you a rack of glow-readings: one **row per shelf**, '
          + 'one **column per night**. You will cut it every way a cartographer of the '
          + 'Hall must.\n\n'
          + 'Write four functions:\n\n'
          + '- `shelf_history(readings, shelf)` — return the 1-D array of one shelf’s '
          + 'readings across every night (a row).\n'
          + '- `night_watch(readings, night)` — return the 1-D array of one night’s '
          + 'readings across every shelf (a column).\n'
          + '- `amplify(readings, factor)` — return a **new** array with every reading '
          + 'multiplied by `factor`. The original array must not change. No loops.\n'
          + '- `refold(readings, rows, cols)` — return the same readings rearranged '
          + 'into shape `(rows, cols)`.\n\n'
          + 'Your functions must work for a rack of **any** size — the sample below is '
          + 'only a sample.',
        starter: py`import numpy as np

# A small test rack: 2 shelves x 3 nights. Yours must work for ANY rack.
rack = np.array([[7, 3, 8],
                 [2, 9, 4]])

def shelf_history(readings, shelf):
    # TODO: return the row of readings for one shelf
    pass

def night_watch(readings, night):
    # TODO: return the column of readings for one night
    pass

def amplify(readings, factor):
    # TODO: return a NEW array — every reading times factor
    pass

def refold(readings, rows, cols):
    # TODO: return the readings refolded into rows x cols
    pass

print(shelf_history(rack, 0))
print(night_watch(rack, 2))`,
        solution: py`import numpy as np

rack = np.array([[7, 3, 8],
                 [2, 9, 4]])

def shelf_history(readings, shelf):
    return readings[shelf]

def night_watch(readings, night):
    return readings[:, night]

def amplify(readings, factor):
    return readings * factor

def refold(readings, rows, cols):
    return readings.reshape(rows, cols)

print(shelf_history(rack, 0))
print(night_watch(rack, 2))`,
        hints: [
          'A whole row is readings[shelf]. A whole column needs a slice in the row position: readings[:, night].',
          'readings * factor multiplies every element at once and returns a new array — no loop, no copy of your own.',
          'reshape does not act in place — return readings.reshape(rows, cols).',
        ],
        validation: py`import numpy as np
_rack = np.array([[3, 5, 8, 1], [2, 9, 4, 7], [6, 6, 0, 2]])
_row = shelf_history(_rack, 1)
assert isinstance(_row, np.ndarray), "shelf_history must return a numpy array — slice the rack, do not rebuild a list"
assert _row.shape == (4,), "shelf_history must return a 1-D array: one shelf, every night"
assert np.array_equal(_row, [2, 9, 4, 7]), "shelf_history(rack, 1) must be the second row — shelves are rows"
assert np.array_equal(shelf_history(_rack, 0), [3, 5, 8, 1]), "shelf 0 is the first row of the rack"
_col = night_watch(_rack, 2)
assert isinstance(_col, np.ndarray), "night_watch must return a numpy array"
assert _col.shape == (3,), "night_watch must return a 1-D array: one night across every shelf"
assert np.array_equal(_col, [8, 4, 0]), "night_watch(rack, 2) must be the third column — nights are columns, so slice with readings[:, night]"
assert np.array_equal(night_watch(_rack, 0), [3, 2, 6]), "night 0 is the first column of the rack"
_before = _rack.copy()
_amp = amplify(_rack, 10)
assert isinstance(_amp, np.ndarray), "amplify must return a numpy array"
assert np.array_equal(_amp, [[30, 50, 80, 10], [20, 90, 40, 70], [60, 60, 0, 20]]), "amplify(rack, 10) must multiply every reading by 10"
assert np.array_equal(_rack, _before), "amplify must conjure a NEW array — the original rack must remain untouched"
assert np.allclose(amplify(np.array([2.0, 4.0]), 0.5), [1.0, 2.0]), "amplify must work for fractional factors too"
_re = refold(np.arange(6), 2, 3)
assert _re.shape == (2, 3), "refold(np.arange(6), 2, 3) must have shape (2, 3)"
assert np.array_equal(_re, [[0, 1, 2], [3, 4, 5]]), "refold must keep the readings in order while changing only the shape"
assert refold(np.arange(12), 4, 3).shape == (4, 3), "refold must obey any rows x cols the Hall demands"`,
        successText: 'The rack yields its geometry — row, column, and fold — and the Hall admits you one dimension deeper.',
        xp: 85,
      },
      quiz: [
        {
          q: 'What is the `shape` of `np.array([[1, 2, 3], [4, 5, 6]])`?',
          options: [
            '(2, 3) — two rows of three',
            '(3, 2) — three rows of two',
            '6 — six elements',
            '(2, 2) — rows and columns counted once each',
          ],
          answer: 0,
          explain: 'Shape lists the length along each dimension, rows first: two rows, '
            + 'each holding three values. The element count is the product of the '
            + 'shape, not the shape itself.',
        },
        {
          q: 'A Python list and a numpy array both hold `[7, 3, 8]`. What does `* 2` do to each?',
          options: [
            'Both double every element',
            'The list doubles every element; the array is repeated end to end',
            'The list is repeated end to end; the array doubles every element',
            'Both are repeated end to end',
          ],
          answer: 2,
          explain: 'For lists, * means repetition: [7, 3, 8] * 2 is [7, 3, 8, 7, 3, 8]. '
            + 'For arrays, arithmetic is elementwise: [14, 6, 16]. Same glyph, '
            + 'different laws — the array is a mathematical object.',
        },
        {
          q: 'What does an array’s `dtype` tell you?',
          options: [
            'How many dimensions the array has',
            'The single type shared by every element of the array',
            'The total memory the array occupies',
            'Whether the array can still be reshaped',
          ],
          answer: 1,
          explain: 'dtype names the one element type the whole array is made of — that '
            + 'uniformity is what makes vectorized arithmetic possible. Dimensions '
            + 'belong to shape and ndim.',
        },
        {
          q: 'For a 2-D array `rack`, what does `rack[:, 0]` select?',
          options: [
            'The first row',
            'The last column',
            'Every element, unchanged',
            'The first column — position 0 from every row',
          ],
          answer: 3,
          explain: 'The bare colon in the row position means every row; the 0 in the '
            + 'column position picks one column. The first row would be rack[0] — or '
            + 'rack[0, :], which is the same thing.',
        },
      ],
    },

    // ----------------------------------------------------------------
    // a6l2 — boolean masks, aggregation & axis, np.where,
    //        fancy indexing, seeded randomness
    // ----------------------------------------------------------------
    {
      id: 'a6l2',
      title: 'The Sieve of Omens',
      concept: 'boolean masks, aggregations and axis, np.where, fancy indexing, and seeded randomness',
      xp: 40,
      narrative: 'Most of what the Hall records is nothing: dim orbs, quiet years, '
        + 'futures in which no one dies interestingly. The Unspeakables have a word for '
        + 'reading every record in search of the few that matter — they call it '
        + 'drowning. What they do instead is sieve: a condition laid over the whole '
        + 'hall at once, a mask of yes and no, whole shelves collapsing along one '
        + 'direction into single answers. And when the Hall must be fed conjured '
        + 'futures to test a sieve, the chance that conjures them is bound to a seed — '
        + 'for a divination that cannot be repeated cannot be trusted.',
      sections: [
        {
          heading: 'The mask of yes and no',
          body: 'Compare an array to a value and you do not get one answer — you get '
            + '**every** answer at once: a boolean array the same shape as the '
            + 'original, `True` where the condition holds. That boolean array is '
            + 'called a **mask**, and its true power appears when you place it inside '
            + 'the square brackets: `glow[mask]` returns only the elements where the '
            + 'mask says yes.\n\n'
            + '- Combine conditions with `&` (and) and `|` (or) — **not** the words '
            + '`and`/`or`, which choke on whole arrays.\n'
            + '- Parenthesize each comparison: `(glow > 3) & (glow < 8)`. The `&` '
            + 'glyph binds tighter than `>`, and without parentheses the spell '
            + 'misfires.',
          code: py`import numpy as np

glow = np.array([4, 9, 2, 7, 7, 1])
hot = glow > 6
print(hot)             # [False  True False  True  True False]
print(glow[hot])       # [9 7 7] — only where the mask says yes
print(glow[(glow > 3) & (glow < 8)])   # [4 7 7]
print((glow > 6).sum())               # 3 — True counts as 1`,
          note: 'That last line is a favorite trick of the Hall: summing a mask counts '
            + 'their yeses. No loop, no counter variable — just the arithmetic of truth.',
        },
        {
          heading: 'Collapse along an axis',
          body: 'Arrays answer for themselves in aggregate: `.sum()`, `.mean()`, '
            + '`.min()`, `.max()` collapse the whole array to one number, and '
            + '`.argmax()` returns the **position** of the largest value rather than '
            + 'the value itself.\n\n'
            + 'On a 2-D array you choose the *direction of collapse* with `axis=`:\n\n'
            + '- `axis=0` collapses **down the rows** — one answer per column.\n'
            + '- `axis=1` collapses **across the columns** — one answer per row.\n\n'
            + 'The rule worth carving somewhere: *axis names the dimension that is '
            + 'consumed*. Give none, and everything is consumed.',
          code: py`import numpy as np

rack = np.array([[7, 3, 8],
                 [2, 9, 4]])
print(rack.sum())          # 33 — the whole rack
print(rack.sum(axis=0))    # [ 9 12 12] — one total per night (column)
print(rack.sum(axis=1))    # [18 15] — one total per shelf (row)
print(rack.max())          # 9
print(rack.argmax())       # 4 — position in the flattened rack`,
        },
        {
          heading: 'np.where, and the pointed finger',
          body: 'Two last instruments for the sieve:\n\n'
            + '- `np.where(condition, a, b)` builds a new array by choosing, element '
            + 'by element: `a` where the condition holds, `b` where it does not. It is '
            + 'the vectorized *if/else*.\n'
            + '- **Fancy indexing**: place a list of positions inside the brackets — '
            + '`glow[[2, 0]]` — and the array hands back exactly those elements, in '
            + 'exactly that order. Where a mask asks *which qualify*, the pointed '
            + 'finger says *these, by name*.',
          code: py`import numpy as np

glow = np.array([4, 9, 2, 7])
print(np.where(glow > 6, glow, 0))   # [0 9 0 7] — keep the burning, silence the rest
print(glow[[2, 0]])                  # [2 4] — plucked by position, in the order named`,
        },
        {
          heading: 'Chance, chained to a seed',
          body: 'To test a sieve before trusting it on real shelves, you must conjure '
            + 'data. `np.random.default_rng(seed)` builds a random generator; from it '
            + 'you draw whatever the trial demands:\n\n'
            + '- `rng.integers(low, high, size=n)` — n integers from `low` up to but '
            + '**not including** `high`.\n'
            + '- `rng.normal(loc, scale, size=n)` — n values from a bell curve '
            + 'centred on `loc`.\n\n'
            + 'The seed is the law: the same seed yields the same draws, today and in '
            + 'a hundred years. In this Codex **unseeded chance is forbidden** — an '
            + 'analysis that cannot be reproduced is not evidence, it is anecdote. '
            + 'Older grimoires cast this as `np.random.seed(0)` followed by '
            + '`np.random.randint(...)`; you will meet that dialect everywhere, but '
            + '`default_rng` is the modern binding.',
          code: py`import numpy as np

rng = np.random.default_rng(0)
print(rng.integers(1, 10, size=5))

again = np.random.default_rng(0)
print(again.integers(1, 10, size=5))   # the same five — the seed is the law`,
        },
      ],
      challenge: {
        title: 'The Sieve',
        prompt: 'Ten thousand orbs, and the Keeper wants only the ones that burn. '
          + 'Build the sieve.\n\n'
          + 'Write four functions:\n\n'
          + '- `burning(readings, threshold)` — return a 1-D array of every reading '
          + '**strictly greater than** `threshold`, in reading order (works for 1-D '
          + 'or 2-D input; a mask flattens 2-D naturally).\n'
          + '- `brightest_shelf(readings)` — for a 2-D rack (rows = shelves), return '
          + 'the **index** of the shelf with the greatest total. Sum along `axis=1`, '
          + 'then `argmax`.\n'
          + '- `veil(readings, threshold)` — return a new array where every reading '
          + '**below** `threshold` becomes `0` and the rest keep their value. Use '
          + '`np.where`.\n'
          + '- `conjure_omens(count)` — build a generator with '
          + '`np.random.default_rng(0)` **inside the function** and return `count` '
          + 'integers between 1 and 9 inclusive. Bound to seed 0, it must conjure the '
          + 'identical omens every call.',
        starter: py`import numpy as np

rack = np.array([[4, 9, 2],
                 [7, 5, 7],
                 [3, 3, 3]])

def burning(readings, threshold):
    # TODO: index with a mask — readings strictly above the threshold
    pass

def brightest_shelf(readings):
    # TODO: total each shelf (axis=1), then argmax
    pass

def veil(readings, threshold):
    # TODO: np.where — zero below the threshold, keep the rest
    pass

def conjure_omens(count):
    # TODO: default_rng(0), then integers between 1 and 9 inclusive
    pass

print(burning(rack, 6))
print(brightest_shelf(rack))`,
        solution: py`import numpy as np

rack = np.array([[4, 9, 2],
                 [7, 5, 7],
                 [3, 3, 3]])

def burning(readings, threshold):
    return readings[readings > threshold]

def brightest_shelf(readings):
    return int(np.argmax(readings.sum(axis=1)))

def veil(readings, threshold):
    return np.where(readings < threshold, 0, readings)

def conjure_omens(count):
    rng = np.random.default_rng(0)
    return rng.integers(1, 10, size=count)

print(burning(rack, 6))
print(brightest_shelf(rack))`,
        hints: [
          'burning is one line: readings[readings > threshold]. The comparison builds the mask; the brackets apply it.',
          'brightest_shelf: readings.sum(axis=1) gives one total per shelf; np.argmax of that gives the winning index. veil: np.where(readings < threshold, 0, readings).',
          'conjure_omens must create the generator fresh inside the function — rng = np.random.default_rng(0) — then return rng.integers(1, 10, size=count). integers excludes the upper bound, so 10 means "up to 9".',
        ],
        validation: py`import numpy as np
_r = np.array([[4, 9, 2], [7, 5, 7], [3, 3, 3]])
assert np.array_equal(burning(_r, 6), [9, 7, 7]), "burning must return exactly the readings above the threshold, in reading order"
assert np.array_equal(burning(np.array([1, 2, 3]), 6), []), "when nothing burns, burning must return an empty array — the mask does this naturally"
assert np.array_equal(burning(np.array([5, 6, 7]), 6), [7]), "strictly greater: a reading equal to the threshold does not burn"
assert brightest_shelf(_r) == 1, "shelf 1 holds the greatest total (19) — sum along axis=1, then argmax"
assert brightest_shelf(np.array([[1, 1], [0, 0], [5, 0]])) == 2, "brightest_shelf must follow the totals, not the first row it sees"
_v = veil(_r, 4)
assert np.array_equal(_v, [[4, 9, 0], [7, 5, 7], [0, 0, 0]]), "veil must zero the readings BELOW the threshold and keep the rest — np.where(readings < threshold, 0, readings)"
assert np.array_equal(veil(np.array([5, 5]), 5), [5, 5]), "a reading equal to the threshold survives the veil — only strictly-below is silenced"
_o1 = conjure_omens(8)
_o2 = conjure_omens(8)
assert isinstance(_o1, np.ndarray) and _o1.shape == (8,), "conjure_omens(8) must return a numpy array of 8 readings"
assert np.array_equal(_o1, _o2), "the same seed must conjure the same omens — build the generator with default_rng(0) INSIDE the function"
assert _o1.min() >= 1 and _o1.max() <= 9, "omens must lie between 1 and 9 — integers(1, 10) excludes its upper bound"
assert _o1.dtype.kind == "i", "omens must be integers — rng.integers, not rng.random"
assert len(conjure_omens(3)) == 3, "count must govern how many omens are conjured"
assert np.array_equal(conjure_omens(64), np.random.default_rng(0).integers(1, 10, size=64)), "the omen-stream itself is wrong — with default_rng(0), integers(1, 10) must reproduce it exactly; check your bounds (10 excludes itself; writing 9 would silence the nines)"`,
        successText: 'The sieve holds: ten thousand dim futures fall away, and the burning few remain in your hand.',
        xp: 85,
      },
      quiz: [
        {
          q: 'Why does `glow[(glow > 3) & (glow < 8)]` use `&` instead of `and`?',
          options: [
            '`&` is faster but otherwise identical',
            '`and` demands one single truth value from a whole array, which is ambiguous — `&` compares element by element',
            '`and` only works on strings',
            '`&` is required whenever parentheses are present',
          ],
          answer: 1,
          explain: 'A boolean array holds many truths at once, so Python cannot reduce '
            + 'it to one for `and` — it raises an error about ambiguity. `&` (and `|`) '
            + 'work elementwise, which is exactly what a mask needs. The parentheses '
            + 'are separately required because & binds tighter than the comparisons.',
        },
        {
          q: 'For a 2-D array, what does `rack.mean(axis=0)` produce?',
          options: [
            'One mean per column — the rows are consumed',
            'One mean per row — the columns are consumed',
            'A single mean of every element',
            'An error: mean accepts no arguments',
          ],
          answer: 0,
          explain: 'axis names the dimension that is consumed. axis=0 collapses down '
            + 'the rows, leaving one value per column; axis=1 is the reverse; no axis '
            + 'at all collapses everything to a single number.',
        },
        {
          q: 'What does `np.argmax(glow)` return?',
          options: [
            'The largest value in glow',
            'How many times the maximum occurs',
            'The position (index) of the largest value',
            'True if glow is sorted ascending',
          ],
          answer: 2,
          explain: 'arg- functions answer *where*, not *what*: argmax hands back the '
            + 'index of the largest element. glow.max() would hand back the value '
            + 'itself.',
        },
        {
          q: 'Two separate runs both execute `np.random.default_rng(0).integers(1, 10, size=5)`. What do they produce?',
          options: [
            'Different values — randomness never repeats',
            'The same values only if run within the same second',
            'An error — a seeded generator may be drawn from only once',
            'Exactly the same five integers, every time, on any machine',
          ],
          answer: 3,
          explain: 'The seed fixes the entire stream of draws. That determinism is the '
            + 'law of reproducible analysis: anyone can rerun your working and get '
            + 'your numbers. Clocks have nothing to do with it once a seed is given.',
        },
      ],
    },

    // ----------------------------------------------------------------
    // a6l3 — matplotlib: subplots, plot/scatter/hist, titles,
    //        labels, legends, figure-object introspection
    // ----------------------------------------------------------------
    {
      id: 'a6l3',
      title: 'Scrying Made Visible',
      concept: 'matplotlib figures: subplots, plot, scatter, hist, titles, labels, and legends',
      xp: 40,
      narrative: 'The Unspeakables do not read numbers; they scry them. A column of '
        + 'figures hides what a single drawn line confesses at a glance — the rise, '
        + 'the rhythm, the night everything changed. But scrying has a discipline as '
        + 'strict as any ward. A chart with no title is a rumor. An axis with no name '
        + 'is an ambush. And in the Hall, every chart you raise is itself an object — '
        + 'the wards will pick it up, turn it over, and interrogate what you drew and '
        + 'what you failed to name.',
      sections: [
        {
          heading: 'The figure and the axes',
          body: '**matplotlib** is Python’s drawing engine, and `pyplot` is its front '
            + 'door — imported, by universal convention, as `plt`.\n\n'
            + '`plt.subplots()` conjures two bound objects at once:\n\n'
            + '- the **Figure** — the whole sheet of glass;\n'
            + '- the **Axes** — one plot living on it: the frame, the ticks, and every '
            + 'mark you draw.\n\n'
            + 'You draw by calling methods on the axes. `ax.plot(x, y)` rules a line '
            + 'through the points, joining them in order — the right mark for a value '
            + 'moving through time. In scripts of the outer world you finish with '
            + '`plt.show()`; in the Forge, the last figure you raise is seized and '
            + 'displayed the moment your run ends.',
          code: py`import numpy as np
import matplotlib.pyplot as plt

nights = np.arange(1, 11)
glow = np.array([4, 5, 4, 6, 7, 6, 8, 9, 8, 10])

fig, ax = plt.subplots()
ax.plot(nights, glow)
ax.set_title("An orb, watched for ten nights")`,
        },
        {
          heading: 'Scatter, and the counting of bins',
          body: 'Two more marks complete the scrying kit:\n\n'
            + '- `ax.scatter(x, y)` places one unjoined point per pair — the right '
            + 'mark when each point is a separate record and you are hunting a '
            + 'relationship between two quantities.\n'
            + '- `ax.hist(values, bins=8)` sorts values into 8 equal-width bins and '
            + 'raises one bar per bin — the shape of a distribution, made visible.\n\n'
            + 'Bin count is a blade with two edges: too few bins melt real structure '
            + 'into smooth nothing; too many shatter it into noise. There is no '
            + 'sacred number — scry at several counts before you trust what you see.',
          code: py`import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(7)
dread = rng.normal(5.0, 1.5, size=200)   # two hundred conjured readings

fig, ax = plt.subplots()
ax.hist(dread, bins=12)
ax.set_title("Two hundred futures, binned")`,
          note: 'When the values are **whole numbers**, `bins=10` is quietly treacherous: it '
            + 'slices the range into ten equal widths and melts neighboring integers into one '
            + 'bar, and the ward never says a word. For byte-like data running 0 to 255, write '
            + 'the edges yourself — `bins=range(0, 257)` — so every value keeps a bin of its '
            + 'own. Mind the final edge: stop at `range(0, 256)` and the topmost value loses '
            + 'its bar, silently folded into its neighbor’s.',
        },
        {
          heading: 'An untitled chart is a lie',
          body: 'A drawn line asserts something. Without a title, named axes, and a '
            + 'legend, the reader cannot know *what* — so they will guess, and a '
            + 'guessed reading is a wrong one. The Codex treats an unlabeled chart as '
            + 'a lie of omission.\n\n'
            + '- `ax.set_title("...")`, `ax.set_xlabel("...")`, `ax.set_ylabel("...")` '
            + '— name the claim and both of its directions.\n'
            + '- Pass `label="..."` to each drawing call, then call `ax.legend()` to '
            + 'display the names.\n'
            + '- `ax.axhline(y)` rules a horizontal reference line clean across the '
            + 'axes — the classic way to hang a mean above its data.\n\n'
            + 'And every one of these marks can be questioned afterward, because the '
            + 'figure is an **object**, not a picture: `ax.get_title()` returns the '
            + 'title, `ax.lines` remembers every drawn line. The Hall’s wards read '
            + 'your charts exactly this way — by the object, never by the pixels.',
          code: py`import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [2, 4, 8], label="orb 88")
ax.plot([1, 2, 3], [3, 3, 3], label="orb 91")
ax.set_title("Two orbs, three nights")
ax.set_xlabel("Night")
ax.set_ylabel("Glow")
ax.legend()

print(ax.get_title())    # Two orbs, three nights
print(len(ax.lines))     # 2 — the axes remember every line`,
        },
      ],
      challenge: {
        title: 'The Watcher’s Chart',
        prompt: 'Orb 713 has been watched for twelve nights, and the Keeper demands '
          + 'the watch made visible — titled, labeled, undeniable.\n\n'
          + 'Starting from the data already conjured in the starter:\n\n'
          + '- Create a figure and axes with `fig, ax = plt.subplots()`.\n'
          + '- Draw the glow across the nights with `ax.plot(nights, glow, '
          + 'label="glow")`.\n'
          + '- Rule a horizontal line at the mean glow with '
          + '`ax.axhline(glow.mean(), label="mean")`.\n'
          + '- Title the chart **exactly** `The Glow of Orb 713`.\n'
          + '- Label the x-axis **exactly** `Night` and the y-axis **exactly** '
          + '`Glow`.\n'
          + '- Call `ax.legend()` so both lines are named.\n\n'
          + 'The Forge will display your figure — and the wards will interrogate the '
          + 'object behind it.',
        starter: py`import numpy as np
import matplotlib.pyplot as plt

nights = np.arange(1, 13)
glow = np.array([5.0, 6.0, 5.5, 7.0, 8.5, 8.0,
                 9.5, 11.0, 10.5, 12.0, 13.5, 15.0])

# TODO: fig, ax = plt.subplots()
# TODO: draw the glow line, labeled "glow"
# TODO: rule a horizontal line at the mean, labeled "mean"
# TODO: title: The Glow of Orb 713
# TODO: x-axis: Night     y-axis: Glow
# TODO: show the legend`,
        solution: py`import numpy as np
import matplotlib.pyplot as plt

nights = np.arange(1, 13)
glow = np.array([5.0, 6.0, 5.5, 7.0, 8.5, 8.0,
                 9.5, 11.0, 10.5, 12.0, 13.5, 15.0])

fig, ax = plt.subplots()
ax.plot(nights, glow, label="glow")
ax.axhline(glow.mean(), label="mean")
ax.set_title("The Glow of Orb 713")
ax.set_xlabel("Night")
ax.set_ylabel("Glow")
ax.legend()`,
        hints: [
          'Begin with fig, ax = plt.subplots() — everything else is a method call on ax.',
          'ax.plot(nights, glow, label="glow") draws the data; ax.axhline(glow.mean(), label="mean") hangs the mean across the whole width.',
          'set_title, set_xlabel and set_ylabel take the exact strings from the prompt — then ax.legend() reads the label= names you passed.',
        ],
        validation: py`import numpy as np
import matplotlib.pyplot as plt

_nights = np.arange(1, 13)
_glow = np.array([5.0, 6.0, 5.5, 7.0, 8.5, 8.0, 9.5, 11.0, 10.5, 12.0, 13.5, 15.0])
_fig = plt.gcf()
_axes = _fig.get_axes()
assert len(_axes) >= 1, "no axes found on the figure — begin with fig, ax = plt.subplots()"
_ax = _axes[0]
assert len(_ax.lines) >= 2, "the chart needs two lines: the glow itself and its mean — draw both"
_data_lines = [l for l in _ax.lines if len(l.get_ydata()) == 12 and np.allclose(l.get_ydata(), _glow)]
assert _data_lines, "no line carries the twelve glow readings — ax.plot(nights, glow, ...)"
assert np.allclose(_data_lines[0].get_xdata(), _nights), "the glow line must run over nights 1 through 12 on the x-axis"
_mean = _glow.mean()
_mean_lines = [l for l in _ax.lines if l not in _data_lines and np.allclose(l.get_ydata(), _mean)]
assert _mean_lines, "no horizontal line rests at the mean glow — ax.axhline(glow.mean(), ...)"
assert _ax.get_title() == "The Glow of Orb 713", "the title must read exactly: The Glow of Orb 713 — an untitled chart is a lie"
assert _ax.get_xlabel() == "Night", "the x-axis must be labeled exactly: Night"
assert _ax.get_ylabel() == "Glow", "the y-axis must be labeled exactly: Glow"
_leg = _ax.get_legend()
assert _leg is not None, "call ax.legend() so the two lines are named"
_labels = [t.get_text() for t in _leg.get_texts()]
assert "glow" in _labels and "mean" in _labels, "the legend must name both lines glow and mean — pass label= to each drawing call"`,
        successText: 'The chart hangs in the dark like a lit window: named, labeled, impossible to misread.',
        xp: 90,
      },
      quiz: [
        {
          q: 'What does `fig, ax = plt.subplots()` place in `fig` and `ax`?',
          options: [
            'Two references to the same object',
            'The x-axis and the y-axis',
            'The whole figure (the sheet) and one axes (the plot drawn on it)',
            'A list of every figure ever created',
          ],
          answer: 2,
          explain: 'subplots returns a (figure, axes) pair. The figure is the canvas; '
            + 'the axes is the plot that lives on it, and nearly every drawing call — '
            + 'plot, hist, set_title — is a method of the axes.',
        },
        {
          q: 'The Codex calls an untitled chart a lie. Why?',
          options: [
            'Marks without names force the reader to guess what is being claimed — and a guessed reading misleads',
            'matplotlib refuses to render figures without titles',
            'The legend cannot work until a title exists',
            'Untitled charts render more slowly',
          ],
          answer: 0,
          explain: 'The library will happily render a nameless chart — that is what '
            + 'makes it dangerous. Title, axis labels, and legend are the difference '
            + 'between evidence and decoration.',
        },
        {
          q: 'After two calls to `ax.plot(...)`, which expression counts the drawn lines?',
          options: [
            'ax.count()',
            'len(ax.lines)',
            'fig.size',
            'plt.lines(ax)',
          ],
          answer: 1,
          explain: 'The axes remembers every line it carries in ax.lines — the figure '
            + 'is an object you can interrogate, which is exactly how the Hall’s wards '
            + 'grade your charts.',
        },
        {
          q: 'You histogram 10,000 readings with `bins=2`. The danger is…',
          options: [
            'an error — bins must exceed 10',
            'the bars will be too thin to see',
            'nothing — fewer bins is always clearer',
            'real structure melts into two smooth bars — too-coarse bins hide the truth',
          ],
          answer: 3,
          explain: 'Bin count trades detail against noise. Two bins can bury a spike '
            + 'that sixty-four would reveal; ten thousand bins would shatter the shape '
            + 'into static. Scry at several counts before trusting one.',
        },
      ],
    },

    // ----------------------------------------------------------------
    // a6l4 — pandas: Series, DataFrame, loc/iloc, boolean filtering,
    //        computed columns
    // ----------------------------------------------------------------
    {
      id: 'a6l4',
      title: 'The Ledger of Souls',
      concept: 'pandas: Series, DataFrames, loc and iloc, boolean filtering, and computed columns',
      xp: 40,
      narrative: 'Below the Hall of Prophecy lies a quieter room, and a colder one: '
        + 'the Ledger of Souls, where the Ministry records its dead. Name, house, '
        + 'years in the ground, and *unrest* — measured on a scale the clerks refuse '
        + 'to explain. numpy gave you the grid; **pandas** gives the grid names. Rows '
        + 'that answer to labels, columns that answer to words, and a whole grammar '
        + 'of asking: who, of what house, how long dead, and how loudly they refuse '
        + 'to stay so.',
      sections: [
        {
          heading: 'The Series and the frame',
          body: 'pandas — imported, always, as `pd` — keeps tabular data in a '
            + '**DataFrame**: a 2-D table built over numpy, with named columns and a '
            + 'labeled **index** for the rows. Each single column is a **Series** — '
            + 'one-dimensional, one dtype, carrying the same index.\n\n'
            + 'The most direct construction is a dict: keys become column names, '
            + 'lists become the columns. Then the frame answers for itself:\n\n'
            + '- `.head()` — the first five rows, for a first look.\n'
            + '- `.shape` — `(rows, columns)`, exactly as numpy taught you.\n'
            + '- `.dtypes` — the type of every column; `.columns` and `.index` — the '
            + 'names of both dimensions.',
          code: py`import pandas as pd

ledger = pd.DataFrame({
    "name": ["Elspeth", "Odo", "Marlow", "Ivo"],
    "house": ["Vane", "Grimm", "Vane", "Hollow"],
    "years_dead": [212, 87, 45, 310],
    "unrest": [7.0, 3.0, 9.0, 2.0],
})
print(ledger.head())
print(ledger.shape)      # (4, 4)
print(list(ledger.columns))`,
        },
        {
          heading: 'loc and iloc — name against number',
          body: 'Two gates open the frame, and confusing them is the classic pandas '
            + 'wound:\n\n'
            + '- `.loc[row_label, column_name]` selects by **label** — what the row '
            + 'is called.\n'
            + '- `.iloc[row_position, column_position]` selects by **integer '
            + 'position** — where the row sits, counting from zero.\n\n'
            + 'A fresh frame gets the default index 0, 1, 2… so the two coincide — '
            + 'until you filter or sort. Then labels travel with their rows, '
            + 'positions do not, and only one of the gates still means what you '
            + 'think it means.\n\n'
            + 'A single column comes out by name: `ledger["unrest"]` — a Series. '
            + 'This is the selection you will use most.',
          code: py`import pandas as pd

ledger = pd.DataFrame({
    "name": ["Elspeth", "Odo", "Marlow", "Ivo"],
    "unrest": [7.0, 3.0, 9.0, 2.0],
})
print(ledger.loc[2, "name"])    # Marlow — by label
print(ledger.iloc[0, 0])        # Elspeth — by position
print(ledger["unrest"].max())   # 9.0 — a column is a Series`,
          note: 'The Ledger’s clerks lost a decade of records to a sorcerer who '
            + 'sorted the book and went on trusting positions. Labels survive '
            + 'rearrangement; positions are whatever the current moment says they '
            + 'are.',
        },
        {
          heading: 'Filtering, and the computed column',
          body: 'Boolean masks work on frames exactly as they did on arrays: a '
            + 'comparison on a column yields a mask, and `ledger[mask]` keeps only '
            + 'the rows where the mask says yes. Combine conditions with `&` and `|`, '
            + 'each comparison parenthesized — the same law as numpy.\n\n'
            + 'And new knowledge is written straight into the book: assign to a '
            + 'column name that does not exist yet, and it does. Arithmetic between '
            + 'columns is vectorized, row by row, no loop in sight.',
          code: py`import pandas as pd

ledger = pd.DataFrame({
    "name": ["Elspeth", "Odo", "Marlow", "Ivo"],
    "years_dead": [212, 87, 45, 310],
    "unrest": [7.0, 3.0, 9.0, 2.0],
})

restless = ledger[ledger["unrest"] > 5]
print(restless["name"].tolist())        # ['Elspeth', 'Marlow']

both = ledger[(ledger["unrest"] > 5) & (ledger["years_dead"] > 100)]
print(both["name"].tolist())            # ['Elspeth']

ledger["toll"] = ledger["years_dead"] * ledger["unrest"]
print(ledger["toll"].tolist())          # [1484.0, 261.0, 405.0, 620.0]`,
        },
      ],
      challenge: {
        title: 'Entries in the Book of the Dead',
        prompt: 'The clerks hand you six souls as bare lists. Bind them into the '
          + 'Ledger properly.\n\n'
          + 'Using the lists provided in the starter:\n\n'
          + '- Build a DataFrame named `ledger` with columns exactly `name`, '
          + '`house`, `years_dead`, `unrest` — in that order.\n'
          + '- Add a computed column `toll` equal to `years_dead * unrest`.\n'
          + '- Set `eldest` to the **name** (a string) of the soul with the greatest '
          + '`years_dead`. Find the row with `.idxmax()` on the column, then read its '
          + 'name with `.loc`.\n'
          + '- Write a function `restless_names(df, threshold)` returning a plain '
          + '**list** of the names whose `unrest` is **at least** `threshold`, in '
          + 'ledger order. It must work on any ledger with those columns — use '
          + '`.tolist()`.',
        starter: py`import pandas as pd

names = ["Elspeth", "Odo", "Marlow", "Tace", "Ivo", "Rook"]
houses = ["Vane", "Grimm", "Vane", "Grimm", "Hollow", "Vane"]
years_dead = [212, 87, 45, 130, 310, 66]
unrest = [7.0, 3.0, 9.0, 4.0, 2.0, 8.0]

# TODO: build the DataFrame named ledger (columns: name, house, years_dead, unrest)

# TODO: add the computed column: toll = years_dead * unrest

# TODO: eldest = the NAME of the soul with the greatest years_dead
eldest = None

def restless_names(df, threshold):
    # TODO: list of names with unrest >= threshold, in ledger order
    pass

print(eldest)`,
        solution: py`import pandas as pd

names = ["Elspeth", "Odo", "Marlow", "Tace", "Ivo", "Rook"]
houses = ["Vane", "Grimm", "Vane", "Grimm", "Hollow", "Vane"]
years_dead = [212, 87, 45, 130, 310, 66]
unrest = [7.0, 3.0, 9.0, 4.0, 2.0, 8.0]

ledger = pd.DataFrame({
    "name": names,
    "house": houses,
    "years_dead": years_dead,
    "unrest": unrest,
})
ledger["toll"] = ledger["years_dead"] * ledger["unrest"]

eldest = ledger.loc[ledger["years_dead"].idxmax(), "name"]

def restless_names(df, threshold):
    return df.loc[df["unrest"] >= threshold, "name"].tolist()

print(eldest)
print(restless_names(ledger, 7.0))`,
        hints: [
          'Build the frame from a dict: pd.DataFrame({"name": names, "house": houses, ...}) — dict order becomes column order.',
          'ledger["years_dead"].idxmax() gives the LABEL of the longest-dead row; ledger.loc[that_label, "name"] reads the name at that label.',
          'restless_names: df.loc[df["unrest"] >= threshold, "name"].tolist() — the mask picks the rows, "name" picks the column, tolist() makes it a plain list.',
        ],
        validation: py`import pandas as pd
assert list(ledger.columns) == ["name", "house", "years_dead", "unrest", "toll"], "the ledger must carry exactly name, house, years_dead, unrest, toll — in that order"
assert ledger.shape == (6, 5), "six souls, five columns — the frame is the wrong size"
assert abs(ledger.loc[0, "toll"] - 1484.0) < 1e-9, "toll must be years_dead * unrest — Elspeth carries 212 * 7.0 = 1484.0"
assert abs(float(ledger["toll"].sum()) - 3818.0) < 1e-6, "the tolls do not sum true — toll must be years_dead * unrest for every row"
assert eldest == "Ivo", "eldest must be the NAME of the longest-dead soul — idxmax finds the row label, .loc reads the name there"
assert restless_names(ledger, 7.0) == ["Elspeth", "Marlow", "Rook"], "restless_names(ledger, 7.0) must name every soul with unrest of at least 7, in ledger order, as a plain list"
assert restless_names(ledger, 100.0) == [], "when no soul is restless enough, return an empty list"
_other = pd.DataFrame({
    "name": ["Wren", "Sorrel"],
    "house": ["Hollow", "Vane"],
    "years_dead": [10, 20],
    "unrest": [9.0, 1.0],
})
assert restless_names(_other, 5.0) == ["Wren"], "restless_names must work on ANY ledger handed to it, not only yours"
assert restless_names(_other, 1.0) == ["Wren", "Sorrel"], "at least means >= — a soul exactly at the threshold is counted"`,
        successText: 'The book accepts the six without complaint, and somewhere below the floor, one of them turns over.',
        xp: 90,
      },
      quiz: [
        {
          q: 'What is the difference between `.loc` and `.iloc`?',
          options: [
            'They are interchangeable on any frame',
            '.loc selects columns, .iloc selects rows',
            '.loc is slower but safer',
            '.loc selects by label; .iloc selects by integer position',
          ],
          answer: 3,
          explain: 'loc goes by what rows are called; iloc by where they sit. On a '
            + 'fresh frame the default labels 0, 1, 2… make the two coincide — the '
            + 'moment you filter or sort, they part ways.',
        },
        {
          q: 'What does `ledger["unrest"]` return?',
          options: [
            'A Series — one named, typed column carrying the frame’s index',
            'A plain Python list',
            'A new DataFrame containing every column',
            'A single number',
          ],
          answer: 0,
          explain: 'Selecting one column yields a Series: one-dimensional, one dtype, '
            + 'same row labels as the frame. Call .tolist() when you truly need a '
            + 'plain list.',
        },
        {
          q: 'Which expression keeps rows where unrest exceeds 5 AND years_dead exceeds 100?',
          options: [
            'ledger[ledger["unrest"] > 5 and ledger["years_dead"] > 100]',
            'ledger[ledger["unrest"] > 5 & ledger["years_dead"] > 100]',
            'ledger[(ledger["unrest"] > 5) & (ledger["years_dead"] > 100)]',
            'ledger.both("unrest > 5", "years_dead > 100")',
          ],
          answer: 2,
          explain: 'Masks combine with &, and each comparison must be parenthesized '
            + 'because & binds tighter than >. The word and chokes on whole columns; '
            + 'the unparenthesized & is quietly evaluated in the wrong order.',
        },
        {
          q: 'How do you add a computed column `toll` to `ledger`?',
          options: [
            'ledger.append("toll")',
            'ledger["toll"] = ledger["years_dead"] * ledger["unrest"]',
            'ledger.insert_column("toll")',
            'Columns cannot be added after the frame is built',
          ],
          answer: 1,
          explain: 'Assigning to an unknown column name creates it, and the '
            + 'column-by-column arithmetic is vectorized over every row at once — the '
            + 'numpy law, wearing names.',
        },
      ],
    },

    // ----------------------------------------------------------------
    // a6l5 — pandas wrangling: sort_values, value_counts, groupby,
    //        missing data, read_csv from text
    // ----------------------------------------------------------------
    {
      id: 'a6l5',
      title: 'Ordering the Dead',
      concept: 'pandas wrangling: sort_values, value_counts, groupby, missing data, and read_csv',
      xp: 40,
      narrative: 'The Ledger of Souls was kept by hand for nine centuries, and it '
        + 'shows. Entries with no name. Unrest left blank because the clerk on duty '
        + 'would not go back down to check. The dead of three houses shuffled '
        + 'together in no order at all. A ledger like this does not lie outright — '
        + 'it lies by omission and disarray, which is worse, because the numbers '
        + 'still *look* like numbers. Tonight you learn the housekeeping of truth: '
        + 'sorting, counting, gathering by house, and the delicate necromancy of '
        + 'deciding what a blank space means.',
      sections: [
        {
          heading: 'Sorting and counting',
          body: 'Two instruments answer the first questions anyone asks of a '
            + 'ledger:\n\n'
            + '- `.sort_values("unrest", ascending=False)` returns a **new** frame, '
            + 'ordered by a column — the original is untouched. Chain `.head(n)` to '
            + 'keep the top n.\n'
            + '- `.value_counts()` on a column counts how often each value occurs, '
            + '**most frequent first**. One call, and the census of houses is done.\n\n'
            + 'Note what sorting does to the row labels: they travel with their '
            + 'rows. The top row of the sorted frame keeps its old label — which is '
            + 'exactly why `.loc` and `.iloc` parted ways in the last lesson.',
          code: py`import pandas as pd

ledger = pd.DataFrame({
    "name": ["Elspeth", "Odo", "Marlow", "Tace", "Ivo"],
    "house": ["Vane", "Grimm", "Vane", "Grimm", "Hollow"],
    "unrest": [7.0, 3.0, 9.0, 4.0, 2.0],
})
top = ledger.sort_values("unrest", ascending=False)
print(top.head(2)["name"].tolist())   # ['Marlow', 'Elspeth']
print(ledger["house"].value_counts())`,
        },
        {
          heading: 'The gathering: groupby',
          body: 'The Ministry never asks about one soul; it asks about houses. '
            + '`groupby` gathers rows that share a value, then aggregates each '
            + 'gathering:\n\n'
            + '- `ledger.groupby("house")["unrest"].mean()` — one mean per house, '
            + 'returned as a Series indexed by house.\n'
            + '- `.size()` — how many rows each gathering holds.\n'
            + '- `.agg(["mean", "max"])` — several aggregations at once, as a small '
            + 'frame.\n\n'
            + 'Read the incantation right to left: *of the unrest, within each '
            + 'house, the mean.* Split, apply, combine — the whole trade of the '
            + 'analyst in three words.',
          code: py`import pandas as pd

ledger = pd.DataFrame({
    "name": ["Elspeth", "Odo", "Marlow", "Tace", "Ivo"],
    "house": ["Vane", "Grimm", "Vane", "Grimm", "Hollow"],
    "unrest": [7.0, 3.0, 9.0, 4.0, 2.0],
})
print(ledger.groupby("house")["unrest"].mean())
print(ledger.groupby("house").size())`,
        },
        {
          heading: 'The missing dead',
          body: 'A blank cell arrives in the frame as `NaN` — *not a number*, the '
            + 'mark of absence. It is a treacherous guest:\n\n'
            + '- `NaN` refuses equality, **even with itself** — never test a gap '
            + 'with `==`. Ask `.isna()` instead.\n'
            + '- `.fillna(value)` fills the gaps with a value of your choosing.\n'
            + '- `.dropna(subset=["name"])` drops the rows that are missing a value '
            + 'in the named columns — and only those.\n\n'
            + 'Neither cure is innocent. Filling invents a number; dropping buries a '
            + 'record. The only sin is doing either without deciding — a mean taken '
            + 'over silent gaps is a lie with a clean conscience (pandas skips NaN '
            + 'in `.mean()` by default, whether you noticed the gaps or not).',
          code: py`import pandas as pd
import numpy as np

ledger = pd.DataFrame({
    "name": ["Elspeth", None, "Ivo"],
    "unrest": [7.0, 4.0, np.nan],
})
print(ledger.isna().sum().tolist())              # [1, 1] — one gap per column
print(ledger["unrest"].fillna(0.0).tolist())     # [7.0, 4.0, 0.0]
print(ledger.dropna(subset=["name"]).shape)      # (2, 2) — the nameless entry gone`,
        },
        {
          heading: 'Raising a frame from raw text',
          body: 'Ledgers rarely arrive as tidy dicts. They arrive as **text** — '
            + 'comma-separated lines with a header row. `pd.read_csv` parses such '
            + 'text into a frame, inferring column names from the header and types '
            + 'from the values.\n\n'
            + 'read_csv expects a file, but `io.StringIO` wraps any string so it can '
            + 'be read like one — and in the Forge, where every dataset is conjured '
            + 'in code, that wrapping is the standard rite. Empty fields in the text '
            + 'become `NaN` in the frame, which is precisely where the last section '
            + 'begins to matter.',
          code: py`import io
import pandas as pd

RAW = "name,house,unrest\nElspeth,Vane,7.0\nOdo,Grimm,3.0\n"
ledger = pd.read_csv(io.StringIO(RAW))
print(ledger.shape)      # (2, 3)
print(ledger["unrest"].sum())   # 10.0 — parsed as numbers, not text`,
        },
      ],
      challenge: {
        title: 'The Unquiet Census',
        prompt: 'A raw page of the Ledger is conjured below — gap-shot, unordered, '
          + 'exactly as the ninth-century clerks left it. Build the instruments '
          + 'that put it in order. All four must work on **any** ledger text or '
          + 'frame with these columns.\n\n'
          + '- `clean_ledger(text)` — parse the CSV text with `pd.read_csv` and '
          + '`io.StringIO`, **drop** every row whose `name` is missing, **fill** '
          + 'every missing `unrest` with `0.0`, and return the frame.\n'
          + '- `unrest_by_house(df)` — return the mean unrest per house '
          + '(a Series from `groupby`).\n'
          + '- `most_common_house(df)` — return the house name that appears most '
          + 'often (use `value_counts`).\n'
          + '- `heaviest(df, n)` — return a plain **list** of the `n` names with '
          + 'the highest unrest, highest first (use `sort_values`; `.tolist()` at '
          + 'the end).',
        starter: py`import io
import pandas as pd

RAW = """name,house,unrest
Elspeth,Vane,4.0
Odo,Grimm,7.0
,Vane,9.0
Marlow,Vane,6.0
Tace,Grimm,
Ivo,Hollow,2.0
Rook,Vane,8.0
"""

def clean_ledger(text):
    # TODO: read the CSV text (io.StringIO), drop nameless rows,
    #       fill missing unrest with 0.0, return the frame
    pass

def unrest_by_house(df):
    # TODO: mean unrest per house (groupby)
    pass

def most_common_house(df):
    # TODO: the house that appears most often (value_counts)
    pass

def heaviest(df, n):
    # TODO: list of the n most restless names, highest first
    pass

ledger = clean_ledger(RAW)
print(ledger)`,
        solution: py`import io
import pandas as pd

RAW = """name,house,unrest
Elspeth,Vane,4.0
Odo,Grimm,7.0
,Vane,9.0
Marlow,Vane,6.0
Tace,Grimm,
Ivo,Hollow,2.0
Rook,Vane,8.0
"""

def clean_ledger(text):
    df = pd.read_csv(io.StringIO(text))
    df = df.dropna(subset=["name"])
    df["unrest"] = df["unrest"].fillna(0.0)
    return df

def unrest_by_house(df):
    return df.groupby("house")["unrest"].mean()

def most_common_house(df):
    return df["house"].value_counts().index[0]

def heaviest(df, n):
    return df.sort_values("unrest", ascending=False).head(n)["name"].tolist()

ledger = clean_ledger(RAW)
print(ledger)
print(unrest_by_house(ledger))
print(most_common_house(ledger))
print(heaviest(ledger, 3))`,
        hints: [
          'clean_ledger reads pd.read_csv(io.StringIO(text)), then dropna(subset=["name"]), then fills only the unrest column: df["unrest"] = df["unrest"].fillna(0.0).',
          'unrest_by_house is df.groupby("house")["unrest"].mean(). most_common_house: value_counts() puts the winner first, so take .index[0].',
          'heaviest: df.sort_values("unrest", ascending=False).head(n)["name"].tolist() — sort, take the top n, keep the names, make it a list.',
        ],
        validation: py`import io
import pandas as pd
_text = "name,house,unrest\nWren,Hollow,5.0\nSorrel,Vane,8.0\n,Grimm,4.0\nBram,Vane,\nHollis,Grimm,3.0\nNance,Vane,6.0\n"
_df = clean_ledger(_text)
assert _df is not None, "clean_ledger must return the cleaned frame — did you forget the return?"
assert _df.shape == (5, 3), "exactly one row is nameless and must be dropped — expected 5 souls and 3 columns after cleaning"
assert int(_df["name"].isna().sum()) == 0, "no nameless rows may survive — dropna(subset=[name column])"
assert int(_df["unrest"].isna().sum()) == 0, "no unrest may remain missing — fillna(0.0) on the unrest column"
_bram = _df.loc[_df["name"] == "Bram", "unrest"]
assert len(_bram) == 1 and abs(float(_bram.iloc[0]) - 0.0) < 1e-9, "Bram has a name but no unrest — his gap must be filled with 0.0, not dropped"
_clean = clean_ledger("name,house,unrest\nAldous,Vane,1.0\n")
assert _clean.shape == (1, 3), "a ledger with nothing missing must pass through unharmed"
_by = unrest_by_house(_df)
assert abs(float(_by["Grimm"]) - 3.0) < 1e-9, "Grimm holds one soul at 3.0 (its nameless dead was dropped) — mean unrest 3.0"
assert abs(float(_by["Hollow"]) - 5.0) < 1e-9, "Hollow holds Wren alone — mean unrest 5.0"
assert abs(float(_by["Vane"]) - 14.0 / 3.0) < 1e-9, "Vane holds Sorrel (8.0), Bram (filled 0.0) and Nance (6.0) — the filled gap counts in the mean"
assert most_common_house(_df) == "Vane", "Vane holds three of the five souls — value_counts puts it first"
assert heaviest(_df, 2) == ["Sorrel", "Nance"], "heaviest(df, 2) must be the two highest unrest values, highest first, as a plain list of names"
assert heaviest(_df, 0) == [], "asking for none must return an empty list"
assert heaviest(_df, 99) == ["Sorrel", "Nance", "Wren", "Hollis", "Bram"], "asking for more than exist must return them all, most restless first"`,
        successText: 'The census closes clean: every gap decided, every house counted, the restless ranked from loudest down.',
        xp: 95,
      },
      quiz: [
        {
          q: 'A value in the ledger is `NaN`. How do you test for it?',
          options: [
            'value == np.nan',
            'value is None',
            'with .isna() — NaN refuses equality, even with itself',
            'value == "NaN"',
          ],
          answer: 2,
          explain: 'NaN == NaN is False by definition, so equality can never find a '
            + 'gap. isna() exists precisely because absence must be asked about, not '
            + 'compared with.',
        },
        {
          q: 'What does `ledger.dropna(subset=["name"])` drop?',
          options: [
            'Only rows whose name is missing — gaps in other columns survive',
            'Every row containing any missing value',
            'The name column itself',
            'Nothing — it fills the gaps with 0',
          ],
          answer: 0,
          explain: 'subset restricts the verdict to the named columns. Without it, '
            + 'dropna condemns any row with a gap anywhere — usually far more of the '
            + 'ledger than you intended to bury.',
        },
        {
          q: '`ledger.groupby("house")["unrest"].mean()` returns…',
          options: [
            'a single number — the mean unrest of the whole ledger',
            'a Series with one mean per house, indexed by house',
            'a list of houses in ledger order',
            'the ledger sorted by house',
          ],
          answer: 1,
          explain: 'groupby gathers the rows by house, then the aggregation collapses '
            + 'each gathering to one value: a Series whose index is the houses. '
            + 'Split, apply, combine.',
        },
        {
          q: 'In what order does `value_counts()` present its counts?',
          options: [
            'Alphabetical by value',
            'The order values first appear',
            'Random order',
            'Most frequent first — descending by count',
          ],
          answer: 3,
          explain: 'value_counts is a ranked census: the commonest value leads. That '
            + 'is why .index[0] of the result is the single most common value.',
        },
      ],
    },

    // ----------------------------------------------------------------
    // a6l6 — sqlite3 in-memory SQL + BeautifulSoup HTML parsing
    // ----------------------------------------------------------------
    {
      id: 'a6l6',
      title: 'Interrogating the Archives',
      concept: 'querying sqlite3 databases and parsing HTML with BeautifulSoup',
      xp: 40,
      narrative: 'Not every archive surrenders its rows. Deeper than the Ledger lie '
        + 'the sealed stacks — records that answer only when questioned in their own '
        + 'tongue, **SQL**, through a database that lives and dies in memory. And '
        + 'above ground, the *Seer’s Gazette* publishes prophecy wrapped in the '
        + 'markup of its pages, blockquote by blockquote, daring you to dig the '
        + 'words out of the tags. Two tongues, one discipline: connect, ask '
        + 'precisely, and read back only what you asked for.',
      sections: [
        {
          heading: 'A database from thin air',
          body: 'Python ships with a whole relational database in its standard '
            + 'library: `sqlite3`. Pass `connect` the name `":memory:"` and the '
            + 'database exists nowhere but in the moment — born empty, gone when '
            + 'the run ends. The working pattern:\n\n'
            + '- `conn = sqlite3.connect(":memory:")` — open the archive.\n'
            + '- `cur = conn.cursor()` — the **cursor** is your speaking-tube: it '
            + 'executes statements and holds results.\n'
            + '- `cur.execute("CREATE TABLE ...")` — declare a table and its typed '
            + 'columns.\n'
            + '- `cur.executemany("INSERT INTO ... VALUES (?, ?, ?)", rows)` — '
            + 'insert a whole list of tuples, one per row.\n'
            + '- `conn.commit()` — seal the changes.\n\n'
            + 'For convenience, `conn.execute(...)` conjures a cursor for you and '
            + 'returns it — you will see both styles everywhere.',
          code: py`import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("CREATE TABLE prophecies (seer TEXT, year INTEGER, dread INTEGER)")
rows = [("Morwen", 1899, 7), ("Cassilda", 1921, 3), ("Morwen", 1907, 9)]
cur.executemany("INSERT INTO prophecies VALUES (?, ?, ?)", rows)
conn.commit()
print(cur.execute("SELECT COUNT(*) FROM prophecies").fetchone())   # (3,)`,
          note: 'The `?` marks are placeholders: the values ride separately and are '
            + 'bound as pure data. Never paste values into the SQL string itself — a '
            + 'hostile name pasted into a query can rewrite the query. The '
            + 'placeholder keeps data from ever becoming command.',
        },
        {
          heading: 'The four verbs of asking',
          body: 'Queries are sentences in a rigid grammar, and four clauses carry '
            + 'nearly everything:\n\n'
            + '- `SELECT seer, year FROM prophecies` — which columns, from which '
            + 'table.\n'
            + '- `WHERE dread >= 5` — keep only the rows that qualify.\n'
            + '- `ORDER BY year` — sort the answer (add `DESC` to reverse).\n'
            + '- `GROUP BY seer` — gather rows per seer so aggregates like '
            + '`COUNT(*)` and `AVG(dread)` answer once per group — SQL’s own '
            + '`groupby`.\n\n'
            + '`cur.fetchall()` then returns the entire answer as a **list of '
            + 'tuples**, one tuple per row; `fetchone()` returns just the first.',
          code: py`import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("CREATE TABLE prophecies (seer TEXT, year INTEGER, dread INTEGER)")
cur.executemany("INSERT INTO prophecies VALUES (?, ?, ?)",
                [("Morwen", 1899, 7), ("Cassilda", 1921, 3), ("Morwen", 1907, 9)])

print(cur.execute(
    "SELECT seer, year FROM prophecies WHERE dread >= ? ORDER BY year",
    (5,),
).fetchall())   # [('Morwen', 1899), ('Morwen', 1907)]

print(cur.execute(
    "SELECT seer, COUNT(*), AVG(dread) FROM prophecies GROUP BY seer ORDER BY seer"
).fetchall())   # [('Cassilda', 1, 3.0), ('Morwen', 2, 8.0)]`,
        },
        {
          heading: 'Reading the scraped page',
          body: 'The Gazette does not export CSV. It publishes **HTML** — text '
            + 'nested in tags — and what a scraper fetches is one long string of '
            + 'it. **BeautifulSoup** (from the `bs4` library) parses that string '
            + 'into a tree you can question:\n\n'
            + '- `soup = BeautifulSoup(page, "html.parser")` — parse.\n'
            + '- `soup.find("h1")` — the **first** matching tag, or `None`.\n'
            + '- `soup.find_all("blockquote")` — a **list** of every match.\n'
            + '- `tag.get_text()` — the human words inside a tag, with all nested '
            + 'markup stripped away.\n\n'
            + 'The Forge carries bs4 already; summon it and parse. Real pages are '
            + 'messier than any example — attributes, broken nesting, decorative '
            + 'tags — which is precisely why one uses a parser instead of hunting '
            + 'substrings by hand.',
          code: py`from bs4 import BeautifulSoup

page = """
<html><body>
<h1>The Gazette of Omens</h1>
<blockquote>He comes <em>twice</em>.</blockquote>
<blockquote>The ninth door opens inward.</blockquote>
</body></html>
"""
soup = BeautifulSoup(page, "html.parser")
print(soup.find("h1").get_text())        # The Gazette of Omens
for quote in soup.find_all("blockquote"):
    print(quote.get_text())`,
          note: 'The sealed stacks speak other tongues too: some archives are '
            + '**document stores** that hold nested records and are queried by '
            + 'example rather than by table, and some pages live on remote servers '
            + 'that must be fetched over the wire before parsing begins. The verbs '
            + 'do not change — connect, ask, read — only the dialect does. No code '
            + 'for those tonight; know that the doors exist.',
        },
      ],
      challenge: {
        title: 'The Interrogation',
        prompt: 'The sealed stacks will open for one night. Build the instruments '
          + 'of interrogation — three for the database, one for the Gazette.\n\n'
          + '- `load_archive(records)` — create an in-memory sqlite3 database '
          + '**inside the function**, create a table named `prophecies` with '
          + 'columns `seer TEXT, year INTEGER, dread INTEGER`, insert every record '
          + '(a list of `(seer, year, dread)` tuples) using `?` placeholders, and '
          + 'return the connection.\n'
          + '- `dire(conn, threshold)` — return `fetchall()` of the `(seer, year)` '
          + 'pairs whose dread is **at least** `threshold`, ordered by year '
          + 'ascending.\n'
          + '- `tally(conn)` — return `fetchall()` of `(seer, count)` pairs — how '
          + 'many prophecies each seer spoke — ordered alphabetically by seer. '
          + '`GROUP BY` does the gathering.\n'
          + '- `voices(html)` — parse the HTML string with BeautifulSoup and '
          + 'return a list of the text of every `blockquote` tag, in page order.',
        starter: py`import sqlite3
from bs4 import BeautifulSoup

records = [
    ("Morwen", 1899, 7),
    ("Cassilda", 1921, 3),
    ("Morwen", 1907, 9),
    ("Thibault", 1874, 5),
]

PAGE = "<html><body><h1>Gazette</h1><blockquote>He comes twice.</blockquote><blockquote>The ninth door opens inward.</blockquote></body></html>"

def load_archive(records):
    # TODO: connect(":memory:"), CREATE TABLE prophecies
    #       (seer TEXT, year INTEGER, dread INTEGER),
    #       insert every record with ? placeholders, return the connection
    pass

def dire(conn, threshold):
    # TODO: SELECT seer, year ... WHERE dread >= ? ORDER BY year — fetchall
    pass

def tally(conn):
    # TODO: SELECT seer, COUNT(*) ... GROUP BY seer ORDER BY seer — fetchall
    pass

def voices(html):
    # TODO: BeautifulSoup — the text of every blockquote, as a list
    pass

archive = load_archive(records)
print(dire(archive, 5))
print(voices(PAGE))`,
        solution: py`import sqlite3
from bs4 import BeautifulSoup

records = [
    ("Morwen", 1899, 7),
    ("Cassilda", 1921, 3),
    ("Morwen", 1907, 9),
    ("Thibault", 1874, 5),
]

PAGE = "<html><body><h1>Gazette</h1><blockquote>He comes twice.</blockquote><blockquote>The ninth door opens inward.</blockquote></body></html>"

def load_archive(records):
    conn = sqlite3.connect(":memory:")
    conn.execute("CREATE TABLE prophecies (seer TEXT, year INTEGER, dread INTEGER)")
    conn.executemany("INSERT INTO prophecies VALUES (?, ?, ?)", records)
    conn.commit()
    return conn

def dire(conn, threshold):
    return conn.execute(
        "SELECT seer, year FROM prophecies WHERE dread >= ? ORDER BY year",
        (threshold,),
    ).fetchall()

def tally(conn):
    return conn.execute(
        "SELECT seer, COUNT(*) FROM prophecies GROUP BY seer ORDER BY seer"
    ).fetchall()

def voices(html):
    soup = BeautifulSoup(html, "html.parser")
    return [q.get_text() for q in soup.find_all("blockquote")]

archive = load_archive(records)
print(dire(archive, 5))
print(tally(archive))
print(voices(PAGE))`,
        hints: [
          'load_archive: conn = sqlite3.connect(":memory:"); conn.execute the CREATE TABLE; conn.executemany("INSERT INTO prophecies VALUES (?, ?, ?)", records); return conn.',
          'dire passes the threshold as a one-element tuple: conn.execute("... WHERE dread >= ? ORDER BY year", (threshold,)).fetchall(). tally is SELECT seer, COUNT(*) FROM prophecies GROUP BY seer ORDER BY seer.',
          'voices: soup = BeautifulSoup(html, "html.parser"), then [q.get_text() for q in soup.find_all("blockquote")].',
        ],
        validation: py`_records = [("Morwen", 1899, 7), ("Cassilda", 1921, 3), ("Morwen", 1907, 9), ("Thibault", 1874, 5)]
_conn = load_archive(_records)
assert _conn is not None, "load_archive must return the open connection"
_n = _conn.execute("SELECT COUNT(*) FROM prophecies").fetchone()[0]
assert _n == 4, "the table prophecies must hold every record handed in — expected 4 rows"
assert dire(_conn, 5) == [("Thibault", 1874), ("Morwen", 1899), ("Morwen", 1907)], "dire must return (seer, year) pairs with dread at least the threshold, ordered by year ascending"
assert dire(_conn, 100) == [], "when no prophecy is dire enough, fetchall naturally returns an empty list"
assert dire(_conn, 3) == [("Thibault", 1874), ("Morwen", 1899), ("Morwen", 1907), ("Cassilda", 1921)], "at least means >= — a prophecy exactly at the threshold qualifies"
assert tally(_conn) == [("Cassilda", 1), ("Morwen", 2), ("Thibault", 1)], "tally must GROUP BY seer, COUNT(*) each group, and order alphabetically by seer"
_conn2 = load_archive([("Wren", 2001, 1)])
assert _conn2.execute("SELECT seer FROM prophecies").fetchall() == [("Wren",)], "every call to load_archive must conjure a FRESH archive — connect to :memory: inside the function"
_html = '<html><body><h1>Gazette</h1><blockquote>He comes <em>twice</em>.</blockquote><p>advertisement</p><blockquote>The ninth door opens inward.</blockquote></body></html>'
_v = voices(_html)
assert isinstance(_v, list), "voices must return a list of strings"
assert [s.strip() for s in _v] == ["He comes twice.", "The ninth door opens inward."], "voices must return the text of every blockquote in page order — get_text() flattens the nested tags"
assert voices("<html><body><p>No prophecy spoke today.</p></body></html>") == [], "a page with no blockquotes must yield an empty list"`,
        successText: 'The stacks answer in rows and the Gazette gives up its buried voices — no archive in the building can refuse you now.',
        xp: 95,
      },
      quiz: [
        {
          q: 'After `cur.execute("SELECT seer, year FROM prophecies")`, what does `cur.fetchall()` return?',
          options: [
            'A DataFrame',
            'A list of tuples — one tuple per matching row',
            'A dict mapping seer to year',
            'One long comma-separated string',
          ],
          answer: 1,
          explain: 'fetchall drains the cursor into a plain list of row-tuples, in '
            + 'query order. fetchone returns only the first row — handy for COUNT(*) '
            + 'queries that answer with a single tuple.',
        },
        {
          q: 'Why write `WHERE dread >= ?` and pass the value separately, instead of pasting it into the SQL string?',
          options: [
            'Pasting values is a syntax error in sqlite3',
            '? placeholders work only with strings',
            'The ? form is required for ORDER BY to function',
            'Binding keeps data as data — a hostile value pasted into the string could rewrite the query itself',
          ],
          answer: 3,
          explain: 'Placeholders bind values outside the SQL grammar, so no value can '
            + 'ever become a command. Pasting works — right up until someone feeds '
            + 'your query a value crafted to escape it.',
        },
        {
          q: 'What does `GROUP BY seer` do to the rows?',
          options: [
            'Gathers rows sharing a seer so aggregates (COUNT, AVG…) answer once per seer',
            'Sorts the rows by seer',
            'Removes duplicate seers, keeping first rows',
            'Joins the table to itself on seer',
          ],
          answer: 0,
          explain: 'GROUP BY is SQL’s gathering: each distinct seer becomes one '
            + 'output row, and the aggregate functions collapse that seer’s rows '
            + 'into it. Sorting is ORDER BY — a different clause entirely.',
        },
        {
          q: 'In BeautifulSoup, `find` versus `find_all`:',
          options: [
            'find searches by id, find_all by class',
            'find returns text, find_all returns tags',
            'find returns the first matching tag (or None); find_all returns a list of every match',
            'They are aliases for the same method',
          ],
          answer: 2,
          explain: 'find is the singular question, find_all the plural. Both return '
            + 'tag objects; get_text() is the further step that digs the words out '
            + 'of a tag.',
        },
      ],
    },

    // ----------------------------------------------------------------
    // a6l7 — statistics: weighted/trimmed means, median,
    //        variance/std, z-scores, MAD, naming outliers
    // ----------------------------------------------------------------
    {
      id: 'a6l7',
      title: 'The Weight of Truth',
      concept: 'weighted and trimmed means, median, variance, standard deviation, z-scores, and MAD',
      xp: 40,
      narrative: 'One orb on the ninth shelf screams. It has screamed for a century, '
        + 'and every clerk who ever averaged that shelf reported a hall in crisis — '
        + 'because a single monstrous number drags the mean wherever it pleases, and '
        + 'the mean goes willingly. The Keeper’s ledger is full of such lies told by '
        + 'honest arithmetic. Tonight you learn the counter-craft: means that weigh '
        + 'their witnesses, means that trim their extremes, the median that cannot '
        + 'be bribed, and the z-score — the instrument that does not silence the '
        + 'screamer, but names it, measures it, and writes down exactly how far from '
        + 'truth it stands.',
      sections: [
        {
          heading: 'The mean, and how it lies',
          body: 'The **mean** — sum divided by count — is the first number anyone '
            + 'computes and the first that misleads. Two failures matter tonight.\n\n'
            + 'First: not every witness deserves an equal voice. Average the *mean '
            + 'dread per wing* across a wing of nine thousand orbs and a wing of '
            + 'one hundred, and the plain mean lets the small wing shout as loudly '
            + 'as the large. The **weighted mean** — `np.average(values, '
            + 'weights=w)` — multiplies each value by its weight, sums, and divides '
            + 'by the total weight: every orb counted once, no wing counted twice.\n\n'
            + 'Second: a single extreme drags the mean toward itself without limit. '
            + 'For that failure, read on.',
          code: py`import numpy as np

wing_means = np.array([4.0, 10.0])   # mean dread per wing
wing_sizes = np.array([9000, 100])   # how many orbs each wing holds

print(wing_means.mean())                            # 7.0 — the small wing shouts
print(np.average(wing_means, weights=wing_sizes))   # 4.06... — every orb counted once`,
        },
        {
          heading: 'Trimming, and the incorruptible median',
          body: 'When extremes cannot be trusted, blunt their voice:\n\n'
            + '- The **trimmed mean** sorts the data — `np.sort` — slices off the k '
            + 'lowest and k highest, and averages what remains. The scream is '
            + 'simply not invited.\n'
            + '- The **median** — `np.median` — is the middle value of the sorted '
            + 'data (the average of the middle two when the count is even). Make '
            + 'the largest value ten times larger and the median does not move at '
            + 'all: it is **robust**, and the mean is not.\n\n'
            + 'When mean and median disagree badly, believe neither — something in '
            + 'the data is screaming, and your next task is to find it.',
          code: py`import numpy as np

days = np.array([3, 4, 4, 5, 6, 200])   # one miracle... or one lie
print(days.mean())        # 37.0 — dragged
print(np.median(days))    # 4.5 — unmoved

srt = np.sort(days)
print(srt[1:-1].mean())   # 4.75 — trimmed: deaf to both extremes`,
        },
        {
          heading: 'Spread, and the standard candle',
          body: 'Two shelves can share a mean and share nothing else — one placid, '
            + 'one violent. **Variance** (`.var()`) is the mean of the squared '
            + 'distances from the mean; its square root, the **standard deviation** '
            + '(`.std()`), speaks in the data’s own units and serves as its '
            + 'standard candle. For bell-shaped data, roughly 68% of readings fall '
            + 'within one standard deviation of the mean, and 95% within two.\n\n'
            + 'Divide each reading’s distance from the mean by that candle and you '
            + 'get its **z-score**:\n\n'
            + '- `z = (x - mean) / std`\n'
            + '- z near 0 — unremarkable. z past ±2 — far into a tail. z past ±3 — '
            + 'begin asking questions.\n\n'
            + 'One rite differs between tools: numpy’s `.std()` divides by n; '
            + 'pandas’ `.std()` divides by n−1 (the sample convention, `ddof=1`). '
            + 'Both are lawful. Know which your instrument performs, or your '
            + 'z-scores will drift.',
          code: py`import numpy as np

dread = np.array([2, 4, 4, 4, 5, 5, 7, 9])
print(dread.mean())   # 5.0
print(dread.var())    # 4.0 — mean squared distance
print(dread.std())    # 2.0 — back in dread-units

z = (dread - dread.mean()) / dread.std()
print(z)              # [-1.5 -0.5 -0.5 -0.5  0.   0.   1.   2. ]`,
        },
        {
          heading: 'MAD, and the naming of outliers',
          body: 'The z-score has a quiet flaw: the mean and std it stands on are '
            + 'themselves dragged by the very outliers it hunts. The robust '
            + 'alternative is the **median absolute deviation**:\n\n'
            + '- `MAD = median(|x - median(x)|)`\n\n'
            + '— the typical distance from the middle, judged by the middle. No '
            + 'single screamer can move it.\n\n'
            + 'The full rite of naming: compute each reading’s z-score, choose a '
            + 'limit (2 or 3 standard candles, by the stakes), and name every '
            + 'reading whose `abs(z)` exceeds it. An outlier so named is not yet '
            + 'guilt — it is a summons for questioning. Some outliers are clerks’ '
            + 'errors. Some are miracles. Some are the one true warning in ten '
            + 'thousand quiet records.',
          code: py`import numpy as np

dread = np.array([1, 1, 2, 2, 4, 6, 9])
med = np.median(dread)
mad = np.median(np.abs(dread - med))
print(med)   # 2.0
print(mad)   # 1.0 — the typical distance from the middle`,
        },
        {
          heading: 'Bytes, and the fingerprint of the sealed',
          body: 'Beneath its ink, every record in the Hall is a run of **bytes** — whole '
            + 'numbers from 0 to 255 — and the distribution of those values is a '
            + 'fingerprint. Count how often each value occurs with '
            + '`np.bincount(data, minlength=256)` — one count per possible byte — and '
            + 'read the shape:\n\n'
            + '- Ordinary script clusters in a **narrow band**: letters, digits, and '
            + 'spaces carry nearly everything, while two hundred other bins sit close '
            + 'to empty. The profile is lumpy, its spread enormous.\n'
            + '- Enchanted contents — **encrypted or compressed** — spread almost '
            + 'perfectly evenly across all 256 values. Nothing favored, nothing '
            + 'spared. The profile is flat.\n\n'
            + 'So the tell runs backwards from every other hunt tonight: here it is a '
            + '**low** relative standard deviation across the bin counts — '
            + '`counts.std() / counts.mean()` — that betrays the sealed thing. Honest '
            + 'structure is lumpy; enchantment is flat.',
          code: py`import numpy as np

rng = np.random.default_rng(9)
mundane = rng.integers(97, 123, 4096)   # letter-bytes: a narrow band of values
sealed = rng.integers(0, 256, 4096)     # enchanted: every byte value equally likely

for name, blob in [("mundane", mundane), ("sealed", sealed)]:
    counts = np.bincount(blob, minlength=256)   # one count per byte value 0..255
    spread = counts.std() / counts.mean()       # relative spread of the profile
    verdict = "SEALED" if spread < 0.5 else "plain"
    print(name, round(float(spread), 2), verdict)
# mundane 2.99 plain
# sealed 0.25 SEALED`,
          note: 'The Unspeakables read whole shelves this way without breaking a single '
            + 'seal: no record need be opened for its bytes to confess. What ciphering '
            + 'hides, its own flatness reveals to be hidden.',
        },
      ],
      challenge: {
        title: 'Naming the Screamer',
        prompt: 'The Keeper empties a shelf onto your table and demands the full '
          + 'arithmetic of honesty. Write five functions (each accepts a list or a '
          + '1-D numpy array of numbers):\n\n'
          + '- `weighted_mean(values, weights)` — the weighted mean, via '
          + '`np.average`.\n'
          + '- `trimmed_mean(values, k)` — sort the values, drop the `k` lowest '
          + 'and `k` highest, return the mean of the rest. `k=0` must return the '
          + 'plain mean — mind your slice.\n'
          + '- `z_scores(values)` — the array of z-scores, `(x - mean) / std`, '
          + 'using numpy’s std (the default, dividing by n).\n'
          + '- `mad(values)` — the median absolute deviation: '
          + '`median(|x - median|)`.\n'
          + '- `name_outliers(names, values, limit)` — z-score the values, and '
          + 'return the **list** of names whose `abs(z)` is **strictly greater** '
          + 'than `limit`, in the given order.',
        starter: py`import numpy as np

def weighted_mean(values, weights):
    # TODO: np.average with weights
    pass

def trimmed_mean(values, k):
    # TODO: np.sort, slice away k from each end, mean the rest
    #       (careful: a slice ending at -0 is empty — handle k=0)
    pass

def z_scores(values):
    # TODO: (values - mean) / std, as an array
    pass

def mad(values):
    # TODO: median of the absolute deviations from the median
    pass

def name_outliers(names, values, limit):
    # TODO: names whose abs(z) exceeds the limit, in order
    pass

dread = np.array([2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0])
print(z_scores(dread))`,
        solution: py`import numpy as np

def weighted_mean(values, weights):
    return float(np.average(values, weights=weights))

def trimmed_mean(values, k):
    srt = np.sort(np.asarray(values, dtype=float))
    srt = srt[k:len(srt) - k]
    return float(srt.mean())

def z_scores(values):
    v = np.asarray(values, dtype=float)
    return (v - v.mean()) / v.std()

def mad(values):
    v = np.asarray(values, dtype=float)
    return float(np.median(np.abs(v - np.median(v))))

def name_outliers(names, values, limit):
    z = z_scores(values)
    return [name for name, score in zip(names, z) if abs(score) > limit]

dread = np.array([2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0])
print(z_scores(dread))`,
        hints: [
          'weighted_mean is one line: np.average(values, weights=weights). mad is np.median(np.abs(v - np.median(v))).',
          'trimmed_mean: srt = np.sort(np.asarray(values, dtype=float)), then slice srt[k:len(srt) - k] — writing srt[k:-k] breaks when k is 0, because -0 is 0 and the slice comes back empty.',
          'name_outliers: compute z = z_scores(values), then [name for name, score in zip(names, z) if abs(score) > limit].',
        ],
        validation: py`import numpy as np
_w = weighted_mean([2.0, 4.0], [1.0, 3.0])
assert _w is not None, "weighted_mean must return a number — np.average(values, weights=weights)"
assert abs(_w - 3.5) < 1e-9, "weighted_mean([2, 4], [1, 3]) is (2*1 + 4*3) / 4 = 3.5"
assert abs(weighted_mean([4.0, 10.0], [9.0, 1.0]) - 4.6) < 1e-9, "the heavy witness must dominate: weighted_mean([4, 10], [9, 1]) = 4.6"
assert abs(weighted_mean([10.0, 20.0, 30.0], [1.0, 1.0, 1.0]) - 20.0) < 1e-9, "with equal weights the weighted mean must equal the plain mean"
assert abs(trimmed_mean([100.0, 1.0, 3.0, 2.0, 4.0], 1) - 3.0) < 1e-9, "trimmed_mean must SORT first, then drop 1 from each end: the mean of 2, 3, 4 is 3.0"
assert abs(trimmed_mean([1.0, 2.0, 3.0, 4.0], 0) - 2.5) < 1e-9, "with k=0 nothing is trimmed — beware the empty slice srt[0:-0]"
assert abs(trimmed_mean([5.0, 1.0, 5.0, 9.0, 5.0, 5.0], 2) - 5.0) < 1e-9, "k=2 must drop the TWO lowest and TWO highest after sorting"
_z = z_scores(np.array([2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0]))
assert _z is not None, "z_scores must return an array"
assert np.allclose(_z, [-1.5, -0.5, -0.5, -0.5, 0.0, 0.0, 1.0, 2.0]), "z = (value - mean) / std, with numpy std (divide by n): mean 5.0, std 2.0"
assert abs(float(np.mean(_z))) < 1e-9, "z-scores always centre on zero — check your mean"
assert abs(mad(np.array([1.0, 1.0, 2.0, 2.0, 4.0, 6.0, 9.0])) - 1.0) < 1e-9, "mad: the median is 2, the absolute deviations are [1, 1, 0, 0, 2, 4, 7], and their median is 1.0"
assert abs(mad(np.array([5.0, 5.0, 5.0])) - 0.0) < 1e-9, "identical readings deviate not at all — mad must be 0.0"
_names = ["Elspeth", "Odo", "Marlow", "Tace", "Ivo", "Rook", "Wren", "Hollis"]
_vals = np.array([2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0])
assert name_outliers(_names, _vals, 1.5) == ["Hollis"], "only Hollis stands strictly beyond |z| = 1.5 here — Elspeth sits exactly AT 1.5, and exactly-at is not beyond"
assert name_outliers(_names, _vals, 0.9) == ["Elspeth", "Wren", "Hollis"], "every name with abs(z) beyond the limit, in the given order"
assert name_outliers(_names, _vals, 5.0) == [], "when none stray far enough, name no one — an empty list"`,
        successText: 'The screamer has a name, a distance, and a file — and the mean, for once, tells the truth.',
        xp: 100,
      },
      quiz: [
        {
          q: 'One monstrous value joins a set of ordinary readings. Which measure barely moves?',
          options: [
            'The mean',
            'The sum',
            'The median',
            'The variance',
          ],
          answer: 2,
          explain: 'The median cares only about the middle of the sorted order, so '
            + 'one extreme value cannot drag it. Mean, sum, and variance all follow '
            + 'the screamer — variance most violently, since distances are squared.',
        },
        {
          q: 'When every weight is equal, `np.average(values, weights=w)` equals…',
          options: [
            'the plain mean of the values',
            'the median of the values',
            'the sum of the values',
            'zero',
          ],
          answer: 0,
          explain: 'Equal weights cancel out of the formula, leaving sum-over-count. '
            + 'Weights matter only when witnesses deserve unequal voices — sites of '
            + 'different sizes, shelves of different counts.',
        },
        {
          q: 'A reading has a z-score of −2.5. What does that say?',
          options: [
            'The reading itself is negative',
            'The reading is 2.5 units below the mean',
            'The reading occurred 2.5 standard deviations ago',
            'It lies 2.5 standard deviations below the mean — far into the left tail',
          ],
          answer: 3,
          explain: 'The z-score speaks in standard deviations, not raw units — that '
            + 'is what makes it comparable across shelves with different scales. For '
            + 'bell-shaped data, beyond ±2 is already rare company.',
        },
        {
          q: '`np.std(x)` and pandas `x.std()` can disagree on the same data. Why?',
          options: [
            'pandas rounds to six decimal places',
            'numpy divides by n by default; pandas divides by n − 1 (ddof=1)',
            'numpy skips NaN values; pandas does not',
            'They cannot disagree',
          ],
          answer: 1,
          explain: 'Population versus sample convention — both lawful, and they '
            + 'converge as n grows. Pass ddof explicitly to make either tool perform '
            + 'the other’s rite. (And it is pandas that skips NaN, not numpy — that '
            + 'distractor runs backwards.)',
        },
        {
          q: 'You count a record’s bytes into 256 bins with `np.bincount(data, minlength=256)`, and the counts are nearly identical from 0 to 255. What does that suggest?',
          options: [
            'Ordinary text — letters always spread evenly across all byte values',
            'The record is empty',
            'Encrypted or compressed contents — enchantment spreads near-uniformly across all 256 values',
            'A counting error — real data never touches every bin',
          ],
          answer: 2,
          explain: 'Ordinary script clusters in a narrow band, leaving most bins near '
            + 'empty and the spread across counts high. Encryption and compression '
            + 'flatten the profile — every value about equally common — so a LOW '
            + 'relative standard deviation across the bin counts is the fingerprint '
            + 'of a sealed thing.',
        },
      ],
    },
  ],

  // ----------------------------------------------------------------
  // Boss — The Keeper of Prophecies
  // ----------------------------------------------------------------
  boss: {
    id: 'act6-boss',
    title: 'The Keeper of Prophecies',
    narrative: 'It has been counting since before the Ministry had a name. Every orb '
      + 'shelved, every soul entered, every seer’s average dread — the Keeper holds '
      + 'them all, and it does not tolerate error. It asks six questions, each drawn '
      + 'from a different aisle of what you now know. Then it hands you what it has '
      + 'never handed anyone: a raw ledger of its own orbs — gap-shot, uncleaned, '
      + 'one record screaming — and watches to see whether you can do alone what '
      + 'the Hall does: drop what cannot be trusted, fill what can, group and '
      + 'weigh, name the outlier by its distance from truth, and hang the evidence '
      + 'on the wall with its name written above it.',
    defeatText: 'The Keeper closes the ledger over your name and files you among the unverified — return when your numbers can bear its weight.',
    victoryText: 'The Keeper enters your name among the trusted, and every shelf in the Hall turns its light toward you.',
    xp: 475,
    flawlessBonus: 50,
    gauntlet: [
      {
        q: 'An Unspeakable lays out `np.array([[4, 9], [2, 7], [5, 5]])`. Its shape is…',
        options: [
          '(2, 3)',
          '(3, 2)',
          '6',
          '(3, 3)',
        ],
        answer: 1,
        explain: 'Three inner lists, each of two values: three rows of two, so the '
          + 'shape is (3, 2) — rows always come first. Six is the element count, the '
          + 'product of the shape.',
      },
      {
        q: 'What does `glow[glow > 6]` produce?',
        options: [
          'A new, possibly shorter array holding only the readings above 6',
          'A boolean array of True and False',
          'The count of readings above 6',
          'The original array with the offenders set to zero',
        ],
        answer: 0,
        explain: 'The comparison alone yields the boolean mask; placing the mask '
          + 'inside the brackets applies it, selecting the qualifying values. The '
          + 'count would be (glow > 6).sum(), and zeroing is np.where territory.',
      },
      {
        q: 'You begin `fig, ax = plt.subplots()`. The drawing calls — plot, hist, set_title — live on…',
        options: [
          'the plt module only',
          'the figure',
          'the axes, ax',
          'the backend',
        ],
        answer: 2,
        explain: 'The axes is the plot itself, and it carries the drawing methods. '
          + 'The figure is the sheet the axes lives on — and because the figure is '
          + 'an object, everything drawn on it can be interrogated afterward.',
      },
      {
        q: 'A ledger was filtered, so its row labels now run 0, 3, 4. Which is true?',
        options: [
          'ledger.loc[3] and ledger.iloc[3] select the same row',
          'ledger.loc[3] fails — label 3 no longer exists',
          'ledger.iloc[1] selects the row labeled 3 — loc goes by label, iloc by position',
          'After filtering, iloc selects by label too',
        ],
        answer: 2,
        explain: 'Labels travel with their rows; positions are recounted from zero '
          + 'every time. The second surviving row (position 1) is the one labeled 3 '
          + '— and iloc[3] would fail outright, since only three rows remain.',
      },
      {
        q: 'The archive answers `cur.fetchall()` with…',
        options: [
          'a list of tuples, one per row of the result',
          'a generator that must be seeded',
          'a DataFrame',
          'a dict keyed by primary key',
        ],
        answer: 0,
        explain: 'sqlite3 speaks in row-tuples gathered into a plain list. If you '
          + 'want a DataFrame, you build one from those tuples yourself — the cursor '
          + 'owes you nothing fancier.',
      },
      {
        q: 'Seventeen orbs read 2 through 8 — and one reads 44. Which pair of measures is least disturbed by the screamer?',
        options: [
          'mean and variance',
          'mean and standard deviation',
          'sum and mean',
          'median and MAD',
        ],
        answer: 3,
        explain: 'Median and MAD judge by the middle of the sorted order, which one '
          + 'extreme cannot reach. Mean, sum, variance, and std all follow the '
          + 'screamer — variance worst of all, since it squares the distance.',
      },
    ],
    finalChallenge: {
      title: 'The Keeper’s Reckoning',
      prompt: 'The raw ledger of eighteen prophecy orbs is conjured in the starter. '
        + 'Work it end to end, exactly as specified:\n\n'
        + '- Read `RAW` into a DataFrame named `ledger` with `pd.read_csv` and '
        + '`io.StringIO`.\n'
        + '- **Drop** every row whose `seer` is missing (`dropna` with `subset`).\n'
        + '- **Fill** the missing `dread` values with the **median** of the dread '
        + 'column.\n'
        + '- Set `by_seer` to the mean dread per seer — a Series from `groupby`.\n'
        + '- Add a column `z` to `ledger`: `(dread - mean) / std`, computed with '
        + 'numpy’s std (the default, dividing by n). Convert the column with '
        + '`.to_numpy()` first, or std will follow the pandas rite instead.\n'
        + '- Set `outlier_orbs` to the plain **list** (use `.tolist()`) of the '
        + '`orb` numbers whose `abs(z)` exceeds `3.0`.\n'
        + '- Raise a figure: a **histogram** of the cleaned dread with `bins=8`, '
        + 'titled exactly `The Weight of Prophecy`, x-axis `Dread`, y-axis `Orbs`.',
      starter: py`import io
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

RAW = """orb,seer,dread
9001,Morwen,4.0
9002,Cassilda,6.0
9003,Morwen,3.0
9004,Thibault,5.0
9005,,7.0
9006,Cassilda,
9007,Morwen,5.0
9008,Thibault,2.0
9009,Cassilda,8.0
9010,Morwen,6.0
9011,Thibault,4.0
9012,Cassilda,44.0
9013,Morwen,
9014,Thibault,3.0
9015,Cassilda,5.0
9016,Morwen,7.0
9017,Thibault,6.0
9018,Cassilda,4.0
"""

# TODO 1: ledger = the RAW text, read into a frame (io.StringIO)
# TODO 2: drop the rows whose seer is missing (dropna, subset)
# TODO 3: fill the missing dread with the MEDIAN of the dread column
# TODO 4: by_seer = mean dread per seer (groupby)
# TODO 5: ledger["z"] = (dread - mean) / std   (numpy std — .to_numpy() first)
# TODO 6: outlier_orbs = list of orb numbers with abs(z) > 3.0
# TODO 7: histogram of dread, bins=8, title "The Weight of Prophecy",
#         x-axis "Dread", y-axis "Orbs"`,
      solution: py`import io
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

RAW = """orb,seer,dread
9001,Morwen,4.0
9002,Cassilda,6.0
9003,Morwen,3.0
9004,Thibault,5.0
9005,,7.0
9006,Cassilda,
9007,Morwen,5.0
9008,Thibault,2.0
9009,Cassilda,8.0
9010,Morwen,6.0
9011,Thibault,4.0
9012,Cassilda,44.0
9013,Morwen,
9014,Thibault,3.0
9015,Cassilda,5.0
9016,Morwen,7.0
9017,Thibault,6.0
9018,Cassilda,4.0
"""

ledger = pd.read_csv(io.StringIO(RAW))
ledger = ledger.dropna(subset=["seer"])
ledger["dread"] = ledger["dread"].fillna(ledger["dread"].median())

by_seer = ledger.groupby("seer")["dread"].mean()

values = ledger["dread"].to_numpy()
ledger["z"] = (values - values.mean()) / values.std()

outlier_orbs = ledger.loc[ledger["z"].abs() > 3.0, "orb"].tolist()

fig, ax = plt.subplots()
ax.hist(ledger["dread"], bins=8)
ax.set_title("The Weight of Prophecy")
ax.set_xlabel("Dread")
ax.set_ylabel("Orbs")

print(by_seer)
print(outlier_orbs)`,
      validation: py`import numpy as np
import matplotlib.pyplot as plt

assert ledger.shape == (17, 4), "after the reckoning the ledger must hold 17 orbs and 4 columns: orb, seer, dread, z — drop the seerless row, add the z column"
assert int((ledger["orb"] == 9005).sum()) == 0, "orb 9005 has no seer — its row must be dropped, not filled"
assert int(ledger["dread"].isna().sum()) == 0, "no dread may remain missing after the filling"
_f = ledger.loc[ledger["orb"] == 9006, "dread"]
assert len(_f) == 1 and abs(float(_f.iloc[0]) - 5.0) < 1e-9, "orb 9006 must be filled with the median of the dread column: 5.0"
assert abs(float(ledger["dread"].mean()) - 7.176470588235294) < 1e-6, "the cleaned dread column is wrong — check the drop, then the median fill"
assert abs(float(by_seer["Cassilda"]) - 12.0) < 1e-9, "Cassilda carries mean dread 12.0 — the screaming orb is hers, and the mean follows it"
assert abs(float(by_seer["Morwen"]) - 5.0) < 1e-9, "Morwen carries mean dread 5.0 — remember her filled orb counts too"
assert abs(float(by_seer["Thibault"]) - 4.0) < 1e-9, "Thibault carries mean dread 4.0"
_d = ledger["dread"].to_numpy()
_ez = (_d - _d.mean()) / _d.std()
assert np.allclose(ledger["z"].to_numpy(), _ez), "z must be (dread - mean) / std with numpy std (divide by n) — pandas .std() divides by n-1 and will drift"
assert [int(o) for o in outlier_orbs] == [9012], "exactly one orb screams beyond abs(z) > 3.0 — orb 9012, and no other"
_fig = plt.gcf()
_axes = _fig.get_axes()
assert len(_axes) >= 1, "no figure was raised — fig, ax = plt.subplots(), then ax.hist(...)"
_ax = _axes[0]
assert len(_ax.patches) == 8, "the histogram must be drawn with bins=8 — one bar per bin"
_total = sum(p.get_height() for p in _ax.patches)
assert abs(_total - 17) < 1e-9, "the histogram must count all 17 cleaned dread readings"
assert _ax.get_title() == "The Weight of Prophecy", "the title must read exactly: The Weight of Prophecy"
assert _ax.get_xlabel() == "Dread", "the x-axis must be labeled exactly: Dread"
assert _ax.get_ylabel() == "Orbs", "the y-axis must be labeled exactly: Orbs"`,
      xp: 0,
    },
  },

  // ----------------------------------------------------------------
  // Codex — the act's vocabulary
  // ----------------------------------------------------------------
  codex: [
    { term: 'np.array', def: 'NumPy’s core container: a grid of values sharing one type, addressed by position along each dimension, built with `np.array(...)` from a list or list of lists.' },
    { term: 'dtype', def: 'The single element type every value in an array shares — the uniformity that makes whole-array arithmetic possible.' },
    { term: 'shape / reshape', def: '`shape` reports an array’s length along every dimension, rows first; `reshape` refolds the same values into any shape whose cell count matches exactly.' },
    { term: 'vectorized arithmetic', def: 'Applying one operation to a whole array at once — `glow * 2` — with the loop running in compiled code far below Python.' },
    { term: 'boolean mask', def: 'The True/False array a comparison produces; placed inside square brackets — `glow[glow > 6]` — it selects only the elements where it says yes.' },
    { term: 'axis', def: 'The direction an aggregation consumes: `axis=0` collapses down the rows (one answer per column), `axis=1` across the columns (one per row).' },
    { term: 'np.where', def: 'The vectorized if/else: `np.where(cond, a, b)` builds a new array choosing `a` where the condition holds and `b` where it does not.' },
    { term: 'np.random.default_rng(seed)', def: 'The modern seeded random generator; the same seed reproduces the same draws forever, which is why the Codex forbids unseeded chance.' },
    { term: 'Figure / Axes', def: 'matplotlib’s two-part scrying glass from `plt.subplots()`: the Figure is the sheet, the Axes the plot on it — an object whose title, labels, and lines can all be interrogated.' },
    { term: 'DataFrame', def: 'pandas’ labeled 2-D table: named columns (each one a Series) over an index of row labels, built over numpy.' },
    { term: 'loc / iloc', def: 'The two gates into a frame: `.loc` selects by row label and column name, `.iloc` by pure integer position — and they part ways the moment rows are filtered or sorted.' },
    { term: 'groupby', def: 'The gathering: `df.groupby("house")["unrest"].mean()` splits rows by a key, aggregates each group, and returns one answer per group.' },
    { term: 'NaN / fillna / dropna', def: 'NaN is the mark of a missing value and refuses equality even with itself; `isna` finds the gaps, `fillna` invents a value for them, `dropna` buries the rows.' },
    { term: 'sqlite3 cursor', def: 'The speaking-tube of a SQL connection: `cur.execute(...)` asks in SQL with `?` placeholders for data, and `fetchall()` returns the answer as a list of row-tuples.' },
    { term: 'BeautifulSoup', def: 'The bs4 parser that turns an HTML string into a searchable tree: `find` returns the first matching tag, `find_all` every match, `get_text()` the words inside.' },
    { term: 'z-score', def: 'A reading’s distance from the mean measured in standard deviations — `(x - mean) / std` — the yardstick by which outliers are named.' },
  ],
};
