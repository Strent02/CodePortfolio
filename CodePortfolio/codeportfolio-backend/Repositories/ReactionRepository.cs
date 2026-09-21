using CodePortfolio.Context;
using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Npgsql;

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

        public async Task<Dictionary<Guid, int>> GetLikesCounts(IEnumerable<Guid> projectIds)
        {
            var ids = projectIds.Distinct().ToArray();
            return await _context.Reactions.Where(r => ids.Contains(r.ProjectId))
                .GroupBy(r => r.ProjectId)
                .Select(g => new { ProjectId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.ProjectId, x => x.Count);
        }

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
            try
            {
                return await _context.SaveChangesAsync() > 0;
            }
            catch (DbUpdateException ex) when (ex.InnerException is PostgresException
                { SqlState: PostgresErrorCodes.UniqueViolation })
            {
                _context.Entry(reaction).State = EntityState.Detached;
                return false;
            }
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
