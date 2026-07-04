// ============================================================
// curriculum.js — assembles the five acts of the Codex and
// provides lookup helpers used by the views.
// ============================================================

import act1 from './act1.js';
import act2 from './act2.js';
import act3 from './act3.js';
import act4 from './act4.js';
import act5 from './act5.js';
import act6 from './act6.js';
import act7 from './act7.js';
import act8 from './act8.js';

export const curriculum = { acts: [act1, act2, act3, act4, act5, act6, act7, act8] };

const lessonIndex = new Map();
const actIndexById = new Map();

curriculum.acts.forEach((act, ai) => {
  actIndexById.set(act.id, ai);
  act.lessons.forEach((lesson, li) => {
    lessonIndex.set(lesson.id, { act, actIndex: ai, lesson, lessonIndex: li });
  });
});

export function findLesson(lessonId) {
  return lessonIndex.get(lessonId) || null;
}

export function findAct(actId) {
  const ai = actIndexById.get(actId);
  if (ai === undefined) return null;
  return { act: curriculum.acts[ai], actIndex: ai };
}
