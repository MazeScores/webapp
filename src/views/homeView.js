/**
 * @typedef {import('../types/types.js').Game} Game
 */

import { navigate } from '../router.js';
import { getGamesInProgress } from '../services/gameService.js';
import { createGameCard } from '../components/GameCard.js';
import { createThemeToggle } from '../components/ThemeToggle.js';

/**
 * Render the home view
 */
export function renderHome() {
  const gamesInProgress = getGamesInProgress();

  document.body.innerHTML = `
    <div class="view home-view">
      <header class="view-header">
        <div class="header-info">
          <h1>MazeScores</h1>
          <p class="subtitle">Gestion de scores de jeux de société</p>
        </div>
        <div class="header-actions" id="headerActions"></div>
      </header>

      <nav class="main-nav">
        <button type="button" class="nav-btn primary" id="newGame">
          <span class="btn-icon">+</span>
          Nouvelle partie
        </button>
        <button type="button" class="nav-btn" id="history">
          Historique
        </button>
        <button type="button" class="nav-btn" id="players">
          Joueurs
        </button>
        <button type="button" class="nav-btn" id="models">
          Modèles de jeux
        </button>
      </nav>

      ${gamesInProgress.length > 0 ? `
        <section class="in-progress-section">
          <h2>Parties en cours (${gamesInProgress.length})</h2>
          <div class="games-list" id="gamesInProgress"></div>
        </section>
      ` : ''}
    </div>
  `;

  document.getElementById('newGame').addEventListener('click', () => navigate('newGame'));
  document.getElementById('history').addEventListener('click', () => navigate('history'));
  document.getElementById('players').addEventListener('click', () => navigate('players'));
  document.getElementById('models').addEventListener('click', () => navigate('models'));

  document.getElementById('headerActions').appendChild(createThemeToggle());

  const gamesContainer = document.getElementById('gamesInProgress');
  if (gamesContainer) {
    gamesInProgress.forEach(game => {
      const card = createGameCard(game, {
        onClick: (g) => navigate('game', { gameId: g.id })
      });
      gamesContainer.appendChild(card);
    });
  }
}
