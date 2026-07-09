export const el = (id) => document.getElementById(id);

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const KEYWORDS = new Set([
  "public", "private", "protected", "class", "static", "void", "int", "boolean",
  "String", "double", "new", "if", "else", "for", "while", "return", "extends",
  "implements", "interface", "package", "import", "throws", "try", "catch",
  "finally", "switch", "case", "break", "default", "final", "abstract",
  "synchronized", "volatile", "enum", "this", "super", "instanceof", "char",
  "long", "float", "byte", "short", "null", "true", "false"
]);

const TYPES = new Set([
  "System", "out", "println", "print", "Thread", "Runnable", "List", "ArrayList",
  "Map", "HashMap", "Set", "HashSet", "WebDriver", "ChromeDriver", "WebElement",
  "By", "ExpectedConditions", "Duration", "Integer", "Double", "Object",
  "Exception", "RuntimeException", "StringBuilder", "StringBuffer", "Iterator",
  "Optional", "Callable", "ExecutorService"
]);

// Single-pass tokenizer: each source character is matched exactly once, then
// escaped, so spans can never nest into each other's markup.
const TOKEN_RE = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|\b(\d+(?:\.\d+)?[fLdD]?)\b|\b([A-Za-z_]\w*)\b/g;

export function highlight(code) {
  if (!code) return "";
  let out = "";
  let last = 0;
  for (const m of String(code).matchAll(TOKEN_RE)) {
    out += escapeHtml(code.slice(last, m.index));
    const [full, comment, str, num, word] = m;
    if (comment) out += `<span class="com">${escapeHtml(comment)}</span>`;
    else if (str) out += `<span class="str">${escapeHtml(str)}</span>`;
    else if (num) out += `<span class="num">${escapeHtml(num)}</span>`;
    else if (word) {
      const rest = code.slice(m.index + full.length);
      if (KEYWORDS.has(word)) out += `<span class="kw">${word}</span>`;
      else if (TYPES.has(word)) out += `<span class="type">${word}</span>`;
      else if (/^\s*\(/.test(rest)) out += `<span class="method">${word}</span>`;
      else out += escapeHtml(word);
    }
    last = m.index + full.length;
  }
  out += escapeHtml(code.slice(last));
  return out;
}

export function switchTab(tabId, stateObj) {
  stateObj.tab = tabId;
  document.querySelectorAll('.module-tab').forEach(t => t.style.display = 'none');
  const target = el("tab-" + tabId);
  if (target) target.style.display = 'block';

  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabId);
  });
}
