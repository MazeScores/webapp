import { navigate } from '../router.js';
import { getGame, finishGame, updateGame } from '../services/gameService.js';
import { getGameModel } from '../services/gameModelService.js';
import { createScoreTable } from '../components/ScoreTable.js';
import { store } from '../state/store.js';
import { renderGame, renderGameError } from '../views/gameView.js';


/**
 * Game controller
 * @param {Object} params
 * @param {string} params.gameId
 * @returns {Function} cleanup function
 */
export function gameController(params) {
  const { gameId } = params;
  const game = getGame(gameId);
  const app = document.getElementById('app');

  if (!game) {
    const frag = renderGameError();
    const el = frag.firstElementChild;
    el.querySelector('[data-action="backHome"]').addEventListener('click', () => navigate('home'));
    app.appendChild(frag);
    return;
  }

  store.currentGame = game;
  const model = getGameModel(game.modelId);
  const isFinished = game.status === 'finished';

  const frag = renderGame(game, model);
  const el = frag.firstElementChild;

  const gameContent = el.querySelector('[data-slot="gameContent"]');
  const showRankingBtn = el.querySelector('[data-action="showRanking"]');
  const backToGameBtn = el.querySelector('[data-action="backToGame"]');
  const finishBtn = el.querySelector('[data-action="finishGame"]');

  let showRanking = isFinished;

  function renderContent() {
    gameContent.innerHTML = '';
    const scoreTable = createScoreTable(game, {
      editable: !showRanking && !isFinished,
      sorted: showRanking || isFinished
    });
    gameContent.appendChild(scoreTable);
  }

  renderContent();

  // Edit game name
  const editNameBtn = el.querySelector('[data-action="editGameName"]');

  editNameBtn?.addEventListener('click', () => {
    const currentH1 = el.querySelector('[data-slot="gameName"]');
    if (!currentH1) return;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'game-name-input';
    input.value = game.name;

    currentH1.replaceWith(input);
    editNameBtn.style.display = 'none';
    input.focus();
    input.select();

    function confirmRename() {
      const newName = input.value.trim();
      if (newName && newName !== game.name) {
        updateGame(game.id, { name: newName });
        game.name = newName;
      }
      const newH1 = document.createElement('h1');
      newH1.dataset.slot = 'gameName';
      newH1.textContent = game.name;
      input.replaceWith(newH1);
      editNameBtn.style.display = '';
    }

    input.addEventListener('blur', confirmRename);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        input.blur();
      } else if (e.key === 'Escape') {
        input.value = game.name;
        input.blur();
      }
    });
  });

  // Back button
  el.querySelector('[data-action="back"]').addEventListener('click', () => {
    if (store.saveTimeout) {
      clearTimeout(store.saveTimeout);
      updateGame(game.id, { players: game.players });
    }
    store.currentGame = null;
    navigate('home');
  });

  // Classement / Retour toggle (only for in-progress games)
  if (!isFinished) {
    showRankingBtn?.addEventListener('click', () => {
      showRanking = true;
      renderContent();
      showRankingBtn.style.display = 'none';
      if (finishBtn) finishBtn.style.display = 'none';
      backToGameBtn.style.display = '';
    });

    backToGameBtn?.addEventListener('click', () => {
      showRanking = false;
      renderContent();
      backToGameBtn.style.display = 'none';
      showRankingBtn.style.display = '';
      if (finishBtn) finishBtn.style.display = '';
    });

    finishBtn?.addEventListener('click', () => {
      if (confirm('Terminer cette partie ? Les scores ne pourront plus être modifiés.')) {
        finishGame(game.id);
        app.innerHTML = '';
        gameController({ gameId });
      }
    });
  }

  app.appendChild(el);

  return () => {
    if (store.saveTimeout) {
      clearTimeout(store.saveTimeout);
      updateGame(game.id, { players: game.players });
    }
    store.currentGame = null;
  };
}
