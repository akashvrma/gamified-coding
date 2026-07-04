#!/usr/bin/env python3
"""Grade every challenge exactly the way the in-browser worker does.

Reads a JSON manifest of {id, title, starter, solution, validation} records,
runs each solution followed by its validation in a fresh namespace with
stdout captured as `_stdout`, and reports failures. Also warns when a
starter passes validation unchanged (an auto-passable challenge is broken).
"""
import io
import json
import os
import sys
import tempfile
import traceback
from contextlib import redirect_stdout

os.environ.setdefault("MPLBACKEND", "Agg")  # mirror of the worker harness


def sweep_files():
    """Mirror of the worker's per-run file sweep — keep in sync."""
    for f in os.listdir("."):
        if os.path.isfile(f):
            try:
                os.remove(f)
            except OSError:
                pass
    # Close any figures a previous challenge left open.
    if "matplotlib" in sys.modules:
        try:
            import matplotlib.pyplot as plt
            plt.close("all")
        except Exception:
            pass


def run_pair(user_code: str, validation_code: str):
    """Mirror of the worker harness in js/worker.js — keep in sync."""
    sweep_files()
    ns = {"__name__": "__main__"}
    buf = io.StringIO()
    try:
        with redirect_stdout(buf):
            exec(compile(user_code, "<user>", "exec"), ns)
    except BaseException:
        return False, "run", buf.getvalue(), traceback.format_exc(limit=3)
    out = buf.getvalue()
    if validation_code:
        ns["_stdout"] = out
        vbuf = io.StringIO()
        try:
            with redirect_stdout(vbuf):
                exec(compile(validation_code, "<validation>", "exec"), ns)
        except AssertionError as e:
            return False, "validate", out, str(e)
        except BaseException:
            return False, "validate", out, traceback.format_exc(limit=3)
    return True, "done", out, None


def main():
    manifest_path = os.path.abspath(sys.argv[1])
    with open(manifest_path, encoding="utf-8") as f:
        challenges = json.load(f)

    # Challenges may legitimately write files (the Pensieve lessons); grade
    # inside a throwaway directory so artifacts never litter the repo.
    workdir = tempfile.mkdtemp(prefix="codex-grade-")
    os.chdir(workdir)

    failures = []
    warnings = []
    for ch in challenges:
        ok, stage, _out, err = run_pair(ch["solution"], ch["validation"])
        if not ok:
            failures.append((ch["id"], stage, err))

        # The unmodified starter must NOT pass — otherwise the challenge
        # rewards doing nothing.
        s_ok, _, _, _ = run_pair(ch["starter"], ch["validation"])
        if s_ok:
            warnings.append((ch["id"], "starter passes validation unchanged"))

    for cid, stage, err in failures:
        print(f"FAIL [{cid}] during {stage}:\n{err}\n", file=sys.stderr)
    for cid, msg in warnings:
        print(f"WARN [{cid}]: {msg}", file=sys.stderr)

    print(f"{len(challenges)} challenges graded — "
          f"{len(challenges) - len(failures)} passed, {len(failures)} failed, "
          f"{len(warnings)} warnings")
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
