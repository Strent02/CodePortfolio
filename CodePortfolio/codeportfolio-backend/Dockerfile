# ── Etapa de build ────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar .csproj y restaurar (capa cacheada)
COPY *.csproj ./
RUN dotnet restore

# Compilar en Release
COPY . .
RUN dotnet publish -c Release -o /app/publish --no-restore

# ── Etapa de runtime ──────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Carpetas para imágenes subidas
RUN mkdir -p wwwroot/images/projects wwwroot/images/avatars

COPY --from=build /app/publish .

EXPOSE 5102

ENV ASPNETCORE_URLS=http://+:5102

# Render asigna el puerto en la variable PORT. El valor por defecto conserva el
# comportamiento de Docker Compose para desarrollo local.
ENTRYPOINT ["sh", "-c", "dotnet CodePortfolio.dll --urls http://0.0.0.0:${PORT:-5102}"]
