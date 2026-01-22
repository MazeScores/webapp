import { navigate } from '../router.js';
import { getGamesInProgress } from '../services/gameService.js';
import { renderHome } from '../views/homeView.js';
import { createGameCard } from '../components/GameCard.js';


/**
 * Home controller
 */
export function homeController() {
  const gamesInProgress = getGamesInProgress();
  const frag = renderHome(gamesInProgress);

  const el = frag.firstElementChild;

  el.querySelector('[data-action="newGame"]').addEventListener('click', () => navigate('newGame'));
  el.querySelector('[data-action="history"]').addEventListener('click', () => navigate('history'));
  el.querySelector('[data-action="players"]').addEventListener('click', () => navigate('players'));
  el.querySelector('[data-action="models"]').addEventListener('click', () => navigate('models'));
  el.querySelector('[data-action="options"]').addEventListener('click', () => navigate('options'));

  const gamesContainer = el.querySelector('[data-list="gamesInProgress"]');
  if (gamesContainer) {
    gamesInProgress.forEach(game => {
      const card = createGameCard(game, {
        onClick: (g) => navigate('game', { gameId: g.id })
      });
      gamesContainer.appendChild(card);
    });
  }

  document.getElementById('app').appendChild(frag);
}
