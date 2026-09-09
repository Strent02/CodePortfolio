using CodePortfolio.Context;
using CodePortfolio.Models;
using Microsoft.EntityFrameworkCore;

namespace CodePortfolio.Services
{
    public static class SeedService
    {
        public static async Task SeedRolesAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<CodePortfolioContext>();

            var defaultRoles = new[] { "User", "Recruiter", "Admin" };

            foreach (var name in defaultRoles)
            {
                if (!await db.Roles.AnyAsync(r => r.Name == name))
                {
                    db.Roles.Add(new Role
                    {
                        RoleId      = Guid.NewGuid(),
                        Name        = name,
                        Description = $"Default {name} role"
                    });
                }
            }

            await db.SaveChangesAsync();
        }
    }
}
