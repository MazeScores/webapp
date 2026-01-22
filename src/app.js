import { registerRoute, initRouter } from './router.js';
import { initTheme } from './services/themeService.js';

import { homeController } from './controllers/homeController.js';
import { playersController } from './controllers/playersController.js';
import { newGameController } from './controllers/newGameController.js';
import { gameController } from './controllers/gameController.js';
import { historyController } from './controllers/historyController.js';
import { modelsController } from './controllers/modelsController.js';
import { optionsController } from './controllers/optionsController.js';

initTheme();

registerRoute('home', homeController);
registerRoute('players', playersController);
registerRoute('newGame', newGameController);
registerRoute('game', gameController);
registerRoute('history', historyController);
registerRoute('models', modelsController);
registerRoute('options', optionsController);

window.addEventListener('load', () => {
  initRouter();
});

window.addEventListener('error', (event) => {
  console.error('Application error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
