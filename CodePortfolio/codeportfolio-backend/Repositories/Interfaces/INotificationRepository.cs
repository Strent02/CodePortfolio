using CodePortfolio.Models;

namespace CodePortfolio.Repositories.Interfaces
{
    public interface INotificationRepository
    {
        Task<List<Notification>> GetNotifications();
        Task<List<Notification>> GetNotificationsByUser(Guid userId);
        Task<Notification?> GetNotification(Guid notificationId);
        Task<bool> CreateNotification(Notification notification);
        Task<bool> MarkAsRead(Guid notificationId);
        Task<bool> UpdateNotification(Notification notification);
        Task<bool> DeleteNotification(Guid notificationId);
    }
}
