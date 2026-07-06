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


def run_pair(user_code: str, validation_code: str, setup_code=None):
    """Mirror of the worker harness in js/worker.js — keep in sync.

    `setup_code` (Great Workings fixture) runs in the same fresh namespace
    AFTER the file sweep and BEFORE the user's code. Its stdout is
    discarded — `_stdout` carries only what the user's code printed — and
    its failure is a harness fault ("fixture" stage), never the learner's.
    """
    sweep_files()
    ns = {"__name__": "__main__"}
    if setup_code:
        try:
            with redirect_stdout(io.StringIO()):
                exec(compile(setup_code, "<the-fixture>", "exec"), ns)
        except BaseException:
            return False, "fixture", "", (
                "The Codex's own fixture failed — the fault is the "
                "harness's, not the spell's.\n" + traceback.format_exc(limit=3))
    buf = io.StringIO()
    try:
        with redirect_stdout(buf):
            exec(compile(user_code, "<user>", "exec"), ns)
    except BaseException:
        return False, "run", buf.getvalue(), traceback.format_exc(limit=3)
    out = buf.getvalue()
    if validation_code:
        ns["_stdout"] = out
        ns["_source"] = user_code  # mirror of worker.js HARNESS — keep in sync
        vbuf = io.StringIO()
        try:
            with redirect_stdout(vbuf):
                exec(compile(validation_code, "<validation>", "exec"), ns)
        except AssertionError as e:
            return False, "validate", out, str(e)
        except BaseException:
            return False, "validate", out, traceback.format_exc(limit=3)
    return True, "done", out, None


def run_trace(code: str, expect: str, raises=None):
    """Execute a trace (scrying) snippet and prove its answer key honest.

    Mirror of run_pair's harness discipline — keep in sync. The authoring
    law this enforces: the CORRECT option must be the program's exact
    stripped stdout (repr quoting and all; multi-line outputs joined with
    real newlines in the option string) — or, for raises-style items, the
    named exception type must be what the code dies of. A mis-keyed
    `answer` index fails the build.
    """
    sweep_files()
    ns = {"__name__": "__main__"}
    buf = io.StringIO()
    try:
        with redirect_stdout(buf):
            exec(compile(code, "<trace>", "exec"), ns)
    except BaseException as e:  # noqa: BLE001 — any death is the verdict
        if raises:
            if type(e).__name__ == raises:
                return True, None
            return False, (f"expected {raises} to be raised, "
                           f"got {type(e).__name__}: {e}")
        return False, f"trace raised unexpectedly: {type(e).__name__}: {e}"
    if raises:
        return False, f"expected {raises} to be raised, but the code completed"
    out = buf.getvalue().strip()
    if out != str(expect).strip():
        return False, (f"keyed answer does not match execution — "
                       f"stdout {out!r} != options[answer] {str(expect)!r}")
    return True, None


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
    n_traces = 0
    for ch in challenges:
        # Dispatch on record kind: 'trace' items are executed and their
        # answer key asserted; absent kind = challenge, as always.
        if ch.get("kind") == "trace":
            n_traces += 1
            ok, err = run_trace(ch["code"], ch.get("expect", ""), ch.get("raises"))
            if not ok:
                failures.append((ch["id"], "trace", err))
            continue

        # Great Working stage records carry an optional `setup` fixture,
        # executed before BOTH the solution and the starter run.
        setup = ch.get("setup") or None
        ok, stage, _out, err = run_pair(ch["solution"], ch["validation"], setup)
        if not ok:
            failures.append((ch["id"], stage, err))

        # The unmodified starter must NOT pass — otherwise the challenge
        # rewards doing nothing. Working stages beyond the first opt out
        # (starterMustFail: false): their starter is the carried prior
        # code, and only stage 1's starter is gated by the spec.
        s_ok, _, _, _ = run_pair(ch["starter"], ch["validation"], setup)
        if s_ok and ch.get("starterMustFail", True):
            warnings.append((ch["id"], "starter passes validation unchanged"))

    for cid, stage, err in failures:
        print(f"FAIL [{cid}] during {stage}:\n{err}\n", file=sys.stderr)
    for cid, msg in warnings:
        print(f"WARN [{cid}]: {msg}", file=sys.stderr)

    n_chal = len(challenges) - n_traces
    print(f"{n_chal} challenges graded, {n_traces} traces scried — "
          f"{len(challenges) - len(failures)} passed, {len(failures)} failed, "
          f"{len(warnings)} warnings")
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
