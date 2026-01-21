import { renderNewGame } from './newGameView.js';
import { renderHistory } from './historyView.js';
import { renderPlayers } from './playersView.js';

export function renderHome() {
document.body.innerHTML = `
<h1>Gestion de scores</h1>
<button id="newGame">Nouvelle partie</button>
<button id="history">Historique</button>
<button id="players">Joueurs enregistrés</button>
`;

document.getElementById('newGame').onclick = renderNewGame;
document.getElementById('history').onclick = renderHistory;
document.getElementById('players').onclick = renderPlayers;
}