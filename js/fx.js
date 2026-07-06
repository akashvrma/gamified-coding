// ============================================================
// fx.js — battle effects. Spell bolts, impact bursts, screen
// shakes and dissolves, built on the Web Animations API with a
// single fixed overlay layer. Everything degrades to nothing
// when the user prefers reduced motion.
// ============================================================

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function overlay() {
  let layer = document.getElementById('fx-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'fx-layer';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
  }
  return layer;
}

function center(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function accentColor() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--accent-bright').trim() || '#f0b45a';
}

// A streaking bolt from one element to another. Resolves when it lands.
export function castBolt(fromEl, toEl, { color } = {}) {
  if (reduced() || !fromEl || !toEl) return Promise.resolve();
  const layer = overlay();
  const a = center(fromEl);
  const b = center(toEl);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const c = color || accentColor();

  const bolt = document.createElement('div');
  bolt.className = 'fx-bolt';
  bolt.style.setProperty('--fx-c', c);
  bolt.style.left = `${a.x}px`;
  bolt.style.top = `${a.y}px`;
  bolt.style.transform = `rotate(${angle}deg)`;
  layer.appendChild(bolt);

  const anim = bolt.animate(
    [
      { transform: `translate(0, 0) rotate(${angle}deg) scaleX(0.4)`, opacity: 0.2 },
      { transform: `translate(${dx * 0.15}px, ${dy * 0.15}px) rotate(${angle}deg) scaleX(1)`, opacity: 1, offset: 0.25 },
      { transform: `translate(${dx}px, ${dy}px) rotate(${angle}deg) scaleX(0.9)`, opacity: 1 },
    ],
    { duration: 420, easing: 'cubic-bezier(0.5, 0, 0.9, 0.6)' },
  );
  return anim.finished.catch(() => {}).then(() => {
    bolt.remove();
    burstAt(b.x, b.y, c);
  });
}

// Particle burst at a point (or on an element).
export function burst(el, color) {
  if (reduced() || !el) return;
  const p = center(el);
  burstAt(p.x, p.y, color || accentColor());
}

function burstAt(x, y, color) {
  if (reduced()) return;
  const layer = overlay();
  const n = 12;
  for (let i = 0; i < n; i += 1) {
    const s = document.createElement('div');
    s.className = 'fx-spark';
    s.style.setProperty('--fx-c', color);
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    layer.appendChild(s);
    const ang = (Math.PI * 2 * i) / n + Math.random() * 0.5;
    const dist = 26 + Math.random() * 42;
    s.animate(
      [
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist}px) scale(0.2)`, opacity: 0 },
      ],
      { duration: 500 + Math.random() * 260, easing: 'cubic-bezier(0.1, 0.6, 0.4, 1)' },
    ).finished.catch(() => {}).finally(() => s.remove());
  }
}

// Flash + recoil on a struck element (the boss).
export function hitFlash(el) {
  if (reduced() || !el) return Promise.resolve();
  const anim = el.animate(
    [
      { filter: 'brightness(1)', transform: 'translateX(0)' },
      { filter: 'brightness(2.4) saturate(0.4)', transform: 'translateX(7px)', offset: 0.2 },
      { filter: 'brightness(1)', transform: 'translateX(-4px)', offset: 0.6 },
      { filter: 'brightness(1)', transform: 'translateX(0)' },
    ],
    { duration: 380, easing: 'ease-out' },
  );
  return anim.finished.catch(() => {});
}

// The boss strikes back: lunge toward the viewer + red vignette + shake.
export function bossStrike(bossEl) {
  if (reduced()) return Promise.resolve();
  const layer = overlay();
  const veil = document.createElement('div');
  veil.className = 'fx-redveil';
  layer.appendChild(veil);
  veil.animate(
    [{ opacity: 0 }, { opacity: 0.55, offset: 0.3 }, { opacity: 0 }],
    { duration: 550, easing: 'ease-out' },
  ).finished.catch(() => {}).finally(() => veil.remove());

  if (bossEl) {
    bossEl.animate(
      [
        { transform: 'scale(1) translateY(0)' },
        { transform: 'scale(1.13) translateY(9px)', offset: 0.3 },
        { transform: 'scale(1) translateY(0)' },
      ],
      { duration: 520, easing: 'cubic-bezier(0.3, 0, 0.2, 1)' },
    );
  }
  return shake(document.getElementById('app'));
}

export function shake(el) {
  if (reduced() || !el) return Promise.resolve();
  const anim = el.animate(
    [
      { transform: 'translate(0,0)' },
      { transform: 'translate(-7px, 2px)' },
      { transform: 'translate(6px, -3px)' },
      { transform: 'translate(-4px, 2px)' },
      { transform: 'translate(3px, -1px)' },
      { transform: 'translate(0,0)' },
    ],
    { duration: 420, easing: 'linear' },
  );
  return anim.finished.catch(() => {});
}

// The Warden Speaks: pick one bark line from an authored list, rotating
// deterministically with the battle's own progress index — the same
// fight replays the same words. No RNG here, and none at module scope.
export function pickBark(lines, index) {
  if (!Array.isArray(lines) || !lines.length) return '';
  const i = Math.abs(Number(index) || 0) % lines.length;
  return typeof lines[i] === 'string' ? lines[i] : '';
}

// The warden's death: flare, then dissolve upward into embers.
export function dissolve(el, color) {
  if (!el) return Promise.resolve();
  if (reduced()) { el.style.opacity = '0'; return Promise.resolve(); }
  const p = center(el);
  const c = color || accentColor();
  for (let i = 0; i < 3; i += 1) {
    setTimeout(() => burstAt(
      p.x + (Math.random() - 0.5) * 90,
      p.y + (Math.random() - 0.5) * 110,
      c,
    ), i * 220);
  }
  const anim = el.animate(
    [
      { filter: 'brightness(1)', transform: 'translateY(0)', opacity: 1 },
      { filter: 'brightness(3)', transform: 'translateY(-6px)', opacity: 0.9, offset: 0.25 },
      { filter: 'brightness(0.4) blur(6px)', transform: 'translateY(-40px) scale(0.92)', opacity: 0 },
    ],
    { duration: 1400, easing: 'ease-in', fill: 'forwards' },
  );
  return anim.finished.catch(() => {});
}
