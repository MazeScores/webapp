const STORAGE_PREFIX = 'mazescores_';

/**
 * Get data from localStorage
 * @template T
 * @param {string} key
 * @param {T} defaultValue
 * @returns {T}
 */
export function getData(key, defaultValue) {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Save data to localStorage
 * @template T
 * @param {string} key
 * @param {T} value
 */
export function setData(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

/**
 * Remove data from localStorage
 * @param {string} key
 */
export function removeData(key) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}

/**
 * Migrate old data format to new format
 * Converts string[] players to Player[] objects
 */
export function migrateData() {
  const oldPlayersKey = 'knownPlayers';
  const oldPlayers = localStorage.getItem(oldPlayersKey);

  if (oldPlayers && !localStorage.getItem(STORAGE_PREFIX + 'players')) {
    try {
      const playerNames = JSON.parse(oldPlayers);
      if (Array.isArray(playerNames) && playerNames.length > 0 && typeof playerNames[0] === 'string') {
        const migratedPlayers = playerNames.map(name => ({
          id: crypto.randomUUID(),
          name,
          createdAt: Date.now()
        }));
        setData('players', migratedPlayers);
        console.log('Migrated players data to new format');
      }
    } catch (error) {
      console.error('Error migrating players data:', error);
    }
  }

  const oldGamesKey = 'games';
  const oldGames = localStorage.getItem(oldGamesKey);

  if (oldGames && !localStorage.getItem(STORAGE_PREFIX + 'games')) {
    try {
      const games = JSON.parse(oldGames);
      if (Array.isArray(games)) {
        const migratedGames = games.map(game => ({
          id: game.id?.toString() || crypto.randomUUID(),
          modelId: game.model || 'base',
          name: game.name || 'Partie sans nom',
          players: (game.players || []).map(p => ({
            playerId: crypto.randomUUID(),
            playerName: typeof p === 'string' ? p : (p.name || 'Joueur'),
            scores: p.scores || [],
            fieldScores: p.fieldScores || {}
          })),
          status: 'finished',
          createdAt: game.id || Date.now(),
          updatedAt: Date.now()
        }));
        setData('games', migratedGames);
        console.log('Migrated games data to new format');
      }
    } catch (error) {
      console.error('Error migrating games data:', error);
    }
  }
}
