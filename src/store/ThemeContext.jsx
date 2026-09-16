/**
 * Theme Context
 * ==============
 * Manages application theme (light/dark mode).
 * Persists preference to localStorage.
 * Applies data-theme attribute to <html> for CSS custom properties.
 *
 * Lightweight context — only re-renders when theme actually changes.
 */

import React, { createContext, useState, useContext, useCallback } from 'react';

const ThemeContext = createContext(null);

// ─── Constants ────────────────────────────────────────────
const STORAGE_KEY = 'mente-libre-theme';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === THEME_LIGHT || saved === THEME_DARK) return saved;

    // Respect system preference if no saved preference
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return THEME_DARK;
    }
    return THEME_LIGHT;
  });

  // Apply theme to DOM and persist
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === THEME_LIGHT ? THEME_DARK : THEME_LIGHT));
  }, []);

  const isDark = theme === THEME_DARK;

  const value = React.useMemo(
    () => ({ theme, toggleTheme, isDark }),
    [theme, toggleTheme, isDark]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

/**
 * Hook to access theme state.
 * Must be used within a ThemeProvider.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
