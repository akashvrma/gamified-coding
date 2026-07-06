// ============================================================
// views.js — every screen of the Codex. Pure render functions
// that take the app root element and paint a route.
// ============================================================

import { escapeHtml, prose, codeBlock, el, toast, mdInline, holdToasts, releaseToasts } from './ui.js';
import * as S from './state.js';
import { emit, grantXp, rankFor, ACHIEVEMENTS, RANKS } from './gamification.js';
import { runPython, preboot, runnerStatus, onRunnerStatus } from './runner.js';
import { curriculum, findLesson, findAct } from './data/curriculum.js';
import { avatarSvg, avatarTier, TIER_NAMES, bossSvg, mapSvg } from './art.js';
import { castBolt, burst, hitFlash, bossStrike, dissolve } from './fx.js';
import { typewriter, bossReveal, countUp } from './cinema.js';
import { setAmbient } from './ambient.js';
import { play } from './sound.js';
import {
  qHash, buildVigil, eligiblePool, pickReviewForBoss,
  actHealth, scarBook, rekindlePool, buildRekindle,
} from './review.js';

const QUIZ_XP = 35;
const QUIZ_PERFECT_BONUS = 15;

function draftKey(id) { return `darkcodex.draft.${id}`; }

function loadDraft(id, fallback) {
  try { return localStorage.getItem(draftKey(id)) ?? fallback; } catch { return fallback; }
}

function saveDraft(id, code) {
  try { localStorage.setItem(draftKey(id), code); } catch { /* forgettable */ }
}

function clearDraft(id) {
  try { localStorage.removeItem(draftKey(id)); } catch { /* fine */ }
}

// Tab inserts spaces but must not trap keyboard users (WCAG 2.1.2):
// Shift+Tab always moves focus out, and Escape arms a one-shot
// pass-through so the next Tab also leaves the editor.
function wireEditorKeys(editor, afterEdit) {
  let escapeArmed = false;
  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { escapeArmed = true; return; }
    if (e.key !== 'Tab') { escapeArmed = false; return; }
    if (e.shiftKey || escapeArmed) { escapeArmed = false; return; }
    e.preventDefault();
    const { selectionStart: s, selectionEnd: eIdx, value } = editor;
    editor.value = `${value.slice(0, s)}    ${value.slice(eIdx)}`;
    editor.selectionStart = s + 4;
    editor.selectionEnd = s + 4;
    afterEdit();
  });
}

const EDITOR_LABEL = 'Python code editor. Tab inserts four spaces; press Escape then Tab to move focus out.';

// ---------------- day arithmetic (local, calendar-day granularity) ----------------

function dayStampOf(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function dayStampAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return dayStampOf(d);
}

// Whole days between two ISO day-stamps (noon-anchored to dodge DST).
function daysBetweenStamps(a, b) {
  const parse = (s) => {
    const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12) : null;
  };
  const da = parse(a);
  const db = parse(b);
  if (!da || !db) return null;
  return Math.round((db - da) / 86400000);
}

function truncateText(s, n = 90) {
  const t = String(s);
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

// ---------------- sigils of mastery (heraldic, zero XP) ----------------
// Three distinct glyphs — never color alone — on act-page lesson rows
// and tallied in the Sanctum. Semantics live in state.js sigilsFor.

const SIGILS = [
  { key: 'oneCast', glyph: '🜁', name: 'One-Cast', desc: 'the trial fell to the very first casting' },
  { key: 'flawless', glyph: '🜄', name: 'Flawless', desc: 'the interrogation never cracked' },
  { key: 'unaided', glyph: '🜃', name: 'Unaided', desc: 'no whisper, no notes — your hand alone' },
];

function sigilRowHtml(sig) {
  const label = SIGILS.map((s) => `${s.name} ${sig[s.key] ? 'earned' : 'not earned'}`).join(', ');
  const runes = SIGILS.map((s) => `<span class="sigil ${sig[s.key] ? 'earned' : 'unearned'}"
      title="${escapeHtml(`${s.name} — ${sig[s.key] ? s.desc : 'not earned'}`)}">${s.glyph}</span>`).join('');
  return `<span class="node-sigils" role="img" aria-label="${escapeHtml(`Sigils: ${label}`)}">${runes}</span>`;
}

function sigilTally() {
  let earned = 0;
  let lessons = 0;
  curriculum.acts.forEach((act) => act.lessons.forEach((lesson) => {
    lessons += 1;
    const sig = S.sigilsFor(lesson.id);
    earned += (sig.oneCast ? 1 : 0) + (sig.flawless ? 1 : 0) + (sig.unaided ? 1 : 0);
  }));
  return { earned, possible: lessons * 3 };
}

// Curly quotes and no-break spaces (OS autocorrect, pasted prose) are
// invisible Python-killers: `print(“hi”)` dies of SyntaxError with no
// visible difference. Straighten them the moment they arrive.
const SMART_CHARS = /[\u2018\u2019\u201C\u201D\u00A0]/;

function normalizeSpellText(text) {
  return text
    .replace(/[\u2018\u2019]/g, "'")   // curly single quotes
    .replace(/[\u201C\u201D]/g, '"')   // curly double quotes
    .replace(/\u00A0/g, ' ');           // no-break space
}

// Normalize on `input` (covers typing AND paste). Every replacement is
// one-char-for-one-char, so restoring the selection indices keeps the
// caret exactly where it was; clean input is left untouched so the
// undo stack only pays when a smart character actually appeared.
// Wire this BEFORE any draft-saving input listener — listeners fire in
// registration order, so drafts always store the normalized text.
function wireEditorNormalization(editor) {
  editor.addEventListener('input', () => {
    const value = editor.value;
    if (!SMART_CHARS.test(value)) return;
    const { selectionStart, selectionEnd, selectionDirection } = editor;
    editor.value = normalizeSpellText(value);
    editor.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
  });
}

// Bind the small "Summoning the interpreter…" status line inside a forge
// to runner state, and drop the listener when the view's DOM is replaced.
function wireRunnerLabel(host) {
  const stateLabel = host.querySelector('[data-role="runner-state"]');
  if (!stateLabel) return;
  const update = (s) => {
    stateLabel.textContent = {
      cold: '',
      summoning: 'Summoning the interpreter…',
      ready: 'The interpreter is bound and listening.',
      dead: 'Interpreter unreachable — spells cannot be cast.',
    }[s] || '';
  };
  update(runnerStatus());
  const unsubscribe = onRunnerStatus(update);
  const observer = new MutationObserver(() => {
    if (!document.body.contains(host)) { unsubscribe(); observer.disconnect(); }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// ---------------- onboarding ----------------

export function renderOnboarding(root, onDone) {
  root.innerHTML = `
    <section class="onboarding">
      <h1>The Dark Codex</h1>
      <p class="ob-lead">“A curious craft, code. Wands and rings were only ever vessels —
      the power was always in the language.”</p>
      <div class="panel ob-form">
        <p>You stand before a book that should not exist: a grimoire that teaches
        <strong>Python</strong>, the serpent-tongue of machines, from first whisper to
        mastery of <strong>object-oriented sorcery</strong>. It asks only two things.</p>
        <label for="ob-name">Your true name</label>
        <input type="text" id="ob-name" maxlength="24" autocomplete="off"
               placeholder="What shall the Codex call you?">
        <span class="ob-label" id="allegiance-label">Your allegiance</span>
        <div class="allegiance-row" role="radiogroup" aria-labelledby="allegiance-label">
          <div class="allegiance-card" data-allegiance="wand" role="radio" aria-checked="false" tabindex="0">
            <div class="al-icon" aria-hidden="true">🪄</div>
            <h2>The Path of the Wand</h2>
            <p>Forbidden curses, horcruxes, and the long patience of the Dark Arts.
            Your magic glows a sickly green.</p>
          </div>
          <div class="allegiance-card" data-allegiance="ring" role="radio" aria-checked="false" tabindex="0">
            <div class="al-icon" aria-hidden="true">💍</div>
            <h2>The Path of the Ring</h2>
            <p>Forge-fire, wraiths, and a single will that outlasts its bearers.
            Your magic burns molten gold.</p>
          </div>
        </div>
        <div class="ob-submit">
          <button class="btn" id="ob-go" disabled>Open the Codex</button>
        </div>
      </div>
    </section>`;

  let allegiance = '';
  const nameInput = root.querySelector('#ob-name');
  const goBtn = root.querySelector('#ob-go');

  function refresh() {
    goBtn.disabled = !(nameInput.value.trim() && allegiance);
  }

  root.querySelectorAll('.allegiance-card').forEach((card) => {
    const choose = () => {
      allegiance = card.dataset.allegiance;
      root.querySelectorAll('.allegiance-card').forEach((c) => {
        c.classList.remove('chosen-wand', 'chosen-ring');
        c.setAttribute('aria-checked', 'false');
      });
      card.classList.add(allegiance === 'wand' ? 'chosen-wand' : 'chosen-ring');
      card.setAttribute('aria-checked', 'true');
      document.documentElement.dataset.allegiance = allegiance;
      refresh();
    };
    card.addEventListener('click', choose);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); }
    });
  });
  nameInput.addEventListener('input', refresh);
  goBtn.addEventListener('click', () => {
    S.setProfile(nameInput.value.trim(), allegiance);
    onDone();
  });
}

// ---------------- home / map ----------------

// The next unlocked, unfinished working — the page already cut.
export function nextAction() {
  for (let ai = 0; ai < curriculum.acts.length; ai += 1) {
    const act = curriculum.acts[ai];
    if (!S.isActUnlocked(curriculum, ai)) break; // acts unlock strictly in order
    for (let li = 0; li < act.lessons.length; li += 1) {
      const lesson = act.lessons[li];
      if (!S.isLessonComplete(lesson.id) && S.isLessonUnlocked(curriculum, ai, li)) {
        return {
          route: `#/lesson/${lesson.id}`,
          label: `Trial ${li + 1} — ${lesson.title} · Act ${act.numeral}, ${act.title}`,
        };
      }
    }
    if (!S.isBossDefeated(act.id) && S.isBossUnlocked(curriculum, ai)) {
      return {
        route: `#/boss/${act.id}`,
        label: `${act.boss.title} · warden of Act ${act.numeral}`,
      };
    }
  }
  return null;
}

