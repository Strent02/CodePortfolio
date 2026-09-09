using CodePortfolio.Context;
using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CodePortfolio.Repositories
{
    public class JobOpeningRepository : IJobOpeningRepository
    {
        private readonly CodePortfolioContext _context;
        public JobOpeningRepository(CodePortfolioContext context) => _context = context;

        public async Task<List<JobOpening>> GetJobOpenings()
            => await _context.JobOpenings.OrderByDescending(j => j.PublishDate).ToListAsync();

        public async Task<List<JobOpening>> Search(string query)
            => await _context.JobOpenings
                .Where(j => j.Title.Contains(query) || (j.Description != null && j.Description.Contains(query)))
                .OrderByDescending(j => j.PublishDate)
                .ToListAsync();

        public async Task<JobOpening?> GetJobOpening(Guid id)
            => await _context.JobOpenings.FirstOrDefaultAsync(j => j.JobOpeningId == id);

        public async Task<bool> CreateJobOpening(JobOpening j)
        {
            _context.JobOpenings.Add(j);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateJobOpening(JobOpening j)
        {
            _context.JobOpenings.Update(j);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteJobOpening(Guid id)
        {
            var j = await GetJobOpening(id);
            if (j == null) return false;
            _context.JobOpenings.Remove(j);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
