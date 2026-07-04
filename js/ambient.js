// ============================================================
// ambient.js — the living dark. A full-screen canvas behind the
// content: drifting particles, a faint horizon, and silhouettes
// that cross the sky — broom-riders and dementors for the Path
// of the Wand, the marching company and winged shadows for the
// Path of the Ring, ravens over the map. All figures are original
// hand-drawn archetype silhouettes, backlit by a soft halo so
// they read against the near-black page.
// Adaptive, DPR-capped, paused when hidden, silent under
// prefers-reduced-motion.
// ============================================================

const THEMES = {
  ember: { hue: [22, 40], sat: 85, light: 58, vy: [-0.34, -0.1], vx: [-0.06, 0.06], r: [0.8, 2.4], glow: true, scene: 'ring' },
  spore: { hue: [110, 140], sat: 60, light: 55, vy: [-0.22, -0.06], vx: [-0.1, 0.1], r: [0.8, 2.2], glow: true, scene: 'wizard' },
  dust: { hue: [215, 235], sat: 25, light: 62, vy: [0.05, 0.22], vx: [-0.08, 0.08], r: [0.6, 1.7], glow: false, scene: 'ravens' },
  void: { hue: [260, 285], sat: 45, light: 60, vy: [-0.1, 0.1], vx: [-0.1, 0.1], r: [0.7, 2], glow: true, scene: 'wizard' },
  boss: { hue: [0, 18], sat: 80, light: 55, vy: [-0.5, -0.16], vx: [-0.24, 0.24], r: [0.8, 2.6], glow: true, scene: null },
};

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = () => window.matchMedia('(max-width: 760px)').matches;

let canvas = null;
let ctx = null;
let particles = [];
let flyers = [];
let spawnTimers = {};
let theme = null;
let intensity = 1;
let raf = 0;
let running = false;
let lastT = 0;

// ---------------- silhouette library ----------------
// Original archetype figures, authored as SVG path data and drawn
// via Path2D. Each is designed to read as a dark shape inside a
// pale halo at 40–120 px.

