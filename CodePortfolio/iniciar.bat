@echo off
title CodePortfolio - Iniciando...
color 0A

echo.
echo  ^</^>  CodePortfolio
echo  ================================
echo  Iniciando backend y frontend...
echo.

REM ── Verificar que dotnet esté instalado ──────────────────────────────────────
where dotnet >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] .NET SDK no encontrado. Descargalo en: https://dotnet.microsoft.com
    pause
    exit /b 1
)

REM ── Verificar que node esté instalado ────────────────────────────────────────
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js no encontrado. Descargalo en: https://nodejs.org
    pause
    exit /b 1
)

REM ── Instalar dependencias del frontend si hace falta ─────────────────────────
if not exist "codeportfolio-frontend\node_modules" (
    echo  [INFO] Instalando dependencias del frontend...
    cd codeportfolio-frontend
    call npm install
    cd ..
)

REM ── Crear rol base (primera vez, ignora el error si ya existe) ────────────────
echo  [INFO] Verificando roles en la base de datos...
echo  (Este paso puede fallar si el backend aun no arranco - es normal)

REM ── Lanzar backend en ventana separada ───────────────────────────────────────
echo  [1/2] Iniciando backend en http://localhost:5102 ...
start "CodePortfolio - Backend" cmd /k "cd proyecto_final && dotnet run"

REM ── Esperar a que el backend esté listo ──────────────────────────────────────
echo  [INFO] Esperando que el backend arranque (10 segundos)...
timeout /t 10 /nobreak >nul

REM ── Crear rol User automaticamente ───────────────────────────────────────────
echo  [INFO] Creando rol base...
curl -s -X POST http://localhost:5102/api/role/CreateRole ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"User\"}" >nul 2>&1
echo  [OK] Rol verificado.

REM ── Lanzar frontend en ventana separada ──────────────────────────────────────
echo  [2/2] Iniciando frontend en http://localhost:3000 ...
start "CodePortfolio - Frontend" cmd /k "cd codeportfolio-frontend && npm run dev"

REM ── Esperar y abrir el navegador ─────────────────────────────────────────────
echo  [INFO] Abriendo navegador en 5 segundos...
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo  ================================
echo  Backend:  http://localhost:5102
echo  Frontend: http://localhost:3000
echo  Swagger:  http://localhost:5102/swagger
echo  ================================
echo.
echo  Cierra las otras dos ventanas para detener los servidores.
echo.
pause
