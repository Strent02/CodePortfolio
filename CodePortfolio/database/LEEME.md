# Base de datos

Cuatro ficheros, según lo que necesites:

| Fichero | Qué contiene | Cuándo usarlo |
|---|---|---|
| `esquema.sql` | Solo la estructura (tablas, índices, restricciones) | Para partir de una base vacía |
| `datos-demo.sql` | Estructura + datos de demostración limpios | **Recomendado**: para ver la aplicación funcionando |
| `volcado-completo.sql` | Estructura + todos los datos de las pruebas | Solo si quieres el estado exacto en que quedó tras los ensayos |
| `init.sql` | Guion original del proyecto | Referencia histórica |

En condiciones normales no hace falta ninguno: el backend aplica sus migraciones de
Entity Framework al arrancar y crea el esquema por sí solo. Estos volcados son para
restaurar datos.

## Restaurar

```bash
createdb -O codeportfolio codeportfolio
psql -U codeportfolio -d codeportfolio -f database/datos-demo.sql
```

Con Docker:

```bash
docker compose up -d db
docker compose exec -T db psql -U codeportfolio -d codeportfolio < database/datos-demo.sql
```

## Cuentas incluidas en `datos-demo.sql`

| Correo | Contraseña | Rol |
|---|---|---|
| `ada@demo.test` | `Analitica2026` | User |
| `grace@demo.test` | `Compilador2026` | User |
| `admin@codeportfolio.test` | `AdminLocal2026Seguro` | Admin |

Los datos traen dos proyectos publicados, un borrador (para ver el estado privado),
comentarios, me gusta, seguimientos, notificaciones y dos vacantes con su empresa.

> **Estas credenciales son de desarrollo.** Son contraseñas conocidas y públicas en
> este documento: cámbialas o borra estas cuentas antes de exponer la aplicación en
> cualquier entorno real. El volcado no incluye tokens de sesión.

## Imágenes

Las fotos y portadas viven en `codeportfolio-backend/wwwroot/images/` y van incluidas
en el paquete, porque las rutas guardadas en la base apuntan ahí.
