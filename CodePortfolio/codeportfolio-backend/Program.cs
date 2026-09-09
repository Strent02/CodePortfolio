using CodePortfolio.Context;
using CodePortfolio.Repositories;
using CodePortfolio.Repositories.Interfaces;
using CodePortfolio.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ── Database ──────────────────────────────────────────────────────────────────
builder.Services.AddDbContext<CodePortfolioContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("CodePortfolioConnection")));

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
builder.Services.AddSingleton<RefreshTokenStore>();

// ── CORS ──────────────────────────────────────────────────────────────────────
var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? new[] { "http://localhost:3000", "http://localhost:5173", "http://localhost:4200" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

// ── JWT Authentication ────────────────────────────────────────────────────────
var jwtKey = builder.Configuration["Jwt:Key"]!;
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
            ValidIssuer              = builder.Configuration["Jwt:Issuer"],
            ValidAudience            = builder.Configuration["Jwt:Audience"],
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
                      "1. `POST /api/role/CreateRole` → crear rol `{\"name\":\"User\"}`\n" +
                      "2. `POST /api/auth/register` → registrar usuario\n" +
                      "3. `POST /api/auth/login` → obtener token\n" +
                      "4. Clic en **Authorize** → pegar el token\n" +
                      "5. Usar cualquier endpoint protegido"
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
// Global 500 handler — DEBE ir primero
app.UseExceptionHandler(errApp =>
{
    errApp.Run(async ctx =>
    {
        ctx.Response.StatusCode  = 500;
        ctx.Response.ContentType = "application/json";
        await ctx.Response.WriteAsync("{\"error\":\"An unexpected server error occurred.\"}");
    });
});

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
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// ── Auto-seed roles al arrancar ──────────────────────────────────────────────
await SeedService.SeedRolesAsync(app.Services);

app.Run();
