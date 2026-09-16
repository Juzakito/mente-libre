# Guía de Contribución — Mente Libre

¡Gracias por tu interés en contribuir a Mente Libre! 🦉

## Configuración del Entorno

1. Fork el repositorio
2. Clona tu fork: `git clone https://github.com/tu-usuario/mente-libre.git`
3. Instala dependencias: `npm install`
4. Copia `.env.example` a `.env.local` y configura tus credenciales
5. Inicia el servidor: `npm run dev`

## Branch Strategy

```
main            ← Producción (auto-deploy a Vercel)
  └── develop   ← Integración
       ├── feature/nombre-feature
       ├── fix/nombre-fix
       └── chore/nombre-tarea
```

### Convenciones de Branch

- `feature/` — Nueva funcionalidad
- `fix/` — Corrección de bugs
- `chore/` — Tareas de mantenimiento, docs, refactoring
- `hotfix/` — Corrección urgente directa a main

## Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: agregar mood tracking semanal
fix: corregir error en login con email
chore: actualizar dependencias
docs: documentar API de posts
style: formatear CSS del dashboard
refactor: extraer PostCard de Feed.jsx
```

## Estructura de Código

### Convenciones de Nombres

| Tipo | Convención | Ejemplo |
|---|---|---|
| Componentes React | PascalCase | `PostCard.jsx` |
| Hooks | camelCase con `use` prefix | `usePosts.js` |
| Servicios | camelCase con `Service` suffix | `postsService.js` |
| Utilidades | camelCase | `formatters.js` |
| CSS | kebab-case | `variables.css` |
| Constantes | UPPER_SNAKE_CASE | `MAX_POST_LENGTH` |

### Organización de Features

Cada feature module debe seguir esta estructura:

```
features/
  └── mi-feature/
      ├── components/     # Componentes UI específicos de la feature
      ├── hooks/          # Custom hooks con lógica de negocio
      ├── services/       # Operaciones de datos (Supabase, API)
      └── index.js        # Barrel export
```

### Principios de Código

1. **Single Responsibility**: Un componente = una responsabilidad
2. **Composición sobre Herencia**: Usar hooks y composición
3. **Inmutabilidad**: No mutar estado directamente
4. **Error Handling**: Siempre manejar errores en servicios
5. **Comentarios**: Documenta el "por qué", no el "qué"

## Pull Requests

1. Crea un branch desde `develop`
2. Implementa tus cambios
3. Asegúrate de que `npm run build` pase sin errores
4. Ejecuta `npm run lint`
5. Crea un PR con descripción clara
6. Espera review de al menos 1 maintainer

### Template de PR

```markdown
## Descripción
Breve descripción de los cambios.

## Tipo de Cambio
- [ ] Bugfix
- [ ] Nueva feature
- [ ] Refactoring
- [ ] Documentación

## Testing
- [ ] Build pasa sin errores
- [ ] Lint sin warnings
- [ ] Probado manualmente en Chrome/Safari
- [ ] Probado en mobile

## Screenshots (si aplica)
```

## Reportar Bugs

Usa la plantilla de Issues en GitHub. Incluye:
- Pasos para reproducir
- Comportamiento esperado vs actual
- Browser y OS
- Screenshots o videos si es posible

---

¡Gracias por hacer Mente Libre mejor! 💚
