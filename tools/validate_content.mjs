#!/usr/bin/env node
// ============================================================
// validate_content.mjs — the content gate.
// 1. Structural checks against docs/CONTENT_SPEC.md
// 2. Greps py-fields for banned constructs (input(), etc.)
// 3. Runs every solution against its validation in CPython
//    (tools/run_checks.py), mirroring the browser harness.
// 4. Prints the total attainable XP so rank thresholds stay honest.
// ============================================================

import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const { curriculum } = await import(join(here, '..', 'js', 'data', 'curriculum.js'));

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const QUIZ_XP = 35;
const QUIZ_PERFECT_BONUS = 15;

function checkPyField(where, code) {
  if (typeof code !== 'string' || !code.trim()) { err(`${where}: empty python field`); return; }
  if (/\binput\s*\(/.test(code)) err(`${where}: uses input() — banned in the Forge`);
  if (code.includes('`')) err(`${where}: contains a backtick`);
}

function checkQuiz(where, quiz, min, max) {
  if (!Array.isArray(quiz) || quiz.length < min || quiz.length > max) {
    err(`${where}: expected ${min}–${max} quiz questions, got ${quiz?.length}`);
    return;
  }
  quiz.forEach((q, i) => {
    const w = `${where} q${i + 1}`;
    if (!q.q || typeof q.q !== 'string') err(`${w}: missing question text`);
    if (!Array.isArray(q.options) || q.options.length !== 4) err(`${w}: needs exactly 4 options`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) err(`${w}: answer index out of range`);
    if (!q.explain) err(`${w}: missing explanation`);
    if (Array.isArray(q.options) && new Set(q.options.map((o) => String(o).trim())).size !== q.options.length) {
      warn(`${w}: duplicate options`);
    }
  });
}

function checkChallenge(where, ch, { hintsRequired, hintsExact = null, xpRange = null }) {
  const required = hintsRequired ? ['title', 'prompt', 'successText'] : ['title', 'prompt'];
  for (const f of required) {
    if (!ch[f]) err(`${where}: missing ${f}`);
  }
  checkPyField(`${where}.starter`, ch.starter);
  checkPyField(`${where}.solution`, ch.solution);
  checkPyField(`${where}.validation`, ch.validation);
  if (hintsExact !== null) {
    if (!Array.isArray(ch.hints) || ch.hints.length !== hintsExact) {
      err(`${where}: needs exactly ${hintsExact} hints, got ${ch.hints?.length}`);
    }
  } else if (hintsRequired) {
    if (!Array.isArray(ch.hints) || ch.hints.length < 2) err(`${where}: needs ≥2 hints`);
  }
  if (hintsRequired || xpRange) {
    const [lo, hi] = xpRange || [40, 120];
    if (!Number.isInteger(ch.xp) || ch.xp < lo || ch.xp > hi) err(`${where}: challenge xp ${ch.xp} outside ${lo}–${hi}`);
  }
  if (!/assert/.test(ch.validation || '')) err(`${where}: validation has no assert`);
  // workedExample: optional kindred working shown by the 6-fail rescue
  // (schema live now; content arrives Wave 2).
  if (ch.workedExample !== undefined) {
    const we = ch.workedExample || {};
    if (!we.intro || typeof we.intro !== 'string') err(`${where}.workedExample: missing intro`);
    if (!we.outro || typeof we.outro !== 'string') err(`${where}.workedExample: missing outro`);
    checkPyField(`${where}.workedExample.code`, we.code);
  }
}

// Per-kind laws for optional lesson extras (spec §3 / §3b / §3c).
const EXTRA_KINDS = {
  echo: { hints: 2, xp: [15, 25] },
  cursed: { hints: 3, xp: [20, 40] },
  ward: { hints: 3, xp: [40, 60] },
};

const countWords = (s) => String(s || '').trim().split(/\s+/).filter(Boolean).length;

const seenIds = new Set();
const manifest = [];
let totalXp = 0;
let coreXp = 0;
let extrasXp = 0;
let traceXp = 0;

curriculum.acts.forEach((act, ai) => {
  const aw = `act${ai + 1}`;
  if (act.id !== `act${ai + 1}`) err(`${aw}: id is ${act.id}`);
  for (const f of ['numeral', 'arc', 'title', 'tagline', 'sigil', 'intro']) {
    if (!act[f]) err(`${aw}: missing ${f}`);
  }
  if (!act.epigraph?.text || !act.epigraph?.source) err(`${aw}: malformed epigraph`);
  if (!Array.isArray(act.lessons) || act.lessons.length !== 7) {
    err(`${aw}: expected exactly 7 lessons, got ${act.lessons?.length}`);
  }
  if (!Array.isArray(act.codex) || act.codex.length < 10 || act.codex.length > 16) {
    err(`${aw}: codex needs 10–16 entries, got ${act.codex?.length}`);
  }
  (act.codex || []).forEach((c, i) => {
    if (!c.term || !c.def) err(`${aw} codex[${i}]: missing term/def`);
  });

  (act.lessons || []).forEach((lesson, li) => {
    const lw = `${aw}/${lesson.id}`;
    if (lesson.id !== `a${ai + 1}l${li + 1}`) err(`${lw}: id should be a${ai + 1}l${li + 1}`);
    if (seenIds.has(lesson.id)) err(`${lw}: duplicate id`);
    seenIds.add(lesson.id);
    for (const f of ['title', 'concept', 'narrative']) if (!lesson[f]) err(`${lw}: missing ${f}`);
    if (!Number.isInteger(lesson.xp) || lesson.xp < 20 || lesson.xp > 50) err(`${lw}: lesson xp ${lesson.xp} outside 20–50`);
    if (!Array.isArray(lesson.sections) || lesson.sections.length < 2 || lesson.sections.length > 5) {
      err(`${lw}: needs 2–5 sections, got ${lesson.sections?.length}`);
    }
    (lesson.sections || []).forEach((s, si) => {
      if (!s.heading || !s.body) err(`${lw} section ${si + 1}: missing heading/body`);
      if (s.code !== undefined) checkPyField(`${lw} section ${si + 1}.code`, s.code);
    });
    checkChallenge(`${lw}.challenge`, lesson.challenge || {}, { hintsRequired: true });
    checkQuiz(`${lw}.quiz`, lesson.quiz, 3, 5);

    manifest.push({
      id: lesson.id,
      title: lesson.title,
      starter: lesson.challenge?.starter ?? '',
      solution: lesson.challenge?.solution ?? '',
      validation: lesson.challenge?.validation ?? '',
    });
    totalXp += (lesson.xp || 0) + (lesson.challenge?.xp || 0) + QUIZ_XP + QUIZ_PERFECT_BONUS;
    coreXp += (lesson.xp || 0) + (lesson.challenge?.xp || 0) + QUIZ_XP + QUIZ_PERFECT_BONUS;

    // ---- extras: optional echo / cursed / ward riders (spec §3) ----
    if (lesson.extras !== undefined) {
      if (!Array.isArray(lesson.extras) || lesson.extras.length < 1 || lesson.extras.length > 3) {
        err(`${lw}: extras must be an array of 1–3 items, got ${lesson.extras?.length}`);
      }
      const extraIdRe = new RegExp(`^${lesson.id}x\\d+$`);
      (Array.isArray(lesson.extras) ? lesson.extras : []).forEach((ex, xi) => {
        const xw = `${lw} extras[${ex?.id || xi + 1}]`;
        if (!ex.id || !extraIdRe.test(ex.id)) {
          err(`${xw}: id must match ${lesson.id}x<n> (stable — state keys on it), got ${ex.id}`);
        }
        if (ex.id) {
          if (seenIds.has(ex.id)) err(`${xw}: duplicate id`);
          seenIds.add(ex.id);
        }
        const kind = EXTRA_KINDS[ex.kind];
        if (!kind) {
          err(`${xw}: kind must be one of ${Object.keys(EXTRA_KINDS).join(' | ')}, got ${ex.kind}`);
          return;
        }
        checkChallenge(xw, ex, { hintsRequired: true, hintsExact: kind.hints, xpRange: kind.xp });
        manifest.push({
          id: ex.id || `${lesson.id}x?`,
          title: ex.title || xw,
          starter: ex.starter ?? '',
          solution: ex.solution ?? '',
          validation: ex.validation ?? '',
        });
        totalXp += ex.xp || 0;
        extrasXp += ex.xp || 0;
      });
    }

    // ---- trace: optional scrying items, executed by the CPython gate ----
    if (lesson.trace !== undefined) {
      if (!Array.isArray(lesson.trace) || lesson.trace.length < 1 || lesson.trace.length > 3) {
        err(`${lw}: trace must be an array of 1–3 items, got ${lesson.trace?.length}`);
      }
      const traceIdRe = new RegExp(`^${lesson.id}t\\d+$`);
      (Array.isArray(lesson.trace) ? lesson.trace : []).forEach((t, ti) => {
        const tw = `${lw} trace[${t?.id || ti + 1}]`;
        if (!t.id || !traceIdRe.test(t.id)) {
          err(`${tw}: id must match ${lesson.id}t<n> (stable — state keys on it), got ${t.id}`);
        }
        if (t.id) {
          if (seenIds.has(t.id)) err(`${tw}: duplicate id`);
          seenIds.add(t.id);
        }
        checkPyField(`${tw}.code`, t.code);
        if (typeof t.code === 'string' && t.code.trim().split('\n').length > 12) {
          warn(`${tw}: code runs ${t.code.trim().split('\n').length} lines (target ≤12)`);
        }
        if (!t.q || typeof t.q !== 'string') err(`${tw}: missing question text (q)`);
        if (!Array.isArray(t.options) || t.options.length !== 4) err(`${tw}: needs exactly 4 options`);
        if (!Number.isInteger(t.answer) || t.answer < 0 || t.answer > 3) err(`${tw}: answer index out of range`);
        if (!t.explain) err(`${tw}: missing explanation`);
        if (t.raises !== undefined && (typeof t.raises !== 'string' || !t.raises.trim())) {
          err(`${tw}: raises must be a non-empty exception type name`);
        }
        // The execution gate: run_checks.py executes the code and asserts
        // the keyed option IS the exact output (or the named exception).
        manifest.push({
          kind: 'trace',
          id: t.id || `${lesson.id}t?`,
          code: t.code ?? '',
          expect: Array.isArray(t.options) ? String(t.options[t.answer] ?? '') : '',
          raises: t.raises,
        });
        totalXp += 5; // first-try-correct scrying pays 5 XP
        traceXp += 5;
      });
    }

    // Word budget (warning, never a gate): narrative + section bodies.
    const words = countWords(lesson.narrative)
      + (lesson.sections || []).reduce((n, s) => n + countWords(s.body), 0);
    if (words > 650) warn(`${lw}: narrative+sections run ${words} words (budget ~650)`);
  });

  const boss = act.boss || {};
  const bw = `${aw}/boss`;
  for (const f of ['id', 'title', 'narrative', 'defeatText', 'victoryText']) {
    if (!boss[f]) err(`${bw}: missing ${f}`);
  }
  if (!Number.isInteger(boss.xp) || boss.xp < 200 || boss.xp > 500) err(`${bw}: boss xp ${boss.xp} outside 200–500`);
  if (!Number.isInteger(boss.flawlessBonus)) err(`${bw}: missing flawlessBonus`);
  checkQuiz(`${bw}.gauntlet`, boss.gauntlet, 5, 8);
  checkChallenge(`${bw}.finalChallenge`, boss.finalChallenge || {}, { hintsRequired: false });
  manifest.push({
    id: boss.id || `${aw}-boss`,
    title: boss.title || bw,
    starter: boss.finalChallenge?.starter ?? '',
    solution: boss.finalChallenge?.solution ?? '',
    validation: boss.finalChallenge?.validation ?? '',
  });
  totalXp += (boss.xp || 0) + (boss.flawlessBonus || 0);
  coreXp += (boss.xp || 0) + (boss.flawlessBonus || 0);
});

// ----- run CPython grading -----
const dir = mkdtempSync(join(tmpdir(), 'codex-validate-'));
const manifestPath = join(dir, 'challenges.json');
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
const res = spawnSync('python3', [join(here, 'run_checks.py'), manifestPath], {
  encoding: 'utf-8',
  timeout: 120000,
});
process.stdout.write(res.stdout || '');
process.stderr.write(res.stderr || '');
const pythonFailed = res.status !== 0;

// ----- report -----
console.log('');
console.log(`Structural errors: ${errors.length}`);
errors.forEach((e) => console.log(`  ERROR ${e}`));
console.log(`Warnings: ${warnings.length}`);
warnings.forEach((w) => console.log(`  warn  ${w}`));
console.log('');
console.log(`Total attainable XP from curriculum: ${totalXp}`);
console.log(`  breakdown: core ${coreXp} / extras ${extrasXp} / trace ${traceXp}`);
console.log('(plus achievement XP — see js/gamification.js; final rank threshold must stay below the sum)');

if (errors.length || pythonFailed) {
  console.log('\nCONTENT GATE: FAILED');
  process.exit(1);
}
console.log('\nCONTENT GATE: PASSED');
