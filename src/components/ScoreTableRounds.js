/**
 * @typedef {import('../types/types.js').Game} Game
 */

import { addRound, updateRoundScore, getPlayersSortedByScore } from '../services/gameService.js';

/**
 * Create a rounds-based score table
 * @param {Game} game
 * @param {Object} options
 * @param {boolean} [options.editable=true]
 * @param {boolean} [options.sortByScore=true]
 * @returns {HTMLElement}
 */
export function createScoreTableRounds(game, { editable = true, sortByScore = true } = {}) {
  const container = document.createElement('div');
  container.className = 'score-table-container';

  function render() {
    const rounds = game.players[0]?.scores.length || 0;
    const sortedPlayers = sortByScore
      ? getPlayersSortedByScore(game)
      : game.players.map((player, index) => ({ player, index, total: 0 }));

    if (sortByScore) {
      sortedPlayers.forEach(item => {
        item.total = item.player.scores.reduce((sum, s) => sum + (s || 0), 0);
      });
    }

    container.innerHTML = `
      ${editable ? '<button type="button" class="add-round-btn">+ Ajouter une manche</button>' : ''}

      <div class="table-wrapper">
        <table class="score-table">
          <thead>
            <tr>
              <th class="player-col">Joueur</th>
              ${Array.from({ length: rounds }).map((_, i) => `<th class="round-col">M${i + 1}</th>`).join('')}
              <th class="total-col">Total</th>
            </tr>
          </thead>
          <tbody>
            ${sortedPlayers.map(({ player, index, total }, rank) => `
              <tr class="${rank === 0 && rounds > 0 ? 'leader' : ''}">
                <td class="player-name">
                  ${rank === 0 && rounds > 0 ? '<span class="rank-badge">1</span>' : ''}
                  ${player.playerName}
                </td>
                ${player.scores.map((score, roundIndex) => {
                  const isLastRound = roundIndex === rounds - 1;
                  const isPending = isLastRound && score === 0;
                  return `
                  <td class="score-cell ${editable ? 'editable' : ''} ${isPending ? 'pending' : ''}"
                      ${editable ? `data-player="${index}" data-round="${roundIndex}"` : ''}>
                    <span class="score-value">${score || 0}</span>
                  </td>
                `;}).join('')}
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
    container.querySelector('.add-round-btn')?.addEventListener('click', () => {
      addRound(game);
      render();
    });

    if (editable) {
      container.querySelectorAll('.score-cell.editable').forEach(cell => {
        cell.addEventListener('click', () => {
          const playerIndex = parseInt(cell.dataset.player);
          const roundIndex = parseInt(cell.dataset.round);
          const currentScore = game.players[playerIndex]?.scores[roundIndex] || 0;
          const playerName = game.players[playerIndex]?.playerName || 'Joueur';

          const input = prompt(`Score de ${playerName} (Manche ${roundIndex + 1})`, currentScore.toString());

          if (input !== null) {
            const value = parseInt(input) || 0;
            updateRoundScore(game, playerIndex, roundIndex, value);
            render();
          }
        });
      });
    }
  }

  render();
  return container;
}
