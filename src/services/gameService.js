/**
 * @typedef {import('../types/types.js').Game} Game
 * @typedef {import('../types/types.js').PlayerScore} PlayerScore
 * @typedef {import('../types/types.js').GameStatus} GameStatus
 */

import { getData, setData } from './storageService.js';
import { getGameModel } from './gameModelService.js';
import { store } from '../state/store.js';

const STORAGE_KEY = 'games';
const AUTOSAVE_DELAY = 500;

/**
 * Get all games
 * @returns {Game[]}
 */
export function getGames() {
  return getData(STORAGE_KEY, []);
}

/**
 * Get games by status
 * @param {GameStatus} status
 * @returns {Game[]}
 */
export function getGamesByStatus(status) {
  return getGames().filter(g => g.status === status);
}

/**
 * Get games in progress
 * @returns {Game[]}
 */
export function getGamesInProgress() {
  return getGamesByStatus('in_progress');
}

/**
 * Get finished games
 * @returns {Game[]}
 */
export function getFinishedGames() {
  return getGamesByStatus('finished');
}

/**
 * Get a game by ID
 * @param {string} id
 * @returns {Game|undefined}
 */
export function getGame(id) {
  return getGames().find(g => g.id === id);
}

/**
 * Create a new game
 * @param {string} modelId
 * @param {string} name
 * @param {Array<{playerId: string, playerName: string}>} players
 * @returns {Game}
 */
export function createGame(modelId, name, players) {
  const games = getGames();
  const model = getGameModel(modelId);
  const now = Date.now();

  let gameName = name;
  if (!gameName) {
    const modelLabel = model?.label || 'Partie';
    const sameModelCount = games.filter(g => g.modelId === modelId).length;
    gameName = sameModelCount === 0 ? modelLabel : `${modelLabel} ${sameModelCount + 1}`;
  }

  /** @type {Game} */
  const game = {
    id: crypto.randomUUID(),
    modelId,
    name: gameName,
    players: players.map(p => ({
      playerId: p.playerId,
      playerName: p.playerName,
      scores: model?.type === 'rounds' ? [null] : [],
      fieldScores: model?.type === 'calculated' ? {} : undefined
    })),
    status: 'in_progress',
    createdAt: now,
    updatedAt: now
  };

  games.push(game);
  setData(STORAGE_KEY, games);

  return game;
}

/**
 * Save game (internal)
 * @param {Game[]} games
 */
function saveGames(games) {
  setData(STORAGE_KEY, games);
}

/**
 * Update a game
 * @param {string} id
 * @param {Partial<Game>} updates
 * @returns {Game|null}
 */
export function updateGame(id, updates) {
  const games = getGames();
  const index = games.findIndex(g => g.id === id);

  if (index === -1) return null;

  games[index] = {
    ...games[index],
    ...updates,
    updatedAt: Date.now()
  };

  saveGames(games);
  return games[index];
}

/**
 * Update game with debounced autosave
 * @param {Game} game
 */
export function autoSaveGame(game) {
  if (store.saveTimeout) {
    clearTimeout(store.saveTimeout);
  }

  store.saveTimeout = setTimeout(() => {
    updateGame(game.id, {
      players: game.players,
      updatedAt: Date.now()
    });
    store.saveTimeout = null;
  }, AUTOSAVE_DELAY);
}

/**
 * Add a round to all players in a game (for 'rounds' type)
 * @param {Game} game
 */
export function addRound(game) {
  game.players.forEach(p => p.scores.push(null));
  game.updatedAt = Date.now();
  autoSaveGame(game);
}

/**
 * Update a player's score for a round
 * @param {Game} game
 * @param {number} playerIndex
 * @param {number} roundIndex
 * @param {number} score
 */
export function updateRoundScore(game, playerIndex, roundIndex, score) {
  if (game.players[playerIndex]) {
    game.players[playerIndex].scores[roundIndex] = score;
    game.updatedAt = Date.now();
    autoSaveGame(game);
  }
}

/**
 * Update a player's field score (for 'calculated' type)
 * @param {Game} game
 * @param {number} playerIndex
 * @param {string} fieldId
 * @param {number} score
 */
export function updateFieldScore(game, playerIndex, fieldId, score) {
  if (game.players[playerIndex]) {
    if (!game.players[playerIndex].fieldScores) {
      game.players[playerIndex].fieldScores = {};
    }
    game.players[playerIndex].fieldScores[fieldId] = score;
    game.updatedAt = Date.now();
    autoSaveGame(game);
  }
}

/**
 * Calculate total score for a player
 * @param {PlayerScore} player
 * @param {string} modelId
 * @returns {number}
 */
export function calculatePlayerTotal(player, modelId) {
  const model = getGameModel(modelId);

  if (model?.type === 'calculated' && player.fieldScores) {
    return Object.values(player.fieldScores).reduce((sum, score) => sum + (score || 0), 0);
  }

  return player.scores.reduce((sum, score) => sum + (score || 0), 0);
}

/**
 * Get players sorted by score (descending)
 * @param {Game} game
 * @returns {Array<{player: PlayerScore, total: number, index: number}>}
 */
export function getPlayersSortedByScore(game) {
  return game.players
    .map((player, index) => ({
      player,
      total: calculatePlayerTotal(player, game.modelId),
      index
    }))
    .sort((a, b) => b.total - a.total);
}

/**
 * Finish a game
 * @param {string} id
 * @returns {Game|null}
 */
export function finishGame(id) {
  return updateGame(id, {
    status: 'finished',
    finishedAt: Date.now()
  });
}

/**
 * Delete a game
 * @param {string} id
 * @returns {boolean}
 */
export function deleteGame(id) {
  const games = getGames();
  const filtered = games.filter(g => g.id !== id);

  if (filtered.length === games.length) return false;

  saveGames(filtered);
  return true;
}

/**
 * Anonymize a deleted player in all games
 * @param {string} playerId
 */
export function anonymizePlayerInGames(playerId) {
  const games = getGames();
  let updated = false;
  games.forEach(game => {
    game.players.forEach(player => {
      if (player.playerId === playerId) {
        player.playerName = 'Joueur supprimé';
        player.playerId = '';
        updated = true;
      }
    });
  });
  if (updated) saveGames(games);
}

/**
 * Update player name in all games
 * @param {string} playerId
 * @param {string} newName
 */
export function updatePlayerNameInGames(playerId, newName) {
  const games = getGames();
  let updated = false;

  games.forEach(game => {
    game.players.forEach(player => {
      if (player.playerId === playerId) {
        player.playerName = newName;
        updated = true;
      }
    });
  });

  if (updated) {
    saveGames(games);
  }
}
