using CodePortfolio.Models;

namespace CodePortfolio.Repositories.Interfaces
{
    public interface ICommentRepository
    {
        Task<List<Comment>> GetComments();
        Task<List<Comment>> GetCommentsByProject(Guid projectId);
        Task<Comment?> GetComment(Guid commentId);
        Task<int> GetCommentsCount(Guid projectId);
        Task<bool> CreateComment(Comment comment);
        Task<bool> UpdateComment(Comment comment);
        Task<bool> DeleteComment(Guid commentId);
    }
}
