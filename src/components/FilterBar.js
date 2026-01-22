/**
 * @typedef {import('../types/types.js').Player} Player
 * @typedef {import('../types/types.js').GameModel} GameModel
 */

import { getPlayers } from '../services/playerService.js';
import { getAllGameModels } from '../services/gameModelService.js';

/**
 * Create a filter bar component
 * @param {Object} options
 * @param {Function} options.onFilter - Called when filters change
 * @param {boolean} [options.showPlayerFilter=true]
 * @param {boolean} [options.showModelFilter=true]
 * @returns {HTMLElement}
 */
export function createFilterBar({ onFilter, showPlayerFilter = true, showModelFilter = true }) {
  const container = document.createElement('div');
  container.className = 'filter-bar';

  const players = getPlayers();
  const models = getAllGameModels();

  let currentFilters = {
    playerId: '',
    modelId: ''
  };

  function render() {
    container.innerHTML = `
      ${showModelFilter ? `
        <div class="filter-group">
          <label for="filterModel">Jeu</label>
          <select id="filterModel">
            <option value="">Tous les jeux</option>
            ${models.map(m => `<option value="${m.id}" ${currentFilters.modelId === m.id ? 'selected' : ''}>${m.label}</option>`).join('')}
          </select>
        </div>
      ` : ''}

      ${showPlayerFilter ? `
        <div class="filter-group">
          <label for="filterPlayer">Joueur</label>
          <select id="filterPlayer">
            <option value="">Tous les joueurs</option>
            ${players.map(p => `<option value="${p.id}" ${currentFilters.playerId === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
          </select>
        </div>
      ` : ''}

      <button type="button" class="clear-filters-btn" ${!currentFilters.playerId && !currentFilters.modelId ? 'disabled' : ''}>
        Effacer filtres
      </button>
    `;

    bindEvents();
  }

  function bindEvents() {
    container.querySelector('#filterModel')?.addEventListener('change', (e) => {
      currentFilters.modelId = e.target.value;
      emitFilter();
    });

    container.querySelector('#filterPlayer')?.addEventListener('change', (e) => {
      currentFilters.playerId = e.target.value;
      emitFilter();
    });

    container.querySelector('.clear-filters-btn')?.addEventListener('click', () => {
      currentFilters = { playerId: '', modelId: '' };
      render();
      emitFilter();
    });
  }

  function emitFilter() {
    onFilter?.(currentFilters);
    render();
  }

  /**
   * Get current filter values
   * @returns {{playerId: string, modelId: string}}
   */
  container.getFilters = function() {
    return { ...currentFilters };
  };

  /**
   * Set filter values
   * @param {{playerId?: string, modelId?: string}} filters
   */
  container.setFilters = function(filters) {
    currentFilters = { ...currentFilters, ...filters };
    render();
    emitFilter();
  };

  render();
  return container;
}
