using CodePortfolio.Context;
using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CodePortfolio.Repositories
{
    public class FollowRepository : IFollowRepository
    {
        private readonly CodePortfolioContext _context;
        public FollowRepository(CodePortfolioContext context) => _context = context;

        public async Task<List<Follow>> GetFollows() => await _context.Follows.ToListAsync();
        public async Task<Follow?> GetFollow(Guid id) => await _context.Follows.FirstOrDefaultAsync(f => f.FollowId == id);

        public async Task<Follow?> GetFollowByUsers(Guid userId, Guid followedUserId)
            => await _context.Follows.FirstOrDefaultAsync(f => f.UserId == userId && f.FollowedUserId == followedUserId);

        public async Task<List<Follow>> GetFollowers(Guid userId)
            => await _context.Follows.Where(f => f.FollowedUserId == userId).ToListAsync();

        public async Task<List<Follow>> GetFollowing(Guid userId)
            => await _context.Follows.Where(f => f.UserId == userId && f.FollowedUserId.HasValue).ToListAsync();

        public async Task<int> GetFollowersCount(Guid userId)
            => await _context.Follows.CountAsync(f => f.FollowedUserId == userId);

        public async Task<int> GetFollowingCount(Guid userId)
            => await _context.Follows.CountAsync(f => f.UserId == userId && f.FollowedUserId.HasValue);

        public async Task<bool> CreateFollow(Follow follow)
        {
            _context.Follows.Add(follow);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteFollow(Guid followId)
        {
            var f = await GetFollow(followId);
            if (f == null) return false;
            _context.Follows.Remove(f);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
