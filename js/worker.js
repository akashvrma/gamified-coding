// ============================================================
// worker.js — the bound spirit. A classic Web Worker that hosts
// a full Python interpreter (Pyodide) off the main thread, so a
// runaway `while True:` can be killed without freezing the page.
// ============================================================

/* global loadPyodide, importScripts */

const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';

// The grading harness. User code runs first in a fresh namespace with
// stdout captured; on success the challenge's validation code runs in
// the SAME namespace with `_stdout` bound to everything printed.
// Validation failures surface as AssertionError messages.
const HARNESS = `
import sys, io, json, os, traceback

def __sweep_files():
    # Each casting begins with the basin swept clean: remove files the
    # previous run left in the working directory so runs stay isolated
    # (the Pensieve lessons rely on this).
    try:
        for f in os.listdir("."):
            if os.path.isfile(f):
                try:
                    os.remove(f)
                except OSError:
                    pass
    except OSError:
        pass

def __dark_run():
    user_code = globals().get("USER_CODE", "")
    validation_code = globals().get("VALIDATION_CODE", "")
    __sweep_files()
    ns = {"__name__": "__main__"}
    buf = io.StringIO()
    real_stdout, real_stderr = sys.stdout, sys.stderr
    sys.stdout = buf
    sys.stderr = buf
    try:
        exec(compile(user_code, "<your-spell>", "exec"), ns)
    except BaseException:
        sys.stdout, sys.stderr = real_stdout, real_stderr
        tb = traceback.format_exc()
        # Hide harness frames; the learner's code is the whole story.
        lines = [l for l in tb.splitlines() if "worker.js" not in l]
        cleaned = []
        skip = True
        for l in lines:
            if "<your-spell>" in l:
                skip = False
            if not skip or not l.startswith("  File"):
                cleaned.append(l)
        return json.dumps({
            "ok": False, "stage": "run",
            "output": buf.getvalue(),
            "error": "\\n".join(cleaned) if cleaned else tb,
        })
    sys.stdout, sys.stderr = real_stdout, real_stderr
    out = buf.getvalue()
    if validation_code:
        ns["_stdout"] = out
        vbuf = io.StringIO()
        sys.stdout = vbuf
        sys.stderr = vbuf
        try:
            exec(compile(validation_code, "<the-ward>", "exec"), ns)
        except AssertionError as e:
            sys.stdout, sys.stderr = real_stdout, real_stderr
            return json.dumps({
                "ok": False, "stage": "validate",
                "output": out,
                "error": str(e) or "The ward rejected your spell, but left no message.",
            })
        except BaseException as e:
            sys.stdout, sys.stderr = real_stdout, real_stderr
            return json.dumps({
                "ok": False, "stage": "validate",
                "output": out,
                "error": type(e).__name__ + ": " + str(e),
            })
        sys.stdout, sys.stderr = real_stdout, real_stderr
    return json.dumps({"ok": True, "stage": "done", "output": out, "error": None})
`;

let pyodidePromise = null;

function boot() {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = (async () => {
    importScripts(`${PYODIDE_URL}pyodide.js`);
    const py = await loadPyodide({ indexURL: PYODIDE_URL });
    py.runPython(HARNESS);
    return py;
  })();
  return pyodidePromise;
}

boot()
  .then(() => postMessage({ type: 'ready' }))
  .catch((err) => postMessage({ type: 'fatal', error: String(err) }));

onmessage = async (e) => {
  const { id, code, validation } = e.data || {};
  try {
    const py = await boot();
    py.globals.set('USER_CODE', String(code || ''));
    py.globals.set('VALIDATION_CODE', String(validation || ''));
    const resultJson = py.runPython('__dark_run()');
    postMessage({ type: 'result', id, result: JSON.parse(resultJson) });
  } catch (err) {
    postMessage({
      type: 'result',
      id,
      result: {
        ok: false,
        stage: 'engine',
        output: '',
        error: `The interpreter itself faltered: ${String(err)}`,
      },
    });
  }
};