// The saved resume target, but only while it is still an open door.
function resolveResume(resume) {
  const route = String(resume.route || '');
  const label = String(resume.label || '');
  if (!route || !label) return null;
  let m = route.match(/^#\/lesson\/([\w-]+)$/);
  if (m) {
    const found = findLesson(m[1]);
    if (found && !S.isLessonComplete(m[1])
      && S.isLessonUnlocked(curriculum, found.actIndex, found.lessonIndex)) {
      return { route, label };
    }
    return null;
  }
  m = route.match(/^#\/boss\/([\w-]+)$/);
  if (m) {
    const found = findAct(m[1]);
    if (found && !S.isBossDefeated(m[1]) && S.isBossUnlocked(curriculum, found.actIndex)) {
      return { route, label };
    }
  }
  return null;
}

// One dark panel, one primary action, facts only — the Codex never
// threatens the flame.
function returnPanelHtml(st) {
  if (!st.resume || !Number(st.resume.at)) return '';
  if (Date.now() - Number(st.resume.at) <= 4 * 3600 * 1000) return '';
  let lead = 'The candle you left burning still holds your page.';
  let target = resolveResume(st.resume);
  if (!target) {
    target = nextAction();
    lead = 'The next page is already cut.';
  }
  if (!target) return '';
  const facts = [];
  if (st.streak.count > 0) {
    facts.push(escapeHtml(`The watch-fire holds: ${st.streak.count} night${st.streak.count === 1 ? '' : 's'}.`));
  }
  if (st.vigil.lastDay !== S.todayStamp() && eligiblePool(st).length > 0) {
    facts.push('The night’s walk awaits — <a href="#/vigil">the Vigil</a>.');
  }
  return `
    <section class="return-panel panel">
      <p class="return-lead">🕯 ${escapeHtml(lead)}</p>
      <p class="return-target"><strong>${escapeHtml(target.label)}</strong></p>
      <p><a class="btn" href="${escapeHtml(target.route)}">Resume the descent →</a></p>
      ${facts.map((f) => `<p class="return-facts">${f}</p>`).join('')}
    </section>`;
}

// ---------------- the rekindling ----------------
// A lapsed return (≥7 days) with proven ground (≥10 twice-true ledger
// items) opens on a three-question rite drawn from the learner's
// STRONGEST material — competence first, never a scolding. Offered at
// most once per calendar day; always passable; an ember on 3 of 3.

// The most recent activity day BEFORE today: the kept-nights history
// (dailyTouch has already stamped today by the time the map renders),
// falling back to the resume timestamp for saves that predate history.
function daysSinceLastActivity(st) {
  const today = S.todayStamp();
  const hist = Array.isArray(st.streak.history) ? st.streak.history : [];
  let last = '';
  for (const stamp of hist) {
    if (typeof stamp === 'string' && stamp < today && stamp > last) last = stamp;
  }
  if (st.resume && Number(st.resume.at)) {
    const rstamp = dayStampOf(new Date(Number(st.resume.at)));
    if (rstamp < today && rstamp > last) last = rstamp;
  }
  if (!last) return null;
  return daysBetweenStamps(last, today);
}

// Renders the rite and returns true when it owns the screen.
function maybeRekindle(root, st) {
  const today = S.todayStamp();
  if (st.rekindle && st.rekindle.lastOffered === today) return false;
  const lapse = daysSinceLastActivity(st);
  if (lapse === null || lapse < 7) return false;
  if (rekindlePool(st).length < 10) return false;
  const items = buildRekindle(st, 3);
  if (items.length < 3) return false;
  S.markRekindleOffered();

  root.innerHTML = `
    <section class="rekindle-rite panel" aria-labelledby="rekindle-title">
      <h1 class="map-title" id="rekindle-title">🜂 The Rekindling</h1>
      <p class="map-sub">${lapse} nights have passed since the watch was last kept.
      What you learned has not left you. Three pages you once held cold — read them again.</p>
      <div class="center">
        <button class="btn" id="rekindle-begin">Face the three</button>
        <button class="btn btn-ghost" id="rekindle-pass">Pass on</button>
      </div>
      <div id="rekindle-flow"></div>
      <div id="rekindle-result" role="status" aria-live="polite"></div>
    </section>`;

  const enterMap = () => renderHome(root); // lastOffered is stamped — the map renders
  root.querySelector('#rekindle-pass').addEventListener('click', enterMap);
  root.querySelector('#rekindle-begin').addEventListener('click', () => {
    root.querySelector('#rekindle-begin').disabled = true;
    root.querySelector('#rekindle-pass').disabled = true;
    const flow = root.querySelector('#rekindle-flow');
    let answered = 0;
    let allTrue = true;
    items.forEach((item, i) => {
      let host = flow;
      if (item.entry.code) {
        host = el('div', { class: 'trace-item' }, codeBlock(item.entry.code));
        flow.appendChild(host);
      }
      renderQuizQuestion(host, item.entry.q, (missed) => {
        S.recordQuestionOutcome(item.qid, !missed, qHash(item.entry.q.q));
        if (missed) allTrue = false;
        answered += 1;
        if (answered === items.length) conclude();
      }, { number: i + 1 });
    });
    function conclude() {
      const resultHost = root.querySelector('#rekindle-result');
      if (allTrue) {
        const banked = S.grantEmber('rekindled');
        resultHost.innerHTML = `
          <div class="verdict verdict-pass">
            <span class="verdict-title">The fire remembers you.</span>
            Three of three, after ${lapse} nights away.
            ${banked ? 'An ember is banked against the dark.' : 'Your embers already stand at their cap; the proof stands on its own.'}
          </div>
          <p class="center mt"><button class="btn" data-act="enter">Enter the Codex</button></p>`;
        if (banked) {
          toast({
            icon: '🜂',
            title: 'An ember is banked against the dark',
            sub: 'The fire remembers you.',
          });
        }
        emit({ type: 'rekindle-complete' });
      } else {
        resultHost.innerHTML = `
          <div class="verdict verdict-warm">
            <span class="verdict-title">The embers stir. The watch resumes.</span>
            Nothing is owed and nothing is lost — the pages are where you left them.
          </div>
          <p class="center mt"><button class="btn" data-act="enter">Enter the Codex</button></p>`;
      }
      resultHost.querySelector('[data-act="enter"]').addEventListener('click', enterMap);
    }
  });
  return true;
}

export function renderHome(root) {
  const st = S.getState();
  if (maybeRekindle(root, st)) return; // the rite owns the screen today
  const cards = curriculum.acts.map((act, i) => {
    const unlocked = S.isActUnlocked(curriculum, i);
    const { done, total } = S.actProgress(act);
    const pct = Math.round((done / total) * 100);
    const status = !unlocked
      ? '<span class="tag tag-locked">🔒 Sealed</span>'
      : (done === total
        ? '<span class="tag tag-done">Conquered</span>'
        : `<span class="tag tag-accent">${done ? 'In progress' : 'Open'}</span>`);
    // The Fading Wards: below half health the act's rune gutters and
    // becomes a door into that act's vigil. A cue, never a punishment.
    const fading = unlocked && actHealth(st, act.id) < 0.5;
    const sigilEl = fading
      ? `<div class="act-sigil ward-fading" role="link" tabindex="0" data-ward-link="#/vigil/act-${i + 1}"
           aria-label="The wards of Act ${escapeHtml(act.numeral)} are fading — walk their vigil"
           title="The wards of this act burn low. Walk a vigil over them.">${escapeHtml(act.sigil)}</div>`
      : `<div class="act-sigil" aria-hidden="true">${escapeHtml(act.sigil)}</div>`;
    const inner = `
      <article class="act-card ${unlocked ? '' : 'locked'}">
        ${sigilEl}
        <div class="act-info">
          <div class="act-num">Act ${escapeHtml(act.numeral)} — ${escapeHtml(act.arc)}</div>
          <h2 class="act-name">${escapeHtml(act.title)}</h2>
          <p class="act-tagline">${escapeHtml(act.tagline)}</p>
          <div class="act-meta">
            <div class="act-progressbar" aria-hidden="true"><i style="width:${pct}%"></i></div>
            <span class="act-progresstext">${done}/${total} trials</span>
            ${status}
          </div>
        </div>
      </article>`;
    const road = i < curriculum.acts.length - 1 ? '<div class="road-link"></div>' : '';
    return unlocked
      ? `<a class="act-link" href="#/act/${act.id}">${inner}</a>${road}`
      : `<div class="act-link" title="Defeat the previous act's warden to break this seal">${inner}</div>${road}`;
  }).join('');

  // The illustrated descent: decorative map above the accessible act list.
  const progress = curriculum.acts.map((act, i) => {
    const unlocked = S.isActUnlocked(curriculum, i);
    const { done, total } = S.actProgress(act);
    return { unlocked, done, total, current: false };
  });
  const here = progress.findIndex((p) => p.unlocked && p.done < p.total);
  (progress[here === -1 ? progress.length - 1 : here] || progress[0]).current = true;

  const realmWord = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven',
    'Eight', 'Nine'][curriculum.acts.length - 1] || String(curriculum.acts.length);
  root.innerHTML = `
    ${returnPanelHtml(st)}
    <h1 class="map-title">The Descent</h1>
    <p class="map-sub">${realmWord} realms stand between ${escapeHtml(st.name || 'you')} and mastery.
    Each must be survived in turn.</p>
    <div class="map-wrap" aria-hidden="true">${mapSvg(progress)}</div>
    <div class="act-road">${cards}</div>`;

  // A fading ward's rune is a door of its own: it must not follow the
  // card's link to the act page, but into that act's filtered vigil.
  root.querySelectorAll('.act-sigil[data-ward-link]').forEach((rune) => {
    const go = (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.hash = rune.dataset.wardLink;
    };
    rune.addEventListener('click', go);
    rune.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') go(e);
    });
  });
}

// ---------------- act page ----------------

export function renderAct(root, actId) {
  const found = findAct(actId);
  if (!found) { renderMissing(root); return; }
  const { act, actIndex } = found;
  if (!S.isActUnlocked(curriculum, actIndex)) {
    root.innerHTML = `
      <div class="crumbs"><a href="#/">The Map</a> / ${escapeHtml(act.title)}</div>
      <div class="panel center">
        <h1>The seal has not broken.</h1>
        <p class="empty-note">Defeat the warden of the previous act to break this seal.</p>
        <p><a class="btn btn-ghost" href="#/">Return to the map</a></p>
      </div>`;
    return;
  }

  const nodes = act.lessons.map((lesson, i) => {
    const unlocked = S.isLessonUnlocked(curriculum, actIndex, i);
    const complete = S.isLessonComplete(lesson.id);
    const cls = `lesson-node ${complete ? 'done' : ''} ${unlocked ? '' : 'locked'}`;
    const marker = complete ? '✓' : (unlocked ? String(i + 1) : '🔒');
    const status = complete
      ? '<span class="tag tag-done">Done</span>'
      : (unlocked ? '<span class="tag tag-accent">Open</span>' : '<span class="tag tag-locked">Sealed</span>');
    // Sigils appear once the trial has left a record — heraldry, not homework.
    const rec = S.getLessonProgress(lesson.id);
    const sigils = (rec.challenge || rec.quiz) ? sigilRowHtml(S.sigilsFor(lesson.id)) : '';
    return `
      <a class="${cls}" href="#/lesson/${lesson.id}" ${unlocked ? '' : 'aria-disabled="true" tabindex="-1"'}>
        <span class="node-marker">${marker}</span>
        <span class="node-body">
          <span class="node-title">${escapeHtml(lesson.title)}</span><br>
          <span class="node-concept">${escapeHtml(lesson.concept)}</span>
        </span>
        ${sigils}
        <span class="node-status">${status}</span>
      </a>`;
  }).join('');

  const bossUnlocked = S.isBossUnlocked(curriculum, actIndex);
  const bossDone = S.isBossDefeated(act.id);
  const bossNode = `
    <a class="lesson-node boss-node ${bossDone ? 'done' : ''} ${bossUnlocked || bossDone ? '' : 'locked'}"
       href="#/boss/${act.id}" ${bossUnlocked || bossDone ? '' : 'aria-disabled="true" tabindex="-1"'}>
      <span class="node-marker">☠</span>
      <span class="node-body">
        <span class="node-title">${escapeHtml(act.boss.title)}</span><br>
        <span class="node-concept">Boss trial — everything this act taught you, under pressure</span>
      </span>
      <span class="node-status">${bossDone
        ? '<span class="tag tag-done">Defeated</span>'
        : (bossUnlocked ? '<span class="tag tag-accent">Awaits</span>' : '<span class="tag tag-locked">Sealed</span>')}</span>
    </a>`;

  root.innerHTML = `
    <div class="crumbs"><a href="#/">The Map</a> / Act ${escapeHtml(act.numeral)}</div>
    <header class="act-header">
      <span class="act-num">Act ${escapeHtml(act.numeral)} — ${escapeHtml(act.arc)}</span>
      <h1>${escapeHtml(act.sigil)} ${escapeHtml(act.title)}</h1>
      <blockquote class="epigraph">${escapeHtml(act.epigraph.text)}
        <cite>— ${escapeHtml(act.epigraph.source)}</cite>
      </blockquote>
      <div class="prose">${prose(act.intro)}</div>
    </header>
    <div class="lesson-list">${nodes}${bossNode}</div>
    <section class="act-epilogue" id="act-epilogue"></section>`;
  mountEpilogue(root.querySelector('#act-epilogue'), act);
}

// ---------------- the epilogue (great working + rite) ----------------
// Optional post-boss surfaces on the act page, revealed only once the
// act's warden has fallen. NOTHING gates on them — the next act opens
// the moment the boss dies, whether these pages are ever touched.

function mountEpilogue(host, act) {
  if ((!act.working && !act.rite) || !S.isBossDefeated(act.id)) {
    host.innerHTML = '';
    return;
  }
  host.innerHTML = `
    <h2 class="section-h">🜍 After the Warden</h2>
    <p class="prose">The act is conquered; these pages opened when its warden fell.
    Nothing ahead is sealed behind them — this is craft for its own sake.</p>
    <div data-role="working-host"></div>
    <div data-role="rite-host"></div>`;
  if (act.working) mountWorking(host.querySelector('[data-role="working-host"]'), act);
  if (act.rite) mountRite(host.querySelector('[data-role="rite-host"]'), act);
}

