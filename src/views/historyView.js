/**
 * @typedef {import('../types/types.js').Game} Game
 */

import { navigate } from '../router.js';
import { getFinishedGames, getGames, deleteGame } from '../services/gameService.js';
import { createGameCard } from '../components/GameCard.js';
import { createFilterBar } from '../components/FilterBar.js';
import { createThemeToggle } from '../components/ThemeToggle.js';

/**
 * Render the history view
 */
export function renderHistory() {
  document.body.innerHTML = `
    <div class="view history-view">
      <header class="view-header">
        <button type="button" class="back-btn" id="back">&larr;</button>
        <h1>Historique des parties</h1>
        <div class="header-actions" id="headerActions"></div>
      </header>

      <div class="filter-container" id="filterContainer"></div>

      <div class="games-list" id="gamesList"></div>
    </div>
  `;

  document.getElementById('back').addEventListener('click', () => navigate('home'));
  document.getElementById('headerActions').appendChild(createThemeToggle());

  const filterContainer = document.getElementById('filterContainer');
  const gamesList = document.getElementById('gamesList');

  let currentFilters = { playerId: '', modelId: '' };

  function renderGames() {
    let games = getFinishedGames();

    if (currentFilters.modelId) {
      games = games.filter(g => g.modelId === currentFilters.modelId);
    }

    if (currentFilters.playerId) {
      games = games.filter(g =>
        g.players.some(p => p.playerId === currentFilters.playerId)
      );
    }

    games.sort((a, b) => (b.finishedAt || b.createdAt) - (a.finishedAt || a.createdAt));

    gamesList.innerHTML = '';

    if (games.length === 0) {
      gamesList.innerHTML = '<p class="empty-message">Aucune partie terminée</p>';
      return;
    }

    games.forEach(game => {
      const card = createGameCard(game, {
        onClick: (g) => navigate('game', { gameId: g.id }),
        onDelete: (g) => {
          deleteGame(g.id);
          renderGames();
        },
        showDelete: true
      });
      gamesList.appendChild(card);
    });
  }

  const filterBar = createFilterBar({
    onFilter: (filters) => {
      currentFilters = filters;
      renderGames();
    }
  });
  filterContainer.appendChild(filterBar);

  renderGames();
}
