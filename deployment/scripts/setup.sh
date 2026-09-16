#!/usr/bin/env bash
# ============================================
# Mente Libre — Setup Script (Linux/macOS)
# ============================================
# Run this script to set up the development environment.
# Usage: chmod +x deployment/scripts/setup.sh && ./deployment/scripts/setup.sh
# ============================================

set -e

echo ""
echo "  =========================================="
echo "   🦉 Mente Libre — Development Setup"
echo "  =========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no encontrado. Instala Node.js 18+ desde https://nodejs.org${NC}"
    exit 1
fi
NODE_VER=$(node -v)
echo -e "${GREEN}✅ Node.js encontrado: ${NODE_VER}${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm no encontrado.${NC}"
    exit 1
fi
NPM_VER=$(npm -v)
echo -e "${GREEN}✅ npm encontrado: v${NPM_VER}${NC}"
echo ""

# Install dependencies
echo "📦 Instalando dependencias..."
npm install
echo -e "${GREEN}✅ Dependencias instaladas${NC}"
echo ""

# Copy env file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creando .env.local desde .env.example..."
    cp .env.example .env.local
    echo -e "${YELLOW}⚠️  Edita .env.local con tus credenciales de Supabase y Gemini${NC}"
else
    echo -e "${GREEN}✅ .env.local ya existe${NC}"
fi
echo ""

# Verify build
echo "🔨 Verificando build..."
npm run build
echo -e "${GREEN}✅ Build exitoso${NC}"
echo ""

echo "  =========================================="
echo -e "   ${GREEN}✅ Setup completado!${NC}"
echo "  =========================================="
echo ""
echo "   Comandos disponibles:"
echo "     npm run dev     → Servidor de desarrollo"
echo "     npm run build   → Build de producción"
echo "     npm run lint    → Linter"
echo ""
echo "   Para iniciar: npm run dev"
echo ""
