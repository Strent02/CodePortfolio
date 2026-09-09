using CodePortfolio.Helpers;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodePortfolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationRepository _notifRepo;
        public NotificationController(INotificationRepository notifRepo) => _notifRepo = notifRepo;

        // GET api/notification
        [HttpGet]
        public async Task<IActionResult> GetMyNotifications()
        {
            var userId = ClaimsHelper.GetUserId(User);
            var notifs = await _notifRepo.GetNotificationsByUser(userId);
            return Ok(notifs);
        }

        // PUT api/notification/{id}/read
        [HttpPut("{id:guid}/read")]
        public async Task<IActionResult> MarkAsRead(Guid id)
        {
            var userId = ClaimsHelper.GetUserId(User);
            var notif  = await _notifRepo.GetNotification(id);
            if (notif == null) return NotFound("Notification not found.");
            if (notif.UserId != userId) return Forbid();

            await _notifRepo.MarkAsRead(id);
            return Ok("Notification marked as read.");
        }
    }
}
