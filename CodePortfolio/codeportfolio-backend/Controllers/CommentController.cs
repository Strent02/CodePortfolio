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
    public class CommentController : ControllerBase
    {
        private readonly ICommentRepository      _commentRepo;
        private readonly IProjectRepository      _projectRepo;
        private readonly IUserRepository         _userRepo;
        private readonly INotificationRepository _notifRepo;

        public CommentController(
            ICommentRepository      commentRepo,
            IProjectRepository      projectRepo,
            IUserRepository         userRepo,
            INotificationRepository notifRepo)
        {
            _commentRepo = commentRepo;
            _projectRepo = projectRepo;
            _userRepo    = userRepo;
            _notifRepo   = notifRepo;
        }

        // GET api/comment/project/{projectId}
        [AllowAnonymous]
        [HttpGet("project/{projectId:guid}")]
        public async Task<IActionResult> GetByProject(Guid projectId)
        {
            var comments = await _commentRepo.GetCommentsByProject(projectId);
            var result   = new List<CommentResponseDto>();
            foreach (var c in comments)
            {
                var author = await _userRepo.GetUser(c.UserId);
                result.Add(new CommentResponseDto
                {
                    CommentId   = c.CommentId,
                    UserId      = c.UserId,
                    AuthorName  = author?.FullName ?? "Unknown",
                    Content     = c.Content,
                    CommentDate = c.CommentDate
                });
            }
            return Ok(result);
        }

        // POST api/comment/project/{projectId}
        [Authorize]
        [HttpPost("project/{projectId:guid}")]
        public async Task<IActionResult> CreateComment(Guid projectId, [FromBody] CreateCommentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId  = ClaimsHelper.GetUserId(User);
            var project = await _projectRepo.GetProject(projectId);
            if (project == null) return NotFound("Project not found.");

            var comment = new Comment
            {
                CommentId   = Guid.NewGuid(),
                UserId      = userId,
                ProjectId   = projectId,
                Content     = dto.Content,
                CommentDate = DateTime.UtcNow
            };

            if (!await _commentRepo.CreateComment(comment))
                return BadRequest("Could not create comment.");

            // Notificación al dueño del proyecto
            if (project.UserId != userId)
            {
                var commenter = await _userRepo.GetUser(userId);
                await _notifRepo.CreateNotification(new Notification
                {
                    NotificationId = Guid.NewGuid(),
                    UserId         = project.UserId,
                    Message        = $"{commenter?.FullName ?? "Someone"} commented on your project '{project.Title}'.",
                    SentDate       = DateTime.UtcNow
                });
            }

            var author = await _userRepo.GetUser(userId);
            // Bug #3 fix: CommentController no tiene GetComment, usar Ok() en lugar de CreatedAtAction(null,...)
            return Ok(new CommentResponseDto
            {
                CommentId   = comment.CommentId,
                UserId      = comment.UserId,
                AuthorName  = author?.FullName ?? "Unknown",
                Content     = comment.Content,
                CommentDate = comment.CommentDate
            });
        }

        // DELETE api/comment/{id}  — autor o admin
        [Authorize]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteComment(Guid id)
        {
            var userId  = ClaimsHelper.GetUserId(User);
            var comment = await _commentRepo.GetComment(id);
            if (comment == null) return NotFound("Comment not found.");
            if (comment.UserId != userId && !ClaimsHelper.IsAdmin(User)) return Forbid();

            if (!await _commentRepo.DeleteComment(id))
                return BadRequest("Could not delete comment.");

            return Ok("Comment deleted.");
        }
    }
}
