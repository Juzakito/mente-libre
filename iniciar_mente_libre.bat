@echo off
title Mente Libre - Servidor Local
echo ========================================================
echo           Iniciando Entorno de Mente Libre
echo ========================================================
cd /d "%~dp0"

if not exist "node_modules" (
    echo [INFO] Detectada primera ejecucion. Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Ocurrio un problema instalando dependencias.
        pause
        exit /b %errorlevel%
    )
)

echo [INFO] Iniciando servidor Vite en modo desarrollo...
call npm run dev -- --open
pause
