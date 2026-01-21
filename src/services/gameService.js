const GAME_KEY = 'games';

export function getGames() {
return JSON.parse(localStorage.getItem(GAME_KEY) || '[]');
}

export function saveGame(game) {
const games = getGames();
const baseName = game.name;
const same = games.filter(g => g.name === baseName || g.name.startsWith(baseName + ' ('));
if (same.length > 0) {
game.name = `${baseName} (${same.length + 1})`;
}
games.push(game);
localStorage.setItem(GAME_KEY, JSON.stringify(games));
}