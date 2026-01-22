import { getEffectiveTheme, toggleTheme } from '../services/themeService.js';
import { cloneTemplate } from '../utils/template.js';

/**
 * Create a theme toggle button
 * @returns {HTMLButtonElement}
 */
export function createThemeToggle() {
  const frag = cloneTemplate('tpl-theme-toggle');
  const button = frag.querySelector('[data-action="toggleTheme"]');

  function updateIcon() {
    const theme = getEffectiveTheme();
    button.querySelector('[data-slot="themeIcon"]').textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  button.addEventListener('click', () => {
    toggleTheme();
    updateIcon();
  });

  updateIcon();
  return button;
}
