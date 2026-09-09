using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodePortfolio.Migrations
{
    /// <inheritdoc />
    public partial class CascadeDeleteDependientes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "Comment_project_id_fkey",
                table: "Comment");

            migrationBuilder.DropForeignKey(
                name: "Follow_followed_user_id_fkey",
                table: "Follow");

            migrationBuilder.DropForeignKey(
                name: "Reaction_project_id_fkey",
                table: "Reaction");

            migrationBuilder.AddForeignKey(
                name: "Comment_project_id_fkey",
                table: "Comment",
                column: "project_id",
                principalTable: "Project",
                principalColumn: "project_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "Follow_followed_user_id_fkey",
                table: "Follow",
                column: "followed_user_id",
                principalTable: "User",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "Reaction_project_id_fkey",
                table: "Reaction",
                column: "project_id",
                principalTable: "Project",
                principalColumn: "project_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "Comment_project_id_fkey",
                table: "Comment");

            migrationBuilder.DropForeignKey(
                name: "Follow_followed_user_id_fkey",
                table: "Follow");

            migrationBuilder.DropForeignKey(
                name: "Reaction_project_id_fkey",
                table: "Reaction");

            migrationBuilder.AddForeignKey(
                name: "Comment_project_id_fkey",
                table: "Comment",
                column: "project_id",
                principalTable: "Project",
                principalColumn: "project_id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "Follow_followed_user_id_fkey",
                table: "Follow",
                column: "followed_user_id",
                principalTable: "User",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "Reaction_project_id_fkey",
                table: "Reaction",
                column: "project_id",
                principalTable: "Project",
                principalColumn: "project_id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
