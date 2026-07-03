// ============================================================
// ui.js — rendering primitives: safe HTML, markdown-lite prose,
// Python syntax highlighting, and toast notifications.
// ============================================================

export function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// Inline markdown subset applied AFTER escaping: `code`, **bold**, *italic*.
function inline(escaped) {
  return escaped
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

// Markdown-lite block renderer for lesson body text.
// Supports paragraphs (blank-line separated) and "- " bullet lists.
export function prose(text) {
  if (!text) return '';
  const blocks = String(text).trim().split(/\n\s*\n/);
  return blocks.map((block) => {
    const lines = block.split('\n');
    if (lines.every((l) => l.trim().startsWith('- '))) {
      const items = lines
        .map((l) => `<li>${inline(escapeHtml(l.trim().slice(2)))}</li>`)
        .join('');
      return `<ul>${items}</ul>`;
    }
    return `<p>${inline(escapeHtml(block))}</p>`;
  }).join('');
}

// ---------------- Python syntax highlighting ----------------

const PY_KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
  'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally',
  'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal',
  'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield',
  'match', 'case',
]);

const PY_BUILTINS = new Set([
  'print', 'len', 'range', 'input', 'int', 'float', 'str', 'bool', 'list',
  'dict', 'set', 'tuple', 'type', 'isinstance', 'issubclass', 'super',
  'enumerate', 'zip', 'map', 'filter', 'sorted', 'reversed', 'sum', 'min',
  'max', 'abs', 'round', 'open', 'repr', 'hasattr', 'getattr', 'setattr',
  'iter', 'next', 'vars', 'dir', 'id', 'hash', 'callable', 'property',
  'staticmethod', 'classmethod', 'object', 'Exception', 'ValueError',
  'TypeError', 'KeyError', 'IndexError', 'ZeroDivisionError', 'StopIteration',
  'AttributeError', 'NotImplementedError', 'RuntimeError', 'FileNotFoundError',
]);

const PY_TOKEN = new RegExp(
  [
    '("""[\\s\\S]*?"""|\'\'\'[\\s\\S]*?\'\'\')', // 1 triple string
    '(#[^\\n]*)',                                 // 2 comment
    '([rbfu]{0,2}"(?:\\\\.|[^"\\\\\\n])*"|[rbfu]{0,2}\'(?:\\\\.|[^\'\\\\\\n])*\')', // 3 string
    '(@[A-Za-z_][\\w.]*)',                        // 4 decorator
    '\\b(self|cls)\\b',                           // 5 self / cls
    '\\b(\\d+\\.?\\d*(?:[eE][+-]?\\d+)?|0[xX][0-9a-fA-F_]+)\\b', // 6 number
    '\\b([A-Za-z_]\\w*)\\b',                      // 7 identifier
  ].join('|'),
  'g'
);

export function highlightPython(code) {
  const src = String(code);
  let out = '';
  let last = 0;
  let match;
  let prevWord = '';
  PY_TOKEN.lastIndex = 0;
  while ((match = PY_TOKEN.exec(src)) !== null) {
    out += escapeHtml(src.slice(last, match.index));
    const [full, triple, comment, str, dec, selfCls, num, ident] = match;
    const esc = escapeHtml(full);
    if (triple) out += `<span class="tok-str">${esc}</span>`;
    else if (comment) out += `<span class="tok-com">${esc}</span>`;
    else if (str) out += `<span class="tok-str">${esc}</span>`;
    else if (dec) out += `<span class="tok-dec">${esc}</span>`;
    else if (selfCls) out += `<span class="tok-self">${esc}</span>`;
    else if (num) out += `<span class="tok-num">${esc}</span>`;
    else if (ident) {
      if (PY_KEYWORDS.has(ident)) out += `<span class="tok-kw">${esc}</span>`;
      else if (prevWord === 'def') out += `<span class="tok-fn">${esc}</span>`;
      else if (prevWord === 'class') out += `<span class="tok-cls">${esc}</span>`;
      else if (PY_BUILTINS.has(ident)) out += `<span class="tok-bi">${esc}</span>`;
      else if (/^[A-Z]/.test(ident)) out += `<span class="tok-cls">${esc}</span>`;
      else out += esc;
      prevWord = ident;
      last = match.index + full.length;
      continue;
    } else out += esc;
    if (!/^\s*$/.test(full)) prevWord = '';
    last = match.index + full.length;
  }
  out += escapeHtml(src.slice(last));
  return out;
}

export function codeBlock(code) {
  return `<pre class="codeblock"><code>${highlightPython(String(code).replace(/\n$/, ''))}</code></pre>`;
}

// ---------------- toasts ----------------

export function toast({ icon = '✦', title, sub = '', kind = '' }) {
  const host = document.getElementById('toasts');
  if (!host) return;
  const node = document.createElement('div');
  node.className = `toast ${kind}`;
  node.innerHTML = `
    <span class="t-icon">${escapeHtml(icon)}</span>
    <span><span class="t-title">${escapeHtml(title)}</span><br>
    <span class="t-sub">${escapeHtml(sub)}</span></span>`;
  host.appendChild(node);
  setTimeout(() => node.remove(), 5200);
}

// Small element factory for imperative view code.
export function el(tag, attrs = {}, html = '') {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else node.setAttribute(k, v);
  }
  if (html) node.innerHTML = html;
  return node;
}
