/**
 * Feature Flags Configuration
 * =============================
 * Centralized feature toggles that can be controlled via
 * environment variables or runtime configuration.
 *
 * Usage:
 *   import { features } from '@/config/features';
 *   if (features.isEnabled('chatAI')) { ... }
 */

import { config } from './env';

/**
 * Feature flag definitions with metadata.
 */
const FEATURE_DEFINITIONS = {
  chatAI: {
    name: 'Chat IA',
    description: 'Chat conversacional con Gemini AI',
    default: true,
  },
  b2bDashboard: {
    name: 'Dashboard B2B',
    description: 'Panel de administración para universidades',
    default: true,
  },
  experts: {
    name: 'Expertos',
    description: 'Directorio de psicólogos y agendamiento de citas',
    default: true,
  },
  gamification: {
    name: 'Gamificación',
    description: 'Sistema de plumas, insignias y rachas',
    default: true,
  },
  wellness: {
    name: 'Wellness Challenges',
    description: 'Retos de bienestar mental',
    default: true,
  },
  sosProtocol: {
    name: 'Protocolo SOS',
    description: 'Protocolo de intervención en crisis I-CARE',
    default: true,
  },
  ambientAudio: {
    name: 'Audio Ambiental',
    description: 'Música ambient para relajación',
    default: true,
  },
};

export const features = {
  /**
   * Check if a feature is enabled.
   * Checks env config first, falls back to feature definitions.
   * @param {string} featureName
   * @returns {boolean}
   */
  isEnabled(featureName) {
    // Check env-based flags first
    if (config.features[featureName] !== undefined) {
      return config.features[featureName];
    }
    // Fallback to definition defaults
    return FEATURE_DEFINITIONS[featureName]?.default ?? false;
  },

  /**
   * Get all feature definitions.
   * @returns {object}
   */
  getAll() {
    return Object.entries(FEATURE_DEFINITIONS).map(([key, def]) => ({
      key,
      ...def,
      enabled: this.isEnabled(key),
    }));
  },
};

export default features;