function mountWorking(host, act) {
  const w = act.working;
  const stages = Array.isArray(w.stages) ? w.stages : [];
  if (!stages.length) return;

  const panel = el('details', { class: 'extra-panel working-panel' });
  panel.innerHTML = `
    <summary>
      <span class="extra-kind">🜍 The Great Working</span>
      <span class="extra-title">${escapeHtml(w.title)}</span>
      <span class="extra-status" data-role="working-status"></span>
    </summary>
    <div class="extra-body">
      ${w.epigraph ? `<blockquote class="epigraph">${escapeHtml(w.epigraph.text)}
        <cite>— ${escapeHtml(w.epigraph.source)}</cite></blockquote>` : ''}
      <div class="prose">${prose(w.brief)}</div>
      <p class="prose">A Working is built in stages, each raised on the one before it.
      Every stage keeps what you wrote for the last — your own code, carried forward —
      and each holds a canon to reforge from if yours has gone astray.</p>
      <div class="working-stages" data-role="stages"></div>
    </div>`;
  host.appendChild(panel);

  const stagesHost = panel.querySelector('[data-role="stages"]');
  const statusEl = panel.querySelector('[data-role="working-status"]');
  const entries = [];

  // The next unfinished index — stages are forged strictly in order.
  function nextIndex() {
    let i = 0;
    while (i < stages.length && S.isWorkingStageDone(w.id, stages[i].id)) i += 1;
    return i;
  }

  function refresh() {
    const cur = nextIndex();
    statusEl.innerHTML = cur >= stages.length
      ? '<span class="tag tag-done">Complete</span>'
      : `<span class="tag tag-accent">Stage ${cur + 1} of ${stages.length}</span>`;
    entries.forEach((entry, i) => {
      const done = S.isWorkingStageDone(w.id, stages[i].id);
      entry.sealed = i > cur;
      entry.panel.classList.toggle('sealed', entry.sealed);
      entry.status.innerHTML = done
        ? '<span class="tag tag-done">Forged</span>'
        : (entry.sealed
          ? '<span class="tag tag-locked">Sealed</span>'
          : `<span class="tag tag-accent">+${Number(stages[i].xp) || 0} XP</span>`);
    });
  }

  stages.forEach((stage, i) => {
    const stagePanel = el('details', { class: 'extra-panel working-stage' });
    stagePanel.innerHTML = `
      <summary>
        <span class="extra-kind">Stage ${i + 1}</span>
        <span class="extra-title">${escapeHtml(stage.title)}</span>
        <span class="extra-status" data-role="stage-status"></span>
      </summary>
      <div class="extra-body">
        <div class="prose">${prose(stage.brief)}</div>
        <div data-role="stage-forge"></div>
      </div>`;
    stagesHost.appendChild(stagePanel);
    const entry = {
      panel: stagePanel,
      status: stagePanel.querySelector('[data-role="stage-status"]'),
      sealed: false,
      mounted: false,
    };
    entries.push(entry);
    stagePanel.addEventListener('toggle', () => {
      if (stagePanel.open && entry.sealed) { stagePanel.open = false; return; }
      if (!stagePanel.open || entry.mounted) return;
      entry.mounted = true;
      mountWorkingStageForge(stagePanel.querySelector('[data-role="stage-forge"]'), {
        act, working: w, stage, stageIndex: i, stages, onAdvance: refresh,
      });
    });
  });
  refresh();
}

// The Working's forge: no hint ladder and no dead apprentice's notes —
// the safety net here is the stage's cumulative canon, offered by the
// Reforge button and never opened by accident.
function mountWorkingStageForge(host, {
  act, working: w, stage, stageIndex, stages, onAdvance,
}) {
  const recordKey = `${w.id}.${stage.id}`;
  host.innerHTML = `
    <div class="forge">
      <div class="forge-head">
        <span class="dots"><i></i><i></i><i></i></span>
        <span>The Forge — Stage ${stageIndex + 1} of ${stages.length}</span>
      </div>
      <div class="editor-wrap">
        <div class="editor-gutter" aria-hidden="true">1</div>
        <textarea class="editor" spellcheck="false" autocapitalize="off" autocorrect="off"
          aria-label="${EDITOR_LABEL}"></textarea>
      </div>
      <div class="forge-actions">
        <button class="btn" data-act="run">▶ Cast the spell</button>
        <button class="btn btn-ghost" data-act="reset">Reset</button>
        <button class="btn btn-ghost" data-act="reforge">⚒ Reforge from the canon</button>
        <span class="runner-state" data-role="runner-state"></span>
      </div>
      <div class="console" data-role="console" role="status" aria-live="polite" hidden></div>
      <div data-role="verdict" role="status" aria-live="polite"></div>
    </div>`;

  const editor = host.querySelector('textarea.editor');
  const gutter = host.querySelector('.editor-gutter');
  const consoleBox = host.querySelector('[data-role="console"]');
  const verdictBox = host.querySelector('[data-role="verdict"]');
  const runBtn = host.querySelector('[data-act="run"]');

  // Stage n opens with the learner's passing code from stage n-1 —
  // their own work carried forward. The authored starter serves the
  // first stage, and any stage whose prior draft has been lost.
  const carried = stageIndex > 0 ? loadDraft(`${w.id}.${stages[stageIndex - 1].id}`, '') : '';
  const prefill = carried.trim() ? carried : stage.starter;
  editor.value = loadDraft(recordKey, prefill);
  if (S.isWorkingStageDone(w.id, stage.id)) {
    verdictBox.innerHTML = `
      <div class="verdict verdict-pass">
        <span class="verdict-title">Already forged.</span>
        You may refine this stage freely — the mark is yours.
      </div>`;
  }

  function syncGutter() {
    const lines = editor.value.split('\n').length || 1;
    gutter.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
    gutter.scrollTop = editor.scrollTop;
  }
  wireEditorNormalization(editor); // before the draft-saver: drafts store normalized text
  editor.addEventListener('input', () => { syncGutter(); saveDraft(recordKey, editor.value); });
  editor.addEventListener('scroll', () => { gutter.scrollTop = editor.scrollTop; });
  wireEditorKeys(editor, () => { saveDraft(recordKey, editor.value); syncGutter(); });
  syncGutter();
  wireRunnerLabel(host);

  host.querySelector('[data-act="reset"]').addEventListener('click', () => {
    editor.value = prefill;
    clearDraft(recordKey);
    syncGutter();
  });

  host.querySelector('[data-act="reforge"]').addEventListener('click', () => {
    const sure = window.confirm(
      'Reforge from the canon? Your code in this stage is struck out and the canonical working takes its place. There is no counter-curse.',
    );
    if (!sure) return;
    editor.value = stage.canon;
    saveDraft(recordKey, editor.value);
    syncGutter();
  });

  runBtn.addEventListener('click', async () => {
    play('cast');
    runBtn.disabled = true;
    runBtn.textContent = '⏳ Casting…';
    consoleBox.hidden = false;
    consoleBox.innerHTML = '<span class="con-dim">The runes begin to glow…</span>';
    verdictBox.innerHTML = '';
    host.querySelector('.editor-wrap').classList.add('casting');

    const result = await runPython(editor.value, stage.validation, stage.setup || '');
    host.querySelector('.editor-wrap')?.classList.remove('casting');
    runBtn.disabled = false;
    runBtn.textContent = '▶ Cast the spell';

    const out = result.output
      ? escapeHtml(result.output)
      : '<span class="con-dim">(the spell produced no output)</span>';
    S.recordRun(result.ok);
    emit({ type: 'run' });
    if (result.ok) {
      play('yield');
      consoleBox.innerHTML = out;
      const next = stages[stageIndex + 1];
      // Carry the passing code forward: the next stage opens with it.
      if (next && !S.isWorkingStageDone(w.id, next.id)
        && !loadDraft(`${w.id}.${next.id}`, '').trim()) {
        saveDraft(`${w.id}.${next.id}`, editor.value);
      }
      const first = S.markWorkingStageDone(w.id, stage.id, stageIndex);
      const finished = stages.every((s2) => S.isWorkingStageDone(w.id, s2.id));
      verdictBox.innerHTML = `
        <div class="verdict verdict-pass">
          <span class="verdict-title">${finished
    ? 'The Great Working stands complete.'
    : 'The stage is forged.'}</span>
          ${finished
    ? 'Every stage holds. What you built here is yours to carry out of the Codex.'
    : 'The Working holds — the next stage opens with this very code.'}
        </div>`;
      castBolt(runBtn, verdictBox).then(() => burst(verdictBox));
      if (first) {
        grantXp(Number(stage.xp) || 0, `The Working advances — ${stage.title}`);
        emit({
          type: 'working-stage-forged', workingId: w.id, stageId: stage.id, actId: act.id,
        });
        if (finished) {
          emit({ type: 'working-complete', workingId: w.id, actId: act.id });
        }
      }
      onAdvance();
    } else {
      const harnessFault = result.stage === 'engine' || result.stage === 'fixture';
      if (!harnessFault) play('collapse');
      consoleBox.innerHTML = `${out}\n<span class="con-err">${escapeHtml(result.error || '')}</span>`;
      let title;
      let guidance;
      if (result.stage === 'fixture') {
        title = 'The Codex’s own fixture failed.';
        guidance = 'The fault is the Codex’s, not yours — your code was never judged. Cast again; if the fixture keeps failing, reload the page.';
      } else if (result.stage === 'validate') {
        title = 'The spell fired — but the ward rejected it.';
        guidance = 'Your code ran, yet it does not do what the stage demands. Read the ward’s message below the output.';
      } else {
        title = 'The spell collapsed.';
        guidance = 'Python could not finish your code. Read the last line of the message — it names the wound.';
      }
      verdictBox.innerHTML = `
        <div class="verdict verdict-fail">
          <span class="verdict-title">${title}</span>
          ${guidance}
        </div>`;
    }
  });
}

// The learner's take-home: the final stage of a Working as they left it,
// or its canon when the forge stands empty. Assembled entirely client-side.
function workingTakeHome(act, dl) {
  const wid = dl.fromWorking || (act.working && act.working.id) || '';
  let w = null;
  for (const a of curriculum.acts) {
    if (a.working && a.working.id === wid) { w = a.working; break; }
  }
  if (!w || !Array.isArray(w.stages) || !w.stages.length) return '';
  const last = w.stages[w.stages.length - 1];
  const draft = loadDraft(`${w.id}.${last.id}`, '');
  if (draft.trim()) return draft;
  return dl.fallbackCanon ? (last.canon || '') : '';
}

function mountRite(host, act) {
  const r = act.rite;
  const panel = el('details', { class: 'extra-panel rite-panel' });
  panel.innerHTML = `
    <summary>
      <span class="extra-kind">🝓 The Rite</span>
      <span class="extra-title">${escapeHtml(r.title)}</span>
      <span class="extra-status" data-role="rite-status"></span>
    </summary>
    <div class="extra-body" data-role="rite-body"></div>`;
  host.appendChild(panel);

  const statusEl = panel.querySelector('[data-role="rite-status"]');
  function refreshStatus() {
    const rec = S.getRiteProgress(r.id);
    statusEl.innerHTML = rec.done
      ? '<span class="tag tag-done">Kept</span>'
      : `<span class="tag tag-accent">+${Number(r.xp) || 0} XP</span>`;
  }
  refreshStatus();

  let mounted = false;
  panel.addEventListener('toggle', () => {
    if (!panel.open || mounted) return;
    mounted = true;
    mountRiteBody(panel.querySelector('[data-role="rite-body"]'), act, r, refreshStatus);
  });
}

function mountRiteBody(body, act, r, refreshStatus) {
  const quiz = Array.isArray(r.quiz) ? r.quiz : [];
  const checklist = Array.isArray(r.checklist) ? r.checklist : [];
  const rec0 = S.getRiteProgress(r.id);

  const dl = r.download;
  const takeHome = dl && dl.filename ? workingTakeHome(act, dl) : '';
  const downloadHtml = takeHome
    ? `<p><a class="btn" download="${escapeHtml(dl.filename)}"
         href="data:text/x-python;charset=utf-8,${encodeURIComponent(takeHome)}">⤓ Carry the Working out — ${escapeHtml(dl.filename)}</a></p>
       <p class="empty-note">The final stage of your Great Working, as you left it —
       or its canon, if your forge stands empty. It runs anywhere Python does.</p>`
    : '';

  body.innerHTML = `
    ${sectionsHtml(r.sections)}
    <h2 class="section-h">🕯 The Questioning</h2>
    <p class="prose">${rec0.quizPassed
    ? 'You have already withstood this questioning. Answer again if you wish to test the scar.'
    : 'Answer truly. Wrong answers cost nothing here.'}</p>
    <div data-role="rite-quiz"></div>
    <h2 class="section-h">⛧ The Fieldwork</h2>
    <p class="prose">These deeds are done beyond the Codex’s sight, on your own machine.
    No ward watches them — mark each only when it is true. Your word is the only seal here.</p>
    <div class="rite-checklist" data-role="rite-checklist"></div>
    ${downloadHtml}
    <div data-role="rite-result" role="status" aria-live="polite"></div>`;

  const resultHost = body.querySelector('[data-role="rite-result"]');

  function maybeRiteComplete() {
    refreshStatus();
    const rec = S.getRiteProgress(r.id);
    if (!rec.quizPassed || !checklist.every((c) => rec.checks[c.id])) return;
    if (S.markRiteDone(r.id)) {
      grantXp(Number(r.xp) || 0, `The Rite is kept — ${r.title}`);
      emit({ type: 'rite-complete', riteId: r.id, actId: act.id });
      resultHost.innerHTML = `
        <div class="verdict verdict-pass">
          <span class="verdict-title">The Rite is kept.</span>
          What was learned inside the Codex now lives outside it.
        </div>`;
    }
    refreshStatus();
  }

  // The questioning: rite quizzes are conceptual — answered here, never executed.
  const qHost = body.querySelector('[data-role="rite-quiz"]');
  const solvedFlags = quiz.map(() => false);
  quiz.forEach((q, qi) => {
    renderQuizQuestion(qHost, q, (missed) => {
      solvedFlags[qi] = true;
      S.recordQuestionOutcome(`${r.id}:q${qi}`, !missed, qHash(q.q));
      if (solvedFlags.every(Boolean)) {
        S.markRiteQuizPassed(r.id);
        maybeRiteComplete();
      }
    }, { number: qi + 1 });
  });

  const listHost = body.querySelector('[data-role="rite-checklist"]');
  const rec = S.getRiteProgress(r.id);
  listHost.innerHTML = checklist.map((c) => `
    <label class="rite-check">
      <input type="checkbox" data-check="${escapeHtml(c.id)}" ${rec.checks[c.id] ? 'checked' : ''}>
      <span>${escapeHtml(c.text)}</span>
    </label>`).join('');
  listHost.addEventListener('change', (e) => {
    const box = e.target.closest('input[data-check]');
    if (!box) return;
    S.setRiteCheck(r.id, box.dataset.check, box.checked);
    maybeRiteComplete();
  });
}

