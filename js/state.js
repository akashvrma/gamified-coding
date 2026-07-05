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
    // lessonId -> { challenge, quiz, perfectQuiz, usedSolution, seen }
    lessons: {},
    // actId -> true when its boss has fallen
    bosses: {},
    achievements: [],
    streak: { last: '', count: 0, best: 0, embers: 0, emberLog: [] },
    settings: { sfx: true, volume: 0.5, voiceNoticed: false },
    resume: { route: '', label: '', at: 0 },
    // qid -> { seen, missed, box, lastDay, dueDay, hash } — the question ledger
    questions: {},
    vigil: { lastDay: '', count: 0 },
    stats: {
      runs: 0,
      failedRuns: 0,
      challengesSolved: 0,
      quizzesPerfect: 0,
      hintsUsed: 0,
      solutionsViewed: 0,
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
    };
    // Coerce numerics so a hand-edited save can't smuggle markup into
    // render paths that interpolate these values.
    merged.xp = Number(merged.xp) || 0;
    for (const k of Object.keys(base.stats)) merged.stats[k] = Number(merged.stats[k]) || 0;
    merged.streak.count = Number(merged.streak.count) || 0;
    merged.streak.best = Number(merged.streak.best) || 0;
    merged.streak.embers = Number(merged.streak.embers) || 0;
    if (!Array.isArray(merged.streak.emberLog)) merged.streak.emberLog = [];
    merged.settings.volume = Number(merged.settings.volume) || 0.5;
    merged.settings.sfx = Boolean(merged.settings.sfx);
    merged.settings.voiceNoticed = Boolean(merged.settings.voiceNoticed);
    merged.resume.route = String(merged.resume.route || '');
    merged.resume.label = String(merged.resume.label || '');
    merged.resume.at = Number(merged.resume.at) || 0;
    merged.vigil.lastDay = String(merged.vigil.lastDay || '');
    merged.vigil.count = Number(merged.vigil.count) || 0;
    if (typeof merged.questions !== 'object' || !merged.questions || Array.isArray(merged.questions)) {
      merged.questions = {};
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

function lessonRec(lessonId) {
  if (!state.lessons[lessonId]) {
    state.lessons[lessonId] = {
      challenge: false, quiz: false, perfectQuiz: false, usedSolution: false, seen: false,
    };
  }
  return state.lessons[lessonId];
}

export function getLessonProgress(lessonId) {
  return state.lessons[lessonId] || {
    challenge: false, quiz: false, perfectQuiz: false, usedSolution: false, seen: false,
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
  if (first) state.stats.challengesSolved += 1;
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
  if (!rec.usedSolution) {
    rec.usedSolution = true;
    state.stats.solutionsViewed += 1;
    save();
  }
}

export function isLessonComplete(lessonId) {
  const rec = state.lessons[lessonId];
  return Boolean(rec && rec.challenge && rec.quiz);
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

// ---------------- unlock rules ----------------
// Lessons unlock in order within an act; an act's boss unlocks when all
// its lessons are complete; the next act unlocks when the boss falls.

export function isActUnlocked(curriculum, actIndex) {
  if (actIndex === 0) return true;
  return isBossDefeated(curriculum.acts[actIndex - 1].id);
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

export function recordHint() {
  state.stats.hintsUsed += 1;
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
