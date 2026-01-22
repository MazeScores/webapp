/**
 * @typedef {import('../types/types.js').Player} Player
 */

import { getPlayers } from '../services/playerService.js';
import { cloneTemplate, fillSlots } from '../utils/template.js';

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
  const frag = cloneTemplate('tpl-player-selector');
  const container = frag.firstElementChild;

  const knownPlayers = getPlayers();

  function render() {
    // Save current selections before rebuilding
    const savedSelections = [];
    container.querySelectorAll('[data-action="selectPlayer"]').forEach((select, i) => {
      const input = container.querySelector(`[data-action="newPlayerName"][data-index="${i}"]`);
      savedSelections.push({
        value: select.value,
        newName: input?.value || ''
      });
    });

    fillSlots(container, {
      countDisplay: String(count),
      countLimits: `(${minPlayers}-${maxPlayers})`
    });

    const decreaseBtn = container.querySelector('[data-action="decreaseCount"]');
    const increaseBtn = container.querySelector('[data-action="increaseCount"]');
    decreaseBtn.disabled = count <= minPlayers;
    increaseBtn.disabled = count >= maxPlayers;

    const playerList = container.querySelector('[data-list="playerInputs"]');
    playerList.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const inputFrag = cloneTemplate('tpl-player-selector-input');
      const inputEl = inputFrag.firstElementChild;

      fillSlots(inputEl, { playerLabel: `Joueur ${i + 1}` });

      const select = inputEl.querySelector('[data-action="selectPlayer"]');
      select.dataset.index = i;
      knownPlayers.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.name;
        opt.dataset.name = p.name;
        select.appendChild(opt);
      });

      const input = inputEl.querySelector('[data-action="newPlayerName"]');
      input.dataset.index = i;

      playerList.appendChild(inputEl);
    }

    // Restore saved selections
    container.querySelectorAll('[data-action="selectPlayer"]').forEach((select, i) => {
      if (savedSelections[i]) {
        select.value = savedSelections[i].value;
        if (savedSelections[i].value === '__new__') {
          const input = container.querySelector(`[data-action="newPlayerName"][data-index="${i}"]`);
          if (input) {
            input.style.display = 'block';
            input.value = savedSelections[i].newName;
          }
        }
      }
    });

    bindEvents();
    refreshDisabledOptions();
  }

  function bindEvents() {
    const decreaseBtn = container.querySelector('[data-action="decreaseCount"]');
    const increaseBtn = container.querySelector('[data-action="increaseCount"]');

    // Clone and replace to remove old listeners
    const newDecrease = decreaseBtn.cloneNode(true);
    decreaseBtn.replaceWith(newDecrease);
    newDecrease.addEventListener('click', () => {
      if (count > minPlayers) {
        count--;
        onCountChange?.(count);
        render();
      }
    });

    const newIncrease = increaseBtn.cloneNode(true);
    increaseBtn.replaceWith(newIncrease);
    newIncrease.addEventListener('click', () => {
      if (count < maxPlayers) {
        count++;
        onCountChange?.(count);
        render();
      }
    });

    container.querySelectorAll('[data-action="selectPlayer"]').forEach(select => {
      select.addEventListener('change', (e) => {
        const index = e.target.dataset.index;
        const input = container.querySelector(`[data-action="newPlayerName"][data-index="${index}"]`);

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

    container.querySelectorAll('[data-action="newPlayerName"]').forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          input.blur();
        }
      });
    });
  }

  function refreshDisabledOptions() {
    const selects = Array.from(container.querySelectorAll('[data-action="selectPlayer"]'));
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
    const selects = Array.from(container.querySelectorAll('[data-action="selectPlayer"]'));

    return selects.map((select, index) => {
      const value = select.value;

      if (value === '__new__') {
        const input = container.querySelector(`[data-action="newPlayerName"][data-index="${index}"]`);
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
