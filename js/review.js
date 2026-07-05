// ============================================================
// review.js — the Leitner scheduler behind the Night Vigil and
// the wardens' memory. Draws retrieval questions only from
// content the learner has completed, due-date-driven and
// weakness-weighted, with a date-seeded fill so the same vigil
// stands all day. Pure functions over a passed state object —
// no DOM, no side effects.
// ============================================================

import { curriculum } from './data/curriculum.js';
import { todayStamp } from './state.js';

// ---------------- hashing & seeded randomness ----------------

function djb2(str) {
  let h = 5381;
  const s = String(str);
  for (let i = 0; i < s.length; i += 1) {
    h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  }
  return h >>> 0;
}

// Stable 6-char base36 fingerprint of a question's text. A rewritten
// question orphans its old ledger record cleanly.
export function qHash(text) {
  return djb2(text).toString(36).padStart(6, '0').slice(-6);
}

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------- the eligible pool ----------------
// Only wards the learner has raised: lesson quizzes of complete
// lessons, boss gauntlets of fallen wardens.

function lessonComplete(st, lessonId) {
  const rec = st.lessons && st.lessons[lessonId];
  return Boolean(rec && rec.challenge && rec.quiz);
}

export function eligiblePool(st) {
  const pool = [];
  curriculum.acts.forEach((act, actIndex) => {
    act.lessons.forEach((lesson) => {
      if (!lessonComplete(st, lesson.id)) return;
      lesson.quiz.forEach((q, qi) => {
        pool.push({ qid: `${lesson.id}:q${qi}`, q, actIndex });
      });
    });
    if (st.bosses && st.bosses[act.id]) {
      act.boss.gauntlet.forEach((q, gi) => {
        pool.push({ qid: `${act.id}-boss:g${gi}`, q, actIndex });
      });
    }
  });
  return pool;
}

// ---------------- the nightly draw ----------------
// Due records first (lowest box, then most-scarred), then a
// date-seeded fill preferring never-retrieved questions and older
// material. Same day + same name = same vigil; no reroll.

export function buildVigil(st, n = 6) {
  const pool = eligiblePool(st);
  if (!pool.length) return [];
  const today = todayStamp();
  const records = st.questions || {};
  const byQid = new Map(pool.map((e) => [e.qid, e]));

  const due = [];
  for (const [qid, rec] of Object.entries(records)) {
    if (!rec || !rec.dueDay || rec.dueDay > today) continue;
    const entry = byQid.get(qid);
    if (!entry) continue; // ledger stray — content no longer eligible
    if (qHash(entry.q.q) !== rec.hash) continue; // question was rewritten
    due.push({ entry, rec });
  }
  due.sort((a, b) => {
    if (a.rec.box !== b.rec.box) return a.rec.box - b.rec.box;
    const missA = a.rec.missed / Math.max(1, a.rec.seen);
    const missB = b.rec.missed / Math.max(1, b.rec.seen);
    return missB - missA;
  });

  const picked = due.slice(0, n).map((d) => d.entry);
  if (picked.length < n) {
    const chosen = new Set(picked.map((e) => e.qid));
    const rng = mulberry32(djb2(today + (st.name || '')));
    const rest = pool
      .filter((e) => !chosen.has(e.qid))
      .map((e) => ({ e, r: rng() }));
    rest.sort((a, b) => {
      const recA = records[a.e.qid] ? 1 : 0;
      const recB = records[b.e.qid] ? 1 : 0;
      if (recA !== recB) return recA - recB; // never-retrieved first
      if (a.e.actIndex !== b.e.actIndex) return a.e.actIndex - b.e.actIndex; // oldest material
      return a.r - b.r;
    });
    for (const { e } of rest) {
      if (picked.length >= n) break;
      picked.push(e);
    }
  }
  return picked.slice(0, n);
}

// ---------------- the wardens' memory ----------------
// Review questions for a boss gauntlet: earlier acts only, due and
// low-box wounds first, random fill.

export function pickReviewForBoss(st, beforeActIndex, n = 2) {
  const pool = eligiblePool(st).filter((e) => e.actIndex < beforeActIndex);
  if (!pool.length) return [];
  const today = todayStamp();
  const records = st.questions || {};
  const scored = pool.map((e) => {
    const raw = records[e.qid];
    const rec = raw && qHash(e.q.q) === raw.hash ? raw : null;
    return {
      e,
      due: rec && rec.dueDay && rec.dueDay <= today ? 0 : 1,
      box: rec ? rec.box : 99,
      r: Math.random(),
    };
  });
  scored.sort((a, b) => (a.due - b.due) || (a.box - b.box) || (a.r - b.r));
  return scored.slice(0, n).map((s) => s.e);
}
