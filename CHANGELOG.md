# Changelog

Todos los cambios notables en este proyecto se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto sigue [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] - 2026-09-16

### 🏗️ Restructurado
- **AppContext descompuesto** en 4 contextos especializados: AuthContext, ThemeContext, AudioContext, NotificationContext
- **CSS modularizado** en 5 archivos: variables, reset, animations, layout, utilities
- **Capa de servicios** creada para abstraer Supabase de los componentes UI
- **Custom hooks** extraídos para posts (`usePosts`) y gamificación (`useGamification`)
- **Estructura de carpetas** reorganizada a feature-based architecture
- **Base de datos** organizada en migraciones numeradas con seeds separados

### 🔒 Seguridad
- `.gitignore` actualizado para excluir todos los archivos de entorno
- `.env.example` documentado completamente con todas las variables
- Validador de variables de entorno (`config/env.js`) creado
- Documentación de seguridad (`docs/SECURITY.md`) creada

### 📚 Documentación
- README profesional con badges, tech stack, guía rápida
- Documentación de arquitectura (`docs/ARCHITECTURE.md`)
- Guía de contribución (`docs/CONTRIBUTING.md`)
- Guía de despliegue (`docs/DEPLOYMENT.md`)
- Política de seguridad (`docs/SECURITY.md`)

### 🛠️ DevOps
- Dockerfile multi-stage para producción
- docker-compose.yml para desarrollo local
- GitHub Actions CI pipeline
- Scripts de setup automatizado (Windows, macOS, Linux)

### ✨ Nuevas Características
- Sistema de notificaciones centralizado (toasts)
- Feature flags configurables por entorno
- Route constants (elimina strings mágicos)
- Validadores de formularios centralizados
- Formatters para fechas, números y texto
- Storage utility con TTL support
- Custom hooks: useLocalStorage, useDebounce, useMediaQuery, useOnlineStatus, useClickOutside

### 🗄️ Base de Datos
- Tabla `comments` creada formalmente (existía en código pero no en schema)
- Tablas `expert_profiles`, `appointments`, `wellness_challenges` añadidas
- Índices de rendimiento adicionales
- Políticas RLS mejoradas y documentadas

## [0.1.0] - 2026-09-01

### Añadido
- MVP inicial con feed, chat IA, mood tracking, gamificación
- Dashboard B2B con mapa interactivo de Perú
- PWA con Service Worker
- Dark/Light mode
- Internacionalización (ES/EN)
- Deploy en Vercel