// ---------------- lesson page ----------------

// One lesson-style section list (heading, prose, optional code, optional
// lore note) — shared by lessons and by the Rite's teaching block.
function sectionsHtml(sections) {
  return (Array.isArray(sections) ? sections : []).map((sec) => `
    <h2 class="section-h">${escapeHtml(sec.heading)}</h2>
    <div class="prose">${prose(sec.body)}</div>
    ${sec.code ? codeBlock(sec.code) : ''}
    ${sec.note ? `<div class="lore-note"><span class="rune">🜏</span><div class="prose">${prose(sec.note)}</div></div>` : ''}
  `).join('');
}

export function renderLesson(root, lessonId) {
  const found = findLesson(lessonId);
  if (!found) { renderMissing(root); return; }
  const { act, actIndex, lesson, lessonIndex } = found;
  if (!S.isLessonUnlocked(curriculum, actIndex, lessonIndex)) {
    root.innerHTML = `
      <div class="crumbs"><a href="#/">The Map</a> / <a href="#/act/${act.id}">Act ${escapeHtml(act.numeral)}</a></div>
      <div class="panel center">
        <h1>Not yet.</h1>
        <p class="empty-note">The Codex reveals its pages in order. Finish the previous trial first.</p>
        <p><a class="btn btn-ghost" href="#/act/${act.id}">Back to ${escapeHtml(act.title)}</a></p>
      </div>`;
    return;
  }

  preboot(); // start summoning Python while they read

  // The app remembers the exact surface the learner last stood in.
  S.setResume(
    `#/lesson/${lesson.id}`,
    `Trial ${lessonIndex + 1} — ${lesson.title} · Act ${act.numeral}, ${act.title}`,
  );

  root.innerHTML = `
    <div class="crumbs">
      <a href="#/">The Map</a> /
      <a href="#/act/${act.id}">Act ${escapeHtml(act.numeral)}: ${escapeHtml(act.title)}</a> /
      Trial ${lessonIndex + 1}
    </div>
    <header class="lesson-header">
      <span class="tag tag-accent">Trial ${lessonIndex + 1} of ${act.lessons.length}</span>
      <h1>${escapeHtml(lesson.title)}</h1>
      <p class="lesson-concept-line">You will learn: <strong>${escapeHtml(lesson.concept)}</strong></p>
    </header>
    <div class="narrative">${prose(lesson.narrative)}</div>
    ${sectionsHtml(lesson.sections)}
    <section class="challenge-panel" id="challenge"></section>
    <section class="scrying" id="scrying"></section>
    <section class="quiz" id="quiz"></section>
    <section class="extras" id="extras"></section>
    <footer class="lesson-footer" id="lesson-footer"></footer>`;

  // The grimoire writes itself once; every later visit renders instantly.
  if (!S.getLessonProgress(lesson.id).seen) {
    typewriter(root.querySelector('.narrative'));
  }
  S.markSeen(lesson.id);
  mountChallenge(root.querySelector('#challenge'), lesson, () => refreshFooter());
  mountScrying(root.querySelector('#scrying'), lesson);
  mountQuiz(root.querySelector('#quiz'), lesson, () => refreshFooter());
  mountExtras(root.querySelector('#extras'), lesson);

  const footerHost = root.querySelector('#lesson-footer');
  function refreshFooter() {
    const rec = S.getLessonProgress(lesson.id);
    const complete = S.isLessonComplete(lesson.id);
    const next = act.lessons[lessonIndex + 1];
    let forward = '';
    if (complete) {
      forward = next
        ? `<a class="btn" href="#/lesson/${next.id}">Next trial: ${escapeHtml(next.title)} →</a>`
        : `<a class="btn btn-danger" href="#/boss/${act.id}">Face the warden: ${escapeHtml(act.boss.title)} ☠</a>`;
    } else {
      const parts = [];
      if (!rec.challenge) parts.push('pass the trial');
      if (!rec.quiz) parts.push('survive the interrogation');
      forward = `<span class="empty-note">To proceed: ${parts.join(' and ')}.</span>`;
    }
    footerHost.innerHTML = `
      <a class="btn btn-ghost" href="#/act/${act.id}">← ${escapeHtml(act.title)}</a>
      ${forward}`;
  }
  refreshFooter();
}

// ---------------- the forge (code challenge) ----------------

// The one true forge: editor, drafts, hint ladder, verdicts, and — for
// lessons and extras — the Codex's own rescue. recordKey keys drafts and
// persistence (a lesson id, or an extra's stable id). Boss forges do NOT
// use this: the arena keeps its own merciless forge (mountBossForge).
// showSolution hides the dead apprentice's notes (the Re-forge offers
// none); onAid(kind) fires the moment any aid is taken — a whisper or
// the notes — so a running Re-forge attempt can be dirtied at once.
function mountForge(host, {
  recordKey, challenge: ch, passed, onPass, onFail = null, rescue = true,
  showSolution = true, onAid = null,
}) {
  const hints = Array.isArray(ch.hints) ? ch.hints : [];
  host.innerHTML = `
    <div class="forge">
      <div class="forge-head">
        <span class="dots"><i></i><i></i><i></i></span>
        <span>The Forge — Python 3</span>
      </div>
      <div class="editor-wrap">
        <div class="editor-gutter" aria-hidden="true">1</div>
        <textarea class="editor" spellcheck="false" autocapitalize="off" autocorrect="off"
          aria-label="${EDITOR_LABEL}"></textarea>
      </div>
      <div class="forge-actions">
        <button class="btn" data-act="run">▶ Cast the spell</button>
        <button class="btn btn-ghost" data-act="reset">Reset</button>
        ${hints.length ? '<button class="btn btn-ghost" data-act="hint">Whisper a hint</button>' : ''}
        <span class="runner-state" data-role="runner-state"></span>
      </div>
      <div class="hint-box" data-role="hints"></div>
      <div class="rescue-box" data-role="rescue"></div>
      <div class="console" data-role="console" role="status" aria-live="polite" hidden></div>
      <div data-role="verdict" role="status" aria-live="polite"></div>
      ${showSolution ? `<details class="solution-reveal">
        <summary>☠ Open the dead apprentice’s notes</summary>
        <p class="solution-warning">Study it, close it, and rewrite it from nothing —
        apprentices have always learned so.</p>
        ${codeBlock(ch.solution)}
      </details>` : ''}
    </div>`;

  const editor = host.querySelector('textarea.editor');
  const gutter = host.querySelector('.editor-gutter');
  const consoleBox = host.querySelector('[data-role="console"]');
  const verdictBox = host.querySelector('[data-role="verdict"]');
  const hintsBox = host.querySelector('[data-role="hints"]');
  const rescueBox = host.querySelector('[data-role="rescue"]');
  const runBtn = host.querySelector('[data-act="run"]');
  const solutionDetails = host.querySelector('details.solution-reveal');

  editor.value = loadDraft(recordKey, ch.starter);
  if (passed) {
    verdictBox.innerHTML = `
      <div class="verdict verdict-pass">
        <span class="verdict-title">Already conquered.</span>
        You may refine your spell freely — the mark is yours.
      </div>`;
  }

  function syncGutter() {
    const lines = editor.value.split('\n').length || 1;
    gutter.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
    gutter.scrollTop = editor.scrollTop;
  }
  wireEditorNormalization(editor); // before the draft-saver: drafts store normalized text
  editor.addEventListener('input', () => { syncGutter(); saveDraft(recordKey, editor.value); });
  editor.addEventListener('scroll', () => { gutter.scrollTop = editor.scrollTop; });
  wireEditorKeys(editor, () => { saveDraft(recordKey, editor.value); syncGutter(); });
  syncGutter();

  wireRunnerLabel(host);

  // The hint ladder renders from the persisted count: a reload keeps
  // every whisper already given, and re-reveals never recount the stat.
  function appendHint(idx, { stirred = false } = {}) {
    const div = el('div', { class: 'hint-item' },
      `<strong>${stirred ? 'The Codex stirs. ' : ''}Whisper ${idx + 1}:</strong> ${prose(hints[idx]).replace(/^<p>|<\/p>$/g, '')}`);
    hintsBox.appendChild(div);
  }
  for (let i = 0; i < Math.min(S.getHintsRevealed(recordKey), hints.length); i += 1) {
    appendHint(i);
  }

  const hintBtn = host.querySelector('[data-act="hint"]');
  if (hintBtn) {
    hintBtn.addEventListener('click', () => {
      const revealed = S.getHintsRevealed(recordKey);
      if (revealed >= hints.length) {
        toast({
          icon: '🤫',
          title: 'The Codex is silent',
          sub: 'No more whispers remain — but fail on, and the Codex will open the dead apprentice’s notes.',
        });
        return;
      }
      appendHint(revealed);
      S.markHintRevealed(recordKey, revealed + 1);
      if (onAid) onAid('hint');
    });
  }

  host.querySelector('[data-act="reset"]').addEventListener('click', () => {
    editor.value = ch.starter;
    clearDraft(recordKey);
    syncGutter();
  });

  if (solutionDetails) {
    solutionDetails.addEventListener('toggle', (e) => {
      if (e.target.open) {
        S.markSolutionViewed(recordKey);
        emit({ type: 'solution-viewed', lessonId: recordKey });
        if (onAid) onAid('solution');
      }
    });
  }

  // The 6-fail tier: a kindred working when the content provides one,
  // else the Codex offers the notes itself. Its initiative, never a plea.
  function showDeepRescue() {
    if (ch.workedExample) {
      rescueBox.innerHTML = `
        <div class="rescue-panel">
          <p class="rescue-lead">🜏 The Codex stirs.</p>
          <p class="rescue-text">The Codex shows you a kindred working.</p>
          <div class="prose">${prose(ch.workedExample.intro || '')}</div>
          ${codeBlock(ch.workedExample.code)}
          <div class="prose">${prose(ch.workedExample.outro || '')}</div>
        </div>`;
      return;
    }
    if (!solutionDetails) return; // a forge without notes rescues with nothing
    if (rescueBox.querySelector('[data-act="open-notes"]')) return;
    rescueBox.innerHTML = `
      <div class="rescue-panel">
        <p class="rescue-lead">🜏 The Codex stirs.</p>
        <p class="rescue-text">Open the dead apprentice’s notes. Study it, close it,
        rewrite it from nothing.</p>
        <button class="btn btn-ghost" data-act="open-notes">☠ Open the dead apprentice’s notes</button>
      </div>`;
    rescueBox.querySelector('[data-act="open-notes"]').addEventListener('click', () => {
      solutionDetails.open = true; // fires toggle — the bookkeeping stays honest
      solutionDetails.scrollIntoView({ block: 'nearest' });
    });
  }

  // Every third consecutive misfire, the Codex acts of its own accord.
  function maybeRescue(fails) {
    if (fails % 3 === 0) {
      const revealed = S.getHintsRevealed(recordKey);
      if (revealed < hints.length) {
        appendHint(revealed, { stirred: true });
        S.markHintRevealed(recordKey, revealed + 1);
        if (onAid) onAid('hint');
      }
    }
    if (fails >= 6) showDeepRescue();
  }

  runBtn.addEventListener('click', async () => {
    play('cast');
    runBtn.disabled = true;
    runBtn.textContent = '⏳ Casting…';
    consoleBox.hidden = false;
    consoleBox.innerHTML = '<span class="con-dim">The runes begin to glow…</span>';
    verdictBox.innerHTML = '';
    host.querySelector('.editor-wrap').classList.add('casting');

    const result = await runPython(editor.value, ch.validation);
    host.querySelector('.editor-wrap')?.classList.remove('casting');
    runBtn.disabled = false;
    runBtn.textContent = '▶ Cast the spell';

    const plotHtml = result.plot
      ? `<img class="plot-render" alt="The figure your code drew" src="data:image/png;base64,${result.plot}">`
      : '';
    const out = (result.output
      ? escapeHtml(result.output)
      : '<span class="con-dim">(the spell produced no output)</span>') + plotHtml;
    if (result.ok) {
      play('yield');
      consoleBox.innerHTML = out;
      S.recordRun(true);
      S.resetFails(recordKey);
      rescueBox.innerHTML = '';
      emit({ type: 'run' });
      verdictBox.innerHTML = `
        <div class="verdict verdict-pass">
          <span class="verdict-title">The ward yields.</span>
          ${escapeHtml(ch.successText)}
        </div>`;
      castBolt(runBtn, verdictBox).then(() => burst(verdictBox));
      if (onPass) onPass();
    } else {
      if (result.stage !== 'engine') play('collapse');
      consoleBox.innerHTML = `${out}\n<span class="con-err">${escapeHtml(result.error || '')}</span>`;
      S.recordRun(false);
      emit({ type: 'run' });
      const title = result.stage === 'validate'
        ? 'The spell fired — but the ward rejected it.'
        : 'The spell collapsed.';
      const guidance = result.stage === 'validate'
        ? 'Your code ran, yet it does not do what the trial demands. Read the ward’s message below the output.'
        : 'Python could not finish your code. Read the last line of the message — it names the wound.';
      verdictBox.innerHTML = `
        <div class="verdict verdict-fail">
          <span class="verdict-title">${title}</span>
          ${guidance}
        </div>`;
      // Engine faults are not the learner's — they never count as fails.
      if (result.stage !== 'engine') {
        const fails = S.recordFail(recordKey);
        if (rescue) maybeRescue(fails);
      }
      if (onFail) onFail();
    }
  });
}

