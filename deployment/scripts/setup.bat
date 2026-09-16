@echo off
REM ============================================
REM Mente Libre — Setup Script (Windows)
REM ============================================
REM Run this script to set up the development environment.
REM Usage: .\deployment\scripts\setup.bat
REM ============================================

echo.
echo  ==========================================
echo   🦉 Mente Libre — Development Setup
echo  ==========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js no encontrado. Instala Node.js 18+ desde https://nodejs.org
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo ✅ Node.js encontrado: %NODE_VER%

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ npm no encontrado.
    exit /b 1
)

for /f "tokens=*" %%v in ('npm -v') do set NPM_VER=%%v
echo ✅ npm encontrado: v%NPM_VER%
echo.

REM Install dependencies
echo 📦 Instalando dependencias...
call npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ Error al instalar dependencias.
    exit /b 1
)
echo ✅ Dependencias instaladas
echo.

REM Copy env file if it doesn't exist
if not exist ".env.local" (
    echo 📝 Creando .env.local desde .env.example...
    copy .env.example .env.local
    echo ⚠️  Edita .env.local con tus credenciales de Supabase y Gemini
) else (
    echo ✅ .env.local ya existe
)
echo.

REM Verify build
echo 🔨 Verificando build...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ❌ Error en el build. Revisa las variables de entorno.
    exit /b 1
)
echo ✅ Build exitoso
echo.

echo  ==========================================
echo   ✅ Setup completado!
echo  ==========================================
echo.
echo   Comandos disponibles:
echo     npm run dev     → Servidor de desarrollo
echo     npm run build   → Build de produccion
echo     npm run lint    → Linter
echo.
echo   Para iniciar: npm run dev
echo.
