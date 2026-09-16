# Guía de Despliegue — Mente Libre

## Prerrequisitos

- Cuenta en [Vercel](https://vercel.com) (gratis para hobby)
- Proyecto en [Supabase](https://supabase.com) (gratis tier disponible)
- API Key de [Google AI Studio](https://aistudio.google.com/apikey)

## 1. Configurar Supabase

### Crear proyecto
1. Ve a [app.supabase.com](https://app.supabase.com)
2. Crea un nuevo proyecto
3. Anota la **Project URL** y **anon public key** (Settings → API)

### Ejecutar migraciones
En el **SQL Editor** de Supabase, ejecuta en orden:

```
database/migrations/001_initial_schema.sql
database/migrations/002_add_comments_table.sql
database/migrations/003_add_appointments_wellness.sql
```

### (Opcional) Insertar datos de prueba
```
database/seeds/demo_university.sql
```

### Configurar Auth
1. Ve a **Authentication → Providers**
2. Habilita **Email** como proveedor
3. (Opcional) Configura el template de email de confirmación

## 2. Configurar Vercel

### Conectar repositorio
1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio de GitHub
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`

### Variables de entorno
En **Settings → Environment Variables**, agrega:

| Variable | Valor |
|---|---|
| `VITE_SUPABASE_URL` | Tu Project URL de Supabase |
| `VITE_SUPABASE_ANON_KEY` | Tu anon key de Supabase |
| `VITE_GEMINI_API_KEY` | Tu API key de Gemini |
| `VITE_SHEETS_WEBHOOK_URL` | (Opcional) URL de SheetDB |

### Deploy
Push a `main` para deploy automático. Cada PR genera un preview deployment.

## 3. Dominio Personalizado (Opcional)

1. Ve a **Settings → Domains** en Vercel
2. Agrega tu dominio
3. Configura los registros DNS según las instrucciones de Vercel

## 4. Monitoreo

### Recomendaciones
- **Sentry**: Para error tracking en producción
- **Vercel Analytics**: Métricas de rendimiento web
- **Supabase Dashboard**: Monitoreo de base de datos

## 5. Checklist de Producción

- [ ] Variables de entorno configuradas en Vercel
- [ ] Migraciones ejecutadas en Supabase
- [ ] RLS habilitado en todas las tablas
- [ ] `.env.production` NO está commiteado
- [ ] Build de producción sin errores
- [ ] PWA manifest y Service Worker funcionando
- [ ] Meta tags y SEO configurados
- [ ] HTTPS forzado (Vercel lo hace automáticamente)