const PATHS = {
  // A rider crouched over a broom, hat and cape trailing. ~100×56.
  broomRider: 'M2 38 L16 44 L14 36 Z M12 38 L86 30 L86 34 L12 42 Z '
    + 'M44 34 C40 26 42 18 50 14 C44 10 40 4 42 0 C50 4 56 10 58 16 '
    + 'C64 18 68 24 66 30 C60 36 50 38 44 34 Z '
    + 'M46 16 C38 14 28 16 20 22 C28 24 38 24 46 20 Z '
    + 'M60 28 L74 30 L72 34 L58 33 Z',
  // A ragged floating cloak, hooded and hollow. ~56×92.
  dementor: 'M28 0 C16 0 10 12 10 26 C10 44 6 60 0 78 C8 72 10 80 16 74 '
    + 'C20 82 26 76 28 84 C30 76 36 82 40 74 C46 80 48 72 56 78 '
    + 'C50 60 46 44 46 26 C46 12 40 0 28 0 Z '
    + 'M28 10 C22 10 18 16 18 23 C18 30 23 35 28 35 C33 35 38 30 38 23 C38 16 34 10 28 10 Z',
  // A tall man walking, blade over the shoulder. ~28×56.
  man: 'M14 0 C11 0 9 2 9 5 C9 8 11 10 14 10 C17 10 19 8 19 5 C19 2 17 0 14 0 Z '
    + 'M8 12 L20 12 L24 34 L19 34 L22 54 L17 54 L14 38 L11 54 L6 54 L9 34 L4 34 Z '
    + 'M18 12 L30 2 L32 5 L21 15 Z',
  // A slim elf, bow curved across the back. ~26×56.
  elf: 'M13 0 C10.5 0 9 2 9 4.5 C9 7 10.5 9 13 9 C15.5 9 17 7 17 4.5 C17 2 15.5 0 13 0 Z '
    + 'M9 11 L17 11 L20 32 L16 32 L19 54 L15 54 L13 37 L11 54 L7 54 L10 32 L6 32 Z '
    + 'M20 8 C26 18 26 34 20 44 C24 34 24 18 20 8 Z',
  // A stocky dwarf, axe at the side. ~26×40.
  dwarf: 'M13 2 C10 2 8 4 8 7 C8 9 10 11 13 11 C16 11 18 9 18 7 C18 4 16 2 13 2 Z '
    + 'M6 12 L20 12 L23 28 L19 28 L21 38 L16 38 L14 30 L12 38 L7 38 L9 28 L3 28 Z '
    + 'M20 14 L26 14 L26 24 L23 24 L23 38 L21 38 Z',
  // A hobbit, small and quick, with a walking stick. ~18×30.
  hobbit: 'M9 0 C7 0 5.5 1.5 5.5 3.5 C5.5 5.5 7 7 9 7 C11 7 12.5 5.5 12.5 3.5 C12.5 1.5 11 0 9 0 Z '
    + 'M5 8 L13 8 L15 20 L12 20 L14 29 L10.5 29 L9 22 L7.5 29 L4 29 L6 20 L3 20 Z '
    + 'M14 6 L17 4 L18 6 L15 8 L15 28 L14 28 Z',
  // A crowned wraith on foot, rare and slow. ~30×58.
  wraith: 'M12 4 L15 0 L17 4 L20 0 L22 4 L25 0 L26 6 L11 6 Z '
    + 'M14 8 C8 10 6 18 6 26 C6 38 4 48 0 56 L30 56 C26 48 24 38 24 26 C24 18 22 10 18 8 Z',
  // A winged fell-shape, gliding. ~120×44.
  fellBeast: 'M60 20 C56 14 52 12 46 12 C34 4 18 0 0 4 C14 8 24 14 32 20 '
    + 'C40 18 48 20 52 24 L48 40 L56 30 L60 34 L64 30 L72 40 L68 24 '
    + 'C72 20 80 18 88 20 C96 14 106 8 120 4 C102 0 86 4 74 12 C68 12 64 14 60 20 Z',
  // A raven mid-flap. ~34×18.
  raven: 'M16 10 C10 4 4 2 0 4 C6 6 10 10 13 14 L20 13 C24 8 29 4 34 4 C28 1 21 3 16 10 Z '
    + 'M13 12 L22 11 L26 16 L18 15 Z',
};

let path2d = null;
function shapes() {
  if (!path2d) {
    path2d = {};
    for (const [k, d] of Object.entries(PATHS)) path2d[k] = new Path2D(d);
  }
  return path2d;
}

// ---------------- scenes ----------------
// Each scene: a horizon painter and flyer spawners.
// Spawners: { key, w, h, tint, every: [min,max]s, max, make(w,h) → flyer }

function rand(a, b) { return a + Math.random() * (b - a); }

const PALE = 'rgba(150, 160, 200, 0.20)'; // moonlit ghost-light
const EMBERLIT = 'rgba(225, 160, 90, 0.18)'; // forge-lit figures

