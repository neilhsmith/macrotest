using Macrotest.Api.Features.Foods;

namespace Macrotest.Api.Features.Brands;

public class Brand : BaseEntity {
  public required string Name { get; set; }
  public ICollection<Food> Foods { get; } = new List<Food>();
}

public class BrandSummaryDto {
  public int Id { get; set; }
  public DateTime CreatedAt { get; set; }
  
  public required string Name { get; set; }
  public required int FoodCount { get; set; }
}
