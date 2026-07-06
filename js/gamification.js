// ============================================================
// gamification.js — ranks, achievements, and the event bus
// that turns study into ascension.
// ============================================================

import * as S from './state.js';
import { toast } from './ui.js';
import { rankUpMoment } from './cinema.js';
import { play } from './sound.js';

// ---------------- ranks ----------------
// XP thresholds are tuned so the final rank demands near-total mastery
// of the Codex (see tools/validate_content.mjs, which prints total XP).

// Thresholds tuned to the 10-act curriculum (19,683 attainable XP:
// core 17,070 + practice extras/traces/workings/rites — see
// tools/validate_content.mjs breakdown line): from rank 3 on, each act
// conquered crests roughly one rank. The final rank demands
// near-everything: core alone (17,070) and even core + all
// achievements (18,695) fall short of 19,300 — at least ~600 XP of
// the optional practice riders must be earned.
export const RANKS = [
  { xp: 0,     title: 'Novice at the Threshold' },
  { xp: 200,   title: 'Initiate of Shadows' },
  { xp: 500,   title: 'Apprentice of the Dark Arts' },
  { xp: 1200,  title: 'Wraith-Touched' },
  { xp: 2600,  title: 'Keeper of Forbidden Texts' },
  { xp: 4100,  title: 'Occlumens' },
  { xp: 5750,  title: 'Herald of the Nine' },
  { xp: 7500,  title: 'Bearer of the Morgul Blade' },
  { xp: 9300,  title: 'Horcrux Forger' },
  { xp: 11200, title: 'Necromancer of Dol Guldur' },
  { xp: 14800, title: 'Dark Lord Ascendant' },
  { xp: 19300, title: 'The Nameless One' },
];

export function rankFor(xp) {
  let idx = 0;
  for (let i = 0; i < RANKS.length; i += 1) {
    if (xp >= RANKS[i].xp) idx = i;
  }
  const rank = RANKS[idx];
  const next = RANKS[idx + 1] || null;
  const span = next ? next.xp - rank.xp : 1;
  const into = next ? xp - rank.xp : 1;
  return {
    index: idx,
    title: rank.title,
    next,
    progress: next ? Math.min(1, into / span) : 1,
  };
}

// ---------------- achievements ----------------
// check(state, event) runs on every emitted event; return true to unlock.

