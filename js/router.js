import { state, modulesList, getCompletionPct, moduleFileMap } from './state.js';
import { el, highlight, escapeHtml } from './ui.js';
import { renderNotes, renderFlashcard, renderQuiz } from './components.js';

function renderChallengeCode(code, blanks) {
  // The data file marks blanks in `code` with ___1___, ___2___ ... tokens (1-indexed,
  // matching `blanks` array order) so the placeholder text never has to duplicate the answer.
  const highlighted = highlight(code);
  return highlighted.replace(/___(\d+)___/g, (m, n) => {
    const idx = Number(n) - 1;
    const label = blanks[idx]?.label || `blank ${n}`;
    return `<span class="challenge-blank" data-blank-slot="${idx}">[ ${escapeHtml(label)} ]</span>`;
  });
}

function renderInterviewItem(q) {
  const question = typeof q === 'string' ? q : q.q;
  const answer = typeof q === 'string'
    ? 'Tip: Formulate your answer using real-world analogies and code examples.'
    : q.a;
  return `
    <div class="module-block" style="grid-column: 1 / -1;">
      <strong class="interview-question">Q: ${escapeHtml(question)}</strong>
      <p style="color: var(--muted); margin-top: 8px;">${escapeHtml(answer)}</p>
    </div>
  `;
}

