/**
 * Route Constants
 * ================
 * Single source of truth for all application routes.
 * Eliminates magic strings throughout the codebase.
 *
 * Usage:
 *   import { ROUTES } from '@/config/routes';
 *   navigate(ROUTES.APP.FEED);
 */

export const ROUTES = Object.freeze({
  // ─── Public Routes ──────────────────────────────────
  HOME: '/',
  LANDING: '/',
  B2B: '/b2b',
  CODE_ENTRY: '/code-entry',
  ONBOARDING: '/onboarding',
  UPDATE_PASSWORD: '/update-password',

  // ─── Protected Routes (within /app) ─────────────────
  APP: Object.freeze({
    ROOT: '/app',
    FEED: '/app/feed',
    EXPLORE: '/app/explore',
    CHAT: '/app/chat',
    PROFILE: '/app/profile',
    PUBLIC_PROFILE: '/app/u/:nickname',
    DONATE: '/app/donate',
    MOOD: '/app/mood',
    EXPERTS: '/app/expertos',
    APPOINTMENTS: '/app/citas',
  }),
});

/**
 * Build a dynamic route with parameters.
 * @param {string} route - Route pattern with :param placeholders
 * @param {Record<string, string>} params - Parameter values
 * @returns {string}
 *
 * @example
 *   buildRoute(ROUTES.APP.PUBLIC_PROFILE, { nickname: 'john' })
 *   // => '/app/u/john'
 */
export function buildRoute(route, params = {}) {
  let result = route;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, encodeURIComponent(value));
  });
  return result;
}

/**
 * Navigation items for the sidebar/bottom nav.
 * Used by MainLayout to render navigation consistently.
 */
export const NAV_ITEMS = [
  { path: ROUTES.APP.FEED, labelKey: 'student.nav.feed', icon: 'Home' },
  { path: ROUTES.APP.EXPLORE, labelKey: 'student.nav.explore', icon: 'Search' },
  { path: ROUTES.APP.CHAT, labelKey: 'student.nav.chat', icon: 'MessageCircle' },
  { path: ROUTES.APP.PROFILE, labelKey: 'student.nav.profile', icon: 'User' },
];

export default ROUTES;
