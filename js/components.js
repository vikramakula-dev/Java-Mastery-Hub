import { state, modulesList } from './state.js';
import { el, escapeHtml } from './ui.js';

export function renderRoadmap() {
  const grid = el("roadmapGrid");
  const summary = el("roadmapSummary");
  if (grid) {
    grid.innerHTML = modulesList.map(r => `<div class="roadmap-card"><h4>${r}</h4></div>`).join("");
  }
  if (summary) {
    summary.textContent = `Tracking ${modulesList.length} key milestones`;
  }
}

export function renderMindMap() {
  const container = el("mindMap");
  if (!container) return;
  container.innerHTML = `<div class="diagram"><ul>${modulesList.map(m => `<li>${m}</li>`).join("")}</ul></div>`;
}

export function renderJourney() {
  const container = el("learningJourney");
  if (!container) return;
  container.innerHTML = modulesList.map((m, i) => `<div class="journey-node"><span>${i+1}</span> ${m}</div>`).join("");
}

export function renderChapterMap() {
  const container = el("chapterMap");
  if (!container) return;
  container.innerHTML = `<div class="chapter-details"><h4>${state.module}</h4><p>Module active: ${state.module}</p></div>`;
}

export function renderVisualEngine() {
  const container = el("visualEngine");
  if (!container) return;
  container.innerHTML = `
    <div class="viz-node" style="transform:none; box-shadow:none;">
      <div class="viz-content" style="padding:0; background:transparent;">
        <h4 style="margin-top:0;">Memory Visualizer: ${state.module}</h4>
        <p style="color:var(--muted); font-size:0.9rem; margin-bottom:15px;">Visualize how objects and method calls behave in the JVM.</p>
        <div class="mem-viz">
          <div class="mem-stack">
            <h5 style="color:#f0b429; margin-top:0; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px;">Thread Stack</h5>
            <div class="mem-box">main()</div>
            ${state.module === "OOPS" ? '<div class="mem-box">drive()</div>' : ''}
            ${state.module === "Collections Framework" ? '<div class="mem-box">list.add("A")</div>' : ''}
            <div class="mem-box" style="opacity:0.5; border-left-color:gray;">(Empty frames)</div>
          </div>
          <div class="mem-heap">
            <h5 style="color:#a78bfa; margin-top:0; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px;">Heap Space</h5>
            ${state.module === "OOPS" ? '<div class="mem-box">Object: Car { color: "Red" }</div>' : '<div class="mem-box">String Pool / Objects</div>'}
            ${state.module === "Collections Framework" ? '<div class="mem-box">ArrayList [ "A", "B" ]</div>' : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderQuickPath() {
  const container = el("quickPath");
  if (!container) return;
  container.innerHTML = `<div class="quick-path-list">` + modulesList.slice(0, 5).map(m => `<div class="qp-item">${m}</div>`).join("") + `</div>`;
}

export async function renderQuiz() {
  const area = el("quizArea");
  const qSelect = el("quizModuleSelect");
  if (!area || !qSelect) return;

  try {
    const { mockInterviews } = await import('../selenium/mock_interviews.js');
    if (qSelect.children.length === 0) {
      qSelect.innerHTML = '<option value="">Select a Track...</option>' +
        mockInterviews.tracks.map(t => `<option value="${escapeHtml(t.id)}">${escapeHtml(t.title)}</option>`).join("");
    }

    const renderTrack = (track) => {
      if (!track) {
        area.innerHTML = "<p>Select a track to begin.</p>";
        return;
      }
      area.innerHTML = `
        <h4 style="color:var(--accent);">${escapeHtml(track.title)} Interview <span style="color:var(--muted); font-weight:400; font-size:0.85rem;">(${track.questions.length} questions — tap each to reveal the answer)</span></h4>
        <div class="accordion">
          ${track.questions.map(q => `
            <details class="accordion-item">
              <summary>${escapeHtml(q.q)}</summary>
              <div class="acc-content"><p style="margin-top:10px; color:var(--muted); line-height:1.6;">${escapeHtml(q.a)}</p></div>
            </details>
          `).join('')}
        </div>
      `;
    };

    qSelect.onchange = (e) => renderTrack(mockInterviews.tracks.find(t => t.id === e.target.value));

    // Auto-load the track most relevant to the CURRENT module, so the tab opens
    // with matching content immediately — users can still switch tracks any time.
    const TRACK_FOR_MODULE = {
      "Exception Handling": "exceptions",
      "OOPS": "frameworks",
      "Interfaces": "frameworks",
      "Multithreading": "frameworks",
      "Design Patterns": "frameworks",
      "Capstone Projects": "frameworks"
    };
    const preferredId = TRACK_FOR_MODULE[state.module] || "locators";
    const preferred = mockInterviews.tracks.find(t => t.id === preferredId) || mockInterviews.tracks[0];
    if (preferred) {
      qSelect.value = preferred.id;
      renderTrack(preferred);
    }
  } catch (e) {
    console.error("Failed to load mock interviews:", e);
    area.innerHTML = `<p style="color:var(--warn);">Could not load the Selenium interview data.</p>`;
  }
}

export function renderNotes() {
  const list = el("notesList");
  if (!list) return;
  if (state.notes.length === 0) {
    list.innerHTML = `<p style="color:var(--muted); font-size:0.9rem;">No notes yet. Add one above.</p>`;
    return;
  }
  list.innerHTML = state.notes.map((n, i) => {
    // Escape first, then decorate #tags — user input must never reach innerHTML raw
    const formattedBody = escapeHtml(n.body).replace(/(#[a-zA-Z0-9_]+)/g, '<span style="color:var(--accent); font-weight:600;">$1</span>');
    return `<div class="note-card" style="margin-bottom:15px; border-left:3px solid var(--accent); padding-left:15px;">
       <h4 style="margin:0 0 8px 0; color:var(--text);">${escapeHtml(n.title)}</h4>
       <p style="margin:0 0 10px 0; color:var(--muted); font-size:0.95rem; line-height:1.5; white-space:pre-wrap;">${formattedBody}</p>
       <button class="ghost-btn small" data-note="${i}" style="padding:4px 10px; font-size:0.8rem;" aria-label="Delete note: ${escapeHtml(n.title)}">Delete</button>
     </div>`;
  }).join("");
}

export function renderRoadmapSection() {
  const container = el("roadmapSection");
  if (!container) return;
  container.innerHTML = `<div class="module-block"><h4>Selenium Basics</h4><p>Introduction to WebDriver.</p></div>
  <div class="module-block"><h4>Locators</h4><p>XPath, CSS, ID, Name.</p></div>
  <div class="module-block"><h4>Waits</h4><p>Implicit vs Explicit Waits.</p></div>`;
}

export function renderPractice() {
  const container = el("practiceArea");
  if (!container) return;
  container.innerHTML = `
    <div class="section-head">
      <h3>Practice</h3>
      <span>Build muscle memory</span>
    </div>
    <div class="practice-list">
      <label class="practice-task"><input type="checkbox"> Write a program without an IDE</label>
      <label class="practice-task"><input type="checkbox"> Explain OOPS out loud</label>
    </div>
  `;
}

export function renderFlashcard() {
  const container = el("flashcard");
  if (!container) return;

  const cards = Array.isArray(state.currentData?.interview) ? state.currentData.interview : [];
  if (cards.length === 0) {
    container.className = "flashcard";
    container.innerHTML = `<div class="front"><strong>Flashcards</strong><p>No interview questions in this module yet.</p></div>`;
    return;
  }

  state.flashIndex = ((state.flashIndex % cards.length) + cards.length) % cards.length;
  const item = cards[state.flashIndex];
  const front = typeof item === 'string' ? item : item.q;
  const back = typeof item === 'string' ? 'Explain out loud, then check the Interview tab.' : item.a;

  container.className = `flashcard ${state.flipped ? "flipped" : ""}`;
  container.innerHTML = state.flipped
    ? `<div class="back"><strong>Answer (${state.flashIndex + 1}/${cards.length})</strong><p>${escapeHtml(back)}</p></div>`
    : `<div class="front"><strong>Question (${state.flashIndex + 1}/${cards.length})</strong><p>${escapeHtml(front)}</p></div>`;
}
