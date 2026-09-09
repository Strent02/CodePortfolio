using CodePortfolio.Models;

namespace CodePortfolio.Repositories.Interfaces
{
    public interface IJobOpeningRepository
    {
        Task<List<JobOpening>> GetJobOpenings();
        Task<List<JobOpening>> Search(string query);
        Task<JobOpening?> GetJobOpening(Guid jobOpeningId);
        Task<bool> CreateJobOpening(JobOpening jobOpening);
        Task<bool> UpdateJobOpening(JobOpening jobOpening);
        Task<bool> DeleteJobOpening(Guid jobOpeningId);
    }
}
