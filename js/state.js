// ============================================================
// state.js — the soul jar. All persistent progress lives here,
// bound to localStorage. Nothing leaves the browser.
// ============================================================

const SAVE_KEY = 'darkcodex.save.v1';

function stampOf(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function todayStamp() {
  return stampOf(new Date());
}

function offsetStamp(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return stampOf(d);
}

function defaultState() {
  return {
    version: 1,
    name: '',
    allegiance: '',            // 'wand' | 'ring'
    createdAt: Date.now(),
    xp: 0,
    // lessonId -> { challenge, quiz, perfectQuiz, usedSolution, seen,
    //               fails, hintsRevealed, extras: {}, traces: {} }
    // Extras' own forge records live in this same map under their stable
    // extra ids (a2l5x1…) — they never collide with lesson ids.
    lessons: {},
    // actId -> true when its boss has fallen
    bosses: {},
    achievements: [],
    // history: ISO day-stamps of every touched day (cap 90, FIFO) — the
    // Kept Nights. A streak reset never clears it: unlosable by design.
    streak: { last: '', count: 0, best: 0, embers: 0, emberLog: [], history: [] },
    settings: { sfx: true, volume: 0.5, voiceNoticed: false },
    resume: { route: '', label: '', at: 0 },
    // qid -> { seen, missed, box, lastDay, dueDay, hash } — the question ledger
    questions: {},
    // workingId -> { stage: <next unfinished index>, done: {stageId: true} }
    workings: {},
    // riteId -> { checks: {checkId: true}, quizPassed, done }
    rites: {},
    vigil: { lastDay: '', count: 0 },
    // The Rekindling: the return-rite is offered at most once per calendar day.
    rekindle: { lastOffered: '' },
    // Trial by Ordeal: actId -> { attemptedOn, won } — one attempt per
    // calendar day against a still-sealed act's warden.
    ordeals: {},
    // The Echo: actId -> { livesLeft, flawless } — personal bests,
    // max-merged on every victory, never downgraded.
    bossBests: {},
    // The Reliquary: actId -> { pristine } — one relic per fallen warden.
    relics: {},
    // The Black Oaths: actId -> { oathId: true } — oaths kept on a
    // victorious rematch. Each pays its XP once, ever.
    oaths: {},
    stats: {
      runs: 0,
      failedRuns: 0,
      challengesSolved: 0,
      quizzesPerfect: 0,
      hintsUsed: 0,
      solutionsViewed: 0,
      unaidedStreak: 0,        // consecutive first-solves without opening the notes
    },
  };
}

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    // Merge onto defaults so older saves survive schema additions.
    const base = defaultState();
    const merged = {
      ...base,
      ...parsed,
      streak: { ...base.streak, ...(parsed.streak || {}) },
      stats: { ...base.stats, ...(parsed.stats || {}) },
      settings: { ...base.settings, ...(parsed.settings || {}) },
      resume: { ...base.resume, ...(parsed.resume || {}) },
      vigil: { ...base.vigil, ...(parsed.vigil || {}) },
      rekindle: { ...base.rekindle, ...(parsed.rekindle || {}) },
    };
    // Coerce numerics so a hand-edited save can't smuggle markup into
    // render paths that interpolate these values.
    merged.xp = Number(merged.xp) || 0;
    for (const k of Object.keys(base.stats)) merged.stats[k] = Number(merged.stats[k]) || 0;
    merged.streak.count = Number(merged.streak.count) || 0;
    merged.streak.best = Number(merged.streak.best) || 0;
    merged.streak.embers = Number(merged.streak.embers) || 0;
    if (!Array.isArray(merged.streak.emberLog)) merged.streak.emberLog = [];
    if (!Array.isArray(merged.streak.history)) merged.streak.history = [];
    merged.settings.volume = Number(merged.settings.volume) || 0.5;
    merged.settings.sfx = Boolean(merged.settings.sfx);
    merged.settings.voiceNoticed = Boolean(merged.settings.voiceNoticed);
    merged.resume.route = String(merged.resume.route || '');
    merged.resume.label = String(merged.resume.label || '');
    merged.resume.at = Number(merged.resume.at) || 0;
    merged.vigil.lastDay = String(merged.vigil.lastDay || '');
    merged.vigil.count = Number(merged.vigil.count) || 0;
    if (typeof merged.rekindle !== 'object' || !merged.rekindle || Array.isArray(merged.rekindle)) {
      merged.rekindle = { ...base.rekindle };
    }
    merged.rekindle.lastOffered = String(merged.rekindle.lastOffered || '');
    if (typeof merged.questions !== 'object' || !merged.questions || Array.isArray(merged.questions)) {
      merged.questions = {};
    }
    // Old saves carry neither map; individual records may also lack
    // fields (the merge is shallow) — reads below stay defensive.
    if (typeof merged.workings !== 'object' || !merged.workings || Array.isArray(merged.workings)) {
      merged.workings = {};
    }
    if (typeof merged.rites !== 'object' || !merged.rites || Array.isArray(merged.rites)) {
      merged.rites = {};
    }
    // The arena's ledgers (ordeals/bossBests/relics/oaths) arrived after
    // the first saves shipped — default every one; records stay shallow,
    // so field reads below remain defensive.
    for (const k of ['ordeals', 'bossBests', 'relics', 'oaths']) {
      if (typeof merged[k] !== 'object' || !merged[k] || Array.isArray(merged[k])) {
        merged[k] = {};
      }
    }
    return merged;
  } catch {
    return defaultState();
  }
}

