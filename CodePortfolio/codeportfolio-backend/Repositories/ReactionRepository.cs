using CodePortfolio.Context;
using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CodePortfolio.Repositories
{
    public class ReactionRepository : IReactionRepository
    {
        private readonly CodePortfolioContext _context;
        public ReactionRepository(CodePortfolioContext context) => _context = context;

        public async Task<List<Reaction>> GetReactions() => await _context.Reactions.ToListAsync();

        public async Task<Reaction?> GetReaction(Guid id)
            => await _context.Reactions.FirstOrDefaultAsync(r => r.ReactionId == id);

        public async Task<Reaction?> GetReactionByUserAndProject(Guid userId, Guid projectId)
            => await _context.Reactions.FirstOrDefaultAsync(r => r.UserId == userId && r.ProjectId == projectId);

        public async Task<int> GetLikesCount(Guid projectId)
            => await _context.Reactions.CountAsync(r => r.ProjectId == projectId);

        public async Task<List<Guid>> GetLikedProjectIds(Guid userId)
            => await _context.Reactions
                .Where(r => r.UserId == userId)
                .Select(r => r.ProjectId)
                .ToListAsync();

        public async Task<bool> CreateReaction(Reaction reaction)
        {
            var exists = await _context.Reactions.AnyAsync(r => r.UserId == reaction.UserId && r.ProjectId == reaction.ProjectId);
            if (exists) return false;
            _context.Reactions.Add(reaction);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateReaction(Reaction reaction)
        {
            _context.Reactions.Update(reaction);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteReaction(Guid id)
        {
            var r = await GetReaction(id);
            if (r == null) return false;
            _context.Reactions.Remove(r);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
