import { navigate } from '../router.js';
import { setData } from '../services/storageService.js';
import { getThemePreference, setThemePreference } from '../services/themeService.js';
import { renderOptions } from '../views/optionsView.js';

/**
 * Options controller
 */
export function optionsController() {
  const frag = renderOptions();
  const el = frag.firstElementChild;

  el.querySelector('[data-action="back"]').addEventListener('click', () => navigate('home'));

  // Theme
  const themeButtons = el.querySelectorAll('.theme-option');
  const themeMap = {
    themeLight: 'light',
    themeDark: 'dark',
    themeSystem: 'system'
  };

  function updateActiveTheme() {
    const current = getThemePreference();
    themeButtons.forEach(btn => {
      const value = themeMap[btn.dataset.action];
      btn.classList.toggle('active', value === current);
    });
  }

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setThemePreference(themeMap[btn.dataset.action]);
      updateActiveTheme();
    });
  });

  updateActiveTheme();

  // Reset
  el.querySelector('[data-action="resetAll"]').addEventListener('click', () => {
    if (confirm('Supprimer toutes les données (joueurs et historique) ? Cette action est irréversible.')) {
      setData('players', []);
      setData('games', []);
      navigate('home');
    }
  });

  el.querySelector('[data-action="resetGames"]').addEventListener('click', () => {
    if (confirm("Supprimer l'historique des parties ? Cette action est irréversible.")) {
      setData('games', []);
      navigate('home');
    }
  });

  document.getElementById('app').appendChild(frag);
}
