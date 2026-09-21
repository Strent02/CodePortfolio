using CodePortfolio.Context;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodePortfolio.Migrations
{
    [DbContext(typeof(CodePortfolioContext))]
    [Migration("20260910120000_EnforceReactionType")]
    public class EnforceReactionType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // El modelo siempre ha representado una reacción como un like. Se normalizan
            // posibles datos históricos antes de hacer efectiva la restricción del modelo.
            migrationBuilder.Sql("""
                UPDATE "Reaction" SET type = 'like' WHERE type IS DISTINCT FROM 'like';
                ALTER TABLE "Reaction" DROP CONSTRAINT IF EXISTS "CK_Reaction_Type";
                ALTER TABLE "Reaction" ADD CONSTRAINT "CK_Reaction_Type" CHECK (type = 'like');
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE "Reaction" DROP CONSTRAINT IF EXISTS "CK_Reaction_Type";
                """);
        }
    }
}
