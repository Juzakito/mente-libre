import json

ES_JSON_PATH = 'c:/Users/josem/.gemini/antigravity-ide/scratch/mente-libre/src/i18n/es.json'
EN_JSON_PATH = 'c:/Users/josem/.gemini/antigravity-ide/scratch/mente-libre/src/i18n/en.json'

# Load existing files
with open(ES_JSON_PATH, 'r', encoding='utf-8') as f:
    es_data = json.load(f)
with open(EN_JSON_PATH, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Complete b2bDashboard translations - every single string in the panel
es_data['b2bDashboard'] = {
    # Navigation
    "backToApp": "← Volver a la App",
    "back": "← Volver",
    "portal": "PORTAL",
    "mainMenu": "MENÚ PRINCIPAL",
    "dashboard": "Dashboard",
    "earlyRadar": "Radar Temprano",
    "roiSimulator": "Simulador ROI",
    "subscriptions": "Suscripciones",
    "management": "GESTIÓN",
    "students": "Estudiantes",
    "sosAlerts": "Alertas SOS",
    "gamification": "Gamificación",
    "reports": "Reportes",
    "darkMode": "Modo Oscuro",
    "lightMode": "Modo Claro",
    "switchToDark": "Cambiar a modo oscuro",
    "switchToLight": "Cambiar a modo claro",
    "rector": "Rector",
    "university": "Universidad",

    # Login
    "institutionalAccess": "Acceso Institucional",
    "enterCredentials": "Ingresa tus credenciales de rectorado.",
    "emailPlaceholder": "Correo institucional",
    "passwordPlaceholder": "Contraseña",
    "wrongCredentials": "Credenciales incorrectas.",
    "loginButton": "Ingresar al Dashboard",

    # Header titles per tab
    "headerAnalytics": "Dashboard Institucional",
    "headerRadar": "Radar de Bienestar Predictivo",
    "headerRoi": "Simulador de Impacto Financiero",
    "headerPricing": "Planes y Licencias Institucionales",
    "headerStudents": "Gestión de Estudiantes",
    "headerSos": "Alertas SOS y Casos Críticos",
    "headerGamification": "Retos y Gamificación",
    "headerReports": "Reportes Ejecutivos",
    "headerSubtitle": "Visión general y métricas clave de la institución.",

    # Filters
    "allCareers": "Todas las Carreras",
    "ingSistemas": "Ing. de Sistemas",
    "ingIndustrial": "Ing. Industrial",
    "medicine": "Medicina",
    "architecture": "Arquitectura",
    "law": "Derecho",
    "psychology": "Psicología",
    "allCycles": "Todos los Ciclos",
    "cycle": "Ciclo",

    # Alert banners
    "alertEmotionalTitle": "Asistencia emocional por debajo del objetivo",
    "alertEmotionalDesc": "La participación en retos de bienestar es del 42.0%, por debajo del 65% esperado en este ciclo.",
    "alertStressTitle": "Pico de estrés crítico detectado",
    "alertStressDesc": "9 registros en desempeño de riesgo requieren plan de contención emocional urgente.",
    "deployChallenge": "Desplegar Reto →",

    # KPI Cards
    "activeStudents": "Estudiantes Activos",
    "dropoutPrevented": "Deserción Prevenida",
    "earlyAlerts": "Alertas Tempranas",
    "avgEngagement": "Engagement Promedio",
    "kpiBadgeFreeMind": "Free Mind",
    "kpiBadgeComplete": "Completo",
    "kpiBadgeAttention": "Atención",

    # Quick Actions
    "quickActions": "Acciones Rápidas",
    "meetings": "Reuniones",
    "appointments": "Citas",
    "sosCases": "Casos SOS",
    "executives": "Directivos",
    "selectStudentMeeting": "Seleccione un estudiante de la lista para agendar una reunión",
    "selectStudentAppointment": "Seleccione un estudiante para programar una cita psicológica",
    "executivesActivated": "Vista principal de directivos activada",

    # Charts
    "currentPeriodStats": "Estadísticas del Periodo Actual",
    "weeklyActivity": "Actividad Semanal",
    "emotionalDistribution": "Distribución de Desempeño Emocional",
    "moodExcellent": "Excelente",
    "moodGood": "Bien",
    "moodRegular": "Regular",
    "moodSad": "Triste",
    "moodOverwhelmed": "Abrumado",

    # Date card
    "today": "HOY",
    "upcomingEvents": "PRÓXIMOS EVENTOS",
    "noEventsToday": "No hay eventos para hoy",
    "openCalendar": "Abriendo calendario para nueva reunión...",
    "noScheduledMeetings": "No hay reuniones programadas",

    # Radar
    "earlyWellnessRadar": "Radar Temprano de Bienestar",
    "radarMapDesc": "Mapa predictivo de zonas de riesgo basado en interacción y análisis semántico.",
    "hideMap": "Ocultar Mapa",
    "showHeatMap": "Ver Mapa de Calor Predictivo",
    "burnout": "Agotamiento",
    "engagement": "Participación",
    "sleep": "Sueño",
    "stress": "Estrés",
    "anxiety": "Ansiedad",
    "wellbeing": "Bienestar",

    # Students table
    "searchByNameOrCode": "Buscar por nombre o código...",
    "all": "Todos",
    "riskHigh": "Riesgo Alto",
    "riskMedium": "Riesgo Medio",
    "riskLow": "Riesgo Bajo",
    "student": "Estudiante",
    "program": "Programa",
    "emotionalState": "Estado Emocional",
    "dropoutRisk": "Riesgo Deserción",
    "lastActivity": "Última Actividad",
    "action": "Acción",
    "contact": "Contactar",
    "moodCritical": "Crítico",
    "moodCaution": "Precaución",
    "moodStable": "Estable",
    "noStudentsFound": "No se encontraron estudiantes que coincidan con la búsqueda.",

    # SOS section
    "activeSosCases": "Casos SOS Activos",
    "allFilter": "Todos",
    "pendingFilter": "Pendiente",
    "inProgressFilter": "En Proceso",
    "resolvedFilter": "Resuelto",
    "levelCritical": "Crítico",
    "levelHigh": "Alto",
    "interveneCase": "Intervenir Caso",
    "viewDetails": "Ver Detalles",
    "caseAssigned": "Caso asignado para",
    "caseUpdated": "Caso actualizado para",
    "noSosAlerts": "No hay alertas SOS",
    "noSosAlertsDesc": "No se encontraron casos con el estado seleccionado.",

    # Gamification
    "top10Students": "Top 10 Estudiantes Más Participativos 🏆",
    "top10Desc": "Basado en interacciones (abrazos y posts) en Free Mind.",
    "rank": "Rank",
    "points": "Puntos (Plumas)",
    "badgesUnlocked": "Insignias Desbloqueadas",
    "notEnoughData": "Aún no hay suficientes datos para generar el Leaderboard.",

    # Reports
    "generalImpactReport": "Reporte General de Impacto",
    "reportDesc": "Métricas de salud mental derivadas de interacciones reales de los estudiantes en Free Mind.",
    "exportPdf": "Exportar PDF",
    "exportingPdf": "Exportando reporte en PDF...",
    "totalPosts": "Publicaciones (Posts)",
    "supportComments": "Comentarios de Apoyo",
    "totalHugsSent": "Total Abrazos Enviados",
    "sosDetected": "Casos SOS Detectados",
    "wellbeingConclusion": "Conclusión de Bienestar Estudiantil",
    "wellbeingConclusionText": "La plataforma está generando un espacio seguro con {{interactions}} interacciones de apoyo. Se ha brindado soporte a la comunidad con un alto nivel de empatía reflejado en los {{hugs}} abrazos virtuales enviados.",

    # Day names
    "sun": "Dom", "mon": "Lun", "tue": "Mar", "wed": "Mie", "thu": "Jue", "fri": "Vie", "sat": "Sab"
}

en_data['b2bDashboard'] = {
    # Navigation
    "backToApp": "← Back to App",
    "back": "← Back",
    "portal": "PORTAL",
    "mainMenu": "MAIN MENU",
    "dashboard": "Dashboard",
    "earlyRadar": "Early Radar",
    "roiSimulator": "ROI Simulator",
    "subscriptions": "Subscriptions",
    "management": "MANAGEMENT",
    "students": "Students",
    "sosAlerts": "SOS Alerts",
    "gamification": "Gamification",
    "reports": "Reports",
    "darkMode": "Dark Mode",
    "lightMode": "Light Mode",
    "switchToDark": "Switch to dark mode",
    "switchToLight": "Switch to light mode",
    "rector": "Rector",
    "university": "University",

    # Login
    "institutionalAccess": "Institutional Access",
    "enterCredentials": "Enter your rector credentials.",
    "emailPlaceholder": "Institutional email",
    "passwordPlaceholder": "Password",
    "wrongCredentials": "Incorrect credentials.",
    "loginButton": "Enter Dashboard",

    # Header titles per tab
    "headerAnalytics": "Institutional Dashboard",
    "headerRadar": "Predictive Wellness Radar",
    "headerRoi": "Financial Impact Simulator",
    "headerPricing": "Institutional Plans & Licenses",
    "headerStudents": "Student Management",
    "headerSos": "SOS Alerts & Critical Cases",
    "headerGamification": "Challenges & Gamification",
    "headerReports": "Executive Reports",
    "headerSubtitle": "Overview and key metrics of the institution.",

    # Filters
    "allCareers": "All Majors",
    "ingSistemas": "Systems Eng.",
    "ingIndustrial": "Industrial Eng.",
    "medicine": "Medicine",
    "architecture": "Architecture",
    "law": "Law",
    "psychology": "Psychology",
    "allCycles": "All Semesters",
    "cycle": "Sem",

    # Alert banners
    "alertEmotionalTitle": "Emotional support below target",
    "alertEmotionalDesc": "Participation in wellness challenges is at 42.0%, below the 65% expected this semester.",
    "alertStressTitle": "Critical stress spike detected",
    "alertStressDesc": "9 records in risk performance require an urgent emotional support plan.",
    "deployChallenge": "Deploy Challenge →",

    # KPI Cards
    "activeStudents": "Active Students",
    "dropoutPrevented": "Dropout Prevented",
    "earlyAlerts": "Early Alerts",
    "avgEngagement": "Avg. Engagement",
    "kpiBadgeFreeMind": "Free Mind",
    "kpiBadgeComplete": "Complete",
    "kpiBadgeAttention": "Attention",

    # Quick Actions
    "quickActions": "Quick Actions",
    "meetings": "Meetings",
    "appointments": "Appointments",
    "sosCases": "SOS Cases",
    "executives": "Executives",
    "selectStudentMeeting": "Select a student from the list to schedule a meeting",
    "selectStudentAppointment": "Select a student to schedule a psychological appointment",
    "executivesActivated": "Executive view activated",

    # Charts
    "currentPeriodStats": "Current Period Statistics",
    "weeklyActivity": "Weekly Activity",
    "emotionalDistribution": "Emotional Performance Distribution",
    "moodExcellent": "Excellent",
    "moodGood": "Good",
    "moodRegular": "Regular",
    "moodSad": "Sad",
    "moodOverwhelmed": "Overwhelmed",

    # Date card
    "today": "TODAY",
    "upcomingEvents": "UPCOMING EVENTS",
    "noEventsToday": "No events for today",
    "openCalendar": "Opening calendar for new meeting...",
    "noScheduledMeetings": "No scheduled meetings",

    # Radar
    "earlyWellnessRadar": "Early Wellness Radar",
    "radarMapDesc": "Predictive risk map based on interaction and semantic analysis.",
    "hideMap": "Hide Map",
    "showHeatMap": "View Predictive Heat Map",
    "burnout": "Burnout",
    "engagement": "Engagement",
    "sleep": "Sleep",
    "stress": "Stress",
    "anxiety": "Anxiety",
    "wellbeing": "Wellbeing",

    # Students table
    "searchByNameOrCode": "Search by name or code...",
    "all": "All",
    "riskHigh": "High Risk",
    "riskMedium": "Medium Risk",
    "riskLow": "Low Risk",
    "student": "Student",
    "program": "Program",
    "emotionalState": "Emotional State",
    "dropoutRisk": "Dropout Risk",
    "lastActivity": "Last Activity",
    "action": "Action",
    "contact": "Contact",
    "moodCritical": "Critical",
    "moodCaution": "Caution",
    "moodStable": "Stable",
    "noStudentsFound": "No students matched the search criteria.",

    # SOS section
    "activeSosCases": "Active SOS Cases",
    "allFilter": "All",
    "pendingFilter": "Pending",
    "inProgressFilter": "In Progress",
    "resolvedFilter": "Resolved",
    "levelCritical": "Critical",
    "levelHigh": "High",
    "interveneCase": "Intervene Case",
    "viewDetails": "View Details",
    "caseAssigned": "Case assigned for",
    "caseUpdated": "Case updated for",
    "noSosAlerts": "No SOS Alerts",
    "noSosAlertsDesc": "No cases found with the selected status.",

    # Gamification
    "top10Students": "Top 10 Most Engaged Students 🏆",
    "top10Desc": "Based on interactions (hugs and posts) in Free Mind.",
    "rank": "Rank",
    "points": "Points (Feathers)",
    "badgesUnlocked": "Badges Unlocked",
    "notEnoughData": "Not enough data to generate the Leaderboard yet.",

    # Reports
    "generalImpactReport": "General Impact Report",
    "reportDesc": "Mental health metrics derived from real student interactions on Free Mind.",
    "exportPdf": "Export PDF",
    "exportingPdf": "Exporting report as PDF...",
    "totalPosts": "Posts",
    "supportComments": "Support Comments",
    "totalHugsSent": "Total Hugs Sent",
    "sosDetected": "SOS Cases Detected",
    "wellbeingConclusion": "Student Wellbeing Conclusion",
    "wellbeingConclusionText": "The platform is generating a safe space with {{interactions}} support interactions. Community support has been provided with a high level of empathy reflected in the {{hugs}} virtual hugs sent.",

    # Day names
    "sun": "Sun", "mon": "Mon", "tue": "Tue", "wed": "Wed", "thu": "Thu", "fri": "Fri", "sat": "Sat"
}

with open(ES_JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(es_data, f, indent=2, ensure_ascii=False)
with open(EN_JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)

print("Translation dictionaries updated successfully!")
