using CodePortfolio.Models;

namespace CodePortfolio.Repositories.Interfaces
{
    public interface ICollaboratorRepository
    {
        Task<List<Collaborator>> GetCollaborators();
        Task<Collaborator?> GetCollaborator(Guid collaboratorId);
        Task<bool> CreateCollaborator(Collaborator collaborator);
        Task<bool> UpdateCollaborator(Collaborator collaborator);
        Task<bool> DeleteCollaborator(Guid collaboratorId);
    }
}
