import { GameModels } from '../services/gameModelService.js';
import { getPlayers } from '../services/playerService.js';
import { saveGame } from '../services/gameService.js';
import { renderGame } from './gameView.js';
import { renderHome } from './homeView.js';

export function renderNewGame() {
  const modelOptions = Object.values(GameModels)
    .map(m => `<option value="${m.id}">${m.label}</option>`)
    .join('');

  document.body.innerHTML = `
    <h2>Nouvelle partie</h2>

    <label>Modèle</label>
    <select id="model">${modelOptions}</select>

    <label>Nom de la partie</label>
    <input id="name" />

    <label>Nombre de joueurs</label>
    <input id="players" type="number" />

    <div id="playerList"></div>

    <button id="create">Créer la partie</button>
    <button id="back">Retour</button>
  `;

  document.getElementById('back').onclick = renderHome;

  const modelSelect = document.getElementById('model');
  const playersInput = document.getElementById('players');
  const playerList = document.getElementById('playerList');

  function renderPlayerInputs(count) {
    const knownPlayers = getPlayers();

    playerList.innerHTML = Array.from({ length: count }).map((_, i) => `
      <div>
        <label>Joueur ${i + 1}</label>
        <select data-index="${i}">
          <option value="Joueur ${i + 1}">Joueur ${i + 1}</option>
          ${knownPlayers.map(p => `<option value="${p}">${p}</option>`).join('')}
        </select>
      </div>
    `).join('');

    bindPlayerSelects();
    refreshPlayerSelects();
  }

  function bindPlayerSelects() {
    document.querySelectorAll('[data-index]').forEach(sel => {
      sel.onchange = refreshPlayerSelects;
    });
  }

  function refreshPlayerSelects() {
    const selects = Array.from(document.querySelectorAll('[data-index]'));
    const selectedValues = selects.map(s => s.value);

    selects.forEach(sel => {
      Array.from(sel.options).forEach(opt => {
        opt.disabled =
          selectedValues.includes(opt.value) && opt.value !== sel.value;
      });
    });
  }

  modelSelect.onchange = () => {
    const model = GameModels[modelSelect.value];
    playersInput.min = model.minPlayers;
    playersInput.max = model.maxPlayers;
    playersInput.value = model.minPlayers;
    renderPlayerInputs(model.minPlayers);
  };

  playersInput.oninput = () => {
    const value = Number(playersInput.value);
    if (value >= playersInput.min && value <= playersInput.max) {
      renderPlayerInputs(value);
    }
  };

  // Initialisation
  modelSelect.onchange();

  document.getElementById('create').onclick = () => {
    const selects = document.querySelectorAll('[data-index]');

    const players = Array.from(selects).map(sel => ({
      name: sel.value,
      scores: []
    }));

    const game = {
      id: Date.now(),
      model: modelSelect.value,
      name: document.getElementById('name').value || 'Nouvelle partie',
      players
    };

    saveGame(game);
    renderGame(game);
  };
}
