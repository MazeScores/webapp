/**
 * @typedef {Object} Player
 * @property {string} id - UUID
 * @property {string} name
 * @property {number} createdAt - timestamp
 */

/**
 * @typedef {Object} PlayerScore
 * @property {string} playerId
 * @property {string} playerName
 * @property {number[]} scores - for 'rounds' type
 * @property {Object.<string, number>} [fieldScores] - for 'calculated' type
 */

/**
 * @typedef {'in_progress' | 'finished'} GameStatus
 */

/**
 * @typedef {Object} Game
 * @property {string} id - UUID
 * @property {string} modelId
 * @property {string} name
 * @property {PlayerScore[]} players
 * @property {GameStatus} status
 * @property {number} createdAt - timestamp
 * @property {number} updatedAt - timestamp
 * @property {number} [finishedAt] - timestamp
 */

/**
 * @typedef {'rounds' | 'calculated'} GameModelType
 */

/**
 * @typedef {Object} GameModelField
 * @property {string} id
 * @property {string} label
 * @property {string} [icon]
 */

/**
 * @typedef {Object} GameModel
 * @property {string} id
 * @property {string} label
 * @property {string} description
 * @property {number} minPlayers
 * @property {number} maxPlayers
 * @property {GameModelType} type
 * @property {GameModelField[]} [fields] - for 'calculated' type
 */

export {};
