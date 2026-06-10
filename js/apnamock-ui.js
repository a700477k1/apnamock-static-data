/* ============================================
   ApnaMock - UI Components Module
   Reusable UI Components and Renderers
   ============================================ */

// ===== UI COMPONENTS =====
const UI = {
  // Render exam card
  examCard(exam) {
    return `
      <a href="tests.html?exam=${exam.id}" class="exam-card">
        <div class="exam-icon" style="background: ${exam.color || 'var(--primary-50)'}; color: ${exam.iconColor || 'var(--primary)'}">
          ${exam.icon || '📝'}
        </div>
        <div class="exam-name">${exam.name}</div>
        <div class="exam-count">${exam.testCount || 0} tests</div>
      </a>
    `;
  },

  // Render test card
  testCard(test) {
    const badges = [];
    if (test.isNew) badges.push('<span class="badge badge-primary">NEW</span>');
    if (test.isPopular) badges.push('<span class="badge badge-accent">POPULAR</span>');
    if (test.difficulty) badges.push(`<<span class="badge badge-${test.difficulty === 'easy' ? 'success' : test.difficulty === 'hard' ? 'danger' : 'warning'}">${test.difficulty.toUpperCase()}</span>`);

    return `
      <div class="test-card" data-test-id="${test.id}">
        <div class="test-thumbnail">
          ${test.icon || '📋'}
        </div>
        <div class="test-body">
          <div class="test-badges mb-2">${badges.join('')}</div>
          <div class="test-title">${test.title}</div>
          <div class="test-meta">
            <span>⏱️ ${test.duration} min</span>
            <span>❓ ${test.questions} questions</span>
            <span>📊 ${test.totalMarks} marks</span>
          </div>
        </div>
        <div class="test-footer">
          <div class="test-stats">
            <span class="test-stat">👁️ ${test.attempts || 0} attempts</span>
            <span class="test-stat">⭐ ${test.rating || '4.5'}</span>
          </div>
          <a href="quiz.html?test=${test.id}" class="btn btn-primary btn-sm">Start Test</a>
        </div>
      </div>
    `;
  },

  // Render question
  question(q, index, total, options = {}) {
    const { showAnswer = false, selectedOption = null, language = 'bilingual' } = options;
    const questionText = ApnaMock.language.getText(q.question, language);
    
    let optionsHtml = '';
    if (q.options) {
      optionsHtml = q.options.map((opt, i) => {
        const letter = String.fromCharCode(65 + i);
        const isSelected = selectedOption === i;
        const isCorrect = showAnswer && i === q.correct;
        const isWrong = showAnswer && isSelected && !isCorrect;
        
        let classes = 'option-card';
        if (isSelected) classes += ' selected';
        if (isCorrect) classes += ' correct';
        if (isWrong) classes += ' incorrect';
        
        return `
          <div class="${classes}" data-option="${i}">
            <div class="option-marker">${letter}</div>
            <div class="option-text">${ApnaMock.language.getText(opt, language)}</div>
          </div>
        `;
      }).join('');
    }

    return `
      <div class="question-container" data-question-index="${index}">
        <div class="question-number">Question ${index + 1} of ${total}</div>
        <div class="question-text">${questionText}</div>
        ${q.image ? `<div class="question-image"><img src="${q.image}" alt="Question image"></div>` : ''}
        <div class="options-container">${optionsHtml}</div>
      </div>
    `;
  },

  // Render question palette
  palette(total, current, answered = [], marked = []) {
    const buttons = Array.from({ length: total }, (_, i) => {
      let classes = 'palette-btn';
      if (i === current) classes += ' current';
      else if (answered.includes(i)) classes += ' answered';
      else if (marked.includes(i)) classes += ' marked';
      
      return `<button class="${classes}" data-index="${i}" aria-label="Go to question ${i + 1}">${i + 1}</button>
      `;
    }).join('');

    return `
      <div class="palette-container">
        <div class="palette-title">Question Palette</div>
        <div class="palette-grid">${buttons}</div>
        <div class="palette-legend">
          <div class="palette-legend-item">
            <div class="palette-legend-dot" style="background: var(--primary); border-color: var(--primary)"></div>
            <span>Current</span>
          </div>
          <div class="palette-legend-item">
            <div class="palette-legend-dot" style="background: var(--secondary-50); border-color: var(--secondary)"></div>
            <span>Answered</span>
          </div>
          <div class="palette-legend-item">
            <div class="palette-legend-dot" style="background: var(--warning-50); border-color: var(--warning)"></div>
            <span>Marked</span>
          </div>
        </div>
      </div>
    `;
  },

  // Render result summary
  resultSummary(result) {
    return `
      <div class="result-header">
        <div class="result-score">${result.score}/${result.totalMarks}</div>
        <div class="result-score-label">${result.percentage}% Accuracy</div>
      </div>
      <div class="result-stats-grid">
        <div class="result-stat-card correct">
          <div class="result-stat-value">${result.correct}</div>
          <div class="result-stat-label">Correct</div>
        </div>
        <div class="result-stat-card incorrect">
          <div class="result-stat-value">${result.incorrect}</div>
          <div class="result-stat-label">Incorrect</div>
        </div>
        <div class="result-stat-card unattempted">
          <div class="result-stat-value">${result.unattempted}</div>
          <div class="result-stat-label">Unattempted</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-value">${ApnaMock.utils.formatDuration(result.timeTaken)}</div>
          <div class="result-stat-label">Time Taken</div>
        </div>
      </div>
    `;
  },

  // Render skeleton loading
  skeleton(type = 'card', count = 3) {
    const templates = {
      card: '<div class="skeleton skeleton-card"></div>',
      text: '<div class="skeleton skeleton-text"></div>',
      title: '<div class="skeleton skeleton-title"></div>'
    };
    return Array(count).fill(templates[type] || templates.card).join('');
  },

  // Render empty state
  emptyState(icon, title, description, action = null) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">${icon}</div>
        <div class="empty-state-title">${title}</div>
        <div class="empty-state-desc">${description}</div>
        ${action ? `<a href="${action.href}" class="btn btn-primary">${action.label}</a>` : ''}
      </div>
    `;
  },

  // Render pagination
  pagination(current, total, baseUrl) {
    if (total <= 1) return '';
    
    let buttons = '';
    const maxVisible = 5;
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    
    if (start > 1) buttons += `<button class="pagination-btn" data-page="1">1</button>`;
    if (start > 2) buttons += '<span class="pagination-btn" disabled>...</span>';
    
    for (let i = start; i <= end; i++) {
      buttons += `<button class="pagination-btn ${i === current ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    if (end < total - 1) buttons += '<span class="pagination-btn" disabled>...</span>';
    if (end < total) buttons += `<button class="pagination-btn" data-page="${total}">${total}</button>`;
    
    return `
      <div class="pagination">
        <button class="pagination-btn" data-page="${current - 1}" ${current === 1 ? 'disabled' : ''}>←</button>
        ${buttons}
        <button class="pagination-btn" data-page="${current + 1}" ${current === total ? 'disabled' : ''}>→</button>
      </div>
    `;
  }
};

