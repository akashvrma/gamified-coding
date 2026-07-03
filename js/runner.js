// ============================================================
// runner.js — main-thread client for the Python worker.
// Handles lazy boot, run timeouts (infinite-loop kill + respawn),
// and graceful degradation when Pyodide cannot be fetched.
// ============================================================

const RUN_TIMEOUT_MS = 30000;
const BOOT_TIMEOUT_MS = 90000;

let worker = null;
let bootPromise = null;
let seq = 0;
const pending = new Map(); // id -> { resolve, timer }

// 'cold' | 'summoning' | 'ready' | 'dead'
let status = 'cold';
const statusListeners = new Set();

export function runnerStatus() { return status; }

export function onRunnerStatus(fn) {
  statusListeners.add(fn);
  return () => statusListeners.delete(fn);
}

function setStatus(s) {
  status = s;
  statusListeners.forEach((fn) => fn(s));
}

function spawn() {
  worker = new Worker('js/worker.js');
  worker.onmessage = (e) => {
    const msg = e.data || {};
    if (msg.type === 'ready') {
      // A summoning we already declared dead must not speak: a late
      // 'ready' after the boot timeout would flip status while
      // bootPromise stays resolved-false, wedging runPython.
      if (status === 'dead') return;
      setStatus('ready');
    } else if (msg.type === 'fatal') {
      setStatus('dead');
      failAll(`The interpreter could not be summoned: ${msg.error}`);
    } else if (msg.type === 'result') {
      const entry = pending.get(msg.id);
      if (entry) {
        clearTimeout(entry.timer);
        pending.delete(msg.id);
        entry.resolve(msg.result);
      }
    }
  };
  worker.onerror = () => {
    setStatus('dead');
    failAll('The interpreter was lost to the void (worker error).');
  };
}

function failAll(message) {
  for (const [, entry] of pending) {
    clearTimeout(entry.timer);
    entry.resolve({ ok: false, stage: 'engine', output: '', error: message });
  }
  pending.clear();
}

// Begin loading Pyodide in the background (call when a lesson opens,
// so the ~10s cold start is hidden behind reading time).
export function preboot() {
  if (bootPromise) return bootPromise;
  setStatus('summoning');
  bootPromise = new Promise((resolve) => {
    try {
      spawn();
    } catch (err) {
      setStatus('dead');
      resolve(false);
      return;
    }
    const bootTimer = setTimeout(() => {
      if (status !== 'ready') {
        setStatus('dead');
        try { worker.terminate(); } catch { /* already gone */ }
        failAll('The summoning took too long — check your connection to the outer world.');
        resolve(false);
      }
    }, BOOT_TIMEOUT_MS);
    const off = onRunnerStatus((s) => {
      if (s === 'ready') { clearTimeout(bootTimer); off(); resolve(true); }
      if (s === 'dead') { clearTimeout(bootTimer); off(); resolve(false); }
    });
  });
  return bootPromise;
}

const UNREACHABLE = {
  ok: false,
  stage: 'engine',
  output: '',
  error: 'The interpreter is unreachable. Reload the page, or study on — '
    + 'you can still read the scrolls and face the quizzes.',
};

// Run user code (+ optional validation). Resolves to
// { ok, stage, output, error } — never rejects.
export async function runPython(code, validation = '') {
  if (status === 'dead') return { ...UNREACHABLE };
  const booted = await preboot();
  if (!booted) return { ...UNREACHABLE };
  seq += 1;
  const id = seq;
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      // The spell is out of control: kill the interpreter and raise a new one.
      try { worker.terminate(); } catch { /* already gone */ }
      bootPromise = null;
      setStatus('cold');
      failAll('The interpreter was slain mid-spell.');
      preboot();
      resolve({
        ok: false,
        stage: 'run',
        output: '',
        error: 'Your spell ran for 30 seconds and had to be destroyed. '
          + 'An endless loop, perhaps? Check the conditions on your while loops.',
      });
    }, RUN_TIMEOUT_MS);
    pending.set(id, { resolve, timer });
    worker.postMessage({ id, code, validation });
  });
}