export function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked — the Codex forgets, but must not crash.
  }
}

export function getState() {
  return state;
}

export function resetState() {
  state = defaultState();
  save();
}

export function setProfile(name, allegiance) {
  state.name = name;
  state.allegiance = allegiance;
  save();
}

export function hasProfile() {
  return Boolean(state.name && state.allegiance);
}

// ---------------- streak ----------------

// Returns 0 when today was already touched (falsy — callers unchanged),
// 1 when the streak extended or reset as before, and 2 when a banked
// ember was silently burned to bridge exactly one missed day.
export function touchStreak() {
  const today = todayStamp();
  if (state.streak.last === today) return 0;
  const yesterday = offsetStamp(-1);
  const dayBefore = offsetStamp(-2);
  let result = 1;
  if (state.streak.last === yesterday) {
    state.streak.count += 1;
  } else if (state.streak.last === dayBefore && state.streak.embers > 0) {
    state.streak.embers -= 1;
    state.streak.emberLog.push({ day: today, kind: 'burned' });
    state.streak.count += 1;
    result = 2;
  } else {
    state.streak.count = 1;
  }
  state.streak.best = Math.max(state.streak.best, state.streak.count);
  state.streak.last = today;
  // The Kept Nights: every touched day leaves a candle that no broken
  // streak can put out. Capped at 90 stamps, oldest first out.
  if (!Array.isArray(state.streak.history)) state.streak.history = [];
  state.streak.history.push(today);
  if (state.streak.history.length > 90) {
    state.streak.history.splice(0, state.streak.history.length - 90);
  }
  save();
  return result;
}

// Bank an ember (cap 2). Embers are earned, never bought: a warden's
// first fall, or every seventh unbroken night.
export function grantEmber(reason) {
  if (state.streak.embers >= 2) return false;
  state.streak.embers += 1;
  state.streak.emberLog.push({ day: todayStamp(), kind: reason });
  save();
  return true;
}

// ---------------- XP ----------------

export function addXp(amount) {
  state.xp += amount;
  save();
  return state.xp;
}

// ---------------- lesson progress ----------------

// NOTE: the load() merge is shallow for lesson records — old saves carry
// records WITHOUT the newer fields (fails, hintsRevealed, extras, traces),
// so every read of those fields below stays defensive.
function lessonRec(lessonId) {
  if (!state.lessons[lessonId]) {
    state.lessons[lessonId] = {
      challenge: false, quiz: false, perfectQuiz: false, usedSolution: false, seen: false,
      fails: 0, hintsRevealed: 0, extras: {}, traces: {},
    };
  }
  return state.lessons[lessonId];
}

