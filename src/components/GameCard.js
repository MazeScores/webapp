/**
 * @typedef {import('../types/types.js').Game} Game
 */

import { getGameModel } from '../services/gameModelService.js';
import { calculatePlayerTotal } from '../services/gameService.js';
import { cloneTemplate, fillSlots, fillList } from '../utils/template.js';

/**
 * Create a game card component
 * @param {Game} game
 * @param {Object} [options]
 * @param {Function} [options.onClick]
 * @param {Function} [options.onDelete]
 * @param {boolean} [options.showDelete=false]
 * @returns {HTMLElement}
 */
export function createGameCard(game, { onClick, onDelete, showDelete = false } = {}) {
  const frag = cloneTemplate('tpl-game-card');
  const card = frag.firstElementChild;
  card.classList.add(game.status);

  const model = getGameModel(game.modelId);
  const playerScores = game.players.map(p => ({
    name: p.playerName,
    score: calculatePlayerTotal(p, game.modelId)
  })).sort((a, b) => b.score - a.score);

  const date = new Date(game.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  fillSlots(card, {
    cardTitle: game.name,
    cardModel: model?.label || game.modelId,
    cardDate: date,
    viewBtnLabel: game.status === 'in_progress' ? 'Reprendre' : 'Voir'
  });

  const badge = card.querySelector('[data-slot="cardBadge"]');
  badge.className = `card-badge ${game.status}`;
  badge.textContent = game.status === 'in_progress' ? 'En cours' : 'Terminée';

  const playerItems = playerScores.slice(0, 3).map((p, i) => {
    const pfrag = cloneTemplate('tpl-game-card-player');
    const el = pfrag.firstElementChild;
    if (i === 0) el.classList.add('winner');
    fillSlots(el, {
      playerName: (i === 0 ? '1. ' : '') + p.name,
      playerPoints: `${p.score} pts`
    });
    return el;
  });

  if (playerScores.length > 3) {
    const more = cloneTemplate('tpl-game-card-more');
    fillSlots(more, { moreText: `+${playerScores.length - 3} joueurs` });
    playerItems.push(more.firstElementChild);
  }

  fillList(card, 'cardPlayers', playerItems);

  if (showDelete) {
    const deleteBtn = card.querySelector('[data-action="deleteGame"]');
    deleteBtn.style.display = '';
  }

  card.querySelector('[data-action="viewGame"]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    onClick?.(game);
  });

  card.querySelector('[data-action="deleteGame"]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm(`Supprimer la partie "${game.name}" ?`)) {
      onDelete?.(game);
    }
  });

  if (onClick) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => onClick(game));
  }

  return card;
}