function mountChallenge(host, lesson, onChange) {
  const ch = lesson.challenge;
  const rec = S.getLessonProgress(lesson.id);
  host.innerHTML = `
    <span class="challenge-label">⚔ The Trial</span>
    <h2>${escapeHtml(ch.title)}</h2>
    <div class="prose">${prose(ch.prompt)}</div>
    <div data-role="forge-host"></div>
    <div data-role="reforge-zone"></div>`;
  const reforgeZone = host.querySelector('[data-role="reforge-zone"]');
  mountForge(host.querySelector('[data-role="forge-host"]'), {
    recordKey: lesson.id,
    challenge: ch,
    passed: rec.challenge,
    // Aid taken in THIS forge during a running Re-forge attempt (the
    // notes sit right here, after all) dirties that attempt at once.
    onAid: () => S.dirtyReforge(lesson.id),
    onPass: () => {
      const first = S.markChallenge(lesson.id);
      if (first) {
        grantXp(ch.xp, `Trial passed — ${lesson.title}`);
        emit({ type: 'challenge-solved', lessonId: lesson.id });
        maybeLessonComplete(lesson);
        mountReforgeZone(reforgeZone, lesson, ch);
      }
      onChange();
    },
    onFail: () => onChange(),
  });
  mountReforgeZone(reforgeZone, lesson, ch);
}

// ---------------- the re-forge (sigil redemption, zero XP) ----------------
// A conquered trial may be forged again from nothing. No XP, no record
// downgrade — the only stake is the Unaided sigil, earned ONLY when the
// re-attempt takes no whisper and no notes. The attempt's cleanliness is
// persisted the moment it starts and broken the moment aid is taken, so
// reloading mid-attempt changes nothing. One-Cast is not on offer here:
// history does not re-forge.
function mountReforgeZone(zone, lesson, ch) {
  const rec = S.getLessonProgress(lesson.id);
  if (!rec.challenge) { zone.innerHTML = ''; return; }
  const sig = S.sigilsFor(lesson.id);
  const active = S.getReforge(lesson.id);
  const reforgeKey = `reforge.${lesson.id}`;
  zone.innerHTML = `
    <div class="reforge-panel">
      <p class="reforge-lead">⚒ The Re-forge</p>
      <p class="reforge-text">A conquered trial may be cast again from nothing — no XP,
      nothing to lose. ${sig.unaided
    ? 'The <strong>Unaided</strong> sigil is already yours; re-forge for the craft alone.'
    : 'Pass with no whisper and no notes, and the <strong>Unaided</strong> sigil is yours.'}</p>
      <div data-role="reforge-host"></div>
    </div>`;
  const hostEl = zone.querySelector('[data-role="reforge-host"]');

  const mountAttempt = () => {
    mountForge(hostEl, {
      recordKey: reforgeKey,
      challenge: ch,
      passed: false,
      rescue: false,
      showSolution: false,
      onAid: () => S.dirtyReforge(lesson.id),
      onPass: () => {
        const hadUnaided = S.sigilsFor(lesson.id).unaided;
        const clean = S.finishReforge(lesson.id);
        if (clean === null) return; // no attempt standing — nothing closes twice
        if (clean && !hadUnaided) {
          toast({
            icon: '🜃',
            title: 'Sigil earned — Unaided',
            sub: 'Re-forged with no whisper and no notes. The mark is yours.',
          });
        } else if (!clean) {
          toast({
            icon: '⚒',
            title: 'Re-forged',
            sub: 'Aid was taken along the way — the Unaided sigil waits for a cleaner casting.',
          });
        }
        emit({ type: 'reforge-complete', lessonId: lesson.id, clean });
      },
    });
  };

  if (active) {
    // An attempt in flight survives reloads — its clean flag came with it.
    mountAttempt();
  } else {
    hostEl.innerHTML = '<button class="btn btn-ghost" data-act="begin-reforge">⚒ Re-forge this working</button>';
    hostEl.querySelector('[data-act="begin-reforge"]').addEventListener('click', () => {
      S.beginReforge(lesson.id);
      clearDraft(reforgeKey); // the fresh attempt opens on the bare starter
      mountReforgeZone(zone, lesson, ch);
    });
  }
}

// ---------------- the scrying (trace prediction) ----------------
// Optional, never gating: read a working, say what it will print before
// the machine speaks. First true reading of each item pays 5 XP.

function mountScrying(host, lesson) {
  const items = Array.isArray(lesson.trace) ? lesson.trace : [];
  if (!items.length) { host.innerHTML = ''; return; }
  host.innerHTML = `
    <h2 class="section-h">🔮 The Scrying</h2>
    <p class="prose">Do not cast these — read them. Say what the machine will say
    before it is allowed to speak. The first true reading of each working pays 5 XP.</p>
    <div data-role="trace-items"></div>`;
  const itemsHost = host.querySelector('[data-role="trace-items"]');
  items.forEach((t, i) => {
    const wrap = el('div', { class: 'trace-item' }, codeBlock(t.code));
    itemsHost.appendChild(wrap);
    renderQuizQuestion(wrap, {
      q: t.q, options: t.options, answer: t.answer, explain: t.explain,
    }, (missed) => {
      // The Leitner ledger learns of every scrying — the Vigil will
      // draw on these wounds in a later wave.
      S.recordQuestionOutcome(`${lesson.id}:trace:${t.id}`, !missed, qHash(t.q));
      if (!missed && !S.isTraceSolved(lesson.id, t.id)) {
        S.markTraceSolved(lesson.id, t.id);
        grantXp(5, 'The scrying read true');
        emit({ type: 'trace-solved', lessonId: lesson.id, traceId: t.id });
      }
    }, { number: i + 1 });
  });
}

// ---------------- extras (echoes, cursed scrolls, ward-craft) ----------------
// Optional side workings after the interrogation. Real XP, paid once;
// nothing gates on them — the descent never waits here.

const EXTRA_LABELS = {
  echo: '⟳ Echoes in the Stone',
  cursed: '☠ Cursed Scroll',
  ward: '⚒ Forge the Ward',
  refactor: '⚒ The Second Hand',
};

function mountExtras(host, lesson) {
  const extras = Array.isArray(lesson.extras) ? lesson.extras : [];
  if (!extras.length) { host.innerHTML = ''; return; }
  host.innerHTML = `
    <h2 class="section-h">🜏 Beyond the Trial</h2>
    <p class="prose">Side workings, cut from the same stone. Nothing ahead is sealed
    behind them — but what they pay is real.</p>`;
  extras.forEach((ex) => {
    const solved = S.isExtraSolved(lesson.id, ex.id);
    const panel = el('details', { class: `extra-panel extra-${ex.kind}` });
    panel.innerHTML = `
      <summary>
        <span class="extra-kind">${EXTRA_LABELS[ex.kind] || '🜏 Side Working'}</span>
        <span class="extra-title">${escapeHtml(ex.title)}</span>
        <span class="extra-status" data-role="extra-status">${solved
    ? '<span class="tag tag-done">Done</span>'
    : `<span class="tag tag-accent">+${Number(ex.xp) || 0} XP</span>`}</span>
      </summary>
      <div class="extra-body">
        <div class="prose">${prose(ex.prompt)}</div>
        <div data-role="extra-forge"></div>
      </div>`;
    host.appendChild(panel);
    let mounted = false;
    panel.addEventListener('toggle', () => {
      if (!panel.open || mounted) return;
      mounted = true;
      mountForge(panel.querySelector('[data-role="extra-forge"]'), {
        recordKey: ex.id,
        challenge: ex,
        passed: S.isExtraSolved(lesson.id, ex.id),
        onPass: () => {
          const first = S.markExtraSolved(lesson.id, ex.id);
          if (first) {
            grantXp(Number(ex.xp) || 0, `${EXTRA_LABELS[ex.kind] || 'Side working'} — ${ex.title}`);
            emit({
              type: 'extra-solved', lessonId: lesson.id, extraId: ex.id, kind: ex.kind,
            });
            const status = panel.querySelector('[data-role="extra-status"]');
            if (status) status.innerHTML = '<span class="tag tag-done">Done</span>';
          }
        },
      });
    });
  });
}

function maybeLessonComplete(lesson) {
  if (S.isLessonComplete(lesson.id)) {
    grantXp(lesson.xp, `Trial complete — ${lesson.title}`);
    emit({ type: 'lesson-complete', lessonId: lesson.id });
  }
}

// ---------------- the interrogation (quiz) ----------------

function mountQuiz(host, lesson, onChange) {
  const rec = S.getLessonProgress(lesson.id);
  const done = rec.quiz;
  const state = lesson.quiz.map(() => ({ solved: false, missed: false }));

  host.innerHTML = `
    <h2 class="section-h">🕯 The Interrogation</h2>
    <p class="prose">${done
      ? 'You have already withstood this questioning. Answer again if you wish to test the scar.'
      : 'Answer truly. Wrong answers cost nothing here — but the wardens will not be so kind.'}</p>
    <div data-role="prophecy"></div>
    <div data-role="questions"></div>
    <div data-role="quiz-result"></div>`;

  const qHost = host.querySelector('[data-role="questions"]');
  const resultHost = host.querySelector('[data-role="quiz-result"]');
  const repaintProphecy = mountProphecy(
    host.querySelector('[data-role="prophecy"]'), lesson, lesson.quiz.length, done,
  );

  lesson.quiz.forEach((q, qi) => {
    renderQuizQuestion(qHost, q, (missed) => {
      state[qi].solved = true;
      state[qi].missed = missed;
      S.recordQuestionOutcome(`${lesson.id}:q${qi}`, !missed, qHash(q.q));
      checkQuizDone();
    }, { number: qi + 1 });
  });

  function checkQuizDone() {
    if (!state.every((s) => s.solved)) return;
    const perfect = state.every((s) => !s.missed);
    const first = S.markQuiz(lesson.id, perfect);
    resultHost.innerHTML = `
      <div class="verdict verdict-pass">
        <span class="verdict-title">${perfect ? 'Flawless. Not a single crack for the dark to enter.' : 'You survived the questioning.'}</span>
      </div>`;
    // The sealed prophecy resolves exactly once, against the count of
    // first-pick true answers. An exact reading pays its 10 XP here.
    const trueCount = state.filter((s) => !s.missed).length;
    const resolved = S.resolveProphecy(lesson.id, trueCount);
    if (resolved && resolved.hit) grantXp(10, 'The prophecy held.');
    repaintProphecy();
    if (first) {
      grantXp(QUIZ_XP + (perfect ? QUIZ_PERFECT_BONUS : 0),
        perfect ? 'Interrogation — flawless' : 'Interrogation survived');
      emit({ type: 'quiz-complete', lessonId: lesson.id, perfect });
      maybeLessonComplete(lesson);
    }
    onChange();
  }
}

