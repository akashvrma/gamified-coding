// ============================================================
// share.js — the Seal of the Fallen. A victory card minted
// entirely on a local canvas: the relic's silhouette, the act's
// numeral, the warden's name, the learner's rank, the kept
// nights. No network, no external fonts, nothing leaves the
// browser unless the learner sends it. The relic SVG travels
// through a same-origin blob URL, so the canvas is never
// tainted and toDataURL stays legal.
// ============================================================

const CARD_W = 1200;
const CARD_H = 630;
const SERIF = 'Georgia, "Times New Roman", serif';

// A tiny deterministic PRNG (mulberry32) for the card's night-air
// grain — the same seed mints the same seal, byte for byte of intent.
function mulberry(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Standalone SVG documents need their namespace declared and an
// explicit raster size — the in-page markup carries neither.
function standaloneSvg(markup, w, h) {
  let svg = String(markup || '').trim();
  if (!svg.startsWith('<svg')) return '';
  if (!svg.includes('xmlns=')) {
    svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  return svg.replace('<svg', `<svg width="${w}" height="${h}"`);
}

// SVG string → decoded Image via a same-origin blob URL. Resolves null
// on any failure — a seal that cannot show its relic still mints.
function svgImage(markup, w, h) {
  const svg = standaloneSvg(markup, w, h);
  if (!svg) return Promise.resolve(null);
  return new Promise((resolve) => {
    let url = '';
    try {
      url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    } catch {
      resolve(null);
      return;
    }
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
}

// Greedy word-wrap against the real measured width; at most maxLines,
// the last line ellipsized if the title outruns its plate.
function wrapText(ctx, text, maxWidth, maxLines) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const tryLine = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(tryLine).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = tryLine;
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    let last = lines[maxLines - 1];
    while (last && ctx.measureText(`${last}…`).width > maxWidth) {
      last = last.slice(0, -1).trimEnd();
    }
    lines[maxLines - 1] = `${last}…`;
  }
  return lines;
}

function drawLetterSpaced(ctx, text, cx, y, spacing) {
  const chars = [...String(text)];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((s, w) => s + w, 0) + spacing * (chars.length - 1);
  let x = cx - total / 2;
  const align = ctx.textAlign;
  ctx.textAlign = 'left';
  chars.forEach((c, i) => {
    ctx.fillText(c, x, y);
    x += widths[i] + spacing;
  });
  ctx.textAlign = align;
}

// Mint the card. All facts arrive as plain values — this module reads
// no state and fetches nothing. Returns { blob, dataUrl }.
export async function renderSealPng({
  numeral = '', bossTitle = '', rankTitle = '', keptNights = 0, relicMarkup = '',
} = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext('2d');

  // The night: a deep ground with a cold radial breath at the relic.
  ctx.fillStyle = '#07080f';
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  const glow = ctx.createRadialGradient(280, 315, 40, 280, 315, 420);
  glow.addColorStop(0, 'rgba(201, 138, 46, 0.20)');
  glow.addColorStop(0.55, 'rgba(201, 138, 46, 0.06)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Night-air grain, deterministic: the same card mints the same dust.
  const rand = mulberry(0x5EA1);
  for (let i = 0; i < 1400; i += 1) {
    const x = rand() * CARD_W;
    const y = rand() * CARD_H;
    const a = 0.015 + rand() * 0.05;
    ctx.fillStyle = `rgba(232, 223, 200, ${a.toFixed(3)})`;
    ctx.fillRect(x, y, rand() < 0.12 ? 2 : 1, 1);
  }

  // The frame: two rules and four corner strokes, nothing gilded.
  ctx.strokeStyle = '#232738';
  ctx.lineWidth = 2;
  ctx.strokeRect(18, 18, CARD_W - 36, CARD_H - 36);
  ctx.strokeStyle = '#2c2440';
  ctx.lineWidth = 1;
  ctx.strokeRect(30, 30, CARD_W - 60, CARD_H - 60);
  ctx.strokeStyle = '#c98a2e';
  ctx.lineWidth = 2;
  for (const [x, y, sx, sy] of [[38, 38, 1, 1], [CARD_W - 38, 38, -1, 1],
    [38, CARD_H - 38, 1, -1], [CARD_W - 38, CARD_H - 38, -1, -1]]) {
    ctx.beginPath();
    ctx.moveTo(x, y + 26 * sy);
    ctx.lineTo(x, y);
    ctx.lineTo(x + 26 * sx, y);
    ctx.stroke();
  }

  // The relic, risen out of the glow. A missing relic leaves the glow.
  const relic = await svgImage(relicMarkup, 360, 420);
  if (relic) {
    try {
      ctx.drawImage(relic, 100, 105, 360, 420);
    } catch { /* the card stands without its figure */ }
  }

  // The words. System serif only — no fetched faces.
  const textX = 540;
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';

  ctx.fillStyle = '#c98a2e';
  ctx.font = `600 30px ${SERIF}`;
  drawLetterSpacedLeft(ctx, `ACT ${String(numeral).toUpperCase()}`, textX, 176, 6);

  ctx.fillStyle = '#e8dfc8';
  ctx.font = `56px ${SERIF}`;
  const titleLines = wrapText(ctx, bossTitle, CARD_W - textX - 80, 2);
  titleLines.forEach((line, i) => ctx.fillText(line, textX, 244 + i * 66));
  const afterTitle = 244 + (titleLines.length - 1) * 66;

  ctx.strokeStyle = '#3a3350';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(textX, afterTitle + 34);
  ctx.lineTo(CARD_W - 80, afterTitle + 34);
  ctx.stroke();

  ctx.fillStyle = '#8b8fa3';
  ctx.font = `26px ${SERIF}`;
  ctx.fillText('fell before', textX, afterTitle + 86);
  ctx.fillStyle = '#f0b45a';
  ctx.font = `italic 40px ${SERIF}`;
  ctx.fillText(String(rankTitle), textX, afterTitle + 138);

  const nights = Number(keptNights) || 0;
  if (nights > 0) {
    ctx.fillStyle = '#8b8fa3';
    ctx.font = `24px ${SERIF}`;
    ctx.fillText(`🕯 ${nights} night${nights === 1 ? '' : 's'} kept at the watch`, textX, afterTitle + 192);
  }

  ctx.fillStyle = '#c98a2e';
  ctx.font = `600 26px ${SERIF}`;
  drawLetterSpaced(ctx, 'THE DARK CODEX', CARD_W / 2, CARD_H - 58, 9);

  // Blob for sharing, data URL for downloading — both from a clean canvas.
  const dataUrl = canvas.toDataURL('image/png');
  const blob = await new Promise((resolve) => {
    try { canvas.toBlob(resolve, 'image/png'); } catch { resolve(null); }
  });
  return { blob, dataUrl };
}

function drawLetterSpacedLeft(ctx, text, x0, y, spacing) {
  let x = x0;
  for (const c of String(text)) {
    ctx.fillText(c, x, y);
    x += ctx.measureText(c).width + spacing;
  }
}

// Mint and hand over: the share sheet where the platform offers one,
// a plain download everywhere else. Returns 'shared' or 'downloaded';
// throws only when the canvas itself refuses to speak.
export async function mintSeal({ actId, ...facts }) {
  const { blob, dataUrl } = await renderSealPng(facts);
  if (!dataUrl || dataUrl === 'data:,') {
    throw new Error('The seal would not take.');
  }
  const filename = `seal-${actId}.png`;
  if (blob && navigator.share && navigator.canShare) {
    try {
      const file = new File([blob], filename, { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'The Dark Codex' });
        return 'shared';
      }
    } catch { /* declined or unsupported — the download stands ready */ }
  }
  const a = document.createElement('a');
  a.href = blob ? URL.createObjectURL(blob) : dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  if (blob) setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  return 'downloaded';
}
