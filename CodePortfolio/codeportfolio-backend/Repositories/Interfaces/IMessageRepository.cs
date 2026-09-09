using CodePortfolio.Models;

namespace CodePortfolio.Repositories.Interfaces
{
    public interface IMessageRepository
    {
        Task<List<Message>> GetMessages();
        Task<Message?> GetMessage(Guid messageId);
        Task<bool> CreateMessage(Message message);
        Task<bool> UpdateMessage(Message message);
        Task<bool> DeleteMessage(Guid messageId);
    }
}
