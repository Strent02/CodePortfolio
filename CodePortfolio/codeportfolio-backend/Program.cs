using CodePortfolio.Context;
using CodePortfolio.Repositories;
using CodePortfolio.Repositories.Interfaces;
using CodePortfolio.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using System.Text;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// No revelar el servidor en las respuestas
builder.WebHost.ConfigureKestrel(options => options.AddServerHeader = false);

// Detrás del proxy (nginx) todas las peticiones llegarían con la misma IP y el
// limitador de intentos protegería a todos como si fueran uno solo. Con esto se
// recupera la IP real del cliente. ForwardLimit = 1 toma el último valor de
// X-Forwarded-For (el que añade nuestro proxy), así que un cliente no puede
// falsearlo enviando su propia cabecera.

// ── Database ──────────────────────────────────────────────────────────────────
var configuredConnectionString = builder.Configuration.GetConnectionString("CodePortfolioConnection")
    ?? throw new InvalidOperationException("ConnectionStrings:CodePortfolioConnection must be configured.");
var connectionString = NormalizePostgreSqlConnectionString(configuredConnectionString);
builder.Services.AddDbContext<CodePortfolioContext>(options => options.UseNpgsql(connectionString));

// Render expone PostgreSQL como una URL postgres://..., mientras Npgsql espera
// normalmente pares Host=...;Username=.... Aceptamos ambos formatos sin afectar
// la configuración local ni exponer la contraseña en logs.
static string NormalizePostgreSqlConnectionString(string value)
{
    if (!Uri.TryCreate(value, UriKind.Absolute, out var uri) ||
        !(uri.Scheme.Equals("postgres", StringComparison.OrdinalIgnoreCase) ||
          uri.Scheme.Equals("postgresql", StringComparison.OrdinalIgnoreCase)))
        return value;

    var credentials = uri.UserInfo.Split(':', 2);
    if (credentials.Length != 2 || string.IsNullOrWhiteSpace(uri.Host) || string.IsNullOrWhiteSpace(uri.AbsolutePath.Trim('/')))
        return value;

    return new Npgsql.NpgsqlConnectionStringBuilder
    {
        Host = uri.Host,
        Port = uri.IsDefaultPort ? 5432 : uri.Port,
        Database = Uri.UnescapeDataString(uri.AbsolutePath.Trim('/')),
        Username = Uri.UnescapeDataString(credentials[0]),
        Password = Uri.UnescapeDataString(credentials[1])
    }.ConnectionString;
}

// ── Repositories ──────────────────────────────────────────────────────────────
builder.Services.AddScoped<IUserRepository,         UserRepository>();
builder.Services.AddScoped<IRoleRepository,         RoleRepository>();
builder.Services.AddScoped<ICompanyRepository,      CompanyRepository>();
builder.Services.AddScoped<IProjectRepository,      ProjectRepository>();
builder.Services.AddScoped<IJobOpeningRepository,   JobOpeningRepository>();
builder.Services.AddScoped<IApplicationRepository,  ApplicationRepository>();
builder.Services.AddScoped<ICommentRepository,      CommentRepository>();
builder.Services.AddScoped<IReactionRepository,     ReactionRepository>();
builder.Services.AddScoped<IFollowRepository,       FollowRepository>();
builder.Services.AddScoped<ICollaboratorRepository, CollaboratorRepository>();
builder.Services.AddScoped<IMessageRepository,      MessageRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();

// ── Services ──────────────────────────────────────────────────────────────────
builder.Services.AddSingleton<JwtService>();
builder.Services.AddScoped<RefreshTokenStore>();

// ── CORS ──────────────────────────────────────────────────────────────────────
var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? new[] { "http://localhost:3000", "http://localhost:5173", "http://localhost:4200" };

// URL pública de la SPA en el despliegue gratuito de Render. Se conserva junto
// a las variables configurables porque las referencias entre servicios pueden
// resolver al hostname interno, que no coincide con el origen del navegador.
allowedOrigins = allowedOrigins
    .Append("https://codeportfolio-web-strent02.onrender.com")
    .ToArray();

