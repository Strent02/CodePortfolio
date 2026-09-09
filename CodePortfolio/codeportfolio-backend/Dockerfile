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

ENTRYPOINT ["dotnet", "CodePortfolio.dll"]
