/**
 * @typedef {import('../types/types.js').Game} Game
 */

import { getGameModel } from '../services/gameModelService.js';
import { createScoreTableRounds } from './ScoreTableRounds.js';
import { createScoreTableCalculated } from './ScoreTableCalculated.js';

/**
 * Factory function to create the appropriate score table based on game model type
 * @param {Game} game
 * @param {Object} [options]
 * @param {boolean} [options.editable=true]
 * @param {boolean} [options.sorted=false]
 * @returns {HTMLElement}
 */
export function createScoreTable(game, options = {}) {
  const model = getGameModel(game.modelId);

  if (!model) {
    const error = document.createElement('div');
    error.className = 'error';
    error.textContent = `Modèle de jeu inconnu: ${game.modelId}`;
    return error;
  }

  if (model.type === 'calculated') {
    return createScoreTableCalculated(game, model, options);
  }

  return createScoreTableRounds(game, options);
}
