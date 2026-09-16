/**
 * Intenta parsear un string JSON. Si falla por corrupción de datos, 
 * devuelve el valor de respaldo (fallback) proporcionado en lugar de romper la app.
 * 
 * @param {string} str - El string JSON a parsear (ej: de localStorage)
 * @param {any} fallback - El valor a devolver si ocurre un error
 * @returns {any} El objeto parseado o el valor fallback
 */
export const safeJSONParse = (str, fallback) => {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error('Error parseando JSON, usando fallback:', error);
    return fallback;
  }
};
