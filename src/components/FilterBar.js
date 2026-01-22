/**
 * @typedef {import('../types/types.js').Player} Player
 * @typedef {import('../types/types.js').GameModel} GameModel
 */

import { getPlayers } from '../services/playerService.js';
import { getAllGameModels } from '../services/gameModelService.js';
import { cloneTemplate } from '../utils/template.js';

/**
 * Create a filter bar component
 * @param {Object} options
 * @param {Function} options.onFilter - Called when filters change
 * @param {boolean} [options.showPlayerFilter=true]
 * @param {boolean} [options.showModelFilter=true]
 * @returns {HTMLElement}
 */
export function createFilterBar({ onFilter, showPlayerFilter = true, showModelFilter = true, initialFilters = {} }) {
  const frag = cloneTemplate('tpl-filter-bar');
  const container = frag.firstElementChild;

  const players = getPlayers();
  const models = getAllGameModels();

  let currentFilters = { playerId: '', modelId: '', ...initialFilters };

  function render() {
    // Model filter
    if (showModelFilter) {
      const modelGroup = container.querySelector('[data-slot="modelFilterGroup"]');
      modelGroup.style.display = '';
      const modelSelect = container.querySelector('[data-action="filterModel"]');
      modelSelect.innerHTML = '<option value="">Tous les jeux</option>';
      models.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = m.label;
        if (currentFilters.modelId === m.id) opt.selected = true;
        modelSelect.appendChild(opt);
      });
    }

    // Player filter
    if (showPlayerFilter) {
      const playerGroup = container.querySelector('[data-slot="playerFilterGroup"]');
      playerGroup.style.display = '';
      const playerSelect = container.querySelector('[data-action="filterPlayer"]');
      playerSelect.innerHTML = '<option value="">Tous les joueurs</option>';
      players.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.name;
        if (currentFilters.playerId === p.id) opt.selected = true;
        playerSelect.appendChild(opt);
      });
    }

    const clearBtn = container.querySelector('[data-action="clearFilters"]');
    clearBtn.disabled = !currentFilters.playerId && !currentFilters.modelId;

    bindEvents();
  }

  function bindEvents() {
    const modelSelect = container.querySelector('[data-action="filterModel"]');
    const playerSelect = container.querySelector('[data-action="filterPlayer"]');
    const clearBtn = container.querySelector('[data-action="clearFilters"]');

    // Remove old listeners by cloning
    if (modelSelect) {
      const newModelSelect = modelSelect.cloneNode(true);
      modelSelect.replaceWith(newModelSelect);
      newModelSelect.addEventListener('change', (e) => {
        currentFilters.modelId = e.target.value;
        emitFilter();
      });
    }

    if (playerSelect) {
      const newPlayerSelect = playerSelect.cloneNode(true);
      playerSelect.replaceWith(newPlayerSelect);
      newPlayerSelect.addEventListener('change', (e) => {
        currentFilters.playerId = e.target.value;
        emitFilter();
      });
    }

    if (clearBtn) {
      const newClearBtn = clearBtn.cloneNode(true);
      clearBtn.replaceWith(newClearBtn);
      newClearBtn.addEventListener('click', () => {
        currentFilters = { playerId: '', modelId: '' };
        render();
        emitFilter();
      });
    }
  }

  function emitFilter() {
    onFilter?.(currentFilters);
    render();
  }

  container.getFilters = function() {
    return { ...currentFilters };
  };

  container.setFilters = function(filters) {
    currentFilters = { ...currentFilters, ...filters };
    render();
    emitFilter();
  };

  render();
  return container;
}
