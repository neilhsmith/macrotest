using MacroTest.Api.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Macrotest.Api.Features.Brands;

public static class GetBrandSummary {
  public sealed record Query(int Id) : IRequest<BrandSummaryDto>;

  public class Handler : IRequestHandler<Query, BrandSummaryDto> {
    private readonly AppDbContext _dbContext;

    public Handler(AppDbContext dbContext) {
      _dbContext = dbContext;
    }

    public async Task<BrandSummaryDto> Handle(Query request, CancellationToken cancellationToken) {
      var brand = await _dbContext.Brands
        .Include(b => b.Foods)
        .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

      return new BrandSummaryDto {
        Id = brand.Id,
        CreatedAt = brand.CreatedAt,
        Name = brand.Name,
        FoodCount = brand.Foods.Count
      };
    }
  }
}
