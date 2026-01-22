import { registerRoute, navigate, initRouter } from './router.js';
import { migrateData } from './services/storageService.js';
import { initTheme } from './services/themeService.js';

import { renderHome } from './views/homeView.js';
import { renderPlayers } from './views/playersView.js';
import { renderNewGame } from './views/newGameView.js';
import { renderGame } from './views/gameView.js';
import { renderHistory } from './views/historyView.js';
import { renderModels } from './views/modelsView.js';

initTheme();
migrateData();

registerRoute('home', renderHome);
registerRoute('players', renderPlayers);
registerRoute('newGame', renderNewGame);
registerRoute('game', renderGame);
registerRoute('history', renderHistory);
registerRoute('models', renderModels);

window.addEventListener('load', () => {
  initRouter();
});

window.addEventListener('error', (event) => {
  console.error('Application error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
