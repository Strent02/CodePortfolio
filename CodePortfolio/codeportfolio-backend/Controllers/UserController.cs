using CodePortfolio.DTOs;
using CodePortfolio.Helpers;
using CodePortfolio.Repositories.Interfaces;
using CodePortfolio.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodePortfolio.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository     _userRepo;
        private readonly IReactionRepository _reactionRepo;
        private readonly RefreshTokenStore   _refreshStore;

        public UserController(IUserRepository userRepo, IReactionRepository reactionRepo, RefreshTokenStore refreshStore)
        {
            _userRepo     = userRepo;
            _reactionRepo = reactionRepo;
            _refreshStore = refreshStore;
        }

        // GET /api/user/me
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var user = await _userRepo.GetUser(ClaimsHelper.GetUserId(User));
            if (user == null) return NotFound("User not found.");
            return Ok(new { user.UserId, user.FullName, user.Email, user.Bio, user.Location, user.ProfilePicture, user.RegistrationDate });
        }

        // PUT /api/user/me
        [Authorize]
        [HttpPut("me")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var userId = ClaimsHelper.GetUserId(User);
            var user   = await _userRepo.GetUser(userId);
            if (user == null) return NotFound("User not found.");
            user.FullName = dto.FullName; user.Bio = dto.Bio; user.Location = dto.Location; user.ProfilePicture = dto.ProfilePicture;
            if (!await _userRepo.UpdateUser(user)) return StatusCode(500, "Could not update profile.");
            return Ok(new { user.UserId, user.FullName, user.Email, user.Bio, user.Location, user.ProfilePicture });
        }

        // PUT /api/user/me/avatar
        [Authorize]
        [HttpPut("me/avatar")]
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            var userId = ClaimsHelper.GetUserId(User);
            var user   = await _userRepo.GetUser(userId);
            if (user == null) return NotFound("User not found.");
            if (file == null || file.Length == 0) return BadRequest("No file provided.");

            var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
            var ext     = Path.GetExtension(file.FileName).ToLower();
            if (!allowed.Contains(ext)) return BadRequest("File type not allowed. Use jpg, png, webp or gif.");

            var folder = Path.Combine("wwwroot", "images", "avatars");
            Directory.CreateDirectory(folder);
            foreach (var old in Directory.GetFiles(folder, $"{userId}*")) System.IO.File.Delete(old);

            var ts       = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var fileName = $"{userId}_{ts}{ext}";
            using (var stream = System.IO.File.Create(Path.Combine(folder, fileName)))
                await file.CopyToAsync(stream);

            user.ProfilePicture = $"/images/avatars/{fileName}";
            if (!await _userRepo.UpdateUser(user)) return StatusCode(500, "Could not update profile picture.");
            return Ok(new { profilePicture = user.ProfilePicture });
        }

        // PUT /api/user/me/password
        [Authorize]
        [HttpPut("me/password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var userId = ClaimsHelper.GetUserId(User);
            var user   = await _userRepo.GetUser(userId);
            if (user == null) return NotFound("User not found.");
            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.Password)) return BadRequest("Current password is incorrect.");
            user.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            if (!await _userRepo.UpdateUser(user)) return StatusCode(500, "Could not change password.");
            return Ok("Password changed successfully.");
        }

        // DELETE /api/user/me  — el propio usuario elimina su cuenta
        [Authorize]
        [HttpDelete("me")]
        public async Task<IActionResult> DeleteMyAccount([FromBody] DeleteAccountDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var userId = ClaimsHelper.GetUserId(User);
            var user   = await _userRepo.GetUser(userId);
            if (user == null) return NotFound("User not found.");
            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password)) return BadRequest("Password is incorrect.");

            // Eliminar avatar del disco si existe
            if (!string.IsNullOrEmpty(user.ProfilePicture))
            {
                var localPath = Path.Combine("wwwroot", user.ProfilePicture.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
                if (System.IO.File.Exists(localPath)) System.IO.File.Delete(localPath);
            }

            if (!await _userRepo.DeleteUser(userId)) return StatusCode(500, "Could not delete account.");
            return Ok("Account deleted successfully.");
        }

        // GET /api/user/me/likes
        [Authorize]
        [HttpGet("me/likes")]
        public async Task<IActionResult> MyLikes()
        {
            var projectIds = await _reactionRepo.GetLikedProjectIds(ClaimsHelper.GetUserId(User));
            return Ok(projectIds);
        }

        // GET /api/user/{userId}
        [AllowAnonymous]
        [HttpGet("{userId:guid}")]
        public async Task<IActionResult> GetUser(Guid userId)
        {
            var user = await _userRepo.GetUser(userId);
            if (user == null) return NotFound("User not found.");
            return Ok(new { user.UserId, user.FullName, user.Bio, user.Location, user.ProfilePicture, user.RegistrationDate });
        }

        // GET /api/user/search?q=
        [AllowAnonymous]
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q)) return BadRequest("Query is required.");
            var users = await _userRepo.Search(q);
            return Ok(users.Select(u => new { u.UserId, u.FullName, u.Bio, u.ProfilePicture }));
        }

        // GET /api/user  — Admin only
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepo.GetUsers();
            return Ok(users.Select(u => new { u.UserId, u.FullName, u.Email, u.Bio, u.Location, u.ProfilePicture, u.RegistrationDate, u.RoleId }));
        }

        // DELETE /api/user/{userId}  — Admin only
        [Authorize(Roles = "Admin")]
        [HttpDelete("{userId:guid}")]
        public async Task<IActionResult> DeleteUser(Guid userId)
        {
            if (!await _userRepo.DeleteUser(userId)) return NotFound("User not found.");
            return Ok("User deleted.");
        }
    }
}
