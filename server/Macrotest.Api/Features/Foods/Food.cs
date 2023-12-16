using Macrotest.Api.Features;
using Macrotest.Api.Features.Brands;

namespace Macrotest.Api.Features.Foods;

public class Food : BaseEntity {
  public required string Name { get; set; }
  
  public int? BrandId { get; set; }
  public Brand? Brand { get; set; }
}
