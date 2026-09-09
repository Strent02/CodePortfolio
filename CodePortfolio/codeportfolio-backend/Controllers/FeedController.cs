using CodePortfolio.Helpers;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodePortfolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedController : ControllerBase
    {
        private readonly IProjectRepository  _projectRepo;
        private readonly IUserRepository     _userRepo;
        private readonly IReactionRepository _reactionRepo;
        private readonly ICommentRepository  _commentRepo;

        public FeedController(
            IProjectRepository  projectRepo,
            IUserRepository     userRepo,
            IReactionRepository reactionRepo,
            ICommentRepository  commentRepo)
        {
            _projectRepo  = projectRepo;
            _userRepo     = userRepo;
            _reactionRepo = reactionRepo;
            _commentRepo  = commentRepo;
        }

        // GET api/feed?page=1&size=10  — feed público general
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetFeed([FromQuery] int page = 1, [FromQuery] int size = 10)
        {
            if (page < 1 || size is < 1 or > 50) return BadRequest("Page must be >= 1 and size between 1 and 50.");
            var skip     = (page - 1) * size;
            var projects = await _projectRepo.GetFeed(skip, size);
            return Ok(await Enrich(projects));
        }

        // GET api/feed/following?page=1&size=10  — feed basado en usuarios seguidos
        [Authorize]
        [HttpGet("following")]
        public async Task<IActionResult> GetFollowingFeed([FromQuery] int page = 1, [FromQuery] int size = 10)
        {
            if (page < 1 || size is < 1 or > 50) return BadRequest("Page must be >= 1 and size between 1 and 50.");
            var userId   = ClaimsHelper.GetUserId(User);
            var skip     = (page - 1) * size;
            var projects = await _projectRepo.GetFeedForUser(userId, skip, size);
            return Ok(await Enrich(projects));
        }

        private async Task<List<object>> Enrich(List<CodePortfolio.Models.Project> projects)
        {
            var projectIds = projects.Select(p => p.ProjectId).ToArray();
            var authors = (await _userRepo.GetUsersByIds(projects.Select(p => p.UserId))).ToDictionary(u => u.UserId);
            var likeCounts = await _reactionRepo.GetLikesCounts(projectIds);
            var commentCounts = await _commentRepo.GetCommentsCounts(projectIds);
            var result = new List<object>();
            foreach (var p in projects)
            {
                authors.TryGetValue(p.UserId, out var author);
                result.Add(new
                {
                    p.ProjectId, p.Title, p.Description, p.FeaturedImage,
                    p.PublishDate, p.DemoUrl, p.RepositoryUrl, p.Status,
                    // authorName plano para compatibilidad con el frontend (ProjectCard usa project.authorName)
                    authorName    = author?.FullName ?? "Unknown",
                    author        = new { author?.UserId, author?.FullName, author?.ProfilePicture },
                    likes = likeCounts.GetValueOrDefault(p.ProjectId),
                    commentsCount = commentCounts.GetValueOrDefault(p.ProjectId)
                });
            }
            return result;
        }
    }
}
