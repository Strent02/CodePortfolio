#!/bin/bash

# ── Colores ───────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN} </> CodePortfolio${NC}"
echo " ================================"
echo " Iniciando backend y frontend..."
echo ""

# ── Verificar dependencias ────────────────────────────────────────────────────
if ! command -v dotnet &> /dev/null; then
    echo -e "${RED} [ERROR] .NET SDK no encontrado.${NC}"
    echo "        Descárgalo en: https://dotnet.microsoft.com"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED} [ERROR] Node.js no encontrado.${NC}"
    echo "        Descárgalo en: https://nodejs.org"
    exit 1
fi

# ── Directorio del script ─────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Instalar dependencias del frontend si hace falta ─────────────────────────
if [ ! -d "$SCRIPT_DIR/codeportfolio-frontend/node_modules" ]; then
    echo -e "${YELLOW} [INFO] Instalando dependencias del frontend...${NC}"
    cd "$SCRIPT_DIR/codeportfolio-frontend"
    npm install
    cd "$SCRIPT_DIR"
fi

# ── Función para limpiar procesos al salir ────────────────────────────────────
BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
    echo ""
    echo -e "${YELLOW} Deteniendo servidores...${NC}"
    [ -n "$BACKEND_PID"  ] && kill "$BACKEND_PID"  2>/dev/null
    [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null
    echo -e "${GREEN} ¡Hasta luego!${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# ── Lanzar backend ────────────────────────────────────────────────────────────
echo -e "${GREEN} [1/2] Iniciando backend en http://localhost:5102 ...${NC}"
cd "$SCRIPT_DIR/proyecto_final"
dotnet run &
BACKEND_PID=$!
cd "$SCRIPT_DIR"

# ── Esperar a que el backend esté listo ──────────────────────────────────────
echo -e "${YELLOW} [INFO] Esperando que el backend arranque...${NC}"
for i in {1..20}; do
    if curl -s http://localhost:5102/swagger/v1/swagger.json > /dev/null 2>&1; then
        echo -e "${GREEN} [OK] Backend listo.${NC}"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""

# ── Crear rol User automáticamente ───────────────────────────────────────────
echo -e "${YELLOW} [INFO] Creando rol base...${NC}"
curl -s -X POST http://localhost:5102/api/role/CreateRole \
  -H "Content-Type: application/json" \
  -d '{"name": "User"}' > /dev/null 2>&1
echo -e "${GREEN} [OK] Rol verificado.${NC}"

# ── Lanzar frontend ───────────────────────────────────────────────────────────
echo -e "${GREEN} [2/2] Iniciando frontend en http://localhost:3000 ...${NC}"
cd "$SCRIPT_DIR/codeportfolio-frontend"
npm run dev &
FRONTEND_PID=$!
cd "$SCRIPT_DIR"

# ── Esperar y abrir navegador ─────────────────────────────────────────────────
sleep 3

# Abrir navegador según el OS
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000 2>/dev/null &   # Linux
elif command -v open &> /dev/null; then
    open http://localhost:3000 2>/dev/null &        # Mac
fi

echo ""
echo " ================================"
echo -e "${CYAN} Backend:  http://localhost:5102${NC}"
echo -e "${CYAN} Frontend: http://localhost:3000${NC}"
echo -e "${CYAN} Swagger:  http://localhost:5102/swagger${NC}"
echo " ================================"
echo ""
echo -e "${YELLOW} Presiona Ctrl+C para detener todo.${NC}"
echo ""

# ── Mantener el script vivo hasta Ctrl+C ─────────────────────────────────────
wait $BACKEND_PID $FRONTEND_PID
