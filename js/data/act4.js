// ============================================================
// act4.js — Act IV: The Forging of the One Ring
// Object-Oriented Sorcery — classes and instances, methods and
// attributes, encapsulation, inheritance, polymorphism, dunder
// methods, and composition.
// ============================================================

const py = String.raw;

export default {
  id: 'act4',
  numeral: 'IV',
  arc: 'Object-Oriented Sorcery',
  title: 'The Forging of the One Ring',
  tagline: 'One mold beneath the mountain, and every ring that will ever be already sleeping inside it.',
  sigil: '👁️',
  epigraph: {
    text: 'He did not forge nineteen rings. He forged one idea of a ring, and set it loose to do the rest.',
    source: 'a scorched leaf from the annals of Eregion',
  },
  intro: 'The acts before this one taught you to command the machine — to store, to loop, '
    + 'to name your spells and ward them against failure. This act teaches you to *create*. '
    + '**Object-oriented programming** is the craft of binding data and behavior into a single '
    + 'made thing: the `class` is the mold, and each **object** cast from it is an instance with '
    + 'its own memory and its own obedient methods.\n\n'
    + 'In the chambers below you will carve classes with `__init__`, bind verbs to them as methods, '
    + 'guard their secrets with properties, breed subclasses that inherit and override their '
    + 'ancestors, command mixed hosts through polymorphism, learn the dunder-speech that makes '
    + 'operators kneel, and at last assemble armies of objects that hold other objects. '
    + 'What leaves this forge does not leave unchanged. Neither will you.',
  lessons: [
    // ------------------------------------------------------------------
    // a4l1 — The Great Forge
    // ------------------------------------------------------------------
    {
      id: 'a4l1',
      title: 'The Great Forge',
      concept: 'why classes exist; class definition, __init__, self, instance attributes, creating instances',
      xp: 36,
      narrative: 'The road ends inside the mountain. In Sammath Naur the air itself smoulders, '
        + 'and on the anvil lies not a ring but the *idea* of a ring — a mold, carved once, '
        + 'patient as hunger. Every art you have learned — the loops, the functions, the wards '
        + 'against error — was apprenticeship for this. Now you learn what the Enemy learned '
        + 'before you: do not make the thing. Make the thing that makes the thing, and the world '
        + 'will fill with your work whether it consents or not.',
      sections: [
        {
          heading: 'Why the forge exists',
          body: 'Until now your data and your behavior have lived apart: values in variables and '
            + 'dictionaries, verbs in functions that merely *hope* to be given the right shape of '
            + 'data. Nothing binds them, so they drift — and drift is where corruption enters.\n\n'
            + 'A **class** ends the drift. It is a definition that welds data and the functions '
            + 'that work on that data into one new *type* of thing. This is the single analogy '
            + 'you need for the whole act: the class is the **mold**, carved once; every object '
            + 'cast from it is a separate ring. After the analogy, only mechanics remain.',
          code: py`# Before the forge: data here, behavior there, nothing binding them.
ring = {"name": "Narya", "bearer": "Cirdan"}

def describe(ring):
    return ring["name"] + " is borne by " + ring["bearer"]

print(describe(ring))
# Any stray hand may do ring["bearer"] = 42 — and describe() breaks.
# The dict does not know describe() exists. They are strangers.`,
        },
        {
          heading: 'The mold and the casting',
          body: 'A class begins with the `class` keyword and a name (written in CapWords by iron '
            + 'convention). Inside it you define `__init__` — the **initializer** — a special '
            + 'method Python runs *automatically* every time a new object is cast. Its job is to '
            + 'lay the starting attributes onto the newborn instance.\n\n'
            + '- `ClassName(args)` creates a new, blank **instance** and hands it to `__init__`.\n'
            + '- `self.name = name` stores a value on *that particular instance* — an **instance attribute**.\n'
            + '- The finished instance is what the call returns; you catch it in a variable.',
          code: py`class Ring:
    def __init__(self, name, bearer):
        self.name = name        # an instance attribute
        self.bearer = bearer    # another; each casting gets its own

narya = Ring("Narya", "Cirdan")     # casting: __init__ runs by itself
vilya = Ring("Vilya", "Gil-galad")  # a second, separate casting

print(narya.name)     # Narya
print(vilya.bearer)   # Gil-galad`,
          note: 'You never call `__init__` yourself, and it must not `return` anything — the class '
            + 'call already returns the new instance. The double underscores mark it as one of the '
            + 'deep names; you will learn the rest of that speech later in this act.',
        },
        {
          heading: 'self — the ring in hand',
          body: '`self` is the first parameter of every method, and it is nothing more than **the '
            + 'instance currently being worked on**. When Python runs `Ring("Narya", "Cirdan")`, '
            + 'it creates the blank instance and passes it to `__init__` as `self` — you never '
            + 'pass it yourself. `self` is not a keyword, only a convention, but it is a '
            + 'convention with the force of law: rename it and every reader of your code will '
            + 'curse your name.\n\n'
            + 'Because attributes are written onto `self`, **each instance owns its own**. Two '
            + 'rings from one mold share the design and nothing else.',
          code: py`class Ring:
    def __init__(self, name):
        self.name = name

a = Ring("Narya")
b = Ring("Nenya")
b.name = "The Nameless"   # touches b, and only b

print(a.name)   # Narya — untouched
print(b.name)   # The Nameless`,
        },
      ],
      challenge: {
        title: 'The First Casting',
        prompt: 'The mold is cold iron waiting for meaning. Carve it, and cast the first ring of '
          + 'this age.\n\n'
          + 'Your working must satisfy, exactly:\n\n'
          + '- Define a class named `RingOfPower`.\n'
          + '- Its `__init__` takes two parameters after `self`: `name` and `bearer`. Store them as `self.name` and `self.bearer`.\n'
          + '- Inside `__init__`, also set `self.corrupted = False` — every ring leaves the forge clean. For now.\n'
          + '- Create one instance: `vilya = RingOfPower("Vilya", "Gil-galad")`.\n'
          + '- Print one line built from the instance\'s attributes, reading exactly: `Vilya is borne by Gil-galad`',
        starter: py`# The mold is uncarved. Give it shape.

# TODO: define the class RingOfPower
#   - __init__ takes name and bearer (after self)
#   - store them as self.name and self.bearer
#   - every new ring also starts with self.corrupted = False

# TODO: cast one ring: vilya = RingOfPower("Vilya", "Gil-galad")

# TODO: print "<name> is borne by <bearer>" from the instance's attributes
`,
        solution: py`class RingOfPower:
    def __init__(self, name, bearer):
        self.name = name
        self.bearer = bearer
        self.corrupted = False

vilya = RingOfPower("Vilya", "Gil-galad")
print(vilya.name + " is borne by " + vilya.bearer)`,
        hints: [
          'Begin with class RingOfPower: — then, indented inside it, def __init__(self, name, bearer): with its own indented body.',
          'Inside __init__ write three assignments onto self: self.name = name, self.bearer = bearer, self.corrupted = False. The last one takes no parameter — every ring starts clean.',
          'After the class (back at zero indentation): vilya = RingOfPower("Vilya", "Gil-galad") and then print(vilya.name + " is borne by " + vilya.bearer).',
        ],
        validation: py`r = RingOfPower("Nenya", "Galadriel")
assert r.name == "Nenya", "The casting lost its name — __init__ must store its first argument as self.name."
assert r.bearer == "Galadriel", "The casting forgot its bearer — __init__ must store its second argument as self.bearer."
assert r.corrupted is False, "Every fresh ring must begin clean — set self.corrupted = False inside __init__."
assert "corrupted" in vars(r), "corrupted must be laid on each instance inside __init__ (self.corrupted = False), not kept anywhere else."
r2 = RingOfPower("Narya", "Cirdan")
r2.corrupted = True
assert r.corrupted is False, "Corrupting one ring tainted another — attributes must be set on self, so each instance owns its own."
assert "vilya" in dir(), "Sammath Naur sees no ring named vilya — create it with vilya = RingOfPower(\"Vilya\", \"Gil-galad\")."
assert isinstance(vilya, RingOfPower), "vilya must be cast from the RingOfPower mold — call the class to create it."
assert vilya.name == "Vilya" and vilya.bearer == "Gil-galad", "vilya carries the wrong inscription — its name must be Vilya, its bearer Gil-galad."
assert "Vilya is borne by Gil-galad" in _stdout, "Sammath Naur heard no proclamation — print exactly: Vilya is borne by Gil-galad"`,
        successText: 'The mold cools. Somewhere inside it, nineteen unmade rings wait their turn.',
        xp: 75,
      },
      extras: [
        {
          id: 'a4l1x1',
          kind: 'echo',
          title: 'The Seeing Stones',
          prompt: 'Rings are not the only things cast from one making. In an older chamber '
            + 'seven seeing-stones were poured from a single mold, and each went to its own '
            + 'tower — to watch, and to be watched through.\n\n'
            + 'Your working must satisfy, exactly:\n\n'
            + '- Define a class named `Palantir`.\n'
            + '- Its `__init__` takes two parameters after `self`: `seat` and `keeper`. Store them as `self.seat` and `self.keeper`.\n'
            + '- Inside `__init__`, also set `self.clouded = False` — every stone leaves the making clear. For a while.\n'
            + '- Create one instance: `orthanc = Palantir("Orthanc", "Saruman")`.\n'
            + '- Print one line built from the instance\'s attributes, reading exactly: `The stone of Orthanc answers to Saruman`',
          starter: py`# Seven stones, one making. Carve the mold.

# TODO: class Palantir -- __init__(self, seat, keeper) stores both;
#   every new stone also starts self.clouded = False

# TODO: orthanc = Palantir("Orthanc", "Saruman")
# TODO: print "The stone of <seat> answers to <keeper>"
`,
          solution: py`class Palantir:
    def __init__(self, seat, keeper):
        self.seat = seat
        self.keeper = keeper
        self.clouded = False

orthanc = Palantir("Orthanc", "Saruman")
print("The stone of " + orthanc.seat + " answers to " + orthanc.keeper)`,
          hints: [
            'The shape is the ring-mold\'s: class Palantir: over def __init__(self, seat, keeper):, with three assignments onto self in its body — seat, keeper, and clouded = False (that last one takes no parameter).',
            'After the class, at zero indentation: orthanc = Palantir("Orthanc", "Saruman"), then print("The stone of " + orthanc.seat + " answers to " + orthanc.keeper).',
          ],
          validation: py`assert "Palantir" in dir(), "No mold named Palantir stands in this working -- define class Palantir."
try:
    p = Palantir("Minas Ithil", "the Nazgul")
except TypeError:
    raise AssertionError("Palantir(\"Minas Ithil\", \"the Nazgul\") was refused -- __init__ must take exactly seat and keeper after self.")
assert p.seat == "Minas Ithil", "The stone forgot its seat -- __init__ must store its first argument as self.seat."
assert p.keeper == "the Nazgul", "The stone forgot its keeper -- __init__ must store its second argument as self.keeper."
assert p.clouded is False, "A stone leaves the making clear -- set self.clouded = False inside __init__."
assert "clouded" in vars(p), "clouded must be laid on each instance inside __init__ (self.clouded = False), not kept anywhere else."
q = Palantir("Osgiliath", "the river")
q.clouded = True
assert p.clouded is False, "Clouding one stone darkened another -- lay attributes on self, so each casting owns its own."
assert "orthanc" in dir(), "No stone named orthanc was cast -- create orthanc = Palantir(\"Orthanc\", \"Saruman\")."
assert isinstance(orthanc, Palantir), "orthanc must be cast from the Palantir mold -- call the class to create it."
assert orthanc.seat == "Orthanc" and orthanc.keeper == "Saruman", "orthanc carries the wrong making -- its seat must be Orthanc, its keeper Saruman."
assert "The stone of Orthanc answers to Saruman" in _stdout, "The tower heard no report -- print exactly: The stone of Orthanc answers to Saruman"`,
          successText: 'The stone wakes under your hand. Somewhere far east, something notices.',
          xp: 20,
        },
      ],
      trace: [
        {
          id: 'a4l1t1',
          code: py`class Ring:
    def __init__(self, name):
        self.name = name
        self.bearer = "unclaimed"

r = Ring("Nenya")
r.bearer = "Galadriel"
s = Ring("Nenya")
print(r.name, s.bearer)`,
          q: 'The scrying: what does this working print?',
          options: ['Nenya Galadriel', 'Nenya unclaimed', 'Galadriel unclaimed', 'Nenya None'],
          answer: 1,
          explain: '`__init__` runs afresh for every casting: `s` receives its own '
            + '`bearer = "unclaimed"` at birth, and the assignment onto `r` touches `r` '
            + 'alone — two rings, two memories. "Nenya Galadriel" imagines the castings '
            + 'share attributes because they share a name; "Galadriel unclaimed" swaps '
            + 'what was printed — r.name was never reassigned; "Nenya None" forgets that '
            + '__init__ lays bearer down before any hand can read it.',
        },
        {
          id: 'a4l1t2',
          code: py`class Furnace:
    def __init__(self, heat):
        self.heat = heat
        self.lit = self.heat > 0

f = Furnace(4)
f.heat = 0
print(f.lit, f.heat)`,
          q: 'The scrying: what does this working print?',
          options: ['True 0', 'False 0', 'True 4', 'False 4'],
          answer: 0,
          explain: '`self.lit = self.heat > 0` runs ONCE, inside `__init__`, and stores '
            + 'the result — an attribute holds a value, not a live formula. The later '
            + '`f.heat = 0` changes heat alone; nothing re-runs the comparison, so lit '
            + 'stays True. "False 0" imagines lit recomputed at every read — that is what '
            + 'properties are for, two trials hence; "True 4" forgets the plain assignment '
            + 'to heat lands; "False 4" commits both errors at once.',
        },
      ],
      quiz: [
        {
          q: 'What is the relationship between a class and an instance?',
          options: [
            'They are two names for the same thing',
            'The class is the blueprint; an instance is one concrete object cast from it, with its own attribute values',
            'The instance is the blueprint; the class is a copy made at runtime',
            'A class can produce only one instance',
          ],
          answer: 1,
          explain: 'The class defines the shape — which attributes and methods exist. Each call '
            + 'like `Ring("Narya")` casts a separate instance carrying its own data. One mold, '
            + 'many rings; the mold is not a ring itself.',
        },
        {
          q: 'When does `__init__` run?',
          options: [
            'Automatically, right after Python creates a new instance from a call like `Ring("Narya")`',
            'Only when you call `ring.__init__()` yourself',
            'Once, when the `class` statement is first executed',
            'Every time you read an attribute from the instance',
          ],
          answer: 0,
          explain: 'Calling the class creates a blank instance and immediately hands it to '
            + '`__init__` as `self` so starting attributes can be laid down. You never invoke '
            + '`__init__` by hand, and the `class` statement itself creates no instances at all.',
        },
        {
          q: 'In `def __init__(self, name):`, what exactly is `self`?',
          options: [
            'A reserved Python keyword that cannot be renamed',
            'The class itself',
            'The particular instance being worked on — Python passes it in automatically',
            'A temporary copy of the instance, discarded when the method ends',
          ],
          answer: 2,
          explain: '`self` is only the conventional name of the first parameter; Python fills it '
            + 'with the instance in hand. It is not a keyword (renaming is legal, and cruel to '
            + 'readers), it is not the class, and it is the real instance — what you write onto '
            + '`self` persists after the method ends.',
        },
        {
          q: 'After `a = Ring("Narya")` and `b = Ring("Nenya")`, what does `a.name = "Doom"` do to `b`?',
          options: [
            'Renames both rings, since they share one mold',
            'Raises an error — attributes cannot be reassigned',
            'Renames `b` but not `a`',
            'Nothing — each instance owns its own attributes, so only `a` changes',
          ],
          answer: 3,
          explain: 'Instance attributes live on each instance separately, laid down through '
            + '`self` in `__init__`. The class (the design) is shared; the data is not.',
        },
      ],
    },

    // ------------------------------------------------------------------
    // a4l2 — Nine Bands for Nine Kings
    // ------------------------------------------------------------------
    {
      id: 'a4l2',
      title: 'Nine Bands for Nine Kings',
      concept: 'methods that use self; instance attributes vs class attributes; calling methods across many objects',
      xp: 36,
      narrative: 'Nine rings leave the forge in a single season, cast from a single mold. The '
        + 'kings who take them are proud, distinct, jealous of their borders — and identical in '
        + 'the one way that matters. Each ring keeps its own tally: years worn, will surrendered. '
        + 'But stamped deeper than any tally is one mark they all share, the maker\'s brand, held '
        + 'not by any single ring but by the mold itself. Learn the difference between what each '
        + 'ring carries and what all rings share. The kings never did, and you have seen what '
        + 'became of them.',
      sections: [
        {
          heading: 'Verbs bound to the noun',
          body: 'A **method** is a function defined inside a class. Its first parameter is '
            + '`self`, and through `self` it may read and change the attributes of the instance '
            + 'it was called on.\n\n'
            + 'The call `king.wear(10)` is pure convenience: Python looks `wear` up on the '
            + 'class and runs `MortalKing.wear(king, 10)` — the instance slides in as `self`, '
            + 'your arguments follow. That is the entire mystery of `self`, laid bare.\n\n'
            + '- Methods can change state: `self.years_worn = self.years_worn + years`.\n'
            + '- State persists between calls, because it lives on the instance, not in the method.',
          code: py`class MortalKing:
    def __init__(self, name):
        self.name = name
        self.years_worn = 0

    def wear(self, years):
        self.years_worn = self.years_worn + years
        return self.years_worn

angmar = MortalKing("the lord of Angmar")
angmar.wear(50)
print(angmar.wear(50))   # 100 — the tally survived between calls`,
        },
        {
          heading: 'The shared brand — class attributes',
          body: 'An assignment written directly in the class body — not inside any method, no '
            + '`self` — creates a **class attribute**: one value, stored on the class itself, '
            + 'visible through every instance.\n\n'
            + 'When you *read* `a.master`, Python looks on the instance first; not finding it, '
            + 'it climbs to the class. When you *assign* `a.master = ...`, Python writes onto '
            + 'the instance, creating a private shadow that hides the class value from `a` alone. '
            + 'Reading climbs; writing does not — for plain attributes, that is. The next trial '
            + 'forges *properties*: guards built to intercept an assignment before it lands.',
          code: py`class MortalKing:
    master = "Sauron"          # ONE value, stamped on the mold itself

    def __init__(self, name):
        self.name = name       # per-instance, as before

a = MortalKing("Khamul")
b = MortalKing("Herumor")
print(a.master, b.master)      # Sauron Sauron — both read the one brand

MortalKing.master = "the Eye"  # re-stamp the mold: every king feels it
print(a.master, b.master)      # the Eye the Eye`,
        },
        {
          heading: 'The trap: one hoard, many hands',
          body: 'Now the corruption this act warned you of. Put a **mutable** value — a list, a '
            + 'dict — in the class body, and every instance shares that one object. A method '
            + 'that appends through `self.members` finds the class list and mutates it, and '
            + 'suddenly every instance bears marks it never earned.\n\n'
            + 'The cure is ritual by now: anything mutable and per-instance is created in '
            + '`__init__`, on `self`.',
          code: py`class Cohort:
    members = []                    # ONE shared list — a trap

    def recruit(self, name):
        self.members.append(name)   # finds the CLASS list and scars it

first = Cohort()
second = Cohort()
first.recruit("Gorbag")
print(second.members)               # ['Gorbag'] — never recruited, yet marked

class TrueCohort:
    def __init__(self):
        self.members = []           # each cohort forges its own list

    def recruit(self, name):
        self.members.append(name)

a = TrueCohort()
b = TrueCohort()
a.recruit("Shagrat")
print(b.members)                    # [] — clean`,
          note: 'Class attributes are for values genuinely shared by all instances — constants, '
            + 'brands, defaults that are never mutated in place. If it can be appended to, it '
            + 'belongs to `self`.',
        },
        {
          heading: 'Autopsy: the phantom copy',
          body: 'By now a belief may have taken hold in you: *"a class attribute is a '
            + 'per-ring default — each ring receives its own copy at forging, and what one '
            + 'ring does with its copy is its own affair."* Lay that belief on the slab and '
            + 'make it predict. Below, one king raises his tally and marks his list. The '
            + 'belief predicts the other king untouched on both counts: `b.tally` reads `0`, '
            + '`b.marks` reads `[]`.\n\n'
            + 'The Codex answers: `0 [\'Angmar\']`. Half the prediction survives — and the '
            + 'half that dies was never a copy at all. There are **no copies**. Both names '
            + 'live on the mold, and every lookup through a ring climbs to it:\n\n'
            + '- `a.tally += 1` reads the mold\'s `0`, adds one, then **assigns** — and '
            + 'assignment through an instance writes onto the instance, forging a private '
            + 'shadow. The mold\'s value beneath is untouched, so `b` still reads `0`.\n'
            + '- `a.marks.append(...)` reads the mold\'s one list and **mutates it in '
            + 'place**. No assignment happens, so no shadow is forged — and every ring that '
            + 'climbs finds the scar.',
          code: py`class Ring:
    tally = 0     # the belief: each ring gets its own copy
    marks = []    # the belief: this one too

a, b = Ring(), Ring()
a.tally += 1              # assignment - forges a's private shadow
a.marks.append("Angmar")  # mutation - scars the one shared list
print(b.tally, b.marks)   # 0 ['Angmar']`,
          note: '**The law: a class attribute is one object on the class. Assignment '
            + 'through an instance forges a private shadow; mutation through an instance '
            + 'wounds the shared original.** The dead belief was earned honestly — with '
            + 'numbers and strings every `+=` quietly forges a shadow, so the sharing stays '
            + 'invisible until the first mutable value exposes the single hoard beneath.',
        },
        {
          heading: 'One verb, many kings',
          body: 'Instances are ordinary values: they sit in lists, pass through functions, '
            + 'return from them. Put nine kings in a list and one loop commands them all — the '
            + 'same method name, but each call works on its own `self`, its own tally.',
          code: py`class Bearer:
    def __init__(self, name):
        self.name = name
        self.faded = False

    def fade(self):
        self.faded = True

nine = [Bearer("Khamul"), Bearer("Dwar"), Bearer("Adunaphel")]
for bearer in nine:
    bearer.fade()               # same verb; each acts on itself

print([b.faded for b in nine])  # [True, True, True]`,
        },
      ],
      challenge: {
        title: 'The Nine Are Given',
        prompt: 'Nine kings wait in the antechamber, palms open. Cast what they came for, and '
          + 'brand it honestly.\n\n'
          + 'Your working must satisfy, exactly:\n\n'
          + '- Define a class `MortalKing`.\n'
          + '- In the class body (not inside `__init__`), define a class attribute `master = "Sauron"` — one brand, shared by all.\n'
          + '- `__init__` takes `name` after `self`; store `self.name` and start `self.years_worn = 0`.\n'
          + '- Method `wear(self, years)`: add `years` to `self.years_worn`, then **return** the new total.\n'
          + '- Method `is_wraith(self)`: return `True` once `years_worn` is 100 or more, otherwise `False`.\n'
          + '- Create `witch_king = MortalKing("the Witch-king")`, call `witch_king.wear(60)` twice, then print exactly: `the Witch-king serves Sauron` — built from `witch_king.name` and `witch_king.master`.',
        starter: py`# Nine molds wait. Carve the class.

class MortalKing:
    # TODO: class attribute, in this body, NOT inside __init__:
    #   master = "Sauron"

    def __init__(self, name):
        # TODO: store self.name; start self.years_worn at 0
        pass

    # TODO: def wear(self, years):
    #   add years to self.years_worn, then RETURN the new total

    # TODO: def is_wraith(self):
    #   True once years_worn reaches 100 or more, else False

# TODO: witch_king = MortalKing("the Witch-king")
# TODO: call witch_king.wear(60) twice
# TODO: print: the Witch-king serves Sauron
#   (build it from witch_king.name and witch_king.master)
`,
        solution: py`class MortalKing:
    master = "Sauron"

    def __init__(self, name):
        self.name = name
        self.years_worn = 0

    def wear(self, years):
        self.years_worn = self.years_worn + years
        return self.years_worn

    def is_wraith(self):
        return self.years_worn >= 100

witch_king = MortalKing("the Witch-king")
witch_king.wear(60)
witch_king.wear(60)
print(witch_king.name + " serves " + witch_king.master)`,
        hints: [
          'The class attribute is a plain assignment in the class body: master = "Sauron" — no self, no def. Everything per-king goes inside __init__ on self.',
          'wear must both change and report: self.years_worn = self.years_worn + years, then return self.years_worn. And is_wraith is one line: return self.years_worn >= 100.',
          'After the class: witch_king = MortalKing("the Witch-king"), then witch_king.wear(60) on two lines, then print(witch_king.name + " serves " + witch_king.master).',
        ],
        validation: py`k = MortalKing("Khamul")
assert k.years_worn == 0, "A king begins unworn — __init__ must set self.years_worn = 0."
assert k.is_wraith() is False, "A fresh king is no wraith — is_wraith must return False before 100 years."
total = k.wear(40)
assert total == 40, "wear must RETURN the new total — wear(40) on a fresh king should return 40."
k.wear(59)
assert k.years_worn == 99, "The tally drifted — wear must add its years to self.years_worn."
assert k.is_wraith() is False, "At 99 years the king still clings to flesh — is_wraith must stay False below 100."
k.wear(1)
assert k.is_wraith() is True, "At exactly 100 years the fading completes — is_wraith must return True when years_worn reaches 100."
other = MortalKing("Herumor")
assert other.years_worn == 0, "One king's years bled into another — years_worn must be set on self in __init__, never shared on the class."
assert getattr(MortalKing, "master", None) == "Sauron", "The brand is missing from the mold — write master = \"Sauron\" in the class body itself."
assert "master" not in vars(other), "master was stamped onto each king separately — define it once in the class body, not inside __init__."
assert "witch_king" in dir(), "Sammath Naur sees no witch_king — create it with MortalKing(\"the Witch-king\")."
assert witch_king.years_worn == 120, "The Witch-king has worn his ring the wrong span — call witch_king.wear(60) twice."
assert "the Witch-king serves Sauron" in _stdout, "No oath was heard — print exactly: the Witch-king serves Sauron"`,
        successText: 'Nine hands close around nine bands. The tally of years begins, and it runs in one direction only.',
        xp: 75,
      },
      extras: [
        {
          id: 'a4l2x1',
          kind: 'echo',
          title: 'The Engines of Gorgoroth',
          prompt: 'Not everything the foundry casts fits on a finger. The great engines crawl '
            + 'toward the walls of the West, and each keeps its own count of paces — though one '
            + 'brand marks them all.\n\n'
            + 'Your working must satisfy, exactly:\n\n'
            + '- Define a class `SiegeEngine`.\n'
            + '- In the class body (not inside `__init__`), define a class attribute `foundry = "Gorgoroth"`.\n'
            + '- `__init__` takes `name` after `self`; store `self.name` and start `self.paces = 0`.\n'
            + '- Method `advance(self, paces)`: add `paces` to `self.paces`, then **return** the new total.\n'
            + '- Method `at_the_walls(self)`: return `True` once `paces` is 300 or more, otherwise `False`.\n'
            + '- Create `grond = SiegeEngine("Grond")`, call `grond.advance(150)` twice, then print exactly: `Grond was cast in Gorgoroth` — built from `grond.name` and `grond.foundry`.',
          starter: py`# One foundry brands them all. Each engine keeps its own tally.

class SiegeEngine:
    # TODO: class attribute foundry = "Gorgoroth" -- here, not in __init__

    # TODO: __init__(self, name) -- store self.name; start self.paces at 0

    # TODO: def advance(self, paces): add to self.paces, RETURN the new total

    # TODO: def at_the_walls(self): True once paces reaches 300 or more
    pass

# TODO: grond = SiegeEngine("Grond"); advance it 150 twice;
#   print "Grond was cast in Gorgoroth" from its attributes
`,
          solution: py`class SiegeEngine:
    foundry = "Gorgoroth"

    def __init__(self, name):
        self.name = name
        self.paces = 0

    def advance(self, paces):
        self.paces = self.paces + paces
        return self.paces

    def at_the_walls(self):
        return self.paces >= 300

grond = SiegeEngine("Grond")
grond.advance(150)
grond.advance(150)
print(grond.name + " was cast in " + grond.foundry)`,
          hints: [
            'The brand is a plain assignment in the class body: foundry = "Gorgoroth" — no self, no def. The tally is per-engine, so paces starts at 0 inside __init__, on self.',
            'advance must both change and report: self.paces = self.paces + paces, then return self.paces. at_the_walls is one line: return self.paces >= 300. Then cast grond and call advance(150) twice.',
          ],
          validation: py`try:
    e = SiegeEngine("Ram of Udun")
except TypeError:
    raise AssertionError("SiegeEngine(\"Ram of Udun\") was refused -- __init__ must take exactly name after self.")
try:
    p0 = e.paces
except AttributeError:
    raise AssertionError("A new engine carries no tally at all -- __init__ must set self.paces = 0.")
assert p0 == 0, "A new engine has moved nowhere -- __init__ must set self.paces = 0."
assert e.at_the_walls() is False, "An engine still in the foundry is not at the walls -- at_the_walls must return False below 300."
got = e.advance(120)
assert got == 120, "advance must RETURN the new total -- advance(120) on a fresh engine should return 120."
e.advance(179)
assert e.paces == 299, "The tally drifted -- advance must add its paces onto self.paces."
assert e.at_the_walls() is False, "At 299 paces the walls still stand off -- at_the_walls must stay False below 300."
e.advance(1)
assert e.at_the_walls() is True, "At exactly 300 paces the engine arrives -- use >= 300, not > 300."
other = SiegeEngine("Tower of Iron")
assert other.paces == 0, "One engine's paces bled into another -- set self.paces in __init__, never in the class body."
assert getattr(SiegeEngine, "foundry", None) == "Gorgoroth", "The brand is missing from the mold -- write foundry = \"Gorgoroth\" in the class body itself."
assert "foundry" not in vars(other), "foundry was stamped onto each engine separately -- define it once in the class body, not inside __init__."
assert "grond" in dir(), "No engine named grond was cast -- create grond = SiegeEngine(\"Grond\")."
assert grond.paces == 300, "Grond has crawled the wrong distance -- call grond.advance(150) twice."
assert "Grond was cast in Gorgoroth" in _stdout, "The muster heard nothing -- print exactly: Grond was cast in Gorgoroth"`,
          successText: 'The engine reaches the walls on schedule, and the one brand watches through every casting.',
          xp: 20,
        },
        {
          id: 'a4l2x2',
          kind: 'cursed',
          title: 'The Twin Muster-Books',
          prompt: 'A scroll from the quartermasters of the Black Gate, delivered with a '
            + 'complaint nailed to it. Two warbands were raised, one at each gate, and each '
            + 'keeper wrote only in his own muster-book: two names went into the northern '
            + 'book, one into the southern. Yet when the books were opened before the Eye, '
            + '**each held all three names** — every orc now answers to both gates, drawing '
            + 'double rations and obeying neither. The rite raises no error. It simply '
            + 'refuses to keep two books.\n\n'
            + 'Mend the rite **in place**. When it is healed, each book must hold only the '
            + 'names enlisted at its own gate, in enlistment order, and a freshly raised '
            + 'warband must open an empty book.',
          starter: py`# THE MUSTER-BOOKS OF THE TWO GATES -- recovered intact from the archive.
# The rite runs without a single error, and the books still lie.
# Mend it IN PLACE -- do not rewrite it from nothing.

class Warband:
    recruits = []

    def __init__(self, gate):
        self.gate = gate

    def enlist(self, orc):
        self.recruits.append(orc)

    def muster(self):
        return self.gate + ": " + ", ".join(self.recruits)

north = Warband("Cirith Gorgor")
south = Warband("Morannon")
north.enlist("Muzgash")
north.enlist("Lagduf")
south.enlist("Snaga")
print(north.muster())
print(south.muster())`,
          solution: py`# THE MUSTER-BOOKS OF THE TWO GATES -- mended.

class Warband:
    def __init__(self, gate):
        self.gate = gate
        self.recruits = []

    def enlist(self, orc):
        self.recruits.append(orc)

    def muster(self):
        return self.gate + ": " + ", ".join(self.recruits)

north = Warband("Cirith Gorgor")
south = Warband("Morannon")
north.enlist("Muzgash")
north.enlist("Lagduf")
south.enlist("Snaga")
print(north.muster())
print(south.muster())`,
          hints: [
            'Make the rite confess before you cut: after both warbands are raised, add print(north.recruits is south.recruits) and run it. One book, or two? The is rune counts how many objects truly exist.',
            'You believed the class-body list was a fresh default handed to each warband at birth. There are no copies — a list in the class body is ONE object living on the mold, and every enlist through any instance appends into that same book.',
            'Anything mutable and per-instance is forged in __init__: give each warband self.recruits = [] there, and take the list out of the class body. The gate name already lives there; the book belongs beside it.',
          ],
          validation: py`try:
    a = Warband("Isenmouthe")
except TypeError:
    raise AssertionError("Warband(\"Isenmouthe\") was refused -- __init__ must still take the gate name after self.")
b = Warband("Durthang")
a.enlist("Ufthak")
a.enlist("Radbug")
b.enlist("Gorbag")
assert b.recruits == ["Gorbag"], f"Durthang's book reads {b.recruits} -- names enlisted at one gate are appearing in the other gate's book."
assert a.recruits == ["Ufthak", "Radbug"], f"Isenmouthe's book reads {a.recruits} -- it must hold exactly its own two names, in enlistment order."
assert a.recruits is not b.recruits, "Two warbands still write in ONE book -- each instance must own its own recruits list."
c = Warband("Barad-dur")
assert c.recruits == [], "A fresh warband must open an empty book -- names from older musters are haunting it."
assert a.muster() == "Isenmouthe: Ufthak, Radbug", "muster must return the gate, a colon and a space, then the names joined by ', '."
lines = [l.strip() for l in _stdout.splitlines() if l.strip()]
assert "Cirith Gorgor: Muzgash, Lagduf" in lines, "The northern book must read exactly: Cirith Gorgor: Muzgash, Lagduf"
assert "Morannon: Snaga" in lines, "The southern book must read exactly: Morannon: Snaga"`,
          successText: 'The books part ways at last. The curse bears its true name — the shared mutable class attribute: one list living on the class body, written into by every instance that touches it.',
          xp: 35,
        },
      ],
      trace: [
        {
          id: 'a4l2t1',
          code: py`class Legion:
    banners = []
    count = 0

first = Legion()
second = Legion()
first.banners.append("red")
first.count += 1
print(len(second.banners), second.count)`,
          q: 'The scrying: what does this working print?',
          options: ['0 0', '1 1', '1 0', '0 1'],
          answer: 2,
          explain: 'No copies exist. `banners` is one list on the class, so '
            + '`first.banners.append(...)` scars the list `second` also reads: its length '
            + 'is 1. But `first.count += 1` ends in an assignment, and assignment forges a '
            + 'private shadow on `first` alone — the class value stays 0, and `second` '
            + 'reads it. `0 0` is the phantom-copy belief; `1 1` misses the shadow; '
            + '`0 1` has the two laws exactly backwards.',
        },
        {
          id: 'a4l2t2',
          code: py`class King:
    def __init__(self):
        self.years = 0

    def wear(self, n):
        self.years = self.years + n
        return self.years

k = King()
King.wear(k, 30)
print(k.wear(30))`,
          q: 'The scrying: what does this working print?',
          options: [
            '30',
            '60',
            'It dies - TypeError: calling wear through the class is not allowed',
            '0',
          ],
          answer: 1,
          explain: '`King.wear(k, 30)` is exactly what `k.wear(30)` becomes under the '
            + 'hood — the instance slides in as self — so both calls land on the SAME '
            + 'tally: 30, then 60. "30" treats the class-form call as a rehearsal that '
            + 'touched nothing; the TypeError option forgets the class form is lawful '
            + 'Python (it is the dot-call that is the convenience); "0" believes state '
            + 'dies with each call — but years lives on k, not in the method.',
        },
      ],
      quiz: [
        {
          q: 'The call `king.wear(10)` is equivalent to which of these?',
          options: [
            '`wear(king, 10)` — a plain function call',
            '`MortalKing.wear(king, 10)` — the class\'s method, with the instance passed as self',
            '`MortalKing.wear(10)` — self is supplied by the class',
            '`king.wear(king, 10)` — self must be passed twice',
          ],
          answer: 1,
          explain: 'Dot-calling looks the function up on the class and slides the instance in as '
            + 'the first argument, `self`. It is not a free function (option A has no lookup on '
            + 'the class), and you never pass self yourself.',
        },
        {
          q: 'When you read `king.master`, where does Python look?',
          options: [
            'On the instance first; if not found there, on the class',
            'On the class first; the instance is only a cache',
            'Only on the instance — class attributes must be read through the class',
            'Both places, which must agree or Python raises an error',
          ],
          answer: 0,
          explain: 'Attribute lookup climbs: instance, then class (then ancestor classes). That '
            + 'is why one class attribute shows through every instance — until an instance '
            + 'assignment creates a shadowing copy of its own.',
        },
        {
          q: 'Why is `members = []` in a class body a trap?',
          options: [
            'Lists are forbidden as class attributes',
            'Each instance receives its own copy, wasting memory',
            'Every instance shares that single list, so one instance\'s append appears in all of them',
            'The list is reset every time a new instance is created',
          ],
          answer: 2,
          explain: 'A class attribute is one object living on the class. Appending through any '
            + 'instance mutates that shared list. Mutable per-instance state belongs in '
            + '`__init__`: `self.members = []`.',
        },
        {
          q: 'Instance `a` runs `a.master = "Morgoth"`, where `master` is a class attribute. What happens?',
          options: [
            'The class attribute changes, so every instance now reads "Morgoth"',
            'Python raises AttributeError — class attributes are read-only through instances',
            'The class attribute is deleted',
            '`a` gains its own instance attribute shadowing the class value; other instances still read the original',
          ],
          answer: 3,
          explain: 'For a plain attribute, assignment through an instance writes onto the '
            + 'instance. The class value survives underneath, still visible to every other king. '
            + 'To change the shared brand, assign on the class: `MortalKing.master = ...`. '
            + '(The next trial\'s properties are the deliberate exception — they intercept the '
            + 'assignment before it lands.)',
        },
      ],
    },

    // ------------------------------------------------------------------
    // a4l3 — Secrets of the Forge
    // ------------------------------------------------------------------
    {
      id: 'a4l3',
      title: 'Secrets of the Forge',
      concept: 'encapsulation: the _underscore convention, invariants, @property and guarded setters',
      xp: 38,
      narrative: 'There is a chamber in the forge that even the smiths do not enter bare-handed. '
        + 'The secret fire is kept there, and it obeys laws older than the mountain: it may rage, '
        + 'it may sleep, but it may never burn below nothing. Once, an apprentice reached past '
        + 'the wardens and set the fire\'s measure with his own hand. The records call what '
        + 'happened next *the correction*, and say no more. Afterwards the masters built windows '
        + 'of dark glass — you may look, you may ask for change, but every hand now passes '
        + 'through a guard that judges first.',
      sections: [
        {
          heading: 'The unguarded chest',
          body: 'An **invariant** is a law the object\'s data must always obey: a furnace\'s heat '
            + 'is never negative, a king\'s tally never runs backward. Plain attributes cannot '
            + 'defend an invariant, because *any* code can assign *anything* to them at any '
            + 'moment. The object cannot object.\n\n'
            + 'This is the corruption of shared state in its simplest form: the data is public, '
            + 'so its laws are only suggestions.',
          code: py`class Furnace:
    def __init__(self, heat):
        self.heat = heat

f = Furnace(800)
f.heat = -400          # nothing stops this
print(f.heat)          # -400: a fire colder than nothing. The law is dead.`,
        },
        {
          heading: 'One underscore: a warning, not a wall',
          body: '**Encapsulation** is the discipline of keeping an object\'s data behind its own '
            + 'methods, so its laws are enforced by the object itself. Python\'s first tool for '
            + 'this is naming: an attribute that begins with a single underscore — `self._heat` '
            + '— is declared *internal*. Code outside the class should not read it and must '
            + 'never write it.\n\n'
            + 'Understand what the underscore is: a **convention**, a pact between sorcerers. '
            + 'Python enforces nothing. The interpreter will let any hand reach past it — but in '
            + 'honest code, none does.',
          code: py`class Furnace:
    def __init__(self, heat):
        self._heat = heat   # the underscore says: mine. Keep out.

f = Furnace(800)
print(f._heat)   # Python permits it — the underscore is a pact, not a lock`,
        },
        {
          heading: '@property — the window of dark glass',
          body: 'The guard itself is `@property` — the `@` line is a **decorator**, a spell '
            + 'cast upon the definition below it; Act V teaches you to forge your own. Placed '
            + 'above a method, it makes that method '
            + 'run whenever the attribute is **read** — `f.heat`, no parentheses. A companion '
            + 'method marked `@heat.setter` runs whenever the attribute is **assigned** — and '
            + 'there, before storing anything, you enforce the law: judge the value, and '
            + '`raise ValueError` if it is unlawful. Raising aborts the setter, so the stored '
            + '`_heat` is never touched by a bad value.\n\n'
            + '- Callers write `f.heat = 950` exactly as before — the guard is invisible.\n'
            + '- Inside `__init__`, write `self.heat = heat` (the property, not `_heat`) so even the *first* value passes the guard.',
          code: py`class Furnace:
    def __init__(self, heat):
        self.heat = heat            # routes through the setter below

    @property
    def heat(self):                 # runs on READ:  f.heat
        return self._heat

    @heat.setter
    def heat(self, value):          # runs on WRITE: f.heat = ...
        if value < 0:
            raise ValueError("a fire cannot burn below nothing")
        self._heat = value

f = Furnace(800)
print(f.heat)      # 800 — read like a plain attribute; the getter answers
f.heat = 950       # the setter judges, then stores
# f.heat = -1      # would raise ValueError, and _heat would stay 950`,
          note: 'This is why the underscore matters: the guarded door only protects what cannot '
            + 'be reached another way. The property speaks for `_heat`; the underscore warns '
            + 'everyone else away from the vault itself.',
        },
        {
          heading: 'Read-only sight',
          body: 'A property with a getter and **no setter** is read-only: assignment to it '
            + 'raises `AttributeError`. Such properties are often *computed* — they hold no '
            + 'value of their own, but derive one from the guarded state at the moment of each '
            + 'read. A view through the glass, not a second copy of the fire.',
          code: py`class Furnace:
    def __init__(self, heat):
        self._heat = heat

    @property
    def is_lit(self):
        return self._heat > 0   # computed at every read; no setter exists

f = Furnace(3)
print(f.is_lit)    # True
f._heat = 0        # (only the class itself should do this)
print(f.is_lit)    # False — a view, not a stored value`,
        },
      ],
      challenge: {
        title: 'Tending the Secret Fire',
        prompt: 'The masters are dead and the fire is yours to keep. Build the dark glass, and '
          + 'let no hand — not even your own in `__init__` — touch the flame unjudged.\n\n'
          + 'Your working must satisfy, exactly:\n\n'
          + '- Define a class `ForgeFire`.\n'
          + '- `__init__` takes `heat` after `self` and assigns it **through the property**: `self.heat = heat` — so the guard judges even the first spark.\n'
          + '- The true value lives in `self._heat`.\n'
          + '- A getter `heat`, marked `@property`, returns `self._heat`.\n'
          + '- A setter, marked `@heat.setter`, raises `ValueError` if the new value is negative (below 0); otherwise it stores the value in `self._heat`. Zero is lawful — a fire may sleep.\n'
          + '- A read-only property `is_raging` returns `True` when the heat is 1000 or more, else `False`. Give it no setter.\n'
          + '- Create `fire = ForgeFire(900)`, raise it with `fire.heat = 1000`, and `print(fire.is_raging)`.',
        starter: py`class ForgeFire:
    def __init__(self, heat):
        # TODO: assign through the property (self.heat = heat),
        #   so the guard below judges even the first value
        pass

    # TODO: getter — @property above def heat(self): return self._heat

    # TODO: setter — @heat.setter above def heat(self, value):
    #   raise ValueError if value < 0; otherwise store it in self._heat

    # TODO: read-only property is_raging:
    #   True when the heat is 1000 or more, else False

# TODO: fire = ForgeFire(900)
# TODO: raise it: fire.heat = 1000
# TODO: print(fire.is_raging)
`,
        solution: py`class ForgeFire:
    def __init__(self, heat):
        self.heat = heat          # routed through the setter

    @property
    def heat(self):
        return self._heat

    @heat.setter
    def heat(self, value):
        if value < 0:
            raise ValueError("the fire cannot burn below nothing")
        self._heat = value

    @property
    def is_raging(self):
        return self._heat >= 1000

fire = ForgeFire(900)
fire.heat = 1000
print(fire.is_raging)`,
        hints: [
          'Order matters inside the class: the @property getter must be defined before the @heat.setter can exist. Both methods are named heat.',
          'The setter\'s shape: @heat.setter, then def heat(self, value): — check value < 0 first and raise ValueError(...) there; only after the check write self._heat = value.',
          'In __init__ write self.heat = heat (no underscore!) so the setter runs at birth. is_raging is just @property over def is_raging(self): return self._heat >= 1000.',
        ],
        validation: py`f = ForgeFire(500)
assert isinstance(getattr(type(f), "heat", None), property), "heat must be a property — set @property above the getter and @heat.setter above the guard."
assert isinstance(getattr(type(f), "is_raging", None), property), "is_raging must be a @property, read without parentheses."
assert f.heat == 500, "The getter misreports — heat must return the stored _heat."
assert getattr(f, "_heat", None) == 500, "The true value must sleep in self._heat, beneath the underscore."
f.heat = 999
assert f.heat == 999, "The setter did not store a lawful value — assign self._heat = value after the check."
assert f.is_raging is False, "At 999 degrees the fire merely burns — is_raging must be True only at 1000 or more."
f.heat = 1000
assert f.is_raging is True, "At exactly 1000 degrees the fire rages — check your boundary: use >= 1000."
raised = False
try:
    f.heat = -1
except ValueError:
    raised = True
assert raised, "A heat below nothing was accepted — the setter must raise ValueError for negative values."
assert f.heat == 1000, "The failed assignment still scarred the fire — raise BEFORE storing, so _heat stays untouched."
raised = False
try:
    ForgeFire(-50)
except ValueError:
    raised = True
assert raised, "A furnace was born impossible — write self.heat = heat inside __init__ so the guard applies from birth."
z = ForgeFire(0)
assert z.heat == 0 and z.is_raging is False, "A sleeping fire (heat 0) is lawful — only NEGATIVE heat may be refused."
raised = False
try:
    f.is_raging = True
except AttributeError:
    raised = True
assert raised, "is_raging accepted an assignment — it must be a property with NO setter, computed from _heat alone."
assert "fire" in dir() and fire.heat == 1000, "The keeper's own fire is wrong — create fire = ForgeFire(900) and raise it to 1000 through fire.heat."
assert "True" in _stdout, "The chamber heard no report — print(fire.is_raging) once the fire rages."`,
        successText: 'The fire settles behind its dark glass, lawful and watched. The apprentice\'s grave stays quiet tonight.',
        xp: 80,
      },
      extras: [
        {
          id: 'a4l3x1',
          kind: 'echo',
          title: 'The Lantern of the Watch',
          prompt: 'The wall-watch keeps one lantern against the dark, and its oil is measured '
            + 'by law: it may burn low, it may run dry, but it may never hold less than '
            + 'nothing. Build the guard that enforces it.\n\n'
            + 'Your working must satisfy, exactly:\n\n'
            + '- Define a class `Lantern`.\n'
            + '- `__init__` takes `oil` after `self` and assigns it **through the property**: `self.oil = oil`.\n'
            + '- The true measure lives in `self._oil`.\n'
            + '- A getter `oil`, marked `@property`, returns `self._oil`.\n'
            + '- A setter, marked `@oil.setter`, raises `ValueError` if the new value is negative; otherwise it stores the value in `self._oil`. Zero is lawful — a lantern may stand empty.\n'
            + '- A read-only property `burning` returns `True` while the oil is above 0, else `False`. Give it no setter.\n'
            + '- Create `lamp = Lantern(3)`, drain it with `lamp.oil = 0`, and `print(lamp.burning)`.',
          starter: py`class Lantern:
    def __init__(self, oil):
        # TODO: assign through the property: self.oil = oil
        pass

    # TODO: @property getter oil -> return self._oil
    # TODO: @oil.setter -- raise ValueError if value < 0, else store in self._oil
    # TODO: read-only property burning -> True while oil is above 0

# TODO: lamp = Lantern(3); drain it: lamp.oil = 0; print(lamp.burning)
`,
          solution: py`class Lantern:
    def __init__(self, oil):
        self.oil = oil

    @property
    def oil(self):
        return self._oil

    @oil.setter
    def oil(self, value):
        if value < 0:
            raise ValueError("a lantern cannot hold less than nothing")
        self._oil = value

    @property
    def burning(self):
        return self._oil > 0

lamp = Lantern(3)
lamp.oil = 0
print(lamp.burning)`,
          hints: [
            'Both guard methods are named oil: @property over the getter first, then @oil.setter over the judge. In the setter, check value < 0 and raise ValueError BEFORE the storing line self._oil = value.',
            'In __init__ write self.oil = oil (no underscore) so the setter judges the first fill. burning is @property over def burning(self): return self._oil > 0 — and no setter, so assigning to it refuses.',
          ],
          validation: py`lamp2 = Lantern(4)
assert isinstance(getattr(type(lamp2), "oil", None), property), "oil must be a property -- @property above the getter, @oil.setter above the guard."
assert isinstance(getattr(type(lamp2), "burning", None), property), "burning must be a @property, read without parentheses."
assert lamp2.oil == 4, "The getter misreports -- oil must return the stored _oil."
assert getattr(lamp2, "_oil", None) == 4, "The true measure must sleep in self._oil, beneath the underscore."
lamp2.oil = 1
assert lamp2.oil == 1 and lamp2.burning is True, "With oil above 0 the lantern burns -- burning must compute from _oil at each read."
lamp2.oil = 0
assert lamp2.burning is False, "A drained lantern is dark -- burning must be False at 0."
raised = False
try:
    lamp2.oil = -2
except ValueError:
    raised = True
assert raised, "A measure below nothing was accepted -- the setter must raise ValueError for negative values."
assert lamp2.oil == 0, "The failed pour still marked the lantern -- raise BEFORE storing, so _oil stays untouched."
raised = False
try:
    Lantern(-1)
except ValueError:
    raised = True
assert raised, "A lantern was born impossible -- write self.oil = oil in __init__ so the guard judges the first fill."
raised = False
try:
    lamp2.burning = True
except AttributeError:
    raised = True
assert raised, "burning accepted an assignment -- give it NO setter; it is a view through the glass, not a stored value."
assert "lamp" in dir() and lamp.oil == 0, "The watch lamp is wrong -- create lamp = Lantern(3), then drain it with lamp.oil = 0."
assert "False" in _stdout, "The watch heard no report -- print(lamp.burning) once the lamp is drained."`,
          successText: 'The lantern gutters out lawfully, and the law holds even in the dark it leaves.',
          xp: 25,
        },
      ],
      trace: [
        {
          id: 'a4l3t1',
          code: py`class Vault:
    def __init__(self, gold):
        self._gold = gold

    @property
    def gold(self):
        return self._gold

v = Vault(900)
v.gold = 1200
print(v.gold)`,
          q: 'The scrying: what is the fate of this working?',
          options: [
            'It prints: 1200',
            'It prints: 900',
            'It dies - AttributeError: the property has no setter, so v.gold = 1200 is refused',
            'It prints: 2100',
          ],
          answer: 2,
          raises: 'AttributeError',
          explain: 'A property with a getter and no setter is read-only: the assignment '
            + 'dies of AttributeError before anything is stored, and the print is never '
            + 'reached. "1200" believes the assignment lands as a plain attribute — but '
            + 'the property on the class intercepts it first; "900" imagines the program '
            + 'survives to the print; "2100" invents arithmetic no one wrote. To accept '
            + 'writes, the class would need an @gold.setter.',
        },
      ],
      quiz: [
        {
          q: 'What does a single leading underscore, as in `self._heat`, actually do?',
          options: [
            'Makes the attribute invisible outside the class',
            'Makes the attribute read-only',
            'Nothing mechanical — it is a convention warning outside code to keep out',
            'Encrypts the value in memory',
          ],
          answer: 2,
          explain: 'Python enforces nothing here. The underscore is a pact between sorcerers: '
            + 'this is internal, reach past it at your peril. Actual guarding comes from '
            + 'properties and the methods you choose to expose.',
        },
        {
          q: 'What does `@property` make possible?',
          options: [
            'Running getter code whenever the attribute is read, so `f.heat` can be guarded or computed — no parentheses',
            'Faster attribute access',
            'Storing the attribute on the class instead of the instance',
            'Preventing the attribute from ever changing, in all cases',
          ],
          answer: 0,
          explain: 'A property hides method code behind attribute syntax: reading calls the '
            + 'getter, and with an `@heat.setter` defined, assigning calls the setter. Whether '
            + 'change is forbidden is the setter\'s decision — only a property with no setter '
            + 'is read-only.',
        },
        {
          q: 'A setter raises `ValueError` before assigning when given a bad value. After the failed `f.heat = -3`, what is `f._heat`?',
          options: [
            '-3 — assignment happens before any check can run',
            'Unchanged — the exception aborted the setter before it stored anything',
            '0 — Python resets attributes that fail validation',
            'Deleted — a failed setter removes the attribute',
          ],
          answer: 1,
          explain: 'Raising ends the setter on that line; the storing assignment below it never '
            + 'runs. Validate first, store second — that ordering is what keeps the invariant '
            + 'alive through every attack.',
        },
        {
          q: 'Why should `__init__` write `self.heat = heat` (the property) rather than `self._heat = heat` directly?',
          options: [
            'Writing to `_heat` inside `__init__` is a syntax error',
            'The property version runs faster',
            'It turns heat into a class attribute',
            'It routes the very first value through the setter, so an unlawful starting value is rejected at birth',
          ],
          answer: 3,
          explain: '`self.heat = heat` triggers the setter like any other assignment, extending '
            + 'the guard to construction itself. Writing `_heat` directly would let '
            + '`ForgeFire(-50)` exist — an object born already corrupted.',
        },
      ],
    },

    // ------------------------------------------------------------------
    // a4l4 — Bloodlines of Númenor
    // ------------------------------------------------------------------
    {
      id: 'a4l4',
      title: 'Bloodlines of Númenor',
      concept: 'inheritance: subclassing, method overriding, super().__init__, extending vs replacing behavior',
      xp: 38,
      narrative: 'The men of Númenor were given long years and a shape of soul that bred true: '
        + 'their children carried the fathers\' gifts without asking for them. But blood is a '
        + 'door that swings both ways. In the late days certain houses turned — keeping the '
        + 'height, the lifespan, the old bearing, and adding to them a new allegiance sworn in a '
        + 'darker tongue. Nothing of the ancestor was retyped; it was *inherited*, then '
        + 'extended, and in one deliberate place overwritten. Study how a bloodline manages '
        + 'this. Then perform it in code, where it is called inheritance.',
      sections: [
        {
          heading: 'Blood carries the shape',
          body: 'Write a parent class in parentheses — `class BlackNumenorean(Numenorean):` — '
            + 'and the new class **inherits**: every method and every attribute the parent '
            + 'lays down is available on the child, unwritten. The child is called a '
            + '**subclass**; the parent, a **base class**.\n\n'
            + 'Inheritance makes a promise: the child *is a kind of* the parent. Python gives '
            + 'you a built-in to test that promise: `isinstance(obj, Cls)` answers `True` when '
            + '`obj` is an instance of `Cls` — or of any class descended from it — and its '
            + 'sibling `issubclass(Sub, Base)` asks the same question of the classes themselves, '
            + 'not their instances. So `isinstance(h, Numenorean)` answers `True` for a '
            + '`BlackNumenorean`, and any code written for the parent will accept the child. '
            + 'The promise flows one way — parents know nothing of their children.',
          code: py`class Numenorean:
    def __init__(self, name):
        self.name = name
        self.lifespan = 300

    def allegiance(self):
        return "the West"

class BlackNumenorean(Numenorean):
    pass                          # inherits EVERYTHING, changes nothing yet

h = BlackNumenorean("Herumor")
print(h.name, h.lifespan)         # Herumor 300 — the bloodline provided both
print(h.allegiance())             # the West (for now)
print(isinstance(h, Numenorean))  # True — still of the blood`,
        },
        {
          heading: 'Overriding: the blood turns',
          body: 'Define a method in the subclass with the **same name** as one inherited, and '
            + 'the subclass version wins for its instances. This is **method overriding** — the '
            + 'lookup that climbs from instance to class simply finds the child\'s version '
            + 'first and stops. The parent class itself is untouched; its own instances answer '
            + 'as they always did.',
          code: py`class Numenorean:
    def __init__(self, name):
        self.name = name

    def allegiance(self):
        return "the West"

class BlackNumenorean(Numenorean):
    def allegiance(self):              # same name: this version now answers
        return "the Shadow"

print(BlackNumenorean("Herumor").allegiance())  # the Shadow
print(Numenorean("Elendil").allegiance())       # the West — parent unchanged`,
        },
        {
          heading: 'super().__init__ — honoring the ancestor',
          body: 'When a subclass defines its own `__init__`, it **overrides** the parent\'s — '
            + 'which therefore never runs, and every attribute the parent would have laid down '
            + 'is silently missing. The child must summon it deliberately: '
            + '`super().__init__(name)`.\n\n'
            + '`super()` returns a handle to the next class up the chain, *bound to this same '
            + 'instance* — no new object is made. Call the ancestor first, then lay down what '
            + 'is new:\n\n'
            + '- `super().__init__(name)` — the ancestor sets `name` and `lifespan` on this instance.\n'
            + '- `self.master = master` — then the corruption is added on top.',
          code: py`class Numenorean:
    def __init__(self, name):
        self.name = name
        self.lifespan = 300

class BlackNumenorean(Numenorean):
    def __init__(self, name, master):
        super().__init__(name)     # the ancestor lays name and lifespan
        self.master = master       # then the new allegiance is added

b = BlackNumenorean("Fuinur", "Sauron")
print(b.name, b.lifespan, b.master)   # Fuinur 300 Sauron`,
          note: 'Forget the `super().__init__` call and the object is born hollow: '
            + '`b.lifespan` raises AttributeError, because no code ever set it. The most common '
            + 'inheritance wound is exactly this — an ancestor never honored.',
        },
        {
          heading: 'Extend, do not retype',
          body: 'Overriding has two modes. **Replace**: the child\'s method stands alone, as '
            + '`allegiance` did above. **Extend**: the child\'s method calls '
            + '`super().method()` and builds on the result — the ancestor\'s work is reused, '
            + 'never copied. Choose by asking one question: does the parent\'s behavior still '
            + 'hold, with something added? Then extend. Retyping the parent\'s logic into the '
            + 'child is how two versions of one truth drift apart.',
          code: py`class Numenorean:
    def __init__(self, name):
        self.name = name

    def describe(self):
        return self.name + " of Numenor"

class BlackNumenorean(Numenorean):
    def describe(self):
        return super().describe() + ", sworn to the Shadow"

print(BlackNumenorean("Herumor").describe())
# Herumor of Numenor, sworn to the Shadow`,
        },
      ],
      challenge: {
        title: 'The Blood Turns Black',
        prompt: 'Two houses, one blood. Write the elder line, then the line that turned — '
          + 'inheriting everything, overriding one allegiance, extending one description.\n\n'
          + 'Your working must satisfy, exactly:\n\n'
          + '- Define class `Numenorean`: `__init__(self, name)` stores `self.name` and sets `self.lifespan = 300`. Method `describe(self)` returns the name followed by `" of Numenor"` (for Elendil: `Elendil of Numenor`). Method `allegiance(self)` returns `"the West"`.\n'
          + '- Define class `BlackNumenorean` inheriting from `Numenorean`: its `__init__(self, name, master)` first calls `super().__init__(name)`, then stores `self.master`.\n'
          + '- `BlackNumenorean` overrides `allegiance` to return `"the Shadow"`.\n'
          + '- `BlackNumenorean` overrides `describe` to **extend** the ancestor: return `super().describe() + ", sworn to " + self.master`.\n'
          + '- Create `herumor = BlackNumenorean("Herumor", "Sauron")` and print `herumor.describe()` — exactly `Herumor of Numenor, sworn to Sauron`.',
        starter: py`# The elder line first. Then the line that turned.

class Numenorean:
    def __init__(self, name):
        # TODO: store self.name; set self.lifespan = 300
        pass

    # TODO: def describe(self): return "<name> of Numenor"

    # TODO: def allegiance(self): return "the West"

# TODO: class BlackNumenorean(Numenorean):
#   __init__(self, name, master):
#     call super().__init__(name), then store self.master
#   override allegiance: return "the Shadow"
#   override describe: return super().describe() + ", sworn to " + self.master

# TODO: herumor = BlackNumenorean("Herumor", "Sauron")
# TODO: print(herumor.describe())
`,
        solution: py`class Numenorean:
    def __init__(self, name):
        self.name = name
        self.lifespan = 300

    def describe(self):
        return self.name + " of Numenor"

    def allegiance(self):
        return "the West"

class BlackNumenorean(Numenorean):
    def __init__(self, name, master):
        super().__init__(name)
        self.master = master

    def allegiance(self):
        return "the Shadow"

    def describe(self):
        return super().describe() + ", sworn to " + self.master

herumor = BlackNumenorean("Herumor", "Sauron")
print(herumor.describe())`,
        hints: [
          'The subclass header names its parent in parentheses: class BlackNumenorean(Numenorean): — from that moment it inherits describe, allegiance, and __init__ until it overrides them.',
          'Inside the subclass __init__, the first line is super().__init__(name) — the parent sets name and lifespan on this same instance. Only then add self.master = master.',
          'The overriding describe reuses the ancestor: return super().describe() + ", sworn to " + self.master. Do not rebuild "of Numenor" by hand in the subclass.',
        ],
        validation: py`n = Numenorean("Elendil")
assert n.name == "Elendil" and n.lifespan == 300, "The elder line is flawed — Numenorean.__init__ must set self.name and self.lifespan = 300."
assert n.describe() == "Elendil of Numenor", "The elder describe speaks wrongly — it must return the name plus ' of Numenor'."
assert n.allegiance() == "the West", "The elder line has already turned — Numenorean.allegiance must return 'the West'."
b = BlackNumenorean("Fuinur", "Morgoth")
assert isinstance(b, BlackNumenorean) and isinstance(b, Numenorean), "A Black Numenorean is still of the blood — declare class BlackNumenorean(Numenorean):"
assert b.name == "Fuinur", "The ancestor was not honored — call super().__init__(name) so the parent sets self.name."
assert b.lifespan == 300, "The bloodline lost its span of years — super().__init__(name) must run so lifespan is laid down."
assert b.master == "Morgoth", "The new allegiance was not recorded — after super().__init__, store self.master."
assert b.allegiance() == "the Shadow", "The turned line must answer 'the Shadow' — override allegiance in the subclass."
assert b.describe() == "Fuinur of Numenor, sworn to Morgoth", "The turned describe must EXTEND the ancestor: super().describe() + ', sworn to ' + self.master."
assert Numenorean.describe(b) == "Fuinur of Numenor", "The parent's describe must survive intact — override in the subclass; never edit the ancestor."
h2 = BlackNumenorean("Herumor", "Sauron")
assert h2.describe() == "Herumor of Numenor, sworn to Sauron", "A second casting answers wrongly — describe must build from self.name and self.master, not fixed text."
assert "Herumor of Numenor, sworn to Sauron" in _stdout, "The oath went unheard — create herumor and print herumor.describe()."`,
        successText: 'The bloodline holds. What the fathers built, the sons carry into shadow — nothing retyped, everything turned.',
        xp: 80,
      },
      extras: [
        {
          id: 'a4l4x1',
          kind: 'echo',
          title: 'The Line of the Smiths',
          prompt: 'Before the kings there were smiths, and one line of them listened too long '
            + 'to a fair-spoken stranger. Write the elder craft, then the pupils who turned '
            + 'it — inheriting everything, overriding one oath, extending one description.\n\n'
            + 'Your working must satisfy, exactly:\n\n'
            + '- Define class `Smith`: `__init__(self, name)` stores `self.name` and sets `self.forge_years = 400`. Method `describe(self)` returns the name followed by `" of Eregion"`. Method `oath(self)` returns `"to the craft"`.\n'
            + '- Define class `Ringsmith` inheriting from `Smith`: its `__init__(self, name, patron)` first calls `super().__init__(name)`, then stores `self.patron`.\n'
            + '- `Ringsmith` overrides `oath` to return `"to Annatar"`.\n'
            + '- `Ringsmith` overrides `describe` to **extend** the ancestor: return `super().describe() + ", pupil of " + self.patron`.\n'
            + '- Create `celebrimbor = Ringsmith("Celebrimbor", "Annatar")` and print `celebrimbor.describe()` — exactly `Celebrimbor of Eregion, pupil of Annatar`.',
          starter: py`# The elder craft first. Then the pupil who was taught too well.

class Smith:
    # TODO: __init__(self, name) -- store self.name; set self.forge_years = 400
    # TODO: describe(self) -> "<name> of Eregion"
    # TODO: oath(self) -> "to the craft"
    pass

# TODO: class Ringsmith(Smith):
#   __init__(self, name, patron): super().__init__(name), then self.patron
#   override oath -> "to Annatar"
#   override describe -> super().describe() + ", pupil of " + self.patron

# TODO: celebrimbor = Ringsmith("Celebrimbor", "Annatar"); print its describe()
`,
          solution: py`class Smith:
    def __init__(self, name):
        self.name = name
        self.forge_years = 400

    def describe(self):
        return self.name + " of Eregion"

    def oath(self):
        return "to the craft"

class Ringsmith(Smith):
    def __init__(self, name, patron):
        super().__init__(name)
        self.patron = patron

    def oath(self):
        return "to Annatar"

    def describe(self):
        return super().describe() + ", pupil of " + self.patron

celebrimbor = Ringsmith("Celebrimbor", "Annatar")
print(celebrimbor.describe())`,
          hints: [
            'The subclass header names its parent: class Ringsmith(Smith): — and its __init__ honors the ancestor FIRST: super().__init__(name), then self.patron = patron.',
            'The overriding describe reuses the elder work: return super().describe() + ", pupil of " + self.patron. Do not retype " of Eregion" in the subclass; oath simply returns "to Annatar".',
          ],
          validation: py`try:
    s = Smith("Narvi")
except TypeError:
    raise AssertionError("Smith(\"Narvi\") was refused -- Smith.__init__ must take name after self.")
assert s.name == "Narvi" and s.forge_years == 400, "The elder line is flawed -- Smith.__init__ must set self.name and self.forge_years = 400."
assert s.describe() == "Narvi of Eregion", "The elder describe speaks wrongly -- it must return the name plus ' of Eregion'."
assert s.oath() == "to the craft", "The elder oath has already turned -- Smith.oath must return 'to the craft'."
try:
    r = Ringsmith("Telperion", "the Fair One")
except TypeError:
    raise AssertionError("Ringsmith(name, patron) was refused -- its __init__ takes name and patron after self.")
assert isinstance(r, Ringsmith) and isinstance(r, Smith), "A ringsmith is still a smith -- declare class Ringsmith(Smith):"
try:
    fy = r.forge_years
except AttributeError:
    raise AssertionError("The pupil was born hollow -- call super().__init__(name) so the ancestor lays down forge_years.")
assert fy == 400 and r.name == "Telperion", "super().__init__(name) must run so the ancestor sets name and forge_years."
assert r.patron == "the Fair One", "The patron went unrecorded -- after super().__init__, store self.patron."
assert r.oath() == "to Annatar", "The turned line must answer 'to Annatar' -- override oath in the subclass."
assert r.describe() == "Telperion of Eregion, pupil of the Fair One", "The pupil's describe must EXTEND the ancestor: super().describe() + ', pupil of ' + self.patron."
assert Smith.describe(r) == "Telperion of Eregion", "The ancestor's describe must survive beneath the override -- never edit Smith."
c2 = Ringsmith("Celebrimbor", "Annatar")
assert c2.describe() == "Celebrimbor of Eregion, pupil of Annatar", "A second casting answers wrongly -- describe must build from self.name and self.patron, not fixed text."
assert "Celebrimbor of Eregion, pupil of Annatar" in _stdout, "The forge heard no lineage -- create celebrimbor and print celebrimbor.describe()."`,
          successText: 'The pupils keep the elder hands and swear the newer oath — and the stranger smiles at what inheritance carries.',
          xp: 25,
        },
      ],
      trace: [
        {
          id: 'a4l4t1',
          code: py`class Servant:
    def rank(self):
        return "a servant"

class Orc(Servant):
    def rank(self):
        return "an orc"

class Uruk(Orc):
    pass

print(Uruk().rank())`,
          q: 'The scrying: what does this working print?',
          options: [
            'a servant',
            'an orc',
            'It dies - AttributeError: Uruk itself defines no rank method',
            'an orc\na servant',
          ],
          answer: 1,
          explain: 'Lookup climbs from the instance\'s own class upward and stops at the '
            + 'FIRST hit: Uruk defines no rank, so the search moves to Orc and finds one — '
            + 'Servant is never consulted. "a servant" imagines the climb starts at the '
            + 'root of the line; the death option forgets that inheriting IS having — '
            + '`pass` changes nothing about what Uruk receives; the double answer imagines '
            + 'every ancestor speaks, but only the first match runs.',
        },
        {
          id: 'a4l4t2',
          code: py`class Servant:
    def __init__(self, name):
        self.name = name

class Wraith(Servant):
    def __init__(self, ring):
        self.ring = ring

w = Wraith(9)
print(w.ring)
print(w.name)`,
          q: 'The scrying: what is the fate of this working?',
          options: [
            'It prints 9, then dies - AttributeError: the wraith was never given a name',
            'It prints: 9\nNone',
            'It dies at once - defining __init__ without super() is an error',
            'It prints: 9\n9',
          ],
          answer: 0,
          raises: 'AttributeError',
          explain: 'Wraith\'s own `__init__` overrides the parent\'s, which therefore '
            + 'never runs — nothing ever sets self.name, and Python calls no ancestor '
            + 'automatically. The first print speaks (ring was stored), then w.name dies '
            + 'of AttributeError. "None" imagines missing attributes read as None — they '
            + 'refuse loudly instead; the immediate-death option imagines Python enforces '
            + 'super() — omitting it is legal, merely hollow; "9 9" imagines name fell '
            + 'back to ring. The cure: call super().__init__(...) so the ancestor lays '
            + 'its attributes first.',
        },
      ],
      quiz: [
        {
          q: 'What does `class BlackNumenorean(Numenorean):` declare?',
          options: [
            'BlackNumenorean inherits Numenorean\'s methods and attributes, and its instances count as Numenorean too',
            'BlackNumenorean is a disconnected copy, frozen at the moment of definition',
            'BlackNumenorean may only use Numenorean methods it re-declares',
            'Numenorean gains every method defined on BlackNumenorean',
          ],
          answer: 0,
          explain: 'The parenthesis names the parent. Whatever the child lacks, lookup finds on '
            + 'the parent, and `isinstance(child_instance, Parent)` is True. Inheritance flows '
            + 'downward only — the parent never learns what its children add.',
        },
        {
          q: 'A subclass defines its own `__init__`. What happens to the parent\'s `__init__`?',
          options: [
            'Python runs both automatically, the parent\'s first',
            'Python runs the parent\'s automatically after the child\'s finishes',
            'It is overridden and will not run unless the child explicitly calls `super().__init__(...)`',
            'Defining `__init__` in a subclass is an error',
          ],
          answer: 2,
          explain: 'An overriding `__init__` replaces the parent\'s entirely. If the parent\'s '
            + 'setup matters — it almost always does — summon it yourself, usually as the first '
            + 'line, or the instance is born missing the attributes the ancestor would have set.',
        },
        {
          q: 'Inside an overriding method, what does `super().describe()` do?',
          options: [
            'Calls the child\'s own describe again, recursing forever',
            'Runs the parent\'s version of describe on this same instance, so the override can extend its result',
            'Creates a temporary parent instance and describes that instead',
            'Returns the parent class object itself',
          ],
          answer: 1,
          explain: '`super()` yields the next class up the chain, still bound to the same '
            + '`self` — no new object exists. It is the mechanism for extending inherited '
            + 'behavior rather than retyping it: replace what must change, reuse what must not.',
        },
        {
          q: '`b` is a `BlackNumenorean`, which subclasses `Numenorean`. Which statement is true?',
          options: [
            '`isinstance(b, Numenorean)` and `isinstance(b, BlackNumenorean)` are both True',
            '`isinstance(b, Numenorean)` is False — an object belongs only to its exact class',
            '`issubclass(Numenorean, BlackNumenorean)` is True',
            '`type(b) is Numenorean`',
          ],
          answer: 0,
          explain: 'An instance of the child is an instance of every ancestor — the is-a promise '
            + 'of inheritance. `issubclass` reads the other way (child first, parent second), '
            + 'and `type(b)` names the exact class, BlackNumenorean.',
        },
      ],
    },

    // ------------------------------------------------------------------
    // a4l5 — Many Shapes, One Will
    // ------------------------------------------------------------------
    {
      id: 'a4l5',
      title: 'Many Shapes, One Will',
      concept: 'polymorphism and duck typing: one method name, many behaviors; why isinstance chains are a smell',
      xp: 40,
      narrative: 'From Barad-dûr the order goes out — one word, unaddressed: *march*. It does '
        + 'not say how. The orc hears it and shrieks; the troll hears it and lifts its maul; '
        + 'the wraith hears it and makes no sound at all, which is worse. The Eye does not '
        + 'stoop to ask each servant what it is before commanding it. It commands, and trusts '
        + 'the shape of the servant to answer in its own voice. One will, many shapes. Python '
        + 'calls this polymorphism, and it is how a single line of your code can command a '
        + 'thousand kinds.',
      sections: [
        {
          heading: 'One command, many servants',
          body: '**Polymorphism** (many shapes) means this: different classes define a method '
            + 'with the **same name**, each with its own behavior — and calling code invokes '
            + 'that name without knowing or caring which class it holds. The dispatch happens '
            + 'at the moment of the call: Python looks the method up on *that object\'s* class '
            + 'and runs what it finds.\n\n'
            + 'A mixed list plus one loop is the classic form. The loop is written once and '
            + 'never changes; the variety lives in the classes.',
          code: py`class Orc:
    def war_cry(self):
        return "an orc shrieks"

class Troll:
    def war_cry(self):
        return "a troll bellows"

horde = [Orc(), Troll(), Orc()]
for creature in horde:
    print(creature.war_cry())   # each answers in its own voice`,
        },
        {
          heading: 'Duck typing: the shape is the pact',
          body: 'Notice what the loop never asked for: a shared base class. Python does not '
            + 'check ancestry before a call — at the moment of `creature.war_cry()`, it simply '
            + 'looks for a `war_cry` method on that object. Found: it runs. Missing: '
            + '`AttributeError`. This is **duck typing** — an object\'s fitness is judged by '
            + 'the methods it actually has, not by what family it was born to. If it marches '
            + 'like an orc and cries like an orc, the horde takes it.\n\n'
            + 'The consequence is power: any object from anywhere — yours, the standard '
            + 'library\'s, a stranger\'s — joins the host by simply *having the method*.',
          code: py`class Orc:
    def war_cry(self):
        return "an orc shrieks"

class SiegeTower:                  # shares no ancestor with Orc
    def war_cry(self):
        return "timber groans against stone"

def unleash(host):
    return [thing.war_cry() for thing in host]

print(unleash([Orc(), SiegeTower()]))   # both serve; ancestry was never asked`,
          note: 'Formal contracts exist for when you want them — the `abc` module can declare '
            + 'required methods — but the day-to-day law of Python is the informal pact: '
            + 'provide the method, and you belong.',
        },
        {
          heading: 'The stench of isinstance chains',
          body: 'Here is the same power, built wrong. A function that interrogates each '
            + 'object\'s type and dispatches by hand:\n\n'
            + '- Every new creature forces you to reopen and edit this one function — forever.\n'
            + '- Each class\'s voice is stored *outside* the class it belongs to.\n'
            + '- Forget one branch and the failure is silent, not loud.\n\n'
            + 'Polymorphism inverts it: each class carries its own `war_cry`, and new kinds '
            + 'join the host without a single edit to the calling code. An occasional '
            + '`isinstance` guard is legitimate; a *ladder* of them doing dispatch is the smell.',
          code: py`class Orc: pass
class Troll: pass

def war_cry_of(creature):              # the brittle way — do not build this
    if isinstance(creature, Orc):
        return "an orc shrieks"
    elif isinstance(creature, Troll):
        return "a troll bellows"
    return "silence"                   # unknown shapes fail quietly

print(war_cry_of(Orc()))    # works today; rots tomorrow`,
        },
      ],
      challenge: {
        title: 'Muster the Host',
        prompt: 'The muster-horns sound over Gorgoroth. Three breeds answer, and your marshal '
          + 'must take them all — and any nameless thing that arrives crying properly.\n\n'
          + 'Your working must satisfy, exactly:\n\n'
          + '- Define three classes — `Orc`, `Troll`, `Wraith` — each with `__init__(self, name)` storing `self.name`, and each with a method `war_cry(self)`:\n'
          + '- `Orc.war_cry` returns the name + `" shrieks for blood."`\n'
          + '- `Troll.war_cry` returns the name + `" bellows and breaks stone."`\n'
          + '- `Wraith.war_cry` returns the name + `" makes no sound at all."`\n'
          + '- The three classes stand alone — no shared base class is needed, and none is asked for.\n'
          + '- Define a function `muster(host)` returning a list of each creature\'s `war_cry()` result, in order. It must return `[]` for an empty host, and it must work for ANY object that has a `war_cry` method — do not test types with `isinstance`.\n'
          + '- Raise a horde holding at least one of each breed, then loop over `muster(horde)` and print each cry on its own line.',
        starter: py`# Three breeds. One muster. No questions of blood.

# TODO: class Orc — __init__(self, name); war_cry returns
#   "<name> shrieks for blood."

# TODO: class Troll — __init__(self, name); war_cry returns
#   "<name> bellows and breaks stone."

# TODO: class Wraith — __init__(self, name); war_cry returns
#   "<name> makes no sound at all."

def muster(host):
    # TODO: return a list of each creature's war_cry(), in order.
    #   Trust the shape: call the method on whatever arrives.
    pass

# TODO: build a horde with one of each, then:
#   for cry in muster(horde): print(cry)
`,
        solution: py`class Orc:
    def __init__(self, name):
        self.name = name

    def war_cry(self):
        return self.name + " shrieks for blood."

class Troll:
    def __init__(self, name):
        self.name = name

    def war_cry(self):
        return self.name + " bellows and breaks stone."

class Wraith:
    def __init__(self, name):
        self.name = name

    def war_cry(self):
        return self.name + " makes no sound at all."

def muster(host):
    cries = []
    for creature in host:
        cries.append(creature.war_cry())
    return cries

horde = [Orc("Grishnakh"), Troll("Rogash"), Wraith("Khamul")]
for cry in muster(horde):
    print(cry)`,
        hints: [
          'The three classes are near-twins: each stores self.name in __init__ and differs only in the string its war_cry returns. Write one, then adapt it twice.',
          'muster never mentions Orc, Troll, or Wraith: start with an empty list, loop for creature in host, append creature.war_cry(), return the list. An empty host loops zero times and returns [] on its own.',
          'The final lines: horde = [Orc("Grishnakh"), Troll("Rogash"), Wraith("Khamul")] and then for cry in muster(horde): print(cry).',
        ],
        validation: py`o = Orc("Grishnakh")
t = Troll("Rogash")
w = Wraith("Khamul")
assert o.war_cry() == "Grishnakh shrieks for blood.", "The orc's cry is wrong — war_cry must return the name plus ' shrieks for blood.'"
assert t.war_cry() == "Rogash bellows and breaks stone.", "The troll's cry is wrong — war_cry must return the name plus ' bellows and breaks stone.'"
assert w.war_cry() == "Khamul makes no sound at all.", "The wraith's silence is wrong — war_cry must return the name plus ' makes no sound at all.'"
res = muster([o, t, w])
assert res == ["Grishnakh shrieks for blood.", "Rogash bellows and breaks stone.", "Khamul makes no sound at all."], "muster must return the cries as a list, in marching order."
assert muster([]) == [], "An empty host must yield an empty list — no cries, and no crash."
class _Stranger:
    def war_cry(self):
        return "something new answers the summons."
assert muster([_Stranger()]) == ["something new answers the summons."], "muster interrogated ancestry instead of trusting the shape — call war_cry() on WHATEVER arrives; no isinstance dispatch."
assert muster([t, o]) == ["Rogash bellows and breaks stone.", "Grishnakh shrieks for blood."], "muster must preserve the order it was given."
assert "shrieks for blood." in _stdout and "bellows and breaks stone." in _stdout and "makes no sound at all." in _stdout, "The muster went unheard — loop over muster(horde) and print every cry."`,
        successText: 'The horde moves as one word. You never asked what marched — only that it could.',
        xp: 85,
      },
      extras: [
        {
          id: 'a4l5x1',
          kind: 'echo',
          title: 'The Ears of the Tower',
          prompt: 'War is half listening. Three kinds of spy come back to the tower at dusk, '
            + 'and the debriefer takes every report without once asking what breed of thing '
            + 'is speaking.\n\n'
            + 'Your working must satisfy, exactly:\n\n'
            + '- Define three classes — `Crow`, `Bat`, `Shade` — each with `__init__(self, name)` storing `self.name`, and each with a method `report(self)`:\n'
            + '- `Crow.report` returns the name + `" croaks what it saw."`\n'
            + '- `Bat.report` returns the name + `" maps the dark by echo."`\n'
            + '- `Shade.report` returns the name + `" says nothing, and is believed."`\n'
            + '- The three classes stand alone — no shared base class.\n'
            + '- Define a function `debrief(spies)` returning a list of each spy\'s `report()` result, in order. It must return `[]` for no spies, and it must work for ANY object that has a `report` method — no `isinstance` tests.\n'
            + '- Build a ring of spies holding at least one of each kind, then loop over `debrief(...)` and print each report on its own line.',
          starter: py`# Three kinds of spy. One debriefing. No questions of breed.

# TODO: class Crow -- __init__(self, name); report(self) returns
#   "<name> croaks what it saw."
# TODO: class Bat -- report returns "<name> maps the dark by echo."
# TODO: class Shade -- report returns "<name> says nothing, and is believed."

def debrief(spies):
    # TODO: return each spy's report(), in order -- ask nothing of ancestry
    pass

# TODO: build a ring of spies with one of each, then print every report
`,
          solution: py`class Crow:
    def __init__(self, name):
        self.name = name

    def report(self):
        return self.name + " croaks what it saw."

class Bat:
    def __init__(self, name):
        self.name = name

    def report(self):
        return self.name + " maps the dark by echo."

class Shade:
    def __init__(self, name):
        self.name = name

    def report(self):
        return self.name + " says nothing, and is believed."

def debrief(spies):
    reports = []
    for spy in spies:
        reports.append(spy.report())
    return reports

ring = [Crow("Craban"), Bat("Vespe"), Shade("Lygash")]
for line in debrief(ring):
    print(line)`,
          hints: [
            'The three classes are near-twins: each stores self.name in __init__ and differs only in the string report returns. Write one, adapt it twice.',
            'debrief never names Crow, Bat, or Shade: an empty list, a loop appending spy.report(), a return. Then ring = [Crow("Craban"), Bat("Vespe"), Shade("Lygash")] and print each line of debrief(ring).',
          ],
          validation: py`c = Crow("Craban")
b = Bat("Vespe")
s = Shade("Lygash")
assert c.report() == "Craban croaks what it saw.", "The crow's report is wrong -- the name plus ' croaks what it saw.'"
assert b.report() == "Vespe maps the dark by echo.", "The bat's report is wrong -- the name plus ' maps the dark by echo.'"
assert s.report() == "Lygash says nothing, and is believed.", "The shade's report is wrong -- the name plus ' says nothing, and is believed.'"
got = debrief([c, b, s])
assert got == ["Craban croaks what it saw.", "Vespe maps the dark by echo.", "Lygash says nothing, and is believed."], "debrief must return the reports as a list, in the order given."
assert debrief([]) == [], "No spies, no reports -- an empty ring must return an empty list, without crashing."
class _Turncoat:
    def report(self):
        return "an unexpected voice answers."
assert debrief([_Turncoat()]) == ["an unexpected voice answers."], "debrief interrogated ancestry instead of trusting the shape -- call report() on WHATEVER arrives; no isinstance dispatch."
assert debrief([s, c]) == ["Lygash says nothing, and is believed.", "Craban croaks what it saw."], "debrief must preserve the order it was given."
assert "croaks what it saw." in _stdout and "maps the dark by echo." in _stdout and "says nothing, and is believed." in _stdout, "The tower heard no debriefing -- print every report from your ring of spies."`,
          successText: 'Three voices, one ledger of the dark. The tower never asked what listened — only what was heard.',
          xp: 20,
        },
      ],
      quiz: [
        {
          q: 'What is polymorphism, as Python practices it?',
          options: [
            'Every class inheriting from one shared base before its methods can be called',
            'One class defining many `__init__` methods',
            'Objects converting from one class to another at runtime',
            'Different classes answering the same method name each in their own way, so calling code need not know which it holds',
          ],
          answer: 3,
          explain: 'The calling code names the method; each object supplies its own behavior at '
            + 'the moment of the call. No shared base is required in Python, no conversion '
            + 'happens, and multiple `__init__` definitions just overwrite each other.',
        },
        {
          q: 'What does "duck typing" mean?',
          options: [
            'Python checks declared types before every call',
            'An object\'s fitness is judged by the methods it actually has, not by its class or ancestry',
            'All objects secretly share one type',
            'Type errors are silently ignored',
          ],
          answer: 1,
          explain: 'At call time Python simply looks the method up on the object; present means '
            + 'it runs, absent means AttributeError — loudly, not silently. The pact is the '
            + 'shape, never the pedigree.',
        },
        {
          q: 'Why is a long `if isinstance(...) / elif isinstance(...)` dispatch chain considered a design smell?',
          options: [
            'Every new type forces an edit to that one function, and each type\'s behavior lives outside its own class',
            '`isinstance` was removed in Python 3',
            'It is slower, and speed is the only concern',
            'It raises an exception whenever it meets an unknown type',
          ],
          answer: 0,
          explain: 'The chain centralizes what polymorphism distributes. Give each class its own '
            + 'method under one shared name and new kinds join without touching old code. '
            + '`isinstance` itself remains legal — occasional guards are fine; ladders that '
            + 'dispatch are the wound.',
        },
        {
          q: '`horde` mixes Orc, Troll, and Wraith objects, each defining `war_cry()`. What does `for c in horde: print(c.war_cry())` do?',
          options: [
            'Prints the Orc version three times, since Orc came first',
            'Raises TypeError because the list holds mixed types',
            'Each object answers with its own class\'s war_cry — three different cries',
            'Prints a shared base class version for all three',
          ],
          answer: 2,
          explain: 'Lookup happens per object, per call: Python finds `war_cry` on each '
            + 'creature\'s own class. Mixed lists are perfectly lawful, and there is no shared '
            + 'base version unless you wrote one.',
        },
      ],
    },

    // ------------------------------------------------------------------
    // a4l6 — The Black Speech
    // ------------------------------------------------------------------
    {
      id: 'a4l6',
      title: 'The Black Speech',
      concept: 'dunder methods: __str__ vs __repr__, __eq__, __len__, __add__ — how operators and built-ins summon them',
      xp: 40,
      narrative: 'There is a language under the language. When you write a plus sign, when you '
        + 'ask a thing its length, when you hold two objects to the light to see whether they '
        + 'are one — Python does not perform these acts itself. It turns to your object and '
        + 'speaks a hidden name, double-underscored, older than your code: *answer for '
        + 'yourself*. Objects that have learned these names pass for native things; `print` '
        + 'embraces them, operators bow to them, built-ins treat them as kin. The smiths called '
        + 'such words the Black Speech: few ever write it, and everything obeys it.',
      sections: [
        {
          heading: 'The names beneath the names',
          body: 'A **dunder method** (double-underscore, like `__init__`) is a method with a '
            + 'reserved name that Python calls *on your behalf* when you use an operator or a '
            + 'built-in. You never invoke these names directly; you write the surface syntax, '
            + 'and Python translates:\n\n'
            + '- `str(x)` and `print(x)` summon `x.__str__()`\n'
            + '- `len(x)` summons `x.__len__()`\n'
            + '- `a == b` summons `a.__eq__(b)`\n'
            + '- `a + b` summons `a.__add__(b)`\n\n'
            + 'You have already written one dunder in every lesson of this act. `__init__` was '
            + 'the first word of the Black Speech on your tongue.\n\n'
            + 'One detail of the `__init__` below: `self.words = list(words)` stores a **copy** '
            + 'of the caller\'s list — so a hand that later mutates the original list cannot '
            + 'silently rewrite the verse from outside the class.',
          code: py`class Verse:
    def __init__(self, words):
        self.words = list(words)

    def __str__(self):
        return " ".join(self.words)

v = Verse(["vrak", "ulun"])
print(v)          # vrak ulun — print() summoned __str__
print(str(v))     # the same summons, spoken directly`,
        },
        {
          heading: '__str__ and __repr__ — the two faces',
          body: 'Two dunders govern how an object is shown, and they serve different masters. '
            + '`__str__` is the face for *readers*: clean, human, final. `__repr__` is the face '
            + 'for *sorcerers*: unambiguous, ideally resembling the constructor call that would '
            + 'recreate the object, shown in debuggers and inside containers.\n\n'
            + '- If `__str__` is missing, `str()` falls back to `__repr__`.\n'
            + '- The reverse never happens — `repr()` ignores `__str__` entirely.\n'
            + '- Lists, dicts, and tuples always display their elements with `repr`.\n'
            + '- `!r` inside an f-string applies `repr()` to the value — quotes and all — '
            + 'which is how `f"Verse({self.words!r})"` below shows the list exactly as a '
            + 'sorcerer would need to retype it.',
          code: py`class Verse:
    def __init__(self, words):
        self.words = list(words)

    def __str__(self):
        return " ".join(self.words)

    def __repr__(self):
        return f"Verse({self.words!r})"

v = Verse(["vrak"])
print(str(v))    # vrak            — the face shown to readers
print(repr(v))   # Verse(['vrak']) — the face shown to debuggers
print([v])       # [Verse(['vrak'])] — containers always use repr`,
        },
        {
          heading: 'Equality is a spell you write',
          body: 'Without `__eq__`, the `==` operator falls back to **identity**: two objects '
            + 'are equal only if they are the *very same object* in memory. Two castings with '
            + 'identical words would stand unequal — often not what your type means.\n\n'
            + 'Define `__eq__(self, other)` to declare what equality *means* for your kind — '
            + 'usually: same class, same data. Python derives `!=` by inverting your `__eq__`, '
            + 'so one definition arms both operators.',
          code: py`class Verse:
    def __init__(self, words):
        self.words = list(words)

    def __eq__(self, other):
        return isinstance(other, Verse) and self.words == other.words

a = Verse(["vrak"])
b = Verse(["vrak"])
print(a is b)   # False — two separate castings
print(a == b)   # True  — __eq__ judges by content, not by address`,
          note: 'The lone `isinstance` here is a guard, not a dispatch ladder — it merely '
            + 'refuses to compare a Verse to a number. That is the lawful use the last lesson '
            + 'promised existed.',
        },
        {
          heading: 'len() and + are summonses',
          body: 'Two more names complete tonight\'s lesson. `__len__` must return a '
            + 'non-negative integer — define it and `len(x)` works, and with it every spell '
            + 'that asks for size.\n\n'
            + '`__add__(self, other)` answers the `+` operator, and it carries one law of '
            + 'manners: **build and return a new object; never mutate either operand.** '
            + 'Numbers behave this way — `a + b` scars neither `a` nor `b` — and code that '
            + 'reads your `+` will assume the same. An `__add__` that mutates is shared-state '
            + 'corruption wearing the friendliest syntax in the language.',
          code: py`class Verse:
    def __init__(self, words):
        self.words = list(words)

    def __len__(self):
        return len(self.words)

    def __add__(self, other):
        return Verse(self.words + other.words)   # a NEW verse; neither changes

a = Verse(["vrak", "ulun"])
b = Verse(["ghashnar"])
print(len(a))           # 2
c = a + b               # summons a.__add__(b)
print(len(c), len(a))   # 3 2 — a is untouched`,
        },
      ],
      challenge: {
        title: 'Inscribing the Band',
        prompt: 'A band of dull gold waits for its verse. Teach it the deep names, so that '
          + 'fire — and print, and ==, and len, and + — can read what you wrote into it.\n\n'
          + 'Your working must satisfy, exactly:\n\n'
          + '- Define a class `Inscription`.\n'
          + '- `__init__(self, words)` stores a **copy**: `self.words = list(words)` — no outside hand may rewrite the band through a shared list.\n'
          + '- `__str__` returns the words joined by single spaces.\n'
          + '- `__repr__` returns the text `Inscription(` + the repr of the list + `)` — an f-string with `{self.words!r}` does this.\n'
          + '- `__eq__` returns `True` when the other object is an `Inscription` with equal `words`.\n'
          + '- `__len__` returns the number of words.\n'
          + '- `__add__` returns a **new** `Inscription` whose words are `self.words + other.words`; neither operand may change.\n'
          + '- Then: `a = Inscription(["gruzh", "morn"])`, `b = Inscription(["ulak"])`, and `print(a + b)` — the band must read `gruzh morn ulak`.',
        starter: py`class Inscription:
    def __init__(self, words):
        # TODO: store a COPY: self.words = list(words)
        pass

    # TODO: __str__ — the words joined by single spaces

    # TODO: __repr__ — f"Inscription({self.words!r})"

    # TODO: __eq__ — True when other is an Inscription with equal words

    # TODO: __len__ — how many words

    # TODO: __add__ — a NEW Inscription of self.words + other.words

# TODO: a = Inscription(["gruzh", "morn"])
# TODO: b = Inscription(["ulak"])
# TODO: print(a + b)
`,
        solution: py`class Inscription:
    def __init__(self, words):
        self.words = list(words)

    def __str__(self):
        return " ".join(self.words)

    def __repr__(self):
        return f"Inscription({self.words!r})"

    def __eq__(self, other):
        return isinstance(other, Inscription) and self.words == other.words

    def __len__(self):
        return len(self.words)

    def __add__(self, other):
        return Inscription(self.words + other.words)

a = Inscription(["gruzh", "morn"])
b = Inscription(["ulak"])
print(a + b)`,
        hints: [
          'Every dunder is an ordinary method with a reserved name: def __str__(self):, def __eq__(self, other):, and so on — all indented inside the class.',
          '__str__ is return " ".join(self.words). __eq__ is return isinstance(other, Inscription) and self.words == other.words. __len__ is return len(self.words).',
          '__add__ must forge, not scar: return Inscription(self.words + other.words) — a brand-new object built by the class itself. Then print(a + b) lets print summon __str__ on the result.',
        ],
        validation: py`a = Inscription(["gruzh", "morn"])
b = Inscription(["gruzh", "morn"])
c = Inscription(["ulak"])
assert str(a) == "gruzh morn", "str(...) spoke wrongly — __str__ must join the words with single spaces."
assert repr(c) == "Inscription(['ulak'])", "repr(...) must resemble the summons that made it — exactly Inscription(['ulak']). Use an f-string with {self.words!r}."
assert a == b, "Two bands with the same words must be equal — __eq__ must compare self.words with other.words."
assert not (a == c), "Different words must not be judged equal — __eq__ compares content, not existence."
assert (a != c) is True, "a != c should be True — define __eq__ correctly and Python derives != for you."
assert len(a) == 2 and len(c) == 1, "len() miscounted — __len__ must return the number of words."
d = a + c
assert isinstance(d, Inscription), "__add__ must forge a NEW Inscription — not a list, not a string."
assert str(d) == "gruzh morn ulak", "The joined band reads wrongly — __add__ must combine self.words + other.words in order."
assert len(a) == 2 and len(c) == 1, "__add__ scarred its operands — build a new Inscription and leave both untouched."
assert len(Inscription([])) == 0, "An empty inscription has length 0 — __len__ must not fail on no words."
src = ["gruzh"]
guarded = Inscription(src)
src.append("morn")
assert len(guarded) == 1, "An outside hand rewrote the band — copy in __init__ with list(words), never store the caller's list itself."
assert "gruzh morn ulak" in _stdout, "The band bears no verse — print(a + b) so print can summon __str__ on the new inscription."`,
        successText: 'The band accepts the deep names. Operators bow; print speaks; the inscription answers for itself now.',
        xp: 85,
      },
      extras: [
        {
          id: 'a4l6x1',
          kind: 'echo',
          title: 'The Chant of the Pits',
          prompt: 'What is cut into gold is also beaten into drums. The pit-chants of the '
            + 'foundry are strings of syllables, and the drummers demand they behave like '
            + 'native things — printed, compared, measured, joined.\n\n'
            + 'Your working must satisfy, exactly:\n\n'
            + '- Define a class `Chant`.\n'
            + '- `__init__(self, syllables)` stores a **copy**: `self.syllables = list(syllables)`.\n'
            + '- `__str__` returns the syllables joined by `-` (a hyphen).\n'
            + '- `__eq__` returns `True` when the other object is a `Chant` with equal `syllables`.\n'
            + '- `__len__` returns the number of syllables.\n'
            + '- `__add__` returns a **new** `Chant` whose syllables are `self.syllables + other.syllables`; neither operand may change.\n'
            + '- Then: `a = Chant(["ash", "nazg"])`, `b = Chant(["durbatuluk"])`, and `print(a + b)` — the drums must read `ash-nazg-durbatuluk`.',
          starter: py`class Chant:
    def __init__(self, syllables):
        # TODO: store a COPY: self.syllables = list(syllables)
        pass

    # TODO: __str__ -- the syllables joined by "-"
    # TODO: __eq__ -- True when other is a Chant with equal syllables
    # TODO: __len__ -- how many syllables
    # TODO: __add__ -- a NEW Chant of self.syllables + other.syllables

# TODO: a = Chant(["ash", "nazg"]); b = Chant(["durbatuluk"]); print(a + b)
`,
          solution: py`class Chant:
    def __init__(self, syllables):
        self.syllables = list(syllables)

    def __str__(self):
        return "-".join(self.syllables)

    def __eq__(self, other):
        return isinstance(other, Chant) and self.syllables == other.syllables

    def __len__(self):
        return len(self.syllables)

    def __add__(self, other):
        return Chant(self.syllables + other.syllables)

a = Chant(["ash", "nazg"])
b = Chant(["durbatuluk"])
print(a + b)`,
          hints: [
            'Each dunder is an ordinary method with a reserved name, indented inside the class: __str__ is return "-".join(self.syllables); __eq__ is return isinstance(other, Chant) and self.syllables == other.syllables; __len__ is return len(self.syllables).',
            '__add__ must forge, not scar: return Chant(self.syllables + other.syllables) — a brand-new chant. Then print(a + b) lets print summon __str__ on the result.',
          ],
          validation: py`x = Chant(["ash", "nazg"])
y = Chant(["ash", "nazg"])
z = Chant(["gimbatul"])
assert str(x) == "ash-nazg", "str(...) spoke wrongly -- __str__ must join the syllables with '-'."
assert x == y, "Two chants of the same syllables must be equal -- __eq__ must compare self.syllables with other.syllables."
assert not (x == z), "Different syllables must not be judged equal -- __eq__ compares content."
assert (x != z) is True, "x != z should be True -- define __eq__ and Python derives != for you."
try:
    n = len(x)
except TypeError:
    raise AssertionError("len() found nothing to summon -- define __len__ returning the syllable count.")
assert n == 2 and len(z) == 1, "len() miscounted -- __len__ must return the number of syllables."
assert len(Chant([])) == 0, "An empty chant has length 0 -- __len__ must not fail on silence."
try:
    joined = x + z
except TypeError:
    raise AssertionError("The + rune found no __add__ -- define __add__ returning a NEW Chant of both syllable lists.")
assert isinstance(joined, Chant), "__add__ must forge a NEW Chant -- not a list, not a string."
assert str(joined) == "ash-nazg-gimbatul", "The joined chant reads wrongly -- __add__ must combine self.syllables + other.syllables in order."
assert len(x) == 2 and len(z) == 1, "__add__ scarred its operands -- build a new Chant and leave both untouched."
src = ["ash"]
kept = Chant(src)
src.append("nazg")
assert len(kept) == 1, "An outside hand rewrote the chant -- copy in __init__ with list(syllables), never store the caller's list itself."
assert "ash-nazg-durbatuluk" in _stdout, "The pits heard no chant -- print(a + b) so print can summon __str__ on the new chant."`,
          successText: 'The drums take the joined chant whole. The syllables answer for themselves now, in every mouth that speaks them.',
          xp: 25,
        },
      ],
      trace: [
        {
          id: 'a4l6t1',
          code: py`class Verse:
    def __init__(self, word):
        self.word = word

    def __repr__(self):
        return "Verse:" + self.word

v = Verse("ash")
print(v)
print([v])`,
          q: 'The scrying: what does this working print?',
          options: [
            'Verse:ash\n[Verse:ash]',
            'ash\n[ash]',
            '<Verse object>\n[<Verse object>]',
            'Verse:ash\n[<Verse object>]',
          ],
          answer: 0,
          explain: 'print() wants __str__, but when __str__ is missing, str() falls back '
            + 'to __repr__ — so the bare print speaks Verse:ash. And containers always '
            + 'show their elements with repr, so the list matches. "ash" imagines repr '
            + 'returns the raw attribute; the object-default options forget the fallback '
            + 'exists — the <...> form appears only when NEITHER face is defined, and '
            + 'containers never ignore a __repr__ you wrote.',
        },
        {
          id: 'a4l6t2',
          code: py`class Band:
    def __init__(self, words):
        self.words = words

    def __len__(self):
        return len(self.words)

a = Band(["ash", "nazg"])
b = Band(["ash", "nazg"])
print(len(a), a == b)`,
          q: 'The scrying: what does this working print?',
          options: [
            '2 True',
            '2 False',
            'It dies - TypeError: object of type Band has no len()',
            '4 False',
          ],
          answer: 1,
          explain: 'Each dunder is independent. len(a) summons the __len__ you defined: '
            + '2. But == was never taught: without __eq__ it falls back to identity, and '
            + 'a and b are two separate castings — False, however identical their words. '
            + '"2 True" assumes equality compares content on its own; the TypeError '
            + 'option misses that __len__ IS defined; "4 False" counts both bands — '
            + 'len asks one object, not the pair.',
        },
      ],
      quiz: [
        {
          q: 'What does `print(v)` actually call on your object?',
          options: [
            '`__print__`',
            '`__str__` — falling back to `__repr__` if `__str__` was never defined',
            '`__repr__` — always, even when `__str__` exists',
            'Nothing; print only works on built-in types',
          ],
          answer: 1,
          explain: '`print(v)` converts with `str(v)`, which summons `__str__`, using '
            + '`__repr__` only as the fallback. There is no `__print__`. The reverse fallback '
            + 'never happens: `repr()` ignores `__str__` completely.',
        },
        {
          q: 'Your class defines no `__eq__`. What does `a == b` test?',
          options: [
            'Identity — True only when a and b are the very same object in memory',
            'Equality of all attributes, checked one by one',
            'Equality of their `__str__` texts',
            'It raises TypeError for user-defined classes',
          ],
          answer: 0,
          explain: 'The inherited default compares identity, like `is`. Two castings with '
            + 'identical attributes stand unequal until you define `__eq__` and declare what '
            + 'equality means for your kind.',
        },
        {
          q: 'What is the well-mannered behavior of `__add__`?',
          options: [
            'Mutate self in place and return None',
            'Mutate self and return self',
            'Build and return a NEW object, leaving both operands unchanged',
            'Print the combined result directly',
          ],
          answer: 2,
          explain: '`a + b` must behave as it does for numbers: produce a fresh value and scar '
            + 'neither operand. An `__add__` that mutates makes innocent expressions corrupt '
            + 'their own inputs — shared-state corruption invited by pleasant syntax.',
        },
        {
          q: 'What is `__repr__` for, as opposed to `__str__`?',
          options: [
            'They are interchangeable aliases',
            '`__repr__` is the pretty text meant for end users',
            '`__repr__` runs faster than `__str__`',
            '`__repr__` is the unambiguous, developer-facing form — ideally resembling the constructor call — used in containers and debugging',
          ],
          answer: 3,
          explain: '`__str__` serves readers; `__repr__` serves the sorcerer at the debugger, '
            + 'and containers always display elements with it. Aim for a repr that could '
            + 'recreate the object, like Inscription([\'ulak\']).',
        },
      ],
    },

    // ------------------------------------------------------------------
    // a4l7 — Armies, Not Bloodlines
    // ------------------------------------------------------------------
    {
      id: 'a4l7',
      title: 'Armies, Not Bloodlines',
      concept: 'composition over inheritance: objects holding other objects, delegation, when not to subclass',
      xp: 40,
      narrative: 'The Enemy does not breed a tower out of soldiers, nor crossbreed a legion '
        + 'from an orc. That way lie monsters — hierarchies that inherit teeth where they '
        + 'needed only numbers. Barad-dûr is built the older way: *assembled*. The tower holds '
        + 'armies; the army holds cohorts; the cohort holds soldiers, each complete in itself, '
        + 'each replaceable at need. When the order comes down, no single part knows the whole '
        + 'plan — each merely passes the command to the parts it holds. The masons call it '
        + 'composition, and it outlasts every bloodline ever sworn.',
      sections: [
        {
          heading: 'The trap of the family tree',
          body: 'Inheritance is seductive: subclass something and its powers are yours, free. '
            + 'But inheritance makes the **is-a** promise — the child must truly *be a kind of* '
            + 'the parent, able to stand anywhere the parent is expected. Subclass merely to '
            + '*borrow code*, and every inherited method becomes a nonsense promise your class '
            + 'must now keep.\n\n'
            + 'The test is one question, asked honestly: is a legion a kind of orc? No — a '
            + 'legion **has** orcs. Is-a inherits; **has-a** composes.',
          code: py`class Orc:
    def __init__(self, name, strength):
        self.name = name
        self.strength = strength

class Legion(Orc):                    # WRONG: a legion is not an orc
    pass

host = Legion("Third Legion", 5000)   # it runs...
print(host.strength)                  # ...but what is one orc's strength of 5000?
# Every Orc method now haunts Legion, promising things a legion cannot mean.`,
        },
        {
          heading: 'Composition: the army holds its soldiers',
          body: '**Composition** is objects holding other objects as attributes. The outer '
            + 'object owns a collection of parts — created in `__init__`, guarded behind an '
            + 'underscore — and grows behavior by *using* the parts, not by being one.\n\n'
            + '- The whole and its parts remain separate classes, free to change independently.\n'
            + '- Parts can be added, removed, or swapped at runtime — no bloodline is forever.\n'
            + '- And by duck typing, anything that answers the same calls can serve as a part.',
          code: py`class Orc:
    def __init__(self, name, strength):
        self.name = name
        self.strength = strength

class Legion:
    def __init__(self, name):
        self.name = name
        self._ranks = []               # the legion HAS orcs; it is not one

    def enlist(self, orc):
        self._ranks.append(orc)

legion = Legion("Gorgoroth")
legion.enlist(Orc("Snaga", 3))
legion.enlist(Orc("Gorbag", 7))
print(len(legion._ranks))              # 2 — held, not inherited`,
          note: 'Many great libraries invert this bargain: they ask you to **declare** a '
            + 'class whose attributes describe a record — fields laid out as class '
            + 'attributes, a schema written as a class — and the library itself builds, '
            + 'stores, and queries the objects. You write the description; machinery you '
            + 'never see does the work. Recognize that declarative shape once and every '
            + 'such library reads as kin — no memorizing each one.',
        },
        {
          heading: 'Delegation: pass the order down',
          body: 'A composed object answers requests by **delegation** — its methods call the '
            + 'methods (or read the attributes) of the parts it holds, and assemble the '
            + 'answer. The legion does not know its own strength; it *asks*, at the moment of '
            + 'the question.\n\n'
            + 'Delegation reads live objects, so the whole always reflects its parts: wound an '
            + 'orc, and the legion\'s next count already knows. The shared-object behavior '
            + 'that was a trap in class attributes becomes, here, precisely the point — this '
            + 'time the sharing is chosen, and owned by one guarded list.',
          code: py`class Orc:
    def __init__(self, name, strength):
        self.name = name
        self.strength = strength

class Legion:
    def __init__(self, name):
        self.name = name
        self._ranks = []

    def enlist(self, orc):
        self._ranks.append(orc)

    def strength(self):                # delegation: ask each part
        total = 0
        for orc in self._ranks:
            total += orc.strength
        return total

legion = Legion("Gorgoroth")
legion.enlist(Orc("Snaga", 3))
legion.enlist(Orc("Gorbag", 7))
print(legion.strength())               # 10 — the whole asks its parts`,
          note: 'When NOT to subclass, in one rule: if the honest sentence is "X has a Y" or '
            + '"X is made of Ys", compose. Reserve inheritance for the rare, true "X is a Y" — '
            + 'as the next warden will require of you.',
        },
        {
          heading: 'Dissection: the Beacon-chain',
          body: 'Read this whole working aloud, line by line — it is composition entire, in '
            + 'miniature.\n\n'
            + '- `class Beacon` is a **part**: a hill it stands on, and a flame that starts cold.\n'
            + '- `class Chain` names no parent — it **has** beacons; it is not one.\n'
            + '- `self._beacons = []` inside `__init__` forges each chain its own guarded list of parts.\n'
            + '- `add` grows the whole by holding one more beacon; `light` reaches into a single part.\n'
            + '- `lit_count` **delegates** — it counts living flames at the instant it is asked, never before.\n'
            + '- The last lines build a chain, hold one beacon, light it *through the beacon itself*, and the chain\'s next count already knows.\n\n'
            + 'Two questions seal the reading:\n\n'
            + '- **What changes if `_beacons = []` sits in the class body instead of in `__init__`?** '
            + 'Every chain shares one list, and a second chain counts flames it never held — the class-attribute trap, returned.\n'
            + '- **What changes if `lit_count` stores its total in `__init__` instead of counting at call time?** '
            + 'A beacon lit afterward no longer shows; the whole freezes and stops mirroring its parts. Delegation lives in the asking, not the remembering.',
          code: py`class Beacon:
    def __init__(self, hill):
        self.hill = hill
        self.lit = False

    def light(self):
        self.lit = True

class Chain:
    def __init__(self):
        self._beacons = []

    def add(self, beacon):
        self._beacons.append(beacon)

    def lit_count(self):
        return sum(1 for b in self._beacons if b.lit)

chain = Chain()
amon = Beacon("Amon Din")
chain.add(amon)
chain.add(Beacon("Eilenach"))
amon.light()
print(chain.lit_count())   # 1 — the chain asks its parts and finds one lit`,
        },
      ],
      challenge: {
        title: 'The Muster of Barad-dûr',
        prompt: 'The tower demands a legion it can count on — literally. Build it by holding, '
          + 'not by breeding.\n\n'
          + 'Your working must satisfy, exactly:\n\n'
          + '- Define class `Orc`: `__init__(self, name, strength)` stores both. Method `report(self)` returns the name, a space, then the strength in parentheses — for example `Snaga (3)`.\n'
          + '- Define class `Legion` — it must NOT inherit from `Orc`. Its `__init__(self, name)` stores `self.name` and creates an empty list `self._ranks`.\n'
          + '- Method `enlist(self, orc)` appends the orc to `self._ranks`.\n'
          + '- Method `strength(self)` returns the sum of every enlisted orc\'s `strength` — `0` for an empty legion. Read the orcs at call time; keep no running total.\n'
          + '- Method `muster_roll(self)` returns a list of each orc\'s `report()`, in enlistment order.\n'
          + '- Dunder `__len__` returns how many orcs are enlisted.\n'
          + '- Raise `legion = Legion("Gorgoroth")`, enlist `Orc("Snaga", 3)` and `Orc("Gorbag", 7)`, then print `legion.strength()`.',
        starter: py`# Hold them. Do not become them.

class Orc:
    def __init__(self, name, strength):
        # TODO: store self.name and self.strength
        pass

    # TODO: def report(self): return "<name> (<strength>)"

class Legion:
    def __init__(self, name):
        # TODO: store self.name; create the empty list self._ranks
        pass

    # TODO: def enlist(self, orc): append to self._ranks

    # TODO: def strength(self): sum of each enlisted orc's strength
    #   (ask the orcs each time — keep no running total)

    # TODO: def muster_roll(self): list of each orc's report(), in order

    # TODO: def __len__(self): how many are enlisted

# TODO: legion = Legion("Gorgoroth")
# TODO: enlist Orc("Snaga", 3) and Orc("Gorbag", 7)
# TODO: print(legion.strength())
`,
        solution: py`class Orc:
    def __init__(self, name, strength):
        self.name = name
        self.strength = strength

    def report(self):
        return self.name + " (" + str(self.strength) + ")"

class Legion:
    def __init__(self, name):
        self.name = name
        self._ranks = []

    def enlist(self, orc):
        self._ranks.append(orc)

    def strength(self):
        total = 0
        for orc in self._ranks:
            total += orc.strength
        return total

    def muster_roll(self):
        return [orc.report() for orc in self._ranks]

    def __len__(self):
        return len(self._ranks)

legion = Legion("Gorgoroth")
legion.enlist(Orc("Snaga", 3))
legion.enlist(Orc("Gorbag", 7))
print(legion.strength())`,
        hints: [
          'Legion\'s header is plain — class Legion: — with no parentheses naming Orc. The connection between them is the list self._ranks created in __init__, nothing more.',
          'Every Legion method delegates to that list: enlist appends to it, __len__ returns len(self._ranks), strength loops over it adding orc.strength, muster_roll collects orc.report() for each.',
          'strength can be: total = 0, then for orc in self._ranks: total += orc.strength, then return total. muster_roll can be a list comprehension: [orc.report() for orc in self._ranks].',
        ],
        validation: py`empty = Legion("Udun")
assert len(empty) == 0, "An unraised legion counts zero — __len__ must return the number enlisted."
assert empty.strength() == 0, "An empty legion has strength 0 — sum over no orcs without crashing."
assert empty.muster_roll() == [], "An empty legion's roll is an empty list."
o1 = Orc("Snaga", 3)
assert o1.report() == "Snaga (3)", "The orc misreports — report must return the name, a space, and the strength in parentheses: Snaga (3)"
army = Legion("Gorgoroth")
army.enlist(o1)
army.enlist(Orc("Gorbag", 7))
assert len(army) == 2, "The count is wrong after two enlistments — enlist must append to self._ranks, and __len__ must count it."
assert army.strength() == 10, "The legion's strength must be the sum of its orcs — 3 + 7 is 10."
assert army.muster_roll() == ["Snaga (3)", "Gorbag (7)"], "muster_roll must delegate — each orc's report(), in enlistment order."
o1.strength = 5
assert army.strength() == 12, "The legion hoards stale numbers — strength() must ASK the orcs at call time, not copy their strength at enlistment."
late = Legion("Morgul")
assert len(late) == 0, "Two legions share one muster — create self._ranks = [] inside __init__, never in the class body."
assert not issubclass(Legion, Orc), "The family tree grew wrong — a Legion HAS orcs; it must not inherit from Orc."
assert any(line.strip() == "10" for line in _stdout.splitlines()), "Barad-dur heard no count — print(legion.strength()) after both enlistments."`,
        successText: 'The tower stands — not bred, but built. Every part replaceable, and the whole more patient than any bloodline.',
        xp: 90,
      },
      extras: [
        {
          id: 'a4l7x1',
          kind: 'echo',
          title: 'The Black Fleet',
          prompt: 'The Corsairs of Umbar do not breed a fleet from a single ship, nor graft '
            + 'an admiral onto a hull. The fleet HOLDS its ships — each crewed and counted on '
            + 'its own — and answers for the whole only by asking the parts.\n\n'
            + 'Your working must satisfy, exactly:\n\n'
            + '- Define class `Corsair`: `__init__(self, name, crew)` stores both. Method `report(self)` returns the name, a space, then the crew in square brackets — for example `Blackwake [40]`.\n'
            + '- Define class `Fleet` — it must NOT inherit from `Corsair`. Its `__init__(self, port)` stores `self.port` and creates an empty list `self._ships`.\n'
            + '- Method `commission(self, ship)` appends the ship to `self._ships`.\n'
            + '- Method `crew(self)` returns the sum of every ship\'s `crew` — `0` for an empty fleet. Read the ships at call time; keep no running total.\n'
            + '- Method `roll(self)` returns a list of each ship\'s `report()`, in commissioning order.\n'
            + '- Dunder `__len__` returns how many ships the fleet holds.\n'
            + '- Raise `fleet = Fleet("Umbar")`, commission `Corsair("Blackwake", 40)` and `Corsair("Gull", 30)`, then print `fleet.crew()`.',
          starter: py`# Hold the ships. Do not become one.

class Corsair:
    def __init__(self, name, crew):
        # TODO: store self.name and self.crew
        pass

    # TODO: def report(self): return "<name> [<crew>]"

class Fleet:
    def __init__(self, port):
        # TODO: store self.port; create the empty list self._ships
        pass

    # TODO: commission(self, ship) -- append the ship to self._ships
    # TODO: crew(self) -- sum of each ship's crew, asked at call time
    # TODO: roll(self) -- list of each ship's report(), in order
    # TODO: __len__(self) -- how many ships are held

# TODO: fleet = Fleet("Umbar"); commission Corsair("Blackwake", 40) and
#   Corsair("Gull", 30); then print(fleet.crew())
`,
          solution: py`class Corsair:
    def __init__(self, name, crew):
        self.name = name
        self.crew = crew

    def report(self):
        return self.name + " [" + str(self.crew) + "]"

class Fleet:
    def __init__(self, port):
        self.port = port
        self._ships = []

    def commission(self, ship):
        self._ships.append(ship)

    def crew(self):
        total = 0
        for ship in self._ships:
            total += ship.crew
        return total

    def roll(self):
        return [ship.report() for ship in self._ships]

    def __len__(self):
        return len(self._ships)

fleet = Fleet("Umbar")
fleet.commission(Corsair("Blackwake", 40))
fleet.commission(Corsair("Gull", 30))
print(fleet.crew())`,
          hints: [
            'Fleet\'s header is plain — class Fleet: — with no parentheses naming Corsair. The only tie between them is the list self._ships created in __init__.',
            'Every Fleet method delegates to that list: commission appends, __len__ returns len(self._ships), crew loops adding ship.crew, roll collects ship.report() for each. crew must ASK the ships each call — keep no stored total.',
          ],
          validation: py`empty = Fleet("Pelargir")
assert len(empty) == 0, "An uncommissioned fleet holds nothing -- __len__ must return the number of ships."
assert empty.crew() == 0, "An empty fleet crews no one -- sum over no ships without crashing."
assert empty.roll() == [], "An empty fleet's roll is an empty list."
s1 = Corsair("Blackwake", 40)
assert s1.report() == "Blackwake [40]", "The ship misreports -- report must return the name, a space, and the crew in square brackets: Blackwake [40]"
navy = Fleet("Umbar")
navy.commission(s1)
navy.commission(Corsair("Gull", 30))
assert len(navy) == 2, "The count is wrong after two commissions -- commission must append to self._ships, and __len__ must count it."
assert navy.crew() == 70, "The fleet's crew must be the sum of its ships -- 40 + 30 is 70."
assert navy.roll() == ["Blackwake [40]", "Gull [30]"], "roll must delegate -- each ship's report(), in commissioning order."
s1.crew = 55
assert navy.crew() == 85, "The fleet hoards stale numbers -- crew() must ASK the ships at call time, not copy their crew at commissioning."
other = Fleet("Harad")
assert len(other) == 0, "Two fleets share one roster -- create self._ships = [] inside __init__, never in the class body."
assert not issubclass(Fleet, Corsair), "The hierarchy grew wrong -- a Fleet HAS ships; it must not inherit from Corsair."
assert any(line.strip() == "70" for line in _stdout.splitlines()), "Umbar heard no count -- print(fleet.crew()) after both commissions."`,
          successText: 'The fleet answers as one hull though it is a hundred — held, not bred, and every ship still its own.',
          xp: 20,
        },
      ],
      trace: [
        {
          id: 'a4l7t1',
          code: py`class Orc:
    def __init__(self, strength):
        self.strength = strength
class Legion:
    def __init__(self, orcs):
        self._orcs = orcs
    def total(self):
        return sum(o.strength for o in self._orcs)
snaga = Orc(3)
host = Legion([snaga, Orc(7)])
snaga.strength = 9
print(host.total())`,
          q: 'The scrying: what does this working print?',
          options: ['10', '16', '9', 'It dies - AttributeError: an enlisted orc\'s strength cannot be reassigned'],
          answer: 1,
          explain: 'Composition holds references, not copies, and `total()` reads them at the '
            + 'moment it is asked: raising `snaga.strength` to 9 changes the very object the '
            + 'legion holds, so the count is 9 + 7 = 16. "10" is the copied-at-enlistment '
            + 'belief (3 + 7); "9" forgets the second orc still answers the muster; the death '
            + 'option imagines a plain attribute can be sealed against reassignment — it cannot.',
        },
      ],
      quiz: [
        {
          q: 'What is the honest test for choosing inheritance over composition?',
          options: [
            'Inherit whenever two classes share any code at all',
            'Inherit whenever it saves typing',
            'Inherit only when the child truly IS A kind of the parent and can stand wherever the parent is expected; otherwise hold the other object (HAS A)',
            'Never inherit; composition has replaced inheritance entirely',
          ],
          answer: 2,
          explain: 'Inheritance is a public promise of substitutability, not a code-sharing '
            + 'trick. Shared code alone is better borrowed through composition — inheritance '
            + 'still has its place, but only where is-a is literally true.',
        },
        {
          q: 'What is delegation?',
          options: [
            'An outer object fulfilling a request by calling methods on (or reading from) the objects it holds',
            'A subclass calling `super()`',
            'Assigning one variable to another',
            'Python automatically forwarding unknown method calls to attributes',
          ],
          answer: 0,
          explain: 'Legion.strength() answering by summing each held orc\'s strength is '
            + 'delegation: the whole passes work to its parts. Python forwards nothing '
            + 'automatically — you write the forwarding method yourself, which is why it stays '
            + 'legible.',
        },
        {
          q: 'Why is `class Legion(Orc):` a design wound even when it runs?',
          options: [
            'Subclasses may not add new attributes',
            'A legion is not a kind of orc — it merely contains orcs — so every inherited orc method becomes a nonsense promise on Legion',
            'Python forbids subclassing a class that defines `__init__`',
            'It prevents the Legion from storing orcs',
          ],
          answer: 1,
          explain: 'The code executes; the meaning is broken. Callers handed a Legion may '
            + 'lawfully treat it as an Orc — and every Orc behavior it inherited answers with '
            + 'nonsense. Composition states the truth: has-a, not is-a.',
        },
        {
          q: 'A Legion keeps its orcs in `self._ranks` and computes `strength()` by summing `orc.strength` at each call. An orc\'s strength then changes. What does the legion report?',
          options: [
            'The old total — values are copied at enlistment',
            'It raises an error, since a part changed after enlistment',
            'Zero, until the orc is enlisted again',
            'The new total — the legion holds references to living objects and asks them at call time',
          ],
          answer: 3,
          explain: 'Composition stores references, not copies. Delegating at call time means '
            + 'the whole always reflects its parts — the shared-object behavior that corrupted '
            + 'class attributes becomes, when chosen and guarded, exactly the strength of the '
            + 'design.',
        },
      ],
    },
  ],

  // --------------------------------------------------------------------
  // Boss — The Witch-king of Angmar
  // --------------------------------------------------------------------
  boss: {
    id: 'act4-boss',
    title: 'The Witch-king of Angmar',
    narrative: 'He was a king once — you wrote him yourself, three trials ago, and watched the '
      + 'years hollow him out. Now he stands at the gate of the act you have survived, crowned '
      + 'with nothing, and he knows every rune you have learned, because he is *made* of them: '
      + 'cast from a mold, branded by his master\'s class, his allegiance overridden, his voice '
      + 'one of many shapes answering a single will. He cannot be reasoned with and he cannot '
      + 'be avoided. To pass, prove you can do what his maker did. Build the hierarchy. Give '
      + 'it voices. Make it kneel.',
    defeatText: 'The pale crown tilts as if considering you, and the last candle goes out — retreat, study what broke, and return armed.',
    victoryText: 'The crown rings on the stones, suddenly empty; what wore it goes thin and screaming into the wind, and the forge answers to you now.',
    xp: 400,
    flawlessBonus: 50,
    gauntlet: [
      {
        q: 'What happens, in order, when Python runs `wraith = Ringwraith("Khamul", 2)`?',
        options: [
          '`__init__` creates the class, then returns it',
          'The arguments are stored until an attribute is first read, then `__init__` runs lazily',
          'A new blank instance is made, `__init__` receives it as self along with "Khamul" and 2, and the finished instance is bound to `wraith`',
          '`__init__` runs, and its return value — the name string — is bound to `wraith`',
        ],
        answer: 2,
        explain: 'Calling a class builds the instance, hands it to `__init__` as self for '
          + 'setup, and the call evaluates to the instance itself. `__init__` returns None; '
          + 'its return value is ignored, never bound.',
      },
      {
        q: 'A class defines `banner = "black"` in its body. After `a.banner = "red"`, what do `a.banner` and `b.banner` show, where `b` is another instance?',
        options: [
          '`a` shows "red", `b` shows "black" — the assignment made an instance attribute on `a` that shadows the class value',
          'Both show "red" — class attributes change everywhere at once',
          'Both show "black" — instances cannot be assigned attributes',
          '`a` shows "red"; reading `b.banner` now raises AttributeError',
        ],
        answer: 0,
        explain: 'Assignment through an instance writes onto that instance alone, shadowing '
          + 'the class attribute for `a` only. The class value stands beneath, and every other '
          + 'instance still reads it.',
      },
      {
        q: 'A `heat` property\'s setter raises `ValueError` for negatives before assigning `self._heat`. What is true after `f.heat = -9` is attempted?',
        options: [
          '`_heat` is -9, and the exception is merely cosmetic',
          'The exception aborted the setter, so `_heat` still holds its previous lawful value',
          '`_heat` was reset to 0 as a safe default',
          'The property deleted itself from the class',
        ],
        answer: 1,
        explain: 'Raising ends the setter before its storing line runs, so the guarded value '
          + 'is never touched. Validate first, assign second — that ordering is the whole '
          + 'defense of the invariant.',
      },
      {
        q: 'An overriding `obey()` begins with `base = super().obey()`. What does that line do?',
        options: [
          'Recursively calls the override itself, crashing',
          'Instantiates the parent class and calls obey on that new object',
          'Skips to the topmost class, `object`, which has no obey',
          'Runs the parent class\'s obey on this same instance, so the override can build upon its result',
        ],
        answer: 3,
        explain: '`super()` reaches the next class up the chain while staying bound to the '
          + 'same instance — no new object, no recursion. It is how an override extends the '
          + 'ancestor instead of retyping it.',
      },
      {
        q: 'A function runs `thing.march()` on every element of a list. Which objects may the list lawfully contain?',
        options: [
          'Only instances of classes inheriting one shared base',
          'Any objects at all whose classes define a march() method — ancestry is never consulted',
          'Only instances of a single class',
          'Only objects pre-approved with isinstance',
        ],
        answer: 1,
        explain: 'Duck typing: at each call Python looks `march` up on that object and runs '
          + 'what it finds. No shared bloodline is required — the method\'s presence is the '
          + 'entire pact.',
      },
      {
        q: 'A class defines `__len__` but not `__eq__`. Which is true?',
        options: [
          '`len(x)` fails, but `x == y` compares attributes',
          '`len(x)` works, and `x == y` compares attribute values',
          '`len(x)` summons `__len__`, and `x == y` falls back to identity — same object, or not equal',
          'Both raise TypeError until every dunder is defined',
        ],
        answer: 2,
        explain: 'Each dunder is independent: `len()` needs only `__len__`. Equality without '
          + '`__eq__` inherits the default, which compares identity like `is` — content '
          + 'never enters into it.',
      },
    ],
    finalChallenge: {
      title: 'The Last Working at the Gate',
      prompt: 'Three shapes stand before the gate; one will moves them all. The Witch-king '
        + 'demands you rebuild the bloodline he was built from — flawlessly, for he will test '
        + 'every rune of it.\n\n'
        + 'Your working must satisfy, exactly:\n\n'
        + '- Class `Servant`: `__init__(self, name)` stores `self.name`. Method `obey(self)` returns the name + `" kneels."`. Dunder `__str__` returns the name + `", bound to the Eye"`.\n'
        + '- Class `Orc`, inheriting from `Servant`: it overrides `obey` to return the name + `" kneels, snarling."`. It must inherit `__init__` and `__str__` — do not retype them.\n'
        + '- Class `Ringwraith`, inheriting from `Servant`: `__init__(self, name, ring)` calls `super().__init__(name)` and stores `self.ring`. It overrides `obey` to return the name + `" kneels, for nothing remains to refuse."`.\n'
        + '- Build `host = [Servant("Snaga"), Orc("Muzgash"), Ringwraith("Khamul", 2)]` and print each servant\'s `obey()` on its own line.',
      starter: py`# Three shapes, one will. Build the hierarchy.

# TODO: class Servant
#   __init__(self, name): store self.name
#   obey(self): return "<name> kneels."
#   __str__(self): return "<name>, bound to the Eye"

# TODO: class Orc(Servant)
#   override obey: return "<name> kneels, snarling."
#   (inherit __init__ and __str__ — do not retype them)

# TODO: class Ringwraith(Servant)
#   __init__(self, name, ring): call super().__init__(name), store self.ring
#   override obey: return "<name> kneels, for nothing remains to refuse."

# TODO: host = [Servant("Snaga"), Orc("Muzgash"), Ringwraith("Khamul", 2)]
#   ...then print each servant's obey() on its own line
`,
      solution: py`class Servant:
    def __init__(self, name):
        self.name = name

    def obey(self):
        return self.name + " kneels."

    def __str__(self):
        return self.name + ", bound to the Eye"

class Orc(Servant):
    def obey(self):
        return self.name + " kneels, snarling."

class Ringwraith(Servant):
    def __init__(self, name, ring):
        super().__init__(name)
        self.ring = ring

    def obey(self):
        return self.name + " kneels, for nothing remains to refuse."

host = [Servant("Snaga"), Orc("Muzgash"), Ringwraith("Khamul", 2)]
for servant in host:
    print(servant.obey())`,
      validation: py`s = Servant("Grishna")
assert s.obey() == "Grishna kneels.", "The base Servant answers wrongly — obey must return the name plus ' kneels.'"
assert str(s) == "Grishna, bound to the Eye", "str(servant) speaks wrongly — __str__ must return the name plus ', bound to the Eye'."
o = Orc("Lugdush")
assert isinstance(o, Orc) and isinstance(o, Servant), "An Orc must descend from Servant — declare class Orc(Servant):"
assert o.name == "Lugdush", "Orc must inherit Servant's __init__ — define no __init__ of its own."
assert o.obey() == "Lugdush kneels, snarling.", "The orc's obedience is wrong — override obey to return the name plus ' kneels, snarling.'"
assert str(o) == "Lugdush, bound to the Eye", "Orc must INHERIT __str__ from Servant — do not redefine it."
assert Servant.obey(o) == "Lugdush kneels.", "The ancestor's obey must survive beneath the override — override in Orc; never edit Servant."
w = Ringwraith("Adunaphel", 7)
assert isinstance(w, Ringwraith) and isinstance(w, Servant), "A Ringwraith must descend from Servant — declare class Ringwraith(Servant):"
assert w.name == "Adunaphel", "super().__init__(name) never ran — the wraith has lost its name."
assert w.ring == 7, "The wraith's ring went unrecorded — after super().__init__, store self.ring."
assert w.obey() == "Adunaphel kneels, for nothing remains to refuse.", "The wraith's obedience is wrong — override obey with the exact words: ' kneels, for nothing remains to refuse.'"
assert str(w) == "Adunaphel, bound to the Eye", "The wraith's __str__ should be inherited from Servant, built from its own name."
assert issubclass(Orc, Servant) and issubclass(Ringwraith, Servant), "Both lines must branch from Servant — check both class headers."
assert not issubclass(Orc, Ringwraith) and not issubclass(Ringwraith, Orc), "The two lines must branch separately from Servant — neither may inherit the other."
legion = [Servant("One"), Orc("Two"), Ringwraith("Three", 9)]
answers = [x.obey() for x in legion]
assert answers == ["One kneels.", "Two kneels, snarling.", "Three kneels, for nothing remains to refuse."], "One will, many shapes — each class must answer obey() in its own voice."
assert "Muzgash kneels, snarling." in _stdout and "Khamul kneels, for nothing remains to refuse." in _stdout, "The gate heard no oaths — build the host and print each servant's obey()."`,
      xp: 0,
    },
    barks: {
      intro: [
        'You forged me three trials past, and watched the years hollow me. Now I wear your learning for a crown.',
        'Come to the gate, maker. Let us see whether the mold recalls the hand that cut it.',
      ],
      hit: [
        'A flaw in your casting. I was poured from flaws exactly like it.',
        'The rune slips — I felt it slip in my own making, and never stopped falling.',
        'You reached past the guard. The guard remembers every hand.',
        'One shape set wrong, and the whole host mistakes who commands it.',
        'Your hierarchy answers to me now. Blood runs downward, maker, never back.',
      ],
      playerFail: [
        'The forge spat your working back. Even iron refuses a hand that shakes.',
        'Nothing was cast. The mold stays cold, and I stay crowned.',
        'Your spell died on the anvil. Bring me a finished thing, or bring me none.',
      ],
      lastCandle: [
        'One candle between you and my whole night. I have watched brighter lights fail.',
        'The dark leans close now. Cast cleanly, or do not cast again.',
      ],
      death: [
        'The crown... empty... you built truer than the one who made me.',
        'I go thin upon the wind — and the forge answers your hand now, caster.',
      ],
    },
    premortem: {
      prompt: 'The Witch-king will test the whole bloodline at once — a base line and two '
        + 'that branch from it. Before you write a single override, which class do you '
        + 'raise and prove FIRST?',
      options: [
        'The base Servant class — both branches inherit its __init__ and __str__, so nothing can lean on it until it stands',
        'The host list — assemble the three servants first, then define the classes they will need',
        'Ringwraith first, since it is the most tangled and the rest fall into place around it',
        'The obey overrides on every class, before any __init__ — behavior matters more than construction',
      ],
      answer: 0,
      explain: 'Raise the ancestor before the heirs. Orc and Ringwraith borrow the '
        + 'Servant\'s making — its __init__ and its __str__ — so define and prove Servant '
        + 'first, or the branches inherit a ghost. You cannot build the host from classes '
        + 'that do not yet exist, and opening on the most tangled branch only means '
        + 'debugging inheritance whose base you have not yet proven sound.',
    },
  },

  // --------------------------------------------------------------------
  // Codex — the act's vocabulary
  // --------------------------------------------------------------------
  codex: [
    { term: 'class', def: 'A definition that binds data and behavior into a new type — the mold from which objects are cast.' },
    { term: 'instance (object)', def: 'One concrete object created by calling a class, like `Ring("Narya")` — each instance carries its own attribute values.' },
    { term: '__init__', def: 'The initializer method Python runs automatically on every new instance so its starting attributes can be set.' },
    { term: 'self', def: 'The conventional name for a method\'s first parameter: the instance being acted upon, passed in automatically by Python.' },
    { term: 'instance attribute', def: 'A value stored on one particular object (usually via `self.name = ...` in `__init__`), invisible to its siblings.' },
    { term: 'class attribute', def: 'A value defined in the class body, stored once on the class and shared by every instance that has not shadowed it.' },
    { term: 'method', def: 'A function defined inside a class and called through an instance with dot syntax, which passes the instance as `self`.' },
    { term: 'encapsulation', def: 'Keeping an object\'s data behind its own methods so its invariants survive; the `_underscore` prefix marks internals by convention.' },
    { term: '@property', def: 'A decorator that runs getter (and, with a setter, guard) code behind plain attribute syntax, so access can be validated or computed.' },
    { term: 'inheritance', def: 'Declaring `class Child(Parent)` so the child receives the parent\'s methods and attributes, and its instances count as the parent\'s kind.' },
    { term: 'super()', def: 'A handle to the next class up the inheritance chain, bound to the same instance — used to extend inherited behavior instead of retyping it.' },
    { term: 'method overriding', def: 'Redefining an inherited method in a subclass so the subclass\'s version answers for its instances.' },
    { term: 'polymorphism', def: 'Different classes answering the same method name each in their own way, so one piece of calling code can command many kinds.' },
    { term: 'duck typing', def: 'Judging an object by the methods it actually has rather than by its class — if the method is there, the call succeeds.' },
    { term: 'dunder method', def: 'A double-underscore method such as `__str__` or `__eq__` that Python summons when you use operators and built-ins on your object.' },
    { term: 'composition', def: 'Building an object out of other objects it holds (has-a) and delegating work to them, instead of inheriting from them (is-a).' },
    { term: 'shared mutable class attribute', def: 'A mutable value (a list, a dict) placed in the class body — one object living on the class, so a mutation through any instance is felt by them all; the silent bug cured by building it on `self` in `__init__`.' },
  ],
};
