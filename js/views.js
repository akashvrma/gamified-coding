// ============================================================
// views.js — every screen of the Codex. Pure render functions
// that take the app root element and paint a route.
// ============================================================

import { escapeHtml, prose, codeBlock, el, toast } from './ui.js';
import * as S from './state.js';
import { emit, grantXp, rankFor, ACHIEVEMENTS, RANKS } from './gamification.js';
import { runPython, preboot, runnerStatus, onRunnerStatus } from './runner.js';
import { curriculum, findLesson, findAct } from './data/curriculum.js';

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

export function renderHome(root) {
  const st = S.getState();
  const cards = curriculum.acts.map((act, i) => {
    const unlocked = S.isActUnlocked(curriculum, i);
    const { done, total } = S.actProgress(act);
    const pct = Math.round((done / total) * 100);
    const status = !unlocked
      ? '<span class="tag tag-locked">🔒 Sealed</span>'
      : (done === total
        ? '<span class="tag tag-done">Conquered</span>'
        : `<span class="tag tag-accent">${done ? 'In progress' : 'Open'}</span>`);
    const inner = `
      <article class="act-card ${unlocked ? '' : 'locked'}">
        <div class="act-sigil" aria-hidden="true">${escapeHtml(act.sigil)}</div>
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

  root.innerHTML = `
    <h1 class="map-title">The Descent</h1>
    <p class="map-sub">Five realms stand between ${escapeHtml(st.name || 'you')} and mastery.
    Each must be survived in turn.</p>
    <div class="act-road">${cards}</div>`;
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
    return `
      <a class="${cls}" href="#/lesson/${lesson.id}" ${unlocked ? '' : 'aria-disabled="true" tabindex="-1"'}>
        <span class="node-marker">${marker}</span>
        <span class="node-body">
          <span class="node-title">${escapeHtml(lesson.title)}</span><br>
          <span class="node-concept">${escapeHtml(lesson.concept)}</span>
        </span>
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
    <div class="lesson-list">${nodes}${bossNode}</div>`;
}

// ---------------- lesson page ----------------

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

  const sectionsHtml = lesson.sections.map((sec) => `
    <h2 class="section-h">${escapeHtml(sec.heading)}</h2>
    <div class="prose">${prose(sec.body)}</div>
    ${sec.code ? codeBlock(sec.code) : ''}
    ${sec.note ? `<div class="lore-note"><span class="rune">🜏</span><div class="prose">${prose(sec.note)}</div></div>` : ''}
  `).join('');

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
    ${sectionsHtml}
    <section class="challenge-panel" id="challenge"></section>
    <section class="quiz" id="quiz"></section>
    <footer class="lesson-footer" id="lesson-footer"></footer>`;

  mountChallenge(root.querySelector('#challenge'), lesson, () => refreshFooter());
  mountQuiz(root.querySelector('#quiz'), lesson, () => refreshFooter());

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

function mountChallenge(host, lesson, onChange) {
  const ch = lesson.challenge;
  const rec = S.getLessonProgress(lesson.id);
  host.innerHTML = `
    <span class="challenge-label">⚔ The Trial</span>
    <h2>${escapeHtml(ch.title)}</h2>
    <div class="prose">${prose(ch.prompt)}</div>
    <div class="forge">
      <div class="forge-head">
        <span class="dots"><i></i><i></i><i></i></span>
        <span>The Forge — Python 3</span>
      </div>
      <div class="editor-wrap">
        <div class="editor-gutter" aria-hidden="true">1</div>
        <textarea class="editor" spellcheck="false" autocapitalize="off"
          aria-label="${EDITOR_LABEL}"></textarea>
      </div>
      <div class="forge-actions">
        <button class="btn" data-act="run">▶ Cast the spell</button>
        <button class="btn btn-ghost" data-act="reset">Reset</button>
        <button class="btn btn-ghost" data-act="hint">Whisper a hint</button>
        <span class="runner-state" data-role="runner-state"></span>
      </div>
      <div class="hint-box" data-role="hints"></div>
      <div class="console" data-role="console" role="status" aria-live="polite" hidden></div>
      <div data-role="verdict" role="status" aria-live="polite"></div>
      <details class="solution-reveal">
        <summary>☠ Surrender and read the answer</summary>
        <p class="solution-warning">Knowledge taken, not earned, teaches half as much.
        Study it, then rewrite it yourself from nothing.</p>
        ${codeBlock(ch.solution)}
      </details>
    </div>`;

  const editor = host.querySelector('textarea.editor');
  const gutter = host.querySelector('.editor-gutter');
  const consoleBox = host.querySelector('[data-role="console"]');
  const verdictBox = host.querySelector('[data-role="verdict"]');
  const hintsBox = host.querySelector('[data-role="hints"]');
  const runBtn = host.querySelector('[data-act="run"]');

  editor.value = loadDraft(lesson.id, ch.starter);
  if (rec.challenge) {
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
  editor.addEventListener('input', () => { syncGutter(); saveDraft(lesson.id, editor.value); });
  editor.addEventListener('scroll', () => { gutter.scrollTop = editor.scrollTop; });
  wireEditorKeys(editor, () => { saveDraft(lesson.id, editor.value); syncGutter(); });
  syncGutter();

  wireRunnerLabel(host);

  let hintIdx = 0;
  host.querySelector('[data-act="hint"]').addEventListener('click', () => {
    if (hintIdx >= ch.hints.length) {
      toast({ icon: '🤫', title: 'The Codex is silent', sub: 'No more hints remain. Trust your own hand.' });
      return;
    }
    const div = el('div', { class: 'hint-item' },
      `<strong>Whisper ${hintIdx + 1}:</strong> ${prose(ch.hints[hintIdx]).replace(/^<p>|<\/p>$/g, '')}`);
    hintsBox.appendChild(div);
    hintIdx += 1;
    S.recordHint();
  });

  host.querySelector('[data-act="reset"]').addEventListener('click', () => {
    editor.value = ch.starter;
    clearDraft(lesson.id);
    syncGutter();
  });

  host.querySelector('details.solution-reveal').addEventListener('toggle', (e) => {
    if (e.target.open) {
      S.markSolutionViewed(lesson.id);
      emit({ type: 'solution-viewed', lessonId: lesson.id });
    }
  });

  runBtn.addEventListener('click', async () => {
    runBtn.disabled = true;
    runBtn.textContent = '⏳ Casting…';
    consoleBox.hidden = false;
    consoleBox.innerHTML = '<span class="con-dim">The runes begin to glow…</span>';
    verdictBox.innerHTML = '';

    const result = await runPython(editor.value, ch.validation);
    runBtn.disabled = false;
    runBtn.textContent = '▶ Cast the spell';

    const out = result.output
      ? escapeHtml(result.output)
      : '<span class="con-dim">(the spell produced no output)</span>';
    if (result.ok) {
      consoleBox.innerHTML = out;
      S.recordRun(true);
      emit({ type: 'run' });
      const first = S.markChallenge(lesson.id);
      verdictBox.innerHTML = `
        <div class="verdict verdict-pass">
          <span class="verdict-title">The ward yields.</span>
          ${escapeHtml(ch.successText)}
        </div>`;
      if (first) {
        grantXp(ch.xp, `Trial passed — ${lesson.title}`);
        emit({ type: 'challenge-solved', lessonId: lesson.id });
        maybeLessonComplete(lesson);
      }
      onChange();
    } else {
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
      onChange();
    }
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
    <div data-role="questions"></div>
    <div data-role="quiz-result"></div>`;

  const qHost = host.querySelector('[data-role="questions"]');
  const resultHost = host.querySelector('[data-role="quiz-result"]');

  lesson.quiz.forEach((q, qi) => {
    const box = el('div', { class: 'quiz-q' });
    const opts = q.options.map((opt, oi) => `
      <button class="quiz-opt" data-q="${qi}" data-o="${oi}">
        <span class="opt-key">${'ABCD'[oi]}.</span>
        <span>${inlineOption(opt)}</span>
      </button>`).join('');
    box.innerHTML = `
      <p class="q-text">${qi + 1}. ${inlineOption(q.q)}</p>
      <div class="quiz-opts">${opts}</div>
      <div class="q-result" data-role="qr"></div>
      <div class="q-explain" hidden></div>`;
    qHost.appendChild(box);

    const explain = box.querySelector('.q-explain');
    const qr = box.querySelector('[data-role="qr"]');
    box.querySelectorAll('.quiz-opt').forEach((btn) => {
      btn.addEventListener('click', () => {
        const oi = Number(btn.dataset.o);
        if (state[qi].solved) return;
        if (oi === q.answer) {
          state[qi].solved = true;
          btn.classList.add('sel-right');
          box.querySelectorAll('.quiz-opt').forEach((b) => { b.disabled = true; });
          qr.textContent = state[qi].missed ? 'Correct — at last.' : 'Correct.';
          qr.className = 'q-result ok';
          explain.hidden = false;
          explain.innerHTML = inlineOption(q.explain);
          checkQuizDone();
        } else {
          state[qi].missed = true;
          btn.classList.add('sel-wrong');
          btn.disabled = true;
          qr.textContent = 'Wrong. The Codex remembers. Try again.';
          qr.className = 'q-result bad';
        }
      });
    });
  });

  function checkQuizDone() {
    if (!state.every((s) => s.solved)) return;
    const perfect = state.every((s) => !s.missed);
    const first = S.markQuiz(lesson.id, perfect);
    resultHost.innerHTML = `
      <div class="verdict verdict-pass">
        <span class="verdict-title">${perfect ? 'Flawless. Not a single crack for the dark to enter.' : 'You survived the questioning.'}</span>
      </div>`;
    if (first) {
      grantXp(QUIZ_XP + (perfect ? QUIZ_PERFECT_BONUS : 0),
        perfect ? 'Interrogation — flawless' : 'Interrogation survived');
      emit({ type: 'quiz-complete', lessonId: lesson.id, perfect });
      maybeLessonComplete(lesson);
    }
    onChange();
  }
}

// Escape then apply inline `code` markup for quiz strings.
function inlineOption(text) {
  return escapeHtml(text).replace(/`([^`]+)`/g, '<code>$1</code>');
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

  root.innerHTML = `
    <div class="crumbs"><a href="#/">The Map</a> / <a href="#/act/${act.id}">Act ${escapeHtml(act.numeral)}</a> / Boss</div>
    <div class="boss-arena" id="arena"></div>`;
  const arena = root.querySelector('#arena');

  const battle = {
    lives: 3,
    idx: 0,
    flawless: true,
    order: boss.gauntlet.map((_, i) => i),
  };

  function intro() {
    arena.innerHTML = `
      <span class="challenge-label">☠ Warden of Act ${escapeHtml(act.numeral)}</span>
      <h1 class="boss-title">${escapeHtml(boss.title)}</h1>
      <div class="narrative">${prose(boss.narrative)}</div>
      <p class="prose">The trial has two movements: a <strong>gauntlet of ${boss.gauntlet.length} questions</strong>
      (you carry three lives — each wrong answer feeds one to the dark), then a
      <strong>final working of code</strong>. Fall, and you begin the gauntlet anew.</p>
      ${alreadyDown ? '<p class="prose"><em>You have already broken this warden. Fight again for pride, not power — no further XP awaits.</em></p>' : ''}
      <button class="btn btn-danger" id="begin">Begin the trial</button>
      <a class="btn btn-ghost" href="#/act/${act.id}">Withdraw</a>`;
    arena.querySelector('#begin').addEventListener('click', () => {
      battle.lives = 3;
      battle.idx = 0;
      battle.flawless = true;
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
    const q = boss.gauntlet[battle.order[battle.idx]];
    arena.innerHTML = `
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
    const qr = arena.querySelector('[data-role="qr"]');
    const explain = arena.querySelector('.q-explain');
    const nextHost = arena.querySelector('[data-role="next"]');
    arena.querySelectorAll('.quiz-opt').forEach((btn) => {
      btn.addEventListener('click', () => {
        const oi = Number(btn.dataset.o);
        arena.querySelectorAll('.quiz-opt').forEach((b) => { b.disabled = true; });
        explain.hidden = false;
        explain.innerHTML = inlineOption(q.explain);
        if (oi === q.answer) {
          btn.classList.add('sel-right');
          qr.textContent = 'The warden recoils.';
          qr.className = 'q-result ok';
        } else {
          btn.classList.add('sel-wrong');
          arena.querySelectorAll('.quiz-opt')[q.answer].classList.add('sel-right');
          battle.lives -= 1;
          battle.flawless = false;
          qr.textContent = `A candle gutters out. The true answer was ${'ABCD'[q.answer]}.`;
          qr.className = 'q-result bad';
          arena.querySelector('.lives').outerHTML = livesHtml();
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
    arena.innerHTML = `
      <h1 class="boss-title">You are cast down.</h1>
      <div class="narrative"><p>${escapeHtml(boss.defeatText)}</p></div>
      <button class="btn btn-danger" id="again">Rise and try again</button>
      <a class="btn btn-ghost" href="#/act/${act.id}">Retreat and study</a>`;
    arena.querySelector('#again').addEventListener('click', intro);
  }

  function finalChallenge() {
    const ch = boss.finalChallenge;
    arena.innerHTML = `
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
    mountBossForge(arena.querySelector('#boss-forge'), pseudo, () => victory());
  }

  function victory() {
    const first = S.markBossDefeated(act.id);
    const bonus = battle.flawless ? boss.flawlessBonus : 0;
    arena.innerHTML = `
      <div class="boss-defeated-banner">
        <h2>☠ ${escapeHtml(boss.title)} has fallen.</h2>
        <div class="narrative"><p>${escapeHtml(boss.victoryText)}</p></div>
        ${first ? `<p class="prose center">Spoils: <strong>${boss.xp} XP</strong>${bonus ? ` + <strong>${bonus} XP</strong> for a flawless gauntlet` : ''}</p>` : '<p class="empty-note">The warden was already yours; no new spoils.</p>'}
        <p>
          ${curriculum.acts[actIndex + 1]
    ? `<a class="btn" href="#/act/${curriculum.acts[actIndex + 1].id}">Descend to Act ${curriculum.acts[actIndex + 1].numeral} →</a>`
    : '<a class="btn" href="#/profile">Behold what you have become →</a>'}
          <a class="btn btn-ghost" href="#/">The Map</a>
        </p>
      </div>`;
    if (first) {
      grantXp(boss.xp + bonus, `Warden defeated — ${boss.title}`);
      emit({ type: 'boss-defeated', actId: act.id });
    }
  }

  intro();
}

// A trimmed forge for boss final challenges (no hints, no solution reveal —
// wardens grant nothing).
function mountBossForge(host, pseudo, onPass) {
  const ch = pseudo.challenge;
  host.innerHTML = `
    <div class="forge">
      <div class="forge-head">
        <span class="dots"><i></i><i></i><i></i></span>
        <span>The Forge — no hints, no mercy</span>
      </div>
      <div class="editor-wrap">
        <div class="editor-gutter" aria-hidden="true">1</div>
        <textarea class="editor" spellcheck="false" autocapitalize="off"
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
    runBtn.disabled = true;
    runBtn.textContent = '⏳ Striking…';
    consoleBox.hidden = false;
    consoleBox.innerHTML = '<span class="con-dim">Steel meets shadow…</span>';
    verdictBox.innerHTML = '';
    const result = await runPython(editor.value, ch.validation);
    runBtn.disabled = false;
    runBtn.textContent = '▶ Strike';
    const out = result.output
      ? escapeHtml(result.output)
      : '<span class="con-dim">(no output)</span>';
    S.recordRun(result.ok);
    emit({ type: 'run' });
    if (result.ok) {
      consoleBox.innerHTML = out;
      clearDraft(pseudo.id);
      onPass();
    } else {
      consoleBox.innerHTML = `${out}\n<span class="con-err">${escapeHtml(result.error || '')}</span>`;
      verdictBox.innerHTML = `
        <div class="verdict verdict-fail">
          <span class="verdict-title">The warden still stands.</span>
          ${result.stage === 'validate'
    ? 'Your code ran, but it does not satisfy the working. The ward’s message lies below your output.'
    : 'Your code broke before it could wound anything. Read the error’s last line.'}
        </div>`;
    }
  });
}

// ---------------- profile / sanctum ----------------

export function renderProfile(root) {
  const st = S.getState();
  const rank = rankFor(st.xp);
  const totalLessons = curriculum.acts.reduce((n, a) => n + a.lessons.length, 0);
  const doneLessons = curriculum.acts.reduce(
    (n, a) => n + a.lessons.filter((l) => S.isLessonComplete(l.id)).length, 0,
  );
  const bossesDown = curriculum.acts.filter((a) => S.isBossDefeated(a.id)).length;

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

  root.innerHTML = `
    <h1 class="map-title">The Sanctum</h1>
    <p class="map-sub">${escapeHtml(st.name)}, ${escapeHtml(rank.title)} — sworn to the
    ${st.allegiance === 'wand' ? 'Path of the Wand 🪄' : 'Path of the Ring 💍'}</p>
    <div class="sanctum-grid">
      <div class="panel">
        <h2 class="panel-h">The Ledger</h2>
        <div class="stat-row"><span class="stat-k">Experience</span><span class="stat-v">${st.xp} XP</span></div>
        <div class="stat-row"><span class="stat-k">Trials completed</span><span class="stat-v">${doneLessons} / ${totalLessons}</span></div>
        <div class="stat-row"><span class="stat-k">Wardens defeated</span><span class="stat-v">${bossesDown} / ${curriculum.acts.length}</span></div>
        <div class="stat-row"><span class="stat-k">Spells cast</span><span class="stat-v">${st.stats.runs}</span></div>
        <div class="stat-row"><span class="stat-k">Spells that misfired</span><span class="stat-v">${st.stats.failedRuns}</span></div>
        <div class="stat-row"><span class="stat-k">Flawless interrogations</span><span class="stat-v">${st.stats.quizzesPerfect}</span></div>
        <div class="stat-row"><span class="stat-k">Hints begged</span><span class="stat-v">${st.stats.hintsUsed}</span></div>
        <div class="stat-row"><span class="stat-k">Solutions peeked</span><span class="stat-v">${st.stats.solutionsViewed}</span></div>
        <div class="stat-row"><span class="stat-k">Current streak</span><span class="stat-v">${st.streak.count} day${st.streak.count === 1 ? '' : 's'} (best ${st.streak.best})</span></div>
      </div>
      <div class="panel">
        <h2 class="panel-h">The Ascension</h2>
        <div class="rank-ladder">${ladder}</div>
      </div>
    </div>
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
