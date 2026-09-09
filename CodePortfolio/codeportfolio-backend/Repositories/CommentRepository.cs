using CodePortfolio.Context;
using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CodePortfolio.Repositories
{
    public class CommentRepository : ICommentRepository
    {
        private readonly CodePortfolioContext _context;
        public CommentRepository(CodePortfolioContext context) => _context = context;

        public async Task<List<Comment>> GetComments() => await _context.Comments.ToListAsync();

        public async Task<List<Comment>> GetCommentsByProject(Guid projectId)
            => await _context.Comments
                .Where(c => c.ProjectId == projectId)
                .OrderBy(c => c.CommentDate)  // ASC: primero el más antiguo (orden natural de chat)
                .ToListAsync();

        public async Task<Comment?> GetComment(Guid id)
            => await _context.Comments.FirstOrDefaultAsync(c => c.CommentId == id);

        public async Task<int> GetCommentsCount(Guid projectId)
            => await _context.Comments.CountAsync(c => c.ProjectId == projectId);

        public async Task<bool> CreateComment(Comment comment)
        {
            _context.Comments.Add(comment);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateComment(Comment comment)
        {
            _context.Comments.Update(comment);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteComment(Guid id)
        {
            var c = await GetComment(id);
            if (c == null) return false;
            _context.Comments.Remove(c);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
