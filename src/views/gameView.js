import { renderHome } from './homeView.js';

export function renderGame(game) {
  document.body.innerHTML = `
    <h2>${game.name}</h2>

    <button id="addRound">Ajouter une manche</button>
    <button id="back">Retour</button>

    <div style="overflow:auto">
      <table border="1" id="table"></table>
    </div>
  `;

  document.getElementById('back').onclick = renderHome;

  const table = document.getElementById('table');

  function renderTable() {
    const rounds = game.players[0]?.scores.length || 0;

    table.innerHTML = `
      <tr>
        <th>Joueur</th>
        ${Array.from({ length: rounds }).map((_, i) => `<th>M${i + 1}</th>`).join('')}
        <th>Total</th>
      </tr>
    `;

    game.players.forEach((p, playerIndex) => {
      const total = p.scores.reduce((a, b) => a + b, 0);

      table.innerHTML += `
        <tr>
          <td>${p.name}</td>
          ${p.scores.map((s, roundIndex) => `
            <td>
              <input type="number"
                     value="${s}"
                     data-player="${playerIndex}"
                     data-round="${roundIndex}" />
            </td>
          `).join('')}
          <td><strong>${total}</strong></td>
        </tr>
      `;
    });
  }

  document.getElementById('addRound').onclick = () => {
    game.players.forEach(p => p.scores.push(0));
    renderTable();
  };

  table.addEventListener('input', (e) => {
    if (e.target.tagName !== 'INPUT') return;

    const p = e.target.dataset.player;
    const r = e.target.dataset.round;
    game.players[p].scores[r] = Number(e.target.value);

    renderTable();
  });

  renderTable();
}
