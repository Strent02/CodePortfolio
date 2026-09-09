# CodePortfolio API

API REST en ASP.NET Core 8 con PostgreSQL 16, EF Core, JWT y BCrypt.

## Inicio rápido con Docker

Desde la raíz del repositorio:

```bash
cp .env.example .env
# Sustituye todos los valores de ejemplo en .env
docker compose up --build
```

- Aplicación: <http://localhost:3000>
- API: <http://localhost:5102>
- Swagger (Development): <http://localhost:5102/swagger>
- PostgreSQL: `localhost:5432`

El backend aplica automáticamente la migración inicial y crea los roles `User`,
`Recruiter` y `Admin`. Las credenciales administrativas iniciales se toman de
`BOOTSTRAP_ADMIN_EMAIL` y `BOOTSTRAP_ADMIN_PASSWORD`; nunca se guardan en Git.

## Ejecución local

Requiere .NET 8, Node.js 20+ y una base PostgreSQL ya creada.

```bash
export ConnectionStrings__CodePortfolioConnection='Host=localhost;Port=5432;Database=codeportfolio;Username=codeportfolio;Password=...'
export Jwt__Key='una-clave-aleatoria-de-al-menos-32-bytes'
dotnet run --project codeportfolio-backend/CodePortfolio.csproj
```

En otra terminal:

```bash
cd codeportfolio-frontend
npm ci
npm run dev
```

El esquema PostgreSQL independiente está en `database/init.sql`. La misma versión
se incrusta en la migración EF inicial para mantener un único esquema de referencia.

## Seguridad

- El registro público siempre asigna el rol `User`.
- Los roles y los CRUD administrativos requieren el rol `Admin`.
- Las contraseñas se almacenan con BCrypt y nunca se incluyen en respuestas.
- Los refresh tokens se guardan en PostgreSQL únicamente como hashes SHA-256.
- Las imágenes se limitan a 5 MB y se validan por firma binaria.

Para detener Docker sin borrar datos usa `docker compose down`. Para eliminar
también el volumen local de PostgreSQL usa `docker compose down -v`.
