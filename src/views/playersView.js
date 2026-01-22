import { cloneTemplate, fillSlots, fillList } from '../utils/template.js';

/**
 * Render the players view
 * @param {import('../types/types.js').Player[]} players
 * @returns {DocumentFragment}
 */
export function renderPlayers(players) {
  const frag = cloneTemplate('tpl-players');

  if (players.length === 0) {
    const empty = cloneTemplate('tpl-empty-message');
    fillSlots(empty, { message: 'Aucun joueur enregistré' });
    fillList(frag, 'playersList', [empty.firstElementChild]);
  } else {
    const items = players.map(p => {
      const item = cloneTemplate('tpl-player-item');
      fillSlots(item, { playerName: p.name });
      const el = item.firstElementChild;
      el.dataset.id = p.id;
      return el;
    });
    fillList(frag, 'playersList', items);
  }

  return frag;
}
