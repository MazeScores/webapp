import { cloneTemplate } from '../utils/template.js';

/**
 * Render the options view
 * @returns {DocumentFragment}
 */
export function renderOptions() {
  return cloneTemplate('tpl-options');
}
