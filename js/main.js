// ============================================================
// main.js — bootstrapping and the hash router.
// ============================================================

import * as S from './state.js';
import { rankFor, onHeaderRefresh, dailyTouch } from './gamification.js';
import { avatarSvg, avatarTier } from './art.js';
import { setAmbient } from './ambient.js';
import { viewTransition, countUp } from './cinema.js';
import {
  renderOnboarding, renderHome, renderAct, renderLesson,
  renderBoss, renderProfile, renderCodex, renderMissing,
} from './views.js';

const app = document.getElementById('app');
const headerStatus = document.getElementById('header-status');
const nav = document.getElementById('site-nav');

function refreshHeader() {
  const st = S.getState();
  if (!S.hasProfile()) {
    headerStatus.hidden = true;
    nav.hidden = true;
    return;
  }
  headerStatus.hidden = false;
  nav.hidden = false;
  const rank = rankFor(st.xp);
  const tier = avatarTier(rank.index);
  const avatarHost = document.getElementById('hdr-avatar');
  // Re-render the little adept only when its form actually changes.
  if (avatarHost.dataset.form !== `${st.allegiance}-${tier}`) {
    avatarHost.dataset.form = `${st.allegiance}-${tier}`;
    avatarHost.innerHTML = avatarSvg(st.allegiance, tier);
  }
  document.getElementById('hdr-rank').textContent = rank.title;
  const xpEl = document.getElementById('hdr-xp');
  const prevXp = Number(xpEl.dataset.xp || NaN);
  if (Number.isFinite(prevXp) && prevXp !== st.xp) {
    countUp(xpEl, prevXp, st.xp, { suffix: ' XP' });
  } else {
    xpEl.textContent = `${st.xp} XP`;
  }
  xpEl.dataset.xp = String(st.xp);
  document.getElementById('hdr-xpfill').style.width = `${Math.round(rank.progress * 100)}%`;
  document.getElementById('hdr-streak').textContent = `🔥 ${st.streak.count}`;
}

onHeaderRefresh(refreshHeader);

function setNavActive(key) {
  nav.querySelectorAll('a').forEach((a) => {
    const active = a.dataset.nav === key;
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

function route() {
  const hash = window.location.hash || '#/';
  const parts = hash.replace(/^#\//, '').split('/').filter(Boolean);

  if (!S.hasProfile()) {
    renderOnboarding(app, () => {
      refreshHeader();
      window.location.hash = '#/';
      route();
    });
    return;
  }

  dailyTouch();
  refreshHeader();

  // The living dark retints per realm.
  const st = S.getState();
  const pathTheme = st.allegiance === 'wand' ? 'spore' : 'ember';

  viewTransition(() => {
    if (parts.length === 0) {
      setNavActive('map');
      setAmbient('dust', 0.8);
      renderHome(app);
    } else if (parts[0] === 'act' && parts[1]) {
      setNavActive('map');
      setAmbient(pathTheme, 0.7);
      renderAct(app, parts[1]);
    } else if (parts[0] === 'lesson' && parts[1]) {
      setNavActive('map');
      setAmbient(pathTheme, 0.7);
      renderLesson(app, parts[1]);
    } else if (parts[0] === 'boss' && parts[1]) {
      setNavActive('map');
      setAmbient('boss', 0.9);
      renderBoss(app, parts[1]);
    } else if (parts[0] === 'profile') {
      setNavActive('profile');
      setAmbient('void', 0.7);
      renderProfile(app);
    } else if (parts[0] === 'codex') {
      setNavActive('codex');
      setAmbient('dust', 0.6);
      renderCodex(app);
    } else {
      renderMissing(app);
    }
    app.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
}

// Apply saved allegiance theme before first paint of views.
const saved = S.getState();
if (saved.allegiance) document.documentElement.dataset.allegiance = saved.allegiance;

window.addEventListener('hashchange', route);
route();
