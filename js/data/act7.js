// ============================================================
// act7.js — Act VII: The Palantír
// Machine Divination — probability and Bayes' rule, the Fourier
// transform, the scikit-learn discipline: features and labels,
// train/test splits, scaling, K-Means and the elbow, DBSCAN and
// PCA, trees and forests, and honest evaluation with confusion
// matrices, precision, and recall.
// ============================================================

const py = String.raw;

export default {
  id: 'act7',
  numeral: 'VII',
  arc: 'Machine Divination',
  title: 'The Palantír',
  tagline: 'The stone shows true patterns to the disciplined and comfortable lies to everyone else.',
  sigil: '🔮',
  epigraph: {
    text: 'The stone does not lie. It shows fragments, and waits for the proud to assemble the rest themselves.',
    source: 'a warning pressed into the flyleaf of the Anor ledgers',
  },
  intro: 'A seeing-stone has come into your keeping. It is older than any art in this Codex, and it '
    + 'has outlived every hand that held it, because it grants exactly what is asked of it and not '
    + 'one grain more. Feed it corrupted measures and it will show you corrupted visions, rendered '
    + 'beautifully. Ask it to confirm what you already believe and it will oblige you unto ruin. '
    + 'This is **machine learning** stripped of its pageantry: models that find patterns in data, '
    + 'and the discipline that keeps those patterns from being flattery.\n\n'
    + 'In this final act you will learn to read omens as probabilities and turn them with **Bayes\' '
    + 'rule**, to hear machinery hidden in noise with the **Fourier transform**, and then to work '
    + 'the stone itself through **scikit-learn**: splitting data you train on from data you judge '
    + 'by, scaling features so no single measure shouts down the rest, clustering with **K-Means** '
    + 'and **DBSCAN**, flattening high dimensions with **PCA**, raising councils of trees, and — '
    + 'last and hardest — evaluating your visions with metrics that cannot be sweet-talked. '
    + 'When you first summon the deeper libraries (`numpy`, `sklearn`), the Forge takes a long '
    + 'moment to haul them up from the dark. Let it. Some doors are heavy for good reasons.',
  lessons: [
    // ------------------------------------------------------------------
    // a7l1 — Reading the Omens
    // ------------------------------------------------------------------
    {
      id: 'a7l1',
      title: 'Reading the Omens',
      concept: 'probabilities from counted data, conditional probability, Bayes\' rule, and log-space against underflow',
      xp: 38,
      narrative: 'Before you dare the stone, you must learn what the old wardens of the Greywatch '
        + 'knew without naming it. Their night-ledgers survive: two hundred forty nights, each '
        + 'marked for whether the moon rose the color of an opened vein, and whether orcs came '
        + 'before dawn. The wardens did not divine. They *counted*. Every prophecy that has ever '
        + 'held is a fraction with a body count in the numerator — and the arithmetic of such '
        + 'fractions, turned formal, is called probability. It is the grammar in which the '
        + 'palantír will speak to you. Learn it, or be spoken to.',
      sections: [
        {
          heading: 'Counting is the whole secret',
          body: 'A **probability** is a fraction of outcomes: out of everything that happened, how '
            + 'often did *this* happen? From data, you estimate it by counting. A boolean NumPy '
            + 'array makes this almost insultingly easy — `True` counts as 1, `False` as 0, so '
            + '`.mean()` *is* the fraction of nights the thing occurred, and `.sum()` is the raw '
            + 'count.\n\n'
            + '- `P(omen)` — the probability a random night bears the omen — is `omen.mean()`.\n'
            + '- The **joint** probability `P(omen AND raid)` is `(omen & raid).mean()` — the `&` '
            + 'operator keeps only nights where both are `True`.',
          code: py`import numpy as np

# Twelve nights of a watch-ledger: True = it happened.
omen = np.array([1,1,0,0,1,0,0,1,0,0,1,0], dtype=bool)
raid = np.array([1,0,0,0,1,0,0,1,0,0,1,0], dtype=bool)

print(omen.mean())            # 0.4166666666666667 -> P(omen), 5 of 12
print(raid.mean())            # 0.3333333333333333 -> P(raid), 4 of 12
print((omen & raid).sum())    # 4 -> nights bearing both`,
        },
        {
          heading: 'Given that — the conditional turn',
          body: 'The warden\'s real question is sharper: *given* that the moon rose red, how likely '
            + 'is a raid? That is **conditional probability**, written `P(raid | omen)` and read '
            + '"probability of raid given omen". You compute it by shrinking your world: throw '
            + 'away every night without the omen, then count raids among what remains.\n\n'
            + '- `P(raid | omen) = count(raid AND omen) / count(omen)`\n'
            + '- Direction matters. `P(raid | omen)` and `P(omen | raid)` are different questions '
            + 'with different answers — confusing them is the oldest divination error there is.',
          code: py`import numpy as np
omen = np.array([1,1,0,0,1,0,0,1,0,0,1,0], dtype=bool)
raid = np.array([1,0,0,0,1,0,0,1,0,0,1,0], dtype=bool)

both = omen & raid
print(both.sum() / omen.sum())   # 0.8 -> P(raid | omen): 4 of the 5 omen nights
print(both.sum() / raid.sum())   # 1.0 -> P(omen | raid): all 4 raids had the omen`,
          note: 'Read the two lines again. Four raids in twelve nights, yet a red moon turned '
            + 'four of its five appearances into blood. The ledger did not become a prophecy — '
            + 'it became a *conditional* one. That distinction is the hinge of this entire act.',
        },
        {
          heading: 'Bayes\' rule — turning the conditional around',
          body: 'Often you can only measure one direction. Chroniclers record what preceded known '
            + 'raids — `P(omen | raid)` — but the warden on the wall needs the reverse: tonight the '
            + 'omen burns, so what is `P(raid | omen)`? **Bayes\' rule** turns the conditional '
            + 'around using two base rates:\n\n'
            + '- `P(raid | omen) = P(omen | raid) * P(raid) / P(omen)`\n\n'
            + 'Nothing mystical: both sides equal `P(raid AND omen) / P(omen)` once you multiply '
            + 'through. But it lets you convert hindsight into foresight, which is the closest '
            + 'thing to lawful prophecy this Codex will ever teach you.',
          code: py`import numpy as np
omen = np.array([1,1,0,0,1,0,0,1,0,0,1,0], dtype=bool)
raid = np.array([1,0,0,0,1,0,0,1,0,0,1,0], dtype=bool)

p_omen_given_raid = (omen & raid).sum() / raid.sum()   # 1.0 (hindsight)
p_raid = raid.mean()
p_omen = omen.mean()

# Bayes' rule recovers the forward-looking conditional:
print(round(p_omen_given_raid * p_raid / p_omen, 3))   # 0.8 -> P(raid | omen)`,
        },
        {
          heading: 'The whisper that multiplies to nothing',
          body: 'One day you will chain many probabilities together — the likelihood of a whole '
            + 'sequence of independent omens is the *product* of their individual probabilities. '
            + 'Here the machine betrays you: floating-point numbers cannot hold values arbitrarily '
            + 'close to zero. Multiply four hundred factors of `0.00001` and the true answer, '
            + '10 to the -2000th power, is far below what a float can represent — the product '
            + '**underflows** to exactly `0.0`, and every comparison built on it dies.\n\n'
            + 'The escape is **log-space**: since `log(a*b) = log(a) + log(b)`, take `np.log` of '
            + 'each factor and *sum* instead of multiplying. Sums of moderate negative numbers '
            + 'never underflow, and comparisons still work — whichever log-sum is larger, the '
            + 'true product was larger too.',
          code: py`import numpy as np

whispers = np.full(400, 1e-5)          # four hundred faint omens
print(np.prod(whispers))               # 0.0 -- underflow: the truth annihilated
print(np.sum(np.log(whispers)))        # -4605.17018598809 -- finite, comparable, alive`,
          note: 'The stone is a float engine like any other. When your evidence is a long chain '
            + 'of small likelihoods, work in logarithms or watch the chain evaporate. This single '
            + 'trick is what keeps real classifiers of that family breathing.',
        },
      ],
      challenge: {
        title: 'The Warden\'s Arithmetic',
        prompt: 'The full Greywatch ledger is conjured for you: 240 nights, an `omen` array and a '
          + '`raid` array. Turn counting into prophecy.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Define `prob(event)` — takes a boolean array, returns the fraction of `True` entries (use `.mean()`).\n'
          + '- Define `cond_prob(event, given)` — returns `P(event | given)`, computed as `(event & given).sum() / given.sum()`.\n'
          + '- Define `bayes(p_b_given_a, p_a, p_b)` — returns `p_b_given_a * p_a / p_b`.\n'
          + '- Using them, compute `p_raid = prob(raid)`, `p_omen = prob(omen)`, '
          + '`p_raid_given_omen = cond_prob(raid, omen)`, and `p_omen_given_raid = cond_prob(omen, raid)`.\n'
          + '- Set `doomed = np.prod(np.full(400, 1e-5))` and `log_evidence = np.sum(np.log(np.full(400, 1e-5)))` '
          + '— witness the underflow and its cure.\n'
          + '- Print `round(p_raid_given_omen, 3)` — the warden\'s number.',
        starter: py`import numpy as np

# The Greywatch ledger, conjured: 240 nights. Do not alter the conjuring.
rng = np.random.default_rng(0)
nights = 240
omen = rng.random(nights) < 0.30
raid = rng.random(nights) < np.where(omen, 0.75, 0.10)

# TODO: define prob(event) -> fraction of True entries

# TODO: define cond_prob(event, given) -> P(event | given)

# TODO: define bayes(p_b_given_a, p_a, p_b) -> reversed conditional

# TODO: compute p_raid, p_omen, p_raid_given_omen, p_omen_given_raid

# TODO: doomed = product of 400 factors of 1e-5; log_evidence = sum of their logs

# TODO: print round(p_raid_given_omen, 3)
`,
        solution: py`import numpy as np

rng = np.random.default_rng(0)
nights = 240
omen = rng.random(nights) < 0.30
raid = rng.random(nights) < np.where(omen, 0.75, 0.10)

def prob(event):
    return event.mean()

def cond_prob(event, given):
    return (event & given).sum() / given.sum()

def bayes(p_b_given_a, p_a, p_b):
    return p_b_given_a * p_a / p_b

p_raid = prob(raid)
p_omen = prob(omen)
p_raid_given_omen = cond_prob(raid, omen)
p_omen_given_raid = cond_prob(omen, raid)

doomed = np.prod(np.full(400, 1e-5))
log_evidence = np.sum(np.log(np.full(400, 1e-5)))

print(round(p_raid_given_omen, 3))`,
        hints: [
          'prob is one line: return event.mean(). A boolean array\'s mean is the fraction of True.',
          'cond_prob shrinks the world to the "given" nights: return (event & given).sum() / given.sum(). For Bayes, return p_b_given_a * p_a / p_b.',
          'p_raid_given_omen = cond_prob(raid, omen) — event first, condition second. Then doomed = np.prod(np.full(400, 1e-5)), log_evidence = np.sum(np.log(np.full(400, 1e-5))), and print(round(p_raid_given_omen, 3)).',
        ],
        validation: py`import numpy as np
_a = np.array([True, True, False, False])
_b = np.array([True, False, True, False])
assert abs(prob(_a) - 0.5) < 1e-9, "prob() miscounts — it must return the fraction of True entries (event.mean())."
assert abs(prob(np.array([False, False, False])) - 0.0) < 1e-9, "prob() of an all-False array must be 0.0 — no omens, no probability."
assert abs(cond_prob(_a, _b) - 0.5) < 1e-9, "cond_prob() is wrong — P(event|given) = (event & given).sum() / given.sum(). Check which argument you condition on."
assert abs(cond_prob(_b, np.array([True, True, True, True])) - 0.5) < 1e-9, "cond_prob() conditioned on an always-True array must equal the plain probability."
assert abs(bayes(0.9, 0.2, 0.3) - 0.6) < 1e-9, "bayes() must return p_b_given_a * p_a / p_b — with 0.9, 0.2, 0.3 that is 0.6."
_prgo = (raid & omen).sum() / omen.sum()
_pogr = (raid & omen).sum() / raid.sum()
assert abs(p_raid - raid.mean()) < 1e-9, "p_raid must be prob(raid) — the fraction of the 240 nights that bled."
assert abs(p_omen - omen.mean()) < 1e-9, "p_omen must be prob(omen)."
assert abs(p_raid_given_omen - _prgo) < 1e-9, "p_raid_given_omen is off — condition on the omen nights: cond_prob(raid, omen)."
assert abs(p_omen_given_raid - _pogr) < 1e-9, "p_omen_given_raid is off — condition on the raid nights: cond_prob(omen, raid)."
assert abs(bayes(p_omen_given_raid, p_raid, p_omen) - p_raid_given_omen) < 1e-9, "Bayes' rule must turn P(omen|raid) back into P(raid|omen) — check bayes() and your four probabilities."
assert doomed == 0.0, "doomed must be np.prod of 400 factors of 1e-5 — the product underflows to exactly 0.0. That is the lesson."
assert abs(log_evidence - 400 * np.log(1e-5)) < 1e-6, "log_evidence must be the SUM of np.log of the 400 factors — about -4605.17."
assert "0.815" in _stdout, "The warden waits for the number — print(round(p_raid_given_omen, 3)), which is 0.815."`,
        successText: 'The ledger closes itself. You did not prophesy — you counted, which is why you were right.',
        xp: 90,
      },
      quiz: [
        {
          q: 'A ledger shows 60 omen-nights, and raids followed on 45 of them. What is `P(raid | omen)`?',
          options: [
            '45 / 240 — raids over all nights',
            '60 / 240 — the base rate of omens',
            '45 / 60 = 0.75 — raids among omen-nights only',
            '45 / 105 — raids over raids-plus-omens',
          ],
          answer: 2,
          explain: 'Conditioning shrinks the world to the 60 omen-nights, then counts raids among '
            + 'them: 45/60. Dividing by all nights gives the joint probability P(raid AND omen), '
            + 'a different and smaller quantity.',
        },
        {
          q: 'Bayes\' rule computes `P(A | B)` from which three ingredients?',
          options: [
            'P(B | A), P(A), and P(B)',
            'P(A | B), P(B | A), and P(A AND B)',
            'P(A), P(B), and P(A OR B)',
            'Only P(B | A) — the priors cancel out',
          ],
          answer: 0,
          explain: 'P(A|B) = P(B|A) * P(A) / P(B). The reversed conditional is reweighted by the '
            + 'two base rates; drop either prior and the rule collapses into wishful thinking.',
        },
        {
          q: 'You multiply 500 probabilities near `1e-4` and get exactly `0.0`. What happened, and what is the cure?',
          options: [
            'A NumPy bug — casting to float64 fixes it',
            'Floating-point underflow — work in log-space: sum np.log of the factors instead of multiplying',
            'The probabilities were invalid — probabilities cannot be that small',
            'Integer division — add a decimal point to one factor',
          ],
          answer: 1,
          explain: 'The true product is around 10**-2000, far below the smallest positive float, '
            + 'so it underflows to 0.0. Since log(a*b) = log(a) + log(b), summing logs preserves '
            + 'comparisons without ever leaving representable territory.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a7l2 — Drums in the Deep
    // ------------------------------------------------------------------
    {
      id: 'a7l2',
      title: 'Drums in the Deep',
      concept: 'periodic signals, np.fft.rfft/rfftfreq, magnitudes, and finding a dominant frequency in noise',
      xp: 38,
      narrative: 'The gauges of the Dwarrowdark were set into the living rock by masons who never '
        + 'came back up. They still tick: sixty-four tremor readings a second, eight seconds to a '
        + 'scroll. The mountain groans at random — settling stone, water, the occasional collapse. '
        + 'But under the noise the night-warden swears he feels *rhythm*, a beat too patient to be '
        + 'weather. Random things average away. Regular things repeat. The Fourier transform is '
        + 'the instrument that separates the two — and a steady heartbeat buried in noise is how '
        + 'hidden machinery, and hidden marching, always betrays itself.',
      sections: [
        {
          heading: 'What it means to repeat',
          body: 'A **periodic** signal repeats itself on a fixed interval. Its **frequency** is '
            + 'how many repeats fit into one second, measured in hertz (Hz). The purest periodic '
            + 'signal is a sine wave: `np.sin(2 * np.pi * f * t)` oscillates `f` times per second '
            + 'along a time axis `t`.\n\n'
            + '- Build the time axis from your **sampling rate**: `t = np.arange(0, 4, 1/rate)` '
            + 'gives `4 * rate` readings, spaced `1/rate` seconds apart.\n'
            + '- Fourier\'s insight: *any* repeating signal is a sum of sine waves of different '
            + 'frequencies and strengths. Find the strengths, and you know what is repeating '
            + 'inside your data — even when your eye sees only murk.',
          code: py`import numpy as np

rate = 32                        # readings per second
t = np.arange(0, 4, 1 / rate)    # 4 seconds -> 128 readings
wave = np.sin(2 * np.pi * 5.0 * t)   # a pure 5 Hz throb
print(t.size)                    # 128`,
        },
        {
          heading: 'The transform and its bins',
          body: 'The **Discrete Fourier Transform** — `np.fft.rfft(signal)` for real-valued '
            + 'signals — rewrites your time-series as a set of frequency **bins**. Each bin holds '
            + 'a complex number whose magnitude (`np.abs`) says how strongly that frequency '
            + 'sounds in the signal.\n\n'
            + '- `np.fft.rfftfreq(n, d=1/rate)` labels the bins in real hertz — always compute it; '
            + 'guessing bin frequencies by eye is how wardens die.\n'
            + '- `np.argmax(magnitudes)` finds the loudest bin; index `freqs` with it to name the '
            + 'dominant frequency.\n'
            + '- For `n` samples you get `n/2 + 1` bins, from 0 Hz up to `rate/2` — the highest '
            + 'frequency a given sampling rate can faithfully hear.',
          code: py`import numpy as np
rate = 32
t = np.arange(0, 4, 1 / rate)
wave = np.sin(2 * np.pi * 5.0 * t)

mags = np.abs(np.fft.rfft(wave))
freqs = np.fft.rfftfreq(wave.size, d=1 / rate)
print(mags.size)                   # 65 bins for 128 samples
print(freqs[np.argmax(mags)])      # 5.0 -- the transform names the throb exactly`,
        },
        {
          heading: 'The zeroth bin is a trap',
          body: 'Real gauges do not read zero at rest. A constant offset — the standing weight of '
            + 'the mountain — lands entirely in **bin 0**, the 0 Hz "DC" bin, and it is usually '
            + 'the largest magnitude in the whole spectrum. It says nothing about rhythm; it is '
            + 'the average level of the signal wearing a crown.\n\n'
            + '- Skip it when hunting periodicity: `np.argmax(mags[1:]) + 1` finds the loudest '
            + '*oscillating* bin (the `+ 1` restores the index you sliced away).\n'
            + '- Noise, by contrast, smears thinly across *all* bins. A steady drum stacks all its '
            + 'power into one bin, which is why a rhythm invisible in the time plot stands like a '
            + 'tower in the spectrum.',
          code: py`import numpy as np
rate = 32
t = np.arange(0, 4, 1 / rate)
wave = np.sin(2 * np.pi * 5.0 * t)

rng = np.random.default_rng(0)
buried = 2.0 + wave + rng.normal(0.0, 1.0, wave.size)   # offset + drum + noise

mags = np.abs(np.fft.rfft(buried))
freqs = np.fft.rfftfreq(buried.size, d=1 / rate)
print(np.argmax(mags))             # 0 -- the DC bin wins: that is the offset, not the drum
peak = np.argmax(mags[1:]) + 1
print(freqs[peak])                 # 5.0 -- skip bin 0 and the drum stands revealed`,
          note: 'The Forge renders your final figure when the working ends — no closing '
            + 'incantation needed. Plot the spectrum (`plt.plot(freqs, mags)`), and always title '
            + 'it. An unlabeled spectrum is a rumor; a labeled one is testimony.',
        },
      ],
      challenge: {
        title: 'Name the Drummer',
        prompt: 'The Dwarrowdark scroll is conjured: eight seconds of tremor at 64 readings per '
          + 'second — the mountain\'s standing weight, random groaning, and, if the warden is '
          + 'right, a drum. Find its beat.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Compute `mags = np.abs(np.fft.rfft(tremor))`.\n'
          + '- Compute `freqs = np.fft.rfftfreq(tremor.size, d=1/rate)`.\n'
          + '- Find the loudest bin **excluding bin 0**: `peak = np.argmax(mags[1:]) + 1`, then '
          + '`drum_freq = freqs[peak]`.\n'
          + '- Plot the spectrum with `plt.plot(freqs, mags)`, give it a title with `plt.title(...)`, '
          + 'and label both axes with `plt.xlabel(...)` and `plt.ylabel(...)`.\n'
          + '- Print `drum_freq`.',
        starter: py`import numpy as np
import matplotlib.pyplot as plt

# The gauge-scroll, conjured. Do not alter the conjuring.
rng = np.random.default_rng(0)
rate = 64                          # readings per second
t = np.arange(0, 8, 1 / rate)      # 8 seconds -> 512 readings
tremor = 2.0 + np.sin(2 * np.pi * 6.0 * t) + rng.normal(0.0, 0.8, t.size)

# TODO: mags — magnitudes of the real FFT of tremor

# TODO: freqs — the bin labels in Hz (d = 1/rate)

# TODO: peak (skip bin 0!) and drum_freq

# TODO: plot freqs vs mags with a title and axis labels

# TODO: print drum_freq
`,
        solution: py`import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(0)
rate = 64
t = np.arange(0, 8, 1 / rate)
tremor = 2.0 + np.sin(2 * np.pi * 6.0 * t) + rng.normal(0.0, 0.8, t.size)

mags = np.abs(np.fft.rfft(tremor))
freqs = np.fft.rfftfreq(tremor.size, d=1 / rate)

peak = np.argmax(mags[1:]) + 1
drum_freq = freqs[peak]

plt.plot(freqs, mags)
plt.title("Spectrum of the Dwarrowdark tremor")
plt.xlabel("frequency (Hz)")
plt.ylabel("magnitude")

print(drum_freq)`,
        hints: [
          'Two lines start it: mags = np.abs(np.fft.rfft(tremor)) and freqs = np.fft.rfftfreq(tremor.size, d=1/rate).',
          'Bin 0 holds the constant offset (the 2.0), and it is the loudest. Slice it away before argmax: peak = np.argmax(mags[1:]) + 1 — the +1 repairs the index.',
          'drum_freq = freqs[peak]. Then plt.plot(freqs, mags), plt.title("..."), plt.xlabel("frequency (Hz)"), plt.ylabel("magnitude"), and print(drum_freq) — it should be 6.0.',
        ],
        validation: py`import numpy as np
_m = np.abs(np.fft.rfft(tremor))
_f = np.fft.rfftfreq(tremor.size, d=1 / rate)
assert mags.shape == _m.shape, "mags has the wrong shape — use np.fft.rfft on tremor (512 readings give 257 bins) and take np.abs."
assert np.allclose(mags, _m), "mags does not match the spectrum of tremor — compute np.abs(np.fft.rfft(tremor)) without altering the signal."
assert freqs.shape == _f.shape and np.allclose(freqs, _f), "freqs is mislabeled — np.fft.rfftfreq(tremor.size, d=1/rate) names the bins in real hertz."
assert int(peak) != 0, "peak must not be bin 0 — that is the mountain's standing weight, not the drum. Slice it away: np.argmax(mags[1:]) + 1."
assert abs(float(drum_freq) - 6.0) < 0.2, "drum_freq is wrong — the drummer beats 6 times a second. Skip bin 0, argmax the rest, and index freqs with the repaired position."
assert "6.0" in _stdout, "The warden heard no verdict — print(drum_freq)."
_fig = plt.gcf()
assert _fig.axes, "No spectrum was drawn — plot freqs against mags with plt.plot."
_ax = _fig.axes[0]
assert len(_ax.lines) >= 1, "The figure holds no line — plt.plot(freqs, mags) draws the spectrum."
assert len(_ax.lines[0].get_xdata()) == freqs.size, "The plotted line does not span the spectrum — pass freqs as x and mags as y."
assert _ax.get_title().strip() != "", "An untitled spectrum is a rumor — give it a plt.title."
assert _ax.get_xlabel().strip() != "" and _ax.get_ylabel().strip() != "", "Label both axes — plt.xlabel and plt.ylabel. Future wardens must know what they are reading."`,
        successText: 'Six beats to the second, steady as a forge-hammer. Nothing natural under the mountain keeps time like that.',
        xp: 90,
      },
      quiz: [
        {
          q: 'What does `np.fft.rfft` reveal about a signal?',
          options: [
            'Its average value over time, corrected for noise',
            'How strongly each frequency of oscillation sounds within it — the signal rewritten as a sum of sines',
            'The exact timestamps at which events occurred',
            'A smoothed copy of the signal with noise removed',
          ],
          answer: 1,
          explain: 'The DFT decomposes a signal into frequency bins; the magnitude of each bin is '
            + 'the strength of that frequency. It transforms *when things happened* into *how '
            + 'often things repeat* — it neither smooths nor timestamps.',
        },
        {
          q: 'Why is `mags[0]` usually the largest value in a real gauge\'s spectrum, and why do we skip it?',
          options: [
            'Bin 0 holds the highest frequency the rate can capture',
            'It is a NumPy indexing artifact with no physical meaning',
            'Bin 0 accumulates all the noise in the signal',
            'Bin 0 is the 0 Hz component — the signal\'s constant offset, which says nothing about rhythm',
          ],
          answer: 3,
          explain: 'The DC bin measures the signal\'s standing level — a gauge that rests at 2.0 '
            + 'puts an enormous magnitude there. It is real and meaningful, but it is not '
            + 'oscillation, so periodicity hunts start at bin 1.',
        },
        {
          q: 'Given `mags` and `freqs`, which expression names the dominant *oscillating* frequency?',
          options: [
            'freqs[np.argmax(mags[1:]) + 1]',
            'np.argmax(mags)',
            'freqs[np.argmax(mags[1:])]',
            'mags[np.argmax(freqs)]',
          ],
          answer: 0,
          explain: 'Slice off bin 0, argmax what remains, then add 1 to repair the index before '
            + 'looking up the frequency label. Omitting the +1 names the bin one step too low, '
            + 'and a bare np.argmax returns an index, not a frequency.',
        },
        {
          q: 'A steady 6 Hz drum is invisible in the time plot but towers in the spectrum. Why?',
          options: [
            'The FFT amplifies periodic signals and attenuates random ones',
            'Noise cancels itself out during plotting',
            'The drum stacks all its power into one frequency bin, while noise smears thinly across every bin',
            'The spectrum discards all data except the loudest source',
          ],
          answer: 2,
          explain: 'The transform does not amplify anything — it reorganizes. Regularity '
            + 'concentrates; randomness spreads. One bin collecting a whole signal\'s worth of '
            + 'rhythm will out-tower noise that must share itself among hundreds of bins.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a7l3 — The First Sight
    // ------------------------------------------------------------------
    {
      id: 'a7l3',
      title: 'The First Sight',
      concept: 'feature matrix X and labels y, train_test_split, DecisionTreeClassifier fit/predict, accuracy_score',
      xp: 40,
      narrative: 'Now the cloth comes off the stone. Two hundred figures move in its depths — '
        + 'folk of the vale, and among them barrow-wights walking in stolen skins. Each figure '
        + 'yields two measures: the grave-chill that hangs about it, and the beat of its pulse. '
        + 'You will not write rules to tell them apart. You will show the stone examples with '
        + 'known answers and let it *learn* the boundary — then, and this is the part that '
        + 'separates seers from corpses, you will test its sight on figures it has never seen. '
        + 'A stone tested only on what it memorized will tell you it is perfect. It is lying, '
        + 'and the lie is your own reflection.',
      sections: [
        {
          heading: 'X and y — the shape of evidence',
          body: 'Every learning method in scikit-learn eats the same meal:\n\n'
            + '- **`X`**, the **feature matrix** — one row per example (here, per figure), one '
            + 'column per **feature** (a measured property: chill, pulse). Shape `(n_examples, n_features)`.\n'
            + '- **`y`**, the **labels** — one known answer per row of `X`. Here `0` means '
            + 'villager, `1` means wight.\n\n'
            + 'This is the whole ML mindset: stop writing rules by hand, start assembling '
            + 'evidence in this shape, and let the model find the boundary that separates the '
            + 'labels. Your craft moves from *writing the rule* to *choosing the features* — '
            + 'garbage columns in, corrupted visions out.',
          code: py`import numpy as np

rng = np.random.default_rng(0)
# column 0: grave-chill   column 1: pulse
villagers = rng.normal(0.0, 1.3, size=(100, 2)) + np.array([3.0, 7.0])
wights = rng.normal(0.0, 1.3, size=(100, 2)) + np.array([6.0, 3.5])

X = np.vstack([villagers, wights])   # 200 figures, 2 features each
y = np.array([0] * 100 + [1] * 100)  # 0 = villager, 1 = wight
print(X.shape)   # (200, 2)`,
        },
        {
          heading: 'The split that keeps you honest',
          body: 'Before any learning happens, wall off part of your evidence. '
            + '`train_test_split(X, y, test_size=0.25, random_state=0)` shuffles the rows and '
            + 'returns four pieces: `X_train, X_test, y_train, y_test`. The model will learn from '
            + 'the training portion **only**; the test portion stays sealed until judgment.\n\n'
            + '- `test_size=0.25` seals a quarter of the rows away.\n'
            + '- `random_state=0` fixes the shuffle so the split is reproducible — seers who '
            + 'cannot reproduce their visions are called frauds.\n'
            + '- Why seal anything? Because you already *know* the answers for the training rows. '
            + 'Asking the model about them measures memory, not sight.',
          code: py`from sklearn.model_selection import train_test_split
import numpy as np

rng = np.random.default_rng(0)
villagers = rng.normal(0.0, 1.3, size=(100, 2)) + np.array([3.0, 7.0])
wights = rng.normal(0.0, 1.3, size=(100, 2)) + np.array([6.0, 3.5])
X = np.vstack([villagers, wights])
y = np.array([0] * 100 + [1] * 100)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0)
print(X_train.shape)   # (150, 2) -- the stone may study these
print(X_test.shape)    # (50, 2)  -- these stay sealed until judgment`,
        },
        {
          heading: 'Fit, predict, and the flattering mirror',
          body: 'A **DecisionTreeClassifier** learns a cascade of if/else questions about the '
            + 'features ("is chill above 4.6? then — is pulse below 5.1?...") that ends in a '
            + 'label. The ritual is always the same three verbs:\n\n'
            + '- `model.fit(X_train, y_train)` — learn from the training rows.\n'
            + '- `model.predict(X_new)` — produce labels for rows the model has not been told about.\n'
            + '- `accuracy_score(y_true, y_pred)` — the fraction of predictions that match truth.\n\n'
            + 'Score the model on its own training data and a full-grown tree scores a perfect '
            + '1.0 *every time* — it can memorize any answer key it is handed. Only the sealed '
            + 'test rows measure sight. The gap between the two numbers is the size of the lie '
            + 'you almost told yourself.',
          code: py`from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
import numpy as np

rng = np.random.default_rng(0)
villagers = rng.normal(0.0, 1.3, size=(100, 2)) + np.array([3.0, 7.0])
wights = rng.normal(0.0, 1.3, size=(100, 2)) + np.array([6.0, 3.5])
X = np.vstack([villagers, wights])
y = np.array([0] * 100 + [1] * 100)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0)

model = DecisionTreeClassifier(random_state=0)
model.fit(X_train, y_train)

print(accuracy_score(y_train, model.predict(X_train)))   # 1.0  -- memory, flattering
print(accuracy_score(y_test, model.predict(X_test)))     # 0.94 -- sight, honest`,
          note: 'Fix `random_state=0` on every estimator and splitter you ever summon. Much of '
            + 'this craft has randomness in its joints — tie-breaking, shuffling, sampling — and '
            + 'an unseeded working can never be checked, defended, or trusted.',
        },
      ],
      challenge: {
        title: 'Judgment of the Two Hundred',
        prompt: 'The stone holds two hundred figures — `X` and `y` are conjured for you. Train it, '
          + 'and measure its sight honestly.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Split with `train_test_split(X, y, test_size=0.25, random_state=0)` into '
          + '`X_train, X_test, y_train, y_test`.\n'
          + '- Create `model = DecisionTreeClassifier(random_state=0)` and fit it on the training rows.\n'
          + '- Compute `train_acc` — accuracy of the model\'s predictions on `X_train` against `y_train`.\n'
          + '- Compute `test_acc` — accuracy on the sealed rows `X_test` against `y_test`.\n'
          + '- Print `train_acc`, then print `test_acc`.',
        starter: py`import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

# The two hundred, conjured. Column 0: grave-chill. Column 1: pulse.
rng = np.random.default_rng(0)
villagers = rng.normal(0.0, 1.3, size=(100, 2)) + np.array([3.0, 7.0])
wights = rng.normal(0.0, 1.3, size=(100, 2)) + np.array([6.0, 3.5])
X = np.vstack([villagers, wights])
y = np.array([0] * 100 + [1] * 100)   # 0 = villager, 1 = wight

# TODO: split into X_train, X_test, y_train, y_test (test_size=0.25, random_state=0)

# TODO: model = DecisionTreeClassifier(random_state=0), fitted on the training rows

# TODO: train_acc and test_acc via accuracy_score

# TODO: print train_acc, then test_acc
`,
        solution: py`import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

rng = np.random.default_rng(0)
villagers = rng.normal(0.0, 1.3, size=(100, 2)) + np.array([3.0, 7.0])
wights = rng.normal(0.0, 1.3, size=(100, 2)) + np.array([6.0, 3.5])
X = np.vstack([villagers, wights])
y = np.array([0] * 100 + [1] * 100)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0)

model = DecisionTreeClassifier(random_state=0)
model.fit(X_train, y_train)

train_acc = accuracy_score(y_train, model.predict(X_train))
test_acc = accuracy_score(y_test, model.predict(X_test))

print(train_acc)
print(test_acc)`,
        hints: [
          'The split is one line with four names on the left: X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0).',
          'model = DecisionTreeClassifier(random_state=0) then model.fit(X_train, y_train). Fit on the TRAINING rows only — the test rows stay sealed.',
          'train_acc = accuracy_score(y_train, model.predict(X_train)) and test_acc = accuracy_score(y_test, model.predict(X_test)). Print both; expect 1.0 and then 0.94.',
        ],
        validation: py`import numpy as np
from sklearn.model_selection import train_test_split as _tts
from sklearn.tree import DecisionTreeClassifier as _DT
from sklearn.metrics import accuracy_score as _asc
_Xtr, _Xte, _ytr, _yte = _tts(X, y, test_size=0.25, random_state=0)
assert X_train.shape == (150, 2) and X_test.shape == (50, 2), "The split is misproportioned — test_size=0.25 seals 50 of the 200 figures away."
assert np.allclose(X_train, _Xtr) and np.allclose(X_test, _Xte), "The split does not match random_state=0 — pass random_state=0 so the shuffle is reproducible."
assert np.array_equal(np.asarray(y_train), _ytr) and np.array_equal(np.asarray(y_test), _yte), "The labels were not split alongside the features — pass X and y together to train_test_split."
_ref = _DT(random_state=0).fit(_Xtr, _ytr)
assert np.array_equal(model.predict(_Xte), _ref.predict(_Xte)), "The model's visions differ from a DecisionTreeClassifier(random_state=0) fitted on the training rows — check what you fitted, and on what."
assert abs(train_acc - 1.0) < 1e-9, "train_acc should be exactly 1.0 — a full-grown tree memorizes its own training answers. Score model.predict(X_train) against y_train."
_expected = _asc(_yte, _ref.predict(_Xte))
assert abs(test_acc - _expected) < 1e-9, "test_acc is wrong — score model.predict(X_test) against y_test, nothing else."
assert test_acc < train_acc - 0.01, "Your test accuracy should sit below the training accuracy — if they match, you probably scored the same rows twice."
assert model.predict([[3.0, 7.0]])[0] == 0, "A figure at the villagers' heartland (chill 3, pulse 7) must be judged 0 — the model was fitted on the wrong rows or labels."
assert model.predict([[6.0, 3.5]])[0] == 1, "A figure at the wights' heartland (chill 6, pulse 3.5) must be judged 1."
assert "1.0" in _stdout and "0.94" in _stdout, "Print both verdicts — train_acc (1.0) and then test_acc (0.94)."`,
        successText: 'The stone judges fifty strangers and errs on three. It is not perfect. It is honest, which is rarer.',
        xp: 95,
      },
      quiz: [
        {
          q: 'In the feature matrix `X`, what do rows and columns represent?',
          options: [
            'Rows are individual examples; columns are measured features of each example',
            'Rows are features; columns are examples',
            'Rows are labels; columns are predictions',
            'Rows are training data; columns are test data',
          ],
          answer: 0,
          explain: 'One row per figure, one column per measurement — shape (n_examples, '
            + 'n_features). The labels y stand outside X entirely, one per row. Transposing this '
            + 'convention feeds the model gibberish that still runs, which is worse than an error.',
        },
        {
          q: 'Why does evaluating a model on its own training data mislead you?',
          options: [
            'Training data is always too small to compute accuracy on',
            'accuracy_score is only defined for test sets',
            'The model may have memorized those exact rows, so the score measures recall of the answer key, not generalization',
            'It causes the model to retrain and change its predictions',
          ],
          answer: 2,
          explain: 'A flexible model can store its training answers outright — a full-grown tree '
            + 'literally does. Only rows the model never saw measure whether it learned the '
            + 'pattern or merely the page. Scoring computes nothing about *where* data came from; '
            + 'the deceit is entirely yours to avoid.',
        },
        {
          q: 'What does `random_state=0` do in `train_test_split`?',
          options: [
            'Disables shuffling entirely, splitting rows in their original order',
            'Fixes the shuffle so the same rows land in train and test on every run',
            'Sets the model\'s starting accuracy to zero',
            'Selects the first random seed that gives balanced classes',
          ],
          answer: 1,
          explain: 'The split still shuffles — but deterministically, so every run of your working '
            + 'produces the identical split. Reproducibility is the difference between a result '
            + 'and an anecdote. It does not disable shuffling; that would be shuffle=False.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a7l4 — One Scale to Rule Them
    // ------------------------------------------------------------------
    {
      id: 'a7l4',
      title: 'One Scale to Rule Them',
      concept: 'StandardScaler and why distance-based methods need it; KMeans, labels_, cluster_centers_, inertia_, and the elbow method',
      xp: 40,
      narrative: 'Something breeds in the tower\'s throat. The wardens have netted a hundred '
        + 'eighty of the winged vermin and taken two measures of each: the ember-glow of the eyes, '
        + 'a faint thing between naught and one, and the wingspan, hundreds of millimeters of '
        + 'leather. Nobody has labels this time — no one knows how many broods nest above, or '
        + 'which beast belongs to which. This is **unsupervised** work: the stone must find the '
        + 'kinships itself, by distance. And distance is a treacherous judge. Let one feature '
        + 'shout in hundreds while another whispers in decimals, and the stone will hear only '
        + 'the shouting.',
      sections: [
        {
          heading: 'Distance obeys the loudest feature',
          body: 'Clustering groups rows by **distance**: beasts whose measures lie close together '
            + 'belong together. But raw Euclidean distance adds up squared differences in each '
            + 'feature\'s *native units*. A wingspan gap of 40 mm contributes 1600 to the squared '
            + 'distance; an eye-glow gap of 0.3 — the entire spread between broods — contributes '
            + '0.09. The glow might as well not exist.\n\n'
            + '**StandardScaler** restores the balance. For each column it subtracts the mean and '
            + 'divides by the standard deviation, so every feature speaks with mean 0 and spread '
            + '1. `scaler.fit_transform(X)` learns those column statistics and applies them in '
            + 'one stroke. Every distance-based method — K-Means, DBSCAN, nearest neighbors, '
            + 'support vectors — demands this courtesy, or it will silently cluster on whichever '
            + 'column has the biggest numbers.',
          code: py`import numpy as np
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(0)
# column 0: eye-glow (0..1)      column 1: wingspan (mm)
emberlings = np.column_stack([rng.normal(0.2, 0.05, 60), rng.normal(300.0, 40.0, 60)])
gloomwings = np.column_stack([rng.normal(0.5, 0.05, 60), rng.normal(300.0, 40.0, 60)])
marrowbats = np.column_stack([rng.normal(0.8, 0.05, 60), rng.normal(700.0, 40.0, 60)])
X = np.vstack([emberlings, gloomwings, marrowbats])

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
print(np.round(X_scaled.mean(axis=0), 6))   # [0. 0.] -- every column centered
print(np.round(X_scaled.std(axis=0), 6))    # [1. 1.]   -- every column speaks at one volume`,
        },
        {
          heading: 'K-Means — carving the host into k broods',
          body: '**KMeans** picks `k` center-points, assigns every row to its nearest center, '
            + 'moves each center to the middle of its assigned rows, and repeats until the '
            + 'carving settles. Summon it as `KMeans(n_clusters=3, n_init=10, random_state=0)` — '
            + '`n_init=10` runs ten carvings from different starts and keeps the best, and the '
            + 'seed makes the ritual repeatable.\n\n'
            + 'After `.fit(X_scaled)` the fitted object bears three marks:\n\n'
            + '- `labels_` — the cluster number (0 to k-1) assigned to each row.\n'
            + '- `cluster_centers_` — the k center-points, in scaled coordinates.\n'
            + '- `inertia_` — the sum of squared distances from each row to its center: the '
            + 'total *tightness* of the carving. Smaller is tighter.\n\n'
            + 'Fit the unscaled data and watch the wingspan column carve the host alone — the two '
            + 'small broods smear into each other. Scale first, and the three broods fall out clean.',
          code: py`import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

rng = np.random.default_rng(0)
emberlings = np.column_stack([rng.normal(0.2, 0.05, 60), rng.normal(300.0, 40.0, 60)])
gloomwings = np.column_stack([rng.normal(0.5, 0.05, 60), rng.normal(300.0, 40.0, 60)])
marrowbats = np.column_stack([rng.normal(0.8, 0.05, 60), rng.normal(700.0, 40.0, 60)])
X = np.vstack([emberlings, gloomwings, marrowbats])

raw = KMeans(n_clusters=3, n_init=10, random_state=0).fit(X)
for i in range(3):   # how many clusters claimed each true brood?
    print(len(set(raw.labels_[i * 60:(i + 1) * 60].tolist())))
# 2  -- emberlings torn between two clusters
# 2  -- gloomwings smeared across the same two
# 1  -- only the huge-winged brood came out whole: wingspan ruled alone

X_scaled = StandardScaler().fit_transform(X)
km = KMeans(n_clusters=3, n_init=10, random_state=0).fit(X_scaled)
for i in range(3):
    print(len(set(km.labels_[i * 60:(i + 1) * 60].tolist())))
# 1
# 1  -- scaled, each brood claims exactly one cluster
# 1`,
          note: 'The cluster *numbers* mean nothing — K-Means may call the emberlings cluster 2 '
            + 'today and cluster 0 in another working. What matters is the grouping: which rows '
            + 'were judged kin. Never read meaning into the label values themselves.',
        },
        {
          heading: 'The elbow — asking how many broods there truly are',
          body: 'You chose `k=3` because the fiction told you. In the wild, nobody tells you. The '
            + '**elbow method** interrogates the data: fit K-Means for k = 1, 2, 3, ... and '
            + 'record each `inertia_`. Inertia *always* falls as k grows — more centers are '
            + 'always nearer — so the minimum is worthless. What you want is the **elbow**: the '
            + 'k where the curve stops plunging and starts merely sagging.\n\n'
            + '- A plunge from k to k+1 means the new center found real structure.\n'
            + '- A sag means the new center is just subdividing a true brood to shave distance.\n'
            + '- Plot inertia against k and read the bend with your own eyes — this judgment is '
            + 'yours, not the stone\'s.',
          code: py`import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

rng = np.random.default_rng(0)
emberlings = np.column_stack([rng.normal(0.2, 0.05, 60), rng.normal(300.0, 40.0, 60)])
gloomwings = np.column_stack([rng.normal(0.5, 0.05, 60), rng.normal(300.0, 40.0, 60)])
marrowbats = np.column_stack([rng.normal(0.8, 0.05, 60), rng.normal(700.0, 40.0, 60)])
X = np.vstack([emberlings, gloomwings, marrowbats])
X_scaled = StandardScaler().fit_transform(X)

inertias = []
for k in range(1, 7):
    inertias.append(KMeans(n_clusters=k, n_init=10, random_state=0).fit(X_scaled).inertia_)
print([round(v, 1) for v in inertias])
# [360.0, 57.6, 15.2, 13.3, 11.3, 9.5]
#  plunge... plunge... then sag: the elbow bends at k = 3. Three broods.`,
        },
      ],
      challenge: {
        title: 'The Carving of the Broods',
        prompt: 'The netted host is conjured as `X` — 180 beasts, eye-glow and wingspan, unlabeled. '
          + 'Carve it properly.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Create `scaler = StandardScaler()` and compute `X_scaled = scaler.fit_transform(X)`.\n'
          + '- Fit `km = KMeans(n_clusters=3, n_init=10, random_state=0)` on `X_scaled`.\n'
          + '- Build a list `inertias` holding the `inertia_` of '
          + '`KMeans(n_clusters=k, n_init=10, random_state=0)` fitted on `X_scaled` for each k from 1 through 6, in order.\n'
          + '- Plot the elbow — `plt.plot(range(1, 7), inertias)` — and give the figure a title.\n'
          + '- Print `len(set(km.labels_.tolist()))` — the number of distinct clusters carved (3).',
        starter: py`import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

# The netted host, conjured. Column 0: eye-glow (0..1). Column 1: wingspan (mm).
rng = np.random.default_rng(0)
emberlings = np.column_stack([rng.normal(0.2, 0.05, 60), rng.normal(300.0, 40.0, 60)])
gloomwings = np.column_stack([rng.normal(0.5, 0.05, 60), rng.normal(300.0, 40.0, 60)])
marrowbats = np.column_stack([rng.normal(0.8, 0.05, 60), rng.normal(700.0, 40.0, 60)])
X = np.vstack([emberlings, gloomwings, marrowbats])

# TODO: scaler and X_scaled

# TODO: km — KMeans(n_clusters=3, n_init=10, random_state=0) fitted on X_scaled

# TODO: inertias — inertia_ for k = 1..6 on X_scaled, in order

# TODO: plot range(1, 7) against inertias, with a title

# TODO: print the number of distinct labels in km.labels_
`,
        solution: py`import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

rng = np.random.default_rng(0)
emberlings = np.column_stack([rng.normal(0.2, 0.05, 60), rng.normal(300.0, 40.0, 60)])
gloomwings = np.column_stack([rng.normal(0.5, 0.05, 60), rng.normal(300.0, 40.0, 60)])
marrowbats = np.column_stack([rng.normal(0.8, 0.05, 60), rng.normal(700.0, 40.0, 60)])
X = np.vstack([emberlings, gloomwings, marrowbats])

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

km = KMeans(n_clusters=3, n_init=10, random_state=0)
km.fit(X_scaled)

inertias = []
for k in range(1, 7):
    inertias.append(KMeans(n_clusters=k, n_init=10, random_state=0).fit(X_scaled).inertia_)

plt.plot(range(1, 7), inertias)
plt.title("Elbow of the broods")
plt.xlabel("k")
plt.ylabel("inertia")

print(len(set(km.labels_.tolist())))`,
        hints: [
          'scaler = StandardScaler() then X_scaled = scaler.fit_transform(X) — fit_transform learns each column\'s mean and spread and applies them in one stroke.',
          'km = KMeans(n_clusters=3, n_init=10, random_state=0) then km.fit(X_scaled). For the elbow, loop for k in range(1, 7) and append KMeans(n_clusters=k, n_init=10, random_state=0).fit(X_scaled).inertia_ to a list.',
          'Finish with plt.plot(range(1, 7), inertias), plt.title("..."), and print(len(set(km.labels_.tolist()))) — which is 3.',
        ],
        validation: py`import numpy as np
from sklearn.cluster import KMeans as _KM
assert X_scaled.shape == X.shape, "X_scaled must keep X's shape — scaling changes units, never the number of beasts or measures."
assert np.all(np.abs(X_scaled.mean(axis=0)) < 1e-9), "X_scaled's columns are not centered — StandardScaler().fit_transform(X) gives every column mean 0."
assert np.all(np.abs(X_scaled.std(axis=0) - 1.0) < 1e-9), "X_scaled's columns are not unit-spread — did you scale X, or something else?"
assert km.n_clusters == 3, "km must be built with n_clusters=3 — three broods nest above."
assert len(set(km.labels_.tolist())) == 3, "km carved the wrong number of clusters — fit KMeans(n_clusters=3, n_init=10, random_state=0) on X_scaled."
for _s in range(3):
    assert len(set(km.labels_[_s * 60:(_s + 1) * 60].tolist())) == 1, "A true brood was torn between clusters — that is the mark of unscaled data. Fit km on X_scaled, not X."
_exp = [_KM(n_clusters=_k, n_init=10, random_state=0).fit(X_scaled).inertia_ for _k in range(1, 7)]
assert len(inertias) == 6, "inertias must hold six entries — one for each k from 1 through 6."
assert np.allclose(np.array(inertias, dtype=float), np.array(_exp), rtol=1e-6), "inertias does not match KMeans(n_clusters=k, n_init=10, random_state=0) on X_scaled for k=1..6 — check the loop and the seed."
assert all(inertias[_i] > inertias[_i + 1] for _i in range(5)), "Inertia must fall as k grows — if yours rises, the entries are out of order."
_fig = plt.gcf()
assert _fig.axes and len(_fig.axes[0].lines) >= 1, "No elbow was drawn — plt.plot(range(1, 7), inertias)."
assert len(_fig.axes[0].lines[0].get_ydata()) == 6, "The elbow line must trace all six inertias."
assert np.allclose(np.asarray(_fig.axes[0].lines[0].get_ydata(), dtype=float), np.array(_exp), rtol=1e-4), "The plotted line does not trace your inertias — pass inertias as the y values."
assert _fig.axes[0].get_title().strip() != "", "Title the elbow — an unlabeled bend persuades no one."
assert "3" in _stdout, "Print the count of distinct clusters — len(set(km.labels_.tolist())), which is 3."`,
        successText: 'Three broods, cleanly carved — and the elbow agrees. The tower\'s throat holds exactly three kinds of hunger.',
        xp: 95,
      },
      quiz: [
        {
          q: 'Why must features be scaled before K-Means?',
          options: [
            'K-Means only accepts values between 0 and 1',
            'Scaling increases the number of clusters the algorithm can find',
            'Unscaled data makes K-Means run too slowly to finish',
            'K-Means groups by distance, and distance in raw units is dominated by whichever feature has the largest numbers',
          ],
          answer: 3,
          explain: 'A 40 mm wingspan gap contributes 1600 to squared distance; a 0.3 glow gap '
            + 'contributes 0.09. Unscaled, the clustering is effectively one-dimensional. '
            + 'StandardScaler gives every column mean 0 and spread 1 so each feature votes '
            + 'with equal voice.',
        },
        {
          q: 'What is `inertia_` on a fitted KMeans?',
          options: [
            'The sum of squared distances from every row to its assigned cluster center — smaller means tighter clusters',
            'The number of iterations the algorithm needed to settle',
            'The accuracy of the clustering against the true labels',
            'The distance between the two farthest cluster centers',
          ],
          answer: 0,
          explain: 'Inertia measures how snugly rows hug their centers. It has no notion of true '
            + 'labels — clustering is unsupervised. And because more centers always shave '
            + 'distance, inertia falls monotonically as k grows, which is why its minimum '
            + 'cannot choose k for you.',
        },
        {
          q: 'In an elbow plot, why choose the bend rather than the k with the lowest inertia?',
          options: [
            'The bend is where inertia is exactly half its starting value',
            'Inertia always decreases as k grows, so the lowest value just means "most clusters"; the bend marks where added clusters stop finding real structure',
            'Lower inertia values are numerically unstable',
            'The lowest inertia always occurs at k = 1',
          ],
          answer: 1,
          explain: 'Push k to the number of rows and inertia hits zero — a perfect, meaningless '
            + 'carving with every beast alone in its own brood. The plunge-then-sag shape shows '
            + 'where genuine structure ran out; after the bend, new centers merely subdivide '
            + 'true groups.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a7l5 — What Walks Alone
    // ------------------------------------------------------------------
    {
      id: 'a7l5',
      title: 'What Walks Alone',
      concept: 'DBSCAN (eps, min_samples, the -1 noise label) for anomaly detection; PCA for projecting high dimensions onto a plane',
      xp: 42,
      narrative: 'The census of the Fold records five sworn measures for every soul in the two '
        + 'mountain villages — hearth-heat, tithe-weight, gait, dream-depth, salt-share. One '
        + 'hundred sixty-four entries. The trouble: the villages report one hundred sixty souls '
        + 'between them. Four entries walk in the ledger that no hearth will claim. K-Means '
        + 'cannot find them — ask it for clusters and it will dutifully bury each stranger '
        + 'inside the nearest village, because K-Means *must* place everything somewhere. You '
        + 'need a colder instrument: one willing to look at a row and say *this belongs to '
        + 'nothing*. And since no eye sees in five dimensions, you will also learn to fold '
        + 'five down to two without losing the shape of the truth.',
      sections: [
        {
          heading: 'DBSCAN — clusters as crowds, strangers as noise',
          body: '**DBSCAN** defines a cluster by *density*: a crowd is anywhere enough points '
            + 'stand close together. Two knobs define "close" and "enough":\n\n'
            + '- `eps` — the reach of a point\'s neighborhood.\n'
            + '- `min_samples` — how many neighbors within `eps` make a point a **core** of a crowd.\n\n'
            + 'Crowds grow outward from core points; anything reachable joins the cluster. And '
            + 'whatever no crowd reaches is labeled **-1**: **noise**. This is the label K-Means '
            + 'does not possess, and it is precisely the anomaly-hunter\'s prize — DBSCAN finds '
            + 'clusters *and* names what walks alone, in one stroke. You neither tell it how many '
            + 'clusters exist nor beg it to be suspicious; the density decides.',
          code: py`import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN

rng = np.random.default_rng(0)
village_a = rng.normal(0.0, 0.7, size=(80, 5)) + np.array([2.0, 5.0, 1.0, 7.0, 3.0])
village_b = rng.normal(0.0, 0.7, size=(80, 5)) + np.array([8.0, 1.0, 6.0, 2.0, 9.0])
strays = np.array([
    [15.0, 12.0, 14.0, 13.0, 15.0],
    [-6.0, -5.0, -7.0, -6.0, -5.0],
    [15.0, -6.0, 15.0, -6.0, 15.0],
    [-5.0, 14.0, -6.0, 14.0, -6.0],
])
X = np.vstack([village_a, village_b, strays])
X_scaled = StandardScaler().fit_transform(X)

db = DBSCAN(eps=1.1, min_samples=4).fit(X_scaled)
labels = db.labels_
print(sorted(set(labels.tolist())))       # [-1, 0, 1] -- two crowds, and the unclaimed
print(np.where(labels == -1)[0].tolist()) # [160, 161, 162, 163] -- the four strangers`,
          note: 'Scale first, as always — DBSCAN is a distance method, and an unscaled column '
            + 'in large units would stretch every neighborhood along itself. The knobs have no '
            + 'universal setting: eps is measured in *scaled* units, and tuning it is honest '
            + 'labor, not incantation.',
        },
        {
          heading: 'PCA — folding five dimensions onto a plane',
          body: 'Five measures per soul means the census lives in five-dimensional space, where '
            + 'no mortal eye can check the stone\'s work. **PCA** (principal component analysis) '
            + 'finds the directions along which the data varies most — the first component is the '
            + 'single line that captures the greatest variance, the second is the best direction '
            + 'perpendicular to it, and so on. Project onto the first two and you get the '
            + 'flattest honest shadow of the truth a plane can hold.\n\n'
            + '- `pca = PCA(n_components=2, random_state=0)` then `proj = pca.fit_transform(X_scaled)` '
            + '— rows in, rows out, but now only 2 columns.\n'
            + '- `pca.explained_variance_ratio_` — the fraction of total variance each component '
            + 'keeps. Their sum is the fraction of truth surviving in your shadow; report it, '
            + 'always. A plot that silently discards half the variance is a half-lie.',
          code: py`import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

rng = np.random.default_rng(0)
village_a = rng.normal(0.0, 0.7, size=(80, 5)) + np.array([2.0, 5.0, 1.0, 7.0, 3.0])
village_b = rng.normal(0.0, 0.7, size=(80, 5)) + np.array([8.0, 1.0, 6.0, 2.0, 9.0])
strays = np.array([
    [15.0, 12.0, 14.0, 13.0, 15.0],
    [-6.0, -5.0, -7.0, -6.0, -5.0],
    [15.0, -6.0, 15.0, -6.0, 15.0],
    [-5.0, 14.0, -6.0, 14.0, -6.0],
])
X = np.vstack([village_a, village_b, strays])
X_scaled = StandardScaler().fit_transform(X)

pca = PCA(n_components=2, random_state=0)
proj = pca.fit_transform(X_scaled)
print(proj.shape)                                    # (164, 2)
print(round(pca.explained_variance_ratio_.sum(), 3)) # 0.966 -- the plane keeps 96.6% of the truth`,
        },
        {
          heading: 'Seeing the verdict',
          body: 'Now marry the two: scatter the PCA projection and color each point by its DBSCAN '
            + 'label. `plt.scatter(proj[:, 0], proj[:, 1], c=labels)` paints each cluster its own '
            + 'shade — and the noise points, labeled -1, stand apart in their own color, far from '
            + 'any crowd. This picture is how you *audit* the stone: if the -1 points sat in the '
            + 'middle of a village, you would know the knobs were wrong before trusting a single '
            + 'verdict.\n\n'
            + '- Title the figure. Name the axes if you can (`component 1`, `component 2` — PCA '
            + 'axes are directions, not original features).\n'
            + '- The projection is for *eyes*; the clustering ran on all five scaled dimensions. '
            + 'Fold for the plot, never for the verdict, unless you have measured what the '
            + 'folding discards.',
          code: py`# ...continuing from the previous conjurings (X_scaled, labels, proj)...
import matplotlib.pyplot as plt
plt.scatter(proj[:, 0], proj[:, 1], c=labels)
plt.title("The Fold, flattened: two villages and four strangers")
plt.xlabel("component 1")
plt.ylabel("component 2")`,
        },
      ],
      challenge: {
        title: 'The Unclaimed Four',
        prompt: 'The census is conjured as `X` — 164 souls, five sworn measures. Find what no '
          + 'hearth will claim, and render the verdict visible.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Scale: `X_scaled = StandardScaler().fit_transform(X)`.\n'
          + '- Fit `db = DBSCAN(eps=1.1, min_samples=4)` on `X_scaled` and set `labels = db.labels_`.\n'
          + '- Count the strangers: `n_strays = int((labels == -1).sum())`.\n'
          + '- Project: `pca = PCA(n_components=2, random_state=0)`, `proj = pca.fit_transform(X_scaled)`, '
          + 'and `var_share = float(pca.explained_variance_ratio_.sum())`.\n'
          + '- Scatter `proj[:, 0]` against `proj[:, 1]` colored by `labels` (pass `c=labels`), with a title.\n'
          + '- Print `n_strays`.',
        starter: py`import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN
from sklearn.decomposition import PCA

# The census of the Fold, conjured. 164 souls, 5 sworn measures each.
rng = np.random.default_rng(0)
village_a = rng.normal(0.0, 0.7, size=(80, 5)) + np.array([2.0, 5.0, 1.0, 7.0, 3.0])
village_b = rng.normal(0.0, 0.7, size=(80, 5)) + np.array([8.0, 1.0, 6.0, 2.0, 9.0])
strays = np.array([
    [15.0, 12.0, 14.0, 13.0, 15.0],
    [-6.0, -5.0, -7.0, -6.0, -5.0],
    [15.0, -6.0, 15.0, -6.0, 15.0],
    [-5.0, 14.0, -6.0, 14.0, -6.0],
])
X = np.vstack([village_a, village_b, strays])

# TODO: X_scaled via StandardScaler

# TODO: db — DBSCAN(eps=1.1, min_samples=4) fitted on X_scaled; labels = db.labels_

# TODO: n_strays — how many rows bear the label -1

# TODO: pca (n_components=2, random_state=0), proj, var_share

# TODO: scatter proj colored by labels, with a title

# TODO: print n_strays
`,
        solution: py`import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN
from sklearn.decomposition import PCA

rng = np.random.default_rng(0)
village_a = rng.normal(0.0, 0.7, size=(80, 5)) + np.array([2.0, 5.0, 1.0, 7.0, 3.0])
village_b = rng.normal(0.0, 0.7, size=(80, 5)) + np.array([8.0, 1.0, 6.0, 2.0, 9.0])
strays = np.array([
    [15.0, 12.0, 14.0, 13.0, 15.0],
    [-6.0, -5.0, -7.0, -6.0, -5.0],
    [15.0, -6.0, 15.0, -6.0, 15.0],
    [-5.0, 14.0, -6.0, 14.0, -6.0],
])
X = np.vstack([village_a, village_b, strays])

X_scaled = StandardScaler().fit_transform(X)

db = DBSCAN(eps=1.1, min_samples=4).fit(X_scaled)
labels = db.labels_

n_strays = int((labels == -1).sum())

pca = PCA(n_components=2, random_state=0)
proj = pca.fit_transform(X_scaled)
var_share = float(pca.explained_variance_ratio_.sum())

plt.scatter(proj[:, 0], proj[:, 1], c=labels)
plt.title("The Fold: villages and the unclaimed")
plt.xlabel("component 1")
plt.ylabel("component 2")

print(n_strays)`,
        hints: [
          'X_scaled = StandardScaler().fit_transform(X), then db = DBSCAN(eps=1.1, min_samples=4).fit(X_scaled) and labels = db.labels_.',
          'Noise wears the label -1: n_strays = int((labels == -1).sum()). For the folding, pca = PCA(n_components=2, random_state=0); proj = pca.fit_transform(X_scaled); var_share = float(pca.explained_variance_ratio_.sum()).',
          'plt.scatter(proj[:, 0], proj[:, 1], c=labels) paints clusters and strangers in different shades; add plt.title("...") and print(n_strays) — which is 4.',
        ],
        validation: py`import numpy as np
from sklearn.decomposition import PCA as _PCA
assert X_scaled.shape == X.shape, "X_scaled must keep the census's shape — 164 souls, 5 measures."
assert np.all(np.abs(X_scaled.mean(axis=0)) < 1e-9) and np.all(np.abs(X_scaled.std(axis=0) - 1.0) < 1e-9), "X_scaled is not standardized — StandardScaler().fit_transform(X)."
assert labels.shape == (164,), "labels must be db.labels_ — one verdict per soul."
assert n_strays == 4, "n_strays must be 4 — count the rows where labels == -1. If you got another number, check eps=1.1 and min_samples=4, fitted on X_scaled."
assert np.array_equal(np.where(labels == -1)[0], np.array([160, 161, 162, 163])), "The wrong souls were named strangers — the four unclaimed entries are the last four rows. Fit DBSCAN(eps=1.1, min_samples=4) on the SCALED census."
assert len(set(labels[:80].tolist())) == 1 and len(set(labels[80:160].tolist())) == 1, "A true village was split — each village's 80 souls must share one cluster label."
assert labels[0] != labels[80], "The two villages merged into one crowd — they must bear different cluster labels."
assert proj.shape == (164, 2), "proj must be the census folded to two components — pca.fit_transform(X_scaled) with n_components=2."
_pref = _PCA(n_components=2, random_state=0).fit(X_scaled)
assert abs(var_share - float(_pref.explained_variance_ratio_.sum())) < 1e-9, "var_share must be the sum of pca.explained_variance_ratio_ — the fraction of truth your plane keeps."
assert var_share > 0.9, "var_share should exceed 0.9 here — if it is lower, you folded something other than the scaled census."
_fig = plt.gcf()
assert _fig.axes and len(_fig.axes[0].collections) >= 1, "No scatter was drawn — plt.scatter(proj[:, 0], proj[:, 1], c=labels)."
assert len(_fig.axes[0].collections[0].get_offsets()) == 164, "The scatter must show all 164 souls — pass the full projection."
assert _fig.axes[0].get_title().strip() != "", "Title the verdict — an unlabeled plot protects no village."
assert "4" in _stdout, "Print n_strays — the count of what walks alone (4)."`,
        successText: 'Four entries, four shapes that answer to no hearth. The census did not lie — it merely waited for someone who could read it.',
        xp: 100,
      },
      quiz: [
        {
          q: 'What does the label `-1` mean in `DBSCAN(...).labels_`?',
          options: [
            'The point belongs to the last cluster found',
            'The point sits exactly on a cluster boundary',
            'The point is noise — no dense crowd reached it, so it belongs to no cluster',
            'The algorithm failed to converge for that point',
          ],
          answer: 2,
          explain: 'DBSCAN is allowed to refuse: points that no core point\'s neighborhood '
            + 'reaches are labeled -1. That refusal is the feature — it is what turns a '
            + 'clustering algorithm into an anomaly detector.',
        },
        {
          q: 'Why does K-Means make a poor anomaly hunter compared to DBSCAN?',
          options: [
            'K-Means must assign every point to some cluster, so a lone outlier is quietly buried in whichever center lies nearest',
            'K-Means cannot handle more than two features',
            'K-Means requires labeled data to find outliers',
            'K-Means marks too many points as -1',
          ],
          answer: 0,
          explain: 'K-Means has no vocabulary for "none of the above" — its labels_ contain only '
            + '0..k-1. DBSCAN\'s density definition lets isolated points remain unclaimed. '
            + 'Neither method uses labels; that is what unsupervised means.',
        },
        {
          q: 'After `pca = PCA(n_components=2, random_state=0).fit(X_scaled)`, what is `pca.explained_variance_ratio_`?',
          options: [
            'The accuracy of the projection against the true clusters',
            'The two largest distances between any points',
            'The percentage of rows kept after projection',
            'The fraction of the data\'s total variance captured by each of the two components',
          ],
          answer: 3,
          explain: 'Each entry is one component\'s share of the total variance; the sum tells you '
            + 'how much of the data\'s spread survives the folding. All rows always survive — '
            + 'PCA discards directions, never souls.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a7l6 — The Council of Trees
    // ------------------------------------------------------------------
    {
      id: 'a7l6',
      title: 'The Council of Trees',
      concept: 'decision-tree overfitting and max_depth; RandomForestClassifier, n_estimators, feature_importances_, and the bagging intuition',
      xp: 42,
      narrative: 'Two hundred forty suspects stand before the moot, and half are revenants. '
        + 'Eight measures were sworn for each — but the wardens, being thorough rather than '
        + 'wise, recorded six that are pure rumor: tavern gossip, birth-moons, nonsense. A '
        + 'single tree, allowed to grow unpruned, will study the rumors until it can recite '
        + 'every suspect\'s answer from memory — and then fail in the field, confidently. This '
        + 'is the palantír\'s oldest trick: shown too long to one obsessive eye, it reflects '
        + 'that eye\'s certainties back as revelation. The remedy of the old world still holds. '
        + 'Do not ask one deep voice. Convene a council, let each judge see partial evidence, '
        + 'and count the vote.',
      sections: [
        {
          heading: 'The deep tree memorizes — and calls it wisdom',
          body: 'A decision tree grown without limits keeps splitting until every training row '
            + 'sits in its own pure leaf. Perfect training accuracy, always — and much of that '
            + 'perfection is **overfitting**: the tree has encoded the *noise* of your sample '
            + '(the rumor columns, the accidents of who got netted) as if it were law. On sealed '
            + 'test rows the recitation stumbles.\n\n'
            + '- Train accuracy 1.0 with markedly lower test accuracy is overfitting\'s signature. '
            + 'The gap *is* the memorized noise.\n'
            + '- `max_depth` prunes the obsession: a tree of depth 3 can ask at most three '
            + 'questions before judging, so it can only afford the questions that matter. '
            + 'Shallower memory, better sight — up to a point; too shallow and it cannot '
            + 'represent the pattern at all.',
          code: py`import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

rng = np.random.default_rng(0)
n = 240
y = np.array([0] * 120 + [1] * 120)          # 0 = living, 1 = revenant
grave_chill = rng.normal(0.0, 1.0, n) + y * 1.5
breath_mist = rng.normal(0.0, 1.0, n) - y * 1.5
rumors = rng.normal(0.0, 1.0, size=(n, 6))   # six columns of pure gossip
X = np.column_stack([grave_chill, breath_mist, rumors])
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0)

deep = DecisionTreeClassifier(random_state=0).fit(X_train, y_train)
print(accuracy_score(y_train, deep.predict(X_train)))   # 1.0 -- flawless recitation
print(round(accuracy_score(y_test, deep.predict(X_test)), 4))   # 0.7833 -- stumbling sight

pruned = DecisionTreeClassifier(max_depth=3, random_state=0).fit(X_train, y_train)
print(round(accuracy_score(y_test, pruned.predict(X_test)), 4)) # 0.8167 -- less memory, more truth`,
        },
        {
          heading: 'The council — bagging, and why many shallow voices win',
          body: 'A **RandomForestClassifier** convenes `n_estimators` trees and lets them vote. '
            + 'Two deliberate imperfections make the council wiser than any member:\n\n'
            + '- **Bagging**: each tree trains on a bootstrap sample — rows drawn from the '
            + 'training set *with replacement* — so every judge saw a slightly different world.\n'
            + '- **Feature subsets**: at each split, a tree may only consider a random handful of '
            + 'columns, so no single loud rumor can seduce the whole council.\n\n'
            + 'Each tree still overfits — but each memorizes *different* noise, and private '
            + 'errors cancel in the vote while the true pattern, common to all, accumulates. '
            + 'One obsessive deep voice loses to a hundred half-blind ones. Summon it as '
            + '`RandomForestClassifier(n_estimators=100, random_state=0)` — same `fit` and '
            + '`predict` verbs as every other estimator.',
          code: py`# ...continuing: same conjured suspects and split as above...
from sklearn.ensemble import RandomForestClassifier

forest = RandomForestClassifier(n_estimators=100, random_state=0).fit(X_train, y_train)
print(round(accuracy_score(y_test, forest.predict(X_test)), 4))   # 0.8667 -- the council outsees the obsessive`,
          note: 'The vote defeats noise, not ignorance: a hundred judges shown garbage features '
            + 'return garbage verdicts in perfect unison. The council remedy assumes the truth '
            + 'is *in* the evidence, buried — it cannot conjure truth the columns never held.',
        },
        {
          heading: 'Asking the council what mattered',
          body: 'A fitted forest confesses its reasoning: `forest.feature_importances_` is one '
            + 'number per column, summing to 1.0, measuring how much each feature actually '
            + 'contributed to the council\'s splits. Rumor columns earn scraps; the true marks '
            + 'earn the lion\'s share.\n\n'
            + '- Use it to *audit* your features: an "important" column you cannot explain is a '
            + 'warning, not a triumph — leakage and coincidence rank high too.\n'
            + '- `np.argsort(importances)` orders column indices from least to most important; '
            + 'the last entries are your true witnesses.',
          code: py`# ...continuing from the fitted forest...
importances = forest.feature_importances_
print(np.round(importances, 2))
# [0.23 0.3  0.08 0.07 0.07 0.06 0.09 0.09]
#  ^chill ^mist -- the two true marks dwarf all six rumors
print(np.argsort(importances)[-2:])   # [0 1] -- the council names its witnesses`,
        },
      ],
      challenge: {
        title: 'Convene the Council',
        prompt: 'The suspects are conjured — `X` (eight measures, of which six are rumor) and `y`. '
          + 'Demonstrate the obsessive\'s failure and the council\'s remedy.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Split with `train_test_split(X, y, test_size=0.25, random_state=0)` into the usual four.\n'
          + '- Fit `deep = DecisionTreeClassifier(random_state=0)` on the training rows; compute '
          + '`tree_train_acc` and `tree_test_acc` with `accuracy_score`.\n'
          + '- Fit `pruned = DecisionTreeClassifier(max_depth=3, random_state=0)` on the training rows; '
          + 'compute `pruned_test_acc`.\n'
          + '- Fit `forest = RandomForestClassifier(n_estimators=100, random_state=0)` on the training '
          + 'rows; compute `forest_test_acc` and `importances = forest.feature_importances_`.\n'
          + '- Print `tree_test_acc`, then `forest_test_acc`.',
        starter: py`import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# The suspects, conjured. Columns 0-1: grave-chill, breath-mist. Columns 2-7: rumor.
rng = np.random.default_rng(0)
n = 240
y = np.array([0] * 120 + [1] * 120)
grave_chill = rng.normal(0.0, 1.0, n) + y * 1.5
breath_mist = rng.normal(0.0, 1.0, n) - y * 1.5
rumors = rng.normal(0.0, 1.0, size=(n, 6))
X = np.column_stack([grave_chill, breath_mist, rumors])

# TODO: split (test_size=0.25, random_state=0)

# TODO: deep tree -> tree_train_acc, tree_test_acc

# TODO: pruned tree (max_depth=3) -> pruned_test_acc

# TODO: forest (n_estimators=100, random_state=0) -> forest_test_acc, importances

# TODO: print tree_test_acc, then forest_test_acc
`,
        solution: py`import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

rng = np.random.default_rng(0)
n = 240
y = np.array([0] * 120 + [1] * 120)
grave_chill = rng.normal(0.0, 1.0, n) + y * 1.5
breath_mist = rng.normal(0.0, 1.0, n) - y * 1.5
rumors = rng.normal(0.0, 1.0, size=(n, 6))
X = np.column_stack([grave_chill, breath_mist, rumors])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0)

deep = DecisionTreeClassifier(random_state=0).fit(X_train, y_train)
tree_train_acc = accuracy_score(y_train, deep.predict(X_train))
tree_test_acc = accuracy_score(y_test, deep.predict(X_test))

pruned = DecisionTreeClassifier(max_depth=3, random_state=0).fit(X_train, y_train)
pruned_test_acc = accuracy_score(y_test, pruned.predict(X_test))

forest = RandomForestClassifier(n_estimators=100, random_state=0).fit(X_train, y_train)
forest_test_acc = accuracy_score(y_test, forest.predict(X_test))
importances = forest.feature_importances_

print(tree_test_acc)
print(forest_test_acc)`,
        hints: [
          'Same split incantation as before: X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0).',
          'Three estimators, one pattern: EstimatorName(args).fit(X_train, y_train), then accuracy_score(y_test, est.predict(X_test)). The deep tree also gets scored on its own training rows for tree_train_acc.',
          'importances = forest.feature_importances_ comes straight off the fitted forest. Print tree_test_acc then forest_test_acc — expect roughly 0.783 and 0.867.',
        ],
        validation: py`import numpy as np
from sklearn.model_selection import train_test_split as _tts
from sklearn.tree import DecisionTreeClassifier as _DT
from sklearn.ensemble import RandomForestClassifier as _RF
from sklearn.metrics import accuracy_score as _asc
_Xtr, _Xte, _ytr, _yte = _tts(X, y, test_size=0.25, random_state=0)
assert X_train.shape == (180, 8) and X_test.shape == (60, 8), "The split is off — 240 suspects at test_size=0.25 leaves 180 for training, 60 sealed."
assert np.allclose(X_train, _Xtr), "The split does not match random_state=0 — the moot cannot verify an unseeded shuffle."
_deep = _DT(random_state=0).fit(_Xtr, _ytr)
_pruned = _DT(max_depth=3, random_state=0).fit(_Xtr, _ytr)
_forest = _RF(n_estimators=100, random_state=0).fit(_Xtr, _ytr)
assert abs(tree_train_acc - 1.0) < 1e-9, "tree_train_acc must be exactly 1.0 — the unpruned tree recites its training rows perfectly. Score deep on X_train."
assert abs(tree_test_acc - _asc(_yte, _deep.predict(_Xte))) < 1e-9, "tree_test_acc is wrong — score the deep tree's predictions on the sealed rows against y_test."
assert abs(pruned_test_acc - _asc(_yte, _pruned.predict(_Xte))) < 1e-9, "pruned_test_acc is wrong — the pruned judge is DecisionTreeClassifier(max_depth=3, random_state=0), fitted on the training rows."
assert abs(forest_test_acc - _asc(_yte, _forest.predict(_Xte))) < 1e-9, "forest_test_acc is wrong — RandomForestClassifier(n_estimators=100, random_state=0), fitted on the training rows, scored on the sealed ones."
assert tree_train_acc > tree_test_acc + 0.1, "The overfitting gap is missing — train accuracy should tower over test accuracy for the unpruned tree."
assert forest_test_acc > tree_test_acc + 0.05, "The council should clearly outsee the obsessive — forest_test_acc must beat tree_test_acc. Check n_estimators=100 and random_state=0."
assert importances.shape == (8,), "importances must hold one number per column — all eight measures."
assert abs(float(importances.sum()) - 1.0) < 1e-9, "importances must sum to 1.0 — take forest.feature_importances_ from the fitted forest."
assert set(np.argsort(importances)[-2:].tolist()) == {0, 1}, "The council must name grave-chill and breath-mist (columns 0 and 1) as its top witnesses — if rumors rank higher, the wrong forest was consulted."
assert "0.78" in _stdout and "0.86" in _stdout, "Print both verdicts — tree_test_acc (about 0.783), then forest_test_acc (about 0.867)."`,
        successText: 'The obsessive recites and fails; the council votes and sees. Note which columns the judges actually consulted — the rumors earned scraps.',
        xp: 100,
      },
      quiz: [
        {
          q: 'A fully-grown decision tree scores 1.0 on training data and 0.78 on test data. What is happening?',
          options: [
            'Underfitting — the tree is too simple for the data',
            'Overfitting — the tree memorized noise particular to the training sample, and that memory does not generalize',
            'The test set is corrupted, since training accuracy is perfect',
            'Nothing unusual — test accuracy is always exactly 0.22 below training',
          ],
          answer: 1,
          explain: 'An unpruned tree can carve a pure leaf for every training row, so 1.0 in '
            + 'training is guaranteed, not impressive. The 0.22 gap is memorized noise failing '
            + 'in the field. Perfect training accuracy indicts the model\'s flexibility, never '
            + 'the test set.',
        },
        {
          q: 'Why does a random forest usually generalize better than one deep tree?',
          options: [
            'Each tree sees different bootstrapped rows and feature subsets, so their private errors cancel in the vote while the shared pattern survives',
            'The forest\'s trees are exact copies, and repetition raises confidence',
            'Forests train on the test set as well as the training set',
            'A forest has no randomness, making it more stable than a tree',
          ],
          answer: 0,
          explain: 'Bagging gives every judge a different world and feature-subsetting keeps any '
            + 'one loud column from seducing them all. Individually they still overfit — but to '
            + '*different* noise, which averages away. Identical copies would vote identically '
            + 'and fix nothing.',
        },
        {
          q: 'What does `forest.feature_importances_` report?',
          options: [
            'The correlation of each feature with the labels',
            'How many trees used each feature at their root',
            'Each column\'s share of the council\'s split decisions — how much each feature contributed, summing to 1.0',
            'The accuracy lost when each feature is removed and the forest retrained',
          ],
          answer: 2,
          explain: 'It measures contribution to the fitted splits, normalized to sum to 1. It is '
            + 'not a correlation, and nothing is retrained to compute it. Read it as an audit: '
            + 'high importance you cannot explain is a warning of leakage or coincidence.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a7l7 — The Stone Does Not Lie — You Do
    // ------------------------------------------------------------------
    {
      id: 'a7l7',
      title: 'The Stone Does Not Lie — You Do',
      concept: 'confusion_matrix, precision and recall under class imbalance, and SVC with linear vs rbf kernels',
      xp: 44,
      narrative: 'The westmark keeps two watch-glasses, and each day closes with their two '
        + 'readings inked side by side. Two hundred days in the ledger; on thirty of them, '
        + 'riders came. Here is the final corruption, and it wears the mask of virtue: a '
        + 'watchman who simply announces *peace* every dawn is right 85 days in a hundred. '
        + 'His accuracy is splendid. Every raid still arrives unannounced. Accuracy answered '
        + 'the question you asked — you merely asked a coward\'s question. Choosing the metric '
        + '*is* choosing what to ask the stone, and the stone always answers exactly the '
        + 'question posed. That is why it does not lie. You do.',
      sections: [
        {
          heading: 'The confusion matrix — four fates, not one number',
          body: 'For a two-class problem every prediction meets one of four fates, and the '
            + '**confusion matrix** counts them all. With labels 0 (peace) and 1 (raid), '
            + '`confusion_matrix(y_true, y_pred)` returns a 2x2 grid — row = truth, column = '
            + 'prediction:\n\n'
            + '- Top-left: **true negatives** — peace called peace.\n'
            + '- Top-right: **false positives** — peace called raid (the false alarm).\n'
            + '- Bottom-left: **false negatives** — raid called peace (the unforgiven one).\n'
            + '- Bottom-right: **true positives** — raid called raid.\n\n'
            + 'Flatten it in that order with `tn, fp, fn, tp = cm.ravel()`. Watch the sleeping '
            + 'watchman score 0.9 accuracy while his entire second row of duty sits in the '
            + 'false-negative cell.',
          code: py`import numpy as np
from sklearn.metrics import confusion_matrix

y_true = np.array([0] * 18 + [1] * 2)     # twenty days, two raids
asleep = np.zeros(20, dtype=int)          # the watchman announces peace, always
print((asleep == y_true).mean())          # 0.9 -- a medal for sleeping

cm = confusion_matrix(y_true, asleep)
print(cm)
# [[18  0]
#  [ 2  0]]  -- both raids sit in the false-negative cell, unannounced`,
        },
        {
          heading: 'Precision and recall — two honest questions',
          body: 'From the four cells come the two questions worth asking:\n\n'
            + '- **Precision** = `tp / (tp + fp)` — *when the stone cries raid, how often is it '
            + 'right?* Low precision means false alarms, wardens exhausted by ghosts.\n'
            + '- **Recall** = `tp / (tp + fn)` — *of the raids that truly came, how many did the '
            + 'stone catch?* Low recall means burning villages that were promised peace.\n\n'
            + 'Under class **imbalance** — many peaceful days, few raids — accuracy is nearly '
            + 'worthless, because the rare class barely moves it. Precision and recall stare '
            + 'directly at the rare class. Which matters more depends on the price of each '
            + 'error: cheap alarms and catastrophic misses demand recall; costly alarms tilt '
            + 'you toward precision. Choosing the metric is a *command decision*, made before '
            + 'the working, not after the number flatters you.',
          code: py`import numpy as np
from sklearn.metrics import confusion_matrix

y_true = np.array([0] * 18 + [1] * 2)
# A watchman who tries: one false alarm, catches one raid of two.
trying = np.array([0] * 17 + [1] + [1, 0])
print((trying == y_true).mean())     # 0.9 -- same accuracy as the sleeper!

tn, fp, fn, tp = confusion_matrix(y_true, trying).ravel()
print(tp / (tp + fp))    # 0.5 -- precision: half his alarms are real
print(tp / (tp + fn))    # 0.5 -- recall: he catches half the raids
# The sleeper's recall is 0.0. Same accuracy; utterly different watchmen.`,
          note: 'Two watchmen, identical 0.9 accuracy: one catches half the raids, the other '
            + 'catches none. Any metric that cannot tell those two apart is not measuring what '
            + 'you care about — that is the whole indictment, in one pair of prints.',
        },
        {
          heading: 'The support-vector classifier — straight blades and curved ones',
          body: 'The closing classifier of this Codex: the **SVC** (support-vector classifier) '
            + 'seeks the boundary between classes with the widest margin. Its **kernel** '
            + 'decides what shapes the boundary may take:\n\n'
            + '- `SVC(kernel="linear", random_state=0)` — a straight cut. Fast, readable, and '
            + 'helpless when no straight line exists.\n'
            + '- `SVC(kernel="rbf", random_state=0)` — the Gaussian kernel measures likeness by '
            + 'distance and can wrap a curved boundary around islands and rings.\n\n'
            + 'The westmark\'s data is a ring: peace-days huddle near stillness, raid-days circle '
            + 'them, because riders sweep the vale\'s rim before striking. No straight line can '
            + 'cut a ring off from its center — the linear stone collapses into the sleeping '
            + 'watchman, high accuracy and zero recall. The rbf kernel curls around the calm '
            + 'and catches the riders. Same data, same verbs — the kernel is the shape of the '
            + 'question.',
          code: py`import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

rng = np.random.default_rng(0)
calm = rng.normal(0.0, 1.0, size=(170, 2))
angle = rng.uniform(0.0, 2 * np.pi, 30)
radius = rng.normal(4.2, 0.6, 30)
raids = np.column_stack([radius * np.cos(angle), radius * np.sin(angle)])
X = np.vstack([calm, raids])
y = np.array([0] * 170 + [1] * 30)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0)

linear = SVC(kernel="linear", random_state=0).fit(X_train, y_train)
rbf = SVC(kernel="rbf", random_state=0).fit(X_train, y_train)
print(accuracy_score(y_test, linear.predict(X_test)))   # 0.84 -- the straight blade, useless here
print(accuracy_score(y_test, rbf.predict(X_test)))      # 0.96 -- the curved one closes the ring`,
          note: 'Beyond this door stand the neural networks — stacked layers of learned '
            + 'transformations that bend boundaries stranger than any kernel. They do not run '
            + 'in this Forge, and they change nothing taught here: features in, splits kept '
            + 'honest, metrics chosen before the vision. The discipline is the inheritance; '
            + 'the models are merely heirs.',
        },
      ],
      challenge: {
        title: 'Ask the Right Question',
        prompt: 'The westmark ledger is conjured — `X`, two glass-readings per day; `y`, 1 on the '
          + 'thirty raid-days. Try both blades, then judge the better one honestly.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Split with `train_test_split(X, y, test_size=0.25, random_state=0)`.\n'
          + '- Fit `linear = SVC(kernel="linear", random_state=0)` and `rbf = SVC(kernel="rbf", random_state=0)` '
          + 'on the training rows.\n'
          + '- Compute `linear_acc` and `rbf_acc` on the sealed rows with `accuracy_score`.\n'
          + '- Build `cm = confusion_matrix(y_test, rbf.predict(X_test))` and unpack '
          + '`tn, fp, fn, tp = cm.ravel()`.\n'
          + '- Compute `precision = tp / (tp + fp)` and `recall = tp / (tp + fn)`.\n'
          + '- Compute `linear_recall` the same way from `confusion_matrix(y_test, linear.predict(X_test))` '
          + '(unpack into `ltn, lfp, lfn, ltp` and divide `ltp / (ltp + lfn)`).\n'
          + '- Print `round(precision, 2)`, then `round(recall, 2)`, then `round(linear_recall, 2)`.',
        starter: py`import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, confusion_matrix

# The westmark ledger, conjured. 200 days; riders came on 30.
rng = np.random.default_rng(0)
calm = rng.normal(0.0, 1.0, size=(170, 2))
angle = rng.uniform(0.0, 2 * np.pi, 30)
radius = rng.normal(4.2, 0.6, 30)
raids = np.column_stack([radius * np.cos(angle), radius * np.sin(angle)])
X = np.vstack([calm, raids])
y = np.array([0] * 170 + [1] * 30)   # 0 = peace, 1 = raid

# TODO: split (test_size=0.25, random_state=0)

# TODO: linear and rbf SVCs, fitted on the training rows

# TODO: linear_acc and rbf_acc on the sealed rows

# TODO: cm for the rbf blade; unpack tn, fp, fn, tp = cm.ravel()

# TODO: precision and recall from the four counts

# TODO: linear_recall from the linear blade's confusion matrix

# TODO: print round(precision, 2), round(recall, 2), round(linear_recall, 2)
`,
        solution: py`import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, confusion_matrix

rng = np.random.default_rng(0)
calm = rng.normal(0.0, 1.0, size=(170, 2))
angle = rng.uniform(0.0, 2 * np.pi, 30)
radius = rng.normal(4.2, 0.6, 30)
raids = np.column_stack([radius * np.cos(angle), radius * np.sin(angle)])
X = np.vstack([calm, raids])
y = np.array([0] * 170 + [1] * 30)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0)

linear = SVC(kernel="linear", random_state=0).fit(X_train, y_train)
rbf = SVC(kernel="rbf", random_state=0).fit(X_train, y_train)

linear_acc = accuracy_score(y_test, linear.predict(X_test))
rbf_acc = accuracy_score(y_test, rbf.predict(X_test))

cm = confusion_matrix(y_test, rbf.predict(X_test))
tn, fp, fn, tp = cm.ravel()
precision = tp / (tp + fp)
recall = tp / (tp + fn)

ltn, lfp, lfn, ltp = confusion_matrix(y_test, linear.predict(X_test)).ravel()
linear_recall = ltp / (ltp + lfn)

print(round(precision, 2))
print(round(recall, 2))
print(round(linear_recall, 2))`,
        hints: [
          'Split as always, then two fits: SVC(kernel="linear", random_state=0).fit(X_train, y_train) and the same with kernel="rbf". Score each on the sealed rows.',
          'cm = confusion_matrix(y_test, rbf.predict(X_test)); tn, fp, fn, tp = cm.ravel() — the order is tn, fp, fn, tp. Then precision = tp / (tp + fp), recall = tp / (tp + fn).',
          'Repeat the matrix for the linear blade: ltn, lfp, lfn, ltp = confusion_matrix(y_test, linear.predict(X_test)).ravel(); linear_recall = ltp / (ltp + lfn). The three prints should read 1.0, 0.75, 0.0.',
        ],
        validation: py`import numpy as np
from sklearn.model_selection import train_test_split as _tts
from sklearn.svm import SVC as _SVC
from sklearn.metrics import accuracy_score as _asc, confusion_matrix as _cmf
_Xtr, _Xte, _ytr, _yte = _tts(X, y, test_size=0.25, random_state=0)
assert X_train.shape == (150, 2) and X_test.shape == (50, 2), "The split is misproportioned — 200 days at test_size=0.25 seals 50 away."
assert np.allclose(X_train, _Xtr), "The split does not match random_state=0 — seed the shuffle."
_lin = _SVC(kernel="linear", random_state=0).fit(_Xtr, _ytr)
_rbf = _SVC(kernel="rbf", random_state=0).fit(_Xtr, _ytr)
assert abs(linear_acc - _asc(_yte, _lin.predict(_Xte))) < 1e-9, "linear_acc is wrong — score the linear blade's predictions on the sealed rows."
assert abs(rbf_acc - _asc(_yte, _rbf.predict(_Xte))) < 1e-9, "rbf_acc is wrong — score the rbf blade on X_test against y_test."
assert rbf_acc > linear_acc + 0.05, "The curved blade must clearly beat the straight one on this ring — check the kernels and what each was fitted on."
_cm = _cmf(_yte, _rbf.predict(_Xte))
assert cm.shape == (2, 2) and int(cm.sum()) == 50, "cm must be the 2x2 confusion matrix of the rbf blade over all 50 sealed days."
assert np.array_equal(np.asarray(cm), _cm), "cm's cells are wrong — confusion_matrix(y_test, rbf.predict(X_test)), truth first, prediction second."
_tn, _fp, _fn, _tp = _cm.ravel()
assert abs(precision - _tp / (_tp + _fp)) < 1e-9, "precision must be tp / (tp + fp) — of the cried raids, how many were real."
assert abs(recall - _tp / (_tp + _fn)) < 1e-9, "recall must be tp / (tp + fn) — of the real raids, how many were caught."
assert recall > 0.6, "The rbf blade's recall should exceed 0.6 here — if not, the wrong predictions fed the matrix."
_lcm = _cmf(_yte, _lin.predict(_Xte)).ravel()
assert abs(linear_recall - _lcm[3] / (_lcm[3] + _lcm[2])) < 1e-9, "linear_recall must come from the LINEAR blade's confusion matrix — ltp / (ltp + lfn)."
assert linear_recall < 0.05, "linear_recall should be essentially zero — the straight blade cannot cut a ring from its center. If yours is high, the matrices are swapped."
assert "1.0" in _stdout and "0.75" in _stdout and "0.0" in _stdout, "Print the three verdicts rounded to 2 places: precision (1.0), recall (0.75), linear_recall (0.0)."`,
        successText: 'Accuracy praised both watchmen; recall hanged the sleeping one. You finally know which question to ask the stone.',
        xp: 105,
      },
      quiz: [
        {
          q: 'On a ledger with 95% peaceful days, a model that always predicts "peace" scores 0.95 accuracy. What does this reveal?',
          options: [
            'Under class imbalance, accuracy can look excellent while the model catches zero rare events — its recall on raids is 0.0',
            'The model is well calibrated for deployment',
            'Accuracy above 0.9 always indicates a strong model',
            'The dataset must be discarded as unusable',
          ],
          answer: 0,
          explain: 'The rare class barely moves accuracy, so total blindness to it costs only a '
            + 'few points. Recall — tp / (tp + fn) — is exactly 0 for the all-peace model, which '
            + 'is the number that matters when raids are what you fear.',
        },
        {
          q: 'What do precision and recall each measure?',
          options: [
            'Precision: of the true positives, how many were found. Recall: of the predicted positives, how many were right',
            'Both measure the same ratio from different rows of the confusion matrix',
            'Precision: of the predicted positives, how many were truly positive. Recall: of the true positives, how many were found',
            'Precision measures speed; recall measures memory usage',
          ],
          answer: 2,
          explain: 'Precision = tp/(tp+fp) judges the model\'s alarms; recall = tp/(tp+fn) judges '
            + 'its coverage of real events. The tempting wrong answer states them backwards — '
            + 'the classic and costly swap.',
        },
        {
          q: 'When does `SVC(kernel="rbf")` decisively beat `SVC(kernel="linear")`?',
          options: [
            'Whenever the dataset has more than 100 rows',
            'Never — the linear kernel is always at least as good',
            'Only when the features are left unscaled',
            'When no straight boundary can separate the classes — such as one class ringing the other',
          ],
          answer: 3,
          explain: 'The kernel sets the shapes the boundary may take. A ring around a core defeats '
            + 'every straight line, while the rbf kernel\'s distance-based similarity wraps a '
            + 'closed curve around the center. On truly linear data, the straight blade is fine '
            + 'and simpler.',
        },
        {
          q: 'In `tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()`, what is `fn`?',
          options: [
            'Days of peace the model wrongly called raids',
            'Events that truly happened but the model predicted as negative — the missed raids',
            'Raids the model correctly identified',
            'The total number of errors of both kinds',
          ],
          answer: 1,
          explain: 'False negatives are truth = 1, prediction = 0: real events waved through as '
            + 'nothing. They are the cell recall interrogates, and in raid-hunting they are the '
            + 'expensive ones. Peace wrongly called raid is the false positive, fp.',
        },
      ],
    },
  ],
  // ------------------------------------------------------------------
  // Boss — The Eye of the Palantír
  // ------------------------------------------------------------------
  boss: {
    id: 'act7-boss',
    title: 'The Eye of the Palantír',
    narrative: 'The stone has stopped waiting. Something on the far side has noticed you — has '
      + 'been noticing you since the first lesson — and now the surface clears on command and '
      + 'shows you whatever you wish were true. Flawless clusters. Perfect accuracies. Wards '
      + 'that hold. This is the Eye\'s whole armory: not falsehood, but *selection* — feeding '
      + 'your vanity your own methodology, stripped of its discipline. The muster of the last '
      + 'levy stands in the courtyard, two hundred twenty souls, and fifty of them are the '
      + 'Eye\'s. You will find them with the full rite or not at all: seal the test rows, tune '
      + 'the scale on the training rows alone, convene the council, and judge it by the metrics '
      + 'that cannot be flattered. The Eye does not fear your models. It fears your protocol.',
    defeatText: 'The stone shows you your own certainty, smiling — and the levy marches with fifty of the Eye\'s soldiers inside it.',
    victoryText: 'The Eye recoils from the one sight it cannot survive: a seer who checks. The stone goes dark, and stays yours.',
    xp: 500,
    flawlessBonus: 50,
    gauntlet: [
      {
        q: 'Chronicles show `P(black sails | invasion) = 0.9`. A warden concludes `P(invasion | black sails) = 0.9`. What is the error?',
        options: [
          'No error — conditional probability is symmetric',
          'The conditionals point in opposite directions — Bayes\' rule must reweight by P(invasion) and P(black sails), and rare invasions make the true value far lower',
          'The error is using probabilities below 1.0 for rare events',
          'P(invasion | black sails) cannot be computed from any chronicle',
        ],
        answer: 1,
        explain: 'P(A|B) = P(B|A) * P(A) / P(B). If invasions are rare, the forward conditional '
          + 'shrinks accordingly — most black-sail sightings precede nothing. Mistaking one '
          + 'conditional for its reverse is the oldest divination error, and Bayes\' rule is '
          + 'its only cure.',
      },
      {
        q: 'A magnitude spectrum of a night\'s watch-readings shows one towering spike at 6 Hz above a low, flat floor. What does this mean?',
        options: [
          'Something in the signal repeats exactly 6 times per second — regularity concentrates into one bin while noise smears across all of them',
          'The readings contain exactly 6 anomalous events',
          'The sampling rate was 6 readings per second',
          'The signal\'s average value is 6',
        ],
        answer: 0,
        explain: 'The DFT sorts the signal by rhythm: a steady 6 Hz component stacks its whole '
          + 'power into the 6 Hz bin. Noise, having no rhythm, spreads thin. The average value '
          + 'lives in bin 0, and the sampling rate only sets the highest audible frequency.',
      },
      {
        q: 'A seer reports 100% accuracy — measured on the same rows the model trained on. What should you conclude?',
        options: [
          'The model is perfect and ready for the field',
          'The model must be underfitting',
          'Almost nothing — flexible models can memorize training answers outright; only sealed test rows measure real sight',
          'The training data must have been noiseless',
        ],
        answer: 2,
        explain: 'A full-grown tree reaches 1.0 on its own training rows by construction — it is '
          + 'memory, not generalization. This is why train_test_split comes before fit, and why '
          + 'the stone shown only what you already believe always agrees with you.',
      },
      {
        q: 'You cluster souls by (tithe in copper coins: 100s, loyalty score: 0 to 1) without scaling. What happens?',
        options: [
          'Distance is ruled almost entirely by the copper column — K-Means effectively clusters on tithe alone and loyalty is ignored',
          'K-Means fails with an error on mixed units',
          'The loyalty column dominates because its values are smaller',
          'Nothing — K-Means normalizes features internally',
        ],
        answer: 0,
        explain: 'Squared differences in the hundreds crush squared differences below 1. K-Means '
          + 'raises no error and applies no internal scaling — it silently returns a one-column '
          + 'clustering dressed as a two-column one. StandardScaler first, always.',
      },
      {
        q: 'DBSCAN labels three census rows `-1` while K-Means (k=2) assigned them to ordinary clusters. Why are the verdicts different?',
        options: [
          'K-Means found them first, so DBSCAN could not claim them',
          'DBSCAN\'s -1 means the points belong to both clusters at once',
          'The two algorithms disagree only when the data is unscaled',
          'DBSCAN may refuse points that no dense neighborhood reaches — K-Means must assign every point to its nearest center, hiding the strangers',
        ],
        answer: 3,
        explain: 'The -1 label is DBSCAN\'s power to say "this belongs to nothing" — its density '
          + 'test defines membership, and isolation fails it. K-Means lacks any such refusal, '
          + 'which is why it buries anomalies instead of naming them.',
      },
      {
        q: 'Missing a real raid costs a village; a false alarm costs a wasted night. Which metric must the watch-stone maximize, and why?',
        options: [
          'Precision — because false alarms are the catastrophic error',
          'Recall — tp / (tp + fn) — because it directly counts the fraction of true raids caught, and false negatives are the catastrophic error',
          'Accuracy — because it balances all errors equally',
          'Inertia — because tighter clusters mean fewer raids',
        ],
        answer: 1,
        explain: 'The stated costs make false negatives ruinous and false positives cheap — that '
          + 'is recall\'s territory. Precision would be the demand if alarms were expensive. '
          + 'Accuracy blurs both costs together, and inertia belongs to clustering entirely.',
      },
    ],
    finalChallenge: {
      title: 'The Full Rite',
      prompt: 'The muster of the last levy: `X`, 220 souls with five sworn measures (heartbeat, '
        + 'warmth, sleep, and two idle rumors); `y`, 1 for the Eye\'s fifty thralls. Perform the '
        + 'complete rite — one slip in the protocol and the vision is flattery.\n\n'
        + 'Requirements, exactly, in this order:\n\n'
        + '- Split first: `train_test_split(X, y, test_size=0.25, random_state=0)` into '
        + '`X_train, X_test, y_train, y_test`.\n'
        + '- Tune the scale on the training rows ALONE: `scaler = StandardScaler()`, '
        + '`X_train_s = scaler.fit_transform(X_train)`, then `X_test_s = scaler.transform(X_test)` '
        + '— the stone must not glimpse the sealed days, not even their averages.\n'
        + '- Convene `model = RandomForestClassifier(n_estimators=100, random_state=0)` and fit it '
        + 'on `X_train_s`, `y_train`.\n'
        + '- Judge: `pred = model.predict(X_test_s)`, `acc = accuracy_score(y_test, pred)`, '
        + '`cm = confusion_matrix(y_test, pred)`, `tn, fp, fn, tp = cm.ravel()`, '
        + '`precision = tp / (tp + fp)`, `recall = tp / (tp + fn)`.\n'
        + '- Render testimony: `plt.bar(range(5), model.feature_importances_)` with a `plt.title(...)`.\n'
        + '- Print `round(precision, 3)`, then `round(recall, 3)`.',
      starter: py`import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix

# The muster, conjured. Columns: heartbeat, warmth, sleep, rumor, rumor.
rng = np.random.default_rng(0)
free = np.column_stack([
    rng.normal(60.0, 8.0, 170),
    rng.normal(37.0, 0.6, 170),
    rng.normal(6.5, 1.2, 170),
    rng.normal(0.0, 1.0, 170),
    rng.normal(0.0, 1.0, 170),
])
thralls = np.column_stack([
    rng.normal(44.0, 8.0, 50),
    rng.normal(35.8, 0.6, 50),
    rng.normal(2.5, 1.2, 50),
    rng.normal(0.0, 1.0, 50),
    rng.normal(0.0, 1.0, 50),
])
X = np.vstack([free, thralls])
y = np.array([0] * 170 + [1] * 50)   # 0 = free, 1 = thrall of the Eye

# TODO: split FIRST (test_size=0.25, random_state=0)

# TODO: scaler — fit_transform on X_train only; transform X_test

# TODO: model — RandomForestClassifier(n_estimators=100, random_state=0) on the scaled training rows

# TODO: pred, acc, cm, and tn, fp, fn, tp = cm.ravel()

# TODO: precision and recall from the four counts

# TODO: bar chart of model.feature_importances_ over range(5), with a title

# TODO: print round(precision, 3), then round(recall, 3)
`,
      solution: py`import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix

rng = np.random.default_rng(0)
free = np.column_stack([
    rng.normal(60.0, 8.0, 170),
    rng.normal(37.0, 0.6, 170),
    rng.normal(6.5, 1.2, 170),
    rng.normal(0.0, 1.0, 170),
    rng.normal(0.0, 1.0, 170),
])
thralls = np.column_stack([
    rng.normal(44.0, 8.0, 50),
    rng.normal(35.8, 0.6, 50),
    rng.normal(2.5, 1.2, 50),
    rng.normal(0.0, 1.0, 50),
    rng.normal(0.0, 1.0, 50),
])
X = np.vstack([free, thralls])
y = np.array([0] * 170 + [1] * 50)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0)

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

model = RandomForestClassifier(n_estimators=100, random_state=0)
model.fit(X_train_s, y_train)

pred = model.predict(X_test_s)
acc = accuracy_score(y_test, pred)
cm = confusion_matrix(y_test, pred)
tn, fp, fn, tp = cm.ravel()
precision = tp / (tp + fp)
recall = tp / (tp + fn)

plt.bar(range(5), model.feature_importances_)
plt.title("What the council consulted")

print(round(precision, 3))
print(round(recall, 3))`,
      validation: py`import numpy as np
from sklearn.model_selection import train_test_split as _tts
from sklearn.preprocessing import StandardScaler as _SS
from sklearn.ensemble import RandomForestClassifier as _RF
from sklearn.metrics import accuracy_score as _asc, confusion_matrix as _cmf
_Xtr, _Xte, _ytr, _yte = _tts(X, y, test_size=0.25, random_state=0)
assert X_train.shape == (165, 5) and X_test.shape == (55, 5), "The split is misproportioned — 220 souls at test_size=0.25 seals 55 away."
assert np.allclose(X_train, _Xtr) and np.array_equal(np.asarray(y_test), _yte), "X_train does not match a random_state=0 split of the RAW features. Either the seed is wrong, or the rows were scaled before the split (the scaler glimpsing sealed rows), or X_train was overwritten after. Split the raw features first, keep X_train raw, and store the scaled result separately."
assert np.allclose(scaler.mean_, _Xtr.mean(axis=0)), "The scaler's memory is wrong — fit it on X_train alone, after the split."
assert not np.allclose(scaler.mean_, X.mean(axis=0), atol=1e-3), "The scaler glimpsed the sealed rows — it was fitted on all of X. Split FIRST, then fit_transform on X_train only."
assert np.allclose(X_train_s, (_Xtr - _Xtr.mean(axis=0)) / _Xtr.std(axis=0)), "X_train_s is not the training rows under the training scale — use scaler.fit_transform(X_train)."
assert np.allclose(X_test_s, (_Xte - _Xtr.mean(axis=0)) / _Xtr.std(axis=0)), "X_test_s must be the sealed rows under the TRAINING scale — scaler.transform(X_test), never fit_transform."
_sc = _SS().fit(_Xtr)
_ref = _RF(n_estimators=100, random_state=0).fit(_sc.transform(_Xtr), _ytr)
_rpred = _ref.predict(_sc.transform(_Xte))
assert np.array_equal(np.asarray(pred), _rpred), "The council's verdicts differ from the prescribed rite — RandomForestClassifier(n_estimators=100, random_state=0) fitted on the scaled training rows, judging the scaled sealed rows."
assert abs(acc - _asc(_yte, _rpred)) < 1e-9, "acc must score pred against y_test."
_cm = _cmf(_yte, _rpred)
assert np.array_equal(np.asarray(cm), _cm), "cm's cells are wrong — confusion_matrix(y_test, pred), truth first."
_tn, _fp, _fn, _tp = _cm.ravel()
assert abs(precision - _tp / (_tp + _fp)) < 1e-9, "precision must be tp / (tp + fp) from the unpacked matrix."
assert abs(recall - _tp / (_tp + _fn)) < 1e-9, "recall must be tp / (tp + fn)."
assert precision > 0.9 and recall > 0.7, "The rite performed exactly should convict cleanly (precision 1.0, recall about 0.833) — weaker numbers mean a step was skipped or reordered."
_probe = scaler.transform(np.array([[44.0, 35.8, 2.5, 0.0, 0.0], [60.0, 37.0, 6.5, 0.0, 0.0]]))
_pv = model.predict(_probe)
assert int(_pv[0]) == 1, "A soul at the thralls' heartland (heartbeat 44, warmth 35.8, sleep 2.5) must be judged 1 — the model or the scaling is wrong."
assert int(_pv[1]) == 0, "A soul at the freefolk's heartland (heartbeat 60, warmth 37, sleep 6.5) must be judged 0."
_fig = plt.gcf()
assert _fig.axes and len(_fig.axes[0].patches) == 5, "The testimony is missing — plt.bar(range(5), model.feature_importances_) raises five bars, one per measure."
_h = sorted(float(_p.get_height()) for _p in _fig.axes[0].patches)
assert np.allclose(_h, sorted(model.feature_importances_.tolist()), atol=1e-9), "The bars do not testify to the fitted importances — pass model.feature_importances_ as the heights."
assert _fig.axes[0].get_title().strip() != "", "Title the testimony — plt.title. Unlabeled evidence convicts no one."
assert "1.0" in _stdout and "0.833" in _stdout, "Print the two verdicts — round(precision, 3) then round(recall, 3): 1.0 and 0.833."`,
      successText: '',
      xp: 0,
    },
  },
  codex: [
    {
      term: 'Bayes\' rule',
      def: 'P(A|B) = P(B|A) * P(A) / P(B) — turns a conditional probability around using the two base rates, converting hindsight (what preceded known events) into foresight; when chaining many small likelihoods, sum their `np.log` values instead of multiplying, or the product underflows to 0.0.',
    },
    {
      term: 'FFT (np.fft.rfft)',
      def: 'The fast Discrete Fourier Transform — rewrites a real signal as frequency bins whose magnitudes (`np.abs`) measure how strongly each frequency repeats within it; `np.fft.rfftfreq(n, d=1/rate)` labels the bins in hertz, and bin 0 holds the constant offset, not rhythm.',
    },
    {
      term: 'train_test_split()',
      def: 'Shuffles the rows of X and y (reproducibly, with `random_state=0`) and returns X_train, X_test, y_train, y_test — the model learns from the training portion only, and the sealed test rows alone measure real generalization.',
    },
    {
      term: 'overfitting',
      def: 'A model memorizing the noise of its training sample instead of the underlying pattern — its signature is near-perfect training accuracy towering over test accuracy, and its cures include limiting capacity (`max_depth`) and ensembling.',
    },
    {
      term: 'StandardScaler',
      def: 'Rescales each feature column to mean 0 and standard deviation 1 (`fit_transform` learns and applies in one stroke) so no large-unit column dominates distance; fit it on training rows only and `transform` everything else with the same learned scale.',
    },
    {
      term: 'K-Means',
      def: 'Unsupervised clustering that places k centers and repeatedly assigns rows to the nearest center and recenters — `KMeans(n_clusters=k, n_init=10, random_state=0)` yields `labels_` (cluster per row) and `cluster_centers_`, and must always assign every row somewhere.',
    },
    {
      term: 'inertia_ / elbow method',
      def: 'inertia_ is the sum of squared distances from rows to their assigned centers — it always falls as k grows, so k is chosen at the elbow: the bend in the inertia-vs-k plot where new clusters stop finding real structure and start subdividing it.',
    },
    {
      term: 'DBSCAN',
      def: 'Density-based clustering — points with at least `min_samples` neighbors within radius `eps` seed crowds that grow outward, with no need to declare the number of clusters; a distance method, so scale features first.',
    },
    {
      term: 'noise point (label -1)',
      def: 'A row DBSCAN refuses to place in any cluster because no dense neighborhood reaches it — the label -1 in `labels_` is what turns clustering into anomaly detection, a refusal K-Means cannot make.',
    },
    {
      term: 'PCA',
      def: 'Principal component analysis — finds the perpendicular directions of greatest variance and projects the data onto the first few (`PCA(n_components=2).fit_transform`), folding many features down to a plottable plane; `explained_variance_ratio_` reports each component\'s share of the total variance, so you know how much truth the folding kept.',
    },
    {
      term: 'random forest',
      def: 'An ensemble of decision trees, each trained on a bootstrap sample of rows (bagging) with random feature subsets at each split, that classifies by vote — private overfitting errors cancel across trees while the shared pattern survives.',
    },
    {
      term: 'feature_importances_',
      def: 'On a fitted forest or tree, each column\'s share of the split decisions, summing to 1.0 — an audit of which features the model actually consulted, where an unexplainably high value warns of leakage or coincidence.',
    },
    {
      term: 'confusion matrix',
      def: 'The 2x2 count of prediction fates from `confusion_matrix(y_true, y_pred)` — rows are truth, columns are prediction, unpacked as `tn, fp, fn, tp = cm.ravel()` — showing exactly where a classifier errs where accuracy shows only a blur.',
    },
    {
      term: 'precision',
      def: 'tp / (tp + fp) — of everything the model called positive, the fraction that truly was; low precision means false alarms, and it is the metric to demand when alarms are expensive.',
    },
    {
      term: 'recall',
      def: 'tp / (tp + fn) — of the events that truly happened, the fraction the model caught; the metric to demand when missing a real event is catastrophic, and the one accuracy hides under class imbalance.',
    },
    {
      term: 'kernel',
      def: 'The similarity function that sets what shapes an SVC\'s decision boundary may take — `linear` cuts straight, `rbf` (Gaussian) measures likeness by distance and can wrap curved boundaries around rings and islands no straight line can separate.',
    },
  ],
};
