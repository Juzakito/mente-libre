/**
 * Formatters
 * ===========
 * Consistent data formatting utilities used across the application.
 */

/**
 * Format a date as relative time (e.g., "Hace 5 minutos", "Hace 2 horas").
 * @param {string | Date} date
 * @returns {string}
 */
export function formatRelativeTime(date) {
  if (!date) return 'Hace poco';

  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Justo ahora';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffHr < 24) return `Hace ${diffHr}h`;
  if (diffDay < 7) return `Hace ${diffDay}d`;
  if (diffDay < 30) return `Hace ${Math.floor(diffDay / 7)} sem`;

  return past.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: past.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Format a date as short time (e.g., "14:30").
 * @param {string | Date} date
 * @returns {string}
 */
export function formatTime(date) {
  if (!date) return '';
  return new Date(date).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a date as a full readable string.
 * @param {string | Date} date
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a number with thousands separators.
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('es-ES').format(num);
}

/**
 * Truncate text to a maximum length with ellipsis.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength).trimEnd() + '…';
}

/**
 * Capitalize the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