// ---------------- the sealed prophecy (calibration, +10 XP on exact) ----------------
// One tap before the questioning begins: how many of the N will fall
// true? The guess persists the moment it is made (no re-rolls after a
// reload), resolves once at completion, and may always be left sealed
// with no penalty of any kind. Returns a repaint handle.
function mountProphecy(hostEl, lesson, total, quizDoneAtMount) {
  function paint() {
    // Live read: once the interrogation is done there is nothing left
    // to foresee, even within the same mount.
    const quizDone = quizDoneAtMount || Boolean(S.getLessonProgress(lesson.id).quiz);
    const p = S.getProphecy(lesson.id);
    if (p && typeof p.guess === 'number') {
      let line;
      if (typeof p.actual === 'number') {
        line = p.hit
          ? `The prophecy held: you foretold ${p.guess} of ${total}, and so it fell.`
          : `The prophecy broke: you foretold ${p.guess} of ${total}; the truth was ${p.actual}.`;
      } else {
        line = `The prophecy is sealed: ${p.guess} of ${total}.`;
      }
      hostEl.innerHTML = `
        <div class="prophecy-panel">
          <p class="prophecy-line" role="status">🜄 ${escapeHtml(line)}</p>
        </div>`;
      return;
    }
    if (quizDone) { hostEl.innerHTML = ''; return; } // nothing left to foresee
    const chips = Array.from({ length: total + 1 }, (_, k) => `
        <button class="btn btn-ghost prophecy-chip" data-guess="${k}">${k}</button>`).join('');
    hostEl.innerHTML = `
      <div class="prophecy-panel" role="group" aria-label="The sealed prophecy">
        <p class="prophecy-line">🜄 The Codex seals a prophecy: how many of the ${total} will you answer true?</p>
        <div class="prophecy-chips">
          ${chips}
          <button class="btn btn-ghost prophecy-skip" data-skip>Leave it sealed</button>
        </div>
        <p class="prophecy-note">An exact reading pays 10 XP, once. A wrong one costs nothing — the Codex only measures.</p>
      </div>`;
    hostEl.querySelectorAll('[data-guess]').forEach((btn) => {
      btn.addEventListener('click', () => {
        S.setProphecy(lesson.id, Number(btn.dataset.guess));
        paint();
      });
    });
    hostEl.querySelector('[data-skip]').addEventListener('click', () => {
      hostEl.innerHTML = ''; // left sealed — no penalty, ever
    });
  }
  paint();
  return paint;
}

// Quiz strings render the full inline markdown subset (`code`, **bold**,
// *italic*) with code spans shielded from emphasis parsing.
function inlineOption(text) {
  return mdInline(text);
}

// One retrievable question: option buttons, q-result, q-explain —
// the exact interaction of the interrogation, shared by lesson
// quizzes and the Night Vigil. Calls onSolved(missed) once, when the
// right answer lands; missed is true if any wrong pick came first.
function renderQuizQuestion(hostEl, q, onSolved, { number = 0 } = {}) {
  const box = el('div', { class: 'quiz-q' });
  const opts = q.options.map((opt, oi) => `
      <button class="quiz-opt" data-o="${oi}">
        <span class="opt-key">${'ABCD'[oi]}.</span>
        <span>${inlineOption(opt)}</span>
      </button>`).join('');
  box.innerHTML = `
      <p class="q-text">${number ? `${number}. ` : ''}${inlineOption(q.q)}</p>
      <div class="quiz-opts">${opts}</div>
      <div class="q-result" data-role="qr"></div>
      <div class="q-explain" hidden></div>`;
  hostEl.appendChild(box);

  let solved = false;
  let missed = false;
  const explain = box.querySelector('.q-explain');
  const qr = box.querySelector('[data-role="qr"]');
  box.querySelectorAll('.quiz-opt').forEach((btn) => {
    btn.addEventListener('click', () => {
      const oi = Number(btn.dataset.o);
      if (solved) return;
      play('tick');
      if (oi === q.answer) {
        solved = true;
        btn.classList.add('sel-right');
        box.querySelectorAll('.quiz-opt').forEach((b) => { b.disabled = true; });
        qr.textContent = missed ? 'Correct — at last.' : 'Correct.';
        qr.className = 'q-result ok';
        explain.hidden = false;
        explain.innerHTML = inlineOption(q.explain);
        burst(btn);
        onSolved(missed);
      } else {
        missed = true;
        btn.classList.add('sel-wrong');
        btn.disabled = true;
        qr.textContent = 'Wrong. The dark keeps count of nothing here — try again.';
        qr.className = 'q-result bad';
      }
    });
  });
  return box;
}

// ---------------- boss ----------------

export function renderBoss(root, actId) {
  const found = findAct(actId);
  if (!found) { renderMissing(root); return; }
  const { act, actIndex } = found;
  const boss = act.boss;
  const alreadyDown = S.isBossDefeated(act.id);
  if (!S.isBossUnlocked(curriculum, actIndex) && !alreadyDown) {
    root.innerHTML = `
      <div class="crumbs"><a href="#/">The Map</a> / <a href="#/act/${act.id}">Act ${escapeHtml(act.numeral)}</a></div>
      <div class="panel center">
        <h1>The warden ignores you.</h1>
        <p class="empty-note">Complete every trial of ${escapeHtml(act.title)} before you knock on this door.</p>
        <p><a class="btn btn-ghost" href="#/act/${act.id}">Back</a></p>
      </div>`;
    return;
  }

  preboot();

  S.setResume(`#/boss/${act.id}`, `${boss.title} · warden of Act ${act.numeral}`);

  root.innerHTML = `
    <div class="crumbs"><a href="#/">The Map</a> / <a href="#/act/${act.id}">Act ${escapeHtml(act.numeral)}</a> / Boss</div>
    <div class="boss-arena" id="arena"></div>`;
  const arena = root.querySelector('#arena');

  const battle = {
    lives: 3,
    idx: 0,
    flawless: true,
    strikeFails: 0,
    items: [],
    order: [],
    maxHp: 0,
    hp: 0,
  };
  // The gauntlet's items are fixed for this mount: the act's own
  // questions plus, from Act III on, two wounds read from the ledger
  // of earlier acts. Retries reshuffle order but keep the same items.
  battle.items = boss.gauntlet.map((q, i) => ({ ...q, qid: `${act.id}-boss:g${i}` }));
  if (actIndex >= 2) {
    for (const entry of pickReviewForBoss(S.getState(), actIndex, 2)) {
      battle.items.push({ ...entry.q, qid: entry.qid, review: true });
    }
  }
  battle.order = battle.items.map((_, i) => i);
  battle.maxHp = battle.items.length + 1; // questions + the final working
  battle.hp = battle.maxHp;
  const hasReview = battle.items.some((it) => it.review);
  let narrated = false; // the warden's tale is told once per fresh encounter

  // The stage (figure + health) persists across gauntlet steps so the
  // strike animations and HP transitions play against a stable target.
  function stageHtml() {
    return `
      <div class="boss-stage">
        <div class="boss-figure" id="boss-figure" aria-hidden="true">${bossSvg(act.id)}</div>
        <div class="boss-name-plate">${escapeHtml(boss.title)}</div>
        <div class="boss-hpbar" aria-hidden="true"><i id="boss-hpfill" style="width:${(battle.hp / battle.maxHp) * 100}%"></i></div>
        <div class="boss-hptext" id="boss-hptext">Warden strength: ${battle.hp} / ${battle.maxHp}</div>
      </div>
      <div id="boss-flow"></div>`;
  }

  function flowEl() { return arena.querySelector('#boss-flow'); }
  function figureEl() { return arena.querySelector('#boss-figure'); }

  function updateHp() {
    const fill = arena.querySelector('#boss-hpfill');
    const text = arena.querySelector('#boss-hptext');
    if (fill) fill.style.width = `${(battle.hp / battle.maxHp) * 100}%`;
    if (text) text.textContent = `Warden strength: ${battle.hp} / ${battle.maxHp}`;
    // Wounded past reason, the warden enrages and the cinders thicken.
    const enraged = battle.hp <= 2 && battle.hp < battle.maxHp;
    const fig = figureEl();
    if (fig) fig.classList.toggle('enraged', enraged);
    setAmbient('boss', enraged ? 1.7 : 0.9);
  }

  function intro() {
    battle.hp = battle.maxHp;
    arena.innerHTML = stageHtml();
    flowEl().innerHTML = `
      <span class="challenge-label">☠ Warden of Act ${escapeHtml(act.numeral)}</span>
      <h1 class="boss-title">${escapeHtml(boss.title)}</h1>
      <div class="narrative">${prose(boss.narrative)}</div>
      <p class="prose">The trial has two movements: a <strong>gauntlet of ${battle.items.length} questions</strong>
      (you carry three lives — each wrong answer feeds one to the dark), then a
      <strong>final working of code</strong>. Every true answer wounds the warden;
      fall, and you begin the gauntlet anew. The final working is no sanctuary:
      after one spared misstep, every failed casting feeds a candle to the dark.${hasReview
        ? ' This warden has read the ledger of your old wounds — two of its questions are drawn from acts you thought closed.'
        : ''}</p>
      ${alreadyDown ? '<p class="prose"><em>You have already broken this warden. Fight again for pride, not power — no further XP awaits.</em></p>' : ''}
      <button class="btn btn-danger" id="begin">Begin the trial</button>
      <a class="btn btn-ghost" href="#/act/${act.id}">Withdraw</a>`;
    bossReveal(arena.querySelector('.boss-stage'), boss.title);
    if (!narrated && !alreadyDown) {
      typewriter(flowEl().querySelector('.narrative'));
    }
    narrated = true;
    flowEl().querySelector('#begin').addEventListener('click', () => {
      play('bell');
      battle.lives = 3;
      battle.idx = 0;
      battle.flawless = true;
      battle.hp = battle.maxHp;
      battle.won = false;
      updateHp();
      // Reshuffle question order each attempt so retries stay honest.
      for (let i = battle.order.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [battle.order[i], battle.order[j]] = [battle.order[j], battle.order[i]];
      }
      gauntletStep();
    });
  }

  function livesHtml() {
    return `<div class="lives" role="img" aria-label="${battle.lives} of 3 lives remain">${
      [0, 1, 2].map((i) => `<span aria-hidden="true" class="${i < battle.lives ? '' : 'lost'}">🕯️</span>`).join('')}</div>`;
  }

  function gauntletStep() {
    if (battle.idx >= battle.order.length) { finalChallenge(); return; }
    const q = battle.items[battle.order[battle.idx]];
    flowEl().innerHTML = `
      <span class="challenge-label">☠ ${escapeHtml(boss.title)}</span>
      ${livesHtml()}
      <p class="gauntlet-progress">Question ${battle.idx + 1} of ${battle.order.length}</p>
      <div class="quiz-q">
        <p class="q-text">${inlineOption(q.q)}</p>
        <div class="quiz-opts">
          ${q.options.map((opt, oi) => `
            <button class="quiz-opt" data-o="${oi}">
              <span class="opt-key">${'ABCD'[oi]}.</span><span>${inlineOption(opt)}</span>
            </button>`).join('')}
        </div>
        <div class="q-result" data-role="qr"></div>
        <div class="q-explain" hidden></div>
        <div class="mt" data-role="next"></div>
      </div>`;
    const flow = flowEl();
    const qr = flow.querySelector('[data-role="qr"]');
    const explain = flow.querySelector('.q-explain');
    const nextHost = flow.querySelector('[data-role="next"]');
    flow.querySelectorAll('.quiz-opt').forEach((btn) => {
      btn.addEventListener('click', () => {
        const oi = Number(btn.dataset.o);
        play('tick');
        S.recordQuestionOutcome(q.qid, oi === q.answer, qHash(q.q));
        flow.querySelectorAll('.quiz-opt').forEach((b) => { b.disabled = true; });
        explain.hidden = false;
        explain.innerHTML = inlineOption(q.explain);
        if (oi === q.answer) {
          btn.classList.add('sel-right');
          qr.textContent = 'Your spell strikes home. The warden recoils.';
          qr.className = 'q-result ok';
          battle.hp = Math.max(1, battle.hp - 1); // the last point falls only to code
          castBolt(btn, figureEl()).then(() => {
            hitFlash(figureEl());
            updateHp();
          });
        } else {
          btn.classList.add('sel-wrong');
          flow.querySelectorAll('.quiz-opt')[q.answer].classList.add('sel-right');
          battle.lives -= 1;
          battle.flawless = false;
          qr.textContent = `The warden strikes back — a candle gutters out. The true answer was ${'ABCD'[q.answer]}.`;
          qr.className = 'q-result bad';
          flow.querySelector('.lives').outerHTML = livesHtml();
          bossStrike(figureEl());
          play('bell');
          if (battle.lives <= 0) { fallen(); return; }
        }
        battle.idx += 1;
        const btnNext = el('button', { class: 'btn' }, battle.idx >= battle.order.length
          ? 'Face the final working →' : 'Next question →');
        btnNext.addEventListener('click', gauntletStep);
        nextHost.appendChild(btnNext);
        btnNext.focus(); // keyboard users continue from where they answered
      });
    });
  }

  function fallen() {
    const fig = figureEl();
    if (fig) {
      // The warden looms over the fallen.
      fig.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.18) translateY(10px)' }],
        { duration: 900, easing: 'ease-out', fill: 'forwards' },
      );
    }
    flowEl().innerHTML = `
      <h1 class="boss-title">You are cast down.</h1>
      <div class="narrative"><p>${escapeHtml(boss.defeatText)}</p></div>
      <button class="btn btn-danger" id="again">Rise and try again</button>
      <a class="btn btn-ghost" href="#/act/${act.id}">Retreat and study</a>`;
    flowEl().querySelector('#again').addEventListener('click', intro);
  }

  function finalChallenge() {
    battle.strikeFails = 0;
    const ch = boss.finalChallenge;
    flowEl().innerHTML = `
      <span class="challenge-label">☠ The Final Working</span>
      <h2 class="boss-title">${escapeHtml(ch.title)}</h2>
      ${livesHtml()}
      <div class="prose">${prose(ch.prompt)}</div>
      <div id="boss-forge"></div>`;
    // Reuse the forge via a pseudo-lesson wrapper so drafts and grading
    // behave identically to ordinary trials.
    const pseudo = {
      id: `${act.id}-boss`,
      title: boss.title,
      xp: 0,
      challenge: { ...ch, successText: 'The warden kneels.' },
    };
    mountBossForge(flowEl().querySelector('#boss-forge'), pseudo, {
      onPass: () => victory(),
      // The ward bites back: the first failed Strike per attempt is
      // spared; every one after costs a candle. Any failed Strike
      // breaks flawless.
      onFail: () => {
        battle.flawless = false;
        battle.strikeFails += 1;
        if (battle.strikeFails === 1) return { free: true, fallen: false };
        battle.lives -= 1;
        const livesEl = flowEl().querySelector('.lives');
        if (livesEl) livesEl.outerHTML = livesHtml();
        bossStrike(figureEl());
        play('bell');
        if (battle.lives <= 0) { fallen(); return { free: false, fallen: true }; }
        return { free: false, fallen: false };
      },
    });
  }

  async function victory() {
    if (battle.won) return; // a second killing blow lands on nothing
    battle.won = true;
    // The Economy of Awe: no toast speaks before the banner stands.
    holdToasts();
    const first = S.markBossDefeated(act.id);
    const bonus = battle.flawless ? boss.flawlessBonus : 0;
    // The killing blow: strength to zero, then the warden burns away.
    battle.hp = 0;
    updateHp();
    await dissolve(figureEl());
    arena.innerHTML = `
      <div class="boss-defeated-banner">
        <h2>☠ ${escapeHtml(boss.title)} has fallen.</h2>
        <div class="narrative"><p>${escapeHtml(boss.victoryText)}</p></div>
        ${first ? `<p class="prose center">Spoils: <strong><span data-role="spoils">0</span> XP</strong>${bonus ? ' <em>(flawless gauntlet bonus included)</em>' : ''}</p>` : '<p class="empty-note">The warden was already yours; no new spoils.</p>'}
        <p>
          ${curriculum.acts[actIndex + 1]
    ? `<a class="btn" href="#/act/${curriculum.acts[actIndex + 1].id}">Descend to Act ${escapeHtml(curriculum.acts[actIndex + 1].numeral)} →</a>`
    : '<a class="btn" href="#/profile">Behold what you have become →</a>'}
          <a class="btn btn-ghost" href="#/">The Map</a>
        </p>
      </div>`;
    if (first) {
      countUp(arena.querySelector('[data-role="spoils"]'), 0, boss.xp + bonus, { duration: 1300 });
      grantXp(boss.xp + bonus, `Warden defeated — ${boss.title}`);
      emit({ type: 'boss-defeated', actId: act.id });
      if (S.grantEmber('warden')) {
        toast({
          icon: '🜂',
          title: 'An ember is banked against the dark',
          sub: 'A warden’s fall buys one night of grace.',
        });
      }
    }
    releaseToasts();
  }

  intro();
}

