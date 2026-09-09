using CodePortfolio.Models;

namespace CodePortfolio.Repositories.Interfaces
{
    public interface IProjectRepository
    {
        Task<List<Project>> GetProjects();
        Task<List<Project>> GetPublicProjects();
        Task<List<Project>> GetProjectsByUser(Guid userId);
        Task<List<Project>> GetFeed(int skip, int take);
        Task<List<Project>> GetFeedForUser(Guid userId, int skip, int take);
        Task<List<Project>> Search(string query);
        Task<Project?> GetProject(Guid projectId);
        Task<bool> CreateProject(Project project);
        Task<bool> UpdateProject(Project project);
        Task<bool> DeleteProject(Guid projectId);
    }
}
