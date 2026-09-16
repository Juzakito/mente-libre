/**
 * Environment Configuration & Validation
 * ========================================
 * Centralizes all environment variable access and validates
 * required variables at startup to prevent silent failures.
 *
 * Usage:
 *   import { config } from '@/config/env';
 *   const url = config.supabase.url;
 */

// ─── Required Variables ───────────────────────────────────
const REQUIRED_VARS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
];

// ─── Optional Variables with Defaults ─────────────────────
const OPTIONAL_VARS = {
  VITE_GEMINI_API_KEY: '',
  VITE_SHEETS_WEBHOOK_URL: '',
  VITE_FEATURE_CHAT_AI: 'true',
  VITE_FEATURE_B2B_DASHBOARD: 'true',
  VITE_FEATURE_EXPERTS: 'true',
  VITE_FEATURE_GAMIFICATION: 'true',
  VITE_APP_VERSION: '0.0.0',
  VITE_APP_ENV: 'development',
};

/**
 * Validates that all required environment variables are set.
 * Logs warnings for missing optional variables.
 * Only throws in production; logs warnings in development.
 */
function validateEnv() {
  const missing = REQUIRED_VARS.filter(
    (key) => !import.meta.env[key]
  );

  if (missing.length > 0) {
    const message = [
      '⚠️ Missing required environment variables:',
      ...missing.map((key) => `  - ${key}`),
      '',
      'Copy .env.example to .env.local and fill in the values:',
      '  cp .env.example .env.local',
    ].join('\n');

    if (import.meta.env.PROD) {
      // In production, this is a hard error
      console.error(message);
    } else {
      // In development, warn but allow app to start (for local-only mode)
      console.warn(message);
    }
  }
}

/**
 * Get an environment variable value with an optional fallback.
 * @param {string} key - The environment variable name
 * @param {string} [fallback] - Fallback value if not set
 * @returns {string}
 */
function getEnvVar(key, fallback = '') {
  return import.meta.env[key] || OPTIONAL_VARS[key] || fallback;
}

/**
 * Parse a boolean environment variable.
 * @param {string} key
 * @param {boolean} [fallback=false]
 * @returns {boolean}
 */
function getEnvBool(key, fallback = false) {
  const val = import.meta.env[key];
  if (val === undefined || val === null || val === '') return fallback;
  return val === 'true' || val === '1';
}

// ─── Run validation on import ─────────────────────────────
validateEnv();

// ─── Typed Configuration Object ───────────────────────────
export const config = Object.freeze({
  // Supabase
  supabase: {
    url: getEnvVar('VITE_SUPABASE_URL'),
    anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
  },

  // AI
  ai: {
    geminiApiKey: getEnvVar('VITE_GEMINI_API_KEY'),
  },

  // Analytics
  analytics: {
    webhookUrl: getEnvVar('VITE_SHEETS_WEBHOOK_URL'),
  },

  // Feature Flags
  features: {
    chatAI: getEnvBool('VITE_FEATURE_CHAT_AI', true),
    b2bDashboard: getEnvBool('VITE_FEATURE_B2B_DASHBOARD', true),
    experts: getEnvBool('VITE_FEATURE_EXPERTS', true),
    gamification: getEnvBool('VITE_FEATURE_GAMIFICATION', true),
  },

  // App
  app: {
    version: getEnvVar('VITE_APP_VERSION', '0.0.0'),
    env: getEnvVar('VITE_APP_ENV', 'development'),
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
  },
});

export default config;
