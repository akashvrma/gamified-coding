// ============================================================
// sound.js — the Tolling. A fully synthesized WebAudio palette:
// crypt foley, not casino. Minor and neutral intervals only,
// failure always quieter than success, nothing sustained above
// ~3 kHz, no major-key jingle anywhere. Zero assets, zero
// fetches. The AudioContext is created and resumed only after
// the first user gesture (pointerdown/keydown), so nothing can
// sound — or warn — before the learner acts.
// ============================================================

import * as S from './state.js';
import { toast } from './ui.js';

let ctx = null;
let master = null;
let noiseBuf = null;

// ~0.12 (≈ −18 dBFS) scaled by the persisted volume setting — low
// enough to sit under screen-reader speech.
const MASTER_LEVEL = 0.12;

function buildNoise(c) {
  const len = c.sampleRate; // one second of white noise, built once
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
  return buf;
}

function ensureContext() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try {
    ctx = new AC();
  } catch {
    return null;
  }
  const vol = Number(S.getState().settings.volume) || 0.5;
  master = ctx.createGain();
  master.gain.value = MASTER_LEVEL * vol;
  master.connect(ctx.destination);
  noiseBuf = buildNoise(ctx);
  return ctx;
}

// Register a one-shot unlock on the first gesture. Called once from main.js.
export function initSound() {
  const unlock = () => {
    window.removeEventListener('pointerdown', unlock, true);
    window.removeEventListener('keydown', unlock, true);
    const c = ensureContext();
    if (c && c.state === 'suspended') c.resume().catch(() => { /* stays quiet */ });
  };
  window.addEventListener('pointerdown', unlock, true);
  window.addEventListener('keydown', unlock, true);
}

// ---------------- the palette ----------------
// All voices are per-play, short-lived nodes hung off the shared master.

// Cast/Strike: band-passed noise, filter sweeping 400 → 2400 Hz.
function cast(t0) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.Q.value = 5;
  bp.frequency.setValueAtTime(400, t0);
  bp.frequency.exponentialRampToValueAtTime(2400, t0 + 0.25);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(0.45, t0 + 0.005);
  g.gain.setValueAtTime(0.45, t0 + 0.05);
  g.gain.linearRampToValueAtTime(0.0001, t0 + 0.25);
  src.connect(bp).connect(g).connect(master);
  src.start(t0, Math.random() * 0.4, 0.3);
}

// Working passes: two detuned triangles, a minor-third dyad rising a
// fourth — resolution, not fanfare.
function yieldTone(t0) {
  const voices = [[220, 293.66, 6], [261.63, 349.23, -6]]; // A3+C4 → D4+F4
  for (const [f0, f1, det] of voices) {
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.detune.value = det;
    o.frequency.setValueAtTime(f0, t0);
    o.frequency.setValueAtTime(f0, t0 + 0.12);
    o.frequency.exponentialRampToValueAtTime(f1, t0 + 0.2);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(0.34, t0 + 0.02);
    g.gain.setValueAtTime(0.34, t0 + 0.18);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.35);
    o.connect(g).connect(master);
    o.start(t0);
    o.stop(t0 + 0.4);
  }
}

// Failure: a low sine sagging 90 → 55 Hz plus a 60 ms thud. Soft —
// audibly quieter than yield.
function collapse(t0) {
  const o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(90, t0);
  o.frequency.exponentialRampToValueAtTime(55, t0 + 0.16);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(0.26, t0 + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
  o.connect(g).connect(master);
  o.start(t0);
  o.stop(t0 + 0.2);

  const thud = ctx.createBufferSource();
  thud.buffer = noiseBuf;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 220;
  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(0.2, t0);
  g2.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.06);
  thud.connect(lp).connect(g2).connect(master);
  thud.start(t0, 0, 0.08);
}

// Quiz option / nav: a 6 ms high-passed click at −24 dB.
function tick(t0) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 2200;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.063, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.006);
  src.connect(hp).connect(g).connect(master);
  src.start(t0, Math.random() * 0.5, 0.012);
}

// Trial begins / candle lost: an FM bell — carrier 110 Hz, mod ratio
// 2.4, index decaying over 1.2 s.
function bell(t0) {
  const carrier = ctx.createOscillator();
  carrier.type = 'sine';
  carrier.frequency.value = 110;
  const mod = ctx.createOscillator();
  mod.type = 'sine';
  mod.frequency.value = 110 * 2.4;
  const modGain = ctx.createGain();
  modGain.gain.setValueAtTime(110 * 2.4, t0);
  modGain.gain.exponentialRampToValueAtTime(1, t0 + 1.2);
  mod.connect(modGain);
  modGain.connect(carrier.frequency);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(0.45, t0 + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.2);
  carrier.connect(g).connect(master);
  carrier.start(t0);
  mod.start(t0);
  carrier.stop(t0 + 1.3);
  mod.stop(t0 + 1.3);
}

// Rank-up: a slow minor-triad arpeggio through a low-passed tail —
// the only long sound in the Codex.
function ascend(t0) {
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 1200;
  lp.connect(master);
  const notes = [110, 130.81, 164.81, 220]; // A minor, root doubled above
  notes.forEach((f, i) => {
    const start = t0 + i * 0.22;
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, start);
    g.gain.linearRampToValueAtTime(0.36, start + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 1.05);
    o.connect(g).connect(lp);
    o.start(start);
    o.stop(start + 1.15);
  });
}

// Streak / ember / vigil: sparse noise grains through a bandpass.
function crackle(t0) {
  for (let i = 0; i < 7; i += 1) {
    const at = t0 + Math.random() * 0.36;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1100 + Math.random() * 1300;
    bp.Q.value = 3;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(0.28, at + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.03);
    src.connect(bp).connect(g).connect(master);
    src.start(at, Math.random() * 0.5, 0.06);
  }
}

// The Guttering: the last candle's drone — two barely-detuned low sines
// swelling under a breath of low-passed noise, gone inside two seconds.
// Fired once per entry into the dread state; it never loops on its own.
function gutter(t0) {
  for (const det of [0, 7]) {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = 52;
    o.detune.value = det;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(0.2, t0 + 0.5);
    g.gain.setValueAtTime(0.2, t0 + 1.0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.9);
    o.connect(g).connect(master);
    o.start(t0);
    o.stop(t0 + 2.0);
  }
  const breath = ctx.createBufferSource();
  breath.buffer = noiseBuf;
  breath.loop = true; // the one-second buffer must outlast the swell; stop() below ends it
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 140;
  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(0.0001, t0);
  g2.gain.linearRampToValueAtTime(0.12, t0 + 0.6);
  g2.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.8);
  breath.connect(lp).connect(g2).connect(master);
  breath.start(t0);
  breath.stop(t0 + 1.9);
}

const PALETTE = {
  cast,
  yield: yieldTone,
  collapse,
  tick,
  bell,
  ascend,
  crackle,
  gutter,
};

export function play(name) {
  const st = S.getState();
  if (!st.settings || !st.settings.sfx) return;
  if (!ctx) return; // no gesture yet — the Codex stays silent
  if (ctx.state === 'suspended') ctx.resume().catch(() => { /* quiet */ });
  const voice = PALETTE[name];
  if (!voice) return;
  try {
    voice(ctx.currentTime);
  } catch {
    // A failed sound must never wound the app.
    return;
  }
  if (!st.settings.voiceNoticed) {
    S.markVoiceNoticed();
    toast({
      icon: '🔔',
      title: 'The Codex has found its voice',
      sub: 'Silence it with the rune above, if you prefer the dark quiet.',
    });
  }
}
