using CodePortfolio.DTOs;
using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using CodePortfolio.Services;
using Microsoft.AspNetCore.Mvc;

namespace CodePortfolio.Controllers
{
    [Route("api/auth")]
    [ApiController]
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

            if (await _userRepo.GetUserByEmail(dto.Email) != null)
                return Conflict("An account with this email already exists.");

            Guid resolvedRoleId;
            if (dto.RoleId.HasValue)
            {
                var role = await _roleRepo.GetRole(dto.RoleId.Value);
                if (role == null)
                    return BadRequest($"Role '{dto.RoleId}' does not exist. Call GET /api/role/GetRoles.");
                resolvedRoleId = dto.RoleId.Value;
            }
            else
            {
                var def = await _roleRepo.GetRoleByName("User");
                if (def == null)
                    return StatusCode(500, "Default role 'User' not found. Create it first: POST /api/role/CreateRole.");
                resolvedRoleId = def.RoleId;
            }

            var user = new User
            {
                UserId           = Guid.NewGuid(),
                RoleId           = resolvedRoleId,
                FullName         = dto.FullName,
                Email            = dto.Email,
                Password         = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Bio              = dto.Bio,
                Location         = dto.Location,
                RegistrationDate = DateTime.UtcNow
            };

            if (!await _userRepo.CreateUser(user))
                return StatusCode(500, "Could not register user.");

            var roleName     = (await _roleRepo.GetRole(resolvedRoleId))!.Name;
            var token        = _jwt.GenerateToken(user, roleName);
            var refreshToken = _jwt.GenerateRefreshToken();
            _refreshStore.Save(refreshToken, user.UserId, DateTime.UtcNow.AddDays(7));

            return Ok(new { token, refreshToken, userId = user.UserId, role = roleName });
        }

        // ── POST /api/auth/login ──────────────────────────────────────────────
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _userRepo.GetUserByEmail(dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                return Unauthorized("Invalid email or password.");

            var role         = await _roleRepo.GetRole(user.RoleId);
            var roleName     = role?.Name ?? "User";
            var token        = _jwt.GenerateToken(user, roleName);
            var refreshToken = _jwt.GenerateRefreshToken();
            _refreshStore.Save(refreshToken, user.UserId, DateTime.UtcNow.AddDays(7));

            return Ok(new { token, refreshToken, userId = user.UserId, role = roleName });
        }

        // ── POST /api/auth/refresh ────────────────────────────────────────────
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenDto dto)
        {
            var entry = _refreshStore.Get(dto.RefreshToken);
            if (entry == null || entry.Expiry < DateTime.UtcNow)
                return Unauthorized("Refresh token is invalid or expired. Please login again.");

            var user = await _userRepo.GetUser(entry.UserId);
            if (user == null) return Unauthorized("User not found.");

            _refreshStore.Revoke(dto.RefreshToken);

            var role         = await _roleRepo.GetRole(user.RoleId);
            var roleName     = role?.Name ?? "User";
            var newToken     = _jwt.GenerateToken(user, roleName);
            var newRefresh   = _jwt.GenerateRefreshToken();
            _refreshStore.Save(newRefresh, user.UserId, DateTime.UtcNow.AddDays(7));

            return Ok(new { token = newToken, refreshToken = newRefresh });
        }

        // ── POST /api/auth/logout ─────────────────────────────────────────────
        [HttpPost("logout")]
        public IActionResult Logout([FromBody] RefreshTokenDto dto)
        {
            _refreshStore.Revoke(dto.RefreshToken);
            return Ok("Logged out successfully.");
        }
    }
}
