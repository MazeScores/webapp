/**
 * @typedef {import('../types/types.js').GameModel} GameModel
 */

import gameModelsData from '../data/gameModels.js';

/** @type {GameModel[]} */
const gameModels = gameModelsData;

/**
 * Get all game models
 * @returns {GameModel[]}
 */
export function getAllGameModels() {
  return gameModels;
}

/**
 * Get a game model by ID
 * @param {string} id
 * @returns {GameModel|undefined}
 */
export function getGameModel(id) {
  return gameModels.find(m => m.id === id);
}

/**
 * Get game models as object indexed by ID (for compatibility)
 * @returns {Object.<string, GameModel>}
 */
export function getGameModelsMap() {
  return gameModels.reduce((acc, model) => {
    acc[model.id] = model;
    return acc;
  }, {});
}

export const GameModels = getGameModelsMap();
