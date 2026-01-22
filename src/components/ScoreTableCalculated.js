/**
 * @typedef {import('../types/types.js').Game} Game
 * @typedef {import('../types/types.js').GameModel} GameModel
 */

import { updateFieldScore, getPlayersSortedByScore } from '../services/gameService.js';

/**
 * Create a calculated score table (field-based scoring)
 * @param {Game} game
 * @param {GameModel} model
 * @param {Object} options
 * @param {boolean} [options.editable=true]
 * @param {boolean} [options.sortByScore=true]
 * @returns {HTMLElement}
 */
export function createScoreTableCalculated(game, model, { editable = true, sortByScore = true } = {}) {
  const container = document.createElement('div');
  container.className = 'score-table-container calculated';

  const fields = model.fields || [];

  function render() {
    const sortedPlayers = sortByScore
      ? getPlayersSortedByScore(game)
      : game.players.map((player, index) => ({
          player,
          index,
          total: Object.values(player.fieldScores || {}).reduce((sum, s) => sum + (s || 0), 0)
        }));

    container.innerHTML = `
      <div class="table-wrapper">
        <table class="score-table">
          <thead>
            <tr>
              <th class="player-col">Joueur</th>
              ${fields.map(f => `<th class="field-col" title="${f.label}">${f.icon || ''} ${f.label}</th>`).join('')}
              <th class="total-col">Total</th>
            </tr>
          </thead>
          <tbody>
            ${sortedPlayers.map(({ player, index, total }, rank) => `
              <tr class="${rank === 0 ? 'leader' : ''}">
                <td class="player-name">
                  ${rank === 0 ? '<span class="rank-badge">1</span>' : ''}
                  ${player.playerName}
                </td>
                ${fields.map(field => {
                  const score = player.fieldScores?.[field.id] || 0;
                  return `
                    <td class="score-cell ${editable ? 'editable' : ''}"
                        ${editable ? `data-player="${index}" data-field="${field.id}" data-field-label="${field.label}"` : ''}>
                      <span class="score-value">${score}</span>
                    </td>
                  `;
                }).join('')}
                <td class="total-cell"><strong>${total}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    if (editable) {
      container.querySelectorAll('.score-cell.editable').forEach(cell => {
        cell.addEventListener('click', () => {
          const playerIndex = parseInt(cell.dataset.player);
          const fieldId = cell.dataset.field;
          const fieldLabel = cell.dataset.fieldLabel;
          const currentScore = game.players[playerIndex]?.fieldScores?.[fieldId] || 0;
          const playerName = game.players[playerIndex]?.playerName || 'Joueur';

          const input = prompt(`${fieldLabel} de ${playerName}`, currentScore.toString());

          if (input !== null) {
            const value = parseInt(input) || 0;
            updateFieldScore(game, playerIndex, fieldId, value);
            render();
          }
        });
      });
    }
  }

  render();
  return container;
}