export function getLessonProgress(lessonId) {
  return state.lessons[lessonId] || {
    challenge: false, quiz: false, perfectQuiz: false, usedSolution: false, seen: false,
    fails: 0, hintsRevealed: 0, extras: {}, traces: {},
  };
}

// The grimoire writes itself once: after the first visit the narrative
// renders instantly on every return.
export function markSeen(lessonId) {
  const rec = lessonRec(lessonId);
  if (!rec.seen) {
    rec.seen = true;
    save();
  }
}

export function markChallenge(lessonId) {
  const rec = lessonRec(lessonId);
  const first = !rec.challenge;
  rec.challenge = true;
  if (first) {
    state.stats.challengesSolved += 1;
    // An unbroken run of solves without opening the notes — Parselmouth
    // watches this counter, not a lifetime scar.
    if (!rec.usedSolution) {
      state.stats.unaidedStreak = (Number(state.stats.unaidedStreak) || 0) + 1;
    }
    // The Unaided sigil is judged at the moment of first conquest and
    // frozen: studying whispers or notes afterwards downgrades nothing.
    rec.sigilUnaided = (Number(rec.hintsRevealed) || 0) === 0 && !rec.usedSolution;
  }
  save();
  return first;
}

export function markQuiz(lessonId, perfect) {
  const rec = lessonRec(lessonId);
  const first = !rec.quiz;
  rec.quiz = true;
  // Only a flawless FIRST attempt counts — retakes with the answers
  // already revealed must not feed the Legilimens achievement.
  if (first && perfect) {
    rec.perfectQuiz = true;
    state.stats.quizzesPerfect += 1;
  }
  save();
  return first;
}

export function markSolutionViewed(lessonId) {
  const rec = lessonRec(lessonId);
  // Opening the notes on a trial not yet conquered breaks the unbroken
  // run; studying a trial already yours costs nothing.
  if (!rec.challenge) state.stats.unaidedStreak = 0;
  if (!rec.usedSolution) {
    rec.usedSolution = true;
    state.stats.solutionsViewed += 1;
  }
  save();
}

export function isLessonComplete(lessonId) {
  const rec = state.lessons[lessonId];
  return Boolean(rec && rec.challenge && rec.quiz);
}

// ---------------- extras & traces (optional workings; never gating) ----------------

export function markExtraSolved(lessonId, extraId) {
  const rec = lessonRec(lessonId);
  if (typeof rec.extras !== 'object' || !rec.extras) rec.extras = {};
  const first = !rec.extras[extraId];
  rec.extras[extraId] = true;
  // The extra's own forge record marks its challenge passed too, so
  // later note-peeks there no longer break the unaided run.
  lessonRec(extraId).challenge = true;
  save();
  return first;
}

export function isExtraSolved(lessonId, extraId) {
  const rec = state.lessons[lessonId];
  return Boolean(rec && rec.extras && rec.extras[extraId]);
}

export function markTraceSolved(lessonId, traceId) {
  const rec = lessonRec(lessonId);
  if (typeof rec.traces !== 'object' || !rec.traces) rec.traces = {};
  const first = !rec.traces[traceId];
  rec.traces[traceId] = true;
  save();
  return first;
}

export function isTraceSolved(lessonId, traceId) {
  const rec = state.lessons[lessonId];
  return Boolean(rec && rec.traces && rec.traces[traceId]);
}

// ---------------- great workings (post-boss epilogues; never gating) ----------------
// workingId -> { stage: <next unfinished index>, done: {stageId: true} }.
// Records from hand-edited or partial saves may lack fields — reads guard.

function workingRec(workingId) {
  if (typeof state.workings !== 'object' || !state.workings || Array.isArray(state.workings)) {
    state.workings = {};
  }
  let rec = state.workings[workingId];
  if (typeof rec !== 'object' || !rec || Array.isArray(rec)) {
    rec = { stage: 0, done: {} };
    state.workings[workingId] = rec;
  }
  if (typeof rec.done !== 'object' || !rec.done || Array.isArray(rec.done)) rec.done = {};
  rec.stage = Number(rec.stage) || 0;
  return rec;
}

