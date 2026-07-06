// ============================================================
// act3rite.js — The Rite: "Leaving the Codex".
// The bridge from the sanctum to a real machine: installing
// Python, the terminal, running files, the REPL, venv, pip,
// one honest page on git, and the doctrine of the Familiar.
// Imported by act3.js; rendered after the Great Working.
// Written to docs/CONTENT_SPEC.md (v1) §10.
// ============================================================

const py = String.raw;

export default {
  id: 'rite-leaving',
  title: 'Leaving the Codex',

  sections: [
    {
      heading: 'The sanctum was never the world',
      body: 'Every working you have cast in this place ran inside a sealed room. The files '
        + 'you wrote in the Pensieve lived in a vault of air that empties between runs — '
        + 'nothing you save here outlasts the moment. The only libraries you could summon '
        + 'were the ones the room already held: no `pip`, no outer universe of packages. '
        + 'And nothing here endures — close the tab and every daemon dies mid-breath. The '
        + 'walls were a mercy. They kept the world from marking you while your hands learned.\n\n'
        + 'But the sanctum was never the world. The craft is not real until it runs on a '
        + 'machine you own, against files that persist, among consequences that do. This '
        + 'rite walks you through the wall: open the first door on your own machine, learn '
        + 'the terminal’s few words, run a file, keep a sealed circle for each project, and '
        + 'take a familiar into service without letting it take you.\n\n'
        + 'Nothing beyond this page is watched or graded. That is the point of it.',
    },
    {
      heading: 'The first door — macOS',
      body: 'Depending on the age of your machine, macOS carries either a ghost of Python '
        + 'or none at all — rely on neither. Go to **python.org**, follow **Downloads**, and '
        + 'take the macOS installer: a `.pkg` file. Run it and accept what it offers.\n\n'
        + 'Then open **Terminal**: press *Cmd+Space*, type `Terminal`, press return. A dark '
        + 'window opens with a waiting cursor — the oldest interface in computing, and the '
        + 'most honest. Ask it what you just installed:',
      code: py`python3 --version
# Python 3.12.4  (any Python 3 of recent years will serve)`,
      note: 'If a version number answers, the door is open. If the machine claims not to '
        + 'know `python3`, close Terminal and open it fresh — a shell reads its map of '
        + 'commands once, at birth, and a door installed after that birth needs a new shell '
        + 'to be seen.',
    },
    {
      heading: 'The first door — Windows',
      body: 'Go to **python.org**, follow **Downloads**, and take the Windows installer. '
        + 'Before you let it run, one act of vigilance: **mark the checkbox that adds '
        + 'Python to PATH**. That small unmarked box has cost more beginners more nights '
        + 'than any error message ever written.\n\n'
        + 'Then open **PowerShell** — search for it from the Start menu, or open Windows '
        + 'Terminal. The installer also grants the `py` launcher, which answers even when '
        + 'PATH was neglected:',
      code: py`py --version
# or, if you marked the PATH box:
python --version`,
      note: 'If typing `python` opens the Microsoft Store instead of answering, Windows is '
        + 'offering you its own copy — the python.org installer with the PATH box marked '
        + 'ends that behavior. Or simply speak to `py`, which always answers.',
    },
    {
      heading: 'The first door — Linux',
      body: 'If you live on Linux you likely walked through this door long ago: most '
        + 'distributions ship Python 3. Open your terminal and ask. If a version number '
        + 'answers, move on; if not — or if pieces are missing — your package manager '
        + 'carries them:',
      code: py`python3 --version

# Debian / Ubuntu — interpreter, venv, and pip:
sudo apt install python3 python3-venv python3-pip

# Fedora:
sudo dnf install python3 python3-pip`,
      note: 'One law before you go on: the system’s Python belongs to the *system* — parts '
        + 'of the operating system itself lean on it. You will not install packages into it '
        + 'directly. The sealed circle a few doors below exists for exactly this.',
    },
    {
      heading: 'The terminal in ten lines',
      body: 'The terminal is a conversation. You speak a command; the machine answers, or '
        + 'obeys in silence. A handful of words is enough to live on:\n\n'
        + '- `pwd` — *print working directory*: where am I standing?\n'
        + '- `ls` — list what is here (in the old Windows `cmd.exe`, the word is `dir`)\n'
        + '- `cd spells` — step into the folder named spells; `cd ..` steps back out\n'
        + '- `mkdir spells` — raise a new folder\n'
        + '- `python3 spell.py` — run a working (Windows: `py spell.py`)\n\n'
        + 'On Windows, PowerShell answers to `pwd`, `ls`, `cd`, and `mkdir` just as the '
        + 'Unix shells do — the divergence bites only in the older `cmd.exe`, where listing '
        + 'is `dir`. When a guide’s commands fail on Windows, that seam is usually why.',
      code: py`pwd                 # where am I?
ls                  # what is here?   (cmd.exe: dir)
mkdir spells        # raise a folder
cd spells           # step inside
pwd                 # confirm the ground moved
cd ..               # step back out`,
      note: 'Two mercies the terminal never advertises: the *Tab* key completes half-typed '
        + 'names, and the up-arrow recalls what you last spoke. It rewards laziness of '
        + 'exactly the right kind.',
    },
    {
      heading: 'Casting from a file',
      body: 'Inside these walls, the Forge ran your code for you. Outside, a working is a '
        + 'plain text file whose name ends in `.py`, and *you* invoke it. Open any '
        + 'plain-text editor — the humblest will serve — write two lines, and save them as '
        + '`spell.py` inside your spells folder:',
      code: py`# spell.py — saved in the spells folder:
greeting = "The Codex travels with me."
print(greeting)

# then, from a terminal standing in that folder:
#   macOS / Linux:   python3 spell.py
#   Windows:         py spell.py`,
      note: 'The terminal must be *standing in the folder that holds the file* — `cd` there '
        + 'first, or the interpreter will answer that no such file exists. Half of all '
        + 'first-night despair is exactly this: the code was sound; you were standing in '
        + 'the wrong room. On macOS and Linux you may also see files begin with '
        + '`#!/usr/bin/env python3` — a **shebang**, naming the interpreter so the file can '
        + 'run by itself. It is optional; `python3 spell.py` never needs it.',
    },
    {
      heading: 'The serpent’s mouth — the REPL',
      body: 'Invoke the interpreter with no file at all, and it turns to face you:',
      code: py`python3             # (Windows: py)
# Python 3.12.4 ...
# >>> 2 + 2
# 4
# >>> exit()          <- the way back out`,
      note: 'The three chevrons `>>>` are the **REPL** — read, evaluate, print, loop. Type '
        + 'an expression and it answers at once: the finest scratchpad ever made for one '
        + 'line of doubt. It is also the oldest snare beyond these walls. Sooner or later '
        + 'you will type `python3 spell.py` *at the chevrons* and be met with a '
        + '`SyntaxError` — because you were no longer speaking to the shell; you were '
        + 'asking Python to read those words *as Python*. Learn to read your prompt: '
        + 'chevrons mean you are inside the serpent. The way out is `exit()` — or *Ctrl-D* '
        + 'on macOS and Linux, *Ctrl-Z then Enter* on Windows.',
    },
    {
      heading: 'The sealed circle — venv',
      body: 'Two projects will one day demand two different versions of the same library, '
        + 'and a machine with a single shared Python becomes a war neither project can win. '
        + 'A **virtual environment** ends the war before it starts: a private package-space, '
        + 'one per project, sealed from every other and from the system itself. This is not '
        + 'ceremony — it is how working Python is done, everywhere, by everyone.\n\n'
        + 'Stand in your project folder. Draw the circle once; step into it every time you '
        + 'return to work:',
      code: py`python3 -m venv .venv          # draw the circle (once per project)

# step inside — macOS / Linux:
source .venv/bin/activate

# step inside — Windows PowerShell:
.venv\Scripts\Activate.ps1

# step inside — Windows cmd.exe:
.venv\Scripts\activate.bat

deactivate                     # step back out (any OS)`,
      note: 'While the circle holds, your prompt wears a `(.venv)` mark — glance for it '
        + 'before installing anything. If PowerShell refuses to run the activation script, '
        + 'permit signed scripts for your own user with '
        + '`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` — a real '
        + 'and common rite of first use.',
    },
    {
      heading: 'Provisions — pip and the requirements scroll',
      body: 'With the circle active, `pip` installs packages from **pypi.org** — the Python '
        + 'Package Index, a library of workings other sorcerers have sealed and shared. '
        + 'Install one. Then write down what your project depends on, so that any future '
        + 'machine can rebuild the circle from the scroll:',
      code: py`pip install requests             # one famous package, for the ritual of it

pip freeze > requirements.txt    # write the scroll of dependencies

pip install -r requirements.txt  # any later machine: rebuild from the scroll`,
      note: 'Now the warning, and take it as law: `pip install` runs code from the wider '
        + 'world on your machine, under your authority. Typosquatters seed the index with '
        + 'names one letter removed from famous packages, and forums brim with pasted '
        + 'install lines no one who posted them could explain. Before you install: read the '
        + 'name letter by letter, look the package up on pypi.org, and prefer the boring, '
        + 'famous, long-lived choice. Never run an install line from a stranger that you '
        + 'cannot account for word by word.',
    },
    {
      heading: 'One page on git',
      body: 'One more tool stands outside these walls, and this rite will be honest about '
        + 'it rather than pretend to teach it. **Git** is a version-control system: it '
        + 'keeps the full history of a project, lets you attempt changes on a branch '
        + 'without harming the main line, and — pushed to a remote — carries your work '
        + 'between machines and collaborators. The verbs you will meet are `git init`, '
        + '`git add`, `git commit`, and `git push`, and nearly every working programmer '
        + 'speaks them daily. It deserves a true apprenticeship, not a paragraph: when you '
        + 'are ready, give it a dedicated guide and a quiet evening — it even carries its '
        + 'own, at `git help tutorial`. All this page asks is that you know the tool '
        + 'exists, and that the history of your craft is worth keeping.',
    },
    {
      heading: 'The Familiar, I — it drafts, you verify',
      body: 'Beyond the walls you will not work alone. There are familiars now — bound '
        + 'intelligences that draft code at a whisper: assistants inside editors, spirits '
        + 'behind chat windows. Commanded well, one multiplies your hands. So hold to the '
        + 'first doctrine: **the familiar drafts; you verify.** Its confidence is not '
        + 'evidence. A draft that *looks* right has proven nothing — run it, feed it the '
        + 'edge cases you learned to fear in these halls (the empty list, the zero, the '
        + 'absent key), and read it line by line until you could defend every choice as '
        + 'your own. Nothing enters your project until it has passed through your hands. '
        + 'Trust is earned per working, and it resets to zero each time.',
    },
    {
      heading: 'The Familiar, II — its failures are seeded',
      body: 'The familiar does not fail the way a novice fails. Its errors are seeded into '
        + 'its nature — characteristic, repeatable, worth learning by silhouette:\n\n'
        + '- **The plausible wrong.** Code that runs clean, reads well, and computes the '
        + 'wrong thing — an off-by-one in the quiet middle of a loop, a condition '
        + 'reversed. Only your own tests catch it.\n'
        + '- **The silent mutation.** The old curse from these very halls: a mutable '
        + 'default argument, shared state altered where no caller can see. The familiar '
        + 'reaches for such patterns with unnerving ease.\n'
        + '- **The confident contradiction.** You state your spec; the draft quietly does '
        + 'otherwise — and its comments describe *your spec*, not the code beneath them. '
        + 'Read the code. Never trust the commentary over it.\n\n'
        + 'You have met each of these inside the Codex, planted by hand so you would know '
        + 'their faces. That was not decoration. It was inoculation.',
    },
    {
      heading: 'The Familiar, III — never feed it your secrets',
      body: 'Everything you place before a familiar leaves your hands. Treat every prompt '
        + 'as a transmission, because it is one:\n\n'
        + '- Never paste **API keys, tokens, or passwords** — not briefly, not '
        + '“redacted-later.” Keys ride inside code and config files; sweep before you paste.\n'
        + '- Never paste **private data** — other people’s records, messages, anything you '
        + 'would not commit to a letter.\n'
        + '- When you need help with secret-adjacent code, put a placeholder where the '
        + 'secret was and keep the true value in a file the familiar never sees.\n\n'
        + 'A secret spoken to anything is no longer a secret. It is a debt, with an unknown '
        + 'collection date.',
    },
    {
      heading: 'The Familiar, IV — the craft stays yours',
      body: 'The last doctrine is the reason this rite exists at all. A familiar amplifies '
        + 'a wizard; it does not replace one. The hand that cannot read the draft cannot '
        + 'judge it — and the one who cannot judge is not commanding the familiar but '
        + 'obeying it. Every hour you spent in these halls — every scroll you mended, every '
        + 'ward you wrote, every scrying you called before the run — was building the '
        + 'judgment that command requires.\n\n'
        + 'So keep the craft in your own hands. Write some workings unaided, still. Mend '
        + 'your own dead code before summoning help. When the familiar drafts, rewrite a '
        + 'piece in your own voice until you understand why the original held.\n\n'
        + 'The Codex releases you. It was never the world — it was the forge where you were '
        + 'made fit to enter one. Take the ledger below with you, and build something that '
        + 'outlasts the moment.',
    },
  ],

  quiz: [
    {
      q: 'Why raise a separate virtual environment for each project instead of installing every package into the one shared Python?',
      options: [
        'It makes Python programs run faster by caching packages locally',
        'Each project keeps its own isolated package versions, so two projects can depend on conflicting versions — and the system’s Python stays untouched',
        'pip refuses to work at all outside a virtual environment',
        'A venv encrypts your source code against tampering',
      ],
      answer: 1,
      explain: 'Isolation is the whole point: each circle holds its own package versions, so '
        + 'projects cannot poison one another and the system interpreter stays clean. pip '
        + 'works outside a venv — that is the danger, not a restriction — and a venv '
        + 'neither speeds up nor encrypts anything.',
    },
    {
      q: 'You saved `spell.py` inside a folder named `spells`. Which sequence runs it on macOS or Linux?',
      options: [
        '`cd spells`, then `python3 spell.py`',
        'Double-click the file — the terminal is only for installing things',
        'Type `python3` alone, then type `spell.py` at the `>>>` prompt',
        'Type `run spell.py` from any folder',
      ],
      answer: 0,
      explain: 'The interpreter takes the filename as an argument — `python3 spell.py` — '
        + 'spoken from the folder that holds the file, so `cd` there first. Typing the '
        + 'filename at the `>>>` chevrons hands it to Python as Python and earns a '
        + 'SyntaxError, and no `run` command exists in the shell.',
    },
    {
      q: 'Three chevrons — `>>>` — wait at the left of your terminal, and your shell commands keep dying of `SyntaxError`. What has happened, and what is the way out?',
      options: [
        'The Python installation is corrupted; reinstall it from python.org',
        'The terminal has crashed; close the window and start over',
        'You are inside the Python REPL, which reads everything as Python — leave with `exit()` (or Ctrl-D on macOS/Linux, Ctrl-Z then Enter on Windows) and the shell returns',
        'PowerShell requires administrator rights to run commands',
      ],
      answer: 2,
      explain: 'Chevrons mean you are inside the serpent: everything you type is read as '
        + 'Python, so shell commands die of SyntaxError. Nothing is broken. exit() — or the '
        + 'end-of-input keystroke for your OS — hands you back to the shell. Reading the '
        + 'prompt before typing is the discipline that avoids the snare entirely.',
    },
    {
      q: 'A forum answer tells you to fix your problem with `pip install reqeusts`. What is the disciplined move?',
      options: [
        'Run it at once — pip only downloads code, it never executes any',
        'Notice the misspelling, confirm the true name on pypi.org, and install only what you can account for — installing executes other people’s code under your authority',
        'Run it with sudo so it works for every project at once',
        'Run it outside your venv first, where mistakes are safer',
      ],
      answer: 1,
      explain: '“reqeusts” is one transposition from requests — exactly the seam '
        + 'typosquatters farm. Installation can execute arbitrary code, sudo widens the '
        + 'blast radius to the whole system, and outside the venv is less contained, not '
        + 'more. Read the name letter by letter, then decide.',
    },
    {
      q: 'Your familiar produces a function that runs without error, reads cleanly, and carries a comment swearing it does exactly what you asked. When has it earned a place in your project?',
      options: [
        'Now — code that runs without error has proven itself',
        'Once the comments match your specification',
        'After you have run it against your own tests — edge cases included — and read it closely enough to defend every line as your own',
        'Never — a familiar’s code can never be used',
      ],
      answer: 2,
      explain: 'Running clean proves only the absence of crashes, and comments describe '
        + 'intent, not behavior — they are the least trustworthy lines in any draft. '
        + 'Verification is yours: your tests, your reading. Blanket refusal is not doctrine '
        + 'either; a verified draft is honest material.',
    },
  ],

  checklist: [
    { id: 'installed-python', text: 'I installed Python on a machine of my own, and a version number answered me.' },
    { id: 'walked-the-terminal', text: 'I walked the terminal — pwd, ls, cd — and raised a directory with my own hands.' },
    { id: 'ran-a-file', text: 'I wrote a .py file outside the Codex and ran it from the terminal.' },
    { id: 'left-the-repl', text: 'I entered the REPL, cast a line at the chevrons, and found my way back out.' },
    { id: 'raised-a-venv', text: 'I raised a virtual environment and activated it — the (.venv) mark stood in my prompt.' },
    { id: 'sealed-one-package', text: 'I pip-installed one package inside that circle, and only inside it.' },
    { id: 'carried-the-ledger', text: 'I carried the Drowned Ledger — or another working — out of the Codex and ran it on my own machine.' },
  ],

  xp: 100,

  download: {
    filename: 'drowned_ledger.py',
    fromWorking: 'gwledger',
    fallbackCanon: true,
  },
};
