// ============================================================
// ambient.js — the living dark. A single full-screen canvas of
// drifting particles behind the content, retinted per realm.
// Adaptive count, DPR-capped, paused when hidden, and silent
// under prefers-reduced-motion.
// ============================================================

const THEMES = {
  // warm forge-embers, rising (Ring path, lessons)
  ember: { hue: [22, 40], sat: 85, light: 58, vy: [-0.34, -0.1], vx: [-0.06, 0.06], r: [0.8, 2.4], glow: true },
  // sickly spores, drifting up (Wand path, lessons)
  spore: { hue: [110, 140], sat: 60, light: 55, vy: [-0.22, -0.06], vx: [-0.1, 0.1], r: [0.8, 2.2], glow: true },
  // cold mine-dust, falling slow (the map, codex)
  dust: { hue: [215, 235], sat: 25, light: 62, vy: [0.05, 0.22], vx: [-0.08, 0.08], r: [0.6, 1.7], glow: false },
  // void-motes for the sanctum
  void: { hue: [260, 285], sat: 45, light: 60, vy: [-0.1, 0.1], vx: [-0.1, 0.1], r: [0.7, 2], glow: true },
  // battle cinders — red, agitated
  boss: { hue: [0, 18], sat: 80, light: 55, vy: [-0.5, -0.16], vx: [-0.24, 0.24], r: [0.8, 2.6], glow: true },
};

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = () => window.matchMedia('(max-width: 760px)').matches;

let canvas = null;
let ctx = null;
let particles = [];
let theme = null;
let intensity = 1;
let raf = 0;
let running = false;

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

function rand(a, b) { return a + Math.random() * (b - a); }

function spawn(t, anywhere) {
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

function step() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const t = THEMES[theme];
  ctx.clearRect(0, 0, w, h);

  const want = targetCount();
  while (particles.length < want) particles.push(spawn(t, particles.length < want / 2));
  if (particles.length > want) particles.length = want;

  const speed = intensity;
  for (const p of particles) {
    p.phase += p.flicker * 6;
    p.x += (p.vx + Math.sin(p.phase) * 0.04) * speed;
    p.y += p.vy * speed;
    p.a = Math.min(p.maxA, p.a + 0.008);
    const gone = p.y < -10 || p.y > h + 10 || p.x < -10 || p.x > w + 10;
    if (gone) Object.assign(p, spawn(t, false));
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
  }
  startLoop();
}

export function ambientIntensity(level) {
  intensity = level;
}
