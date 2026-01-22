/**
 * @typedef {import('../types/types.js').GameModel} GameModel
 */

import { navigate } from '../router.js';
import { getAllGameModels, getGameModel } from '../services/gameModelService.js';
import { createGame } from '../services/gameService.js';
import { addPlayer, getPlayerByName, isDefaultPlayerName } from '../services/playerService.js';
import { createPlayerSelector } from '../components/PlayerSelector.js';
import { createThemeToggle } from '../components/ThemeToggle.js';

/**
 * Render the new game view
 */
export function renderNewGame() {
  const models = getAllGameModels();
  const defaultModel = models[0];

  let currentModelId = defaultModel.id;
  let currentModel = defaultModel;
  let playerCount = defaultModel.minPlayers;

  document.body.innerHTML = `
    <div class="view new-game-view">
      <header class="view-header">
        <button type="button" class="back-btn" id="back">&larr;</button>
        <h1>Nouvelle partie</h1>
        <div class="header-actions" id="headerActions"></div>
      </header>

      <form class="new-game-form" id="newGameForm">
        <div class="form-group">
          <label for="model">Modèle de jeu</label>
          <select id="model" required>
            ${models.map(m => `<option value="${m.id}">${m.label}</option>`).join('')}
          </select>
          <p class="model-description" id="modelDescription">${defaultModel.description}</p>
        </div>

        <div class="form-group">
          <label for="name">Nom de la partie</label>
          <input type="text" id="name" placeholder="Nouvelle partie" />
        </div>

        <div class="form-group" id="playerSelectorContainer"></div>

        <div class="form-actions">
          <button type="button" class="btn secondary" id="cancel">Annuler</button>
          <button type="submit" class="btn primary">Créer la partie</button>
        </div>
      </form>
    </div>
  `;

  const modelSelect = document.getElementById('model');
  const modelDescription = document.getElementById('modelDescription');
  const playerSelectorContainer = document.getElementById('playerSelectorContainer');

  function renderPlayerSelector() {
    playerSelectorContainer.innerHTML = '';
    const selector = createPlayerSelector({
      count: playerCount,
      minPlayers: currentModel.minPlayers,
      maxPlayers: currentModel.maxPlayers,
      onCountChange: (count) => {
        playerCount = count;
      }
    });
    playerSelectorContainer.appendChild(selector);
  }

  modelSelect.addEventListener('change', () => {
    currentModelId = modelSelect.value;
    currentModel = getGameModel(currentModelId);
    modelDescription.textContent = currentModel.description;
    playerCount = currentModel.minPlayers;
    renderPlayerSelector();
  });

  document.getElementById('back').addEventListener('click', () => navigate('home'));
  document.getElementById('cancel').addEventListener('click', () => navigate('home'));
  document.getElementById('headerActions').appendChild(createThemeToggle());

  document.getElementById('newGameForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const selector = playerSelectorContainer.querySelector('.player-selector');
    const validation = selector?.validate?.();

    if (!validation?.valid) {
      alert(validation?.error || 'Erreur de validation');
      return;
    }

    const selectedPlayers = selector.getSelectedPlayers();

    const players = selectedPlayers.map(p => {
      if (isDefaultPlayerName(p.playerName)) {
        return {
          playerId: p.playerId,
          playerName: p.playerName
        };
      }

      let existingPlayer = getPlayerByName(p.playerName);
      if (!existingPlayer) {
        existingPlayer = addPlayer(p.playerName);
      }
      return {
        playerId: existingPlayer?.id || p.playerId,
        playerName: p.playerName
      };
    });

    const gameName = document.getElementById('name').value.trim();
    const game = createGame(currentModelId, gameName, players);

    navigate('game', { gameId: game.id });
  });

  renderPlayerSelector();
}