// ===== DOM HELPERS =====
const DOM = {
  // Safe HTML insertion
  setHTML(element, html) {
    if (typeof element === 'string') element = document.querySelector(element);
    if (element) element.innerHTML = html;
    return element;
  },

  // Create element from HTML string
  create(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
  },

  // Add event listener with delegation
  on(event, selector, handler, container = document) {
    container.addEventListener(event, (e) => {
      const target = e.target.closest(selector);
      if (target) handler(e, target);
    });
  },

  // Toggle class
  toggleClass(selector, className, force) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => el.classList.toggle(className, force));
  },

  // Show/hide element
  show(selector) { this.toggleClass(selector, 'hidden', false); },
  hide(selector) { this.toggleClass(selector, 'hidden', true); },

  // Fade in/out
  fadeIn(element, duration = 300) {
    if (typeof element === 'string') element = document.querySelector(element);
    if (!element) return;
    element.style.opacity = '0';
    element.style.display = '';
    element.classList.remove('hidden');
    requestAnimationFrame(() => {
      element.style.transition = `opacity ${duration}ms`;
      element.style.opacity = '1';
    });
  },

  fadeOut(element, duration = 300) {
    if (typeof element === 'string') element = document.querySelector(element);
    if (!element) return;
    element.style.transition = `opacity ${duration}ms`;
    element.style.opacity = '0';
    setTimeout(() => element.classList.add('hidden'), duration);
  }
};

