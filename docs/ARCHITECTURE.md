# Arquitectura Técnica — Mente Libre

## Visión General

Mente Libre sigue una **arquitectura de aplicación de página única (SPA)** con backend como servicio (BaaS) proporcionado por Supabase. El frontend es una Progressive Web App (PWA) desplegada en Vercel Edge Network.

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE (PWA)                        │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  React   │  │  Vite    │  │  i18next  │             │
│  │  Router  │  │  Build   │  │  (i18n)   │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Feature Modules                      │  │
│  │  ┌─────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │  │
│  │  │Feed │ │ Chat │ │ Mood │ │ B2B  │ │ SOS  │   │  │
│  │  └─────┘ └──────┘ └──────┘ └──────┘ └──────┘   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Global State (Contexts)                 │  │
│  │  ┌──────┐ ┌───────┐ ┌───────┐ ┌──────────────┐  │  │
│  │  │ Auth │ │ Theme │ │ Audio │ │ Notification │  │  │
│  │  └──────┘ └───────┘ └───────┘ └──────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Service Layer                        │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │  │
│  │  │ Supabase │  │  Gemini  │  │  Analytics   │   │  │
│  │  │  Client  │  │    AI    │  │   Tracker    │   │  │
│  │  └──────────┘  └──────────┘  └──────────────┘   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
              │              │              │
              ▼              ▼              ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────┐
    │   Supabase   │ │   Gemini     │ │ SheetDB  │
    │  (PostgreSQL │ │     API      │ │ (Google  │
    │  Auth, RLS,  │ │              │ │  Sheets) │
    │  Realtime)   │ │              │ │          │
    └──────────────┘ └──────────────┘ └──────────┘
```

## Principios de Diseño

1. **Feature-based Architecture**: Cada dominio de negocio (feed, chat, mood, etc.) es un módulo auto-contenido con sus propios componentes, hooks y servicios.

2. **Context Decomposition**: Estado global dividido en contextos especializados (Auth, Theme, Audio, Notification) en lugar de un "God Object" monolítico.

3. **Service Layer Pattern**: Todas las operaciones de datos pasan por una capa de servicios que abstrae Supabase del UI, facilitando testing y cambio de proveedor futuro.

4. **Offline-First**: La app funciona con localStorage como fallback cuando Supabase no está disponible, con sincronización bidireccional cuando se reconecta.

## Flujo de Datos

```
UI Component
    │
    ├── Lee estado global → Context (Auth, Theme)
    ├── Lee estado local → Custom Hook (usePosts, useGamification)
    │                          │
    │                          └── Llama a → Service Layer
    │                                            │
    │                                            ├── Supabase (remote)
    │                                            └── localStorage (local cache)
    │
    └── Eventos → Custom Hook → Service → Supabase
                                            │
                                            └── Realtime → Custom Hook → Re-render
```

## Seguridad

- **Row Level Security (RLS)**: Todas las tablas en Supabase tienen políticas RLS que restringen acceso a nivel de fila basándose en `auth.uid()`.
- **Supabase Auth**: JWT-based authentication con soporte para email/password.
- **Client-side sanitization**: Input sanitization para prevenir XSS.
- **Environment isolation**: Secrets nunca se commitean — se configuran en Vercel Dashboard.

## Base de Datos

Ver [database/migrations/](../database/migrations/) para el schema completo.

### Entidad-Relación

```
universities ──1:N──▶ users
universities ──1:N──▶ posts
universities ──1:N──▶ moods
universities ──1:N──▶ interventions

users ──1:N──▶ moods
users ──1:N──▶ posts ──1:N──▶ comments
users ──1:N──▶ chat_sessions ──1:N──▶ chat_messages
users ──1:N──▶ interventions
users ──1:1──▶ expert_profiles ──1:N──▶ appointments
users ──1:N──▶ wellness_challenges
```
