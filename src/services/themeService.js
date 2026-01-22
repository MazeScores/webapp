const THEME_KEY = 'mazescores_theme';

/**
 * Get the current theme preference
 * @returns {'light' | 'dark' | 'system'}
 */
export function getThemePreference() {
  return localStorage.getItem(THEME_KEY) || 'system';
}

/**
 * Set the theme preference
 * @param {'light' | 'dark' | 'system'} theme
 */
export function setThemePreference(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme();
}

/**
 * Get the effective theme (resolved from system if needed)
 * @returns {'light' | 'dark'}
 */
export function getEffectiveTheme() {
  const preference = getThemePreference();
  if (preference === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return preference;
}

/**
 * Apply the current theme to the document
 */
export function applyTheme() {
  const theme = getEffectiveTheme();
  document.documentElement.setAttribute('data-theme', theme);

  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#1e293b' : '#2563eb');
  }
}

/**
 * Toggle between light and dark theme
 */
export function toggleTheme() {
  const current = getEffectiveTheme();
  setThemePreference(current === 'dark' ? 'light' : 'dark');
}

/**
 * Initialize theme system (call once at app start)
 */
export function initTheme() {
  applyTheme();

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getThemePreference() === 'system') {
      applyTheme();
    }
  });
}
