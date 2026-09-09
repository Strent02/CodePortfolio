using CodePortfolio.Context;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodePortfolio.Migrations
{
    [DbContext(typeof(CodePortfolioContext))]
    [Migration("20260909000000_InitialPostgreSql")]
    public class InitialPostgreSql : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            using var stream = typeof(InitialPostgreSql).Assembly
                .GetManifestResourceStream("CodePortfolio.Database.InitSql")
                ?? throw new InvalidOperationException("Embedded PostgreSQL schema was not found.");
            using var reader = new StreamReader(stream);
            migrationBuilder.Sql(reader.ReadToEnd());
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DROP TABLE IF EXISTS "RefreshToken", "Notification", "Message", "Collaborator",
                    "Follow", "Reaction", "Comment", "Application", "JobOpening", "Project",
                    "Company", "User", "Role" CASCADE;
                """);
        }
    }
}
