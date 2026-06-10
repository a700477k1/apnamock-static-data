/* ============================================
   ApnaMock - Shared JavaScript Foundation
   Core Modules: Storage, UI, Data, Utilities
   ============================================ */

// ===== CONFIGURATION =====
const APNA_MOCK_CONFIG = {
  APP_NAME: 'ApnaMock',
  VERSION: '1.0.0',
  STORAGE_PREFIX: 'apnamock_',
  DEFAULT_THEME: 'light',
  DEFAULT_LANGUAGE: 'bilingual',
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  API_BASE_URL: 'https://cdn.jsdelivr.net/gh/YOUR_USERNAME/apnamock-static@main/',
  DB_NAME: 'apnamock_db',
  DB_VERSION: 1,
  MAX_HISTORY_ITEMS: 100,
  MAX_FAVORITES: 500
};

// ===== UTILITY FUNCTIONS =====
const Utils = {
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => { clearTimeout(timeout); func(...args); };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) { func(...args); inThrottle = true; setTimeout(() => inThrottle = false, limit); }
    };
  },

  formatDate(date, options = {}) {
    const d = new Date(date);
    const defaultOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return d.toLocaleDateString('en-IN', { ...defaultOptions, ...options });
  },

  formatTime(date) {
    return new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  },

  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },

  formatNumber(num) {
    return new Intl.NumberFormat('en-IN').format(num);
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  interpolate(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] ?? match);
  },

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },

  loadCSS(href) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  },

  async fetchJSON(url, options = {}) {
    const response = await fetch(url, { ...options, headers: { 'Accept': 'application/json', ...options.headers } });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.json();
  },

  getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) { result[key] = value; }
    return result;
  },

  setUrlParams(params, replace = false) {
    const url = new URL(window.location);
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    });
    if (replace) window.history.replaceState({}, '', url);
    else window.history.pushState({}, '', url);
  }
};

// ===== STORAGE MANAGER =====
const StorageManager = {
  _prefix: APNA_MOCK_CONFIG.STORAGE_PREFIX,

  set(key, value) {
    try {
      localStorage.setItem(`${this._prefix}${key}`, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage error:', e);
      return false;
    }
  },

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(`${this._prefix}${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Storage error:', e);
      return defaultValue;
    }
  },

  remove(key) {
    localStorage.removeItem(`${this._prefix}${key}`);
  },

  clear() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this._prefix))
      .forEach(key => localStorage.removeItem(key));
  },

  has(key) {
    return localStorage.getItem(`${this._prefix}${key}`) !== null;
  },

  // Array helpers
  pushToArray(key, value, maxLength = null) {
    const arr = this.get(key, []);
    arr.push(value);
    if (maxLength && arr.length > maxLength) arr.splice(0, arr.length - maxLength);
    this.set(key, arr);
    return arr;
  },

  filterArray(key, predicate) {
    const arr = this.get(key, []);
    const filtered = arr.filter(predicate);
    this.set(key, filtered);
    return filtered;
  }
};

// ===== INDEXEDDB MANAGER =====
const DBManager = {
  db: null,
  name: APNA_MOCK_CONFIG.DB_NAME,
  version: APNA_MOCK_CONFIG.DB_VERSION,

  async init() {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.name, this.version);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('generatedTests')) {
          db.createObjectStore('generatedTests', { keyPath: 'generated_test_id' });
        }
        if (!db.objectStoreNames.contains('generatedProgress')) {
          db.createObjectStore('generatedProgress', { keyPath: 'generated_test_id' });
        }
        if (!db.objectStoreNames.contains('catalogCache')) {
          db.createObjectStore('catalogCache', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('questionPools')) {
          db.createObjectStore('questionPools', { keyPath: 'pool_key' });
        }
      };
      request.onsuccess = () => { this.db = request.result; resolve(this.db); };
      request.onerror = () => reject(request.error);
    });
  },

  async put(storeName, value) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(value);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  },

  async get(storeName, key) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  },

  async getAll(storeName) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  async delete(storeName, key) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  },

  async clear(storeName) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }
};

// ===== THEME MANAGER =====
const ThemeManager = {
  STORAGE_KEY: `${APNA_MOCK_CONFIG.STORAGE_PREFIX}theme`,

  init() {
    const savedTheme = this.getTheme();
    this.applyTheme(savedTheme);
    this.setupToggle();
  },

  getTheme() {
    return localStorage.getItem(this.STORAGE_KEY) || APNA_MOCK_CONFIG.DEFAULT_THEME;
  },

  setTheme(theme) {
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.applyTheme(theme);
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  },

  toggle() {
    const current = this.getTheme();
    this.setTheme(current === 'dark' ? 'light' : 'dark');
  },

  setupToggle() {
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  }
};

// ===== TOAST MANAGER =====
const ToastManager = {
  container: null,
  DEFAULT_DURATION: APNA_MOCK_CONFIG.TOAST_DURATION,

  init() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    this.container.setAttribute('role', 'region');
    this.container.setAttribute('aria-live', 'polite');
    document.body.appendChild(this.container);
  },

  show(message, type = 'info', duration = this.DEFAULT_DURATION) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `${this.getIcon(type)}<<span>${Utils.escapeHtml(message)}</span>`;

    this.container.appendChild(toast);

    requestAnimationFrame(() => { toast.style.animation = 'toast-slide-in 0.3s ease'; });

    setTimeout(() => {
      toast.style.animation = 'toast-fade-out 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success(message, duration) { this.show(message, 'success', duration); },
  error(message, duration) { this.show(message, 'error', duration); },
  warning(message, duration) { this.show(message, 'warning', duration); },
  info(message, duration) { this.show(message, 'info', duration); },

  getIcon(type) {
    const icons = {
      success: '<i class="fas fa-circle-check"></i>',
      error: '<i class="fas fa-circle-xmark"></i>',
      warning: '<i class="fas fa-triangle-exclamation"></i>',
      info: '<i class="fas fa-circle-info"></i>'
    };
    return icons[type] || icons.info;
  }
};

// ===== MODAL MANAGER =====
const ModalManager = {
  activeModal: null,

  open(content, options = {}) {
    const { title = '', onClose = null, size = 'md', closeOnOverlay = true } = options;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
      <div class="modal modal-${size}">
        <div class="modal-header">
          <h3>${Utils.escapeHtml(title)}</h3>
          <button class="btn btn-ghost" data-modal-close aria-label="Close modal">
            <i class="fas fa-xmark"></i>
          </button>
        </div>
        <div class="modal-body">${content}</div>
      </div>
    `;

    document.body.appendChild(overlay);
    this.activeModal = overlay;

    requestAnimationFrame(() => overlay.classList.add('active'));

    const closeModal = () => {
      overlay.classList.remove('active');
      setTimeout(() => { overlay.remove(); this.activeModal = null; if (onClose) onClose(); }, 300);
    };

    overlay.querySelector('[data-modal-close]').addEventListener('click', closeModal);
    if (closeOnOverlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && this.activeModal === overlay) closeModal(); });

    return { close: closeModal, element: overlay };
  },

  close() {
    if (this.activeModal) this.activeModal.querySelector('[data-modal-close]').click();
  }
};

