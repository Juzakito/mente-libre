const WEBHOOK_URL = import.meta.env.VITE_SHEETS_WEBHOOK_URL;

// Keep track of when the app was opened to calculate session duration
const appSessionStart = Date.now();

/**
 * Helper to get the time of day
 */
const getTimeOfDay = (hour) => {
  if (hour >= 5 && hour < 12) return 'Mañana';
  if (hour >= 12 && hour < 18) return 'Tarde';
  if (hour >= 18 && hour < 22) return 'Noche';
  return 'Madrugada';
};

/**
 * Tracks application events and sends them to a Google Sheets webhook.
 * @param {string} eventName - The name of the event (e.g. USER_LOGIN, SOS_TRIGGERED, NEW_POST)
 * @param {object} payload - Additional data to send (e.g. { career, mood, text })
 */
export const trackEvent = async (eventName, payload = {}) => {
  const now = new Date();
  const timestamp = now.toISOString();
  
  // Extract user info from localStorage
  let userContext = {};
  try {
    const savedUser = localStorage.getItem('mente-libre-user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      userContext = {
        userId: user.id || user.uid || 'anonymous',
        userRole: user.type || 'estudiante',
        userCareer: user.career || user.university || 'N/A',
        userSemester: user.semester || 'N/A'
      };
    }
    
    // Add gamification stats to see correlations with engagement
    const points = localStorage.getItem('mente-libre-points') || '0';
    const streak = localStorage.getItem('mente-libre-streak') || '0';
    userContext.points = points;
    userContext.streak = streak;
  } catch (e) {
    console.warn("Could not parse user from local storage for tracker", e);
  }

  // Calculate environmental / device context
  const timeOfDay = getTimeOfDay(now.getHours());
  const dayOfWeek = now.toLocaleDateString('es-ES', { weekday: 'long' });
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
  const sessionMinutes = Math.floor((Date.now() - appSessionStart) / 60000);

  const dataToTrack = {
    timestamp,
    eventName,
    ...userContext,
    timeOfDay,
    dayOfWeek,
    device: isMobile,
    sessionMinutes,
    ...payload
  };

  // En entorno de desarrollo o si no hay webhook configurado, solo mostramos en consola
  if (!WEBHOOK_URL) {
    console.log(`[Tracker] Simulando envío a Excel:`, dataToTrack);
    return;
  }

  try {
    // Si usamos SheetDB u otro servicio similar que acepte JSON directo
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: dataToTrack }),
      mode: 'cors'
    });
    console.log(`[Tracker] Evento enviado a la nube:`, eventName);
  } catch (error) {
    console.error(`[Tracker] Error al enviar evento a Excel:`, error);
  }
};
