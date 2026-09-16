/**
 * Supabase Client Configuration
 * ===============================
 * Centralized Supabase client with proper configuration.
 * All Supabase interactions should go through this module.
 *
 * Features:
 * - Graceful fallback when env vars are missing (local-only mode)
 * - Centralized error handling
 * - Singleton pattern
 */

import { createClient } from '@supabase/supabase-js';
import { config } from '../../config/env';

const { url, anonKey } = config.supabase;

/**
 * Supabase client instance.
 * Returns null if credentials are not configured (local-only mode).
 * @type {import('@supabase/supabase-js').SupabaseClient | null}
 */
export const supabase =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      })
    : null;

/**
 * Check if Supabase is configured and available.
 * @returns {boolean}
 */
export const isSupabaseConfigured = () => supabase !== null;

/**
 * Generic error handler for Supabase operations.
 * Logs the error and optionally rethrows.
 * @param {Error} error
 * @param {string} context - Description of the operation that failed
 * @param {boolean} [rethrow=false]
 */
export const handleSupabaseError = (error, context, rethrow = false) => {
  console.error(`[Supabase] ${context}:`, error?.message || error);
  if (rethrow) throw error;
};

export default supabase;
