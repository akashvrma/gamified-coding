// ============================================================
// state.js — the soul jar. All persistent progress lives here,
// bound to localStorage. Nothing leaves the browser.
// ============================================================

const SAVE_KEY = 'darkcodex.save.v1';

function todayStamp() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function defaultState() {
  return {
    version: 1,
    name: '',
    allegiance: '',            // 'wand' | 'ring'
    createdAt: Date.now(),
    xp: 0,
    // lessonId -> { challenge: bool, quiz: bool, perfectQuiz: bool, usedSolution: bool }
    lessons: {},
    // actId -> true when its boss has fallen
    bosses: {},
    achievements: [],
    streak: { last: '', count: 0, best: 0 },
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
    return {
      ...base,
      ...parsed,
      streak: { ...base.streak, ...(parsed.streak || {}) },
      stats: { ...base.stats, ...(parsed.stats || {}) },
    };
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

// Returns true when today extended the streak (first activity of the day).
export function touchStreak() {
  const today = todayStamp();
  if (state.streak.last === today) return false;
  const yesterday = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();
  state.streak.count = state.streak.last === yesterday ? state.streak.count + 1 : 1;
  state.streak.best = Math.max(state.streak.best, state.streak.count);
  state.streak.last = today;
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
      challenge: false, quiz: false, perfectQuiz: false, usedSolution: false,
    };
  }
  return state.lessons[lessonId];
}

export function getLessonProgress(lessonId) {
  return state.lessons[lessonId] || {
    challenge: false, quiz: false, perfectQuiz: false, usedSolution: false,
  };
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
  if (perfect && !rec.perfectQuiz) {
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
