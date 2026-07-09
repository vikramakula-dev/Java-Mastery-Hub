import { state, saveState, modulesList } from './state.js';
import { el, switchTab, escapeHtml } from './ui.js';
import { renderModule, renderSidebar, renderStats } from './router.js';
import { renderNotes, renderFlashcard } from './components.js';

function normalizeAnswer(s) {
  return String(s || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function checkChallenge(card, challenge) {
  const resultEl = card.querySelector('[data-challenge-result]');
  if (!resultEl) return;
  const inputs = card.querySelectorAll('.challenge-blank-input');
  let allCorrect = true;
  const feedback = [];

  challenge.blanks.forEach((blank, i) => {
    const input = [...inputs].find(inp => Number(inp.dataset.blank) === i);
    const given = normalizeAnswer(input?.value);
    const accepted = (Array.isArray(blank.answer) ? blank.answer : [blank.answer]).map(normalizeAnswer);
    const ok = accepted.includes(given);
    if (input) input.classList.toggle('challenge-input-wrong', !ok && given.length > 0);
    if (!ok) allCorrect = false;
    const shownAnswer = Array.isArray(blank.answer) ? blank.answer[0] : blank.answer;
    feedback.push(`Blank ${i + 1}: ${ok ? 'correct' : `expected "${escapeHtml(shownAnswer)}"`}`);
  });

  resultEl.innerHTML = `
    <div class="challenge-result-box ${allCorrect ? 'correct' : 'incorrect'}">
      <p>${allCorrect ? '✓ All correct — nice work.' : '✗ Not quite — check the blanks below.'}</p>
      ${allCorrect ? '' : `<p>${feedback.map(escapeHtml).join(' · ')}</p>`}
    </div>
  `;
}

function revealChallenge(card, challenge) {
  const resultEl = card.querySelector('[data-challenge-result]');
  if (!resultEl) return;
  resultEl.innerHTML = `
    <div class="challenge-result-box reveal">
      <p><strong>Solution:</strong> ${challenge.blanks.map((b, i) => `Blank ${i + 1} = ${escapeHtml(Array.isArray(b.answer) ? b.answer[0] : b.answer)}`).join(' · ')}</p>
      ${challenge.explanation ? `<p>${escapeHtml(challenge.explanation)}</p>` : ''}
    </div>
  `;
}

function debounce(fn, delay = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

function setHeroCollapsed(collapsed) {
  const hero = el('heroCard');
  const btn = el('heroCollapseToggle');
  if (!hero || !btn) return;
  hero.classList.toggle('collapsed', collapsed);
  btn.setAttribute('aria-expanded', String(!collapsed));
  btn.title = collapsed ? 'Show intro text' : 'Hide intro text';
  btn.querySelector('span').textContent = collapsed ? '+' : '✕';
  try { localStorage.setItem('jm2_heroCollapsed', JSON.stringify(collapsed)); } catch (e) {}
}

async function selectModule(mod) {
  if (!modulesList.includes(mod)) return;
  state.module = mod;
  state.tab = 'overview';
  saveState();
  renderSidebar();
  await renderModule();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function isTypingTarget(target) {
  return target instanceof HTMLElement &&
    (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
}

// Startup
async function init() {
  renderSidebar();
  renderStats();

  await renderModule();

  // Collapse the marketing intro text once the user has a module open — it only
  // needs to be seen once, and repeating it above every module wastes a full
  // screen of scroll on mobile. A manual toggle lets it be brought back.
  let heroCollapsed = false;
  try { heroCollapsed = JSON.parse(localStorage.getItem('jm2_heroCollapsed') || 'false'); } catch (e) {}
  setHeroCollapsed(heroCollapsed || state.module !== 'Introduction');

  // Event Delegation for module selection and tab switching
  document.addEventListener("click", async (e) => {
    if (e.target.closest('#sidebarToggle')) {
      const collapsed = document.body.classList.toggle('sidebar-collapsed');
      el('sidebarToggle')?.setAttribute('aria-expanded', String(!collapsed));
      return;
    }

    if (e.target.closest('#heroCollapseToggle')) {
      const isCollapsed = el('heroCard')?.classList.contains('collapsed');
      setHeroCollapsed(!isCollapsed);
      return;
    }

    const modBtn = e.target.closest("[data-module]");
    if (modBtn) {
      e.preventDefault();
      setHeroCollapsed(true);
      await selectModule(modBtn.dataset.module);
      return;
    }

    const tabBtn = e.target.closest(".tab-btn[data-tab]");
    if (tabBtn) {
      switchTab(tabBtn.dataset.tab, state);
      saveState();
      return;
    }

    if (e.target.closest('#markCompleteBtn')) {
      if (state.completed.has(state.module)) {
        state.completed.delete(state.module);
      } else {
        state.completed.add(state.module);
      }
      saveState();
      renderStats();
      renderSidebar();
      await renderModule();
      return;
    }
  });

  // Global Keybindings
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !isTypingTarget(e.target)) {
      e.preventDefault();
      el("globalSearch")?.focus();
    }
  });

  // Global search filters the module list in the sidebar
  const searchInput = el("globalSearch");
  if (searchInput) {
    searchInput.addEventListener("input", debounce(() => {
      state.search = searchInput.value;
      renderSidebar();
    }, 150));
    searchInput.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        const first = document.querySelector('#moduleNav [data-module]');
        if (first) await selectModule(first.dataset.module);
      }
      if (e.key === "Escape") {
        searchInput.value = "";
        state.search = "";
        renderSidebar();
      }
    });
  }

  // Notes, Flashcards events
  document.addEventListener("click", (e) => {
    if (e.target.closest('#saveNoteBtn')) {
      const titleEl = el("noteTitle");
      const bodyEl = el("noteBody");
      if (!titleEl || !bodyEl) return;
      const title = titleEl.value.trim();
      const body = bodyEl.value.trim();
      if (!title || !body) return;
      state.notes.push({ title, body });
      saveState();
      renderNotes();
      renderStats();
      titleEl.value = "";
      bodyEl.value = "";
      return;
    }

    if (e.target.closest('#flipCardBtn') || e.target.closest('#flashcard')) {
      state.flipped = !state.flipped;
      renderFlashcard();
      return;
    }

    if (e.target.closest('#randomCardBtn')) {
      state.flipped = false;
      state.flashIndex += 1;
      renderFlashcard();
      return;
    }

    const noteBtn = e.target.closest('[data-note]');
    if (noteBtn) {
      const idx = Number(noteBtn.dataset.note);
      if (Number.isInteger(idx) && idx >= 0 && idx < state.notes.length) {
        state.notes.splice(idx, 1);
        saveState();
        renderNotes();
        renderStats();
      }
      return;
    }

    const checkBtn = e.target.closest('.challenge-check-btn');
    if (checkBtn) {
      const cIndex = Number(checkBtn.dataset.challenge);
      const challenge = state.currentData?.challenges?.[cIndex];
      const card = checkBtn.closest('.challenge-card');
      if (challenge && card) checkChallenge(card, challenge);
      return;
    }

    const revealBtn = e.target.closest('.challenge-reveal-btn');
    if (revealBtn) {
      const cIndex = Number(revealBtn.dataset.challenge);
      const challenge = state.currentData?.challenges?.[cIndex];
      const card = revealBtn.closest('.challenge-card');
      if (challenge && card) revealChallenge(card, challenge);
      return;
    }
  });

  // Capstone milestone checkboxes (persisted per-project in state.practice)
  document.addEventListener("change", (e) => {
    const cb = e.target.closest('input[type="checkbox"][data-capstone]');
    if (!cb) return;
    const pIndex = cb.dataset.capstone;
    const mIndex = Number(cb.dataset.milestone);
    const key = `capstone_${pIndex}`;
    const done = new Set(state.practice[key] || []);
    if (cb.checked) done.add(mIndex); else done.delete(mIndex);
    state.practice[key] = [...done];
    saveState();
    cb.closest('.milestone')?.classList.toggle('done', cb.checked);
  });

  // Keyboard support for the flashcard
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.id === "flashcard") {
      e.preventDefault();
      state.flipped = !state.flipped;
      renderFlashcard();
    }
  });
}

init().catch(err => console.error("App failed to initialize:", err));

// Offline support + desktop installability (PWA). Skipped in dev so the
// service worker cache never fights vite's hot module reloading.
if (import.meta.env.PROD && "serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(err =>
      console.warn("Service worker registration failed:", err)
    );
  });
}