// A trimmed forge for boss final challenges (no hints, no solution reveal —
// wardens grant nothing). handlers: { onPass, onFail } — onFail returns
// { free, fallen } so the forge can render the verdict of each misstep.
function mountBossForge(host, pseudo, handlers) {
  const { onPass, onFail } = handlers;
  const ch = pseudo.challenge;
  host.innerHTML = `
    <div class="forge">
      <div class="forge-head">
        <span class="dots"><i></i><i></i><i></i></span>
        <span>The Forge — no hints, no mercy</span>
      </div>
      <div class="editor-wrap">
        <div class="editor-gutter" aria-hidden="true">1</div>
        <textarea class="editor" spellcheck="false" autocapitalize="off" autocorrect="off"
          aria-label="${EDITOR_LABEL}"></textarea>
      </div>
      <div class="forge-actions">
        <button class="btn btn-danger" data-act="run">▶ Strike</button>
        <button class="btn btn-ghost" data-act="reset">Reset</button>
        <span class="runner-state" data-role="runner-state"></span>
      </div>
      <div class="console" data-role="console" role="status" aria-live="polite" hidden></div>
      <div data-role="verdict" role="status" aria-live="polite"></div>
    </div>`;

  const editor = host.querySelector('textarea.editor');
  const gutter = host.querySelector('.editor-gutter');
  const consoleBox = host.querySelector('[data-role="console"]');
  const verdictBox = host.querySelector('[data-role="verdict"]');
  const runBtn = host.querySelector('[data-act="run"]');

  editor.value = loadDraft(pseudo.id, ch.starter);
  function syncGutter() {
    const lines = editor.value.split('\n').length || 1;
    gutter.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
  }
  wireEditorNormalization(editor); // shared editor plumbing (E2) — no boss mechanics touched
  editor.addEventListener('input', () => { syncGutter(); saveDraft(pseudo.id, editor.value); });
  editor.addEventListener('scroll', () => { gutter.scrollTop = editor.scrollTop; });
  wireEditorKeys(editor, () => { saveDraft(pseudo.id, editor.value); syncGutter(); });
  syncGutter();
  wireRunnerLabel(host);

  host.querySelector('[data-act="reset"]').addEventListener('click', () => {
    editor.value = ch.starter;
    clearDraft(pseudo.id);
    syncGutter();
  });

  runBtn.addEventListener('click', async () => {
    play('cast');
    runBtn.disabled = true;
    runBtn.textContent = '⏳ Striking…';
    consoleBox.hidden = false;
    consoleBox.innerHTML = '<span class="con-dim">Steel meets shadow…</span>';
    verdictBox.innerHTML = '';
    host.querySelector('.editor-wrap').classList.add('casting');
    const result = await runPython(editor.value, ch.validation);
    host.querySelector('.editor-wrap')?.classList.remove('casting');
    const plotHtml = result.plot
      ? `<img class="plot-render" alt="The figure your code drew" src="data:image/png;base64,${result.plot}">`
      : '';
    const out = (result.output
      ? escapeHtml(result.output)
      : '<span class="con-dim">(no output)</span>') + plotHtml;
    S.recordRun(result.ok);
    emit({ type: 'run' });
    if (result.ok) {
      // Leave Strike disabled: the blow has landed and victory owns the stage.
      play('yield');
      consoleBox.innerHTML = out;
      clearDraft(pseudo.id);
      burst(runBtn);
      onPass();
      return;
    }
    consoleBox.innerHTML = `${out}\n<span class="con-err">${escapeHtml(result.error || '')}</span>`;
    const diag = result.stage === 'validate'
      ? 'Your code ran, but it does not satisfy the working. The ward’s message lies below your output.'
      : 'Your code broke before it could wound anything. Read the error’s last line.';
    // Failures of the interpreter itself cost nothing and break nothing:
    // the learner's code never ran.
    if (result.stage === 'engine' || !onFail) {
      runBtn.disabled = false;
      runBtn.textContent = '▶ Strike';
      verdictBox.innerHTML = `
        <div class="verdict verdict-fail">
          <span class="verdict-title">The warden still stands.</span>
          ${diag}
        </div>`;
      return;
    }
    play('collapse');
    const outcome = onFail();
    // When the learner falls, fallen() owns the stage — write nothing.
    if (outcome.fallen || !document.body.contains(host)) return;
    runBtn.disabled = false;
    runBtn.textContent = '▶ Strike';
    verdictBox.innerHTML = outcome.free
      ? `
        <div class="verdict verdict-fail">
          <span class="verdict-title">The warden toys with you.</span>
          Your working failed, and the warden let it pass — once.
          The next misstep feeds a candle to the dark.<br>${diag}
        </div>`
      : `
        <div class="verdict verdict-fail">
          <span class="verdict-title">The warden strikes back — a candle gutters out.</span>
          ${diag}
        </div>`;
  });
}

// ---------------- profile / sanctum ----------------

// The calibration gauge over every resolved prophecy: mean absolute
// error plus a one-line verdict on which way the readings lean.
function prophecyGaugeHtml() {
  const resolved = [];
  curriculum.acts.forEach((act) => act.lessons.forEach((lesson) => {
    const p = S.getProphecy(lesson.id);
    if (p && typeof p.guess === 'number' && typeof p.actual === 'number') resolved.push(p);
  }));
  if (!resolved.length) {
    return '<p class="empty-note">No prophecy has resolved yet. Before an interrogation, the Codex will ask what you foresee.</p>';
  }
  const mae = resolved.reduce((s, p) => s + Math.abs(p.guess - p.actual), 0) / resolved.length;
  const bias = resolved.reduce((s, p) => s + (p.guess - p.actual), 0) / resolved.length;
  const hits = resolved.filter((p) => p.hit).length;
  let verdict;
  if (mae <= 0.5) verdict = 'Well-calibrated: you read yourself as the Codex reads you.';
  else if (bias > 0) verdict = 'The Codex reads you darker than you read yourself.';
  else if (bias < 0) verdict = 'The Codex reads you brighter than you read yourself.';
  else verdict = 'Your readings scatter, but they do not lean.';
  return `
    <div class="stat-row"><span class="stat-k">Prophecies resolved</span><span class="stat-v">${resolved.length}</span></div>
    <div class="stat-row"><span class="stat-k">Held true</span><span class="stat-v">${hits}</span></div>
    <div class="stat-row"><span class="stat-k">Mean error</span><span class="stat-v">${mae.toFixed(1)}</span></div>
    <p class="prophecy-verdict">${escapeHtml(verdict)}</p>`;
}

// The Kept Nights: a votive candle for every touched day of the last
// twelve weeks. Pure render of streak.history — a broken streak never
// puts a lit candle out.
function keptNightsHtml(st) {
  const kept = new Set(Array.isArray(st.streak.history) ? st.streak.history : []);
  const days = 84;
  let lit = 0;
  const cells = [];
  for (let back = days - 1; back >= 0; back -= 1) {
    const stamp = dayStampAgo(back);
    const on = kept.has(stamp);
    if (on) lit += 1;
    cells.push(`<span class="votive ${on ? 'lit' : ''}" title="${stamp}${on ? ' — the watch was kept' : ''}">${on ? '🕯' : '·'}</span>`);
  }
  return `
    <p class="prose">A candle for every night the watch was kept, over the last twelve weeks.
    Once lit, a candle cannot be put out — a broken streak takes nothing from this shelf.</p>
    <div class="votive-grid" aria-hidden="true">${cells.join('')}</div>
    <p class="votive-note">${lit} of the last ${days} nights kept.</p>`;
}

// The Book of Scars: every question with a recorded miss, bound by act
// and linked back to where the wound was taken. Faded scars — twice
// answered true, day-spaced, since the last miss — rest dimmer, below.
const SCAR_KINDS = {
  quiz: 'Interrogation', trace: 'Scrying', boss: 'Gauntlet', rite: 'Rite',
};

function scarGroupsHtml(scars) {
  const byAct = new Map();
  scars.forEach((s) => {
    if (!byAct.has(s.entry.actIndex)) byAct.set(s.entry.actIndex, []);
    byAct.get(s.entry.actIndex).push(s);
  });
  return [...byAct.keys()].sort((a, b) => a - b).map((ai) => {
    const act = curriculum.acts[ai];
    const items = byAct.get(ai).map((s) => `
      <li class="scar-item">
        <a href="${escapeHtml(s.entry.route)}">${escapeHtml(truncateText(s.entry.q.q))}</a>
        <span class="scar-kind">${SCAR_KINDS[s.entry.kind] || 'Working'}</span>
        <span class="scar-count">missed ×${Number(s.rec.missed) || 0}</span>
      </li>`).join('');
    return `
      <div class="scar-group">
        <h3 class="scar-act-h">Act ${escapeHtml(act.numeral)} — ${escapeHtml(act.title)}</h3>
        <ul class="scar-list">${items}</ul>
      </div>`;
  }).join('');
}

