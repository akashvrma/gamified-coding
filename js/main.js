// ============================================================
// main.js — bootstrapping and the hash router.
// ============================================================

import * as S from './state.js';
import { rankFor, onHeaderRefresh, dailyTouch } from './gamification.js';
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
  document.getElementById('hdr-rank').textContent = rank.title;
  document.getElementById('hdr-xp').textContent = `${st.xp} XP`;
  document.getElementById('hdr-xpfill').style.width = `${Math.round(rank.progress * 100)}%`;
  document.getElementById('hdr-streak').textContent = `🔥 ${st.streak.count}`;
}

onHeaderRefresh(refreshHeader);

function setNavActive(key) {
  nav.querySelectorAll('a').forEach((a) => {
    a.classList.toggle('active', a.dataset.nav === key);
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

  if (parts.length === 0) {
    setNavActive('map');
    renderHome(app);
  } else if (parts[0] === 'act' && parts[1]) {
    setNavActive('map');
    renderAct(app, parts[1]);
  } else if (parts[0] === 'lesson' && parts[1]) {
    setNavActive('map');
    renderLesson(app, parts[1]);
  } else if (parts[0] === 'boss' && parts[1]) {
    setNavActive('map');
    renderBoss(app, parts[1]);
  } else if (parts[0] === 'profile') {
    setNavActive('profile');
    renderProfile(app);
  } else if (parts[0] === 'codex') {
    setNavActive('codex');
    renderCodex(app);
  } else {
    renderMissing(app);
  }
  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'auto' });
}

// Apply saved allegiance theme before first paint of views.
const saved = S.getState();
if (saved.allegiance) document.documentElement.dataset.allegiance = saved.allegiance;

window.addEventListener('hashchange', route);
route();
