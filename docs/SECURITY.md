# Política de Seguridad — Mente Libre

## ⚠️ Datos Sensibles

Mente Libre maneja datos de salud mental de estudiantes universitarios. La seguridad y privacidad de estos datos es nuestra máxima prioridad.

## Principios

1. **Anonimato por diseño**: Los estudiantes nunca proporcionan nombres reales. Usan nicknames y avatares emoji.
2. **Mínimo privilegio**: Las políticas RLS de Supabase restringen cada consulta al usuario autenticado.
3. **Secrets isolation**: Todas las credenciales se manejan exclusivamente vía variables de entorno en Vercel. Nunca se commitean.
4. **Encryption in transit**: Todo el tráfico viaja sobre HTTPS (forzado por Vercel y Supabase).
5. **Encryption at rest**: Supabase encripta datos en reposo automáticamente en PostgreSQL.

## Autenticación

- **Provider**: Supabase Auth (JWT-based)
- **Session management**: Tokens automáticamente refrescados
- **Password storage**: Hashed por Supabase (bcrypt)
- **Session persistence**: `persistSession: true` con detección de URL para OAuth flows

## Autorización (RLS)

Todas las tablas tienen Row Level Security habilitado. Las políticas garantizan:

| Tabla | Lectura | Escritura | Borrado |
|---|---|---|---|
| `users` | Solo propio perfil | Solo propio perfil | Cascade desde auth |
| `moods` | Solo propios | Solo propios | Cascade |
| `posts` | Posts de su universidad | Crear propios | Solo propios |
| `comments` | Todos los visibles | Crear propios | Solo propios |
| `chat_sessions` | Solo propias | Solo propias | Cascade |
| `chat_messages` | Solo de su sesión | Solo en su sesión | Cascade |
| `interventions` | — | — | Admin only |

## Protección de APIs

- **Supabase anon key**: Es una clave pública segura — solo funciona con las políticas RLS activas
- **Gemini API key**: Se envía solo desde el cliente al API de Google, no a nuestros servidores
- **CORS**: Configurado en Supabase para aceptar solo dominios autorizados

## Prevención de Ataques

| Ataque | Mitigación |
|---|---|
| XSS | Input sanitization en `validators.js` |
| CSRF | JWT-based auth (no cookies sensibles) |
| SQL Injection | Supabase usa prepared statements |
| Brute Force | Supabase rate limiting en auth |
| Data Exfiltration | RLS policies + no admin API expuesto |

## Manejo de Credenciales

### ✅ Correcto
- Variables de entorno en Vercel Dashboard
- `.env.local` para desarrollo (en `.gitignore`)
- `.env.example` con valores placeholder

### ❌ Incorrecto
- Commitear `.env`, `.env.production`, o `.env.local`
- Hardcodear API keys en código fuente
- Exponer tokens en console.log en producción

## Reportar Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad, por favor repórtala de manera responsable:

1. **NO** abras un Issue público
2. Envía un email a: security@mente-libre.app
3. Incluye una descripción detallada y pasos para reproducir
4. Te responderemos en menos de 48 horas

## Cumplimiento

- [ ] **GDPR/LGPD**: En progreso — los datos son anónimos por diseño
- [ ] **HIPAA**: No aplica (no es un servicio de salud regulado)
- [ ] **SOC 2**: Roadmap futuro para clientes enterprise
