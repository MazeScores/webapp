import { store } from './state/store.js';

/** @type {Object.<string, Function>} */
const routes = {};

/** @type {Function|null} */
let currentCleanup = null;

/**
 * Register a route
 * @param {string} path
 * @param {Function} handler
 */
export function registerRoute(path, handler) {
  routes[path] = handler;
}

/**
 * Navigate to a route
 * @param {string} path
 * @param {Object} [params]
 */
export function navigate(path, params = {}) {
  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }

  store.currentView = path;
  store.viewParams = params;

  const handler = routes[path];
  if (handler) {
    history.pushState(null, '', `#${path}`);

    const app = document.getElementById('app');
    app.innerHTML = '';

    const result = handler(params);

    if (typeof result === 'function') {
      currentCleanup = result;
    } else if (result && typeof result === 'object' && result.cleanup) {
      currentCleanup = result.cleanup;
    }
  } else {
    console.error(`Route not found: ${path}`);
    navigate('home');
  }
}

/**
 * Initialize router with default routes
 */
export function initRouter() {
  window.addEventListener('popstate', () => {
    const path = window.location.hash.slice(1) || 'home';
    navigate(path);
  });

  const initialPath = window.location.hash.slice(1) || 'home';
  navigate(initialPath);
}

