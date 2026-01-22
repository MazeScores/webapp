import { navigate } from '../router.js';
import { getAllGameModels } from '../services/gameModelService.js';
import { renderModels } from '../views/modelsView.js';


/**
 * Models controller
 */
export function modelsController() {
  const models = getAllGameModels();
  const frag = renderModels(models);

  const el = frag.firstElementChild;
  el.querySelector('[data-action="back"]').addEventListener('click', () => navigate('home'));

  document.getElementById('app').appendChild(frag);
}
