/**
 * @typedef {import('../types/types.js').Player} Player
 */

import { getData, setData } from './storageService.js';
import { updatePlayerNameInGames, anonymizePlayerInGames } from './gameService.js';

const STORAGE_KEY = 'players';
const DEFAULT_PLAYER_PATTERN = /^Joueur \d+$/;

/**
 * Check if a name is a default player name (e.g., "Joueur 1", "Joueur 2")
 * @param {string} name
 * @returns {boolean}
 */
export function isDefaultPlayerName(name) {
  return DEFAULT_PLAYER_PATTERN.test(name?.trim() || '');
}

/**
 * Get all players
 * @returns {Player[]}
 */
export function getPlayers() {
  return getData(STORAGE_KEY, []);
}

/**
 * Get a player by ID
 * @param {string} id
 * @returns {Player|undefined}
 */
export function getPlayer(id) {
  return getPlayers().find(p => p.id === id);
}

/**
 * Get a player by name
 * @param {string} name
 * @returns {Player|undefined}
 */
export function getPlayerByName(name) {
  return getPlayers().find(p => p.name.toLowerCase() === name.toLowerCase());
}

/**
 * Add a new player
 * @param {string} name
 * @returns {Player|null}
 */
export function addPlayer(name) {
  const trimmedName = name?.trim();
  if (!trimmedName) return null;

  const players = getPlayers();

  if (players.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
    return null;
  }

  /** @type {Player} */
  const newPlayer = {
    id: crypto.randomUUID(),
    name: trimmedName,
    createdAt: Date.now()
  };

  players.push(newPlayer);
  setData(STORAGE_KEY, players);

  return newPlayer;
}

/**
 * Update a player
 * @param {string} id
 * @param {Partial<Player>} updates
 * @returns {Player|null}
 */
export function updatePlayer(id, updates) {
  const players = getPlayers();
  const index = players.findIndex(p => p.id === id);

  if (index === -1) return null;

  const oldName = players[index].name;

  if (updates.name) {
    const trimmedName = updates.name.trim();
    const duplicate = players.some(
      p => p.id !== id && p.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (duplicate) return null;
    updates.name = trimmedName;
  }

  players[index] = { ...players[index], ...updates };
  setData(STORAGE_KEY, players);

  if (updates.name && updates.name !== oldName) {
    updatePlayerNameInGames(id, updates.name);
  }

  return players[index];
}

/**
 * Remove a player
 * @param {string} id
 * @returns {boolean}
 */
export function removePlayer(id) {
  const players = getPlayers();
  const filtered = players.filter(p => p.id !== id);

  if (filtered.length === players.length) return false;

  setData(STORAGE_KEY, filtered);
  anonymizePlayerInGames(id);
  return true;
}