const SCENES = {
  wizard: {
    horizon: drawCastle,
    spawners: [
      {
        key: 'broomRider', every: [6, 12], max: 2,
        make: (w, h) => {
          const ltr = Math.random() < 0.5;
          const scale = rand(0.45, 0.95);
          return {
            shape: 'broomRider', tint: PALE, scale, flip: !ltr,
            x: ltr ? -110 : w + 110, y: rand(h * 0.08, h * 0.5),
            vx: (ltr ? 1 : -1) * rand(0.9, 1.7), vy: 0,
            bob: rand(6, 14), bobSpeed: rand(0.6, 1.2), phase: rand(0, 6.28),
            halo: 46 * scale, w: 100, h: 56,
          };
        },
      },
      {
        key: 'dementor', every: [9, 16], max: 2,
        make: (w, h) => {
          const ltr = Math.random() < 0.5;
          const scale = rand(0.5, 1.05);
          return {
            shape: 'dementor', tint: 'rgba(120, 130, 175, 0.16)', scale, flip: false,
            x: ltr ? -70 : w + 70, y: rand(h * 0.12, h * 0.55),
            vx: (ltr ? 1 : -1) * rand(0.18, 0.4), vy: rand(-0.03, 0.05),
            bob: rand(10, 18), bobSpeed: rand(0.25, 0.5), phase: rand(0, 6.28),
            halo: 52 * scale, w: 56, h: 92,
          };
        },
      },
    ],
  },
  ring: {
    horizon: drawMordor,
    spawners: [
      {
        key: 'company', every: [14, 26], max: 1,
        // The company walks the lower ridge: man, elf, dwarf, two hobbits.
        make: (w, h) => {
          const ltr = Math.random() < 0.5;
          const order = ['man', 'elf', 'dwarf', 'hobbit', 'hobbit'];
          const members = order.map((shape, i) => ({
            shape, off: i * rand(34, 44), phase: rand(0, 6.28),
          }));
          const span = members[members.length - 1].off + 60;
          return {
            group: members, tint: EMBERLIT, scale: rand(0.8, 1.05), flip: !ltr,
            x: ltr ? -span : w + span, y: h - 16,
            vx: (ltr ? 1 : -1) * rand(0.28, 0.42), vy: 0,
            bob: 1.6, bobSpeed: 3.2, phase: 0,
            halo: 0, w: span, h: 60, walkers: true,
          };
        },
      },
      {
        key: 'fellBeast', every: [12, 22], max: 1,
        make: (w, h) => {
          const ltr = Math.random() < 0.5;
          const scale = rand(0.5, 0.9);
          return {
            shape: 'fellBeast', tint: 'rgba(60, 50, 70, 0.34)', scale, flip: !ltr,
            x: ltr ? -130 : w + 130, y: rand(h * 0.06, h * 0.3),
            vx: (ltr ? 1 : -1) * rand(0.7, 1.2), vy: rand(-0.02, 0.02),
            bob: rand(8, 16), bobSpeed: rand(0.5, 0.9), phase: rand(0, 6.28),
            flap: true, halo: 40 * scale, w: 120, h: 44,
          };
        },
      },
      {
        key: 'wraith', every: [24, 40], max: 1,
        make: (w, h) => {
          const ltr = Math.random() < 0.5;
          return {
            shape: 'wraith', tint: 'rgba(140, 130, 180, 0.15)', scale: rand(0.8, 1), flip: !ltr,
            x: ltr ? -40 : w + 40, y: h - 16,
            vx: (ltr ? 1 : -1) * rand(0.12, 0.2), vy: 0,
            bob: 0.8, bobSpeed: 0.8, phase: 0,
            halo: 34, w: 30, h: 58, walkers: true,
          };
        },
      },
    ],
  },
  ravens: {
    horizon: null,
    spawners: [
      {
        key: 'ravens', every: [7, 14], max: 2,
        make: (w, h) => {
          const ltr = Math.random() < 0.5;
          const n = 2 + Math.floor(Math.random() * 3);
          const members = Array.from({ length: n }, () => ({
            shape: 'raven',
            off: rand(0, 90), dy: rand(-26, 26), phase: rand(0, 6.28),
          }));
          return {
            group: members, tint: 'rgba(130, 140, 180, 0.20)', scale: rand(0.5, 0.85), flip: !ltr,
            x: ltr ? -120 : w + 120, y: rand(h * 0.08, h * 0.4),
            vx: (ltr ? 1 : -1) * rand(1.0, 1.6), vy: rand(-0.05, 0.05),
            bob: 4, bobSpeed: 2.2, phase: rand(0, 6.28),
            flap: true, halo: 0, w: 120, h: 60,
          };
        },
      },
    ],
  },
};

// ---------------- horizons ----------------

