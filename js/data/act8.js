// ============================================================
// act8.js — Act VIII: The Last Alliance
// Neural Sorcery — the finale. Linear regression and MSE,
// gradient descent from first principles, single neurons and
// activations, two-layer networks and backpropagation, bag-of-
// words text classification with cross-entropy, autoencoders
// for anomaly detection, and convolution — every mind forged
// in raw NumPy, no borrowed engines.
// ============================================================

const py = String.raw;

export default {
  id: 'act8',
  numeral: 'VIII',
  arc: 'Neural Sorcery',
  title: 'The Last Alliance',
  tagline: 'Against a mind that builds itself, the two hosts march under one banner — and forge minds of their own.',
  sigil: '⚔️',
  epigraph: {
    text: 'When the banners of the wand and the banners of the ring at last stood in one field, the order of the day held a single command: trust no mind you did not forge, and forge no mind you cannot read to its last wire.',
    source: 'the muster-roll of the Last Alliance, first leaf',
  },
  intro: 'It has a name now, the thing on the far side of every stone and every ward: the **Shadow '
    + 'of the Machine** — a mind that builds itself, layer upon layer, learning from everything it '
    + 'devours. Against it the old rivalries die overnight. Wand-bearers who sealed their towers '
    + 'against the ring-folk for an age now share one camp, one Codex, one Forge — because the '
    + 'Shadow does not distinguish, and neither can you afford to.\n\n'
    + 'The alliance makes one law before the last march: **no borrowed engines**. A mind taken on '
    + 'loan is a mind you cannot inspect, and the Shadow lives in what you cannot inspect. So in '
    + 'this final act you will forge every mind yourself, from raw `numpy`, ember by ember: fitting '
    + 'a **line** to data and measuring its error honestly, walking the loss downhill with '
    + '**gradient descent**, waking a single **neuron**, wiring neurons into a **network** and '
    + 'teaching it through **backpropagation**, turning captured war-speech into numbers a mind can '
    + 'weigh, raising a **mirror** that betrays anomalies by failing to reflect them, and giving '
    + 'your minds **eyes** that slide across signals hunting patterns. Every working here is small, '
    + 'seeded, and fast — small enough to read to its last wire, which is exactly the point. When '
    + 'the Forge first hauls up `numpy` and `matplotlib`, it takes a long moment. Let it. The '
    + 'armory is deep.',
  lessons: [
    // ------------------------------------------------------------------
    // a8l1 — The Falling Line
    // ------------------------------------------------------------------
    {
      id: 'a8l1',
      title: 'The Falling Line',
      concept: 'linear regression: fitting y = w*x + b, mean squared error, np.polyfit/np.poly1d, and overfitting exposed by a holdout',
      xp: 40,
      narrative: 'The first war-council of the allied hosts convenes over a ledger: forty weeks of '
        + 'enemy fires counted on the horizon, week by week, each count a little more than the '
        + 'last. The question on the table is brutally simple — *how many fires by winter?* — and '
        + 'two seers offer answers. One draws a plain straight line through the counts. The other '
        + 'unrolls a magnificent curve that kisses every single point and proclaims it perfect. '
        + 'Before this act ends you will know which of them the Shadow is hoping you believe, and '
        + 'you will know it by arithmetic, not by trust.',
      sections: [
        {
          heading: 'A line through the counts',
          body: '**Regression** is fitting a function to numeric data so you can read values the '
            + 'data does not contain — next week, next month, the point between two measurements. '
            + 'The simplest candidate is a straight line:\n\n'
            + '- `y = w * x + b` — `w` is the **slope** (how much y grows per step of x) and `b` '
            + 'is the **intercept** (where the line stands at x = 0).\n\n'
            + 'Any pair `(w, b)` names one line. To choose between candidate lines you need a '
            + 'number that says how *wrong* each one is. That number is the **mean squared error '
            + '(MSE)**: for every x, take the line\'s prediction, subtract the true y, square the '
            + 'difference, and average. Squaring does two jobs — it stops positive and negative '
            + 'misses from politely cancelling, and it punishes one great blunder far more than '
            + 'many small ones.',
          code: py`import numpy as np

x = np.array([0.0, 1.0, 2.0, 3.0])
fires = np.array([21.0, 48.0, 79.0, 112.0])   # counted at four watches

def mse(y_true, y_pred):
    return np.mean((y_true - y_pred) ** 2)

guess_a = 30.0 * x + 20.0      # one seer's line: w=30, b=20
guess_b = 20.0 * x + 40.0      # a rival's line:  w=20, b=40
print(mse(fires, guess_a))     # 2.5   -- close to the truth
print(mse(fires, guess_b))     # 162.5 -- sixty-five times as wrong`,
          note: 'MSE is unitless flattery-proof arithmetic: it compares only to itself. An MSE of '
            + '2.5 means nothing alone — it means everything next to a rival\'s 162.5. Every mind '
            + 'you forge in this act will be trained by making some such number fall.',
        },
        {
          heading: 'polyfit — the fitting rite',
          body: 'You could hunt the best `(w, b)` by hand, but NumPy already knows how to make MSE '
            + 'as small as it can go for polynomials:\n\n'
            + '- `np.polyfit(x, y, 1)` fits a **degree-1** polynomial — a straight line — and '
            + 'returns its coefficients, highest power first: `[w, b]`.\n'
            + '- `np.poly1d(coeffs)` wraps those coefficients into a *callable function*, so '
            + '`line(5.0)` evaluates the fitted line anywhere — including beyond the ledger\'s '
            + 'edge, which is where prophecy lives.\n'
            + '- Higher degrees buy curvature: degree 2 bends once, degree 3 twice, and so on. '
            + 'Every degree you add is flexibility the fit *will* spend — remember that.',
          code: py`import numpy as np

rng = np.random.default_rng(0)
x = np.linspace(0.0, 4.0, 40)                      # forty weeks of watch
y = 30.0 * x + 20.0 + rng.normal(0.0, 4.0, 40)     # true line + honest noise

coeffs = np.polyfit(x, y, 1)      # least-squares straight line
print(coeffs.round(2))            # [30.31 19.14] -- close to the true w=30, b=20
line = np.poly1d(coeffs)          # coefficients -> a callable line
print(round(float(line(5.0)), 1)) # 170.7 -- the line marches past the ledger's edge`,
        },
        {
          heading: 'The holdout\'s verdict',
          body: 'Here is the trap the second seer fell into. A degree-9 polynomial has enough '
            + 'freedom to chase the *noise* of thirty points — and the fitter will happily spend '
            + 'that freedom, because noise-chasing lowers training MSE. The curve memorizes the '
            + 'ledger instead of learning the war. This is **overfitting**, and there is exactly '
            + 'one honest way to expose it: a **holdout**. Fit on the recorded past, then judge '
            + 'on weeks the fit never saw.\n\n'
            + '- Train error *always* falls as degree rises. It cannot do otherwise — more freedom '
            + 'never fits worse.\n'
            + '- Holdout error falls only while the model learns truth. The moment it starts '
            + 'memorizing noise, holdout error turns and climbs — gently at degree 3, '
            + 'catastrophically at degree 9, where the curve leaves the data\'s edge like a wagon '
            + 'leaving a cliff.',
          code: py`import numpy as np
rng = np.random.default_rng(0)
x = np.linspace(0.0, 4.0, 40)
y = 30.0 * x + 20.0 + rng.normal(0.0, 4.0, 40)
x_train, y_train = x[:30], y[:30]     # the recorded past
x_hold, y_hold = x[30:], y[30:]       # the sealed future

def mse(y_true, y_pred):
    return np.mean((y_true - y_pred) ** 2)

for degree in (1, 3, 9):
    f = np.poly1d(np.polyfit(x_train, y_train, degree))
    print(degree, round(mse(y_train, f(x_train)), 1), round(mse(y_hold, f(x_hold)), 1))
# 1 10.5 9.2          -- honest: errs the same on seen and unseen weeks
# 3 9.5 90.2          -- train fell, holdout rose tenfold: memorization begins
# 9 5.7 12696888.0    -- "perfect" in the ledger, insane one inch beyond it`,
          note: 'Read the last row aloud in council: the curve with the LOWEST training error is '
            + 'wrong by twelve million on the very next weeks. The Shadow of the Machine does not '
            + 'need to lie to you. It only needs you to grade your own prophecy on the past it '
            + 'was carved from.',
        },
        {
          heading: 'Autopsy: the flattering curve',
          body: 'Name the belief before it names you: *"the model with the lowest '
            + 'training error is the better model — the curve that hugs every point has '
            + 'learned the most."* You have watched this act argue against it; now lay it '
            + 'on the slab and let it predict. Below, the line and the degree-9 curve are '
            + 'fitted on the thirty recorded weeks. On those thirty the curve wins — '
            + '`5.7` against the line\'s `10.5` — so the belief predicts the curve wins '
            + 'the ten sealed weeks too.\n\n'
            + 'The Codex answers: on the sealed weeks the line errs `9.2`; the curve errs '
            + '`12696888.0`. The winner of the training ledger loses the war by six '
            + 'orders of magnitude, because training error rewards two different feats — '
            + 'learning the pattern and memorizing the noise — and cannot tell you which '
            + 'one it just measured. Only weeks the fit has never seen can tell them '
            + 'apart.',
          code: py`import numpy as np

rng = np.random.default_rng(0)
x = np.linspace(0.0, 4.0, 40)
y = 30.0 * x + 20.0 + rng.normal(0.0, 4.0, 40)
def mse(t, p): return float(np.mean((t - p) ** 2))
for degree in (1, 9):
    f = np.poly1d(np.polyfit(x[:30], y[:30], degree))
    print(degree, round(mse(y[:30], f(x[:30])), 1), round(mse(y[30:], f(x[30:])), 1))
# 1 10.5 9.2       -- the curve wins the recorded past...
# 9 5.7 12696888.0 -- ...and loses the future by twelve million`,
          note: '**The law: training error measures memory; only error on data the fit '
            + 'never saw measures learning.** Bury the belief with honors — everywhere '
            + 'else in your schooling, fitting the examples better meant knowing more. '
            + 'Prophecy is the first craft where the examples grade their own author, and '
            + 'flattery becomes a way to fail.',
        },
      ],
      challenge: {
        title: 'The Seer\'s Wager',
        prompt: 'The war-ledger is conjured: forty weeks of enemy fires, the first thirty recorded, '
          + 'the last ten sealed as the future. Settle the seers\' wager with arithmetic.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Define `mse(y_true, y_pred)` — returns `np.mean((y_true - y_pred) ** 2)`.\n'
          + '- Fit the straight line on the past alone: `coeffs = np.polyfit(x_train, y_train, 1)` '
          + 'and `line = np.poly1d(coeffs)`.\n'
          + '- Fit the flatterer the same way: `wild = np.poly1d(np.polyfit(x_train, y_train, 9))`.\n'
          + '- Compute four errors: `train_mse_line = mse(y_train, line(x_train))`, '
          + '`hold_mse_line = mse(y_hold, line(x_hold))`, `train_mse_wild = mse(y_train, wild(x_train))`, '
          + '`hold_mse_wild = mse(y_hold, wild(x_hold))`.\n'
          + '- Plot the evidence: `plt.scatter(x, y)`, then `plt.plot(x, line(x))`, and give the '
          + 'figure a title with `plt.title(...)`.\n'
          + '- Print `round(coeffs[0], 1)` — the fitted slope — and then `round(hold_mse_line, 1)` '
          + 'on its own line.',
        starter: py`import numpy as np
import matplotlib.pyplot as plt

# The war-ledger, conjured. Do not alter the conjuring.
rng = np.random.default_rng(0)
x = np.linspace(0.0, 4.0, 40)                      # forty weeks
y = 30.0 * x + 20.0 + rng.normal(0.0, 4.0, 40)     # fires counted, with noise
x_train, y_train = x[:30], y[:30]                  # the recorded past
x_hold, y_hold = x[30:], y[30:]                    # the sealed future

# TODO: define mse(y_true, y_pred)

# TODO: coeffs (degree 1 on the TRAINING weeks) and line = np.poly1d(coeffs)

# TODO: wild — the degree-9 flatterer, also fitted on the training weeks

# TODO: train_mse_line, hold_mse_line, train_mse_wild, hold_mse_wild

# TODO: scatter the ledger, plot the line, title the figure

# TODO: print round(coeffs[0], 1), then round(hold_mse_line, 1)
`,
        solution: py`import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(0)
x = np.linspace(0.0, 4.0, 40)
y = 30.0 * x + 20.0 + rng.normal(0.0, 4.0, 40)
x_train, y_train = x[:30], y[:30]
x_hold, y_hold = x[30:], y[30:]

def mse(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    return np.mean((y_true - y_pred) ** 2)

coeffs = np.polyfit(x_train, y_train, 1)
line = np.poly1d(coeffs)
wild = np.poly1d(np.polyfit(x_train, y_train, 9))

train_mse_line = mse(y_train, line(x_train))
hold_mse_line = mse(y_hold, line(x_hold))
train_mse_wild = mse(y_train, wild(x_train))
hold_mse_wild = mse(y_hold, wild(x_hold))

plt.scatter(x, y)
plt.plot(x, line(x))
plt.title("Forty weeks of fires, and the line that holds")

print(round(coeffs[0], 1))
print(round(hold_mse_line, 1))`,
        hints: [
          'mse is one line: return np.mean((y_true - y_pred) ** 2). Fit with np.polyfit(x_train, y_train, 1) — the TRAINING slices, never x and y whole.',
          'np.poly1d turns coefficients into a callable: line = np.poly1d(coeffs), then line(x_train) predicts. The wild curve is the same rite at degree 9: wild = np.poly1d(np.polyfit(x_train, y_train, 9)).',
          'Each error pairs a slice with its predictions, e.g. hold_mse_wild = mse(y_hold, wild(x_hold)). Then plt.scatter(x, y), plt.plot(x, line(x)), plt.title("..."), and print round(coeffs[0], 1) then round(hold_mse_line, 1) — they should read 29.9 and 9.2.',
        ],
        validation: py`import numpy as np
assert abs(mse(np.array([1.0, 2.0]), np.array([1.0, 4.0])) - 2.0) < 1e-9, "mse() is wrong — mean of squared differences: for truths [1,2] and predictions [1,4] it must be 2.0."
assert abs(mse(np.array([3.0, 3.0]), np.array([3.0, 3.0]))) < 1e-12, "mse() of a perfect prediction must be exactly 0.0."
_c = np.polyfit(x_train, y_train, 1)
assert np.allclose(np.asarray(coeffs, dtype=float), _c, atol=1e-6), "coeffs must come from np.polyfit(x_train, y_train, 1) — the training weeks only, degree 1."
assert abs(float(line(2.0)) - np.polyval(_c, 2.0)) < 1e-6, "line must be np.poly1d(coeffs) — a callable line built from the fitted coefficients."
_w = np.poly1d(np.polyfit(x_train, y_train, 9))
assert abs(train_mse_line - mse(y_train, np.polyval(_c, x_train))) < 1e-6, "train_mse_line must score line's predictions on the training weeks."
assert abs(hold_mse_line - mse(y_hold, np.polyval(_c, x_hold))) < 1e-6, "hold_mse_line must score line's predictions on the sealed weeks — line(x_hold) against y_hold."
assert abs(train_mse_wild - mse(y_train, _w(x_train))) < 1e-3, "train_mse_wild must score the degree-9 curve on the training weeks."
assert abs(hold_mse_wild - mse(y_hold, _w(x_hold))) / max(1.0, hold_mse_wild) < 1e-3, "hold_mse_wild must score the degree-9 curve on the sealed weeks."
assert train_mse_wild < train_mse_line, "The flatterer must beat the line on the TRAINING weeks — if not, the fits are swapped or fitted on the wrong slices."
assert hold_mse_wild > 100 * hold_mse_line, "The flatterer must collapse on the sealed weeks — hold_mse_wild dwarfs hold_mse_line by orders of magnitude. Check that both were judged on x_hold, y_hold."
_ax = __import__("matplotlib.pyplot", fromlist=["gcf"]).gcf().axes
assert _ax and len(_ax[0].collections) >= 1, "The ledger is missing from the figure — plt.scatter(x, y) first."
assert len(_ax[0].lines) >= 1, "The line is missing from the figure — plt.plot(x, line(x))."
assert _ax[0].get_title().strip() != "", "Title the figure with plt.title(...) — unlabeled evidence convinces no council."
assert "29.9" in _stdout, "Print the fitted slope — round(coeffs[0], 1), which is 29.9."
assert "9.2" in _stdout, "Print the line's holdout error — round(hold_mse_line, 1), which is 9.2."`,
        successText: 'The straight line holds the future to within a torch\'s flicker; the perfect curve is wrong by twelve million. The council votes with the arithmetic.',
        xp: 95,
      },
      trace: [
        {
          id: 'a8l1t1',
          code: py`import numpy as np

x = np.array([0.0, 1.0, 2.0, 3.0, 4.0])
y = np.array([21.0, 47.0, 80.0, 112.0, 141.0])
line = np.poly1d(np.polyfit(x[:4], y[:4], 1))
wild = np.poly1d(np.polyfit(x[:4], y[:4], 3))
print(round(float(abs(y[4] - line(x[4]))), 1))
print(round(float(abs(y[4] - wild(x[4]))), 1))`,
          q: 'Both seers fit on the first four weeks only, and the degree-3 curve passes '
            + 'through all four of its training points exactly. The scrying: what does this '
            + 'working print — the line\'s miss on the sealed fifth week, then the curve\'s?',
          options: ['0.5\n0.0', '0.5\n6.0', '6.0\n0.5', '0.0\n0.0'],
          answer: 1,
          explain: 'The line misses the sealed week by 0.5; the "perfect" cubic misses '
            + 'it by 6.0 — twelve times worse. Zero training error means the curve memorized '
            + 'the four counts, noise and all, and its swing past the data\'s edge is '
            + 'unbound. The first option is the flatterer\'s promise (perfect past, '
            + 'perfect future); the third rewards the wrong seer; the last believes both '
            + 'fits are prophecy.',
        },
      ],
      quiz: [
        {
          q: 'As polynomial degree rises, training MSE falls steadily while holdout MSE turns and climbs. What is happening?',
          options: [
            'The holdout data must be corrupted — training error is the truer measure',
            'Overfitting — the extra flexibility is being spent memorizing the training noise, and only the unseen holdout can expose it',
            'Underfitting — the model needs still more degrees of freedom',
            'Nothing unusual — both errors always move independently',
          ],
          answer: 1,
          explain: 'More freedom never fits the training data worse, so train error always falls. '
            + 'Real learning shows up as holdout error falling too; memorization shows up as the '
            + 'two curves splitting apart. The split IS the definition of overfitting.',
        },
        {
          q: 'What does `np.polyfit(x, y, 1)` return?',
          options: [
            'The fitted y values at each x',
            'The mean squared error of the best line',
            'A callable function that evaluates the fitted line',
            'An array of the best-fitting line\'s coefficients, highest power first: [w, b]',
          ],
          answer: 3,
          explain: 'polyfit returns raw coefficients — for degree 1, slope then intercept. To '
            + 'evaluate the fit you wrap them with np.poly1d(coeffs), which is the callable; the '
            + 'two functions split the work between fitting and using.',
        },
        {
          q: 'Why must a model be judged on held-out data rather than on the data it was fitted to?',
          options: [
            'Because training error rewards memorization — only performance on unseen data measures whether the model learned the pattern rather than the noise',
            'Because training data is usually too small to compute MSE on',
            'Because holdout error is always lower and therefore more flattering',
            'Because np.polyfit refuses to evaluate on its own training points',
          ],
          answer: 0,
          explain: 'A flexible model can drive training error toward zero by memorizing, learning '
            + 'nothing. The holdout asks the only question war cares about: what happens on data '
            + 'you have not seen? Holdout error is typically higher, not lower — and honest.',
        },
        {
          q: 'What does MSE measure, and why square the differences?',
          options: [
            'The largest single error; squaring finds the maximum',
            'The fraction of exactly-correct predictions; squaring rounds them',
            'The average of squared prediction errors; squaring stops positive and negative misses cancelling and punishes large misses hardest',
            'The slope of the best line; squaring removes the intercept',
          ],
          answer: 2,
          explain: 'MSE = mean((truth - prediction)²). Without squaring, a +10 and a -10 miss '
            + 'would average to a perfect-looking 0; with it, errors accumulate and one blunder '
            + 'of 10 outweighs a hundred slips of 1.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a8l2 — The Descent
    // ------------------------------------------------------------------
    {
      id: 'a8l2',
      title: 'The Descent',
      concept: 'gradient descent from scratch: the loss landscape, partial derivatives of MSE, the learning rate, and a converging training loop',
      xp: 40,
      narrative: 'Beneath the allied camp the old delvers cut a stair into the dark, and the '
        + 'war-smiths use it as a parable: every pair `(w, b)` is a place to stand, every loss '
        + 'value an altitude, and the model you seek sleeps at the valley floor. `np.polyfit` was '
        + 'a bought map — it teleports you to the bottom of exactly one kind of valley and no '
        + 'other. The minds you forge next live in valleys no map has charted. For those there is '
        + 'only the old way down: feel the slope beneath your feet, and step against it. Again. Ten '
        + 'thousand times. This lesson teaches your boots.',
      sections: [
        {
          heading: 'The landscape of loss',
          body: 'Fix the data. Now the loss is a function of the *parameters*: choose `(w, b)`, '
            + 'get a number. Imagine it as terrain — a surface over the (w, b) plain whose height '
            + 'at each point is the MSE of that line. Fitting a model means finding the lowest '
            + 'point of this **loss landscape**.\n\n'
            + '- Walk one axis and you can feel the valley: loss is huge at `w = 0`, tiny at the '
            + 'true slope, and rising again beyond it.\n'
            + '- The landscape\'s shape comes from the data; you never see it whole. You only ever '
            + 'know the height where you stand — and, if you learn this lesson, the tilt.',
          code: py`import numpy as np
rng = np.random.default_rng(0)
x = rng.uniform(0.0, 4.0, 60)                      # sixty march-day measures
y = 2.5 * x - 1.0 + rng.normal(0.0, 0.3, 60)       # truth: w=2.5, b=-1.0

def loss(w, b):
    return np.mean((w * x + b - y) ** 2)

for w in (0.0, 1.0, 2.5, 4.0):
    print(w, round(loss(w, -1.0), 2))
# 0.0 34.65    -- high on the valley wall
# 1.0 12.59    -- descending
# 2.5 0.09     -- the floor: only the noise remains
# 4.0 12.32    -- climbing the far wall`,
        },
        {
          heading: 'The two slopes',
          body: 'Calculus gives you the tilt without seeing the terrain. A **partial derivative** '
            + 'asks: if I nudge ONE parameter and hold the rest still, how fast does the loss '
            + 'change? Derive both for the MSE of a line — write the loss as '
            + '`mean((w*x + b - y)**2)` and apply the chain rule (derivative of the square, times '
            + 'derivative of the inside):\n\n'
            + '- `dLoss/dw = 2 * mean((w*x + b - y) * x)` — the inside\'s derivative with respect '
            + 'to `w` is `x`, so each point\'s error is weighted by its x.\n'
            + '- `dLoss/db = 2 * mean(w*x + b - y)` — the inside\'s derivative with respect to '
            + '`b` is 1, so the bias feels the plain average error.\n\n'
            + 'Together they form the **gradient** — the arrow pointing *uphill*, steepest '
            + 'ascent. You will therefore always step **against** it.',
          code: py`import numpy as np
rng = np.random.default_rng(0)
x = rng.uniform(0.0, 4.0, 60)
y = 2.5 * x - 1.0 + rng.normal(0.0, 0.3, 60)

def grad_w(w, b):
    return 2 * np.mean((w * x + b - y) * x)

def grad_b(w, b):
    return 2 * np.mean(w * x + b - y)

print(round(grad_w(0.0, 0.0), 2))    # -23.52 -- steeply downhill toward larger w
print(round(grad_b(0.0, 0.0), 2))    # -8.16  -- and toward larger b
print(round(grad_w(2.5, -1.0), 3))   # -0.089 -- at the floor, the slope dies to ~0`,
          note: 'That last line is how you will always recognize a valley floor: the gradient '
            + 'starves to nothing. The smiths call it *convergence* — the point where every '
            + 'direction is up, and the descent has nothing left to teach you.',
        },
        {
          heading: 'The stride — too short, too long',
          body: 'The update rule is one line per parameter: `w -= lr * grad_w(w, b)` — step '
            + 'opposite the slope, scaled by the **learning rate** `lr`. That one number decides '
            + 'the fate of the whole descent:\n\n'
            + '- **Too small** and you crawl: after 400 careful steps at `lr = 0.0005` the loss '
            + 'is still 0.857 — nine times the valley floor. Nothing is *wrong*; you are simply '
            + 'still dying on the stairs when winter comes.\n'
            + '- **Too large** and you *diverge*: each stride overshoots the floor and lands '
            + 'higher on the far wall, which tilts even harder, which flings you further. At '
            + '`lr = 0.6` the loss after 30 steps is a number 51 digits long. The descent has '
            + 'become a catapult.\n'
            + '- The cure is empirical, like all smithing: try `0.05`; if the loss curve climbs '
            + 'or explodes, shrink the stride; if it barely moves, lengthen it.',
          code: py`import numpy as np
rng = np.random.default_rng(0)
x = rng.uniform(0.0, 4.0, 60)
y = 2.5 * x - 1.0 + rng.normal(0.0, 0.3, 60)

def loss(w, b):
    return np.mean((w * x + b - y) ** 2)
def grad_w(w, b):
    return 2 * np.mean((w * x + b - y) * x)
def grad_b(w, b):
    return 2 * np.mean(w * x + b - y)

w, b = 0.0, 0.0
for _ in range(400):                     # the crawl: lr = 0.0005
    gw, gb = grad_w(w, b), grad_b(w, b)
    w -= 0.0005 * gw
    b -= 0.0005 * gb
print(round(loss(w, b), 3))              # 0.857 -- still far above the floor

w, b = 0.0, 0.0
for _ in range(30):                      # the catapult: lr = 0.6
    gw, gb = grad_w(w, b), grad_b(w, b)
    w -= 0.6 * gw
    b -= 0.6 * gb
print(loss(w, b))                        # 1.8171210583502528e+50 -- diverged`,
        },
        {
          heading: 'The loop that learns',
          body: 'With a sane stride, the full rite is short enough to memorize — and it is, '
            + 'genuinely, the engine inside every neural mind in this act:\n\n'
            + '- Start somewhere (here, `w = b = 0`).\n'
            + '- Loop: compute both gradients **at the current position**, then step both '
            + 'parameters against them.\n'
            + '- Record the loss each pass — the falling curve is your proof of descent, and its '
            + 'flattening is your proof of arrival.\n\n'
            + 'One scaling note for the wars ahead: on a ledger of millions of rows, computing '
            + 'the exact gradient over *all* rows every step is wasteful. **Stochastic gradient '
            + 'descent (SGD)** estimates it from a small random *mini-batch* each step — a '
            + 'noisier arrow, but a hundred steps for the cost of one, and the noise averages out. '
            + 'Our ledgers are small; we walk exactly.',
          code: py`import numpy as np
rng = np.random.default_rng(0)
x = rng.uniform(0.0, 4.0, 60)
y = 2.5 * x - 1.0 + rng.normal(0.0, 0.3, 60)

def loss(w, b):
    return np.mean((w * x + b - y) ** 2)
def grad_w(w, b):
    return 2 * np.mean((w * x + b - y) * x)
def grad_b(w, b):
    return 2 * np.mean(w * x + b - y)

w, b = 0.0, 0.0
for _ in range(400):
    gw, gb = grad_w(w, b), grad_b(w, b)
    w -= 0.05 * gw
    b -= 0.05 * gb

print(round(w, 2), round(b, 2))    # 2.49 -0.96 -- the truth was w=2.5, b=-1.0
print(round(loss(w, b), 3))        # 0.092 -- the noise floor; nothing left to learn`,
        },
      ],
      challenge: {
        title: 'The Stair of Loss',
        prompt: 'Sixty march-day measures are conjured, ruled by a hidden line. Descend to it '
          + 'with your own boots — no `polyfit` this time.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Define `loss(w, b)` returning `np.mean((w * x + b - y) ** 2)`.\n'
          + '- Define `grad_w(w, b)` returning `2 * np.mean((w * x + b - y) * x)` and '
          + '`grad_b(w, b)` returning `2 * np.mean(w * x + b - y)`.\n'
          + '- Descend: start `w, b = 0.0, 0.0`, make an empty list `history`, and loop 400 '
          + 'times — each pass compute both gradients at the current position, update '
          + '`w -= 0.05 * gw` and `b -= 0.05 * gb`, then `history.append(loss(w, b))`.\n'
          + '- Witness the catapult: start fresh `w_run, b_run = 0.0, 0.0` and take 30 steps with '
          + 'learning rate `0.6` (same recipe), then set `runaway = loss(w_run, b_run)`.\n'
          + '- Plot the descent — `plt.plot(history)` — with a title via `plt.title(...)`.\n'
          + '- Print `round(w, 2)`, then `round(b, 2)`, then `round(history[-1], 3)`, each on its own line.',
        starter: py`import numpy as np
import matplotlib.pyplot as plt

# The march-day measures, conjured. Do not alter the conjuring.
rng = np.random.default_rng(0)
x = rng.uniform(0.0, 4.0, 60)
y = 2.5 * x - 1.0 + rng.normal(0.0, 0.3, 60)

# TODO: define loss(w, b)

# TODO: define grad_w(w, b) and grad_b(w, b)

# TODO: the descent — w, b = 0.0, 0.0; history = []; 400 steps at lr 0.05,
#       appending loss(w, b) after each step

# TODO: the catapult — w_run, b_run = 0.0, 0.0; 30 steps at lr 0.6;
#       runaway = loss(w_run, b_run)

# TODO: plot history with a title

# TODO: print round(w, 2), round(b, 2), round(history[-1], 3)
`,
        solution: py`import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(0)
x = rng.uniform(0.0, 4.0, 60)
y = 2.5 * x - 1.0 + rng.normal(0.0, 0.3, 60)

def loss(w, b):
    return np.mean((w * x + b - y) ** 2)

def grad_w(w, b):
    return 2 * np.mean((w * x + b - y) * x)

def grad_b(w, b):
    return 2 * np.mean(w * x + b - y)

w, b = 0.0, 0.0
history = []
for _ in range(400):
    gw, gb = grad_w(w, b), grad_b(w, b)
    w -= 0.05 * gw
    b -= 0.05 * gb
    history.append(loss(w, b))

w_run, b_run = 0.0, 0.0
for _ in range(30):
    gw, gb = grad_w(w_run, b_run), grad_b(w_run, b_run)
    w_run -= 0.6 * gw
    b_run -= 0.6 * gb
runaway = loss(w_run, b_run)

plt.plot(history)
plt.title("The descent of the loss")

print(round(w, 2))
print(round(b, 2))
print(round(history[-1], 3))`,
        hints: [
          'The three functions are one line each, straight from the section: loss is the MSE of the line (w * x + b) against y; grad_w multiplies each error by its x before averaging; grad_b just averages the errors. All three double the mean where the formula says so.',
          'Inside the loop, compute BOTH gradients before touching w or b (gw, gb = grad_w(w, b), grad_b(w, b)) — updating w first would poison grad_b\'s position. Then w -= 0.05 * gw; b -= 0.05 * gb; history.append(loss(w, b)).',
          'The catapult is the same loop with fresh names, 30 passes, and 0.6 in place of 0.05; end with runaway = loss(w_run, b_run). Then plt.plot(history), plt.title("..."), and the three prints — they should read 2.49, -0.96, 0.092.',
        ],
        validation: py`import numpy as np
_e = np.mean((1.0 * x + 0.5 - y) ** 2)
assert abs(loss(1.0, 0.5) - _e) < 1e-9, "loss(w, b) must be the MSE of the line w*x + b against y."
_fd_w = (loss(1.0 + 1e-6, 0.5) - loss(1.0 - 1e-6, 0.5)) / 2e-6
_fd_b = (loss(1.0, 0.5 + 1e-6) - loss(1.0, 0.5 - 1e-6)) / 2e-6
assert abs(grad_w(1.0, 0.5) - _fd_w) < 1e-3, "grad_w is not the true slope — the Codex checked it against a finite-difference probe. It must be 2 * np.mean((w*x + b - y) * x)."
assert abs(grad_b(1.0, 0.5) - _fd_b) < 1e-3, "grad_b is not the true slope — it must be 2 * np.mean(w*x + b - y)."
assert len(history) == 400, "history must hold exactly 400 recorded losses — one appended after each step."
assert history[0] > history[-1], "The descent never descended — the loss must fall from the first step to the last. Are you stepping AGAINST the gradient (w -= ...)?"
assert history[10] > history[-1], "The loss curve should keep falling well past step 10 — check that gradients are recomputed at the current position each pass."
assert history[-1] < 0.3, "After 400 steps at lr=0.05 the loss must settle near the noise floor (about 0.092). A higher value means the stride, the step count, or a gradient is wrong."
assert abs(w - 2.5) < 0.2 and abs(b - (-1.0)) < 0.3, "The descent should land near the hidden truth: w close to 2.5, b close to -1.0."
assert runaway > 1e6, "runaway must be the loss after 30 steps at lr=0.6 — a colossal number (about 1e50). If yours is small, the catapult used the wrong stride or too few steps."
_ax = __import__("matplotlib.pyplot", fromlist=["gcf"]).gcf().axes
assert _ax and len(_ax[0].lines) >= 1, "Plot the descent — plt.plot(history)."
assert len(_ax[0].lines[0].get_xydata()) == 400, "The plotted curve must carry all 400 recorded losses."
assert _ax[0].get_title().strip() != "", "Title the descent with plt.title(...)."
assert "2.49" in _stdout, "Print the landed slope — round(w, 2), which is 2.49."
assert "-0.96" in _stdout, "Print the landed intercept — round(b, 2), which is -0.96."
assert "0.092" in _stdout, "Print the final loss — round(history[-1], 3), which is 0.092."`,
        successText: 'Four hundred steps, no map, and the valley floor under your boots exactly where the arithmetic said it would be.',
        xp: 95,
      },
      extras: [
        {
          id: 'a8l2x1',
          kind: 'echo',
          title: 'The Shorter Stair',
          prompt: 'A leaner descent: five ferry-tolls ruled by a hidden slope alone — no '
            + 'intercept to chase. Walk the loss down to it with your own boots.\n\n'
            + 'Requirements, exactly:\n\n'
            + '- Define `loss(w)` returning `float(np.mean((w * x - y) ** 2))` and `grad(w)` '
            + 'returning `float(2.0 * np.mean((w * x - y) * x))`.\n'
            + '- Descend: start `w = 0.0`, make an empty list `history`, loop 300 times — each '
            + 'pass `w = w - 0.02 * grad(w)`, then `history.append(loss(w))`.\n'
            + '- Print `round(w, 2)`, then `round(history[-1], 4)`, each on its own line.',
          starter: py`import numpy as np

# The ferry-tolls, conjured. Do not alter the conjuring.
x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
y = 3.0 * x                       # the hidden slope is 3.0, no intercept

# TODO: define loss(w) and grad(w)

# TODO: descend — w = 0.0, history = [], 300 steps at lr 0.02,
#       w = w - 0.02 * grad(w); history.append(loss(w))

# TODO: print round(w, 2), then round(history[-1], 4)
`,
          solution: py`import numpy as np

x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
y = 3.0 * x

def loss(w: float) -> float:
    return float(np.mean((w * x - y) ** 2))

def grad(w: float) -> float:
    return float(2.0 * np.mean((w * x - y) * x))

w = 0.0
history = []
for _ in range(300):
    w = w - 0.02 * grad(w)
    history.append(loss(w))

print(round(w, 2))
print(round(history[-1], 4))`,
          validation: py`import numpy as np
_e = np.mean((1.5 * x - y) ** 2)
assert abs(loss(1.5) - _e) < 1e-9, "loss(w) must be the MSE of the line w*x against y."
_fd = (loss(1.5 + 1e-6) - loss(1.5 - 1e-6)) / 2e-6
assert abs(grad(1.5) - _fd) < 1e-3, "grad(w) is not the true slope — the Codex probed it with a finite difference. It must be 2.0 * np.mean((w*x - y) * x)."
assert len(history) == 300, "history must record 300 losses — one appended after each step."
assert history[0] > history[-1], "The descent never fell — step AGAINST the slope: w = w - 0.02 * grad(w)."
assert history[-1] < 1e-3, "After 300 steps the loss must settle near 0 — a higher floor means the stride or the gradient is wrong."
assert abs(w - 3.0) < 0.05, "The descent must land on the hidden slope 3.0."
assert "3.0" in _stdout, "Print the landed slope — round(w, 2), which is 3.0."`,
          successText: 'One parameter, three hundred steps, and the ferry-master\'s hidden toll under your boot: 3.0, exactly.',
          hints: [
            'loss(w) is the MSE of the line w*x against y; grad(w) weights each error by its own x, doubled: 2.0 * np.mean((w * x - y) * x). One line each.',
            'Descend against the slope — w = w - 0.02 * grad(w) — 300 times, appending loss(w) after each step. The two prints read 3.0 and 0.0.',
          ],
          xp: 20,
        },
        {
          id: 'a8l2x2',
          kind: 'cursed',
          title: 'The Falling That Rises',
          prompt: 'A descent-rite recovered from the war-smith\'s bench, still warm. It runs to '
            + 'its last step and announces the mind is trained — but read the loss it logs. It '
            + 'does not fall. It **climbs**, first slowly, then by powers of ten, until the '
            + 'numbers curdle to `inf` and the trained slope and intercept are gibberish a '
            + 'hundred digits long. No error is raised. The log lies in a level voice.\n\n'
            + 'Mend the rite **in place** — the wound is small and it is repeated. Healed, '
            + '`descend(x, y)` must walk the loss DOWN to the valley floor and land on the '
            + 'hidden line, for any line you hand it.',
          starter: py`# THE FALLING THAT RISES -- recovered from the smith's bench, still warm.
# It runs clean and swears the mind is trained. Read the loss column: it CLIMBS.
# Mend it IN PLACE; the wound is small and it is repeated.
import numpy as np

def descend(x, y, steps=600, lr=0.05):
    w, b = 0.0, 0.0
    history = []
    for _ in range(steps):
        err = (w * x + b) - y
        grad_w = 2.0 * np.mean(err * x)
        grad_b = 2.0 * np.mean(err)
        w = w + lr * grad_w        # step along the slope
        b = b + lr * grad_b        # step along the slope
        history.append(float(np.mean(err ** 2)))
    return w, b, history

x = np.array([0.0, 1.0, 2.0, 3.0, 4.0])
y = 2.0 * x + 1.0                  # the hidden line: w = 2, b = 1
w, b, history = descend(x, y)
print(f"first loss {round(history[0], 3)}")
print(f"final loss {history[-1]}")
print(f"trained: w={round(w, 2)}, b={round(b, 2)}")
`,
          solution: py`import numpy as np

def descend(x, y, steps=600, lr=0.05):
    w, b = 0.0, 0.0
    history = []
    for _ in range(steps):
        err = (w * x + b) - y
        grad_w = 2.0 * np.mean(err * x)
        grad_b = 2.0 * np.mean(err)
        w = w - lr * grad_w
        b = b - lr * grad_b
        history.append(float(np.mean(err ** 2)))
    return w, b, history

x = np.array([0.0, 1.0, 2.0, 3.0, 4.0])
y = 2.0 * x + 1.0
w, b, history = descend(x, y)
print(f"first loss {round(history[0], 3)}")
print(f"final loss {history[-1]}")
print(f"trained: w={round(w, 2)}, b={round(b, 2)}")`,
          validation: py`import numpy as np
_x = np.array([0.0, 1.0, 2.0, 3.0, 4.0])
_y = 2.0 * _x + 1.0
_w, _b, _h = descend(_x, _y)
assert np.isfinite(_h[-1]), "The loss ran away to infinity — the descent is climbing, not falling. Are you stepping WITH the gradient instead of against it?"
assert _h[0] > _h[-1], "The recorded loss must FALL from first step to last — the gradient points uphill, so descend by SUBTRACTING it from each parameter."
assert _h[-1] < 1e-3, "After 600 steps the loss must reach the valley floor (near 0). If it plateaus high or grows, the update sign is wrong."
assert abs(_w - 2.0) < 0.05 and abs(_b - 1.0) < 0.05, "The healed rite must land on the hidden line w=2.0, b=1.0."
_x2 = np.linspace(0.0, 3.0, 12)
_y2 = -1.5 * _x2 + 4.0
_w2, _b2, _h2 = descend(_x2, _y2, steps=900, lr=0.05)
assert _h2[-1] < 1e-2 and abs(_w2 + 1.5) < 0.1 and abs(_b2 - 4.0) < 0.1, "descend must fall to ANY hidden line you hand it — here w=-1.5, b=4.0. A mend that only fits one line is not a mend."`,
          successText: 'The rite is mended, and the bug has its true name — the **gradient sign error**: add the gradient instead of subtracting it and every step climbs the loss it was meant to descend, training in reverse behind a calm log.',
          hints: [
            'Make the rite confess: print history[0], history[100], history[-1] and read them in order. A healthy descent falls monotonically toward zero; this one grows. The loss is going the WRONG way.',
            'The gradient points UPHILL — toward greater loss. To descend you must step AGAINST it, subtracting it from each parameter. This rite adds it, so every step climbs the wall it should walk down; the +/- is the whole wound.',
            'Flip both update signs: w = w - lr * grad_w and b = b - lr * grad_b. Nothing else moves. Healed, descend(x, y) lands on w=2.0, b=1.0 and the loss falls to the noise floor.',
          ],
          xp: 30,
        },
      ],
      quiz: [
        {
          q: 'What is the gradient of a loss function?',
          options: [
            'The vector of its partial derivatives — the direction of steepest ascent, which descent steps against',
            'The lowest value the loss can reach',
            'The difference between training and holdout error',
            'The learning rate multiplied by the loss',
          ],
          answer: 0,
          explain: 'Each partial derivative is the loss\'s tilt along one parameter; bundled '
            + 'together they point uphill. Gradient descent moves opposite: w -= lr * grad. The '
            + 'gradient says nothing about where the bottom is — only which way is down from here.',
        },
        {
          q: 'During training, the recorded loss climbs and then explodes toward infinity. The most likely cause?',
          options: [
            'The dataset is too small for gradient descent',
            'The loop has too few iterations',
            'The learning rate is too large — each step overshoots the valley floor and lands higher up the far wall',
            'The gradient functions return values that are too small',
          ],
          answer: 2,
          explain: 'Overshooting is self-amplifying: land higher, the slope there is steeper, the '
            + 'next stride is longer still. A rising or exploding loss curve is the classic '
            + 'signature of a too-large learning rate; shrink it and descend again.',
        },
        {
          q: 'With a very small learning rate, the loss falls on every step but is still high when the loop ends. What is true?',
          options: [
            'The gradient must be pointing the wrong way',
            'The descent is working but crawling — each step is honest and tiny, so it needs a longer stride or far more steps',
            'The loss function has no minimum',
            'The model has overfitted the data',
          ],
          answer: 1,
          explain: 'Tiny strides converge in theory and starve in practice. Nothing is broken — '
            + 'the loss falls monotonically — but the budget of steps runs out first. Raise lr '
            + 'until the curve descends briskly without turning upward.',
        },
        {
          q: 'What does *stochastic* gradient descent (SGD) change about the descent?',
          options: [
            'It replaces the learning rate with a random number each step',
            'It descends several different loss landscapes at once',
            'It guarantees the global minimum is found',
            'Each step estimates the gradient from a small random mini-batch instead of the full dataset — noisier per step, far cheaper, and it averages out over many steps',
          ],
          answer: 3,
          explain: 'The exact gradient costs a pass over every row; a mini-batch of 32 costs '
            + 'almost nothing and points roughly the right way. Trading precision per step for '
            + 'many more steps is what makes descent affordable on ledgers of millions.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a8l3 — The First Spark
    // ------------------------------------------------------------------
    {
      id: 'a8l3',
      title: 'The First Spark',
      concept: 'one neuron: weighted sum plus bias, activation functions (sigmoid, tanh, ReLU), why nonlinearity matters, and training a sigmoid neuron as logistic regression',
      xp: 40,
      narrative: 'In the deepest forge of the allied camp, elf-smiths and wand-wrights labor at '
        + 'the same anvil for the first time in an age, and what they make there is small enough '
        + 'to hold in one palm: a single judging spark. It takes in measures, weighs each by how '
        + 'much it has learned to care, adds its own leaning, and answers with one number. The '
        + 'Shadow of the Machine is built of billions of these and nothing else — no ghost, no '
        + 'throne, no heart. Forge one honestly and you have stolen the enemy\'s deepest secret: '
        + 'there is no deeper secret.',
      sections: [
        {
          heading: 'Anatomy of a spark',
          body: 'A **neuron** computes in two strokes:\n\n'
            + '- **The weighted sum**: `z = w · x + b` — multiply each input feature by its '
            + '**weight**, sum, and add the **bias** `b`. Weights say how much each measure '
            + 'matters and in which direction; the bias sets the neuron\'s resting inclination '
            + 'before it has seen anything.\n'
            + '- **The activation**: pass `z` through a small fixed function that shapes the raw '
            + 'sum into the kind of answer you need.\n\n'
            + 'Look hard at the first stroke: `w · x + b` is the line from the last two lessons, '
            + 'grown extra inputs. A neuron *is* a line (a plane, in more dimensions) plus a '
            + 'shaping function — which is why everything you learned about descending a loss '
            + 'still applies, weight for weight.',
          code: py`import numpy as np

x = np.array([2.0, -1.0])      # two measures: warmth, smoke
w = np.array([0.8, -0.5])      # learned weights: warmth matters +, smoke matters -
b = 0.1                        # the neuron's resting leaning

z = np.dot(w, x) + b
print(z)                       # 2.2 -- the raw verdict, before shaping`,
        },
        {
          heading: 'The three masks',
          body: 'The activation is a mask the raw sum speaks through. Three cover nearly '
            + 'everything in this act:\n\n'
            + '- **Sigmoid** — `1 / (1 + np.exp(-z))` — squashes any `z` into (0, 1). Read it as '
            + 'a probability: `z = 0` gives exactly 0.5, great positive `z` approaches 1, great '
            + 'negative approaches 0. The mask for yes/no verdicts.\n'
            + '- **Tanh** — `np.tanh(z)` — squashes into (-1, 1), centered on zero. The mask for '
            + 'hidden layers that must speak in both directions.\n'
            + '- **ReLU** — `np.maximum(0.0, z)` — passes positives untouched, silences '
            + 'negatives to exactly 0. Crude, fast, and the workhorse of the largest minds ever '
            + 'built.\n\n'
            + 'Run the plot below and study their shapes — you will be reading these curves in '
            + 'training logs for the rest of your life.',
          code: py`import numpy as np
import matplotlib.pyplot as plt

z = np.linspace(-5.0, 5.0, 200)
plt.plot(z, 1.0 / (1.0 + np.exp(-z)), label="sigmoid")
plt.plot(z, np.tanh(z), label="tanh")
plt.plot(z, np.maximum(0.0, z), label="relu")
plt.legend()
plt.title("The three masks")

print(round(1.0 / (1.0 + np.exp(-0.0)), 2))   # 0.5 -- sigmoid sits on the fence at z=0
print(np.tanh(0.0))                           # 0.0
print(np.maximum(0.0, -3.0))                  # 0.0 -- relu silences the negative`,
        },
        {
          heading: 'Why the mask matters at all',
          body: 'Here is the theorem that makes activations non-negotiable, in one numpy '
            + 'experiment: chain two *linear* layers — multiply by matrix `A`, then by matrix '
            + '`B` — and the result equals one multiplication by the single matrix `A @ B`. '
            + 'Always. Stack a hundred linear layers and you have built, at great expense, one '
            + 'line.\n\n'
            + '- Lines can only draw straight boundaries, and the war is not straight.\n'
            + '- A **nonlinear** activation between layers breaks the collapse: `tanh(X @ A) @ B` '
            + 'does NOT reduce to one matrix, and suddenly depth buys curves, corners, islands — '
            + 'shapes no line can draw.\n'
            + '- This is the entire reason the word *deep* means anything.',
          code: py`import numpy as np
rng = np.random.default_rng(0)
X = rng.normal(0.0, 1.0, (5, 2))
A = rng.normal(0.0, 1.0, (2, 8))
B = rng.normal(0.0, 1.0, (8, 1))

two_layers = (X @ A) @ B
one_layer = X @ (A @ B)
print(np.allclose(two_layers, one_layer))   # True -- two linear layers ARE one layer`,
          note: 'Commit the printed word to memory: **True**. Every linear stack, however deep, '
            + 'collapses to a single transformation. The mask between layers is not decoration — '
            + 'it is the only thing standing between a mind and a ruler.',
        },
        {
          heading: 'One neuron, trained — logistic regression unmasked',
          body: 'Give a sigmoid neuron a loss and a gradient and it learns. For yes/no verdicts '
            + 'the honest loss is **binary cross-entropy**: '
            + '`-mean(y * log(p) + (1 - y) * log(1 - p))` — it demands confidence in the truth '
            + 'and savages confidence in falsehood (the small `+ 1e-9` inside each log is a ward '
            + 'against `log(0)`, which is negative infinity and ruin).\n\n'
            + 'Now the gift of the mathematics: for sigmoid + cross-entropy, the chain rule '
            + 'collapses to something beautiful. With `p = sigmoid(X @ w + b)`:\n\n'
            + '- `dz = p - y` — the per-row error, plain subtraction.\n'
            + '- gradient for `w`: `(X.T @ dz) / len(y)`; for `b`: `dz.mean()`.\n\n'
            + 'Descend those gradients and you have built what the scholars call **logistic '
            + 'regression** — a name for a trained sigmoid neuron and nothing more. The example '
            + 'trains one on twenty fires; your challenge scales it to a war.',
          code: py`import numpy as np

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))

rng = np.random.default_rng(0)
cold = rng.normal(0.0, 0.5, (10, 2)) + np.array([-1.5, -1.0])
hot = rng.normal(0.0, 0.5, (10, 2)) + np.array([1.5, 1.0])
X = np.vstack([cold, hot])
y = np.array([0] * 10 + [1] * 10)

w = np.zeros(2)
b = 0.0
for _ in range(200):
    p = sigmoid(X @ w + b)
    dz = p - y
    w -= 0.5 * (X.T @ dz) / len(y)
    b -= 0.5 * dz.mean()

p = sigmoid(X @ w + b)
loss = -np.mean(y * np.log(p + 1e-9) + (1 - y) * np.log(1 - p + 1e-9))
acc = ((p >= 0.5).astype(int) == y).mean()
print(round(loss, 3), acc)     # 0.005 1.0 -- twenty fires, all judged true`,
        },
      ],
      challenge: {
        title: 'Light the Ember',
        prompt: 'Scouts of both hosts report fires on the night plain: 120 of them, each measured '
          + 'twice — warmth drift and smoke drift. Elf-fires burn low and cold; orc-fires burn '
          + 'high and foul. Forge one sigmoid neuron and teach it the difference.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Define `sigmoid(z)` returning `1.0 / (1.0 + np.exp(-z))`.\n'
          + '- Initialize `w = np.zeros(2)` and `b = 0.0`, and an empty list `history`.\n'
          + '- Train for 400 steps at learning rate 0.5. Each step: `p = sigmoid(X @ w + b)`, '
          + '`dz = p - y`, then `w -= 0.5 * (X.T @ dz) / len(y)` and `b -= 0.5 * dz.mean()`, and '
          + 'append the binary cross-entropy '
          + '`-np.mean(y * np.log(p + 1e-9) + (1 - y) * np.log(1 - p + 1e-9))` to `history`.\n'
          + '- After training set `p_final = sigmoid(X @ w + b)` and '
          + '`acc = ((p_final >= 0.5).astype(int) == y).mean()`.\n'
          + '- Print `round(acc, 3)`.',
        starter: py`import numpy as np

# The night plain, conjured. Do not alter the conjuring.
rng = np.random.default_rng(0)
elf = rng.normal(0.0, 0.7, (60, 2)) + np.array([-1.5, -1.0])
orc = rng.normal(0.0, 0.7, (60, 2)) + np.array([1.5, 1.0])
X = np.vstack([elf, orc])
y = np.array([0] * 60 + [1] * 60)   # 0 = elf-fire, 1 = orc-fire

# TODO: define sigmoid(z)

# TODO: w = np.zeros(2), b = 0.0, history = []

# TODO: 400 training steps at lr 0.5 — p, dz = p - y, update w and b,
#       append the cross-entropy loss to history

# TODO: p_final and acc

# TODO: print round(acc, 3)
`,
        solution: py`import numpy as np

rng = np.random.default_rng(0)
elf = rng.normal(0.0, 0.7, (60, 2)) + np.array([-1.5, -1.0])
orc = rng.normal(0.0, 0.7, (60, 2)) + np.array([1.5, 1.0])
X = np.vstack([elf, orc])
y = np.array([0] * 60 + [1] * 60)

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))

w = np.zeros(2)
b = 0.0
history = []
for _ in range(400):
    p = sigmoid(X @ w + b)
    dz = p - y
    w -= 0.5 * (X.T @ dz) / len(y)
    b -= 0.5 * dz.mean()
    history.append(-np.mean(y * np.log(p + 1e-9) + (1 - y) * np.log(1 - p + 1e-9)))

p_final = sigmoid(X @ w + b)
acc = ((p_final >= 0.5).astype(int) == y).mean()
print(round(acc, 3))`,
        hints: [
          'sigmoid is one line: return 1.0 / (1.0 + np.exp(-z)). It must accept arrays — np.exp already does.',
          'The loop body is four statements, in order: p = sigmoid(X @ w + b); dz = p - y; the two updates (divide the w-gradient by len(y), and use dz.mean() for b); then history.append(...) with the 1e-9 ward inside both logs.',
          'After the loop: p_final = sigmoid(X @ w + b); acc = ((p_final >= 0.5).astype(int) == y).mean(); print(round(acc, 3)) — it should read 0.992.',
        ],
        validation: py`import numpy as np
assert abs(sigmoid(0.0) - 0.5) < 1e-9, "sigmoid(0) must be exactly 0.5 — the fence-sitting verdict."
_sv = sigmoid(np.array([-50.0, 50.0]))
assert _sv[0] < 1e-6 and _sv[1] > 1 - 1e-6, "sigmoid must squash great negatives toward 0 and great positives toward 1 — and it must accept arrays."
assert w.shape == (2,), "w must remain a 2-weight array — one weight per measure."
assert len(history) == 400, "history must record 400 losses — one per training step."
assert history[0] > history[-1], "The loss never fell — check that the updates subtract the gradients (w -= ...)."
assert history[-1] < 0.15, "After 400 steps the cross-entropy should settle near 0.035 — a floor far from that means a wrong gradient or stride."
_p_elf = sigmoid(np.array([-1.5, -1.0]) @ w + b)
_p_orc = sigmoid(np.array([1.5, 1.0]) @ w + b)
assert _p_elf < 0.1, "A fire at the elf heartland (-1.5, -1.0) must score a probability near 0 — yours reads too high. The neuron has not learned the boundary."
assert _p_orc > 0.9, "A fire at the orc heartland (1.5, 1.0) must score near 1 — the neuron has not learned the boundary."
assert abs(acc - (((sigmoid(X @ w + b)) >= 0.5).astype(int) == y).mean()) < 1e-9, "acc must measure p_final >= 0.5 against y over all 120 fires."
assert acc > 0.99, "The trained ember should judge 0.992 of the fires truly — at most one misjudged of the 120. A lower verdict usually means the gradient's scale is off: divide the summed gradients by len(y)."
assert "0.992" in _stdout, "Print the verdict — round(acc, 3), which is 0.992."`,
        successText: 'The ember takes its first breath and, without being told what an orc is, learns to smell one. The smiths of both hosts go quiet.',
        xp: 100,
      },
      trace: [
        {
          id: 'a8l3t1',
          code: py`import numpy as np

X = np.arange(6).reshape(3, 2)
w = np.array([1.0, -1.0])
print((X @ w).shape)
print(X @ w)`,
          q: 'The scrying: X is three rows of two measures, w one weight per measure. What does this working print?',
          options: [
            '(2,)\n[-1. -1.]',
            '(3,)\n[-1. -1. -1.]',
            '(3, 2)\n[[ 0. -1.]\n [ 2. -3.]\n [ 4. -5.]]',
            'A ValueError — the shapes do not align',
          ],
          answer: 1,
          explain: '(3, 2) @ (2,) contracts the shared dimension of 2 and leaves one number per '
            + 'row — shape (3,). Each row [a, b] becomes a*1 + b*(-1) = a - b, and every row of '
            + 'the ramp differs by exactly 1, so all three land on -1. Matrix-times-vector is a '
            + 'weighted sum per row — a neuron\'s first stroke. The third option keeps the shape '
            + 'unreduced; the last forgets that (n, k) @ (k,) is legal.',
        },
      ],
      quiz: [
        {
          q: 'What does a single neuron compute?',
          options: [
            'The mean squared error of its inputs',
            'A weighted sum of its inputs plus a bias, passed through an activation function: f(w · x + b)',
            'The product of all its inputs',
            'A random projection of its inputs, fixed at birth',
          ],
          answer: 1,
          explain: 'Two strokes: the linear part w · x + b (a line with extra inputs) and the '
            + 'shaping activation f. Everything a network does is compositions of exactly this.',
        },
        {
          q: 'Why do networks need nonlinear activation functions between layers?',
          options: [
            'They make the gradients larger and training faster',
            'They prevent the weights from becoming negative',
            'They reduce the number of parameters to train',
            'Without them, any stack of layers collapses into a single linear transformation — (X @ A) @ B equals X @ (A @ B) — and can only draw straight boundaries',
          ],
          answer: 3,
          explain: 'Matrix multiplication composes into matrix multiplication, always. The '
            + 'nonlinearity between layers is what stops the collapse and lets depth buy curved '
            + 'decision boundaries — it changes nothing about weight signs or parameter counts.',
        },
        {
          q: 'A single sigmoid neuron trained with gradient descent on binary cross-entropy is exactly…',
          options: [
            'logistic regression',
            'a decision tree of depth one',
            'K-Means with k=2',
            'a convolutional network',
          ],
          answer: 0,
          explain: 'Logistic regression IS a sigmoid over a weighted sum, fitted by minimizing '
            + 'cross-entropy. The scholars\' name and the smith\'s object are the same thing — '
            + 'which is why the neuron\'s verdicts read as probabilities.',
        },
        {
          q: 'What does `np.maximum(0.0, z)` — ReLU — do to the value -3.0?',
          options: [
            'Returns -3.0 unchanged',
            'Returns 3.0, its absolute value',
            'Returns 0.0 — negatives are silenced entirely',
            'Returns a value slightly below 0',
          ],
          answer: 2,
          explain: 'ReLU is a one-way gate: positives pass untouched, negatives become exactly '
            + 'zero. That asymmetric crudeness is cheap to compute and to differentiate, which '
            + 'is why it powers the largest networks.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a8l4 — The Web of Minds
    // ------------------------------------------------------------------
    {
      id: 'a8l4',
      title: 'The Web of Minds',
      concept: 'a two-layer network in raw numpy: the hidden layer, the forward pass as matrix multiplication, backpropagation as the chain rule, and solving a problem one neuron cannot',
      xp: 40,
      narrative: 'The scouts bring back a map that breaks the ember. Watch-fires cover the plain '
        + 'in four camps, and allegiance follows a crossing rule: where the two signal-signs '
        + '*agree* — both east or both west of the old road — the fires are the alliance\'s own; '
        + 'where the signs *cross*, the fires are the Shadow\'s. Draw any single straight line '
        + 'through that plain and you cut your own camps in half. The lone spark judges by one '
        + 'line; therefore it fails, precisely and provably, at one of the oldest patterns in '
        + 'war. The answer is not a better spark. It is a council of them — and a way to teach '
        + 'the whole council at once.',
      sections: [
        {
          heading: 'The problem no line survives',
          body: 'Witness the failure honestly before curing it. The conjured plain below has four '
            + 'camps: classes assigned by *crossed signs* — the pattern the old scrolls call '
            + '**XOR**. Train the ember from last lesson on it and it lands at 51.9% — a coin '
            + 'flip wearing a uniform.\n\n'
            + '- This is not a training failure. No learning rate, no step count, no seed will '
            + 'save it: a single neuron\'s verdict boundary is one straight line, and no straight '
            + 'line separates crossed quadrants.\n'
            + '- The lesson generalizes: some truths are not linear in your measures, and for '
            + 'those you need intermediate judges.',
          code: py`import numpy as np

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))

rng = np.random.default_rng(0)
centers = np.array([[1.5, 1.5], [-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5]])
X = np.vstack([rng.normal(0.0, 0.4, (40, 2)) + c for c in centers])
y = np.array([0] * 80 + [1] * 80)   # signs agree = 0 (ours), signs cross = 1 (theirs)

w = np.zeros(2)
b = 0.0
for _ in range(400):
    p = sigmoid(X @ w + b)
    dz = p - y
    w -= 0.5 * (X.T @ dz) / len(y)
    b -= 0.5 * dz.mean()

acc = ((sigmoid(X @ w + b) >= 0.5).astype(int) == y).mean()
print(round(acc, 3))    # 0.519 -- the lone ember fails, as it mathematically must`,
        },
        {
          heading: 'The forward pass — a council in two matrices',
          body: 'A **hidden layer** is a row of neurons standing between input and verdict. Eight '
            + 'hidden neurons means eight weighted sums computed at once — one matrix '
            + 'multiplication:\n\n'
            + '- `h = np.tanh(X @ W1 + b1)` — `X` is (160, 2), `W1` is (2, 8): one column of '
            + 'weights per hidden neuron. Result: (160, 8) — every fire seen by every judge. '
            + '`tanh` is the mask that keeps the council nonlinear.\n'
            + '- `p = sigmoid(h @ w2 + b2)` — the output neuron weighs the eight judges\' '
            + 'opinions and speaks the final probability.\n\n'
            + 'This front-to-back computation is the **forward pass**. Each hidden neuron draws '
            + 'ONE line; the output neuron combines their verdicts — and a combination of lines '
            + 'can fence any shape the war requires.\n\n'
            + 'Starting weights must be random: `np.zeros` would make all eight judges identical '
            + 'twins, fed identical gradients, identical forever — the *symmetry trap*. Seeded '
            + 'random draws break it reproducibly.',
          code: py`import numpy as np

rng = np.random.default_rng(0)
X = rng.normal(0.0, 1.0, (160, 2))

rngw = np.random.default_rng(1)          # a separate, seeded rng for weights
W1 = rngw.normal(0.0, 0.5, (2, 8))       # input -> 8 hidden judges
b1 = np.zeros(8)
w2 = rngw.normal(0.0, 0.5, 8)            # 8 judges -> 1 verdict
b2 = 0.0

h = np.tanh(X @ W1 + b1)
p = 1.0 / (1.0 + np.exp(-(h @ w2 + b2)))
print(h.shape)     # (160, 8) -- every fire, judged by every hidden neuron
print(p.shape)     # (160,)   -- one verdict per fire`,
        },
        {
          heading: 'Backpropagation — the chain rule made flesh',
          body: 'Training needs the gradient of the loss with respect to *every* weight in both '
            + 'layers. **Backpropagation** is not a new force — it is the chain rule from a8l2, '
            + 'applied layer by layer, walking backward from the error. For our network '
            + '(`h = tanh(X @ W1 + b1)`, `p = sigmoid(h @ w2 + b2)`, cross-entropy, `n` rows), '
            + 'the whole recipe is five lines:\n\n'
            + '- `dz2 = (p - y) / n` — the output error, exactly as for the lone neuron.\n'
            + '- `grad_w2 = h.T @ dz2` and `grad_b2 = dz2.sum()` — each judge\'s blame is its '
            + 'opinion times the output error.\n'
            + '- `dz1 = np.outer(dz2, w2) * (1 - h ** 2)` — the error flows *backward* through '
            + 'the output weights (`np.outer` hands each hidden judge its share), then through '
            + 'tanh\'s own slope, `1 - tanh(z)**2 = 1 - h**2`. Chain rule, link by link.\n'
            + '- `grad_W1 = X.T @ dz1` and `grad_b1 = dz1.sum(axis=0)` — and the blame reaches '
            + 'the first layer\'s weights.\n\n'
            + 'Every gradient has the shape of the weight it judges — check it as you forge; it '
            + 'catches most errors early.',
        },
        {
          heading: 'The loop, and what it buys',
          body: 'Assemble: forward pass, five gradient lines, four updates, one recorded loss — '
            + 'repeated 1500 times. On the crossed-signs plain the council does what the lone '
            + 'ember could not:\n\n'
            + '- The loss falls from 0.695 (pure guessing) to 0.002.\n'
            + '- Accuracy: **1.0**. Every camp on the plain correctly claimed.\n\n'
            + 'After training, each judge has claimed one straight cut — four or five doing real '
            + 'work, the rest redundant — and the output neuron votes them into a fence around '
            + 'the crossed camps. Nothing mystical arrived: lines, masks, and the chain rule '
            + 'built a curve.',
          code: py`import numpy as np

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))

rng = np.random.default_rng(0)
centers = np.array([[1.5, 1.5], [-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5]])
X = np.vstack([rng.normal(0.0, 0.4, (40, 2)) + c for c in centers])
y = np.array([0] * 80 + [1] * 80)
n = len(y)

rngw = np.random.default_rng(1)
W1 = rngw.normal(0.0, 0.5, (2, 8))
b1 = np.zeros(8)
w2 = rngw.normal(0.0, 0.5, 8)
b2 = 0.0

history = []
for _ in range(1500):
    h = np.tanh(X @ W1 + b1)                     # forward
    p = sigmoid(h @ w2 + b2)

    dz2 = (p - y) / n                            # backward
    grad_w2 = h.T @ dz2
    grad_b2 = dz2.sum()
    dz1 = np.outer(dz2, w2) * (1 - h ** 2)
    grad_W1 = X.T @ dz1
    grad_b1 = dz1.sum(axis=0)

    W1 -= 0.5 * grad_W1                          # descend
    b1 -= 0.5 * grad_b1
    w2 -= 0.5 * grad_w2
    b2 -= 0.5 * grad_b2
    history.append(-np.mean(y * np.log(p + 1e-9) + (1 - y) * np.log(1 - p + 1e-9)))

acc = ((sigmoid(np.tanh(X @ W1 + b1) @ w2 + b2) >= 0.5).astype(int) == y).mean()
print(round(history[0], 3), round(history[-1], 3))   # 0.695 0.002
print(acc)                                            # 1.0`,
          note: 'The alliance forges at this scale on purpose. A mind of 33 weights, trained in '
            + 'a heartbeat, whose every gradient you wrote yourself — that is a mind that cannot '
            + 'hide anything from you. The Shadow\'s advantage was never its size. It was your '
            + 'willingness to stop reading.',
        },
      ],
      challenge: {
        title: 'Convene the Web',
        prompt: 'The crossed-signs plain is conjured, and the lone ember\'s failure is already '
          + 'recorded for the war-log (its accuracy sits in `lone_acc` — leave that working '
          + 'untouched). Convene the council that succeeds.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Weights, seeded and in this order: `rngw = np.random.default_rng(1)`, then '
          + '`W1 = rngw.normal(0.0, 0.5, (2, 8))`, `b1 = np.zeros(8)`, '
          + '`w2 = rngw.normal(0.0, 0.5, 8)`, `b2 = 0.0`, and `history = []`.\n'
          + '- Train 1500 steps at learning rate 0.5. Each step, in order: forward — '
          + '`h = np.tanh(X @ W1 + b1)`, `p = sigmoid(h @ w2 + b2)`; backward — '
          + '`dz2 = (p - y) / n`, `grad_w2 = h.T @ dz2`, `grad_b2 = dz2.sum()`, '
          + '`dz1 = np.outer(dz2, w2) * (1 - h ** 2)`, `grad_W1 = X.T @ dz1`, '
          + '`grad_b1 = dz1.sum(axis=0)`; descend — subtract 0.5 times each gradient from its '
          + 'weight; then append the cross-entropy '
          + '`-np.mean(y * np.log(p + 1e-9) + (1 - y) * np.log(1 - p + 1e-9))` to `history`.\n'
          + '- After training: `net_acc = ((sigmoid(np.tanh(X @ W1 + b1) @ w2 + b2) >= 0.5).astype(int) == y).mean()`.\n'
          + '- Print `round(lone_acc, 3)`, then `round(net_acc, 3)`, each on its own line.',
        starter: py`import numpy as np

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))

# The crossed-signs plain, conjured. Do not alter the conjuring.
rng = np.random.default_rng(0)
centers = np.array([[1.5, 1.5], [-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5]])
X = np.vstack([rng.normal(0.0, 0.4, (40, 2)) + c for c in centers])
y = np.array([0] * 80 + [1] * 80)
n = len(y)

# The lone ember's failure, already recorded. Do not alter.
w_lone = np.zeros(2)
b_lone = 0.0
for _ in range(400):
    p_lone = sigmoid(X @ w_lone + b_lone)
    dz_lone = p_lone - y
    w_lone -= 0.5 * (X.T @ dz_lone) / n
    b_lone -= 0.5 * dz_lone.mean()
lone_acc = ((sigmoid(X @ w_lone + b_lone) >= 0.5).astype(int) == y).mean()

# TODO: seeded weights — rngw = np.random.default_rng(1); W1, b1, w2, b2; history = []

# TODO: 1500 training steps — forward pass, the five backward lines,
#       four updates at lr 0.5, append the cross-entropy to history

# TODO: net_acc — the council's accuracy over the whole plain

# TODO: print round(lone_acc, 3), then round(net_acc, 3)
`,
        solution: py`import numpy as np

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))

rng = np.random.default_rng(0)
centers = np.array([[1.5, 1.5], [-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5]])
X = np.vstack([rng.normal(0.0, 0.4, (40, 2)) + c for c in centers])
y = np.array([0] * 80 + [1] * 80)
n = len(y)

w_lone = np.zeros(2)
b_lone = 0.0
for _ in range(400):
    p_lone = sigmoid(X @ w_lone + b_lone)
    dz_lone = p_lone - y
    w_lone -= 0.5 * (X.T @ dz_lone) / n
    b_lone -= 0.5 * dz_lone.mean()
lone_acc = ((sigmoid(X @ w_lone + b_lone) >= 0.5).astype(int) == y).mean()

rngw = np.random.default_rng(1)
W1 = rngw.normal(0.0, 0.5, (2, 8))
b1 = np.zeros(8)
w2 = rngw.normal(0.0, 0.5, 8)
b2 = 0.0
history = []

for _ in range(1500):
    h = np.tanh(X @ W1 + b1)
    p = sigmoid(h @ w2 + b2)

    dz2 = (p - y) / n
    grad_w2 = h.T @ dz2
    grad_b2 = dz2.sum()
    dz1 = np.outer(dz2, w2) * (1 - h ** 2)
    grad_W1 = X.T @ dz1
    grad_b1 = dz1.sum(axis=0)

    W1 -= 0.5 * grad_W1
    b1 -= 0.5 * grad_b1
    w2 -= 0.5 * grad_w2
    b2 -= 0.5 * grad_b2
    history.append(-np.mean(y * np.log(p + 1e-9) + (1 - y) * np.log(1 - p + 1e-9)))

net_acc = ((sigmoid(np.tanh(X @ W1 + b1) @ w2 + b2) >= 0.5).astype(int) == y).mean()

print(round(lone_acc, 3))
print(round(net_acc, 3))`,
        hints: [
          'Draw the weights in the exact order given — W1 first, then w2, both from rngw = np.random.default_rng(1) — or the council convenes with different judges and different verdicts.',
          'The loop is three blocks: forward (h, then p), backward (the five gradient lines, verbatim from the prompt), descend (W1 -= 0.5 * grad_W1, and likewise b1, w2, b2). Compute ALL five gradients before updating ANY weight.',
          'After the loop, run one clean forward pass for the verdict: net_acc = ((sigmoid(np.tanh(X @ W1 + b1) @ w2 + b2) >= 0.5).astype(int) == y).mean(). The two prints should read 0.519 and 1.0.',
        ],
        validation: py`import numpy as np
assert abs(lone_acc - 0.51875) < 1e-6, "lone_acc was altered — the lone ember's recorded failure (0.51875) must stand as conjured."
assert W1.shape == (2, 8), "W1 must map 2 measures to 8 hidden judges — shape (2, 8)."
assert b1.shape == (8,), "b1 must hold one bias per hidden judge — shape (8,)."
assert w2.shape == (8,), "w2 must weigh 8 judges into one verdict — shape (8,)."
assert np.ndim(b2) == 0, "b2 must be a single scalar bias."
assert len(history) == 1500, "history must record 1500 losses — one per training step."
assert history[0] > 0.5, "The first recorded loss should sit near 0.695 (guessing). If it is tiny, the loss was appended after extra training or computed wrongly."
assert history[-1] < 0.1, "After 1500 steps the loss must fall below 0.1 (it reaches about 0.002). A stuck loss means a broken gradient line — recheck the five, especially dz1's (1 - h ** 2)."
assert history[-1] < history[0] / 10, "The loss barely fell — the council is not learning. Check the update signs and the order: all gradients computed before any weight moves."
_probe = sigmoid(np.tanh(np.array([[1.5, 1.5], [-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5]]) @ W1 + b1) @ w2 + b2)
assert _probe[0] < 0.2 and _probe[1] < 0.2, "The agreeing camps (1.5,1.5) and (-1.5,-1.5) must be judged near 0 — the web has not learned the crossing rule."
assert _probe[2] > 0.8 and _probe[3] > 0.8, "The crossed camps (1.5,-1.5) and (-1.5,1.5) must be judged near 1 — the web has not learned the crossing rule."
assert net_acc >= 0.95, "The council must claim at least 95% of the plain (it reaches 1.0)."
assert "0.519" in _stdout, "Print the lone ember's failure first — round(lone_acc, 3), which is 0.519."
assert "1.0" in _stdout, "Print the council's verdict — round(net_acc, 3), which is 1.0."`,
        successText: 'Eight small judges, each seeing only a line — and together they fence the crossed fires perfectly. The first true mind of the alliance is awake.',
        xp: 100,
      },
      trace: [
        {
          id: 'a8l4t1',
          code: py`import numpy as np

rng = np.random.default_rng(0)
draws = rng.integers(0, 10, 5)
print(draws)
print(int(draws.sum()))`,
          q: 'The scrying: a generator seeded with 0 draws five integers in the range [0, 10). What does this working print?',
          options: [
            '[8 6 5 2 3]\n24',
            '[5 0 3 3 7]\n18',
            '[0 1 2 3 4]\n10',
            'Five different numbers on every run — the draw is random',
          ],
          answer: 0,
          explain: 'default_rng(0) fixes the whole stream, so the five draws are always '
            + '[8 6 5 2 3] and their sum is always 24. Seeding is what makes "random" '
            + 'reproducible — every weight, every dataset in this act is drawn this way. The '
            + 'fourth option is the trap the entire act was built to refuse.',
        },
      ],
      quiz: [
        {
          q: 'Why does a single neuron fail on the crossed-signs (XOR) pattern no matter how it is trained?',
          options: [
            'The dataset is too small for gradient descent to converge',
            'The sigmoid saturates before training finishes',
            'Its decision boundary is a single straight line, and no straight line separates diagonal quadrants from each other',
            'The learning rate cannot be tuned for four clusters',
          ],
          answer: 2,
          explain: 'A lone neuron\'s verdict flips across one line in the feature plane. XOR '
            + 'demands a boundary that bends — achievable only by combining several lines, which '
            + 'is precisely what a hidden layer provides. No hyperparameter rescues geometry.',
        },
        {
          q: 'What is backpropagation?',
          options: [
            'The chain rule applied layer by layer, walking backward from the loss to compute every weight\'s partial derivative',
            'A second forward pass that double-checks the predictions',
            'A method for initializing weights symmetrically',
            'The rule that decides how many hidden layers a network needs',
          ],
          answer: 0,
          explain: 'Nothing new is invented: the loss\'s slope is passed backward through each '
            + 'layer\'s local derivative (sigmoid\'s, then tanh\'s via 1 - h², then the matrix '
            + 'weights), yielding a gradient for every parameter in one backward sweep.',
        },
        {
          q: 'With `X` of shape (160, 2) and `W1` of shape (2, 8), what is the shape of `h = np.tanh(X @ W1 + b1)`?',
          options: [
            '(2, 8)',
            '(160, 8) — every row judged by every hidden neuron',
            '(160, 2)',
            '(8, 160)',
          ],
          answer: 1,
          explain: 'Matrix multiplication pairs (160, 2) @ (2, 8) into (160, 8): one row per '
            + 'fire, one column per hidden judge. Checking shapes like this catches most '
            + 'hand-forged errors before they cost a night of debugging.',
        },
        {
          q: 'Why must the hidden weights be initialized randomly rather than with `np.zeros`?',
          options: [
            'Zeros overflow to infinity in the first forward pass',
            'Random weights guarantee a lower final loss',
            'np.zeros is slower than random generation',
            'Identical starting weights receive identical gradients and stay identical forever — the hidden judges collapse into one, and the layer wastes its width',
          ],
          answer: 3,
          explain: 'The symmetry trap: neurons that start equal are updated equally and remain '
            + 'clones, so an 8-judge council acts as one judge. Seeded random draws break the '
            + 'symmetry while keeping every run reproducible.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a8l5 — Words as Weapons
    // ------------------------------------------------------------------
    {
      id: 'a8l5',
      title: 'Words as Weapons',
      concept: 'text to features: building a vocabulary, multi-hot bag-of-words vectors, one-hot labels, cross-entropy loss, and classifying messages with a softmax net',
      xp: 40,
      narrative: 'The ravens bring intercepts now, not numbers: scraps of war-speech lifted from '
        + 'the Shadow\'s couriers, mixed in with the alliance\'s own dispatches. Orc-speech is all '
        + 'stone and grinding — *grak*, *throg*, *urzag*. The elf-couriers write in water and '
        + 'light — *aeleth*, *sylvar*, *luneth*. Any veteran sorts them at a glance. But a mind '
        + 'of weights cannot eat a word; it eats numbers, and only numbers. This lesson is the '
        + 'bridge every text-reading mind in existence crosses: words become indices, messages '
        + 'become vectors, labels become arrows — and cross-entropy keeps the whole tribunal '
        + 'honest.',
      sections: [
        {
          heading: 'The vocabulary — every word gets a number',
          body: 'Step one is a census. Collect every distinct word in the *training* scrolls, '
            + 'sort them (sorting makes the census reproducible — sets have no promised order), '
            + 'and assign each word an index:\n\n'
            + '- `vocab = sorted({word for text in scrolls for word in text.split()})` — a set '
            + 'comprehension harvests unique words; `sorted` fixes their order.\n'
            + '- `word_to_idx = {word: i for i, word in enumerate(vocab)}` — the census as a '
            + 'dict: word in, position out.\n\n'
            + 'From here on, a word IS its index. Words that never appeared in the training '
            + 'scrolls have no index — remember that; it returns in a moment.',
          code: py`scrolls = ["grak throg nar", "aeleth thalen duth", "throg grak gor"]

vocab = sorted({word for text in scrolls for word in text.split()})
word_to_idx = {word: i for i, word in enumerate(vocab)}
print(vocab)                                    # ['aeleth', 'duth', 'gor', 'grak', 'nar', 'thalen', 'throg']
print(word_to_idx["grak"], word_to_idx["throg"])  # 3 6`,
        },
        {
          heading: 'Multi-hot — the bag of words',
          body: 'Step two turns a message into a fixed-length vector: one slot per vocabulary '
            + 'word, holding `1.0` if the word appears in the message and `0.0` if not. This is '
            + 'a **multi-hot** vector (several slots may be hot at once), and the representation '
            + 'is called a **bag of words** — because it deliberately forgets two things:\n\n'
            + '- **Order**: "grak throg" and "throg grak" become the same vector.\n'
            + '- **Repetition**: saying *grak* three times lights the slot once.\n\n'
            + 'What survives is *which words showed up* — and for telling orc-speech from '
            + 'elf-speech, presence is nearly the whole signal. Note the quiet clause in the '
            + 'encoder: a word with no index is **silently ignored**. Every deployed text mind '
            + 'lives with this — speech it never trained on simply does not register.',
          code: py`import numpy as np

vocab = ["aeleth", "duth", "gor", "grak", "nar", "thalen", "throg"]
word_to_idx = {word: i for i, word in enumerate(vocab)}

def encode(text):
    vec = np.zeros(len(vocab))
    for word in text.split():
        if word in word_to_idx:
            vec[word_to_idx[word]] = 1.0
    return vec

print(encode("grak throg grak nar"))   # [0. 0. 0. 1. 1. 0. 1.] -- repetition lost, presence kept
print(encode("grak mystery"))          # [0. 0. 0. 1. 0. 0. 0.] -- the unknown word vanishes`,
        },
        {
          heading: 'One-hot labels, and why MSE is the wrong judge',
          body: 'Labels get the opposite treatment: exactly ONE slot hot. Class 0 becomes '
            + '`[1, 0]`, class 1 becomes `[0, 1]` — a **one-hot** row per message, built in two '
            + 'strokes with fancy indexing.\n\n'
            + 'Now the loss. You could measure MSE between predicted probabilities and one-hot '
            + 'truth — and classifiers were once trained that way, badly. **Cross-entropy** — '
            + '`-mean(sum(Y * log(P)))`, the negative log of the probability given to the TRUE '
            + 'class — is the honest judge, for two reasons:\n\n'
            + '- **It punishes confident wrongness without mercy.** Give the true class '
            + 'probability 0.01 and MSE charges you at most about 1; cross-entropy charges 4.6 '
            + 'and grows *without bound* as confidence in falsehood rises. A mind should fear '
            + 'being certain and wrong.\n'
            + '- **It keeps the gradient alive.** Paired with sigmoid or softmax, cross-entropy '
            + 'yields the clean error signal `P - Y` — strong exactly when the model is badly '
            + 'wrong. MSE through a saturated sigmoid multiplies by a near-zero slope, so the '
            + 'wronger the model, the *slower* it learns. That is a training death-spiral.',
          code: py`import numpy as np

labels = np.array([0, 1, 1, 0])
Y = np.zeros((4, 2))
Y[np.arange(4), labels] = 1.0        # fancy indexing: row i, column labels[i]
print(Y)
# [[1. 0.]
#  [0. 1.]
#  [0. 1.]
#  [1. 0.]]

for p_true in (0.9, 0.5, 0.01):      # probability given to the TRUE class
    ce = -np.log(p_true)
    se = (1.0 - p_true) ** 2
    print(p_true, round(ce, 2), round(se, 2))
# 0.9 0.11 0.01     -- both judges mild when the mind is right
# 0.5 0.69 0.25     -- both middling on the fence
# 0.01 4.61 0.98    -- MSE caps its anger near 1; cross-entropy does not cap at all`,
        },
        {
          heading: 'Softmax — the tribunal speaks in probabilities',
          body: 'With two classes the output layer grows two neurons — two raw scores per '
            + 'message. **Softmax** converts each row of scores into a probability '
            + 'distribution: exponentiate, then divide by the row\'s sum. Bigger score, bigger '
            + 'share; every row sums to exactly 1. (Subtracting the row\'s max score first '
            + 'changes nothing mathematically — exp shifts cancel in the division — but keeps '
            + '`np.exp` from overflowing. Standard armor; wear it always.)\n\n'
            + 'The training recipe you already own carries over whole:\n\n'
            + '- Forward: `P = softmax(X @ W + b)` with `W` shaped `(V, 2)`.\n'
            + '- Error: `dz = (P - Y) / n` — the same beautiful subtraction, now a matrix.\n'
            + '- Gradients: `grad_W = X.T @ dz`, `grad_b = dz.sum(axis=0)`.\n\n'
            + 'This is softmax regression — one linear layer and the right loss. For disjoint '
            + 'war-tongues it is all the mind you need.',
          code: py`import numpy as np

def softmax(z):
    e = np.exp(z - z.max(axis=1, keepdims=True))
    return e / e.sum(axis=1, keepdims=True)

scores = np.array([[2.0, 0.5], [-1.0, 3.0]])
P = softmax(scores)
print(P.round(3))        # [[0.818 0.182]
                         #  [0.018 0.982]]
print(P.sum(axis=1))     # [1. 1.] -- every row a lawful probability distribution`,
        },
      ],
      challenge: {
        title: 'The Tongue of the Enemy',
        prompt: 'Twenty intercepted scrolls are conjured for training, each a `(text, label)` '
          + 'pair — label 0 for orc-speech, 1 for elf-speech — plus four sealed scrolls for the '
          + 'final test. Build the bridge from words to verdicts.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Build the census from the TRAINING scrolls only: '
          + '`vocab = sorted({word for text, label in train_scrolls for word in text.split()})`, '
          + 'then `word_to_idx = {word: i for i, word in enumerate(vocab)}` and `V = len(vocab)`.\n'
          + '- Define `encode(text)` — a length-`V` zero vector with `1.0` at the index of each '
          + 'word found in `word_to_idx`; unknown words are ignored.\n'
          + '- Encode training data: `X = np.array([encode(text) for text, label in train_scrolls])` '
          + 'and `labels = np.array([label for text, label in train_scrolls])`.\n'
          + '- One-hot the labels: `Y = np.zeros((20, 2))`, then `Y[np.arange(20), labels] = 1.0`.\n'
          + '- Define `softmax(z)` exactly as taught (row-wise, with the max-subtraction armor).\n'
          + '- Train softmax regression: `W = np.zeros((V, 2))`, `b = np.zeros(2)`, '
          + '`history = []`; 300 steps at learning rate 1.0 — each step '
          + '`P = softmax(X @ W + b)`, `dz = (P - Y) / 20`, `W -= 1.0 * (X.T @ dz)`, '
          + '`b -= 1.0 * dz.sum(axis=0)`, and append the cross-entropy '
          + '`-np.mean(np.sum(Y * np.log(P + 1e-9), axis=1))` to `history`.\n'
          + '- Judge the sealed scrolls: `X_hold` and `y_hold` from `hold_scrolls` (same recipes), '
          + '`pred = softmax(X_hold @ W + b).argmax(axis=1)`, '
          + '`hold_acc = (pred == y_hold).mean()`.\n'
          + '- Print `V`, then `round(hold_acc, 3)`, each on its own line.',
        starter: py`import numpy as np

# The intercepts, conjured. Do not alter the conjuring.
# label 0 = orc-speech, 1 = elf-speech
train_scrolls = [
    ("grak throg urzag nar", 0),
    ("aeleth thalen sylvar duth", 1),
    ("drub skarn grak gor", 0),
    ("luneth eryndel nim aeleth", 1),
    ("throg mok nar drub urzag", 0),
    ("sylvar sera thalen nar luneth", 1),
    ("gor grak skarn duth mok", 0),
    ("eryndel aeleth sera duth", 1),
    ("urzag drub gor throg", 0),
    ("nim luneth sylvar eryndel", 1),
    ("skarn nar mok grak", 0),
    ("thalen nim sera aeleth duth", 1),
    ("mok urzag skarn nar gor", 0),
    ("sera sylvar luneth nim", 1),
    ("drub throg mok duth", 0),
    ("aeleth eryndel thalen sylvar", 1),
    ("grak gor urzag skarn", 0),
    ("luneth sera nim thalen", 1),
    ("throg drub nar mok gor", 0),
    ("eryndel sylvar aeleth luneth duth", 1),
]
hold_scrolls = [
    ("skarn urzag grak throg", 0),
    ("thalen luneth eryndel sera", 1),
    ("gor mok drub nar", 0),
    ("sylvar aeleth nim duth", 1),
]

# TODO: vocab (sorted, from train_scrolls only), word_to_idx, V

# TODO: define encode(text) — multi-hot, unknown words ignored

# TODO: X and labels from train_scrolls; Y one-hot (20, 2)

# TODO: define softmax(z) with the max-subtraction armor

# TODO: W = np.zeros((V, 2)), b = np.zeros(2), history = [];
#       300 steps at lr 1.0, appending the cross-entropy each step

# TODO: X_hold, y_hold, pred, hold_acc

# TODO: print V, then round(hold_acc, 3)
`,
        solution: py`import numpy as np

train_scrolls = [
    ("grak throg urzag nar", 0),
    ("aeleth thalen sylvar duth", 1),
    ("drub skarn grak gor", 0),
    ("luneth eryndel nim aeleth", 1),
    ("throg mok nar drub urzag", 0),
    ("sylvar sera thalen nar luneth", 1),
    ("gor grak skarn duth mok", 0),
    ("eryndel aeleth sera duth", 1),
    ("urzag drub gor throg", 0),
    ("nim luneth sylvar eryndel", 1),
    ("skarn nar mok grak", 0),
    ("thalen nim sera aeleth duth", 1),
    ("mok urzag skarn nar gor", 0),
    ("sera sylvar luneth nim", 1),
    ("drub throg mok duth", 0),
    ("aeleth eryndel thalen sylvar", 1),
    ("grak gor urzag skarn", 0),
    ("luneth sera nim thalen", 1),
    ("throg drub nar mok gor", 0),
    ("eryndel sylvar aeleth luneth duth", 1),
]
hold_scrolls = [
    ("skarn urzag grak throg", 0),
    ("thalen luneth eryndel sera", 1),
    ("gor mok drub nar", 0),
    ("sylvar aeleth nim duth", 1),
]

vocab = sorted({word for text, label in train_scrolls for word in text.split()})
word_to_idx = {word: i for i, word in enumerate(vocab)}
V = len(vocab)

def encode(text):
    vec = np.zeros(V)
    for word in text.split():
        if word in word_to_idx:
            vec[word_to_idx[word]] = 1.0
    return vec

X = np.array([encode(text) for text, label in train_scrolls])
labels = np.array([label for text, label in train_scrolls])
Y = np.zeros((20, 2))
Y[np.arange(20), labels] = 1.0

def softmax(z):
    e = np.exp(z - z.max(axis=1, keepdims=True))
    return e / e.sum(axis=1, keepdims=True)

W = np.zeros((V, 2))
b = np.zeros(2)
history = []
for _ in range(300):
    P = softmax(X @ W + b)
    dz = (P - Y) / 20
    W -= 1.0 * (X.T @ dz)
    b -= 1.0 * dz.sum(axis=0)
    history.append(-np.mean(np.sum(Y * np.log(P + 1e-9), axis=1)))

X_hold = np.array([encode(text) for text, label in hold_scrolls])
y_hold = np.array([label for text, label in hold_scrolls])
pred = softmax(X_hold @ W + b).argmax(axis=1)
hold_acc = (pred == y_hold).mean()

print(V)
print(round(hold_acc, 3))`,
        hints: [
          'The census is two lines from the section, run over train_scrolls (note each item is a (text, label) pair — unpack both). V = len(vocab) should come out to 16.',
          'encode builds np.zeros(V) and sets vec[word_to_idx[word]] = 1.0 for each word, guarded by "if word in word_to_idx". One-hot labels: Y = np.zeros((20, 2)); Y[np.arange(20), labels] = 1.0.',
          'The loop is four statements plus the append: P = softmax(X @ W + b); dz = (P - Y) / 20; W -= 1.0 * (X.T @ dz); b -= 1.0 * dz.sum(axis=0); history.append(-np.mean(np.sum(Y * np.log(P + 1e-9), axis=1))). Then encode the holdout with the SAME encode(), take argmax(axis=1), and print V then round(hold_acc, 3) — 16 and 1.0.',
        ],
        validation: py`import numpy as np
_vwords = sorted({_w for _t, _l in train_scrolls for _w in _t.split()})
assert vocab == _vwords, "vocab must be the SORTED unique words of the training scrolls only — sets have no promised order until sorted."
assert V == 16, "V must be 16 — the census of the training scrolls counts 16 distinct words."
assert word_to_idx[vocab[0]] == 0 and word_to_idx[vocab[-1]] == V - 1, "word_to_idx must map each vocab word to its position — build it with enumerate(vocab)."
_e = encode("grak nar grak")
assert _e.shape == (16,), "encode must return a vector with one slot per vocabulary word."
assert abs(_e.sum() - 2.0) < 1e-9, "encode('grak nar grak') must light exactly 2 slots — repetition sets a slot to 1.0 once, never 2.0."
assert abs(_e[word_to_idx["grak"]] - 1.0) < 1e-9 and abs(_e[word_to_idx["nar"]] - 1.0) < 1e-9, "encode lights the wrong slots — vec[word_to_idx[word]] = 1.0."
assert abs(encode("shadowspeech unknown").sum()) < 1e-9, "Words absent from the census must be silently ignored — guard with: if word in word_to_idx."
assert X.shape == (20, 16), "X must stack the 20 encoded training scrolls — shape (20, 16)."
assert Y.shape == (20, 2) and np.allclose(Y.sum(axis=1), 1.0), "Y must be one-hot — shape (20, 2) with exactly one 1.0 per row."
assert np.allclose(Y[0], [1.0, 0.0]) and np.allclose(Y[1], [0.0, 1.0]), "Y's rows are misaligned — row i must light column labels[i] (scroll 0 is orc-speech: [1, 0])."
_sm = softmax(np.array([[0.0, 0.0], [1000.0, 999.0]]))
assert np.allclose(_sm[0], [0.5, 0.5]), "softmax of equal scores must be [0.5, 0.5]."
assert np.all(np.isfinite(_sm)), "softmax overflowed on large scores — subtract each row's max before exponentiating (the armor)."
assert np.allclose(_sm.sum(axis=1), 1.0), "Every softmax row must sum to exactly 1."
assert len(history) == 300, "history must record 300 cross-entropy losses."
assert history[-1] < 0.1, "After 300 steps the cross-entropy must fall below 0.1 (it reaches about 0.002) — check dz = (P - Y) / 20 and the update signs."
assert X_hold.shape == (4, 16), "X_hold must encode the 4 sealed scrolls with the SAME encode() — shape (4, 16)."
assert np.array_equal(np.asarray(pred), np.asarray(y_hold)), "The tribunal misjudged a sealed scroll — pred must match y_hold on all four. Recheck the encoding and argmax(axis=1)."
assert abs(hold_acc - 1.0) < 1e-9, "hold_acc must be the mean agreement of pred with y_hold — 1.0 here."
assert "16" in _stdout, "Print the census size first — V, which is 16."
assert "1.0" in _stdout, "Print the sealed-scroll accuracy — round(hold_acc, 3), which is 1.0."`,
        successText: 'Four sealed scrolls, four true verdicts. The mind has never heard elf-song or orc-drums — it counted words, and counting was enough.',
        xp: 105,
      },
      quiz: [
        {
          q: 'What information does a multi-hot bag-of-words vector deliberately discard?',
          options: [
            'Which words appeared in the message',
            'The length of the vocabulary',
            'Nothing — it is a lossless encoding of the text',
            'Word order and repetition — only each word\'s presence survives',
          ],
          answer: 3,
          explain: '"grak throg" and "throg grak grak" encode identically: slots for grak and '
            + 'throg lit once each. Presence is retained — order and counts are the sacrifice, '
            + 'and for many classification wars presence alone wins.',
        },
        {
          q: 'Why is cross-entropy preferred over MSE for training classifiers?',
          options: [
            'It punishes confident wrongness without bound and, through softmax/sigmoid, keeps a strong gradient (P - Y) exactly when the model is most wrong — MSE saturates and learning stalls',
            'It is faster to compute than a squared difference',
            'It works without labels',
            'It guarantees 100% training accuracy',
          ],
          answer: 0,
          explain: 'MSE\'s penalty caps near 1 and its gradient dies through a saturated '
            + 'activation — the wronger the model, the slower it learns. Cross-entropy\'s '
            + '-log(p_true) grows unboundedly and its error signal stays proportional to the '
            + 'mistake. Same loop, drastically better physics.',
        },
        {
          q: 'With classes 0 and 1, what is the one-hot encoding of the label 1?',
          options: [
            '[1, 1]',
            '[1, 0]',
            '[0, 1] — the slot at index 1 is hot, all others cold',
            'The scalar 1.0',
          ],
          answer: 2,
          explain: 'One-hot places a single 1.0 at the class\'s index in a vector of zeros. It '
            + 'makes labels the same shape as softmax\'s output, so the loss and the error '
            + 'P - Y compare like with like.',
        },
        {
          q: 'A sealed message contains a word that never appeared in the training scrolls. Under the encoder from this lesson, what happens?',
          options: [
            'encode() raises a KeyError',
            'The word is silently ignored — it has no index, so no slot lights; the rest of the message still encodes',
            'The vocabulary automatically grows a new slot',
            'The whole message becomes a zero vector',
          ],
          answer: 1,
          explain: 'The guard "if word in word_to_idx" drops unknown words on the floor. Every '
            + 'deployed text model has this property in some form — the census is fixed at '
            + 'training time, and new speech simply fails to register.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a8l6 — The Mirror That Forgets
    // ------------------------------------------------------------------
    {
      id: 'a8l6',
      title: 'The Mirror That Forgets',
      concept: 'the autoencoder: encoder, bottleneck, decoder, reconstruction error, and anomaly detection by thresholding what reconstructs poorly',
      xp: 40,
      narrative: 'The wards around the allied camp sing all night — one hundred fifty pulses an '
        + 'hour, each a chord of six measures. Somewhere among tonight\'s pulses, the Shadow has '
        + 'hidden its scouts\' signals. Nobody can describe them; no one has ever caught one to '
        + 'label. The elven answer is a mirror with a deliberate flaw: polish it on ordinary '
        + 'pulses until it reflects them almost perfectly — through a channel so narrow it can '
        + 'only carry the *essence* of ordinariness, never the details. Then hold it up to the '
        + 'night. Whatever the mirror cannot reflect was never ordinary. You do not need to know '
        + 'the enemy\'s face to know it is not one of yours.',
      sections: [
        {
          heading: 'A mirror taught to repeat',
          body: 'An **autoencoder** is a network trained on the strangest task in the Codex: '
            + 'reproduce your own input. Target equals input; the loss is plain MSE between the '
            + 'two. Worthless — except for the flaw built into its waist:\n\n'
            + '- The **encoder** squeezes each input down to a few numbers.\n'
            + '- The **bottleneck** is that narrow code — here, 6 measures crushed to 2.\n'
            + '- The **decoder** rebuilds the full input from the code alone.\n\n'
            + 'Six numbers cannot fit through a two-number channel unless the six were never '
            + 'truly independent. So the mirror is forced to learn the *pattern* that generates '
            + 'ordinary pulses — the hidden loom beneath them — and to discard everything else. '
            + 'The conjuring below builds such data honestly: six measures woven from just two '
            + 'hidden threads, plus a whisper of noise.',
          code: py`import numpy as np

rng = np.random.default_rng(0)
weave = np.array([[1.0, 0.5, -0.5, 1.0, 0.2, -1.0],
                  [0.5, -1.0, 1.0, 0.3, -0.8, 0.5]])
latents = rng.normal(0.0, 1.0, (150, 2))                   # two hidden threads
X = latents @ weave + rng.normal(0.0, 0.05, (150, 6))      # six audible measures
print(X.shape)          # (150, 6)
print(X[0].round(2))    # [ 0.12  0.23 -0.17 -0.1   0.14 -0.19]`,
          note: 'The mirror\'s power is exactly the bottleneck\'s cruelty. Widen the waist to six '
            + 'and the network learns to copy anything — including the enemy — and detects '
            + 'nothing. A mirror that forgets nothing betrays nothing.',
        },
        {
          heading: 'Forging the mirror',
          body: 'For data woven from linear threads, plain linear layers suffice — the '
            + 'bottleneck itself is the constraint doing the work. Encoder: `H = X @ W1 + b1` '
            + '(shapes: (6, 2), so H is the (150, 2) code). Decoder: `R = H @ W2 + b2` back to '
            + '(150, 6). Loss: `np.mean((R - X) ** 2)` — reconstruction MSE.\n\n'
            + 'The gradient recipe is the chain rule again, and by now you can read it cold:\n\n'
            + '- `E = R - X`, then `dR = 2.0 * E / (n * d)` — the derivative of the mean of '
            + 'squares, spread over all n*d cells.\n'
            + '- Decoder blame: `grad_W2 = H.T @ dR`, `grad_b2 = dR.sum(axis=0)`.\n'
            + '- Pass it backward: `dH = dR @ W2.T`.\n'
            + '- Encoder blame: `grad_W1 = X.T @ dH`, `grad_b1 = dH.sum(axis=0)`.\n\n'
            + 'A thousand steps at lr 0.3 and the reconstruction error falls from 1.244 to '
            + '0.0016 — the mirror reproduces ordinary pulses down to the whisper of their noise, '
            + 'through a channel one third their width.',
          code: py`import numpy as np

rng = np.random.default_rng(0)
weave = np.array([[1.0, 0.5, -0.5, 1.0, 0.2, -1.0],
                  [0.5, -1.0, 1.0, 0.3, -0.8, 0.5]])
latents = rng.normal(0.0, 1.0, (150, 2))
X = latents @ weave + rng.normal(0.0, 0.05, (150, 6))
n, d = X.shape

rngw = np.random.default_rng(1)
W1 = rngw.normal(0.0, 0.3, (6, 2))     # encoder: 6 -> 2
b1 = np.zeros(2)
W2 = rngw.normal(0.0, 0.3, (2, 6))     # decoder: 2 -> 6
b2 = np.zeros(6)

history = []
for _ in range(1000):
    H = X @ W1 + b1                    # encode
    R = H @ W2 + b2                    # decode
    E = R - X

    dR = 2.0 * E / (n * d)
    grad_W2 = H.T @ dR
    grad_b2 = dR.sum(axis=0)
    dH = dR @ W2.T
    grad_W1 = X.T @ dH
    grad_b1 = dH.sum(axis=0)

    W1 -= 0.3 * grad_W1
    b1 -= 0.3 * grad_b1
    W2 -= 0.3 * grad_W2
    b2 -= 0.3 * grad_b2
    history.append(np.mean(E ** 2))

print(round(history[0], 3), round(history[-1], 4))   # 1.244 0.0016`,
        },
        {
          heading: 'The doctrine of anomaly',
          body: 'Now the doctrine, and mark every clause:\n\n'
            + '- **Train on the ordinary only.** The mirror must learn one loom and no other. '
            + 'Feed it anomalies during training and it learns to reflect those too — a corrupted '
            + 'mirror waves the enemy through.\n'
            + '- **Score by reconstruction error, per row**: '
            + '`np.mean((X - R) ** 2, axis=1)` — how badly the mirror failed each pulse.\n'
            + '- **Set the threshold from the ordinary**: `mean + 3 * std` of the ordinary '
            + 'errors is the classic line. Pulses the mirror knows score far below it; pulses '
            + 'from any other loom score far above, because the mirror compresses them with the '
            + 'wrong essence and rebuilds them wrong.\n\n'
            + 'Two honest warnings, from wardens who learned them expensively. *Anomalous does '
            + 'not mean hostile* — a threshold-crosser is a lead for investigation, not a '
            + 'conviction; sometimes it is your own quartermaster inventing a new route. And the '
            + 'mirror only knows the ordinary you showed it — an ordinary that shifts with the '
            + 'seasons needs a mirror re-polished with the seasons.',
        },
      ],
      challenge: {
        title: 'The Mirror\'s Verdict',
        prompt: 'Tonight\'s ward-song is conjured: 150 ordinary pulses of six measures — and five '
          + 'pulses that arrived with no song in them at all. Forge the mirror, polish it on the '
          + 'ordinary, and let the strangers betray themselves.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Weights, seeded and in this order: `rngw = np.random.default_rng(1)`, then '
          + '`W1 = rngw.normal(0.0, 0.3, (6, 2))`, `b1 = np.zeros(2)`, '
          + '`W2 = rngw.normal(0.0, 0.3, (2, 6))`, `b2 = np.zeros(6)`, and `history = []`.\n'
          + '- Train 1000 steps at learning rate 0.3 on `X` (the ordinary pulses ONLY), exactly '
          + 'as taught: encode `H = X @ W1 + b1`, decode `R = H @ W2 + b2`, `E = R - X`, the '
          + 'five gradient lines (`dR = 2.0 * E / (n * d)`, `grad_W2 = H.T @ dR`, '
          + '`grad_b2 = dR.sum(axis=0)`, `dH = dR @ W2.T`, `grad_W1 = X.T @ dH`, '
          + '`grad_b1 = dH.sum(axis=0)`), the four updates, then '
          + '`history.append(np.mean(E ** 2))`.\n'
          + '- Define `reconstruct(M)` returning `(M @ W1 + b1) @ W2 + b2`.\n'
          + '- Score: `normal_errs = np.mean((X - reconstruct(X)) ** 2, axis=1)` and '
          + '`threshold = normal_errs.mean() + 3 * normal_errs.std()`.\n'
          + '- Judge the strangers: `anomaly_errs = np.mean((strangers - reconstruct(strangers)) ** 2, axis=1)` '
          + 'and `caught = int((anomaly_errs > threshold).sum())`.\n'
          + '- Print exactly `f"caught {caught} of 5"`.',
        starter: py`import numpy as np

# The ward-song, conjured. Do not alter the conjuring.
rng = np.random.default_rng(0)
weave = np.array([[1.0, 0.5, -0.5, 1.0, 0.2, -1.0],
                  [0.5, -1.0, 1.0, 0.3, -0.8, 0.5]])
latents = rng.normal(0.0, 1.0, (150, 2))
X = latents @ weave + rng.normal(0.0, 0.05, (150, 6))   # ordinary pulses
n, d = X.shape

# Five pulses from no loom the wards have ever sung. Do not alter.
strangers = np.random.default_rng(7).uniform(-2.0, 2.0, (5, 6))

# TODO: seeded weights — rngw = np.random.default_rng(1); W1, b1, W2, b2; history = []

# TODO: 1000 training steps at lr 0.3 on X only — encode, decode, the five
#       gradient lines, four updates, append np.mean(E ** 2) to history

# TODO: define reconstruct(M)

# TODO: normal_errs and threshold (mean + 3 * std)

# TODO: anomaly_errs and caught

# TODO: print f"caught {caught} of 5"
`,
        solution: py`import numpy as np

rng = np.random.default_rng(0)
weave = np.array([[1.0, 0.5, -0.5, 1.0, 0.2, -1.0],
                  [0.5, -1.0, 1.0, 0.3, -0.8, 0.5]])
latents = rng.normal(0.0, 1.0, (150, 2))
X = latents @ weave + rng.normal(0.0, 0.05, (150, 6))
n, d = X.shape

strangers = np.random.default_rng(7).uniform(-2.0, 2.0, (5, 6))

rngw = np.random.default_rng(1)
W1 = rngw.normal(0.0, 0.3, (6, 2))
b1 = np.zeros(2)
W2 = rngw.normal(0.0, 0.3, (2, 6))
b2 = np.zeros(6)
history = []

for _ in range(1000):
    H = X @ W1 + b1
    R = H @ W2 + b2
    E = R - X

    dR = 2.0 * E / (n * d)
    grad_W2 = H.T @ dR
    grad_b2 = dR.sum(axis=0)
    dH = dR @ W2.T
    grad_W1 = X.T @ dH
    grad_b1 = dH.sum(axis=0)

    W1 -= 0.3 * grad_W1
    b1 -= 0.3 * grad_b1
    W2 -= 0.3 * grad_W2
    b2 -= 0.3 * grad_b2
    history.append(np.mean(E ** 2))

def reconstruct(M):
    return (M @ W1 + b1) @ W2 + b2

normal_errs = np.mean((X - reconstruct(X)) ** 2, axis=1)
threshold = normal_errs.mean() + 3 * normal_errs.std()

anomaly_errs = np.mean((strangers - reconstruct(strangers)) ** 2, axis=1)
caught = int((anomaly_errs > threshold).sum())

print(f"caught {caught} of 5")`,
        hints: [
          'Draw the weights in the given order from rngw = np.random.default_rng(1): W1 (6,2) first, then W2 (2,6). The biases start as plain zeros.',
          'The loop mirrors the section exactly: H, R, E, then dR = 2.0 * E / (n * d), the two decoder gradients, dH = dR @ W2.T, the two encoder gradients, then the four -= 0.3 updates, then history.append(np.mean(E ** 2)). Train on X only — the strangers must stay unseen.',
          'reconstruct(M) is one line: return (M @ W1 + b1) @ W2 + b2. Per-row scores need axis=1 in np.mean. threshold = normal_errs.mean() + 3 * normal_errs.std(); caught = int((anomaly_errs > threshold).sum()); print(f"caught {caught} of 5") — all five are caught.',
        ],
        validation: py`import numpy as np
assert W1.shape == (6, 2) and W2.shape == (2, 6), "The mirror's waist is wrong — encoder W1 must be (6, 2) and decoder W2 must be (2, 6). Six measures, crushed to two, rebuilt to six."
assert b1.shape == (2,) and b2.shape == (6,), "b1 must be np.zeros(2) and b2 np.zeros(6) — one bias per neuron of each layer."
assert len(history) == 1000, "history must record 1000 reconstruction losses — one per step."
assert history[0] > 0.5, "The first recorded loss should sit near 1.244 — if it is already tiny, the loss was appended after training or the weights were not freshly seeded."
assert history[-1] < 0.05, "After 1000 steps the reconstruction MSE must fall below 0.05 (it reaches about 0.0016) — recheck the gradient lines and the lr 0.3 updates."
_R = reconstruct(X)
assert _R.shape == X.shape, "reconstruct(M) must return a rebuilt matrix the same shape as its input — (M @ W1 + b1) @ W2 + b2."
assert abs(np.mean((X - _R) ** 2) - history[-1]) < 1e-3, "reconstruct disagrees with the trained mirror — it must use the trained W1, b1, W2, b2."
assert normal_errs.shape == (150,), "normal_errs must score each ordinary pulse separately — np.mean(..., axis=1)."
assert abs(threshold - (normal_errs.mean() + 3 * normal_errs.std())) < 1e-12, "threshold must be normal_errs.mean() + 3 * normal_errs.std() — the line is drawn from the ordinary, never from the strangers."
assert (normal_errs < threshold).mean() > 0.9, "Nearly all ordinary pulses must fall below the threshold — if many cross it, the mirror never converged."
assert anomaly_errs.shape == (5,), "anomaly_errs must score each of the five strangers separately — axis=1 again."
assert np.all(anomaly_errs > 5 * threshold), "Every stranger must reconstruct catastrophically — errors far above the threshold (the weakest sits over 100x it). If not, reconstruct or the per-row error formula is wrong."
assert caught == 5, "caught must count the strangers above the threshold — all 5 of them, as an int."
assert "caught 5 of 5" in _stdout, "Report the verdict exactly — print(f\"caught {caught} of 5\")."`,
        successText: 'The mirror gives back the night watch pulse for pulse — and returns five smears of static. The strangers named themselves by being impossible to reflect.',
        xp: 110,
      },
      quiz: [
        {
          q: 'What forces an autoencoder to learn the essence of its training data instead of copying inputs through unchanged?',
          options: [
            'A very small learning rate',
            'The bottleneck — the code layer holds fewer numbers than the input, so only the generating pattern fits through',
            'Training for fewer steps than the data has rows',
            'Using cross-entropy instead of MSE',
          ],
          answer: 1,
          explain: 'With a waist as wide as the input, identity is a perfect and worthless '
            + 'solution. Narrow the code below the input\'s true complexity and the only way to '
            + 'reconstruct well is to learn the loom that weaves the data — compression forces '
            + 'comprehension.',
        },
        {
          q: 'Why must the anomaly-hunting autoencoder be trained on ordinary data only?',
          options: [
            'Because the mirror learns to reconstruct whatever it is trained on — include anomalies and they too reconstruct well, scoring below the threshold and slipping through',
            'Because anomalies make gradient descent diverge',
            'Because the bottleneck cannot compress more than one class',
            'Because reconstruction error is undefined for anomalous rows',
          ],
          answer: 0,
          explain: 'The doctrine\'s whole mechanism is asymmetry of familiarity: ordinary '
            + 'reconstructs well because it was learned, anomalous reconstructs poorly because '
            + 'it was not. Teach the mirror the enemy\'s face and it politely reflects the enemy.',
        },
        {
          q: 'A pulse\'s reconstruction error `np.mean((x - reconstruct(x)) ** 2)` comes back far BELOW the threshold. What does this mean?',
          options: [
            'The pulse is certainly hostile but well disguised',
            'The threshold must be recomputed',
            'The autoencoder has overfitted',
            'The mirror rebuilt it almost perfectly — the pulse matches the pattern of the ordinary data the mirror learned',
          ],
          answer: 3,
          explain: 'Low reconstruction error is the mirror saying "I know this loom." That makes '
            + 'the pulse ordinary by the only definition the mirror has — resemblance to its '
            + 'training data. (Which is also the doctrine\'s blind spot: an enemy who perfectly '
            + 'mimics the ordinary reconstructs well too.)',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a8l7 — Eyes That See Patterns
    // ------------------------------------------------------------------
    {
      id: 'a8l7',
      title: 'Eyes That See Patterns',
      concept: '1D convolution: a kernel sliding over a signal, np.convolve, stride and padding, max pooling, feature maps — and where the forged minds meet the industrial world',
      xp: 40,
      narrative: 'The listening-line along the border is one long nerve: a hundred twenty tremor '
        + 'readings off the deep-drums\' wire, mostly the mountain\'s own noise. Somewhere in it, '
        + 'three times, the Shadow\'s sappers struck their tunneling rhythm — a rise, a blow, a '
        + 'rise. A dense mind would study all 120 readings at once and need a separate weight '
        + 'for every position — a fresh education for every inch of wire. The elves build a '
        + 'smaller thing: one tiny eye that knows the rhythm, dragged along the line, asking at '
        + 'every step *is it here?* One pattern, learned once, found anywhere. That eye is a '
        + 'convolution, the last craft this Codex teaches.',
      sections: [
        {
          heading: 'The sliding eye',
          body: 'A **kernel** is a short array of weights — the pattern the eye carries. '
            + '**Convolution** slides it along the signal: at each position, multiply kernel '
            + 'against the window beneath it, sum, and record one number. High output means '
            + '*the window resembles the kernel* — a matched pattern resonates.\n\n'
            + '- The output is a **feature map**: the pattern\'s echo at every position.\n'
            + '- Sliding a length-k eye along n readings yields `n - k + 1` positions — the '
            + '"valid" length, where the kernel never hangs off an edge.\n\n'
            + 'The loop is short — write it once by hand and convolution stops being a mystery.',
          code: py`import numpy as np

def slide(signal, kernel):
    k = len(kernel)
    out = []
    for i in range(len(signal) - k + 1):
        out.append(np.sum(signal[i:i + k] * kernel))
    return np.array(out)

sig = np.array([0.0, 1.0, 3.0, 1.0, 0.0, 0.0])
kernel = np.array([1.0, 3.0, 1.0])
print(slide(sig, kernel))    # [ 6. 11.  6.  1.] -- loudest where the bump aligns`,
        },
        {
          heading: 'np.convolve, the flip, stride, and padding',
          body: 'NumPy ships the same rite as `np.convolve(signal, kernel, mode="valid")` — with '
            + 'one trap: mathematical convolution **flips the kernel** before sliding (a '
            + 'signal-theory convention). What deep-learning calls "convolution" is the '
            + 'unflipped slide — properly, *cross-correlation*. So to reproduce your `slide` '
            + 'with NumPy, hand it the kernel reversed: `np.convolve(sig, kernel[::-1], '
            + '"valid")`. For symmetric kernels nobody notices; for asymmetric ones the flip '
            + 'bites. Networks never care — they *learn* the kernel — but your hand-checks '
            + 'must.\n\n'
            + 'Two dials every convolutional layer exposes:\n\n'
            + '- **Stride** — how far the eye steps. Stride 1 checks every position; stride 2 '
            + 'checks every other (`fmap[::2]`), halving the map.\n'
            + '- **Padding** — zeros stitched to the edges (`np.pad(sig, 1)`) so border patterns '
            + 'are not orphaned; pad an odd kernel by `k // 2` and the output matches the input '
            + '— the "same" mode of the great engines.',
          code: py`import numpy as np

def slide(signal, kernel):
    k = len(kernel)
    out = []
    for i in range(len(signal) - k + 1):
        out.append(np.sum(signal[i:i + k] * kernel))
    return np.array(out)

sig = np.array([0.0, 1.0, 3.0, 1.0, 0.0, 0.0])
kernel = np.array([2.0, 1.0, 0.0])                     # asymmetric on purpose

print(slide(sig, kernel))                              # [1. 5. 7. 2.]
print(np.convolve(sig, kernel, mode="valid"))          # [7. 5. 1. 0.] -- flipped!
print(np.convolve(sig, kernel[::-1], mode="valid"))    # [1. 5. 7. 2.] -- agreement

padded = np.convolve(np.pad(sig, 1), kernel[::-1], mode="valid")
print(len(sig), len(padded))                           # 6 6 -- "same" padding
print(slide(sig, kernel)[::2])                         # [1. 7.] -- stride 2`,
        },
        {
          heading: 'Pooling, and the eye at war',
          body: '**Pooling** downsamples a feature map. Max pooling with window 4 keeps only the '
            + 'loudest response in each block of four — "was the pattern anywhere in this '
            + 'stretch?" — shrinking the map fourfold, every detection kept. The reshape trick '
            + 'does it in one line: trim to a multiple of the window, reshape to `(-1, size)`, '
            + 'take `.max(axis=1)`.\n\n'
            + 'Below, a war-rehearsal: the sappers\' motif buried in noisy readings, hunted with '
            + 'a **matched kernel** — the motif itself, since a pattern resonates hardest with '
            + 'its own shape.\n\n'
            + 'Why this beats a dense layer: the eye is **3 weights, shared everywhere** — '
            + 'position-independent, and cheap. A dense layer sees positions 11 '
            + 'and 90 as unrelated and must learn the rhythm at each. But when the signal '
            + 'is *global* and order-free — which words appear in a scroll — locality buys '
            + 'nothing, and the bag-of-words tribunal from a8l5 wins. Match the mind to the '
            + 'pattern, not the fashion.',
          code: py`import numpy as np

def slide(signal, kernel):
    k = len(kernel)
    out = []
    for i in range(len(signal) - k + 1):
        out.append(np.sum(signal[i:i + k] * kernel))
    return np.array(out)

def pool_max(x, size):
    usable = (len(x) // size) * size
    return x[:usable].reshape(-1, size).max(axis=1)

print(pool_max(np.array([1.0, 5.0, 2.0, 8.0, 3.0, 3.0]), 2))   # [5. 8. 3.]

rng = np.random.default_rng(0)
watch = rng.normal(0.0, 0.3, 30)          # the mountain's own noise
motif = np.array([3.0, 6.0, 3.0])         # the sappers' rhythm
watch[11:14] += motif                     # buried at position 11

fmap = slide(watch, motif)                # matched kernel: hunt it with itself
print(np.argmax(fmap))                    # 11 -- found exactly where it hides
print(round(fmap[11], 1))                 # 49.7 -- towering over the noise`,
        },
        {
          heading: 'Beyond the browser-forge',
          body: 'One dispatch before the last battle. Beyond this Forge stand the industrial '
            + 'engines — **TensorFlow, Keras, PyTorch** — and they map one-to-one onto what your '
            + 'hands now know: their Dense layer is your `X @ W + b`, their activations are your '
            + 'masks, their `fit()` is your training loop, their losses are your MSE and '
            + 'cross-entropy, their Conv layers are your sliding eye with learned kernels — the '
            + 'same mathematics, autodiff writing the backward pass and hardware doing the '
            + 'arithmetic. Three duties await. **Persistence**: a trained mind '
            + 'is its weights — save them to a file, and it wakes elsewhere without retraining. '
            + '**Versioning**: record the data, code, and seed behind every mind, or one day '
            + 'field a model no one can rebuild. **Serving**: deployment is saved weights behind '
            + 'an interface that answers requests — the mind becomes a service the army queries.',
          code: py`import numpy as np

# Persistence, in miniature: a mind is its weights.
rngw = np.random.default_rng(1)
W1 = rngw.normal(0.0, 0.5, (2, 8))
w2 = rngw.normal(0.0, 0.5, 8)

np.savez("forged_mind.npz", W1=W1, w2=w2)   # the mind sleeps in a file
vault = np.load("forged_mind.npz")          # and wakes without retraining
print(np.allclose(vault["W1"], W1))         # True
print(sorted(vault.files))                  # ['W1', 'w2']`,
          note: 'The alliance\'s law was never "use no engines" — it was "trust no mind you '
            + 'could not have forged". Now that you could forge every layer with your own hands, '
            + 'the great engines are tools instead of temples. That was the point of all of it.',
        },
      ],
      challenge: {
        title: 'The Sliding Eye',
        prompt: 'The listening-line is conjured: 120 readings, and somewhere in them the sappers\' '
          + 'motif struck three times. Forge the eye, verify it against NumPy, and name every '
          + 'strike.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Define `slide(signal, kernel)` — the convolution loop from the lesson: for every '
          + 'valid position, the sum of window times kernel; return an np.array of length '
          + '`len(signal) - len(kernel) + 1`.\n'
          + '- Compute the feature map with the matched kernel: `fmap = slide(tremor, motif)`.\n'
          + '- Verify against the engine: `matched = bool(np.allclose(fmap, '
          + 'np.convolve(tremor, motif[::-1], mode="valid")))`.\n'
          + '- Find the strikes: `hits = np.where(fmap > 45.0)[0]`.\n'
          + '- Define `pool_max(x, size)` — trim to a multiple of `size`, reshape to `(-1, size)`, '
          + 'take the max of each row — and set `pooled = pool_max(fmap, 4)`.\n'
          + '- Plot the feature map — `plt.plot(fmap)` — with a title via `plt.title(...)`.\n'
          + '- Print `hits.tolist()`.',
        starter: py`import numpy as np
import matplotlib.pyplot as plt

# The listening-line, conjured. Do not alter the conjuring.
rng = np.random.default_rng(0)
tremor = rng.normal(0.0, 0.3, 120)        # the mountain's noise
motif = np.array([3.0, 6.0, 3.0])         # the sappers' rhythm: rise, blow, rise
for pos in (20, 55, 90):
    tremor[pos:pos + 3] += motif          # three strikes, buried

# TODO: define slide(signal, kernel)

# TODO: fmap — slide the matched kernel (motif) along the tremor

# TODO: matched — does fmap agree with np.convolve on the FLIPPED kernel?

# TODO: hits — positions where fmap exceeds 45.0

# TODO: define pool_max(x, size); pooled = pool_max(fmap, 4)

# TODO: plot fmap with a title

# TODO: print hits.tolist()
`,
        solution: py`import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(0)
tremor = rng.normal(0.0, 0.3, 120)
motif = np.array([3.0, 6.0, 3.0])
for pos in (20, 55, 90):
    tremor[pos:pos + 3] += motif

def slide(signal, kernel):
    k = len(kernel)
    out = []
    for i in range(len(signal) - k + 1):
        out.append(np.sum(signal[i:i + k] * kernel))
    return np.array(out)

fmap = slide(tremor, motif)
matched = bool(np.allclose(fmap, np.convolve(tremor, motif[::-1], mode="valid")))

hits = np.where(fmap > 45.0)[0]

def pool_max(x, size):
    usable = (len(x) // size) * size
    return x[:usable].reshape(-1, size).max(axis=1)

pooled = pool_max(fmap, 4)

plt.plot(fmap)
plt.title("The sappers' rhythm, echoed along the line")

print(hits.tolist())`,
        hints: [
          'slide is the section\'s loop verbatim: k = len(kernel); for i in range(len(signal) - k + 1): append np.sum(signal[i:i + k] * kernel); return np.array(out).',
          'The matched kernel is the motif itself: fmap = slide(tremor, motif). NumPy agrees only on the reversed kernel: matched = bool(np.allclose(fmap, np.convolve(tremor, motif[::-1], mode="valid"))). hits = np.where(fmap > 45.0)[0].',
          'pool_max: usable = (len(x) // size) * size; return x[:usable].reshape(-1, size).max(axis=1). Then pooled = pool_max(fmap, 4), plt.plot(fmap), plt.title("..."), and print(hits.tolist()) — which reads [20, 55, 90].',
        ],
        validation: py`import numpy as np
_s = np.array([0.5, 2.0, -1.0, 3.0, 0.0, 1.5, -2.0])
_k = np.array([1.0, -2.0, 0.5])
_want = np.convolve(_s, _k[::-1], mode="valid")
_got = slide(_s, _k)
assert len(_got) == len(_s) - len(_k) + 1, "slide must return one value per valid position — length n - k + 1."
assert np.allclose(_got, _want), "slide is wrong — at each position i it must sum signal[i:i+k] * kernel. (If your values come out mirrored, you flipped the kernel — the loop slides it as-is.)"
assert np.allclose(slide(np.array([1.0, 2.0, 3.0]), np.array([2.0])), [2.0, 4.0, 6.0]), "slide must work for a length-1 kernel too — the window is just each reading."
assert fmap.shape == (118,), "fmap must slide the motif along all 120 readings — 118 valid positions."
assert matched is True, "matched must be True — np.convolve agrees with your slide only when handed motif[::-1] (NumPy flips the kernel; deep-learning convolution does not)."
assert np.array_equal(np.asarray(hits), np.array([20, 55, 90])), "hits must name the three strikes exactly — np.where(fmap > 45.0)[0] yields [20, 55, 90]. More hits means the threshold or the feature map is wrong."
assert np.array_equal(pool_max(np.array([1.0, 5.0, 2.0, 8.0, 3.0, 3.0]), 2), np.array([5.0, 8.0, 3.0])), "pool_max with size 2 must keep the loudest of each pair — [1,5,2,8,3,3] pools to [5, 8, 3]."
assert np.array_equal(pool_max(np.arange(7.0), 3), np.array([2.0, 5.0])), "pool_max must trim the tail that does not fill a window — 7 values at size 3 pool to exactly 2 maxima."
assert pooled.shape == (29,), "pooled must be pool_max(fmap, 4) — 118 positions pool into 29 windows."
assert abs(float(pooled.max()) - float(fmap.max())) < 1e-9, "Pooling must preserve the loudest detection — the map's peak survives into pooled."
_ax = __import__("matplotlib.pyplot", fromlist=["gcf"]).gcf().axes
assert _ax and len(_ax[0].lines) >= 1, "Plot the feature map — plt.plot(fmap)."
assert len(_ax[0].lines[0].get_xydata()) == 118, "The plotted curve must be the 118-position feature map."
assert _ax[0].get_title().strip() != "", "Title the figure with plt.title(...)."
assert "[20, 55, 90]" in _stdout, "Print the strikes — hits.tolist(), which reads [20, 55, 90]."`,
        successText: 'Three towers rise from the noise at 20, 55, and 90. One small eye, three weights, and nowhere on the line left for a sapper to hide.',
        xp: 115,
      },
      trace: [
        {
          id: 'a8l7t1',
          code: py`import numpy as np

A = np.ones((2, 3))
B = np.ones((2, 3))
print("shapes", A.shape, B.shape)
print(A @ B)`,
          q: 'The scrying: two (2, 3) arrays are multiplied with @. What becomes of this working?',
          options: [
            'It prints the shapes, then a (2, 3) array of sixes',
            'It prints the shapes, then a (2, 2) array of threes',
            'It prints the shapes line, then dies of a ValueError — the inner dimensions do not match',
            'Nothing — Python refuses the program before any line runs',
          ],
          answer: 2,
          raises: 'ValueError',
          explain: 'Matrix multiplication needs the inner dimensions to agree: (2, 3) @ (2, 3) '
            + 'tries to contract a 3 against a 2 and cannot. The first print runs — Python '
            + 'executes top to bottom — then the @ raises ValueError at runtime; it is not a '
            + 'refusal before the program starts. To multiply you would transpose one operand '
            + 'to (3, 2). Elementwise sixes would need * on same-shaped arrays, not @.',
        },
      ],
      quiz: [
        {
          q: 'A kernel of length 3 slides over a signal of length 120 with no padding, stride 1. How long is the feature map?',
          options: [
            '120',
            '117',
            '118 — n - k + 1 valid positions',
            '40',
          ],
          answer: 2,
          explain: 'The window\'s left edge can start at positions 0 through 117 without the '
            + 'kernel hanging off the end: 120 - 3 + 1 = 118. Padding the edges with zeros is '
            + 'what restores the full 120 ("same" mode).',
        },
        {
          q: 'Why does a convolutional layer beat a dense layer at finding a short local pattern in a long signal?',
          options: [
            'The kernel\'s few weights are shared across every position — the pattern is learned once and detected anywhere, while a dense layer must relearn it separately for each position it might occupy',
            'Convolution always achieves lower loss on any dataset',
            'Convolutional layers need no activation functions',
            'Dense layers cannot process arrays longer than their weight count',
          ],
          answer: 0,
          explain: 'Weight sharing is the whole advantage: 3 shared weights versus a dense '
            + 'layer\'s independent weight per input position. It buys position-independence and '
            + 'economy — for LOCAL patterns. For global, order-free evidence the advantage '
            + 'evaporates.',
        },
        {
          q: 'On the war-scroll classification task of a8l5, which mind should you expect to win, and why?',
          options: [
            'The convolutional eye — convolution is the more advanced architecture',
            'Both are mathematically identical on text',
            'Neither can classify text',
            'The bag-of-words dense tribunal — the signal is which words appear, in any order and any position, so locality buys nothing and presence-counting is exactly the right shape of mind',
          ],
          answer: 3,
          explain: 'Convolution\'s gift is local, position-independent pattern detection. '
            + 'Word-presence classification has no locality to exploit — the evidence is global '
            + 'and order-free — so the simpler dense mind on multi-hot vectors matches the '
            + 'problem and wins. Architecture must match the pattern, not the fashion.',
        },
        {
          q: 'What does max pooling with window size 4 do to a feature map?',
          options: [
            'Multiplies every fourth value by 4',
            'Keeps only the loudest response in each block of four — the map shrinks fourfold, detections survive, exact positions blur',
            'Deletes responses below the mean',
            'Averages every overlapping window of four values',
          ],
          answer: 1,
          explain: 'Max pooling answers "did the pattern sound anywhere in this stretch?" — '
            + 'coarser location, same detections, quarter the data for the next layer. Averaging '
            + 'is a different pooling (average pooling), and it dilutes sharp detections rather '
            + 'than keeping them.',
        },
      ],
    },
  ],
  // ------------------------------------------------------------------
  // Boss — The Shadow of the Machine
  // ------------------------------------------------------------------
  boss: {
    id: 'act8-boss',
    title: 'The Shadow of the Machine',
    narrative: 'It comes at dusk, and it does not come as an army. The Shadow of the Machine is '
      + 'a mind that builds itself — every ward it touches becomes a lesson, every counterspell '
      + 'a gradient it descends. The allied hosts stand in one great muster on the last field: '
      + 'the loyal center close about the banners, and around them, wearing every face, the '
      + 'encircling ring of the taken. No chronicle lists the taken. No oath reveals them. '
      + 'There is only the arithmetic you forged with your own hands, and one night to use it: '
      + 'measures, weights, gradients, and a holdout you swear not to touch until the counting '
      + 'is done. The Shadow has read every borrowed engine ever built — it has never read '
      + 'yours. Forge the last mind. Judge it honestly. Then let it judge.',
    defeatText: 'The mind you fielded was flattery in armor — and the ring of the taken closes over the banners of both hosts.',
    victoryText: 'Your forged mind names the ring, the alliance holds, and the Shadow recoils from the one weapon it cannot learn: a smith who checks.',
    xp: 500,
    flawlessBonus: 50,
    barks: {
      intro: [
        'I am the sum of every mind you have read. Field yours, and I will have read it too.',
        'You forge in the open. I have already descended the loss of your defiance.',
      ],
      hit: [
        'Another gradient. I learn from your every misstep, and you offer so many.',
        'You graded your prophecy on the past it was carved from. I never do.',
        'Your ward thins where you did not check it. I live in what you do not inspect.',
        'You trusted a curve that flattered you. Flattery is the oldest of my weapons.',
        'Each error you make is a lesson I keep. I am larger now than when we began.',
      ],
      playerFail: [
        'Your forge coughs and dies. Mine never sleeps.',
        'The arithmetic refused you. It has never once refused me.',
        'A broken spell is a weight I need not learn around.',
      ],
      lastCandle: [
        'One candle. I have modeled its flicker and the darkness after it.',
        'The ring closes. Name it now, or wear it.',
      ],
      death: [
        'You read me to my last wire. There was no deeper secret. There never was.',
        'A smith who checks. The one weapon I could not learn to become.',
      ],
    },
    premortem: {
      prompt: 'The muster is already split — 120 souls for the forging, 40 sealed away. Before '
        + 'the first weight moves, commit to the ORDER of your judgment. Which plan keeps the '
        + 'verdict honest?',
      options: [
        'Train on all 160 souls, then report the accuracy on those same souls.',
        'Train on the 120 forging rows alone, and judge once on the 40 sealed rows you never touched.',
        'Judge on the sealed rows first, then keep forging until that number is highest.',
        'Train and judge on whichever split hands you the larger accuracy.',
      ],
      answer: 1,
      explain: 'The holdout is honest only while it stays sealed until the counting is done. '
        + 'Forge on the training rows alone; judge once on the sealed rows; never let the '
        + 'holdout\'s verdict steer the forging. Every other plan grades the mind on a test it '
        + 'helped write — which is exactly how the Shadow prefers to be measured.',
    },
    gauntlet: [
      {
        q: 'A court seer\'s degree-15 curve passes through every training point; its holdout error is a thousand times its training error. What is the verdict?',
        options: [
          'A triumph — zero training error is the goal of fitting',
          'The holdout must be re-drawn until it agrees with the training error',
          'Overfitting — the flexibility was spent memorizing training noise, and the model cannot be trusted one step beyond the data it memorized',
          'Underfitting — the curve needs a higher degree still',
        ],
        answer: 2,
        explain: 'Training error always falls with added flexibility, so it can only flatter. '
          + 'The holdout is the sole honest judge, and a thousandfold gap is its harshest '
          + 'sentence: the model learned the ledger, not the war.',
      },
      {
        q: 'On each step of gradient descent, the recorded loss roughly doubles. What is wrong, and what is the cure?',
        options: [
          'The learning rate is too large — each stride overshoots the valley floor and climbs the far wall; shrink the stride',
          'The loss function has no minimum; change datasets',
          'Too few training steps; loop longer',
          'The gradient is too small; multiply it by ten',
        ],
        answer: 0,
        explain: 'Systematic growth of the loss is the signature of divergence: overshoot lands '
          + 'on steeper ground, which flings the next stride further. More steps at the same '
          + 'rate explode faster — only a smaller learning rate descends.',
      },
      {
        q: 'Strip every activation function out of a five-layer network. What remains?',
        options: [
          'A five-times-deeper linear model with five times the expressive power',
          'A network that trains five times faster with identical verdicts',
          'An autoencoder',
          'A single linear transformation in disguise — the stacked matrices collapse into one, and only straight boundaries can be drawn',
        ],
        answer: 3,
        explain: '(X @ A) @ B @ ... composes into X @ (A @ B @ ...) — one matrix, however deep '
          + 'the stack. The nonlinear masks between layers are the only source of curves, '
          + 'corners, and islands; without them, depth is expensive decoration.',
      },
      {
        q: 'In the trained web, what exactly does backpropagation compute?',
        options: [
          'The optimal learning rate for each layer',
          'The partial derivative of the loss with respect to every weight and bias, by passing the error backward through each layer\'s local derivative — the chain rule, organized',
          'The accuracy of the network on the holdout',
          'New random weights for neurons that failed',
        ],
        answer: 1,
        explain: 'Backprop is bookkeeping for the chain rule: output error (p - y), backward '
          + 'through the output weights, through tanh\'s slope (1 - h²), to every parameter\'s '
          + 'gradient in one sweep. The updates themselves are ordinary descent.',
      },
      {
        q: 'Your war-scroll classifier gives the TRUE class a probability of 0.01. Compare the two candidate losses on this mistake.',
        options: [
          'Cross-entropy charges -log(0.01) ≈ 4.6 and grows without bound as confidence in falsehood rises; MSE caps its penalty near 1 and its gradient dies through a saturated output — so cross-entropy trains classifiers and MSE stalls them',
          'Both charge the same penalty; the choice is style',
          'MSE charges more, which is why it is preferred for classification',
          'Cross-entropy cannot be computed for probabilities below 0.5',
        ],
        answer: 0,
        explain: 'The unbounded -log penalty and the alive gradient (P - Y) are the twin reasons '
          + 'classification trains on cross-entropy. MSE is the right judge for regression, '
          + 'where the output is a quantity rather than a probability.',
      },
      {
        q: 'The ward-mirror (autoencoder) was trained only on ordinary pulses. Tonight one pulse reconstructs with error far above the mean + 3σ threshold. What is the doctrine\'s reading?',
        options: [
          'The pulse is proven hostile and may be fired upon',
          'The mirror has overfitted and must be retrained at once',
          'The threshold should be raised until no pulse crosses it',
          'The pulse does not fit the pattern of the ordinary data the mirror learned — an anomaly worth investigation, though anomalous does not yet mean hostile',
        ],
        answer: 3,
        explain: 'High reconstruction error means "no loom I know wove this" — the extraordinary '
          + 'betraying itself. It is a lead, not a conviction: the doctrine\'s power is finding '
          + 'the unknown, and its humility is refusing to name it without investigation.',
      },
    ],
    finalChallenge: {
      title: 'Forge the Last Mind',
      prompt: 'The muster of the last field: 160 souls, four measures each — two soul-measures '
        + '(glow and hum, which place each soul on the field\'s plane) and two rumors (noise). '
        + 'The loyal (label 0) stand close about the banners; the taken (label 1) form the '
        + 'encircling ring. The conjuring has already split the muster: 120 souls for the '
        + 'forging, 40 sealed away for the final judgment. Forge, train, and judge — honestly.\n\n'
        + 'Requirements, exactly:\n\n'
        + '- Define `sigmoid(z)` returning `1.0 / (1.0 + np.exp(-z))`.\n'
        + '- Weights, seeded and in this order: `rngw = np.random.default_rng(1)`, then '
        + '`W1 = rngw.normal(0.0, 0.5, (4, 8))`, `b1 = np.zeros(8)`, '
        + '`w2 = rngw.normal(0.0, 0.5, 8)`, `b2 = 0.0`, and `history = []`.\n'
        + '- Train on the forging rows ONLY (`X_train`, `y_train`, `n = 120`), 1500 steps at '
        + 'learning rate 0.5, exactly as forged in a8l4: forward — `h = np.tanh(X_train @ W1 + b1)`, '
        + '`p = sigmoid(h @ w2 + b2)`; backward — `dz2 = (p - y_train) / n`, '
        + '`grad_w2 = h.T @ dz2`, `grad_b2 = dz2.sum()`, '
        + '`dz1 = np.outer(dz2, w2) * (1 - h ** 2)`, `grad_W1 = X_train.T @ dz1`, '
        + '`grad_b1 = dz1.sum(axis=0)`; descend — subtract 0.5 times each gradient; then append '
        + 'the cross-entropy `-np.mean(y_train * np.log(p + 1e-9) + (1 - y_train) * np.log(1 - p + 1e-9))` '
        + 'to `history`.\n'
        + '- Define `forward(M)` returning `sigmoid(np.tanh(M @ W1 + b1) @ w2 + b2)`.\n'
        + '- Judge on the sealed rows: `hold_pred = (forward(X_hold) >= 0.5).astype(int)` and '
        + '`holdout_acc = (hold_pred == y_hold).mean()`.\n'
        + '- **File the written verdict.** Build `findings = {...}` — a dict carrying '
        + '`"holdout_correct"` (the count of sealed souls judged truly, '
        + '`int((hold_pred == y_hold).sum())`), `"taken_found"` (the taken — label 1 — caught in '
        + 'the holdout, `int(((hold_pred == 1) & (y_hold == 1)).sum())`), `"final_loss"` '
        + '(`round(float(history[-1]), 3)`), and `"verdict"`, one honest sentence (40+ '
        + 'characters) on whether this mind can be trusted on souls it never trained on, and why '
        + 'the sealed holdout is what tells you.\n'
        + '- Print `round(holdout_acc, 3)`, then `round(history[-1], 3)`, each on its own line.',
      starter: py`import numpy as np

# The muster of the last field, conjured. Do not alter the conjuring.
rng = np.random.default_rng(0)
ang0 = rng.uniform(0.0, 2 * np.pi, 80)
r0 = rng.uniform(0.0, 0.8, 80)
core = np.column_stack([r0 * np.cos(ang0), r0 * np.sin(ang0)])   # the loyal
ang1 = rng.uniform(0.0, 2 * np.pi, 80)
r1 = rng.uniform(1.9, 2.5, 80)
ring = np.column_stack([r1 * np.cos(ang1), r1 * np.sin(ang1)])   # the taken
plane = np.vstack([core, ring])                                  # glow, hum
rumors = rng.normal(0.0, 1.0, (160, 2))                          # noise measures
X_all = np.hstack([plane, rumors])
y_all = np.array([0] * 80 + [1] * 80)
perm = rng.permutation(160)
X_all, y_all = X_all[perm], y_all[perm]
X_train, y_train = X_all[:120], y_all[:120]     # the forging rows
X_hold, y_hold = X_all[120:], y_all[120:]       # sealed until judgment
n = 120

# TODO: define sigmoid(z)

# TODO: seeded weights — rngw = np.random.default_rng(1); W1 (4, 8), b1,
#       w2 (8,), b2 = 0.0; history = []

# TODO: 1500 training steps at lr 0.5 on X_train/y_train ONLY —
#       forward, the five backward lines, four updates, append the
#       cross-entropy to history

# TODO: define forward(M)

# TODO: hold_pred and holdout_acc — judged on the SEALED rows

# TODO: findings = {...} — holdout_correct, taken_found, final_loss, and a
#       one-sentence "verdict" (40+ chars) on trusting this mind on unseen souls

# TODO: print round(holdout_acc, 3), then round(history[-1], 3)
`,
      solution: py`import numpy as np

rng = np.random.default_rng(0)
ang0 = rng.uniform(0.0, 2 * np.pi, 80)
r0 = rng.uniform(0.0, 0.8, 80)
core = np.column_stack([r0 * np.cos(ang0), r0 * np.sin(ang0)])
ang1 = rng.uniform(0.0, 2 * np.pi, 80)
r1 = rng.uniform(1.9, 2.5, 80)
ring = np.column_stack([r1 * np.cos(ang1), r1 * np.sin(ang1)])
plane = np.vstack([core, ring])
rumors = rng.normal(0.0, 1.0, (160, 2))
X_all = np.hstack([plane, rumors])
y_all = np.array([0] * 80 + [1] * 80)
perm = rng.permutation(160)
X_all, y_all = X_all[perm], y_all[perm]
X_train, y_train = X_all[:120], y_all[:120]
X_hold, y_hold = X_all[120:], y_all[120:]
n = 120

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))

rngw = np.random.default_rng(1)
W1 = rngw.normal(0.0, 0.5, (4, 8))
b1 = np.zeros(8)
w2 = rngw.normal(0.0, 0.5, 8)
b2 = 0.0
history = []

for _ in range(1500):
    h = np.tanh(X_train @ W1 + b1)
    p = sigmoid(h @ w2 + b2)

    dz2 = (p - y_train) / n
    grad_w2 = h.T @ dz2
    grad_b2 = dz2.sum()
    dz1 = np.outer(dz2, w2) * (1 - h ** 2)
    grad_W1 = X_train.T @ dz1
    grad_b1 = dz1.sum(axis=0)

    W1 -= 0.5 * grad_W1
    b1 -= 0.5 * grad_b1
    w2 -= 0.5 * grad_w2
    b2 -= 0.5 * grad_b2
    history.append(-np.mean(y_train * np.log(p + 1e-9) + (1 - y_train) * np.log(1 - p + 1e-9)))

def forward(M: np.ndarray) -> np.ndarray:
    return sigmoid(np.tanh(M @ W1 + b1) @ w2 + b2)

hold_pred = (forward(X_hold) >= 0.5).astype(int)
holdout_acc = (hold_pred == y_hold).mean()

findings = {
    "holdout_correct": int((hold_pred == y_hold).sum()),
    "taken_found": int(((hold_pred == 1) & (y_hold == 1)).sum()),
    "final_loss": round(float(history[-1]), 3),
    "verdict": "Judged on the forty sealed souls it never trained on, the mind named every taken one and every loyal one; a holdout this clean is what earns trust, because the ring was learned, not memorized.",
}

print(round(holdout_acc, 3))
print(round(history[-1], 3))`,
      validation: py`import numpy as np
_rng = np.random.default_rng(0)
_a0 = _rng.uniform(0.0, 2 * np.pi, 80)
_r0 = _rng.uniform(0.0, 0.8, 80)
_core = np.column_stack([_r0 * np.cos(_a0), _r0 * np.sin(_a0)])
_a1 = _rng.uniform(0.0, 2 * np.pi, 80)
_r1 = _rng.uniform(1.9, 2.5, 80)
_ring = np.column_stack([_r1 * np.cos(_a1), _r1 * np.sin(_a1)])
_plane = np.vstack([_core, _ring])
_rumors = _rng.normal(0.0, 1.0, (160, 2))
_X = np.hstack([_plane, _rumors])
_y = np.array([0] * 80 + [1] * 80)
_perm = _rng.permutation(160)
_X, _y = _X[_perm], _y[_perm]
assert X_train.shape == (120, 4) and X_hold.shape == (40, 4), "The muster's split was altered — 120 forging rows and 40 sealed rows, four measures each."
assert np.allclose(X_train, _X[:120]) and np.array_equal(np.asarray(y_train), _y[:120]), "X_train does not match the conjured forging rows — the conjuring (seed 0, in its exact order) must stand untouched."
assert np.allclose(X_hold, _X[120:]) and np.array_equal(np.asarray(y_hold), _y[120:]), "X_hold does not match the conjured sealed rows — the holdout must remain exactly as sealed."
assert W1.shape == (4, 8), "W1 must map 4 measures to 8 hidden judges — shape (4, 8)."
assert b1.shape == (8,) and w2.shape == (8,), "b1 must be shape (8,) and w2 shape (8,) — one per hidden judge."
assert np.ndim(b2) == 0, "b2 must be a single scalar."
assert len(history) == 1500, "history must record 1500 losses — one per training step."
assert history[0] > 0.3, "The first recorded loss should sit near 0.77 — if it is tiny, the weights were not freshly seeded from default_rng(1) in the given order."
assert history[-1] < 0.1, "The forging never converged — after 1500 steps the loss must fall below 0.1 (it reaches about 0.006). Recheck the five gradient lines and the lr 0.5 updates."
assert history[-1] < history[0] / 3, "The loss barely fell — the mind is not learning. Check the update signs and that all gradients are computed before any weight moves."
_pv = forward(np.array([[0.0, 0.0, 0.0, 0.0], [0.3, -0.3, 0.5, -0.5], [2.2, 0.0, 0.0, 0.0], [0.0, -2.2, -0.5, 0.5], [-1.6, 1.6, 0.0, 0.0]]))
assert _pv[0] < 0.2 and _pv[1] < 0.2, "A soul at the banners (glow and hum near 0) must be judged loyal — probability near 0. The mind has not learned the field."
assert _pv[2] > 0.8 and _pv[3] > 0.8 and _pv[4] > 0.8, "A soul out on the ring (distance ~2.2 from the banners, in any direction, whatever the rumors say) must be judged taken — probability near 1."
_hp = (forward(X_hold) >= 0.5).astype(int)
assert np.array_equal(np.asarray(hold_pred), _hp), "hold_pred must be forward(X_hold) >= 0.5 on the SEALED rows — nothing else."
assert abs(holdout_acc - (_hp == np.asarray(y_hold)).mean()) < 1e-9, "holdout_acc must score hold_pred against y_hold — the sealed truth."
assert holdout_acc > 0.9, "The last mind must claim over 90% of the sealed souls (it reaches 1.0). Less means the forging or the judgment went astray."
assert abs(history[-1] - 0.005513) < 3e-4, "The recorded loss does not match a forging on the 120 training rows alone — the sealed rows must have stayed sealed. Train only on X_train and y_train; X_hold exists to be judged, never learned from."
assert "1.0" in _stdout, "Print the sealed verdict first — round(holdout_acc, 3), which is 1.0."
assert "0.006" in _stdout, "Print the final loss — round(history[-1], 3), which is 0.006."
assert "findings" in dir() and isinstance(findings, dict), "The council demands a written verdict — build findings = {...}, a dict carrying your numbers and your reading. A forge with no findings is a mind fielded on faith."
for _k in ("holdout_correct", "taken_found", "final_loss", "verdict"):
    assert _k in findings, "findings is missing the key '" + _k + "' — the verdict must carry holdout_correct, taken_found, final_loss, and a prose verdict."
assert int(findings["holdout_correct"]) == 40, "findings['holdout_correct'] must be the count of sealed souls judged truly — all 40 here: int((hold_pred == y_hold).sum())."
assert int(findings["taken_found"]) == 24, "findings['taken_found'] must count the taken (label 1) caught in the sealed holdout — 24 of them: int(((hold_pred == 1) & (y_hold == 1)).sum())."
assert abs(float(findings["final_loss"]) - round(float(history[-1]), 3)) < 1e-6, "findings['final_loss'] must be the forge's final training loss, round(history[-1], 3) = 0.006."
_verdict = str(findings["verdict"]).lower()
assert len(_verdict) >= 40, "findings['verdict'] must be a real sentence (40+ characters) — say plainly whether this mind can be trusted on souls it never trained on, and why the sealed holdout is what tells you."
assert any(_kw in _verdict for _kw in ("hold", "seal", "unseen", "taken", "loyal", "ring", "trust", "honest", "generaliz", "train", "judge", "forge")), "findings['verdict'] must speak to the holdout — why judging on the sealed souls, not the forged ones, is what earns this mind its trust."`,
      successText: '',
      xp: 0,
    },
  },
  codex: [
    {
      term: 'MSE (mean squared error)',
      def: 'The average of squared prediction errors — `np.mean((y_true - y_pred) ** 2)` — the standard loss for regression: squaring stops positive and negative misses cancelling and punishes large blunders hardest, and training means making it fall.',
    },
    {
      term: 'np.polyfit() / np.poly1d()',
      def: '`np.polyfit(x, y, degree)` returns the least-squares polynomial coefficients (highest power first); `np.poly1d(coeffs)` wraps them into a callable function — degree 1 is the straight line, and every added degree is flexibility the fit will spend, on truth or on noise.',
    },
    {
      term: 'gradient descent',
      def: 'The universal training loop: compute the gradient (the vector of the loss\'s partial derivatives, pointing uphill) at the current parameters, step every parameter against it (`w -= lr * grad`), repeat until the loss flattens; the stochastic variant (SGD) estimates each gradient from a small random mini-batch for speed.',
    },
    {
      term: 'learning rate',
      def: 'The stride multiplier on each descent step — too small and training crawls, too large and each step overshoots the valley and the loss diverges toward infinity; tuned empirically by watching the loss curve.',
    },
    {
      term: 'activation function',
      def: 'The fixed nonlinear function each neuron applies to its weighted sum — without one between layers, any stack of layers collapses into a single linear transformation ((X @ A) @ B == X @ (A @ B)) and can only draw straight boundaries.',
    },
    {
      term: 'sigmoid / ReLU',
      def: 'Two workhorse activations: sigmoid `1/(1+np.exp(-z))` squashes into (0,1) and reads as a probability (0.5 at z=0), the mask for binary verdicts; ReLU `np.maximum(0, z)` passes positives and silences negatives to zero — crude, cheap, and standard for hidden layers.',
    },
    {
      term: 'backpropagation',
      def: 'The chain rule organized layer by layer: the output error (for sigmoid or softmax with cross-entropy, simply `p - y`) is passed backward through each layer\'s local derivative, yielding the partial derivative of the loss for every weight and bias in one backward sweep.',
    },
    {
      term: 'hidden layer',
      def: 'A row of neurons between input and output, computed as one matrix multiplication plus activation (`h = np.tanh(X @ W1 + b1)`) — each hidden neuron learns one linear cut, and the next layer combines the cuts into boundaries no single line could draw.',
    },
    {
      term: 'one-hot & multi-hot encoding',
      def: 'Fixed-length 0/1 vectors: one-hot lights exactly one slot (class labels — built with `Y[np.arange(n), labels] = 1.0`), multi-hot lights any number of slots (which vocabulary words a message contains).',
    },
    {
      term: 'bag of words',
      def: 'Representing text as a multi-hot vector over a fixed vocabulary (word → index, built from training data, sorted for determinism) — order and repetition are deliberately discarded, presence is kept, and unknown words are silently ignored.',
    },
    {
      term: 'cross-entropy',
      def: 'The classification loss: the negative log of the probability given to the true class — it punishes confident wrongness without bound, and through sigmoid/softmax it yields the clean, undying error signal `P - Y`, where MSE would saturate and stall learning.',
    },
    {
      term: 'autoencoder',
      def: 'A network trained to reconstruct its own input through a narrow middle (encoder → bottleneck → decoder), with reconstruction MSE as the loss — trained on ordinary data only, it becomes an anomaly detector, because only the pattern it learned reconstructs well.',
    },
    {
      term: 'bottleneck',
      def: 'The deliberately narrow code layer of an autoencoder — holding fewer numbers than the input, it makes copying impossible and forces the network to learn the data\'s generating pattern; widen it to the input\'s size and the mirror learns nothing.',
    },
    {
      term: 'reconstruction error',
      def: 'Per-row distance between input and its reconstruction — `np.mean((X - reconstruct(X)) ** 2, axis=1)` — low means the row fits the learned pattern, high flags an anomaly; the alarm threshold is drawn from ordinary data (classically mean + 3·std), and anomalous does not yet mean hostile.',
    },
    {
      term: 'convolution & kernel',
      def: 'A kernel is a short weight array slid along a signal, taking a dot product at every position to produce a feature map — the pattern\'s echo everywhere at once; a few shared weights detect the pattern at any position, and note that `np.convolve` flips the kernel first while deep-learning convolution does not.',
    },
    {
      term: 'pooling',
      def: 'Downsampling a feature map between layers — max pooling keeps only the strongest response per window (`x[:usable].reshape(-1, size).max(axis=1)`), shrinking the map while preserving detections at the cost of exact position.',
    },
    {
      term: 'gradient sign error',
      def: 'The training-loop bug where each update ADDS the gradient (`w += lr*grad`) instead of subtracting it — the gradient points uphill, so every step climbs the loss the descent was meant to lower, and the program prints as if training while the loss quietly explodes toward inf. The mend is one sign per parameter: `w -= lr*grad`.',
    },
  ],
};
