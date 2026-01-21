import { getGames } from "../services/gameService.js";
import { renderHome } from "./homeView.js";

export function renderHistory() {
  const games = getGames();
  document.body.innerHTML =
    '<h2>Historique</h2><button id="home">Accueil</button>' +
    games.map((g) => `<div>${g.name}</div>`).join("");
  document.getElementById("home").onclick = renderHome;
}
