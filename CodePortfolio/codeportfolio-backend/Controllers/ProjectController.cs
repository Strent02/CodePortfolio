using CodePortfolio.DTOs;
using CodePortfolio.Helpers;
using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodePortfolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectRepository      _projectRepo;
        private readonly IUserRepository         _userRepo;
        private readonly IReactionRepository     _reactionRepo;
        private readonly ICommentRepository      _commentRepo;
        private readonly INotificationRepository _notifRepo;

        public ProjectController(
            IProjectRepository      projectRepo,
            IUserRepository         userRepo,
            IReactionRepository     reactionRepo,
            ICommentRepository      commentRepo,
            INotificationRepository notifRepo)
        {
            _projectRepo  = projectRepo;
            _userRepo     = userRepo;
            _reactionRepo = reactionRepo;
            _commentRepo  = commentRepo;
            _notifRepo    = notifRepo;
        }

        // GET api/project/public  — sin auth
        [AllowAnonymous]
        [HttpGet("public")]
        public async Task<IActionResult> GetPublicProjects()
        {
            var projects = await _projectRepo.GetPublicProjects();
            return Ok(await BuildResponseList(projects));
        }

        // GET api/project/mine  — proyectos del usuario autenticado
        [Authorize]
        [HttpGet("mine")]
        public async Task<IActionResult> MyProjects()
        {
            var userId   = ClaimsHelper.GetUserId(User);
            var projects = await _projectRepo.GetProjectsByUser(userId);
            return Ok(await BuildResponseList(projects));
        }

        // GET api/project/{id}
        [AllowAnonymous]
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetProject(Guid id)
        {
            var p = await _projectRepo.GetProject(id);
            if (p == null) return NotFound("Project not found.");
            return Ok(await BuildResponse(p));
        }

        // GET api/project/user/{userId}
        [AllowAnonymous]
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(Guid userId)
        {
            var projects = await _projectRepo.GetProjectsByUser(userId);
            var pub      = projects.Where(p => p.Status == "published").ToList();
            return Ok(await BuildResponseList(pub));
        }

        // POST api/project  — UserId desde JWT
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateProject([FromBody] CreateProjectDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId  = ClaimsHelper.GetUserId(User);
            var project = new Project
            {
                ProjectId     = Guid.NewGuid(),
                UserId        = userId,
                Title         = dto.Title,
                Description   = dto.Description,
                DemoUrl       = dto.DemoUrl,
                RepositoryUrl = dto.RepositoryUrl,
                Status        = dto.Status,
                PublishDate   = DateTime.UtcNow
            };

            if (!await _projectRepo.CreateProject(project))
                return BadRequest("Could not create project.");

            return CreatedAtAction(nameof(GetProject), new { id = project.ProjectId }, await BuildResponse(project));
        }

        // PUT api/project/{id}/image  — subida de imagen featured
        [Authorize]
        [HttpPut("{id:guid}/image")]
        public async Task<IActionResult> UploadImage(Guid id, IFormFile file)
        {
            var userId  = ClaimsHelper.GetUserId(User);
            var project = await _projectRepo.GetProject(id);
            if (project == null) return NotFound("Project not found.");
            if (project.UserId != userId) return Forbid();

            if (file == null || file.Length == 0)
                return BadRequest("No file provided.");

            var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
            var ext     = Path.GetExtension(file.FileName).ToLower();
            if (!allowed.Contains(ext))
                return BadRequest("File type not allowed. Use jpg, png, webp or gif.");

            var folder   = Path.Combine("wwwroot", "images", "projects");
            Directory.CreateDirectory(folder);
            var fileName = $"{id}{ext}";
            var filePath = Path.Combine(folder, fileName);

            using (var stream = System.IO.File.Create(filePath))
                await file.CopyToAsync(stream);

            project.FeaturedImage = $"/images/projects/{fileName}";
            await _projectRepo.UpdateProject(project);

            return Ok(new { featuredImage = project.FeaturedImage });
        }

        // PUT api/project/{id}  — solo dueño
        [Authorize]
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateProject(Guid id, [FromBody] UpdateProjectDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId  = ClaimsHelper.GetUserId(User);
            var project = await _projectRepo.GetProject(id);
            if (project == null) return NotFound("Project not found.");
            if (project.UserId != userId) return Forbid();

            project.Title         = dto.Title;
            project.Description   = dto.Description;
            project.DemoUrl       = dto.DemoUrl;
            project.RepositoryUrl = dto.RepositoryUrl;
            project.Status        = dto.Status;

            if (!await _projectRepo.UpdateProject(project))
                return BadRequest("Could not update project.");

            return Ok(await BuildResponse(project));
        }

        // DELETE api/project/{id}  — solo dueño o admin
        [Authorize]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteProject(Guid id)
        {
            var userId  = ClaimsHelper.GetUserId(User);
            var project = await _projectRepo.GetProject(id);
            if (project == null) return NotFound("Project not found.");
            if (project.UserId != userId && !ClaimsHelper.IsAdmin(User)) return Forbid();

            if (!await _projectRepo.DeleteProject(id))
                return BadRequest("Could not delete project.");

            return Ok("Project deleted.");
        }

        // POST api/project/{id}/like
        [Authorize]
        [HttpPost("{id:guid}/like")]
        public async Task<IActionResult> Like(Guid id)
        {
            var userId  = ClaimsHelper.GetUserId(User);
            var project = await _projectRepo.GetProject(id);
            if (project == null) return NotFound("Project not found.");

            var reaction = new Reaction
            {
                ReactionId   = Guid.NewGuid(),
                UserId       = userId,
                ProjectId    = id,
                Type         = "like",
                ReactionDate = DateTime.UtcNow
            };

            if (!await _reactionRepo.CreateReaction(reaction))
            {
                // Bug #7 fix: idempotente — si ya likeó, devolver el conteo actual sin error
                var currentLikes = await _reactionRepo.GetLikesCount(id);
                return Ok(new { likes = currentLikes });
            }

            // Notificación al dueño del proyecto
            if (project.UserId != userId)
            {
                var liker = await _userRepo.GetUser(userId);
                await _notifRepo.CreateNotification(new Notification
                {
                    NotificationId = Guid.NewGuid(),
                    UserId         = project.UserId,
                    Message        = $"{liker?.FullName ?? "Someone"} liked your project '{project.Title}'.",
                    SentDate       = DateTime.UtcNow
                });
            }

            var likes = await _reactionRepo.GetLikesCount(id);
            return Ok(new { likes });
        }

        // DELETE api/project/{id}/like
        [Authorize]
        [HttpDelete("{id:guid}/like")]
        public async Task<IActionResult> Unlike(Guid id)
        {
            var userId   = ClaimsHelper.GetUserId(User);
            var reaction = await _reactionRepo.GetReactionByUserAndProject(userId, id);
            if (reaction == null) return NotFound("You have not liked this project.");

            await _reactionRepo.DeleteReaction(reaction.ReactionId);
            var likes = await _reactionRepo.GetLikesCount(id);
            return Ok(new { likes });
        }

        // GET api/project/{id}/likes
        [AllowAnonymous]
        [HttpGet("{id:guid}/likes")]
        public async Task<IActionResult> GetLikes(Guid id)
        {
            var count = await _reactionRepo.GetLikesCount(id);
            return Ok(new { likes = count });
        }

        // GET api/project/search?q=...
        [AllowAnonymous]
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q)) return BadRequest("Query is required.");
            var results = await _projectRepo.Search(q);
            return Ok(await BuildResponseList(results));
        }

        // ── helpers ────────────────────────────────────────────────────────────
        private async Task<ProjectResponseDto> BuildResponse(Project p)
        {
            var author = await _userRepo.GetUser(p.UserId);
            var likes  = await _reactionRepo.GetLikesCount(p.ProjectId);
            var comms  = await _commentRepo.GetCommentsCount(p.ProjectId);
            return new ProjectResponseDto
            {
                ProjectId     = p.ProjectId,
                UserId        = p.UserId,
                AuthorName    = author?.FullName ?? "Unknown",
                Title         = p.Title,
                Description   = p.Description,
                PublishDate   = p.PublishDate,
                FeaturedImage = p.FeaturedImage,
                DemoUrl       = p.DemoUrl,
                RepositoryUrl = p.RepositoryUrl,
                Status        = p.Status,
                Likes         = likes,
                CommentsCount = comms
            };
        }

        private async Task<List<ProjectResponseDto>> BuildResponseList(List<Project> projects)
        {
            var result = new List<ProjectResponseDto>();
            foreach (var p in projects)
                result.Add(await BuildResponse(p));
            return result;
        }
    }
}
