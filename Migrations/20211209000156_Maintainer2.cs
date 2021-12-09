using Microsoft.EntityFrameworkCore.Migrations;

namespace OpenWiki.Migrations
{
    public partial class Maintainer2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateTable(
                name: "Maintenence",
                columns: table => new
                {
                    MaintainedWikisID = table.Column<long>(type: "bigint", nullable: false),
                    MaintainersId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Maintenence", x => new { x.MaintainedWikisID, x.MaintainersId });
                    table.ForeignKey(
                        name: "FK_Maintenence_AspNetUsers_MaintainersId",
                        column: x => x.MaintainersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Maintenence_Wikis_MaintainedWikisID",
                        column: x => x.MaintainedWikisID,
                        principalTable: "Wikis",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Maintenence_MaintainersId",
                table: "Maintenence",
                column: "MaintainersId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Maintenence");

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
    }
}