// Las referencias entre servicios de Render pueden llegar como hostname, sin
// esquema. CORS requiere un origen completo.
allowedOrigins = allowedOrigins
    .Where(origin => !string.IsNullOrWhiteSpace(origin))
    .Select(origin => origin.Trim().TrimEnd('/'))
    .Select(origin => origin.StartsWith("http://", StringComparison.OrdinalIgnoreCase) ||
                      origin.StartsWith("https://", StringComparison.OrdinalIgnoreCase)
        ? origin
        : $"https://{origin}")
    .Distinct(StringComparer.OrdinalIgnoreCase)
    .ToArray();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// ── JWT Authentication ────────────────────────────────────────────────────────
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("Jwt:Key must be configured through secrets or environment variables.");
if (Encoding.UTF8.GetByteCount(jwtKey) < 32 || jwtKey.StartsWith("replace-with", StringComparison.OrdinalIgnoreCase))
    throw new InvalidOperationException("Jwt:Key must contain at least 32 bytes.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];
if (string.IsNullOrWhiteSpace(jwtIssuer) || string.IsNullOrWhiteSpace(jwtAudience))
    throw new InvalidOperationException("Jwt:Issuer and Jwt:Audience must be configured.");
if (!int.TryParse(builder.Configuration["Jwt:ExpiresInMinutes"], out var jwtMinutes) || jwtMinutes is < 1 or > 1440)
    throw new InvalidOperationException("Jwt:ExpiresInMinutes must be between 1 and 1440.");
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = jwtIssuer,
            ValidAudience            = jwtAudience,
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            RoleClaimType            = ClaimTypes.Role,
            NameClaimType            = "userId",
            ClockSkew                = TimeSpan.Zero   // token expira exacto, sin margen
        };

        // Devolver 401 con JSON en lugar de redirect
        options.Events = new JwtBearerEvents
        {
            OnChallenge = ctx =>
            {
                ctx.HandleResponse();
                ctx.Response.StatusCode  = 401;
                ctx.Response.ContentType = "application/json";
                return ctx.Response.WriteAsync("{\"error\":\"Unauthorized. Please login and include a valid Bearer token.\"}");
            },
            OnForbidden = ctx =>
            {
                ctx.Response.StatusCode  = 403;
                ctx.Response.ContentType = "application/json";
                return ctx.Response.WriteAsync("{\"error\":\"Forbidden. You do not have permission to access this resource.\"}");
            }
        };
    });

builder.Services.AddAuthorization();
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.ForwardLimit     = 1;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
    // Rango privado usado por las redes bridge de Docker. No se confía en
    // X-Forwarded-* enviado directamente desde Internet.
    options.KnownNetworks.Add(new Microsoft.AspNetCore.HttpOverrides.IPNetwork(
        System.Net.IPAddress.Parse("172.16.0.0"), 12));
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("auth", httpContext => RateLimitPartition.GetFixedWindowLimiter(
        httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 10,
            Window = TimeSpan.FromMinutes(1),
            QueueLimit = 0
        }));
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// ── Swagger con JWT ───────────────────────────────────────────────────────────
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title       = "CodePortfolio API",
        Version     = "v1",
        Description = "REST API para la plataforma CodePortfolio.\n\n" +
                      "**Flujo de uso:**\n" +
                      "1. `POST /api/auth/register` → registrar usuario\n" +
                      "2. `POST /api/auth/login` → obtener token\n" +
                      "3. Clic en **Authorize** → pegar el token\n" +
                      "4. Usar cualquier endpoint protegido"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name         = "Authorization",
        Type         = SecuritySchemeType.Http,
        Scheme       = "bearer",
        BearerFormat = "JWT",
        In           = ParameterLocation.Header,
        Description  = "Pega aquí tu JWT token (sin el prefijo 'Bearer')"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {{
        new OpenApiSecurityScheme
        {
            Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
        },
        Array.Empty<string>()
    }});
});

var app = builder.Build();

// ── Middleware pipeline ───────────────────────────────────────────────────────
app.UseForwardedHeaders();   // antes que nada: fija la IP real del cliente

// Global 500 handler
app.UseExceptionHandler(errApp =>
{
    errApp.Run(async ctx =>
    {
        ctx.Response.StatusCode  = 500;
        ctx.Response.ContentType = "application/json";
        await ctx.Response.WriteAsync("{\"error\":\"Ocurrió un error inesperado en el servidor.\"}");
    });
});

// ── Cabeceras de seguridad ────────────────────────────────────────────────────
// Se aplican también a los ficheros estáticos (imágenes subidas por usuarios).
app.Use(async (ctx, next) =>
{
    var h = ctx.Response.Headers;
    h["X-Content-Type-Options"] = "nosniff";        // no adivinar el tipo del contenido
    h["X-Frame-Options"]        = "DENY";           // no embeber en marcos
    h["Referrer-Policy"]        = "no-referrer";
    h["Permissions-Policy"]     = "camera=(), microphone=(), geolocation=()";
    // El API solo devuelve JSON e imágenes: nada de scripts ni marcos.
    h["Content-Security-Policy"] = "default-src 'none'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'none'";
    await next();
});

if (!app.Environment.IsDevelopment())
    app.UseHsts();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "CodePortfolio API v1");
        c.RoutePrefix        = "swagger";
        c.DisplayRequestDuration();
        c.EnableDeepLinking();
    });
}

app.UseStaticFiles();          // wwwroot/ para imágenes subidas
app.UseHttpsRedirection();
app.UseCors("FrontendPolicy"); // CORS ANTES de auth
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapGet("/version", () => Results.Ok(new
{
    commit = Environment.GetEnvironmentVariable("RENDER_GIT_COMMIT") ?? "development"
}));

// ── Auto-seed roles al arrancar ──────────────────────────────────────────────
await SeedService.InitializeDatabaseAsync(app.Services);

app.Run();
