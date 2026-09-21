using CodePortfolio.DTOs;
using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using CodePortfolio.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CodePortfolio.Controllers
{
    [Route("api/auth")]
    [ApiController]
    [EnableRateLimiting("auth")]
    [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository   _userRepo;
        private readonly IRoleRepository   _roleRepo;
        private readonly JwtService        _jwt;
        private readonly RefreshTokenStore _refreshStore;

        public AuthController(
            IUserRepository   userRepo,
            IRoleRepository   roleRepo,
            JwtService        jwt,
            RefreshTokenStore refreshStore)
        {
            _userRepo     = userRepo;
            _roleRepo     = roleRepo;
            _jwt          = jwt;
            _refreshStore = refreshStore;
        }

        // ── POST /api/auth/register ───────────────────────────────────────────
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var normalizedEmail = dto.Email.Trim().ToLowerInvariant();
            if (await _userRepo.GetUserByEmail(normalizedEmail) != null)
                return Conflict("Ya existe una cuenta con este correo.");

            var defaultRole = await _roleRepo.GetRoleByName("User");
            if (defaultRole == null)
                return StatusCode(500, "Default role 'User' is not configured.");
            var resolvedRoleId = defaultRole.RoleId;

            var user = new User
            {
                UserId           = Guid.NewGuid(),
                RoleId           = resolvedRoleId,
                FullName         = dto.FullName,
                Email            = normalizedEmail,
                Password         = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Bio              = dto.Bio,
                Location         = dto.Location,
                RegistrationDate = DateTime.UtcNow
            };

            if (!await _userRepo.CreateUser(user))
                return Conflict("Ya existe una cuenta con este correo.");

            var roleName     = (await _roleRepo.GetRole(resolvedRoleId))!.Name;
            var token        = _jwt.GenerateToken(user, roleName);
            var refreshToken = _jwt.GenerateRefreshToken();
            await _refreshStore.SaveAsync(refreshToken, user.UserId, DateTime.UtcNow.AddDays(7));

            return Ok(new { token, refreshToken, userId = user.UserId, role = roleName });
        }

        // ── POST /api/auth/login ──────────────────────────────────────────────
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _userRepo.GetUserByEmail(dto.Email.Trim().ToLowerInvariant());
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                return Unauthorized("Correo o contraseña incorrectos.");

            var role         = await _roleRepo.GetRole(user.RoleId);
            var roleName     = role?.Name ?? "User";
            var token        = _jwt.GenerateToken(user, roleName);
            var refreshToken = _jwt.GenerateRefreshToken();
            await _refreshStore.SaveAsync(refreshToken, user.UserId, DateTime.UtcNow.AddDays(7));

            return Ok(new { token, refreshToken, userId = user.UserId, role = roleName });
        }

        // ── POST /api/auth/refresh ────────────────────────────────────────────
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var entry = await _refreshStore.ConsumeAsync(dto.RefreshToken);
            if (entry == null)
                return Unauthorized("Tu sesión expiró. Vuelve a iniciar sesión.");

            var user = await _userRepo.GetUser(entry.UserId);
            if (user == null) return Unauthorized("Usuario no encontrado.");

            var role         = await _roleRepo.GetRole(user.RoleId);
            var roleName     = role?.Name ?? "User";
            var newToken     = _jwt.GenerateToken(user, roleName);
            var newRefresh   = _jwt.GenerateRefreshToken();
            await _refreshStore.SaveAsync(newRefresh, user.UserId, DateTime.UtcNow.AddDays(7));

            return Ok(new { token = newToken, refreshToken = newRefresh });
        }

        // ── POST /api/auth/logout ─────────────────────────────────────────────
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] RefreshTokenDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            await _refreshStore.RevokeAsync(dto.RefreshToken);
            return Ok("Sesión cerrada correctamente.");
        }
    }
}
