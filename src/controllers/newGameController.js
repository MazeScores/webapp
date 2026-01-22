import { navigate } from '../router.js';
import { getAllGameModels, getGameModel } from '../services/gameModelService.js';
import { createGame, getGames } from '../services/gameService.js';
import { addPlayer, getPlayerByName, isDefaultPlayerName } from '../services/playerService.js';
import { renderNewGame } from '../views/newGameView.js';
import { createPlayerSelector } from '../components/PlayerSelector.js';


/**
 * New game controller
 */
export function newGameController() {
  const models = getAllGameModels();
  const defaultModel = models[0];

  let currentModelId = defaultModel.id;
  let currentModel = defaultModel;
  let playerCount = defaultModel.minPlayers;

  const frag = renderNewGame(models, defaultModel);
  const el = frag.firstElementChild;

  el.querySelector('[data-action="back"]').addEventListener('click', () => navigate('home'));
  el.querySelector('[data-action="cancel"]').addEventListener('click', () => navigate('home'));

  const modelSelect = el.querySelector('[data-slot="modelSelect"]');
  const modelDescription = el.querySelector('[data-slot="modelDescription"]');
  const playerSelectorContainer = el.querySelector('[data-slot="playerSelectorContainer"]');
  const nameInput = el.querySelector('[data-slot="nameInput"]');

  function updateNamePlaceholder() {
    const modelLabel = currentModel?.label || 'Partie';
    const sameModelCount = getGames().filter(g => g.modelId === currentModelId).length;
    const expectedName = sameModelCount === 0 ? modelLabel : `${modelLabel} ${sameModelCount + 1}`;
    nameInput.placeholder = expectedName;
  }

  updateNamePlaceholder();

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
    updateNamePlaceholder();
    renderPlayerSelector();
  });

  el.querySelector('[data-action="newGameForm"]').addEventListener('submit', (e) => {
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

    const gameName = el.querySelector('[data-slot="nameInput"]').value.trim();
    const game = createGame(currentModelId, gameName, players);

    navigate('game', { gameId: game.id });
  });

  renderPlayerSelector();

  document.getElementById('app').appendChild(frag);
}
