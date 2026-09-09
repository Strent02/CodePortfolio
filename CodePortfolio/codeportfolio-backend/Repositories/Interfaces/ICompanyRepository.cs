using CodePortfolio.Models;

namespace CodePortfolio.Repositories.Interfaces
{
    public interface ICompanyRepository
    {
        Task<List<Company>> GetCompanies();
        Task<Company?> GetCompany(Guid companyId);
        Task<bool> CreateCompany(Company company);
        Task<bool> UpdateCompany(Company company);
        Task<bool> DeleteCompany(Guid companyId);
    }
}