function drawCastle(w, h) {
  // A distant keep on a crag: towers with candle-lit slits.
  const base = h;
  const cx = w * 0.82;
  ctx.save();
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = 'rgba(72, 80, 118, 0.22)';
  ctx.beginPath();
  // crag
  ctx.moveTo(cx - 180, base);
  ctx.quadraticCurveTo(cx - 60, base - 60, cx - 20, base - 78);
  ctx.lineTo(cx + 90, base - 70);
  ctx.quadraticCurveTo(cx + 150, base - 40, cx + 200, base);
  ctx.closePath();
  ctx.fill();
  // towers
  const towers = [
    [cx - 40, 118, 16], [cx - 16, 150, 20], [cx + 14, 132, 15], [cx + 42, 108, 13], [cx + 66, 92, 11],
  ];
  ctx.fillStyle = 'rgba(78, 86, 128, 0.30)';
  for (const [tx, th, tw] of towers) {
    ctx.fillRect(tx - tw / 2, base - th, tw, th);
    ctx.beginPath();
    ctx.moveTo(tx - tw / 2 - 3, base - th);
    ctx.lineTo(tx, base - th - tw * 1.4);
    ctx.lineTo(tx + tw / 2 + 3, base - th);
    ctx.closePath();
    ctx.fill();
  }
  // lit windows, flickering faintly
  ctx.fillStyle = `rgba(240, 190, 110, ${0.28 + Math.sin(lastT / 700) * 0.1})`;
  for (const [tx, th] of towers) {
    ctx.fillRect(tx - 1, base - th + 14, 2, 4);
    ctx.fillRect(tx - 1, base - th + 30, 2, 4);
  }
  ctx.restore();
}

function drawMordor(w, h) {
  // A jagged ridge and one tall spire with a burning summit.
  const base = h;
  const cx = w * 0.16;
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = 'rgba(90, 62, 50, 0.16)';
  ctx.beginPath();
  ctx.moveTo(cx - 220, base);
  ctx.lineTo(cx - 140, base - 46);
  ctx.lineTo(cx - 90, base - 22);
  ctx.lineTo(cx - 30, base - 84);
  ctx.lineTo(cx + 30, base - 30);
  ctx.lineTo(cx + 90, base - 56);
  ctx.lineTo(cx + 170, base);
  ctx.closePath();
  ctx.fill();
  // the spire
  ctx.fillStyle = 'rgba(90, 62, 50, 0.22)';
  ctx.beginPath();
  ctx.moveTo(cx - 38, base);
  ctx.lineTo(cx - 26, base - 150);
  ctx.lineTo(cx - 20, base - 150);
  ctx.lineTo(cx - 8, base);
  ctx.closePath();
  ctx.fill();
  // its burning summit
  const flicker = 0.5 + Math.sin(lastT / 300) * 0.2;
  ctx.fillStyle = `rgba(232, 100, 31, ${flicker})`;
  ctx.beginPath();
  ctx.ellipse(cx - 23, base - 152, 4.5, 2.5 + Math.sin(lastT / 200), 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ---------------- engine ----------------

function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement('canvas');
  canvas.id = 'ambient-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  ctx = canvas.getContext('2d');
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopLoop();
    else if (theme) startLoop();
  });
}

function spawnParticle(t, anywhere) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const rising = t.vy[0] < 0;
  return {
    x: rand(0, w),
    y: anywhere ? rand(0, h) : (rising ? h + 6 : -6),
    vx: rand(t.vx[0], t.vx[1]),
    vy: rand(t.vy[0], t.vy[1]),
    r: rand(t.r[0], t.r[1]),
    a: 0,
    maxA: rand(0.25, 0.8),
    hue: rand(t.hue[0], t.hue[1]),
    flicker: rand(0.004, 0.014),
    phase: rand(0, Math.PI * 2),
  };
}

function targetCount() {
  const base = small() ? 34 : 72;
  return Math.round(base * Math.min(intensity, 2));
}

