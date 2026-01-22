/**
 * @typedef {import('../types/types.js').Game} Game
 */

export const store = {
  /** @type {string} */
  currentView: 'home',

  /** @type {Object} */
  viewParams: {},

  /** @type {Game|null} */
  currentGame: null,

  /** @type {number|null} */
  saveTimeout: null,

  /** @type {{playerId: string, modelId: string}|null} */
  historyFilters: null
};