function scarBookHtml(st) {
  const book = scarBook(st);
  if (!book.length) {
    return '<p class="empty-note">The book lies open, unwritten. No question has drawn blood yet.</p>';
  }
  const open = book.filter((s) => !s.faded);
  const faded = book.filter((s) => s.faded);
  const openHtml = open.length
    ? scarGroupsHtml(open)
    : '<p class="empty-note">Every scar has faded. The dark finds no fresh wound to press.</p>';
  const fadedHtml = faded.length
    ? `<details class="scar-faded">
        <summary>Faded scars — ${faded.length} (twice answered true, day-spaced, since the last wound)</summary>
        ${scarGroupsHtml(faded)}
      </details>`
    : '';
  return `
    <p class="prose">Every question that has drawn blood, bound by act. Answer a scar true
    on two separate days with no fresh wound between, and it fades — nothing here is owed,
    only remembered.</p>
    ${openHtml}
    ${fadedHtml}`;
}

export function renderProfile(root) {
  const st = S.getState();
  const rank = rankFor(st.xp);
  const totalLessons = curriculum.acts.reduce((n, a) => n + a.lessons.length, 0);
  const doneLessons = curriculum.acts.reduce(
    (n, a) => n + a.lessons.filter((l) => S.isLessonComplete(l.id)).length, 0,
  );
  const bossesDown = curriculum.acts.filter((a) => S.isBossDefeated(a.id)).length;
  const sigils = sigilTally();

  const achCards = ACHIEVEMENTS.map((a) => {
    const got = S.hasAchievement(a.id);
    return `
      <div class="ach-card ${got ? 'unlocked' : 'locked-ach'}">
        <span class="ach-icon">${a.icon}</span>
        <span>
          <span class="ach-name">${escapeHtml(a.title)}</span><br>
          <span class="ach-desc">${escapeHtml(a.desc)}</span>
        </span>
      </div>`;
  }).join('');

  const ladder = RANKS.map((r, i) => {
    const cls = i === rank.index ? 'current' : (st.xp >= r.xp ? 'attained' : '');
    return `<div class="rank-step ${cls}">
      <span>${i === rank.index ? '◈' : (st.xp >= r.xp ? '✓' : '·')}</span>
      <span>${escapeHtml(r.title)}</span>
      <span class="rank-xp">${r.xp} XP</span>
    </div>`;
  }).join('');

  // The adept's evolving form: tier thresholds sit at rank indexes 2/5/8/11.
  const tier = avatarTier(rank.index);
  const nextTierRankIdx = [2, 5, 8, 11].find((r) => r > rank.index);
  const nextForm = nextTierRankIdx !== undefined
    ? `Your next form awakens at the rank of <strong>${escapeHtml(RANKS[nextTierRankIdx].title)}</strong> (${RANKS[nextTierRankIdx].xp} XP).`
    : 'There is no form beyond this one. You are what the Codex was written to create.';

  root.innerHTML = `
    <h1 class="map-title">The Sanctum</h1>
    <p class="map-sub">${escapeHtml(st.name)}, ${escapeHtml(rank.title)} — sworn to the
    ${st.allegiance === 'wand' ? 'Path of the Wand 🪄' : 'Path of the Ring 💍'}</p>
    <div class="panel avatar-card">
      <span aria-hidden="true">${avatarSvg(st.allegiance, tier)}</span>
      <div>
        <div class="avatar-form-name">${escapeHtml(TIER_NAMES[tier])}</div>
        <div class="prose"><p>The dark reshapes those who study it. Form ${tier + 1} of ${TIER_NAMES.length}.</p></div>
        <div class="avatar-form-next">${nextForm}</div>
      </div>
    </div>
    <div class="sanctum-grid">
      <div class="panel">
        <h2 class="panel-h">The Ledger</h2>
        <div class="stat-row"><span class="stat-k">Experience</span><span class="stat-v">${st.xp} XP</span></div>
        <div class="stat-row"><span class="stat-k">Trials completed</span><span class="stat-v">${doneLessons} / ${totalLessons}</span></div>
        <div class="stat-row"><span class="stat-k">Wardens defeated</span><span class="stat-v">${bossesDown} / ${curriculum.acts.length}</span></div>
        <div class="stat-row"><span class="stat-k">Spells cast</span><span class="stat-v">${st.stats.runs}</span></div>
        <div class="stat-row"><span class="stat-k">Spells that misfired</span><span class="stat-v">${st.stats.failedRuns}</span></div>
        <div class="stat-row"><span class="stat-k">Flawless interrogations</span><span class="stat-v">${st.stats.quizzesPerfect}</span></div>
        <div class="stat-row"><span class="stat-k">Whispers heeded</span><span class="stat-v">${st.stats.hintsUsed}</span></div>
        <div class="stat-row"><span class="stat-k">Notes studied</span><span class="stat-v">${st.stats.solutionsViewed}</span></div>
        <div class="stat-row"><span class="stat-k">Current streak</span><span class="stat-v">${st.streak.count} day${st.streak.count === 1 ? '' : 's'} (best ${st.streak.best})</span></div>
        <div class="stat-row"><span class="stat-k">Embers banked</span><span class="stat-v">${st.streak.embers} / 2</span></div>
        <div class="stat-row"><span class="stat-k">Sigils of Mastery</span><span class="stat-v">${sigils.earned} of ${sigils.possible}</span></div>
      </div>
      <div class="panel">
        <h2 class="panel-h">The Ascension</h2>
        <div class="rank-ladder">${ladder}</div>
      </div>
    </div>
    <div class="sanctum-grid">
      <div class="panel">
        <h2 class="panel-h">🜄 The Sealed Prophecies</h2>
        ${prophecyGaugeHtml()}
      </div>
      <div class="panel">
        <h2 class="panel-h">🕯 The Kept Nights</h2>
        ${keptNightsHtml(st)}
      </div>
    </div>
    <h2 class="section-h">📖 The Book of Scars</h2>
    ${scarBookHtml(st)}
    <h2 class="section-h">Marks of the Dark</h2>
    <div class="ach-grid">${achCards}</div>
    <div class="mt-2 center">
      <button class="btn btn-danger" id="obliviate">🧠 Obliviate — erase all progress</button>
    </div>`;

  root.querySelector('#obliviate').addEventListener('click', () => {
    const sure = window.confirm(
      'Obliviate erases everything: XP, ranks, achievements, all progress. There is no counter-curse. Proceed?',
    );
    if (sure) {
      S.resetState();
      // Sweep editor drafts too — a fresh soul keeps no old handwriting.
      try {
        Object.keys(localStorage)
          .filter((k) => k.startsWith('darkcodex.draft.'))
          .forEach((k) => localStorage.removeItem(k));
      } catch { /* storage blocked */ }
      document.documentElement.dataset.allegiance = '';
      window.location.hash = '#/';
      window.location.reload();
    }
  });
}

// ---------------- the night vigil ----------------
// Questions drawn only from wards the learner has raised, chosen by
// the Leitner scheduler in review.js. The Vigil's Bargain: a Short (4),
// Full (6), or Long (9) watch — the choice never changes the pay, which
// stays a fixed 25 XP for the first completed walk of the day. A fading
// ward's deep-link narrows the watch to a single act.

export function renderVigil(root) {
  const st = S.getState();

  // The act filter arrives as '#/vigil/act-N' (the route the current
  // router already carries) or '#/vigil?act=N' (accepted for the same
  // meaning if the router is ever taught to pass queries through).
  const hash = window.location.hash || '';
  const m = hash.match(/[?&]act=(\d+)/) || hash.match(/\/act-(\d+)(?:\D|$)/);
  let actFilter = m ? Number(m[1]) - 1 : null;
  if (actFilter !== null && !curriculum.acts[actFilter]) actFilter = null;
  const act = actFilter !== null ? curriculum.acts[actFilter] : null;

  const pool = eligiblePool(st);
  if (!pool.length) {
    root.innerHTML = `
      <h1 class="map-title">The Night Vigil</h1>
      <div class="panel center">
        <p class="prose">No wards stand yet. Complete a trial, then return after dark.</p>
        <p><a class="btn" href="#/">Return to the map</a></p>
      </div>`;
    return;
  }
  if (act && !pool.some((e) => e.actIndex === actFilter)) {
    root.innerHTML = `
      <h1 class="map-title">The Night Vigil</h1>
      <div class="panel center">
        <p class="prose">No wards of Act ${escapeHtml(act.numeral)} stand to be walked yet.</p>
        <p><a class="btn" href="#/vigil">Walk the full watch instead</a></p>
      </div>`;
    return;
  }

  const walked = st.vigil.lastDay === S.todayStamp();
  root.innerHTML = `
    <h1 class="map-title">The Night Vigil</h1>
    <p class="map-sub">Each night the wards you have raised must be walked.
    What you do not revisit, the dark reclaims.</p>
    ${act ? `
    <div class="panel vigil-filter">
      <p class="prose">The watch narrows to <strong>Act ${escapeHtml(act.numeral)} — ${escapeHtml(act.title)}</strong>,
      where the wards burn low. <a href="#/vigil">Walk the full watch instead.</a></p>
    </div>` : ''}
    <div class="panel">
      <p class="prose vigil-status">${walked
    ? 'The wards are already walked tonight.'
    : 'The wards await.'}</p>
      <p class="prose vigil-bargain">Choose the measure of the watch. The night pays its 25 XP
      once, whatever the length — the bargain buys depth, never coin.</p>
      <div class="vigil-lengths" role="group" aria-label="The length of the watch">
        <button class="btn" data-len="4">Short — 4 wards</button>
        <button class="btn" data-len="6">Full — 6 wards</button>
        <button class="btn" data-len="9">Long — 9 wards</button>
      </div>
    </div>
    <section class="vigil-flow" id="vigil-flow"></section>
    <div id="vigil-result"></div>`;

  const lengthBtns = [...root.querySelectorAll('.vigil-lengths [data-len]')];
  lengthBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      lengthBtns.forEach((b) => { b.disabled = true; });
      beginWalk(Number(btn.dataset.len) || 6);
    });
  });

  function beginWalk(n) {
    const items = buildVigil(st, n, actFilter);
    const flow = root.querySelector('#vigil-flow');
    let answered = 0;
    items.forEach((entry, i) => {
      // Trace wards carry the working being read: code above, question below.
      let host = flow;
      if (entry.code) {
        host = el('div', { class: 'trace-item' }, codeBlock(entry.code));
        flow.appendChild(host);
      }
      renderQuizQuestion(host, entry.q, (missed) => {
        S.recordQuestionOutcome(entry.qid, !missed, qHash(entry.q.q));
        answered += 1;
        if (answered === items.length) vigilComplete();
      }, { number: i + 1 });
    });
  }

  function vigilComplete() {
    const resultHost = root.querySelector('#vigil-result');
    if (S.markVigilWalked()) {
      grantXp(25, 'The wards are walked');
      emit({ type: 'vigil-complete' });
      play('crackle');
      resultHost.innerHTML = `
        <div class="verdict verdict-pass">
          <span class="verdict-title">The wards are walked.</span>
          What is learned before rest is kept. The Codex will open to your page tomorrow.
        </div>`;
    } else {
      resultHost.innerHTML = `
        <div class="verdict verdict-pass">
          <span class="verdict-title">The wards were already walked tonight.</span>
          This walk sharpens; it does not pay.
        </div>`;
    }
  }
}

// ---------------- codex (glossary) ----------------

export function renderCodex(root) {
  const sections = curriculum.acts.map((act, i) => {
    const unlocked = S.isActUnlocked(curriculum, i);
    if (!unlocked) {
      return `<section class="codex-act">
        <h2>${escapeHtml(act.sigil)} ${escapeHtml(act.title)}</h2>
        <p class="codex-locked-note">These pages are still sealed. Reach Act ${escapeHtml(act.numeral)} to read them.</p>
      </section>`;
    }
    const entries = act.codex.map((c) => `
      <div class="codex-entry">
        <span class="codex-term">${escapeHtml(c.term)}</span>
        <span class="codex-def">${prose(c.def).replace(/^<p>|<\/p>$/g, '')}</span>
      </div>`).join('');
    return `<section class="codex-act">
      <h2>${escapeHtml(act.sigil)} ${escapeHtml(act.title)}</h2>
      ${entries}
    </section>`;
  }).join('');

  root.innerHTML = `
    <h1 class="map-title">The Codex</h1>
    <p class="map-sub">Every term the dark has taught you, kept where memory cannot rot.</p>
    ${sections}`;
}

// ---------------- 404 ----------------

export function renderMissing(root) {
  root.innerHTML = `
    <div class="panel center">
      <h1>These pages have been torn out.</h1>
      <p class="empty-note">Whatever you sought is not in the Codex.</p>
      <p><a class="btn" href="#/">Return to the map</a></p>
    </div>`;
}
