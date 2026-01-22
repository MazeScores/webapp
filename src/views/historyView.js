import { cloneTemplate } from '../utils/template.js';

/**
 * Render the history view shell (games are added dynamically by the controller)
 * @returns {DocumentFragment}
 */
export function renderHistory() {
  return cloneTemplate('tpl-history');
}
