using CodePortfolio.Context;
using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CodePortfolio.Repositories
{
    public class ApplicationRepository : IApplicationRepository
    {
        private readonly CodePortfolioContext _context;
        public ApplicationRepository(CodePortfolioContext context) => _context = context;

        public async Task<List<Application>> GetApplications() => await _context.Applications.ToListAsync();

        public async Task<List<Application>> GetApplicationsByJobOpening(Guid jobOpeningId)
            => await _context.Applications.Where(a => a.JobOpeningId == jobOpeningId).ToListAsync();

        public async Task<List<Application>> GetApplicationsByUser(Guid userId)
            => await _context.Applications.Where(a => a.UserId == userId).ToListAsync();

        public async Task<Application?> GetApplication(Guid id)
            => await _context.Applications.FirstOrDefaultAsync(a => a.ApplicationId == id);

        public async Task<bool> CreateApplication(Application application)
        {
            var exists = await _context.Applications.AnyAsync(a =>
                a.UserId == application.UserId && a.JobOpeningId == application.JobOpeningId);
            if (exists) return false;
            _context.Applications.Add(application);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateApplication(Application application)
        {
            _context.Applications.Update(application);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ChangeStatus(Guid applicationId, string status)
        {
            var a = await GetApplication(applicationId);
            if (a == null) return false;
            a.Status = status;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteApplication(Guid id)
        {
            var a = await GetApplication(id);
            if (a == null) return false;
            _context.Applications.Remove(a);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
