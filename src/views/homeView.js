import { cloneTemplate, fillSlots } from '../utils/template.js';

/**
 * Render the home view
 * @param {import('../types/types.js').Game[]} gamesInProgress
 * @returns {DocumentFragment}
 */
export function renderHome(gamesInProgress) {
  const frag = cloneTemplate('tpl-home');

  if (gamesInProgress.length > 0) {
    const section = frag.querySelector('[data-slot="inProgressSection"]');
    section.style.display = '';
    fillSlots(frag, {
      inProgressTitle: `Parties en cours (${gamesInProgress.length})`
    });
  }

  return frag;
}
