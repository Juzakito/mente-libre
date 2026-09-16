/**
 * Custom Hooks Collection
 * ========================
 * Reusable React hooks for common patterns.
 */

import { useState, useEffect, useRef } from 'react';

// ─── useLocalStorage ──────────────────────────────────────
/**
 * useState that persists to localStorage.
 * @param {string} key - localStorage key
 * @param {*} initialValue - Default value
 * @returns {[*, Function]}
 */
export function useLocalStorage(key, initialValue) {
  const prefixedKey = `mente-libre-${key}`;

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(prefixedKey);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(prefixedKey, JSON.stringify(storedValue));
    } catch {
      console.warn(`Failed to persist ${key} to localStorage`);
    }
  }, [prefixedKey, storedValue]);

  return [storedValue, setStoredValue];
}

// ─── useDebounce ──────────────────────────────────────────
/**
 * Debounce a value change.
 * @param {*} value
 * @param {number} delay - Delay in ms
 * @returns {*} Debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ─── useMediaQuery ────────────────────────────────────────
/**
 * React hook for CSS media query matching.
 * @param {string} query - CSS media query string
 * @returns {boolean}
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Convenience: check if viewport is desktop width.
 * @returns {boolean}
 */
export function useIsDesktop() {
  return useMediaQuery('(min-width: 768px)');
}

// ─── useOnlineStatus ──────────────────────────────────────
/**
 * Track browser online/offline status.
 * @returns {boolean}
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// ─── useClickOutside ─────────────────────────────────────
/**
 * Detect clicks outside a referenced element.
 * @param {Function} handler - Callback when click outside occurs
 * @returns {import('react').RefObject}
 */
export function useClickOutside(handler) {
  const ref = useRef(null);

  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]);

  return ref;
}

// ─── usePrevious ──────────────────────────────────────────
/**
 * Track the previous value of a state.
 * @param {*} value
 * @returns {*}
 */
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
