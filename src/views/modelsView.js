import { cloneTemplate, fillSlots, fillList } from '../utils/template.js';

/**
 * Render the models view
 * @param {import('../types/types.js').GameModel[]} models
 * @returns {DocumentFragment}
 */
export function renderModels(models) {
  const frag = cloneTemplate('tpl-models');

  const cards = models.map(model => {
    const card = cloneTemplate('tpl-model-card');
    fillSlots(card, {
      modelLabel: model.label,
      modelDescription: model.description,
      modelPlayers: `${model.minPlayers}-${model.maxPlayers} joueurs`,
      modelType: model.type === 'rounds' ? 'Par manches' : 'Score calculé'
    });

    if (model.fields && model.fields.length > 0) {
      const fieldsContainer = card.querySelector('[data-list="modelFields"]');
      fieldsContainer.style.display = '';

      model.fields.forEach(f => {
        const tag = cloneTemplate('tpl-field-tag');
        fillSlots(tag, { fieldTag: `${f.icon || ''} ${f.label}` });
        fieldsContainer.appendChild(tag);
      });
    }

    return card.firstElementChild;
  });

  fillList(frag, 'modelsList', cards);
  return frag;
}
