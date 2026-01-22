import { cloneTemplate, fillSlots } from '../utils/template.js';

/**
 * Render the new game view
 * @param {import('../types/types.js').GameModel[]} models
 * @param {import('../types/types.js').GameModel} defaultModel
 * @returns {DocumentFragment}
 */
export function renderNewGame(models, defaultModel) {
  const frag = cloneTemplate('tpl-newGame');

  const select = frag.querySelector('[data-slot="modelSelect"]');
  models.forEach(m => {
    const option = document.createElement('option');
    option.value = m.id;
    option.textContent = m.label;
    select.appendChild(option);
  });

  fillSlots(frag, {
    modelDescription: defaultModel.description
  });

  return frag;
}
