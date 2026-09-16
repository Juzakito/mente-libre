/**
 * Form Validators
 * ================
 * Centralized validation functions for form inputs.
 * Each validator returns { valid: boolean, error?: string }.
 */

/**
 * @typedef {{ valid: boolean, error?: string }} ValidationResult
 */

/**
 * Validate an email address.
 * @param {string} email
 * @returns {ValidationResult}
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return { valid: false, error: 'El correo electrónico es requerido' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Ingresa un correo electrónico válido' };
  }
  return { valid: true };
}

/**
 * Validate a password.
 * @param {string} password
 * @param {{ minLength?: number }} options
 * @returns {ValidationResult}
 */
export function validatePassword(password, { minLength = 6 } = {}) {
  if (!password) {
    return { valid: false, error: 'La contraseña es requerida' };
  }
  if (password.length < minLength) {
    return {
      valid: false,
      error: `La contraseña debe tener al menos ${minLength} caracteres`,
    };
  }
  return { valid: true };
}

/**
 * Validate a nickname (username).
 * @param {string} nickname
 * @returns {ValidationResult}
 */
export function validateNickname(nickname) {
  if (!nickname || !nickname.trim()) {
    return { valid: false, error: 'El nombre es requerido' };
  }
  const trimmed = nickname.trim();
  if (trimmed.length < 2) {
    return { valid: false, error: 'El nombre debe tener al menos 2 caracteres' };
  }
  if (trimmed.length > 30) {
    return { valid: false, error: 'El nombre no puede exceder 30 caracteres' };
  }
  return { valid: true };
}

/**
 * Validate post/comment text content.
 * Checks for minimum length and prevents empty submissions.
 * @param {string} text
 * @param {{ minLength?: number, maxLength?: number, fieldName?: string }} options
 * @returns {ValidationResult}
 */
export function validateText(
  text,
  { minLength = 1, maxLength = 5000, fieldName = 'El texto' } = {}
) {
  if (!text || !text.trim()) {
    return { valid: false, error: `${fieldName} es requerido` };
  }
  const trimmed = text.trim();
  if (trimmed.length < minLength) {
    return {
      valid: false,
      error: `${fieldName} debe tener al menos ${minLength} caracteres`,
    };
  }
  if (trimmed.length > maxLength) {
    return {
      valid: false,
      error: `${fieldName} no puede exceder ${maxLength} caracteres`,
    };
  }
  return { valid: true };
}

/**
 * Sanitize user input by removing potentially dangerous HTML/script tags.
 * @param {string} input
 * @returns {string}
 */
export function sanitizeInput(input) {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * Validate a required field.
 * @param {*} value
 * @param {string} fieldName
 * @returns {ValidationResult}
 */
export function validateRequired(value, fieldName = 'Este campo') {
  if (value === null || value === undefined || value === '') {
    return { valid: false, error: `${fieldName} es requerido` };
  }
  return { valid: true };
}