function drawFigure(f) {
  const lib = shapes();
  const bobY = Math.sin(f.phase) * f.bob;
  ctx.save();
  ctx.translate(f.x, f.y + bobY);
  if (f.flip) ctx.scale(-1, 1);
  ctx.scale(f.scale, f.scale);

  if (f.halo) {
    const g = ctx.createRadialGradient(f.w / 2, f.h / 2, 4, f.w / 2, f.h / 2, f.halo * 1.9);
    g.addColorStop(0, 'rgba(170, 180, 220, 0.075)');
    g.addColorStop(1, 'rgba(170, 180, 220, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(f.w / 2, f.h / 2, f.halo * 1.9, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = f.tint;
  if (f.group) {
    // A file of figures sharing one heading (the company, a raven flock).
    for (const m of f.group) {
      ctx.save();
      const stepBob = Math.sin(f.phase * (f.walkers ? 1 : 2) + m.phase) * (f.walkers ? 1.6 : 4);
      ctx.translate(m.off, (m.dy || 0) + stepBob - figureHeight(m.shape));
      if (f.flap) ctx.scale(1, 0.75 + Math.abs(Math.sin(f.phase * 2 + m.phase)) * 0.35);
      ctx.fill(lib[m.shape]);
      ctx.restore();
    }
  } else {
    if (f.walkers) ctx.translate(0, -figureHeight(f.shape));
    if (f.flap) ctx.scale(1, 0.75 + Math.abs(Math.sin(f.phase * 2)) * 0.35);
    ctx.fill(lib[f.shape]);
  }
  ctx.restore();
}

function figureHeight(shape) {
  return { man: 56, elf: 56, dwarf: 40, hobbit: 30, wraith: 58, raven: 18 }[shape] || 0;
}

function step(now) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const t = THEMES[theme];
  const dt = Math.min(50, now - (lastT || now)) / 16.7; // ~frames elapsed
  lastT = now;
  ctx.clearRect(0, 0, w, h);

  // horizon first — the deepest layer
  const scene = t.scene && !small() ? SCENES[t.scene] : null;
  if (scene && scene.horizon) scene.horizon(w, h);

  // silhouettes
  if (scene) {
    for (const sp of scene.spawners) {
      spawnTimers[sp.key] = (spawnTimers[sp.key] ?? rand(1, sp.every[1])) - dt / 60;
      const alive = flyers.filter((f) => f.key === sp.key).length;
      if (spawnTimers[sp.key] <= 0 && alive < sp.max) {
        flyers.push({ key: sp.key, ...sp.make(w, h) });
        spawnTimers[sp.key] = rand(sp.every[0], sp.every[1]);
      }
    }
    for (const f of flyers) {
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      f.phase += (f.bobSpeed || 1) * 0.03 * dt;
      drawFigure(f);
    }
    const margin = 260;
    flyers = flyers.filter((f) => f.x > -f.w - margin && f.x < w + f.w + margin);
  } else if (flyers.length) {
    flyers = [];
  }

  // particles last — nearest layer
  const want = targetCount();
  while (particles.length < want) particles.push(spawnParticle(t, particles.length < want / 2));
  if (particles.length > want) particles.length = want;

  for (const p of particles) {
    p.phase += p.flicker * 6 * dt;
    p.x += (p.vx + Math.sin(p.phase) * 0.04) * intensity * dt;
    p.y += p.vy * intensity * dt;
    p.a = Math.min(p.maxA, p.a + 0.008 * dt);
    const gone = p.y < -10 || p.y > h + 10 || p.x < -10 || p.x > w + 10;
    if (gone) Object.assign(p, spawnParticle(t, false));
    const alpha = p.a * (0.75 + Math.sin(p.phase) * 0.25);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, ${t.sat}%, ${t.light}%, ${alpha})`;
    if (t.glow) {
      ctx.shadowColor = `hsla(${p.hue}, ${t.sat}%, ${t.light}%, ${alpha})`;
      ctx.shadowBlur = 6;
    } else {
      ctx.shadowBlur = 0;
    }
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  raf = requestAnimationFrame(step);
}

function startLoop() {
  if (running || reduced()) return;
  running = true;
  lastT = 0;
  raf = requestAnimationFrame(step);
}

function stopLoop() {
  running = false;
  cancelAnimationFrame(raf);
}

// Public: retint the world. Same theme = just adjust intensity.
export function setAmbient(name, level = 1) {
  if (reduced() || !THEMES[name]) return;
  ensureCanvas();
  intensity = level;
  if (theme !== name) {
    theme = name;
    particles = [];
    flyers = [];
    spawnTimers = {};
  }
  startLoop();
}

export function ambientIntensity(level) {
  intensity = level;
}
