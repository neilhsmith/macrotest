using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Macrotest.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FoodItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StandardServingSize = table.Column<int>(type: "int", nullable: false),
                    Calories = table.Column<int>(type: "int", nullable: false),
                    Protein = table.Column<int>(type: "int", nullable: false),
                    Carbs = table.Column<int>(type: "int", nullable: false),
                    Fat = table.Column<int>(type: "int", nullable: false),
                    SaturatedFat = table.Column<int>(type: "int", nullable: true),
                    UnsaturatedFat = table.Column<int>(type: "int", nullable: true),
                    Fiber = table.Column<int>(type: "int", nullable: true),
                    Sugars = table.Column<int>(type: "int", nullable: true),
                    Sodium = table.Column<int>(type: "int", nullable: true),
                    Cholesterol = table.Column<int>(type: "int", nullable: true),
                    Potassium = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FoodItems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "QuickAdds",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Calories = table.Column<int>(type: "int", nullable: false),
                    Protein = table.Column<int>(type: "int", nullable: false),
                    Carbs = table.Column<int>(type: "int", nullable: false),
                    Fat = table.Column<int>(type: "int", nullable: false),
                    SaturatedFat = table.Column<int>(type: "int", nullable: true),
                    UnsaturatedFat = table.Column<int>(type: "int", nullable: true),
                    Fiber = table.Column<int>(type: "int", nullable: true),
                    Sugars = table.Column<int>(type: "int", nullable: true),
                    Sodium = table.Column<int>(type: "int", nullable: true),
                    Cholesterol = table.Column<int>(type: "int", nullable: true),
                    Potassium = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuickAdds", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TrackedThings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedOn = table.Column<DateOnly>(type: "date", nullable: false),
                    ServingSize = table.Column<int>(type: "int", nullable: false),
                    FoodItemId = table.Column<int>(type: "int", nullable: true),
                    QuickAddId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrackedThings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrackedThings_FoodItems_FoodItemId",
                        column: x => x.FoodItemId,
                        principalTable: "FoodItems",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_TrackedThings_QuickAdds_QuickAddId",
                        column: x => x.QuickAddId,
                        principalTable: "QuickAdds",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_TrackedThings_FoodItemId",
                table: "TrackedThings",
                column: "FoodItemId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackedThings_QuickAddId",
                table: "TrackedThings",
                column: "QuickAddId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TrackedThings");

            migrationBuilder.DropTable(
                name: "FoodItems");

            migrationBuilder.DropTable(
                name: "QuickAdds");
        }
    }
}
