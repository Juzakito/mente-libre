<div align="center">

# 🦉 Mente Libre (Free Mind)

### Tu refugio universitario anónimo para cuidar tu salud mental

[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](docs/CONTRIBUTING.md)

[Demo en Vivo](https://mente-libre.vercel.app) · [Documentación](docs/) · [Reportar Bug](https://github.com/your-org/mente-libre/issues) · [Solicitar Feature](https://github.com/your-org/mente-libre/issues)

</div>

---

## 📋 Tabla de Contenidos

- [Sobre el Proyecto](#-sobre-el-proyecto)
- [Características](#-características)
- [Tech Stack](#-tech-stack)
- [Inicio Rápido](#-inicio-rápido)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Variables de Entorno](#-variables-de-entorno)
- [Despliegue](#-despliegue)
- [Documentación](#-documentación)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 🧠 Sobre el Proyecto

**Mente Libre** es una plataforma PWA de bienestar mental diseñada específicamente para estudiantes universitarios. Ofrece un espacio seguro y anónimo donde los estudiantes pueden:

- Expresar sus emociones libremente
- Recibir apoyo de una comunidad empática
- Conversar con un asistente de IA entrenado en salud mental
- Rastrear su estado emocional a lo largo del tiempo
- Acceder a recursos de crisis cuando más lo necesitan

### Modelo de Negocio

Mente Libre opera bajo un modelo **B2B SaaS**, vendiendo licencias a universidades que quieren cuidar la salud mental de sus estudiantes. Las universidades obtienen un dashboard analítico con métricas agregadas y anónimas del bienestar de su comunidad estudiantil.

---

## ✨ Características

| Característica | Descripción |
|---|---|
| 🔒 **Anonimato total** | Los estudiantes eligen nicknames y avatares emoji — sin datos personales |
| 💬 **Comunidad segura** | Feed tipo Twitter con posts anónimos, comentarios y "abrazos" |
| 🤖 **Chat IA** | Asistente conversacional powered by Gemini para soporte emocional |
| 📊 **Mood Tracking** | Registro diario de estados de ánimo con visualización en gráficos |
| 🏆 **Gamificación** | Sistema de plumas (currency), insignias, rachas y avatares desbloqueables |
| 🆘 **Protocolo SOS** | Botón de crisis con líneas de ayuda y protocolo I-CARE |
| 🎵 **Audio ambiental** | Música relajante integrada para reducir estrés |
| 📱 **PWA** | Instalable como app nativa en cualquier dispositivo |
| 🌐 **Bilingüe** | Español e Inglés completos con i18next |
| 🌙 **Dark Mode** | Tema claro y oscuro con respeto a preferencias del sistema |
| 🏫 **Dashboard B2B** | Panel para universidades con métricas, mapa interactivo y ROI calculator |
| 👨‍⚕️ **Expertos** | Directorio de psicólogos y sistema de agendamiento de citas |

---

## 🛠 Tech Stack

| Capa | Tecnología |
|---|---|
| **Frontend** | React 19, Vite 8, React Router 7 |
| **Estilos** | CSS Custom Properties, Glassmorphism Design System |
| **Backend** | Supabase (PostgreSQL + Auth + Realtime + RLS) |
| **IA** | Google Gemini API |
| **Deploy** | Vercel (Edge Network) |
| **PWA** | Service Worker, Web App Manifest |
| **Analytics** | SheetDB (Google Sheets webhook) |
| **i18n** | react-i18next |
| **Charts** | Recharts |
| **Icons** | Lucide React |

---

## 🚀 Inicio Rápido

### Requisitos Previos

- [Node.js](https://nodejs.org/) 18+
- [npm](https://www.npmjs.com/) 9+
- Cuenta en [Supabase](https://supabase.com) (gratis)
- API Key de [Google AI Studio](https://aistudio.google.com/apikey) (para Chat IA)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/your-org/mente-libre.git
cd mente-libre

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales

# 4. Configurar base de datos
# Ejecuta los SQL en database/migrations/ en tu proyecto Supabase
# (en orden: 001 → 002 → 003)

# 5. Iniciar servidor de desarrollo
npm run dev
```

La app estará disponible en `http://localhost:5173`

### Scripts Disponibles

```bash
npm run dev       # Servidor de desarrollo con HMR
npm run build     # Build de producción
npm run preview   # Preview del build de producción
npm run lint      # Linter (Oxlint)
```

---

## 📁 Estructura del Proyecto

```
mente-libre/
├── public/                    # Assets estáticos (logo, manifest, SW)
├── src/
│   ├── app/                   # Entry point y providers
│   ├── components/            # Componentes UI reutilizables
│   │   ├── ui/                # Primitivos (Button, Input, Modal)
│   │   ├── layout/            # Layout components
│   │   ├── feedback/          # Toast, Loading, Error states
│   │   └── shared/            # Cross-feature components
│   ├── features/              # Feature modules (domain logic)
│   │   ├── auth/              # Autenticación y onboarding
│   │   ├── feed/              # Comunidad y posts
│   │   ├── chat/              # Chat IA
│   │   ├── mood/              # Mood tracking
│   │   ├── gamification/      # Plumas, badges, streaks
│   │   ├── profile/           # Perfil y configuración
│   │   ├── b2b/               # Dashboard B2B
│   │   ├── explore/           # Exploración y wellness
│   │   ├── experts/           # Directorio de expertos
│   │   └── sos/               # Protocolo SOS
│   ├── hooks/                 # Custom hooks globales
│   ├── services/              # Capa de servicios (API)
│   │   ├── supabase/          # Cliente y helpers
│   │   ├── analytics/         # Event tracking
│   │   └── ai/                # Gemini AI
│   ├── store/                 # Contextos globales (Auth, Theme, Audio)
│   ├── styles/                # Design system modular
│   ├── utils/                 # Utilidades puras
│   ├── i18n/                  # Internacionalización
│   └── config/                # Configuración (env, routes, features)
├── database/
│   ├── migrations/            # SQL migrations (numbered)
│   └── seeds/                 # Test data
├── tests/                     # Test pyramid (unit/integration/e2e)
├── deployment/                # Docker, CI/CD, scripts
├── docs/                      # Documentación técnica
└── package.json
```

---

## 🔐 Variables de Entorno

Copia `.env.example` a `.env.local` y configura:

| Variable | Requerida | Descripción |
|---|---|---|
| `VITE_SUPABASE_URL` | ✅ | URL de tu proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Clave anónima de Supabase |
| `VITE_GEMINI_API_KEY` | ⚡ | API Key de Gemini (para Chat IA) |
| `VITE_SHEETS_WEBHOOK_URL` | ❌ | Webhook para analytics |

> ⚠️ **NUNCA** commitees archivos `.env` al repositorio. Usa Vercel Dashboard para production secrets.

---

## 🚢 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio en [vercel.com](https://vercel.com)
2. Configura las variables de entorno en **Settings → Environment Variables**
3. Deploy automático en cada push a `main`

Ver [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) para instrucciones detalladas.

---

## 📖 Documentación

| Documento | Descripción |
|---|---|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitectura técnica y diagramas |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | Guía para desarrolladores |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Guía de despliegue |
| [SECURITY.md](docs/SECURITY.md) | Políticas de seguridad |
| [API.md](docs/API.md) | Documentación de servicios |
| [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Sistema de diseño |

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Lee nuestra [Guía de Contribución](docs/CONTRIBUTING.md) para comenzar.

---

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver [LICENSE](LICENSE) para más información.

---

<div align="center">

Hecho con 💚 por el equipo de Mente Libre

</div>
