import { cloneTemplate, fillSlots } from '../utils/template.js';

/**
 * Render the game view
 * @param {import('../types/types.js').Game} game
 * @param {import('../types/types.js').GameModel} model
 * @returns {DocumentFragment}
 */
export function renderGame(game, model) {
  const isFinished = game.status === 'finished';
  const frag = cloneTemplate('tpl-game');

  fillSlots(frag, {
    gameName: game.name,
    gameModel: model?.label || game.modelId
  });

  const statusEl = frag.querySelector('[data-slot="gameStatus"]');
  statusEl.className = `game-status ${game.status}`;
  statusEl.textContent = isFinished ? 'Terminée' : 'En cours';

  if (!isFinished) {
    // Show the classement button
    frag.querySelector('[data-action="showRanking"]').style.display = '';

    // Add finish button
    const actionsEl = frag.querySelector('[data-slot="gameActions"]');
    const finishBtn = document.createElement('button');
    finishBtn.type = 'button';
    finishBtn.className = 'btn danger';
    finishBtn.dataset.action = 'finishGame';
    finishBtn.textContent = 'Terminer la partie';
    actionsEl.appendChild(finishBtn);
  }

  return frag;
}

/**
 * Render the game error view
 * @returns {DocumentFragment}
 */
export function renderGameError() {
  return cloneTemplate('tpl-game-error');
}
