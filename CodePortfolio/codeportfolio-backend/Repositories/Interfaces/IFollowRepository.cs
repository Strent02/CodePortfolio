using CodePortfolio.Models;

namespace CodePortfolio.Repositories.Interfaces
{
    public interface IFollowRepository
    {
        Task<List<Follow>> GetFollows();
        Task<Follow?> GetFollow(Guid followId);
        Task<Follow?> GetFollowByUsers(Guid userId, Guid followedUserId);
        Task<List<Follow>> GetFollowers(Guid userId);
        Task<List<Follow>> GetFollowing(Guid userId);
        Task<int> GetFollowersCount(Guid userId);
        Task<int> GetFollowingCount(Guid userId);
        Task<bool> CreateFollow(Follow follow);
        Task<bool> DeleteFollow(Guid followId);
    }
}