export function getWorkingProgress(workingId) {
  const rec = (state.workings || {})[workingId];
  if (typeof rec !== 'object' || !rec || Array.isArray(rec)) return { stage: 0, done: {} };
  return {
    stage: Number(rec.stage) || 0,
    done: (typeof rec.done === 'object' && rec.done && !Array.isArray(rec.done)) ? rec.done : {},
  };
}

export function isWorkingStageDone(workingId, stageId) {
  return Boolean(getWorkingProgress(workingId).done[stageId]);
}

// Marks a stage forged; returns true only the first time (the sole gate
// on the stage's XP). `stage` stays the next unfinished index.
export function markWorkingStageDone(workingId, stageId, stageIndex) {
  const rec = workingRec(workingId);
  const first = !rec.done[stageId];
  rec.done[stageId] = true;
  rec.stage = Math.max(rec.stage, stageIndex + 1);
  save();
  return first;
}

// ---------------- rites (post-working epilogues; never gating) ----------------
// riteId -> { checks: {checkId: true}, quizPassed, done }.

function riteRec(riteId) {
  if (typeof state.rites !== 'object' || !state.rites || Array.isArray(state.rites)) {
    state.rites = {};
  }
  let rec = state.rites[riteId];
  if (typeof rec !== 'object' || !rec || Array.isArray(rec)) {
    rec = { checks: {}, quizPassed: false, done: false };
    state.rites[riteId] = rec;
  }
  if (typeof rec.checks !== 'object' || !rec.checks || Array.isArray(rec.checks)) rec.checks = {};
  return rec;
}

export function getRiteProgress(riteId) {
  const rec = (state.rites || {})[riteId];
  if (typeof rec !== 'object' || !rec || Array.isArray(rec)) {
    return { checks: {}, quizPassed: false, done: false };
  }
  return {
    checks: (typeof rec.checks === 'object' && rec.checks && !Array.isArray(rec.checks)) ? rec.checks : {},
    quizPassed: Boolean(rec.quizPassed),
    done: Boolean(rec.done),
  };
}

export function setRiteCheck(riteId, checkId, on) {
  const rec = riteRec(riteId);
  if (on) rec.checks[checkId] = true;
  else delete rec.checks[checkId];
  save();
}

export function markRiteQuizPassed(riteId) {
  const rec = riteRec(riteId);
  if (!rec.quizPassed) {
    rec.quizPassed = true;
    save();
  }
}

// Returns true only on the first completion — the sole gate on rite XP.
export function markRiteDone(riteId) {
  const rec = riteRec(riteId);
  const first = !rec.done;
  rec.done = true;
  save();
  return first;
}

// ---------------- the forge's memory (fails + hint ladder) ----------------
// Keyed by recordKey: a lesson id, or an extra's own stable id.

export function getFails(recordKey) {
  const rec = state.lessons[recordKey];
  return rec ? Number(rec.fails) || 0 : 0;
}

// One more failed cast on the current working; returns the running count.
export function recordFail(recordKey) {
  const rec = lessonRec(recordKey);
  rec.fails = (Number(rec.fails) || 0) + 1;
  // The One-Cast sigil is history-honest: the first failed cast on a
  // trial not yet conquered is written down forever. Fails AFTER the
  // conquest (refinement, Re-forge) rewrite nothing — upgrades only.
  if (!rec.challenge && !rec.failedBefore) rec.failedBefore = true;
  save();
  return rec.fails;
}

// A passing cast clears the tally of consecutive misfires.
export function resetFails(recordKey) {
  const rec = state.lessons[recordKey];
  if (rec && Number(rec.fails)) {
    rec.fails = 0;
    save();
  }
}

export function getHintsRevealed(recordKey) {
  const rec = state.lessons[recordKey];
  return rec ? Number(rec.hintsRevealed) || 0 : 0;
}

// Persist the ladder position. stats.hintsUsed counts only genuinely new
// reveals — a reload re-rendering old whispers costs nothing.
export function markHintRevealed(recordKey, count) {
  const rec = lessonRec(recordKey);
  const prev = Number(rec.hintsRevealed) || 0;
  if (count <= prev) return false;
  rec.hintsRevealed = count;
  state.stats.hintsUsed += count - prev;
  save();
  return true;
}

