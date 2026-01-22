import { getEffectiveTheme, toggleTheme } from '../services/themeService.js';

/**
 * Create a theme toggle button
 * @returns {HTMLButtonElement}
 */
export function createThemeToggle() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'theme-toggle';
  button.setAttribute('aria-label', 'Changer de thème');

  function updateIcon() {
    const theme = getEffectiveTheme();
    button.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  button.addEventListener('click', () => {
    toggleTheme();
    updateIcon();
  });

  updateIcon();
  return button;
}
