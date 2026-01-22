/**
 * @typedef {import('../types/types.js').Game} Game
 */

import { navigate } from '../router.js';
import { getGame, finishGame, updateGame } from '../services/gameService.js';
import { getGameModel } from '../services/gameModelService.js';
import { createScoreTable } from '../components/ScoreTable.js';
import { store } from '../state/store.js';
import { createThemeToggle } from '../components/ThemeToggle.js';

/**
 * Render the game view
 * @param {Object} params
 * @param {string} params.gameId
 */
export function renderGame(params) {
  const { gameId } = params;
  const game = getGame(gameId);

  if (!game) {
    document.body.innerHTML = `
      <div class="view error-view">
        <h1>Partie introuvable</h1>
        <p>La partie demandée n'existe pas.</p>
        <button type="button" id="backHome">Retour à l'accueil</button>
      </div>
    `;
    document.getElementById('backHome').addEventListener('click', () => navigate('home'));
    return;
  }

  store.currentGame = game;
  const model = getGameModel(game.modelId);
  const isFinished = game.status === 'finished';

  document.body.innerHTML = `
    <div class="view game-view">
      <header class="view-header">
        <button type="button" class="back-btn" id="back">&larr;</button>
        <div class="header-info">
          <h1>${game.name}</h1>
          <span class="game-model">${model?.label || game.modelId}</span>
          <span class="game-status ${game.status}">${isFinished ? 'Terminée' : 'En cours'}</span>
        </div>
        <div class="header-actions" id="headerActions"></div>
      </header>

      <div class="game-content" id="gameContent"></div>

      ${!isFinished ? `
        <div class="game-actions">
          <button type="button" class="btn danger" id="finishGame">Terminer la partie</button>
        </div>
      ` : ''}
    </div>
  `;

  document.getElementById('headerActions').appendChild(createThemeToggle());

  const gameContent = document.getElementById('gameContent');
  const scoreTable = createScoreTable(game, {
    editable: !isFinished,
    sortByScore: true
  });
  gameContent.appendChild(scoreTable);

  document.getElementById('back').addEventListener('click', () => {
    if (store.saveTimeout) {
      clearTimeout(store.saveTimeout);
      updateGame(game.id, { players: game.players });
    }
    store.currentGame = null;
    navigate('home');
  });

  document.getElementById('finishGame')?.addEventListener('click', () => {
    if (confirm('Terminer cette partie ? Les scores ne pourront plus être modifiés.')) {
      finishGame(game.id);
      renderGame({ gameId });
    }
  });

  return () => {
    if (store.saveTimeout) {
      clearTimeout(store.saveTimeout);
      updateGame(game.id, { players: game.players });
    }
    store.currentGame = null;
  };
}
