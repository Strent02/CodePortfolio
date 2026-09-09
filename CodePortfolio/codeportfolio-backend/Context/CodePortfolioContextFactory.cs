using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace CodePortfolio.Context
{
    public class CodePortfolioContextFactory : IDesignTimeDbContextFactory<CodePortfolioContext>
    {
        public CodePortfolioContext CreateDbContext(string[] args)
        {
            var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__CodePortfolioConnection")
                ?? "Host=localhost;Port=5432;Database=codeportfolio;Username=codeportfolio";
            var options = new DbContextOptionsBuilder<CodePortfolioContext>()
                .UseNpgsql(connectionString)
                .Options;
            return new CodePortfolioContext(options);
        }
    }
}
