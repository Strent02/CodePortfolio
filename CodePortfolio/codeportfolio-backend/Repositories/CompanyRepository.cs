using CodePortfolio.Context;
using CodePortfolio.Models;
using CodePortfolio.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CodePortfolio.Repositories
{
    public class CompanyRepository : ICompanyRepository
    {
        private readonly CodePortfolioContext _context;

        public CompanyRepository(CodePortfolioContext context)
        {
            _context = context;
        }

        public async Task<List<Company>> GetCompanies()
        {
            return await _context.Companies.ToListAsync();
        }

        public async Task<Company?> GetCompany(Guid companyId)
        {
            return await _context.Companies
                .FirstOrDefaultAsync(x => x.CompanyId == companyId);
        }

        public async Task<bool> CreateCompany(Company company)
        {
            _context.Companies.Add(company);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateCompany(Company company)
        {
            _context.Companies.Update(company);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteCompany(Guid companyId)
        {
            var entity = await GetCompany(companyId);
            if (entity == null) return false;

            _context.Companies.Remove(entity);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