// ===== LOADING MANAGER =====
const LoadingManager = {
  show(element, type = 'skeleton') {
    if (!element) return;
    element.classList.add('loading');
    if (type === 'skeleton') {
      element.innerHTML = '<div class="skeleton skeleton-card"></div>';
    } else if (type === 'spinner') {
      element.innerHTML = '<div class="flex justify-center p-8"><div class="spinner"></div></div>';
    }
  },

  hide(element, restoreContent = null) {
    if (!element) return;
    element.classList.remove('loading');
    if (restoreContent) element.innerHTML = restoreContent;
  }
};

// ===== DATA FETCHER =====
const DataFetcher = {
  baseUrl: APNA_MOCK_CONFIG.API_BASE_URL,
  cache: new Map(),
  cacheExpiry: 5 * 60 * 1000, // 5 minutes

  setBaseUrl(url) { this.baseUrl = url; },

  resolveUrl(path) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return new URL(path.replace(/^\/+/, ''), this.baseUrl).toString();
  },

  async fetch(path, options = {}) {
    const url = this.resolveUrl(path);
    const cacheKey = url;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.time < this.cacheExpiry && !options.bypassCache) {
      return Utils.deepClone(cached.data);
    }

    const data = await Utils.fetchJSON(url, options);
    this.cache.set(cacheKey, { data: Utils.deepClone(data), time: Date.now() });
    return data;
  },

  async fetchTestsIndex() { return this.fetch('index/tests-index.json'); },
  async fetchTest(testPath) { return this.fetch(testPath); },
  async fetchExamPatterns() { return this.fetch('custom-tests/index/exam-patterns.json'); },
  async fetchPoolIndex() { return this.fetch('custom-tests/index/pool-index.json'); },
  async fetchPresets() { return this.fetch('custom-tests/index/custom-test-presets.json'); },
  async fetchPool(poolPath) { return this.fetch(poolPath); },

  clearCache() { this.cache.clear(); }
};