export async function renderModule() {
  const fileKey = moduleFileMap[state.module];
  const exportKey = fileKey.replace(/_(.)/g, (m, c) => c.toUpperCase()) + 'Data';

  let modData;
  try {
    const moduleImport = await import(`../data/${fileKey}.js`);
    modData = moduleImport[exportKey] || moduleImport[fileKey + 'Data'] || Object.values(moduleImport)[0];
  } catch(e) {
    console.error("Module data not found for:", fileKey, e);
    modData = {
      title: state.module,
      concept: "Coming soon...",
      examples: [], interview: []
    };
  }

  state.currentData = modData;
  state.flashIndex = 0;
  state.flipped = false;

  const flashCount = Array.isArray(modData.interview) ? modData.interview.length : 0;
  const isCapstone = Array.isArray(modData.projects);

  el("contentArea").innerHTML = `
    <div class="module-header">
      <div class="module-header-row">
        <div>
          <h2>${escapeHtml(modData.title)}</h2>
          <span class="eyebrow">Module</span>
        </div>
        <button id="markCompleteBtn" class="${state.completed.has(state.module) ? 'ghost-btn' : 'primary-btn'}">
          ${state.completed.has(state.module) ? '✓ Completed' : 'Mark Complete'}
        </button>
      </div>
      <div class="tab-nav" role="tablist">
        <button class="tab-btn ${state.tab === 'overview' ? 'active' : ''}" data-tab="overview">Overview</button>
        ${isCapstone
          ? `<button class="tab-btn ${state.tab === 'capstone' ? 'active' : ''}" data-tab="capstone">Projects (${modData.projects.length})</button>`
          : `<button class="tab-btn ${state.tab === 'programs' ? 'active' : ''}" data-tab="programs">Programs (${modData.examples?.length || 0})</button>
        <button class="tab-btn ${state.tab === 'challenges' ? 'active' : ''}" data-tab="challenges">Challenges${Array.isArray(modData.challenges) && modData.challenges.length ? ` (${modData.challenges.length})` : ''}</button>
        <button class="tab-btn ${state.tab === 'memory' ? 'active' : ''}" data-tab="memory">Visual Memory</button>`}
        <button class="tab-btn ${state.tab === 'interview' ? 'active' : ''}" data-tab="interview">Interview</button>
        <button class="tab-btn ${state.tab === 'flashcards' ? 'active' : ''}" data-tab="flashcards">Flashcards</button>
        <button class="tab-btn ${state.tab === 'notes' ? 'active' : ''}" data-tab="notes">Notes</button>
        <button class="tab-btn ${state.tab === 'quiz' ? 'active' : ''}" data-tab="quiz">Mock Interview</button>
      </div>
    </div>

    <div id="tab-overview" class="module-tab" style="display:${state.tab === 'overview' ? 'block' : 'none'}">
      <div class="content-grid">
        <div class="module-block">
          <h4>Concept</h4>
          <p>${escapeHtml(modData.concept || '')}</p>
        </div>
        ${Array.isArray(modData.keyPoints) && modData.keyPoints.length ? `
        <div class="module-block fundamentals" style="grid-column: 1 / -1;">
          <h4>Core Fundamentals — know these cold</h4>
          <ul>${modData.keyPoints.map(k => `<li>${escapeHtml(k)}</li>`).join('')}</ul>
        </div>` : ''}
        <div class="module-block success">
          <h4>Why it exists</h4>
          <p>${escapeHtml(modData.why || '')}</p>
        </div>
        <div class="module-block warning">
          <h4>Real World Analogy</h4>
          <p>${escapeHtml(modData.realWorld || '')}</p>
        </div>
        <div class="module-block highlight-box">
          <h4>Selenium Mapping</h4>
          <p>${escapeHtml(modData.seleniumMapping || '')}</p>
        </div>
        ${modData.commonMistakes ? `
        <div class="module-block danger" style="grid-column: 1 / -1;">
          <h4>Common Mistakes</h4>
          ${Array.isArray(modData.commonMistakes) ? `<ul>${modData.commonMistakes.map(m => `<li>${escapeHtml(m)}</li>`).join('')}</ul>` : `<p>${escapeHtml(modData.commonMistakes)}</p>`}
        </div>` : ''}
        ${modData.handsOn ? `
        <div class="module-block" style="grid-column: 1 / -1;">
          <h4>Hands-On Challenge</h4>
          ${Array.isArray(modData.handsOn) ? `<ul>${modData.handsOn.map(m => `<li>${escapeHtml(m)}</li>`).join('')}</ul>` : `<p>${escapeHtml(modData.handsOn)}</p>`}
        </div>` : ''}
      </div>
    </div>

    ${isCapstone ? `
    <div id="tab-capstone" class="module-tab" style="display:${state.tab === 'capstone' ? 'block' : 'none'}">
      ${modData.projects.map((proj, pIndex) => {
        const doneKey = `capstone_${pIndex}`;
        const doneMilestones = state.practice[doneKey] || [];
        return `
        <div class="capstone-card">
          <div class="capstone-header">
            <span class="badge ${escapeHtml((proj.difficulty || 'intermediate').toLowerCase())}">${escapeHtml(proj.difficulty || 'Intermediate')}</span>
            <h4>${escapeHtml(proj.title)}</h4>
          </div>
          <p class="capstone-summary">${escapeHtml(proj.summary)}</p>
          <p class="capstone-outcome"><strong>Outcome:</strong> ${escapeHtml(proj.outcome)}</p>
          <div class="milestone-list">
            ${proj.milestones.map((m, mIndex) => {
              const checked = doneMilestones.includes(mIndex);
              return `
              <div class="milestone ${checked ? 'done' : ''}">
                <label class="milestone-check">
                  <input type="checkbox" data-capstone="${pIndex}" data-milestone="${mIndex}" ${checked ? 'checked' : ''} />
                  <span class="milestone-title">${escapeHtml(m.title)}</span>
                </label>
                <p class="milestone-uses"><strong>Uses:</strong> ${escapeHtml(m.uses)}</p>
                <p class="milestone-task">${escapeHtml(m.task)}</p>
                <p class="milestone-hint"><strong>Hint:</strong> ${escapeHtml(m.hint)}</p>
              </div>`;
            }).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>
    ` : `
    <div id="tab-programs" class="module-tab" style="display:${state.tab === 'programs' ? 'block' : 'none'}">
      ${(modData.examples || []).map((p, index) => `
        <div class="program-card">
          <div class="program-header">
            <span class="badge ${escapeHtml((p.level || 'basic').toLowerCase().replace(/[^a-z-]/g, ''))}">${escapeHtml(p.level || 'Basic')}</span>
            <h4>Program ${index + 1}: ${escapeHtml(p.title)}</h4>
          </div>
          <pre class="code-block"><code>${highlight(p.code)}</code></pre>
          <div class="output-block">
            <span class="output-label">Console Output</span>
            <pre>${escapeHtml(p.output)}</pre>
          </div>
          <div class="explanation-block">
            <p>${escapeHtml(p.explanation)}</p>
            <p><strong>Selenium Use Case:</strong> ${escapeHtml(p.selenium || '')}</p>
          </div>
          ${Array.isArray(p.walkthrough) && p.walkthrough.length ? `
          <details class="walkthrough">
            <summary>Line-by-line explanation</summary>
            <div class="walkthrough-list">
              ${p.walkthrough.map(w => `
                <div class="walkthrough-row">
                  <pre><code>${highlight(w.code)}</code></pre>
                  <p>${escapeHtml(w.note)}</p>
                </div>`).join('')}
            </div>
          </details>` : ''}
        </div>
      `).join('')}
    </div>

    <div id="tab-challenges" class="module-tab" style="display:${state.tab === 'challenges' ? 'block' : 'none'}">
      ${Array.isArray(modData.challenges) && modData.challenges.length ? `
        <p class="challenges-intro">Fill in each blank, then check your answer. This tests recall, not just recognition — the way interviewers actually probe.</p>
        ${modData.challenges.map((c, cIndex) => `
        <div class="challenge-card" data-challenge="${cIndex}">
          <div class="challenge-header">
            <h4>Challenge ${cIndex + 1}: ${escapeHtml(c.title)}</h4>
          </div>
          <p class="challenge-prompt">${escapeHtml(c.prompt)}</p>
          <pre class="code-block challenge-code"><code>${renderChallengeCode(c.code, c.blanks)}</code></pre>
          <div class="challenge-inputs">
            ${c.blanks.map((b, bIndex) => `
              <label class="challenge-input-row">
                <span>Blank ${bIndex + 1}${b.label ? ` — ${escapeHtml(b.label)}` : ''}:</span>
                <input type="text" class="text-input challenge-blank-input" data-challenge="${cIndex}" data-blank="${bIndex}" autocomplete="off" spellcheck="false" />
              </label>
            `).join('')}
          </div>
          <div class="inline-actions">
            <button class="primary-btn small challenge-check-btn" data-challenge="${cIndex}">Check Answer</button>
            <button class="ghost-btn small challenge-reveal-btn" data-challenge="${cIndex}">Reveal Solution</button>
          </div>
          <div class="challenge-result" data-challenge-result="${cIndex}"></div>
        </div>
        `).join('')}
      ` : `<div class="module-block"><p>No guided challenges for this module yet — try Introduction, OOPS, or Collections Framework.</p></div>`}
    </div>

    <div id="tab-memory" class="module-tab" style="display:${state.tab === 'memory' ? 'block' : 'none'}">
      <div class="module-block">
        <h4 style="margin-top:0;">Memory Visualizer: ${escapeHtml(state.module)}</h4>
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
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05);">
          <h4>Mental Model</h4>
          <p style="color: var(--muted); line-height: 1.5;">${escapeHtml(modData.memory || modData.memoryVis || 'Mental model mapping for this topic.')}</p>
        </div>
      </div>
    </div>
    `}

    <div id="tab-interview" class="module-tab" style="display:${state.tab === 'interview' ? 'block' : 'none'}">
      <div class="content-grid">
        ${modData.interview ? (Array.isArray(modData.interview)
          ? modData.interview.map(renderInterviewItem).join('')
          : Object.entries(modData.interview).map(([level, qs]) => `
              <div style="grid-column: 1 / -1; margin-top: 10px;">
                <h4 style="text-transform: capitalize; color: var(--accent-3);">${escapeHtml(level)} Level</h4>
              </div>
              ${(Array.isArray(qs) ? qs : []).map(renderInterviewItem).join('')}
            `).join('')
        ) : '<div class="module-block"><p>No interview questions available for this module.</p></div>'}
      </div>
    </div>

    <div id="tab-flashcards" class="module-tab" style="display:${state.tab === 'flashcards' ? 'block' : 'none'}">
      <div class="module-block">
        <p style="color:var(--muted); margin-bottom:14px;">
          ${flashCount > 0
            ? `Flashcards built from this module's ${flashCount} interview question${flashCount === 1 ? '' : 's'}. Click the card or Flip to reveal the answer.`
            : 'No flashcards available for this module yet.'}
        </p>
        <div id="flashcard" class="flashcard" role="button" tabindex="0" aria-label="Flashcard — click to flip"></div>
        <div class="inline-actions" style="margin-top:14px;">
          <button id="flipCardBtn" class="primary-btn" ${flashCount === 0 ? 'disabled' : ''}>Flip Card</button>
          <button id="randomCardBtn" class="ghost-btn" ${flashCount === 0 ? 'disabled' : ''}>Next Card</button>
        </div>
      </div>
    </div>

    <div id="tab-notes" class="module-tab" style="display:${state.tab === 'notes' ? 'block' : 'none'}">
      <div class="module-block" style="margin-bottom:16px;">
        <h4 style="margin-top:0;">Add a note</h4>
        <div style="display:grid; gap:10px; margin-top:10px;">
          <input id="noteTitle" class="text-input" type="text" maxlength="120" placeholder="Note title" aria-label="Note title" />
          <textarea id="noteBody" class="text-area" maxlength="4000" placeholder="Write your note... use #tags to highlight" aria-label="Note body"></textarea>
          <div class="inline-actions">
            <button id="saveNoteBtn" class="primary-btn">Save Note</button>
          </div>
        </div>
      </div>
      <div id="notesList"></div>
    </div>

    <div id="tab-quiz" class="module-tab" style="display:${state.tab === 'quiz' ? 'block' : 'none'}">
      <div class="module-block">
        <h4 style="margin-top:0;">Selenium Mock Interview Tracks</h4>
        <select id="quizModuleSelect" class="select" aria-label="Select interview track" style="margin:12px 0;"></select>
        <div id="quizArea"></div>
      </div>
    </div>
  `;

  renderFlashcard();
  renderNotes();
  renderQuiz();
}

export function renderSidebar() {
  const nav = el("moduleNav");
  if (!nav) return;
  const q = state.search.trim().toLowerCase();
  const visible = q ? modulesList.filter(m => m.toLowerCase().includes(q)) : modulesList;
  if (visible.length === 0) {
    nav.innerHTML = `<p style="color:var(--muted); padding:8px 4px; font-size:0.9rem;">No modules match "${escapeHtml(state.search)}"</p>`;
    return;
  }
  nav.innerHTML = visible.map(m =>
    `<a href="#" class="module-link ${state.module === m ? 'active' : ''}" data-module="${escapeHtml(m)}" aria-current="${state.module === m ? 'page' : 'false'}">
       <span class="status-dot ${state.completed.has(m) ? 'completed' : ''}" aria-hidden="true"></span>${escapeHtml(m)}
     </a>`
  ).join("");
}

export function renderStats() {
  const stats = el("progressStats");
  if (!stats) return;
  const total = modulesList.length;
  const done = state.completed.size;
  const pct = getCompletionPct();
  const notesCount = state.notes.length;

  stats.innerHTML = `
    <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:15px; width:100%;">
      <div class="stat-box" style="flex:1; min-width:120px;">
        <strong style="color:var(--accent);">${done} / ${total}</strong>
        <span>Modules Done</span>
      </div>
      <div class="stat-box" style="flex:1; min-width:120px;">
        <strong style="color:${pct > 75 ? '#4ade80' : 'var(--warn)'};">${pct}%</strong>
        <span>Completion</span>
      </div>
      <div class="stat-box" style="flex:1; min-width:120px;">
        <strong style="color:var(--accent-2);">${notesCount}</strong>
        <span>Saved Notes</span>
      </div>
      <div class="stat-box" style="flex:1; min-width:120px;">
        <strong style="color:var(--accent-3);">${done > 0 ? (done * 0.5).toFixed(1) + ' hrs' : '0 hrs'}</strong>
        <span>Study Time</span>
      </div>
    </div>
    <div style="width:100%; height:4px; background:rgba(255,255,255,0.1); border-radius:2px; margin-top:15px; overflow:hidden;">
      <div style="width:${pct}%; height:100%; background:linear-gradient(90deg, var(--accent), var(--accent-3)); transition:width 0.5s ease;"></div>
    </div>
  `;
}