// ---------------- sigils of mastery (heraldic, zero XP) ----------------
// SIGIL SEMANTICS — history-honest, upgrade-only, never a currency:
// • One-Cast: the trial fell to the very first casting. `failedBefore`
//   is written on the first failed cast while the trial is still
//   unconquered and is NEVER cleared — a Re-forge cannot rewrite history.
// • Flawless: the interrogation withstood on the first attempt without
//   a single wrong pick (perfectQuiz is already first-attempt-only).
// • Unaided: the trial fell with no whisper and no notes. Judged and
//   frozen at first conquest (`sigilUnaided`); records from before this
//   field existed fall back to the derived rule. A later CLEAN Re-forge
//   may earn it — `reforge.clean` is persisted the moment the attempt
//   starts and broken the moment any aid is taken, so a reload can
//   never launder a dirtied attempt.

export function sigilsFor(lessonId) {
  const rec = state.lessons[lessonId];
  if (!rec) return { oneCast: false, flawless: false, unaided: false };
  const passed = Boolean(rec.challenge);
  let unaided = false;
  if (passed) {
    unaided = typeof rec.sigilUnaided === 'boolean'
      ? rec.sigilUnaided
      : (Number(rec.hintsRevealed) || 0) === 0 && !rec.usedSolution;
  }
  return {
    oneCast: passed && !rec.failedBefore,
    flawless: Boolean(rec.perfectQuiz),
    unaided,
  };
}

// A Re-forge attempt on a conquered trial. Its forge keeps its own
// ledger under `reforge.<lessonId>` (the extras pattern), so the fresh
// attempt's hint ladder and misfire tally start cold every time.
export function beginReforge(lessonId) {
  const rec = lessonRec(lessonId);
  rec.reforge = { clean: true };
  const sub = lessonRec(`reforge.${lessonId}`);
  sub.fails = 0;
  sub.hintsRevealed = 0;
  save();
}

export function getReforge(lessonId) {
  const rec = state.lessons[lessonId];
  const r = rec && rec.reforge;
  return (typeof r === 'object' && r && !Array.isArray(r)) ? r : null;
}

// Any aid — a whisper, the notes — dirties the running attempt at once.
export function dirtyReforge(lessonId) {
  const r = getReforge(lessonId);
  if (r && r.clean) {
    r.clean = false;
    save();
  }
}

// Close the running attempt on a passing cast. Returns the attempt's
// cleanliness (true earns the Unaided sigil), or null when no attempt
// stands — a second pass on the same mount closes nothing twice.
export function finishReforge(lessonId) {
  const rec = state.lessons[lessonId];
  const r = getReforge(lessonId);
  if (!rec || !r) return null;
  const clean = Boolean(r.clean);
  if (clean) rec.sigilUnaided = true;
  rec.reforge = null;
  save();
  return clean;
}

// ---------------- the sealed prophecy (calibration) ----------------
// lessons[id].prophecy = { guess, actual?, hit } — sealed once per
// lesson, resolved once at the interrogation's first completion.
// An exact reading pays 10 XP, exactly once; skipping costs nothing.

export function setProphecy(lessonId, guess) {
  const rec = lessonRec(lessonId);
  if (rec.prophecy) return false; // the seal is set once
  rec.prophecy = { guess: Number(guess) || 0, hit: false };
  save();
  return true;
}

export function getProphecy(lessonId) {
  const rec = state.lessons[lessonId];
  const p = rec && rec.prophecy;
  return (typeof p === 'object' && p && !Array.isArray(p)) ? p : null;
}

// Resolve against the true count. Returns { hit } the one time the
// prophecy resolves; null when there is nothing (left) to resolve.
export function resolveProphecy(lessonId, actual) {
  const p = getProphecy(lessonId);
  if (!p || typeof p.guess !== 'number' || typeof p.actual === 'number') return null;
  p.actual = Number(actual) || 0;
  p.hit = p.guess === p.actual;
  save();
  return { hit: p.hit };
}

