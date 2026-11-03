(() => {
  'use strict';

  const courses = Array.isArray(window.VAKSHARA_COURSES) ? window.VAKSHARA_COURSES : [];
  const topics = Array.isArray(window.VAKSHARA_TOPICS) ? window.VAKSHARA_TOPICS : [];
  const teacherGuides = window.VAKSHARA_TEACHER_GUIDES || {};
  const app = document.getElementById('app');
  const STORE = {
    theme: 'vakshara-theme-v4',
    language: 'vakshara-lesson-language-v4',
    progress: 'vakshara-learning-progress-v4',
    tasks: 'vakshara-self-tracker-v1'
  };
  const today = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const read = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { showToast('This browser could not save the change.'); return false; }
  };
  const readPreference = (key, fallback) => {
    try { return localStorage.getItem(key) || fallback; }
    catch { return fallback; }
  };
  const state = {
    page: 'home', theme: readPreference(STORE.theme, 'light'),
    lang: readPreference(STORE.language, 'en'),
    selectedLang: readPreference(STORE.language, 'en'),
    activeTopic: null, search: '', progress: read(STORE.progress, {}),
    tasks: read(STORE.tasks, []), trackerDate: today(), trackerFilter: 'all',
    quizAnswers: {}, quizChecked: false, lastQuizScore: null
  };

  const path = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5m7 7-7-7 7-7"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21zM4 5.5v15.5M8 7h8M8 11h8"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.5"/>',
    code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/>',
    brain: '<path d="M9 4a3 3 0 0 0-5 2 3 3 0 0 0-1 5 3.5 3.5 0 0 0 2 6 3 3 0 0 0 5 2zM15 4a3 3 0 0 1 5 2 3 3 0 0 1 1 5 3.5 3.5 0 0 1-2 6 3 3 0 0 1-5 2zM12 4v16M8 8l3 2M16 8l-3 2M8 15l3-2M16 15l-3-2"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14z"/>',
    flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M8 15h8"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    chart: '<path d="M3 19V5M3 19h18M7 15l4-5 3 3 5-7"/>',
    sparkle: '<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z"/>'
  };
  const ico = (name, cls = 'icon') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${path[name] || path.sparkle}</svg>`;
  const labels = {
    welcomeTitle: 'Welcome to the Python Universe',
    welcomeCopy: 'You are entering the first course in VAKSHARA Learn. Choose the language for lesson explanations. You can change it whenever you like.',
    chooseLanguage: 'Choose your lesson language',
    english: 'English', hinglish: 'Hinglish', continue: 'Continue to Python',
    quiz: 'Topic quiz', quizCopy: 'Choose one answer for each question. Submit when you finish. You will see your score, the correct answer and a simple reason for every question.',
    checkAnswers: 'Check answers', tryAgain: 'Try again', markLearned: 'Mark topic learned',
    previous: 'Previous topic', next: 'Next topic', originalNotes: 'Worked examples and explanations',
    originalSource: 'Lesson material', backToHome: 'Back to home', backToPython: 'Back to Python',
    selfTitle: 'Make room for steady progress.',
    selfCopy: 'Write your daily study tasks, choose a date and tick each task when you finish it.',
    task: 'Task', taskPlaceholder: 'Example: revise string slicing', taskDate: 'Date', addTask: 'Add task',
    dailyProgress: 'Daily progress', all: 'All', todo: 'To do', completed: 'Completed', clearCompleted: 'Clear completed',
    noTasks: 'No tasks for this day yet. Add one small step to get started.',
    noFilteredTasks: 'No tasks match this filter.',
    localOnly: 'Your tasks are saved only in this browser on this device. They are not synced to an account or another device.',
    aboutTitle: 'A clearer path through technology.',
    aboutCopy: 'VAKSHARA is an independent learning initiative for programming, data and emerging technology. VAKSHARA Learn brings subjects into clear learning paths with step-by-step explanations, visual examples and topic-wise checks. VAKSHARA Labs is a separate space for deeper practice and projects, and will open when it is ready.',
    noTopic: 'This topic could not be found.',
    labCopy: 'VAKSHARA Labs is being prepared as a separate space for deeper coding practice, debugging challenges and guided projects. Short concept quizzes stay in VAKSHARA Learn; extended practice belongs in Labs.',
    sourceHint: 'Read each example carefully and follow the output step by step.',
    topicReady: 'TOPIC GUIDE', topicCount: 'TOPIC FOLDERS',
    noResults: 'No topics match your search.'
  };
  // Interface copy stays English in both modes. Only lesson explanations and quiz content switch language.
  function text(key) { return labels[key] || key; }
  function esc(value) { return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function safeSource(markup) {
    return String(markup || '')
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
      .replace(/\son\w+\s*=\s*(["']).*?\1/gi, '')
      .replace(/javascript:/gi, '');
  }
  function courseFor(id) { return courses.find(c => c.id === id); }
  function topicFor(id) { return topics.find(t => t.id === id); }
  function topicsFor(courseId) { return topics.filter(t => t.course === courseId); }
  function done(id) { return !!state.progress[id]?.done; }
  function score(id) { return state.progress[id]?.bestScore ?? null; }
  function completeCount() { return topics.filter(t => done(t.id)).length; }
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2300);
  }
  function setTheme(theme) {
    state.theme = theme;
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(STORE.theme, theme); } catch {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#171a16' : '#f8f3e9';
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.innerHTML = ico(theme === 'light' ? 'moon' : 'sun');
      btn.title = theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
    }
  }
  function setLanguage(lang) {
    const changed = state.lang !== lang;
    const quizInProgress = Object.keys(state.quizAnswers).length > 0 || state.quizChecked;
    state.lang = lang;
    state.selectedLang = lang;
    if (changed && state.page === 'lesson' && quizInProgress) {
      state.quizAnswers = {};
      state.quizChecked = false;
      state.lastQuizScore = null;
    }
    try { localStorage.setItem(STORE.language, lang); } catch {}
    const label = document.getElementById('languageLabel');
    if (label) label.textContent = lang === 'hi' ? 'HI' : 'EN';
    render();
    if (changed && state.page === 'lesson' && quizInProgress) {
      showToast('Language changed. Start the topic quiz again.');
    }
  }
  function navigate(page, extra = {}) {
    state.page = page;
    Object.assign(state, extra);
    state.quizAnswers = {};
    state.quizChecked = false;
    state.lastQuizScore = null;
    render();
    document.getElementById('app')?.focus({preventScroll:true});
    window.scrollTo({top:0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  }

  function courseArt(id) {
    const common = 'stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
    const arts = {
      python: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M31 7c-11 0-13 5-13 12v8h21v4H14c-7 0-10 5-10 13s4 12 12 12h7v-9c0-7 5-12 12-12h11c6 0 9-5 9-11V19C55 10 49 7 40 7z" fill="#3975a7"/><path d="M33 57c11 0 13-5 13-12v-8H25v-4h25c7 0 10-5 10-13S56 8 48 8h-7v9c0 7-5 12-12 12H18c-6 0-9 5-9 11v5c0 9 5 12 14 12z" fill="#edc64a"/><circle cx="25" cy="16" r="2" fill="#fff"/><circle cx="39" cy="48" r="2" fill="#fff"/></svg>`,
      numpy: `<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="#866bb7" stroke-width="2.4"><path d="M12 18 32 7l20 11v28L32 57 12 46z"/><path d="M12 18l20 11 20-11M32 29v28M22 12l20 11"/></g><text x="32" y="39" fill="#6e5896" font-family="DM Mono,monospace" font-size="16" text-anchor="middle" font-weight="700">N</text></svg>`,
      pandas: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="9" width="44" height="46" rx="8" fill="none" stroke="#4f8e6b" stroke-width="2.5"/><path d="M10 23h44M25 23v32M40 23v32M10 38h44" stroke="#4f8e6b" stroke-width="2"/><path d="M14 14h6M29 14h6M44 14h6" stroke="#4f8e6b" stroke-width="2.4" stroke-linecap="round"/></svg>`,
      sql: `<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="14" rx="21" ry="8" fill="#7d9bb0"/><path d="M11 14v34c0 5 9 9 21 9s21-4 21-9V14M11 30c0 5 9 9 21 9s21-4 21-9M11 42c0 5 9 9 21 9s21-4 21-9" fill="none" stroke="#547b97" stroke-width="2.4"/><text x="32" y="31" text-anchor="middle" fill="#294e68" font-family="DM Mono,monospace" font-size="10" font-weight="700">SQL</text></svg>`,
      seaborn: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M7 46c9-22 15-22 22 0s14 22 28-16" fill="none" stroke="#d8755d" stroke-width="3.3" stroke-linecap="round"/><path d="M7 54h50M9 11v43" stroke="#d8755d" stroke-width="1.7" opacity=".65"/><circle cx="29" cy="46" r="3" fill="#d8755d"/><circle cx="57" cy="30" r="3" fill="#d8755d"/></svg>`,
      matplotlib: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M9 54h47M11 54V10" fill="none" stroke="#b8894e" stroke-width="2.4"/><rect x="17" y="34" width="7" height="20" rx="2" fill="#d9a86a"/><rect x="29" y="23" width="7" height="31" rx="2" fill="#8aa68b"/><rect x="41" y="13" width="7" height="41" rx="2" fill="#d8755d"/></svg>`,
      statistics: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 19h36M14 45h36M20 19c0 12 24 12 24 26M44 19c0 12-24 12-24 26" fill="none" stroke="#927caf" stroke-width="2.4" stroke-linecap="round"/><text x="32" y="39" text-anchor="middle" fill="#80699f" font-family="Georgia,serif" font-size="21">μ</text></svg>`,
      ml: `<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="#67957a" stroke-width="2.2"><path d="M14 17 32 31 50 16M14 17 15 48 32 31 49 48M15 48l34 0M32 31v17"/></g><g fill="#67957a"><circle cx="14" cy="17" r="5"/><circle cx="50" cy="16" r="5"/><circle cx="32" cy="31" r="6"/><circle cx="15" cy="48" r="5"/><circle cx="49" cy="48" r="5"/></g></svg>`,
      dl: `<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="#6e8ea9" stroke-width="2"><path d="M12 18 29 32 12 47M29 32l22-15M29 32l22 15"/></g><g fill="#6e8ea9"><circle cx="12" cy="18" r="5"/><circle cx="12" cy="47" r="5"/><circle cx="29" cy="32" r="6"/><circle cx="51" cy="17" r="5"/><circle cx="51" cy="47" r="5"/></g></svg>`,
      genai: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 5 37 25 57 32 37 37 32 58 26 37 7 32 26 25z" fill="#d8755d"/><path d="m51 5 2 8 8 2-8 2-2 8-2-8-8-2 8-2z" fill="#b98b5d"/></svg>`
    };
    return arts[id] || `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="23" fill="none" stroke="var(--gold)" stroke-width="2"/><path d="M18 32h28M32 18v28" stroke="var(--gold)" stroke-width="2"/></svg>`;
  }
  const topicVisualSpecs = {"00-what-is-programming-and-python":["pipeline",["PROBLEM","PYTHON","RESULT"],"PROBLEM → INSTRUCTIONS → OUTPUT"],"01-run-python-and-use-colab":["pipeline",["WRITE CELL","RUN ▶","OUTPUT"],"WRITE → EXECUTE → SEE RESULT"],"02-first-program-print-comments-indentation":["branch",["name == Asha?","TRUE · print","FALSE · skip"],"READ → CHECK → DISPLAY"],"03-variables-assignment-and-names":["pipeline",["score","= 85","NAME → VALUE"],"A NAME REFERS TO A VALUE"],"01-data-types":["pipeline",["25","int","Whole number"],"VALUE → TYPE → MEANING"],"02-input-and-type-casting":["pipeline",["input()","\"25\"","int() → 25"],"TEXT → CONVERSION → NUMBER"],"03-concatenation-and-first-calculation":["pipeline",["\"Hi\"","+","\"HiHi\""],"TEXT JOINS · NUMBERS ADD"],"04-python-operators":["pipeline",["10, 3","//","3"],"OPERANDS → OPERATOR → RESULT"],"05-binary-and-bitwise":["compare",["0101 · 5","0011 · 3","AND","0001"],"BITWISE AND COMPARES EACH BIT"],"06-identity-complex-and-print":["pipeline",["3 + 4j","print()","(3+4j)"],"VALUE → BUILT-IN → DISPLAY"],"01-conditions-and-if-family":["branch",["score >= 40","TRUE · if","FALSE · else"],"CONDITION CONTROLS THE PATH"],"02-logical-and-nested-conditions":["pipeline",["A is True","AND","B is True"],"BOTH CONDITIONS MUST PASS"],"03-truthy-falsy-and-mistakes":["compare",["[] · Falsy","[1] · Truthy","bool()","True / False"],"EMPTY CONTAINERS ARE FALSY"],"01-loop-basics-for-range-while":["loop",["REPEAT","1","2","3","4"],"FOR · RANGE · WHILE"],"02-tracing-counters-accumulators":["pipeline",["count = 0","count += 1","count = 3"],"START → UPDATE → FINAL VALUE"],"03-break-continue-loop-else":["branch",["new item?","continue","break"],"SKIP ONE · OR STOP THE LOOP"],"04-nested-loops-and-number-digits":["matrix",["OUTER LOOP","INNER LOOP","ROW × COLUMN"],"NESTED ITERATION"],"05-loop-mistakes-and-input-controlled-loops":["branch",["choice != exit","Repeat","Stop"],"UPDATE STATE SO THE LOOP CAN END"],"01-string-basics-indexing-slicing":["array",["P","y","t","h","o","n"],"INDEX 3 → h · STOP EXCLUDED"],"02-string-methods-case-concatenation-escapes":["pipeline",["\"hello\"","upper()","\"HELLO\""],"METHOD RETURNS TRANSFORMED TEXT"],"03-strip-and-replace":["pipeline",["\"  hi  \"","strip()","\"hi\""],"TRIM SPACE · REPLACE TEXT"],"04-search-and-validate-strings":["branch",["\"py\" in text","Found","Not found"],"SEARCH BEFORE USING A VALUE"],"05-split-and-join":["pipeline",["\"a,b,c\"","split(\",\")","[a, b, c]"],"TEXT → LIST → TEXT"],"06-format-builtins-loop-processing":["pipeline",["name, score","f-string","\"Asha: 9\""],"VALUES → FORMAT → MESSAGE"],"01-create-index-and-update-lists":["array",["10","20","30","40","50"],"ORDERED · INDEXED · MUTABLE"],"02-add-and-remove-list-items":["pipeline",["[1, 2]","append(3)","[1, 2, 3]"],"ADD · INSERT · REMOVE"],"03-list-functions-membership-and-loops":["pipeline",["[2, 4, 6]","in / len()","3 items"],"CHECK · COUNT · ITERATE"],"04-list-slicing":["array",["A","B","C","D","E"],"[START : STOP] · STOP EXCLUDED"],"05-list-aliasing-and-copying":["compare",["a = items","Same object","b = copy()","New list"],"ALIAS ≠ INDEPENDENT COPY"],"06-list-sorting-and-reversing":["array",["4","1","3","2","5"],"SORTED → 1 · 2 · 3 · 4 · 5"],"07-list-comprehensions":["pipeline",["[1, 2, 3]","x * x","[1, 4, 9]"],"ITERATE → EXPRESSION → NEW LIST"],"08-nested-lists-and-input-conversion":["matrix",["row","column","grid[row][col]"],"ROW INDEX + COLUMN INDEX"],"09-list-common-mistakes":["branch",["index in range?","Safe access","IndexError"],"CHECK THE POSITION FIRST"],"01-tuple-create-and-access":["array",["red","blue","green","gold"],"ORDERED · INDEXED"],"02-tuple-immutability-operations-methods":["compare",["tuple","Immutable","list","Mutable"],"CHOOSE STRUCTURE BY PURPOSE"],"03-packing-unpacking-and-conversion":["pipeline",["(\"Asha\", 19)","name, age","Asha · 19"],"PACK → UNPACK → VARIABLES"],"04-set-basics-and-sequence-differences":["venn",["A","B","Unique"],"A SET KEEPS DISTINCT VALUES"],"05-set-add-remove-methods":["pipeline",["{1, 2}","add(3)","{1, 2, 3}"],"ADD · DISCARD · REMOVE"],"06-set-operations-and-relationships":["venn",["A","B","A ∩ B"],"UNION · INTERSECTION · DIFFERENCE"],"07-frozenset-comprehensions-and-comparison":["compare",["set","Mutable","frozenset","Immutable"],"IMMUTABLE SET COLLECTION"],"01-modules-and-import-styles":["pipeline",["import math","math.sqrt()","5.0"],"IMPORT → ACCESS → REUSE"],"02-own-modules-and-main-guard":["branch",["__name__ == '__main__'","Run main()","Import only"],"SCRIPT MODE VS IMPORT MODE"],"03-math-roots-powers-rounding":["pipeline",["25","sqrt()","5.0"],"INPUT → MATH FUNCTION → RESULT"],"04-math-number-theory-logs-trig-distance":["pipeline",["numbers","gcd / log","answer"],"NUMBER THEORY · LOGS · TRIG"],"05-math-common-mistakes":["compare",["round(2.5)","2","round(3.5)","4"],"ROUNDING USES HALF-TO-EVEN FOR TIES"],"06-random-numbers-choices-and-seed":["loop",["random","randint","choice","sample"],"SEED MAKES A SEQUENCE REPEATABLE"],"07-random-common-mistakes":["compare",["seed(7)","Repeatable","No fixed seed","Varies"],"RANDOM DOES NOT MEAN UNREPEATABLE"],"08-local-global-and-return-values":["nested",["GLOBAL SCOPE","FUNCTION","LOCAL + RETURN"],"FUNCTION CALLS CREATE LOCAL SCOPE"],"09-nonlocal-and-scope-mistakes":["nested",["ENCLOSING SCOPE","INNER FUNCTION","nonlocal name"],"NONLOCAL REACHES ENCLOSING SCOPE"]};
  function topicVisual(topic) {
    const spec = topicVisualSpecs[topic.id] || ['pipeline',['INPUT','PROCESS','RESULT'],'UNDERSTAND → APPLY → CHECK'];
    const [kind, labels, caption] = spec;
    const title = esc(topic.title);
    const palette = ['var(--gold-soft)','var(--sage-soft)','var(--coral-soft)','var(--lav-soft)'];
    const head = `<text x="160" y="18" text-anchor="middle" fill="var(--muted)" font-size="8" font-family="DM Mono" letter-spacing="1">${title.toUpperCase()}</text>`;
    let body = '';
    if (kind === 'branch') {
      body = `<g class="visual-node" style="--node-order:0"><path d="M160 34 216 72 160 108 104 72Z" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2"/><text x="160" y="75" text-anchor="middle" fill="var(--ink)" font-size="${labels[0].length>16?7:8.5}" font-family="DM Mono">${esc(labels[0])}</text></g><path d="M119 84 77 116M201 84 243 116" fill="none" stroke="var(--line)" stroke-width="2" stroke-linecap="round"/><g class="visual-node" style="--node-order:1"><rect x="22" y="115" width="110" height="34" rx="10" fill="var(--sage-soft)" stroke="var(--sage)"/><text x="77" y="136" text-anchor="middle" font-size="8.5" fill="var(--ink)" font-family="DM Mono">${esc(labels[1])}</text></g><g class="visual-node" style="--node-order:2"><rect x="188" y="115" width="110" height="34" rx="10" fill="var(--coral-soft)" stroke="var(--coral)"/><text x="243" y="136" text-anchor="middle" font-size="8.5" fill="var(--ink)" font-family="DM Mono">${esc(labels[2])}</text></g>`;
    } else if (kind === 'array') {
      const cells = labels;
      const w = Math.min(43, 278 / cells.length);
      const gap = 5;
      const total = cells.length*w + (cells.length-1)*gap;
      const left = (320-total)/2;
      body = cells.map((value,i)=>{const x=left+i*(w+gap);const focus=i===Math.floor(cells.length/2);return `<g class="visual-node" style="--node-order:${i}"><rect x="${x}" y="63" width="${w}" height="48" rx="9" fill="${focus?'var(--coral-soft)':'var(--surface)'}" stroke="${focus?'var(--coral)':'var(--line)'}"/><text x="${x+w/2}" y="92" text-anchor="middle" fill="var(--ink)" font-size="${value.length>5?7:10}" font-family="DM Mono">${esc(value)}</text><text x="${x+w/2}" y="130" text-anchor="middle" fill="var(--muted)" font-size="8" font-family="DM Mono">${i}</text></g>`;}).join('');
    } else if (kind === 'compare') {
      body = `<g class="visual-node" style="--node-order:0"><rect x="15" y="49" width="137" height="72" rx="13" fill="var(--sage-soft)" stroke="var(--sage)"/><text x="83" y="78" text-anchor="middle" fill="var(--ink)" font-size="${labels[0].length>12?7.5:9}" font-family="DM Mono">${esc(labels[0])}</text><text x="83" y="99" text-anchor="middle" fill="var(--muted)" font-size="8.5" font-family="DM Mono">${esc(labels[1])}</text></g><g class="visual-node" style="--node-order:1"><rect x="168" y="49" width="137" height="72" rx="13" fill="var(--coral-soft)" stroke="var(--coral)"/><text x="236" y="78" text-anchor="middle" fill="var(--ink)" font-size="${labels[2].length>12?7.5:9}" font-family="DM Mono">${esc(labels[2])}</text><text x="236" y="99" text-anchor="middle" fill="var(--muted)" font-size="8.5" font-family="DM Mono">${esc(labels[3])}</text></g>`;
    } else if (kind === 'venn') {
      body = `<g class="visual-node" style="--node-order:0"><circle cx="128" cy="91" r="47" fill="var(--sage-soft)" stroke="var(--sage)" stroke-width="2"/><circle cx="192" cy="91" r="47" fill="var(--lav-soft)" stroke="var(--lav)" stroke-width="2"/><text x="108" y="95" text-anchor="middle" fill="var(--ink)" font-size="11" font-family="DM Mono">${esc(labels[0])}</text><text x="212" y="95" text-anchor="middle" fill="var(--ink)" font-size="11" font-family="DM Mono">${esc(labels[1])}</text><text x="160" y="95" text-anchor="middle" fill="var(--ink)" font-size="7.5" font-family="DM Mono">${esc(labels[2])}</text></g>`;
    } else if (kind === 'loop') {
      body = `<g class="visual-node" style="--node-order:0"><circle cx="160" cy="88" r="47" fill="none" stroke="var(--sage)" stroke-width="3" stroke-dasharray="7 6"/><path d="M190 54l17 2-5 16" fill="none" stroke="var(--sage)" stroke-width="3" stroke-linecap="round"/><circle cx="160" cy="88" r="29" fill="var(--sage-soft)" stroke="var(--sage)"/><text x="160" y="92" text-anchor="middle" fill="var(--ink)" font-size="9" font-family="DM Mono">${esc(labels[0])}</text></g>${labels.slice(1).map((x,i)=>`<g class="visual-node" style="--node-order:${i+1}"><rect x="${27+i*67}" y="143" width="52" height="18" rx="8" fill="${palette[i%palette.length]}" stroke="var(--line)"/><text x="${53+i*67}" y="155" text-anchor="middle" fill="var(--ink)" font-size="7.5" font-family="DM Mono">${esc(x)}</text></g>`).join('')}`;
    } else if (kind === 'matrix') {
      const cells=[];for(let r=0;r<3;r++)for(let c=0;c<4;c++){const x=91+c*36,y=48+r*30;cells.push(`<rect class="visual-node" style="--node-order:${r*4+c}" x="${x}" y="${y}" width="29" height="23" rx="6" fill="${(r+c)%2? 'var(--sage-soft)':'var(--gold-soft)'}" stroke="var(--line)"/>`);}
      body = `<g>${cells.join('')}</g><text x="160" y="155" text-anchor="middle" fill="var(--ink)" font-size="9" font-family="DM Mono">${esc(labels.join(' · '))}</text>`;
    } else if (kind === 'nested') {
      body = `<g class="visual-node" style="--node-order:0"><rect x="39" y="37" width="242" height="104" rx="15" fill="var(--gold-soft)" stroke="var(--gold)"/><text x="160" y="58" text-anchor="middle" fill="var(--ink)" font-size="8.5" font-family="DM Mono">${esc(labels[0])}</text><rect x="78" y="73" width="164" height="51" rx="11" fill="var(--sage-soft)" stroke="var(--sage)"/><text x="160" y="92" text-anchor="middle" fill="var(--ink)" font-size="8.5" font-family="DM Mono">${esc(labels[1])}</text><text x="160" y="109" text-anchor="middle" fill="var(--muted)" font-size="8" font-family="DM Mono">${esc(labels[2])}</text></g>`;
    } else {
      body = labels.slice(0,3).map((value,i)=>{const x=15+i*105;return `<g class="visual-node" style="--node-order:${i}"><rect x="${x}" y="57" width="84" height="62" rx="13" fill="${palette[i]}" stroke="var(--line)"/><text x="${x+42}" y="84" text-anchor="middle" fill="var(--ink)" font-size="${value.length>11?7.5:9}" font-family="DM Mono">${esc(value)}</text><text x="${x+42}" y="101" text-anchor="middle" fill="var(--muted)" font-size="7.5" font-family="DM Mono">${['GIVEN','ACTION','OUTPUT'][i]}</text></g>`;}).join('') + `<path d="M99 88h18m-6-6 6 6-6 6M204 88h18m-6-6 6 6-6 6" fill="none" stroke="var(--line)" stroke-width="2" stroke-linecap="round"/>`;
    }
    return `<svg class="topic-visual" viewBox="0 0 320 180" role="img" aria-label="${title} visual">${head}${body}<text x="160" y="174" text-anchor="middle" fill="var(--gold)" font-size="7.5" font-family="DM Mono" letter-spacing="1">${esc(caption)}</text></svg>`;
  }

  function topicCard(topic) {
    const isDone = done(topic.id);
    const best = score(topic.id);
    return `<button class="topic-card" type="button" data-topic="${esc(topic.id)}"><span class="folder-icon">${ico('folder')}</span><span class="topic-card-copy"><strong>${esc(topic.title)}</strong><small>${topic.sections.length} lesson part${topic.sections.length===1?'':'s'}${best!==null?` · BEST ${best}%`:''}</small><span class="topic-card-meta">${isDone?'<i class="done-dot"></i> LEARNED':'OPEN TOPIC'} <span>${ico('arrow','icon')}</span></span></span></button>`;
  }
  function courseCard(course) {
    const active = course.id === 'python';
    const desc = state.lang === 'hi' ? course.descHi : course.descEn;
    return `<button class="course-card ${active?'':'locked'}" type="button" ${active?'data-course="python"':'data-course="locked"'} ${active?'':'aria-disabled="true"'}><span class="course-top"><span class="course-art ${esc(course.id)}">${courseArt(course.id)}</span><span class="course-status ${active?'available':'locked'}">${active?'AVAILABLE':`${ico('lock','icon')} UPCOMING`}</span></span><h3>${esc(course.title)}</h3><p>${esc(desc)}</p><span class="course-bottom">${active?'START LEARNING':'COMING SOON'} <span class="course-arrow">${active?'↗':'⌑'}</span></span></button>`;
  }

  function catalogCourses() {
    return [
      {id:'python', title:'Python', descEn:'Build programming foundations, problem-solving logic and confidence with code.', descHi:'Programming ke foundations, problem-solving logic aur code ke saath confidence build karein.'},
      {id:'numpy', title:'NumPy', descEn:'Work with arrays, numerical operations and efficient computation.', descHi:'Arrays, numerical operations aur efficient computation seekhein.'},
      {id:'pandas', title:'Pandas', descEn:'Explore, clean and analyse structured data with confidence.', descHi:'Structured data ko explore, clean aur analyse karna seekhein.'},
      {id:'sql', title:'SQL', descEn:'Understand databases and ask useful questions of your data.', descHi:'Databases samjhein aur apne data se useful questions poochhein.'},
      {id:'seaborn', title:'Seaborn', descEn:'Turn data into clear statistical visualisations.', descHi:'Data ko clear statistical visuals mein badlein.'},
      {id:'matplotlib', title:'Matplotlib', descEn:'Build charts that reveal patterns and tell a clear story.', descHi:'Aise charts banayein jo patterns aur insights dikhayein.'},
      {id:'statistics', title:'Statistics', descEn:'Understand patterns, variation, probability and evidence.', descHi:'Patterns, variation, probability aur evidence ko samjhein.'},
      {id:'ml', title:'Machine Learning', descEn:'Learn how models find patterns and make predictions.', descHi:'Models patterns kaise find karte hain aur predictions kaise banate hain.'},
      {id:'dl', title:'Deep Learning', descEn:'Explore neural networks and how machines learn representations.', descHi:'Neural networks aur machine learning representations ko explore karein.'},
      {id:'genai', title:'Generative AI', descEn:'Understand systems that create text, images and other content.', descHi:'Text, images aur doosra content create karne wale systems samjhein.'}
    ];
  }

  function homePage() {
    const homeCourses = catalogCourses();
    return `<div class="page-enter home-page">
      <section class="hero"><div class="hero-grain" aria-hidden="true"></div><div class="shell hero-grid">
        <div class="hero-content">
          <span class="hero-kicker">AN INDEPENDENT LEARNING INITIATIVE</span>
          <h1>Knowledge that<br><em>moves you forward.</em></h1>
          <p class="hero-copy">VAKSHARA brings programming, data and emerging technology into one organised learning experience. Explore structured lessons, visual explanations, worked examples and topic-wise quizzes — all in one place.</p>
          <div class="hero-subline">Learn in English or Hinglish · Move at your own pace</div>
          <div class="hero-actions"><button class="btn btn-primary" type="button" data-action="subjects">Explore learning paths ${ico('arrow')}</button><button class="btn btn-secondary" type="button" data-action="tracker">Plan your learning ${ico('calendar')}</button></div>
          <div class="hero-highlights"><span>${ico('book')} Structured lessons</span><span>${ico('eye')} Visual explanations</span><span>${ico('brain')} Topic-wise quizzes</span></div>
        </div>
        <div class="hero-art" aria-label="VAKSHARA learning subjects">
          <div class="hero-art-glow"></div><div class="hero-orbit hero-orbit-one"></div><div class="hero-orbit hero-orbit-two"></div>
          <div class="hero-brand-card"><picture><source srcset="./assets/vakshara-logo.webp" type="image/webp"><img src="./assets/vakshara-logo-original.png" alt="Original VAKSHARA Ganesha emblem, wordmark and tagline"></picture></div>
          <div class="hero-chip hero-chip-python"><span>${courseArt('python')}</span><b>Python</b><small>Start here</small></div>
          <div class="hero-chip hero-chip-sql"><span>${courseArt('sql')}</span><b>SQL</b><small>Databases</small></div>
          <div class="hero-chip hero-chip-data"><span>${courseArt('pandas')}</span><b>Data</b><small>Explore</small></div>
          <div class="hero-chip hero-chip-ai"><span>${courseArt('genai')}</span><b>AI</b><small>Discover</small></div>
          <div class="hero-note"><span class="hero-note-dot"></span><span><small>THE VAKSHARA APPROACH</small><strong>One clear step at a time.</strong></span></div>
        </div>
      </div></section>
      <section class="section method-section"><div class="shell"><div class="section-head"><div><div class="section-kicker">THE VAKSHARA LEARNING METHOD</div><h2>From first idea<br>to real understanding.</h2></div><p>Each topic is designed to take you from a clear explanation to a visual mental model, a worked example and a quick check of what you understood.</p></div><div class="method-grid">
        <article class="method-card"><span class="method-index">01 · UNDERSTAND</span><span class="method-icon">${ico('book')}</span><h3>Start from zero</h3><p>Understand why a concept exists before learning its syntax and rules.</p><span class="method-watermark">01</span></article>
        <article class="method-card"><span class="method-index">02 · VISUALISE</span><span class="method-icon">${ico('eye')}</span><h3>See the logic</h3><p>Use diagrams, flowcharts, visual traces and examples to make ideas clear.</p><span class="method-watermark">02</span></article>
        <article class="method-card"><span class="method-index">03 · APPLY</span><span class="method-icon">${ico('code')}</span><h3>Follow an example</h3><p>Study readable code, expected output, important rules and common mistakes.</p><span class="method-watermark">03</span></article>
        <article class="method-card"><span class="method-index">04 · RECALL</span><span class="method-icon">${ico('brain')}</span><h3>Check understanding</h3><p>Answer short topic quizzes, see explanations and try again when needed.</p><span class="method-watermark">04</span></article>
      </div></div></section>
      <section class="section course-section" id="subjects"><div class="shell"><div class="section-head"><div><div class="section-kicker">EXPLORE SUBJECTS</div><h2>What would you like to learn?</h2></div><p>Choose what you want to learn. Python is available now; the other subjects are shown as upcoming and will open when their lessons are ready.</p></div><div class="course-grid">${homeCourses.map(courseCard).join('')}</div></div></section>
      <section class="section pillars-section"><div class="shell"><div class="section-head"><div><div class="section-kicker">TWO CONNECTED EXPERIENCES</div><h2>Learn the idea.<br>Practise it deeply.</h2></div><p>VAKSHARA has two connected products: one for structured teaching and one for deeper practice. Learn is active; Labs is being prepared.</p></div><div class="pillars-grid">
        <article class="pillar-card learn"><div class="pillar-top"><span class="pillar-symbol">${ico('book')}</span><span class="pill">ACTIVE PRODUCT</span></div><svg class="pillar-art" viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="61" fill="none" stroke="currentColor"/><path d="M43 55c20-9 34-5 37 4 3-9 17-13 37-4v57c-20-8-34-4-37 5-3-9-17-13-37-5zM80 59v58M51 70c9-3 17-3 23 0M87 70c9-3 17-3 23 0" fill="none" stroke="currentColor" stroke-width="2"/></svg><div class="pillar-copy"><h3>VAKSHARA Learn</h3><p>Structured subject paths, topic folders, beginner-friendly explanations, visual guides, worked examples and topic-wise concept quizzes.</p><button class="pillar-link" type="button" data-action="subjects">Explore Learn ${ico('arrow')}</button></div></article>
        <article class="pillar-card labs"><div class="pillar-top"><span class="pillar-symbol">${ico('flask')}</span><span class="pill muted">LOCKED FOR NOW</span></div><svg class="pillar-art" viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="60" fill="none" stroke="currentColor" opacity=".35"/><path d="M62 37h36M69 37v37L43 121c-5 9 1 17 11 17h52c10 0 16-8 11-17L91 74V37" fill="none" stroke="currentColor" stroke-width="2.5" opacity=".6"/><path d="M57 106h46l13 15c4 7 0 12-8 12H52c-8 0-12-5-8-12z" fill="var(--coral)" opacity=".35"/></svg><div class="pillar-copy"><h3>VAKSHARA Labs</h3><p>A separate practice space for deeper coding exercises, debugging challenges, guided builds and practical projects. It will open when the experience is ready.</p><button class="pillar-link" type="button" data-action="labs">View Labs status ${ico('lock')}</button></div></article>
      </div></div></section>
      <section class="section tracker-section-home"><div class="shell tracker-callout"><div class="tracker-callout-copy"><div class="section-kicker">YOUR DAILY LEARNING COMPANION</div><h2>Make your own momentum.</h2><p>Plan your study day, write down small tasks and tick them off as you finish. Your progress stays organised in one simple personal space.</p><button class="btn btn-primary" type="button" data-action="tracker">Open Self Tracker ${ico('arrow')}</button><div class="tracker-mini-stats"><span><strong>01</strong> Add a task</span><span><strong>02</strong> Tick it off</span><span><strong>03</strong> See progress</span></div></div><div class="tracker-mini"><div class="tracker-mini-head"><span class="section-kicker">A SAMPLE STUDY DAY</span><span class="tracker-mini-date">TODAY</span></div><div class="mini-row done"><span class="mini-check done">✓</span><span>Revise yesterday's lesson</span><small>DONE</small></div><div class="mini-row done"><span class="mini-check done">✓</span><span>Complete one topic quiz</span><small>DONE</small></div><div class="mini-row"><span class="mini-check"></span><span>Review a confusing example</span><small>TO DO</small></div><div class="mini-progress"><span></span><b>2 OF 3 COMPLETED</b></div></div><div class="tracker-orbit" aria-hidden="true"></div></div></section>
    </div>`;
  }


  function subjectsPage() {
    const catalog = catalogCourses();
    return `<section class="page page-enter subjects-page"><div class="shell">
      <button class="back-link" type="button" data-action="home">${ico('back')} Back to home</button>
      <div class="subjects-hero"><div class="section-kicker">VAKSHARA LEARN</div><h1>What would you like to learn?</h1><p>Choose a subject to begin. Python is open now; more learning paths will be added as their lessons are prepared.</p><div class="subjects-hero-note"><span class="subjects-note-icon">${ico('sparkle')}</span><span><strong>Start with what interests you.</strong><small>Each subject will have its own organised learning path.</small></span></div></div>
      <div class="subjects-grid">${catalog.map(courseCard).join('')}</div>
      <div class="subjects-footnote">More subjects will appear here as they become ready.</div>
    </div></section>`;
  }

  function welcomePage() {
    return `<section class="page page-enter"><div class="shell"><button class="back-link" type="button" data-action="subjects">${ico('back')} Back to subjects</button><div class="welcome-panel"><div class="welcome-emblem"><picture><source srcset="./assets/vakshara-logo.webp" type="image/webp"><img src="./assets/vakshara-logo-original.png" alt="Original VAKSHARA Ganesha emblem and wordmark"></picture></div><div class="welcome-copy"><div class="section-kicker">VAKSHARA LEARN · PYTHON</div><h1>Welcome to the<br>Python Universe.</h1><p>${esc(text('welcomeCopy'))}</p><div class="section-kicker">${esc(text('chooseLanguage'))}</div><div class="language-cards"><button class="language-card ${state.selectedLang==='en'?'selected':''}" type="button" data-select-language="en"><strong>English</strong><span>Step-by-step explanations in English</span></button><button class="language-card ${state.selectedLang==='hi'?'selected':''}" type="button" data-select-language="hi"><strong>Hinglish</strong><span>Roman Hinglish explanations</span></button></div><button class="btn btn-primary" type="button" data-action="continue-python">${text('continue')} ${ico('arrow')}</button></div></div></div></section>`;
  }

  function pythonPage() {
    const count = completeCount();
    const percent = topics.length ? Math.round(count / topics.length * 100) : 0;
    const query = state.search.trim().toLowerCase();
    const filtered = topics.filter(t => !query || `${t.title} ${t.courseTitle}`.toLowerCase().includes(query));
    return `<section class="page page-enter"><div class="shell"><button class="back-link" type="button" data-action="subjects">${ico('back')} Back to subjects</button><div class="page-heading"><div><div class="section-kicker">VAKSHARA LEARN · PYTHON</div><h1>Your Python learning library.</h1><p>Choose a topic and learn it step by step. Each lesson includes a clear explanation, visual guide, worked examples, common mistakes and a topic quiz.</p><div class="lesson-tags"><span class="pill">${topics.length} lessons</span><span class="pill">English / Hinglish</span><span class="pill">Quizzes with feedback</span></div></div><div class="stat-chip">YOUR PROGRESS · <strong>${count}/${topics.length} COMPLETE</strong> · ${percent}%</div></div><div class="tracker-progress"><div class="tracker-progress-top"><span>COURSE PROGRESS</span><strong>${percent}%</strong></div><div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div></div><div class="search-box"><span>${ico('sparkle')}</span><input id="topicSearch" type="search" placeholder="Search Python topics…" value="${esc(state.search)}" aria-label="Search Python topics"><span class="search-count">${filtered.length} / ${topics.length} TOPICS</span></div><div class="library-intro">${ico('info')}<span>Go one topic at a time. Understand the idea, follow the examples, then check what you remember with a short quiz. Deeper coding challenges and projects will belong to VAKSHARA Labs.</span></div>${courses.map((c,idx)=>{const group=filtered.filter(t=>t.course===c.id);if(!group.length)return '';return `<section class="course-group"><div class="group-head"><span class="group-number">${String(idx+1).padStart(2,'0')}</span><div><h2>${esc(c.title)}</h2><p>${esc(state.lang==='hi'?c.descHi:c.descEn)}</p></div><span class="group-count">${group.length} TOPICS</span></div><div class="topic-grid">${group.map(topicCard).join('')}</div></section>`;}).join('')}${filtered.length?'':`<div class="empty-state">${text('noResults')}</div>`}<section class="next-stage-roadmap"><div class="section-kicker">THE PATH AHEAD</div><h2>From Python foundations to practical development.</h2><p>The uploaded lessons cover the foundations, decisions, loops, strings, collections, modules and scope. The next skills below are part of the longer learning path; their full lessons will be added separately before they are marked available.</p><div class="roadmap-chips">${['Functions in depth','Dictionaries','Error handling','File handling','Object-oriented programming','Packages & environments','Testing & debugging','APIs and JSON','SQL & databases','NumPy and Pandas','Data visualisation','Machine learning'].map(x=>`<span class="roadmap-chip"><span>⌑</span>${x}<small>UPCOMING</small></span>`).join('')}</div><p class="roadmap-honesty">Reading notes is one part of learning. Job readiness also needs regular coding practice, debugging, projects and feedback. Extended programming tasks will belong to VAKSHARA Labs.</p></section></div></section>`;
  }

  function topicCard(topic) {
    const isDone = done(topic.id);
    const best = score(topic.id);
    return `<button class="topic-card" type="button" data-topic="${esc(topic.id)}"><span class="folder-icon">${ico('folder')}</span><span class="topic-card-copy"><strong>${esc(topic.title)}</strong><small>${topic.sections.length} lesson part${topic.sections.length===1?'':'s'}${best!==null?` · BEST ${best}%`:''}</small><span class="topic-card-meta">${isDone?'<i class="done-dot"></i> LEARNED':'OPEN TOPIC'} <span>${ico('arrow')}</span></span></span></button>`;
  }


  function cleanLessonMarkup(markup) {
    const template = document.createElement('template');
    template.innerHTML = safeSource(markup);
    // Remove notebook question banks and long independent coding sets from Learn.
    // Short worked examples remain part of teaching; large assignments belong in VAKSHARA Labs.
    const headings = [...template.content.querySelectorAll('h1,h2,h3,h4')];
    const level = el => Number(el.tagName.slice(1));
    const isExerciseBank = text => {
      const s = text.trim().replace(/\s+/g, ' ');
      return /^(?:part\s+[a-z]\s*[—-].*(?:practice|question bank|independent)|practice questions?|independent practice|selected practice solutions|practice answer key|answer key|dry-run and debugging practice|practice: easy to hard|practice questions —|q\s*\d+[a-z]?\s*[—:.-]|question bank|solved programs?:)/i.test(s);
    };
    for (const heading of headings) {
      if (!template.content.contains(heading) || !isExerciseBank(heading.textContent || '')) continue;
      const cutoff = level(heading);
      let node = heading;
      while (node) {
        const next = node.nextSibling;
        if (node !== heading && node.nodeType === 1 && /^H[1-4]$/.test(node.tagName) && level(node) <= cutoff) break;
        node.remove();
        node = next;
      }
    }
    // Remove individual question blocks such as Q1/Q2 that sit among explanations.
    for (const heading of [...template.content.querySelectorAll('h1,h2,h3,h4')]) {
      if (!/^q\s*\d+[a-z]?\s*[—:.-]/i.test((heading.textContent || '').trim())) continue;
      let node = heading; const cutoff = level(heading);
      while (node) {
        const next = node.nextSibling;
        if (node !== heading && node.nodeType === 1 && /^H[1-4]$/.test(node.tagName) && level(node) <= cutoff) break;
        node.remove(); node = next;
      }
    }
    template.content.querySelectorAll('.source-section-heading').forEach(el => el.remove());
    template.content.querySelectorAll('.notebook-code-head').forEach(head => {
      const button = head.querySelector('button.copy-code');
      head.textContent = 'PYTHON EXAMPLE';
      if (button) { button.textContent = 'Copy code'; head.appendChild(button); }
    });
    template.content.querySelectorAll('p').forEach(p => {
      if (/^\s*(source note|original notebook|colab source)/i.test(p.textContent.trim())) p.remove();
    });
    return template.innerHTML;
  }

  function renderTeacherGuide(topic, hinglish) {
    const guide = teacherGuides[`${topic.course}/${topic.id}`];
    if (!guide) return '';
    const pick = (en, hi) => esc(hinglish ? (hi || en || '') : (en || hi || ''));
    const steps = hinglish ? (guide.stepsHi || []) : (guide.stepsEn || []);
    const stepMarkup = steps.map((step,i) => `<li><span class="teacher-step-number">${String(i+1).padStart(2,'0')}</span><p>${esc(step)}</p></li>`).join('');
    const code = esc(guide.code || '');
    const output = esc(guide.output || '');
    const deep = hinglish ? (guide.deepSectionsHi || []) : (guide.deepSectionsEn || []);
    const deepMarkup = deep.length ? `<div class="teacher-deep-sections">${deep.map((section,i)=>`<article class="teacher-deep-card"><div class="teacher-deep-index">${String(i+1).padStart(2,'0')}</div><div><h3>${esc(section.title || '')}</h3><p>${esc(section.body || '')}</p></div></article>`).join('')}</div>` : '';
    return `<section class="teacher-classroom">
      <div class="teacher-classroom-head"><span class="teacher-label">${hinglish?'VAKSHARA TEACHER WALKTHROUGH':'VAKSHARA TEACHER WALKTHROUGH'}</span><span class="teacher-level">${hinglish?'BILKUL BASIC SE':'START FROM ZERO'}</span></div>
      <h2>${pick(guide.titleEn,guide.titleHi)}</h2>
      <div class="teacher-first-idea"><span class="teacher-mini-label">${hinglish?'PEHLE SIMPLE IDEA':'FIRST, THE SIMPLE IDEA'}</span><p>${pick(guide.conceptEn,guide.conceptHi)}</p></div>
      <div class="teacher-why"><span class="teacher-mini-label">${hinglish?'YE KYUN SEEKH RAHE HAIN':'WHY THIS MATTERS'}</span><p>${pick(guide.whyEn,guide.whyHi)}</p></div>
      <div class="teacher-analogy"><span class="teacher-mini-label">${hinglish?'REAL-LIFE EXAMPLE':'EVERYDAY EXAMPLE'}</span><p>${pick(guide.analogyEn,guide.analogyHi)}</p></div>
      ${deepMarkup}
      <div class="teacher-code-grid">
        <div class="teacher-code-card"><div class="teacher-code-head"><span>${hinglish?'PYTHON CODE':'PYTHON EXAMPLE'}</span><button class="copy-code teacher-copy" type="button">${hinglish?'Copy code':'Copy code'}</button></div><pre><code>${code}</code></pre></div>
        <div class="teacher-output-card"><div class="teacher-code-head"><span>${hinglish?'EXPECTED OUTPUT':'EXPECTED OUTPUT'}</span></div><pre>${output}</pre></div>
      </div>
      <div class="teacher-trace"><h3>${hinglish?'Ab line-by-line samjho':'Now follow it step by step'}</h3><ol>${stepMarkup}</ol></div>
      <div class="teacher-warning"><strong>${hinglish?'Yahan beginner aksar confuse hote hain':'A common beginner confusion'}</strong><p>${pick(guide.mistakeEn,guide.mistakeHi)}</p></div>
      <div class="teacher-memory"><span>${hinglish?'YAAD RAKHNE WALI BAAT':'REMEMBER THIS'}</span><p>${pick(guide.memoryEn,guide.memoryHi)}</p></div>
    </section>`;
  }

  function renderLessonRoadmap(topic, hinglish, selectedNotes) {
    const source = selectedNotes || topic.notesHtml || '';
    const template = document.createElement('template');
    template.innerHTML = safeSource(source);
    const sections = [...template.content.querySelectorAll('.source-section')];
    const items = sections.map((section) => {
      const heading = section.querySelector('h2,h3');
      const paragraph = section.querySelector('p');
      const title = (heading?.textContent || '').trim();
      const summary = (paragraph?.textContent || '').trim();
      return { title, summary };
    }).filter(x => x.title).slice(0, 12);
    if (!items.length) {
      const guide = teacherGuides[`${topic.course}/${topic.id}`];
      const deep = hinglish ? (guide?.deepSectionsHi || []) : (guide?.deepSectionsEn || []);
      deep.forEach(x => items.push({title:x.title,summary:x.body}));
    }
    if (!items.length) return '';
    return `<section class="lesson-roadmap"><div class="section-kicker">${hinglish?'IS LESSON MEIN KYA SEEKHENGE':'YOUR LESSON ROADMAP'}</div><h2>${hinglish?'Hum is topic ko chhote steps mein samjhenge':'A clear path through this topic'}</h2><div class="lesson-roadmap-grid">${items.map((item,i)=>`<article class="lesson-roadmap-item"><span>${String(i+1).padStart(2,'0')}</span><div><h3>${esc(item.title)}</h3>${item.summary?`<p>${esc(item.summary.slice(0,190))}${item.summary.length>190?'…':''}</p>`:''}</div></article>`).join('')}</div></section>`;
  }

  function expandedQuiz(topic) {
    const quiz = [...(topic.quiz || [])];
    // All uploaded topics carry two notebook-grounded checks and three checks generated from their explicit key rules.
    // Keep at least five checks. Do not insert unrelated "how to study" questions.
    const keysEn = (topic.keyEn || []).filter(Boolean);
    const keysHi = (topic.keyHi || []).filter(Boolean);
    const distractorsEn = [
      'This rule applies only when the program prints a message.',
      'Python ignores this rule when a value is empty.',
      'The result is always the same no matter what input is used.'
    ];
    const distractorsHi = [
      'Ye rule sirf tab apply hota hai jab program message print kare.',
      'Value empty ho toh Python is rule ko ignore karta hai.',
      'Input kuchh bhi ho, result hamesha same hota hai.'
    ];
    const prompts = [
      [`Which statement is correct about ${topic.title.toLowerCase()}?`, `${topic.title} ke baare mein kaunsa statement sahi hai?`],
      ['Which additional rule should you remember?', 'Kaunsa additional rule yaad rakhna chahiye?'],
      ['Which point helps you avoid a common mistake?', 'Common mistake se bachne mein kaunsi baat help karti hai?']
    ];
    for (let i = 0; quiz.length < 5 && i < 3; i++) {
      const correct = keysEn[i] || topic.introEn;
      const correctHi = keysHi[i] || topic.introHi;
      const pos = (i + topic.id.length) % 4;
      const opts = [...distractorsEn]; opts.splice(pos, 0, correct);
      const optsHi = [...distractorsHi]; optsHi.splice(pos, 0, correctHi);
      quiz.push({
        prompt: prompts[i][0], promptHi: prompts[i][1], options: opts, optionsHi: optsHi, answer: pos,
        whyEn: `This rule is part of the lesson on ${topic.title}. Re-read the example and explain why this statement is true.`,
        whyHi: `Ye ${topic.title} lesson ka rule hai. Example dobara dekho aur apne words mein samjhao ki ye statement sahi kyun hai.`
      });
    }
    return quiz;
  }

  function lessonPage(topic) {
    const course = courseFor(topic.course);
    const group = topicsFor(topic.course);
    const pos = group.findIndex(t => t.id === topic.id);
    const previous = pos > 0 ? group[pos-1] : null;
    const next = pos < group.length-1 ? group[pos+1] : null;
    const hinglish = state.lang === 'hi';
    const intro = hinglish ? topic.introHi : topic.introEn;
    const keys = hinglish ? topic.keyHi : topic.keyEn;
    const isDone = done(topic.id);
    const best = score(topic.id);
    const docs = (topic.officialDocs || []).map(d=>`<a href="${esc(d[1])}" target="_blank" rel="noopener noreferrer">${esc(d[0])} ↗</a>`).join('');
    const quiz = expandedQuiz(topic);
    const selectedNotes = (hinglish && topic.notesHtmlHi) ? topic.notesHtmlHi : (topic.notesHtml || '');
    const lessonMarkup = cleanLessonMarkup(selectedNotes);
    const teacherMarkup = renderTeacherGuide(topic, hinglish);
    const roadmapMarkup = renderLessonRoadmap(topic, hinglish, selectedNotes);
    return `<section class="page page-enter"><div class="shell">
      <div class="lesson-navigation"><button class="back-link" type="button" data-action="python">${ico('back')} Back to Python topics</button><button class="text-link" type="button" data-action="subjects">All subjects</button></div>
      <div class="lesson-top"><div class="breadcrumbs"><button type="button" data-action="subjects">Subjects</button> / <button type="button" data-action="python">Python</button> / ${esc(course?.title || 'Python')}</div><span class="pill ${isDone?'':'muted'}">${isDone?'TOPIC LEARNED':'YOUR LESSON'}</span></div>
      <div class="lesson-hero"><div class="lesson-title-panel"><div class="section-kicker">${esc(course?.title || 'PYTHON').toUpperCase()} · TOPIC ${String(pos+1).padStart(2,'0')} OF ${group.length}</div><h1>${esc(topic.title)}</h1><p>${esc(intro)}</p><div class="lesson-tags"><span class="pill">${hinglish?'Hinglish explanation':'English explanation'}</span><span class="pill">${quiz.length}-question quiz</span>${best!==null?`<span class="pill">Best score ${best}%</span>`:''}</div></div><div class="lesson-visual-panel"><span class="visual-caption">SEE THE IDEA</span>${topicVisual(topic)}</div></div>
      <section class="lesson-start-panel"><div class="section-kicker">${hinglish?'BILKUL BASIC SE':'START FROM THE BASICS'}</div><h2>${hinglish?'Pehle concept ko samajhte hain':'First, understand the idea'}</h2><p>${esc(intro)}</p><div class="key-grid">${keys.map((k,i)=>`<article class="key-card"><span class="key-num">${hinglish?'YAAD RAKHEIN':'IMPORTANT IDEA'} ${String(i+1).padStart(2,'0')}</span><p>${esc(k)}</p></article>`).join('')}</div></section>
      ${teacherMarkup}
      ${roadmapMarkup}
      ${(hinglish && !topic.notesHtmlHi && topic.notesHtml)?'<p class="language-source-note">Teacher walkthrough aur quiz feedback Hinglish mein hain. Neeche ke extended reference examples is topic ke liye abhi English mein hain.</p>':''}
      <section class="lesson-content-section"><div class="lesson-content-heading"><div><div class="section-kicker">${hinglish?'DETAIL MEIN SAMJHEIN':'DETAILED EXPLANATIONS & WORKED EXAMPLES'}</div><h2>${hinglish?'Ab examples aur rules ko detail mein samjho':'Now study the examples and rules in detail'}</h2></div><p>${hinglish?'Pehle teacher walkthrough padho. Phir har heading ke neeche explanation, code aur output ko aaram se follow karo. Har code ko line-by-line trace karo.':'Start with the teacher walkthrough. Then follow each explanation, code example and output. Trace every example line by line before moving on.'}</p></div><div class="notebook-note lesson-notes">${lessonMarkup}</div></section>
      <section class="remember-panel"><div class="remember-icon">${ico('brain')}</div><div><div class="section-kicker">MAKE IT STICK</div><h2>${hinglish?'Khud ko samjha kar dekho':'Explain it in your own words'}</h2><p>${hinglish?'Book band karke teen cheezein yaad se bolo: concept kya hai, code kaise chalta hai, aur common mistake kya ho sakti hai.':'Without looking back, explain three things: what the concept means, how the code runs, and one mistake to avoid.'}</p></div></section>
      <div class="source-links"><span class="section-kicker">FURTHER READING · OFFICIAL PYTHON DOCUMENTATION</span>${docs}</div>
      <section class="quiz-panel" id="topicQuiz"><div class="quiz-head"><div><div class="section-kicker">RECALL & CHECK</div><h2>${text('quiz')}</h2><p>${text('quizCopy')}</p></div><span class="pill">${quiz.length} QUESTIONS</span></div><div class="quiz-body">${quiz.map((q,i)=>{const prompt=hinglish?(q.promptHi||q.prompt):q.prompt;const opts=hinglish?(q.optionsHi||q.options):q.options;return `<article class="quiz-question" data-question="${i}"><span class="quiz-q-meta">QUESTION ${String(i+1).padStart(2,'0')} / ${quiz.length}</span><h3>${esc(prompt)}</h3><div class="quiz-options">${opts.map((option,j)=>`<button class="quiz-option" type="button" data-choice="${i}" data-option="${j}"><span class="option-dot">${String.fromCharCode(65+j)}</span><span>${esc(option)}</span></button>`).join('')}</div><div class="quiz-feedback" id="feedback-${i}"></div></article>`;}).join('')}<div class="quiz-actions"><button class="btn btn-primary" type="button" id="checkQuiz">${text('checkAnswers')} ${ico('check')}</button><button class="btn btn-secondary btn-small" type="button" id="retryQuiz" hidden>${text('tryAgain')}</button><span class="notice-inline" id="quizNotice"></span></div></div><div class="quiz-result" id="quizResult"></div></section>
      <div class="lesson-bottom"><p>${isDone?'This topic is marked as learned. You can revisit it any time.':'Finish the quiz, read the explanations and mark this topic as learned. Your progress is saved in this browser.'}</p><div class="lesson-actions"><button class="btn btn-secondary btn-small" type="button" data-topic="${previous?previous.id:''}" ${previous?'':'disabled'}>${text('previous')}</button><button class="btn btn-primary btn-small" type="button" id="markComplete" ${isDone?'disabled':'disabled'}>${isDone?'Completed ✓':text('markLearned')}</button><button class="btn btn-secondary btn-small" type="button" data-topic="${next?next.id:''}" ${next?'':'disabled'}>${text('next')}</button></div></div>
    </div></section>`;
  }

  function trackerPage() {
    const dayTasks = state.tasks.filter(t => t.date === state.trackerDate);
    const completed = dayTasks.filter(t=>t.done).length;
    const percent = dayTasks.length ? Math.round(completed/dayTasks.length*100) : 0;
    const filtered = dayTasks.filter(t => state.trackerFilter==='all' || (state.trackerFilter==='done' ? t.done : !t.done));
    const dateTitle = state.trackerDate === today() ? 'Today\'s plan' : `Tasks for ${state.trackerDate}`;
    return `<section class="page page-enter"><div class="shell"><div class="tracker-hero"><div><div class="section-kicker">VAKSHARA · SELF TRACKER</div><h1>${text('selfTitle')}</h1><p>${text('selfCopy')}</p></div><span class="pill">PERSONAL STUDY SPACE</span></div><div class="tracker-card">
      <div class="tracker-toolbar"><div><label class="field-label" for="trackerDate">Choose a day</label><input class="date-field" id="trackerDate" type="date" value="${esc(state.trackerDate)}"></div><div class="stat-chip">${completed}/${dayTasks.length} TASKS DONE · ${percent}%</div></div>
      <form class="add-task-form" id="addTaskForm"><div><label class="field-label" for="taskInput">New task</label><input class="task-input" id="taskInput" maxlength="120" placeholder="${text('taskPlaceholder')}" autocomplete="off" required></div><div><label class="field-label" for="taskDue">Task date</label><input class="date-field" id="taskDue" type="date" value="${esc(state.trackerDate)}"></div><button class="btn btn-primary" type="submit">${text('addTask')} ${ico('plus')}</button></form>
      <div class="tracker-progress"><div class="tracker-progress-top"><span>${text('dailyProgress')}</span><strong>${percent}%</strong></div><div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div></div>
      <div class="tracker-date-summary"><h2>${esc(dateTitle)}</h2><span>${dayTasks.length} ${dayTasks.length===1?'TASK':'TASKS'}</span></div>
      <div class="tracker-filters">${[['all','All'],['open','To do'],['done','Completed']].map(([id,label])=>`<button class="filter-btn ${state.trackerFilter===id?'active':''}" type="button" data-tracker-filter="${id}">${label}</button>`).join('')}<button class="filter-btn" type="button" id="clearCompleted" style="margin-left:auto">Clear completed</button></div>
      <div class="task-list">${filtered.length?filtered.map(t=>`<div class="task-row"><button class="task-check ${t.done?'done':''}" type="button" data-task-toggle="${esc(t.id)}" aria-label="${t.done?'Mark incomplete':'Mark complete'}">${t.done?'✓':''}</button><span class="task-name ${t.done?'done':''}">${esc(t.text)}</span><span class="task-date-label">${t.date===today()?'TODAY':esc(t.date)}</span><button class="delete-task" type="button" data-task-delete="${esc(t.id)}" aria-label="Delete task">×</button></div>`).join(''):`<div class="empty-state">${dayTasks.length?text('noFilteredTasks'):text('noTasks')}</div>`}</div>
      <div class="tracker-note">${ico('info')}<span>${text('localOnly')}</span></div>
    </div></div></section>`;
  }

  function labsPage() {
    return `<section class="page page-enter"><div class="shell"><button class="back-link" type="button" data-action="home">${ico('back')} Back to home</button><div class="locked-panel"><span class="locked-symbol">${ico('lock')}</span><div class="section-kicker">VAKSHARA LABS</div><h1>Learn first.<br>Practise deeply next.</h1><p>${text('labCopy')}</p><span class="pill muted">LOCKED FOR NOW</span></div></div></section>`;
  }
  function aboutPage() {
    return `<section class="page page-enter"><div class="shell"><button class="back-link" type="button" data-action="home">${ico('back')} Back to home</button><div class="about-hero"><div><div class="section-kicker">ABOUT VAKSHARA</div><h1>${text('aboutTitle')}</h1><p>${text('aboutCopy')}</p></div><div class="about-logo"><picture><source srcset="./assets/vakshara-logo.webp" type="image/webp"><img src="./assets/vakshara-logo-original.png" alt="Original VAKSHARA Ganesha emblem and wordmark"></picture></div></div><div class="section-head"><div><div class="section-kicker">TWO CONNECTED PRODUCTS</div><h2>One learning journey.</h2></div><p>VAKSHARA Learn is the active learning product. VAKSHARA Labs is the future practice space and remains locked until it is ready.</p></div><div class="about-pillar-grid"><article class="about-pillar"><span class="pill">ACTIVE</span><h3>VAKSHARA Learn</h3><p>Structured learning paths, topic folders, explanations, visual guides, examples, concept quizzes and revision.</p></article><article class="about-pillar"><span class="pill muted">LOCKED</span><h3>VAKSHARA Labs</h3><p>Deeper coding practice, debugging challenges and guided projects. This experience will be developed separately.</p></article></div></div></section>`;
  }

  let revealObserver = null;
  function initScrollReveals() {
    if (revealObserver) revealObserver.disconnect();
    const targets = app.querySelectorAll('.method-card, .course-card, .pillar-card, .tracker-callout, .course-group, .topic-card, .key-card, .quiz-question, .tracker-card, .about-pillar');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    targets.forEach((el, index) => {
      el.classList.add('reveal-up');
      el.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
    });
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-visible'));
      return;
    }
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver?.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(el => revealObserver.observe(el));
  }

  function render() {
    let view = '';
    if (state.page === 'home') view = homePage();
    else if (state.page === 'subjects') view = subjectsPage();
    else if (state.page === 'welcome') view = welcomePage();
    else if (state.page === 'python') view = pythonPage();
    else if (state.page === 'lesson') {
      const topic = topicFor(state.activeTopic);
      view = topic ? lessonPage(topic) : `<section class="page"><div class="shell empty-state">${text('noTopic')}</div></section>`;
    }
    else if (state.page === 'tracker') view = trackerPage();
    else if (state.page === 'labs') view = labsPage();
    else if (state.page === 'about') view = aboutPage();
    app.innerHTML = view;
    updateNav();
    initScrollReveals();
    if (state.page === 'lesson') {
      const button = document.getElementById('markComplete');
      if (button) button.disabled = !state.quizChecked || done(state.activeTopic);
    }
    if (state.page === 'python') {
      const search = document.getElementById('topicSearch');
      search?.addEventListener('input', e => { state.search = e.target.value; const pos=e.target.selectionStart; const val=e.target.value; render(); const next=document.getElementById('topicSearch'); if(next){next.focus();next.setSelectionRange(pos,pos);} });
    }
    if (state.page === 'tracker') {
      const dateInput = document.getElementById('trackerDate');
      if (dateInput) dateInput.value = state.trackerDate;
    }
    window.scrollTo({top:0,behavior:'instant'});
  }
  function updateNav() {
    document.querySelectorAll('.desktop-nav [data-action]').forEach(btn => {
      const action = btn.dataset.action;
      const current = ['home','subjects','welcome','python','lesson'].includes(state.page) ? action==='home' : action===state.page;
      btn.classList.toggle('active',current);
    });
    const label = document.getElementById('languageLabel');
    if(label) label.textContent = state.lang==='hi'?'HI':'EN';
    const theme = document.getElementById('themeToggle');
    if(theme){theme.innerHTML=ico(state.theme==='light'?'moon':'sun');theme.title=state.theme==='light'?'Switch to dark theme':'Switch to light theme';}
  }

  function checkQuiz() {
    const topic = topicFor(state.activeTopic);
    if (!topic) return;
    const quiz = expandedQuiz(topic);
    const answered = Object.keys(state.quizAnswers).length;
    if (answered !== quiz.length) {
      const notice = document.getElementById('quizNotice');
      if (notice) notice.textContent = `Answer all ${quiz.length} questions first.`;
      return;
    }
    state.quizChecked = true;
    const correct = quiz.reduce((total,q,i)=>total+(state.quizAnswers[i]===q.answer?1:0),0);
    const pct = Math.round(correct/quiz.length*100);
    const record = state.progress[topic.id] || {};
    record.attempts=(record.attempts||0)+1;
    record.bestScore=Math.max(record.bestScore||0,pct);
    record.lastScore=pct;
    state.progress[topic.id]=record;
    write(STORE.progress,state.progress);
    quiz.forEach((q,i)=>{
      document.querySelectorAll(`[data-question="${i}"] .quiz-option`).forEach(btn=>{
        const option=Number(btn.dataset.option);
        if(option===q.answer) btn.classList.add('correct');
        if(option===state.quizAnswers[i] && option!==q.answer) btn.classList.add('wrong');
        btn.disabled=true;
      });
      const feedback=document.getElementById(`feedback-${i}`);
      if(feedback){feedback.textContent=state.lang==='hi'?(q.whyHi||q.whyEn):(q.whyEn||q.whyHi);feedback.classList.add('show');}
    });
    const result=document.getElementById('quizResult');
    if(result){
      const resultText = pct===100 ? (state.lang==='hi'?'Bahut badhiya! Saare answers sahi hain.':'Excellent! All answers are correct.') : pct>=50 ? (state.lang==='hi'?'Achha effort. Explanations padhkar ek baar phir try karein.':'Good effort. Read the explanations and try again.') : (state.lang==='hi'?'Explanations dhyan se padhein aur dobara try karein.':'Read the explanations carefully and try once more.');
      result.innerHTML=`<strong>${correct} / ${quiz.length} · ${pct}%</strong><p>${resultText}</p>`;
      result.classList.add('show');
    }
    document.getElementById('checkQuiz')?.setAttribute('disabled','true');
    document.getElementById('retryQuiz')?.removeAttribute('hidden');
    document.getElementById('quizNotice')?.replaceChildren();
    const mark=document.getElementById('markComplete');
    if(mark) mark.disabled=false;
    showToast(state.lang==='hi'?`Quiz result: ${pct}%`:`Quiz result: ${pct}%`);
  }
  function markComplete() {
    const topic=topicFor(state.activeTopic);
    if(!topic)return;
    if(!state.quizChecked){showToast('Complete the topic quiz first.');document.getElementById('topicQuiz')?.scrollIntoView({behavior:'smooth'});return;}
    const record=state.progress[topic.id]||{};
    record.done=true;
    state.progress[topic.id]=record;
    write(STORE.progress,state.progress);
    showToast('Topic marked as learned.');
    render();
  }
  function addTask(form) {
    const input=document.getElementById('taskInput');
    const dateInput=document.getElementById('taskDue');
    const value=input?.value.trim();
    if(!value)return;
    const date=dateInput?.value||state.trackerDate||today();
    state.tasks.push({id:`task-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,text:value,date,done:false,createdAt:new Date().toISOString()});
    write(STORE.tasks,state.tasks);
    state.trackerDate=date;
    state.trackerFilter='all';
    render();
    showToast('Task added.');
  }

  // One delegated handler keeps the application maintainable as topics grow.
  document.addEventListener('click', event => {
    const action=event.target.closest('[data-action]');
    if(action){
      const name=action.dataset.action;
      if(name==='home')navigate('home');
      else if(name==='subjects')navigate('subjects');
      else if(name==='welcome')navigate('welcome',{selectedLang:state.lang});
      else if(name==='python')navigate('python');
      else if(name==='continue-python'){state.lang=state.selectedLang;try{localStorage.setItem(STORE.language,state.lang);}catch{};navigate('python');}
      else if(name==='tracker')navigate('tracker');
      else if(name==='labs')navigate('labs');
      else if(name==='about')navigate('about');
      return;
    }
    const courseBtn=event.target.closest('[data-course]');
    if(courseBtn){if(courseBtn.dataset.course==='python')navigate('welcome',{selectedLang:state.lang});else showToast('This subject is marked as upcoming.');return;}
    const langBtn=event.target.closest('[data-select-language]');
    if(langBtn){state.selectedLang=langBtn.dataset.selectLanguage;render();return;}
    const topicBtn=event.target.closest('[data-topic]');
    if(topicBtn&&topicBtn.dataset.topic){navigate('lesson',{activeTopic:topicBtn.dataset.topic});return;}
    const option=event.target.closest('[data-choice]');
    if(option&&!state.quizChecked){const qi=Number(option.dataset.choice),oi=Number(option.dataset.option);state.quizAnswers[qi]=oi;document.querySelectorAll(`[data-question="${qi}"] .quiz-option`).forEach(btn=>btn.classList.toggle('selected',Number(btn.dataset.option)===oi));const n=document.getElementById('quizNotice');if(n)n.textContent='';return;}
    if(event.target.closest('#checkQuiz')){checkQuiz();return;}
    if(event.target.closest('#retryQuiz')){state.quizAnswers={};state.quizChecked=false;state.lastQuizScore=null;render();document.getElementById('topicQuiz')?.scrollIntoView({behavior:'smooth'});return;}
    if(event.target.closest('#markComplete')){markComplete();return;}
    const toggle=event.target.closest('[data-task-toggle]');
    if(toggle){const task=state.tasks.find(t=>t.id===toggle.dataset.taskToggle);if(task){task.done=!task.done;write(STORE.tasks,state.tasks);render();}return;}
    const remove=event.target.closest('[data-task-delete]');
    if(remove){state.tasks=state.tasks.filter(t=>t.id!==remove.dataset.taskDelete);write(STORE.tasks,state.tasks);render();showToast('Task deleted.');return;}
    const filter=event.target.closest('[data-tracker-filter]');
    if(filter){state.trackerFilter=filter.dataset.trackerFilter;render();return;}
    if(event.target.closest('#clearCompleted')){state.tasks=state.tasks.filter(t=>!(t.date===state.trackerDate&&t.done));write(STORE.tasks,state.tasks);render();showToast('Completed tasks cleared for this day.');return;}
    const copy=event.target.closest('.copy-code');
    if(copy){const code=copy.closest('.notebook-code')?.querySelector('pre code')?.textContent||'';if(navigator.clipboard?.writeText){navigator.clipboard.writeText(code).then(()=>showToast('Code copied.')).catch(()=>showToast('Copy is unavailable in this browser.'));}else showToast('Copy is unavailable in this browser.');return;}
  });
  document.addEventListener('submit',event=>{if(event.target.id==='addTaskForm'){event.preventDefault();addTask(event.target);}});
  document.addEventListener('change',event=>{if(event.target.id==='trackerDate'){state.trackerDate=event.target.value||today();state.trackerFilter='all';render();}if(event.target.id==='taskDue'){} });
  document.getElementById('languageToggle').addEventListener('click',()=>setLanguage(state.lang==='en'?'hi':'en'));
  document.getElementById('themeToggle').addEventListener('click',()=>setTheme(state.theme==='light'?'dark':'light'));
  document.getElementById('menuToggle').addEventListener('click',()=>{const nav=document.getElementById('mobileNav');const open=!nav.classList.contains('open');nav.classList.toggle('open',open);document.getElementById('menuToggle').setAttribute('aria-expanded',String(open));});
  document.getElementById('backTop').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  window.addEventListener('scroll',()=>{const doc=document.documentElement;const total=doc.scrollHeight-doc.clientHeight;const pct=total>0?doc.scrollTop/total*100:0;document.getElementById('topProgress').style.width=`${pct}%`;});
  setTheme(state.theme);
  updateNav();
  render();
})();
