/**
 * Storage Utility
 * ================
 * Type-safe localStorage wrapper with:
 * - Automatic JSON serialization/deserialization
 * - Consistent key prefixing
 * - Error handling for corrupted data
 * - TTL (time-to-live) support
 *
 * Usage:
 *   import { storage } from '@/utils/storage';
 *   storage.set('user', { name: 'Test' });
 *   const user = storage.get('user', null);
 */

const PREFIX = 'mente-libre-';

/**
 * Safely parse JSON with a fallback value.
 * @param {string | null} str
 * @param {*} fallback
 * @returns {*}
 */
function safeParse(str, fallback) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    console.warn(`[Storage] Failed to parse value, using fallback`);
    return fallback;
  }
}

export const storage = {
  /**
   * Get a value from localStorage.
   * @param {string} key - Key without prefix
   * @param {*} fallback - Default value if key doesn't exist or is expired
   * @returns {*}
   */
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw === null) return fallback;

      // Check for TTL wrapper
      const parsed = safeParse(raw, null);
      if (parsed && parsed.__ttl) {
        if (Date.now() > parsed.__ttl) {
          this.remove(key);
          return fallback;
        }
        return parsed.value;
      }

      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  },

  /**
   * Get a raw string value (no JSON parsing).
   * @param {string} key
   * @param {string} fallback
   * @returns {string}
   */
  getRaw(key, fallback = '') {
    try {
      return localStorage.getItem(PREFIX + key) || fallback;
    } catch {
      return fallback;
    }
  },

  /**
   * Set a value in localStorage.
   * @param {string} key - Key without prefix
   * @param {*} value - Value to store (will be JSON-serialized)
   * @param {{ ttl?: number }} options - Optional TTL in milliseconds
   */
  set(key, value, { ttl } = {}) {
    try {
      if (ttl) {
        const wrapper = { value, __ttl: Date.now() + ttl };
        localStorage.setItem(PREFIX + key, JSON.stringify(wrapper));
      } else {
        localStorage.setItem(PREFIX + key, JSON.stringify(value));
      }
    } catch (err) {
      console.error(`[Storage] Failed to set "${key}":`, err);
    }
  },

  /**
   * Set a raw string value (no JSON serialization).
   * @param {string} key
   * @param {string} value
   */
  setRaw(key, value) {
    try {
      localStorage.setItem(PREFIX + key, value);
    } catch (err) {
      console.error(`[Storage] Failed to set "${key}":`, err);
    }
  },

  /**
   * Remove a value from localStorage.
   * @param {string} key
   */
  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {
      // Silently fail
    }
  },

  /**
   * Check if a key exists.
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return localStorage.getItem(PREFIX + key) !== null;
  },

  /**
   * Clear all mente-libre prefixed keys.
   */
  clearAll() {
    try {
      const keys = Object.keys(localStorage).filter((k) =>
        k.startsWith(PREFIX)
      );
      keys.forEach((k) => localStorage.removeItem(k));
    } catch {
      // Silently fail
    }
  },
};

export default storage;
