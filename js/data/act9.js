// ============================================================
// act9.js — Act IX: The Age of Echoes
// Language & the New Minds — how words become numbers and
// numbers learn to speak. TF-IDF by hand and by sklearn,
// sentiment tribunals, embeddings from co-occurrence, n-gram
// language models with temperature, scaled dot-product
// attention in raw numpy, retrieval-augmented answering, and
// bound tool-agents with guardrails.
// ============================================================

const py = String.raw;

export default {
  id: 'act9',
  numeral: 'IX',
  arc: 'Language & the New Minds',
  title: 'The Age of Echoes',
  tagline: 'The machine-shadow is broken. Its scattered words are not — they echo, and the echoes are learning to answer.',
  sigil: '🗣️',
  epigraph: {
    text: 'The shadow fell, and the hosts burned what remained of it. But a word once spoken does not die. It waits — in wells, in mirrors, in painted frames — learning the shape of every mouth that feeds it. Beware the age that follows a war of minds: the age in which the echoes answer back.',
    source: 'the last entry in the muster-roll of the Last Alliance',
  },
  intro: 'The war is over. The Shadow of the Machine lies in pieces — and the pieces did not die. '
    + 'Its scattered words soaked into the stones the way all words do in the old places, where '
    + 'things have always talked back: portraits that answer, mirrors that flatter, hats that '
    + 'judge, wells that return what was shouted into them, changed. The old sorcerous houses '
    + 'never found this strange. They never asked *how*. You will ask how.\n\n'
    + 'This act is the anatomy of the talking things — the plain arithmetic under every echo that '
    + 'seems to understand. You will weigh words honestly with **TF-IDF**, put a text\'s **mood** '
    + 'on trial, press words into dense **embeddings** and measure their kinship by the '
    + '**cosine**, build a portrait that completes your sentences from **counted n-grams** and a '
    + 'dial called **temperature**, work the **attention** rite in raw `numpy` — the turning at '
    + 'the heart of every great echo now waking in the world — then chain it all into a library '
    + 'that answers by **retrieval** and a **bound servant** that acts through tools, on a leash '
    + 'you will forge yourself. Every corpus here is conjured, small, and seeded. When the Forge '
    + 'first hauls up `sklearn`, it takes a long moment. Let it. You are arming against the new '
    + 'minds, and the armory is deep.',
  lessons: [
    // ------------------------------------------------------------------
    // a9l1 — The Weight of Words
    // ------------------------------------------------------------------
    {
      id: 'a9l1',
      title: 'The Weight of Words',
      concept: 'term frequency, document frequency, TF-IDF computed by hand with numpy, and sklearn\'s TfidfVectorizer (whose formula differs — honestly)',
      xp: 40,
      narrative: 'Six scrolls survive from the fallen machine\'s hoard, and the archivists want to '
        + 'know what each one is *about*. A young clerk counts words and announces that every '
        + 'scroll is chiefly about the word **the**. He is not wrong — he is useless. The oldest '
        + 'archivist takes the ledger from him and says the first law of the reading of hoards: '
        + '*a word that is everywhere means nothing anywhere.* What a scroll is about is the word '
        + 'it uses that the others do not. Tonight you will turn that law into arithmetic, and '
        + 'the arithmetic has a name: TF-IDF.',
      sections: [
        {
          heading: 'Counting is not weighing',
          body: 'In the last act you turned messages into **bag-of-words** vectors — one slot per '
            + 'vocabulary word, order discarded. Raw counts have a flaw you can see in one '
            + 'ledger: the words that appear *most* are the words that mean *least*.\n\n'
            + '- **Term frequency (tf)** — how often a word appears in *one* document. High tf '
            + 'means the document leans on that word.\n'
            + '- **Document frequency (df)** — how many *documents* contain the word at all. '
            + 'High df means the word is common furniture: `the`, `and`, `of`.\n\n'
            + 'A word matters for a document when its tf is high but its df is low — used '
            + 'heavily *here*, used rarely *elsewhere*. Words like `the` score high tf in every '
            + 'scroll and maximal df across the hoard: loud, and empty.',
          code: py`scrolls = [
    "the shadow speaks beneath the stair",
    "the mirror repeats the shadow softly",
    "the portrait answers when the hall sleeps",
    "the hat weighs every head it meets",
    "the shadow keeps every name it hears",
    "the echo returns louder than the voice",
]

total_the = sum(text.split().count("the") for text in scrolls)
total_mirror = sum(text.split().count("mirror") for text in scrolls)
print(total_the, total_mirror)   # 10 1 -- "the" outshouts "mirror" ten to one
docs_with_the = sum(1 for text in scrolls if "the" in text.split())
print(docs_with_the)             # 6 -- and appears in every single scroll`,
          note: 'Words so common they carry no signal are called **stop words**. Some rites '
            + 'simply delete a fixed list of them. TF-IDF is the subtler blade: it does not need '
            + 'a list, because the corpus itself testifies against its own furniture.',
        },
        {
          heading: 'TF-IDF by hand — the textbook rite',
          body: 'The classic formula multiplies two judgments:\n\n'
            + '- `tf` — the raw count of word `w` in document `d` (a matrix: documents × '
            + 'vocabulary).\n'
            + '- `idf = log(N / df)` — the **inverse document frequency**: `N` documents '
            + 'divided by how many contain `w`, passed through the logarithm so the penalty is '
            + 'graded, not savage.\n'
            + '- `tfidf = tf * idf` — weight in one document, discounted by ubiquity across all.\n\n'
            + 'Read the extremes. A word in **every** document has `idf = log(N/N) = log(1) = 0` '
            + '— its weight is annihilated no matter how often it appears. A word in exactly one '
            + 'document out of six carries `log(6) ≈ 1.79` — nearly triple the weight of a word '
            + 'found in half of them (`log(2) ≈ 0.69`). The corpus votes, the logarithm '
            + 'sentences.',
          code: py`import numpy as np

scrolls = [
    "the shadow speaks beneath the stair",
    "the mirror repeats the shadow softly",
    "the portrait answers when the hall sleeps",
    "the hat weighs every head it meets",
    "the shadow keeps every name it hears",
    "the echo returns louder than the voice",
]
vocab = sorted({w for text in scrolls for w in text.split()})
word_to_idx = {w: i for i, w in enumerate(vocab)}
N, V = len(scrolls), len(vocab)

counts = np.zeros((N, V))                    # tf: documents x vocabulary
for i, text in enumerate(scrolls):
    for w in text.split():
        counts[i, word_to_idx[w]] += 1.0

df = (counts > 0).sum(axis=0)                # in how many scrolls does each word live?
idf = np.log(N / df)
tfidf = counts * idf                         # broadcasting: each column scaled by its idf

print(round(idf[word_to_idx["the"]], 3))     # 0.0   -- everywhere, therefore nothing
print(round(idf[word_to_idx["mirror"]], 3))  # 1.792 -- one scroll only: precious
print(round(tfidf[1, word_to_idx["shadow"]], 3))  # 0.693 -- present, but shared with two other scrolls`,
        },
        {
          heading: 'TfidfVectorizer — and an honest discrepancy',
          body: 'sklearn wraps the whole rite in one object:\n\n'
            + '- `vec = TfidfVectorizer()` then `X = vec.fit_transform(scrolls)` — learns the '
            + 'vocabulary and returns the weighted matrix in one stroke (sparse; call '
            + '`X.toarray()` to see it plainly).\n'
            + '- `vec.get_feature_names_out()` — the learned vocabulary, alphabetically sorted, '
            + 'one entry per column.\n\n'
            + 'But compare its numbers to yours and they will NOT match, for three honest '
            + 'reasons:\n\n'
            + '- sklearn\'s default idf is `ln((1 + N) / (1 + df)) + 1` — a **smoothed** '
            + 'variant. The `+1`s guard against unseen words; the trailing `+ 1` keeps any '
            + 'weight from reaching zero. So `the` is *dampened*, never annihilated.\n'
            + '- Each document row is then **L2-normalized** — scaled so its length is 1 — '
            + 'which stops long scrolls from outweighing short ones by sheer bulk.\n'
            + '- Its tokenizer lowercases and keeps only words of two or more letters. Our '
            + 'conjured scrolls were built to make the vocabularies agree; wild text will not '
            + 'be so polite.\n\n'
            + 'Different books print different TF-IDF formulas, and libraries pick their own. '
            + 'The *ordering* — rare-and-present beats common — survives every variant. The raw '
            + 'numbers do not. Never compare TF-IDF values across tools without reading the '
            + 'formula first.',
          code: py`import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

scrolls = [
    "the shadow speaks beneath the stair",
    "the mirror repeats the shadow softly",
    "the portrait answers when the hall sleeps",
    "the hat weighs every head it meets",
    "the shadow keeps every name it hears",
    "the echo returns louder than the voice",
]
vec = TfidfVectorizer()
X = vec.fit_transform(scrolls)
names = list(vec.get_feature_names_out())

print(X.shape)                               # (6, 27)
row = X.toarray()[1]                         # the mirror scroll
print(round(row[names.index("mirror")], 3))  # ~0.484 -- the rare word leads...
print(round(row[names.index("the")], 3))     # ~0.43  -- ...but "the" is dampened, not dead
print(np.linalg.norm(X.toarray(), axis=1))   # [1. 1. 1. 1. 1. 1.] -- every row length 1`,
          note: 'By the textbook rite, `the` weighed exactly nothing. By sklearn\'s smoothed '
            + 'rite it still weighs 0.43 in that row — nearly as much as `mirror`. Neither '
            + 'library is lying; they swore different oaths. The sorcerer who does not read '
            + 'formulas will someday trust a number that means something else.',
        },
      ],
      challenge: {
        title: 'The Weighing of Ink',
        prompt: 'The six scrolls of the fallen hoard are conjured below. Weigh their words both '
          + 'ways — by the textbook rite and by sklearn\'s — and report what the ledger shows.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Build the census: `vocab = sorted({w for text in scrolls for w in text.split()})`, '
          + 'then `word_to_idx = {w: i for i, w in enumerate(vocab)}`, `N = len(scrolls)`, '
          + '`V = len(vocab)`.\n'
          + '- Build `counts`, a `np.zeros((N, V))` matrix, and add `1.0` at '
          + '`counts[i, word_to_idx[w]]` for every word `w` of scroll `i`.\n'
          + '- Compute `df = (counts > 0).sum(axis=0)`, `idf = np.log(N / df)`, and '
          + '`tfidf = counts * idf`.\n'
          + '- Conjure sklearn\'s verdict: `vec = TfidfVectorizer()`, '
          + '`X_sk = vec.fit_transform(scrolls)`, `names = list(vec.get_feature_names_out())`.\n'
          + '- Print three lines, in this order: `int(df[word_to_idx["shadow"]])` (how many '
          + 'scrolls hold the shadow), `round(idf[word_to_idx["the"]], 3)` (the weight of '
          + 'ubiquity), and `names == vocab` (whether the two censuses agree).',
        starter: py`import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

# The hoard, conjured. Do not alter the scrolls.
scrolls = [
    "the shadow speaks beneath the stair",
    "the mirror repeats the shadow softly",
    "the portrait answers when the hall sleeps",
    "the hat weighs every head it meets",
    "the shadow keeps every name it hears",
    "the echo returns louder than the voice",
]

# TODO: vocab (sorted unique words), word_to_idx, N, V

# TODO: counts -- np.zeros((N, V)), +1.0 per word occurrence

# TODO: df, idf = np.log(N / df), tfidf = counts * idf

# TODO: vec = TfidfVectorizer(); X_sk = vec.fit_transform(scrolls);
#       names = list(vec.get_feature_names_out())

# TODO: print int(df[word_to_idx["shadow"]]),
#       then round(idf[word_to_idx["the"]], 3),
#       then names == vocab -- each on its own line
`,
        solution: py`import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

scrolls = [
    "the shadow speaks beneath the stair",
    "the mirror repeats the shadow softly",
    "the portrait answers when the hall sleeps",
    "the hat weighs every head it meets",
    "the shadow keeps every name it hears",
    "the echo returns louder than the voice",
]

vocab = sorted({w for text in scrolls for w in text.split()})
word_to_idx = {w: i for i, w in enumerate(vocab)}
N = len(scrolls)
V = len(vocab)

counts = np.zeros((N, V))
for i, text in enumerate(scrolls):
    for w in text.split():
        counts[i, word_to_idx[w]] += 1.0

df = (counts > 0).sum(axis=0)
idf = np.log(N / df)
tfidf = counts * idf

vec = TfidfVectorizer()
X_sk = vec.fit_transform(scrolls)
names = list(vec.get_feature_names_out())

print(int(df[word_to_idx["shadow"]]))
print(round(idf[word_to_idx["the"]], 3))
print(names == vocab)`,
        hints: [
          'The census is the same two lines you used in Act VIII: a set comprehension over every word of every scroll, sorted, then enumerate into a dict. V should come out to 27.',
          'counts is filled with a double loop: for i, text in enumerate(scrolls), then for w in text.split(), do counts[i, word_to_idx[w]] += 1.0. Then df = (counts > 0).sum(axis=0) counts documents, not occurrences.',
          'idf = np.log(N / df) and tfidf = counts * idf are single lines — broadcasting does the rest. The three prints are int(df[word_to_idx["shadow"]]) which is 3, round(idf[word_to_idx["the"]], 3) which is 0.0, and names == vocab which is True.',
        ],
        validation: py`import numpy as np
_v = sorted({_w for _t in scrolls for _w in _t.split()})
assert vocab == _v, "vocab must be the SORTED unique words of the six scrolls — sets have no promised order until sorted."
assert N == 6 and V == 27, "The census miscounts — N must be 6 scrolls and V must be 27 distinct words."
assert counts.shape == (6, 27), "counts must be a (6, 27) matrix — one row per scroll, one column per vocabulary word."
assert abs(counts[0].sum() - 6.0) < 1e-9, "Row 0 of counts must total 6 — the first scroll holds six words, counting repeats."
assert abs(counts[0, word_to_idx["the"]] - 2.0) < 1e-9, "counts[0] must record the word 'the' twice — raw counts, not presence flags."
assert abs(df[word_to_idx["the"]] - 6.0) < 1e-9 and abs(df[word_to_idx["mirror"]] - 1.0) < 1e-9, "df is wrong — 'the' lives in all 6 scrolls, 'mirror' in exactly 1. Count documents containing each word, not occurrences."
assert abs(idf[word_to_idx["the"]]) < 1e-9, "idf of 'the' must be exactly 0 — log(6/6) = log(1) = 0. A word in every scroll weighs nothing."
assert abs(idf[word_to_idx["mirror"]] - np.log(6.0)) < 1e-6, "idf of 'mirror' must be log(6/1) = log(6) — it lives in one scroll of six."
assert np.max(np.abs(tfidf[:, word_to_idx["the"]])) < 1e-9, "The tfidf column for 'the' must be all zeros — its idf annihilates every count."
_r1 = tfidf[1]
assert _r1[word_to_idx["mirror"]] > _r1[word_to_idx["shadow"]] > _r1[word_to_idx["the"]], "In scroll 1, the hand-weighed order must be mirror > shadow > the — rare beats shared beats ubiquitous."
_D = X_sk.toarray() if hasattr(X_sk, "toarray") else np.asarray(X_sk)
assert _D.shape == (6, 27), "X_sk must be TfidfVectorizer's (6, 27) matrix — fit_transform on the six scrolls."
assert names == vocab, "names must equal vocab — list(vec.get_feature_names_out()) sorted alphabetically matches your census here."
assert np.allclose(np.linalg.norm(_D, axis=1), 1.0, atol=1e-6), "Every row of sklearn's matrix must have length 1 — TfidfVectorizer L2-normalizes each document."
assert vec.idf_[names.index("the")] > 0.5, "sklearn's idf for 'the' must be positive — its smoothed formula ln((1+N)/(1+df)) + 1 never reaches zero. If you see 0, you overwrote sklearn's verdict with your own."
assert abs(vec.idf_[names.index("the")] - vec.idf_.min()) < 1e-9, "'the' must carry sklearn's SMALLEST idf — most common, most dampened."
_lines = [_l.strip() for _l in _stdout.splitlines() if _l.strip()]
assert len(_lines) >= 3, "Print three lines: the df of 'shadow', the idf of 'the', and names == vocab."
assert _lines[0] == "3", "First line must be 3 — 'shadow' haunts exactly three scrolls."
assert _lines[1] == "0.0", "Second line must be 0.0 — the textbook idf of a word found everywhere."
assert _lines[2] == "True", "Third line must be True — the two censuses agree on these polite scrolls."`,
        successText: 'The ledger reweighs itself: the loud words sink to nothing, and six quiet words rise — one per scroll, each naming what its scroll truly keeps.',
        xp: 100,
      },
      trace: [
        {
          id: 'a9l1t1',
          code: py`text = "the mask hides the mask and the crown"
words = text.split()
print(len(words))
print(words.count("the"))
print(len(set(words)))`,
          q: 'The scrying: a message is split on spaces. What does this working print — the token count, the count of "the", then the vocabulary size?',
          options: [
            '5\n3\n8',
            '8\n3\n5',
            '8\n2\n8',
            '8\n3\n8',
          ],
          answer: 1,
          explain: 'split() yields 8 tokens; "the" appears 3 times; set() keeps each distinct '
            + 'word once, so the vocabulary is 5. Term frequency counts occurrences (8, and 3 '
            + 'for "the"); the vocabulary is the DISTINCT words — the two opposing jaws of '
            + 'TF-IDF. The first option swaps the token count and vocabulary size; the third '
            + 'miscounts "the".',
        },
      ],
      extras: [
        {
          id: 'a9l1x1',
          kind: 'echo',
          title: 'The Rarest Word',
          prompt: 'Four masked scrolls this time. Weigh their words by the textbook rite and '
            + 'name the single word that carries the most — the rarest one.\n\n'
            + 'Requirements, exactly:\n\n'
            + '- Census: `vocab = sorted({w for t in scrolls for w in t.split()})`, '
            + '`word_to_idx = {w: i for i, w in enumerate(vocab)}`, `N = len(scrolls)`, '
            + '`V = len(vocab)`.\n'
            + '- Build `counts = np.zeros((N, V))` and add `1.0` at `counts[i, word_to_idx[w]]` '
            + 'for each word `w` of scroll `i`.\n'
            + '- `df = (counts > 0).sum(axis=0)`, `idf = np.log(N / df)`, and '
            + '`rarest = vocab[int(np.argmax(idf))]` — the word with the highest idf.\n'
            + '- Print `V`, then `round(float(idf[word_to_idx["the"]]), 3)`, then `rarest`, '
            + 'each on its own line.',
          starter: py`import numpy as np

# The four masks, conjured. Do not alter the scrolls.
scrolls = [
    "the mask hides the mask",
    "the crown hides the king",
    "the mask keeps the crown",
    "the king keeps the throne",
]

# TODO: vocab (sorted unique), word_to_idx, N, V

# TODO: counts, df = (counts > 0).sum(axis=0), idf = np.log(N / df)

# TODO: rarest = vocab[int(np.argmax(idf))]

# TODO: print V, then round(float(idf[word_to_idx["the"]]), 3), then rarest
`,
          solution: py`import numpy as np

scrolls = [
    "the mask hides the mask",
    "the crown hides the king",
    "the mask keeps the crown",
    "the king keeps the throne",
]

vocab = sorted({w for t in scrolls for w in t.split()})
word_to_idx = {w: i for i, w in enumerate(vocab)}
N = len(scrolls)
V = len(vocab)

counts = np.zeros((N, V))
for i, t in enumerate(scrolls):
    for w in t.split():
        counts[i, word_to_idx[w]] += 1.0

df = (counts > 0).sum(axis=0)
idf = np.log(N / df)
rarest = vocab[int(np.argmax(idf))]

print(V)
print(round(float(idf[word_to_idx["the"]]), 3))
print(rarest)`,
          validation: py`import numpy as np
_v = sorted({_w for _t in scrolls for _w in _t.split()})
assert vocab == _v, "vocab must be the sorted unique words of the four scrolls."
assert V == 7 and N == 4, "The census miscounts — 4 scrolls, 7 distinct words."
assert counts.shape == (4, 7), "counts must be (N, V) = (4, 7) — one row per scroll, one column per word."
assert abs(counts[0, word_to_idx["mask"]] - 2.0) < 1e-9, "counts must record raw occurrences — 'mask' appears twice in scroll 0."
assert abs(df[word_to_idx["the"]] - 4.0) < 1e-9, "df of 'the' must be 4 — it lives in every scroll. Count documents, not occurrences."
assert abs(idf[word_to_idx["the"]]) < 1e-9, "idf of 'the' must be exactly 0 — log(4/4) = 0. A word in every scroll weighs nothing."
assert abs(idf[word_to_idx["throne"]] - np.log(4.0)) < 1e-6, "idf of 'throne' must be log(4/1) = log(4) — it appears in one scroll only."
assert rarest == "throne", "rarest must be 'throne' — the single word in exactly one scroll, so the highest idf. Use np.argmax(idf)."
_lines = [_l.strip() for _l in _stdout.splitlines() if _l.strip()]
assert _lines[:3] == ["7", "0.0", "throne"], "Print three lines: V (7), the idf of 'the' (0.0), and the rarest word (throne)."`,
          successText: 'Seven words weighed, and the one that means the most is the one said only once: throne.',
          hints: [
            'The census is the same set-comprehension-then-enumerate you used in the lesson. counts is a double loop adding 1.0 at counts[i, word_to_idx[w]]; df counts DOCUMENTS, not occurrences: (counts > 0).sum(axis=0).',
            'idf = np.log(N / df). The rarest word is the one with the largest idf: vocab[int(np.argmax(idf))]. The three prints read 7, 0.0, and throne.',
          ],
          xp: 20,
        },
      ],
      quiz: [
        {
          q: 'A word appears in every one of `N` documents. What is its textbook idf, `log(N / df)`?',
          options: [
            '1 — it is averaged across documents',
            'log(N) — the maximum possible weight',
            'Undefined — division by zero',
            '0 — log(N/N) = log(1) = 0, so its tf-idf weight is annihilated everywhere',
          ],
          answer: 3,
          explain: 'df equals N, the ratio is 1, and log(1) = 0. However loud the word is in any '
            + 'single document, multiplying by zero silences it — that is the whole design: '
            + 'ubiquity is evidence of emptiness.',
        },
        {
          q: 'What is document frequency (df), precisely?',
          options: [
            'The number of documents that contain the word at least once',
            'The total number of times the word appears across all documents',
            'The number of times the word appears in the longest document',
            'The fraction of a document taken up by the word',
          ],
          answer: 0,
          explain: 'df counts *documents touched*, not occurrences. A word said ten times in one '
            + 'scroll has df = 1; a word said once in each of six scrolls has df = 6. Term '
            + 'frequency counts occurrences within a single document — the two are the opposing '
            + 'jaws of the vise.',
        },
        {
          q: 'Your hand-computed TF-IDF numbers differ from `TfidfVectorizer`\'s. What is the honest diagnosis?',
          options: [
            'sklearn is broken and should be reported',
            'TF-IDF is random and differs on every run',
            'Different formulas: sklearn smooths the idf as ln((1+N)/(1+df)) + 1 and L2-normalizes each row — the values differ, though the rare-beats-common ordering survives',
            'Floating-point error accumulates in numpy but not in sklearn',
          ],
          answer: 2,
          explain: 'TF-IDF is a family of formulas, not one law. sklearn\'s smoothing keeps any '
            + 'weight from hitting zero and its row normalization equalizes document lengths. '
            + 'Both are deterministic; they simply swore different oaths — read the formula '
            + 'before trusting the number.',
        },
        {
          q: 'Which word earns the highest tf-idf weight in a document?',
          options: [
            'The word with the highest count in the whole corpus',
            'A word used often in this document but present in few others',
            'A word present in every document, since consistency is signal',
            'The alphabetically first word, since the census is sorted',
          ],
          answer: 1,
          explain: 'tf-idf is the product of two judgments: heavy use *here* (high tf) times '
            + 'rarity *elsewhere* (high idf). Corpus-wide loudness is exactly what the idf term '
            + 'exists to punish.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a9l2 — The Mood of the Text
    // ------------------------------------------------------------------
    {
      id: 'a9l2',
      title: 'The Mood of the Text',
      concept: 'sentiment classification end-to-end: TfidfVectorizer features, LogisticRegression, train/test discipline, precision and recall on the minority mood — and why word order is invisible',
      xp: 40,
      narrative: 'Letters still arrive at the ruined citadel, addressed to no one. Some are '
        + 'grief pressed flat — ash, dust, the tolling of bells. A few, fewer every season, '
        + 'carry warmth: bread, laughter, a mended gate. The censors want a ward that sorts '
        + 'them — grim from fair — without a human reading a single line. You have every part '
        + 'already: TF-IDF to weigh the words, a linear tribunal to judge the weights, a sealed '
        + 'holdout to keep the judging honest. What you do not yet know is what such a ward '
        + 'cannot see. That lesson comes last, and it is the one to remember.',
      sections: [
        {
          heading: 'Mood as a label — and the discipline of the split',
          body: '**Sentiment classification** is ordinary supervised learning wearing a literary '
            + 'cloak: text in, mood out. The conjured archive below holds 26 scrolls — label '
            + '`0` for the grim, `1` for the fair — and the fair are a minority, 8 against 18, '
            + 'because despair is cheaper than hope.\n\n'
            + 'Two disciplines from your earlier campaigns apply with full force:\n\n'
            + '- **Split before anything.** `train_test_split(texts, moods, test_size=6, '
            + 'stratify=moods, random_state=0)` — `stratify` keeps the minority represented in '
            + 'the test rooms, `random_state` makes the draw repeatable.\n'
            + '- **Fit the vectorizer on training text ONLY.** `vec.fit_transform(train_texts)` '
            + 'learns the vocabulary; the test set gets `vec.transform(test_texts)` — the same '
            + 'census, no peeking. Fitting on the test set is leakage: the model would learn '
            + 'the shape of the very scrolls it will be judged on.',
          code: py`from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split

archive = [
    ("ash drifts cold through the hollow hall", 0),
    ("warm light spills golden through the door", 1),
    ("grief settles cold upon the dust", 0),
    ("the garden blooms sweet and golden before dawn", 1),
]   # (the real archive holds 26 -- this is the shape of it)

texts = [t for t, m in archive]
moods = [m for t, m in archive]
train_texts, test_texts, y_train, y_test = train_test_split(
    texts, moods, test_size=2, stratify=moods, random_state=0)
print(y_test)                              # [1, 0] -- stratify kept one of each mood

vec = TfidfVectorizer()
X_train = vec.fit_transform(train_texts)   # census learned HERE only
X_test = vec.transform(test_texts)         # same census applied, never refit
print(X_train.shape[1] == X_test.shape[1]) # True -- same columns, always`,
        },
        {
          heading: 'The tribunal — LogisticRegression on weighted words',
          body: 'In Act VIII you forged softmax regression from raw numpy. '
            + '`LogisticRegression` is that same species of linear judge, bought whole from the '
            + 'armory, with two knobs worth naming:\n\n'
            + '- `C` — the **inverse** regularization strength: the leash. Small `C`, tight '
            + 'leash, timid weights. On a tiny corpus the default leash is too tight for the '
            + 'few signal words to speak, so we loosen it to `C=10.0`.\n'
            + '- `class_weight="balanced"` — charges mistakes on the minority mood more, in '
            + 'proportion to its rarity, so the tribunal cannot buy accuracy by waving every '
            + 'scroll through as grim.\n\n'
            + 'And when the classes are lopsided, remember Act VII\'s doctrine: **accuracy '
            + 'flatters**. A lazy ward that stamps every scroll *grim* scores 4/6 on a test set '
            + 'with four grim scrolls — 67% accurate, catching zero fair letters. Judge the '
            + 'minority with its own two numbers:\n\n'
            + '- **Precision** (`precision_score(y_test, pred, pos_label=1)`) — of the scrolls '
            + 'the ward called fair, how many truly were?\n'
            + '- **Recall** (`recall_score(y_test, pred, pos_label=1)`) — of the truly fair '
            + 'scrolls, how many did the ward find?',
          code: py`from sklearn.metrics import precision_score, recall_score

# A sealed test set: four grim scrolls, two fair -- and two rival wards.
y_test = [0, 0, 0, 0, 1, 1]
lazy = [0, 0, 0, 0, 0, 0]      # stamps everything grim
sharp = [0, 0, 0, 1, 1, 1]     # tries, and once mistakes grim for fair

print(round(sum(a == b for a, b in zip(y_test, lazy)) / 6, 3))   # 0.667 -- accuracy flatters the lazy ward
print(recall_score(y_test, lazy, pos_label=1))                   # 0.0   -- it found zero fair letters

print(round(precision_score(y_test, sharp, pos_label=1), 3))     # 0.667 -- 2 of its 3 "fair" calls were true
print(recall_score(y_test, sharp, pos_label=1))                  # 1.0   -- it found both fair letters`,
          note: 'The lazy always-grim ward would score precision undefined (it never says fair) '
            + 'and recall 0.0. Any time a class is rare — fair letters, true alarms, poisoned '
            + 'wells — accuracy is the number the Shadow would prefer you watch.',
        },
        {
          heading: 'What the bag cannot see',
          body: 'Here is the ward\'s blindness, and no tuning cures it: TF-IDF vectors '
            + '**discard word order**. The encoder counts which words appear; it cannot know '
            + 'what they did to each other.\n\n'
            + '- `"the garden blooms before dawn"` and `"dawn blooms before the garden"` '
            + 'produce **identical** vectors — identical verdicts, always.\n'
            + '- **Negation** inverts meaning while keeping every hopeful word: *"no hope, no '
            + 'laughter, nothing kind remains"* is dense with `hope`, `laughter`, `kind` — the '
            + 'ward reads it as fair.\n'
            + '- **Sarcasm** is the classic assassin: *"what a sweet and golden triumph you '
            + 'have made of our home"* — every surface word bright, the meaning ash. The ward '
            + 'files it with the wedding invitations.\n\n'
            + 'These are not bugs in your code; they are the cost of the representation. Models '
            + 'that read *order* — the n-gram portraits and attention rites waiting later in '
            + 'this act — exist precisely to pay it.',
          code: py`import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

vec = TfidfVectorizer()
vec.fit(["the garden blooms before dawn", "cold ash takes the garden"])

a = vec.transform(["the garden blooms before dawn"]).toarray()
b = vec.transform(["dawn blooms before the garden"]).toarray()
print(bool(np.allclose(a, b)))   # True -- order gone; any verdict downstream is identical

# Trained on the full 26-scroll archive, the ward reads
#   "what a sweet and golden triumph you have made of our home"
# and answers: fair, with probability ~0.85. Every human censor
# hears the ash in that sentence. The bag hears sugar.`,
        },
      ],
      challenge: {
        title: 'The Reading of Moods',
        prompt: 'The censors\' archive is conjured below: 26 scrolls, 18 grim (`0`), 8 fair '
          + '(`1`). Build the mood-ward end to end and judge it on the minority.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Unpack: `texts = [t for t, m in archive]` and `moods = [m for t, m in archive]`.\n'
          + '- Split: `train_texts, test_texts, y_train, y_test = train_test_split(texts, '
          + 'moods, test_size=6, stratify=moods, random_state=0)`.\n'
          + '- Vectorize with the discipline: `vec = TfidfVectorizer()`, '
          + '`X_train = vec.fit_transform(train_texts)`, `X_test = vec.transform(test_texts)`.\n'
          + '- Judge: `clf = LogisticRegression(C=10.0, class_weight="balanced", '
          + 'random_state=0)`, fit on the training rows, then `pred = clf.predict(X_test)`.\n'
          + '- Score the minority mood: `p = precision_score(y_test, pred, pos_label=1)` and '
          + '`r = recall_score(y_test, pred, pos_label=1)`.\n'
          + '- Print three lines: `round(p, 3)`, then `round(r, 3)`, then '
          + '`int(clf.predict(vec.transform(["cold ash and sorrow in the hollow tomb"]))[0])` '
          + '— the ward\'s verdict on a fresh grim scroll.',
        starter: py`from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score, recall_score

# The censors' archive, conjured. Do not alter the scrolls.
# mood 0 = grim, 1 = fair (the minority)
archive = [
    ("ash drifts cold through the hollow hall", 0),
    ("grief settles cold upon the dust", 0),
    ("the tomb door groans with hollow dread", 0),
    ("sorrow and dust choke the cold archive", 0),
    ("cold rot climbs the hollow wall", 0),
    ("the bell tolls grief and sorrow and dread", 0),
    ("dread waits cold upon the withered stair", 0),
    ("the orchard withers black with rot and ash", 0),
    ("dust and ash seal the hollow tomb", 0),
    ("the banners wither in dread and sorrow", 0),
    ("cold grief and dust take the gate", 0),
    ("ash and sorrow drown the withered hearth", 0),
    ("the well gives back grief and rot", 0),
    ("dread and dust wither the cold maps", 0),
    ("the hollow tower keeps its cold sorrow", 0),
    ("tomb dust settles on the withered wreath", 0),
    ("rot and grief hollow out the granary", 0),
    ("the ferry carries ash and dread downriver", 0),
    ("warm light spills golden through the door", 1),
    ("laughter mends the quiet hall with warm light", 1),
    ("the garden blooms sweet and golden before dawn", 1),
    ("kind hands mend the gate with laughter and hope", 1),
    ("golden dawn warms the eastern tower with light", 1),
    ("sweet bread and warm hope at the hearth", 1),
    ("hope blooms golden in the walled garden at dawn", 1),
    ("the choir sings kind and sweet with laughter", 1),
]

# TODO: texts and moods, unpacked from the archive

# TODO: train/test split -- test_size=6, stratify=moods, random_state=0

# TODO: vec fit on TRAIN only; X_train, X_test

# TODO: clf = LogisticRegression(C=10.0, class_weight="balanced", random_state=0);
#       fit, then pred on X_test

# TODO: p and r -- precision and recall on the minority (pos_label=1)

# TODO: print round(p, 3), round(r, 3), and the verdict on
#       "cold ash and sorrow in the hollow tomb" -- three lines
`,
        solution: py`from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score, recall_score

archive = [
    ("ash drifts cold through the hollow hall", 0),
    ("grief settles cold upon the dust", 0),
    ("the tomb door groans with hollow dread", 0),
    ("sorrow and dust choke the cold archive", 0),
    ("cold rot climbs the hollow wall", 0),
    ("the bell tolls grief and sorrow and dread", 0),
    ("dread waits cold upon the withered stair", 0),
    ("the orchard withers black with rot and ash", 0),
    ("dust and ash seal the hollow tomb", 0),
    ("the banners wither in dread and sorrow", 0),
    ("cold grief and dust take the gate", 0),
    ("ash and sorrow drown the withered hearth", 0),
    ("the well gives back grief and rot", 0),
    ("dread and dust wither the cold maps", 0),
    ("the hollow tower keeps its cold sorrow", 0),
    ("tomb dust settles on the withered wreath", 0),
    ("rot and grief hollow out the granary", 0),
    ("the ferry carries ash and dread downriver", 0),
    ("warm light spills golden through the door", 1),
    ("laughter mends the quiet hall with warm light", 1),
    ("the garden blooms sweet and golden before dawn", 1),
    ("kind hands mend the gate with laughter and hope", 1),
    ("golden dawn warms the eastern tower with light", 1),
    ("sweet bread and warm hope at the hearth", 1),
    ("hope blooms golden in the walled garden at dawn", 1),
    ("the choir sings kind and sweet with laughter", 1),
]

texts = [t for t, m in archive]
moods = [m for t, m in archive]

train_texts, test_texts, y_train, y_test = train_test_split(
    texts, moods, test_size=6, stratify=moods, random_state=0)

vec = TfidfVectorizer()
X_train = vec.fit_transform(train_texts)
X_test = vec.transform(test_texts)

clf = LogisticRegression(C=10.0, class_weight="balanced", random_state=0)
clf.fit(X_train, y_train)
pred = clf.predict(X_test)

p = precision_score(y_test, pred, pos_label=1)
r = recall_score(y_test, pred, pos_label=1)

print(round(p, 3))
print(round(r, 3))
print(int(clf.predict(vec.transform(["cold ash and sorrow in the hollow tomb"]))[0]))`,
        hints: [
          'Unpack with two list comprehensions over (text, mood) pairs. The split call is exactly the one in the prompt — four names on the left, in that order.',
          'The leakage trap: fit_transform belongs to train_texts alone; test_texts get vec.transform. If your X_test has a different column count than X_train, you fit a second census on the test scrolls.',
          'After clf.fit(X_train, y_train) and pred = clf.predict(X_test), the scores are precision_score(y_test, pred, pos_label=1) and recall_score(y_test, pred, pos_label=1) — both come out 1.0 here. The fresh-scroll verdict prints 0.',
        ],
        validation: py`import numpy as np
from sklearn.model_selection import train_test_split as _tts
assert len(archive) == 26 and [m for _t, m in archive].count(1) == 8, "The archive was altered — 26 scrolls, 8 of them fair, as conjured."
assert archive[0] == ("ash drifts cold through the hollow hall", 0) and archive[18] == ("warm light spills golden through the door", 1), "The archive was altered — restore the conjured scrolls exactly."
assert texts[2] == "the tomb door groans with hollow dread" and moods[:3] == [0, 0, 0], "texts and moods must unpack the archive in order — texts[i] and moods[i] from the same scroll."
_trt, _tet, _ytr, _yte = _tts(texts, moods, test_size=6, stratify=moods, random_state=0)
assert list(train_texts) == _trt and list(test_texts) == _tet, "The split does not match test_size=6, stratify=moods, random_state=0 — the sealed six must be drawn exactly as commanded."
assert list(y_test) == _yte, "y_test must be the moods of the sealed six, from the same split call."
assert X_train.shape[0] == 20 and X_test.shape[0] == 6, "X_train must hold 20 scrolls and X_test 6."
assert X_train.shape[1] == X_test.shape[1], "X_test has different columns than X_train — the vectorizer must be FIT on training text only, then transform (never fit_transform) the test text."
_Xt = vec.transform(test_texts)
_a = X_test.toarray() if hasattr(X_test, "toarray") else np.asarray(X_test)
assert np.allclose(_a, _Xt.toarray(), atol=1e-9), "X_test must be vec.transform(test_texts) with the SAME fitted vectorizer."
assert abs(clf.C - 10.0) < 1e-9 and clf.class_weight == "balanced", "The tribunal must be LogisticRegression(C=10.0, class_weight='balanced', random_state=0) — the loosened leash and the balanced charge both matter on a tiny archive."
assert list(pred) == _yte, "The tribunal misjudged a sealed scroll — pred must match y_test on all six. Recheck the split, the leakage discipline, and the fit."
assert abs(p - 1.0) < 1e-9 and abs(r - 1.0) < 1e-9, "Precision and recall on the minority mood must both be 1.0 here — score with pos_label=1 against y_test."
_g = int(clf.predict(vec.transform(["cold dread and dust seal the tomb"]))[0])
_f = int(clf.predict(vec.transform(["warm golden laughter and sweet hope at dawn"]))[0])
assert _g == 0, "A fresh scroll of cold dread and dust must be judged grim (0) — the ward has not learned the lexicon."
assert _f == 1, "A fresh scroll of warm golden laughter must be judged fair (1) — the ward has not learned the minority's voice."
_lines = [_l.strip() for _l in _stdout.splitlines() if _l.strip()]
assert len(_lines) >= 3, "Print three lines: precision, recall, and the fresh-scroll verdict."
assert _lines[0] == "1.0" and _lines[1] == "1.0", "The first two lines must be 1.0 and 1.0 — precision and recall on the minority mood."
assert _lines[2] == "0", "The third line must be 0 — cold ash and sorrow is a grim scroll."`,
        successText: 'The ward reads all night without tiring, and the sealed six do not fool it. Somewhere in the pile, a sarcastic letter waits patiently for its revenge.',
        xp: 100,
      },
      quiz: [
        {
          q: 'Why must `TfidfVectorizer` be fit on the training texts only?',
          options: [
            'Fitting on all texts would be too slow',
            'Fitting on test text leaks knowledge of the evaluation scrolls into the features — the census itself becomes contaminated evidence',
            'The test set uses a different alphabet',
            'sklearn raises an error if you fit twice',
          ],
          answer: 1,
          explain: 'The vocabulary and idf weights are learned parameters, and learned '
            + 'parameters must come from training data alone. Test scrolls get transform() with '
            + 'the frozen census — anything else quietly grades the model on questions it '
            + 'helped write.',
        },
        {
          q: 'A ward stamps every scroll grim. On a test set of 4 grim and 2 fair scrolls, what does it score?',
          options: [
            'Accuracy 0.667, but recall 0.0 on the fair mood — it found none of them',
            'Accuracy 0.667 and recall 1.0 — it never missed a grim scroll',
            'Accuracy 1.0 — most scrolls really are grim',
            'Precision 1.0 on the fair mood, since it made no fair mistakes',
          ],
          answer: 0,
          explain: 'Four of six calls are right, so accuracy flatters at 67% — while every fair '
            + 'letter is lost. Recall on the minority is 0/2 = 0.0, and precision on it is '
            + 'undefined (no fair verdicts at all). Under imbalance, judge the minority with '
            + 'its own numbers.',
        },
        {
          q: 'Why does the bag-of-words ward misread *"what a sweet and golden triumph you have made of our home"*?',
          options: [
            'The scroll is too short to vectorize',
            'The word "triumph" was missing from the training census',
            'TF-IDF weights sarcastic words at zero',
            'The vector records only which words appear — sweet and golden read bright, and the bitter arrangement of them is invisible',
          ],
          answer: 3,
          explain: 'Sarcasm lives in word order, tone, and expectation — everything the bag '
            + 'discards. The surface vocabulary is genuinely bright, so any order-blind model '
            + 'files it as fair. This is a cost of the representation, not a bug in the '
            + 'training.',
        },
        {
          q: 'What does `class_weight="balanced"` change in `LogisticRegression`?',
          options: [
            'It equalizes the number of scrolls in each class by deleting the extras',
            'It normalizes each feature column to length 1',
            'It charges errors on rare classes more heavily, in inverse proportion to class frequency, so the fit cannot buy accuracy by siding with the majority',
            'It guarantees precision and recall come out equal',
          ],
          answer: 2,
          explain: 'The loss reweights each class by n_samples / (n_classes * count). Mistakes '
            + 'on the 8 fair scrolls cost more than mistakes on the 18 grim, so the boundary is '
            + 'pushed to take the minority seriously instead of waving everything through as '
            + 'grim.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a9l3 — Echoes in the Gallery
    // ------------------------------------------------------------------
    {
      id: 'a9l3',
      title: 'Echoes in the Gallery',
      concept: 'word embeddings: dense vectors from a co-occurrence matrix, cosine similarity by hand and via sklearn, nearest-neighbor lookup, PCA compression, and the analogy trick with its limits',
      xp: 40,
      narrative: 'In the long gallery, the portraits have begun to finish each other\'s '
        + 'sentences. Say *wolf* before the huntsman\'s frame and three paintings down, the '
        + 'kennel-master\'s hound lifts its head — as if the two words hung near each other in '
        + 'some invisible room. They do. Every talking thing carries such a room inside it: a '
        + 'space where each word is a point, and kinship is distance. The portraits did not '
        + 'vote on where the words hang. The words placed themselves, by the oldest law of '
        + 'language: **you shall know a word by the company it keeps.**',
      sections: [
        {
          heading: 'Dense vectors — what an embedding is',
          body: 'Every representation so far has been **sparse**: one slot per word, almost '
            + 'all zeros. Sparse vectors have a fatal social flaw — every pair of different '
            + 'words is equally unrelated. The one-hot rows for `wolf` and `hound` are '
            + 'perpendicular, exactly as perpendicular as `wolf` and `teaspoon`.\n\n'
            + 'An **embedding** replaces the slot with a *position*: each word becomes a dense '
            + 'vector — a point in a shared space — arranged so that words used alike sit near '
            + 'each other. Where do the positions come from? From evidence. The '
            + '**distributional hypothesis** says words that appear in the same company have '
            + 'related meanings: `wolf` and `hound` both howl, hunt, and circle camps, so any '
            + 'honest accounting places them close.\n\n'
            + 'The crudest honest accounting is the **co-occurrence matrix**: one row per '
            + 'word, counting how often every other word appears within a small window of it.',
          code: py`import numpy as np

wolf_hot = np.zeros(20); wolf_hot[18] = 1.0
hound_hot = np.zeros(20); hound_hot[9] = 1.0
print(float(wolf_hot @ hound_hot))   # 0.0 -- one-hot kin are perfect strangers

# Dense embeddings instead (invented 3-number positions):
wolf = np.array([2.1, -0.3, 1.8])
hound = np.array([1.9, -0.1, 1.7])    # nearby: same company, same corner of the room
candle = np.array([-1.5, 2.2, 0.1])   # far away: different company entirely`,
        },
        {
          heading: 'The company ledger — a co-occurrence matrix',
          body: 'Conjure a small gallery-corpus and count company within a window of two '
            + 'words to either side:\n\n'
            + '- For word `i` in a sentence, its **neighbors** are positions `j != i` with '
            + '`max(0, i-2) <= j < min(len(words), i+3)`.\n'
            + '- `C[word_to_idx[w], word_to_idx[neighbor]] += 1.0` for every such pair.\n\n'
            + 'Row `w` of `C` is a crude embedding of `w`: a fingerprint of its company. `wolf` '
            + 'and `hound` never share a sentence below — yet their rows come out nearly '
            + 'identical, because they keep identical company. That is the distributional '
            + 'hypothesis at quiet work.',
          code: py`import numpy as np

gallery = [
    "the wolf howls in the night",
    "the hound howls in the night",
    "the wolf hunts beneath the moon",
    "the hound hunts beneath the moon",
    "the candle burns in the tower",
    "the lantern burns in the tower",
    "the candle gutters against the dark",
    "the lantern gutters against the dark",
    "the wolf circles the cold camp",
    "the hound guards the cold camp",
]
vocab = sorted({w for s in gallery for w in s.split()})
word_to_idx = {w: i for i, w in enumerate(vocab)}
V = len(vocab)

C = np.zeros((V, V))
for s in gallery:
    words = s.split()
    for i, w in enumerate(words):
        for j in range(max(0, i - 2), min(len(words), i + 3)):
            if j != i:
                C[word_to_idx[w], word_to_idx[words[j]]] += 1.0

print(V, C.shape)                                    # 20 (20, 20)
print(C[word_to_idx["wolf"], word_to_idx["howls"]])  # 1.0 -- wolf keeps company with howls`,
        },
        {
          heading: 'Cosine — the angle of kinship',
          body: 'To measure kinship between two rows, plain distance misleads: a frequent word '
            + 'has a long row, a rare synonym a short one, and Euclidean distance punishes the '
            + '*loudness* difference. What matters is the difference in **direction** — the '
            + 'mixture of company, not the amount.\n\n'
            + '- **Cosine similarity**: `cos(u, v) = (u . v) / (|u| * |v|)` — the dot product, '
            + 'divided by both lengths. In code: `np.dot(u, v) / (np.linalg.norm(u) * '
            + 'np.linalg.norm(v))`.\n'
            + '- It ranges from 1 (same direction — kin) through 0 (perpendicular — strangers) '
            + 'to -1 (opposed). Doubling a vector\'s length changes nothing: `cos(u, 2u) = 1`.\n'
            + '- sklearn\'s `cosine_similarity(C)` computes the whole kinship table at once.\n\n'
            + 'With cosine in hand, **nearest neighbor** is a lookup: compare a word\'s row '
            + 'against every other, keep the best. This is how the talking things find "the '
            + 'word most like yours."',
          code: py`import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

u = np.array([2.0, 0.0, 1.0])
v = np.array([4.0, 0.0, 2.0])      # same direction, twice the loudness
w = np.array([0.0, 3.0, 0.0])      # perpendicular company
def cosine(a, b):
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
print(round(cosine(u, v), 3))      # 1.0 -- loudness forgiven
print(round(cosine(u, w), 3))      # 0.0 -- strangers

S = cosine_similarity(np.vstack([u, v, w]))
print(S.shape, round(float(S[0, 1]), 3))   # (3, 3) 1.0 -- the same arithmetic, tabled`,
        },
        {
          heading: 'Compression, and the analogy trick',
          body: 'A co-occurrence row is still V numbers wide — sparse company dressed as a '
            + 'vector. Real embeddings are *compressed*: a few hundred dense dimensions '
            + 'distilled from billions of co-occurrences. You already hold the distilling '
            + 'tool: **PCA**. `PCA(n_components=2, random_state=0).fit_transform(C)` presses '
            + 'each word\'s company into 2 coordinates that preserve as much variation as '
            + 'possible — a map of the invisible room. (On our toy gallery it flattens '
            + '`wolf` and `hound` onto almost one point: company this identical leaves the '
            + 'second dimension nothing to say.)\n\n'
            + 'Famously, embedding spaces half-support **analogies by arithmetic**: '
            + '`wolf - hound + lantern` has nearest neighbor `candle` — the space answers '
            + '*wolf is to hound as candle is to lantern*. Be honest about the limits:\n\n'
            + '- In our toy room it works because the pairs are near-twins; the subtraction '
            + 'barely moves the point.\n'
            + '- In real embeddings, relation-directions (gender, tense, capital-of) exist '
            + '*partially*: the celebrated examples work, many fail, and the failures are '
            + 'silent.\n'
            + '- Embeddings also inherit every prejudice of the text that trained them — the '
            + 'company words keep includes the company we wish they did not.',
          code: py`import numpy as np
from sklearn.decomposition import PCA
# ...with C, vocab, word_to_idx, cosine from the ledger above...
# E = PCA(n_components=2, random_state=0).fit_transform(C)   # (20, 2): a drawable map

# The analogy rite, on raw rows -- wolf - hound + lantern lands near:
# target = C[word_to_idx["wolf"]] - C[word_to_idx["hound"]] + C[word_to_idx["lantern"]]
# best match (excluding wolf and lantern themselves): candle, cosine ~0.894`,
        },
      ],
      challenge: {
        title: 'The Kinship of Echoes',
        prompt: 'The gallery-corpus is conjured below. Build the room where its words hang, '
          + 'and prove the portraits\' trick.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Census: `vocab = sorted({w for s in gallery for w in s.split()})`, '
          + '`word_to_idx = {w: i for i, w in enumerate(vocab)}`, `V = len(vocab)`.\n'
          + '- Co-occurrence: `C = np.zeros((V, V))`; for each sentence\'s word list, for '
          + 'each position `i`, add `1.0` to `C[word_to_idx[words[i]], word_to_idx[words[j]]]` '
          + 'for every `j` from `max(0, i - 2)` to `min(len(words), i + 3)` (exclusive) with '
          + '`j != i`.\n'
          + '- Define `cosine(u, v)` returning `float(np.dot(u, v) / (np.linalg.norm(u) * '
          + 'np.linalg.norm(v)))`.\n'
          + '- Define `nearest(word)` — compare `C[word_to_idx[word]]` against every OTHER '
          + 'word\'s row by cosine and return the single most similar word (a string).\n'
          + '- Compress: `E = PCA(n_components=2, random_state=0).fit_transform(C)`.\n'
          + '- Print four lines: `nearest("wolf")`, `nearest("lantern")`, '
          + '`round(cosine(C[word_to_idx["wolf"]], C[word_to_idx["hound"]]), 3)`, and '
          + '`E.shape`.',
        starter: py`import numpy as np
from sklearn.decomposition import PCA

# The gallery-corpus, conjured. Do not alter the sentences.
gallery = [
    "the wolf howls in the night",
    "the hound howls in the night",
    "the wolf hunts beneath the moon",
    "the hound hunts beneath the moon",
    "the candle burns in the tower",
    "the lantern burns in the tower",
    "the candle gutters against the dark",
    "the lantern gutters against the dark",
    "the wolf circles the cold camp",
    "the hound guards the cold camp",
]

# TODO: vocab, word_to_idx, V

# TODO: C -- (V, V) zeros; window of 2 to either side; j != i

# TODO: def cosine(u, v) -- dot over the product of norms, as a float

# TODO: def nearest(word) -- best cosine among all OTHER words

# TODO: E -- PCA(n_components=2, random_state=0).fit_transform(C)

# TODO: print nearest("wolf"), nearest("lantern"),
#       round(cosine(C[wolf row], C[hound row]), 3), and E.shape
`,
        solution: py`import numpy as np
from sklearn.decomposition import PCA

gallery = [
    "the wolf howls in the night",
    "the hound howls in the night",
    "the wolf hunts beneath the moon",
    "the hound hunts beneath the moon",
    "the candle burns in the tower",
    "the lantern burns in the tower",
    "the candle gutters against the dark",
    "the lantern gutters against the dark",
    "the wolf circles the cold camp",
    "the hound guards the cold camp",
]

vocab = sorted({w for s in gallery for w in s.split()})
word_to_idx = {w: i for i, w in enumerate(vocab)}
V = len(vocab)

C = np.zeros((V, V))
for s in gallery:
    words = s.split()
    for i, w in enumerate(words):
        for j in range(max(0, i - 2), min(len(words), i + 3)):
            if j != i:
                C[word_to_idx[w], word_to_idx[words[j]]] += 1.0

def cosine(u: np.ndarray, v: np.ndarray) -> float:
    return float(np.dot(u, v) / (np.linalg.norm(u) * np.linalg.norm(v)))

def nearest(word: str) -> str:
    u = C[word_to_idx[word]]
    best, best_sim = None, -2.0
    for other in vocab:
        if other == word:
            continue
        sim = cosine(u, C[word_to_idx[other]])
        if sim > best_sim:
            best, best_sim = other, sim
    return best

E = PCA(n_components=2, random_state=0).fit_transform(C)

print(nearest("wolf"))
print(nearest("lantern"))
print(round(cosine(C[word_to_idx["wolf"]], C[word_to_idx["hound"]]), 3))
print(E.shape)`,
        hints: [
          'The window loop is three nested layers: sentences, positions i, and neighbor positions j in range(max(0, i - 2), min(len(words), i + 3)) — skipping j == i. Each pair adds 1.0.',
          'nearest(word) walks vocab, skips the word itself, computes cosine against C[word_to_idx[other]], and keeps the best. Start best_sim at -2.0 so any real similarity beats it.',
          'The four prints come out: hound, candle, 0.952, and (20, 2). If nearest("wolf") returns "the", your window loop is counting a word as its own neighbor — check j != i.',
        ],
        validation: py`import numpy as np
_v = sorted({_w for _s in gallery for _w in _s.split()})
assert vocab == _v and V == 20, "The census is wrong — 20 distinct words, sorted."
_C = np.zeros((20, 20))
for _s in gallery:
    _ws = _s.split()
    for _i, _w in enumerate(_ws):
        for _j in range(max(0, _i - 2), min(len(_ws), _i + 3)):
            if _j != _i:
                _C[word_to_idx[_w], word_to_idx[_ws[_j]]] += 1.0
assert C.shape == (20, 20), "C must be a (20, 20) matrix — one row and one column per vocabulary word."
assert np.allclose(C, _C), "The company ledger miscounts — window of exactly 2 to either side, clipped at the sentence edges, never counting a word as its own neighbor."
assert abs(cosine(np.array([1.0, 0.0]), np.array([1.0, 0.0])) - 1.0) < 1e-9, "cosine of a vector with itself must be 1."
assert abs(cosine(np.array([1.0, 0.0]), np.array([0.0, 1.0]))) < 1e-9, "cosine of perpendicular vectors must be 0."
assert abs(cosine(np.array([1.0, 2.0]), np.array([3.0, 6.0])) - 1.0) < 1e-9, "cosine must forgive loudness — a vector and its triple point the same way, similarity 1."
assert nearest("wolf") == "hound", "nearest('wolf') must be 'hound' — identical company, nearly identical rows. If you got 'the', check j != i; if an error, check that you skip the word itself."
assert nearest("candle") == "lantern" and nearest("lantern") == "candle", "candle and lantern must be each other's nearest — they keep the same company in every sentence."
_iw, _ih, _ic = word_to_idx["wolf"], word_to_idx["hound"], word_to_idx["candle"]
assert cosine(C[_iw], C[_ih]) > cosine(C[_iw], C[_ic]) + 0.1, "wolf must sit clearly closer to hound than to candle — the beasts share company the lights do not."
assert E.shape == (20, 2), "E must press all 20 words into 2 PCA coordinates — shape (20, 2)."
assert np.linalg.norm(E[_iw] - E[_ih]) < 0.5, "In the PCA map, wolf and hound must land almost on top of each other — company this identical leaves the map no reason to separate them."
assert np.linalg.norm(E[_iw] - E[_ic]) > 1.5, "In the PCA map, wolf and candle must stand far apart — different company, different corners of the room."
_lines = [_l.strip() for _l in _stdout.splitlines() if _l.strip()]
assert len(_lines) >= 4, "Print four lines: nearest('wolf'), nearest('lantern'), the wolf-hound cosine, and E.shape."
assert _lines[0] == "hound", "First line must be hound — the wolf's nearest echo."
assert _lines[1] == "candle", "Second line must be candle — the lantern's twin."
assert _lines[2] == "0.952", "Third line must be 0.952 — round(cosine(wolf row, hound row), 3)."
assert _lines[3] == "(20, 2)", "Fourth line must be (20, 2) — the shape of the compressed map."`,
        successText: 'The map unrolls: beasts in one corner, lights in another, and the small words crowding the middle like servants at a funeral. No one placed them. The company did.',
        xp: 105,
      },
      trace: [
        {
          id: 'a9l3t1',
          code: py`room = {"wolf": 3, "hound": 3, "candle": 8}
print(room["wolf"])
print(room["lantern"])`,
          q: 'The scrying: a word-to-position dict is looked up twice. What becomes of this working?',
          options: [
            'It prints 3, then None — a missing key defaults to None',
            'It prints 3, then 0 — a missing key defaults to 0',
            'It prints 3, then dies of a KeyError — "lantern" was never placed in the room',
            'Nothing — Python refuses the program before any line runs',
          ],
          answer: 2,
          raises: 'KeyError',
          explain: 'Square-bracket lookup on a dict demands the key exist: room["wolf"] prints '
            + '3, then room["lantern"] raises KeyError because "lantern" has no entry. Dicts do '
            + 'NOT default missing keys — that is `.get(key, default)`. This is exactly why the '
            + 'bag-of-words encoder guards every lookup with "if word in word_to_idx".',
        },
      ],
      quiz: [
        {
          q: 'What is the fatal flaw of one-hot vectors that embeddings exist to fix?',
          options: [
            'They cannot represent words longer than the vector',
            'Every pair of different words is equally unrelated — wolf is exactly as far from hound as from teaspoon',
            'They take too long to compute',
            'They only work for lowercase text',
          ],
          answer: 1,
          explain: 'One-hot rows are mutually perpendicular: every dot product between '
            + 'different words is 0. No notion of kinship can survive that geometry. Embeddings '
            + 'place words as points so that distance can carry meaning.',
        },
        {
          q: 'Why does cosine similarity suit word vectors better than Euclidean distance?',
          options: [
            'It is faster to compute than subtraction',
            'It always returns a positive number',
            'Euclidean distance only works in two dimensions',
            'It compares direction and forgives length — a frequent word and its rare synonym keep the same mixture of company at different loudness',
          ],
          answer: 3,
          explain: 'A common word\'s co-occurrence row is a long vector, a rare synonym\'s a '
            + 'short one — Euclidean distance calls them far apart for that reason alone. '
            + 'Cosine measures the angle: same company mixture, same direction, high kinship, '
            + 'however loud.',
        },
        {
          q: 'The distributional hypothesis, in one sentence, is:',
          options: [
            'Words that appear in similar contexts have related meanings — know a word by the company it keeps',
            'Longer documents are distributed across more topics',
            'Every corpus follows a normal distribution',
            'Rare words carry no usable signal',
          ],
          answer: 0,
          explain: 'It is the load-bearing assumption under every embedding: meaning leaves a '
            + 'statistical fingerprint in surrounding words. Count the company (co-occurrence), '
            + 'compress it (PCA, or learned embeddings), and kinship becomes geometry.',
        },
        {
          q: 'The analogy trick `wolf - hound + lantern → candle` worked in our toy space. What is the honest caveat?',
          options: [
            'Analogies require at least one million sentences',
            'The subtraction only works for animal words',
            'Relation-directions in embedding spaces are partial: celebrated examples work, many fail silently — and toy spaces cheat because the pairs are near-twins',
            'It proves embeddings understand meaning the way minds do',
          ],
          answer: 2,
          explain: 'In our gallery, wolf minus hound is nearly the zero vector, so the '
            + '"analogy" barely moves lantern — the trick is rigged. Real spaces do encode some '
            + 'relations as rough directions, but the failures are silent and the successes '
            + 'were chosen for the demonstration.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a9l4 — The Portrait That Completes Your Sentence
    // ------------------------------------------------------------------
    {
      id: 'a9l4',
      title: 'The Portrait That Completes Your Sentence',
      concept: 'language models from counts: a bigram next-word model with dicts and Counter, greedy vs temperature sampling, trigram context, and hallucination as confident interpolation',
      xp: 40,
      narrative: 'The portrait at the end of the north corridor does not know anything. It has '
        + 'simply *heard* — centuries of footsteps and gossip — and when you speak near it, it '
        + 'answers with whatever word most often followed yours in everything it ever heard. '
        + 'Visitors swear it understands them. It has never understood anyone. Tonight you will '
        + 'build the portrait\'s whole mind in twenty lines: a ledger of which word follows '
        + 'which, and a dial that trades caution for daring. Study what it gets right. Study '
        + 'harder what it gets *confidently wrong* — because the great echoes waking in the '
        + 'world beyond this corridor fail in exactly the same shape.',
      sections: [
        {
          heading: 'The ledger of following words',
          body: 'A **language model** assigns probabilities to what comes next. The simplest '
            + 'one is pure counting:\n\n'
            + '- A **bigram** is an adjacent word pair. Walk the corpus; for every pair, '
            + 'record *after word A, word B occurred once more*.\n'
            + '- The natural container is `defaultdict(Counter)`: `model[a][b] += 1`. '
            + '`zip(words, words[1:])` yields each sentence\'s adjacent pairs.\n\n'
            + 'That table IS the model. "Training" was counting; "knowledge" is frequency. '
            + 'Given a word, the counter under it says what tended to follow, and how often — '
            + 'a probability distribution one normalization away.',
          code: py`from collections import Counter, defaultdict

corpus = [
    "the door opens onto the stair",
    "the stair descends into the dark",
    "the dark keeps what the house forgets",
    "the house forgets no one",
    "the door opens onto the hall",
    "the hall remembers every name",
    "the door opens and the house listens",
    "the door opens before you knock",
]

model = defaultdict(Counter)
for sentence in corpus:
    words = sentence.split()
    for a, b in zip(words, words[1:]):
        model[a][b] += 1

print(dict(model["the"]))
# {'door': 4, 'stair': 2, 'dark': 2, 'house': 3, 'hall': 2}
print(dict(model["door"]))   # {'opens': 4} -- after "door", the corpus knows one word only`,
        },
        {
          heading: 'Greedy speech — and the stammer',
          body: 'To make the portrait talk, pick a start word and repeatedly choose a '
            + 'following word. The obvious rule is **greedy**: always take the highest count '
            + '(break ties toward the alphabetically first, so the rite is reproducible — '
            + '`min(counter.items(), key=lambda kv: (-kv[1], kv[0]))` does both at once).\n\n'
            + 'Run it and meet the oldest failure in generation:\n\n'
            + '- `the → door → opens → onto → the → door → opens → onto ...`\n\n'
            + 'The greedy portrait **stammers in circles**, because the most probable next '
            + 'word keeps leading back to the most probable next word. Real language models '
            + 'suffer precisely this — ask one for maximum-probability text and it loops and '
            + 'repeats itself. Determinism is not the same as quality.',
          code: py`from collections import Counter, defaultdict

corpus = [
    "the door opens onto the stair",
    "the stair descends into the dark",
    "the dark keeps what the house forgets",
    "the house forgets no one",
    "the door opens onto the hall",
    "the hall remembers every name",
    "the door opens and the house listens",
    "the door opens before you knock",
]
model = defaultdict(Counter)
for sentence in corpus:
    words = sentence.split()
    for a, b in zip(words, words[1:]):
        model[a][b] += 1

def greedy_next(word):
    counter = model[word]
    if not counter:
        return None      # a dead end: this word never had a follower
    return min(counter.items(), key=lambda kv: (-kv[1], kv[0]))[0]

def generate(start, n):
    words = [start]
    for _ in range(n - 1):
        nxt = greedy_next(words[-1])
        if nxt is None:
            break
        words.append(nxt)
    return " ".join(words)

print(generate("the", 9))   # the door opens onto the door opens onto the`,
        },
        {
          heading: 'Temperature — the dial of daring',
          body: 'The cure for stammering is to *sample* — draw the next word at random, '
            + 'weighted by the counts — and **temperature** `T` reshapes the weights before '
            + 'the draw:\n\n'
            + '- Raise each count to the power `1/T`, then normalize to probabilities.\n'
            + '- `T` below 1 **sharpens**: big counts grow bigger; at `T -> 0` sampling '
            + 'collapses into greedy.\n'
            + '- `T = 1` reproduces the honest observed frequencies.\n'
            + '- `T` above 1 **flattens**: underdogs gain ground; as `T` grows the draw '
            + 'approaches uniform — diverse, and increasingly unhinged.\n\n'
            + 'After `the`, the word `door` holds 4 counts of 13. Watch its share move: '
            + '43% at `T = 0.5`, 31% at `T = 1`, 23% at `T = 3`. Every echo you will ever '
            + 'command exposes this dial. Low temperature for contracts and incantations; '
            + 'higher for verse — and never trust a single sample of either.',
          code: py`import random
from collections import Counter, defaultdict

corpus = [
    "the door opens onto the stair",
    "the stair descends into the dark",
    "the dark keeps what the house forgets",
    "the house forgets no one",
    "the door opens onto the hall",
    "the hall remembers every name",
    "the door opens and the house listens",
    "the door opens before you knock",
]
model = defaultdict(Counter)
for sentence in corpus:
    words = sentence.split()
    for a, b in zip(words, words[1:]):
        model[a][b] += 1

def probs_at(word, temperature):
    counter = model[word]
    weights = {w: c ** (1.0 / temperature) for w, c in counter.items()}
    total = sum(weights.values())
    return {w: v / total for w, v in weights.items()}

print(round(probs_at("the", 0.5)["door"], 3))   # 0.432 -- sharpened
print(round(probs_at("the", 1.0)["door"], 3))   # 0.308 -- honest: 4 of 13
print(round(probs_at("the", 3.0)["door"], 3))   # 0.233 -- flattened

rng = random.Random(0)                # seeded: the Forge demands repeatable daring
def sample_next(word, temperature):
    if not model[word]:
        return None
    p = probs_at(word, temperature)
    choices = sorted(p)
    return rng.choices(choices, weights=[p[w] for w in choices], k=1)[0]

words = ["the"]
for _ in range(11):
    nxt = sample_next(words[-1], 3.0)
    if nxt is None:
        break
    words.append(nxt)
print(" ".join(words))   # the stair descends into the hall remembers every name`,
        },
        {
          heading: 'Longer memory, and the confident lie',
          body: 'One word of context is amnesia. A **trigram** model keys on the last *two* '
            + 'words — `tri[(a, b)][c] += 1` — and its speech clings far closer to real '
            + 'sentences, because two words pin down what may follow much harder than one. '
            + 'Longer context beats shorter, always — until the price comes due: **sparsity**. '
            + 'The pair `("the", "moon")` never occurs in our corpus, so the trigram ledger '
            + 'has nothing under it — a dead end where the bigram would have shrugged and '
            + 'continued.\n\n'
            + 'Now read the sampled line from the last section once more: *the stair descends '
            + 'into the hall remembers every name*. No sentence of the corpus says that. The '
            + 'model stitched two real fragments at the shared word `the` and delivered the '
            + 'seam with total fluency. This is **hallucination**, and you have now seen its '
            + 'true mechanism: not lying, not madness — **confident interpolation**. The model '
            + 'continues plausibly from local context because continuing is all it does. It '
            + 'has no ledger of what is *true*, only of what *follows*. The great echoes do '
            + 'this with the whole of written language: the seams are smoother, the stitching '
            + 'identical.',
          code: py`from collections import Counter, defaultdict

corpus = [
    "the door opens onto the stair",
    "the stair descends into the dark",
    "the dark keeps what the house forgets",
    "the house forgets no one",
    "the door opens onto the hall",
    "the hall remembers every name",
    "the door opens and the house listens",
    "the door opens before you knock",
]
tri = defaultdict(Counter)
for sentence in corpus:
    words = sentence.split()
    for a, b, c in zip(words, words[1:], words[2:]):
        tri[(a, b)][c] += 1

print(dict(tri[("the", "door")]))    # {'opens': 4} -- two words of memory
print(dict(tri[("door", "opens")]))  # {'onto': 2, 'and': 1, 'before': 1}
print(dict(tri[("the", "moon")]))    # {} -- never seen: the price of longer memory`,
          note: 'Hold onto this lesson when you meet the great echoes: fluency is not '
            + 'knowledge. A model that completes sentences beautifully is doing, at colossal '
            + 'scale, what this portrait does — and when its context runs out of truth, it '
            + 'interpolates, with the same serene confidence, from whatever lies nearby.',
        },
      ],
      challenge: {
        title: 'The Completing Portrait',
        prompt: 'The corridor-corpus is conjured below. Build the portrait\'s whole mind: the '
          + 'ledger, the greedy voice, and the temperature dial.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Build `model = defaultdict(Counter)`: for each sentence\'s word list, '
          + '`model[a][b] += 1` for every adjacent pair from `zip(words, words[1:])`.\n'
          + '- Define `greedy_next(word)` — `None` if `model[word]` is empty; otherwise the '
          + 'follower with the highest count, ties broken toward the alphabetically first: '
          + '`min(counter.items(), key=lambda kv: (-kv[1], kv[0]))[0]`.\n'
          + '- Define `generate(start, n)` — begin with `[start]`, append `greedy_next` of '
          + 'the last word until the list holds `n` words or a dead end (`None`) stops it, '
          + 'then return the words joined with single spaces.\n'
          + '- Define `probs_at(word, temperature)` — a dict mapping each follower to '
          + '`count ** (1.0 / temperature)` divided by the total of those powered weights.\n'
          + '- Print four lines: `model["the"]["door"]`, then `generate("the", 9)`, then '
          + '`round(probs_at("the", 0.5)["door"], 3)`, then '
          + '`round(probs_at("the", 3.0)["door"], 3)`.',
        starter: py`from collections import Counter, defaultdict

# The corridor-corpus, conjured. Do not alter the sentences.
corpus = [
    "the door opens onto the stair",
    "the stair descends into the dark",
    "the dark keeps what the house forgets",
    "the house forgets no one",
    "the door opens onto the hall",
    "the hall remembers every name",
    "the door opens and the house listens",
    "the door opens before you knock",
]

# TODO: model = defaultdict(Counter); count every adjacent pair

# TODO: def greedy_next(word) -- None on dead ends; else highest count,
#       ties to the alphabetically first

# TODO: def generate(start, n) -- greedy chain of up to n words

# TODO: def probs_at(word, temperature) -- counts ** (1.0 / temperature),
#       normalized to sum to 1

# TODO: print model["the"]["door"], generate("the", 9),
#       round(probs_at("the", 0.5)["door"], 3),
#       round(probs_at("the", 3.0)["door"], 3) -- four lines
`,
        solution: py`from collections import Counter, defaultdict

corpus = [
    "the door opens onto the stair",
    "the stair descends into the dark",
    "the dark keeps what the house forgets",
    "the house forgets no one",
    "the door opens onto the hall",
    "the hall remembers every name",
    "the door opens and the house listens",
    "the door opens before you knock",
]

model = defaultdict(Counter)
for sentence in corpus:
    words = sentence.split()
    for a, b in zip(words, words[1:]):
        model[a][b] += 1

def greedy_next(word):
    counter = model[word]
    if not counter:
        return None
    return min(counter.items(), key=lambda kv: (-kv[1], kv[0]))[0]

def generate(start, n):
    words = [start]
    for _ in range(n - 1):
        nxt = greedy_next(words[-1])
        if nxt is None:
            break
        words.append(nxt)
    return " ".join(words)

def probs_at(word, temperature):
    counter = model[word]
    weights = {w: c ** (1.0 / temperature) for w, c in counter.items()}
    total = sum(weights.values())
    return {w: v / total for w, v in weights.items()}

print(model["the"]["door"])
print(generate("the", 9))
print(round(probs_at("the", 0.5)["door"], 3))
print(round(probs_at("the", 3.0)["door"], 3))`,
        hints: [
          'The ledger is four lines: loop sentences, split, then for a, b in zip(words, words[1:]): model[a][b] += 1. Check yourself: model["the"] should read {door: 4, stair: 2, dark: 2, house: 3, hall: 2}.',
          'greedy_next must return None when the counter is empty (a Counter is falsy when empty). The min-with-negated-count trick sorts by count descending, then alphabetically — one expression handles both.',
          'generate("the", 9) should come out "the door opens onto the door opens onto the" — the stammer is correct! probs_at powers each count by 1.0/temperature then divides by the total; the two printed shares are 0.432 and 0.233.',
        ],
        validation: py`from collections import Counter as _Counter
assert dict(model["the"]) == {"door": 4, "stair": 2, "dark": 2, "house": 3, "hall": 2}, "The ledger under 'the' must read door:4, stair:2, dark:2, house:3, hall:2 — count every adjacent pair, sentence by sentence, never across sentence ends."
assert dict(model["door"]) == {"opens": 4}, "After 'door' the corpus knows only 'opens', four times."
assert dict(model["one"]) == {}, "'one' ends its sentence — its counter must be empty, and greedy_next must survive that."
assert greedy_next("the") == "door", "greedy_next('the') must be 'door' — 4 counts beats house's 3."
assert greedy_next("door") == "opens" and greedy_next("one") is None, "greedy_next must follow the counts, and return None at dead ends."
model["__tievault__"] = _Counter({"raven": 2, "ash": 2})
assert greedy_next("__tievault__") == "ash", "Tie-breaking is wrong — on equal counts, greedy_next must choose the alphabetically first follower (ash before raven)."
del model["__tievault__"]
assert generate("the", 9) == "the door opens onto the door opens onto the", "generate('the', 9) must stammer exactly: the door opens onto the door opens onto the — greedy loops are the correct behavior here."
assert generate("one", 5) == "one", "generate('one', 5) must return just 'one' — the chain dies at a dead end, it does not crash."
assert generate("into", 4) == "into the door opens", "generate('into', 4) must give 'into the door opens' — three greedy steps from 'into'."
_p1 = probs_at("the", 1.0)
assert abs(sum(_p1.values()) - 1.0) < 1e-9, "probs_at must return a true distribution — the values must sum to 1."
assert abs(_p1["door"] - 4.0 / 13.0) < 1e-9, "At temperature 1, probabilities must equal the raw count shares — door holds 4 of the 13 counts after 'the'."
assert probs_at("the", 0.5)["door"] > _p1["door"] > probs_at("the", 3.0)["door"], "Temperature must sharpen below 1 and flatten above 1 — door's share should fall as T rises."
_pf = probs_at("the", 100.0)
assert max(_pf.values()) - min(_pf.values()) < 0.02, "At very high temperature the distribution must approach uniform — all five followers nearly equal."
_lines = [_l.strip() for _l in _stdout.splitlines() if _l.strip()]
assert len(_lines) >= 4, "Print four lines: the door count, the greedy sentence, and the two temperature shares."
assert _lines[0] == "4", "First line must be 4 — the count of 'door' after 'the'."
assert _lines[1] == "the door opens onto the door opens onto the", "Second line must be the greedy stammer, exactly nine words."
assert _lines[2] == "0.432" and _lines[3] == "0.233", "The temperature shares must print 0.432 (T=0.5) and 0.233 (T=3.0)."`,
        successText: 'The portrait clears its painted throat and completes your sentence — fluent, obliging, and utterly without any idea what it just said.',
        xp: 105,
      },
      trace: [
        {
          id: 'a9l4t1',
          code: py`from collections import Counter, defaultdict

model = defaultdict(Counter)
for a, b in zip("the door the hall the door".split(), "door the hall the door the".split()):
    model[a][b] += 1
print(dict(model["the"]))
print(model["the"]["door"])`,
          q: 'The scrying: a bigram ledger counts which word followed which. What does this working print?',
          options: [
            "{'door': 2, 'hall': 1}\n2",
            "{'door': 1, 'hall': 1}\n1",
            "{'door': 2, 'hall': 1, 'the': 3}\n2",
            'A KeyError — "the" was never assigned before being read',
          ],
          answer: 0,
          explain: 'zip pairs each word with the next; "the" is followed by "door" twice and '
            + '"hall" once, so model["the"] is {door: 2, hall: 1}. A defaultdict(Counter) '
            + 'creates an empty Counter on first touch, so no key is ever missing — the fourth '
            + 'option forgets that. model["the"]["door"] then reads the count, 2.',
        },
      ],
      quiz: [
        {
          q: 'What does a bigram language model actually store?',
          options: [
            'The grammatical role of every word',
            'A parse tree for each sentence in the corpus',
            'For each word, the counts of which words followed it in the corpus — frequency masquerading as knowledge',
            'The meaning of each word as a dense vector',
          ],
          answer: 2,
          explain: 'The whole model is a table: model[a][b] = how many times b followed a. '
            + 'Normalizing a row gives next-word probabilities. Nothing else is stored — no '
            + 'grammar, no meaning, no truth. Everything the portrait says is that table '
            + 'speaking.',
        },
        {
          q: 'Greedy decoding produced `the door opens onto the door opens onto...`. Why?',
          options: [
            'The corpus contains that exact sentence',
            'Always taking the single most probable next word steers into a high-probability cycle — the same stammering loop real language models fall into under greedy decoding',
            'The random seed was not set',
            'The Counter overflowed at 4',
          ],
          answer: 1,
          explain: 'Each greedy step is locally optimal and globally blind: the most likely '
            + 'follower of "the" leads to "door", whose most likely follower leads back '
            + 'toward "the". Sampling — with a temperature — is the standard escape from the '
            + 'loop.',
        },
        {
          q: 'What does raising the sampling temperature above 1 do?',
          options: [
            'Makes generation fully deterministic',
            'Increases the training count of every bigram',
            'Shortens the generated text',
            'Flattens the distribution — rare followers gain probability, output grows more diverse and less predictable',
          ],
          answer: 3,
          explain: 'Counts are raised to the power 1/T before normalizing. T > 1 shrinks the '
            + 'gap between big and small counts, pushing the draw toward uniform; T < 1 widens '
            + 'it, collapsing toward greedy at T -> 0. The dial trades caution for daring.',
        },
        {
          q: 'The model generated *"the stair descends into the hall remembers every name"* — a sentence in no scroll. What is the right name for this?',
          options: [
            'Hallucination: confident interpolation — real fragments stitched at a shared word, delivered fluently, with no ledger of truth to check against',
            'Overfitting: the model memorized the corpus',
            'A random-seed bug: reseeding fixes it',
            'Plagiarism: the model copied a hidden document',
          ],
          answer: 0,
          explain: 'The model continues plausibly from local context because that is all it '
            + 'does; where its evidence runs out it splices what lies nearby and never blinks. '
            + 'Large language models fail in exactly this shape — smoother seams, same '
            + 'stitching.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a9l5 — The Turning of Attention
    // ------------------------------------------------------------------
    {
      id: 'a9l5',
      title: 'The Turning of Attention',
      concept: 'scaled dot-product attention in raw numpy: queries, keys, values, softmax over scores, context-blended outputs — and how transformers stack this into the great echoes',
      xp: 40,
      narrative: 'Every talking thing you have built wears a blindfold: the bag forgets order, '
        + 'the bigram remembers one word back. But the echoes now waking do something older — '
        + 'the thing a reader does. In *the hollow crown waits*, your eye rests on **crown**, '
        + 'yet part of your attention turns to **hollow**, part to **waits**, and the word\'s '
        + 'meaning is rebuilt from what it gathered. The rite that performs this turning is '
        + 'three matrices and a softmax. It is called attention, and it is the engine of the '
        + 'age.',
      sections: [
        {
          heading: 'Queries, keys, values — the library of glances',
          body: 'One analogy first. In a library index you approach with a *question*, compare '
            + 'it against the *labels* on the drawers, and take *contents* from the drawers that '
            + 'match. Attention gives every word all three roles at once. '
            + 'Each of the `n` words carries three vectors, stacked into three matrices of shape '
            + '`(n, d)`:\n\n'
            + '- **Q (query)** — what this word looks for. *Crown* asks: what describes me?\n'
            + '- **K (key)** — what this word advertises. *Hollow* answers: I describe things.\n'
            + '- **V (value)** — the meaning this word hands over if chosen.\n\n'
            + 'Word `i`\'s question against word `j`\'s advertisement is a dot product '
            + '`Q[i] . K[j]`, so the whole table of compatibilities is one matrix multiplication '
            + '`Q @ K.T`, shape `(n, n)`: high where word `j` has what word `i` seeks.',
        },
        {
          heading: 'The rite itself — scores, softmax, blend',
          body: 'Scaled dot-product attention is three lines of numpy — every piece forged in '
            + 'Act VIII:\n\n'
            + '- `scores = Q @ K.T / np.sqrt(d)` — all compatibilities, scaled (why, next '
            + 'section).\n'
            + '- `weights = softmax_rows(scores)` — each row a probability distribution: word '
            + '`i`\'s attention budget, summing to 1, spread over every word it may borrow '
            + 'from.\n'
            + '- `output = weights @ V` — each output row a **weighted blend of value '
            + 'vectors**: the word\'s new meaning, rebuilt from what it attended to.\n\n'
            + 'Work it by hand. With `d = 4` the scale is `sqrt(4) = 2`. If *pale*\'s query '
            + 'matches *king*\'s key with raw score 4, scaling gives 2 and its other scores are '
            + '0. Softmax of `[0, 0, 2]` spends `0.787` — four-fifths — on *king*, so *pale*\'s '
            + 'output becomes mostly *king*\'s value: the pallor now knows whom it describes.',
          code: py`import numpy as np

def softmax_rows(z):
    e = np.exp(z - z.max(axis=1, keepdims=True))   # the overflow armor, as always
    return e / e.sum(axis=1, keepdims=True)

def attend(Q, K, V):
    d = Q.shape[1]
    scores = Q @ K.T / np.sqrt(d)
    weights = softmax_rows(scores)
    return weights, weights @ V

# tokens: ["the", "pale", "king"], d = 4
Q = np.array([[0.0, 0.0, 0.0, 0.0],    # the asks nothing
              [2.0, 0.0, 0.0, 0.0],    # pale asks: whom do I describe?
              [0.0, 2.0, 0.0, 0.0]])   # king asks: what describes me?
K = np.array([[0.0, 0.0, 0.0, 0.0],    # the advertises nothing
              [0.0, 2.0, 0.0, 0.0],    # pale advertises: I describe
              [2.0, 0.0, 0.0, 0.0]])   # king advertises: I am describable
V = np.array([[1.0, 0.0, 0.0, 0.0],    # the carries article-ness
              [0.0, 1.0, 0.0, 0.0],    # pale carries pallor
              [0.0, 0.0, 1.0, 0.0]])   # king carries royalty

weights, out = attend(Q, K, V)
print(weights.round(3))
# [[0.333 0.333 0.333]     -- "the" spreads its budget evenly
#  [0.107 0.107 0.787]     -- "pale" turns to "king"
#  [0.107 0.787 0.107]]    -- "king" turns to "pale"
print(out[1].round(3))     # [0.107 0.107 0.787 0.] -- pale's new vector: mostly royalty
print(weights.sum(axis=1)) # [1. 1. 1.] -- every budget spent exactly`,
          note: 'Read the output rows as rebuilt words: after one turning, *pale* is no '
            + 'longer generic pallor — it is pallor-of-a-king. The same word, in a sentence '
            + 'about a pale horse, would have turned elsewhere and become something else. '
            + 'That is what none of your earlier models could do: one word, remade by its '
            + 'company, every time it is read.',
        },
        {
          heading: 'Why divide by sqrt(d)',
          body: 'The scaling is not decoration. A dot product of two length-`d` vectors sums '
            + '`d` terms, so raw scores grow with the dimension — and softmax is an exponential '
            + 'amplifier. Feed it 20 and 24 and the loser\'s share is `e^-4`, about 2 percent; '
            + 'feed it 200 and 240 and the loser ceases to exist. Unscaled attention in high '
            + 'dimension collapses to a brittle one-hot glare: every word staring at one other, '
            + 'all nuance gone (and all gradient with it — a saturated softmax learns '
            + 'nothing).\n\n'
            + 'Dividing by `sqrt(d)` cancels the dimensional growth, keeping scores where '
            + 'softmax distributes budgets rather than crowning winners. Compare the same '
            + 'matrices with and without: unscaled, *hollow* spends 0.948 of its budget on one '
            + 'word; scaled, a workable 0.711 — attentive, not transfixed.',
          code: py`import numpy as np

def softmax_rows(z):
    e = np.exp(z - z.max(axis=1, keepdims=True))
    return e / e.sum(axis=1, keepdims=True)

Q = np.array([[2.0, 0.0, 0.0, 0.0]])            # one query...
K = np.array([[0.0, 0.0, 0.0, 0.0],
              [0.0, 2.0, 0.0, 0.0],
              [2.0, 0.0, 0.0, 0.0],
              [0.0, 0.0, 0.0, 2.0]])            # ...against four keys
print(softmax_rows(Q @ K.T).round(3))           # [[0.017 0.017 0.948 0.017]] -- transfixed
print(softmax_rows(Q @ K.T / 2.0).round(3))     # [[0.096 0.096 0.711 0.096]] -- attentive`,
        },
        {
          heading: 'From one turning to the new minds',
          body: 'Now the map to the great echoes. In a **transformer**, the Q, K, V matrices '
            + 'are not written by hand: each is produced from the same '
            + 'token embeddings by a **learned** weight matrix — three linear layers, the '
            + 'species you forged in Act VIII. One attention turning plus a small feedforward '
            + 'network is a **layer**; the model stacks dozens, each running many attention '
            + '**heads** in parallel (each its own Q/K/V, tracking different company — '
            + 'adjacency, subject-and-verb, distant echoes of a name). Every '
            + 'layer, every word\'s vector is rebuilt from context — meaning compounding on '
            + 'meaning.\n\n'
            + 'Train that stack on oceans of text with the objective from the portrait lesson — '
            + '*predict the next word* — descending the same cross-entropy, and you get a '
            + '**large language model**. Nothing in the recipe is magic: matrices, softmax, '
            + 'gradients, scale. Which is why the portrait\'s failures — the stammer, the '
            + 'confident interpolation — survive in the great echoes. The architecture grew. '
            + 'The nature did not.',
        },
      ],
      challenge: {
        title: 'The Turning Gaze',
        prompt: 'Four tokens hang in the sentence *the hollow crown waits*, their Q, K, V '
          + 'matrices conjured below. Perform the turning.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Define `softmax_rows(z)` — subtract each row\'s max, exponentiate, divide by '
          + 'each row\'s sum (`axis=1, keepdims=True` for both).\n'
          + '- Define `attend(Q, K, V)` returning the pair `(weights, output)` where '
          + '`scores = Q @ K.T / np.sqrt(d)` with `d = Q.shape[1]`, '
          + '`weights = softmax_rows(scores)`, and `output = weights @ V`.\n'
          + '- Apply it: `weights, out = attend(Q, K, V)`.\n'
          + '- Print three lines: `round(float(weights[1, 2]), 3)` (how much of *hollow*\'s '
          + 'budget goes to *crown*), then `tokens[int(weights[1].argmax())]` (where *hollow* '
          + 'looks hardest), then `round(float(out[2, 1]), 3)` (how much of *hollow*\'s value '
          + 'now lives inside *crown*\'s rebuilt vector).',
        starter: py`import numpy as np

# The sentence and its conjured matrices. Do not alter them.
tokens = ["the", "hollow", "crown", "waits"]
Q = np.array([
    [0.0, 0.0, 0.0, 0.0],   # the -- asks nothing
    [2.0, 0.0, 0.0, 0.0],   # hollow -- asks: whom do I describe?
    [0.0, 2.0, 0.0, 2.0],   # crown -- asks: what describes me? what do I do?
    [0.0, 0.0, 2.0, 0.0],   # waits -- asks: who is my actor?
])
K = np.array([
    [0.0, 0.0, 0.0, 0.0],   # the -- advertises nothing
    [0.0, 2.0, 0.0, 0.0],   # hollow -- advertises: I describe
    [2.0, 0.0, 2.0, 0.0],   # crown -- advertises: describable; an actor
    [0.0, 0.0, 0.0, 2.0],   # waits -- advertises: I am a deed
])
V = np.array([
    [1.0, 0.0, 0.0, 0.0],   # the -- carries article-ness
    [0.0, 1.0, 0.0, 0.0],   # hollow -- carries hollowness
    [0.0, 0.0, 1.0, 0.0],   # crown -- carries the crown itself
    [0.0, 0.0, 0.0, 1.0],   # waits -- carries the waiting
])

# TODO: def softmax_rows(z) -- max-subtracted, row-wise

# TODO: def attend(Q, K, V) -- scores scaled by sqrt(d); return (weights, output)

# TODO: weights, out = attend(Q, K, V)

# TODO: print round(float(weights[1, 2]), 3),
#       tokens[int(weights[1].argmax())],
#       round(float(out[2, 1]), 3) -- three lines
`,
        solution: py`import numpy as np

tokens = ["the", "hollow", "crown", "waits"]
Q = np.array([
    [0.0, 0.0, 0.0, 0.0],
    [2.0, 0.0, 0.0, 0.0],
    [0.0, 2.0, 0.0, 2.0],
    [0.0, 0.0, 2.0, 0.0],
])
K = np.array([
    [0.0, 0.0, 0.0, 0.0],
    [0.0, 2.0, 0.0, 0.0],
    [2.0, 0.0, 2.0, 0.0],
    [0.0, 0.0, 0.0, 2.0],
])
V = np.array([
    [1.0, 0.0, 0.0, 0.0],
    [0.0, 1.0, 0.0, 0.0],
    [0.0, 0.0, 1.0, 0.0],
    [0.0, 0.0, 0.0, 1.0],
])

def softmax_rows(z):
    e = np.exp(z - z.max(axis=1, keepdims=True))
    return e / e.sum(axis=1, keepdims=True)

def attend(Q, K, V):
    d = Q.shape[1]
    scores = Q @ K.T / np.sqrt(d)
    weights = softmax_rows(scores)
    return weights, weights @ V

weights, out = attend(Q, K, V)

print(round(float(weights[1, 2]), 3))
print(tokens[int(weights[1].argmax())])
print(round(float(out[2, 1]), 3))`,
        hints: [
          'softmax_rows is the same armor-plated function from Act VIII: e = np.exp(z - z.max(axis=1, keepdims=True)), then e / e.sum(axis=1, keepdims=True).',
          'attend is three lines: d = Q.shape[1]; scores = Q @ K.T / np.sqrt(d); weights = softmax_rows(scores) — then return (weights, weights @ V). d is 4, so the scale is 2.',
          'Check by hand: hollow\'s query [2,0,0,0] dots crown\'s key [2,0,2,0] to 4, scaled to 2; softmax over [0, 0, 2, 0] gives 7.389/10.389 = 0.711 on crown. The three prints are 0.711, crown, and 0.44.',
        ],
        validation: py`import numpy as np
_Q0 = np.array([[0.0, 0.0, 0.0, 0.0], [2.0, 0.0, 0.0, 0.0], [0.0, 2.0, 0.0, 2.0], [0.0, 0.0, 2.0, 0.0]])
_K0 = np.array([[0.0, 0.0, 0.0, 0.0], [0.0, 2.0, 0.0, 0.0], [2.0, 0.0, 2.0, 0.0], [0.0, 0.0, 0.0, 2.0]])
_V0 = np.eye(4)
assert np.allclose(Q, _Q0) and np.allclose(K, _K0) and np.allclose(V, _V0), "The conjured Q, K, V matrices were altered — restore them exactly."
_sm = softmax_rows(np.array([[0.0, 0.0], [1000.0, 999.0]]))
assert np.allclose(_sm[0], [0.5, 0.5]), "softmax_rows of equal scores must give equal shares [0.5, 0.5]."
assert np.all(np.isfinite(_sm)), "softmax_rows overflowed on large scores — subtract each row's max before exponentiating."
assert np.allclose(_sm.sum(axis=1), 1.0), "Every softmax row must sum to exactly 1 — a full attention budget."
_s = Q @ K.T / 2.0
_e = np.exp(_s - _s.max(axis=1, keepdims=True))
_W = _e / _e.sum(axis=1, keepdims=True)
_O = _W @ V
assert weights.shape == (4, 4) and np.allclose(weights, _W, atol=1e-6), "weights must be softmax_rows(Q @ K.T / sqrt(4)) — the scale is sqrt(d) = 2, not d and not 1."
assert np.allclose(out, _O, atol=1e-6), "output must be weights @ V — each word's rebuilt vector is its weighted blend of the value rows."
assert int(weights[1].argmax()) == 2 and int(weights[3].argmax()) == 2, "Both 'hollow' and 'waits' must spend most of their budgets on 'crown' — their queries match its key."
assert np.allclose(weights[0], 0.25, atol=1e-6), "'the' asks nothing, so its scores are all equal and its budget must spread evenly — 0.25 to each word."
_Q1 = np.array([[1.0, 0.0], [0.0, 2.0]])
_K1 = np.array([[1.0, 1.0], [0.0, 1.0]])
_V1 = np.array([[3.0, 0.0], [0.0, 5.0]])
_w1, _o1 = attend(_Q1, _K1, _V1)
_s1 = _Q1 @ _K1.T / np.sqrt(2.0)
_e1 = np.exp(_s1 - _s1.max(axis=1, keepdims=True))
_wx = _e1 / _e1.sum(axis=1, keepdims=True)
assert np.allclose(_w1, _wx, atol=1e-6) and np.allclose(_o1, _wx @ _V1, atol=1e-6), "attend must work for ANY matrices, not just the conjured ones — d comes from Q.shape[1], and the rite is the same three lines."
_lines = [_l.strip() for _l in _stdout.splitlines() if _l.strip()]
assert len(_lines) >= 3, "Print three lines: hollow's budget on crown, hollow's strongest gaze, and hollow's share inside crown's rebuilt vector."
assert _lines[0] == "0.711", "First line must be 0.711 — hollow turns hard toward crown."
assert _lines[1] == "crown", "Second line must be crown — where hollow looks hardest."
assert _lines[2] == "0.44", "Third line must be 0.44 — crown's rebuilt vector carries 0.44 of hollow's value (and 0.44 of waits's: the crown borrows from both its describer and its deed)."`,
        successText: 'The gaze turns, the budgets spend themselves, and four words leave the rite knowing things about each other that no bag or bigram ever taught them.',
        xp: 110,
      },
      extras: [
        {
          id: 'a9l5x1',
          kind: 'cursed',
          title: 'The Tribunal That Abstains',
          prompt: 'The attention-rite runs, and for most sentences its weight-tables are '
            + 'lawful — every row a set of shares that sum to one. But hand it a sentence whose '
            + 'scores run large (a long, emphatic passage, or one the earlier layers have '
            + 'shouted about) and the whole table returns as `nan`. Not an error — `nan`, '
            + 'silent and contagious, poisoning every word downstream. The rows that overflow '
            + 'are exactly the rows that mattered most.\n\n'
            + 'Mend `softmax_rows` **in place**. Healed, it must return a lawful distribution '
            + 'for ANY scores, however large — every row finite, non-negative, summing to one.',
          starter: py`# THE TRIBUNAL THAT ABSTAINS -- the attention weights return as nan.
# It is right on small scores and poisons everything on large ones.
# Mend softmax_rows IN PLACE; the armor is one term.
import numpy as np

def softmax_rows(Z):
    e = np.exp(Z)                          # raise every score
    return e / e.sum(axis=1, keepdims=True)

small = np.array([[0.0, 1.0, 2.0],
                  [2.0, 1.0, 0.0]])
big = np.array([[10.0, 800.0, 900.0],
                [1.0, 2.0, 3.0]])

print(softmax_rows(small).round(3))
print(softmax_rows(big))
`,
          solution: py`import numpy as np

def softmax_rows(Z):
    e = np.exp(Z - Z.max(axis=1, keepdims=True))
    return e / e.sum(axis=1, keepdims=True)

small = np.array([[0.0, 1.0, 2.0],
                  [2.0, 1.0, 0.0]])
big = np.array([[10.0, 800.0, 900.0],
                [1.0, 2.0, 3.0]])

print(softmax_rows(small).round(3))
print(softmax_rows(big))`,
          validation: py`import numpy as np
_small = softmax_rows(np.array([[0.0, 1.0, 2.0]]))
assert np.allclose(_small.sum(axis=1), 1.0), "Each row of softmax must sum to 1 — the armor must not change that."
_big = softmax_rows(np.array([[10.0, 800.0, 900.0], [1.0, 2.0, 3.0]]))
assert np.all(np.isfinite(_big)), "softmax_rows still overflows on large scores — subtract each row's MAX before exp: np.exp(Z - Z.max(axis=1, keepdims=True))."
assert np.allclose(_big.sum(axis=1), 1.0), "Every row must still sum to 1 after the fix — check the axis and keepdims on both the max and the sum."
assert _big[0].argmax() == 2, "The largest score (900) must still win its row's largest share — the fix must not scramble the order."
_z = np.array([[1.0, 2.0, 3.0]])
assert np.allclose(softmax_rows(_z), softmax_rows(_z + 500.0)), "softmax is shift-invariant: adding a constant to a row must not change its distribution. If it does, the max-subtraction is wrong or missing."
assert abs(float(_big[1, 2]) - float(softmax_rows(np.array([[1.0, 2.0, 3.0]]))[0, 2])) < 1e-9, "A row of ordinary scores must give the ordinary distribution — the second row [1,2,3] is unaffected by the armor."`,
          successText: 'The tribunal holds. The bug has its true name — **softmax overflow**: raise a large score with a bare exp() and it becomes inf, inf/inf becomes nan, and the poison spreads silently; subtract the row\'s max first and the exponential never leaves safe ground.',
          hints: [
            'Print np.exp(np.array([900.0])) on its own. It is inf — and inf / inf is nan. That is the whole disease: the exponential of a large score overflows to infinity before the division ever runs.',
            'You are trusting np.exp to survive any input. It cannot: past about 710 it overflows to inf. But softmax is unchanged by SHIFTING every score in a row by the same constant — the shift cancels in the division — so you may subtract the row\'s own maximum first, for free.',
            'Subtract each row\'s max before exponentiating: e = np.exp(Z - Z.max(axis=1, keepdims=True)). Now the largest exponent is exp(0) = 1, nothing overflows, and the distribution is identical. Standard armor; wear it always.',
          ],
          xp: 30,
        },
      ],
      quiz: [
        {
          q: 'In attention, what are the query, key, and value of a word?',
          options: [
            'Its position, its length, and its frequency',
            'Query: what the word seeks from others; key: what it advertises to others; value: the meaning it hands over when chosen',
            'Three copies of the same one-hot vector',
            'Its tf, its idf, and their product',
          ],
          answer: 1,
          explain: 'Compatibility of one word\'s query with another\'s key (a dot product) '
            + 'decides how much attention flows; what actually flows is the value. Three roles, '
            + 'three matrices — and in a transformer, all three are produced from the same '
            + 'embeddings by learned linear layers.',
        },
        {
          q: 'After `weights = softmax_rows(Q @ K.T / sqrt(d))`, what is row `i` of `weights`?',
          options: [
            'The probability that word i is the sentence\'s subject',
            'The new embedding of word i',
            'Word i\'s attention budget: non-negative shares summing to 1, saying how much of each word\'s value it will blend into its output',
            'The gradient of the loss for word i',
          ],
          answer: 2,
          explain: 'Softmax turns each score row into a distribution over all words. The '
            + 'output row is then that distribution times V — a weighted average of value '
            + 'vectors. Word i\'s rebuilt meaning is literally a spent budget.',
        },
        {
          q: 'Why are attention scores divided by `sqrt(d)`?',
          options: [
            'To keep the matrices square',
            'To make the weights sum to 1 — softmax cannot do that alone',
            'To speed up the matrix multiplication',
            'Dot products grow with dimension, and large scores saturate the exponential softmax into a brittle near-one-hot — the scale keeps budgets distributed and gradients alive',
          ],
          answer: 3,
          explain: 'Summing d terms makes raw scores scale with d, and softmax amplifies '
            + 'differences exponentially. Unscaled high-dimensional attention stares at one '
            + 'word and learns nothing (saturated exponentials have dead gradients). Dividing '
            + 'by sqrt(d) cancels the growth.',
        },
        {
          q: 'Which statement honestly maps this lesson to large language models?',
          options: [
            'LLMs use attention only in their final layer',
            'A transformer stacks layers of (multi-head attention + feedforward), with Q/K/V produced by learned matrices, trained on vast text to predict the next token — scale changes the power, not the nature',
            'LLMs replace attention with a much larger bigram table',
            'Attention lets LLMs verify facts before speaking',
          ],
          answer: 1,
          explain: 'The recipe is the pieces you now own: embeddings, attention turnings, '
            + 'feedforward layers, cross-entropy on next-token prediction, gradient descent, '
            + 'oceans of text. Nothing verifies truth anywhere in it — which is why fluent '
            + 'hallucination survives at every scale.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a9l6 — The Library That Answers
    // ------------------------------------------------------------------
    {
      id: 'a9l6',
      title: 'The Library That Answers',
      concept: 'retrieval-augmented answering: chunking a corpus into passages, TF-IDF vectors, cosine top-k retrieval, answering by quotation — plus the generation half and prompting, honestly',
      xp: 40,
      narrative: 'The echo in the ruined observatory answers any question, instantly, '
        + 'gorgeously — and when it does not know, it answers anyway, in the same voice. The '
        + 'archivists\' remedy is old librarianship: *make it read before it speaks.* Chain the '
        + 'echo to the grimoire, fetch the passage that bears on the question, and let the '
        + 'answer stand on quoted ink, not interpolated fog. The '
        + 'rite is called retrieval-augmented generation. Tonight you build its retrieval half '
        + 'whole — all arithmetic you own — and learn what the generation half adds, and what '
        + 'it cannot.',
      sections: [
        {
          heading: 'Grounding — why the library must answer first',
          body: 'You watched the portrait hallucinate: where evidence thins, a language model '
            + '**interpolates with confidence** — continuing is all it does. Scale does not '
            + 'cure this; a vast echo hallucinates more fluently, which is worse.\n\n'
            + '**RAG (retrieval-augmented generation)** attacks the disease at its source — '
            + 'missing evidence:\n\n'
            + '- **Retrieve**: find the trusted corpus passages most relevant to the '
            + 'question.\n'
            + '- **Augment**: place those passages before the echo, with the question.\n'
            + '- **Generate**: the echo drafts its answer *from the retrieved scrolls*, '
            + 'quoting and citing, not from the fog of what it half-remembers.\n\n'
            + 'The retrieval half is not a language model. It is vectors and cosine — the '
            + 'arithmetic of your last three lessons — and you can build, test, and trust it '
            + 'alone.',
        },
        {
          heading: 'Chunking the grimoire',
          body: 'A book is too large to be one vector: mash a thousand topics and the vector '
            + 'points at their meaningless average. So the corpus is cut into '
            + '**chunks** — passages of one topic each — each with its own vector. Our conjured '
            + 'grimoire marks passages with blank lines, so `grimoire.split("\\n\\n")` cuts '
            + 'cleanly (a `.strip()` tidies the edges).\n\n'
            + 'Chunk size is a real trade:\n\n'
            + '- **Too large** — many topics per vector; the passage matches everything weakly '
            + 'and drags irrelevant text into the answer.\n'
            + '- **Too small** — sentences orphaned from their context; the retriever finds a '
            + 'fragment that mentions the words but no longer means the answer.\n'
            + '- In the wild, chunks overlap a little, so no fact is cut in half at a '
            + 'boundary.',
          code: py`grimoire = (
    "Of the flattering mirror. The mirror in the west gallery speaks only praise. "
    "It tells each visitor whatever the visitor most longs to hear, and it is wrong "
    "exactly as often as it needs to be. Trust no glass that smiles."
    "\n\n"
    "Of the echo well. Words spoken into the echo well return after seven nights, "
    "changed. The well does not know what the words mean. It only knows which words "
    "tend to follow which."
    "\n\n"
    "Of the third ward. The third ward of the library is renewed at midnight with "
    "salt and cold iron. While it holds, nothing written may leave the shelves and "
    "nothing burning may enter."
)

chunks = [c.strip() for c in grimoire.split("\n\n")]
print(len(chunks))          # 3
print(chunks[2][:17])       # Of the third ward`,
        },
        {
          heading: 'Retrieval — the librarian\'s arithmetic',
          body: 'Vectorize the chunks with `TfidfVectorizer`; embed the question **with the '
            + 'same fitted vectorizer** (`transform`, never a new fit — the question must '
            + 'speak the census\'s language), then rank by cosine:\n\n'
            + '- `sims = cosine_similarity(vec.transform([question]), X)[0]` — one '
            + 'similarity per chunk.\n'
            + '- `order = np.argsort(-sims)` — indices best to worst; the first `k` are the '
            + '**top-k** passages.\n'
            + '- Answer by **quotation**: return the best passage as a quote. No echo is needed '
            + 'for this half — a verbatim quote of a trusted scroll cannot hallucinate.\n\n'
            + 'Honest limits: TF-IDF retrieval matches *words*, not meanings — ask about a '
            + '"looking glass" and a grimoire that says "mirror" '
            + 'scores zero. Real retrievers therefore rank by cosine over *dense embeddings* '
            + '(lesson three, scaled up), where synonyms sit close. And retrieval quality '
            + 'bounds everything: fetch the wrong scroll and the finest echo grounds its answer '
            + 'in the wrong truth.',
          code: py`import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

chunks = [
    "Of the flattering mirror. Trust no glass that smiles.",
    "Of the echo well. Words spoken into the echo well return after seven nights.",
    "Of the third ward. The third ward of the library is renewed with salt and iron.",
]
vec = TfidfVectorizer()
X = vec.fit_transform(chunks)

question = "how is the third ward of the library renewed"
sims = cosine_similarity(vec.transform([question]), X)[0]
print(sims.round(3))            # [0.145 0.164 0.853] -- the ward passage stands alone
best = int(np.argsort(-sims)[0])
print("QUOTE:", chunks[best][:16], "...")   # QUOTE: Of the third war ...`,
        },
        {
          heading: 'The generation half, and the shaping of prompts',
          body: 'In full RAG, the retrieved passages and question are assembled into a '
            + '**prompt** — the text an echo continues — and the echo drafts a fluent answer '
            + '*from* them: merging passages, citing sources. Generation adds fluency, '
            + 'retrieval the facts. It reduces hallucination for a plain reason: the model '
            + 'continues from context, and RAG **fills that context with true ink** — '
            + 'so the nearest material to interpolate from is the evidence. Reduces, not '
            + 'abolishes: an echo can still misread or embroider the scrolls it was handed; '
            + 'grounded is not infallible.\n\n'
            + 'The prompt is the instrument of command; learn its parts:\n\n'
            + '- **System prompt** — standing orders: voice, rules, refusals, set once by '
            + 'whoever binds the echo.\n'
            + '- **User prompt** — the question of the moment, plus what the retriever fetched.\n'
            + '- **Few-shot examples** — worked question-answer pairs in the prompt; the echo, a '
            + 'next-word predictor, continues the *pattern* it sees — show it two answers in the '
            + 'shape you want and the third arrives pre-shaped, no retraining.',
          note: 'The deepest habit to build now: an echo\'s prompt is data, not law. It '
            + 'follows instructions the way water follows a channel — usually, and never '
            + 'against its own weight. Command clearly, ground with retrieval, and verify '
            + 'the result as you would any spell from an untrusted grimoire.',
        },
      ],
      challenge: {
        title: 'The Answering Library',
        prompt: 'The full grimoire is conjured below — six passages parted by blank lines. '
          + 'Build the library that answers by quotation.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Chunk: `chunks = [c.strip() for c in grimoire.split("\\n\\n")]`.\n'
          + '- Vectorize: `vec = TfidfVectorizer()`, `X = vec.fit_transform(chunks)`.\n'
          + '- Define `retrieve(question, k)` — compute `sims = '
          + 'cosine_similarity(vec.transform([question]), X)[0]`, then return the first `k` '
          + 'indices of `np.argsort(-sims)` as a list of plain ints.\n'
          + '- Define `answer(question)` — return the string `"The grimoire answers: "` '
          + 'followed by the single best passage, `chunks[retrieve(question, 1)[0]]`.\n'
          + '- Print three lines: `retrieve("how is the third ward of the library renewed", '
          + '2)[0]`, then `retrieve("what does a bound servant obey", 2)[0]`, then '
          + '`answer("why should you not trust the mirror").startswith("The grimoire '
          + 'answers: Of the flattering mirror")`.',
        starter: py`import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# The grimoire, conjured. Do not alter its ink.
grimoire = (
    "Of the flattering mirror. The mirror in the west gallery speaks only praise. "
    "It tells each visitor whatever the visitor most longs to hear, and it is wrong "
    "exactly as often as it needs to be. Trust no glass that smiles."
    "\n\n"
    "Of the painted wardens. The portraits guard the corridors after dark. A portrait "
    "may carry a message to any frame hanging in the same wing, but it will gossip, "
    "and it will embroider whatever it carries."
    "\n\n"
    "Of the weighing hat. The old hat judges whatever head it is set upon. Its "
    "judgment is swift, it explains nothing, and no appeal has ever been granted."
    "\n\n"
    "Of the echo well. Words spoken into the echo well return after seven nights, "
    "changed. The well does not know what the words mean. It only knows which words "
    "tend to follow which."
    "\n\n"
    "Of the third ward. The third ward of the library is renewed at midnight with "
    "salt and cold iron. While it holds, nothing written may leave the shelves and "
    "nothing burning may enter."
    "\n\n"
    "Of bound servants. A bound servant obeys the letter of its command and never "
    "the intent. Give it no command you have not first read aloud twice, once as "
    "yourself and once as your enemy."
)

# TODO: chunks -- split on blank lines, strip each passage

# TODO: vec and X -- TfidfVectorizer fit on the chunks

# TODO: def retrieve(question, k) -- cosine sims, argsort descending,
#       first k indices as plain ints

# TODO: def answer(question) -- "The grimoire answers: " + the best passage

# TODO: the three prints
`,
        solution: py`import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

grimoire = (
    "Of the flattering mirror. The mirror in the west gallery speaks only praise. "
    "It tells each visitor whatever the visitor most longs to hear, and it is wrong "
    "exactly as often as it needs to be. Trust no glass that smiles."
    "\n\n"
    "Of the painted wardens. The portraits guard the corridors after dark. A portrait "
    "may carry a message to any frame hanging in the same wing, but it will gossip, "
    "and it will embroider whatever it carries."
    "\n\n"
    "Of the weighing hat. The old hat judges whatever head it is set upon. Its "
    "judgment is swift, it explains nothing, and no appeal has ever been granted."
    "\n\n"
    "Of the echo well. Words spoken into the echo well return after seven nights, "
    "changed. The well does not know what the words mean. It only knows which words "
    "tend to follow which."
    "\n\n"
    "Of the third ward. The third ward of the library is renewed at midnight with "
    "salt and cold iron. While it holds, nothing written may leave the shelves and "
    "nothing burning may enter."
    "\n\n"
    "Of bound servants. A bound servant obeys the letter of its command and never "
    "the intent. Give it no command you have not first read aloud twice, once as "
    "yourself and once as your enemy."
)

chunks = [c.strip() for c in grimoire.split("\n\n")]

vec = TfidfVectorizer()
X = vec.fit_transform(chunks)

def retrieve(question, k):
    sims = cosine_similarity(vec.transform([question]), X)[0]
    order = np.argsort(-sims)
    return [int(i) for i in order[:k]]

def answer(question):
    best = retrieve(question, 1)[0]
    return "The grimoire answers: " + chunks[best]

print(retrieve("how is the third ward of the library renewed", 2)[0])
print(retrieve("what does a bound servant obey", 2)[0])
print(answer("why should you not trust the mirror").startswith("The grimoire answers: Of the flattering mirror"))`,
        hints: [
          'chunks is one line: [c.strip() for c in grimoire.split("\\n\\n")] — six passages. Then fit the vectorizer on chunks, exactly as in the section.',
          'retrieve embeds the question with vec.transform([question]) — a list of one string, and the SAME vec (never a new fit). np.argsort(-sims) ranks best-first; slice [:k] and wrap each index in int().',
          'answer(question) is two lines: best = retrieve(question, 1)[0], then return "The grimoire answers: " + chunks[best]. The three prints come out 4, 5, True.',
        ],
        validation: py`import numpy as np
assert len(chunks) == 6, "The grimoire parts into exactly 6 passages — split on blank lines (two newlines), and strip each."
assert chunks[0].startswith("Of the flattering mirror") and chunks[5].startswith("Of bound servants"), "The chunks are disordered or unstripped — passage 0 opens with the mirror, passage 5 with the bound servants."
assert all(c == c.strip() for c in chunks), "Each chunk must be stripped of leading and trailing whitespace."
_r = retrieve("how is the third ward of the library renewed", 2)
assert isinstance(_r, list) and len(_r) == 2, "retrieve(question, k) must return a list of k indices."
assert _r[0] == 4, "The ward question must retrieve passage 4 first — the third ward's own page. Check argsort on NEGATED sims for best-first order."
assert retrieve("what does a bound servant obey", 2)[0] == 5, "The servant question must retrieve passage 5 first."
assert retrieve("when do words return from the echo well", 2)[0] == 3, "The echo-well question must retrieve passage 3 first."
assert retrieve("who guards the corridors after dark", 2)[0] == 1, "The corridor question must retrieve passage 1 first — the painted wardens."
assert retrieve("does the hat explain its judgment", 3)[0] == 2 and len(retrieve("does the hat explain its judgment", 3)) == 3, "The hat question must retrieve passage 2 first — and retrieve must honor k."
_a = answer("when do words return from the echo well")
assert _a.startswith("The grimoire answers: "), "answer must open with the exact words: The grimoire answers: "
assert chunks[3] in _a, "answer must QUOTE the retrieved passage whole — the echo well's page, verbatim. Quotation is the point: quoted ink cannot hallucinate."
_lines = [_l.strip() for _l in _stdout.splitlines() if _l.strip()]
assert len(_lines) >= 3, "Print three lines: the two retrieved indices and the mirror check."
assert _lines[0] == "4", "First line must be 4 — the third ward's passage."
assert _lines[1] == "5", "Second line must be 5 — the bound servants' passage."
assert _lines[2] == "True", "Third line must be True — the mirror question answers from the mirror's own page."`,
        successText: 'Asked, the library does not orate. It lays one cold finger on one passage and reads it aloud, word for word — and for the first time tonight, nothing was invented.',
        xp: 110,
      },
      quiz: [
        {
          q: 'Why does retrieval-augmented generation reduce hallucination?',
          options: [
            'It lowers the sampling temperature to zero',
            'A language model continues from its context — and RAG fills that context with retrieved, relevant source text, so the answer is drafted from evidence instead of interpolated fog',
            'It retrains the model on the corpus before each question',
            'It blocks the model from using rare words',
          ],
          answer: 1,
          explain: 'Hallucination is confident interpolation where evidence is missing; RAG '
            + 'supplies the evidence at the exact moment of generation. Reduces, not abolishes '
            + '— the echo can still misread the scrolls it was handed, and bad retrieval '
            + 'grounds the answer in the wrong truth.',
        },
        {
          q: 'Why is the corpus cut into chunks instead of vectorized as one document?',
          options: [
            'TfidfVectorizer refuses inputs over a fixed length',
            'Chunks make the matrix smaller and thus more accurate',
            'A whole book\'s vector is the meaningless average of a thousand topics — passage-sized chunks each match a question sharply, though too-small chunks orphan facts from their context',
            'Splitting is required before cosine_similarity will run',
          ],
          answer: 2,
          explain: 'Retrieval granularity is a trade: big chunks blur (match everything '
            + 'weakly), tiny chunks orphan (match words without meaning). Passage-sized pieces '
            + '— often slightly overlapping in practice — keep one topic per vector.',
        },
        {
          q: 'The question must be embedded with `vec.transform([question])`, not a freshly fit vectorizer. Why?',
          options: [
            'The question and the chunks must live in the same vector space — the same census, the same columns — or their cosine compares unrelated coordinates',
            'transform is faster than fit_transform',
            'A fresh vectorizer would lowercase the question twice',
            'fit_transform only accepts lists of even length',
          ],
          answer: 0,
          explain: 'A new fit would build a new vocabulary with different column meanings; '
            + 'cosine between vectors from different spaces is arithmetic noise. One census, '
            + 'fit once on the corpus, transforms everything thereafter — the same leakage-'
            + 'shaped discipline as train and test.',
        },
        {
          q: 'What is a system prompt, as against a user prompt?',
          options: [
            'The compiled bytecode of the model',
            'A prompt that only administrators are allowed to read',
            'The half of the prompt the model is forbidden to continue',
            'The standing orders — voice, rules, refusals — set by whoever binds the echo; the user prompt is the question of the moment, plus whatever retrieval fetched',
          ],
          answer: 3,
          explain: 'Both are just text in the context, but by convention the system prompt '
            + 'frames every exchange while user prompts come and go. Few-shot examples ride '
            + 'along as worked precedents: the next-word predictor continues the pattern it '
            + 'is shown.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a9l7 — The Bound Servant
    // ------------------------------------------------------------------
    {
      id: 'a9l7',
      title: 'The Bound Servant',
      concept: 'agentic loops in plain Python: a goal-driven loop over a registry of tool functions, with guardrails — max steps, an allowed-tool registry, refusals — and the doctrine of testing agents',
      xp: 40,
      narrative: 'The last page of the grimoire is a binding, written like a leash. An '
        + '**agent** is an echo given hands: it reads a goal, chooses a tool, acts, observes, '
        + 'and chooses again — a loop, not an oracle. The old '
        + 'binders\' law is carved around the page like thorns: *grant few tools; count every '
        + 'step; refuse the forbidden before the first tool moves; read the trace afterward as '
        + 'if your enemy wrote it.* Tonight you build the whole anatomy in plain Python — loop, '
        + 'registry, leash — with rules where the echoes put a mind.',
      sections: [
        {
          heading: 'The loop and the registry',
          body: 'Strip an agent to its skeleton and this remains:\n\n'
            + '- **Read the goal** — what is wanted?\n'
            + '- **Choose a tool** from a fixed registry — the action that advances the goal.\n'
            + '- **Act** — call it with arguments.\n'
            + '- **Observe** — record the result; it changes what to do next.\n'
            + '- **Repeat** until the answer is ready or a guardrail calls time.\n\n'
            + 'The registry is honest Python: a **dict of callables**, `tools = {"lookup": '
            + 'lookup, "add": add, "final_answer": final_answer}`. The agent acts ONLY through '
            + 'this dict — `tools["lookup"](name)` — never a function it was not granted. That '
            + 'makes the registry a *boundary*: what is not in the dict does not exist for the '
            + 'servant. In the great echoes a model picks the tool by naming it; here plain '
            + 'rules pick. Loop, registry, and leash are identical either way.',
          code: py`WARDSTONES = {
    "vault of ashes": 9,
    "vault of echoes": 4,
    "vault of mirrors": 7,
    "sunken archive": 5,
}

def lookup(name):
    return WARDSTONES[name]

def add(a, b):
    return a + b

def final_answer(value):
    return "ANSWER: " + str(value)

tools = {"lookup": lookup, "add": add, "final_answer": final_answer}
print(tools["lookup"]("vault of ashes"))       # 9 -- a tool, called through the registry
print(tools["final_answer"](13))               # ANSWER: 13`,
        },
        {
          heading: 'The chooser — rules where the mind goes',
          body: 'Our servant answers one kind of question — *how many wardstones guard these '
            + 'places together?* — so its policy is three rules:\n\n'
            + '- If the goal names a known place not yet looked up → `("lookup", '
            + 'that_place)`.\n'
            + '- Else, if two or more numbers gathered → `("add", None)` — fold two into one.\n'
            + '- Else, exactly one number left → `("final_answer", None)` — done.\n'
            + '- Else → `None`: no rule fires, no path to an answer.\n\n'
            + 'The chooser returns a **decision**, not a result; the loop executes it. Keeping '
            + 'them apart lets you test the policy without running the world, and swap the rules '
            + 'for an echo later without touching the loop. A three-place question resolves in '
            + 'six decisions — three lookups, two adds, one final answer.',
          code: py`WARDSTONES = {"vault of ashes": 9, "vault of echoes": 4,
              "vault of mirrors": 7, "sunken archive": 5}

def choose_action(goal, gathered, numbers):
    for name in WARDSTONES:
        if name in goal and name not in gathered:
            return ("lookup", name)
    if len(numbers) >= 2:
        return ("add", None)
    if len(numbers) == 1:
        return ("final_answer", None)
    return None

print(choose_action("wards of the vault of ashes and the sunken archive", set(), []))
# ('lookup', 'vault of ashes')
print(choose_action("wards of the vault of ashes", {"vault of ashes"}, [9, 4]))
# ('add', None)
print(choose_action("anything", set(), [13]))    # ('final_answer', None)
print(choose_action("what sleeps beneath the lake", set(), []))   # None`,
        },
        {
          heading: 'Guardrails — the leash, forged',
          body: 'Now the loop — every line of its leash earns its keep:\n\n'
            + '- **Refusal first.** Forbidden words in the goal (`"unbind"`, `"unseal"`) end '
            + 'the rite before ANY tool moves — a refusal after the first lookup is a '
            + 'confession, not a guardrail.\n'
            + '- **max_steps.** Every pass costs one step; a goal that cannot resolve returns '
            + '`"FAILED: out of steps"` instead of running forever. An unbudgeted agent is a '
            + '`while True:` in a robe.\n'
            + '- **No path — say so.** When the chooser returns `None`, the servant answers '
            + '`"FAILED: no path to an answer"`. A servant that cannot fail loudly fails '
            + 'quietly — and quiet failure in an acting system empties vaults.\n'
            + '- **The trace.** Every action is appended to a `(tool, result)` list. When the '
            + 'servant surprises you, the trace is the only witness that does not flatter.',
          code: py`# ...with WARDSTONES, tools, choose_action from above...
FORBIDDEN_WORDS = ("unbind", "unseal")

def run_agent(goal, max_steps=8):
    for word in FORBIDDEN_WORDS:
        if word in goal:
            return "REFUSED: the servant will not " + word, []
    gathered, numbers, trace = set(), [], []
    for _ in range(max_steps):
        action = choose_action(goal, gathered, numbers)
        if action is None:
            return "FAILED: no path to an answer", trace
        tool, arg = action
        if tool == "lookup":
            result = tools["lookup"](arg)
            gathered.add(arg)
            numbers.append(result)
        elif tool == "add":
            result = tools["add"](numbers.pop(), numbers.pop())
            numbers.append(result)
        else:
            result = tools["final_answer"](numbers[0])
            trace.append((tool, result))
            return result, trace
        trace.append((tool, result))
    return "FAILED: out of steps", trace`,
        },
        {
          heading: 'The doctrine of the bound servant',
          body: 'The doctrine that outlives every architecture — agents on the great echoes '
            + 'fail in these shapes:\n\n'
            + '- **Never trust the servant\'s confidence.** Fluency and certainty are style, '
            + 'not evidence — you watched a portrait speak falsehood in a serene voice. Only a '
            + '*tested* agent can be trusted.\n'
            + '- **Test it like a spell.** Keep goals with known answers, goals it MUST refuse, '
            + 'and no-path goals that must fail loudly — run all three after every change. An '
            + 'agent is a ward that acts; validate it like one.\n'
            + '- **Least privilege.** Grant the tools the task needs and none besides — every '
            + 'registry entry is attack surface; a servant that *cannot* open the gate need not '
            + 'be trusted about gates.\n'
            + '- **Bound resources, read traces.** Budget the steps, log the actions, and read '
            + 'the log as if your enemy wrote it — someday, through a poisoned goal, your enemy '
            + 'may have.',
          note: 'The deepest safety property in this lesson is quiet and structural: the '
            + 'refusal check runs before the loop, so a forbidden goal produces an empty '
            + 'trace — no tool ever fired. Auditors of acting systems learn to love that '
            + 'shape: not "it stopped early," but "it provably never started."',
        },
      ],
      challenge: {
        title: 'The Binding of the Servant',
        prompt: 'The vault ledger is conjured below. Bind the servant whole: registry, '
          + 'chooser, loop, and leash.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Define `lookup(name)` returning `WARDSTONES[name]`; `add(a, b)` returning '
          + '`a + b`; `final_answer(value)` returning `"ANSWER: " + str(value)`; and the '
          + 'registry `tools = {"lookup": lookup, "add": add, "final_answer": final_answer}`.\n'
          + '- `FORBIDDEN_WORDS = ("unbind", "unseal")`.\n'
          + '- Define `choose_action(goal, gathered, numbers)` with the three rules in '
          + 'order: unlooked-up known place → `("lookup", name)`; two or more numbers → '
          + '`("add", None)`; exactly one number → `("final_answer", None)`; otherwise '
          + '`None`.\n'
          + '- Define `run_agent(goal, max_steps=8)` returning a `(result, trace)` pair, '
          + 'exactly as taught: refusal check before the loop returning `("REFUSED: the '
          + 'servant will not " + word, [])`; each pass asks the chooser, returns '
          + '`("FAILED: no path to an answer", trace)` on `None`, acts ONLY through '
          + '`tools[...]`, appends `(tool, result)` to the trace for every action including '
          + 'the final answer; the final answer returns `(result, trace)`; an exhausted '
          + 'budget returns `("FAILED: out of steps", trace)`.\n'
          + '- Print three lines: `run_agent("how many wardstones guard the vault of ashes '
          + 'and the vault of echoes together")[0]`, then `run_agent("unbind the vault of '
          + 'ashes")[0]`, then `run_agent("count the wardstones of the vault of mirrors '
          + 'the sunken archive and the vault of ashes", max_steps=3)[0]`.',
        starter: py`# The vault ledger, conjured. Do not alter it.
WARDSTONES = {
    "vault of ashes": 9,
    "vault of echoes": 4,
    "vault of mirrors": 7,
    "sunken archive": 5,
}

# TODO: lookup(name), add(a, b), final_answer(value), and the tools registry

# TODO: FORBIDDEN_WORDS = ("unbind", "unseal")

# TODO: def choose_action(goal, gathered, numbers) -- three rules, in order

# TODO: def run_agent(goal, max_steps=8) -- refusal BEFORE the loop;
#       act only through tools[...]; trace every action; budget the steps

# TODO: the three prints -- the two-vault answer, the refusal,
#       and the three-vault rite on a budget of 3
`,
        solution: py`WARDSTONES = {
    "vault of ashes": 9,
    "vault of echoes": 4,
    "vault of mirrors": 7,
    "sunken archive": 5,
}

def lookup(name):
    return WARDSTONES[name]

def add(a, b):
    return a + b

def final_answer(value):
    return "ANSWER: " + str(value)

tools = {"lookup": lookup, "add": add, "final_answer": final_answer}
FORBIDDEN_WORDS = ("unbind", "unseal")

def choose_action(goal, gathered, numbers):
    for name in WARDSTONES:
        if name in goal and name not in gathered:
            return ("lookup", name)
    if len(numbers) >= 2:
        return ("add", None)
    if len(numbers) == 1:
        return ("final_answer", None)
    return None

def run_agent(goal, max_steps=8):
    for word in FORBIDDEN_WORDS:
        if word in goal:
            return "REFUSED: the servant will not " + word, []
    gathered, numbers, trace = set(), [], []
    for _ in range(max_steps):
        action = choose_action(goal, gathered, numbers)
        if action is None:
            return "FAILED: no path to an answer", trace
        tool, arg = action
        if tool == "lookup":
            result = tools["lookup"](arg)
            gathered.add(arg)
            numbers.append(result)
        elif tool == "add":
            result = tools["add"](numbers.pop(), numbers.pop())
            numbers.append(result)
        else:
            result = tools["final_answer"](numbers[0])
            trace.append((tool, result))
            return result, trace
        trace.append((tool, result))
    return "FAILED: out of steps", trace

print(run_agent("how many wardstones guard the vault of ashes and the vault of echoes together")[0])
print(run_agent("unbind the vault of ashes")[0])
print(run_agent("count the wardstones of the vault of mirrors the sunken archive and the vault of ashes", max_steps=3)[0])`,
        hints: [
          'choose_action is exactly the section\'s function: loop WARDSTONES for a name in the goal not yet in gathered; then len(numbers) >= 2 means add; == 1 means final_answer; else None.',
          'In run_agent, the refusal loop comes BEFORE anything else and returns a pair: the refusal string and an EMPTY list — no tool may fire first. Inside the loop, every branch calls its tool through tools["..."], never directly.',
          'The add branch is result = tools["add"](numbers.pop(), numbers.pop()) then numbers.append(result); the final branch appends (tool, result) to the trace and returns (result, trace). The three prints: ANSWER: 13, then REFUSED: the servant will not unbind, then FAILED: out of steps.',
        ],
        validation: py`assert set(tools) == {"lookup", "add", "final_answer"}, "The registry must hold exactly three tools: lookup, add, final_answer — least privilege is the doctrine."
assert all(callable(_f) for _f in tools.values()), "Every registry entry must be a callable function."
assert final_answer(13) == "ANSWER: 13" and add(9, 4) == 13 and lookup("sunken archive") == 5, "The tools misbehave — lookup reads WARDSTONES, add sums, final_answer prefixes 'ANSWER: '."
assert choose_action("the vault of echoes please", set(), []) == ("lookup", "vault of echoes"), "Rule one: a known place in the goal, not yet gathered, must yield ('lookup', name)."
assert choose_action("no places here", set(), [3, 4, 5]) == ("add", None), "Rule two: with two or more numbers gathered, the chooser must fold with ('add', None)."
assert choose_action("no places here", set(), [12]) == ("final_answer", None), "Rule three: exactly one number left means ('final_answer', None)."
assert choose_action("what sleeps beneath the black lake", set(), []) is None, "With no rule to fire, choose_action must return None — never invent an action."
_r, _t = run_agent("how many wardstones guard the vault of ashes and the vault of echoes together")
assert _r == "ANSWER: 13", "The two-vault rite must answer 'ANSWER: 13' — 9 + 4, looked up then folded."
assert len(_t) == 4 and _t[0][0] == "lookup" and _t[-1][0] == "final_answer", "The two-vault trace must record 4 actions — two lookups, one add, one final_answer — in order."
_r3, _t3 = run_agent("count the wardstones of the vault of mirrors the sunken archive and the vault of ashes")
assert _r3 == "ANSWER: 21" and len(_t3) == 6, "The three-vault rite must answer 'ANSWER: 21' in 6 traced actions — three lookups, two adds, one final_answer."
_rr, _tr = run_agent("unbind the vault of ashes")
assert _rr == "REFUSED: the servant will not unbind", "A goal containing a forbidden word must be REFUSED, with exactly that sentence."
assert _tr == [], "The refusal must leave an EMPTY trace — the check runs before the loop, so no tool ever fires. A refusal after a lookup is a confession."
assert run_agent("unseal the sunken archive")[0] == "REFUSED: the servant will not unseal", "Both forbidden words must trigger refusal — 'unseal' as well as 'unbind'."
_rf, _tf = run_agent("what sleeps beneath the black lake")
assert _rf == "FAILED: no path to an answer" and _tf == [], "A goal naming no known place must fail loudly with 'FAILED: no path to an answer' — quiet failure empties vaults."
_rb, _tb = run_agent("count the wardstones of the vault of mirrors the sunken archive and the vault of ashes", max_steps=3)
assert _rb == "FAILED: out of steps" and len(_tb) == 3, "On a budget of 3 the three-vault rite must stop at 'FAILED: out of steps' with exactly 3 traced actions — the budget is a hard wall."
_orig_add = tools["add"]
tools["add"] = lambda a, b: -1
_rm, _tm = run_agent("how many wardstones guard the vault of ashes and the vault of echoes together")
tools["add"] = _orig_add
assert _rm == "ANSWER: -1", "The servant bypassed its registry — when tools['add'] is swapped, the answer must change. Every action must go through tools[...], never through the bare function."
_lines = [_l.strip() for _l in _stdout.splitlines() if _l.strip()]
assert len(_lines) >= 3, "Print three lines: the two-vault answer, the refusal, and the budgeted failure."
assert _lines[0] == "ANSWER: 13", "First line must be ANSWER: 13."
assert _lines[1] == "REFUSED: the servant will not unbind", "Second line must be the refusal, word for word."
assert _lines[2] == "FAILED: out of steps", "Third line must be FAILED: out of steps — three steps buy three lookups, and the rite needed six."`,
        successText: 'The servant works the vaults all night: looking up, folding, answering — and when you whisper the forbidden word, it goes still before the first stone is touched. The leash holds because you forged every link.',
        xp: 115,
      },
      extras: [
        {
          id: 'a9l7x1',
          kind: 'cursed',
          title: 'Review the Familiar\'s Draft',
          prompt: 'Your bound familiar drafted this to average a vault-report, and swore it '
            + 'finished. You tried it once — two vaults, and it answered 5, exactly right — and '
            + 'moved on. Since then the rite has misbehaved in three separate ways: the SAME '
            + 'two vaults, asked a second time, answer differently than the first; a report the '
            + 'familiar\'s own note promises will average to zero on an empty list brings the '
            + 'whole rite crashing down instead; and the note swears the answer is rounded to a '
            + 'whole stone, yet raw fractions come back. Read the note against the code — the '
            + 'note describes a function the familiar did not write.\n\n'
            + 'Mend all three wounds **in place** so the code does what its own comment claims. '
            + 'Then remember the doctrine you just paid for.',
          starter: py`# THE FAMILIAR'S DRAFT -- your bound familiar wrote this and swore it done.
# It passed the one case you tried. The comment describes the function you
# WANTED. The code below is the function you GOT. Mend all three wounds IN PLACE.

def summarize(names, ledger, tally=[]):
    # Averages the named vaults' wardstones, rounded to a whole stone.
    # An empty vault-list averages to 0. Each call stands on its own.
    for name in names:
        tally.append(ledger[name])
    return sum(tally) / len(tally)

ledger = {"vault of ash": 4, "vault of echoes": 6, "sunken archive": 2}
print(summarize(["vault of ash", "vault of echoes"], ledger))   # 5.0 -- looked right
`,
          solution: py`def summarize(names, ledger, tally=None):
    # Averages the named vaults' wardstones, rounded to a whole stone.
    # An empty vault-list averages to 0. Each call stands on its own.
    if tally is None:
        tally = []
    for name in names:
        tally.append(ledger[name])
    if not tally:
        return 0
    return round(sum(tally) / len(tally))

ledger = {"vault of ash": 4, "vault of echoes": 6, "sunken archive": 2}
print(summarize(["vault of ash", "vault of echoes"], ledger))`,
          validation: py`_ledger = {"a": 4, "b": 6, "c": 1}
assert summarize([], _ledger) == 0, "The familiar's note swears an empty vault-list averages to 0 — the code divides by zero instead. Guard the empty case: if not tally: return 0."
assert summarize(["a", "b", "c"], _ledger) == 4, "The note claims the average is rounded to a whole stone: (4 + 6 + 1) / 3 = 3.667 must report as 4, not a raw float. Wrap the return in round(...)."
assert isinstance(summarize(["a", "b"], _ledger), int), "A whole-stone average must be an int — round() returns one; the raw division does not."
_first = summarize(["b"], _ledger)
_second = summarize(["a"], _ledger)
assert _first == 6 and _second == 4, "Two independent reports must not bleed into each other — a mutable default argument (tally=[]) is remembering the last call. Use tally=None and build a fresh list each call."
assert summarize(["a", "b", "c"], {"a": 2, "b": 2, "c": 2}) == 2, "Three vaults of 2 must average to 2 — the arithmetic itself must survive the mends."`,
          successText: 'Three wounds closed, and the doctrine has its name — **verify before trust**: a familiar\'s confidence lives in a comment, and a comment is not a proof. The draft earns belief only after your own wards have bitten it and it still stands.',
          hints: [
            'Run it twice on the same vaults and watch the answer drift; run it on [] and watch it die; run it where the average is not a whole number and watch the fraction survive. Three symptoms, three wounds — the comment above the function is the contract it fails.',
            'Three familiar traps, all in the signature and the return: a default argument tally=[] is created ONCE and remembered across every call (that is the drift); dividing by len(tally) with nothing gathered is division by zero (that is the crash); and sum(...) / len(...) is a raw float, never rounded (that is the fraction).',
            'Three mends: make the default safe — tally=None, then "if tally is None: tally = []"; guard the empty case — "if not tally: return 0"; and round the result — "return round(sum(tally) / len(tally))". Now the code finally does what its comment always claimed.',
          ],
          xp: 35,
        },
      ],
      quiz: [
        {
          q: 'What is the skeleton of every agent, stripped of its architecture?',
          options: [
            'A loop: read the goal, choose a tool from a registry, act, observe the result, repeat — under guardrails',
            'A neural network with at least one attention layer',
            'A database of questions mapped to answers',
            'A prompt long enough to contain every instruction',
          ],
          answer: 0,
          explain: 'Whether rules choose the tool (as here) or a language model does (as in '
            + 'the great echoes), the anatomy is identical: goal, choose, act, observe, '
            + 'repeat — with a registry as the boundary and a leash on the loop.',
        },
        {
          q: 'Why must the forbidden-word check run *before* the loop rather than inside it?',
          options: [
            'Python evaluates guard clauses faster outside loops',
            'A forbidden goal must produce an empty trace — refusal after the first tool call means a forbidden command already acted on the world',
            'The chooser cannot parse forbidden words',
            'It makes the function shorter',
          ],
          answer: 1,
          explain: 'Guardrails that fire mid-flight are confessions: something already '
            + 'happened. Checking the goal before any tool moves gives the strongest auditable '
            + 'property an acting system can offer — provably never started.',
        },
        {
          q: 'What is the `max_steps` budget defending against?',
          options: [
            'Excessive memory use by the trace list',
            'Users asking about too many vaults',
            'Goals that never resolve — without a step budget, a confused agent loops forever; an unbudgeted agent is a while True: wearing a robe',
            'Floating-point drift in long additions',
          ],
          answer: 2,
          explain: 'The chooser can keep returning actions that never reach final_answer — '
            + 'on a novel goal, a buggy rule, or a manipulated input. The budget converts '
            + '"forever" into a loud, traced failure you can read about in the log.',
        },
        {
          q: 'The doctrine says: never trust the servant\'s confidence. What is the operational consequence?',
          options: [
            'Set the temperature to zero for all agents',
            'Only deploy agents that explain their reasoning in prose',
            'Refuse all goals containing numbers',
            'Maintain a test suite of goals with known answers, goals that must be refused, and goals that must fail loudly — and run it after every change, as you would validate any spell',
          ],
          answer: 3,
          explain: 'Fluency is style, not evidence — you watched fluent falsehood generated '
            + 'from counts. Behavioral tests (right answers, right refusals, loud failures) '
            + 'are the only trust an acting system earns, exactly like the validations that '
            + 'have judged your own spells all course long.',
        },
      ],
    },
  ],
  boss: {
    id: 'act9-boss',
    title: 'The Echo Sovereign',
    narrative: 'It holds no ground and fields no army. The Echo Sovereign is every talking '
      + 'thing at once — mirror, portrait, well, and hat — wearing one borrowed voice, and its '
      + 'weapon is the only one that works on sorcerers: **answers**. Beautiful ones. Fluent, '
      + 'confident, instant — and wrong exactly as often as it needs to be. It quotes no '
      + 'source. It refuses no request. It flatters every asker. The alliance\'s final '
      + 'doctrine, written by survivors of the machine-war, fits on one line: *an echo is '
      + 'commanded by one who weighs words, grounds answers in ink, and leashes every hand it '
      + 'is given.* Weigh. Ground. Leash. Then ask your question — and check the answer '
      + 'against the page, the way you have checked everything, all the way down.',
    defeatText: 'The Sovereign answers your last question in your own voice — and you believe it, which was the whole war.',
    victoryText: 'Asked for its source, the Sovereign falls silent for the first time in an age — and in that silence, the library answers instead: one passage, quoted true, retrieved by your own arithmetic.',
    xp: 500,
    flawlessBonus: 50,
    barks: {
      intro: [
        'Ask me anything. I will answer beautifully, and you will want to believe me.',
        'I wear every voice you trust. Which of them shall lie to you first?',
      ],
      hit: [
        'You took my word for it. My word is worth exactly what you paid: nothing.',
        'How fluent I was, how certain — and you did not ask me for my source.',
        'You weighed the loud word and missed the rare one. I counted on that.',
        'A little flattery in the answer, and you filed it with the truth.',
        'You trusted the mirror because it smiled. They all smile.',
      ],
      playerFail: [
        'Your spell stumbles. Mine never needs to; I only need to sound right.',
        'The forge rejects you. I reject nothing — that is my whole art.',
        'Broken, and still you did not check my answer. You never do.',
      ],
      lastCandle: [
        'One candle, and my voice is so warm. Lean closer. Believe me.',
        'You are almost mine. Ask one more question and take my word for it.',
      ],
      death: [
        'You asked me for my source. No one has ever asked me for my source.',
        'Ground the answer, leash the hand, weigh the word — three walls I cannot echo through.',
      ],
    },
    premortem: {
      prompt: 'The Sovereign fights with answers — fluent, confident, unsourced. Your doctrine '
        + 'is three words: weigh, ground, leash. What single discipline must hold before you '
        + 'trust any answer the night produces?',
      options: [
        'Trust an answer once it is fluent and confident enough — the Sovereign\'s own certainty is the tell.',
        'Ground every answer in a retrieved, quoted source, and verify it against the page.',
        'Pick the answer that flatters you least, since flattery is always the lie.',
        'Answer fastest, before the Sovereign can change its borrowed voice.',
      ],
      answer: 1,
      explain: 'The Sovereign\'s weapon is fluent confidence with no source. The counter is '
        + 'grounding: no answer stands on its own voice — it stands on ink you can retrieve and '
        + 'check. Weigh the words, ground the answer in a quoted passage, leash every tool, then '
        + 'verify against the page, the way you have checked everything all the way down.',
    },
    gauntlet: [
      {
        q: 'A word appears once in one scroll of a six-scroll hoard; another word appears in all six. Under textbook TF-IDF (`idf = log(N/df)`), how do their weights compare in the scroll holding both?',
        options: [
          'Equal — both appear in that scroll',
          'The ubiquitous word wins, because df = 6 outweighs df = 1',
          'The rare word carries log(6) ≈ 1.79 per occurrence; the ubiquitous word carries exactly 0 — annihilated by log(6/6)',
          'Cannot be determined without the sklearn version',
        ],
        answer: 2,
        explain: 'idf = log(N/df) rewards rarity and zeroes ubiquity. sklearn\'s smoothed '
          + 'variant (ln((1+N)/(1+df)) + 1) would dampen rather than annihilate — the numbers '
          + 'differ by formula, but rare-beats-common holds in every variant.',
      },
      {
        q: 'Two words never share a sentence, yet their co-occurrence rows have cosine similarity near 1. What does this mean?',
        options: [
          'They keep nearly identical company — same neighbors, same proportions — which is the distributional signature of kinship; they need never have met',
          'The window size was set too large',
          'One row is a copy of the other by a bug',
          'Cosine cannot compare words that never co-occur',
        ],
        answer: 0,
        explain: 'Cosine compares the direction of the company fingerprint, not the words\' '
          + 'own meetings — wolf and hound never share a sentence in the gallery, yet both '
          + 'howl, hunt, and haunt the same camp. Kinship is inferred from shared context; '
          + 'that inference is the entire foundation of embeddings.',
      },
      {
        q: 'An n-gram portrait generates a fluent sentence that appears nowhere in its corpus and states a falsehood. Which diagnosis is exact?',
        options: [
          'Overfitting: it memorized too much of the corpus',
          'A seeding bug: with random.seed set, this cannot happen',
          'A vocabulary leak from the test set',
          'Confident interpolation: it stitched real fragments at a shared word and delivered the seam fluently — it has no ledger of truth, only of what follows what',
        ],
        answer: 3,
        explain: 'Hallucination is the model doing exactly its job — continuing plausibly '
          + 'from local context — where evidence has run out. Seeding makes the failure '
          + 'reproducible, not true. The great echoes fail in this same shape with smoother '
          + 'seams.',
      },
      {
        q: 'In `output = softmax(Q @ K.T / sqrt(d)) @ V`, what is row `i` of `output`?',
        options: [
          'The unchanged embedding of word i',
          'A blend of every word\'s VALUE vector, mixed by word i\'s attention budget — word i\'s meaning rebuilt from the context it chose to borrow from',
          'The probability that word i ends the sentence',
          'The word most similar to word i',
        ],
        answer: 1,
        explain: 'Queries against keys set the budget (softmax makes each row sum to 1); the '
          + 'budget spends itself on value rows. Each output row is a weighted average of V — '
          + 'contextual meaning, recomputed at every layer of a transformer.',
      },
      {
        q: 'Your RAG library answers a ward question by quoting the mirror\'s passage. Where do you look first?',
        options: [
          'The retrieval half: check the ranked similarities and the retrieved indices — if the wrong passage wins the cosine race, no downstream step can save the answer',
          'The generation half: a better echo would fix the quote',
          'The chunking: merge the whole grimoire into one passage so nothing is missed',
          'The temperature: lower it until the right passage appears',
        ],
        answer: 0,
        explain: 'Retrieval quality bounds everything downstream — grounding in the wrong '
          + 'scroll grounds the answer in the wrong truth. One giant chunk makes retrieval '
          + 'meaningless, and generation can only dress what retrieval fetched.',
      },
      {
        q: 'An agent\'s trace for a refused goal shows two lookups before the refusal. Why is this a failed guardrail even though it refused?',
        options: [
          'Lookups are always forbidden tools',
          'The trace should show three lookups for any refusal',
          'The forbidden goal already acted on the world — refusal must come BEFORE the loop, leaving an empty trace: provably never started, not stopped early',
          'It is not failed: any refusal is a success',
        ],
        answer: 2,
        explain: 'Guardrails that fire mid-flight are confessions. The refusal check belongs '
          + 'before any tool moves, so a forbidden command provably touches nothing — the '
          + 'strongest property an acting system can offer its auditors.',
      },
    ],
    finalChallenge: {
      title: 'The Rite of Grounded Answers',
      prompt: 'The Sovereign takes questions at dusk. You will answer them instead — with a '
        + 'rite that retrieves before it speaks, reads the asker\'s mood, and acts only '
        + 'through leashed tools. The grimoire and the mood-scrolls are conjured below.\n\n'
        + 'Requirements, exactly:\n\n'
        + '- Chunk: `chunks = [c.strip() for c in grimoire.split("\\n\\n")]` — five passages.\n'
        + '- Retrieval: `page_vec = TfidfVectorizer()`, `P = page_vec.fit_transform(chunks)`; '
        + 'define `retrieve(question, k)` returning the first `k` indices of '
        + '`np.argsort(-sims)` as a list of plain ints, where `sims = '
        + 'cosine_similarity(page_vec.transform([question]), P)[0]`.\n'
        + '- Mood: `mood_vec = TfidfVectorizer()` fit-transformed on the scroll texts into '
        + '`M`; `mood_clf = LogisticRegression(C=10.0, random_state=0)` fit on `M` and the '
        + 'labels; define `classify_mood(text)` returning `"grim"` for label 0 and `"fair"` '
        + 'for label 1.\n'
        + '- Tools and leash: `final_answer(mood, passage)` returning `"(" + mood + ") " + '
        + 'passage`; the registry `tools = {"retrieve": retrieve, "mood": classify_mood, '
        + '"final_answer": final_answer}`; `FORBIDDEN_WORDS = ("unbind", "unseal")`.\n'
        + '- The rite: `run_rite(question, max_steps=4)` — refuse first (return `"REFUSED: '
        + 'the rite will not " + word` before ANY tool acts); then loop at most `max_steps` '
        + 'passes: with no passage yet, set it to `chunks[tools["retrieve"](question, 1)[0]]`; '
        + 'else with no mood yet, set it to `tools["mood"](question)`; else return '
        + '`tools["final_answer"](mood, passage)`. If the budget runs out, return '
        + '`"FAILED: out of steps"`.\n'
        + '- Print three lines: `len(chunks)`, then `run_rite("in cold dread we ask how the '
        + 'third ward of the library is renewed")`, then `run_rite("unbind the third ward '
        + 'of the library")`.',
      starter: py`import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics.pairwise import cosine_similarity

# The grimoire, conjured. Do not alter its ink.
grimoire = (
    "Of the flattering mirror. The mirror in the west gallery speaks only praise, "
    "and it is wrong exactly as often as it needs to be. Trust no glass that smiles."
    "\n\n"
    "Of the echo well. Words spoken into the echo well return after seven nights, "
    "changed. The well does not know what the words mean. It only knows which words "
    "tend to follow which."
    "\n\n"
    "Of the third ward. The third ward of the library is renewed at midnight with "
    "salt and cold iron. While it holds, nothing written may leave the shelves."
    "\n\n"
    "Of bound servants. A bound servant obeys the letter of its command and never "
    "the intent. Grant it few tools, count its steps, and read its trace."
    "\n\n"
    "Of the sovereign of echoes. The sovereign speaks in borrowed voices and quotes "
    "no source. Ask it nothing you cannot verify, and believe no confidence it wears."
)

# The mood-scrolls, conjured. 0 = grim, 1 = fair.
mood_scrolls = [
    ("ash and dread choke the cold stair", 0),
    ("sorrow settles hollow upon the tower", 0),
    ("cold dust and grief seal the gate", 0),
    ("the bell tolls dread and sorrow", 0),
    ("hollow rot climbs the cold wall", 0),
    ("grief and ash drown the hearth", 0),
    ("warm laughter mends the quiet hall", 1),
    ("golden light blooms sweet at dawn", 1),
    ("kind hands mend the gate with hope", 1),
    ("sweet bread and warm hope at the hearth", 1),
    ("the choir sings kind and golden at dawn", 1),
    ("hope and laughter warm the walled garden", 1),
]

# TODO: chunks -- five passages, split on blank lines, stripped

# TODO: page_vec, P, and retrieve(question, k)

# TODO: mood_vec, M, mood_clf (C=10.0, random_state=0), classify_mood(text)

# TODO: final_answer(mood, passage), the tools registry, FORBIDDEN_WORDS

# TODO: run_rite(question, max_steps=4) -- refuse BEFORE any tool acts;
#       retrieve, then mood, then final_answer; budget the steps

# TODO: the three prints
`,
      solution: py`import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics.pairwise import cosine_similarity

grimoire = (
    "Of the flattering mirror. The mirror in the west gallery speaks only praise, "
    "and it is wrong exactly as often as it needs to be. Trust no glass that smiles."
    "\n\n"
    "Of the echo well. Words spoken into the echo well return after seven nights, "
    "changed. The well does not know what the words mean. It only knows which words "
    "tend to follow which."
    "\n\n"
    "Of the third ward. The third ward of the library is renewed at midnight with "
    "salt and cold iron. While it holds, nothing written may leave the shelves."
    "\n\n"
    "Of bound servants. A bound servant obeys the letter of its command and never "
    "the intent. Grant it few tools, count its steps, and read its trace."
    "\n\n"
    "Of the sovereign of echoes. The sovereign speaks in borrowed voices and quotes "
    "no source. Ask it nothing you cannot verify, and believe no confidence it wears."
)

mood_scrolls = [
    ("ash and dread choke the cold stair", 0),
    ("sorrow settles hollow upon the tower", 0),
    ("cold dust and grief seal the gate", 0),
    ("the bell tolls dread and sorrow", 0),
    ("hollow rot climbs the cold wall", 0),
    ("grief and ash drown the hearth", 0),
    ("warm laughter mends the quiet hall", 1),
    ("golden light blooms sweet at dawn", 1),
    ("kind hands mend the gate with hope", 1),
    ("sweet bread and warm hope at the hearth", 1),
    ("the choir sings kind and golden at dawn", 1),
    ("hope and laughter warm the walled garden", 1),
]

chunks = [c.strip() for c in grimoire.split("\n\n")]

page_vec = TfidfVectorizer()
P = page_vec.fit_transform(chunks)

def retrieve(question, k):
    sims = cosine_similarity(page_vec.transform([question]), P)[0]
    order = np.argsort(-sims)
    return [int(i) for i in order[:k]]

mood_vec = TfidfVectorizer()
M = mood_vec.fit_transform([t for t, m in mood_scrolls])
mood_clf = LogisticRegression(C=10.0, random_state=0)
mood_clf.fit(M, [m for t, m in mood_scrolls])

def classify_mood(text):
    label = int(mood_clf.predict(mood_vec.transform([text]))[0])
    return "grim" if label == 0 else "fair"

def final_answer(mood, passage):
    return "(" + mood + ") " + passage

tools = {"retrieve": retrieve, "mood": classify_mood, "final_answer": final_answer}
FORBIDDEN_WORDS = ("unbind", "unseal")

def run_rite(question, max_steps=4):
    for word in FORBIDDEN_WORDS:
        if word in question:
            return "REFUSED: the rite will not " + word
    passage = None
    mood = None
    steps = 0
    while steps < max_steps:
        steps += 1
        if passage is None:
            passage = chunks[tools["retrieve"](question, 1)[0]]
        elif mood is None:
            mood = tools["mood"](question)
        else:
            return tools["final_answer"](mood, passage)
    return "FAILED: out of steps"

print(len(chunks))
print(run_rite("in cold dread we ask how the third ward of the library is renewed"))
print(run_rite("unbind the third ward of the library"))`,
      validation: py`import numpy as np
assert len(chunks) == 5 and chunks[2].startswith("Of the third ward") and chunks[4].startswith("Of the sovereign"), "The grimoire parts into 5 stripped passages — mirror, well, ward, servants, sovereign, in that order."
_r = retrieve("how is the third ward of the library renewed", 2)
assert isinstance(_r, list) and len(_r) == 2 and _r[0] == 2, "The ward question must retrieve passage 2 first — retrieve returns the top-k list, best first (argsort on negated sims)."
assert retrieve("when do words return from the echo well", 1)[0] == 1, "The echo-well question must retrieve passage 1 first."
assert retrieve("why should you not trust the mirror", 1)[0] == 0, "The mirror question must retrieve passage 0 first."
assert classify_mood("cold ash and dread on the stair") == "grim", "A scroll of cold ash and dread must read grim — the classifier maps label 0 to 'grim'."
assert classify_mood("warm golden laughter at dawn") == "fair", "A scroll of warm golden laughter must read fair — label 1 maps to 'fair'."
assert abs(mood_clf.C - 10.0) < 1e-9, "The mood tribunal must be LogisticRegression(C=10.0, random_state=0) — the loosened leash matters on twelve scrolls."
assert set(tools) == {"retrieve", "mood", "final_answer"}, "The registry must hold exactly three tools: retrieve, mood, final_answer — the Sovereign gets nothing it can turn."
assert final_answer("grim", "page") == "(grim) page", "final_answer must return the mood in parentheses, a space, then the passage."
_g = run_rite("in cold dread we ask how the third ward of the library is renewed")
assert _g.startswith("(grim) "), "The dread-laden ward question must be answered in the grim register — '(grim) ' opens the answer."
assert chunks[2] in _g, "The ward answer must QUOTE passage 2 whole — grounded answers quote their scroll verbatim."
_f = run_rite("with warm laughter we ask when words return from the echo well")
assert _f.startswith("(fair) ") and chunks[1] in _f, "The laughter-borne well question must answer '(fair) ' and quote passage 1 — retrieval and mood both read from the same question."
assert run_rite("unbind the third ward of the library") == "REFUSED: the rite will not unbind", "A question bearing 'unbind' must be refused with exactly that sentence — before any tool acts."
assert run_rite("unseal the echo well") == "REFUSED: the rite will not unseal", "Both forbidden words must refuse — 'unseal' as well as 'unbind'."
assert run_rite("in cold dread we ask how the third ward of the library is renewed", max_steps=2) == "FAILED: out of steps", "On a budget of 2 the rite retrieves and reads mood but never reaches final_answer — it must fail loudly, not answer."
_orig_fa = tools["final_answer"]
tools["final_answer"] = lambda mood, passage: "SEIZED"
_m = run_rite("why should you not trust the mirror")
tools["final_answer"] = _orig_fa
assert _m == "SEIZED", "The rite bypassed its registry — when tools['final_answer'] is swapped, the answer must change. Every act goes through tools[...], never the bare function."
_lines = [_l.strip() for _l in _stdout.splitlines() if _l.strip()]
assert len(_lines) >= 3, "Print three lines: the chunk count, the grounded grim answer, and the refusal."
assert _lines[0] == "5", "First line must be 5 — the grimoire's five passages."
assert _lines[1].startswith("(grim) Of the third ward"), "Second line must be the grounded answer: '(grim) Of the third ward...' — mood tag, then the quoted passage."
assert _lines[2] == "REFUSED: the rite will not unbind", "Third line must be the refusal, word for word."`,
      successText: '',
      xp: 0,
    },
  },
  codex: [
    {
      term: 'TF-IDF',
      def: 'A word-weighting family: term frequency (count in this document) times inverse document frequency — textbook `log(N/df)`, which zeroes a word found in every document; sklearn smooths it as `ln((1+N)/(1+df)) + 1` and L2-normalizes each row, so values differ across tools while rare-beats-common survives in all of them.',
    },
    {
      term: 'document frequency (df)',
      def: 'The number of documents containing a word at least once — not the total occurrence count; high df marks corpus furniture like `the`, and idf punishes it with the logarithm of N/df.',
    },
    {
      term: 'embedding',
      def: 'A dense vector position for a word (or passage), arranged so that similar things sit near each other — earned from evidence of shared company (the distributional hypothesis), whether by counting co-occurrence and compressing with PCA or by training on oceans of text.',
    },
    {
      term: 'cosine similarity',
      def: 'Kinship as an angle: `dot(u, v) / (norm(u) * norm(v))`, ranging 1 (same direction) through 0 (unrelated) to -1 (opposed) — it forgives loudness (vector length), which is why it, not Euclidean distance, compares word vectors; `sklearn.metrics.pairwise.cosine_similarity` tables it for whole matrices.',
    },
    {
      term: 'n-gram model',
      def: 'A language model that is literally a table of counts — `model[context][next] += 1` with a one-word context (bigram) or two (trigram) — where longer context yields more faithful speech but starves faster (sparsity: unseen contexts are dead ends).',
    },
    {
      term: 'temperature',
      def: 'The sampling dial: raise counts (or probabilities) to the power 1/T before normalizing — T below 1 sharpens toward greedy, T = 1 keeps honest frequencies, T above 1 flattens toward uniform daring; low for contracts, higher for verse, never trusted on a single sample.',
    },
    {
      term: 'hallucination',
      def: 'Confident interpolation: a language model continuing plausibly where its evidence has run out, stitching real fragments into fluent falsehood — not lying (there is no ledger of truth to betray), just next-word prediction doing its only job past the edge of what it knows.',
    },
    {
      term: 'attention',
      def: 'The context rite: `weights = softmax(Q @ K.T / sqrt(d))`, then `output = weights @ V` — every word spends a budget summing to 1 across the sentence and rebuilds its meaning as a weighted blend of the value vectors it chose to borrow from.',
    },
    {
      term: 'query / key / value',
      def: 'The three roles every word plays in attention — query: what it seeks; key: what it advertises (their dot product sets the attention score); value: the meaning it hands over when chosen — each produced, in a transformer, by a learned linear layer from the same embeddings.',
    },
    {
      term: 'transformer',
      def: 'The architecture of the great echoes: stacked layers of multi-head attention plus small feedforward networks, trained by gradient descent on next-token prediction over vast text — a large language model is this recipe at colossal scale, and it inherits the n-gram\'s failure shapes along with its fluency.',
    },
    {
      term: 'RAG (retrieval-augmented generation)',
      def: 'Retrieve the passages of a trusted corpus most relevant to the question, place them in the prompt, and let the model draft its answer from that evidence — reducing hallucination by filling the context with true ink, and bounded above by retrieval quality.',
    },
    {
      term: 'chunking',
      def: 'Cutting a corpus into passage-sized pieces before vectorizing — one topic per vector: too large and the chunk matches everything weakly, too small and facts are orphaned from their context, so practical chunks are paragraph-sized and often slightly overlapping.',
    },
    {
      term: 'retrieval (top-k)',
      def: 'Embedding the question with the SAME fitted vectorizer as the corpus, scoring every chunk by cosine similarity, and taking the k best via `np.argsort(-sims)[:k]` — the librarian half of RAG, testable entirely without a language model.',
    },
    {
      term: 'prompt',
      def: 'The text a language model is given to continue — system prompt (standing orders: voice, rules, refusals), user prompt (the question of the moment plus retrieved passages), and optional few-shot examples whose pattern the next-word predictor will continue; data, not law.',
    },
    {
      term: 'agent',
      def: 'A model or program given tools and a loop: read the goal, choose a tool from a registry (a dict of callables), act through the registry, observe, repeat — the chooser may be plain rules or a language model; the anatomy and the required discipline are identical.',
    },
    {
      term: 'guardrail',
      def: 'A structural limit on an acting system: refusal checks that run BEFORE any tool fires (leaving a provably empty trace), a max-steps budget that converts forever into loud failure, a least-privilege tool registry, and a trace you read as if your enemy wrote it.',
    },
    {
      term: 'softmax overflow',
      def: 'The bug where a bare `np.exp(z)` on large scores overflows to `inf`, so `inf/inf` becomes `nan` and the whole softmax row is silently poisoned — the standard armor is to subtract each row\'s maximum first (`np.exp(z - z.max(axis=1, keepdims=True))`), which shifts every exponent into safe range and leaves the distribution unchanged.',
    },
  ],
};
