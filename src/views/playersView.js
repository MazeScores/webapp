import { getPlayers, addPlayer, removePlayer } from '../services/playerService.js';
import { renderHome } from './homeView.js';

export function renderPlayers() {
const players = getPlayers();
document.body.innerHTML = `
<h2>Joueurs enregistrés</h2>
<input id="playerName" placeholder="Nom" />
<button id="add">Ajouter</button>
<ul>${players.map(p => `<li>${p} <button data-name="${p}">X</button></li>`).join('')}</ul>
<button id="home">Accueil</button>
`;

document.getElementById('add').onclick = () => {
addPlayer(document.getElementById('playerName').value);
renderPlayers();
};

document.querySelectorAll('button[data-name]').forEach(btn => {
btn.onclick = () => {
removePlayer(btn.dataset.name);
renderPlayers();
};
});

document.getElementById('home').onclick = renderHome;
}