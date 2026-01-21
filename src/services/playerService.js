const PLAYER_KEY = 'knownPlayers';

export function getPlayers() {
return JSON.parse(localStorage.getItem(PLAYER_KEY) || '[]');
}

export function addPlayer(name) {
if (!name) return;
const players = getPlayers();
if (!players.includes(name)) {
players.push(name);
localStorage.setItem(PLAYER_KEY, JSON.stringify(players));
}
}

export function removePlayer(name) {
const players = getPlayers().filter(p => p !== name);
localStorage.setItem(PLAYER_KEY, JSON.stringify(players));
}