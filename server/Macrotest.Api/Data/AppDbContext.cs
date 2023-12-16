using Macrotest.Api.Features;
using Macrotest.Api.Features.Brands;
using Macrotest.Api.Features.Foods;
using Microsoft.EntityFrameworkCore;

namespace MacroTest.Api.Data;

public sealed class AppDbContext : DbContext {
  public DbSet<Brand> Brands { get; set; }
  public DbSet<Food> Foods { get; set; }

  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

  protected override void OnModelCreating(ModelBuilder builder) {
    builder.Entity<Brand>()
      .HasIndex(b => b.Name)
      .IsUnique();
  }

  public override int SaveChanges() {
    UpdateAuditFields();
    return base.SaveChanges();
  }

  public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new()) {
    UpdateAuditFields();
    return await base.SaveChangesAsync(cancellationToken);
  }

  private void UpdateAuditFields() {
    var now = DateTime.UtcNow;

    foreach (var entry in ChangeTracker.Entries<BaseEntity>()) {
      switch (entry.State) {
        case EntityState.Added:
          entry.Entity.UpdateCreationProperties(now);
          break;
        case EntityState.Modified:
          entry.Entity.UpdateModifiedProperties(now);
          break;
      }
    }
  }
}
