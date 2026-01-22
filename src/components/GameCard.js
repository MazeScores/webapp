/**
 * @typedef {import('../types/types.js').Game} Game
 */

import { getGameModel } from '../services/gameModelService.js';
import { calculatePlayerTotal } from '../services/gameService.js';

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
  const card = document.createElement('div');
  card.className = `game-card ${game.status}`;

  const model = getGameModel(game.modelId);
  const playerScores = game.players.map(p => ({
    name: p.playerName,
    score: calculatePlayerTotal(p, game.modelId)
  })).sort((a, b) => b.score - a.score);

  const winner = playerScores[0];
  const date = new Date(game.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  card.innerHTML = `
    <div class="card-header">
      <h3 class="card-title">${game.name}</h3>
      <span class="card-badge ${game.status}">${game.status === 'in_progress' ? 'En cours' : 'Terminée'}</span>
    </div>

    <div class="card-info">
      <span class="card-model">${model?.label || game.modelId}</span>
      <span class="card-date">${date}</span>
    </div>

    <div class="card-players">
      ${playerScores.slice(0, 3).map((p, i) => `
        <div class="player-score ${i === 0 ? 'winner' : ''}">
          <span class="player-name">${i === 0 ? '1. ' : ''}${p.name}</span>
          <span class="player-points">${p.score} pts</span>
        </div>
      `).join('')}
      ${playerScores.length > 3 ? `<div class="more-players">+${playerScores.length - 3} joueurs</div>` : ''}
    </div>

    <div class="card-actions">
      <button type="button" class="card-btn view-btn">${game.status === 'in_progress' ? 'Reprendre' : 'Voir'}</button>
      ${showDelete ? '<button type="button" class="card-btn delete-btn">Supprimer</button>' : ''}
    </div>
  `;

  card.querySelector('.view-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    onClick?.(game);
  });

  card.querySelector('.delete-btn')?.addEventListener('click', (e) => {
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
