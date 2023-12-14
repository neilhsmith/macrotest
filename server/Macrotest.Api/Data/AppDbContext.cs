using Macrotest.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MacroTest.Api.Data;

public sealed class AppDbContext : DbContext
{
  public DbSet<FoodItem> FoodItems { get; set; }
  public DbSet<QuickAdd> QuickAdds { get; set; }
  public DbSet<TrackedThing> TrackedThings { get; set; }

  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
  { }
}