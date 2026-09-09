# CodePortfolio — Backend

API REST en ASP.NET Core 8 con SQL Server.

---

## Opción A — Con Docker (recomendado)

**Requisito:** tener Docker Desktop instalado.

```bash
docker compose up --build
```

Eso levanta SQL Server + el backend automáticamente.  
La base de datos se crea sola gracias a EF Core Migrations.

| Recurso   | URL                           |
|-----------|-------------------------------|
| API       | http://localhost:5102         |
| Swagger   | http://localhost:5102/swagger |
| SQL Server| localhost,1433  •  usuario: sa  •  pass: CodePortfolio_SA_2025! |

---

## Opción B — En local (sin Docker)

**Requisitos:** .NET 8 SDK + SQL Server local.

1. Edita `appsettings.json` y pon el nombre de tu servidor en `ConnectionStrings`:

```json
"CodePortfolioConnection": "Server=TU_SERVIDOR;Database=CodePortfolioDB;Trusted_Connection=True;TrustServerCertificate=True;"
```

2. Crea la base de datos con migraciones:

```bash
dotnet ef database update
```

3. Corre el proyecto:

```bash
dotnet run
```

---

## Primer uso (cualquier opción)

El rol `User` se crea automáticamente al arrancar.  
Solo regístrate y empieza a usar la API:

1. `POST /api/auth/register` — crear cuenta
2. `POST /api/auth/login` — obtener token JWT
3. Pega el token en **Authorize** (Swagger) para usar los endpoints protegidos

---

## Detener Docker

```bash
# Detener sin borrar datos
docker compose down

# Detener y borrar base de datos
docker compose down -v
```