// ===== HISTORY MANAGER =====
const HistoryManager = {
  STORAGE_KEY: `${APNA_MOCK_CONFIG.STORAGE_PREFIX}test_history`,
  MAX_ITEMS: APNA_MOCK_CONFIG.MAX_HISTORY_ITEMS,

  getAll() { return StorageManager.get(this.STORAGE_KEY, []); },

  add(attempt) {
    const history = this.getAll();
    attempt.attempt_id = attempt.attempt_id || Utils.generateId('att');
    attempt.attempted_at = attempt.attempted_at || new Date().toISOString();
    history.unshift(attempt);
    if (history.length > this.MAX_ITEMS) history.length = this.MAX_ITEMS;
    StorageManager.set(this.STORAGE_KEY, history);
    return attempt;
  },

  getById(attemptId) {
    return this.getAll().find(a => a.attempt_id === attemptId);
  },

  getByTestId(testId) {
    return this.getAll().filter(a => a.test_id === testId || a.generated_test_id === testId);
  },

  delete(attemptId) {
    const filtered = this.getAll().filter(a => a.attempt_id !== attemptId);
    StorageManager.set(this.STORAGE_KEY, filtered);
    return filtered;
  },

  clear() { StorageManager.remove(this.STORAGE_KEY); },

  getStats() {
    const history = this.getAll();
    return {
      totalAttempts: history.length,
      totalTests: new Set(history.map(a => a.test_id || a.generated_test_id)).size,
      averageScore: history.length ? (history.reduce((s, a) => s + (a.score || 0), 0) / history.length).toFixed(2) : 0,
      averageAccuracy: history.length ? (history.reduce((s, a) => s + (a.accuracy || 0), 0) / history.length).toFixed(2) : 0
    };
  }
};

// ===== FAVORITES MANAGER =====
const FavoritesManager = {
  STORAGE_KEY: `${APNA_MOCK_CONFIG.STORAGE_PREFIX}favorites`,
  MAX_ITEMS: APNA_MOCK_CONFIG.MAX_FAVORITES,

  getAll() { return StorageManager.get(this.STORAGE_KEY, []); },

  add(item) {
    const favorites = this.getAll();
    if (favorites.length >= this.MAX_ITEMS) {
      ToastManager.warning('Favorites limit reached. Remove some items first.');
      return false;
    }
    if (!favorites.find(f => f.question_id === item.question_id)) {
      favorites.push({ ...item, added_at: new Date().toISOString() });
      StorageManager.set(this.STORAGE_KEY, favorites);
      ToastManager.success('Added to favorites!');
      return true;
    }
    return false;
  },

  remove(questionId) {
    const filtered = this.getAll().filter(f => f.question_id !== questionId);
    StorageManager.set(this.STORAGE_KEY, filtered);
    ToastManager.info('Removed from favorites');
    return filtered;
  },

  isFavorite(questionId) {
    return this.getAll().some(f => f.question_id === questionId);
  },

  toggle(item) {
    if (this.isFavorite(item.question_id)) this.remove(item.question_id);
    else this.add(item);
  },

  clear() { StorageManager.remove(this.STORAGE_KEY); }
};

// ===== LANGUAGE MANAGER =====
const LanguageManager = {
  STORAGE_KEY: `${APNA_MOCK_CONFIG.STORAGE_PREFIX}language`,
  DEFAULT: APNA_MOCK_CONFIG.DEFAULT_LANGUAGE,

  get() { return StorageManager.get(this.STORAGE_KEY, this.DEFAULT); },
  set(lang) { StorageManager.set(this.STORAGE_KEY, lang); document.dispatchEvent(new CustomEvent('languagechange', { detail: { language: lang } })); },
  toggle() { this.set(this.get() === 'hindi' ? 'english' : 'hindi'); },

  getText(obj, preferred = null) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    const lang = preferred || this.get();
    if (lang === 'bilingual') return obj.hi || obj.en || '';
    if (lang === 'hindi') return obj.hi || obj.en || '';
    return obj.en || obj.hi || '';
  }
};

// ===== SCROLL MANAGER =====
const ScrollManager = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    });

    const scrollTopBtn = document.querySelector('[data-scroll-top]');
    if (scrollTopBtn) {
      window.addEventListener('scroll', Utils.throttle(() => {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
      }, 100));
      scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  }
};

// ===== LAZY LOADER =====
const LazyLoader = {
  init() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '50px' });
      document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
    } else {
      document.querySelectorAll('img[data-src]').forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
    }
  }
};

// ===== ANALYTICS =====
const Analytics = {
  track(event, data = {}) {
    const eventData = { event, timestamp: new Date().toISOString(), url: window.location.href, ...data };
    const events = StorageManager.get('analytics_events', []);
    events.push(eventData);
    StorageManager.set('analytics_events', events);
    if (window.gtag) gtag('event', event, data);
    console.log('Analytics:', eventData);
  },
  pageView(page) { this.track('page_view', { page }); }
};

// ===== INITIALIZATION =====
function initApnaMock() {
  ThemeManager.init();
  ScrollManager.init();
  LazyLoader.init();
  DBManager.init().catch(console.error);
  Analytics.pageView(window.location.pathname);
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApnaMock);
} else {
  initApnaMock();
}

// Expose globally
window.ApnaMock = {
  config: APNA_MOCK_CONFIG,
  utils: Utils,
  storage: StorageManager,
  db: DBManager,
  theme: ThemeManager,
  toast: ToastManager,
  modal: ModalManager,
  loading: LoadingManager,
  data: DataFetcher,
  history: HistoryManager,
  favorites: FavoritesManager,
  language: LanguageManager,
  scroll: ScrollManager,
  lazy: LazyLoader,
  analytics: Analytics,
  init: initApnaMock
};
