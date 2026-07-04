// ============================================================
// cinema.js — sequencing and juice: self-writing text, rolling
// counters, rank-ascension moments, boss-name reveals, and
// view transitions. Everything collapses to its end state under
// prefers-reduced-motion.
// ============================================================

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------- the grimoire writes itself ----------------
// Reveals the text of each paragraph inside `container` character by
// character. Clicking the container finishes it instantly. Safe on
// arbitrary markup: only text nodes are animated, tags stay intact.

export function typewriter(container, { cps = 55 } = {}) {
  if (!container || reduced()) return;
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) {
    if (n.textContent.trim()) nodes.push({ node: n, full: n.textContent });
  }
  if (!nodes.length) return;
  nodes.forEach((e) => { e.node.textContent = ''; });
  container.classList.add('is-writing');

  let ni = 0;
  let ci = 0;
  let timer = 0;
  const stepMs = 1000 / cps;

  const finish = () => {
    clearTimeout(timer);
    nodes.forEach((e) => { e.node.textContent = e.full; });
    container.classList.remove('is-writing');
    container.removeEventListener('click', finish);
  };

  const tick = () => {
    // Write a few characters per tick so long narratives stay brisk.
    for (let k = 0; k < 2; k += 1) {
      if (ni >= nodes.length) { finish(); return; }
      const entry = nodes[ni];
      ci += 1;
      entry.node.textContent = entry.full.slice(0, ci);
      if (ci >= entry.full.length) { ni += 1; ci = 0; }
    }
    timer = setTimeout(tick, stepMs);
  };
  container.addEventListener('click', finish);
  tick();
}

// ---------------- rolling numbers ----------------

export function countUp(el, from, to, { duration = 900, suffix = '' } = {}) {
  if (!el) return;
  if (reduced() || from === to) { el.textContent = `${to}${suffix}`; return; }
  const start = performance.now();
  const ease = (t) => 1 - (1 - t) ** 3;
  const frame = (now) => {
    const t = Math.min(1, (now - start) / duration);
    el.textContent = `${Math.round(from + (to - from) * ease(t))}${suffix}`;
    if (t < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

// ---------------- the ascension ----------------
// A full-screen beat when a rank threshold falls.

export function rankUpMoment(title) {
  if (reduced()) return;
  const veil = document.createElement('div');
  veil.className = 'cinema-ascend';
  veil.setAttribute('aria-hidden', 'true');
  veil.innerHTML = `
    <div class="ascend-inner">
      <div class="ascend-sigil">🜏</div>
      <div class="ascend-label">You have ascended</div>
      <div class="ascend-rank"></div>
    </div>`;
  veil.querySelector('.ascend-rank').textContent = title;
  document.body.appendChild(veil);
  setTimeout(() => veil.classList.add('leaving'), 2100);
  setTimeout(() => veil.remove(), 2800);
}

// ---------------- boss name reveal ----------------
// Darkness gathers over the stage; the warden's name arrives in
// pieces. Non-blocking: play it over an already-interactive arena.

export function bossReveal(stageEl, name) {
  if (!stageEl || reduced()) return;
  const shroud = document.createElement('div');
  shroud.className = 'boss-shroud';
  shroud.setAttribute('aria-hidden', 'true');
  const letters = [...name].map((chr, i) =>
    `<span style="animation-delay:${120 + i * 42}ms">${chr === ' ' ? '&nbsp;' : escapeChar(chr)}</span>`).join('');
  shroud.innerHTML = `<div class="shroud-name">${letters}</div>`;
  stageEl.appendChild(shroud);
  setTimeout(() => shroud.classList.add('leaving'), 1900);
  setTimeout(() => shroud.remove(), 2600);
}

function escapeChar(c) {
  return c.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
}

// ---------------- view transitions ----------------
// Cross-fade between routes where the browser supports it.

export function viewTransition(render) {
  if (reduced() || typeof document.startViewTransition !== 'function') {
    render();
    return;
  }
  document.startViewTransition(render);
}
