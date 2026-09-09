using CodePortfolio.DTOs;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CodePortfolio.Controllers
{
    [Route("api/profile")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly IUserRepository    _userRepo;
        private readonly IProjectRepository _projectRepo;
        private readonly IFollowRepository  _followRepo;
        private readonly IReactionRepository _reactionRepo;
        private readonly ICommentRepository  _commentRepo;

        public ProfileController(
            IUserRepository     userRepo,
            IProjectRepository  projectRepo,
            IFollowRepository   followRepo,
            IReactionRepository reactionRepo,
            ICommentRepository  commentRepo)
        {
            _userRepo     = userRepo;
            _projectRepo  = projectRepo;
            _followRepo   = followRepo;
            _reactionRepo = reactionRepo;
            _commentRepo  = commentRepo;
        }

        // GET /api/profile/{userId}
        [HttpGet("{userId:guid}")]
        public async Task<IActionResult> GetProfile(Guid userId)
        {
            var user = await _userRepo.GetUser(userId);
            if (user == null) return NotFound("User not found.");

            var projects       = await _projectRepo.GetProjectsByUser(userId);
            var pubProjects    = projects.Where(p => p.Status == "published").ToList();
            var followersCount = await _followRepo.GetFollowersCount(userId);
            var followingCount = await _followRepo.GetFollowingCount(userId);

            return Ok(new UserProfileDto
            {
                UserId         = user.UserId,
                FullName       = user.FullName,
                // Email omitido del DTO por privacidad (propiedad eliminada de UserProfileDto)
                Bio            = user.Bio,
                Location       = user.Location,
                ProfilePicture = user.ProfilePicture,
                ProjectsCount  = pubProjects.Count,
                FollowersCount = followersCount,
                FollowingCount = followingCount
            });
        }

        // GET /api/profile/{userId}/projects
        [HttpGet("{userId:guid}/projects")]
        public async Task<IActionResult> GetUserProjects(Guid userId)
        {
            var user = await _userRepo.GetUser(userId);
            if (user == null) return NotFound("User not found.");

            var projects = await _projectRepo.GetProjectsByUser(userId);
            var result   = new List<ProjectResponseDto>();

            foreach (var p in projects.Where(p => p.Status == "published"))
            {
                var likes = await _reactionRepo.GetLikesCount(p.ProjectId);
                var comms = await _commentRepo.GetCommentsCount(p.ProjectId);
                result.Add(new ProjectResponseDto
                {
                    ProjectId     = p.ProjectId,
                    UserId        = p.UserId,
                    AuthorName    = user.FullName,
                    Title         = p.Title,
                    Description   = p.Description,
                    PublishDate   = p.PublishDate,
                    FeaturedImage = p.FeaturedImage,
                    DemoUrl       = p.DemoUrl,
                    RepositoryUrl = p.RepositoryUrl,
                    Status        = p.Status,
                    Likes         = likes,
                    CommentsCount = comms
                });
            }

            return Ok(result);
        }
    }
}
