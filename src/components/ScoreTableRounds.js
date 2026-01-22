/**
 * @typedef {import('../types/types.js').Game} Game
 */

import { addRound, updateRoundScore } from '../services/gameService.js';
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
 * Create a rounds-based score table
 * @param {Game} game
 * @param {Object} options
 * @param {boolean} [options.editable=true]
 * @param {boolean} [options.sorted=false]
 * @returns {HTMLElement}
 */
export function createScoreTableRounds(game, { editable = true, sorted = false } = {}) {
  const frag = cloneTemplate('tpl-score-table-rounds');
  const container = frag.firstElementChild;

  if (editable) {
    container.querySelector('[data-action="addRound"]').style.display = '';
  }

  function render() {
    const rounds = game.players[0]?.scores.length || 0;

    // Build player list with totals
    const playersWithTotals = game.players.map((player, index) => ({
      player,
      index,
      total: player.scores.reduce((sum, s) => sum + (s || 0), 0)
    }));

    // Sort if requested
    const displayPlayers = sorted
      ? [...playersWithTotals].sort((a, b) => b.total - a.total)
      : playersWithTotals;

    // Compute ranks based on totals
    const ranks = computeRanks(playersWithTotals);

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

    for (let i = 0; i < rounds; i++) {
      const th = document.createElement('th');
      th.className = 'round-col';
      th.textContent = `M${i + 1}`;
      headerRow.appendChild(th);
    }

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
      if (rounds > 0) {
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

      // Score cells
      player.scores.forEach((score, roundIndex) => {
        const isEmpty = score === null || score === undefined;
        const isPending = isEmpty;

        const td = document.createElement('td');
        td.className = `score-cell${editable ? ' editable' : ''}${isPending ? ' pending' : ''}`;

        const span = document.createElement('span');
        span.className = 'score-value';
        span.textContent = isEmpty ? '' : String(score);
        td.appendChild(span);

        if (editable) {
          td.dataset.player = index;
          td.dataset.round = roundIndex;
          td.addEventListener('click', () => {
            if (td.querySelector('input')) return;
            const currentScore = game.players[index]?.scores[roundIndex];
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'score-input';
            input.value = currentScore != null ? currentScore : '';
            td.textContent = '';
            td.appendChild(input);
            input.focus();
            input.select();

            function save() {
              const raw = input.value.trim();
              const value = raw === '' ? null : (parseInt(raw) || 0);
              updateRoundScore(game, index, roundIndex, value);
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

  // Bind add round button
  const addRoundBtn = container.querySelector('[data-action="addRound"]');
  if (addRoundBtn) {
    addRoundBtn.addEventListener('click', () => {
      const rounds = game.players[0]?.scores.length || 0;
      if (rounds > 0) {
        const lastRoundIndex = rounds - 1;
        const incomplete = game.players.filter(p => p.scores[lastRoundIndex] == null);
        if (incomplete.length > 0) {
          const names = incomplete.map(p => p.playerName).join(', ');
          const ok = confirm(
            `Il reste des scores non complétés. Le passage à la manche suivante notera les scores de cette manche à 0 pour les joueurs suivants : ${names}. Le score pourra toujours être modifié. Continuer ?`
          );
          if (!ok) return;
          incomplete.forEach(p => { p.scores[lastRoundIndex] = 0; });
        }
      }
      addRound(game);
      render();
    });
  }

  render();
  return container;
}
