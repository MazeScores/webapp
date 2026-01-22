/**
 * @typedef {import('../types/types.js').Player} Player
 */

import { navigate } from '../router.js';
import { getPlayers, addPlayer, removePlayer, updatePlayer } from '../services/playerService.js';
import { createThemeToggle } from '../components/ThemeToggle.js';

/**
 * Render the players management view
 */
export function renderPlayers() {
  const players = getPlayers().sort((a, b) => a.name.localeCompare(b.name));

  document.body.innerHTML = `
    <div class="view players-view">
      <header class="view-header">
        <button type="button" class="back-btn" id="back">&larr;</button>
        <h1>Joueurs enregistrés</h1>
        <div class="header-actions" id="headerActions"></div>
      </header>

      <form class="add-player-form" id="addPlayerForm">
        <input type="text" id="playerName" placeholder="Nom du nouveau joueur" required />
        <button type="submit" class="btn primary">Ajouter</button>
      </form>

      <div class="players-list" id="playersList">
        ${players.length === 0 ? '<p class="empty-message">Aucun joueur enregistré</p>' : ''}
        ${players.map(p => `
          <div class="player-item" data-id="${p.id}">
            <span class="player-name">${p.name}</span>
            <div class="player-actions">
              <button type="button" class="edit-btn" data-id="${p.id}" title="Modifier">Modifier</button>
              <button type="button" class="delete-btn" data-id="${p.id}" title="Supprimer">Supprimer</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('back').addEventListener('click', () => navigate('home'));
  document.getElementById('headerActions').appendChild(createThemeToggle());

  document.getElementById('addPlayerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('playerName');
    const name = input.value.trim();

    if (name) {
      const result = addPlayer(name);
      if (result) {
        renderPlayers();
      } else {
        alert('Ce nom de joueur existe déjà');
      }
    }
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const player = players.find(p => p.id === id);
      if (player && confirm(`Supprimer le joueur "${player.name}" ?`)) {
        removePlayer(id);
        renderPlayers();
      }
    });
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const player = players.find(p => p.id === id);
      if (!player) return;

      const newName = prompt('Nouveau nom:', player.name);
      if (newName && newName.trim() !== player.name) {
        const result = updatePlayer(id, { name: newName.trim() });
        if (result) {
          renderPlayers();
        } else {
          alert('Ce nom de joueur existe déjà');
        }
      }
    });
  });
}
