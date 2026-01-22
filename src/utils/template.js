/**
 * Clone a <template> element by its ID and return its content as a DocumentFragment.
 * @param {string} id - Template element ID (without #)
 * @returns {DocumentFragment}
 */
export function cloneTemplate(id) {
  const tpl = document.getElementById(id);
  if (!tpl) throw new Error(`Template not found: #${id}`);
  return tpl.content.cloneNode(true);
}

/**
 * Fill data-slot elements inside a container with text or DOM elements.
 * @param {Element|DocumentFragment} container
 * @param {Object.<string, string|number|Element>} data - Keys match data-slot values
 */
export function fillSlots(container, data) {
  for (const [name, value] of Object.entries(data)) {
    const slot = container.querySelector(`[data-slot="${name}"]`);
    if (!slot) continue;

    if (value instanceof Element || value instanceof DocumentFragment) {
      slot.appendChild(value);
    } else {
      slot.textContent = String(value);
    }
  }
}

/**
 * Append a list of elements into a data-list container.
 * @param {Element|DocumentFragment} container
 * @param {string} listName - The data-list attribute value
 * @param {Element[]} items - Elements to append
 */
export function fillList(container, listName, items) {
  const list = container.querySelector(`[data-list="${listName}"]`);
  if (!list) return;

  for (const item of items) {
    list.appendChild(item);
  }
}
