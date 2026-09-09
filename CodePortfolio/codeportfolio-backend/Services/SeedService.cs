using CodePortfolio.Context;
using CodePortfolio.Models;
using Microsoft.EntityFrameworkCore;

namespace CodePortfolio.Services
{
    public static class SeedService
    {
        public static async Task InitializeDatabaseAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<CodePortfolioContext>();
            await db.Database.MigrateAsync();

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

            var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
            var adminEmail = config["BootstrapAdmin:Email"]?.Trim().ToLowerInvariant();
            var adminPassword = config["BootstrapAdmin:Password"];
            if (!string.IsNullOrWhiteSpace(adminEmail) && !string.IsNullOrWhiteSpace(adminPassword))
            {
                if (adminPassword.Length < 12)
                    throw new InvalidOperationException("Bootstrap admin password must contain at least 12 characters.");
                var adminRole = await db.Roles.SingleAsync(r => r.Name == "Admin");
                if (!await db.Users.AnyAsync(u => u.Email == adminEmail))
                {
                    db.Users.Add(new User
                    {
                        UserId = Guid.NewGuid(), RoleId = adminRole.RoleId,
                        FullName = "Administrator", Email = adminEmail,
                        Password = BCrypt.Net.BCrypt.HashPassword(adminPassword),
                        RegistrationDate = DateTime.UtcNow
                    });
                    await db.SaveChangesAsync();
                }
            }
        }
    }
}