export const ACHIEVEMENTS = [
  {
    id: 'first-spell', icon: '🕯️', xp: 25,
    title: 'First Words in the Dark',
    desc: 'Run your first piece of Python. The dark takes notice.',
    check: (st, ev) => ev.type === 'run',
  },
  {
    id: 'first-blood', icon: '🗡️', xp: 40,
    title: 'First Blood',
    desc: 'Solve your first coding trial.',
    check: (st, ev) => ev.type === 'challenge-solved',
  },
  {
    id: 'splinched', icon: '💀', xp: 30,
    title: 'Splinched',
    desc: 'Fail ten spell castings. Scars are how the craft marks you.',
    check: (st) => st.stats.failedRuns >= 10,
  },
  {
    id: 'borrowed-knowledge', icon: '📖', xp: 10,
    title: 'The Half-Blood Prince’s Notes',
    desc: 'Even the Prince learned from margins. Study it, then make it yours.',
    check: (st, ev) => ev.type === 'solution-viewed',
  },
  {
    id: 'act1-fall', icon: '🚪', xp: 60,
    title: 'Past the Threshold',
    desc: 'Defeat the boss of Act I. The gate has tasted your magic.',
    check: (st, ev) => ev.type === 'boss-defeated' && ev.actId === 'act1',
  },
  {
    id: 'act2-fall', icon: '🔥', xp: 60,
    title: 'Balrog-Slayer',
    desc: 'Defeat the boss of Act II and climb out of the deep.',
    check: (st, ev) => ev.type === 'boss-defeated' && ev.actId === 'act2',
  },
  {
    id: 'act3-fall', icon: '🌊', xp: 60,
    title: 'The Cave Survivor',
    desc: 'Defeat the boss of Act III. The dead do not forgive sloppy code.',
    check: (st, ev) => ev.type === 'boss-defeated' && ev.actId === 'act3',
  },
  {
    id: 'act4-fall', icon: '👑', xp: 60,
    title: 'The Crown Rings Hollow',
    desc: 'Defeat the boss of Act IV. The prophecy that shielded him was never tested against you.',
    check: (st, ev) => ev.type === 'boss-defeated' && ev.actId === 'act4',
  },
  {
    id: 'act5-fall', icon: '☄️', xp: 80,
    title: 'Master of the Hallows',
    desc: 'Defeat the boss of Act V. The old Codex is yours; the archives open.',
    check: (st, ev) => ev.type === 'boss-defeated' && ev.actId === 'act5',
  },
  {
    id: 'act6-fall', icon: '🔮', xp: 80,
    title: 'The Prophecies Read Back',
    desc: 'Defeat the boss of Act VI. The orbs have no secrets from a good ledger.',
    check: (st, ev) => ev.type === 'boss-defeated' && ev.actId === 'act6',
  },
  {
    id: 'act7-fall', icon: '👁️', xp: 80,
    title: 'The Stone Kneels',
    desc: 'Defeat the boss of Act VII. The palantír shows you nothing you have not verified.',
    check: (st, ev) => ev.type === 'boss-defeated' && ev.actId === 'act7',
  },
  {
    id: 'act8-fall', icon: '⚔️', xp: 80,
    title: 'The Alliance Holds',
    desc: 'Defeat the boss of Act VIII. The machine-shadow unravels before minds you forged yourself.',
    check: (st, ev) => ev.type === 'boss-defeated' && ev.actId === 'act8',
  },
  {
    id: 'act9-fall', icon: '🗣️', xp: 80,
    title: 'The Echo Answers to You',
    desc: 'Defeat the boss of Act IX. The speaking things speak on your terms now.',
    check: (st, ev) => ev.type === 'boss-defeated' && ev.actId === 'act9',
  },
  {
    id: 'act10-fall', icon: '🎭', xp: 120,
    title: 'Master of Death',
    desc: 'Defeat the final boss. Even the perfect counterfeit could not deceive you; the Codex has nothing left to teach.',
    check: (st, ev) => ev.type === 'boss-defeated' && ev.actId === 'act10',
  },
  {
    id: 'streak-3', icon: '🌒', xp: 30,
    title: 'The Watch Unbroken',
    desc: 'Study three days in a row.',
    check: (st) => st.streak.count >= 3,
  },
  {
    id: 'streak-7', icon: '🌑', xp: 75,
    title: 'The Long Watch',
    desc: 'Study seven days in a row. The Eye never sleeps; neither do you.',
    check: (st) => st.streak.count >= 7,
  },
  {
    id: 'perfect-5', icon: '🧠', xp: 50,
    title: 'Legilimens',
    desc: 'Answer five quizzes flawlessly on the first attempt.',
    check: (st) => st.stats.quizzesPerfect >= 5,
  },
  {
    id: 'witching-hour', icon: '🦇', xp: 25,
    title: 'The Witching Hour',
    desc: 'Complete a challenge between midnight and 4 a.m.',
    check: (st, ev) => ev.type === 'challenge-solved'
      && new Date().getHours() < 4,
  },
  {
    id: 'ten-trials', icon: '⚔️', xp: 60,
    title: 'Trial-Hardened',
    desc: 'Solve ten coding trials.',
    check: (st) => st.stats.challengesSolved >= 10,
  },
  {
    id: 'twenty-trials', icon: '🏰', xp: 90,
    title: 'Siege-Breaker',
    desc: 'Solve twenty coding trials.',
    check: (st) => st.stats.challengesSolved >= 20,
  },
  {
    id: 'all-trials', icon: '🌋', xp: 150,
    title: 'No Trial Left Standing',
    desc: 'Solve every coding trial in the Codex.',
    check: (st) => st.stats.challengesSolved >= 70,
  },
  {
    id: 'unaided', icon: '🐍', xp: 80,
    title: 'Parselmouth',
    desc: 'Solve fifteen trials in an unbroken run without opening the notes.',
    // A consecutive-run threshold, not a lifetime scar: one early peek
    // no longer voids the incentive forever.
    check: (st) => (st.stats.unaidedStreak || 0) >= 15,
  },
  {
    id: 'working-ledger', icon: '⚖️', xp: 100,
    title: 'Keeper of the Drowned Ledger',
    desc: 'Carry Act III’s Great Working through every stage — the lake gives up its dead in order, and you wrote each name down.',
    check: (st, ev) => ev.type === 'working-complete' && ev.workingId === 'gwledger',
  },
  {
    id: 'working-inquest', icon: '🕯️', xp: 100,
    title: 'Arbiter of the Inquest',
    desc: 'Close Act VII’s Great Working — baseline before belief, holdout kept sacred, findings signed in your own hand.',
    check: (st, ev) => ev.type === 'working-complete' && ev.workingId === 'gwinquest',
  },
];

