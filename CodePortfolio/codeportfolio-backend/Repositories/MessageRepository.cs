using CodePortfolio.Context;
using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CodePortfolio.Repositories
{
    public class MessageRepository : IMessageRepository
    {
        private readonly CodePortfolioContext _context;

        public MessageRepository(CodePortfolioContext context)
        {
            _context = context;
        }

        public async Task<List<Message>> GetMessages()
        {
            return await _context.Messages.ToListAsync();
        }

        public async Task<Message?> GetMessage(Guid messageId)
        {
            return await _context.Messages
                .FirstOrDefaultAsync(x => x.MessageId == messageId);
        }

        public async Task<bool> CreateMessage(Message message)
        {
            _context.Messages.Add(message);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateMessage(Message message)
        {
            _context.Messages.Update(message);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteMessage(Guid messageId)
        {
            var entity = await GetMessage(messageId);
            if (entity == null) return false;

            _context.Messages.Remove(entity);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
