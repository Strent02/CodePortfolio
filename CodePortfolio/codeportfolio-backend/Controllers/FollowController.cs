using CodePortfolio.Helpers;
using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodePortfolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FollowController : ControllerBase
    {
        private readonly IFollowRepository _followRepo;
        private readonly IUserRepository   _userRepo;

        public FollowController(IFollowRepository followRepo, IUserRepository userRepo)
        {
            _followRepo = followRepo;
            _userRepo   = userRepo;
        }

        // POST api/follow/{targetUserId}
        [HttpPost("{targetUserId:guid}")]
        public async Task<IActionResult> Follow(Guid targetUserId)
        {
            var userId = ClaimsHelper.GetUserId(User);
            if (userId == targetUserId) return BadRequest("You cannot follow yourself.");

            var target = await _userRepo.GetUser(targetUserId);
            if (target == null) return NotFound("User not found.");

            var existing = await _followRepo.GetFollowByUsers(userId, targetUserId);
            // Idempotente: si ya sigue, devolver 200 con el conteo actual en lugar de 409
            if (existing != null)
                return Ok(new { followersCount = await _followRepo.GetFollowersCount(targetUserId) });

            var follow = new Follow
            {
                FollowId       = Guid.NewGuid(),
                UserId         = userId,
                FollowedUserId = targetUserId,
                FollowDate     = DateTime.UtcNow
            };

            if (!await _followRepo.CreateFollow(follow))
                return BadRequest("Could not follow user.");

            return Ok(new { followersCount = await _followRepo.GetFollowersCount(targetUserId) });
        }

        // DELETE api/follow/{targetUserId}
        [HttpDelete("{targetUserId:guid}")]
        public async Task<IActionResult> Unfollow(Guid targetUserId)
        {
            var userId   = ClaimsHelper.GetUserId(User);
            var existing = await _followRepo.GetFollowByUsers(userId, targetUserId);
            if (existing == null) return NotFound("You are not following this user.");

            await _followRepo.DeleteFollow(existing.FollowId);
            return Ok(new { followersCount = await _followRepo.GetFollowersCount(targetUserId) });
        }

        // GET api/follow/{userId}/followers
        [AllowAnonymous]
        [HttpGet("{userId:guid}/followers")]
        public async Task<IActionResult> GetFollowers(Guid userId)
        {
            var follows = await _followRepo.GetFollowers(userId);
            var result  = new List<object>();
            foreach (var f in follows)
            {
                var u = await _userRepo.GetUser(f.UserId);
                if (u != null) result.Add(new { u.UserId, u.FullName, u.ProfilePicture });
            }
            return Ok(result);
        }

        // GET api/follow/{userId}/following
        [AllowAnonymous]
        [HttpGet("{userId:guid}/following")]
        public async Task<IActionResult> GetFollowing(Guid userId)
        {
            var follows = await _followRepo.GetFollowing(userId);
            var result  = new List<object>();
            // Bug #8 fix: filtrar registros con FollowedUserId null antes de acceder al valor
            foreach (var f in follows.Where(f => f.FollowedUserId.HasValue))
            {
                var u = await _userRepo.GetUser(f.FollowedUserId!.Value);
                if (u != null) result.Add(new { u.UserId, u.FullName, u.ProfilePicture });
            }
            return Ok(result);
        }
    }
}