// ---------------- event bus ----------------

let headerRefresh = () => {};
export function onHeaderRefresh(fn) { headerRefresh = fn; }

export function emit(event) {
  // Any recorded deed counts as study for the day's streak. The 'streak'
  // event itself is skipped: dailyTouch emits it, and same-day re-touches
  // are no-ops, so this cannot loop.
  if (event.type !== 'streak') dailyTouch();
  const st = S.getState();
  for (const ach of ACHIEVEMENTS) {
    if (S.hasAchievement(ach.id)) continue;
    let hit = false;
    try { hit = Boolean(ach.check(st, event)); } catch { hit = false; }
    if (hit && S.unlockAchievement(ach.id)) {
      const before = rankFor(S.getState().xp);
      S.addXp(ach.xp);
      const after = rankFor(S.getState().xp);
      toast({
        icon: ach.icon,
        title: `Achievement — ${ach.title}`,
        sub: `${ach.desc} (+${ach.xp} XP)`,
        kind: 'toast-ach',
      });
      if (after.index > before.index) {
        toast({
          icon: '🜏',
          title: 'You have ascended',
          sub: `New rank: ${after.title}`,
          kind: 'toast-level',
        });
        rankUpMoment(after.title);
      }
    }
  }
  headerRefresh();
}

// Award XP with a toast and level-up detection. Returns new total.
export function grantXp(amount, reason) {
  const before = rankFor(S.getState().xp);
  S.addXp(amount);
  const after = rankFor(S.getState().xp);
  toast({ icon: '✦', title: `+${amount} XP`, sub: reason });
  if (after.index > before.index) {
    toast({
      icon: '🜏',
      title: 'You have ascended',
      sub: `New rank: ${after.title}`,
      kind: 'toast-level',
    });
    rankUpMoment(after.title);
  }
  headerRefresh();
}

export function dailyTouch() {
  const r = S.touchStreak();
  if (!r) return;
  const st = S.getState();
  if (st.streak.count > 1) {
    toast({
      icon: '🔥',
      title: `${st.streak.count}-day streak`,
      sub: 'The fire in the deep is kept burning.',
    });
    play('crackle');
  }
  // Mercy is revealed after the fact, never dangled before.
  if (r === 2) {
    toast({
      icon: '🜂',
      title: 'An ember burned in your place',
      sub: `The watch was missed. The count holds at ${st.streak.count}.`,
    });
  }
  if (st.streak.count % 7 === 0 && S.grantEmber('milestone')) {
    toast({
      icon: '🜂',
      title: 'An ember is banked against the dark',
      sub: 'Seven nights unbroken buy one night of grace.',
    });
  }
  emit({ type: 'streak' });
}
