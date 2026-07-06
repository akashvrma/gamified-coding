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
  const records = st.questions || {};
  curriculum.acts.forEach((act, actIndex) => {
    act.lessons.forEach((lesson) => {
      if (!lessonComplete(st, lesson.id)) return;
      lesson.quiz.forEach((q, qi) => {
        pool.push({ qid: `${lesson.id}:q${qi}`, q, actIndex });
      });
      // Trace wards enter the watch through the ledger: only scryings
      // the learner has actually read (and whose text still matches)
      // are walked again. They carry their code — the vigil must show
      // the working being read, not the question alone.
      (Array.isArray(lesson.trace) ? lesson.trace : []).forEach((t) => {
        const qid = `${lesson.id}:trace:${t.id}`;
        const rec = records[qid];
        if (!rec || rec.hash !== qHash(t.q)) return;
        pool.push({
          qid,
          q: {
            q: t.q, options: t.options, answer: t.answer, explain: t.explain,
          },
          code: t.code,
          actIndex,
        });
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
// material. Same day + same name = same vigil; no reroll. The draw is
// deterministic per (date, length, actFilter): the underlying ordering
// never depends on n, so the Short watch is a prefix of the Long.
// actFilter (an act index) narrows the watch to one act's wards —
// the Fading Wards deep-link — and never changes the daily XP cap.

export function buildVigil(st, n = 6, actFilter = null) {
  let pool = eligiblePool(st);
  if (actFilter !== null) pool = pool.filter((e) => e.actIndex === actFilter);
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
  // Trace entries carry a code block the gauntlet cannot stage — the
  // wardens probe old wounds with plain questions only.
  const pool = eligiblePool(st).filter((e) => e.actIndex < beforeActIndex && !e.code);
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

// ---------------- the full question index ----------------
// Every question the ledger can name, mapped back to its origin —
// regardless of completion. The Book of Scars and the Rekindling read
// wounds wherever they were taken, including lessons not yet complete.

export function questionIndex() {
  const map = new Map();
  curriculum.acts.forEach((act, actIndex) => {
    act.lessons.forEach((lesson) => {
      (Array.isArray(lesson.quiz) ? lesson.quiz : []).forEach((q, qi) => {
        map.set(`${lesson.id}:q${qi}`, {
          q, actIndex, actId: act.id, kind: 'quiz', route: `#/lesson/${lesson.id}`, origin: lesson.title,
        });
      });
      (Array.isArray(lesson.trace) ? lesson.trace : []).forEach((t) => {
        map.set(`${lesson.id}:trace:${t.id}`, {
          q: {
            q: t.q, options: t.options, answer: t.answer, explain: t.explain,
          },
          code: t.code,
          actIndex,
          actId: act.id,
          kind: 'trace',
          route: `#/lesson/${lesson.id}`,
          origin: lesson.title,
        });
      });
    });
    (act.boss && Array.isArray(act.boss.gauntlet) ? act.boss.gauntlet : []).forEach((q, gi) => {
      map.set(`${act.id}-boss:g${gi}`, {
        q, actIndex, actId: act.id, kind: 'boss', route: `#/boss/${act.id}`, origin: act.boss.title,
      });
    });
    if (act.rite && Array.isArray(act.rite.quiz)) {
      act.rite.quiz.forEach((q, qi) => {
        map.set(`${act.rite.id}:q${qi}`, {
          q, actIndex, actId: act.id, kind: 'rite', route: `#/act/${act.id}`, origin: act.rite.title,
        });
      });
    }
  });
  return map;
}

// ---------------- the fading wards ----------------
// An act's health is the fraction of its ledger items NOT yet due —
// the same due test the vigil walks by. No ledger, no verdict: an act
// never retrieved reads healthy. A cue, never a punishment.

export function actHealth(st, actId) {
  const idx = questionIndex();
  const today = todayStamp();
  let total = 0;
  let due = 0;
  for (const [qid, rec] of Object.entries(st.questions || {})) {
    if (!rec) continue;
    const entry = idx.get(qid);
    if (!entry || entry.actId !== actId) continue;
    if (qHash(entry.q.q) !== rec.hash) continue;
    total += 1;
    if (rec.dueDay && rec.dueDay <= today) due += 1;
  }
  return total ? 1 - due / total : 1;
}

// ---------------- the book of scars ----------------
// A pure read of the existing ledger: every question with a recorded
// miss. A scar FADES after two day-spaced true answers with no fresh
// wound between — which is exactly `box >= 2`: a miss drops the box to
// 0 and boxes rise at most once per calendar day, so reaching box 2
// again takes two correct retrievals on two separate days.

export function scarBook(st) {
  const idx = questionIndex();
  const out = [];
  for (const [qid, rec] of Object.entries(st.questions || {})) {
    if (!rec || !(Number(rec.missed) > 0)) continue;
    const entry = idx.get(qid);
    if (!entry || qHash(entry.q.q) !== rec.hash) continue;
    out.push({
      qid, entry, rec, faded: (Number(rec.box) || 0) >= 2,
    });
  }
  out.sort((a, b) => (a.entry.actIndex - b.entry.actIndex)
    || ((Number(b.rec.missed) || 0) - (Number(a.rec.missed) || 0)));
  return out;
}

// ---------------- the rekindling ----------------
// The learner's PROVEN ground: ledger items with at least two correct
// outcomes on record. The return-rite draws its three questions from
// the strongest of these — highest box first, least-scarred next,
// date-seeded ties — so a lapsed return opens on warm ground.

export function rekindlePool(st) {
  const idx = questionIndex();
  const out = [];
  for (const [qid, rec] of Object.entries(st.questions || {})) {
    if (!rec) continue;
    if ((Number(rec.seen) || 0) - (Number(rec.missed) || 0) < 2) continue;
    const entry = idx.get(qid);
    if (!entry || qHash(entry.q.q) !== rec.hash) continue;
    out.push({ qid, entry, rec });
  }
  return out;
}

export function buildRekindle(st, n = 3) {
  const pool = rekindlePool(st);
  const rng = mulberry32(djb2(`${todayStamp()}::rekindle::${st.name || ''}`));
  const scored = pool.map((p) => ({ ...p, r: rng() }));
  scored.sort((a, b) => {
    const boxA = Number(a.rec.box) || 0;
    const boxB = Number(b.rec.box) || 0;
    if (boxA !== boxB) return boxB - boxA; // strongest first
    const missA = (Number(a.rec.missed) || 0) / Math.max(1, Number(a.rec.seen) || 0);
    const missB = (Number(b.rec.missed) || 0) / Math.max(1, Number(b.rec.seen) || 0);
    if (missA !== missB) return missA - missB; // least-scarred next
    return a.r - b.r;
  });
  return scored.slice(0, n);
}
