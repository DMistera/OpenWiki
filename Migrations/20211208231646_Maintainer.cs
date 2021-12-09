using Microsoft.EntityFrameworkCore.Migrations;

namespace OpenWiki.Migrations
{
    public partial class Maintainer : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailConfirmationKey",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<long>(
                name: "WikiID",
                table: "AspNetUsers",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_WikiID",
                table: "AspNetUsers",
                column: "WikiID");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Wikis_WikiID",
                table: "AspNetUsers",
                column: "WikiID",
                principalTable: "Wikis",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Wikis_WikiID",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_WikiID",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "WikiID",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "EmailConfirmationKey",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
