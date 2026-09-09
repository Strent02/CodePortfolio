using CodePortfolio.Models;

namespace CodePortfolio.Repositories.Interfaces
{
    public interface IReactionRepository
    {
        Task<List<Reaction>> GetReactions();
        Task<Reaction?> GetReaction(Guid reactionId);
        Task<Reaction?> GetReactionByUserAndProject(Guid userId, Guid projectId);
        Task<int> GetLikesCount(Guid projectId);
        Task<List<Guid>> GetLikedProjectIds(Guid userId);  // para GET /api/user/me/likes
        Task<bool> CreateReaction(Reaction reaction);
        Task<bool> UpdateReaction(Reaction reaction);
        Task<bool> DeleteReaction(Guid reactionId);
    }
}
