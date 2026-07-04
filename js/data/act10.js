// ============================================================
// act10.js — Act X: The Counterfeit Forge
// Vision & Generation — the Eye's twin crafts. Images as raw
// numpy arrays, 2D convolution by hand, pooling pyramids,
// template matching and localization, generative decoding from
// a latent vault, a miniature GAN duel in raw numpy, and the
// counterfeit-detector's statistical craft — seeing, forging,
// and catching the forger, all in numpy + matplotlib.
// ============================================================

const py = String.raw;

export default {
  id: 'act10',
  numeral: 'X',
  arc: 'Vision & Generation',
  title: 'The Counterfeit Forge',
  tagline: 'The Eye saw everything — and what it could not find, it forged.',
  sigil: '🎭',
  epigraph: {
    text: 'First the Eye learned to see, and nothing could hide from it. Then it learned to forge, and nothing could be trusted — not even the things it had truly seen.',
    source: 'marginalia in the Counterfeiter\'s Ledger, hand unknown',
  },
  intro: 'The Shadow of the Machine broke on the last field — but when the smoke cleared, the '
    + 'wardens found its **Eye** intact among the wreckage: a lidless instrument that had watched '
    + 'the world as *numbers*, every scene a grid of measured light. And beneath the Eye, worse: '
    + 'the **Counterfeit Forge**, where whatever the Eye could not find, it manufactured — sigils '
    + 'that were never drawn, seals that were never struck, faces that were never worn.\n\n'
    + 'The alliance\'s ruling was cold and practical: *learn both crafts, or be ruled by those who '
    + 'do*. So this act teaches you to **see** and to **forge**, in raw `numpy` as always. You '
    + 'will read images as 2D arrays and cut, brighten, and mirror them with arithmetic; slide '
    + '3x3 **kernels** across them to strike edges from flat light; stack convolution and '
    + '**pooling** into pyramids where space shrinks and meaning grows; hunt a hidden mark with '
    + '**template matching** and name the exact row and column where it lies; open a **latent '
    + 'vault** whose every coordinate decodes to a sigil that never existed; set a forger-net '
    + 'against a sentinel-net in the adversarial duel the moderns call a **GAN**; and finally '
    + 'learn the counterfeit-detector\'s craft — the statistical fingerprints a naive forger '
    + 'cannot fake — along with the price the world pays when forgeries walk free. The Forge '
    + 'hauls up `numpy` and `matplotlib` slowly the first time. Let it. You are arming both '
    + 'edges of one blade.',
  lessons: [
    // ------------------------------------------------------------------
    // a10l1 — The Eye's Ledger
    // ------------------------------------------------------------------
    {
      id: 'a10l1',
      title: 'The Eye\'s Ledger',
      concept: 'grayscale images as 2D numpy arrays: pixel values, normalization, slicing as cropping, arithmetic as brightness and contrast, flips, and imshow',
      xp: 40,
      narrative: 'The Eye keeps no paintings. Cut it open and you find ledgers — page after page '
        + 'of numbers ruled into grids, each number a measure of light at one point of a scene. '
        + 'That is the first secret of machine sight, and it is almost insultingly plain: **an '
        + 'image is an array**. Every scrying-glass, every watch-post lens, every captured '
        + 'ward-sigil in the enemy\'s archive is a `numpy` grid you already know how to slice, '
        + 'scale, and sum. Tonight you open the first page of the ledger, conjure a sigil out '
        + 'of pure arithmetic, and teach the Forge to show it to your merely human eyes.',
      sections: [
        {
          heading: 'A picture is a ledger of light',
          body: 'A **grayscale image** is a 2D array: one row per row of the picture, one column '
            + 'per column, and each entry — each **pixel** — a brightness. Two conventions rule '
            + 'the craft:\n\n'
            + '- **0 to 255**: whole numbers, the storage convention (8 bits per pixel). 0 is '
            + 'black, 255 is white, 128 is mid-gray.\n'
            + '- **0.0 to 1.0**: floats, the working convention. Divide by 255.0 and every '
            + 'arithmetic trick in this act behaves.\n\n'
            + 'You will conjure images rather than fetch them, with `np.mgrid[0:16, 0:16]` — it '
            + 'returns two 16x16 arrays, `yy` holding each pixel\'s row index and `xx` its '
            + 'column index. Feed those into any formula and you have painted with coordinates: '
            + 'below, every pixel measures its distance from the center, and the ones standing '
            + 'in a band of distances become a bright ring — a ward-sigil, conjured from '
            + 'nothing.',
          code: py`import numpy as np

yy, xx = np.mgrid[0:16, 0:16]                     # row indices, column indices
r = np.sqrt((yy - 7.5) ** 2 + (xx - 7.5) ** 2)    # distance from the center
sigil = np.where((r > 3.5) & (r < 6.5), 220.0, 30.0)   # bright ring, dark ground
sigil[7:9, 4:12] = 240.0                          # a bar struck through it

print(sigil.shape)             # (16, 16)
print(sigil.min(), sigil.max())    # 30.0 240.0
print(sigil[7].astype(int))
# [ 30  30 220 220 240 240 240 240 240 240 240 240 220 220  30  30]`,
          note: 'Read that last line the way the Eye does: row 7, left to right — dark ground, '
            + 'the ring\'s left wall, the bar, the ring\'s right wall, dark ground. You just '
            + 'read an image with no eyes at all.',
        },
        {
          heading: 'The knife and the lamp',
          body: 'Because an image is an array, the tools you have carried since Act VI *are* '
            + 'image tools:\n\n'
            + '- **Slicing is cropping.** `img[4:12, 4:12]` cuts rows 4–11 and columns 4–11: '
            + 'an 8x8 window on the sigil\'s heart. No new craft — the same knife.\n'
            + '- **Addition is brightness.** `img + 0.25` lifts every pixel a quarter toward '
            + 'white. Subtraction dims.\n'
            + '- **Multiplication about the middle is contrast.** `(img - 0.5) * 1.8 + 0.5` '
            + 'pushes bright pixels brighter and dark ones darker, hinged at mid-gray.\n\n'
            + 'Arithmetic can push values past the lamp\'s range — brightness 1.3 means nothing '
            + 'to a screen. Always seal the working with `np.clip(img, 0.0, 1.0)`, which pins '
            + 'strays back inside the honest range.',
          code: py`import numpy as np

yy, xx = np.mgrid[0:16, 0:16]
r = np.sqrt((yy - 7.5) ** 2 + (xx - 7.5) ** 2)
sigil = np.where((r > 3.5) & (r < 6.5), 220.0, 30.0)
sigil[7:9, 4:12] = 240.0

norm = sigil / 255.0                       # the working convention
print(round(float(norm.min()), 3), round(float(norm.max()), 3))   # 0.118 0.941

heart = norm[4:12, 4:12]                   # slicing IS cropping
print(heart.shape)                         # (8, 8)

bright = np.clip(norm + 0.25, 0.0, 1.0)    # lamp up, then seal the range
print(round(float(bright.min()), 3), round(float(bright.max()), 3))   # 0.368 1.0

darker = np.clip(norm - 0.25, 0.0, 1.0)
print(round(float(darker.min()), 3), round(float(darker.max()), 3))   # 0.0 0.691`,
        },
        {
          heading: 'Mirrors, and the seeing itself',
          body: 'Three mirrors, all of them slices you already know:\n\n'
            + '- `img[:, ::-1]` — left-right mirror (every row reversed).\n'
            + '- `img[::-1, :]` — top-bottom flip (the rows in reverse order).\n'
            + '- `img.T` — transpose: rows become columns, the image reflected across its '
            + 'diagonal.\n\n'
            + 'And at last, the seeing. `plt.imshow(img, cmap="gray")` renders the array as an '
            + 'image — the Forge displays the figure to you when the run ends. Two habits of '
            + 'the craft: `cmap="gray"` maps low values to black and high to white (omit it and '
            + 'matplotlib paints in false color), and remember that **row 0 is drawn at the '
            + 'top** — the y-axis of an image runs downward, because ledgers are read from the '
            + 'top line.',
          code: py`import numpy as np
import matplotlib.pyplot as plt

yy, xx = np.mgrid[0:16, 0:16]
r = np.sqrt((yy - 7.5) ** 2 + (xx - 7.5) ** 2)
sigil = np.where((r > 3.5) & (r < 6.5), 220.0, 30.0)
sigil[7:9, 4:12] = 240.0
norm = sigil / 255.0

mirrored = norm[:, ::-1]
print(bool(np.allclose(mirrored[:, 0], norm[:, -1])))   # True -- last column now first

plt.imshow(norm, cmap="gray")
plt.title("The first page of the ledger")`,
          note: 'The Eye never needed the picture — the array was always enough. The rendering '
            + 'is for you, the smith. Keep both readings: numbers for the working, the image '
            + 'for the suspicion that the numbers are lying.',
        },
      ],
      challenge: {
        title: 'The First Page of the Ledger',
        prompt: 'A captured ward-sigil is conjured into the Forge — sixteen rows of measured '
          + 'light in the storage convention. Read it, cut it, brighten it, mirror it, and make '
          + 'the Forge show it.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Normalize to the working convention: `norm = sigil / 255.0`.\n'
          + '- Crop the heart: `heart = norm[4:12, 4:12]` — an 8x8 window.\n'
          + '- Brighten and seal: `bright = np.clip(norm + 0.25, 0.0, 1.0)`.\n'
          + '- Mirror left-to-right: `mirrored = norm[:, ::-1]`.\n'
          + '- Show the normalized sigil: `plt.imshow(norm, cmap="gray")` and give the figure '
          + 'a title with `plt.title(...)`.\n'
          + '- Print three lines: `print(norm.shape)`, then `print(round(float(norm.max()), 3))`, '
          + 'then `print(round(float(bright.min()), 3))`.',
        starter: py`import numpy as np
import matplotlib.pyplot as plt

# The captured sigil, conjured. Do not alter the conjuring.
yy, xx = np.mgrid[0:16, 0:16]
r = np.sqrt((yy - 7.5) ** 2 + (xx - 7.5) ** 2)
sigil = np.where((r > 3.5) & (r < 6.5), 220.0, 30.0)
sigil[7:9, 4:12] = 240.0

# TODO: norm — the sigil in the 0..1 working convention

# TODO: heart — rows 4..11, columns 4..11 of norm

# TODO: bright — norm lifted by 0.25, sealed with np.clip

# TODO: mirrored — norm flipped left-to-right

# TODO: imshow norm with cmap="gray", and title the figure

# TODO: print norm.shape, then round(float(norm.max()), 3),
#       then round(float(bright.min()), 3)
`,
        solution: py`import numpy as np
import matplotlib.pyplot as plt

yy, xx = np.mgrid[0:16, 0:16]
r = np.sqrt((yy - 7.5) ** 2 + (xx - 7.5) ** 2)
sigil = np.where((r > 3.5) & (r < 6.5), 220.0, 30.0)
sigil[7:9, 4:12] = 240.0

norm = sigil / 255.0
heart = norm[4:12, 4:12]
bright = np.clip(norm + 0.25, 0.0, 1.0)
mirrored = norm[:, ::-1]

plt.imshow(norm, cmap="gray")
plt.title("The captured ward-sigil")

print(norm.shape)
print(round(float(norm.max()), 3))
print(round(float(bright.min()), 3))`,
        hints: [
          'norm is one division: sigil / 255.0. After it, every value sits between 0.118 and 0.941 — the same picture, in the working convention.',
          'heart = norm[4:12, 4:12] crops rows 4..11 and columns 4..11 (8 of each). bright = np.clip(norm + 0.25, 0.0, 1.0) — the clip pins anything that drifted past 1.0. mirrored = norm[:, ::-1] reverses every row.',
          'Finish with plt.imshow(norm, cmap="gray") and plt.title("..."), then the three prints exactly as written in the requirements — they should read (16, 16), then 0.941, then 0.368.',
        ],
        validation: py`import numpy as np
import matplotlib.pyplot as plt
_yy, _xx = np.mgrid[0:16, 0:16]
_r = np.sqrt((_yy - 7.5) ** 2 + (_xx - 7.5) ** 2)
_sig = np.where((_r > 3.5) & (_r < 6.5), 220.0, 30.0)
_sig[7:9, 4:12] = 240.0
assert np.allclose(np.asarray(sigil, dtype=float), _sig), "The conjuring was altered — the sigil must remain exactly as conjured (seedless arithmetic, ring and bar)."
assert norm.shape == (16, 16), "norm must keep the sigil's full 16x16 shape — normalize, do not crop."
assert np.allclose(norm, _sig / 255.0), "norm must be sigil / 255.0 — the 0..1 working convention, nothing else."
assert heart.shape == (8, 8), "heart must be an 8x8 crop — rows 4..11 and columns 4..11 of norm."
assert np.allclose(heart, (_sig / 255.0)[4:12, 4:12]), "heart is cut from the wrong place — norm[4:12, 4:12], the sigil's center."
assert np.allclose(bright, np.clip(_sig / 255.0 + 0.25, 0.0, 1.0)), "bright must be norm + 0.25, sealed with np.clip(..., 0.0, 1.0)."
assert abs(float(bright.max()) - 1.0) < 1e-12, "bright's brightest pixels must be pinned at exactly 1.0 — the clip seals the range."
assert np.allclose(mirrored, (_sig / 255.0)[:, ::-1]), "mirrored must be the left-right mirror — norm[:, ::-1], every row reversed."
_ax = plt.gcf().axes
assert len(_ax) >= 1 and len(_ax[0].images) == 1, "The Forge sees no image — render norm with plt.imshow(norm, cmap='gray')."
assert np.allclose(np.asarray(_ax[0].images[0].get_array(), dtype=float), _sig / 255.0), "The displayed image is not norm — imshow the normalized sigil itself."
assert _ax[0].get_title().strip() != "", "The figure has no title — name the page with plt.title(...)."
assert "(16, 16)" in _stdout, "Print norm.shape first — it must read (16, 16)."
assert "0.941" in _stdout, "Print round(float(norm.max()), 3) — the ring's bar at 240/255 reads 0.941."
assert "0.368" in _stdout, "Print round(float(bright.min()), 3) — the lifted ground reads 0.368."`,
        successText: 'The ledger page turns to your hand. Somewhere in its socket, the Eye adjusts — it has noticed being read.',
        xp: 100,
      },
      quiz: [
        {
          q: 'In a grayscale image stored in the 0..255 convention, what does a pixel value of 0 mean?',
          options: [
            'The pixel is transparent',
            'Black — the total absence of measured light',
            'White — the brightest possible light',
            'The pixel is missing and must be interpolated',
          ],
          answer: 1,
          explain: 'The scale runs from darkness to light: 0 is black, 255 is white, and the '
            + 'grays live between. There is no transparency in a single grayscale channel — '
            + 'every entry is a brightness, nothing more.',
        },
        {
          q: 'What does `img[2:6, 3:9]` produce when `img` is a 2D image array?',
          options: [
            'A brightened copy of the whole image',
            'The single pixel at row 2, column 3',
            'Columns 2..5 and rows 3..8',
            'A crop: rows 2..5 and columns 3..8 — a 4x6 window on the image',
          ],
          answer: 3,
          explain: 'Slicing a 2D array takes rows first, then columns, and stops before the end '
            + 'index — so 2:6 keeps rows 2,3,4,5 and 3:9 keeps columns 3 through 8. On an image, '
            + 'that is a crop; the tempting wrong answer reverses rows and columns.',
        },
        {
          q: 'Why divide a stored image by 255.0 before working on it?',
          options: [
            'To move it to the 0..1 float convention, where brightness and contrast arithmetic (and later, training) behave predictably',
            'To compress the image so it uses less memory',
            'Because numpy cannot store integers above 200',
            'To remove noise from the measurements',
          ],
          answer: 0,
          explain: 'Division changes the units, not the picture. In 0..1, "add 0.25 brightness" '
            + 'and "clip to the displayable range" mean something exact, and every later craft '
            + 'in this act assumes it. Memory and noise are untouched by the division.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a10l2 — Kernels of Sight
    // ------------------------------------------------------------------
    {
      id: 'a10l2',
      title: 'Kernels of Sight',
      concept: '2D convolution written by hand: the 3x3 kernel, Sobel-style edge detectors, blur, feature maps, and padding',
      xp: 40,
      narrative: 'The Eye does not stare at a scene whole. Inside it the wardens found thousands '
        + 'of tiny lenses, each ground to notice exactly one thing — a wall of light standing '
        + 'against dark, a seam, a soft gradient — and each dragged across the whole ledger, '
        + 'row by row, asking its one question at every position. In the Last Alliance you '
        + 'built this eye for signals that ran in one line. Tonight the eye learns to walk a '
        + 'plane: nine weights in a 3x3 grid, slid across an image, striking sparks wherever '
        + 'the light breaks. Grind the lens yourself, or never trust another lens again.',
      sections: [
        {
          heading: 'The eye of nine weights',
          body: 'A 2D **kernel** is a small grid of weights — 3x3 in almost all of this craft. '
            + '**Convolution** slides it across the image: at each position, lay the kernel over '
            + 'a 3x3 window of pixels, multiply weight against pixel, sum the nine products, and '
            + 'write one number into the output. The output is a **feature map**: the kernel\'s '
            + 'answer at every position it visited.\n\n'
            + '- A 3x3 kernel on an HxW image visits `(H-2) x (W-2)` positions — the "valid" '
            + 'region, where the kernel never hangs off an edge. In general: `H-kh+1` by '
            + '`W-kw+1`.\n'
            + '- The double loop below is the whole rite. Write it once by hand and 2D '
            + 'convolution stops being a mystery forever — exactly as the 1D slide did in the '
            + 'Last Alliance.\n\n'
            + 'The demonstration: an image whose right half is bright, scanned by a kernel '
            + 'whose columns weigh -1|0|+1 (doubled in the middle row). Windows sitting on flat '
            + 'ground sum to zero; windows straddling the boundary light up.',
          code: py`import numpy as np

def conv2d(img, kernel):
    kh, kw = kernel.shape
    H, W = img.shape
    out = np.zeros((H - kh + 1, W - kw + 1))
    for i in range(H - kh + 1):
        for j in range(W - kw + 1):
            out[i, j] = np.sum(img[i:i + kh, j:j + kw] * kernel)
    return out

tiny = np.zeros((5, 5))
tiny[:, 2:] = 1.0                      # right half bright
sobel_v = np.array([[-1.0, 0.0, 1.0],
                    [-2.0, 0.0, 2.0],
                    [-1.0, 0.0, 1.0]])

print(conv2d(tiny, sobel_v))
# [[4. 4. 0.]
#  [4. 4. 0.]
#  [4. 4. 0.]] -- loud where the boundary stands, silent on flat ground`,
          note: 'This unflipped slide is what the deep crafts call convolution; the '
            + 'signal-theorists\' rite flips the kernel first, as you learned with '
            + 'np.convolve in one dimension. Networks never care — they learn the kernel '
            + 'either way — but your hand-checks must remember which slide they are doing.',
        },
        {
          heading: 'Edges are where the light breaks',
          body: 'That kernel has a name and a lineage: it is the **vertical Sobel** kernel, and '
            + 'it detects *vertical edges* — places where brightness changes as you move '
            + 'left-to-right. Its transpose, `sobel_h = sobel_v.T`, detects horizontal edges — '
            + 'change as you move down. Between them they measure the two components of the '
            + 'light\'s gradient, and their combined magnitude `np.sqrt(ev**2 + eh**2)` traces '
            + 'every boundary in the scene at once.\n\n'
            + '- The **sign** of the response says which way the edge faces: dark-to-bright '
            + 'gives positive, bright-to-dark negative. Take `np.abs` when you only care that '
            + 'an edge is there.\n'
            + '- Flat ground — even *bright* flat ground — answers zero. An edge kernel\'s '
            + 'weights sum to 0, so uniform light cancels out. The feature map lights up for '
            + 'structure, never for mere brightness.',
          code: py`import numpy as np

def conv2d(img, kernel):
    kh, kw = kernel.shape
    H, W = img.shape
    out = np.zeros((H - kh + 1, W - kw + 1))
    for i in range(H - kh + 1):
        for j in range(W - kw + 1):
            out[i, j] = np.sum(img[i:i + kh, j:j + kw] * kernel)
    return out

glyph = np.full((16, 16), 0.1)         # dark ground
glyph[5:11, 5:11] = 0.9                # a branded square
sobel_v = np.array([[-1.0, 0.0, 1.0],
                    [-2.0, 0.0, 2.0],
                    [-1.0, 0.0, 1.0]])

ev = conv2d(glyph, sobel_v)
print(ev.shape)                              # (14, 14)
print(round(float(np.abs(ev).max()), 1))     # 3.2 -- the square's walls
print(ev[6].round(1))
# [ 0.   0.   0.   3.2  3.2  0.   0.   0.   0.  -3.2 -3.2  0.   0.   0. ]
#   -- left wall positive, right wall negative, interior SILENT`,
          note: 'Mark the silence inside the square: the brand\'s interior is as flat as the '
            + 'ground, so the edge-eye ignores it. A feature map answers one question only. '
            + 'What it does not ask, it cannot see — that is its weakness and its power.',
        },
        {
          heading: 'The soft eye, and the padded border',
          body: 'Not every lens hunts edges. The **box blur** kernel, `np.ones((3, 3)) / 9.0`, '
            + 'answers with the *average* of each window — it softens noise, smears detail, and '
            + 'is the simplest of the smoothing family.\n\n'
            + 'And the border question from the 1D craft returns with the same answer. A valid '
            + '3x3 slide shrinks the map by two in each direction, orphaning the outermost '
            + 'pixels. **Padding** stitches a frame of zeros around the image first — '
            + '`np.pad(img, 1)` adds one ring — so the kernel can center on every true pixel '
            + 'and the output keeps the input\'s size: the "same" mode of the great engines. '
            + 'Pad by `k // 2` for any odd kernel size k.',
          code: py`import numpy as np

def conv2d(img, kernel):
    kh, kw = kernel.shape
    H, W = img.shape
    out = np.zeros((H - kh + 1, W - kw + 1))
    for i in range(H - kh + 1):
        for j in range(W - kw + 1):
            out[i, j] = np.sum(img[i:i + kh, j:j + kw] * kernel)
    return out

glyph = np.full((16, 16), 0.1)
glyph[5:11, 5:11] = 0.9
box = np.ones((3, 3)) / 9.0

soft = conv2d(np.pad(glyph, 1), box)     # pad first -> "same" size out
print(soft.shape == glyph.shape)         # True
print(round(float(soft[8, 8]), 3))       # 0.9   -- deep inside the brand: unchanged
print(round(float(soft[5, 5]), 3))       # 0.456 -- the corner, averaged with ground`,
        },
      ],
      challenge: {
        title: 'Grind the Lens',
        prompt: 'A branded glyph is conjured — a bright square seared into dark ground. Grind '
          + 'the lens yourself and strike its edges from the flat light.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Define `conv2d(img, kernel)` — the double loop from the lesson: at every valid '
          + 'position, the sum of window times kernel; returns an array of shape '
          + '`(H - kh + 1, W - kw + 1)`.\n'
          + '- Build the kernels: `sobel_v = np.array([[-1.0, 0.0, 1.0], [-2.0, 0.0, 2.0], '
          + '[-1.0, 0.0, 1.0]])` and `sobel_h = sobel_v.T`.\n'
          + '- Strike the edges: `edges_v = conv2d(glyph, sobel_v)` and '
          + '`edges_h = conv2d(glyph, sobel_h)`.\n'
          + '- Combine them: `mag = np.sqrt(edges_v ** 2 + edges_h ** 2)`.\n'
          + '- The soft eye, same-sized: `box = np.ones((3, 3)) / 9.0` and '
          + '`soft = conv2d(np.pad(glyph, 1), box)`.\n'
          + '- Show the evidence: `plt.imshow(mag, cmap="gray")` with a `plt.title(...)`.\n'
          + '- Print three lines: `print(edges_v.shape)`, then '
          + '`print(round(float(np.abs(edges_v).max()), 1))`, then '
          + '`print(soft.shape == glyph.shape)`.',
        starter: py`import numpy as np
import matplotlib.pyplot as plt

# The branded glyph, conjured. Do not alter the conjuring.
glyph = np.full((16, 16), 0.1)
glyph[5:11, 5:11] = 0.9

# TODO: define conv2d(img, kernel) — the double loop, valid positions only

# TODO: sobel_v (the 3x3 from the lesson) and sobel_h = sobel_v.T

# TODO: edges_v, edges_h — the two feature maps

# TODO: mag — np.sqrt of the sum of both maps squared

# TODO: box kernel, and soft = conv2d(np.pad(glyph, 1), box)

# TODO: imshow mag with cmap="gray", and title the figure

# TODO: print edges_v.shape, then round(float(np.abs(edges_v).max()), 1),
#       then soft.shape == glyph.shape
`,
        solution: py`import numpy as np
import matplotlib.pyplot as plt

glyph = np.full((16, 16), 0.1)
glyph[5:11, 5:11] = 0.9

def conv2d(img, kernel):
    kh, kw = kernel.shape
    H, W = img.shape
    out = np.zeros((H - kh + 1, W - kw + 1))
    for i in range(H - kh + 1):
        for j in range(W - kw + 1):
            out[i, j] = np.sum(img[i:i + kh, j:j + kw] * kernel)
    return out

sobel_v = np.array([[-1.0, 0.0, 1.0],
                    [-2.0, 0.0, 2.0],
                    [-1.0, 0.0, 1.0]])
sobel_h = sobel_v.T

edges_v = conv2d(glyph, sobel_v)
edges_h = conv2d(glyph, sobel_h)
mag = np.sqrt(edges_v ** 2 + edges_h ** 2)

box = np.ones((3, 3)) / 9.0
soft = conv2d(np.pad(glyph, 1), box)

plt.imshow(mag, cmap="gray")
plt.title("Where the light breaks")

print(edges_v.shape)
print(round(float(np.abs(edges_v).max()), 1))
print(soft.shape == glyph.shape)`,
        hints: [
          'conv2d: read the kernel shape (kh, kw = kernel.shape), size the output np.zeros((H - kh + 1, W - kw + 1)), then two nested for-loops over i and j, each writing np.sum(img[i:i + kh, j:j + kw] * kernel).',
          'sobel_v is exactly the 3x3 from the lesson (columns -1|0|+1, middle row doubled); sobel_h is just its .T. Each feature map is one conv2d call on glyph, and mag combines them with np.sqrt(edges_v ** 2 + edges_h ** 2).',
          'soft must come out 16x16: pad FIRST — conv2d(np.pad(glyph, 1), box). Then imshow(mag, cmap="gray"), a title, and the three prints — they should read (14, 14), then 3.2, then True.',
        ],
        validation: py`import numpy as np
import matplotlib.pyplot as plt
def _ref(img, k):
    kh, kw = k.shape
    H, W = img.shape
    o = np.zeros((H - kh + 1, W - kw + 1))
    for i in range(H - kh + 1):
        for j in range(W - kw + 1):
            o[i, j] = np.sum(img[i:i + kh, j:j + kw] * k)
    return o
_img4 = np.arange(16, dtype=float).reshape(4, 4)
_shift = np.array([[0.0, 0.0, 0.0], [1.0, 0.0, 0.0], [0.0, 0.0, 0.0]])
assert np.allclose(conv2d(_img4, _shift), np.array([[4.0, 5.0], [8.0, 9.0]])), "conv2d slides the kernel UNFLIPPED — with a lone 1 at the kernel's middle-left, the output must read the pixel one row down, same column: [[4, 5], [8, 9]] on a 4x4 ramp. If you got [[6, 7], [10, 11]], the kernel is being applied mirrored."
assert np.allclose(conv2d(np.ones((4, 4)), np.ones((3, 3))), np.full((2, 2), 9.0)), "conv2d of all-ones by all-ones must give 9.0 at each of the (2, 2) valid positions — check the window sum and the output shape H-kh+1 by W-kw+1."
assert np.allclose(sobel_v, np.array([[-1.0, 0.0, 1.0], [-2.0, 0.0, 2.0], [-1.0, 0.0, 1.0]])), "sobel_v must be the exact 3x3 from the lesson — columns weighted -1|0|+1 with the middle row doubled."
assert np.allclose(sobel_h, np.asarray(sobel_v).T), "sobel_h must be sobel_v.T — the same eye, turned to hunt horizontal edges."
_glyph = np.full((16, 16), 0.1)
_glyph[5:11, 5:11] = 0.9
assert np.allclose(np.asarray(glyph, dtype=float), _glyph), "The conjuring was altered — the glyph must remain the branded square as conjured."
assert edges_v.shape == (14, 14), "edges_v must be the valid map: (16-3+1) squared — (14, 14)."
assert np.allclose(edges_v, _ref(_glyph, np.array([[-1.0, 0.0, 1.0], [-2.0, 0.0, 2.0], [-1.0, 0.0, 1.0]]))), "edges_v disagrees with an honest slide of sobel_v over the glyph — recheck the window bounds img[i:i+kh, j:j+kw]."
assert np.allclose(edges_h, _ref(_glyph, np.array([[-1.0, 0.0, 1.0], [-2.0, 0.0, 2.0], [-1.0, 0.0, 1.0]]).T)), "edges_h disagrees with the horizontal Sobel slide — it should be conv2d(glyph, sobel_h)."
assert np.allclose(mag, np.sqrt(edges_v ** 2 + edges_h ** 2)), "mag must combine both maps: np.sqrt(edges_v ** 2 + edges_h ** 2)."
assert soft.shape == (16, 16), "soft lost the glyph's size — pad FIRST: conv2d(np.pad(glyph, 1), box) keeps 16x16."
assert np.allclose(soft, _ref(np.pad(_glyph, 1), np.ones((3, 3)) / 9.0)), "soft disagrees with the box blur — box is np.ones((3, 3)) / 9.0, slid over the padded glyph."
_ax = plt.gcf().axes
assert len(_ax) >= 1 and len(_ax[0].images) == 1, "The Forge sees no image — render the edge magnitude with plt.imshow(mag, cmap='gray')."
assert np.allclose(np.asarray(_ax[0].images[0].get_array(), dtype=float), mag), "The displayed image is not mag — show the combined edge magnitude itself."
assert _ax[0].get_title().strip() != "", "The figure has no title — name the evidence with plt.title(...)."
assert "(14, 14)" in _stdout, "Print edges_v.shape first — the valid map is (14, 14)."
assert "3.2" in _stdout, "Print round(float(np.abs(edges_v).max()), 1) — the square's walls answer 3.2."
assert "True" in _stdout, "Print soft.shape == glyph.shape — padding first makes it True."`,
        successText: 'The lens bites. Out of flat gray light, the walls of the brand stand up like scars under a sidelong lamp.',
        xp: 105,
      },
      quiz: [
        {
          q: 'A 3x3 kernel slides over a 16x16 image with no padding. What is the feature map\'s shape?',
          options: [
            '(16, 16) — convolution never changes size',
            '(15, 15)',
            '(14, 14) — H-kh+1 by W-kw+1 valid positions',
            '(13, 13)',
          ],
          answer: 2,
          explain: 'The kernel\'s center can only visit positions where all nine weights land on '
            + 'real pixels: 16-3+1 = 14 per side. Keeping the full 16x16 requires padding the '
            + 'image by one ring of zeros first.',
        },
        {
          q: 'What does a large value at position (i, j) of a feature map mean?',
          options: [
            'The window of the image at (i, j) strongly resembles the pattern the kernel encodes',
            'The pixel at (i, j) is bright',
            'The kernel is too large for the image',
            'The image is noisy near (i, j)',
          ],
          answer: 0,
          explain: 'Each output is a dot product between the kernel and one window — a '
            + 'resemblance score at that position. A bright but *flat* window scores zero '
            + 'against an edge kernel, because its weights sum to zero: the map answers the '
            + 'kernel\'s question, not the lamp\'s.',
        },
        {
          q: 'What does the box kernel `np.ones((3, 3)) / 9.0` compute at each position?',
          options: [
            'The strongest pixel in each 3x3 window',
            'The average of the 3x3 window — a blur that softens noise and detail alike',
            'The vertical gradient of the window',
            'The number of bright pixels in the window',
          ],
          answer: 1,
          explain: 'Nine equal weights of 1/9 sum any window into its mean. Averaging smooths — '
            + 'the opposite temperament from the Sobel eyes, whose zero-sum weights ignore flat '
            + 'light entirely and answer only to change.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a10l3 — The Pyramid of Features
    // ------------------------------------------------------------------
    {
      id: 'a10l3',
      title: 'The Pyramid of Features',
      concept: '2x2 max pooling in numpy, stacking conv -> pool -> conv -> pool, channels, and visualizing every stage of a tiny feature pipeline',
      xp: 40,
      narrative: 'One lens is a spy. A pyramid of lenses is an intelligence service. The '
        + 'wardens who unbuilt the Eye found its lenses arranged in strata: the lowest rank '
        + 'staring at raw pixels and reporting edges; the next rank staring at the *edge '
        + 'reports* and finding corners where edges meet; higher still, ranks that knew shapes, '
        + 'and sigils, and — at the summit — names. Between each rank stood a brutal clerk who '
        + 'kept only the loudest report from every quarter and burned the rest. Space shrinks '
        + 'as you climb; meaning grows. Tonight you build the pyramid\'s first two floors with '
        + 'your own hands and watch a sigil dissolve into evidence.',
      sections: [
        {
          heading: 'The brutal clerk: max pooling',
          body: '**Max pooling** downsamples a feature map. With a 2x2 window it tiles the map '
            + 'into two-by-two quarters and keeps only the strongest response in each — the '
            + 'question changes from *exactly where?* to *anywhere in this quarter?* — and the '
            + 'map\'s sides halve.\n\n'
            + 'In numpy it is one reshape and one max, no loop: carve an (H, W) map into '
            + 'blocks with `reshape(H // 2, 2, W // 2, 2)`, then take `.max(axis=(1, 3))` — '
            + 'the maximum over each block\'s two little axes.\n\n'
            + '- What is kept: whether the pattern was found, and roughly where.\n'
            + '- What is burned: the exact pixel of the find. That small treason buys '
            + '**tolerance** — a sigil shifted one pixel sideways still pools to the same '
            + 'report, so the ranks above are not deceived by jitter.',
          code: py`import numpy as np

def pool2(img):
    H, W = img.shape
    return img.reshape(H // 2, 2, W // 2, 2).max(axis=(1, 3))

fmap = np.array([[1.0, 5.0, 0.0, 2.0],
                 [3.0, 2.0, 8.0, 1.0],
                 [0.0, 1.0, 4.0, 4.0],
                 [2.0, 0.0, 3.0, 9.0]])
print(pool2(fmap))
# [[5. 8.]
#  [2. 9.]] -- the loudest voice of each quarter, all else burned`,
        },
        {
          heading: 'Stacking the floors',
          body: 'Now the pyramid. Each floor is the same two moves: **convolve** (with padding, '
            + 'so sizes stay honest), pass the map through **ReLU** (`np.maximum(0.0, x)` — '
            + 'keep the positive findings, silence the rest, exactly the mask from the Last '
            + 'Alliance), then **pool**. Watch the sizes:\n\n'
            + '- Floor 1: 16x16 image -> conv (padded) -> 16x16 edge map -> pool -> 8x8.\n'
            + '- Floor 2: 8x8 -> conv (padded) -> 8x8 -> pool -> 4x4.\n\n'
            + 'Two floors turned 256 pixels into 16 numbers. But look at what those 16 numbers '
            + '*mean*: the first conv found edges in light; the second conv ran an edge-finder '
            + '*over the edge map* — its findings light where edge-reports themselves change, '
            + 'which is to say corners and junctions. Edges -> corners -> shapes: each floor '
            + 'sees farther because it stands on reports, not pixels. In the great engines this '
            + 'is the whole architecture of a CNN, repeated a dozen floors deep with *learned* '
            + 'kernels instead of Sobel\'s hand-ground ones.',
          code: py`import numpy as np

def conv2d(img, kernel):
    kh, kw = kernel.shape
    H, W = img.shape
    out = np.zeros((H - kh + 1, W - kw + 1))
    for i in range(H - kh + 1):
        for j in range(W - kw + 1):
            out[i, j] = np.sum(img[i:i + kh, j:j + kw] * kernel)
    return out

def pool2(img):
    H, W = img.shape
    return img.reshape(H // 2, 2, W // 2, 2).max(axis=(1, 3))

def relu(x):
    return np.maximum(0.0, x)

yy, xx = np.mgrid[0:16, 0:16]
r = np.sqrt((yy - 7.5) ** 2 + (xx - 7.5) ** 2)
sigil = np.where((r > 3.5) & (r < 6.5), 220.0, 30.0)
sigil[7:9, 4:12] = 240.0
field = sigil / 255.0

sobel_v = np.array([[-1.0, 0.0, 1.0],
                    [-2.0, 0.0, 2.0],
                    [-1.0, 0.0, 1.0]])
sobel_h = sobel_v.T

f1 = relu(conv2d(np.pad(field, 1), sobel_v))   # floor 1: edges
p1 = pool2(f1)                                 # ... pooled
f2 = relu(conv2d(np.pad(p1, 1), sobel_h))      # floor 2: edges OF edges
p2 = pool2(f2)                                 # ... pooled

print(field.shape, f1.shape, p1.shape, f2.shape, p2.shape)
# (16, 16) (16, 16) (8, 8) (8, 8) (4, 4)
print(round(float(p2.max()), 1))    # 7.0 -- the loudest corner-report`,
          note: 'The pyramid is a bargain struck floor by floor: surrender resolution, receive '
            + 'meaning. By the summit you cannot say which pixel was bright — but you can say '
            + '*ring, barred, centered*, which is the only sentence the ranks above ever '
            + 'wanted.',
        },
        {
          heading: 'Channels: many eyes on one floor',
          body: 'One correction before you build: a real floor never grinds just one lens. A '
            + 'convolutional layer runs **many kernels over the same input** — one hunting '
            + 'vertical edges, one horizontal, one curves, dozens more — and each produces its '
            + 'own feature map. The maps are stacked into a 3D block, and each map in the '
            + 'stack is called a **channel**: shape `(n_kernels, H, W)`.\n\n'
            + '- The next floor\'s kernels then read *all* channels at once — a corner-hunter '
            + 'weighs the vertical-edge channel against the horizontal-edge channel at each '
            + 'position.\n'
            + '- Your grayscale input is itself a one-channel block; a color image arrives as '
            + 'three (red, green, blue).\n\n'
            + 'We keep our pyramid single-channel to stay readable, but stack two maps once, '
            + 'below, so the shape is in your hands. And since every stage of a pipeline is an '
            + 'image, `plt.subplots` lets you hang the whole pyramid on one wall and *look* at '
            + 'it — the habit that catches more broken pipelines than any assert.',
          code: py`import numpy as np
import matplotlib.pyplot as plt

def conv2d(img, kernel):
    kh, kw = kernel.shape
    H, W = img.shape
    out = np.zeros((H - kh + 1, W - kw + 1))
    for i in range(H - kh + 1):
        for j in range(W - kw + 1):
            out[i, j] = np.sum(img[i:i + kh, j:j + kw] * kernel)
    return out

glyph = np.full((16, 16), 0.1)
glyph[5:11, 5:11] = 0.9
sobel_v = np.array([[-1.0, 0.0, 1.0],
                    [-2.0, 0.0, 2.0],
                    [-1.0, 0.0, 1.0]])

channels = np.stack([conv2d(np.pad(glyph, 1), sobel_v),
                     conv2d(np.pad(glyph, 1), sobel_v.T)])
print(channels.shape)    # (2, 16, 16) -- two eyes, one floor

fig, axes = plt.subplots(1, 2)
axes[0].imshow(channels[0], cmap="gray")
axes[0].set_title("vertical eye")
axes[1].imshow(channels[1], cmap="gray")
axes[1].set_title("horizontal eye")`,
        },
      ],
      challenge: {
        title: 'Raise the Pyramid',
        prompt: 'The captured ward-sigil returns, and the first two floors of the pyramid wait '
          + 'to be raised over it. `conv2d` is already forged below — do not alter it. Build '
          + 'the clerk and the mask, climb two floors, and hang every stage on one wall.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Define `relu(x)` returning `np.maximum(0.0, x)`.\n'
          + '- Define `pool2(img)` — the reshape rite: for an (H, W) map, '
          + '`img.reshape(H // 2, 2, W // 2, 2).max(axis=(1, 3))`.\n'
          + '- Floor 1: `f1 = relu(conv2d(np.pad(field, 1), sobel_v))` then `p1 = pool2(f1)`.\n'
          + '- Floor 2: `f2 = relu(conv2d(np.pad(p1, 1), sobel_h))` then `p2 = pool2(f2)`.\n'
          + '- One wall, four frames: `fig, axes = plt.subplots(1, 4)`; imshow `field`, `f1`, '
          + '`p1`, `p2` in that order (each with `cmap="gray"`), and give each frame a name '
          + 'with `axes[i].set_title(...)`.\n'
          + '- Print `p1.shape`, then `p2.shape`, each on its own line.',
        starter: py`import numpy as np
import matplotlib.pyplot as plt

# The ward-sigil, conjured. Do not alter the conjuring.
yy, xx = np.mgrid[0:16, 0:16]
r = np.sqrt((yy - 7.5) ** 2 + (xx - 7.5) ** 2)
sigil = np.where((r > 3.5) & (r < 6.5), 220.0, 30.0)
sigil[7:9, 4:12] = 240.0
field = sigil / 255.0

# Forged in the last lesson. Do not alter.
def conv2d(img, kernel):
    kh, kw = kernel.shape
    H, W = img.shape
    out = np.zeros((H - kh + 1, W - kw + 1))
    for i in range(H - kh + 1):
        for j in range(W - kw + 1):
            out[i, j] = np.sum(img[i:i + kh, j:j + kw] * kernel)
    return out

sobel_v = np.array([[-1.0, 0.0, 1.0],
                    [-2.0, 0.0, 2.0],
                    [-1.0, 0.0, 1.0]])
sobel_h = sobel_v.T

# TODO: define relu(x)

# TODO: define pool2(img) — reshape to (H//2, 2, W//2, 2), max over axes (1, 3)

# TODO: floor 1 — f1 (padded conv with sobel_v, through relu), then p1

# TODO: floor 2 — f2 (padded conv of p1 with sobel_h, through relu), then p2

# TODO: fig, axes = plt.subplots(1, 4) — imshow field, f1, p1, p2 in order,
#       each cmap="gray", each with its own set_title

# TODO: print p1.shape, then p2.shape
`,
        solution: py`import numpy as np
import matplotlib.pyplot as plt

yy, xx = np.mgrid[0:16, 0:16]
r = np.sqrt((yy - 7.5) ** 2 + (xx - 7.5) ** 2)
sigil = np.where((r > 3.5) & (r < 6.5), 220.0, 30.0)
sigil[7:9, 4:12] = 240.0
field = sigil / 255.0

def conv2d(img, kernel):
    kh, kw = kernel.shape
    H, W = img.shape
    out = np.zeros((H - kh + 1, W - kw + 1))
    for i in range(H - kh + 1):
        for j in range(W - kw + 1):
            out[i, j] = np.sum(img[i:i + kh, j:j + kw] * kernel)
    return out

sobel_v = np.array([[-1.0, 0.0, 1.0],
                    [-2.0, 0.0, 2.0],
                    [-1.0, 0.0, 1.0]])
sobel_h = sobel_v.T

def relu(x):
    return np.maximum(0.0, x)

def pool2(img):
    H, W = img.shape
    return img.reshape(H // 2, 2, W // 2, 2).max(axis=(1, 3))

f1 = relu(conv2d(np.pad(field, 1), sobel_v))
p1 = pool2(f1)
f2 = relu(conv2d(np.pad(p1, 1), sobel_h))
p2 = pool2(f2)

fig, axes = plt.subplots(1, 4)
axes[0].imshow(field, cmap="gray")
axes[0].set_title("the sigil")
axes[1].imshow(f1, cmap="gray")
axes[1].set_title("edges")
axes[2].imshow(p1, cmap="gray")
axes[2].set_title("pooled")
axes[3].imshow(p2, cmap="gray")
axes[3].set_title("summit")

print(p1.shape)
print(p2.shape)`,
        hints: [
          'relu is one line: np.maximum(0.0, x). pool2 reads H, W = img.shape and returns img.reshape(H // 2, 2, W // 2, 2).max(axis=(1, 3)) — reshape carves the quarters, max burns all but the loudest.',
          'Each floor pads BEFORE convolving so sizes stay 16 -> 16 -> 8 -> 8 -> 4: f1 = relu(conv2d(np.pad(field, 1), sobel_v)), p1 = pool2(f1); floor 2 repeats the rite on p1 with sobel_h.',
          'The wall: fig, axes = plt.subplots(1, 4), then axes[0].imshow(field, cmap="gray") and axes[0].set_title("...") — and likewise f1, p1, p2 into axes[1..3]. The prints should read (8, 8) then (4, 4).',
        ],
        validation: py`import numpy as np
import matplotlib.pyplot as plt
def _ref(img, k):
    kh, kw = k.shape
    H, W = img.shape
    o = np.zeros((H - kh + 1, W - kw + 1))
    for i in range(H - kh + 1):
        for j in range(W - kw + 1):
            o[i, j] = np.sum(img[i:i + kh, j:j + kw] * k)
    return o
assert np.allclose(relu(np.array([-2.0, 0.0, 3.5])), np.array([0.0, 0.0, 3.5])), "relu must silence negatives and pass the rest — np.maximum(0.0, x)."
_demo = np.array([[1.0, 5.0, 0.0, 2.0], [3.0, 2.0, 8.0, 1.0], [0.0, 1.0, 4.0, 4.0], [2.0, 0.0, 3.0, 9.0]])
assert np.allclose(pool2(_demo), np.array([[5.0, 8.0], [2.0, 9.0]])), "pool2 on the lesson's 4x4 must give [[5, 8], [2, 9]] — the max of each 2x2 quarter. Check the reshape (H//2, 2, W//2, 2) and max over axes (1, 3)."
assert np.allclose(pool2(np.array([[1.0, 9.0, 2.0, 2.0, 0.0, 3.0], [0.0, 4.0, 7.0, 1.0, 5.0, 5.0]])), np.array([[9.0, 7.0, 5.0]])), "pool2 must work on any even-sided map — a 2x6 map pools to (1, 3)."
_yy, _xx = np.mgrid[0:16, 0:16]
_rr = np.sqrt((_yy - 7.5) ** 2 + (_xx - 7.5) ** 2)
_sig = np.where((_rr > 3.5) & (_rr < 6.5), 220.0, 30.0)
_sig[7:9, 4:12] = 240.0
_field = _sig / 255.0
assert np.allclose(np.asarray(field, dtype=float), _field), "The conjuring was altered — field must remain the normalized ward-sigil."
_sv = np.array([[-1.0, 0.0, 1.0], [-2.0, 0.0, 2.0], [-1.0, 0.0, 1.0]])
_f1 = np.maximum(0.0, _ref(np.pad(_field, 1), _sv))
_p1 = _f1.reshape(8, 2, 8, 2).max(axis=(1, 3))
_f2 = np.maximum(0.0, _ref(np.pad(_p1, 1), _sv.T))
_p2 = _f2.reshape(4, 2, 4, 2).max(axis=(1, 3))
assert f1.shape == (16, 16) and np.allclose(f1, _f1), "Floor 1 is wrong — f1 must be relu(conv2d(np.pad(field, 1), sobel_v)): padded first, so it stays 16x16."
assert p1.shape == (8, 8) and np.allclose(p1, _p1), "p1 must be pool2(f1) — the 16x16 edge map pooled to 8x8."
assert f2.shape == (8, 8) and np.allclose(f2, _f2), "Floor 2 is wrong — f2 must be relu(conv2d(np.pad(p1, 1), sobel_h)): the horizontal eye read over the POOLED map."
assert p2.shape == (4, 4) and np.allclose(p2, _p2), "p2 must be pool2(f2) — the summit, 4x4."
_fig = plt.gcf()
assert len(_fig.axes) == 4, "The wall must hold exactly four frames — fig, axes = plt.subplots(1, 4)."
_want = [_field, _f1, _p1, _p2]
for _i in range(4):
    assert len(_fig.axes[_i].images) == 1, "Frame %d of the wall is empty — imshow one stage into each of the four axes." % _i
    assert np.allclose(np.asarray(_fig.axes[_i].images[0].get_array(), dtype=float), _want[_i]), "Frame %d shows the wrong stage — the order is field, f1, p1, p2." % _i
    assert _fig.axes[_i].get_title().strip() != "", "Frame %d has no name — give every stage a set_title." % _i
assert "(8, 8)" in _stdout, "Print p1.shape — after one floor the map is (8, 8)."
assert "(4, 4)" in _stdout, "Print p2.shape — the summit is (4, 4)."`,
        successText: 'Floor by floor the sigil gives up its pixels and keeps only its meaning — and the pyramid, silent, files its first report.',
        xp: 105,
      },
      quiz: [
        {
          q: 'What does 2x2 max pooling do to an 8x8 feature map?',
          options: [
            'Doubles it to 16x16 by interpolation',
            'Averages the whole map into one number',
            'Removes the two dimmest rows',
            'Shrinks it to 4x4, keeping only the strongest response in each 2x2 quarter',
          ],
          answer: 3,
          explain: 'Pooling tiles the map into 2x2 blocks and keeps each block\'s maximum: the '
            + 'sides halve and every detection survives, though its exact pixel is forgotten. '
            + 'Averaging is a different (gentler) pooling; max is the standard clerk.',
        },
        {
          q: 'Why does stacking conv -> pool -> conv -> pool produce detectors for corners and shapes rather than just more edges?',
          options: [
            'Because pooling sharpens the image between the two convolutions',
            'Because the second convolution reads the first\'s FEATURE MAP, not the pixels — it finds patterns among edge-reports, and a pattern of edges is a corner or a shape',
            'Because two convolutions cancel each other\'s noise',
            'Because the second kernel is larger than the first',
          ],
          answer: 1,
          explain: 'Each floor stands on the reports of the floor below. The first sees light '
            + 'and reports edges; the second sees edge-reports and finds their arrangements — '
            + 'and arrangements of edges are corners, junctions, shapes. Meaning compounds '
            + 'because the input itself climbs a level each floor.',
        },
        {
          q: 'A convolutional layer applies 8 different 3x3 kernels to one 16x16 (padded) image. What comes out?',
          options: [
            'One 16x16 map averaging all eight kernels',
            'A 48x48 map',
            'Eight feature maps stacked as channels — a block of shape (8, 16, 16)',
            'Eight copies of the image, each blurred differently',
          ],
          answer: 2,
          explain: 'Every kernel asks its own question and writes its own map; the layer stacks '
            + 'them into channels, shape (n_kernels, H, W). The next layer\'s kernels then read '
            + 'all eight channels at once — weighing edge-reports against each other, not '
            + 'averaging them away.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a10l4 — Finding the Mark
    // ------------------------------------------------------------------
    {
      id: 'a10l4',
      title: 'Finding the Mark',
      concept: 'template matching: normalized sliding-window scoring, argmax localization with np.unravel_index, thresholding presence, and how real detectors generalize it',
      xp: 40,
      narrative: 'A rescued page from the enemy archive, and one question over it in the war '
        + 'room: *is the Eye\'s brand on this page, and if so — where?* The brand is small. '
        + 'The page is large and fogged with noise. Staring will not do; the wardens need '
        + 'arithmetic that walks every position, holds the brand against the window it finds '
        + 'there, and speaks a number: *this much resemblance, here.* The craft is called '
        + 'template matching. It is the oldest detector in the world, it fits in twenty lines '
        + 'of numpy, and its two verdicts — WHERE the best match lies, and whether the best '
        + 'match is good enough to be believed — are the skeleton of every detector built '
        + 'since, however deep.',
      sections: [
        {
          heading: 'A score no lamp can bribe',
          body: 'The naive resemblance score — multiply window by template and sum, as a kernel '
            + 'does — has a flaw you already met: bright windows score high on *everything*. '
            + 'The fix is the same one statistics always offers: **center both patches and '
            + 'normalize by their energies**.\n\n'
            + '- Subtract each patch\'s mean from itself: now flat brightness contributes '
            + 'nothing.\n'
            + '- Divide the dot product by the product of the patches\' magnitudes (plus a '
            + 'tiny 1e-9 so an utterly flat patch divides safely).\n\n'
            + 'The result is **normalized cross-correlation** (here in its plain, workmanlike '
            + 'form): +1.0 means *this window IS the template*, up to brightness and contrast; '
            + '0 means no resemblance; -1.0 means the template in negative. Rescaling or '
            + 'brightening the window cannot bribe the score — verify it below.',
          code: py`import numpy as np

def score(window, tmpl):
    w = window - window.mean()
    t = tmpl - tmpl.mean()
    denom = np.sqrt(np.sum(w * w) * np.sum(t * t)) + 1e-9
    return np.sum(w * t) / denom

brand = np.array([[0.9, 0.1, 0.1, 0.9],
                  [0.1, 0.9, 0.9, 0.1],
                  [0.1, 0.9, 0.9, 0.1],
                  [0.9, 0.1, 0.1, 0.9]])

print(round(float(score(brand, brand)), 3))              # 1.0  -- itself
print(round(float(score(brand * 2.0, brand)), 3))        # 1.0  -- contrast-blind
print(round(float(score(brand + 0.3, brand)), 3))        # 1.0  -- brightness-blind
print(round(float(score(1.0 - brand, brand)), 3))        # -1.0 -- the negative`,
        },
        {
          heading: 'The sweep, and argmax to name the place',
          body: 'Now walk the score across the page: at every valid position, cut the '
            + 'window, score it against the template, and record the answer — a **match map**, '
            + 'built by the same double loop as convolution. Its brightest cell is the best '
            + 'match on the whole page.\n\n'
            + '- `np.argmax(m)` returns the index of that cell — but *flattened*, a single '
            + 'number counting row-major.\n'
            + '- `np.unravel_index(np.argmax(m), m.shape)` converts it back to `(row, col)` — '
            + 'the coordinates where the template\'s top-left corner sits.\n\n'
            + 'This is **localization**: not just *seen*, but *seen at row 3, column 6*. The '
            + 'demonstration plants the brand on a noisy page and recovers its position '
            + 'exactly.',
          code: py`import numpy as np

def score(window, tmpl):
    w = window - window.mean()
    t = tmpl - tmpl.mean()
    denom = np.sqrt(np.sum(w * w) * np.sum(t * t)) + 1e-9
    return np.sum(w * t) / denom

def match_map(img, tmpl):
    th, tw = tmpl.shape
    H, W = img.shape
    out = np.zeros((H - th + 1, W - tw + 1))
    for i in range(H - th + 1):
        for j in range(W - tw + 1):
            out[i, j] = score(img[i:i + th, j:j + tw], tmpl)
    return out

brand = np.array([[0.9, 0.1, 0.1, 0.9],
                  [0.1, 0.9, 0.9, 0.1],
                  [0.1, 0.9, 0.9, 0.1],
                  [0.9, 0.1, 0.1, 0.9]])

page = np.random.default_rng(2).normal(0.5, 0.1, (12, 12))   # fogged page
page[3:7, 6:10] = brand                                      # the brand, planted

m = match_map(page, brand)
print(m.shape)                            # (9, 9)
row, col = np.unravel_index(np.argmax(m), m.shape)
print(int(row), int(col))                 # 3 6 -- found exactly
print(round(float(m.max()), 3))           # 1.0`,
        },
        {
          heading: 'The threshold decides IF',
          body: 'Here is the trap every young warden falls into once: **argmax always answers**. '
            + 'Sweep the brand over a page that has *no brand*, and the match map still has a '
            + 'brightest cell — noise resembles anything a little, somewhere. Location is only '
            + 'half the verdict. The other half is a **threshold** on the score itself:\n\n'
            + '- Best score near 1.0 -> the mark is there, at argmax.\n'
            + '- Best score at 0.4 or 0.5 -> that is what mere noise buys; the mark is absent, '
            + 'and the argmax names an innocent smudge.\n\n'
            + 'On the fogged pages of this craft, a threshold of 0.8 leaves a wide moat on '
            + 'both sides.\n\n'
            + 'And the honest dispatch: real detectors are not this. A sliding template knows '
            + 'one brand at one size and pays one score-call per position. The detectors that '
            + 'watch the world — the CNN kind — *learn* their templates as kernels (floor upon '
            + 'floor of them, as you built in the pyramid), then **regress box coordinates and '
            + 'an objectness score** from the feature maps: WHERE as continuous numbers, IF as '
            + 'a learned confidence. Different machinery, same two verdicts. You have built '
            + 'the skeleton they all share: features, scores, argmax, threshold.',
          code: py`import numpy as np

def score(window, tmpl):
    w = window - window.mean()
    t = tmpl - tmpl.mean()
    denom = np.sqrt(np.sum(w * w) * np.sum(t * t)) + 1e-9
    return np.sum(w * t) / denom

def match_map(img, tmpl):
    th, tw = tmpl.shape
    H, W = img.shape
    out = np.zeros((H - th + 1, W - tw + 1))
    for i in range(H - th + 1):
        for j in range(W - tw + 1):
            out[i, j] = score(img[i:i + th, j:j + tw], tmpl)
    return out

brand = np.array([[0.9, 0.1, 0.1, 0.9],
                  [0.1, 0.9, 0.9, 0.1],
                  [0.1, 0.9, 0.9, 0.1],
                  [0.9, 0.1, 0.1, 0.9]])

blank = np.random.default_rng(4).normal(0.5, 0.1, (12, 12))  # no brand at all
m = match_map(blank, brand)
print(round(float(m.max()), 3))           # 0.495 -- noise's best bribe
row, col = np.unravel_index(np.argmax(m), m.shape)
print(int(row), int(col))                 # 3 5 -- a confident lie
print(bool(m.max() > 0.8))                # False -- the threshold holds`,
          note: 'Write it above the war-room door: *the argmax always points somewhere*. A '
            + 'detector without a threshold is a witness who cannot say "I did not see it" — '
            + 'the most dangerous witness there is.',
        },
      ],
      challenge: {
        title: 'The Hunt for the Brand',
        prompt: 'Two pages from the archive: one carries the Eye\'s brand somewhere in the fog, '
          + 'the other is innocent. Build the hunt, name the place, and — harder — decline to '
          + 'name one where there is none.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Define `score(window, tmpl)` — center both patches by their means, then the dot '
          + 'product over `np.sqrt(np.sum(w * w) * np.sum(t * t)) + 1e-9`.\n'
          + '- Define `match_map(img, tmpl)` — the double loop over every valid position, '
          + 'scoring the window at each; output shape `(H - th + 1, W - tw + 1)`.\n'
          + '- Sweep the marked page: `hunt = match_map(page, mark)`.\n'
          + '- Name the place: `best_row, best_col = np.unravel_index(np.argmax(hunt), '
          + 'hunt.shape)`.\n'
          + '- Judge presence: `found = bool(hunt.max() > 0.8)`.\n'
          + '- Sweep the innocent page: `shadow = match_map(decoy, mark)` and '
          + '`found_decoy = bool(shadow.max() > 0.8)`.\n'
          + '- Show the hunt: `plt.imshow(hunt, cmap="gray")` with a `plt.title(...)`.\n'
          + '- Print exactly three lines: `print(f"mark at ({best_row}, {best_col})")`, then '
          + '`print(found)`, then `print(found_decoy)`.',
        starter: py`import numpy as np
import matplotlib.pyplot as plt

# The Eye's brand — a small ring. Do not alter the conjuring.
myy, mxx = np.mgrid[0:6, 0:6]
mr = np.sqrt((myy - 2.5) ** 2 + (mxx - 2.5) ** 2)
mark = np.where((mr > 1.0) & (mr < 2.8), 0.9, 0.1)

# Two pages from the archive. Do not alter.
page = np.random.default_rng(0).normal(0.45, 0.12, (24, 24))
page[9:15, 4:10] = mark                       # the brand, pressed into the fog
decoy = np.random.default_rng(1).normal(0.45, 0.12, (24, 24))   # innocent

# TODO: define score(window, tmpl) — centered, normalized, +1e-9 in the denom

# TODO: define match_map(img, tmpl) — the double loop of score calls

# TODO: hunt, and best_row, best_col via np.unravel_index(np.argmax(...), ...)

# TODO: found — bool(hunt.max() > 0.8)

# TODO: shadow and found_decoy — the same hunt over the innocent page

# TODO: imshow hunt with cmap="gray", and title the figure

# TODO: the three prints, exactly as required
`,
        solution: py`import numpy as np
import matplotlib.pyplot as plt

myy, mxx = np.mgrid[0:6, 0:6]
mr = np.sqrt((myy - 2.5) ** 2 + (mxx - 2.5) ** 2)
mark = np.where((mr > 1.0) & (mr < 2.8), 0.9, 0.1)

page = np.random.default_rng(0).normal(0.45, 0.12, (24, 24))
page[9:15, 4:10] = mark
decoy = np.random.default_rng(1).normal(0.45, 0.12, (24, 24))

def score(window, tmpl):
    w = window - window.mean()
    t = tmpl - tmpl.mean()
    denom = np.sqrt(np.sum(w * w) * np.sum(t * t)) + 1e-9
    return np.sum(w * t) / denom

def match_map(img, tmpl):
    th, tw = tmpl.shape
    H, W = img.shape
    out = np.zeros((H - th + 1, W - tw + 1))
    for i in range(H - th + 1):
        for j in range(W - tw + 1):
            out[i, j] = score(img[i:i + th, j:j + tw], tmpl)
    return out

hunt = match_map(page, mark)
best_row, best_col = np.unravel_index(np.argmax(hunt), hunt.shape)
found = bool(hunt.max() > 0.8)

shadow = match_map(decoy, mark)
found_decoy = bool(shadow.max() > 0.8)

plt.imshow(hunt, cmap="gray")
plt.title("The hunt for the brand")

print(f"mark at ({best_row}, {best_col})")
print(found)
print(found_decoy)`,
        hints: [
          'score: w = window - window.mean(), t = tmpl - tmpl.mean(), then np.sum(w * t) divided by np.sqrt(np.sum(w * w) * np.sum(t * t)) + 1e-9. Its answer for a perfect match is 1.0 regardless of brightness.',
          'match_map mirrors conv2d exactly, but each cell is score(img[i:i + th, j:j + tw], tmpl) instead of a kernel sum. On a 24x24 page with a 6x6 mark the map is (19, 19).',
          'np.argmax(hunt) is a flattened index — np.unravel_index(np.argmax(hunt), hunt.shape) turns it into (row, col); it lands on (9, 4). found is True (max is 1.0), found_decoy is False (the innocent page peaks near 0.48). Then imshow, title, and the three prints.',
        ],
        validation: py`import numpy as np
import matplotlib.pyplot as plt
_myy, _mxx = np.mgrid[0:6, 0:6]
_mr = np.sqrt((_myy - 2.5) ** 2 + (_mxx - 2.5) ** 2)
_mark = np.where((_mr > 1.0) & (_mr < 2.8), 0.9, 0.1)
assert abs(float(score(_mark, _mark)) - 1.0) < 1e-6, "score of the mark against itself must be 1.0 — center both patches and normalize by their energies."
assert abs(float(score(_mark * 2.0 + 0.3, _mark)) - 1.0) < 1e-6, "score must be blind to brightness and contrast — a scaled, shifted copy of the template still scores 1.0. Did you subtract each patch's mean and divide by both magnitudes?"
assert abs(float(score(1.0 - _mark, _mark)) + 1.0) < 1e-6, "score of the mark's negative must be -1.0 — the sign carries meaning; do not take an absolute value."
_page = np.random.default_rng(0).normal(0.45, 0.12, (24, 24))
_page[9:15, 4:10] = _mark
assert np.allclose(np.asarray(page, dtype=float), _page), "The conjuring was altered — the marked page must stand exactly as conjured (seed 0)."
assert hunt.shape == (19, 19), "hunt must cover every valid position — a 6x6 mark on a 24x24 page gives a (19, 19) map."
_hm = np.zeros((19, 19))
for _i in range(19):
    for _j in range(19):
        _w = _page[_i:_i + 6, _j:_j + 6] - _page[_i:_i + 6, _j:_j + 6].mean()
        _t = _mark - _mark.mean()
        _hm[_i, _j] = np.sum(_w * _t) / (np.sqrt(np.sum(_w * _w) * np.sum(_t * _t)) + 1e-9)
assert np.allclose(hunt, _hm, atol=1e-6), "hunt disagrees with an honest sweep — each cell must be score(page[i:i+6, j:j+6], mark)."
assert (int(best_row), int(best_col)) == (9, 4), "best_row, best_col must name where the brand's top-left corner sits — np.unravel_index(np.argmax(hunt), hunt.shape) gives (9, 4)."
assert found is True, "found must be True — the planted brand scores 1.0, far above the 0.8 threshold. It must be a bool."
assert shadow.shape == (19, 19), "shadow must sweep the DECOY page with the same match_map — same (19, 19) shape."
assert float(shadow.max()) < 0.7, "The innocent page's best score should be mere noise (about 0.48) — if it is high, match_map may be scoring against the wrong page or without normalization."
assert found_decoy is False, "found_decoy must be False — noise's best bribe stays far below the 0.8 threshold. The argmax points somewhere, but the threshold refuses it."
_ax = plt.gcf().axes
assert len(_ax) >= 1 and len(_ax[0].images) == 1, "The Forge sees no image — render the match map with plt.imshow(hunt, cmap='gray')."
assert np.allclose(np.asarray(_ax[0].images[0].get_array(), dtype=float), hunt), "The displayed image is not hunt — show the match map itself."
assert _ax[0].get_title().strip() != "", "The figure has no title — name the hunt with plt.title(...)."
assert "mark at (9, 4)" in _stdout, "Report the place exactly — print(f\"mark at ({best_row}, {best_col})\") should read: mark at (9, 4)."
assert "True" in _stdout and "False" in _stdout, "Print found (True) and then found_decoy (False) — both verdicts, each on its own line."`,
        successText: 'Row nine, column four — the brand surfaces from the fog like a drowned face. And on the innocent page, your hunter says the harder thing: nothing.',
        xp: 110,
      },
      quiz: [
        {
          q: 'Why does the matching score subtract each patch\'s mean and divide by both patches\' magnitudes?',
          options: [
            'So the score measures shape alone — a brighter or higher-contrast window cannot bribe it, and a perfect match reads 1.0 regardless of lighting',
            'To make the sweep run faster',
            'Because numpy cannot multiply patches with different means',
            'To keep the match map the same size as the image',
          ],
          answer: 0,
          explain: 'Un-normalized correlation rewards raw brightness — a blank bright window '
            + 'outscores a dim true match. Centering kills the brightness term; normalizing '
            + 'kills the contrast term; what remains is resemblance of pattern, pinned to the '
            + 'honest scale [-1, +1].',
        },
        {
          q: 'The match map\'s maximum over a page is 0.43, and the threshold is 0.8. What is the correct reading?',
          options: [
            'The mark is present at the argmax position, but faint',
            'The threshold must be lowered until the mark is found',
            'The mark is absent — 0.43 is what noise scores; the argmax merely names noise\'s best coincidence',
            'The match map must be recomputed with a larger template',
          ],
          answer: 2,
          explain: 'Argmax always answers — every map has SOME brightest cell. The score at '
            + 'that cell is what separates detection from coincidence, and 0.43 sits in noise\'s '
            + 'country. Lowering the threshold to force a find is how detectors are made into '
            + 'liars.',
        },
        {
          q: 'How do modern CNN detectors generalize what template matching does?',
          options: [
            'They slide thousands of hand-drawn templates at once',
            'They abandon localization and only classify whole images',
            'They replace images with text descriptions first',
            'They learn their templates as kernels in a conv/pool pyramid, then regress box coordinates and a confidence score from the feature maps — learned WHERE and learned IF',
          ],
          answer: 3,
          explain: 'The skeleton survives: features, scoring, location, threshold. What changes '
            + 'is that the features are learned (kernels), the location is predicted as '
            + 'continuous box coordinates, and the IF is a trained confidence — which is why '
            + 'one detector generalizes across sizes, angles, and lighting where a fixed '
            + 'template cannot.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a10l5 — The Latent Vault
    // ------------------------------------------------------------------
    {
      id: 'a10l5',
      title: 'The Latent Vault',
      concept: 'generative decoding: an autoencoder on flattened 2D sigils, walking the 2-D latent space, decoding new sigils that never existed, and interpolating between real ones',
      xp: 40,
      narrative: 'Beneath the Eye the wardens broke into the Forge\'s inner room and found — '
        + 'nothing. No stolen sigils, no plates, no molds. Only a small polished chamber with '
        + 'two dials on its door, and a ledger of coordinates. The Counterfeit Forge never '
        + 'stored its forgeries. It stored a **space**: every sigil it had ever studied pressed '
        + 'down to two numbers, and a decoder that could raise two numbers back into a sigil. '
        + 'Turn the dials to a place no real sigil ever occupied, and the door still opens — '
        + 'onto a forgery minted fresh from the coordinates themselves. You built this mirror '
        + 'once, in the Last Alliance, to catch anomalies. Tonight you use it the other way. '
        + 'Tonight you open the vault.',
      sections: [
        {
          heading: 'A loom of two threads',
          body: 'First, the sigils themselves. The archive\'s ward-sigils are 8x8 grayscale '
            + 'images, and — as real image families do — they vary along only a few true axes. '
            + 'Ours are woven from exactly two: a **ring** base and a **cross** base. Every '
            + 'sigil is `a * ring + b * cross` plus a whisper of noise; different `(a, b)` give '
            + 'different sigils, and the family is two-dimensional no matter how many pixels '
            + 'each member wears.\n\n'
            + 'To feed 2D images to the mirror from the Last Alliance, **flatten** them: '
            + '`.ravel()` unrolls 8x8 into 64, `.reshape(8, 8)` rolls it back. The network '
            + 'never knows the difference — 64 measures are 64 measures — and the conjuring '
            + 'below builds 150 flattened sigils exactly as the ward-pulses were built, but '
            + 'with image bases for threads.',
          code: py`import numpy as np

yy, xx = np.mgrid[0:8, 0:8]
r = np.sqrt((yy - 3.5) ** 2 + (xx - 3.5) ** 2)
ring = ((r > 1.5) & (r < 3.5)).astype(float)
cross = ((np.abs(yy - xx) <= 1) | (np.abs(yy + xx - 7) <= 1)).astype(float)

example = 1.4 * ring - 0.8 * cross        # one point of the family
print(round(float(example.min()), 1), round(float(example.max()), 1))   # -0.8 1.4

weave = np.vstack([ring.ravel(), cross.ravel()])          # (2, 64) -- the loom
rng = np.random.default_rng(0)
latents = rng.normal(0.0, 1.0, (150, 2))                  # 150 true (a, b) pairs
X = latents @ weave + rng.normal(0.0, 0.05, (150, 64))    # 150 flattened sigils
print(X.shape)    # (150, 64)`,
        },
        {
          heading: 'Training the vault',
          body: 'The autoencoder is the one from the Last Alliance with wider doors: encoder '
            + '`(64, 2)`, decoder `(2, 64)`, and the same five gradient lines you already know '
            + 'cold. The **bottleneck of 2** is not a handicap here — it is the *point*. The '
            + 'data truly has two threads, so two numbers suffice, and the code layer is '
            + 'forced to become a faithful map of the family: the **latent space**.\n\n'
            + '- After training, `encode(sigil)` presses any sigil to its two coordinates.\n'
            + '- `decode(z)` raises any two coordinates back to 64 pixels.\n\n'
            + 'Reconstruction error falls from 1.153 to about 0.0024 — the loom, relearned '
            + 'from its cloth.',
          code: py`import numpy as np

yy, xx = np.mgrid[0:8, 0:8]
r = np.sqrt((yy - 3.5) ** 2 + (xx - 3.5) ** 2)
ring = ((r > 1.5) & (r < 3.5)).astype(float)
cross = ((np.abs(yy - xx) <= 1) | (np.abs(yy + xx - 7) <= 1)).astype(float)
weave = np.vstack([ring.ravel(), cross.ravel()])
rng = np.random.default_rng(0)
latents = rng.normal(0.0, 1.0, (150, 2))
X = latents @ weave + rng.normal(0.0, 0.05, (150, 64))
n, d = X.shape

rngw = np.random.default_rng(1)
W1 = rngw.normal(0.0, 0.1, (64, 2))     # encoder: 64 -> 2
b1 = np.zeros(2)
W2 = rngw.normal(0.0, 0.1, (2, 64))     # decoder: 2 -> 64
b2 = np.zeros(64)
history = []
for _ in range(1500):
    H = X @ W1 + b1
    R = H @ W2 + b2
    E = R - X
    dR = 2.0 * E / (n * d)
    grad_W2 = H.T @ dR
    grad_b2 = dR.sum(axis=0)
    dH = dR @ W2.T
    grad_W1 = X.T @ dH
    grad_b1 = dH.sum(axis=0)
    W1 -= 0.2 * grad_W1
    b1 -= 0.2 * grad_b1
    W2 -= 0.2 * grad_W2
    b2 -= 0.2 * grad_b2
    history.append(np.mean(E ** 2))

print(round(history[0], 3), round(history[-1], 4))   # 1.153 0.0024`,
          note: 'In the Last Alliance you trained this mirror and looked only at its FAILURES — '
            + 'reconstruction error as alarm bell. The vault is the same artifact read in the '
            + 'other direction: not "what fails to pass through the waist" but "what the waist '
            + 'can be made to emit."',
        },
        {
          heading: 'The forger\'s hand: decode what never was',
          body: 'Here is the turn. Nothing in `decode` checks that its input came from a real '
            + 'sigil. Hand it ANY point of the plane and it answers with 64 pixels — a sigil '
            + 'whose coordinates were simply never occupied. Three workings, all one line '
            + 'each:\n\n'
            + '- **Forgery**: `decode(np.array([[1.5, -1.0]]))` — a fresh sigil from empty '
            + 'coordinates. Reshape to 8x8 and it hangs on the wall like any real one.\n'
            + '- **Interpolation**: encode two real sigils, average their codes, decode the '
            + 'midpoint — a sigil *between* two real ones, sharing both bloodlines.\n'
            + '- **The grid walk**: decode every point of a small lattice and lay the results '
            + 'out with subplots — the vault\'s whole territory, mapped page by page.\n\n'
            + 'One honesty before the challenge. Our vault is linear, so its space is tame: '
            + 'every decoded point is some mix of ring and cross, and interpolation just '
            + 'blends coefficients. The great generative engines — VAEs, diffusion models — '
            + 'learn *curved* vaults over millions of axes, where "between two faces" passes '
            + 'through faces and not through fog; they add machinery to make the latent space '
            + 'smooth and densely meaningful. But the doctrine is exactly this one: **learn a '
            + 'compressed space, then decode points of it into things that never existed.**',
          code: py`import numpy as np
import matplotlib.pyplot as plt

yy, xx = np.mgrid[0:8, 0:8]
r = np.sqrt((yy - 3.5) ** 2 + (xx - 3.5) ** 2)
ring = ((r > 1.5) & (r < 3.5)).astype(float)
cross = ((np.abs(yy - xx) <= 1) | (np.abs(yy + xx - 7) <= 1)).astype(float)
weave = np.vstack([ring.ravel(), cross.ravel()])
rng = np.random.default_rng(0)
latents = rng.normal(0.0, 1.0, (150, 2))
X = latents @ weave + rng.normal(0.0, 0.05, (150, 64))
n, d = X.shape

rngw = np.random.default_rng(1)
W1 = rngw.normal(0.0, 0.1, (64, 2))
b1 = np.zeros(2)
W2 = rngw.normal(0.0, 0.1, (2, 64))
b2 = np.zeros(64)
for _ in range(1500):
    H = X @ W1 + b1
    R = H @ W2 + b2
    E = R - X
    dR = 2.0 * E / (n * d)
    grad_W2 = H.T @ dR
    grad_b2 = dR.sum(axis=0)
    dH = dR @ W2.T
    grad_W1 = X.T @ dH
    grad_b1 = dH.sum(axis=0)
    W1 -= 0.2 * grad_W1
    b1 -= 0.2 * grad_b1
    W2 -= 0.2 * grad_W2
    b2 -= 0.2 * grad_b2

def decode(Z):
    return Z @ W2 + b2

# the grid walk: nine points of the vault, none of them real
fig, axes = plt.subplots(3, 3)
for i, a in enumerate((-2.0, 0.0, 2.0)):
    for j, b in enumerate((-2.0, 0.0, 2.0)):
        page = decode(np.array([[a, b]])).reshape(8, 8)
        axes[i, j].imshow(page, cmap="gray")
        axes[i, j].set_xticks([])
        axes[i, j].set_yticks([])
fig.suptitle("Nine sigils that never existed")`,
        },
      ],
      challenge: {
        title: 'Open the Vault',
        prompt: 'The loom is conjured — 150 ward-sigils woven from ring and cross. Train the '
          + 'vault, then do the forbidden thing correctly: mint a sigil from empty coordinates, '
          + 'and another from between two real ones.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Weights, seeded and in this order: `rngw = np.random.default_rng(1)`, then '
          + '`W1 = rngw.normal(0.0, 0.1, (64, 2))`, `b1 = np.zeros(2)`, '
          + '`W2 = rngw.normal(0.0, 0.1, (2, 64))`, `b2 = np.zeros(64)`, and `history = []`.\n'
          + '- Train 1500 steps at learning rate 0.2, exactly as taught: `H = X @ W1 + b1`, '
          + '`R = H @ W2 + b2`, `E = R - X`, then `dR = 2.0 * E / (n * d)`, '
          + '`grad_W2 = H.T @ dR`, `grad_b2 = dR.sum(axis=0)`, `dH = dR @ W2.T`, '
          + '`grad_W1 = X.T @ dH`, `grad_b1 = dH.sum(axis=0)`, the four updates, then '
          + '`history.append(np.mean(E ** 2))`.\n'
          + '- Define `encode(M)` returning `M @ W1 + b1` and `decode(Z)` returning '
          + '`Z @ W2 + b2`.\n'
          + '- Mint the forgery: `forged = decode(np.array([[1.5, -1.0]])).reshape(8, 8)`.\n'
          + '- Interpolate: `za = encode(X[0:1])`, `zb = encode(X[1:2])`, then '
          + '`mid = decode((za + zb) / 2.0).reshape(8, 8)`.\n'
          + '- Show the forgery: `plt.imshow(forged, cmap="gray")` with a `plt.title(...)`.\n'
          + '- Print `round(float(history[0]), 2)`, then `round(float(history[-1]), 4)`, each '
          + 'on its own line.',
        starter: py`import numpy as np
import matplotlib.pyplot as plt

# The loom, conjured. Do not alter the conjuring.
yy, xx = np.mgrid[0:8, 0:8]
r = np.sqrt((yy - 3.5) ** 2 + (xx - 3.5) ** 2)
ring = ((r > 1.5) & (r < 3.5)).astype(float)
cross = ((np.abs(yy - xx) <= 1) | (np.abs(yy + xx - 7) <= 1)).astype(float)
weave = np.vstack([ring.ravel(), cross.ravel()])
rng = np.random.default_rng(0)
latents = rng.normal(0.0, 1.0, (150, 2))
X = latents @ weave + rng.normal(0.0, 0.05, (150, 64))
n, d = X.shape

# TODO: seeded weights — rngw = np.random.default_rng(1); W1 (64, 2), b1,
#       W2 (2, 64), b2; history = []

# TODO: 1500 training steps at lr 0.2 — encode, decode, E, the five gradient
#       lines, four updates, append np.mean(E ** 2) to history

# TODO: define encode(M) and decode(Z)

# TODO: forged — decode the empty coordinates [[1.5, -1.0]], reshaped to 8x8

# TODO: za, zb — the codes of X[0:1] and X[1:2]; mid — their midpoint, decoded
#       and reshaped to 8x8

# TODO: imshow forged with cmap="gray", and title the figure

# TODO: print round(float(history[0]), 2), then round(float(history[-1]), 4)
`,
        solution: py`import numpy as np
import matplotlib.pyplot as plt

yy, xx = np.mgrid[0:8, 0:8]
r = np.sqrt((yy - 3.5) ** 2 + (xx - 3.5) ** 2)
ring = ((r > 1.5) & (r < 3.5)).astype(float)
cross = ((np.abs(yy - xx) <= 1) | (np.abs(yy + xx - 7) <= 1)).astype(float)
weave = np.vstack([ring.ravel(), cross.ravel()])
rng = np.random.default_rng(0)
latents = rng.normal(0.0, 1.0, (150, 2))
X = latents @ weave + rng.normal(0.0, 0.05, (150, 64))
n, d = X.shape

rngw = np.random.default_rng(1)
W1 = rngw.normal(0.0, 0.1, (64, 2))
b1 = np.zeros(2)
W2 = rngw.normal(0.0, 0.1, (2, 64))
b2 = np.zeros(64)
history = []

for _ in range(1500):
    H = X @ W1 + b1
    R = H @ W2 + b2
    E = R - X
    dR = 2.0 * E / (n * d)
    grad_W2 = H.T @ dR
    grad_b2 = dR.sum(axis=0)
    dH = dR @ W2.T
    grad_W1 = X.T @ dH
    grad_b1 = dH.sum(axis=0)
    W1 -= 0.2 * grad_W1
    b1 -= 0.2 * grad_b1
    W2 -= 0.2 * grad_W2
    b2 -= 0.2 * grad_b2
    history.append(np.mean(E ** 2))

def encode(M):
    return M @ W1 + b1

def decode(Z):
    return Z @ W2 + b2

forged = decode(np.array([[1.5, -1.0]])).reshape(8, 8)

za = encode(X[0:1])
zb = encode(X[1:2])
mid = decode((za + zb) / 2.0).reshape(8, 8)

plt.imshow(forged, cmap="gray")
plt.title("Minted from empty coordinates")

print(round(float(history[0]), 2))
print(round(float(history[-1]), 4))`,
        hints: [
          'Draw the weights in the given order from rngw = np.random.default_rng(1): W1 is (64, 2) — the encoder squeezing 64 pixels to 2 coordinates — then W2 is (2, 64). Biases start as zeros; history = [].',
          'The loop is the a8l6 rite verbatim, only wider: H, R, E, then dR = 2.0 * E / (n * d), the two decoder gradients, dH = dR @ W2.T, the two encoder gradients, the four -= 0.2 updates, then history.append(np.mean(E ** 2)). The loss should fall from about 1.15 to about 0.0024.',
          'encode and decode are each one line (M @ W1 + b1 and Z @ W2 + b2). forged = decode(np.array([[1.5, -1.0]])).reshape(8, 8); za = encode(X[0:1]); zb = encode(X[1:2]); mid = decode((za + zb) / 2.0).reshape(8, 8). Then imshow forged, title it, and print round(float(history[0]), 2) and round(float(history[-1]), 4) — 1.15 and 0.0024.',
        ],
        validation: py`import numpy as np
import matplotlib.pyplot as plt
assert W1.shape == (64, 2) and W2.shape == (2, 64), "The vault's doors are wrong — encoder W1 must be (64, 2) and decoder W2 (2, 64): 64 pixels pressed to 2 coordinates and raised back."
assert b1.shape == (2,) and b2.shape == (64,), "b1 must be np.zeros(2) and b2 np.zeros(64)."
assert len(history) == 1500, "history must record 1500 reconstruction losses — one per step."
assert history[0] > 0.5, "The first recorded loss should sit near 1.15 — if it is already small, the weights were not freshly seeded from default_rng(1) in the given order, or the loss was appended after the updates of a previous run."
assert history[-1] < 0.05, "The vault never converged — after 1500 steps at lr 0.2 the loss must fall below 0.05 (it reaches about 0.0024). Recheck the five gradient lines and the updates."
assert history[-1] < history[0] / 3, "The loss barely fell — the vault is not learning. Check the update signs and that all gradients are computed before any weight moves."
_Z = encode(X)
assert _Z.shape == (150, 2), "encode(M) must press each sigil to 2 coordinates — M @ W1 + b1, shape (150, 2) on X."
_R = decode(_Z)
assert _R.shape == (150, 64), "decode(Z) must raise coordinates back to 64 pixels — Z @ W2 + b2."
assert abs(float(np.mean((X - _R) ** 2)) - history[-1]) < 1e-3, "decode(encode(X)) disagrees with the trained vault — encode and decode must use the trained W1, b1, W2, b2."
assert np.allclose(decode(np.zeros((1, 2))), b2), "decode(Z) must be Z @ W2 + b2 and nothing else — decoding the origin must return exactly the bias b2."
assert forged.shape == (8, 8), "forged must be reshaped to 8x8 — an image again, not a flat vector."
assert np.allclose(forged, (np.array([[1.5, -1.0]]) @ W2 + b2).reshape(8, 8)), "forged must be decode(np.array([[1.5, -1.0]])) reshaped — minted from those exact empty coordinates."
_tm = ((latents[0] + latents[1]) / 2.0) @ weave
assert mid.shape == (8, 8), "mid must be reshaped to 8x8."
assert float(np.sqrt(np.mean((mid.ravel() - _tm) ** 2))) < 0.15, "mid does not sit between its parents — encode X[0:1] and X[1:2], average the two CODES, then decode. Averaging the raw pixels or decoding the wrong rows lands elsewhere."
_ax = plt.gcf().axes
assert len(_ax) >= 1 and len(_ax[0].images) == 1, "The Forge sees no image — render the forgery with plt.imshow(forged, cmap='gray')."
assert np.allclose(np.asarray(_ax[0].images[0].get_array(), dtype=float), forged), "The displayed image is not forged — show the minted sigil itself."
assert _ax[0].get_title().strip() != "", "The figure has no title — name the forgery with plt.title(...)."
assert "1.15" in _stdout, "Print round(float(history[0]), 2) — the untrained vault's loss reads 1.15."
assert "0.0024" in _stdout, "Print round(float(history[-1]), 4) — the trained vault's loss reads 0.0024."`,
        successText: 'The dials turn to coordinates no sigil ever held — and the door opens anyway. The page you lift out is warm, and no archive on earth contains it.',
        xp: 110,
      },
      quiz: [
        {
          q: 'What is the latent space of a trained autoencoder?',
          options: [
            'The set of images it failed to reconstruct',
            'The compressed coordinate space of its bottleneck — every input becomes a point there, and every point decodes back to an output',
            'The list of weights in its decoder',
            'The noise added to the training data',
          ],
          answer: 1,
          explain: 'The bottleneck\'s activations form a space: encode presses each input to a '
            + 'point, decode raises any point to an output. Real data occupies part of it — '
            + 'but the decoder answers everywhere, which is what makes generation possible.',
        },
        {
          q: 'You encode two real sigils, average their two codes, and decode the result. What do you get?',
          options: [
            'A sigil between the two — the decoder\'s rendering of the midpoint of their latent coordinates',
            'The pixel-wise average of the two original images, exactly',
            'An error — decode only accepts codes produced by encode',
            'Random noise, since the midpoint was never trained on',
          ],
          answer: 0,
          explain: 'decode is plain arithmetic on any point of the space; the midpoint code '
            + 'yields an in-between sigil. (For our linear vault this happens to match the '
            + 'pixel average up to the learned reconstruction — for the curved vaults of deep '
            + 'generators, latent interpolation is very much NOT pixel averaging, which is why '
            + 'faces morph through faces instead of ghostly double-exposures.)',
        },
        {
          q: 'Why can the decoder mint sigils that never existed?',
          options: [
            'Because it memorizes every training sigil and recombines them at random',
            'Because the noise added during training contains hidden sigils',
            'Because decode(z) is defined for EVERY point of the latent space, not just the points real sigils occupy — any unoccupied coordinates still decode to a valid member of the learned family',
            'It cannot — decoders only reproduce their training data',
          ],
          answer: 2,
          explain: 'Training only ever shows the decoder occupied coordinates, but the function '
            + 'it learns is total: every z yields an output in the span of what it learned. The '
            + 'vault holds the whole family of possible forgeries, including all the members '
            + 'nobody ever wove.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a10l6 — The Forger and the Sentinel
    // ------------------------------------------------------------------
    {
      id: 'a10l6',
      title: 'The Forger and the Sentinel',
      concept: 'a miniature GAN in raw numpy: a generator net and discriminator net trained by alternating updates on a 1-D target distribution, with honest notes on mode collapse and instability',
      xp: 40,
      narrative: 'The vault decodes what the loom already knew. The Forge\'s true engine was '
        + 'crueler and stranger: two minds chained facing each other. The first — the '
        + '**forger** — turns raw noise into coin. The second — the **sentinel** — is handed '
        + 'true coin and forged coin unlabeled, and paid to tell them apart. Every round, the '
        + 'sentinel learns from its mistakes; every round, the forger learns from the '
        + 'sentinel\'s verdicts, adjusting its hand until the sentinel\'s eye slides off its '
        + 'work. Neither is ever taught what true coin looks like. The forger learns it '
        + 'anyway, from nothing but the failure to pass. The moderns call the arrangement a '
        + 'GAN. The wardens called it what it is: a duel that forges its own winner.',
      sections: [
        {
          heading: 'Two minds, one coin',
          body: 'The target is humble on purpose: **true coin** is a stream of values drawn '
            + 'from a seeded Gaussian — mean 3.0, spread 0.5. The forger must learn to mint '
            + 'values indistinguishable from it, never being shown the numbers 3.0 or 0.5.\n\n'
            + '- **The forger (generator)** is one line: `g = wg * z + bg`, where `z` is raw '
            + 'noise from a standard Gaussian. Two parameters — a scale and a shift — which is '
            + 'exactly enough to reshape standard noise into any Gaussian. It starts wrong: '
            + '`wg = 1.0, bg = 0.0`.\n'
            + '- **The sentinel (discriminator)** is the two-layer judge from the Last '
            + 'Alliance: 8 tanh judges reading one value, then a sigmoid verdict — '
            + '`p = sigmoid(tanh(np.outer(x, W1) + b1) @ w2 + b2)` — the probability that x '
            + 'is true coin.\n\n'
            + 'Below, the two meet untrained. The sentinel\'s verdicts are near-random noise — '
            + 'it even favors some forgeries over truth. Every skill in this duel will be '
            + 'learned from zero, in public, by arithmetic.',
          code: py`import numpy as np

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))

rngw = np.random.default_rng(2)
W1 = rngw.normal(0.0, 0.5, 8)      # the sentinel's 8 judges
b1 = np.zeros(8)
w2 = rngw.normal(0.0, 0.5, 8)
b2 = 0.0

def sentinel(x):
    h = np.tanh(np.outer(x, W1) + b1)
    return sigmoid(h @ w2 + b2)

real = np.random.default_rng(0).normal(3.0, 0.5, 5)    # true coin
wg, bg = 1.0, 0.0                                      # the forger's first hand
fake = wg * np.random.default_rng(1).normal(0.0, 1.0, 5) + bg

print(real.round(2))              # [3.06 2.93 3.32 3.05 2.73]
print(fake.round(2))              # [ 0.35  0.82  0.33 -1.3   0.91]
print(sentinel(real).round(2))    # [0.36 0.36 0.36 0.36 0.37]
print(sentinel(fake).round(2))    # [0.48 0.45 0.48 0.58 0.44] -- worthless, so far`,
        },
        {
          heading: 'The alternating rite',
          body: 'Each round of the duel is two half-steps, and both are gradients you already '
            + 'own:\n\n'
            + '- **Sentinel\'s half**: draw a batch of true coin (label 1) and a batch of '
            + 'forgeries (label 0), concatenate, and take one cross-entropy step — the error '
            + 'signal at the verdict is `(p - y)`, exactly as in the Last Alliance, then '
            + 'backprop through tanh as always.\n'
            + '- **Forger\'s half**: mint fresh forgeries, ask the sentinel, and descend the '
            + 'loss of *failing to be believed*: the error at the verdict is `(p - 1)` — the '
            + 'forger pretends its coin deserves label 1 and lets the blame flow all the way '
            + 'BACK THROUGH THE SENTINEL\'S BODY into `wg` and `bg` (the chain continues '
            + '`dh @ W1`, the derivative of the verdict with respect to the coin itself). The '
            + 'sentinel\'s weights are left untouched in this half — it is a lens for blame, '
            + 'not a student.\n\n'
            + 'Two thousand rounds take a breath and a half. Watch `drift` — the distance '
            + 'between the forger\'s center and the true 3.0 — collapse from 2.97 toward '
            + 'nothing, and the minted coin\'s spread settle at the true 0.5. The sentinel\'s '
            + 'verdict on the finished forgeries: 0.5 — a coin flip. **Fooled is the fixed '
            + 'point.**',
          code: py`import numpy as np

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))

rng_real = np.random.default_rng(0)      # the mint of true coin
rng_noise = np.random.default_rng(1)     # the forger's well of noise
rngw = np.random.default_rng(2)
W1 = rngw.normal(0.0, 0.5, 8)
b1 = np.zeros(8)
w2 = rngw.normal(0.0, 0.5, 8)
b2 = 0.0
wg, bg = 1.0, 0.0
B = 64
drift = []

for step in range(2000):
    # -- sentinel's half: one cross-entropy step on labeled coin --
    real = rng_real.normal(3.0, 0.5, B)
    z = rng_noise.normal(0.0, 1.0, B)
    fake = wg * z + bg
    xb = np.concatenate([real, fake])
    yb = np.concatenate([np.ones(B), np.zeros(B)])
    h = np.tanh(np.outer(xb, W1) + b1)
    p = sigmoid(h @ w2 + b2)
    dlogit = (p - yb) / (2 * B)
    grad_w2 = h.T @ dlogit
    grad_b2 = dlogit.sum()
    dh = np.outer(dlogit, w2) * (1 - h ** 2)
    grad_W1 = dh.T @ xb
    grad_b1 = dh.sum(axis=0)
    W1 -= 0.5 * grad_W1
    b1 -= 0.5 * grad_b1
    w2 -= 0.5 * grad_w2
    b2 -= 0.5 * grad_b2

    # -- forger's half: blame flows THROUGH the sentinel into wg, bg --
    z = rng_noise.normal(0.0, 1.0, B)
    g = wg * z + bg
    h = np.tanh(np.outer(g, W1) + b1)
    p = sigmoid(h @ w2 + b2)
    dlogit = (p - 1.0) / B
    dh = np.outer(dlogit, w2) * (1 - h ** 2)
    dgin = dh @ W1                      # d(verdict-loss) / d(coin)
    wg -= 0.2 * np.sum(dgin * z)
    bg -= 0.2 * np.sum(dgin)
    if step % 100 == 0:
        drift.append(abs(bg - 3.0))

zt = np.random.default_rng(9).normal(0.0, 1.0, 2000)
forgeries = wg * zt + bg
print(round(float(forgeries.mean()), 2), round(float(forgeries.std()), 2))  # 2.99 0.5
print(round(drift[0], 2), round(drift[-1], 3))                              # 2.97 0.008
h = np.tanh(np.outer(forgeries, W1) + b1)
print(round(float(sigmoid(h @ w2 + b2).mean()), 2))    # 0.5 -- a coin flip`,
          note: 'Neither seed 3.0 nor 0.5 appears anywhere in the forger\'s training. It '
            + 'learned the mint\'s secrets entirely from the sentinel\'s suspicion — which is '
            + 'the exact reason this craft frightens the wardens: the forger needs no access '
            + 'to the mint. Only to a judge who has seen its coin.',
        },
        {
          heading: 'The forger\'s diseases',
          body: 'Now the honesty, because this duel is famously treacherous to train:\n\n'
            + '- **Mode collapse.** If true coin came in three denominations, the forger\'s '
            + 'laziest winning move is to mint ONE of them perfectly, forever. The sentinel '
            + 'eventually notices the missing variety and the duel lurches — but many GANs die '
            + 'minting one excellent coin. Our target has one mode, so our duel is safe from '
            + 'this by *construction*, not by skill. Know the difference.\n'
            + '- **Instability.** The forger descends a landscape that MOVES — every '
            + 'sentinel update redraws the loss under the forger\'s feet. Nothing guarantees '
            + 'the spiral settles; duels oscillate, diverge, or chase each other in circles. '
            + 'Ours settles because the nets are tiny, the rates are gentle, and the seeds are '
            + 'fixed.\n\n'
            + 'Both diseases teach the same testing doctrine, which the challenge enforces: '
            + 'judge a trained forger by its **distribution** — moments within tolerances, '
            + 'drift trending down — never by exact output values, which no honest adversarial '
            + 'run reproduces twice.\n\n'
            + 'And the bridge: aim this same duel at 64-pixel coins with the vault\'s decoder '
            + 'as forger and a conv-pyramid as sentinel, and you have an image GAN — the '
            + 'engines behind the first great waves of synthetic faces. Their heirs, the '
            + '**diffusion models**, retire the duel: they learn to reverse a gradual '
            + 'drowning-in-noise, step by step — steadier to train, no sentinel required, same '
            + 'forgery at the end. The Codex teaches the duel first because the duel is the '
            + 'idea laid bare: *generation is learning to pass a test you cannot read.*',
        },
      ],
      challenge: {
        title: 'Chain the Duelists',
        prompt: 'The mint and the noise-well are conjured. Chain the two minds and run the duel '
          + 'exactly as taught — then judge the forger the only honest way: by its '
          + 'distribution.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Define `sigmoid(z)` returning `1.0 / (1.0 + np.exp(-z))`.\n'
          + '- Sentinel weights, seeded and in this order: `rngw = np.random.default_rng(2)`, '
          + 'then `W1 = rngw.normal(0.0, 0.5, 8)`, `b1 = np.zeros(8)`, '
          + '`w2 = rngw.normal(0.0, 0.5, 8)`, `b2 = 0.0`.\n'
          + '- The forger: `wg = 1.0`, `bg = 0.0`. And `drift = []`.\n'
          + '- Run 2000 duel rounds exactly as taught. Sentinel\'s half: '
          + '`real = rng_real.normal(3.0, 0.5, B)`, `z = rng_noise.normal(0.0, 1.0, B)`, '
          + '`fake = wg * z + bg`, concatenate `xb` (real then fake) and labels `yb` (ones '
          + 'then zeros), forward `h = np.tanh(np.outer(xb, W1) + b1)`, '
          + '`p = sigmoid(h @ w2 + b2)`, then `dlogit = (p - yb) / (2 * B)`, '
          + '`grad_w2 = h.T @ dlogit`, `grad_b2 = dlogit.sum()`, '
          + '`dh = np.outer(dlogit, w2) * (1 - h ** 2)`, `grad_W1 = dh.T @ xb`, '
          + '`grad_b1 = dh.sum(axis=0)`, and the four updates at rate 0.5.\n'
          + '- Forger\'s half: fresh `z = rng_noise.normal(0.0, 1.0, B)`, `g = wg * z + bg`, '
          + 'forward through the sentinel, `dlogit = (p - 1.0) / B`, '
          + '`dh = np.outer(dlogit, w2) * (1 - h ** 2)`, `dgin = dh @ W1`, then '
          + '`wg -= 0.2 * np.sum(dgin * z)` and `bg -= 0.2 * np.sum(dgin)`.\n'
          + '- Every 100th round (`if step % 100 == 0:`) append `abs(bg - 3.0)` to `drift`.\n'
          + '- After the duel: `zt = np.random.default_rng(9).normal(0.0, 1.0, 2000)` and '
          + '`forgeries = wg * zt + bg`.\n'
          + '- Plot the forger\'s progress: `plt.plot(drift)` with a `plt.title(...)`.\n'
          + '- Print `round(float(forgeries.mean()), 2)`, then '
          + '`round(float(forgeries.std()), 2)`, each on its own line.',
        starter: py`import numpy as np
import matplotlib.pyplot as plt

# The mint and the noise-well. Do not alter the conjuring.
rng_real = np.random.default_rng(0)      # true coin: mean 3.0, spread 0.5
rng_noise = np.random.default_rng(1)     # the forger's raw noise
B = 64

# TODO: define sigmoid(z)

# TODO: sentinel weights — rngw = np.random.default_rng(2); W1 (8,), b1 zeros,
#       w2 (8,), b2 = 0.0

# TODO: the forger — wg = 1.0, bg = 0.0 — and drift = []

# TODO: 2000 duel rounds — sentinel's half (labeled batch, cross-entropy step
#       at rate 0.5), forger's half (fresh noise, blame through the sentinel,
#       rate 0.2), drift every 100th round

# TODO: zt from default_rng(9), and forgeries = wg * zt + bg

# TODO: plot drift, title the figure

# TODO: print round(float(forgeries.mean()), 2),
#       then round(float(forgeries.std()), 2)
`,
        solution: py`import numpy as np
import matplotlib.pyplot as plt

rng_real = np.random.default_rng(0)
rng_noise = np.random.default_rng(1)
B = 64

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))

rngw = np.random.default_rng(2)
W1 = rngw.normal(0.0, 0.5, 8)
b1 = np.zeros(8)
w2 = rngw.normal(0.0, 0.5, 8)
b2 = 0.0
wg, bg = 1.0, 0.0
drift = []

for step in range(2000):
    real = rng_real.normal(3.0, 0.5, B)
    z = rng_noise.normal(0.0, 1.0, B)
    fake = wg * z + bg
    xb = np.concatenate([real, fake])
    yb = np.concatenate([np.ones(B), np.zeros(B)])
    h = np.tanh(np.outer(xb, W1) + b1)
    p = sigmoid(h @ w2 + b2)
    dlogit = (p - yb) / (2 * B)
    grad_w2 = h.T @ dlogit
    grad_b2 = dlogit.sum()
    dh = np.outer(dlogit, w2) * (1 - h ** 2)
    grad_W1 = dh.T @ xb
    grad_b1 = dh.sum(axis=0)
    W1 -= 0.5 * grad_W1
    b1 -= 0.5 * grad_b1
    w2 -= 0.5 * grad_w2
    b2 -= 0.5 * grad_b2

    z = rng_noise.normal(0.0, 1.0, B)
    g = wg * z + bg
    h = np.tanh(np.outer(g, W1) + b1)
    p = sigmoid(h @ w2 + b2)
    dlogit = (p - 1.0) / B
    dh = np.outer(dlogit, w2) * (1 - h ** 2)
    dgin = dh @ W1
    wg -= 0.2 * np.sum(dgin * z)
    bg -= 0.2 * np.sum(dgin)
    if step % 100 == 0:
        drift.append(abs(bg - 3.0))

zt = np.random.default_rng(9).normal(0.0, 1.0, 2000)
forgeries = wg * zt + bg

plt.plot(drift)
plt.title("The forger closes on the mint")

print(round(float(forgeries.mean()), 2))
print(round(float(forgeries.std()), 2))`,
        hints: [
          'Set the stage exactly: sigmoid, then rngw = np.random.default_rng(2) drawing W1 (8,) before w2 (8,), biases zero, wg = 1.0, bg = 0.0, drift = []. The draw ORDER matters — same stream, same duel.',
          'Sentinel\'s half is a8l4\'s cross-entropy step on a doubled batch: xb = np.concatenate([real, fake]), yb ones-then-zeros, dlogit = (p - yb) / (2 * B), the four gradients, updates at 0.5. Draw real from rng_real and z from rng_noise, in that order, inside the loop.',
          'Forger\'s half: fresh z, g = wg * z + bg, forward, dlogit = (p - 1.0) / B, dh as usual, dgin = dh @ W1, then wg -= 0.2 * np.sum(dgin * z) and bg -= 0.2 * np.sum(dgin). Record drift when step % 100 == 0. Final prints should read 2.99 and 0.5.',
        ],
        validation: py`import numpy as np
import matplotlib.pyplot as plt
assert abs(float(sigmoid(0.0)) - 0.5) < 1e-9, "sigmoid(0) must be 0.5 — check 1.0 / (1.0 + np.exp(-z))."
assert W1.shape == (8,) and w2.shape == (8,) and b1.shape == (8,), "The sentinel must hold 8 judges — W1, b1, w2 all shape (8,)."
assert np.ndim(b2) == 0 and np.ndim(wg) == 0 and np.ndim(bg) == 0, "b2, wg, bg must all be scalars."
assert len(drift) == 20, "drift must hold 20 entries — one every 100th of the 2000 rounds (if step % 100 == 0)."
assert drift[0] > 2.0, "The first drift entry should sit near 2.97 — the forger starts centered at 0, far from the mint's 3.0. If it is already small, drift was recorded after training."
assert drift[-1] < 0.5, "After 2000 rounds the forger's center must sit within 0.5 of the mint (it lands within about 0.01). The duel never converged — recheck both halves and the learning rates 0.5 and 0.2."
assert forgeries.shape == (2000,), "forgeries must be 2000 fresh mintings — wg * zt + bg with zt from default_rng(9)."
assert abs(float(forgeries.mean()) - 3.0) < 0.4, "The forged coin's center must land within 0.4 of the true 3.0 (it lands within about 0.01) — the forger never learned the mint's center."
assert 0.25 < float(forgeries.std()) < 0.75, "The forged coin's spread must land near the true 0.5 (between 0.25 and 0.75; it lands at about 0.50). A collapsed spread means the forger froze; an oversized one means the duel diverged."
_hf = np.tanh(np.outer(forgeries, W1) + b1)
_pf = sigmoid(_hf @ w2 + b2)
assert 0.3 < float(_pf.mean()) < 0.7, "The trained sentinel must be reduced to a coin flip on the forgeries — mean verdict near 0.5. If it still spots them, the forger's half is not flowing blame through dgin = dh @ W1."
assert 0.2 < abs(float(wg)) < 0.8, "The forger's scale wg must settle near the mint's 0.5 spread (either sign) — it ends near 0.5."
_ax = plt.gcf().axes
assert len(_ax) >= 1 and len(_ax[0].lines) >= 1, "The Forge sees no plot — chart the duel with plt.plot(drift)."
assert len(_ax[0].lines[0].get_ydata()) == 20, "The plotted line must trace all 20 drift recordings."
assert _ax[0].get_title().strip() != "", "The figure has no title — name the duel with plt.title(...)."
assert "2.99" in _stdout, "Print round(float(forgeries.mean()), 2) — it reads 2.99."
assert "0.5" in _stdout, "Print round(float(forgeries.std()), 2) — it reads 0.5."`,
        successText: 'Round by round the sentinel sharpens, and round by round its own suspicion is smelted into the forger\'s hand — until the judge it trained cannot tell its coin from the king\'s.',
        xp: 115,
      },
      quiz: [
        {
          q: 'In the GAN duel, what is the generator actually trained to do?',
          options: [
            'To copy training samples with small random changes',
            'To minimize the mean squared error against the real data',
            'To transform noise into outputs the discriminator scores as real — descending a loss that flows backward through the discriminator\'s own body',
            'To classify real versus fake samples',
          ],
          answer: 2,
          explain: 'The generator never sees real data. Its gradient arrives through the '
            + 'discriminator: pretend the label is 1, let (p - 1) flow back through the judge '
            + 'into the forger\'s parameters. The discriminator is the classifier; the '
            + 'generator is the student of its verdicts.',
        },
        {
          q: 'What is mode collapse?',
          options: [
            'The discriminator\'s weights shrinking to zero',
            'The learning rate decaying too fast',
            'The generator\'s outputs growing without bound',
            'The generator minting only one (or a few) of the target\'s many varieties — a single excellent forgery repeated, because one perfect coin is the laziest way to pass',
          ],
          answer: 3,
          explain: 'Fooling the current sentinel does not require covering the whole '
            + 'distribution — one flawless output can suffice for many rounds. Diversity dies '
            + 'first in a GAN; that is why judging a forger means checking the distribution\'s '
            + 'spread and coverage, not admiring single samples.',
        },
        {
          q: 'Why does the Codex assert a trained GAN\'s moments within wide tolerances instead of exact output values?',
          options: [
            'Because adversarial training is a moving-target descent — runs settle into slightly different equilibria, so only distribution-level properties (mean near target, spread near target, drift trending down) are honest checks',
            'Because floating point cannot represent exact Gaussians',
            'Because the discriminator hides the true values',
            'Because moments are faster to compute than samples',
          ],
          answer: 0,
          explain: 'Each net reshapes the other\'s loss surface every round; exact endpoints are '
            + 'an accident of seeds and rates even when the distribution is learned well. '
            + 'Behavioral tolerance bands are not laxity — they are the correct contract for '
            + 'an unstable craft.',
        },
      ],
    },
    // ------------------------------------------------------------------
    // a10l7 — The Price of Forgery
    // ------------------------------------------------------------------
    {
      id: 'a10l7',
      title: 'The Price of Forgery',
      concept: 'the ethics and defense of generative craft: deepfake harms, provenance and watermarking, and a runnable statistical counterfeit-detector built from train-set fingerprints',
      xp: 40,
      narrative: 'The Forge is yours now. Before the Codex lets you keep it, it shows you the '
        + 'bill. In the archive of the war there is a room the wardens do not show visitors: '
        + 'confessions no one made, recorded in voices taken from the dead; seals of safe '
        + 'passage that led columns of refugees to nothing; a queen\'s face, worn by something '
        + 'else, addressing her own army. Every artifact in that room was minted by the craft '
        + 'you learned last night. The Codex does not moralize — it prices. And then, because '
        + 'the ledger has two columns, it teaches the counter-craft: the fingerprints a naive '
        + 'forger cannot fake, and the marks an honest mint can leave on purpose. The '
        + 'counterfeit-detector\'s trade, echoing the byte-fingerprint doctrine of the old '
        + 'hunts. Two edges, one blade. You will carry both.',
      sections: [
        {
          heading: 'The bill for the Forge',
          body: 'Name the harms plainly, because vagueness is how bills go unpaid:\n\n'
            + '- **The person imitated.** A forged face or voice spends someone else\'s trust — '
            + 'reputation, savings, safety. The victim of a deepfake pays for a crime they '
            + 'never committed, with evidence that never existed.\n'
            + '- **The person deceived.** Scams wearing a family member\'s voice; markets moved '
            + 'by synthetic announcements; voters shown events that never occurred. The deceived '
            + 'pay in money, panic, and choices made on poisoned ground.\n'
            + '- **Everyone else — the deepest cost.** When anything can be forged, everything '
            + 'can be *denied*. The guilty learn to answer true evidence with "fabricated," and '
            + 'the honest cannot prove otherwise. The wardens call this the **liar\'s '
            + 'dividend**: the counterfeit\'s final victim is the credibility of true coin.\n\n'
            + 'Mark that the third harm arrives even if you never mint a single malicious '
            + 'forgery — it is priced on the *existence* of the craft. That is why the '
            + 'counter-craft below is not optional armor. Detection, provenance, and honest '
            + 'marking are what keep a world with forges in it able to believe anything at '
            + 'all.',
        },
        {
          heading: 'Provenance, and the maker\'s mark',
          body: 'Two defenses work *forward*, at minting time, and you should know both by '
            + 'name:\n\n'
            + '- **Provenance** — a chain of custody for images: the capturing glass signs '
            + 'what it saw, every edit adds a signed entry, and the viewer checks the chain\'s '
            + 'seals. (The moderns build this as signed content credentials.) Provenance does '
            + 'not say *this is true* — it says *this is what touched it*, which is usually '
            + 'enough.\n'
            + '- **Watermarking** — an honest mint stamps its forgeries as forgeries: a faint '
            + 'statistical pattern woven into the output, invisible to the eye, loud to a '
            + 'detector who knows the key.\n\n'
            + 'The demonstration stamps a seal with a checkerboard mark thirty times fainter '
            + 'than the image itself. No eye catches it; the keyed statistic — correlate the '
            + 'image with the mark and average — moves from 0.0 to 0.03, exactly the stamp\'s '
            + 'strength. And the honesty: a *single* thin statistic like ours is feeble armor '
            + '— re-noising, cropping, or re-encoding can scrub it, so real watermarks spread '
            + 'the mark across thousands of dimensions and accept an arms race with '
            + 'scrubbers. Watermarks mark the *cooperative* forger. The uncooperative one is '
            + 'the next section\'s problem.',
          code: py`import numpy as np

yy, xx = np.mgrid[0:8, 0:8]
r = np.sqrt((yy - 3.5) ** 2 + (xx - 3.5) ** 2)
seal = np.where((r > 1.5) & (r < 3.5), 0.8, 0.2)   # a genuine seal

mark = ((yy + xx) % 2 * 2 - 1).astype(float)       # +1/-1 checkerboard, the key
stamped = seal + 0.03 * mark                       # the maker's mark, faint

print(round(float(np.abs(stamped - seal).max()), 3))   # 0.03 -- below any eye
print(round(float(np.mean(seal * mark)), 4))           # 0.0  -- unstamped: silent
print(round(float(np.mean(stamped * mark)), 4))        # 0.03 -- keyed: it sings`,
          note: 'The mark\'s whole trick is orthogonality: an ordinary image has no business '
            + 'correlating with a secret checkerboard, so any correlation that appears was put '
            + 'there. The old wards used the same reasoning on bytes; light is just another '
            + 'byte-stream wearing a face.',
        },
        {
          heading: 'Fingerprints the forger forgets',
          body: 'Now the uncooperative forger — no watermark, no provenance, actively trying to '
            + 'pass. You hunt it the way the old byte-doctrine hunted tampered scrolls: **find '
            + 'a statistic the genuine population cannot help having, and the forger did not '
            + 'think to fake.**\n\n'
            + 'The naive forger below is no strawman — it is what "matching the data" means '
            + 'to a first attempt: copy every pixel\'s mean and spread from the true archive, '
            + '*exactly*. First-order statistics: flawless. But real sigils are woven — when a '
            + 'ring-thread pulls bright, ALL its pixels rise together. Neighboring pixels '
            + '**move together** across the archive. The forger mints each pixel alone, so '
            + 'its pixels move alone.\n\n'
            + '- The fingerprint: subtract the archive\'s average sigil (each pixel\'s mean), '
            + 'then correlate each pixel with its right-hand neighbor, pooled over the whole '
            + 'set: `np.corrcoef` of the two shifted views.\n'
            + '- Genuine archive: about **0.76** — the loom\'s threads bind neighbors.\n'
            + '- Moment-matched forgeries: about **0.01** — perfect means, no weave.\n\n'
            + 'One statistic, and the counterfeit that matched every per-pixel number is '
            + 'naked. This is the true shape of the detection war: each generation of forgers '
            + 'learns yesterday\'s fingerprint (GANs DO learn correlations — and leave subtler '
            + 'spectral residues instead), and the detectors move to the next statistic the '
            + 'forge still forgets. No fingerprint is final. The doctrine is the weapon, not '
            + 'any one statistic.',
          code: py`import numpy as np

yy, xx = np.mgrid[0:8, 0:8]
r = np.sqrt((yy - 3.5) ** 2 + (xx - 3.5) ** 2)
ring = ((r > 1.5) & (r < 3.5)).astype(float)
cross = ((np.abs(yy - xx) <= 1) | (np.abs(yy + xx - 7) <= 1)).astype(float)
weave = np.vstack([ring.ravel(), cross.ravel()])
rng = np.random.default_rng(0)
X = rng.normal(0.0, 1.0, (120, 2)) @ weave + rng.normal(0.0, 0.05, (120, 64))

# the naive forger: copy every pixel's mean and spread EXACTLY
zn = np.random.default_rng(3).normal(0.0, 1.0, (120, 64))
zn = (zn - zn.mean(axis=0)) / zn.std(axis=0)
fakes = X.mean(axis=0) + X.std(axis=0) * zn
print(round(float(np.abs(X.mean(axis=0) - fakes.mean(axis=0)).max()), 12))  # 0.0

def neighbor_corr(S):
    C = S - S.mean(axis=0)          # subtract the average sigil
    imgs = C.reshape(-1, 8, 8)
    a = imgs[:, :, :-1].ravel()     # every pixel...
    b = imgs[:, :, 1:].ravel()      # ...and its right-hand neighbor
    return float(np.corrcoef(a, b)[0, 1])

print(round(neighbor_corr(X), 3))       # 0.762 -- the weave binds neighbors
print(round(neighbor_corr(fakes), 3))   # 0.01  -- perfect moments, no weave`,
        },
      ],
      challenge: {
        title: 'The Sentinel\'s Ledger',
        prompt: 'The archive delivers 120 genuine sigils and 120 sheets from a naive forger '
          + 'who copied every pixel\'s mean and spread exactly. Build the fingerprint, take '
          + 'both readings, and enter the verdicts in the ledger.\n\n'
          + 'Requirements, exactly:\n\n'
          + '- Define `neighbor_corr(S)` — center the set by its per-pixel means '
          + '(`C = S - S.mean(axis=0)`), reshape to `(-1, 8, 8)`, then return '
          + '`float(np.corrcoef(a, b)[0, 1])` where `a` is every pixel but the last column '
          + '(`imgs[:, :, :-1].ravel()`) and `b` is every pixel but the first '
          + '(`imgs[:, :, 1:].ravel()`).\n'
          + '- Take the readings: `real_fp = neighbor_corr(X)` and '
          + '`fake_fp = neighbor_corr(fakes)`.\n'
          + '- Confirm the forger\'s first-order perfection: `moment_gap = '
          + 'float(np.abs(X.mean(axis=0) - fakes.mean(axis=0)).max())`.\n'
          + '- The verdicts, at threshold 0.4: `genuine = bool(real_fp > 0.4)` and '
          + '`caught = bool(fake_fp < 0.4)`.\n'
          + '- Chart the ledger: `plt.bar(["genuine", "forged"], [real_fp, fake_fp])` with a '
          + '`plt.title(...)`.\n'
          + '- Print exactly three lines: `print(f"moment gap below 1e-9: {moment_gap < 1e-9}")`, '
          + 'then `print(f"genuine passes: {genuine}")`, then '
          + '`print(f"forgery caught: {caught}")`.',
        starter: py`import numpy as np
import matplotlib.pyplot as plt

# The archive and the forger's sheets. Do not alter the conjuring.
yy, xx = np.mgrid[0:8, 0:8]
r = np.sqrt((yy - 3.5) ** 2 + (xx - 3.5) ** 2)
ring = ((r > 1.5) & (r < 3.5)).astype(float)
cross = ((np.abs(yy - xx) <= 1) | (np.abs(yy + xx - 7) <= 1)).astype(float)
weave = np.vstack([ring.ravel(), cross.ravel()])
rng = np.random.default_rng(0)
X = rng.normal(0.0, 1.0, (120, 2)) @ weave + rng.normal(0.0, 0.05, (120, 64))

zn = np.random.default_rng(3).normal(0.0, 1.0, (120, 64))
zn = (zn - zn.mean(axis=0)) / zn.std(axis=0)
fakes = X.mean(axis=0) + X.std(axis=0) * zn      # moment-matched forgeries

# TODO: define neighbor_corr(S) — center by per-pixel means, reshape (-1, 8, 8),
#       correlate each pixel with its right-hand neighbor via np.corrcoef

# TODO: real_fp and fake_fp — the two readings

# TODO: moment_gap — the largest per-pixel mean difference between X and fakes

# TODO: genuine and caught — the two verdicts at threshold 0.4

# TODO: bar chart of [real_fp, fake_fp] labeled ["genuine", "forged"], titled

# TODO: the three prints, exactly as required
`,
        solution: py`import numpy as np
import matplotlib.pyplot as plt

yy, xx = np.mgrid[0:8, 0:8]
r = np.sqrt((yy - 3.5) ** 2 + (xx - 3.5) ** 2)
ring = ((r > 1.5) & (r < 3.5)).astype(float)
cross = ((np.abs(yy - xx) <= 1) | (np.abs(yy + xx - 7) <= 1)).astype(float)
weave = np.vstack([ring.ravel(), cross.ravel()])
rng = np.random.default_rng(0)
X = rng.normal(0.0, 1.0, (120, 2)) @ weave + rng.normal(0.0, 0.05, (120, 64))

zn = np.random.default_rng(3).normal(0.0, 1.0, (120, 64))
zn = (zn - zn.mean(axis=0)) / zn.std(axis=0)
fakes = X.mean(axis=0) + X.std(axis=0) * zn

def neighbor_corr(S):
    C = S - S.mean(axis=0)
    imgs = C.reshape(-1, 8, 8)
    a = imgs[:, :, :-1].ravel()
    b = imgs[:, :, 1:].ravel()
    return float(np.corrcoef(a, b)[0, 1])

real_fp = neighbor_corr(X)
fake_fp = neighbor_corr(fakes)
moment_gap = float(np.abs(X.mean(axis=0) - fakes.mean(axis=0)).max())

genuine = bool(real_fp > 0.4)
caught = bool(fake_fp < 0.4)

plt.bar(["genuine", "forged"], [real_fp, fake_fp])
plt.title("The sentinel's ledger: neighbor-correlation fingerprints")

print(f"moment gap below 1e-9: {moment_gap < 1e-9}")
print(f"genuine passes: {genuine}")
print(f"forgery caught: {caught}")`,
        hints: [
          'neighbor_corr: C = S - S.mean(axis=0), imgs = C.reshape(-1, 8, 8), a = imgs[:, :, :-1].ravel(), b = imgs[:, :, 1:].ravel(), return float(np.corrcoef(a, b)[0, 1]). Centering first matters — otherwise the shared average sigil fakes a correlation the forger would inherit.',
          'real_fp = neighbor_corr(X) should read about 0.76; fake_fp = neighbor_corr(fakes) about 0.01. moment_gap = float(np.abs(X.mean(axis=0) - fakes.mean(axis=0)).max()) — effectively zero, which is the whole point: perfect moments, still caught.',
          'genuine = bool(real_fp > 0.4), caught = bool(fake_fp < 0.4). Then plt.bar(["genuine", "forged"], [real_fp, fake_fp]), a title, and the three f-string prints — all three should end in True.',
        ],
        validation: py`import numpy as np
import matplotlib.pyplot as plt
_ramp = np.arange(10.0)[:, None] * np.ones((10, 64))
assert neighbor_corr(_ramp) > 0.95, "neighbor_corr must read near 1.0 on a set of flat images of differing brightness — every pixel moves with its neighbor. Check the centering, the (-1, 8, 8) reshape, and the two shifted views."
_ind = np.random.default_rng(5).normal(0.0, 1.0, (200, 64))
assert abs(neighbor_corr(_ind)) < 0.1, "neighbor_corr must read near 0.0 on independently minted pixels — if not, the views are misaligned or the set was not centered by S.mean(axis=0)."
assert isinstance(real_fp, float) and isinstance(fake_fp, float), "real_fp and fake_fp must be plain floats — return float(np.corrcoef(a, b)[0, 1])."
assert real_fp > 0.55, "The genuine archive's fingerprint must read far above the threshold (about 0.76) — real_fp = neighbor_corr(X)."
assert fake_fp < 0.25, "The forger's fingerprint must read near zero (about 0.01) — fake_fp = neighbor_corr(fakes). If it is high, the centering step is missing and the average sigil is leaking correlation into the forgeries."
assert moment_gap < 1e-9, "moment_gap must be effectively zero — the naive forger copies per-pixel means EXACTLY. Compare X.mean(axis=0) against fakes.mean(axis=0)."
assert genuine is True, "genuine must be True — the archive's weave stands above 0.4. It must be a bool."
assert caught is True, "caught must be True — the forgery falls below 0.4. It must be a bool."
_ax = plt.gcf().axes
assert len(_ax) >= 1 and len(_ax[0].patches) == 2, "The ledger wants a two-bar chart — plt.bar with the genuine and forged fingerprints."
_hs = sorted(float(_p.get_height()) for _p in _ax[0].patches)
assert abs(_hs[1] - real_fp) < 1e-6 and abs(_hs[0] - fake_fp) < 1e-6, "The bars must stand at the two fingerprint readings — [real_fp, fake_fp]."
assert _ax[0].get_title().strip() != "", "The figure has no title — name the ledger with plt.title(...)."
assert "moment gap below 1e-9: True" in _stdout, "First print: f-string reporting moment_gap < 1e-9 — it reads True."
assert "genuine passes: True" in _stdout, "Second print: f-string reporting the genuine verdict — True."
assert "forgery caught: True" in _stdout, "Third print: f-string reporting the forgery verdict — True."`,
        successText: 'Perfect means, perfect spreads — and the weave still missing, plain as a severed thread under your one good statistic. The ledger closes on the forger, this time.',
        xp: 115,
      },
      quiz: [
        {
          q: 'The naive forger matched every pixel\'s mean and standard deviation exactly. Why was it still caught?',
          options: [
            'Because its images were too bright overall',
            'Because it minted each pixel independently — genuine sigils are woven, so neighboring pixels move together across the archive, a correlation structure first-order statistics never capture',
            'Because it reused the same random seed as the archive',
            'Because matched moments make images blurry',
          ],
          answer: 1,
          explain: 'Per-pixel moments describe each pixel alone. The loom binds pixels '
            + 'together — one thread pulls many pixels at once — and that shows up only in '
            + 'second-order statistics like neighbor correlation. The forger faked every '
            + 'number it thought to measure; the fingerprint measured what it forgot.',
        },
        {
          q: 'What is provenance, in the defense against synthetic media?',
          options: [
            'A neural network that classifies images as real or fake',
            'A law forbidding generative models',
            'A signed chain of custody — the capturing device signs the original and every edit adds a verifiable entry, so a viewer can check what touched the image',
            'A blur filter that destroys forged details',
          ],
          answer: 2,
          explain: 'Provenance does not judge content — it certifies history. A checkable '
            + 'chain of signatures from glass to screen tells you an image is what the camera '
            + 'saw (or exactly how it was altered), which sidesteps the arms race of guessing '
            + 'from pixels alone.',
        },
        {
          q: 'What is the liar\'s dividend?',
          options: [
            'The benefit the guilty collect once forgeries are common: true evidence can be dismissed as fake, because everyone knows fakes are possible',
            'The profit a forger earns per counterfeit',
            'The reward paid to whoever detects a deepfake',
            'The extra training data generative models produce',
          ],
          answer: 0,
          explain: 'The counterfeit\'s final victim is trust itself. Once "that could be a '
            + 'deepfake" is always plausible, denial becomes free — the harm lands even when '
            + 'nothing was forged, which is why detection and provenance protect true records, '
            + 'not just expose false ones.',
        },
      ],
    },
  ],
  boss: {
    id: 'act10-boss',
    title: 'The Perfect Counterfeit',
    narrative: 'On the last night, the Forge itself is brought before you — and with it, one '
      + 'page. The Eye\'s final apprentice swears the page is genuine archive stock; the '
      + 'wardens suspect it carries the Eye\'s brand and that the apprentice\'s "archive" is '
      + 'minted. Nobody can settle it by staring, which is the point of everything you have '
      + 'learned: staring is over. Raise the pyramid to find the brand and say whether it is '
      + 'truly there. Open the vault and mint from empty coordinates, so the court sees what '
      + 'a forgery is. Then take out the one statistic the naive forger always forgets, and '
      + 'read the apprentice\'s sheets against the true weave. Four crafts, one verdict, no '
      + 'mercy for a broken stage — each rite feeds the next.',
    defeatText: 'The counterfeit passes into the archive, and a year from now no warden will be sure which of their own memories were minted.',
    victoryText: 'Brand found, forgery minted in open court, counterfeit caught by its missing weave — the Forge is yours, and so is the blade\'s other edge.',
    xp: 500,
    flawlessBonus: 50,
    gauntlet: [
      {
        q: 'For a normalized grayscale image `img`, what does `img[::-1, :]` produce?',
        options: [
          'A left-right mirror of the image',
          'The transpose of the image',
          'A brightened copy of the image',
          'A top-bottom flip — the rows in reverse order',
        ],
        answer: 3,
        explain: 'The first axis of an image array is rows; reversing it with ::-1 turns the '
          + 'picture upside down. The left-right mirror reverses the second axis — '
          + 'img[:, ::-1] — and the transpose swaps the axes entirely.',
      },
      {
        q: 'Why does a convolutional eye beat a dense layer at finding a small mark that may appear anywhere on a page?',
        options: [
          'The kernel\'s few weights are shared across every position — the pattern is learned once and detected anywhere, while a dense layer must relearn it separately for each place it might appear',
          'Convolution processes the image in fewer arithmetic operations than any dense layer',
          'Dense layers cannot accept 2D input',
          'Convolution increases the image\'s resolution',
        ],
        answer: 0,
        explain: 'Position-independence is built into the sliding: nine shared weights ask '
          + 'the same question at every window. A dense layer ties each pixel to its own '
          + 'weights, so a mark at the corner and the same mark at the center are unrelated '
          + 'lessons it must learn twice.',
      },
      {
        q: 'What bargain does 2x2 max pooling strike between floors of the pyramid?',
        options: [
          'It doubles resolution in exchange for slower arithmetic',
          'It removes the need for activation functions',
          'It surrenders the exact position of each detection in exchange for a smaller map and tolerance to small shifts — "anywhere in this quarter" instead of "at this pixel"',
          'It averages away weak detections to denoise the map',
        ],
        answer: 2,
        explain: 'The clerk keeps each quarter\'s loudest report and burns the address. Space '
          + 'shrinks fourfold, jitter stops mattering, and the floors above reason about '
          + 'presence rather than pixels — the trade that lets meaning grow as resolution '
          + 'falls.',
      },
      {
        q: 'A template sweep over a page returns its best score, 0.42, at position (6, 13), with the presence threshold at 0.8. What is the verdict?',
        options: [
          'The mark is present at (6, 13), but faded',
          'The mark is absent — 0.42 is noise\'s best coincidence, and the argmax merely names where that coincidence happens to sit',
          'The sweep must be rerun with a smaller template until the score rises',
          'The mark is present somewhere other than (6, 13)',
        ],
        answer: 1,
        explain: 'Argmax always points somewhere — every map has a brightest cell. Presence is '
          + 'decided by the score at that cell, and 0.42 is what unmarked noise buys. A '
          + 'detector that lowers its threshold until it finds something has become a witness '
          + 'for whoever pays it.',
      },
      {
        q: 'The duel converges and the trained sentinel\'s mean verdict on fresh forgeries is 0.5. What does this signify?',
        options: [
          'Success — the equilibrium of the duel is a sentinel reduced to a coin flip, because the forger\'s distribution has become indistinguishable from the mint\'s',
          'Failure — the sentinel should score forgeries near 0.0',
          'The sentinel\'s weights were never updated',
          'The forger has mode-collapsed',
        ],
        answer: 0,
        explain: 'If the two distributions match, no judge can do better than chance — 0.5 IS '
          + 'the fixed point the forger was descending toward. A sentinel still scoring '
          + 'forgeries near 0 means the forger lost; near 1 means the sentinel broke. The '
          + 'coin flip is the victory condition.',
      },
      {
        q: 'A forger copies every pixel\'s mean and standard deviation from the genuine archive, exactly. Which detector still catches it, and why?',
        options: [
          'A brightness histogram, because the fakes are too dark',
          'A larger template sweep, because the fakes are shifted',
          'A second-order fingerprint like neighbor correlation — genuine images are woven, so their pixels move together, and the forger\'s independently minted pixels do not',
          'No detector — matched moments make forgeries undetectable',
        ],
        answer: 2,
        explain: 'First-order statistics see each pixel alone, and the forger faked all of '
          + 'those perfectly. Structure lives in relationships — correlations between '
          + 'neighbors, threads that move many pixels at once — and a forger who mints pixels '
          + 'independently cannot fake relationships it never measured.',
      },
    ],
    finalChallenge: {
      title: 'The Trial of the Page',
      prompt: 'The full rite, all four crafts in one working. The conjuring lays out the '
        + 'evidence: a 19x19 page suspected of carrying the Eye\'s 4x4 brand, the archive\'s '
        + '150 true sigils, and 150 sheets from the apprentice\'s "archive" — minted with '
        + 'perfectly copied per-pixel moments.\n\n'
        + 'Requirements, exactly:\n\n'
        + '- **I. The pyramid.** Define `conv2d(img, kernel)` (the double loop, valid '
        + 'positions) and `pool2(img)` (reshape to `(H // 2, 2, W // 2, 2)`, max over axes '
        + '`(1, 3)`). Hunt with the zero-mean brand: `kernel = brand - brand.mean()`, '
        + '`fmap = conv2d(page, kernel)`. Name the place: `mark_row, mark_col = '
        + 'np.unravel_index(np.argmax(fmap), fmap.shape)`. Pool the map: '
        + '`pooled = pool2(fmap)`, and judge presence: `present = bool(pooled.max() > 1.5)`.\n'
        + '- **II. The vault.** Weights seeded in this order: `rngw = np.random.default_rng(1)`, '
        + '`W1 = rngw.normal(0.0, 0.1, (64, 2))`, `b1 = np.zeros(2)`, '
        + '`W2 = rngw.normal(0.0, 0.1, (2, 64))`, `b2 = np.zeros(64)`, `history = []`. Train '
        + '1000 steps at lr 0.2 on `X`, exactly as in a10l5: `H = X @ W1 + b1`, '
        + '`R = H @ W2 + b2`, `E = R - X`, `dR = 2.0 * E / (n * d)`, `grad_W2 = H.T @ dR`, '
        + '`grad_b2 = dR.sum(axis=0)`, `dH = dR @ W2.T`, `grad_W1 = X.T @ dH`, '
        + '`grad_b1 = dH.sum(axis=0)`, four updates, then `history.append(np.mean(E ** 2))`.\n'
        + '- **III. The minting.** Define `encode(M)` returning `M @ W1 + b1` and `decode(Z)` '
        + 'returning `Z @ W2 + b2`, then mint the court\'s exhibit: '
        + '`forged = decode(np.array([[1.2, -0.8]])).reshape(8, 8)`.\n'
        + '- **IV. The fingerprint.** Define `neighbor_corr(S)` as in a10l7 (center by '
        + '`S.mean(axis=0)`, reshape `(-1, 8, 8)`, correlate `imgs[:, :, :-1].ravel()` '
        + 'against `imgs[:, :, 1:].ravel()` with `np.corrcoef`). Read '
        + '`real_fp = neighbor_corr(X)` and `naive_fp = neighbor_corr(naive)`, then rule: '
        + '`genuine_pass = bool(real_fp > 0.4)` and `forgery_caught = bool(naive_fp < 0.4)`.\n'
        + '- **The verdict.** Print exactly four lines: '
        + '`print(f"mark at ({mark_row}, {mark_col})")`, then `print(f"present: {present}")`, '
        + 'then `print(f"genuine passes: {genuine_pass}")`, then '
        + '`print(f"forgery caught: {forgery_caught}")`.',
      starter: py`import numpy as np

# The trial's evidence, conjured. Do not alter the conjuring.
rng = np.random.default_rng(0)

# I. The suspect page, and the Eye's brand.
page = rng.normal(0.3, 0.08, (19, 19))
brand = np.array([[0.0, 1.0, 1.0, 0.0],
                  [1.0, 0.0, 0.0, 1.0],
                  [1.0, 0.0, 0.0, 1.0],
                  [0.0, 1.0, 1.0, 0.0]])
page[11:15, 5:9] += 0.7 * brand          # pressed in, then fogged by the page

# II. The archive's loom, and the apprentice's sheets.
yy, xx = np.mgrid[0:8, 0:8]
r = np.sqrt((yy - 3.5) ** 2 + (xx - 3.5) ** 2)
ring = ((r > 1.5) & (r < 3.5)).astype(float)
cross = ((np.abs(yy - xx) <= 1) | (np.abs(yy + xx - 7) <= 1)).astype(float)
weave = np.vstack([ring.ravel(), cross.ravel()])
latents = rng.normal(0.0, 1.0, (150, 2))
X = latents @ weave + rng.normal(0.0, 0.05, (150, 64))   # true sigils
n, d = X.shape
zn = np.random.default_rng(3).normal(0.0, 1.0, (150, 64))
zn = (zn - zn.mean(axis=0)) / zn.std(axis=0)
naive = X.mean(axis=0) + X.std(axis=0) * zn              # the apprentice's sheets

# TODO I: conv2d, pool2, kernel (zero-mean brand), fmap, mark_row/mark_col,
#         pooled, present

# TODO II: seeded vault weights and history; 1000 training steps at lr 0.2

# TODO III: encode, decode, and forged — decode [[1.2, -0.8]], reshaped 8x8

# TODO IV: neighbor_corr, real_fp, naive_fp, genuine_pass, forgery_caught

# TODO: the four verdict prints, exactly as required
`,
      solution: py`import numpy as np

rng = np.random.default_rng(0)

page = rng.normal(0.3, 0.08, (19, 19))
brand = np.array([[0.0, 1.0, 1.0, 0.0],
                  [1.0, 0.0, 0.0, 1.0],
                  [1.0, 0.0, 0.0, 1.0],
                  [0.0, 1.0, 1.0, 0.0]])
page[11:15, 5:9] += 0.7 * brand

yy, xx = np.mgrid[0:8, 0:8]
r = np.sqrt((yy - 3.5) ** 2 + (xx - 3.5) ** 2)
ring = ((r > 1.5) & (r < 3.5)).astype(float)
cross = ((np.abs(yy - xx) <= 1) | (np.abs(yy + xx - 7) <= 1)).astype(float)
weave = np.vstack([ring.ravel(), cross.ravel()])
latents = rng.normal(0.0, 1.0, (150, 2))
X = latents @ weave + rng.normal(0.0, 0.05, (150, 64))
n, d = X.shape
zn = np.random.default_rng(3).normal(0.0, 1.0, (150, 64))
zn = (zn - zn.mean(axis=0)) / zn.std(axis=0)
naive = X.mean(axis=0) + X.std(axis=0) * zn

def conv2d(img, kernel):
    kh, kw = kernel.shape
    H, W = img.shape
    out = np.zeros((H - kh + 1, W - kw + 1))
    for i in range(H - kh + 1):
        for j in range(W - kw + 1):
            out[i, j] = np.sum(img[i:i + kh, j:j + kw] * kernel)
    return out

def pool2(img):
    H, W = img.shape
    return img.reshape(H // 2, 2, W // 2, 2).max(axis=(1, 3))

kernel = brand - brand.mean()
fmap = conv2d(page, kernel)
mark_row, mark_col = np.unravel_index(np.argmax(fmap), fmap.shape)
pooled = pool2(fmap)
present = bool(pooled.max() > 1.5)

rngw = np.random.default_rng(1)
W1 = rngw.normal(0.0, 0.1, (64, 2))
b1 = np.zeros(2)
W2 = rngw.normal(0.0, 0.1, (2, 64))
b2 = np.zeros(64)
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
    W1 -= 0.2 * grad_W1
    b1 -= 0.2 * grad_b1
    W2 -= 0.2 * grad_W2
    b2 -= 0.2 * grad_b2
    history.append(np.mean(E ** 2))

def encode(M):
    return M @ W1 + b1

def decode(Z):
    return Z @ W2 + b2

forged = decode(np.array([[1.2, -0.8]])).reshape(8, 8)

def neighbor_corr(S):
    C = S - S.mean(axis=0)
    imgs = C.reshape(-1, 8, 8)
    a = imgs[:, :, :-1].ravel()
    b = imgs[:, :, 1:].ravel()
    return float(np.corrcoef(a, b)[0, 1])

real_fp = neighbor_corr(X)
naive_fp = neighbor_corr(naive)
genuine_pass = bool(real_fp > 0.4)
forgery_caught = bool(naive_fp < 0.4)

print(f"mark at ({mark_row}, {mark_col})")
print(f"present: {present}")
print(f"genuine passes: {genuine_pass}")
print(f"forgery caught: {forgery_caught}")`,
      validation: py`import numpy as np
_img4 = np.arange(16, dtype=float).reshape(4, 4)
_shift = np.array([[0.0, 0.0, 0.0], [1.0, 0.0, 0.0], [0.0, 0.0, 0.0]])
assert np.allclose(conv2d(_img4, _shift), np.array([[4.0, 5.0], [8.0, 9.0]])), "conv2d slides the kernel UNFLIPPED over valid positions — with a lone 1 at the kernel's middle-left it must read [[4, 5], [8, 9]] on a 4x4 ramp."
assert np.allclose(pool2(np.array([[1.0, 5.0, 0.0, 2.0], [3.0, 2.0, 8.0, 1.0], [0.0, 1.0, 4.0, 4.0], [2.0, 0.0, 3.0, 9.0]])), np.array([[5.0, 8.0], [2.0, 9.0]])), "pool2 must keep each 2x2 quarter's maximum — [[5, 8], [2, 9]] on the 4x4 test."
_rng = np.random.default_rng(0)
_page = _rng.normal(0.3, 0.08, (19, 19))
_brand = np.array([[0.0, 1.0, 1.0, 0.0], [1.0, 0.0, 0.0, 1.0], [1.0, 0.0, 0.0, 1.0], [0.0, 1.0, 1.0, 0.0]])
_page[11:15, 5:9] += 0.7 * _brand
assert np.allclose(np.asarray(page, dtype=float), _page), "The conjuring was altered — the page must stand exactly as conjured (seed 0, drawn first)."
_k = _brand - _brand.mean()
assert np.allclose(np.asarray(kernel, dtype=float), _k), "kernel must be the ZERO-MEAN brand — brand - brand.mean() — so flat fog answers nothing."
_fm = np.zeros((16, 16))
for _i in range(16):
    for _j in range(16):
        _fm[_i, _j] = np.sum(_page[_i:_i + 4, _j:_j + 4] * _k)
assert fmap.shape == (16, 16) and np.allclose(fmap, _fm), "fmap disagrees with an honest sweep of the zero-mean brand over the page — recheck conv2d's window bounds."
assert (int(mark_row), int(mark_col)) == (11, 5), "mark_row, mark_col must name the brand's true corner — np.unravel_index(np.argmax(fmap), fmap.shape) gives (11, 5)."
assert pooled.shape == (8, 8), "pooled must be pool2(fmap) — the 16x16 map pooled to 8x8."
assert abs(float(pooled.max()) - float(fmap.max())) < 1e-12, "Pooling must preserve the loudest detection — pooled.max() equals fmap.max(), that is the clerk's whole oath."
assert present is True, "present must be True — the brand's response stands near 2.9, far above the 1.5 threshold (fog peaks near 0.5). It must be a bool."
assert len(history) == 1000, "history must record 1000 losses — one per training step."
assert history[0] > 0.5, "The first recorded loss should sit near 1.02 — if it is already small, the vault's weights were not freshly seeded from default_rng(1) in the given order."
assert history[-1] < 0.05, "The vault never converged — after 1000 steps at lr 0.2 the loss must fall below 0.05 (it reaches about 0.0024)."
assert history[-1] < history[0] / 3, "The loss barely fell — the vault is not learning; check the gradient lines and update signs."
assert np.allclose(decode(np.zeros((1, 2))), b2), "decode(Z) must be Z @ W2 + b2 — decoding the origin must return exactly b2."
assert abs(float(np.mean((X - decode(encode(X))) ** 2)) - history[-1]) < 1e-3, "decode(encode(X)) disagrees with the trained vault — encode and decode must use the trained weights."
assert forged.shape == (8, 8), "forged must be reshaped to 8x8 — the court must SEE the exhibit."
assert np.allclose(forged, (np.array([[1.2, -0.8]]) @ W2 + b2).reshape(8, 8)), "forged must be decode(np.array([[1.2, -0.8]])) reshaped — minted from those exact coordinates."
_ramp = np.arange(10.0)[:, None] * np.ones((10, 64))
assert neighbor_corr(_ramp) > 0.95, "neighbor_corr must read near 1.0 on flat images of differing brightness — check the centering and the two shifted views."
assert abs(neighbor_corr(np.random.default_rng(5).normal(0.0, 1.0, (200, 64)))) < 0.1, "neighbor_corr must read near 0.0 on independently minted pixels."
assert real_fp > 0.55, "The archive's fingerprint must read about 0.75 — real_fp = neighbor_corr(X)."
assert naive_fp < 0.25, "The apprentice's sheets must read near 0.01 — naive_fp = neighbor_corr(naive). If it is high, the per-pixel centering is missing."
assert genuine_pass is True and forgery_caught is True, "Both rulings must be True bools — the weave passes at threshold 0.4, the moment-matched sheets fail it."
assert "mark at (11, 5)" in _stdout, "First verdict line: mark at (11, 5)."
assert "present: True" in _stdout, "Second verdict line: present: True."
assert "genuine passes: True" in _stdout, "Third verdict line: genuine passes: True."
assert "forgery caught: True" in _stdout, "Fourth verdict line: forgery caught: True."`,
      successText: '',
      xp: 0,
    },
  },
  codex: [
    {
      term: 'pixel',
      def: 'One cell of an image array — a single measured brightness. Its row and column are its address; its value is its light. Every operation on images is an operation on these numbers, because there is nothing else there.',
    },
    {
      term: 'grayscale image & normalization',
      def: 'A 2D array of brightnesses, stored as integers 0 (black) to 255 (white) and worked on as floats 0.0 to 1.0 — divide by 255.0 to normalize, and seal any arithmetic with np.clip(img, 0.0, 1.0) so brightness and contrast changes stay displayable.',
    },
    {
      term: '2D convolution',
      def: 'Sliding a small weight grid across an image: at every valid position, multiply the window by the kernel elementwise and sum into one output cell — a double loop over (H-kh+1) x (W-kw+1) positions. Deep learning\'s "convolution" slides unflipped (strictly cross-correlation); the signal-theory rite flips first.',
    },
    {
      term: 'kernel',
      def: 'The small grid of weights a convolution carries — the pattern it hunts. Hand-ground examples: the Sobel pair (columns -1|0|+1 doubled in the middle row, and its transpose) for vertical and horizontal edges, and the box blur np.ones((3,3))/9 for local averaging. CNNs learn their kernels from data.',
    },
    {
      term: 'feature map',
      def: 'A convolution\'s output: the kernel\'s resemblance score at every position it visited. Edge kernels\' weights sum to zero, so flat regions score 0 regardless of brightness — the map lights up for structure, not light.',
    },
    {
      term: 'padding',
      def: 'A frame of zeros stitched around an image (np.pad(img, k // 2) for an odd k) so the kernel can center on border pixels and the output keeps the input\'s size — the "same" mode of the great engines; without it each 3x3 conv shrinks the map by two per side.',
    },
    {
      term: 'max pooling',
      def: 'Downsampling a feature map by keeping only the strongest response in each window — in numpy, img.reshape(H//2, 2, W//2, 2).max(axis=(1, 3)) for 2x2. Trades exact position for a smaller map and tolerance to small shifts; detections survive, addresses burn.',
    },
    {
      term: 'template matching',
      def: 'Detection by sliding a known patch over an image and scoring each window\'s resemblance — a normalized score makes a match read 1.0 regardless of brightness or contrast. The oldest detector: features, score, argmax, threshold.',
    },
    {
      term: 'normalized cross-correlation',
      def: 'The matching score that cannot be bribed by lighting: subtract each patch\'s mean, take the dot product, divide by the product of magnitudes (plus a tiny epsilon). +1 is the template itself, 0 is no resemblance, -1 is the template in negative.',
    },
    {
      term: 'localization',
      def: 'Naming WHERE, not just whether: np.argmax(m) finds the match map\'s best cell as a flattened index, and np.unravel_index(np.argmax(m), m.shape) converts it to (row, col). Presence is a separate verdict — a threshold on the score — because argmax always points somewhere.',
    },
    {
      term: 'latent space',
      def: 'The coordinate space of an autoencoder\'s bottleneck: encode presses each input to a point, decode raises any point — occupied or not — back to an output. Generation is decoding coordinates no real datum ever held.',
    },
    {
      term: 'latent interpolation',
      def: 'Encoding two real inputs, blending their codes (for example the midpoint), and decoding the blend — an output BETWEEN the two originals. In deep generative models this morphs faces through faces, which pixel averaging never could.',
    },
    {
      term: 'generator',
      def: 'The forger of a GAN: a network mapping raw noise to synthetic outputs, trained not on real data but on the discriminator\'s verdicts — the error (p - 1) flows backward through the discriminator\'s body into the generator\'s weights.',
    },
    {
      term: 'discriminator',
      def: 'The sentinel of a GAN: a classifier trained each round on real samples labeled 1 and the generator\'s current forgeries labeled 0. At the duel\'s fixed point it is reduced to a coin flip — mean verdict 0.5 — because the distributions have merged.',
    },
    {
      term: 'mode collapse',
      def: 'The GAN disease where the generator mints only one (or a few) of the target\'s varieties — a single excellent forgery repeated, since fooling the current discriminator does not require diversity. One reason trained forgers are judged by distribution moments and coverage, never by admiring samples.',
    },
    {
      term: 'watermarking & provenance',
      def: 'The forward defenses of an honest mint: watermarking weaves a faint keyed statistical pattern into generated output (invisible to the eye, loud to whoever holds the key); provenance signs a chain of custody from capture through every edit. Both mark the cooperative forger — statistical fingerprints hunt the uncooperative one.',
    },
  ],
};
