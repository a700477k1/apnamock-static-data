// ===== DATA MANAGER - Client-side caching for test data =====
const DataManager = (function() {
  const CACHE_KEY = 'apnamock_cache';
  const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
  const DATA_BASE_URL = 'https://cdn.jsdelivr.net/gh/a700477k1/apnamock-static-data@main';
  
  function getCache() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      }
    } catch (e) {
      console.warn('Cache read error:', e);
    }
    return null;
  }
  
  function setCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Cache write error:', e);
    }
  }
  
  async function fetchTests() {
    const cached = getCache();
    if (cached && cached.tests) {
      return cached.tests;
    }
    
    try {
      const response = await fetch(`${DATA_BASE_URL}/data/tests-index.json`);
      if (!response.ok) throw new Error('Failed to fetch tests');
      const data = await response.json();
      setCache(data);
      return data.tests || data;
    } catch (error) {
      console.error('Error fetching tests:', error);
      return cached || [];
    }
  }
  
  async function fetchTest(testId) {
    try {
      const response = await fetch(`${DATA_BASE_URL}/data/tests/${testId}.json`);
      if (!response.ok) throw new Error('Failed to fetch test');
      return await response.json();
    } catch (error) {
      console.error('Error fetching test:', error);
      return null;
    }
  }
  
  async function fetchQuestions(testId) {
    return fetchTest(testId);
  }
  
  function clearCache() {
    localStorage.removeItem(CACHE_KEY);
  }
  
  return {
    fetchTests,
    fetchTest,
    fetchQuestions,
    clearCache,
    getCache
  };
})();

// ===== ANALYTICS MANAGER - Batch analytics for Google Apps Script =====
const AnalyticsManager = (function() {
  const QUEUE_KEY = 'apnamock_analytics_queue';
  const BATCH_SIZE = 10;
  const FLUSH_INTERVAL = 5 * 60 * 1000; // 5 minutes
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
  
  function getQueue() {
    try {
      const queue = localStorage.getItem(QUEUE_KEY);
      return queue ? JSON.parse(queue) : [];
    } catch (e) {
      return [];
    }
  }
  
  function setQueue(queue) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }
  
  function queueEvent(event) {
    const queue = getQueue();
    queue.push({
      ...event,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`
    });
    setQueue(queue);
    
    if (queue.length >= BATCH_SIZE) {
      flush();
    }
  }
  
  async function flush() {
    const queue = getQueue();
    if (queue.length === 0) return;
    
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: queue })
      });
      
      if (response.ok) {
        setQueue([]);
      }
    } catch (error) {
      console.warn('Analytics flush failed:', error);
    }
  }
  
  // Auto-flush every 5 minutes
  setInterval(flush, FLUSH_INTERVAL);
  
  // Flush on page unload
  window.addEventListener('beforeunload', () => {
    const queue = getQueue();
    if (queue.length > 0) {
      navigator.sendBeacon?.(APPS_SCRIPT_URL, JSON.stringify({ events: queue }));
    }
  });
  
  return {
    queueEvent,
    flush,
    getQueue
  };
})();

// ===== TEST PROGRESS MANAGER =====
const ProgressManager = (function() {
  const PROGRESS_KEY = 'apnamock_progress';
  
  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }
  
  function setProgress(testId, progress) {
    const all = getProgress();
    all[testId] = {
      ...progress,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
  }
  
  function getTestProgress(testId) {
    return getProgress()[testId] || null;
  }
  
  function clearProgress(testId) {
    const all = getProgress();
    delete all[testId];
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
  }
  
  return {
    getProgress,
    setProgress,
    getTestProgress,
    clearProgress
  };
})();

// ===== FAVORITES MANAGER =====
const FavoritesManager = (function() {
  const FAVORITES_KEY = 'apnamock_favorites';
  
  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }
  
  function addFavorite(testId) {
    const favorites = getFavorites();
    if (!favorites.includes(testId)) {
      favorites.push(testId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }
  
  function removeFavorite(testId) {
    const favorites = getFavorites().filter(id => id !== testId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
  
  function isFavorite(testId) {
    return getFavorites().includes(testId);
  }
  
  return {
    getFavorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };
})();

// ===== HISTORY MANAGER =====
const HistoryManager = (function() {
  const HISTORY_KEY = 'apnamock_history';
  const MAX_HISTORY = 100;
  
  function getHistory() {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }
  
  function addToHistory(result) {
    const history = getHistory();
    history.unshift({
      ...result,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 100 entries
    if (history.length > MAX_HISTORY) {
      history.length = MAX_HISTORY;
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
  
  function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
  }
  
  return {
    getHistory,
    addToHistory,
    clearHistory
  };
})();

// ===== PAGINATION HELPER =====
function paginate(items, page, perPage = 20) {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return {
    items: items.slice(start, end),
    total: items.length,
    page,
    perPage,
    totalPages: Math.ceil(items.length / perPage)
  };
}

// ===== SEARCH HELPER =====
function searchTests(tests, query) {
  const lowerQuery = query.toLowerCase();
  return tests.filter(test => 
    test.title?.toLowerCase().includes(lowerQuery) ||
    test.exam?.toLowerCase().includes(lowerQuery) ||
    test.category?.toLowerCase().includes(lowerQuery) ||
    test.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// ===== FILTER HELPER =====
function filterTests(tests, filters) {
  return tests.filter(test => {
    if (filters.exam && test.exam !== filters.exam) return false;
    if (filters.category && test.category !== filters.category) return false;
    if (filters.difficulty && test.difficulty !== filters.difficulty) return false;
    if (filters.year && test.year !== filters.year) return false;
    return true;
  });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DataManager,
    AnalyticsManager,
    ProgressManager,
    FavoritesManager,
    HistoryManager,
    paginate,
    searchTests,
    filterTests
  };
}
