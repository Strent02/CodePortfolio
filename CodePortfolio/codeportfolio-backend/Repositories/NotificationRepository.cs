using CodePortfolio.Context;
using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CodePortfolio.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly CodePortfolioContext _context;
        public NotificationRepository(CodePortfolioContext context) => _context = context;

        public async Task<List<Notification>> GetNotifications() => await _context.Notifications.ToListAsync();

        public async Task<List<Notification>> GetNotificationsByUser(Guid userId)
            => await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.SentDate)
                .ToListAsync();

        public async Task<Notification?> GetNotification(Guid id)
            => await _context.Notifications.FirstOrDefaultAsync(n => n.NotificationId == id);

        public async Task<bool> CreateNotification(Notification notification)
        {
            _context.Notifications.Add(notification);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> MarkAsRead(Guid id)
        {
            var n = await GetNotification(id);
            if (n == null) return false;
            n.IsRead = true;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateNotification(Notification n)
        {
            _context.Notifications.Update(n);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteNotification(Guid id)
        {
            var n = await GetNotification(id);
            if (n == null) return false;
            _context.Notifications.Remove(n);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
