/**
 * @typedef {import('../types/types.js').Game} Game
 * @typedef {import('../types/types.js').GameModel} GameModel
 */

import { updateFieldScore } from '../services/gameService.js';
import { cloneTemplate } from '../utils/template.js';

/**
 * Compute competition ranks (1224 standard) from players with totals
 * @param {Array<{index: number, total: number}>} players
 * @returns {Map<number, number>} index -> rank
 */
function computeRanks(players) {
  const sorted = [...players].sort((a, b) => b.total - a.total);
  const ranks = new Map();
  sorted.forEach((p, i) => {
    if (i > 0 && p.total === sorted[i - 1].total) {
      ranks.set(p.index, ranks.get(sorted[i - 1].index));
    } else {
      ranks.set(p.index, i + 1);
    }
  });
  return ranks;
}

/**
 * Create a rank cell with badge for top 3
 * @param {number} rank
 * @returns {HTMLTableCellElement}
 */
function createRankCell(rank) {
  const td = document.createElement('td');
  td.className = 'rank-cell';
  if (rank <= 3) {
    const badge = document.createElement('span');
    badge.className = `rank-badge rank-${rank}`;
    badge.textContent = String(rank);
    td.appendChild(badge);
  } else {
    td.textContent = String(rank);
  }
  return td;
}

/**
 * Create a calculated score table (field-based scoring)
 * @param {Game} game
 * @param {GameModel} model
 * @param {Object} options
 * @param {boolean} [options.editable=true]
 * @param {boolean} [options.sorted=false]
 * @returns {HTMLElement}
 */
export function createScoreTableCalculated(game, model, { editable = true, sorted = false } = {}) {
  const frag = cloneTemplate('tpl-score-table-calculated');
  const container = frag.firstElementChild;

  const fields = model.fields || [];

  function render() {
    // Build player list with totals
    const playersWithTotals = game.players.map((player, index) => ({
      player,
      index,
      total: Object.values(player.fieldScores || {}).reduce((sum, s) => sum + (s || 0), 0)
    }));

    // Sort if requested
    const displayPlayers = sorted
      ? [...playersWithTotals].sort((a, b) => b.total - a.total)
      : playersWithTotals;

    // Compute ranks based on totals
    const ranks = computeRanks(playersWithTotals);
    const hasScores = playersWithTotals.some(p => p.total !== 0);

    // Build header
    const headerRow = container.querySelector('[data-slot="tableHeader"]');
    headerRow.innerHTML = '';

    const rankTh = document.createElement('th');
    rankTh.className = 'rank-col';
    rankTh.textContent = '#';
    headerRow.appendChild(rankTh);

    const playerTh = document.createElement('th');
    playerTh.className = 'player-col';
    playerTh.textContent = 'Joueur';
    headerRow.appendChild(playerTh);

    fields.forEach(f => {
      const th = document.createElement('th');
      th.className = 'field-col';
      th.title = f.label;
      th.textContent = `${f.icon || ''} ${f.label}`;
      headerRow.appendChild(th);
    });

    const totalTh = document.createElement('th');
    totalTh.className = 'total-col';
    totalTh.textContent = 'Total';
    headerRow.appendChild(totalTh);

    // Build body
    const tbody = container.querySelector('[data-list="tableBody"]');
    tbody.innerHTML = '';

    displayPlayers.forEach(({ player, index, total }) => {
      const rank = ranks.get(index);
      const tr = document.createElement('tr');

      // Rank cell
      if (hasScores) {
        tr.appendChild(createRankCell(rank));
      } else {
        const emptyRank = document.createElement('td');
        emptyRank.className = 'rank-cell';
        tr.appendChild(emptyRank);
      }

      // Player name cell
      const nameTd = document.createElement('td');
      nameTd.className = 'player-name';
      nameTd.textContent = player.playerName;
      tr.appendChild(nameTd);

      // Field cells
      fields.forEach(field => {
        const score = player.fieldScores?.[field.id] || 0;
        const td = document.createElement('td');
        td.className = `score-cell${editable ? ' editable' : ''}`;

        const span = document.createElement('span');
        span.className = 'score-value';
        span.textContent = String(score);
        td.appendChild(span);

        if (editable) {
          td.dataset.player = index;
          td.dataset.field = field.id;
          td.addEventListener('click', () => {
            if (td.querySelector('input')) return;
            const currentScore = game.players[index]?.fieldScores?.[field.id] || 0;
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'score-input';
            input.value = currentScore;
            td.textContent = '';
            td.appendChild(input);
            input.focus();
            input.select();

            function save() {
              const value = parseInt(input.value) || 0;
              updateFieldScore(game, index, field.id, value);
              render();
            }
            function cancel() { render(); }

            input.addEventListener('blur', save);
            input.addEventListener('keydown', (e) => {
              if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
              if (e.key === 'Escape') { input.removeEventListener('blur', save); cancel(); }
            });
          });
        }

        tr.appendChild(td);
      });

      // Total cell
      const totalTd = document.createElement('td');
      totalTd.className = 'total-cell';
      const strong = document.createElement('strong');
      strong.textContent = String(total);
      totalTd.appendChild(strong);
      tr.appendChild(totalTd);

      tbody.appendChild(tr);
    });
  }

  render();
  return container;
}
