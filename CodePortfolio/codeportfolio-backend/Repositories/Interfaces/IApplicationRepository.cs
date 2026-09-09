using CodePortfolio.Models;

namespace CodePortfolio.Repositories.Interfaces
{
    public interface IApplicationRepository
    {
        Task<List<Application>> GetApplications();
        Task<List<Application>> GetApplicationsByJobOpening(Guid jobOpeningId);
        Task<List<Application>> GetApplicationsByUser(Guid userId);
        Task<Application?> GetApplication(Guid applicationId);
        Task<bool> CreateApplication(Application application);
        Task<bool> UpdateApplication(Application application);
        Task<bool> ChangeStatus(Guid applicationId, string status);
        Task<bool> DeleteApplication(Guid applicationId);
    }
}