// ---------------- the rekindling ----------------

// Stamp the return-rite as offered today; it fires at most once per
// calendar day whether walked, failed, or passed on.
export function markRekindleOffered() {
  if (typeof state.rekindle !== 'object' || !state.rekindle || Array.isArray(state.rekindle)) {
    state.rekindle = { lastOffered: '' };
  }
  state.rekindle.lastOffered = todayStamp();
  save();
}

export function markBossDefeated(actId) {
  const first = !state.bosses[actId];
  state.bosses[actId] = true;
  save();
  return first;
}

export function isBossDefeated(actId) {
  return Boolean(state.bosses[actId]);
}

// ---------------- trial by ordeal ----------------
// actId -> { attemptedOn, won }. One attempt per calendar day; the stamp
// is written the moment the trial begins, so a reload buys nothing.

function ordealRec(actId) {
  if (typeof state.ordeals !== 'object' || !state.ordeals || Array.isArray(state.ordeals)) {
    state.ordeals = {};
  }
  let rec = state.ordeals[actId];
  if (typeof rec !== 'object' || !rec || Array.isArray(rec)) {
    rec = { attemptedOn: '', won: false };
    state.ordeals[actId] = rec;
  }
  return rec;
}

export function getOrdeal(actId) {
  const rec = (state.ordeals || {})[actId];
  if (typeof rec !== 'object' || !rec || Array.isArray(rec)) {
    return { attemptedOn: '', won: false };
  }
  return { attemptedOn: String(rec.attemptedOn || ''), won: Boolean(rec.won) };
}

export function markOrdealAttempted(actId) {
  const rec = ordealRec(actId);
  rec.attemptedOn = todayStamp();
  save();
}

export function markOrdealWon(actId) {
  const rec = ordealRec(actId);
  rec.won = true;
  save();
}

// ---------------- the echo (personal bests) ----------------
// Max-merge on every victory: candles standing only climb, and a
// flawless run is never forgotten. Nothing here ever downgrades.

export function getBossBest(actId) {
  const rec = (state.bossBests || {})[actId];
  if (typeof rec !== 'object' || !rec || Array.isArray(rec)) return null;
  return { livesLeft: Number(rec.livesLeft) || 0, flawless: Boolean(rec.flawless) };
}

export function recordBossBest(actId, { livesLeft, flawless }) {
  if (typeof state.bossBests !== 'object' || !state.bossBests || Array.isArray(state.bossBests)) {
    state.bossBests = {};
  }
  const prev = getBossBest(actId) || { livesLeft: 0, flawless: false };
  state.bossBests[actId] = {
    livesLeft: Math.max(prev.livesLeft, Number(livesLeft) || 0),
    flawless: prev.flawless || Boolean(flawless),
  };
  save();
}

// ---------------- the reliquary ----------------
// One relic per fallen warden; pristine only when the victory earned it
// (flawless, or won under any oath). Upgrade-only: a relic once bright
// is never tarnished again. Saves from before this shelf existed derive
// an honest default — tarnished, unless the bests already prove better.

export function relicFor(actId) {
  if (!state.bosses[actId]) return null;
  const rec = (state.relics || {})[actId];
  if (typeof rec === 'object' && rec && !Array.isArray(rec)) {
    return { pristine: Boolean(rec.pristine) };
  }
  const best = getBossBest(actId);
  const kept = getOathsKept(actId);
  return { pristine: Boolean(best && best.flawless) || Object.keys(kept).length > 0 };
}

export function setRelic(actId, pristine) {
  if (typeof state.relics !== 'object' || !state.relics || Array.isArray(state.relics)) {
    state.relics = {};
  }
  const prev = relicFor(actId);
  state.relics[actId] = { pristine: Boolean(pristine) || Boolean(prev && prev.pristine) };
  save();
}

// ---------------- the black oaths ----------------
// actId -> { oathId: true }. markOathKept returns true only the first
// time ever — the sole gate on each oath's 25 XP, per oath, per act.

