// ============================================================
// act5.js — Act V: The Deathly Hallows Protocol (Expert Python)
// Iterators, generators, closures & decorators, context
// managers, dataclasses, abstract base classes, and the
// strategy pattern — the protocols beneath the language.
// ============================================================
const py = String.raw;

export default {
  id: 'act5',
  numeral: 'V',
  arc: 'Expert Python',
  title: 'The Deathly Hallows Protocol',
  tagline: 'Three hallows, seven protocols, and the quiet arithmetic of mastering death.',
  sigil: '☠️',
  epigraph: {
    text: 'There is no spell for mastery. There is only this: learn the laws the '
      + 'language itself obeys, and write your will into them.',
    source: 'the last unburned page of the Dark Codex, unsigned',
  },
  intro: 'You stand at the final door. Four acts lie behind you — variables and wards, '
    + 'loops and hoards, functions and files, whole taxonomies of object-oriented '
    + 'sorcery. What remains is not more syntax. What remains is **protocol**: the '
    + 'hidden law beneath the syntax you already trust.\n\n'
    + 'In this act you will learn what a `for` loop actually does, and forge '
    + '**iterators** of your own. You will conjure **generators** that produce values '
    + 'only when drawn upon. You will cloak functions inside functions with '
    + '**closures and decorators**, command guaranteed cleanup with **context '
    + 'managers**, mint flawless records with **dataclasses**, and bind '
    + '**abstract contracts** no subclass can shirk. Last of all you will assemble '
    + 'everything into the **strategy pattern** — design itself. Seven trials. '
    + 'Then the Dark Lord’s own working, turned against him.',

  lessons: [

    // ----------------------------------------------------------------
    // a5l1 — the iterator protocol
    // ----------------------------------------------------------------
    {
      id: 'a5l1',
      title: 'The Elder Wand',
      concept: 'the iterator protocol: iter(), next(), __iter__/__next__, and StopIteration',
      xp: 40,
      narrative: 'The wand does not love its masters. It keeps a ledger — a cold '
        + 'succession of hands, each taken from the last — and it will surrender one '
        + 'name at a time to anyone who knows how to ask. This is the oldest protocol '
        + 'in the Codex: the asking. Every `for` loop you have ever written was this '
        + 'ritual performed on your behalf — a request for the next thing, and the '
        + 'next, until a refusal ends it. Tonight you perform the ritual bare-handed, '
        + 'and then you forge an object of your own that answers it.',
      sections: [
        {
          heading: 'What the for loop hides',
          body: 'You have written hundreds of `for` loops. Here is what each one '
            + 'actually did. Python splits the work between two kinds of object:\n\n'
            + '- An **iterable** is anything that can produce a walker: lists, '
            + 'strings, dicts, files.\n'
            + '- An **iterator** is the walker itself: an object that remembers a '
            + 'position and hands over exactly one value each time it is asked.\n\n'
            + 'The ritual has two verbs. `iter(thing)` asks an iterable for a fresh '
            + 'iterator. `next(walker)` asks that iterator for its next value. A '
            + '`for` loop performs both, silently, in exactly this order:',
          code: py`masters = ["Antioch", "Emeric", "Loxias"]

walker = iter(masters)   # ask the iterable for an iterator
print(next(walker))      # Antioch
print(next(walker))      # Emeric
print(next(walker))      # Loxias`,
          note: 'The iterator keeps the position — not the list. Call `iter(masters)` '
            + 'twice and you hold two independent walkers; exhausting one leaves the '
            + 'other untouched at the first name.',
        },
        {
          heading: 'StopIteration — the refusal',
          body: 'When a walker has nothing left, `next()` does not return `None`. It '
            + 'raises **StopIteration** — an exception used as a *signal*, not an '
            + 'error. A `for` loop catches that signal silently; that is how every '
            + 'loop knows when to end.\n\n'
            + 'When calling `next()` by hand you may pass a default as a second '
            + 'argument — `next(walker, "no one")` — and the default is returned '
            + 'instead of the exception. Everything built on iteration — loops, '
            + '`list()`, `sum()`, unpacking — rests on this one signal.',
          code: py`walker = iter(["the last master"])
print(next(walker))
print(next(walker, "no one"))   # a default silences the refusal

try:
    next(walker)
except StopIteration:
    print("The lineage is ended.")`,
        },
        {
          heading: 'Forging an iterator of your own',
          body: 'To make your own class answer the ritual, implement two dunder '
            + 'methods — you know dunders from Act IV:\n\n'
            + '- `__iter__(self)` — called by `iter()`. A classic iterator simply '
            + 'returns `self`.\n'
            + '- `__next__(self)` — called by `next()`. Return the next value, or '
            + 'raise `StopIteration` when nothing remains.\n\n'
            + 'Do both, and your object works in `for` loops, `list()`, `sum()`, and '
            + 'every other place Python iterates:',
          code: py`class Waning:
    def __init__(self, start):
        self.remaining = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.remaining <= 0:
            raise StopIteration
        value = self.remaining
        self.remaining -= 1
        return value

for flame in Waning(3):
    print(flame)   # 3, then 2, then 1`,
          note: 'An iterator is single-use: once it has refused, it refuses forever. '
            + 'That is why a list — an iterable — mints a fresh iterator for every '
            + 'loop, while a spent `Waning` object stays dark.',
        },
      ],
      challenge: {
        title: 'The Wand Remembers',
        prompt: 'The Elder Wand keeps its ledger of masters, and you will teach it to '
          + 'surrender them one by one.\n\n'
          + 'Write a class `WandLineage`:\n\n'
          + '- `__init__(self, masters)` — accepts a list of master names. Store it '
          + 'and track a position. Do **not** modify the list.\n'
          + '- `__iter__(self)` — returns `self`.\n'
          + '- `__next__(self)` — returns the next master name in order; when every '
          + 'master has been named, raises `StopIteration`.\n\n'
          + 'It must survive a `for` loop, repeated `next()` calls, and an empty '
          + 'lineage — which must raise `StopIteration` on the very first ask.',
        starter: py`# The wand's ledger. It yields its masters one at a time.

class WandLineage:
    def __init__(self, masters):
        # TODO: store the masters, and a position marker starting at 0
        pass

    def __iter__(self):
        # TODO: a classic iterator returns itself
        pass

    def __next__(self):
        # TODO: return the master at the current position and advance,
        #       or raise StopIteration when the ledger is spent
        pass`,
        solution: py`class WandLineage:
    def __init__(self, masters):
        self.masters = masters
        self.position = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.position >= len(self.masters):
            raise StopIteration
        master = self.masters[self.position]
        self.position += 1
        return master`,
        hints: [
          'In __init__, keep two things: the list itself and a counter such as self.position = 0.',
          'In __next__, first check whether self.position has walked past the end of the list — if so, raise StopIteration.',
          'Otherwise read self.masters[self.position], add 1 to the position, and return what you read. Never pop() from the list.',
        ],
        validation: py`_line = WandLineage(["Gravelthorn", "Loxias", "the last thief"])
assert iter(_line) is _line, "iter() on a WandLineage must hand back the same object — __iter__ should return self"
assert next(_line) == "Gravelthorn", "the first next() must yield the first master in the ledger"
assert next(_line) == "Loxias", "the second next() must yield the second master"
assert next(_line) == "the last thief", "the third next() must yield the third master"
_ended = False
try:
    next(_line)
except StopIteration:
    _ended = True
assert _ended, "when the lineage is spent, __next__ must raise StopIteration — not return None"
assert [m for m in WandLineage(["Antioch", "Emeric"])] == ["Antioch", "Emeric"], "a for loop over a fresh WandLineage must visit every master, in order"
_empty_refused = False
try:
    next(WandLineage([]))
except StopIteration:
    _empty_refused = True
assert _empty_refused, "an empty lineage must raise StopIteration on the very first next()"
_source = ["Gregorovitch", "Grindelwald"]
list(WandLineage(_source))
assert _source == ["Gregorovitch", "Grindelwald"], "walking the lineage must not mutate the original list — track a position instead of popping"`,
        successText: 'The wand yields its dead one name at a time, and falls silent when the last is spoken.',
        xp: 85,
      },
      quiz: [
        {
          q: 'What two calls does a `for` loop secretly make?',
          options: [
            '`iter()` once to obtain an iterator, then `next()` repeatedly until StopIteration',
            '`next()` once to start, then `iter()` on every pass',
            '`range()` to number the items, then indexing to fetch each one',
            '`list()` to copy the data, then a hidden while loop over the copy',
          ],
          answer: 0,
          explain: 'A for loop asks the iterable for an iterator with iter(), then calls '
            + 'next() on it until StopIteration is raised. No copying, no numbering — '
            + 'range() is just one iterable among many.',
        },
        {
          q: 'How does an iterator announce that it has nothing left?',
          options: [
            'It returns None',
            'It raises StopIteration',
            'It returns False',
            'It raises IndexError',
          ],
          answer: 1,
          explain: 'Exhaustion is signalled by raising StopIteration. Returning None would '
            + 'be ambiguous — None might be a legitimate value in the sequence.',
        },
        {
          q: 'In a classic iterator class, what should `__iter__` return?',
          options: [
            'A new empty list',
            'The first value of the sequence',
            '`self`',
            'It should raise StopIteration',
          ],
          answer: 2,
          explain: 'The iterator IS the walker, so iter() on it should hand back the same '
            + 'object: return self. Returning the first value would confuse the protocol — '
            + 'values come only from __next__.',
        },
        {
          q: 'A list is an iterable but not an iterator. What is the difference?',
          options: [
            'There is none — the two words are synonyms',
            'An iterable is always lazy; an iterator never is',
            'An iterator can be looped over; an iterable cannot',
            'An iterable can mint iterators via `iter()`; the iterator itself carries the position and `__next__`',
          ],
          answer: 3,
          explain: 'The iterable is the source; the iterator is the walker with the '
            + 'bookmark. A list has no __next__ of its own — iter(list) creates a fresh '
            + 'iterator each time, which is why you can loop over a list twice.',
        },
      ],
    },

    // ----------------------------------------------------------------
    // a5l2 — generators
    // ----------------------------------------------------------------
    {
      id: 'a5l2',
      title: 'Conjured Rivers',
      concept: 'generators: yield, laziness, and generator expressions',
      xp: 40,
      narrative: 'Water conjured from a wand is not stored anywhere. It does not wait '
        + 'in some hidden cistern; it comes into being at the moment of pouring, and '
        + 'not a drop sooner. The Codex names this **laziness** and calls it a '
        + 'virtue. A list is a reservoir — every value hauled up and held, whether '
        + 'or not it is ever drunk. A **generator** is the conjured river: it '
        + 'computes one value when asked, forgets nothing of its place, and rests '
        + 'between draws. Tonight you learn to make water that flows only when the '
        + 'cup is held out.',
      sections: [
        {
          heading: 'yield — the spell that pauses',
          body: 'A **generator function** is any function whose body contains the '
            + 'keyword `yield`. That one keyword changes how the function runs:\n\n'
            + '- Calling it executes **no body code at all**. It returns a '
            + '**generator object** immediately.\n'
            + '- Each `next()` runs the body to the next `yield`, hands out that '
            + 'value, and **freezes** — locals, position, everything held in '
            + 'suspension.\n'
            + '- When the body ends, the generator raises `StopIteration`.\n\n'
            + 'A generator is an iterator — the protocol from Trial 1 — that Python '
            + 'builds for you: `__iter__`, `__next__` and the refusal, all conjured '
            + 'from one keyword.',
          code: py`def three_tolls():
    yield "first toll"
    yield "second toll"
    yield "third toll"

bell = three_tolls()   # nothing has run yet
print(next(bell))      # first toll
print(next(bell))      # second toll
print(next(bell))      # third toll`,
        },
        {
          heading: 'Laziness is power',
          body: 'A function that returns a list must build the **entire** list before '
            + 'you see the first element — every value paid for up front, in memory '
            + 'and in time. A generator pays per draw. A loop inside a generator '
            + 'advances only when someone asks, so even an enormous range costs '
            + 'nothing until it is actually read:',
          code: py`def deepening(limit):
    depth = 1
    while depth <= limit:
        yield depth
        depth = depth * 2

print(list(deepening(40)))   # [1, 2, 4, 8, 16, 32]

torrent = deepening(10 ** 30)   # a vast river - this line costs nothing
print(next(torrent))            # 1
print(next(torrent))            # 2 - computed only now`,
          note: 'Like every iterator, a generator is single-use. Once `list()` has '
            + 'drunk it dry, the river is a dry bed — call the generator function '
            + 'again for fresh water.',
        },
        {
          heading: 'Generator expressions, and the functions that drink them',
          body: 'Wrap a comprehension in parentheses instead of square brackets and '
            + 'you get a **generator expression** — the lazy twin of a list '
            + 'comprehension. Consuming functions like `sum()`, `max()` and `any()` '
            + 'accept any iterator directly, drawing values one at a time.\n\n'
            + 'Watch the consequences of consumption: every value drawn is gone.',
          code: py`squares = (n * n for n in range(1, 5))
print(next(squares))   # 1  - one drop drawn off the top
print(sum(squares))    # 29 - only 4 + 9 + 16 remain; the 1 is spent

print(sum(n * n for n in range(1, 5)))   # 30 - a fresh river, wholly drunk`,
        },
      ],
      challenge: {
        title: 'Draw From the Depths',
        prompt: 'The lake beneath the cave doubles in depth with every step down, and '
          + 'the Codex forbids you to hold all of it at once.\n\n'
          + 'Write two things:\n\n'
          + '- A **generator function** `river_depths(limit)` that yields the powers '
          + 'of two in order — 1, 2, 4, 8, … — stopping after the last value that is '
          + '`<=` limit. It must use `yield`; it must not build a list.\n'
          + '- A plain function `first_beyond(limit)` that **returns** the first '
          + 'power of two **strictly greater than** limit.\n\n'
          + 'Examples: `list(river_depths(40))` is `[1, 2, 4, 8, 16, 32]`; '
          + '`river_depths(0)` yields nothing; `first_beyond(40)` is `64`; '
          + '`first_beyond(64)` is `128`.',
        starter: py`# The river must flow one drop at a time.

def river_depths(limit):
    # TODO: yield the powers of two (1, 2, 4, 8, ...) that are <= limit.
    # Start a value at 1 and double it. Use yield - do NOT build a list.
    pass


def first_beyond(limit):
    # TODO: return the first power of two STRICTLY greater than limit
    pass`,
        solution: py`def river_depths(limit):
    depth = 1
    while depth <= limit:
        yield depth
        depth = depth * 2


def first_beyond(limit):
    depth = 1
    while depth <= limit:
        depth = depth * 2
    return depth`,
        hints: [
          'Start a value at 1 and double it each pass: depth = depth * 2. In river_depths, yield the value while it is still within the limit.',
          'Let the loop condition do the stopping: while depth <= limit: yield depth, then double. When the condition fails the function simply ends — Python raises StopIteration for you.',
          'first_beyond is the same loop with no yield: keep doubling while depth <= limit, then return the value that finally broke past it.',
        ],
        validation: py`import types
_g = river_depths(100)
assert isinstance(_g, types.GeneratorType), "river_depths must be a generator function — use yield inside it, never return a list"
assert list(_g) == [1, 2, 4, 8, 16, 32, 64], "river_depths(100) must yield 1, 2, 4, 8, 16, 32, 64 — in that order"
assert list(river_depths(64)) == [1, 2, 4, 8, 16, 32, 64], "the boundary belongs to the river: a power equal to limit must still be yielded"
assert list(river_depths(1)) == [1], "river_depths(1) must yield exactly one value: 1"
assert list(river_depths(0)) == [], "river_depths(0) must yield nothing at all"
assert next(river_depths(10)) == 1, "the first draw from the river must be 1"
_deep = river_depths(2 ** 60)
assert next(_deep) == 1 and next(_deep) == 2, "the river must flow lazily — even a vast limit costs nothing until drawn"
assert first_beyond(40) == 64, "first_beyond(40) must be 64"
assert first_beyond(64) == 128, "first_beyond(64) must be 128 — strictly greater, not equal"
assert first_beyond(1) == 2, "first_beyond(1) must be 2"
assert first_beyond(0) == 1, "first_beyond(0) must be 1 — the first power of two greater than 0"`,
        successText: 'The water rises only as fast as you dare to drink — a river without a reservoir, a power without a weight.',
        xp: 85,
      },
      quiz: [
        {
          q: 'What happens at the moment you call a generator function, as in `g = river_depths(100)`?',
          options: [
            'The body runs to completion and all results are stored in g',
            'No body code runs — a generator object is returned immediately',
            'The first value is computed and returned',
            'Python raises StopIteration if the limit is too large',
          ],
          answer: 1,
          explain: 'Calling a generator function only creates the generator object. Not a '
            + 'single line of the body executes until the first next() — that deferral is '
            + 'the whole point.',
        },
        {
          q: 'What is the chief advantage of `yield` over building and returning a full list?',
          options: [
            'yield is faster because it skips the return statement',
            'Values produced by yield are immutable',
            'Values are produced one at a time, on demand, so memory stays flat even for vast sequences',
            'A generator can be replayed any number of times',
          ],
          answer: 2,
          explain: 'Laziness: one value exists at a time, so a generator over a billion '
            + 'items costs the same memory as one over ten. The last option is the classic '
            + 'trap — generators are single-use, not replayable.',
        },
        {
          q: 'After `g = (n for n in range(3))` and a single `next(g)`, what does `list(g)` produce?',
          options: [
            '`[0, 1, 2]`',
            '`[1, 2]`',
            '`[2]`',
            'It raises StopIteration',
          ],
          answer: 1,
          explain: 'The lone next() consumed 0. list() then drains whatever remains — 1 and '
            + '2. list() never leaks StopIteration; it absorbs it and simply stops collecting.',
        },
        {
          q: 'Which expression builds a generator rather than a container?',
          options: [
            '`[n * n for n in range(9)]`',
            '`list(n * n for n in range(9))`',
            '`tuple(n * n for n in range(9))`',
            '`(n * n for n in range(9))`',
          ],
          answer: 3,
          explain: 'Parentheses make a generator expression — lazy until drawn. Square '
            + 'brackets build a list eagerly, and wrapping any genexp in list() or tuple() '
            + 'drains it into a container on the spot.',
        },
      ],
    },

    // ----------------------------------------------------------------
    // a5l3 — closures and decorators
    // ----------------------------------------------------------------
    {
      id: 'a5l3',
      title: 'Cloaked in Shadow',
      concept: 'closures and decorators: @ syntax and functools.wraps',
      xp: 40,
      narrative: 'There is a cloak that does more than hide its wearer — it lets the '
        + 'wearer act while hidden, and the world credits the deed to the face it '
        + 'expects. In Python, one function may wear another. The wrapper answers to '
        + 'the original’s name, forwards every request, and quietly does its own '
        + 'work in between: counting, guarding, logging, refusing. The Codex calls '
        + 'these **decorators**, and beneath them runs an older magic still — the '
        + '**closure**, a function that remembers the place where it was made long '
        + 'after that place is gone.',
      sections: [
        {
          heading: 'Closures — functions that remember',
          body: 'Define a function inside another function, and the inner one keeps '
            + 'access to the outer one’s variables — even after the outer function '
            + 'has returned and its frame is dust. That captured memory is a '
            + '**closure**.\n\n'
            + 'Reading an enclosing variable happens automatically. To **rebind** '
            + 'one — to assign it a new value — declare it `nonlocal` first:',
          code: py`def make_tally():
    souls = 0
    def tally():
        nonlocal souls   # rebind the enclosing variable
        souls += 1
        return souls
    return tally

taken = make_tally()
print(taken())    # 1
print(taken())    # 2 - the count survives between calls

another = make_tally()
print(another())  # 1 - each closure keeps its own memory`,
          note: 'Two tallies, two private counts. A closure is state without a class '
            + '— and it is the machinery most wrapper decorators are built on.',
        },
        {
          heading: 'The decorator pattern',
          body: 'A **decorator** is a function that takes a function and returns a '
            + 'replacement for it — usually a **wrapper** that calls the original '
            + 'with something extra before or after. Functions are ordinary values '
            + '(you may pass, return and store them), so the whole pattern is three '
            + 'moves:\n\n'
            + '- take `func` as a parameter,\n'
            + '- define `wrapper(*args, **kwargs)` that calls '
            + '`func(*args, **kwargs)` and returns its result,\n'
            + '- return `wrapper`.\n\n'
            + 'The wrapper accepts `*args, **kwargs` so it can forward *any* '
            + 'arguments to *any* function. And the `@` line directly above a `def` '
            + 'is pure shorthand for reassignment — nothing more:',
          code: py`def warded(func):
    def wrapper(*args, **kwargs):
        print("The circle is drawn.")
        result = func(*args, **kwargs)
        print("The circle closes.")
        return result
    return wrapper

@warded                       # exactly: summon = warded(summon)
def summon(name):
    return name + " answers."

print(summon("The Wraith"))`,
        },
        {
          heading: 'functools.wraps — keep your true name',
          body: 'A naive wrapper has one flaw: it steals the identity of what it '
            + 'cloaks. Ask the decorated function its `__name__` and it says '
            + '`wrapper`; its docstring is gone; error messages and `help()` lie. '
            + 'The cure ships with the standard library: apply '
            + '`@functools.wraps(func)` to the wrapper, and the original’s name, '
            + 'docstring and metadata are copied onto the disguise.\n\n'
            + 'One more trick the trial will need: a function is an object, so you '
            + 'may hang attributes on it — `wrapper.calls = 0` gives the wrapper a '
            + 'public counter that outlives any single call.',
          code: py`import functools

def warded(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return func(*args, **kwargs)
    wrapper.calls = 0
    return wrapper

@warded
def rites():
    "Performs the closing rites."
    return "done"

print(rites())          # done
print(rites.__name__)   # rites - not wrapper
print(rites.calls)      # 1`,
        },
      ],
      challenge: {
        title: 'The Veiled Hand',
        prompt: 'Every door in the deep vaults must be counted as it opens — without '
          + 'the door ever knowing it is watched.\n\n'
          + 'Write a decorator `veiled(func)`:\n\n'
          + '- Its wrapper accepts any arguments (`*args, **kwargs`), calls `func` '
          + 'with them, and returns the result unchanged.\n'
          + '- The wrapper carries a counter attribute `calls`, starting at `0` and '
          + 'increased by 1 on every invocation.\n'
          + '- Apply `@functools.wraps(func)` to the wrapper so the decorated '
          + 'function keeps its `__name__` and docstring.\n\n'
          + 'Then define `unlock(name)`, which returns exactly '
          + '`f"The way opens for {name}."` — and decorate it with `@veiled`.',
        starter: py`import functools

# TODO: write the decorator veiled(func).
#   - wrapper(*args, **kwargs) calls func and returns its result
#   - wrapper.calls starts at 0 and rises by 1 per invocation
#   - use @functools.wraps(func) so the true name survives


# TODO: decorate unlock with @veiled
def unlock(name):
    "Opens a counted door."
    return f"The way opens for {name}."`,
        solution: py`import functools

def veiled(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return func(*args, **kwargs)
    wrapper.calls = 0
    return wrapper


@veiled
def unlock(name):
    "Opens a counted door."
    return f"The way opens for {name}."`,
        hints: [
          'Skeleton first: def veiled(func): ... define wrapper inside ... return wrapper. The @functools.wraps(func) line sits directly above def wrapper.',
          'Set wrapper.calls = 0 after the wrapper is defined but before you return it. Inside the wrapper, wrapper.calls += 1 works because the closure remembers wrapper itself.',
          'The wrapper body is two lines: wrapper.calls += 1, then return func(*args, **kwargs). Finally put @veiled on the line above def unlock.',
        ],
        validation: py`assert callable(veiled), "veiled must be a function that accepts a function"

def _probe(x, y=0):
    "Reaches into the dark."
    return x * 10 + y

_cloaked = veiled(_probe)
assert _cloaked is not _probe, "veiled must return a NEW wrapper function, not the function it was given"
assert _cloaked.__name__ == "_probe", "the wrapper has stolen the function's name — apply functools.wraps(func) to the wrapper"
assert _cloaked.__doc__ == "Reaches into the dark.", "the docstring was lost in the veil — functools.wraps preserves it"
assert _cloaked.calls == 0, "a freshly cloaked function must begin with calls == 0"
assert _cloaked(3, y=4) == 34, "the wrapper must pass positional and keyword arguments through and return the true result"
assert _cloaked(5) == 50, "default arguments must still work through the veil"
assert _cloaked.calls == 2, "calls must count every invocation — after two calls it should be 2"

assert unlock.__name__ == "unlock", "unlock must be decorated with @veiled and keep its name via functools.wraps"
assert hasattr(unlock, "calls"), "unlock does not carry a calls counter — did you forget the @veiled line above its def?"
_before = unlock.calls
assert unlock("Delphini") == "The way opens for Delphini.", "unlock must still return its exact sentence through the veil"
assert unlock.calls == _before + 1, "one call to unlock must raise its count by exactly one"`,
        successText: 'The doors open, the doors are counted — and not one of them ever felt the hand upon it.',
        xp: 90,
      },
      quiz: [
        {
          q: 'What is a closure?',
          options: [
            'A function whose source code is hidden from the caller',
            'Any function that takes another function as an argument',
            'An inner function that retains access to variables of its enclosing scope, even after the outer function returns',
            'A function that has been sealed with functools.wraps',
          ],
          answer: 2,
          explain: 'The closure is the inner function plus its captured environment. '
            + 'Taking a function as an argument describes a higher-order function — related, '
            + 'but not the same thing.',
        },
        {
          q: 'Writing `@veiled` directly above `def unlock(...)` is shorthand for what?',
          options: [
            '`veiled = unlock(veiled)`',
            '`unlock = veiled(unlock)`',
            '`unlock = veiled(unlock())`',
            'It registers unlock but changes nothing until unlock is first called',
          ],
          answer: 1,
          explain: 'The @ syntax passes the function object to the decorator and rebinds '
            + 'the name to whatever comes back — at definition time, not first-call time. '
            + 'Note there are no parentheses on unlock: the function itself is passed, not '
            + 'its result.',
        },
        {
          q: 'Without `functools.wraps`, what does a decorated function report as its `__name__`?',
          options: [
            'Its original name',
            'The decorator’s name',
            '`wrapper` — the inner function’s name',
            '`None`',
          ],
          answer: 2,
          explain: 'The name you call now points at the wrapper function, so its metadata '
            + 'is the wrapper’s. functools.wraps copies the original’s __name__ and '
            + 'docstring onto the wrapper so the disguise holds.',
        },
        {
          q: 'Why does the wrapper take `*args, **kwargs`?',
          options: [
            'Python requires those exact parameter names inside decorators',
            'So one wrapper can forward any combination of positional and keyword arguments to the original function',
            'To make the arguments immutable while the wrapper runs',
            'To batch the arguments for better performance',
          ],
          answer: 1,
          explain: 'The wrapper cannot know the signature of every function it may cloak, '
            + 'so it accepts everything and forwards everything. The names args/kwargs are '
            + 'convention, not law — the stars do the work.',
        },
      ],
    },

    // ----------------------------------------------------------------
    // a5l4 — context managers
    // ----------------------------------------------------------------
    {
      id: 'a5l4',
      title: 'The Vanishing Cabinet',
      concept: 'context managers: with, __enter__/__exit__, and contextlib',
      xp: 40,
      narrative: 'A vanishing cabinet is a bargain with two clauses. Step inside and '
        + 'it opens a way — but the second clause is the one that matters: the '
        + 'cabinet **closes behind you**, whether you arrive whole, or screaming, '
        + 'or not at all. Python’s `with` statement is that second clause made law. '
        + 'Files close, locks release, wards seal — even when the code inside dies '
        + 'mid-working. You have used `with open(...)` on faith since Act III. '
        + 'Tonight you learn the mechanism beneath it, and build a cabinet whose '
        + 'door cannot be left hanging open.',
      sections: [
        {
          heading: 'What with actually guarantees',
          body: 'A **context manager** is an object that promises setup and teardown '
            + 'around a block of code. The `with` statement enforces the promise:\n\n'
            + '- entering runs the setup, and may hand you a value (the `as` '
            + 'clause),\n'
            + '- leaving runs the teardown **no matter how you leave** — normal '
            + 'fall-through, `return`, or an exception in flight.\n\n'
            + 'It replaces the fragile try/finally you would otherwise have to '
            + 'remember at every single call site:',
          code: py`with open("ledger.txt", "w") as f:
    f.write("The debt is recorded.")
# the file is already closed here, even if write() had raised

# the with-statement above is the lawful form of this old custom:
f = open("ledger.txt", "a")
try:
    f.write(" Sealed twice.")
finally:
    f.close()   # runs even if the write fails`,
        },
        {
          heading: 'The protocol: __enter__ and __exit__',
          body: 'Any class becomes a context manager with two dunders:\n\n'
            + '- `__enter__(self)` — runs at the `with` line. Whatever it returns is '
            + 'what `as` binds; returning `self` is the usual choice.\n'
            + '- `__exit__(self, exc_type, exc, tb)` — runs on the way out, '
            + '*always*. If the block raised, the three arguments describe the '
            + 'exception; otherwise all three are `None`.\n\n'
            + '`__exit__` also returns a verdict. Return `False` (or `None`) and a '
            + 'raised exception continues on its way; return `True` and it is '
            + 'swallowed whole. Swallowing is rarely mercy — return `False` unless '
            + 'you have a documented reason.',
          code: py`class Warded:
    def __enter__(self):
        print("The wards part.")
        return self

    def __exit__(self, exc_type, exc, tb):
        print("The wards close.")   # runs even on failure
        return False                # let any exception escape

with Warded():
    print("Working within the circle.")`,
        },
        {
          heading: 'contextlib — a cabinet from a generator',
          body: 'The standard library braids three of this act’s trials into one '
            + 'shortcut: `@contextmanager` from the `contextlib` module turns a '
            + '**generator function** into a context manager. Everything before the '
            + '`yield` is the entry; the yielded value is what `as` receives; '
            + 'everything after is the exit. Wrap the `yield` in try/finally so the '
            + 'teardown survives an exception inside the block:',
          code: py`from contextlib import contextmanager

@contextmanager
def cabinet(name):
    print(name + " opens.")
    try:
        yield name
    finally:
        print(name + " seals.")

with cabinet("The twin door") as which:
    print("Passing through " + which)`,
          note: 'One decorator, one generator, one context manager — three protocols '
            + 'of this act in five lines. This is why the deep magics are taught '
            + 'together.',
        },
      ],
      challenge: {
        title: 'Seal It Behind You',
        prompt: 'Borgin’s cabinet must keep a journal, and it must never — under any '
          + 'failure, panic or sabotage — be left standing open.\n\n'
          + 'Write a class `VanishingCabinet`:\n\n'
          + '- `__init__(self, name)` — store `name`; set `self.open = False`; set '
          + '`self.journal = []`.\n'
          + '- `__enter__(self)` — set `self.open = True`, append the string '
          + '`"opened"` to the journal, and return `self`.\n'
          + '- `__exit__(self, exc_type, exc, tb)` — set `self.open = False`, '
          + 'append `"sealed"` to the journal, and return `False` so exceptions '
          + 'escape.\n\n'
          + 'Whether the with-block succeeds or raises, the cabinet must end closed '
          + 'with journal `["opened", "sealed"]`.',
        starter: py`# The cabinet keeps a journal and never stays open.

class VanishingCabinet:
    def __init__(self, name):
        self.name = name
        self.open = False
        self.journal = []

    # TODO: __enter__ - open the cabinet, record "opened", return self

    # TODO: __exit__(self, exc_type, exc, tb) - close it, record "sealed",
    #       and return False so any exception escapes`,
        solution: py`class VanishingCabinet:
    def __init__(self, name):
        self.name = name
        self.open = False
        self.journal = []

    def __enter__(self):
        self.open = True
        self.journal.append("opened")
        return self

    def __exit__(self, exc_type, exc, tb):
        self.open = False
        self.journal.append("sealed")
        return False`,
        hints: [
          '__enter__ takes only self. Set the state, record the journal entry, and remember to return self — or the as-clause receives None.',
          '__exit__ must accept exactly four parameters — self, exc_type, exc, tb — even though this cabinet ignores the last three.',
          'Do not return True from __exit__ (that would swallow exceptions) and do not re-raise anything: set open to False, append "sealed", return False.',
        ],
        validation: py`_cab = VanishingCabinet("the Room of Hidden Things")
assert _cab.open is False, "a cabinet must begin closed — set open to False in __init__"
assert _cab.journal == [], "the journal must begin empty"
with _cab as _held:
    assert _held is _cab, "__enter__ must return self so the with-statement hands back the cabinet"
    assert _cab.open is True, "inside the with-block the cabinet must stand open"
    assert _cab.journal == ["opened"], "entering must record exactly the string 'opened' in the journal"
assert _cab.open is False, "leaving the with-block must close the cabinet — __exit__ sets open to False"
assert _cab.journal == ["opened", "sealed"], "exiting must record 'sealed' after 'opened'"

_boom = VanishingCabinet("the Borgin twin")
_escaped = False
try:
    with _boom:
        raise ValueError("sabotage within")
except ValueError:
    _escaped = True
assert _escaped, "__exit__ must return False so errors escape the cabinet instead of being swallowed"
assert _boom.open is False, "even when the working inside fails, the cabinet must seal — that is the whole bargain of with"
assert _boom.journal == ["opened", "sealed"], "the journal must still read opened then sealed after a failure"`,
        successText: 'A ValueError howls through the cabinet — and still the door clicks shut behind it. The bargain holds.',
        xp: 90,
      },
      quiz: [
        {
          q: 'What does the `with` statement guarantee?',
          options: [
            'The block runs faster than a plain try-block',
            'The block cannot raise exceptions',
            '`__enter__` is retried until it succeeds',
            '`__exit__` runs when the block is left — even if the block raises',
          ],
          answer: 3,
          explain: 'with guarantees teardown, not safety or speed. Exceptions can still '
            + 'happen inside the block — the promise is that __exit__ runs regardless of '
            + 'how the block ends.',
        },
        {
          q: 'In `with VanishingCabinet("x") as target:`, what is `target` bound to?',
          options: [
            'The VanishingCabinet class itself',
            'Whatever `__enter__` returns',
            'Whatever `__exit__` returns',
            '`True` if entry succeeded',
          ],
          answer: 1,
          explain: 'The as-clause receives __enter__’s return value — which is why '
            + 'returning self is the common pattern. Forget the return and target is '
            + 'quietly None.',
        },
        {
          q: 'A ValueError is in flight and your `__exit__` returns `False`. What happens?',
          options: [
            'The ValueError is suppressed and execution continues after the block',
            'The ValueError propagates onward once __exit__ finishes',
            'Python re-runs the with-block one more time',
            '__exit__ is called a second time with the same exception',
          ],
          answer: 1,
          explain: 'False means "I have cleaned up; the exception is not mine to silence." '
            + 'Only returning True suppresses it — a power to use with great restraint.',
        },
        {
          q: 'In a function decorated with `@contextmanager`, when does the code after `yield` run?',
          options: [
            'Immediately after the yield line, before the with-block body',
            'Only if the with-block finishes without an error',
            'When the with-block is exited — and, inside try/finally, even if the body raised',
            'Never — code after yield is unreachable',
          ],
          answer: 2,
          explain: 'The yield marks where the with-block body executes. Code after it is '
            + 'the teardown; wrapping the yield in try/finally is what makes that teardown '
            + 'survive an exception in the body.',
        },
      ],
    },

    // ----------------------------------------------------------------
    // a5l5 — dataclasses
    // ----------------------------------------------------------------
    {
      id: 'a5l5',
      title: 'The Ministry’s Ledgers',
      concept: 'dataclasses: generated __init__/__repr__/__eq__, fields, defaults, type hints',
      xp: 40,
      narrative: 'The Ministry’s undercroft holds ledgers for everything: vault '
        + 'numbers, confiscated relics, names struck through in red. The clerks who '
        + 'kept them wrote the same three incantations on every page — how a record '
        + 'is made, how it is displayed, how two records are judged the same — '
        + 'until the repetition itself bred errors. Act IV taught you to write '
        + '`__init__`, `__repr__` and `__eq__` by hand. The Codex now grants the '
        + 'clerk-killing rune: one decorator that reads a class’s field '
        + 'declarations and writes all of that machinery for you, flawlessly, '
        + 'every time.',
      sections: [
        {
          heading: 'The boilerplate tax',
          body: 'A class that merely carries data still demands ceremony. Every '
            + 'field name appears **five or six times** — in the `__init__` '
            + 'parameters, in the `self.x = x` lines, in `__repr__`, in `__eq__`. '
            + 'Add one field and you must remember every site; miss one and the bug '
            + 'is silent:',
          code: py`class VaultRecordByHand:
    def __init__(self, vault, owner, galleons=0):
        self.vault = vault
        self.owner = owner
        self.galleons = galleons

    def __repr__(self):
        return (f"VaultRecordByHand(vault={self.vault!r}, "
                f"owner={self.owner!r}, galleons={self.galleons!r})")

    def __eq__(self, other):
        return (self.vault, self.owner, self.galleons) == \
               (other.vault, other.owner, other.galleons)`,
        },
        {
          heading: '@dataclass — the clerk-killing rune',
          body: 'Import `dataclass` from the `dataclasses` module and set it above '
            + 'the class. Then declare each field as a name with a **type hint** at '
            + 'class level — `vault: int` — and the decorator reads those '
            + 'declarations and generates `__init__`, `__repr__` and `__eq__` for '
            + 'you.\n\n'
            + 'Two laws to keep:\n\n'
            + '- Fields with defaults must come **after** fields without them — the '
            + 'same rule as function parameters.\n'
            + '- Type hints here are **declaration and documentation, not '
            + 'enforcement**. Python will not stop you passing a string where the '
            + 'hint says `int`; hints exist for readers and tools.\n\n'
            + 'Ordinary methods live inside a dataclass exactly as in any class.',
          code: py`from dataclasses import dataclass

@dataclass
class VaultRecord:
    vault: int
    owner: str
    galleons: int = 0

    def deposit(self, amount):
        self.galleons += amount
        return self.galleons`,
        },
        {
          heading: 'What the rune writes for you',
          body: 'The generated methods behave like the best hand-written versions:\n\n'
            + '- `__init__` accepts the fields positionally or by keyword.\n'
            + '- `__repr__` prints the class name and every field — invaluable when '
            + 'a record surfaces in an error message.\n'
            + '- `__eq__` compares field by field, so two records with the same '
            + 'contents are equal.\n\n'
            + 'One trap remains: never write a mutable default like '
            + '`relics: list = []`. The machinery refuses it outright, because one '
            + 'shared list would bleed between every instance. Use '
            + '`field(default_factory=list)` to mint a fresh list per record.',
          code: py`from dataclasses import dataclass, field

@dataclass
class VaultRecord:
    vault: int
    owner: str
    galleons: int = 0

a = VaultRecord(713, "Flamel")
b = VaultRecord(713, "Flamel")
print(a)       # VaultRecord(vault=713, owner='Flamel', galleons=0)
print(a == b)  # True - judged field by field

@dataclass
class Evidence:
    case: int
    relics: list = field(default_factory=list)   # a fresh list per record

print(Evidence(9).relics is Evidence(9).relics)  # False - each record its own`,
        },
      ],
      challenge: {
        title: 'Strike the Record',
        prompt: 'Gringotts falls under Ministry audit, and the goblins will not '
          + 'tolerate a tired clerk’s hand-written errors.\n\n'
          + 'Write a dataclass `VaultRecord`:\n\n'
          + '- Decorate it with `@dataclass`, imported from `dataclasses`.\n'
          + '- Fields in this exact order, with these hints and defaults: '
          + '`vault: int`, `owner: str`, `galleons: int = 0`.\n'
          + '- One method: `deposit(self, amount)` — add `amount` to `galleons` and '
          + 'return the new total.\n\n'
          + 'The generated magic must hold: records with equal fields compare '
          + 'equal, the repr names the class and its fields, and construction works '
          + 'by position or by keyword.',
        starter: py`# TODO: import dataclass from the dataclasses module

# TODO: turn VaultRecord into a dataclass with fields, in order:
#   vault: int
#   owner: str
#   galleons: int = 0
class VaultRecord:
    # TODO: add deposit(self, amount) - add to galleons, return the new total
    pass`,
        solution: py`from dataclasses import dataclass


@dataclass
class VaultRecord:
    vault: int
    owner: str
    galleons: int = 0

    def deposit(self, amount):
        self.galleons += amount
        return self.galleons`,
        hints: [
          'The import is: from dataclasses import dataclass — then place @dataclass on the line directly above class VaultRecord.',
          'Fields are bare, type-hinted declarations at class level: vault: int on its own line. The default rides on the declaration: galleons: int = 0.',
          'deposit is an ordinary method inside the class: self.galleons += amount, then return self.galleons. Delete the pass once the body exists.',
        ],
        validation: py`import dataclasses
assert dataclasses.is_dataclass(VaultRecord), "VaultRecord must be decorated with @dataclass"
_names = [f.name for f in dataclasses.fields(VaultRecord)]
assert _names == ["vault", "owner", "galleons"], "the fields must be vault, owner, galleons — in exactly that order"
_r = VaultRecord(713, "Flamel")
assert _r.galleons == 0, "galleons must default to 0 when omitted"
assert _r == VaultRecord(713, "Flamel"), "two records with identical fields must be equal — @dataclass writes __eq__ for you"
assert _r != VaultRecord(714, "Flamel"), "records that differ in any field must not be equal"
assert "VaultRecord" in repr(_r) and "713" in repr(_r), "the generated __repr__ should name the class and show its field values"
_kw = VaultRecord(owner="Karkaroff", vault=209, galleons=12)
assert _kw.vault == 209 and _kw.galleons == 12, "the generated __init__ must accept keyword arguments for every field"
assert _r.deposit(50) == 50, "deposit must return the new total"
assert _r.deposit(25) == 75, "a second deposit must accumulate — expected 75"
assert _r.galleons == 75, "deposit must actually update the galleons field"`,
        successText: 'The ledger writes itself now — every record minted, printed and judged by law rather than by a tired hand.',
        xp: 90,
      },
      quiz: [
        {
          q: 'Which methods does `@dataclass` generate from the field declarations, by default?',
          options: [
            '`__init__`, `__repr__`, and `__eq__`',
            '`__init__` only',
            '`__str__` and `__hash__` only',
            'Every dunder method Python defines',
          ],
          answer: 0,
          explain: 'The default trio is __init__, __repr__ and __eq__ — construction, '
            + 'display and comparison, all derived from the same field list so they can '
            + 'never drift apart.',
        },
        {
          q: 'At runtime, what does the type hint in `galleons: int = 0` actually do?',
          options: [
            'Raises TypeError when a non-int is assigned',
            'Converts assigned values to int automatically',
            'Nothing is enforced — it declares the field and documents the intended type',
            'Makes the field read-only',
          ],
          answer: 2,
          explain: 'Hints are annotations, not guards. @dataclass uses them to discover '
            + 'the fields, and human readers and tools use them as documentation — but '
            + 'Python will accept a string there without complaint.',
        },
        {
          q: 'When are two instances of the same dataclass equal under `==`?',
          options: [
            'Only when they are the same object in memory',
            'When all of their fields are equal',
            'When their reprs happen to match character for character',
            'Dataclass instances cannot be compared with ==',
          ],
          answer: 1,
          explain: 'The generated __eq__ compares field by field. Identity (the same '
            + 'object) is what you would get *without* the dataclass machinery — the whole '
            + 'point is value equality.',
        },
        {
          q: 'Why does the declaration `relics: list = []` fail inside a dataclass?',
          options: [
            'Lists can never be dataclass fields',
            'The hint must be spelled typing.List instead',
            'Mutable defaults would be shared across every instance, so dataclasses refuse them — use field(default_factory=list)',
            'Defaults are forbidden after the first field',
          ],
          answer: 2,
          explain: 'One list object as a class-level default would be shared by every '
            + 'record — a classic corruption. dataclasses raises ValueError instead, and '
            + 'default_factory mints a fresh list per instance.',
        },
      ],
    },

    // ----------------------------------------------------------------
    // a5l6 — abstract base classes
    // ----------------------------------------------------------------
    {
      id: 'a5l6',
      title: 'The Unbreakable Contract',
      concept: 'abstract base classes: abc.ABC, @abstractmethod, and enforced contracts',
      xp: 40,
      narrative: 'The Ministry has conventions; the dark has contracts. A convention '
        + 'says: every ward *should* implement a trigger, and everyone *should* '
        + 'remember. Then one hollow ward ships without it, and the failure arrives '
        + 'at the worst hour, deep in a call stack, wearing someone else’s name. An '
        + 'unbreakable vow does not trust memory. It binds at the moment of '
        + 'swearing: supply the method, or you may not exist at all. Python calls '
        + 'these vows **abstract base classes** — and they fail loudly, '
        + 'immediately, exactly where the lie was told.',
      sections: [
        {
          heading: 'Why conventions fail',
          body: 'You know inheritance from Act IV: a base class offering methods, '
            + 'subclasses overriding them. The old convention for a *required* '
            + 'method is a placeholder that raises `NotImplementedError`.\n\n'
            + 'The flaw is **when** it fails: only when the missing method is '
            + 'finally *called* — perhaps rarely, perhaps in production, far from '
            + 'the class that lied. A forgotten override is a curse with a delay on '
            + 'it. What you want is refusal at the door: an object missing its '
            + 'obligations should never come into being at all.',
          code: py`class Ward:
    def trigger(self):
        raise NotImplementedError("subclasses must implement trigger")

class HollowWard(Ward):
    pass                # the lie is accepted...

w = HollowWard()        # ...and even given form.
# Only w.trigger() would fail - perhaps months from now.`,
        },
        {
          heading: 'abc.ABC and @abstractmethod',
          body: 'The `abc` module makes obligations structural:\n\n'
            + '- Inherit from `abc.ABC`.\n'
            + '- Mark each required method with the `@abstractmethod` decorator.\n\n'
            + 'Two consequences follow, enforced by Python itself:\n\n'
            + '- The abstract class **cannot be instantiated** — trying raises '
            + '`TypeError` on the spot.\n'
            + '- A subclass that fails to override **every** abstract method is '
            + 'itself still abstract, and raises the same `TypeError` when '
            + 'instantiated.\n\n'
            + 'The failure moves from the distant call site to the moment of '
            + 'creation — the earliest moment it could possibly be caught.',
          code: py`from abc import ABC, abstractmethod

class Relic(ABC):
    @abstractmethod
    def awaken(self):
        ...

class Crown(Relic):
    def awaken(self):
        return "The crown hums with old malice."

print(Crown().awaken())

try:
    Relic()
except TypeError as e:
    print("Refused:", e)`,
          note: 'The three dots are `Ellipsis` — a conventional empty body for a '
            + 'method that exists only to be overridden. `pass` works identically.',
        },
        {
          heading: 'Template method — concrete flesh on abstract bone',
          body: 'An ABC is not all absence. It may carry fully implemented methods '
            + 'alongside its abstract ones — and those concrete methods may **call** '
            + 'the abstract ones, trusting that any living subclass has supplied '
            + 'them. The base class writes the ceremony once; each subclass '
            + 'provides only its missing verse. This is the **template method** '
            + 'pattern, and it is why contracts beat conventions twice over: the '
            + 'obligation is enforced, *and* the shared logic lives in exactly one '
            + 'place.',
          code: py`from abc import ABC, abstractmethod

class Rite(ABC):
    @abstractmethod
    def toll(self):
        ...

    def perform(self):                    # concrete, shared, written once
        return "The rite exacts " + self.toll() + "."

class BloodRite(Rite):
    def toll(self):                       # only the missing verse
        return "seven drops, willingly given"

print(BloodRite().perform())`,
        },
      ],
      challenge: {
        title: 'Swear It in Full',
        prompt: 'No vow leaves this chamber half-sworn.\n\n'
          + 'Build the contract:\n\n'
          + '- An abstract base class `Vow` (inherit from `ABC`):\n'
          + '  - `__init__(self, sworn_by)` — store the name as `self.sworn_by`.\n'
          + '  - `price(self)` — abstract; decorate it with `@abstractmethod`.\n'
          + '  - `bind(self)` — concrete; return exactly '
          + '`f"{self.sworn_by} pays {self.price()}."`\n'
          + '- `LifeVow(Vow)` — `price` returns `"with a life"`.\n'
          + '- `MemoryVow(Vow)` — `price` returns `"with a stolen memory"`.\n\n'
          + 'So `LifeVow("Severus").bind()` is `"Severus pays with a life."` — and '
          + 'instantiating `Vow` itself must raise `TypeError`.',
        starter: py`from abc import ABC, abstractmethod

# TODO: the abstract base class Vow
#   - __init__(self, sworn_by) stores self.sworn_by
#   - price(self) is abstract
#   - bind(self) is concrete: f"{self.sworn_by} pays {self.price()}."

# TODO: LifeVow(Vow) - price returns "with a life"

# TODO: MemoryVow(Vow) - price returns "with a stolen memory"`,
        solution: py`from abc import ABC, abstractmethod


class Vow(ABC):
    def __init__(self, sworn_by):
        self.sworn_by = sworn_by

    @abstractmethod
    def price(self):
        ...

    def bind(self):
        return f"{self.sworn_by} pays {self.price()}."


class LifeVow(Vow):
    def price(self):
        return "with a life"


class MemoryVow(Vow):
    def price(self):
        return "with a stolen memory"`,
        hints: [
          'Begin with: from abc import ABC, abstractmethod — then class Vow(ABC): with an ordinary __init__.',
          'Mark price abstract by placing @abstractmethod on the line above it; its body can be a bare ... — the subclasses supply the real one.',
          'bind lives on Vow only and calls self.price() inside an f-string. The two subclasses define nothing but their own price method.',
        ],
        validation: py`_refused = False
try:
    Vow("the Unnamed")
except TypeError:
    _refused = True
assert _refused, "Vow must be abstract — instantiating it must raise TypeError. Inherit from ABC and mark price with @abstractmethod."

class _Hollow(Vow):
    pass

_hollow_refused = False
try:
    _Hollow("Nobody")
except TypeError:
    _hollow_refused = True
assert _hollow_refused, "a subclass that never implements price is still abstract — instantiating it must raise TypeError"

_lv = LifeVow("Severus")
assert isinstance(_lv, Vow), "LifeVow must inherit from Vow"
assert _lv.price() == "with a life", "LifeVow.price must return exactly: with a life"
assert _lv.bind() == "Severus pays with a life.", "bind must weave sworn_by and price into: Severus pays with a life."
_mv = MemoryVow("Narcissa")
assert isinstance(_mv, Vow), "MemoryVow must inherit from Vow"
assert _mv.bind() == "Narcissa pays with a stolen memory.", "MemoryVow's bind must read: Narcissa pays with a stolen memory."
assert LifeVow("X").bind() != MemoryVow("X").bind(), "the two vows must exact different prices"

class _Borrowed(Vow):
    def price(self):
        return "with borrowed time"

assert _Borrowed("Barty").bind() == "Barty pays with borrowed time.", "bind must call self.price() — never hard-code any price into it"`,
        successText: 'The vow takes hold — and somewhere, a hollow thing that never named its price simply ceases to be possible.',
        xp: 95,
      },
      quiz: [
        {
          q: 'What happens when you instantiate a class that has an unimplemented `@abstractmethod`?',
          options: [
            'It works until the abstract method is actually called',
            'TypeError is raised at the moment of instantiation',
            'NotImplementedError is raised at the moment of instantiation',
            'A warning is printed and the method silently returns None',
          ],
          answer: 1,
          explain: 'ABCs refuse to create incomplete objects, and the refusal is a '
            + 'TypeError — not NotImplementedError, which belongs to the weaker '
            + 'convention where failure waits for the call.',
        },
        {
          q: 'A subclass overrides two of its abstract base’s three abstract methods. What does instantiating it do?',
          options: [
            'Succeeds — a majority of the contract is enough',
            'Succeeds, but the one missing method raises when called',
            'Raises TypeError — the subclass is itself still abstract',
            'Raises AttributeError for the missing method',
          ],
          answer: 2,
          explain: 'The contract is all-or-nothing: until every abstract method is '
            + 'overridden, the subclass remains abstract and cannot be instantiated. '
            + 'Partial credit is exactly what ABCs exist to forbid.',
        },
        {
          q: 'Why do ABCs beat the old `raise NotImplementedError` convention?',
          options: [
            'The failure happens at object creation — the earliest possible moment — rather than at some distant later call',
            'ABCs execute abstract methods faster',
            'NotImplementedError was removed from Python 3',
            'ABCs make every method private to the class',
          ],
          answer: 0,
          explain: 'Both approaches fail; the difference is when. The convention fails '
            + 'wherever and whenever the missing method is finally called. The ABC fails '
            + 'immediately, at the constructor, where the incomplete class is obvious.',
        },
        {
          q: 'May an abstract base class contain fully implemented (concrete) methods?',
          options: [
            'No — every method of an ABC must be abstract',
            'Yes — and they may call the abstract ones, which living subclasses are guaranteed to have supplied',
            'Only if the class does not inherit from ABC',
            'Yes, but subclasses cannot inherit them',
          ],
          answer: 1,
          explain: 'This is the template method pattern: shared ceremony written once on '
            + 'the base, deferring only the missing verses to subclasses. Only methods '
            + 'marked @abstractmethod are obligations.',
        },
      ],
    },

    // ----------------------------------------------------------------
    // a5l7 — the strategy pattern
    // ----------------------------------------------------------------
    {
      id: 'a5l7',
      title: 'The Sum of All Sorcery',
      concept: 'the strategy pattern: composition, polymorphism, and first-class functions',
      xp: 40,
      narrative: 'The last page before the throne room holds no new spell. It holds '
        + 'an arrangement — the way a master arranges everything already learned so '
        + 'that it can be rearranged forever after. A sorcerer who hard-codes their '
        + 'manner of fighting must be rewritten for every new war. A sorcerer built '
        + 'around a replaceable **doctrine** — any callable thing, function or '
        + 'object — changes their nature by swapping a single part. Composition, '
        + 'from Act IV. Polymorphism, from Act IV. Functions as values, from Act '
        + 'III. Braided together they are called the **strategy pattern**, and it '
        + 'is how experts build.',
      sections: [
        {
          heading: 'The rigidity you must unlearn',
          body: 'The apprentice writes behavior as branches inside the class. Every '
            + 'new fighting style means reopening the class and grafting on another '
            + '`elif` — the class knows every behavior, so it depends on every '
            + 'behavior, and it bloats without end. The expert inverts the '
            + 'relationship: the class knows only that it *has* a behavior, and the '
            + 'behavior is **handed in from outside**.',
          code: py`class RigidSorcerer:
    def __init__(self, name, style):
        self.name = name
        self.style = style

    def cast(self, power):
        if self.style == "wildfire":
            return power * 2
        elif self.style == "siege":
            return power + 12
        # every new doctrine forces another elif, forever`,
        },
        {
          heading: 'Behavior as a value',
          body: 'Functions are objects. Assign them to names, store them in '
            + 'attributes and dicts, pass them as arguments — always **without '
            + 'parentheses**, because parentheses would *call* the function instead '
            + 'of handing it over. A stored behavior runs the moment you finally add '
            + 'parentheses to whatever holds it:',
          code: py`def wildfire(power):
    return power * 2

doctrine = wildfire          # the function itself - not its result
print(doctrine(10))          # 20

grimoire = {"burn": wildfire}
print(grimoire["burn"](7))   # 14 - fetched from the dict, then called`,
        },
        {
          heading: 'Objects that answer the call',
          body: 'Some behaviors need configuration or state — more than a bare '
            + 'function carries. Give a class the dunder `__call__(self, ...)` and '
            + 'its **instances become callable**: indistinguishable, to the caller, '
            + 'from functions. This is polymorphism at its purest. The user of a '
            + 'doctrine never asks *what* it is — only that it answers when '
            + 'called.',
          code: py`class Leech:
    def __init__(self, rate):
        self.rate = rate

    def __call__(self, power):
        return power * self.rate

drain = Leech(3)
print(drain(10))        # 30 - an object, invoked like a function
print(callable(drain))  # True`,
        },
        {
          heading: 'The strategy pattern, assembled',
          body: 'Now compose. A host object **has a** strategy (composition); the '
            + 'strategy may be any callable (polymorphism); and it can be replaced '
            + 'at runtime without touching the host’s class (first-class '
            + 'functions). Adding a new behavior to the whole system means writing '
            + 'one new callable — the host is never edited again. That is the '
            + 'pattern’s promise: **open to extension, closed to modification.**',
          code: py`def merciless(offense):
    return offense * 3

class Warden:
    def __init__(self, name, doctrine):
        self.name = name
        self.doctrine = doctrine       # composition: has-a behavior

    def judge(self, offense):
        return self.doctrine(offense)  # delegation: the part does the work

keeper = Warden("the Gatekeeper", merciless)
print(keeper.judge(4))                 # 12
keeper.doctrine = lambda offense: 0    # a new nature, swapped in live
print(keeper.judge(4))                 # 0`,
          note: 'Nothing here is new magic. Storing a callable is Act III; '
            + 'composition and dunders are Act IV; laziness and contracts sharpen '
            + 'it. Design is the discipline of arranging what you already know.',
        },
      ],
      challenge: {
        title: 'One Will, Many Weapons',
        prompt: 'Assemble the final working: a sorcerer whose nature is a part, and '
          + 'whose parts are interchangeable.\n\n'
          + 'Write all of the following:\n\n'
          + '- `wildfire(power)` — a function returning `power * 2`.\n'
          + '- `siege(power)` — a function returning `power + 12`.\n'
          + '- class `Leech` — `__init__(self, rate)` stores the rate; '
          + '`__call__(self, power)` returns `power * self.rate`.\n'
          + '- class `Sorcerer`:\n'
          + '  - `__init__(self, name, doctrine)` — store both.\n'
          + '  - `cast(self, power)` — return the result of calling the stored '
          + 'doctrine with `power`.\n'
          + '  - `adopt(self, doctrine)` — replace the stored doctrine.\n\n'
          + '`Sorcerer("M", wildfire).cast(10)` is `20`; after `adopt(Leech(4))`, '
          + '`cast(10)` is `40`. `cast` must invoke whatever is stored — never '
          + 'hard-code arithmetic or type-checks into it.',
        starter: py`# Doctrines are behaviors. The sorcerer merely channels them.

def wildfire(power):
    # TODO: return double the power
    pass


def siege(power):
    # TODO: return the power plus 12
    pass


class Leech:
    # TODO: __init__(self, rate) stores the rate
    # TODO: __call__(self, power) returns power * self.rate
    pass


class Sorcerer:
    # TODO: __init__(self, name, doctrine) - store both
    # TODO: cast(self, power) - call the stored doctrine with power
    # TODO: adopt(self, doctrine) - replace the stored doctrine
    pass`,
        solution: py`def wildfire(power):
    return power * 2


def siege(power):
    return power + 12


class Leech:
    def __init__(self, rate):
        self.rate = rate

    def __call__(self, power):
        return power * self.rate


class Sorcerer:
    def __init__(self, name, doctrine):
        self.name = name
        self.doctrine = doctrine

    def cast(self, power):
        return self.doctrine(power)

    def adopt(self, doctrine):
        self.doctrine = doctrine`,
        hints: [
          'wildfire and siege are two-line functions. Leech needs __call__ so its instances can be used exactly like those functions.',
          'Sorcerer stores the doctrine as self.doctrine — with no parentheses. Parentheses appear in exactly one place: inside cast, as self.doctrine(power).',
          'adopt is a single line: self.doctrine = doctrine. If your cast contains an if-statement or any arithmetic, you have missed the pattern.',
        ],
        validation: py`assert wildfire(10) == 20, "wildfire(10) must be 20"
assert wildfire(0) == 0, "wildfire(0) must be 0"
assert siege(9) == 21, "siege(9) must be 21"
assert siege(0) == 12, "siege(0) must be 12"
_drain = Leech(3)
assert callable(_drain), "Leech instances must be callable — implement __call__"
assert _drain(10) == 30, "Leech(3)(10) must be 30"
assert Leech(5)(4) == 20, "Leech(5)(4) must be 20 — the rate belongs to the instance"
_s = Sorcerer("Morgause", wildfire)
assert _s.name == "Morgause", "Sorcerer must store its name"
assert _s.cast(10) == 20, "with the wildfire doctrine, cast(10) must be 20"
_s.adopt(siege)
assert _s.cast(10) == 22, "after adopt(siege), cast must use the NEW doctrine — expected 22"
_s.adopt(Leech(4))
assert _s.cast(10) == 40, "a Sorcerer must channel behavior objects as readily as functions — expected 40"
_s.adopt(lambda p: p - 1)
assert _s.cast(10) == 9, "cast must call whatever doctrine is stored — never hard-code the arithmetic"
_a = Sorcerer("A", wildfire)
_b = Sorcerer("B", siege)
assert _a.cast(5) == 10 and _b.cast(5) == 17, "each Sorcerer must keep their own doctrine, untangled from the others"`,
        successText: 'Nothing new was forged tonight — only everything you already knew, arranged into a weapon that never needs reforging.',
        xp: 100,
      },
      quiz: [
        {
          q: 'What single property must an object have to serve as a Sorcerer’s doctrine?',
          options: [
            'It must inherit from Sorcerer',
            'It must be a function defined with def',
            'It must be callable — a function, a lambda, or an instance with __call__',
            'It must be immutable',
          ],
          answer: 2,
          explain: 'The Sorcerer only ever does self.doctrine(power), so anything callable '
            + 'qualifies. No inheritance is involved at all — this is duck typing applied '
            + 'to behavior.',
        },
        {
          q: 'What does defining `__call__` on a class accomplish?',
          options: [
            'It runs automatically when the object is created',
            'It lets instances be invoked with parentheses, like functions',
            'It makes the class abstract',
            'It overrides the == operator',
          ],
          answer: 1,
          explain: 'Instances of the class become callables: drain(10) works. Creation is '
            + '__init__’s job; equality is __eq__’s. __call__ answers the parentheses.',
        },
        {
          q: 'Why must the doctrine be stored as `self.doctrine = doctrine`, with no parentheses?',
          options: [
            'Parentheses would call the function immediately and store only its one-time result',
            'Parentheses are a syntax error in an assignment',
            'Omitting them saves memory',
            'Omitting them makes the doctrine private',
          ],
          answer: 0,
          explain: 'doctrine names the callable itself; doctrine(...) is an invocation. '
            + 'Store the callable so cast can invoke it fresh with each new power value.',
        },
        {
          q: 'Under the strategy pattern, you add a wholly new behavior to the system by…',
          options: [
            'editing the Sorcerer class and adding an elif branch',
            'subclassing Sorcerer once per behavior',
            'writing one new callable and passing it in — the Sorcerer class is never edited',
            'monkey-patching the cast method at runtime',
          ],
          answer: 2,
          explain: 'That is the entire prize: behavior lives outside the host, so '
            + 'extension never requires modification. Subclassing per behavior would '
            + 'multiply classes for no gain; the elif is the rigidity you just unlearned.',
        },
      ],
    },
  ],

  // ----------------------------------------------------------------
  // Boss — The Dark Lord's Trial
  // ----------------------------------------------------------------
  boss: {
    id: 'act5-boss',
    title: 'The Dark Lord’s Trial',
    narrative: 'He has waited below the last stair through every act — the author of '
      + 'the Codex, or its first prisoner; the marginalia never agree. He does not '
      + 'test whether you remember spells. He tests whether you have become the '
      + 'kind of thing that writes them: whether protocols obey you, whether your '
      + 'contracts bind, whether your rivers flow nowhere uncalled and everywhere '
      + 'on command. Six questions; three candles. Then the last working: his own '
      + 'soul-craft turned against him. He split himself into vessels to master '
      + 'death. You will write the machinery of their unmaking — and it must be '
      + 'lawful, lazy, and absolute.',
    defeatText: 'The candles drown one by one, and the dark closes its ledger over your name — study, return, and swear it again.',
    victoryText: 'The last vessel breaks, the protocol completes, and what remains of him is only a well-documented absence.',
    xp: 450,
    flawlessBonus: 50,
    gauntlet: [
      {
        q: 'A `for` loop ends when the iterator does what?',
        options: [
          'Returns None',
          'Returns False',
          'Raises StopIteration, which the loop absorbs silently',
          'Runs out of memory',
        ],
        answer: 2,
        explain: 'The end of iteration is an exception used as a signal. The for loop '
          + 'catches StopIteration itself, which is why you never see it in ordinary loops.',
      },
      {
        q: 'Immediately after `flood = (n * n for n in range(10 ** 9))`, how many squares have been computed?',
        options: [
          'All of them',
          'The first one only',
          'None — a generator expression computes only when drawn from',
          'Exactly ten',
        ],
        answer: 2,
        explain: 'Generator expressions are lazy: creating one runs nothing. Even the '
          + 'first square waits for the first next() — that deferral is what makes a '
          + 'billion-item range affordable.',
      },
      {
        q: 'What does `functools.wraps(func)` do when applied to a wrapper?',
        options: [
          'Makes the wrapper execute faster',
          'Copies func’s __name__, docstring and metadata onto the wrapper, so the disguise is complete',
          'Prevents the wrapper from being called more than once',
          'Automatically counts the wrapper’s calls',
        ],
        answer: 1,
        explain: 'wraps is about identity, not speed or counting. Without it, every '
          + 'decorated function reports itself as "wrapper" and loses its docstring — a '
          + 'small lie that poisons debugging.',
      },
      {
        q: 'An exception detonates inside a `with` block. Which is true?',
        options: [
          '__exit__ is skipped so the error can escape faster',
          '__exit__ runs; if it returns False, the exception continues outward',
          'The with statement always suppresses the exception',
          '__enter__ is called again to retry the block',
        ],
        answer: 1,
        explain: 'Teardown is unconditional — that is the entire guarantee of with. '
          + 'Suppression happens only if __exit__ deliberately returns True; False lets '
          + 'the exception continue its flight.',
      },
      {
        q: '`@dataclass` derives the generated `__init__`, `__repr__` and `__eq__` from what?',
        options: [
          'The class docstring',
          'The names of the methods you wrote by hand',
          'A registry you must update separately',
          'The type-hinted field declarations at class level',
        ],
        answer: 3,
        explain: 'The decorator reads the annotated class-level declarations — vault: int '
          + 'and kin — and generates the machinery from that single source of truth, so '
          + 'the three methods can never drift out of step.',
      },
      {
        q: '`class Wraith(Spectre)` overrides none of its abstract base’s abstract methods. What does `Wraith()` do?',
        options: [
          'Creates the object; the abstract methods simply return None',
          'Raises NotImplementedError',
          'Raises TypeError — Wraith is itself still abstract',
          'Creates the object, but marks it frozen',
        ],
        answer: 2,
        explain: 'Abstractness is inherited until every abstract method is overridden. '
          + 'The refusal is a TypeError at instantiation — NotImplementedError belongs to '
          + 'the weaker convention ABCs replaced.',
      },
    ],
    finalChallenge: {
      title: 'The Unmaking Engine',
      prompt: 'His soul lies in vessels. Your task is the machinery that ends them — '
        + 'a contract, its incarnations, and a river of ruin.\n\n'
        + 'Write all of the following:\n\n'
        + '- An abstract base class `Horcrux` (inherits `ABC`):\n'
        + '  - `__init__(self, vessel)` — store as `self.vessel`.\n'
        + '  - `destroy(self)` — abstract.\n'
        + '  - `describe(self)` — concrete; return exactly '
        + '`f"A fragment of the Dark Lord hides within {self.vessel}."`\n'
        + '- `Locket(Horcrux)` — `destroy` returns '
        + '`f"{self.vessel} is cloven by goblin-forged silver."`\n'
        + '- `Diary(Horcrux)` — `destroy` returns '
        + '`f"{self.vessel} is drowned in basilisk venom."`\n'
        + '- A **generator function** `unmaking(horcruxes)` — yields `destroy()` '
        + 'for each horcrux in order, lazily: nothing is destroyed before the '
        + 'generator is drawn from, and each draw destroys exactly one.\n\n'
        + '`Horcrux("a cup")` must raise `TypeError`, and `unmaking` must work for '
        + '*any* subclass of `Horcrux` — call `destroy()` polymorphically.',
      starter: py`from abc import ABC, abstractmethod

# TODO: the abstract base class Horcrux
#   - __init__(self, vessel) stores self.vessel
#   - destroy(self) is abstract
#   - describe(self) is concrete:
#       f"A fragment of the Dark Lord hides within {self.vessel}."

# TODO: Locket(Horcrux) - destroy returns
#       f"{self.vessel} is cloven by goblin-forged silver."

# TODO: Diary(Horcrux) - destroy returns
#       f"{self.vessel} is drowned in basilisk venom."

# TODO: unmaking(horcruxes) - a GENERATOR yielding each horcrux's
#       destroy() in order. Lazy: destroy only when drawn from.`,
      solution: py`from abc import ABC, abstractmethod


class Horcrux(ABC):
    def __init__(self, vessel):
        self.vessel = vessel

    @abstractmethod
    def destroy(self):
        ...

    def describe(self):
        return f"A fragment of the Dark Lord hides within {self.vessel}."


class Locket(Horcrux):
    def destroy(self):
        return f"{self.vessel} is cloven by goblin-forged silver."


class Diary(Horcrux):
    def destroy(self):
        return f"{self.vessel} is drowned in basilisk venom."


def unmaking(horcruxes):
    for horcrux in horcruxes:
        yield horcrux.destroy()`,
      validation: py`import types

_refused = False
try:
    Horcrux("a nameless cup")
except TypeError:
    _refused = True
assert _refused, "Horcrux must be abstract — instantiating it directly must raise TypeError"

class _Inert(Horcrux):
    pass

_inert_refused = False
try:
    _Inert("a hollow crown")
except TypeError:
    _inert_refused = True
assert _inert_refused, "a subclass without destroy() is still abstract — it must refuse instantiation with TypeError"

_locket = Locket("the locket")
_diary = Diary("the diary")
assert isinstance(_locket, Horcrux) and isinstance(_diary, Horcrux), "Locket and Diary must inherit from Horcrux"
assert _locket.destroy() == "the locket is cloven by goblin-forged silver.", "Locket.destroy is wrong — check the exact sentence and the vessel woven into it"
assert _diary.destroy() == "the diary is drowned in basilisk venom.", "Diary.destroy is wrong — check the exact sentence and the vessel woven into it"
assert _locket.destroy() != _diary.destroy(), "the two horcruxes must die differently — each subclass supplies its own destroy"
assert _locket.describe() == "A fragment of the Dark Lord hides within the locket.", "describe — inherited from Horcrux — is wrong for Locket"
assert _diary.describe() == "A fragment of the Dark Lord hides within the diary.", "describe must be written once on Horcrux and inherited, weaving in self.vessel"

_g = unmaking([_locket, _diary])
assert isinstance(_g, types.GeneratorType), "unmaking must be a generator function — use yield, do not return a list"
assert next(_g) == "the locket is cloven by goblin-forged silver.", "the first draw must destroy the first horcrux"
assert next(_g) == "the diary is drowned in basilisk venom.", "the second draw must destroy the second horcrux"
_spent = False
try:
    next(_g)
except StopIteration:
    _spent = True
assert _spent, "after the last horcrux, the generator must be exhausted — StopIteration"
assert list(unmaking([])) == [], "an empty hoard must yield nothing"

class _Counting(Horcrux):
    felled = 0
    def destroy(self):
        _Counting.felled += 1
        return "unmade"

_lazy = unmaking([_Counting("one"), _Counting("two"), _Counting("three")])
assert _Counting.felled == 0, "unmaking must be LAZY — no horcrux may be destroyed before the generator is drawn from"
next(_lazy)
assert _Counting.felled == 1, "each draw from the generator must destroy exactly one horcrux"
assert list(_lazy) == ["unmade", "unmade"], "the generator must yield destroy() for every remaining horcrux, in order"

class _Ring(Horcrux):
    def destroy(self):
        return f"{self.vessel} cracks upon the hearth."

assert next(unmaking([_Ring("the ring")])) == "the ring cracks upon the hearth.", "unmaking must work for ANY Horcrux subclass — call destroy() polymorphically"`,
      xp: 0,
    },
  },

  // ----------------------------------------------------------------
  // Codex — the act's vocabulary
  // ----------------------------------------------------------------
  codex: [
    { term: 'iterator', def: 'An object that walks a sequence one value at a time via `__next__`, remembering its position and raising `StopIteration` when spent.' },
    { term: 'iterable', def: 'Anything that can produce an iterator when handed to `iter()` — lists, strings, dicts, files, generators.' },
    { term: 'StopIteration', def: 'The exception an iterator raises to signal exhaustion; `for` loops catch it silently to know when to stop.' },
    { term: 'generator', def: 'An iterator built from a function containing `yield`; it computes each value on demand and freezes between draws.' },
    { term: 'yield', def: 'The keyword that pauses a generator function, hands one value out, and preserves all local state for the next draw.' },
    { term: 'generator expression', def: 'The lazy twin of a list comprehension, written with parentheses: `(n * n for n in runes)`.' },
    { term: 'lazy evaluation', def: 'Computing each value only at the moment it is actually needed, instead of paying for every value up front.' },
    { term: 'closure', def: 'An inner function that keeps access to variables of its enclosing scope even after the outer function has returned.' },
    { term: 'decorator', def: 'A function that takes a function and returns a replacement for it, applied with the `@name` line above a `def`.' },
    { term: 'functools.wraps', def: 'A helper applied to a wrapper so the decorated function keeps its original `__name__`, docstring and metadata.' },
    { term: 'context manager', def: 'An object with `__enter__` and `__exit__` that guarantees teardown around a `with` block — even when the block raises.' },
    { term: 'contextlib.contextmanager', def: 'A decorator that turns a generator function into a context manager; code before `yield` is entry, code after it is the exit — wrap the `yield` in `try/finally` so the exit runs even when the block raises.' },
    { term: '@dataclass', def: 'A decorator that reads a class’s type-hinted field declarations and generates `__init__`, `__repr__` and `__eq__` from them.' },
    { term: 'type hint', def: 'An annotation such as `vault: int` documenting a value’s intended type; Python does not enforce it at runtime.' },
    { term: 'abc.ABC / @abstractmethod', def: 'The machinery of contracts: subclass `ABC`, mark required methods abstract, and any incomplete class raises `TypeError` at instantiation.' },
    { term: 'strategy pattern', def: 'A design in which an object holds an interchangeable callable — the strategy — and delegates behavior to it, so behavior can be swapped without editing the class.' },
  ],
};
