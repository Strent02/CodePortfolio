# ── Etapa de build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Instalar dependencias (capa cacheada)
COPY package*.json ./
RUN npm ci

# Copiar fuentes y compilar
COPY . .
RUN npm run build

# ── Etapa de runtime (Nginx sirve los estáticos) ──────────────────────────────
FROM nginx:alpine AS runtime

# Configuración de Nginx con proxy hacia el backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el build de Vite
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
