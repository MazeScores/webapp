import { navigate } from '../router.js';
import { getPlayers, addPlayer, removePlayer, updatePlayer } from '../services/playerService.js';
import { renderPlayers } from '../views/playersView.js';


/**
 * Players controller
 */
export function playersController() {
  const players = getPlayers().sort((a, b) => a.name.localeCompare(b.name));
  const frag = renderPlayers(players);

  const el = frag.firstElementChild;

  el.querySelector('[data-action="back"]').addEventListener('click', () => navigate('home'));

  el.querySelector('[data-action="addPlayerForm"]').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = el.querySelector('[data-slot="playerNameInput"]');
    const name = input.value.trim();

    if (name) {
      const result = addPlayer(name);
      if (result) {
        rerender();
      } else {
        alert('Ce nom de joueur existe déjà');
      }
    }
  });

  el.querySelectorAll('[data-action="deletePlayer"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.player-item');
      const id = item.dataset.id;
      const player = players.find(p => p.id === id);
      if (player && confirm(`Supprimer le joueur "${player.name}" ?`)) {
        removePlayer(id);
        rerender();
      }
    });
  });

  el.querySelectorAll('[data-action="editPlayer"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.player-item');
      const id = item.dataset.id;
      const player = players.find(p => p.id === id);
      if (!player) return;

      const newName = prompt('Nouveau nom:', player.name);
      if (newName && newName.trim() !== player.name) {
        const result = updatePlayer(id, { name: newName.trim() });
        if (result) {
          rerender();
        } else {
          alert('Ce nom de joueur existe déjà');
        }
      }
    });
  });

  document.getElementById('app').appendChild(frag);

  function rerender() {
    document.getElementById('app').innerHTML = '';
    playersController();
  }
}
