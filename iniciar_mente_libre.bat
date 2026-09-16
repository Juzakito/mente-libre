@echo off
echo Iniciando entorno de desarrollo de Mente Libre...
cd /d "%~dp0"
call npm run dev -- --open
pause