// ===== COMPONENT RENDERERS =====
const Components = {
  // Render exam grid
  renderExamGrid(exams, container) {
    const html = exams.map(exam => UI.examCard(exam)).join('');
    DOM.setHTML(container, `<div class="exam-grid">${html}</div>`);
  },

  // Render test list
  renderTestList(tests, container, options = {}) {
    if (!tests.length) {
      DOM.setHTML(container, UI.emptyState('📋', 'No tests found', 'Try adjusting your filters or search query.'));
      return;
    }
    const html = tests.map(test => UI.testCard(test)).join('');
    DOM.setHTML(container, `<div class="grid grid-auto">${html}</div>`);
  },

  // Render quiz interface
  renderQuiz(container, testData, currentQuestion = 0, answers = {}, marked = []) {
    const q = testData.questions[currentQuestion];
    const total = testData.questions.length;
    
    const questionHtml = UI.question(q, currentQuestion, total, {
      selectedOption: answers[currentQuestion],
      language: ApnaMock.language.get()
    });
    
    const paletteHtml = UI.palette(total, currentQuestion, 
      Object.keys(answers).map(Number), marked);
    
    DOM.setHTML(container, `
      <div class="quiz-container">
        <div class="quiz-header">
          <div class="quiz-header-top">
            <div class="quiz-title">${testData.title}</div>
            <div class="quiz-timer" id="quiz-timer">⏱️ ${ApnaMock.utils.formatDuration(testData.duration * 60)}</div>
          </div>
          <div class="quiz-progress">
            <div class="progress-bar quiz-progress-bar">
              <div class="progress-bar-fill" style="width: ${((currentQuestion + 1) / total) * 100}%"></div>
            </div>
            <span class="quiz-progress-text">${currentQuestion + 1}/${total}</span>
          </div>
        </div>
        <div class="quiz-layout" style="display: grid; grid-template-columns: 1fr 280px; gap: 1.5rem;">
          <div class="quiz-main">${questionHtml}</div>
          <div class="quiz-sidebar">${paletteHtml}</div>
        </div>
        <div class="quiz-actions">
          <div class="quiz-nav">
            <button class="btn btn-ghost" id="prev-btn" ${currentQuestion === 0 ? 'disabled' : ''}>← Previous</button>
            <button class="btn btn-accent" id="mark-btn">📌 Mark for Review</button>
            <button class="btn btn-primary" id="next-btn">Next →</button>
          </div>
          <button class="btn btn-danger" id="submit-btn">Submit Test</button>
        </div>
      </div>
    `);
  },

  // Render results
  renderResults(container, result) {
    const summaryHtml = UI.resultSummary(result);
    
    let questionsHtml = '';
    if (result.questions) {
      questionsHtml = result.questions.map((q, i) => {
        const isCorrect = q.selected === q.correct;
        const status = q.selected === null ? 'unattempted' : isCorrect ? 'correct' : 'incorrect';
        return `
          <div class="card mb-4">
            <div class="card-body">
              <div class="flex justify-between items-center mb-3">
                <span class="font-semibold">Q${i + 1}</span>
                <span class="badge badge-${status}">${status.toUpperCase()}</span>
              </div>
              <p>${q.question}</p>
              <div class="mt-3">
                <div class="text-sm">Your answer: <span class="${isCorrect ? 'text-success' : 'text-danger'}">${q.selected !== null ? q.options[q.selected] : 'Not attempted'}</span></div>
                <div class="text-sm">Correct answer: <span class="text-success">${q.options[q.correct]}</span></div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    DOM.setHTML(container, `
      <div class="result-container">
        ${summaryHtml}
        <div class="result-questions">
          <h2 class="text-2xl font-bold mb-6">Question Review</h2>
          ${questionsHtml}
        </div>
        <div class="flex gap-4 mt-8">
          <a href="tests.html" class="btn btn-primary">Take Another Test</a>
          <a href="history.html" class="btn btn-outline">View History</a>
        </div>
      </div>
    `);
  }
};

// ===== EXPOSE GLOBALLY =====
window.ApnaMock = window.ApnaMock || {};
window.ApnaMock.ui = UI;
window.ApnaMock.dom = DOM;
window.ApnaMock.components = Components;
