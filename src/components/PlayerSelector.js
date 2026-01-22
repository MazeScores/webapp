/**
 * @typedef {import('../types/types.js').Player} Player
 */

import { getPlayers } from '../services/playerService.js';

/**
 * Create a player selector component
 * @param {Object} options
 * @param {number} options.count - Number of player selectors
 * @param {number} options.minPlayers
 * @param {number} options.maxPlayers
 * @param {Function} options.onCountChange - Called when player count changes
 * @returns {HTMLElement}
 */
export function createPlayerSelector({ count, minPlayers, maxPlayers, onCountChange }) {
  const container = document.createElement('div');
  container.className = 'player-selector';

  const knownPlayers = getPlayers();

  function render() {
    container.innerHTML = `
      <div class="player-count-control">
        <label>Nombre de joueurs</label>
        <div class="count-buttons">
          <button type="button" id="decreaseCount" ${count <= minPlayers ? 'disabled' : ''}>-</button>
          <span class="count-display">${count}</span>
          <button type="button" id="increaseCount" ${count >= maxPlayers ? 'disabled' : ''}>+</button>
        </div>
        <span class="count-limits">(${minPlayers}-${maxPlayers})</span>
      </div>

      <div class="player-list" id="playerList">
        ${Array.from({ length: count }).map((_, i) => `
          <div class="player-input">
            <label>Joueur ${i + 1}</label>
            <select data-index="${i}">
              <option value="">-- Sélectionner --</option>
              <option value="__new__">+ Nouveau joueur</option>
              ${knownPlayers.map(p => `<option value="${p.id}" data-name="${p.name}">${p.name}</option>`).join('')}
            </select>
            <input type="text" class="new-player-input" placeholder="Nom du nouveau joueur" style="display:none" data-index="${i}" />
          </div>
        `).join('')}
      </div>
    `;

    bindEvents();
    refreshDisabledOptions();
  }

  function bindEvents() {
    container.querySelector('#decreaseCount')?.addEventListener('click', () => {
      if (count > minPlayers) {
        count--;
        onCountChange?.(count);
        render();
      }
    });

    container.querySelector('#increaseCount')?.addEventListener('click', () => {
      if (count < maxPlayers) {
        count++;
        onCountChange?.(count);
        render();
      }
    });

    container.querySelectorAll('select[data-index]').forEach(select => {
      select.addEventListener('change', (e) => {
        const index = e.target.dataset.index;
        const input = container.querySelector(`input.new-player-input[data-index="${index}"]`);

        if (e.target.value === '__new__') {
          input.style.display = 'block';
          input.focus();
        } else {
          input.style.display = 'none';
          input.value = '';
        }

        refreshDisabledOptions();
      });
    });
  }

  function refreshDisabledOptions() {
    const selects = Array.from(container.querySelectorAll('select[data-index]'));
    const selectedValues = selects.map(s => s.value).filter(v => v && v !== '__new__');

    selects.forEach(select => {
      Array.from(select.options).forEach(opt => {
        if (opt.value && opt.value !== '__new__') {
          opt.disabled = selectedValues.includes(opt.value) && opt.value !== select.value;
        }
      });
    });
  }

  /**
   * Get selected players
   * @returns {Array<{playerId: string, playerName: string}>}
   */
  container.getSelectedPlayers = function() {
    const selects = Array.from(container.querySelectorAll('select[data-index]'));

    return selects.map((select, index) => {
      const value = select.value;

      if (value === '__new__') {
        const input = container.querySelector(`input.new-player-input[data-index="${index}"]`);
        const name = input?.value?.trim() || `Joueur ${index + 1}`;
        return {
          playerId: crypto.randomUUID(),
          playerName: name
        };
      }

      if (value) {
        const option = select.options[select.selectedIndex];
        return {
          playerId: value,
          playerName: option.dataset.name || option.textContent
        };
      }

      return {
        playerId: crypto.randomUUID(),
        playerName: `Joueur ${index + 1}`
      };
    });
  };

  /**
   * Validate player selection
   * @returns {{valid: boolean, error?: string}}
   */
  container.validate = function() {
    const players = container.getSelectedPlayers();
    const names = players.map(p => p.playerName.toLowerCase());
    const uniqueNames = new Set(names);

    if (uniqueNames.size !== names.length) {
      return { valid: false, error: 'Chaque joueur doit avoir un nom unique' };
    }

    if (players.some(p => !p.playerName.trim())) {
      return { valid: false, error: 'Tous les joueurs doivent avoir un nom' };
    }

    return { valid: true };
  };

  render();
  return container;
}
