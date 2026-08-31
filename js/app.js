(() => {
  'use strict';

  const STORAGE_KEY = 'awsStudyGuide.progress.v1';
  const state = {
    manifest: null,
    data: null,
    progress: loadProgress(),
    activeView: 'dashboard',
    activeCategory: 'all',
    searchQuery: '',
    activeTopicId: null,
    quizIndex: 0,
    quizAnswered: false,
    quizCorrect: 0,
    quizSessionAttempts: 0
  };

  const els = {};

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    cacheElements();
    bindEvents();
    await loadData();
  }

  function cacheElements() {
    const ids = [
      'sidebarProgressText','sidebarProgressBar','sidebarProgressDetail','globalSearch','datasetStatus',
      'metricCompleted','metricCompletedSub','metricWeak','metricBookmarks','metricAccuracy','metricAttempts',
      'nextLesson','roadmapPercent','roadmapList','categoryFilters','topicGrid','topicCount','emptyTopics',
      'quizScore','quizCategory','quizPosition','quizQuestion','quizChoices','quizFeedback','nextQuiz','resetQuiz',
      'weakCount','bookmarkCount','weakList','bookmarkList','resetProgress','topicDialog','dialogCategory','dialogLevel',
      'dialogService','dialogTitle','dialogSummary','dialogMental','dialogPoints','dialogCompare','dialogExam','dialogSource',
      'closeDialog','toggleWeak','toggleBookmark','toggleComplete','toast','mobileMenu'
    ];
    ids.forEach(id => { els[id] = document.getElementById(id); });
  }

  function bindEvents() {
    document.querySelectorAll('[data-view]').forEach(button => {
      button.addEventListener('click', () => switchView(button.dataset.view));
    });

    document.querySelectorAll('[data-go]').forEach(button => {
      button.addEventListener('click', () => switchView(button.dataset.go));
    });

    document.querySelectorAll('[data-topic]').forEach(button => {
      button.addEventListener('click', () => openTopic(button.dataset.topic));
    });

    els.globalSearch.addEventListener('input', event => {
      state.searchQuery = event.target.value.trim().toLowerCase();
      if (state.activeView !== 'topics') switchView('topics');
      renderTopics();
    });

    document.addEventListener('keydown', event => {
      if (event.key === '/' && document.activeElement !== els.globalSearch) {
        event.preventDefault();
        els.globalSearch.focus();
      }
      if (event.key === 'Escape') closeMobileMenu();
    });

    els.mobileMenu.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      els.mobileMenu.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', event => {
      if (document.body.classList.contains('menu-open') && !event.target.closest('.sidebar') && !event.target.closest('#mobileMenu')) {
        closeMobileMenu();
      }
    });

    els.closeDialog.addEventListener('click', () => els.topicDialog.close());
    els.topicDialog.addEventListener('click', event => {
      const rect = els.topicDialog.getBoundingClientRect();
      const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      if (outside) els.topicDialog.close();
    });

    els.toggleComplete.addEventListener('click', () => toggleTopicState('completed'));
    els.toggleWeak.addEventListener('click', () => toggleTopicState('weak'));
    els.toggleBookmark.addEventListener('click', () => toggleTopicState('bookmarks'));
    els.nextQuiz.addEventListener('click', nextQuizQuestion);
    els.resetQuiz.addEventListener('click', resetQuizSession);
    els.resetProgress.addEventListener('click', resetAllProgress);
  }

  async function loadData() {
    try {
      const manifestResponse = await fetch('./data/manifest.json', { cache: 'no-store' });
      if (!manifestResponse.ok) throw new Error(`manifest HTTP ${manifestResponse.status}`);
      const manifest = await manifestResponse.json();
      validateManifest(manifest);

      const dataResponse = await fetch('./data/aws-core.json', { cache: 'no-store' });
      if (!dataResponse.ok) throw new Error(`data HTTP ${dataResponse.status}`);
      const data = await dataResponse.json();
      validateData(data, manifest);

      state.manifest = manifest;
      state.data = data;
      els.datasetStatus.textContent = `教材 ${manifest.datasetVersion}`;
      renderAll();
    } catch (error) {
      console.error('Failed to load AWS study data:', error);
      els.datasetStatus.textContent = '教材の読み込みに失敗';
      els.nextLesson.textContent = '教材を読み込めませんでした。GitHub Pages上で開いているか確認してください。';
      els.topicGrid.innerHTML = '';
      els.emptyTopics.hidden = false;
      els.emptyTopics.querySelector('strong').textContent = '教材の読み込みに失敗しました';
      els.emptyTopics.querySelector('p').textContent = '再読み込みしても直らない場合は data/*.json の状態を確認してください。';
    }
  }

  function validateManifest(manifest) {
    if (!manifest || manifest.schemaVersion !== 1 || !manifest.counts) throw new Error('Unsupported manifest schema');
  }

  function validateData(data, manifest) {
    if (!data || data.schemaVersion !== 1 || !Array.isArray(data.topics) || !Array.isArray(data.quiz)) {
      throw new Error('Invalid AWS dataset');
    }
    const topicIds = new Set();
    data.topics.forEach(topic => {
      if (!topic.id || topicIds.has(topic.id)) throw new Error(`Invalid or duplicate topic id: ${topic.id}`);
      topicIds.add(topic.id);
    });
    if (manifest.counts.topics !== data.topics.length || manifest.counts.quizQuestions !== data.quiz.length) {
      throw new Error('Manifest count mismatch');
    }
    data.quiz.forEach(question => {
      if (!topicIds.has(question.topicId) || !Array.isArray(question.choices) || question.answer < 0 || question.answer >= question.choices.length) {
        throw new Error(`Invalid quiz question: ${question.id}`);
      }
    });
  }

  function loadProgress() {
    const empty = {
      schemaVersion: 1,
      completed: [],
      weak: [],
      bookmarks: [],
      quizHistory: {},
      updatedAt: null
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return empty;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.schemaVersion !== 1) return empty;
      return {
        ...empty,
        ...parsed,
        completed: uniqueStrings(parsed.completed),
        weak: uniqueStrings(parsed.weak),
        bookmarks: uniqueStrings(parsed.bookmarks),
        quizHistory: parsed.quizHistory && typeof parsed.quizHistory === 'object' ? parsed.quizHistory : {}
      };
    } catch (error) {
      console.warn('Progress data could not be loaded:', error);
      return empty;
    }
  }

  function uniqueStrings(value) {
    return Array.isArray(value) ? [...new Set(value.filter(item => typeof item === 'string'))] : [];
  }

  function saveProgress() {
    try {
      state.progress.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
      return true;
    } catch (error) {
      console.error('Progress save failed:', error);
      showToast('進捗を保存できませんでした');
      return false;
    }
  }

  function renderAll() {
    renderMetrics();
    renderNextLesson();
    renderRoadmap();
    renderCategoryFilters();
    renderTopics();
    renderReview();
    renderQuiz();
  }

  function switchView(view) {
    if (!document.querySelector(`[data-view-panel="${view}"]`)) return;
    state.activeView = view;
    document.querySelectorAll('[data-view-panel]').forEach(panel => panel.classList.toggle('is-active', panel.dataset.viewPanel === view));
    document.querySelectorAll('[data-view]').forEach(button => button.classList.toggle('is-active', button.dataset.view === view));
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'topics') renderTopics();
    if (view === 'review') renderReview();
  }

  function closeMobileMenu() {
    document.body.classList.remove('menu-open');
    els.mobileMenu.setAttribute('aria-expanded', 'false');
  }

  function renderMetrics() {
    if (!state.data) return;
    const total = state.data.topics.length;
    const completed = countValidIds(state.progress.completed);
    const weak = countValidIds(state.progress.weak);
    const bookmarks = countValidIds(state.progress.bookmarks);
    const percent = total ? Math.round((completed / total) * 100) : 0;
    const history = Object.values(state.progress.quizHistory);
    const totalAttempts = history.reduce((sum, item) => sum + (Number(item.attempts) || 0), 0);
    const totalCorrect = history.reduce((sum, item) => sum + (Number(item.correct) || 0), 0);
    const accuracy = totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : null;

    els.sidebarProgressText.textContent = `${percent}%`;
    els.sidebarProgressBar.style.width = `${percent}%`;
    els.sidebarProgressDetail.textContent = `${completed} / ${total} トピック完了`;
    els.metricCompleted.textContent = String(completed);
    els.metricCompletedSub.textContent = `/ ${total} topics`;
    els.metricWeak.textContent = String(weak);
    els.metricBookmarks.textContent = String(bookmarks);
    els.metricAccuracy.textContent = accuracy === null ? '—' : `${accuracy}%`;
    els.metricAttempts.textContent = totalAttempts ? `${totalAttempts}回答` : 'まだ未回答';
    els.roadmapPercent.textContent = `${percent}%`;
  }

  function countValidIds(ids) {
    if (!state.data) return 0;
    const valid = new Set(state.data.topics.map(topic => topic.id));
    return ids.filter(id => valid.has(id)).length;
  }

  function renderNextLesson() {
    if (!state.data) return;
    const next = state.data.topics.find(topic => !state.progress.completed.includes(topic.id));
    if (!next) {
      els.nextLesson.innerHTML = `<div class="next-copy"><span>COMPLETE</span><h3>基礎トピックをすべて学習済み</h3><p>クイズと苦手テーマの復習で知識を固めよう。</p></div><button class="btn btn-primary" type="button" data-next-action="quiz">クイズへ</button>`;
      els.nextLesson.querySelector('[data-next-action]').addEventListener('click', () => switchView('quiz'));
      return;
    }
    const category = getCategory(next.category);
    els.nextLesson.innerHTML = `<div class="next-copy"><span>STEP ${String(getRoadmapStep(next.id)).padStart(2, '0')} · ${escapeHtml(category?.label || '')}</span><h3>${escapeHtml(next.title)}</h3><p>${escapeHtml(next.summary)}</p></div><button class="btn btn-primary" type="button" data-next-topic="${escapeHtml(next.id)}">学習する</button>`;
    els.nextLesson.querySelector('[data-next-topic]').addEventListener('click', () => openTopic(next.id));
  }

  function getRoadmapStep(topicId) {
    return state.data.roadmap.find(step => step.topicIds.includes(topicId))?.step || 0;
  }

  function renderRoadmap() {
    if (!state.data) return;
    els.roadmapList.innerHTML = state.data.roadmap.map(step => {
      const done = step.topicIds.filter(id => state.progress.completed.includes(id)).length;
      const complete = done === step.topicIds.length;
      const topicButtons = step.topicIds.map(id => {
        const topic = getTopic(id);
        if (!topic) return '';
        const isComplete = state.progress.completed.includes(id);
        return `<button class="roadmap-topic ${isComplete ? 'is-complete' : ''}" type="button" data-roadmap-topic="${escapeHtml(id)}">${isComplete ? '✓ ' : ''}${escapeHtml(topic.service)}</button>`;
      }).join('');
      return `<article class="roadmap-step ${complete ? 'is-complete' : ''}"><div class="roadmap-number">${complete ? '✓' : String(step.step).padStart(2, '0')}</div><div class="roadmap-copy"><h2>${escapeHtml(step.title)}</h2><p>${escapeHtml(step.description)}</p><div class="roadmap-topics">${topicButtons}</div></div><div class="roadmap-status">${done} / ${step.topicIds.length} 完了</div></article>`;
    }).join('');
    els.roadmapList.querySelectorAll('[data-roadmap-topic]').forEach(button => button.addEventListener('click', () => openTopic(button.dataset.roadmapTopic)));
  }

  function renderCategoryFilters() {
    if (!state.data) return;
    const all = `<button class="filter-chip ${state.activeCategory === 'all' ? 'is-active' : ''}" type="button" data-category="all">すべて</button>`;
    const categories = [...state.data.categories].sort((a, b) => a.order - b.order).map(category =>
      `<button class="filter-chip ${state.activeCategory === category.id ? 'is-active' : ''}" type="button" data-category="${escapeHtml(category.id)}">${escapeHtml(category.label)}</button>`
    ).join('');
    els.categoryFilters.innerHTML = all + categories;
    els.categoryFilters.querySelectorAll('[data-category]').forEach(button => {
      button.addEventListener('click', () => {
        state.activeCategory = button.dataset.category;
        renderCategoryFilters();
        renderTopics();
      });
    });
  }

  function renderTopics() {
    if (!state.data) return;
    const query = state.searchQuery;
    const filtered = state.data.topics.filter(topic => {
      const categoryMatch = state.activeCategory === 'all' || topic.category === state.activeCategory;
      const haystack = [topic.title, topic.service, topic.summary, topic.mentalModel, topic.compare, topic.examTip, ...topic.keyPoints].join(' ').toLowerCase();
      return categoryMatch && (!query || haystack.includes(query));
    });

    els.topicCount.textContent = `${filtered.length} topics`;
    els.emptyTopics.hidden = filtered.length !== 0;
    els.topicGrid.innerHTML = filtered.map(topic => topicCardHtml(topic)).join('');
    els.topicGrid.querySelectorAll('[data-topic-card]').forEach(card => card.addEventListener('click', () => openTopic(card.dataset.topicCard)));
  }

  function topicCardHtml(topic) {
    const category = getCategory(topic.category);
    const complete = state.progress.completed.includes(topic.id);
    const weak = state.progress.weak.includes(topic.id);
    const bookmark = state.progress.bookmarks.includes(topic.id);
    return `<button class="topic-card ${complete ? 'is-complete' : ''}" type="button" data-topic-card="${escapeHtml(topic.id)}"><div class="topic-card-top"><span class="topic-category">${escapeHtml(category?.label || topic.category)}</span><span class="topic-level">${escapeHtml(topic.level)}</span></div><p class="topic-service">${escapeHtml(topic.service)}</p><h2>${escapeHtml(topic.title)}</h2><p>${escapeHtml(topic.summary)}</p><div class="topic-card-footer"><span>${complete ? '学習済み' : '開いて学習'}</span><span class="topic-state" aria-label="学習状態"><i class="state-dot ${complete ? 'complete' : ''}"></i>${weak ? '<i class="state-dot weak"></i>' : ''}${bookmark ? '<i class="state-dot bookmark"></i>' : ''}</span></div></button>`;
  }

  function openTopic(id) {
    if (!state.data) return;
    const topic = getTopic(id);
    if (!topic) return;
    state.activeTopicId = id;
    const category = getCategory(topic.category);
    els.dialogCategory.textContent = category?.label || topic.category;
    els.dialogLevel.textContent = topic.level;
    els.dialogService.textContent = topic.service;
    els.dialogTitle.textContent = topic.title;
    els.dialogSummary.textContent = topic.summary;
    els.dialogMental.textContent = topic.mentalModel;
    els.dialogPoints.innerHTML = topic.keyPoints.map(point => `<li>${escapeHtml(point)}</li>`).join('');
    els.dialogCompare.textContent = topic.compare;
    els.dialogExam.textContent = topic.examTip;
    els.dialogSource.href = topic.sourceUrl;
    updateDialogButtons();
    if (!els.topicDialog.open) els.topicDialog.showModal();
  }

  function updateDialogButtons() {
    const id = state.activeTopicId;
    if (!id) return;
    const complete = state.progress.completed.includes(id);
    const weak = state.progress.weak.includes(id);
    const bookmark = state.progress.bookmarks.includes(id);
    els.toggleComplete.textContent = complete ? '✓ 学習済み' : '学習済みにする';
    els.toggleWeak.textContent = weak ? '苦手から外す' : '苦手に追加';
    els.toggleBookmark.textContent = bookmark ? '★ ブックマーク済み' : '☆ ブックマーク';
  }

  function toggleTopicState(key) {
    const id = state.activeTopicId;
    if (!id || !['completed','weak','bookmarks'].includes(key)) return;
    const current = state.progress[key];
    const exists = current.includes(id);
    const next = exists ? current.filter(item => item !== id) : [...current, id];
    state.progress[key] = next;
    if (!saveProgress()) return;
    updateDialogButtons();
    renderMetrics();
    renderNextLesson();
    renderRoadmap();
    renderTopics();
    renderReview();
    const labels = { completed: exists ? '学習済みを解除しました' : '学習済みにしました', weak: exists ? '苦手から外しました' : '苦手に追加しました', bookmarks: exists ? 'ブックマークを外しました' : 'ブックマークしました' };
    showToast(labels[key]);
  }

  function renderReview() {
    if (!state.data) return;
    const weakTopics = idsToTopics(state.progress.weak);
    const bookmarkTopics = idsToTopics(state.progress.bookmarks);
    els.weakCount.textContent = String(weakTopics.length);
    els.bookmarkCount.textContent = String(bookmarkTopics.length);
    els.weakList.innerHTML = reviewListHtml(weakTopics, '苦手テーマはまだありません');
    els.bookmarkList.innerHTML = reviewListHtml(bookmarkTopics, 'ブックマークはまだありません');
    document.querySelectorAll('[data-review-topic]').forEach(button => button.addEventListener('click', () => openTopic(button.dataset.reviewTopic)));
  }

  function reviewListHtml(topics, emptyText) {
    if (!topics.length) return `<div class="review-empty">${escapeHtml(emptyText)}</div>`;
    return topics.map(topic => `<button class="review-item" type="button" data-review-topic="${escapeHtml(topic.id)}"><span><strong>${escapeHtml(topic.title)}</strong><small>${escapeHtml(topic.service)}</small></span><span class="review-arrow">→</span></button>`).join('');
  }

  function renderQuiz() {
    if (!state.data || !state.data.quiz.length) return;
    const question = state.data.quiz[state.quizIndex];
    const topic = getTopic(question.topicId);
    const category = getCategory(topic?.category);
    els.quizCategory.textContent = `${category?.label || 'AWS'} · ${topic?.service || ''}`;
    els.quizPosition.textContent = `${state.quizIndex + 1} / ${state.data.quiz.length}`;
    els.quizQuestion.textContent = question.question;
    els.quizFeedback.hidden = true;
    els.quizFeedback.classList.remove('is-wrong');
    els.quizFeedback.innerHTML = '';
    els.nextQuiz.disabled = true;
    state.quizAnswered = false;
    els.quizChoices.innerHTML = question.choices.map((choice, index) => `<button class="quiz-choice" type="button" data-choice="${index}"><span>${String.fromCharCode(65 + index)}</span>${escapeHtml(choice)}</button>`).join('');
    els.quizChoices.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => answerQuiz(Number(button.dataset.choice))));
    updateQuizScore();
  }

  function answerQuiz(choiceIndex) {
    if (state.quizAnswered || !state.data) return;
    state.quizAnswered = true;
    state.quizSessionAttempts += 1;
    const question = state.data.quiz[state.quizIndex];
    const correct = choiceIndex === question.answer;
    if (correct) state.quizCorrect += 1;

    els.quizChoices.querySelectorAll('[data-choice]').forEach(button => {
      const index = Number(button.dataset.choice);
      button.disabled = true;
      if (index === question.answer) button.classList.add('is-correct');
      if (index === choiceIndex && !correct) button.classList.add('is-wrong');
    });

    els.quizFeedback.hidden = false;
    els.quizFeedback.classList.toggle('is-wrong', !correct);
    els.quizFeedback.innerHTML = `<strong>${correct ? '正解' : '不正解'}</strong>${escapeHtml(question.explanation)}`;
    els.nextQuiz.disabled = false;
    els.nextQuiz.textContent = state.quizIndex === state.data.quiz.length - 1 ? '結果を見て最初へ' : '次の問題';

    const previous = state.progress.quizHistory[question.id] || { attempts: 0, correct: 0, lastAt: null };
    state.progress.quizHistory[question.id] = {
      attempts: Number(previous.attempts || 0) + 1,
      correct: Number(previous.correct || 0) + (correct ? 1 : 0),
      lastAt: new Date().toISOString()
    };
    saveProgress();
    renderMetrics();
    updateQuizScore();
  }

  function nextQuizQuestion() {
    if (!state.data || !state.quizAnswered) return;
    if (state.quizIndex >= state.data.quiz.length - 1) {
      const score = `${state.quizCorrect} / ${state.quizSessionAttempts}`;
      showToast(`今回の結果: ${score}`);
      state.quizIndex = 0;
      state.quizCorrect = 0;
      state.quizSessionAttempts = 0;
    } else {
      state.quizIndex += 1;
    }
    renderQuiz();
  }

  function resetQuizSession() {
    state.quizIndex = 0;
    state.quizCorrect = 0;
    state.quizSessionAttempts = 0;
    state.quizAnswered = false;
    renderQuiz();
    showToast('今回のクイズを最初からにしました');
  }

  function updateQuizScore() {
    els.quizScore.textContent = `${state.quizCorrect} / ${state.quizSessionAttempts}`;
  }

  function resetAllProgress() {
    const accepted = window.confirm('学習済み・苦手・ブックマーク・クイズ履歴をすべて削除します。元に戻せません。');
    if (!accepted) return;
    state.progress = {
      schemaVersion: 1,
      completed: [],
      weak: [],
      bookmarks: [],
      quizHistory: {},
      updatedAt: null
    };
    if (!saveProgress()) return;
    state.quizIndex = 0;
    state.quizCorrect = 0;
    state.quizSessionAttempts = 0;
    renderAll();
    showToast('学習進捗をリセットしました');
  }

  function getTopic(id) {
    return state.data?.topics.find(topic => topic.id === id) || null;
  }

  function getCategory(id) {
    return state.data?.categories.find(category => category.id === id) || null;
  }

  function idsToTopics(ids) {
    return ids.map(getTopic).filter(Boolean);
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add('is-visible');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => els.toast.classList.remove('is-visible'), 2200);
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
})();
