const STORAGE_PREFIX = 'mazescores_';

/**
 * Get data from localStorage
 * @template T
 * @param {string} key
 * @param {T} defaultValue
 * @returns {T}
 */
export function getData(key, defaultValue) {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Save data to localStorage
 * @template T
 * @param {string} key
 * @param {T} value
 */
export function setData(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}