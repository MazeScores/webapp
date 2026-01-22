import { navigate } from '../router.js';
import { getFinishedGames, deleteGame } from '../services/gameService.js';
import { renderHistory } from '../views/historyView.js';
import { createGameCard } from '../components/GameCard.js';
import { createFilterBar } from '../components/FilterBar.js';

import { store } from '../state/store.js';

/**
 * History controller
 */
export function historyController() {
  const frag = renderHistory();
  const el = frag.firstElementChild;

  el.querySelector('[data-action="back"]').addEventListener('click', () => navigate('home'));

  const gamesList = el.querySelector('[data-list="gamesList"]');
  let currentFilters = store.historyFilters || { playerId: '', modelId: '' };

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
    initialFilters: currentFilters,
    onFilter: (filters) => {
      currentFilters = filters;
      store.historyFilters = filters;
      renderGames();
    }
  });
  el.querySelector('[data-slot="filterContainer"]').appendChild(filterBar);

  renderGames();

  document.getElementById('app').appendChild(frag);
}