export function getOathsKept(actId) {
  const rec = (state.oaths || {})[actId];
  return (typeof rec === 'object' && rec && !Array.isArray(rec)) ? rec : {};
}

export function markOathKept(actId, oathId) {
  if (typeof state.oaths !== 'object' || !state.oaths || Array.isArray(state.oaths)) {
    state.oaths = {};
  }
  let rec = state.oaths[actId];
  if (typeof rec !== 'object' || !rec || Array.isArray(rec)) {
    rec = {};
    state.oaths[actId] = rec;
  }
  const first = !rec[oathId];
  rec[oathId] = true;
  save();
  return first;
}

// ---------------- unlock rules ----------------
// Lessons unlock in order within an act; an act's boss unlocks when all
// its lessons are complete; the next act unlocks when the boss falls.

export function isActUnlocked(curriculum, actIndex) {
  if (actIndex === 0) return true;
  // An act whose own warden has fallen is open regardless of the acts
  // before it — the Trial by Ordeal conquers out of order, and the
  // conquered act's lessons stay available, exactly as promised.
  return isBossDefeated(curriculum.acts[actIndex - 1].id)
    || isBossDefeated(curriculum.acts[actIndex].id);
}

export function isLessonUnlocked(curriculum, actIndex, lessonIndex) {
  if (!isActUnlocked(curriculum, actIndex)) return false;
  if (lessonIndex === 0) return true;
  const prev = curriculum.acts[actIndex].lessons[lessonIndex - 1];
  return isLessonComplete(prev.id);
}

export function isBossUnlocked(curriculum, actIndex) {
  if (!isActUnlocked(curriculum, actIndex)) return false;
  return curriculum.acts[actIndex].lessons.every((l) => isLessonComplete(l.id));
}

export function actProgress(act) {
  const total = act.lessons.length + 1; // lessons + boss
  let done = act.lessons.filter((l) => isLessonComplete(l.id)).length;
  if (isBossDefeated(act.id)) done += 1;
  return { done, total };
}

// ---------------- misc stats ----------------

export function recordRun(success) {
  state.stats.runs += 1;
  if (!success) state.stats.failedRuns += 1;
  save();
}

export function unlockAchievement(id) {
  if (state.achievements.includes(id)) return false;
  state.achievements.push(id);
  save();
  return true;
}

export function hasAchievement(id) {
  return state.achievements.includes(id);
}

// ---------------- settings ----------------

export function setSfx(on) {
  state.settings.sfx = Boolean(on);
  save();
}

export function markVoiceNoticed() {
  if (!state.settings.voiceNoticed) {
    state.settings.voiceNoticed = true;
    save();
  }
}

// ---------------- resume (the candle you left burning) ----------------

export function setResume(route, label) {
  state.resume = { route: String(route), label: String(label), at: Date.now() };
  save();
}

// ---------------- the question ledger (Leitner boxes) ----------------

const BOX_INTERVALS = [1, 2, 4, 9, 16];

export function recordQuestionOutcome(qid, correct, hash) {
  if (typeof state.questions !== 'object' || !state.questions) state.questions = {};
  let rec = state.questions[qid];
  // A rewritten question orphans its old scars cleanly.
  if (!rec || rec.hash !== hash) {
    rec = { seen: 0, missed: 0, box: 0, lastDay: '', dueDay: '', hash };
    state.questions[qid] = rec;
  }
  rec.seen += 1;
  if (!correct) rec.missed += 1;
  const today = todayStamp();
  // Boxes move at most once per day: repeats sharpen, they do not promote.
  if (rec.lastDay !== today) {
    rec.box = correct ? Math.min(rec.box + 1, 4) : 0;
    rec.dueDay = offsetStamp(BOX_INTERVALS[rec.box]);
  }
  rec.lastDay = today;
  save();
}

// ---------------- the night vigil ----------------

// Returns true only on the first completed walk of the day — the sole
// gate on the vigil's fixed 25 XP.
export function markVigilWalked() {
  const today = todayStamp();
  if (state.vigil.lastDay === today) return false;
  state.vigil.lastDay = today;
  state.vigil.count += 1;
  save();
  return true;
}
